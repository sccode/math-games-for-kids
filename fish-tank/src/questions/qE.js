
// ---- grade 6: harder, wider set of topics (ratios, percent, factoring, coordinate plane, statistics, more) ----
const fx=a=>a===1?'x':`${a}x`;
const PM={10:10,20:5,25:4,50:2,75:4};                       // multiple a whole must be so that p% is a whole number
const coprime=(lo,hi)=>{let a,b;do{a=R(lo,hi);b=R(lo,hi);}while(a===b||gcd(a,b)>1);return[a,b];};
G[6].push(
T('6.RP.1','Ratios',()=>{
  const[a,b]=coprime(1,9);
  if(Math.random()<.5){const k=R(2,5),x=a*k,y=b*k;
    return[`A class has ${x} boys and ${y} girls. What is the ratio of boys to girls in simplest form?`,`${a} : ${b}`,[`${b} : ${a}`,`${x} : ${y}`,`${a} : ${a+b}`,`${x} : ${x+y}`]];}
  const k=R(2,6);return[`${a} : ${b} = ${a*k} : ?`,b*k,[b+k,a*k+b,b*k+a,b*k-b]];}),
T('6.RP.3','Percent: find the whole or the percent',()=>{
  const p=pick([10,20,25,50,75]),m=PM[p],n=R(2,Math.floor(99/m))*m,part=n*p/100;
  if(Math.random()<.5)return[`${part} is ${p}% of what number?`,n,[part+p,n-part,part*p,n+10]];
  return[`What percent of ${n} is ${part}?`,`${p}%`,[`${100-p}%`,`${p*2}%`,`${p+10}%`,`${part}%`]];}),
T('6.NS.4','Factor with the GCF',()=>{
  const g=R(2,9),[a,b]=coprime(1,6);
  return[`Factor: ${fx(g*a)} + ${g*b}`,`${g}(${fx(a)} + ${b})`,[`${g}(${fx(a)} + ${g*b})`,`${g}(${fx(a)} − ${b})`,`${g+1}(${fx(a)} + ${b})`,`${g}(${fx(a+1)} + ${b})`]];}),
T('6.EE.2','Evaluate with two variables or exponents',()=>{
  const x=R(2,6),y=R(2,6),a=R(2,5),b=R(2,5);
  if(Math.random()<.5)return[`Evaluate ${a}x + ${b}y when x = ${x} and y = ${y}.`,a*x+b*y,[a+x+b+y,a*b*(x+y),a*x+b+y,(a+b)*(x+y)]];
  return[`Evaluate x${sup(2)} + ${a}x when x = ${x}.`,x*x+a*x,[2*x+a*x,x*x+a+x,x*x+a*x+x,(x+a)**2]];}),
T('6.EE.1','Order of operations with exponents',()=>{
  const a=R(2,9),b=R(2,4),c=R(2,6);
  if(Math.random()<.5)return[`${a} + ${b}${sup(2)} × ${c} = ?`,a+b*b*c,[(a+b)**2*c,a+b*b+c,a+b*c*2,(a+b*b)*c]];
  return[`(${a} + ${b})${sup(2)} − ${c} = ?`,(a+b)**2-c,[a*a+b*b-c,(a+b)*2-c,(a+b)**2+c,a*a+b-c]];}),
T('6.EE.7','Equations with decimals and fractions',()=>{
  const t=R(0,2);
  if(t===0){const x=R(2,20)*2;return[`Solve: 0.5x = ${x/2}`,x,[x/2,x/4,x+2,x*2]];}
  if(t===1){const x=R(11,69),a=R(2,9);return[`Solve: x + ${D(a/10,1)} = ${D(x/10+a/10,1)}`,D(x/10,1),[D(x/10+a/10,1),D(x/10-a/10,1),D(x/10+0.1,1),D(x/10-0.1,1)]];}
  const d=R(2,5),n=R(2,9);return[`Solve: ${FR(1,d)}x = ${n}`,n*d,[n+d,d,n*d+d,n*d-n]];}),
T('6.EE.8','Inequalities: pick a solution',()=>{
  const gt=Math.random()<.5,n=R(4,12);
  return gt?[`Which number is a solution of x > ${n}?`,n+R(1,4),[n,n-1,n-2,n-R(3,4)]]:[`Which number is a solution of x < ${n}?`,n-R(1,3),[n,n+1,n+2,n+R(3,4)]];}),
T('6.NS.6','The coordinate plane',()=>{
  const t=R(0,2),sx=pick([1,-1]),sy=pick([1,-1]),x=R(1,9)*sx,y=R(1,9)*sy;
  if(t===0){const q=x>0&&y>0?'I':x<0&&y>0?'II':x<0&&y<0?'III':'IV',all=['I','II','III','IV'];
    return[`Which quadrant is the point (${S(x)}, ${S(y)}) in?`,`Quadrant ${q}`,all.filter(z=>z!==q).map(z=>`Quadrant ${z}`)];}
  if(t===1)return[`Reflect (${S(x)}, ${S(y)}) across the x-axis. What are the new coordinates?`,`(${S(x)}, ${S(-y)})`,[`(${S(-x)}, ${S(y)})`,`(${S(-x)}, ${S(-y)})`,`(${S(y)}, ${S(x)})`]];
  const a=R(1,9),b=R(1,9);return[`How far apart are the points (${S(x)}, ${a}) and (${S(x)}, ${S(-b)})?`,a+b,[Math.abs(a-b)||a+b+2,a,b,a+b+1]];}),
T('6.SP.5','Median, mode and range',()=>{
  const t=R(0,2);
  if(t===2){const rep=R(2,15),others=shuf([...Array(20).keys()].map(v=>v+1).filter(v=>v!==rep)).slice(0,4),arr=shuf([rep,rep,...others]);
    return[`What is the mode of ${arr.join(', ')}?`,rep,others.slice(0,3)];}
  const s=new Set();while(s.size<5)s.add(R(2,30));const arr=shuf([...s]),sorted=arr.slice().sort((p,q)=>p-q);
  if(t===0)return[`What is the median of ${arr.join(', ')}?`,sorted[2],[arr[2],sorted[1],sorted[3],sorted[4]-sorted[0]]];
  return[`What is the range of ${arr.join(', ')}?`,sorted[4]-sorted[0],[sorted[4],sorted[0],sorted[4]+sorted[0],sorted[2]]];}),
T('6.G.1','Area of parallelograms and trapezoids',()=>{
  if(Math.random()<.5){const b=R(4,14),h=R(3,9);return[`A parallelogram has base ${b} cm and height ${h} cm. What is its area in square cm?`,b*h,[b*h/2,2*(b+h),b+h,b*h+b]];}
  let a,b,h;do{a=R(3,9);b=R(a+1,12);h=R(2,8);}while((a+b)*h%2);
  return[`A trapezoid has parallel sides ${a} cm and ${b} cm, and height ${h} cm. What is its area in square cm?`,(a+b)*h/2,[(a+b)*h,a*b*h/2,a+b+h,(a+b)*h/2+h]];}),
);
