
// ---- helpers for signed numbers and algebra ----
const S=n=>n<0?`−${-n}`:String(n);
const SD=(x,p=2)=>x<0?`−${D(-x,p)}`:D(x,p);
const PN=n=>n<0?`(−${-n})`:String(n);               // parenthesize negatives inside expressions
const op=n=>n<0?`− ${-n}`:`+ ${n}`;
const lin=(a,b)=>`${a===1?'':a===-1?'−':a<0?'−'+(-a):a}x ${op(b)}`;
const SUP='⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup=n=>String(n).split('').map(c=>SUP[+c]).join('');

G[7]=[
T('7.NS.1','Add and subtract integers',()=>{
  const a=R(-15,15),b=R(-15,15);
  if(Math.random()<.5)return[`${S(a)} + ${PN(b)} = ?`,S(a+b),[S(a-b),S(-(a+b)),S(a+b+2),S(a+b-2)]];
  return[`${S(a)} − ${PN(b)} = ?`,S(a-b),[S(a+b),S(b-a),S(a-b+2),S(a-b-2)]];}),
T('7.NS.2','Multiply and divide integers',()=>{
  let a=R(-9,9),b=R(-9,9);if(!a)a=4;if(!b)b=-3;
  if(Math.random()<.5)return[`${S(a)} × ${PN(b)} = ?`,S(a*b),[S(-a*b),S(a+b),S(a*b+a),S(a*b-b)]];
  const p=a*b;return[`${S(p)} ÷ ${PN(a)} = ?`,S(b),[S(-b),S(b+1),S(b-1),S(a)]];}),
T('7.NS.3','Decimals and negatives',()=>{
  let A=R(-50,50),B=R(-50,50);if(!A)A=15;if(!B)B=-23;const s=A+B;
  return[`${SD(A/10,1)} + ${B<0?`(${SD(B/10,1)})`:SD(B/10,1)} = ?`,SD(s/10,1),[SD((A-B)/10,1),SD(-s/10,1),SD((s+10)/10,1),SD((s-10)/10,1)]];}),
T('7.RP.2','Proportions',()=>{const a=R(2,6),u=R(2,9),k=R(7,15);return[`${a} notebooks cost $${a*u}. How many dollars do ${k} notebooks cost?`,k*u,[k*u+u,k*u-u,a*u+k,k+u]];}),
T('7.RP.3','Discounts and percent',()=>{
  const P=pick([20,40,60,80]),p=pick([10,20,25,30,40,50]),d=P*p/100;
  return Math.random()<.5?[`A jacket costs $${P}. It is ${p}% off. What is the sale price in dollars?`,P-d,[d,P+d,P-p,P-d+10]]:[`A game costs $${P}. Sales tax is ${p}%. What is the total price in dollars?`,P+d,[d,P-d,P+p,P+d+10]];}),
T('7.EE.1','Combine like terms',()=>{
  let a,b,c,d;do{a=R(2,9);c=R(2,9);b=R(1,9)*pick([1,-1]);d=R(1,9)*pick([1,-1]);}while(b+d===0);
  return[`Simplify: ${a}x ${op(b)} + ${c}x ${op(d)}`,lin(a+c,b+d),[lin(a+c,b-d),lin(a-c,b+d),lin(a+c+1,b+d),lin(a+c,b+d+2)]];}),
T('7.EE.1','Distributive property',()=>{
  const k=R(2,9),m=R(1,9)*pick([1,-1]);
  return[`Expand: ${k}(x ${op(m)})`,lin(k,k*m),[lin(k,m),lin(k,k+m),lin(k,-k*m),lin(1,k*m)]];}),
T('7.EE.4','Two-step equations',()=>{
  let a=R(2,9),x=R(-6,9),b=R(1,12)*pick([1,-1]);if(!x)x=3;const c=a*x+b;
  return[`Solve: ${a}x ${op(b)} = ${S(c)}`,S(x),[S(x+1),S(x-1),S(-x),S(c-b)]];}),
T('7.EE.4','Inequalities',()=>{
  const a=R(2,12),b=a+R(2,15),lt=Math.random()<.5;
  return lt?[`Solve: x + ${a} < ${b}`,`x < ${b-a}`,[`x > ${b-a}`,`x < ${b+a}`,`x > ${b+a}`]]:[`Solve: x + ${a} > ${b}`,`x > ${b-a}`,[`x < ${b-a}`,`x > ${b+a}`,`x < ${b+a}`]];}),
T('7.G.4','Circles',()=>{
  const r=R(2,10);
  return Math.random()<.5?[`A circle has radius ${r} cm. Using π = 3.14, what is its circumference in cm?`,D(2*3.14*r,2),[D(3.14*r*r,2),D(3.14*r,2),D(2*3.14*r*r,2)]]:[`A circle has radius ${r} cm. Using π = 3.14, what is its area in square cm?`,D(3.14*r*r,2),[D(2*3.14*r,2),D(3.14*2*r*2,2),D(3.14*r,2)]];}),
T('7.G.5','Supplementary and complementary angles',()=>{
  const a=R(20,80);
  return Math.random()<.5?[`Two angles are supplementary (they add to 180°). One is ${a}°. How big is the other, in degrees?`,180-a,[90-a,a,360-a,180-a+10]]:[`Two angles are complementary (they add to 90°). One is ${a}°. How big is the other, in degrees?`,90-a,[180-a,a,90-a+10,a-10>0?a-10:5]];}),
T('7.SP.5','Probability',()=>{
  const r=R(2,7),b=R(2,7),g=R(2,7),t=r+b+g;
  return[`A bag has ${r} red, ${b} blue and ${g} green marbles. What is the probability of picking a blue marble?`,F(b,t),[F(b,r+g),F(r,t),F(b+1,t),F(t-b,t)]];}),
T('6.EE.1 review','Review: order of operations',()=>{const a=R(2,9),b=R(2,5),c=R(2,5);return[`${a} + ${c} × ${b}${sup(2)} = ?`,a+c*b*b,[(a+c)*b*b,a+c*b*2,a+(c*b)**2,a+c+b*b]];}),
T('5.NF.1 review','Review: subtract fractions',()=>{
  let d1,d2,n1,n2;do{d1=pick([2,3,4,5,6,8]);d2=pick([2,3,4,5,6,8]);n1=R(1,d1-1);n2=R(1,d2-1);}while(d1===d2||n1*d2<=n2*d1);
  const top=n1*d2-n2*d1,bot=d1*d2;
  return[`${FR(n1,d1)} − ${FR(n2,d2)} = ?`,F(top,bot),[F(n1-n2,d1-d2>0?d1-d2:d1+d2),F(top+1,bot),F(top,bot+1),F(n1*d2+n2*d1,bot)]];}),
];

G[8]=[
T('8.EE.1','Exponent rules',()=>{
  const b=pick(['x','y','a','2','3']),t=R(0,2);
  if(t===0){const m=R(2,5),n=R(2,4);return[`${b}${sup(m)} × ${b}${sup(n)} = ?`,`${b}${sup(m+n)}`,[`${b}${sup(m*n)}`,`${b}${sup(m+n+1)}`,`${b}${sup(m+n-1)}`,`${b}${sup(m+n+2)}`]];}
  if(t===1){const n=R(2,4),m=n+R(2,5);return[`${b}${sup(m)} ÷ ${b}${sup(n)} = ?`,`${b}${sup(m-n)}`,[`${b}${sup(m+n)}`,`${b}${sup(m*n)}`,`${b}${sup(m-n+1)}`,`${b}${sup(m-n+2)}`]];}
  const m=R(2,4),n=R(2,3);return[`(${b}${sup(m)})${sup(n)} = ?`,`${b}${sup(m*n)}`,[`${b}${sup(m+n)}`,`${b}${sup(m*n+1)}`,`${b}${sup(m*n-1)}`,`${b}${sup(m*n+2)}`]];}),
T('8.EE.2','Square and cube roots',()=>{
  if(Math.random()<.5){const n=R(3,15);return[`√${n*n} = ?`,n,[n*2,n+1,n-1,n*n/2>0?Math.round(n*n/2):1]];}
  const n=R(2,6);return[`∛${n**3} = ?`,n,[n*3,n+1,n-1,n**3/3>0?Math.round(n**3/3):1]];}),
T('8.EE.3','Scientific notation',()=>{
  const m=R(11,99)/10,e=R(3,7),v=Math.round(m*10**e);
  return[`Write ${v.toLocaleString('en-US')} in scientific notation.`,`${D(m,1)} × 10${sup(e)}`,[`${D(m,1)} × 10${sup(e+1)}`,`${D(m,1)} × 10${sup(e-1)}`,`${D(m,1)} × 10${sup(e+2)}`]];}),
T('8.EE.7','Equations with variables on both sides',()=>{
  if(Math.random()<.65){
    let a,c,b,d,x;do{a=R(3,9);c=R(1,a-1);x=R(-5,9);b=R(1,10)*pick([1,-1]);d=(a-c)*x+b;}while(d===0||x===0);
    return[`Solve: ${a}x ${op(b)} = ${c}x ${op(d)}`,S(x),[S(x+1),S(x-1),S(-x),S(x+2)]];}
  const k=R(2,6),m=R(1,6)*pick([1,-1]),x=R(-4,8)||2,c=k*(x+m);
  return[`Solve: ${k}(x ${op(m)}) = ${S(c)}`,S(x),[S(x+m),S(x-m),S(x+1),S(-x)]];}),
T('8.EE.5','Slope',()=>{
  let m=R(-4,5);if(!m)m=2;const x1=R(-4,3),y1=R(-5,5),dx=R(1,4),x2=x1+dx,y2=y1+m*dx;
  return[`What is the slope of the line through (${S(x1)}, ${S(y1)}) and (${S(x2)}, ${S(y2)})?`,S(m),[S(-m),S(dx),S(m*dx),S(m+1)]];}),
T('8.F.3','Lines and functions',()=>{
  const m=R(2,6)*pick([1,-1]),b=R(1,9)*pick([1,-1]);
  if(Math.random()<.5)return[`What is the y-intercept of y = ${lin(m,b)}?`.replace('x ','x ').replace('y = ','y = '),S(b),[S(m),S(-b),S(b+m),S(b-1)]];
  const k=R(1,6);return[`If y = ${lin(m,b)}, what is y when x = ${k}?`,S(m*k+b),[S(m*k-b),S(m+b+k),S(m*(k+b)),S(m*k+b+m)]];}),
T('8.EE.8','Systems of equations',()=>{
  let x=R(2,9),y=R(1,x-1);const s=x+y,d=x-y,askX=Math.random()<.5;
  return askX?[`If x + y = ${s} and x − y = ${d}, what is x?`,x,[y,x+1,x-1,s]]:[`If x + y = ${s} and x − y = ${d}, what is y?`,y,[x,y+1,y>1?y-1:y+2,d]];}),
T('8.G.7','Pythagorean theorem',()=>{
  const[a,b,c]=pick([[3,4,5],[5,12,13],[8,15,17],[6,8,10],[9,12,15]]);
  return Math.random()<.5?[`A right triangle has legs ${a} and ${b}. What is the hypotenuse?`,c,[a+b,c+1,c-1,b-a||1]]:[`A right triangle has hypotenuse ${c} and one leg ${a}. What is the other leg?`,b,[c-a,b+1,b-1,c+a]];}),
T('8.G.9','Volume of cylinders',()=>{
  const r=R(2,6),h=R(2,10);
  return[`A cylinder has radius ${r} cm and height ${h} cm. What is its volume in terms of π (cubic cm)?`,`${r*r*h}π`,[`${2*r*h}π`,`${r*h}π`,`${r*r*h/3===Math.floor(r*r*h/3)?r*r*h/3:r*r*h+r}π`,`${(r+h)**2}π`]];}),
T('8.NS.2','Estimate square roots',()=>{
  const m=R(2,11),n=R(m*m+1,(m+1)**2-1);
  return[`√${n} is between which two consecutive whole numbers?`,`${m} and ${m+1}`,[`${m-1} and ${m}`,`${m+1} and ${m+2}`,`${m} and ${m+2}`]];}),
T('7.RP.3 review','Review: percent increase',()=>{
  const o=R(1,3)*20,p=pick([10,20,25,50]),n=o+o*p/100;
  return[`A price goes from $${o} to $${n}. What is the percent increase?`,`${p}%`,[`${p/2}%`,`${p*2}%`,`${p+5}%`,`${p-5>0?p-5:p+15}%`]];}),
T('7.RP.2 review','Review: solve proportions',()=>{
  const a=R(2,7),b=R(a+1,9),k=R(2,6);
  return[`${FR(a,b)} = ${FR('x',b*k)}   Solve for x.`,a*k,[a+k,b*k,a*k+b,a*k-a]];}),
];

const GRADES=[3,4,5,6,7,8];
