const fs=require('fs');
fs.writeFileSync(__dirname+'/_q5.js',fs.readFileSync(__dirname+'/questions.js','utf8')+'\nmodule.exports={G};');
const {G}=require('./_q5.js');
const num=s=>parseFloat(String(s).replace(/−/g,'-'));
const T=n=>G[6].find(t=>t.name===n);
let bad=0;const fail=(n,r)=>{bad++;if(bad<12)console.log('FAIL',n,r.q,'=>',r.a);};
for(let i=0;i<4000;i++){
  let r=T('Ratios').gen();
  let m=r.q.match(/^(\d+) : (\d+) = (\d+) : \?$/);
  if(m){if(num(r.a)!==num(m[2])*num(m[3])/num(m[1]))fail('ratio eq',r);}
  else{m=r.q.match(/has (\d+) boys and (\d+) girls/);const g=(a,b)=>b?g(b,a%b):a,d=g(+m[1],+m[2]);if(r.a!==`${m[1]/d} : ${m[2]/d}`)fail('ratio simp',r);}
  r=T('Percent: find the whole or the percent').gen();
  m=r.q.match(/^(\d+) is (\d+)% of what number\?$/);
  if(m){if(num(r.a)*m[2]/100!==+m[1])fail('whole',r);}
  else{m=r.q.match(/^What percent of (\d+) is (\d+)\?$/);if(parseFloat(r.a)!==m[2]/m[1]*100)fail('percent',r);}
  r=T('Factor with the GCF').gen();
  m=r.q.match(/^Factor: (\d*)x \+ (\d+)$/);const A=m[1]===''?1:+m[1],B=+m[2];
  const f=r.a.match(/^(\d+)\((\d*)x \+ (\d+)\)$/);if(!f||+f[1]*(f[2]===''?1:+f[2])!==A||+f[1]*+f[3]!==B)fail('factor',r);
  r=T('Median, mode and range').gen();
  const nums=(r.q.match(/-?\d+/g)||[]).map(Number);
  if(/median/.test(r.q)){const s=nums.slice().sort((a,b)=>a-b);if(num(r.a)!==s[2])fail('median',r);}
  if(/range/.test(r.q)){if(num(r.a)!==Math.max(...nums)-Math.min(...nums))fail('range',r);}
  if(/mode/.test(r.q)){const c={};nums.forEach(x=>c[x]=(c[x]||0)+1);if(c[num(r.a)]!==2||Object.values(c).filter(v=>v>1).length!==1)fail('mode',r);}
  r=T('Area of parallelograms and trapezoids').gen();
  m=r.q.match(/base (\d+) cm and height (\d+)/);
  if(m){if(num(r.a)!==m[1]*m[2])fail('para',r);}
  else{m=r.q.match(/sides (\d+) cm and (\d+) cm, and height (\d+)/);if(num(r.a)!==(+m[1]+ +m[2])*m[3]/2)fail('trap',r);}
  r=T('Evaluate with two variables or exponents').gen();
  m=r.q.match(/Evaluate (\d)x \+ (\d)y when x = (\d) and y = (\d)/);
  if(m){if(num(r.a)!==m[1]*m[3]+m[2]*m[4])fail('eval2',r);}
  else{m=r.q.match(/x² \+ (\d)x when x = (\d)/);if(num(r.a)!==m[2]*m[2]+m[1]*m[2])fail('eval sq',r);}
  r=T('The coordinate plane').gen();
  m=r.q.match(/\((−?\d+), (−?\d+)\) and/);
  if(/far apart/.test(r.q)){const p=r.q.match(/\((−?\d+), (−?\d+)\) and \((−?\d+), (−?\d+)\)/).slice(1).map(num);if(num(r.a)!==Math.abs(p[1]-p[3]))fail('dist',r);}
  if(/quadrant/.test(r.q)){const p=r.q.match(/\((−?\d+), (−?\d+)\)/).slice(1).map(num);const q=p[0]>0&&p[1]>0?'I':p[0]<0&&p[1]>0?'II':p[0]<0&&p[1]<0?'III':'IV';if(r.a!==`Quadrant ${q}`)fail('quad',r);}
  r=T('Equations with decimals and fractions').gen();
  m=r.q.match(/^Solve: 0\.5x = (\d+)$/);if(m&&num(r.a)!==2*m[1])fail('half',r);
  m=r.q.match(/^Solve: x \+ ([\d.]+) = ([\d.]+)$/);if(m&&Math.abs(num(r.a)-(m[2]-m[1]))>1e-9)fail('x+a',r);
  m=r.q.match(/^Solve: \[\[1\|(\d+)\]\]x = (\d+)$/);if(m&&num(r.a)!==m[1]*m[2])fail('frac eq',r);
  r=T('Inequalities: pick a solution').gen();
  m=r.q.match(/x ([<>]) (\d+)/);if(m[1]==='>'?!(num(r.a)>+m[2]):!(num(r.a)<+m[2]))fail('ineq',r);
  const wrongSol=r.c.filter(x=>x!==r.a).some(x=>m[1]==='>'?num(x)>+m[2]:num(x)<+m[2]);if(wrongSol)fail('ineq extra solution',r);
}
console.log('grade 6 new topics verified, failures:',bad);
