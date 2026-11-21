
// ---- grade 9: Algebra 1 (CA CCSS-M high school: N-RN, A-SSE, A-APR, A-CED, A-REI, F-IF, F-LE, S-ID) ----
// polynomial text: hp(c2,c1,c0) -> "x² + 5x − 6"; zero terms are dropped
const hterm=(c,v)=>c===1?v:c===-1?'−'+v:S(c)+v;
function hp(c2,c1,c0){
  const parts=[];
  if(c2)parts.push([c2,'x²']);
  if(c1)parts.push([c1,'x']);
  if(c0||!parts.length)parts.push([c0,'']);
  return parts.map(([c,v],i)=>{
    const t=v?hterm(Math.abs(c),v):String(Math.abs(c));
    return i===0?(c<0?'−'+t:t):(c<0?' − ':' + ')+t;}).join('');
}
const hx=(a,b)=>b===0?'x':b>0?`x + ${b}`:`x − ${-b}`;           // "x + 3", "x − 2"
const hfac=(a,b)=>`(${hx(0,a)})(${hx(0,b)})`;
const hpair=(a,b)=>a<=b?hfac(a,b):hfac(b,a);                      // smaller constant first, so equal products read the same
const hnz=(lo,hi)=>{let v;do{v=R(lo,hi);}while(v===0);return v;};

G[9]=[];
G[9].push(
T('A-REI.3','Solve a two-step equation',()=>{
  const x=hnz(-9,9),a=pick([2,3,4,5,6,7]),b=hnz(-12,12),t=R(0,2);
  if(t===0)return[`Solve: ${a}x ${op(b)} = ${S(a*x+b)}`,S(x),[S(x+1),S(-x),S(x-1),S(a*x+b)]];
  if(t===1){const xs=R(-6,6)||3;return[`Solve: x ÷ ${a} ${op(b)} = ${S(xs+b)}`,S(xs*a),[S(xs),S(xs*a+b),S(-xs*a),S(xs*a+a)]];}
  let c,d,a2,x2,k;
  do{c=hnz(-5,5);d=R(1,4);a2=c+d;x2=hnz(-8,8);k=hnz(-9,9);}while(!a2||k+d*x2===0);   // (c+d)x + k = c x + (k + d·x₂)
  return[`Solve: ${hterm(a2,'x')} ${op(k)} = ${hterm(c,'x')} ${op(k+d*x2)}`,S(x2),[S(-x2),S(x2+1),S(x2-1),S(d*x2)]];}),
T('A-REI.3','Solve an inequality',()=>{
  const a=pick([2,3,4,5]),x=hnz(-6,8),b=hnz(-9,9),neg=Math.random()<.4,sgn=pick(['<','>','≤','≥']),flip={'<':'>','>':'<','≤':'≥','≥':'≤'};
  const coef=neg?-a:a,rhs=coef*x+b,ans=neg?flip[sgn]:sgn;
  const q=`Solve: ${hterm(coef,'x')} ${op(b)} ${sgn} ${S(rhs)}`;
  const wrongSign=neg?sgn:flip[sgn],other=pick(['<','>','≤','≥'].filter(z=>z!==ans&&z!==wrongSign));
  return[q,`x ${ans} ${S(x)}`,[`x ${wrongSign} ${S(x)}`,`x ${ans} ${S(-x)}`,`x ${other} ${S(x)}`,`x ${ans} ${S(rhs)}`]];}),
T('A-REI.3','Absolute value equations',()=>{
  const c=R(1,6),r=R(1,9);return[`Solve: |x − ${c}| = ${r}`,`x = ${S(c+r)} or x = ${S(c-r)}`,[`x = ${S(r+c)} only`,`x = ${S(r-c)} or x = ${S(-r-c)}`,`x = ${S(c)} or x = ${S(r)}`,`x = ${S(-c+r)} or x = ${S(-c-r)}`]];}),
T('A-APR.1','Add and subtract polynomials',()=>{
  let a,b,c,d,e,f,sub,s,r2;
  do{a=hnz(-4,5);b=hnz(-6,6);c=hnz(-6,6);d=hnz(-4,5);e=hnz(-6,6);f=hnz(-6,6);sub=Math.random()<.4;s=sub?-1:1;r2=a+s*d;}while(!r2);
  const r1=b+s*e,r0=c+s*f,right=hp(r2,r1,r0);
  const ws=[hp(sub?a+d:a-d,b+e*(sub?1:-1),c+f*(sub?1:-1)),hp(r2,r1,r0+(r0===-1?2:1)),hp(r2,-r1||2,r0),hp(r2+(r2===-1?2:1),r1,r0),hp(r2,r1+(r1===-1?2:1),r0)].filter(w=>w!==right);
  return[`(${hp(a,b,c)}) ${sub?'−':'+'} (${hp(d,e,f)})`,right,ws];}),
T('A-APR.1','Multiply binomials',()=>{
  const a=hnz(-6,6),b=hnz(-6,6);
  return[`Expand: (${hx(0,a)})(${hx(0,b)})`,hp(1,a+b,a*b),[hp(1,a+b,-a*b),hp(1,a*b,a+b),hp(1,a-b||a+b+1,a*b),hp(1,a+b,a+b)]];}),
T('A-SSE.3','Factor a trinomial',()=>{
  let a,b;do{a=hnz(-7,7);b=hnz(-7,7);}while(a===b||a+b===0);
  const ans=hpair(a,b),ws=new Set();
  [hpair(-a,-b),hpair(a,-b),hpair(-a,b),hpair(a+1,b-1),hpair(a-1,b+1)].forEach(w=>{if(w!==ans)ws.add(w);});
  return[`Factor: ${hp(1,a+b,a*b)}`,ans,[...ws].slice(0,4)];}),
T('A-SSE.2','Difference of squares',()=>{
  const n=R(2,12);return[`Factor: x² − ${n*n}`,`(x − ${n})(x + ${n})`,[`(x − ${n})²`,`(x + ${n})²`,`(x − ${n*n})(x + 1)`,`(x − ${n+1})(x + ${n+1})`]];}),
T('F-IF.2','Evaluate a function',()=>{
  const x=hnz(-4,5),a=pick([1,2,3]),b=hnz(-5,5),c=hnz(-9,9),v=a*x*x+b*x+c,t=R(0,1);
  if(t===0){const m=hnz(-5,6),k=hnz(-9,9);return[`If f(x) = ${hterm(m,'x')} ${op(k)}, what is f(${S(x)})?`,S(m*x+k),[S(m*x-k),S(m+x+k),S(-m*x+k),S(m*(x+k))]];}
  return[`If f(x) = ${hp(a,b,c)}, what is f(${S(x)})?`,S(v),[S(a*x*x-b*x+c),S(a*x*x+b*x-c),S(a*x*x+b+c),S((a*x+b)*x+c+1)]];}),
T('F-IF.6','Slope of a line',()=>{
  const t=R(0,2);
  if(t===0){const m=hnz(-5,5),b=hnz(-8,8);return[`What is the slope of y = ${hterm(m,'x')} ${op(b)}?`,S(m),[S(b),S(-m),F(1,Math.abs(m)||1)===S(m)?S(m+2):F(m<0?-1:1,Math.abs(m)),S(m+b)]];}
  if(t===1){const b=hnz(-8,8),m=hnz(-5,5);return[`What is the y-intercept of y = ${hterm(m,'x')} ${op(b)}?`,S(b),[S(m),S(-b),S(b+m),S(b*m)]];}
  const x1=R(-4,4),y1=R(-4,4),m=hnz(-4,4),dx=R(1,4),x2=x1+dx,y2=y1+m*dx;
  return[`What is the slope of the line through (${S(x1)}, ${S(y1)}) and (${S(x2)}, ${S(y2)})?`,S(m),[S(-m),F(1,Math.abs(m))===S(m)?S(m+2):F(m<0?-1:1,Math.abs(m)),S(m+1),S(dx)]];}),
T('F-LE.2','Write the equation of a line',()=>{
  const m=hnz(-5,5),b=hnz(-8,8);
  return[`A line has slope ${S(m)} and y-intercept ${S(b)}. What is its equation?`,`y = ${hterm(m,'x')} ${op(b)}`,[`y = ${hterm(b,'x')} ${op(m)}`,`y = ${hterm(m,'x')} ${op(-b)}`,`y = ${hterm(-m,'x')} ${op(b)}`]];}),
T('F-IF.4','Where a line crosses the axes',()=>{
  const m=pick([1,2,3,4]),x=hnz(-6,6),b=-m*x;
  return[`Where does y = ${hterm(m,'x')} ${op(b)} cross the x-axis?`,`(${S(x)}, 0)`,[`(${S(-x)}, 0)`,`(0, ${S(x)})`,`(${S(b)}, 0)`,`(0, ${S(b)})`]];}),
);
G[9].push(
T('A-REI.6','Systems of equations',()=>{
  let x,y;do{x=R(1,9);y=R(1,9);}while(x===y);
  const dd=x-y,q=`x + y = ${x+y} and x − y = ${dd<0?'−'+(-dd):dd}.`;
  return Math.random()<.5?[`${q} What is x?`,S(x),[S(y),S(x+1),S(x-1),S(x+y)]]:[`${q} What is y?`,S(y),[S(x),S(y+1),S(y-1),S(Math.abs(dd))]];}),
T('A-REI.6','Substitution',()=>{
  const m=R(2,4),x=R(1,6),y=m*x;
  return[`y = ${m}x and x + y = ${x+y}. What is y?`,y,[x,y+m,x+y,y-m]];}),
);
G[9].push(
T('N-RN.1','Exponent rules',()=>{
  const t=R(0,3),a=R(2,6),b=R(2,5),c=R(2,4);
  if(t===0)return[`x${sup(a)} · x${sup(b)} = ?`,`x${sup(a+b)}`,[`x${sup(a*b)}`,`2x${sup(a+b)}`,`x${sup(a+b+1)}`,`x${sup(a+b-1)}`]];
  if(t===1)return[`(x${sup(a)})${sup(c)} = ?`,`x${sup(a*c)}`,[`x${sup(a+c)}`,`${c}x${sup(a)}`,`x${sup(a*c+1)}`,`x${sup(a*c-1)}`]];
  if(t===2){const lo=R(2,5),hi=lo+R(2,4);return[`x${sup(hi)} ÷ x${sup(lo)} = ?`,`x${sup(hi-lo)}`,[`x${sup(hi+lo)}`,`x${sup(hi-lo+1)}`,`x${sup(hi*lo)}`,`x${sup(hi-lo+2)}`]];}
  const n=R(2,6);return[`What is 5⁰ + ${n}¹?`,1+n,[n,5+n,n+2,n*5]];}),
T('N-RN.2','Square roots and cube roots',()=>{
  const t=R(0,2);
  if(t===0){const n=R(2,15);return[`√${n*n} = ?`,n,[n+1,n-1,n*n/2,2*n]];}
  if(t===1){const n=R(2,6);return[`What is the cube root of ${n**3}?`,n,[n+1,n-1,n*n,3*n]];}
  const a=pick([2,3,5,6,7]),k=R(2,6);return[`Simplify √${k*k*a}`,`${k}√${a}`,[`${a}√${k}`,`${k*k}√${a}`,`${k}√${a+1}`,`${k+1}√${a}`]];}),
T('A-CED.1','Write and solve a linear model',()=>{
  const fixed=R(2,9)*5,rate=R(2,9),h=R(2,9),total=fixed+rate*h,who=pick(['A plumber','A taxi','A gym','A DJ']);
  const unit=who==='A taxi'?'miles':'hours';
  return[`${who} charges $${fixed} plus $${rate} per ${unit.slice(0,-1)}. The total is $${total}. How many ${unit}?`,h,[h+1,h-1,total/rate>0&&Number.isInteger(total/rate)&&total/rate!==h?total/rate:h+2,fixed/rate>0&&Number.isInteger(fixed/rate)&&fixed/rate!==h?fixed/rate:h+3]];}),
T('A-CED.4','Rearrange a formula',()=>{
  const t=R(0,2);
  if(t===0){const a=R(2,5);return[`Solve for y: ${a}x + y = c`,`y = c − ${a}x`,[`y = c + ${a}x`,`y = ${a}x − c`,`y = ${a}(c − x)`,`y = c − x`]];}
  if(t===1)return['Solve for h: V = l · w · h','h = [[V|l · w]]',['h = V · l · w','h = V − l − w','h = [[l · w|V]]','h = [[V|l + w]]']];
  return['Solve for x: y = m x + b','x = [[y − b|m]]',['x = [[y + b|m]]','x = m(y − b)','x = [[y|m]] − b'.replace('[[y|m]] − b','[[y|m − b]]'),'x = [[m|y − b]]']];}),
T('A-REI.4','Solve a quadratic',()=>{
  const t=R(0,2);
  if(t===0){const n=R(2,12);return[`Solve: x² = ${n*n}`,`x = ±${n}`,[`x = ${n}`,`x = ±${n*n}`,`x = ${n*n}`,`x = ±${n+1}`]];}
  let a,b;do{a=hnz(-6,6);b=hnz(-6,6);}while(a===b);
  const sols=[-a,-b].sort((p,q)=>p-q),ans=`x = ${S(sols[0])} or x = ${S(sols[1])}`,wr=[[a,b],[-a,b],[a,-b],[sols[0]+1,sols[1]]].map(([p,q])=>[p,q].sort((m,n)=>m-n)).map(([p,q])=>`x = ${S(p)} or x = ${S(q)}`).filter(z=>z!==ans);
  if(t===1)return[`Solve: (${hx(0,a)})(${hx(0,b)}) = 0`,ans,wr];
  return[`Solve: ${hp(1,a+b,a*b)} = 0`,ans,wr];}),
T('F-LE.1','Linear or exponential?',()=>{
  const t=R(0,1),a=R(2,5);
  if(t===0){const pool=[`y = ${a}x`,`y = x²`,`y = x + ${a}`,`y = ${a}x + 1`,`y = ${a}x²`,`y = ${a+1}x − 2`];
    return['Which function is exponential?',`y = ${a}^x`,shuf(pool).slice(0,3)];}
  const pool=[`y = ${a}^x`,`y = x²`,`y = ${a}x²`,`y = ${a+1}^x`,`y = ${a}/x`.replace('/x','/x')];
  const m=R(2,6);return['Which function is linear?',`y = ${m}x + ${a}`,shuf(pool).slice(0,3)];}),
T('F-LE.2','Exponential growth',()=>{
  const p=R(2,9)*10,r=pick([2,3]),n=R(2,4),word=r===2?'doubles':'triples';
  return[`A group of ${p} bugs ${word} every day. How many after ${n} days?`,p*r**n,[p*r*n,p*(r+n),p*r**(n-1),p*r**(n+1)]];}),
T('S-ID.2','Median and interquartile range',()=>{
  const s=new Set();while(s.size<7)s.add(R(1,40));const a=[...s].sort((p,q)=>p-q),shown=shuf(a),q1=a[1],q3=a[5],med=a[3];
  if(Math.random()<.5)return[`What is the median of ${shown.join(', ')}?`,med,[a[2],a[4],Math.round((a[0]+a[6])/2)===med?a[2]:Math.round((a[0]+a[6])/2),shown[3]===med?a[4]:shown[3]]];
  const iqr=q3-q1;return[`Find the interquartile range (Q3 − Q1) of ${shown.join(', ')}.`,iqr,[a[6]-a[0],q3,q1,iqr+1]];}),
// ---- grade 9 geometry (G-CO, G-SRT, G-GPE, G-GMD, G-C) ----
T('G-CO.9','Parallel lines and a transversal',()=>{
  let a;do{a=R(40,140);}while(a===90);
  const t=pick([['corresponding',1],['alternate interior',1],['alternate exterior',1],['same-side interior',0]]),ans=t[1]?a:180-a;
  return[`Parallel lines are cut by a transversal. One angle measures ${a}°. What is the measure of its ${t[0]} angle?`,`${ans}°`,[`${t[1]?180-a:a}°`,`${ans+10}°`,`${ans-10}°`,'90°']];}),
T('G-CO.10','Angles in a triangle',()=>{
  const t=R(0,2);
  if(t===0){const a=R(30,80),b=R(30,90);return[`A triangle has angles of ${a}° and ${b}°. What is the third angle?`,`${180-a-b}°`,[`${a+b}°`,`${180-a}°`,`${360-a-b}°`,`${180-a-b+10}°`]];}
  if(t===1){const a=R(30,80),b=R(30,90);return[`A triangle has interior angles of ${a}° and ${b}° at two of its vertices. What is the exterior angle at the third vertex?`,`${a+b}°`,[`${180-a-b}°`,`${180-a}°`,`${a+b+10}°`,`${360-a-b}°`]];}
  const v=R(10,50)*2;return[`An isosceles triangle has a vertex angle of ${v}°. What is each base angle?`,`${(180-v)/2}°`,[`${180-v}°`,`${v}°`,`${(180-v)/2+10}°`,`${(360-v)/2}°`]];}),
T('G-CO.10','Angles in a polygon',()=>{
  const t=R(0,2),n=pick([5,6,8,9,10,12]);
  if(t===0){const s=(n-2)*180;return[`What is the sum of the interior angles of a polygon with ${n} sides?`,`${s}°`,[`${(n-1)*180}°`,`${n*180}°`,`${s-180}°`,'360°']];}
  if(t===1){const e=(n-2)*180/n;return[`What is each interior angle of a regular polygon with ${n} sides?`,`${e}°`,[`${360/n}°`,`${e+10}°`,`${e-10}°`,`${180-e/2}°`]];}
  const e=360/n;return[`What is each exterior angle of a regular polygon with ${n} sides?`,`${e}°`,[`${(n-2)*180/n}°`,`${e+10}°`,`${e*2}°`,`${180/n}°`]];}),
T('G-SRT.5','Similar figures',()=>{
  const t=R(0,2),k=R(2,4);
  if(t===2){const A=R(2,9);return[`Two similar figures have a scale factor of ${k} : 1. The smaller one has an area of ${A} cm². What is the area of the larger one?`,`${A*k*k} cm²`,[`${A*k} cm²`,`${A*k*2} cm²`,`${A*k*k*k} cm²`,`${A*(k+1)} cm²`]];}
  const a=R(3,9),b=R(a+1,14);
  if(t===0)return[`Triangle ABC is similar to triangle DEF. AB = ${a}, DE = ${a*k}, and BC = ${b}. What is EF?`,b*k,[b+k,b*k+a,b*k-1,a*k]];
  return[`Triangle ABC is similar to triangle DEF. AB = ${a*k}, DE = ${a}, and BC = ${b*k}. What is EF?`,b,[b+k,b*k,b+1,a]];}),
T('G-SRT.8','Pythagorean theorem',()=>{
  const [a,b,c]=pick([[3,4,5],[5,12,13],[8,15,17],[7,24,25]]),m=pick([1,1,2,3]),A=a*m,B=b*m,C=c*m,t=R(0,2);
  if(t===0)return[`A right triangle has legs ${A} and ${B}. What is the hypotenuse?`,C,[A+B,C+1,C-1,B-A+C]];
  if(t===1)return[`A right triangle has a hypotenuse of ${C} and one leg of ${A}. What is the other leg?`,B,[C-A,B+1,B-1,C+A]];
  return[`A ${C} ft ladder leans against a wall with its base ${A} ft from the wall. How high up the wall does it reach, in feet?`,B,[C-A,B+1,B-1,A+B]];}),
T('G-SRT.6','Right triangle trig',()=>{
  const [a,b,c]=pick([[3,4,5],[5,12,13],[8,15,17],[7,24,25]]),f=pick(['sin','cos','tan']);
  const ans=f==='sin'?F(a,c):f==='cos'?F(b,c):F(a,b);
  const wr=f==='sin'?[F(b,c),F(a,b),F(c,a)]:f==='cos'?[F(a,c),F(a,b),F(c,b)]:[F(b,a),F(a,c),F(b,c)];
  return[`In a right triangle, the side opposite angle A is ${a}, the side adjacent to A is ${b}, and the hypotenuse is ${c}. What is ${f} A?`,ans,wr];}),
T('G-GPE.7','Distance and midpoint',()=>{
  if(Math.random()<.5){
    const x1=R(-6,6),y1=R(-6,6),x2=R(-6,6),y2=R(-6,6),mx=x1+x2,my=y1+y2;
    if(mx%2||my%2||(x1===x2&&y1===y2)){return[`What is the midpoint of (${S(x1)}, ${S(y1)}) and (${S(x1+4)}, ${S(y1+2)})?`,`(${S(x1+2)}, ${S(y1+1)})`,[`(${S(x1+4)}, ${S(y1+2)})`,`(${S(x1+1)}, ${S(y1+2)})`,`(${S(x1+2)}, ${S(y1+2)})`,`(${S(x1+4)}, ${S(y1+1)})`]];}
    return[`What is the midpoint of (${S(x1)}, ${S(y1)}) and (${S(x2)}, ${S(y2)})?`,`(${S(mx/2)}, ${S(my/2)})`,[`(${S(mx)}, ${S(my)})`,`(${S(x2-x1)}, ${S(y2-y1)})`,`(${S(mx/2+1)}, ${S(my/2)})`,`(${S(mx/2)}, ${S(my/2+1)})`]];}
  const [dx,dy,d]=pick([[3,4,5],[4,3,5],[6,8,10],[8,6,10],[5,12,13],[12,5,13]]),x1=R(-5,4),y1=R(-5,4),sx=pick([-1,1]),sy=pick([-1,1]);
  return[`What is the distance between (${S(x1)}, ${S(y1)}) and (${S(x1+sx*dx)}, ${S(y1+sy*dy)})?`,d,[dx+dy,d+1,d-1,Math.abs(dx-dy)]];}),
T('G-GMD.3','Volume of a cylinder and cone',()=>{
  if(Math.random()<.5){const r=R(2,6),h=R(2,9);return[`What is the volume of a cylinder with radius ${r} cm and height ${h} cm? (in terms of π)`,`${r*r*h}π cm³`,[`${2*r*h}π cm³`,`${r*h}π cm³`,`${r*r*h*3}π cm³`,`${r*r*h+r}π cm³`]];}
  const r=R(2,6),h=pick([3,6,9]);return[`What is the volume of a cone with radius ${r} cm and height ${h} cm? (in terms of π)`,`${r*r*h/3}π cm³`,[`${r*r*h}π cm³`,`${r*h/3}π cm³`,`${r*r*h/3+r}π cm³`,`${r*r*h*3}π cm³`]];}),
T('G-C','Circle angles and arcs',()=>{
  const t=R(0,3);
  if(t===0){const arc=R(15,80)*2;return[`An inscribed angle intercepts an arc of ${arc}°. What is the measure of the inscribed angle?`,`${arc/2}°`,[`${arc}°`,`${arc*2}°`,`${180-arc/2}°`,`${arc/2+10}°`]];}
  if(t===1){const ang=R(15,70);return[`An inscribed angle measures ${ang}°. What is the measure of the arc it intercepts?`,`${ang*2}°`,[`${ang}°`,`${ang/2+ang}°`,`${180-ang}°`,`${ang*2+10}°`]];}
  if(t===2){return['An angle is inscribed in a semicircle. What is its measure?','90°',['45°','180°','60°','120°']];}
  const r=pick([6,12]),th=pick([60,90,120,180]);return[`A circle has radius ${r} cm. What is the length of an arc with a central angle of ${th}°? (in terms of π)`,`${r*th/180}π cm`,[`${r*r*th/360}π cm`,`${r*th/90}π cm`,`${2*r}π cm`,`${r*th/180+2}π cm`]];}),
);

// plain calculation for grade 9: quick mental arithmetic that comes up in algebra
const QI9=()=>{const t=R(0,5);
  if(t===0){const n=R(6,15);return[`${n}${sup(2)} = ?`,n*n,[n*n+n,n*n-n,n*(n+1)+1,2*n]];}
  if(t===1){const a=R(-9,9)||5,b=R(-9,9)||-6;return[`${S(a)} × ${PN(b)} = ?`,S(a*b),[S(-a*b),S(a+b),S(a*b+a),S(a*b-b)]];}
  if(t===2){const n=R(2,6),e=R(2,4);return[`${n}${sup(e)} = ?`,n**e,[n*e,n**e+n,n**(e+1),n**e-n]];}
  if(t===3){const n=R(4,15);return[`√${n*n} = ?`,n,[n+1,n-1,n+2,2*n]];}
  if(t===4){const a=R(-12,12)||7,b=R(-12,12)||-5;return[`${S(a)} − ${PN(b)} = ?`,S(a-b),[S(a+b),S(b-a),S(a-b+2),S(a-b-2)]];}
  const p=pick([10,20,25,50,75]),m={10:10,20:5,25:4,50:2,75:4}[p],n=R(2,Math.floor(99/m))*m,v=p*n/100;return[`${p}% of ${n} = ?`,v,[v*2,n-v,v+p,v*10]];};
{const t=T('A-SSE.1','Quick calculation',QI9);t.calc=true;G[9].push(t);}
GRADES.push(9);
