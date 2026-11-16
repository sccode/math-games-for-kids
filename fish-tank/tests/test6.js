const {chromium}=require('playwright');
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log(c?'PASS':'FAIL',m);};
(async()=>{const b=await chromium.launch();
const seed=JSON.stringify({v:2,current:'Mia',grade:4,players:{Mia:{stars:50,points:100,spent:0,rounds:1,grade:4,best:{},cards:{}}}});
const ctx=await b.newContext({viewport:{width:400,height:900}});
await ctx.addInitScript(s=>{if(!sessionStorage.s&&!localStorage.getItem('noseed')){sessionStorage.s=1;localStorage.setItem('fishtankmath.v1',s);}
 window.__osc=0;const P=(n)=>{};
 class FakeParam{setValueAtTime(){}exponentialRampToValueAtTime(){}set value(v){}}
 class AC{constructor(){this.state='running';this.sampleRate=8000;this.currentTime=0;this.destination={};}
  resume(){}createOscillator(){window.__osc++;return{type:'',frequency:new FakeParam(),connect(){},start(){},stop(){}};}
  createGain(){return{gain:new FakeParam(),connect(){}};}createBiquadFilter(){return{frequency:{},connect(){}};}
  createBuffer(a,n){return{getChannelData(){return new Float32Array(n);}};}createBufferSource(){return{connect(){},start(){}};}}
 window.AudioContext=AC;},seed);
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+process.cwd()+'/game_debug.html');
await p.screenshot({path:'/tmp/home6.png',fullPage:true});
ok(await p.getAttribute('#muteBtn','aria-pressed')==='false','sound on by default');
await p.click('#playBtn');const n0=await p.evaluate(()=>window.__osc);ok(n0>0,'start sound plays');
const right=await p.evaluate(()=>{const q=__g().q;return q.c.indexOf(q.a)});
await p.click(`#answers .ans[data-i="${right}"]`);const n1=await p.evaluate(()=>window.__osc);ok(n1>n0,'right answer sound');
await p.waitForTimeout(1100);
const wrong=await p.evaluate(()=>{const q=__g().q;return q.c.findIndex(c=>c!==q.a)});
await p.click(`#answers .ans[data-i="${wrong}"]`);const n2=await p.evaluate(()=>window.__osc);ok(n2>n1,'wrong answer sound');
// mute
await p.click('#muteBtn');ok(await p.getAttribute('#muteBtn','aria-pressed')==='true','muted');
ok(await p.evaluate(()=>localStorage.getItem('fishtankmath.mute'))==='1','mute saved');
await p.waitForTimeout(2200);const n3=await p.evaluate(()=>window.__osc);
const right2=await p.evaluate(()=>{const q=__g().q;return q.c.indexOf(q.a)});
await p.click(`#answers .ans[data-i="${right2}"]`);ok(await p.evaluate(()=>window.__osc)===n3,'no sound when muted');
await p.reload();ok(await p.getAttribute('#muteBtn','aria-pressed')==='true','mute remembered after reload');
ok(!errs.length,'no errors '+errs.join(';'));
console.log(pass,'passed',fail,'failed');await b.close();})();
