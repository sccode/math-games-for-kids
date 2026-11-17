
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
const glabel=gr=>gr===0?'Kindergarten':'Grade '+gr;
const gshort=gr=>gr===0?'K':'Grade '+gr;
// order of the grade digits inside a save code: kept as it was (3..8) with newer grades added at the end
const SAVEORD=[3,4,5,6,7,8,0,1,2,9,10,11,12].filter(gr=>GRADES.includes(gr));
// magic cards: bought with points, used during a round (each card at most once per round)
const CARDS=[
  {id:'fifty', name:'50/50', cost:45, icon:'½', desc:'Takes away two wrong answers.'},
  {id:'skip',  name:'Skip',  cost:35, icon:'»', desc:'Skip a question with no penalty.'},
  {id:'plug',  name:'Plug',  cost:90, icon:'●', desc:'Plugs the biggest leak for 3 questions.'},
  {id:'freeze',name:'Freeze',cost:60, icon:'❄', desc:'Stops the timer for 10 seconds.'}];
// ---------- sound (made with the Web Audio API, no files; starts after the first tap) ----------
const MUTEKEY='fishtankmath.mute';
let muted=false;try{muted=localStorage.getItem(MUTEKEY)==='1';}catch(e){}
let actx=null;
function audio(){
  if(muted)return null;
  try{
    if(!actx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;actx=new AC();}
    if(actx.state==='suspended')actx.resume();
    return actx;
  }catch(e){return null;}
}
function tone(f,t0,dur,type,vol,slide){
  const a=audio();if(!a)return;
  const o=a.createOscillator(),g=a.createGain(),t=a.currentTime+t0;
  o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+dur);
  g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol||.15,t+.015);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+dur+.05);
}
function blip(t0,dur,vol){   // a short splash of noise
  const a=audio();if(!a)return;
  const n=Math.floor(a.sampleRate*dur),buf=a.createBuffer(1,n,a.sampleRate),d=buf.getChannelData(0);
  for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);
  const s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain(),t=a.currentTime+t0;
  f.type='bandpass';f.frequency.value=1800;g.gain.value=vol||.08;s.buffer=buf;s.connect(f);f.connect(g);g.connect(a.destination);s.start(t);
}
const NOTE=[523.25,587.33,659.25,783.99,880,1046.5];   // C D E G A C (pentatonic, always sounds happy)
function sfx(name,n){
  if(muted)return;
  try{
  if(name==='right'){const k=Math.min(n||0,4);tone(NOTE[k],0,.16,'triangle',.18);tone(NOTE[k+1],.09,.22,'triangle',.18);blip(0,.18,.05);}
  else if(name==='wrong'){tone(220,0,.2,'sawtooth',.07,160);tone(165,.14,.28,'sawtooth',.07,120);}
  else if(name==='star'){const k=n||0;tone(NOTE[Math.min(k+2,5)],0,.35,'triangle',.2);tone(NOTE[Math.min(k+2,5)]*2,0,.3,'sine',.08);}
  else if(name==='dry'){tone(262,0,.25,'triangle',.14,196);tone(196,.22,.4,'triangle',.14,147);}
  else if(name==='full'){[0,1,2,3,5].forEach((k,i)=>tone(NOTE[k],i*.08,.25,'triangle',.17));blip(0,.4,.07);}
  else if(name==='card'){tone(880,0,.12,'sine',.14);tone(1318.5,.07,.12,'sine',.12);tone(1760,.14,.2,'sine',.1);}
  else if(name==='buy'){tone(988,0,.09,'square',.07);tone(1318.5,.08,.22,'square',.07);}
  else if(name==='start'){tone(392,0,.1,'triangle',.14);tone(523.25,.09,.16,'triangle',.14);}
  }catch(e){}
}
document.addEventListener('pointerdown',()=>{if(!muted&&!actx)audio();},{once:true});
const MUTE_ON='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const MUTE_OFF='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
function renderMute(){const b=$('muteBtn');b.innerHTML=muted?MUTE_OFF:MUTE_ON;b.setAttribute('aria-pressed',muted);b.setAttribute('aria-label',muted?'Sound is off. Turn sound on':'Sound is on. Turn sound off');b.title=muted?'Sound off':'Sound on';}
$('muteBtn').onclick=()=>{muted=!muted;try{localStorage.setItem(MUTEKEY,muted?'1':'0');}catch(e){}renderMute();if(!muted)sfx('start');};
renderMute();

const CMAX=9;
// shop items (bought with stars): fish, decorations and tank backgrounds
const P=(body,fin,belly,stripe,rainbow)=>({body,fin,belly,stripe,rainbow:!!rainbow});
const ITEMS=[
  {id:'goldie',kind:'fish',name:'Goldie',cost:0, pal:P('#ff9a3d','#ffb74d','#ffd9a6','#ff7a1a')},
  {id:'bluey', kind:'fish',name:'Bluey', cost:8,pal:P('#4fa8ff','#8cc8ff','#d6ecff','#2f7fe0')},
  {id:'minty', kind:'fish',name:'Minty', cost:8,pal:P('#3fcf8e','#7fe3b3','#d3f7e5','#1fa86b')},
  {id:'pinky', kind:'fish',name:'Pinky', cost:12,pal:P('#ff7fb0','#ffa8cb','#ffe0ee','#e0498a')},
  {id:'violet',kind:'fish',name:'Violet',cost:12,pal:P('#9b7bff','#bda8ff','#e9e1ff','#6f4fdc')},
  {id:'rainbow',kind:'fish',name:'Rainbow',cost:30,pal:P('#ffd23f','#ff9fb2','#fff6c9','#f2506b',true)},
  {id:'starfish',kind:'decor',name:'Starfish',cost:5, desc:'A cute starfish on the sand.'},
  {id:'chest',   kind:'decor',name:'Treasure chest',cost:14,desc:'Shiny treasure for the fish.'},
  {id:'bubbler', kind:'decor',name:'Bubbler',cost:18,desc:'Makes lots more bubbles.'},
  {id:'castle',  kind:'decor',name:'Castle',cost:24,desc:'A little castle to swim around.'},
  {id:'duck',    kind:'decor',name:'Rubber duck',cost:24,desc:'Floats on top of the water.'},
  {id:'sunset',kind:'bg',name:'Sunset wall',cost:8,desc:'A warm peachy back wall.',color:'#ffe6d6'},
  {id:'mint',  kind:'bg',name:'Mint wall',  cost:8,desc:'A fresh mint back wall.',color:'#dcf8ea'},
  {id:'lilac', kind:'bg',name:'Lilac wall', cost:8,desc:'A soft lilac back wall.',color:'#ebe3ff'}];
const ITEM=Object.fromEntries(ITEMS.map(i=>[i.id,i]));
const BGDEFAULT='#effaff';
const sbal=p=>Math.max(0,p.stars-p.starsSpent);
// normalise what a player owns and shows: Goldie always owned; one fish; at most one wall
function normShop(p){
  p.own=[...new Set(['goldie',...(Array.isArray(p.own)?p.own:[]).filter(i=>typeof i==='string'&&ITEM[i])])];
  let on=(Array.isArray(p.on)?p.on:[]).filter(i=>typeof i==='string'&&ITEM[i]&&p.own.includes(i));
  on=[...new Set(on)];
  const fish=on.find(i=>ITEM[i].kind==='fish')||'goldie',bg=on.find(i=>ITEM[i].kind==='bg');
  p.on=[fish,...(bg?[bg]:[]),...on.filter(i=>ITEM[i].kind==='decor')];
  p.starsSpent=Math.min(cnum(p.starsSpent),p.stars);
  return p;
}
const bits=(list)=>ITEMS.map(i=>list.includes(i.id)?'1':'0').join('');
const fromBits=s=>ITEMS.filter((i,k)=>typeof s==='string'&&s[k]==='1').map(i=>i.id);
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
  p.starsSpent=cnum(r.starsSpent);p.own=r.own;p.on=r.on;normShop(p);
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
  const p=Object.keys(store.players).map(n=>{const q=store.players[n];return[n,q.stars,q.points,q.rounds,q.grade,SAVEORD.map(gr=>q.best[gr]||0).join(''),q.spent,CARDS.map(k=>q.cards[k.id]).join(''),q.starsSpent,bits(q.own),bits(q.on)];});
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
    SAVEORD.forEach((gr,i)=>{const v=cnum(Number(bs[i]),gmax(gr));if(v)best[gr]=v;});
    const cs=typeof e[7]==='string'?e[7]:'',cards={};CARDS.forEach((k,i)=>{cards[k.id]=cnum(Number(cs[i]),CMAX);});
    const points=cnum(e[2]);
    out.push(normShop({name,stars:cnum(e[1]),points,rounds:cnum(e[3]),grade:GRADES.includes(e[4])?e[4]:4,best,spent:Math.min(cnum(e[6]),points),cards,starsSpent:cnum(e[8]),own:fromBits(e[9]),on:fromBits(e[10])}));
  }
  if(!out.length)return{err:'That code has no players in it. Check that you copied the right one.'};
  return{players:out};
}
// merge into a COPY first; only commit when done, so a problem can never lose existing data
function mergeCode(list){
  const np=Object.create(null);
  Object.keys(store.players).forEach(k=>{const p=store.players[k];np[k]={stars:p.stars,points:p.points,rounds:p.rounds,grade:p.grade,best:Object.assign({},p.best),spent:p.spent,cards:Object.assign({},p.cards),starsSpent:p.starsSpent,own:p.own.slice(),on:p.on.slice()};});
  const added=[],updated=[];let skipped=0;
  list.forEach(e=>{
    const ex=findName(np,e.name);
    if(ex){
      const q=np[ex];let ch=false;
      ['stars','points','rounds','spent'].forEach(f=>{if(e[f]>q[f]){q[f]=e[f];ch=true;}});
      CARDS.forEach(k=>{if(e.cards[k.id]>q.cards[k.id]){q.cards[k.id]=e.cards[k.id];ch=true;}});
      q.spent=Math.min(q.spent,q.points);
      if(e.starsSpent>q.starsSpent){q.starsSpent=e.starsSpent;ch=true;}
      e.own.forEach(i=>{if(!q.own.includes(i)){q.own.push(i);ch=true;}});
      normShop(q);
      GRADES.forEach(gr=>{if((e.best[gr]||0)>(q.best[gr]||0)){q.best[gr]=e.best[gr];ch=true;}});
      if(ch&&!updated.includes(ex))updated.push(ex);
    }else if(Object.keys(np).length<MAXP){
      np[e.name]={stars:e.stars,points:e.points,rounds:e.rounds,grade:e.grade,best:e.best,spent:e.spent,cards:e.cards,starsSpent:e.starsSpent,own:e.own,on:e.on};added.push(e.name);
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
  high:{holes:[.15,.37,.58,.80],T:40,P:.23,c:.0128},   // grade 9: 4 holes, 40 s (leak scaled so each question costs the same)
  early:{holes:[.15,.475,.80],T:28,P:.21,c:.0158},   // K-2: 3 holes, a little more time (28 s)
  elem:{holes:[.15,.475,.80],T:20,P:.21,c:.022},   // grades 3-5: 3 holes, 20 s per question
  mid :{holes:[.15,.37,.58,.80],T:30,P:.23,c:.017} // grades 6-8: 4 holes, 30 s per question
};
const modeFor=g=>g<=2?MODES.early:g<=5?MODES.elem:g>=9?MODES.high:MODES.mid;
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
    b.setAttribute('aria-pressed',gr===store.grade);b.setAttribute('aria-label',`${glabel(gr)}, best ${best} of ${mx} stars`);
    const t=document.createElement('span');t.textContent=gshort(gr);b.appendChild(t);
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
  if(p){who.hidden=false;$('whoName').textContent=store.current;$('whoStars').textContent=sbal(p);}else who.hidden=true;
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
function renderFishShop(){
  const p=cur(),card=$('fishCard');card.hidden=!p;if(!p)return;
  $('sBal').textContent=sbal(p);
  const box=$('fishList');box.textContent='';
  const heads={fish:'Fish',decor:'Decorations',bg:'Back walls'};let lastKind='';
  ITEMS.forEach(it=>{
    if(it.kind!==lastKind){const h=document.createElement('h3');h.textContent=heads[it.kind];box.appendChild(h);lastKind=it.kind;}
    const own=p.own.includes(it.id),on=p.on.includes(it.id);
    const row=document.createElement('div');row.className='shoprow';
    const pv=document.createElement('span');pv.className='pv';
    const sv=el('svg',{viewBox:it.kind==='fish'?'-56 -28 100 56':it.kind==='bg'?'0 0 10 10':'-26 -38 52 44','aria-hidden':'true',preserveAspectRatio:it.kind==='bg'?'none':'xMidYMid meet'},null);
    if(it.kind==='fish')drawFish(sv,it.pal,false);else if(it.kind==='bg')el('rect',{width:10,height:10,fill:it.color},sv);else drawDecor(sv,it.id);
    pv.appendChild(sv);
    const tx=document.createElement('span');tx.className='ctext';
    const nm=document.createElement('b');nm.textContent=it.name;
    const ds=document.createElement('span');ds.className='dim';ds.textContent=it.kind==='fish'?(own?'Yours':'A new fish friend'):it.desc;
    tx.appendChild(nm);tx.appendChild(document.createElement('br'));tx.appendChild(ds);
    const b=document.createElement('button');b.type='button';b.className='btn buy';b.dataset.item=it.id;
    if(!own){b.textContent='★ '+it.cost;b.disabled=sbal(p)<it.cost;b.setAttribute('aria-label',`Buy ${it.name} for ${it.cost} stars`);}
    else if(it.kind==='fish'){b.textContent=on?'In use':'Use';b.disabled=on;b.classList.toggle('ghost',on);}
    else{b.textContent=on?'Hide':'Show';b.classList.add('ghost');}
    b.onclick=()=>{
      const q=cur();if(!q)return;
      if(!q.own.includes(it.id)){if(sbal(q)<it.cost)return;q.starsSpent+=it.cost;q.own.push(it.id);q.on=q.on.filter(i=>ITEM[i].kind!==it.kind||it.kind==='decor');q.on.push(it.id);}
      else if(it.kind==='fish'){q.on=q.on.filter(i=>ITEM[i].kind!=='fish');q.on.push(it.id);}
      else if(it.kind==='bg'){const was=q.on.includes(it.id);q.on=q.on.filter(i=>ITEM[i].kind!=='bg');if(!was)q.on.push(it.id);}
      else{q.on=q.on.includes(it.id)?q.on.filter(i=>i!==it.id):[...q.on,it.id];}
      normShop(q);sfx('buy');save();renderHome();
    };
    row.appendChild(pv);row.appendChild(tx);row.appendChild(b);box.appendChild(row);
  });
}

function renderShop(){
  renderFishShop();
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
    b.onclick=()=>{const q=cur();if(!q||q.cards[k.id]>=CMAX||bal(q)<k.cost)return;q.spent+=k.cost;q.cards[k.id]++;sfx('buy');save();renderHome();};
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
const gDecor=$('decor'),gFloat=$('floaters'),gHoles=$('holes'),gStreams=$('streams'),gStars=$('starmeter'),gFish=$('fish'),gBub=$('bubbles');
const waterEl=$('water'),surfEl=$('surface'),pourEl=$('pour');
const palOf=p=>{const id=(p&&p.on.find(i=>ITEM[i].kind==='fish'))||'goldie';return ITEM[id].pal;};
// decorations are drawn around (0,0) = the middle of the base
function drawDecor(parent,id){
  const K='#16405c',g=el('g',{},parent);
  if(id==='starfish'){
    let d='';for(let i=0;i<10;i++){const r=i%2?4.5:11,a=-Math.PI/2+i*Math.PI/5;d+=(i?'L':'M')+(r*Math.cos(a)).toFixed(1)+' '+(-9+r*Math.sin(a)).toFixed(1);}
    el('path',{d:d+'Z',fill:'#ff8f6b',stroke:K,'stroke-width':2.2,'stroke-linejoin':'round'},g);el('circle',{cx:-3,cy:-10,r:1.3,fill:'#fff'},g);el('circle',{cx:3,cy:-10,r:1.3,fill:'#fff'},g);
  }else if(id==='chest'){
    el('rect',{x:-15,y:-14,width:30,height:14,rx:3,fill:'#c98a4b',stroke:K,'stroke-width':2.5},g);
    el('path',{d:'M-15-14Q0-30 15-14Z',fill:'#e0a35f',stroke:K,'stroke-width':2.5,'stroke-linejoin':'round'},g);
    el('rect',{x:-3,y:-16,width:6,height:7,rx:1.5,fill:'#ffd23f',stroke:K,'stroke-width':1.8},g);
    el('circle',{cx:-8,cy:-21,r:2.4,fill:'#ffd23f'},g);el('circle',{cx:7,cy:-22,r:2,fill:'#ffd23f'},g);
  }else if(id==='bubbler'){
    el('ellipse',{cx:0,cy:-3,rx:9,ry:4,fill:'#9fb4c2',stroke:K,'stroke-width':2.2},g);
    el('path',{d:'M0-6Q-4-18 0-30',fill:'none',stroke:K,'stroke-width':1.6,'stroke-dasharray':'2 5','stroke-linecap':'round',opacity:.5},g);
  }else if(id==='castle'){
    const fl=(x,y,c)=>{el('path',{d:`M${x} ${y}V${y-9}l9 3.5-9 3.5`,fill:c,stroke:K,'stroke-width':1.8,'stroke-linejoin':'round'},g);};
    el('rect',{x:-19,y:-26,width:10,height:26,fill:'#ffb3c7',stroke:K,'stroke-width':2.5},g);
    el('rect',{x:9,y:-26,width:10,height:26,fill:'#ffb3c7',stroke:K,'stroke-width':2.5},g);
    el('rect',{x:-11,y:-20,width:22,height:20,fill:'#ffc9d8',stroke:K,'stroke-width':2.5},g);
    el('path',{d:'M-19-26l5-6 5 6ZM9-26l5-6 5 6Z',fill:'#7a5cff',stroke:K,'stroke-width':2.2,'stroke-linejoin':'round'},g);
    el('path',{d:'M-5 0V-8Q0-15 5-8V0Z',fill:'#7a4b2a',stroke:K,'stroke-width':2},g);
    fl(-14,-32,'#f2506b');fl(14,-32,'#ffd23f');
  }else if(id==='duck'){
    el('ellipse',{cx:0,cy:-6,rx:13,ry:8,fill:'#ffd23f',stroke:K,'stroke-width':2.5},g);
    el('circle',{cx:8,cy:-16,r:7,fill:'#ffd23f',stroke:K,'stroke-width':2.5},g);
    el('path',{d:'M14-16l7 2-7 3Z',fill:'#ff8f3d',stroke:K,'stroke-width':1.8,'stroke-linejoin':'round'},g);
    el('circle',{cx:9,cy:-18,r:1.5,fill:K},g);
    el('path',{d:'M-9-8Q-3-3 3-8',fill:'none',stroke:'#e3a800','stroke-width':2.2,'stroke-linecap':'round'},g);
  }
  return g;
}
const DECOR_X={starfish:140,chest:108,bubbler:166,castle:200};
function drawFish(parent,pal,live){
  const f=el('g',{},parent),K='#16405c';
  el('path',{d:'M-27 0L-50-19Q-42 0-50 19Z',fill:pal.fin,stroke:K,'stroke-width':3,'stroke-linejoin':'round'},f);
  el('path',{d:'M-8-17Q4-38 22-15Z',fill:pal.fin,stroke:K,'stroke-width':3,'stroke-linejoin':'round'},f);
  el('ellipse',{rx:30,ry:21,fill:pal.body,stroke:K,'stroke-width':3},f);
  el('ellipse',{cx:3,cy:9,rx:21,ry:8,fill:pal.belly},f);
  el('path',{d:'M-6-16Q-12 0-6 17',fill:'none',stroke:pal.stripe,'stroke-width':3,'stroke-linecap':'round',opacity:.7},f);
  if(pal.rainbow){el('path',{d:'M-14-12Q-20 0-14 12',fill:'none',stroke:'#4fa8ff','stroke-width':3,'stroke-linecap':'round',opacity:.8},f);el('path',{d:'M2-19Q-4 0 2 19',fill:'none',stroke:'#3fcf8e','stroke-width':3,'stroke-linecap':'round',opacity:.8},f);}
  el('path',{d:'M-2 4Q-14 20 4 17Z',fill:pal.fin,stroke:K,'stroke-width':2.2,'stroke-linejoin':'round'},f);
  el('circle',{cx:10,cy:7,r:5,fill:'#ff7f93',opacity:.65},f);
  el('circle',{cx:16,cy:-5,r:7,fill:'#fff',stroke:K,'stroke-width':2.5},f);
  el('circle',{cx:18,cy:-4.5,r:3.8,fill:K},f);el('circle',{cx:19.5,cy:-6.5,r:1.4,fill:'#fff'},f);
  if(live)mouth=el('path',{d:'',fill:'none',stroke:K,'stroke-width':2.4,'stroke-linecap':'round'},f);
  return f;
}
let duckEl=null,holeEls=[],streamEls=[],starEls=[],mouth=null,bubbles=[],fishY=200,mood='';

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
  const pl=cur()||{on:['goldie']};
  gDecor.textContent='';gFloat.textContent='';duckEl=null;
  $('tankBg').setAttribute('fill',(pl.on.map(i=>ITEM[i]).find(i=>i.kind==='bg')||{color:BGDEFAULT}).color);
  pl.on.forEach(id=>{
    if(ITEM[id].kind!=='decor')return;
    if(id==='duck'){duckEl=drawDecor(gFloat,id);return;}
    const g=drawDecor(gDecor,id),x=DECOR_X[id];
    g.setAttribute('transform',`translate(${x} ${id==='starfish'?358:id==='bubbler'?356:352})`);
  });
  gFish.textContent='';
  const f=drawFish(gFish,palOf(cur()),true);
  gFish.fishNode=f;mood='';
  // bubbles
  gBub.textContent='';bubbles=[];
  const nb=pl.on.includes('bubbler');
  for(let i=0;i<7+(nb?9:0);i++){const c=el('circle',{r:2+Math.random()*3,fill:'none',stroke:'#fff','stroke-opacity':.95,'stroke-width':2},gBub);bubbles.push({fixed:nb&&i>=7,c,x:i>=7&&nb?160+Math.random()*12:60+Math.random()*170,y:YB-Math.random()*H,v:14+Math.random()*22,ph:Math.random()*6});}
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
  if(duckEl)duckEl.setAttribute('transform',`translate(${(130+34*Math.sin(t*.45)).toFixed(1)} ${(top+3+2*Math.sin(t*2.2+1)).toFixed(1)})`);
  // bubbles
  bubbles.forEach(b=>{b.y-=b.v*dt;if(b.y<top+4){b.y=YB-6;b.x=b.fixed?160+Math.random()*12:60+Math.random()*170;}
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
  sfx('start');buildTank(mode);fishY=yOf(.4);
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
    sfx('card');p.cards[id]--;g.usedCards.add(id);save();
    g.state='feedback';g.fb=.5;g.skipped=(g.skipped||0)+1;
    $('toast').textContent='Skipped. No penalty.';
    [...$('answers').children].forEach(b=>{b.disabled=true;b.classList.add('dimmed');});renderCards();return;
  }else if(id==='plug'){
    const i=leakingHole();if(i<0){$('toast').textContent='Nothing is leaking right now, so keep your Plug.';return;}
    g.plugs.push({i,left:3});holeEls[i].setAttribute('fill','#f2506b');msg='Leak plugged for 3 questions!';
  }else if(id==='freeze'){g.freeze=10;$('timer').classList.add('frozen');msg='Timer frozen for 10 seconds!';}
  p.cards[id]--;g.usedCards.add(id);save();$('toast').textContent=msg;sfx('card');renderCards();
}
function answer(i){
  if(!g||g.state!=='asking')return;
  g.state='feedback';g.answered++;
  const btns=[...$('answers').children],right=i>=0&&g.q.c[i]===g.q.a;
  btns.forEach((b,k)=>{b.disabled=true;if(g.q.c[k]===g.q.a)b.classList.add('right');else if(k===i)b.classList.add('wrong');else b.classList.add('dimmed');});
  if(right){
    const f=g.tLeft/g.mode.T;
    g.pending+=g.mode.P*(.6+.8*f);g.streak++;g.best=Math.max(g.best,g.streak);g.correct++;
    const pts=1+(f>.5?1:0)+(g.streak>=3?1:0);   // 1 point, +1 if fast, +1 on a streak of 3 or moreg.points+=pts;
    $('toast').textContent=f>.6?`Fast! +${pts}`:`Correct! +${pts}`;g.fb=.9;sfx('right',g.streak-1);
  }else{
    sfx('wrong');g.streak=0;g.missed.push({q:g.q.q,a:g.q.a,std:g.q.std});
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
  if(stars===0)sfx('dry');else for(let i=0;i<stars;i++)setTimeout(()=>sfx('star',i),350+i*300);
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
  if(g.level>=1&&!g.everFull){g.everFull=true;g.points+=5;$('pts').textContent=g.points;$('toast').textContent+='  Tank full! +5';sfx('full');}
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
