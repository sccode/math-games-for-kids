const sim=require('./sim3.js');
const modes={mid:{holes:[.15,.37,.58,.80],T:30},high:{holes:[.15,.37,.58,.80],T:40},elem:{holes:[.15,.475,.80],T:20},early:{holes:[.15,.475,.80],T:28}};
const tgt4=a=>Math.min(4,Math.max(0,4.2*a-.5)),tgt3=a=>Math.min(3,Math.max(0,3.4*a-.35));
const ACC=[1,.9,.8,.7,.6,.5,.4,.3,.2],SP=[.15,.25,.4];
function cost(m,tgt,runs=250){let e=0;for(const a of ACC)for(const s of SP){const r=sim(m,a,s,runs,.1);let v=0;r.dist.forEach((p,i)=>{v+=p/100*(i-r.mean)**2;});e+=(r.mean-tgt(a))**2+.25*v;}return e/(ACC.length*SP.length);}
const name=process.argv[2],base=modes[name],tgt=base.holes.length===4?tgt4:tgt3;
let best=null;
for(let i=0;i<260;i++){
  const m={...base,P:.12+Math.random()*.2,c:(.005+Math.random()*.03)*(20/base.T)**.5,D:Math.random()*.25,sf:.2+Math.random()*.6};
  const c=cost(m,tgt);if(!best||c<best.c)best={c,m};
}
// refine
for(let i=0;i<120;i++){const b=best.m,m={...base,P:b.P*(1+(Math.random()-.5)*.15),c:b.c*(1+(Math.random()-.5)*.2),D:Math.max(0,b.D*(1+(Math.random()-.5)*.25)),sf:Math.min(.9,Math.max(.1,b.sf*(1+(Math.random()-.5)*.25)))};const c=cost(m,tgt,400);if(c<best.c)best={c,m};}
const m=best.m;console.log(name,JSON.stringify({P:+m.P.toFixed(3),c:+m.c.toFixed(4),D:+m.D.toFixed(3),sf:+m.sf.toFixed(2)}),'rmse',Math.sqrt(best.c).toFixed(2));
for(const a of ACC){console.log('  acc',a,'tgt',tgt(a).toFixed(1),SP.map(s=>{const r=sim(m,a,s,1000);return r.mean.toFixed(1)+' ['+r.dist.join('/')+']';}).join('  '));}
