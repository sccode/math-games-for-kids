const {chromium}=require('playwright');
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log(c?'PASS':'FAIL',m);};
(async()=>{const b=await chromium.launch();
const seed=JSON.stringify({v:2,current:'Mia',grade:6,players:{Mia:{stars:3,points:2000,spent:0,rounds:2,grade:6,best:{},cards:{fifty:0,skip:0,plug:0,freeze:0}}}});
const ctx=await b.newContext({viewport:{width:400,height:900}});
await ctx.addInitScript(s=>{if(!sessionStorage.s&&!localStorage.getItem('noseed')){sessionStorage.s=1;localStorage.setItem('fishtankmath.v1',s);}},seed);
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/game_debug.html');
const st=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('fishtankmath.v1')).players.Mia);
ok(await p.textContent('#balance')==='2000','balance 2000');
await p.click('[data-card="fifty"].buy');await p.click('[data-card="skip"].buy');await p.click('[data-card="plug"].buy');await p.click('[data-card="freeze"].buy');
let s=await st();ok(s.spent===1860&&s.cards.fifty===1&&s.cards.skip===1&&s.cards.plug===1&&s.cards.freeze===1,'bought all four');
ok(await p.$eval('[data-card="fifty"].buy',e=>e.disabled),'cannot buy with 0 balance');
// code roundtrip
await p.click('#mkCode');const code=await p.inputValue('#codeText');
await p.evaluate(()=>{localStorage.clear();localStorage.setItem('noseed','1');});await p.reload();
await p.fill('#pasteCode',code);await p.click('#restoreBtn');
s=await st();ok(s.spent===1860&&s.cards.plug===1&&s.points===2000,'save code restores spent+cards');
await p.click('#playBtn');
ok(await p.$$eval('#cardBar .mcard:not(:disabled)',e=>e.length)===4,'4 cards usable in round');
// 50/50
await p.click('#cardBar [data-card="fifty"]');
ok(await p.$$eval('#answers .ans:disabled',e=>e.length)===2,'50/50 removes 2');
ok(await p.$eval('#answers .ans.right,#answers .ans:not(:disabled)',e=>!!e)&&true,'ok');
const g1=await p.evaluate(()=>{const q=__g().q;return [q.c.length,q.a]});
const rem=await p.$$eval('#answers .ans:not(:disabled)',(e)=>e.map(x=>x.textContent));
ok(rem.length===2,'2 answers remain');
ok(await p.$eval('#cardBar [data-card="fifty"]',e=>e.disabled),'50/50 once per round');
// freeze
await p.click('#cardBar [data-card="freeze"]');
const t0=await p.evaluate(()=>__g().tLeft);await p.waitForTimeout(1200);
ok(Math.abs(t0-await p.evaluate(()=>__g().tLeft))<.05,'timer frozen');
// plug: set level so a hole is leaking
await p.evaluate(()=>{__g().level=.6;});
await p.click('#cardBar [data-card="plug"]');
ok(await p.evaluate(()=>__g().plugs.length)===1,'plug applied');
const l0=await p.evaluate(()=>__g().level);await p.waitForTimeout(800);
const l1=await p.evaluate(()=>__g().level);ok(l0-l1<.02,'plugged hole slows leak ('+(l0-l1).toFixed(3)+')');
// skip
const qi=await p.evaluate(()=>__g().qi);
await p.click('#cardBar [data-card="skip"]');await p.waitForTimeout(900);
ok(await p.evaluate(()=>__g().qi)===qi+1,'skip advances');
s=await st();ok(s.cards.fifty===0&&s.cards.skip===0&&s.cards.plug===0&&s.cards.freeze===0,'cards consumed and saved');
await p.screenshot({path:'/tmp/play4.png'});
// wrong card use w/ none: buttons disabled
ok(await p.$$eval('#cardBar .mcard:not(:disabled)',e=>e.length)===0,'no cards left -> all disabled');
ok(!errs.length,'no errors '+errs.join(';'));
console.log(pass,'passed',fail,'failed');await b.close();})();
