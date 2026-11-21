// independent checker for grade 9: re-derives each answer from the question TEXT (does not reuse generator logic)
const fs=require('fs');
const src=['qA','qB','qC','qD','qE','qF','qG','qH','qK','qI'].map(f=>fs.readFileSync(__dirname+'/'+f+'.js','utf8')).join('')+'\nmodule.exports={G,KEY};';
fs.writeFileSync(__dirname+'/_r9.js',src);const {G,KEY}=require('./_r9.js');
const SUPM={'⁰':0,'¹':1,'²':2,'³':3,'⁴':4,'⁵':5,'⁶':6,'⁷':7,'⁸':8,'⁹':9};
function js(s){ // text -> JS expression in x
  s=s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g,m=>'**'+[...m].map(c=>SUPM[c]).join(''))
     .replace(/−/g,'-').replace(/×|·/g,'*').replace(/÷/g,'/').replace(/\^/g,'**')
     .replace(/(\d)\s*x/g,'$1*x').replace(/\)\s*\(/g,')*(').replace(/(\d)\s*\(/g,'$1*(').replace(/\)\s*x/g,')*x').replace(/x\*\*(\d+)/g,'(x**$1)').replace(/(\d)\s*\*\*/g,'$1**');
  return s;}
const ev=(s,x)=>{try{return Function('x','return ('+js(s)+')')(x);}catch(e){return NaN;}};
const same=(a,b)=>[-3,-1.5,0.5,1,2,4.5,7].every(x=>{const p=ev(a,x),q=ev(b,x);return Math.abs(p-q)<1e-9&&!isNaN(p);});
let bad=0,n=0;const log=m=>{bad++;if(bad<25)console.log(m);};
const T9=Object.fromEntries(G[9].map(t=>[t.name,t]));
const num=s=>Number(String(s).replace(/−/g,'-'));
for(const t of G[9]){for(let i=0;i<3000;i++){const r=t.gen();n++;
  const exactlyOne=(fn,label)=>{const ok=r.c.filter(fn);if(ok.length!==1||!fn(r.a))log(label+' '+JSON.stringify([r.q,r.a,r.c]));};
  if(new Set(r.c.map(KEY)).size!==4)log('DUP '+JSON.stringify(r));
  if(/NaN|undefined|Infinity/.test(r.q+r.c.join()))log('TOKEN '+r.q+r.c);
  let m;
  switch(t.name){
  case 'Solve a two-step equation':{const [l,rr]=r.q.replace('Solve: ','').split(' = ');exactlyOne(c=>Math.abs(ev(l,num(c))-ev(rr,num(c)))<1e-9,'EQ');break;}
  case 'Solve an inequality':{const body=r.q.replace('Solve: ','');const mm=body.match(/^(.*) (<|>|≤|≥) (−?\d+)$/);
    const truth=x=>{const L=ev(mm[1],x),R_=num(mm[3]);return mm[2]==='<'?L<R_:mm[2]==='>'?L>R_:mm[2]==='≤'?L<=R_:L>=R_;};
    const eq=c=>{const k=c.match(/^x (<|>|≤|≥) (−?\d+)$/);const f=x=>{const v=num(k[2]);return k[1]==='<'?x<v:k[1]==='>'?x>v:k[1]==='≤'?x<=v:x>=v;};
      for(let x=-30;x<=30;x+=.5)if(f(x)!==truth(x))return false;return true;};exactlyOne(eq,'INEQ');break;}
  case 'Absolute value equations':{m=r.q.match(/\|x − (\d+)\| = (\d+)/);const c0=+m[1],r0=+m[2],sol=[c0+r0,c0-r0].sort((a,b)=>a-b).join();
    exactlyOne(c=>{const k=[...c.matchAll(/x = (−?\d+)/g)].map(z=>num(z[1])).sort((a,b)=>a-b).join();return k===sol&&/ or /.test(c);},'ABS');break;}
  case 'Add and subtract polynomials':{m=r.q.match(/^\((.*)\) (\+|−) \((.*)\)$/);const f=x=>m[2]==='+'?ev(m[1],x)+ev(m[3],x):ev(m[1],x)-ev(m[3],x);
    exactlyOne(c=>[-2,1,3,5].every(x=>Math.abs(f(x)-ev(c,x))<1e-9),'POLY');break;}
  case 'Multiply binomials':{const e=r.q.replace('Expand: ','');exactlyOne(c=>same(e,c),'EXPAND');break;}
  case 'Factor a trinomial':case 'Difference of squares':{const e=r.q.replace('Factor: ','');exactlyOne(c=>same(e,c),'FACTOR');break;}
  case 'Evaluate a function':{m=r.q.match(/f\(x\) = (.*), what is f\((−?\d+)\)/);exactlyOne(c=>Math.abs(ev(m[1],num(m[2]))-num(c))<1e-9,'FEVAL');break;}
  case 'Slope of a line':{
    if(m=r.q.match(/slope of y = (.*)\?$/)){const f=x=>ev(m[1],x);exactlyOne(c=>{const v=c.startsWith('[[')?0:num(c);return Math.abs((f(1)-f(0))-v)<1e-9;},'SLOPE');}
    else if(m=r.q.match(/y-intercept of y = (.*)\?$/)){exactlyOne(c=>Math.abs(ev(m[1],0)-num(c))<1e-9,'YINT');}
    else{m=r.q.match(/\((−?\d+), (−?\d+)\) and \((−?\d+), (−?\d+)\)/);const s=(num(m[4])-num(m[2]))/(num(m[3])-num(m[1]));exactlyOne(c=>!c.startsWith('[[')&&Math.abs(num(c)-s)<1e-9,'SLOPE2');}break;}
  case 'Write the equation of a line':{m=r.q.match(/slope (−?\d+) and y-intercept (−?\d+)/);exactlyOne(c=>{const e=c.replace('y = ','');return Math.abs(ev(e,0)-num(m[2]))<1e-9&&Math.abs(ev(e,1)-ev(e,0)-num(m[1]))<1e-9;},'LINE');break;}
  case 'Where a line crosses the axes':{m=r.q.match(/y = (.*) cross the x-axis/);exactlyOne(c=>{const k=c.match(/^\((−?\d+), (−?\d+)\)$/);return num(k[2])===0&&Math.abs(ev(m[1],num(k[1])))<1e-9;},'XAXIS');break;}
  case 'Systems of equations':{m=r.q.match(/x \+ y = (\d+) and x − y = (−?\d+)\. What is (x|y)\?/);const s=+m[1],d=num(m[2]),x=(s+d)/2,y=(s-d)/2;exactlyOne(c=>num(c)===(m[3]==='x'?x:y),'SYS');break;}
  case 'Substitution':{m=r.q.match(/y = (\d+)x and x \+ y = (\d+)\. What is y/);const k=+m[1],s=+m[2],x=s/(1+k);exactlyOne(c=>num(c)===k*x,'SUBST');break;}
  case 'Exponent rules':{if(m=r.q.match(/^What is 5⁰ \+ (\d+)¹\?/)){exactlyOne(c=>num(c)===1+ +m[1],'EXP0');}
    else{const e=r.q.replace(/ = \?$/,'');exactlyOne(c=>same(e,c),'EXP');}break;}
  case 'Square roots and cube roots':{if(m=r.q.match(/^√(\d+) = \?/))exactlyOne(c=>num(c)**2===+m[1],'SQRT');
    else if(m=r.q.match(/cube root of (\d+)/))exactlyOne(c=>num(c)**3===+m[1],'CBRT');
    else{m=r.q.match(/Simplify √(\d+)/);exactlyOne(c=>{const k=c.match(/^(\d+)√(\d+)$/);return k&&(+k[1])**2*(+k[2])===+m[1];},'SIMP');}break;}
  case 'Write and solve a linear model':{m=r.q.match(/\$(\d+) plus \$(\d+) per \w+\. The total is \$(\d+)/);exactlyOne(c=>+m[1]+ +m[2]*num(c)===+m[3],'MODEL');break;}
  case 'Solve a quadratic':{if(m=r.q.match(/x² = (\d+)/)){const sq=+m[1];exactlyOne(c=>/^x = ±/.test(c)&&(+c.replace('x = ±',''))**2===sq,'QSQ');}
    else{const [l,rr]=r.q.replace('Solve: ','').split(' = ');const eqn=l;exactlyOne(c=>{const sols=[...c.matchAll(/x = (−?\d+)/g)].map(z=>num(z[1]));return sols.length===2&&sols[0]!==sols[1]&&sols.every(x=>Math.abs(ev(eqn,x))<1e-9);},'QUAD');}break;}
  case 'Linear or exponential?':{const isExp=c=>/\^x/.test(c),isLin=c=>/^y = (\d+x( \+ \d+| − \d+)?|x \+ \d+)$/.test(c);
    exactlyOne(/exponential/.test(r.q)?isExp:isLin,'LINEXP');break;}
  case 'Exponential growth':{m=r.q.match(/of (\d+) bugs (doubles|triples) every day\. How many after (\d+) days/);const base=m[2]==='doubles'?2:3;exactlyOne(c=>num(c)===+m[1]*base**+m[3],'GROWTH');break;}
  case 'Median and interquartile range':{
    if(m=r.q.match(/median of (.*)\?$/)){const a=m[1].split(', ').map(Number).sort((p,q)=>p-q);exactlyOne(c=>num(c)===a[3],'MED');}
    else{m=r.q.match(/of (.*)\.$/);const a=m[1].split(', ').map(Number).sort((p,q)=>p-q);exactlyOne(c=>num(c)===a[5]-a[1],'IQR');}break;}
  case 'Parallel lines and a transversal':{m=r.q.match(/measures (\d+)°\. .* its (.*) angle\?/);const a=+m[1],same_=/^(corresponding|alternate)/.test(m[2]),exp=same_?a:180-a;exactlyOne(c=>parseInt(c)===exp&&/°$/.test(c),'PARA');break;}
  case 'Angles in a triangle':{
    if(m=r.q.match(/angles of (\d+)° and (\d+)°\. What is the third/)){exactlyOne(c=>parseInt(c)===180-m[1]-m[2],'TRI3');}
    else if(m=r.q.match(/interior angles of (\d+)° and (\d+)° at two/)){exactlyOne(c=>parseInt(c)===+m[1]+ +m[2],'EXT');}
    else if(m=r.q.match(/vertex angle of (\d+)°/)){exactlyOne(c=>parseInt(c)*2+ +m[1]===180,'ISO');}
    else log('TRI? '+r.q);break;}
  case 'Angles in a polygon':{
    if(m=r.q.match(/sum of the interior angles of a polygon with (\d+) sides/)){exactlyOne(c=>parseInt(c)===(m[1]-2)*180,'PSUM');}
    else if(m=r.q.match(/each interior angle of a regular polygon with (\d+) sides/)){exactlyOne(c=>Math.abs(parseInt(c)*m[1]-(m[1]-2)*180)<1e-9,'PINT');}
    else if(m=r.q.match(/each exterior angle of a regular polygon with (\d+) sides/)){exactlyOne(c=>parseInt(c)*m[1]===360,'PEXT');}
    else log('POLY? '+r.q);break;}
  case 'Similar figures':{
    if(m=r.q.match(/AB = (\d+), DE = (\d+), and BC = (\d+)\. What is EF/)){exactlyOne(c=>+c*m[1]===m[3]*m[2]&&Number.isInteger(+c),'SIM');}
    else if(m=r.q.match(/scale factor of (\d+) : 1\. .* area of (\d+) cm²/)){exactlyOne(c=>parseInt(c)===m[2]*m[1]*m[1]&&/ cm²$/.test(c),'SIMA');}
    else log('SIM? '+r.q);break;}
  case 'Pythagorean theorem':{
    if(m=r.q.match(/legs (\d+) and (\d+)\. What is the hypotenuse/)){exactlyOne(c=>+c*c===m[1]*m[1]+m[2]*m[2],'HYP');}
    else if(m=r.q.match(/hypotenuse of (\d+) and one leg of (\d+)/)){exactlyOne(c=>+c*c+m[2]*m[2]==m[1]*m[1],'LEG');}
    else if(m=r.q.match(/A (\d+) ft ladder .* base (\d+) ft from/)){exactlyOne(c=>+c*c+m[2]*m[2]==m[1]*m[1],'LADDER');}
    else log('PY? '+r.q);break;}
  case 'Right triangle trig':{m=r.q.match(/opposite angle A is (\d+), the side adjacent to A is (\d+), and the hypotenuse is (\d+)\. What is (sin|cos|tan) A/);
    if(m[1]*m[1]+m[2]*m[2]!==m[3]*m[3])log('TRIPLE '+r.q);
    const want=m[4]==='sin'?m[1]/m[3]:m[4]==='cos'?m[2]/m[3]:m[1]/m[2];
    exactlyOne(c=>{const k=c.match(/^\[\[(\d+)\|(\d+)\]\]$/);return k&&Math.abs(k[1]/k[2]-want)<1e-9;},'TRIG');break;}
  case 'Distance and midpoint':{
    if(m=r.q.match(/midpoint of \((−?\d+), (−?\d+)\) and \((−?\d+), (−?\d+)\)/)){const X=(num(m[1])+num(m[3]))/2,Y=(num(m[2])+num(m[4]))/2;
      exactlyOne(c=>{const k=c.match(/^\((−?\d+), (−?\d+)\)$/);return k&&num(k[1])===X&&num(k[2])===Y;},'MID');}
    else if(m=r.q.match(/distance between \((−?\d+), (−?\d+)\) and \((−?\d+), (−?\d+)\)/)){const d=Math.hypot(num(m[1])-num(m[3]),num(m[2])-num(m[4]));exactlyOne(c=>Math.abs(+c-d)<1e-9,'DIST');}
    else log('GPE? '+r.q);break;}
  case 'Volume of a cylinder and cone':{
    if(m=r.q.match(/cylinder with radius (\d+) cm and height (\d+) cm/)){exactlyOne(c=>c===`${m[1]*m[1]*m[2]}π cm³`,'CYL');}
    else if(m=r.q.match(/cone with radius (\d+) cm and height (\d+) cm/)){exactlyOne(c=>c===`${m[1]*m[1]*m[2]/3}π cm³`&&Number.isInteger(m[1]*m[1]*m[2]/3),'CONE');}
    else log('VOL? '+r.q);break;}
  case 'Circle angles and arcs':{
    if(m=r.q.match(/intercepts an arc of (\d+)°/)){exactlyOne(c=>parseInt(c)*2===+m[1],'INS1');}
    else if(m=r.q.match(/inscribed angle measures (\d+)°\. .* arc/)){exactlyOne(c=>parseInt(c)===2*m[1],'INS2');}
    else if(/semicircle/.test(r.q)){exactlyOne(c=>c==='90°','SEMI');}
    else if(m=r.q.match(/radius (\d+) cm\. .* central angle of (\d+)°/)){const L=2*m[1]*m[2]/360;exactlyOne(c=>Number.isInteger(L)&&c===`${L}π cm`,'ARC');}
    else log('CIR? '+r.q);break;}
  case 'Rearrange a formula':{break;}
  case 'Quick calculation':{const q=r.q.replace(' = ?','');let v;
    if(m=q.match(/^(\d+)% of (\d+)$/))v=m[1]*m[2]/100;else if(m=q.match(/^√(\d+)$/))v=Math.sqrt(+m[1]);else v=ev(q.replace(/(−?\d+) × \((−\d+)\)/,'$1*($2)'),0);
    exactlyOne(c=>Math.abs(num(c)-v)<1e-9,'QC');break;}
  default:log('UNCHECKED '+t.name);}
}}
console.log('checked',n,'problems',bad);
