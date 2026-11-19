// Monte-Carlo of one round with the real mechanics, plus a leak surge after a wrong answer
function sim(m,acc,speed,runs=1500,DT=.05){
  const {holes,T,P,c,D=0,sf=.8}=m;const dist=new Array(holes.length+1).fill(0);let mean=0;
  for(let r=0;r<runs;r++){
    let L=.30,pend=0,dr=0;
    const step=dt=>{const add=Math.min(pend,.3*dt);pend-=add;L=Math.min(1,L+add);const tk=Math.min(dr,.3*dt);dr-=tk;L=Math.max(holes[0],L-tk);
      let s=0;for(const h of holes)if(L>h)s+=Math.sqrt(L-h);L=Math.max(holes[0],L-c*s*dt);};
    for(let q=0;q<10;q++){
      const used=Math.min(.98,Math.max(.05,speed*(.6+.8*Math.random())));
      for(let x=0;x<used*T;x+=DT)step(DT);
      const right=Math.random()<acc;
      if(right){pend+=P*(1-sf/2+sf*(1-used));for(let x=0;x<.9;x+=DT)step(DT);}
      else{dr+=D;for(let x=0;x<2.0;x+=DT)step(DT);}
    }
    for(let x=0;x<8&&(pend>.002||dr>.002);x+=DT){const a=Math.min(pend,.3*DT);pend-=a;L=Math.min(1,L+a);const t2=Math.min(dr,.3*DT);dr-=t2;L=Math.max(holes[0],L-t2);}   // settle: pending water/drain finishes, no leak
    let st=0;for(const h of holes)if(L>=h+.03)st++;dist[st]++;mean+=st;
  }
  return {mean:mean/runs,dist:dist.map(x=>Math.round(100*x/runs))};
}
module.exports=sim;
if(require.main===module){
 const accs=[1,.9,.8,.7,.6,.5,.4,.3,.2];
 const cur={mid:{holes:[.15,.37,.58,.80],T:30,P:.23,c:.017},elem:{holes:[.15,.475,.80],T:20,P:.21,c:.022}};
 for(const [n,m] of Object.entries(cur)){console.log('CURRENT',n);for(const a of accs){const r=sim(m,a,.4);console.log(' acc',a,'mean',r.mean.toFixed(2),r.dist.join('/'));}}
}
