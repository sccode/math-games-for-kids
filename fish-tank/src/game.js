
// =================== GAME ===================
(function(){
'use strict';
const $=id=>document.getElementById(id);
const NS='http://www.w3.org/2000/svg';
const el=(tag,attrs,parent)=>{const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e;};
const fmt=s=>String(s).replace(/\[\[(.+?)\|(.+?)\]\]/g,'<span class="frac"><span class="n">$1</span><span class="d">$2</span></span>');

// ---------- saved progress (this browser only) ----------
// Storage key stays 'fishtankmath.v1' so existing players keep their data; the data itself carries a version (v:2).
// v1 (old, no "v" field): {players:{name:{stars,points,rounds,best:{grade:stars}}},current,grade}
// v2: same, plus v:2 and a last-used "grade" for every player.
const KEY='fishtankmath.v1',VER=2,MAXP=30,MAXNAME=12,NUMCAP=999999999;
const gmax=gr=>gr<=5?3:4;
// magic cards: bought with points, used during a round (each card at most once per round)
const CARDS=[
  {id:'fifty', name:'50/50', cost:40, icon:'½', desc:'Takes away two wrong answers.'},
  {id:'skip',  name:'Skip',  cost:30, icon:'»', desc:'Skip a question with no penalty.'},
  {id:'plug',  name:'Plug',  cost:80, icon:'●', desc:'Plugs the biggest leak for 3 questions.'},
  {id:'freeze',name:'Freeze',cost:50, icon:'❄', desc:'Stops the timer for 10 seconds.'}];
const CMAX=9;
const bal=p=>Math.max(0,p.points-p.spent);
const cleanCards=r=>{const c={};CARDS.forEach(k=>{c[k.id]=cnum(r&&r[k.id],CMAX);});return c;};
const cnum=(x,max)=>{
  if(typeof x==='string'&&/^\d{1,10}$/.test(x))x=Number(x);
  if(typeof x!=='number'||!isFinite(x))return 0;
  return Math.min(Math.max(Math.floor(x),0),max===undefined?NUMCAP:max);
};
const cleanName=s=>{if(typeof s!=='string')return null;const v=s.trim(),n=[...v].length;return(n<1||n>MAXNAME||/[\u0000-\u001f\u007f]/.test(v))?null:v;};
const findName=(pl,n)=>Object.keys(pl).find(k=>k.toLowerCase()===n.toLowerCase());
function sanPlayer(r,dg){
  r=r&&typeof r==='object'?r:{};
  const p={stars:cnum(r.stars),points:cnum(r.points),rounds:cnum(r.rounds),best:{},grade:GRADES.includes(r.grade)?r.grade:dg,cards:cleanCards(r.cards)};
  p.spent=Math.min(cnum(r.spent),p.points);
  const b=r.best&&typeof r.best==='object'?r.best:{};
  Object.keys(b).forEach(k=>{const gr=Number(k);if(String(gr)===k&&GRADES.includes(gr)){const v=cnum(b[k],gmax(gr));if(v)p.best[gr]=v;}});
  return p;
}
function sanStore(raw){
  const s={v:VER,players:Object.create(null),current:null,grade:4};
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return s;
  if(GRADES.includes(raw.grade))s.grade=raw.grade;
  const pl=raw.players;
  if(pl&&typeof pl==='object'&&!Array.isArray(pl)){
    for(const k of Object.keys(pl)){
      if(Object.keys(s.players).length>=MAXP)break;
      const n=cleanName(k);if(!n||findName(s.players,n))continue;
      s.players[n]=sanPlayer(pl[k],s.grade);
    }
  }
  if(typeof raw.current==='string'){const c=findName(s.players,raw.current);if(c)s.current=c;}
  if(!s.current){const ks=Object.keys(s.players);if(ks.length)s.current=ks[0];}
  if(s.current)s.grade=s.players[s.current].grade;
  return s;
}
let persist=true;   // false when the browser will not let us store anything
function loadStore(){
  let txt=null;
  try{txt=localStorage.getItem(KEY);}catch(e){persist=false;}
  if(persist){try{localStorage.setItem(KEY+'.t','1');localStorage.removeItem(KEY+'.t');}catch(e){persist=false;}}
  if(txt){
    try{return sanStore(JSON.parse(txt));}
    catch(e){try{localStorage.setItem(KEY+'.bak',txt);}catch(_){}}   // unreadable: keep a copy instead of overwriting it
  }
  return sanStore(null);
}
let store=loadStore();
function save(){
  try{localStorage.setItem(KEY,JSON.stringify({v:VER,players:store.players,current:store.current,grade:store.grade}));persist=true;}
  catch(e){persist=false;}
  renderNotice();
}
const cur=()=>store.current?store.players[store.current]:null;
function renderNotice(){const n=$('notice');if(n)n.hidden=persist;}

// ---------- save code ----------
// FTM1-<7-char checksum>-<base64url of compact JSON>. JSON: {v:1,p:[[name,stars,points,rounds,grade,"bests"]...]}
// "bests" is one digit per grade in GRADES order (3..8), e.g. "210043".
const b64e=s=>{let b='';new TextEncoder().encode(s).forEach(c=>{b+=String.fromCharCode(c);});return btoa(b).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');};
const b64d=t=>{
  if(!/^[A-Za-z0-9_-]*$/.test(t))throw new Error('b64');
  t=t.replace(/-/g,'+').replace(/_/g,'/');while(t.length%4)t+='=';
  return new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(atob(t),c=>c.charCodeAt(0)));
};
const hash32=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}return h.toString(36).padStart(7,'0');};
function makeCode(){
  const p=Object.keys(store.players).map(n=>{const q=store.players[n];return[n,q.stars,q.points,q.rounds,q.grade,GRADES.map(gr=>q.best[gr]||0).join(''),q.spent,CARDS.map(k=>q.cards[k.id]).join('')];});
  const body=b64e(JSON.stringify({v:1,p}));
  return 'FTM1-'+hash32(body)+'-'+body;
}
const DAMAGED='That code looks damaged or cut short. Copy the whole code again, all the way to the end, and paste it here.';
function parseCode(raw){
  const t=String(raw).replace(/\s+/g,'');
  if(!t)return{err:'Paste your save code into the box first.'};
  if(t.length>20000)return{err:'That is much too long to be a save code. Paste just the code you made with "Make my save code".'};
  if(!/^FTM/i.test(t))return{err:'That does not look like a Fish Tank Math save code. Codes start with FTM1-. Copy the whole code again.'};
  if(!/^FTM1-/i.test(t))return{err:'This code is from a different version of the game, so it cannot be used here. Make a new save code from the game that made it.'};
  const m=/^([0-9a-z]{7})-([A-Za-z0-9_-]+)$/i.exec(t.slice(5));
  if(!m||hash32(m[2])!==m[1].toLowerCase())return{err:DAMAGED};
  let data;
  try{data=JSON.parse(b64d(m[2]));}catch(e){return{err:DAMAGED};}
  if(!data||typeof data!=='object'||data.v!==1||!Array.isArray(data.p))return{err:'This code is from a different version of the game, so it cannot be used here.'};
  const out=[];
  for(const e of data.p.slice(0,MAXP*2)){
    if(!Array.isArray(e))continue;
    const name=cleanName(e[0]);if(!name)continue;
    const bs=typeof e[5]==='string'?e[5]:'',best={};
    GRADES.forEach((gr,i)=>{const v=cnum(Number(bs[i]),gmax(gr));if(v)best[gr]=v;});
    const cs=typeof e[7]==='string'?e[7]:'',cards={};CARDS.forEach((k,i)=>{cards[k.id]=cnum(Number(cs[i]),CMAX);});
    const points=cnum(e[2]);
    out.push({name,stars:cnum(e[1]),points,rounds:cnum(e[3]),grade:GRADES.includes(e[4])?e[4]:4,best,spent:Math.min(cnum(e[6]),points),cards});
  }
  if(!out.length)return{err:'That code has no players in it. Check that you copied the right one.'};
  return{players:out};
}
// merge into a COPY first; only commit when done, so a problem can never lose existing data
function mergeCode(list){
  const np=Object.create(null);
  Object.keys(store.players).forEach(k=>{const p=store.players[k];np[k]={stars:p.stars,points:p.points,rounds:p.rounds,grade:p.grade,best:Object.assign({},p.best),spent:p.spent,cards:Object.assign({},p.cards)};});
  const added=[],updated=[];let skipped=0;
  list.forEach(e=>{
    const ex=findName(np,e.name);
    if(ex){
      const q=np[ex];let ch=false;
      ['stars','points','rounds','spent'].forEach(f=>{if(e[f]>q[f]){q[f]=e[f];ch=true;}});
      CARDS.forEach(k=>{if(e.cards[k.id]>q.cards[k.id]){q.cards[k.id]=e.cards[k.id];ch=true;}});
      q.spent=Math.min(q.spent,q.points);
      GRADES.forEach(gr=>{if((e.best[gr]||0)>(q.best[gr]||0)){q.best[gr]=e.best[gr];ch=true;}});
      if(ch&&!updated.includes(ex))updated.push(ex);
    }else if(Object.keys(np).length<MAXP){
      np[e.name]={stars:e.stars,points:e.points,rounds:e.rounds,grade:e.grade,best:e.best,spent:e.spent,cards:e.cards};added.push(e.name);
    }else skipped++;
  });
  store.players=np;
  if(!store.current||!np[store.current]){const ks=Object.keys(np);store.current=ks.length?ks[0]:null;}
  if(cur())store.grade=cur().grade;
  save();
  return{added,updated,skipped};
}

// ---------- tuning (checked with a simulation: all right and quick earns every star; 9 of 10 at a normal pace earns most) ----------
// holes are heights as a fraction of the tank; water above a hole leaks out of it
const MODES={
  elem:{holes:[.15,.475,.80],T:20,P:.21,c:.022},   // grades 3-5: 3 holes, 20 s per question
  mid :{holes:[.15,.37,.58,.80],T:30,P:.23,c:.017} // grades 6-8: 4 holes, 30 s per question
};
const modeFor=g=>g<=5?MODES.elem:MODES.mid;
const ROUND=10, YB=364, H=326, X0=50, X1=238, WALL=244, GROUND=394;
const yOf=f=>YB-f*H;

// ---------- screens ----------
const screens=['home','play','result'];
function show(name){screens.forEach(s=>{$(s).hidden=s!==name;});window.scrollTo(0,0);}

// ---------- home ----------
function say(id,text,ok){const m=$(id);m.textContent=text||'';m.hidden=!text;m.className='msg '+(ok?'ok':'err');}
let confirming=false;
function renderHome(){
  const names=Object.keys(store.players),p=cur();
  const box=$('players');box.textContent='';
  names.forEach(n=>{const b=document.createElement('button');b.type='button';b.className='chip';b.textContent=n;b.setAttribute('aria-pressed',n===store.current);
    b.onclick=()=>{if(n===store.current)return;store.current=n;store.grade=store.players[n].grade;confirming=false;say('pMsg','');save();renderHome();};box.appendChild(b);});
  if(!names.length){const s=document.createElement('span');s.className='dim';s.textContent='Add a name to start.';box.appendChild(s);}
  const gb=$('grades');gb.textContent='';
  GRADES.forEach(gr=>{
    const b=document.createElement('button'),mx=gmax(gr),best=p?Math.min(p.best[gr]||0,mx):0;
    b.type='button';b.className='chip gchip';b.dataset.grade=gr;b.dataset.best=best;
    b.setAttribute('aria-pressed',gr===store.grade);b.setAttribute('aria-label',`Grade ${gr}, best ${best} of ${mx} stars`);
    const t=document.createElement('span');t.textContent='Grade '+gr;b.appendChild(t);
    const st=document.createElement('span');st.className='gstars';st.setAttribute('aria-hidden','true');
    for(let i=0;i<mx;i++){const s=el('svg',{viewBox:'0 0 24 24'},null);el('use',{href:'#star'},s);if(i<best)s.setAttribute('class','on');st.appendChild(s);}
    b.appendChild(st);
    b.onclick=()=>{store.grade=gr;if(p)p.grade=gr;save();renderHome();};gb.appendChild(b);
  });
  $('totals').textContent=p?`${store.current}: ${p.stars} star${p.stars===1?'':'s'} earned, ${p.rounds} round${p.rounds===1?'':'s'} played`:'';
  const topics=[...new Set(G[store.grade].map(t=>t.name))];
  $('topics').textContent='Practice: '+topics.slice(0,6).join(', ')+(topics.length>6?', and more.':'.');
  $('playBtn').disabled=!store.current;
  renderShop();
  const who=$('who');
  if(p){who.hidden=false;$('whoName').textContent=store.current;$('whoStars').textContent=p.stars;}else who.hidden=true;
  // manage players
  $('manage').hidden=!p;
  if(p){
    $('mFor').textContent='Selected player: '+store.current;
    $('renName').placeholder='New name for '+store.current;
    $('delBtn').textContent='Delete '+store.current;
    $('delQ').textContent=`Delete ${store.current} and all their stars? This cannot be undone.`;
  }
  $('delArea').hidden=confirming;$('delConfirm').hidden=!confirming;
  renderNotice();
}
function renderShop(){
  const p=cur(),card=$('shopCard');card.hidden=!p;if(!p)return;
  $('balance').textContent=bal(p);
  const box=$('shopList');box.textContent='';
  CARDS.forEach(k=>{
    const row=document.createElement('div');row.className='shoprow';
    const ic=document.createElement('span');ic.className='cicon c-'+k.id;ic.textContent=k.icon;ic.setAttribute('aria-hidden','true');
    const tx=document.createElement('span');tx.className='ctext';
    const nm=document.createElement('b');nm.textContent=k.name+' ';
    const have=document.createElement('span');have.className='have';have.textContent='you have '+p.cards[k.id];
    nm.appendChild(have);
    const ds=document.createElement('span');ds.className='dim';ds.textContent=k.desc;
    tx.appendChild(nm);tx.appendChild(document.createElement('br'));tx.appendChild(ds);
    const b=document.createElement('button');b.type='button';b.className='btn buy';b.dataset.card=k.id;
    b.textContent=p.cards[k.id]>=CMAX?'Full':k.cost+' pts';
    b.setAttribute('aria-label',`Buy ${k.name} for ${k.cost} points`);
    b.disabled=p.cards[k.id]>=CMAX||bal(p)<k.cost;
    b.onclick=()=>{const q=cur();if(!q||q.cards[k.id]>=CMAX||bal(q)<k.cost)return;q.spent+=k.cost;q.cards[k.id]++;save();renderHome();};
    row.appendChild(ic);row.appendChild(tx);row.appendChild(b);box.appendChild(row);
  });
}
// names: trimmed, 1-12 characters, unique ignoring upper/lower case
function checkName(raw,self){
  const v=String(raw).trim();
  if(!v)return{err:'Type a name first.'};
  if([...v].length>MAXNAME)return{err:`Names can be up to ${MAXNAME} letters. Try a shorter one.`};
  if(cleanName(v)===null)return{err:'That name has a character I cannot use. Try something simpler.'};
  const dup=findName(store.players,v);
  if(dup&&dup!==self)return{err:`There is already a player called ${dup}. Pick a different name.`};
  return{name:v};
}
$('addForm').addEventListener('submit',e=>{
  e.preventDefault();
  const r=checkName($('newName').value,null);
  if(r.err){say('pMsg',r.err);return;}
  if(Object.keys(store.players).length>=MAXP){say('pMsg',`That is the most players (${MAXP}) this game can keep. Delete one first.`);return;}
  store.players[r.name]=sanPlayer({},store.grade);store.current=r.name;confirming=false;
  save();$('newName').value='';say('pMsg',`Welcome, ${r.name}!`,true);renderHome();
});
$('renForm').addEventListener('submit',e=>{
  e.preventDefault();
  const old=store.current;if(!old)return;
  const r=checkName($('renName').value,old);
  if(r.err){say('pMsg',r.err);return;}
  const np=Object.create(null);Object.keys(store.players).forEach(k=>{np[k===old?r.name:k]=store.players[k];});
  store.players=np;store.current=r.name;save();$('renName').value='';say('pMsg',`Renamed to ${r.name}.`,true);renderHome();
});
$('delBtn').onclick=()=>{confirming=true;renderHome();$('delNo').focus();};
$('delNo').onclick=()=>{confirming=false;renderHome();$('delBtn').focus();};
$('delYes').onclick=()=>{
  const old=store.current;if(!old)return;
  const np=Object.create(null);Object.keys(store.players).forEach(k=>{if(k!==old)np[k]=store.players[k];});
  store.players=np;const ks=Object.keys(np);store.current=ks.length?ks[0]:null;
  if(cur())store.grade=cur().grade;confirming=false;
  save();say('pMsg',`${old} was deleted.`,true);renderHome();
};
$('playBtn').onclick=()=>startRound();
$('againBtn').onclick=()=>startRound();
$('homeBtn').onclick=()=>{renderHome();show('home');};

// ---------- save code screen ----------
$('mkCode').onclick=()=>{
  if(!Object.keys(store.players).length){say('codeMsg','Add a player first, then make a code.');return;}
  const t=$('codeText');t.value=makeCode();$('codeOut').hidden=false;
  say('codeMsg','Here is your save code. Tap Copy code, then keep it somewhere safe.',true);
};
$('codeText').addEventListener('focus',()=>$('codeText').select());
$('copyBtn').onclick=()=>{
  const t=$('codeText'),code=t.value;
  const fallback=()=>{
    t.focus();t.select();t.setSelectionRange(0,code.length);
    let ok=false;try{ok=document.execCommand('copy');}catch(e){}
    say('codeMsg',ok?'Copied! Paste it somewhere safe.':'The code is selected. Press and hold it, then choose Copy.',true);
  };
  try{
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(code).then(()=>say('codeMsg','Copied! Paste it somewhere safe.',true),fallback);
    }else fallback();
  }catch(e){fallback();}
};
$('restoreBtn').onclick=()=>{
  let r;
  try{r=parseCode($('pasteCode').value);}catch(e){r={err:DAMAGED};}
  if(r.err){say('codeMsg',r.err);return;}
  let res;
  try{res=mergeCode(r.players);}catch(e){say('codeMsg','Something went wrong, so nothing was changed. Please try again.');return;}
  const parts=[];
  if(res.added.length)parts.push('Added '+res.added.join(', '));
  if(res.updated.length)parts.push('Updated '+res.updated.join(', '));
  if(res.skipped)parts.push(`${res.skipped} skipped (too many players)`);
  say('codeMsg',parts.length?'Restored! '+parts.join('. ')+'.':'Restored. Everything in that code was already here.',true);
  $('pasteCode').value='';renderHome();
};

// ---------- tank drawing ----------
const gHoles=$('holes'),gStreams=$('streams'),gStars=$('starmeter'),gFish=$('fish'),gBub=$('bubbles');
const waterEl=$('water'),surfEl=$('surface'),pourEl=$('pour');
let holeEls=[],streamEls=[],starEls=[],mouth=null,bubbles=[],fishY=200,mood='';

function buildTank(mode){
  gHoles.textContent='';gStreams.textContent='';gStars.textContent='';streamEls=[];starEls=[];holeEls=[];
  mode.holes.forEach(h=>{
    const y=yOf(h);
    el('line',{x1:X0,x2:X1,y1:y,y2:y,stroke:'#16405c','stroke-opacity':.22,'stroke-dasharray':'4 6'},gHoles);
    holeEls.push(el('ellipse',{cx:WALL-1,cy:y,rx:5,ry:7,fill:'#16405c',stroke:'#fff','stroke-width':2},gHoles));
    streamEls.push(el('path',{fill:'none',stroke:'#33b5ee','stroke-width':4.5,'stroke-linecap':'round','stroke-dasharray':'12 7'},gStreams));
    const s=el('use',{href:'#star',x:12,y:y-13,width:26,height:26},gStars);s.style.fill='#dcebf3';s.style.stroke='#9db9c8';s.style.strokeWidth='1.6';s.style.strokeLinejoin='round';starEls.push(s);
  });
  // fish (cute goldfish with outline, blush and a mouth that follows the water level)
  gFish.textContent='';
  const f=el('g',{},gFish),K='#16405c';
  el('path',{d:'M-27 0L-50-19Q-42 0-50 19Z',fill:'#ffb74d',stroke:K,'stroke-width':3,'stroke-linejoin':'round'},f);
  el('path',{d:'M-8-17Q4-38 22-15Z',fill:'#ffb74d',stroke:K,'stroke-width':3,'stroke-linejoin':'round'},f);
  el('ellipse',{rx:30,ry:21,fill:'#ff9a3d',stroke:K,'stroke-width':3},f);
  el('ellipse',{cx:3,cy:9,rx:21,ry:8,fill:'#ffd9a6'},f);
  el('path',{d:'M-6-16Q-12 0-6 17',fill:'none',stroke:'#ff7a1a','stroke-width':3,'stroke-linecap':'round',opacity:.7},f);
  el('path',{d:'M-2 4Q-14 20 4 17Z',fill:'#ffb74d',stroke:K,'stroke-width':2.2,'stroke-linejoin':'round'},f);
  el('circle',{cx:10,cy:7,r:5,fill:'#ff7f93',opacity:.65},f);
  el('circle',{cx:16,cy:-5,r:7,fill:'#fff',stroke:K,'stroke-width':2.5},f);
  el('circle',{cx:18,cy:-4.5,r:3.8,fill:K},f);el('circle',{cx:19.5,cy:-6.5,r:1.4,fill:'#fff'},f);
  mouth=el('path',{d:'',fill:'none',stroke:K,'stroke-width':2.4,'stroke-linecap':'round'},f);
  gFish.fishNode=f;mood='';
  // bubbles
  gBub.textContent='';bubbles=[];
  for(let i=0;i<7;i++){const c=el('circle',{r:2+Math.random()*3,fill:'none',stroke:'#fff','stroke-opacity':.95,'stroke-width':2},gBub);bubbles.push({c,x:60+Math.random()*170,y:YB-Math.random()*H,v:14+Math.random()*22,ph:Math.random()*6});}
}

const MOUTH={happy:'M21 5Q25 11 29 4',ok:'M21 6Q25 8 29 6',sad:'M21 10Q25 4 29 10'};
function drawTank(g,dt){
  const mode=g.mode,lv=g.level,top=yOf(lv),t=g.time;
  // water + gentle surface wave
  let d=`M${X0} ${top}`,l=`M${X0} ${top}`;
  for(let x=X0;x<=X1;x+=8){const y=top+2.4*Math.sin(x*.07+t*2.2);d+=` L${x} ${y.toFixed(1)}`;l+=` L${x} ${y.toFixed(1)}`;}
  waterEl.setAttribute('d',d+` L${X1} ${YB} L${X0} ${YB} Z`);surfEl.setAttribute('d',l);
  // pour
  const ph=g.pending>0.002?Math.max(0,top-38):0;pourEl.setAttribute('height',ph);
  // streams: water only leaks from holes it covers, faster the deeper they are
  mode.holes.forEach((h,i)=>{
    const p=streamEls[i];
    if(lv<=h+.004||g.plugs.some(x=>x.i===i)){p.setAttribute('d','');return;}
    const y0=yOf(h),v=190*Math.sqrt(lv-h),tf=Math.sqrt(2*(GROUND-y0)/420);
    let d='';for(let k=0;k<=14;k++){const tt=tf*k/14;d+=(k?' L':'M')+(WALL+v*tt).toFixed(1)+' '+(y0+210*tt*tt).toFixed(1);}
    p.setAttribute('d',d);p.setAttribute('stroke-dashoffset',(-t*70).toFixed(1));
  });
  // stars light up for each hole the water covers
  mode.holes.forEach((h,i)=>{const on=lv>=h+.03;starEls[i].style.fill=on?'#ffd23f':'#dcebf3';starEls[i].style.stroke=on?'#16405c':'#9db9c8';});
  // fish: floats mid-water, happier with more water
  const target=Math.min(330,Math.max(top+26,(top+YB-18)/2));
  fishY+=(target-fishY)*Math.min(1,dt*2.5);
  const sw=Math.sin(t*.6),fx=144+38*sw,dir=Math.cos(t*.6)>=0?1:-1;
  gFish.fishNode.setAttribute('transform',`translate(${fx.toFixed(1)} ${(fishY+4*Math.sin(t*2.2)).toFixed(1)}) scale(${dir} 1)`);
  const m=lv>.5?'happy':lv>.26?'ok':'sad';
  if(m!==mood){mood=m;mouth.setAttribute('d',MOUTH[m]);}
  // bubbles
  bubbles.forEach(b=>{b.y-=b.v*dt;if(b.y<top+4){b.y=YB-6;b.x=60+Math.random()*170;}
    b.c.setAttribute('cx',(b.x+3*Math.sin(t*2+b.ph)).toFixed(1));b.c.setAttribute('cy',b.y.toFixed(1));});
}

// ---------- round ----------
let g=null,last=0;
function newQuestion(){
  const all=G[g.grade],calc=all.find(t=>t.calc),others=all.filter(t=>!t.calc);
  const wantCalc=g.plan[g.qi];let q=null;
  for(let i=0;i<40;i++){
    const t=wantCalc?calc:others[Math.floor(Math.random()*others.length)];
    if(!wantCalc&&others.length>1&&t===g.lastTopic)continue;
    const cand=t.gen();
    if(g.used.has(cand.q))continue;
    if(!wantCalc)g.lastTopic=t;q=cand;break;
  }
  if(!q)q=(wantCalc?calc:others[0]).gen();
  g.used.add(q.q);return q;
}
function startRound(){
  if(!store.current)return;
  const grade=store.grade,mode=modeFor(grade);
  g={usedCards:new Set(),plugs:[],freeze:0,grade,mode,level:.30,pending:0,qi:0,points:0,streak:0,best:0,correct:0,missed:[],tLeft:mode.T,
     state:'idle',answered:0,fb:0,settle:0,used:new Set(),lastTopic:null,q:null,everFull:false,time:0,active:true,quitArm:0};
  // each round: 3 to 5 of the 10 questions are plain calculations, spread at random
  const k=3+Math.floor(Math.random()*3);g.plan=Array.from({length:ROUND},(_,i)=>i<k);
  for(let i=ROUND-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[g.plan[i],g.plan[j]]=[g.plan[j],g.plan[i]];}
  buildTank(mode);fishY=yOf(.4);
  $('quitBtn').textContent='End round';$('toast').textContent='';
  show('play');nextQuestion();
  last=performance.now();requestAnimationFrame(loop);
}
function nextQuestion(){
  g.q=newQuestion();g.tLeft=g.mode.T;g.state='asking';g.freeze=0;
  $('qnum').textContent=`Question ${g.qi+1} of ${ROUND}`;
  $('pts').textContent=g.points;$('streak').textContent='Streak '+g.streak;
  const s=g.q.std;$('std').textContent=/ review$/.test(s)?'Review · CCSS '+s.replace(' review',''):'CCSS '+s;
  $('q').innerHTML=fmt(g.q.q);$('toast').textContent='';
  const box=$('answers');box.textContent='';
  g.q.c.forEach((c,i)=>{
    const b=document.createElement('button');b.type='button';b.className='ans';b.dataset.i=i;
    b.innerHTML=`<span>${fmt(c)}</span>`;b.onclick=()=>answer(i);box.appendChild(b);
  });
  $('timer').classList.remove('low','frozen');$('timerBar').style.transform='scaleX(1)';
  renderCards();
}
function renderCards(){
  const box=$('cardBar');box.textContent='';const p=store.players[store.current];if(!g||!p)return;
  CARDS.forEach(k=>{
    const n=p.cards[k.id],b=document.createElement('button');b.type='button';b.className='mcard c-'+k.id;b.dataset.card=k.id;
    b.setAttribute('aria-label',`${k.name}: ${k.desc} You have ${n}.`);
    const ic=document.createElement('span');ic.className='cicon';ic.textContent=k.icon;ic.setAttribute('aria-hidden','true');
    const nm=document.createElement('span');nm.className='cname';nm.textContent=k.name;
    const ct=document.createElement('span');ct.className='ccount';ct.textContent='×'+n;
    b.appendChild(ic);b.appendChild(nm);b.appendChild(ct);
    b.disabled=g.state!=='asking'||n<1||g.usedCards.has(k.id);
    b.onclick=()=>useCard(k.id);box.appendChild(b);
  });
}
function leakingHole(){const hs=g.mode.holes;for(let i=0;i<hs.length;i++)if(g.level>hs[i]+.004&&!g.plugs.some(x=>x.i===i))return i;return -1;}
function useCard(id){
  if(!g||g.state!=='asking'||g.usedCards.has(id))return;
  const p=store.players[store.current];if(!p||p.cards[id]<1)return;
  let msg='';
  if(id==='fifty'){
    const wrong=[...$('answers').children].filter((b,k)=>g.q.c[k]!==g.q.a&&!b.disabled);
    shuf(wrong).slice(0,2).forEach(b=>{b.disabled=true;b.classList.add('dimmed');});msg='Two wrong answers gone!';
  }else if(id==='skip'){
    p.cards[id]--;g.usedCards.add(id);save();
    g.state='feedback';g.fb=.5;g.skipped=(g.skipped||0)+1;
    $('toast').textContent='Skipped. No penalty.';
    [...$('answers').children].forEach(b=>{b.disabled=true;b.classList.add('dimmed');});renderCards();return;
  }else if(id==='plug'){
    const i=leakingHole();if(i<0){$('toast').textContent='Nothing is leaking right now, so keep your Plug.';return;}
    g.plugs.push({i,left:3});holeEls[i].setAttribute('fill','#f2506b');msg='Leak plugged for 3 questions!';
  }else if(id==='freeze'){g.freeze=10;$('timer').classList.add('frozen');msg='Timer frozen for 10 seconds!';}
  p.cards[id]--;g.usedCards.add(id);save();$('toast').textContent=msg;renderCards();
}
function answer(i){
  if(!g||g.state!=='asking')return;
  g.state='feedback';g.answered++;
  const btns=[...$('answers').children],right=i>=0&&g.q.c[i]===g.q.a;
  btns.forEach((b,k)=>{b.disabled=true;if(g.q.c[k]===g.q.a)b.classList.add('right');else if(k===i)b.classList.add('wrong');else b.classList.add('dimmed');});
  if(right){
    const f=g.tLeft/g.mode.T;
    g.pending+=g.mode.P*(.6+.8*f);g.streak++;g.best=Math.max(g.best,g.streak);g.correct++;
    const pts=10+Math.round(10*f)+Math.min(g.streak-1,5)*2;g.points+=pts;
    $('toast').textContent=f>.6?`Fast! +${pts}`:`Correct! +${pts}`;g.fb=.9;
  }else{
    g.streak=0;g.missed.push({q:g.q.q,a:g.q.a,std:g.q.std});
    $('toast').innerHTML=(i<0?"Time's up. ":'Not quite. ')+'The answer is '+fmt(g.q.a);g.fb=2.0;
  }
  $('pts').textContent=g.points;$('streak').textContent='Streak '+g.streak;
}
function advance(){
  g.qi++;
  g.plugs.forEach(x=>{x.left--;});g.plugs=g.plugs.filter(x=>{if(x.left>0)return true;holeEls[x.i].setAttribute('fill','#16405c');return false;});
  if(g.qi>=ROUND){g.state='settle';g.settle=.7;return;}
  nextQuestion();
}
function finish(){
  g.active=false;
  const holes=g.mode.holes,max=holes.length;
  let stars=0;holes.forEach(h=>{if(g.level>=h+.03)stars++;});
  const p=store.players[store.current];
  p.stars=cnum(p.stars+stars);p.points=cnum(p.points+g.points);p.rounds=cnum(p.rounds+1);p.grade=g.grade;p.best[g.grade]=Math.min(gmax(g.grade),Math.max(p.best[g.grade]||0,stars));save();
  $('resTitle').textContent=stars===max?(g.everFull?'Tank full! All stars!':'All stars!'):stars===0?'The tank ran dry':stars===1?'Good start!':'Nice work!';
  const bs=$('bigstars');bs.textContent='';bs.setAttribute('aria-label',`${stars} of ${max} stars`);
  for(let i=0;i<max;i++){const s=el('svg',{viewBox:'0 0 24 24'},null);el('use',{href:'#star'},s);if(i<stars){s.setAttribute('class','lit');s.style.animationDelay=(i*.25)+'s';}bs.appendChild(s);}
  $('rPts').textContent=g.points;$('rBal').textContent=`You can spend ${bal(p)} points on magic cards.`;$('rCorrect').textContent=`${g.correct}/${g.answered}`;$('rStreak').textContent=g.best;
  const ml=$('missedList');ml.textContent='';$('missed').hidden=!g.missed.length;
  g.missed.forEach(m=>{const r=document.createElement('div');r.className='mrow';
    r.innerHTML=`<span class="mq">${fmt(m.q)}</span><span class="ma">${fmt(m.a)}</span>`;ml.appendChild(r);});
  renderHome();show('result');
}
$('quitBtn').onclick=()=>{
  if(!g)return;
  if(g.quitArm>0){g.active=false;renderHome();show('home');return;}
  g.quitArm=3;$('quitBtn').textContent='Tap again to end';
};
document.addEventListener('keydown',e=>{
  if(!g||!g.active||$('play').hidden||g.state!=='asking')return;
  const k=parseInt(e.key,10);if(k>=1&&k<=4)answer(k-1);
});

// ---------- main loop ----------
function loop(ts){
  if(!g||!g.active)return;
  const dt=Math.min(.05,(ts-last)/1000||0);last=ts;g.time+=dt;
  if(g.quitArm>0){g.quitArm-=dt;if(g.quitArm<=0){g.quitArm=0;$('quitBtn').textContent='End round';}}
  // water in
  const add=Math.min(g.pending,.3*dt);g.pending-=add;g.level=Math.min(1,g.level+add);
  if(g.level>=1&&!g.everFull){g.everFull=true;g.points+=20;$('pts').textContent=g.points;$('toast').textContent+='  Tank full! +20';}
  // water out (only through covered holes)
  if(g.state!=='settle'){
    let s=0;g.mode.holes.forEach((h,i)=>{if(g.level>h&&!g.plugs.some(x=>x.i===i))s+=Math.sqrt(g.level-h);});
    g.level=Math.max(g.mode.holes[0],g.level-g.mode.c*s*dt);
  }
  if(g.state==='asking'){
    if(g.freeze>0){g.freeze-=dt;if(g.freeze<=0)$('timer').classList.remove('frozen');}else g.tLeft-=dt;
    const f=Math.max(0,g.tLeft/g.mode.T);
    $('timerBar').style.transform=`scaleX(${f.toFixed(3)})`;$('timer').classList.toggle('low',f<.25);
    if(g.tLeft<=0)answer(-1);
  }else if(g.state==='feedback'){
    g.fb-=dt;if(g.fb<=0)advance();
  }else if(g.state==='settle'){
    if(g.pending<.002){g.settle-=dt;if(g.settle<=0){finish();return;}}
  }
  drawTank(g,dt);
  requestAnimationFrame(loop);
}

renderHome();show('home');
//__DEBUG__
})();
