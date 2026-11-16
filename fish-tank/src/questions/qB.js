
G[5]=[
T('5.NBT.5','Multiply two-digit numbers',()=>{const a=R(12,49),b=R(11,29),p=a*b;return[`${a} × ${b} = ?`,p,[p+10,p-10,p+100,p-a]];}),
T('5.NBT.6','Divide by two-digit numbers',()=>{const d=R(11,33),q=R(2,Math.floor(99/d));return[`${d*q} ÷ ${d} = ?`,q,[q+1,q-1,q+10,q-10]];}),
T('5.NBT.7','Add and subtract decimals',()=>{
  let A=R(110,990),B=R(110,990);while(A===B)B=R(110,990);
  if(Math.random()<.5){const s=A+B;return[`${(A/100).toFixed(2)} + ${(B/100).toFixed(2)} = ?`,(s/100).toFixed(2),[((s+10)/100).toFixed(2),((s-10)/100).toFixed(2),((s+100)/100).toFixed(2),((s-1)/100).toFixed(2)]];}
  const hi=Math.max(A,B),lo=Math.min(A,B),d=hi-lo||1;return[`${(hi/100).toFixed(2)} − ${(lo/100).toFixed(2)} = ?`,(d/100).toFixed(2),[((d+10)/100).toFixed(2),((d-10)/100).toFixed(2),((d+100)/100).toFixed(2),((d+1)/100).toFixed(2)]];}),
T('5.NBT.7','Multiply decimals',()=>{const A=R(2,9),B=R(2,9),p=A*B;return[`${D(A/10,1)} × ${D(B/10,1)} = ?`,D(p/100,2),[D(p/10,1),D(p/1000,3),D(p,0),D((p+10)/100,2)]];}),
T('5.NBT.2','Multiply and divide by powers of 10',()=>{const v=R(12,99)/10,p=pick([10,100,1000]);
  if(Math.random()<.5)return[`${v} × ${p} = ?`,D(v*p),[D(v*p*10),D(v*p/10),D(v/p,5),D(v+p)]];
  return[`${v} ÷ ${p} = ?`,D(v/p,5),[D(v*p),D(v/p*10,5),D(v/p/10,5),D(v/p+1,5)]];}),
T('5.NBT.3','Compare decimals',()=>{const s=new Set();while(s.size<4)s.add(R(100,999));const a=[...s].map(x=>x/1000),m=Math.max(...a);return['Which decimal is the greatest?',D(m,3),a.filter(x=>x!==m).map(x=>D(x,3))];}),
T('5.NF.1','Add fractions, unlike denominators',()=>{
  let d1,d2;do{d1=pick([2,3,4,5,6]);d2=pick([2,3,4,5,6]);}while(d1===d2||gcd(d1,d2)>1);
  const n1=R(1,d1-1),n2=R(1,d2-1),top=n1*d2+n2*d1,bot=d1*d2;
  return[`${FR(n1,d1)} + ${FR(n2,d2)} = ?`,F(top,bot),[F(n1+n2,d1+d2),F(n1+n2,bot),F(top+1,bot),F(top-1,bot)]];}),
T('5.NF.4','Multiply fractions',()=>{
  const d1=R(2,6),d2=R(2,6),n1=R(1,d1-1),n2=R(1,d2-1);
  return[`${FR(n1,d1)} × ${FR(n2,d2)} = ?`,F(n1*n2,d1*d2),[F(n1+n2,d1+d2),F(n1*n2,d1+d2),F(n1*d2,d1*n2),F(n1*n2+1,d1*d2)]];}),
T('5.NF.7','Divide with unit fractions',()=>{
  const w=R(2,8),d=R(2,6);
  return Math.random()<.5?[`${w} ÷ ${FR(1,d)} = ?`,w*d,[w+d,F(1,w*d),w*d+d,w*d-w]]:[`${FR(1,d)} ÷ ${w} = ?`,F(1,d*w),[d*w,F(w,d),F(1,d+w),F(1,d*w+1)]];}),
T('5.OA.1','Order of operations',()=>{
  const a=R(2,9),b=R(2,9),c=R(2,9);
  if(Math.random()<.5)return[`${a} + ${b} × ${c} = ?`,a+b*c,[(a+b)*c,a*b+c,a+b+c,a+b*c+b]];
  return[`(${a} + ${b}) × ${c} = ?`,(a+b)*c,[a+b*c,a*b+c,(a+b)+c,(a+b)*c+c]];}),
T('5.MD.5','Volume of boxes',()=>{const l=R(2,9),w=R(2,8),h=R(2,7);return[`A box is ${l} cm long, ${w} cm wide and ${h} cm tall. What is its volume in cubic cm?`,l*w*h,[l*w+h,l+w+h,2*(l*w+l*h+w*h),l*w*h+l]];}),
];

G[6]=[
T('6.NS.1','Divide fractions',()=>{
  const d1=R(2,6),d2=R(2,6),n1=R(1,d1+2),n2=R(1,d2-1||1);
  return[`${FR(n1,d1)} ÷ ${FR(n2,d2)} = ?`,F(n1*d2,d1*n2),[F(n1*n2,d1*d2),F(d1*n2,n1*d2),F(n1*d2+1,d1*n2),F(n1*d2,d1*n2+1)]];}),
T('6.NS.4','GCF and LCM',()=>{
  let g,a,b;do{g=R(2,9);a=R(2,6);b=R(2,6);}while(a===b||gcd(a,b)>1);
  const x=g*a,y=g*b;
  return Math.random()<.5?[`What is the greatest common factor (GCF) of ${x} and ${y}?`,g,[g+1,g*2,g*a*b,a*b]]:[`What is the least common multiple (LCM) of ${x} and ${y}?`,g*a*b,[g,x*y,g*a*b*2,x+y]];}),
T('6.NS.5','Opposites and absolute value',()=>{
  const n=R(2,19);
  const t=R(0,2);
  if(t===0)return[`What is |−${n}|?`,n,[`−${n}`,0,n+1,n-1]];
  if(t===1)return[`What is the opposite of −${n}?`,n,[`−${n}`,0,n+1,`−${n+1}`]];
  return[`What is −(−${n})?`,n,[`−${n}`,0,n+1,`−${n+1}`]];}),
T('6.NS.7','Order integers',()=>{const s=new Set();while(s.size<4)s.add(R(-12,12));const a=[...s],m=Math.min(...a),f=x=>x<0?`−${-x}`:String(x);return['Which number is the least?',f(m),a.filter(x=>x!==m).map(f)];}),
T('6.RP.2','Unit rates',()=>{const h=R(2,8),r=R(6,Math.min(15,Math.floor(99/h))),d=h*r;return[`A car travels ${d} miles in ${h} hours at a steady speed. How many miles per hour is that?`,r,[r+h,d-h,h,r*2]];}),
T('6.RP.3','Percent of a number',()=>{const p=pick([10,20,25,50,75]),m={10:10,20:5,25:4,50:2,75:4}[p],n=R(2,Math.floor(99/m))*m,a=p*n/100;return[`What is ${p}% of ${n}?`,a,[n-a,a*10,p+n,a+p]];}),
T('6.EE.1','Exponents',()=>{const a=R(2,5),b=R(2,4);return[`${a}${'⁰¹²³⁴⁵'[b]} = ?`,a**b,[a*b,a**(b+1),a+b,a**b+a]];}),
T('6.EE.2','Evaluate expressions',()=>{const a=R(2,9),b=R(1,9),x=R(2,9);return[`Evaluate ${a}x + ${b} when x = ${x}.`,a*x+b,[a*x-b,a*(x+b),a+x+b,a+b*x]];}),
T('6.EE.7','One-step equations',()=>{
  const t=R(0,3),a=R(2,9),x=R(2,Math.min(12,Math.floor(99/a)));
  if(t===0)return[`Solve: x + ${a} = ${x+a}`,x,[x+a*2,x+1,a,x-1]];
  if(t===1)return[`Solve: x − ${a} = ${x}`,x+a,[x-a,x,x+a+1,a]];
  if(t===2)return[`Solve: ${a}x = ${a*x}`,x,[a*x,x+1,a,x-1]];
  return[`Solve: x ÷ ${a} = ${x}`,x*a,[x+a,x,x*a+a,x*a-a]];}),
T('6.G.1','Area of triangles',()=>{const b=R(4,16);let h=R(2,12);if(b*h%2)h++;return[`A triangle has base ${b} cm and height ${h} cm. What is its area in square cm?`,b*h/2,[b*h,b+h,b*h/2+b,b*h/2-h]];}),
T('6.SP.5','Mean',()=>{
  let a,m,sum;do{m=R(5,20);a=[R(m-4,m+4),R(m-4,m+4),R(m-4,m+4),R(m-4,m+4)];const last=5*m-a.reduce((x,y)=>x+y,0);a.push(last);}while(a[4]<1||a[4]>40);
  const sorted=a.slice().sort((x,y)=>x-y);
  return[`What is the mean of ${shuf(a).join(', ')}?`,m,[sorted[2],m+1,m-1,sorted[4]-sorted[0]]];}),
];
