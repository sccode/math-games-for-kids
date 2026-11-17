
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
