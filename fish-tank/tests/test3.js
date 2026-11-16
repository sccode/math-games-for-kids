const {chromium}=require('playwright');
const URL='file://'+__dirname+'/game_debug.html';
const K='fishtankmath.v1';
let pass=0,fail=0;const errs=[];
const ok=(c,m)=>{if(c){pass++;console.log('PASS',m);}else{fail++;console.log('FAIL',m);}};
(async()=>{
const b=await chromium.launch();
async function open(seed,opts={}){
  const ctx=await b.newContext({viewport:opts.vp||{width:400,height:900}});
  if(seed!==undefined)await ctx.addInitScript(([k,v])=>{if(!sessionStorage.getItem('seeded')){sessionStorage.setItem('seeded','1');if(v!==null)localStorage.setItem(k,v);}},[K,seed]);
  if(opts.init)await ctx.addInitScript(opts.init);
  const p=await ctx.newPage();
  p.on('pageerror',e=>errs.push('pageerror: '+e.message));
  p.on('console',m=>{if(m.type()==='error'&&!/fonts|ERR_|Failed to load/.test(m.text()))errs.push('console: '+m.text());});
  await p.goto(URL);return{ctx,p};
}
const canon=o=>JSON.stringify(o,(k,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.entries(v).sort()):v);
const raw=p=>p.evaluate(k=>localStorage.getItem(k),K);
const data=async p=>JSON.parse(await raw(p));
const msg=(p,id)=>p.evaluate(i=>{const e=document.getElementById(i);return e.hidden?'':e.textContent;},id);
const add=async(p,n)=>{await p.fill('#newName',n);await p.click('#addForm button');};
const names=p=>p.$$eval('#players .chip',e=>e.map(x=>x.textContent));
const cur=p=>p.$eval('#players .chip[aria-pressed="true"]',e=>e.textContent).catch(()=>null);

// 1 persistence + names
{const {ctx,p}=await open();
 await add(p,'  Mia  ');await add(p,'Leo');
 ok(JSON.stringify(await names(p))==='["Mia","Leo"]','add players trimmed');
 await add(p,'mia');ok(/already/.test(await msg(p,'pMsg'))&&(await names(p)).length===2,'duplicate (case-insens) rejected');
 await add(p,'   ');ok(/Type a name/.test(await msg(p,'pMsg')),'empty rejected');
 await add(p,'abcdefghijklm');ok(/up to 12/.test(await msg(p,'pMsg'))&&(await names(p)).length===2,'13 chars rejected');
 await add(p,'abcdefghijkl');ok((await names(p)).includes('abcdefghijkl'),'12 chars accepted');
 await add(p,'<b>x</b>');ok((await names(p)).includes('<b>x</b>')&&await p.$$eval('#players b',e=>e.length)===0,'html name inserted as text');
 await p.reload();
 ok(JSON.stringify(await names(p))==='["Mia","Leo","abcdefghijkl","<b>x</b>"]'.replace(',"abcdefghijkl","<b>x</b>"',',"abcdefghijkl","<b>x</b>"'),'persist across reload');
 ok((await data(p)).v===2,'saved with v:2');
 // grade memory
 await p.click('#players .chip:nth-child(1)');await p.click('#grades .chip[data-grade="7"]');
 await p.click('#players .chip:nth-child(2)');await p.click('#grades .chip[data-grade="5"]');
 await p.click('#players .chip:nth-child(1)');
 ok(await p.$eval('#grades .chip[aria-pressed="true"]',e=>e.dataset.grade)==='7','grade restored for Mia (7)');
 await p.click('#players .chip:nth-child(2)');
 ok(await p.$eval('#grades .chip[aria-pressed="true"]',e=>e.dataset.grade)==='5','grade restored for Leo (5)');
 await p.reload();ok(await cur(p)==='Leo'&&await p.$eval('#grades .chip[aria-pressed="true"]',e=>e.dataset.grade)==='5','current+grade survive reload');
 // rename
 await p.click('#manage summary');
 await p.fill('#renName','mia');await p.click('#renForm button');
 ok(/already/.test(await msg(p,'pMsg')),'rename to other player rejected');
 await p.fill('#renName','Zed');await p.click('#renForm button');
 ok((await names(p)).includes('Zed')&&await cur(p)==='Zed','rename ok');
 ok(JSON.stringify(await names(p))==='["Mia","Zed","abcdefghijkl","<b>x</b>"]','rename keeps order');
 await p.fill('#renName','ZED');await p.click('#renForm button');ok(await cur(p)==='ZED','rename own case ok');
 await p.fill('#renName','');await p.click('#renForm button');ok(/Type a name/.test(await msg(p,'pMsg')),'rename empty rejected');
 // delete 2-step
 await p.click('#delBtn');
 ok(await p.isVisible('#delConfirm')&&(await names(p)).includes('ZED'),'delete step 1 only asks');
 await p.click('#delNo');ok((await names(p)).includes('ZED')&&!(await p.isVisible('#delConfirm')),'cancel keeps player');
 await p.click('#delBtn');await p.click('#delYes');
 ok(!(await names(p)).includes('ZED')&&!(await names(p)).includes('Zed'),'confirm deletes');
 ok(!Object.keys((await data(p)).players).some(k=>/^z/i.test(k)),'delete saved');
 await ctx.close();}

// 2 migration
{const old=JSON.stringify({players:{Mia:{stars:7,points:420,rounds:3,best:{4:3,7:2,5:9,99:3,x:1}},Sam:{stars:-4,points:'12',rounds:2.7,best:{}}},current:'Mia',grade:6});
 const {ctx,p}=await open(old);
 ok(JSON.stringify(await names(p))==='["Mia","Sam"]'&&await cur(p)==='Mia','migrated: players kept');
 const d=await data(p);
 await p.click('#grades .chip[data-grade="4"]');const d2=await data(p);
 ok(d2.v===2&&d2.players.Mia.stars===7&&d2.players.Mia.points===420&&d2.players.Mia.rounds===3,'migrated numbers kept, v2 written');
 ok(d2.players.Mia.best[4]===3&&d2.players.Mia.best[7]===2&&d2.players.Mia.best[5]===3&&!d2.players.Mia.best[99]&&Object.keys(d2.players.Mia.best).length===3,'best clamped (5:9->3), unknown grades dropped');
 ok(d2.players.Sam.stars===0&&d2.players.Sam.points===12&&d2.players.Sam.rounds===2&&d2.players.Sam.grade===6,'Sam sanitized, inherits old global grade');
 await p.click('#players .chip:nth-child(2)');
 ok(await p.$eval('#grades .chip[aria-pressed="true"]',e=>e.dataset.grade)==='6','Sam grade 6');
 await p.click('#players .chip:nth-child(1)');
 ok(await p.$eval('#grades .chip[data-grade="7"]',e=>e.dataset.best+'|'+e.getAttribute('aria-label'))==='2|Grade 7, best 2 of 4 stars','grade 7 shows 2 of 4');
 ok(await p.$eval('#grades .chip[data-grade="5"] .gstars',e=>e.children.length)===3&&await p.$eval('#grades .chip[data-grade="8"] .gstars',e=>e.children.length)===4,'3 stars g3-5, 4 g6-8');
 ok(/7 stars earned, 3 rounds/.test(await p.textContent('#totals')),'totals shown');
 await ctx.close();}

// 3 corrupt storage
for(const bad of ['{not json','null','[1,2]','{"players":{"__proto__":{"stars":5},"":{}, "toolongnamehere123":{}}}']){
 const {ctx,p}=await open(bad);
 ok(await p.isVisible('#playBtn'),'corrupt storage '+bad.slice(0,15)+' loads');await ctx.close();}

// 4 play a round: best stars shown
{const {ctx,p}=await open();
 await add(p,'Mia');await p.click('#grades .chip[data-grade="4"]');
 async function round(correct){
  await p.click('#playBtn');
  for(let i=0;i<10;i++){
   await p.waitForFunction(i=>{const g=window.__g();return g&&g.state==='asking'&&g.qi===i;},i,{timeout:6000});
   const idx=await p.evaluate(c=>{const g=window.__g();const r=g.q.c.indexOf(g.q.a);return c?r:(r+1)%4;},correct);
   await p.click(`#answers .ans:nth-child(${idx+1})`);
  }
  await p.waitForSelector('#result:not([hidden])',{timeout:15000});
  return p.$$eval('#bigstars .lit',e=>e.length);
 }
 const s1=await round(true);
 await p.click('#homeBtn');
 const best=await p.$eval('#grades .chip[data-grade="4"]',e=>+e.dataset.best);
 const d=await data(p);
 ok(s1>=1&&best===s1&&d.players.Mia.best[4]===s1&&d.players.Mia.rounds===1&&d.players.Mia.stars===s1,`round 1 correct: ${s1} stars saved, shown (${best}), rounds=1`);
 ok(await p.$$eval('#grades .chip[data-grade="4"] .gstars .on',e=>e.length)===s1,'filled star icons match');
 const s2=await round(false);await p.click('#homeBtn');
 const d2=await data(p);
 ok(d2.players.Mia.rounds===2&&d2.players.Mia.stars===s1+s2&&d2.players.Mia.best[4]===s1,`round 2 wrong: ${s2} stars, best stays ${s1}, total ${s1+s2}`);
 // export -> wipe -> restore
 await add(p,'Leo');await p.click('#grades .chip[data-grade="8"]');
 const before=await data(p);
 await p.click('#mkCode');const code=await p.inputValue('#codeText');
 console.log('example code ('+code.length+' chars):',code);
 ok(/^FTM1-[0-9a-z]{7}-[A-Za-z0-9_-]+$/.test(code),'code format');
 await p.evaluate(k=>localStorage.removeItem(k),K);await p.reload();
 ok((await names(p)).length===0,'wiped');
 await p.fill('#pasteCode',code.slice(0,20)+'\n  '+code.slice(20,60)+'  \n'+code.slice(60));
 await p.click('#restoreBtn');
 const after=await data(p);
 if(canon(after.players)!==canon(before.players))console.log(JSON.stringify(before.players),JSON.stringify(after.players));ok(canon(after.players)===canon(before.players),'restore identical players (incl. grade, best)');
 ok(/Added Mia, Leo/.test(await msg(p,'codeMsg')),'restore message: '+await msg(p,'codeMsg'));
 // merge larger
 await p.evaluate(k=>{const d=JSON.parse(localStorage.getItem(k));d.players.Mia.stars=999;d.players.Mia.points=1;d.players.Mia.best['5']=3;d.players.Mia.best['4']=0;d.players.Bob={stars:1,points:2,rounds:3,best:{},grade:3};localStorage.setItem(k,JSON.stringify(d));},K);
 await p.reload();
 const pre=await data(p);
 await p.fill('#pasteCode',code);await p.click('#restoreBtn');
 const m=await data(p);
 ok(m.players.Mia.stars===999&&m.players.Mia.points===before.players.Mia.points&&m.players.Mia.rounds===before.players.Mia.rounds&&m.players.Mia.best[5]===3&&m.players.Mia.best[4]===before.players.Mia.best[4],'merge keeps larger of each field');
 ok(!!m.players.Bob&&m.players.Bob.rounds===3,'merge keeps players not in code');
 ok(/Updated/.test(await msg(p,'codeMsg')),'merge msg: '+await msg(p,'codeMsg'));
 await p.fill('#pasteCode',code);await p.click('#restoreBtn');
 ok(/already here/.test(await msg(p,'codeMsg')),'re-restore: nothing new');
 // rejections
 const snap=await raw(p);
 const body=code.split('-')[2],hs=code.split('-')[1];
 const bad={
  truncated:code.slice(0,code.length-9),
  wrongprefix:'XYZ1-'+code.slice(5),
  wrongver:'FTM2-'+code.slice(5),
  tampered:code.slice(0,-3)+(code.slice(-3)==='AAA'?'BBB':'AAA'),
  tamperMid:code.slice(0,30)+(code[30]==='A'?'B':'A')+code.slice(31),
  garbage:'hello world',
  emptyBody:'FTM1-'+hs+'-',
  notB64:'FTM1-'+hs+'-@@@@',
  validSumBadJson:null,
 };
 // valid checksum but non-JSON / wrong-shape payloads (checksum computed in page)
 for(const [name,payload] of [['nonjson','aGVsbG8'],['wrongshape',Buffer.from('{"v":1,"p":"x"}').toString('base64url')],['v9',Buffer.from('{"v":9,"p":[]}').toString('base64url')],['badnames',Buffer.from('{"v":1,"p":[["",1,1,1,3,"0"],[5,1,1,1,3,"0"]]}').toString('base64url')]]){
  const h=await p.evaluate(s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}return h.toString(36).padStart(7,'0');},payload);
  bad[name]='FTM1-'+h+'-'+payload;
 }
 delete bad.validSumBadJson;
 for(const k in bad){
  await p.fill('#pasteCode',bad[k]);await p.click('#restoreBtn');
  const mm=await msg(p,'codeMsg');
  ok(mm&&await p.$eval('#codeMsg',e=>e.classList.contains('err'))&&await raw(p)===snap,`reject ${k}: "${mm.slice(0,60)}"`);
 }
 await p.fill('#pasteCode','');await p.click('#restoreBtn');ok(/Paste your/.test(await msg(p,'codeMsg')),'empty paste message');
 // huge-number & hostile payload sanitized
 const hostile=Buffer.from(JSON.stringify({v:1,p:[['Hax',1e300,-5,'9',3,'9999999'],['__proto__',1,1,1,3,'0']]})).toString('base64url');
 const hh=await p.evaluate(s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}return h.toString(36).padStart(7,'0');},hostile);
 await p.fill('#pasteCode','FTM1-'+hh+'-'+hostile);await p.click('#restoreBtn');
 const hx=(await data(p)).players.Hax;
 ok(hx&&hx.stars===999999999&&hx.points===0&&hx.best[3]===3&&!hx.best[8]||(hx&&hx.best[8]<=4),'hostile numbers clamped '+JSON.stringify(hx));
 // copy button
 await p.click('#mkCode');
 await ctx.grantPermissions(['clipboard-read','clipboard-write']).catch(()=>{});
 await p.click('#copyBtn');await p.waitForTimeout(200);
 ok(/Copied|selected/.test(await msg(p,'codeMsg')),'copy: '+await msg(p,'codeMsg'));
 await ctx.close();}
// copy fallback when clipboard rejects
{const {ctx,p}=await open(undefined,{init:()=>{Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(new Error('no'))},configurable:true});}});
 await add(p,'Mia');await p.click('#mkCode');await p.click('#copyBtn');await p.waitForTimeout(200);
 ok(/Copied|selected/.test(await msg(p,'codeMsg')),'copy fallback after rejection: '+await msg(p,'codeMsg'));
 ok(await p.evaluate(()=>{const t=document.getElementById('codeText');return t.selectionEnd-t.selectionStart===t.value.length;}),'code text selected');
 await ctx.close();}

// 5 size
{const seed=JSON.stringify({players:{Mia:{stars:123,points:45678,rounds:40,best:{3:3,4:3,5:2,6:4,7:1,8:0}},Leopold:{stars:88,points:23456,rounds:30,best:{4:2,5:3,6:2}}},current:'Mia',grade:4});
 const {ctx,p}=await open(seed);await p.click('#mkCode');const c=await p.inputValue('#codeText');
 ok(c.length<600,'2 players typical code length '+c.length);await ctx.close();}

// 6 storage throws
{const init=()=>{const t=()=>{throw new DOMException('blocked','SecurityError');};['getItem','setItem','removeItem'].forEach(m=>{Storage.prototype[m]=t;});};
 const {ctx,p}=await open(undefined,{init});
 ok(await p.isVisible('#notice'),'notice shown when storage throws');
 ok(/will be lost/.test(await p.textContent('#notice')),'notice text');
 await add(p,'Mia');
 await p.click('#playBtn');
 await p.waitForFunction(()=>window.__g().state==='asking');
 const idx=await p.evaluate(()=>{const g=window.__g();return g.q.c.indexOf(g.q.a);});
 await p.click(`#answers .ans:nth-child(${idx+1})`);
 ok(await p.evaluate(()=>window.__g().correct)===1,'plays in memory');
 await p.click('#quitBtn');await p.click('#quitBtn');
 ok(await p.isVisible('#home'),'end round returns home');
 await p.click('#mkCode');ok((await p.inputValue('#codeText')).startsWith('FTM1-'),'save code works without storage');
 const code=await p.inputValue('#codeText');
 await add(p,'Leo');await p.fill('#pasteCode',code);await p.click('#restoreBtn');ok(/already here/.test(await msg(p,'codeMsg')),'restore works without storage');
 await ctx.close();}
// storage object itself throws
{const init=()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('denied','SecurityError');}});};
 const {ctx,p}=await open(undefined,{init});
 ok(await p.isVisible('#notice')&&await p.isVisible('#playBtn'),'window.localStorage getter throwing handled');
 await add(p,'Mia');ok((await names(p)).length===1,'add works');await ctx.close();}

// 7 overflow
for(const w of [360,1100]){
 const seed=JSON.stringify({players:{ABCDEFGHIJKL:{stars:12345,points:1,rounds:99999,best:{3:3,6:4,7:4,8:4}},WWWWWWWWWWWW:{stars:1,points:1,rounds:1,best:{}}},current:'ABCDEFGHIJKL',grade:6});
 const {ctx,p}=await open(seed,{vp:{width:w,height:800}});
 await p.click('#manage summary');await p.click('#delBtn');await p.click('#mkCode');
 await p.fill('#pasteCode','FTM1-'+'x'.repeat(200));await p.click('#restoreBtn');
 const o=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,bw:document.body.scrollWidth}));
 ok(o.sw<=o.cw&&o.bw<=o.cw,`no horizontal overflow at ${w}px (${o.sw}/${o.cw})`);
 // touch targets
 if(w===360){const small=await p.$$eval('#home button, #home summary, #home input',e=>e.filter(x=>x.offsetParent&&x.getBoundingClientRect().height<44).map(x=>x.id||x.textContent));ok(small.length===0,'all home controls >=44px tall '+small);}
 await ctx.close();}

// screenshot
{const {ctx,p}=await open(JSON.stringify({players:{Mia:{stars:12,points:300,rounds:5,best:{4:2,5:3,6:4},grade:4},Leo:{stars:3,points:90,rounds:2,best:{7:1}}},current:'Mia',grade:4}),{vp:{width:400,height:1500}});
 await p.click('#mkCode');await p.screenshot({path:__dirname+'/home400.png',fullPage:true});await ctx.close();}

console.log('errors:',errs.length?errs.join('\n'):'none');
ok(errs.length===0,'no uncaught page errors / console errors');
console.log(`\n${pass} passed, ${fail} failed`);
await b.close();
})();
