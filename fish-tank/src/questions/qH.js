
// ---- coverage fill: grades 7 and 8 ----
const SF=(n,d)=>{const g=gcd(n,d)||1;n/=g;d/=g;if(d<0){n=-n;d=-d;}if(n===0)return'0';return(n<0?'−':'')+(d===1?String(Math.abs(n)):FR(Math.abs(n),d));};
const PF=(n,d)=>n<0?`(${SF(n,d)})`:SF(n,d);
const sgn=()=>pick([1,-1]);
G[7].push(
T('7.RP.1','Unit rates with fractions',()=>{
  const tn=R(1,3),td=R(tn+1,5),r=R(2,9),dist=F(r*tn,td);
  return[`A cyclist rides ${dist} miles in ${FR(tn,td)} hour at a steady speed. How many miles per hour is that?`,r,[r+1,r-1,r*2,r+tn]];}),
T('7.RP.2','Constant of proportionality',()=>{
  const k=R(2,9);
  if(Math.random()<.5){const x1=R(1,3),x2=R(4,7);return[`In a proportional relationship, y = ${x1*k} when x = ${x1}, and y = ${x2*k} when x = ${x2}. What is the constant of proportionality?`,k,[k+1,k-1>0?k-1:k+2,x1*k,x2*k-x2]];}
  return['Which equation shows a proportional relationship?',`y = ${k}x`,[`y = x + ${k}`,`y = ${k}x + 2`,`y = ${k} − x`]];}),
T('7.NS.1','Add and subtract fractions with negatives',()=>{
  const d1=pick([2,3,4,6]),d2=pick([2,3,4,6]),n1=R(1,d1-1)*sgn(),n2=R(1,d2-1)*sgn(),top=n1*d2+n2*d1,bot=d1*d2;
  return[`${SF(n1,d1)} + ${PF(n2,d2)} = ?`,SF(top,bot),[SF(n1+n2,d1+d2),SF(-top,bot),SF(n1*d2-n2*d1,bot),SF(top+1,bot)]];}),
T('7.NS.2','Multiply and divide fractions with negatives',()=>{
  const d1=R(2,6),d2=R(2,6),n1=R(1,d1+1)*sgn(),n2=R(1,d2+1)*sgn();
  if(Math.random()<.5)return[`${SF(n1,d1)} × ${PF(n2,d2)} = ?`,SF(n1*n2,d1*d2),[SF(-n1*n2,d1*d2),SF(n1+n2,d1+d2),SF(n1*n2,d1+d2),SF(n1*d2,d1*n2)]];
  return[`${SF(n1,d1)} ÷ ${PF(n2,d2)} = ?`,SF(n1*d2,d1*n2),[SF(-n1*d2,d1*n2),SF(n1*n2,d1*d2),SF(d1*n2,n1*d2),SF(n1*d2+1,d1*n2)]];}),
T('7.NS.2','Fractions as decimals',()=>{
  const d=pick([2,4,5,8,10,20,25]),n=R(1,d-1);return[`Write ${FR(n,d)} as a decimal.`,D(n/d,4),[D(d/n,4),D(n/d*10,3),D(n/(d+1),4),D(n/d+0.1,4)]];}),
T('7.NS.3','Rational numbers in real life',()=>{
  const a=R(2,15),b=R(a+2,30);
  return Math.random()<.5?[`At 6 a.m. the temperature was ${S(-a)}°F. By noon it rose ${b}°F. What was the temperature at noon?`,`${S(b-a)}°F`,[`${S(-a-b)}°F`,`${S(a-b)}°F`,`${S(b+a)}°F`]]
    :[`A submarine is at ${S(-b)} meters. It rises ${a} meters. What is its new depth?`,`${S(a-b)} m`,[`${S(-b-a)} m`,`${S(b-a)} m`,`${S(a+b)} m`]];}),
T('7.EE.2','Rewrite expressions',()=>{
  if(Math.random()<.5){const p=pick([5,8,10,15,20]);return[`Which expression is equal to x + ${D(p/100,2)}x?`,`${D(1+p/100,2)}x`,[`${D(p/100,2)}x`,`${D(1-p/100,2)}x`,`${D(1+p/10,2)}x`]];}
  const k=R(2,6),a=R(2,5),b=R(1,6);return[`Which expression is equivalent to ${k}(${a}x − ${b})?`,`${k*a}x − ${k*b}`,[`${k*a}x − ${b}`,`${k+a}x − ${k*b}`,`${k*a}x + ${k*b}`]];}),
T('7.EE.3','Multi-step problems',()=>{
  if(Math.random()<.5){const P=pick([40,80]),dc=pick([25,50]),tx=pick([10,20,50]),sale=P-P*dc/100,tot=sale+sale*tx/100;
    return[`A jacket costs $${P}. It is ${dc}% off. Then ${tx}% sales tax is added to the sale price. What is the final price in dollars?`,tot,[sale,P+P*tx/100-P*dc/100,P*(1+tx/100),sale-sale*tx/100]];}
  const w=R(5,12),h=R(2,9),b=R(5,20);return[`Sam earns $${w} for each hour he works, plus a $${b} bonus. He earned $${w*h+b} in all. How many hours did he work?`,h,[h+1,h-1>0?h-1:h+2,w*h+b-w,(w*h+b)/w>0?Math.round((w*h+b)/w):h+3]];}),
T('7.EE.4','Two-step inequalities',()=>{
  const x0=R(1,9);
  if(Math.random()<.5){const a=R(2,6),b=R(1,9),c=a*x0+b;return[`Solve: ${a}x + ${b} > ${c}`,`x > ${x0}`,[`x < ${x0}`,`x > ${c-b}`,`x > ${x0+b}`]];}
  const a=R(2,6);return[`Solve: −${a}x < ${a*x0}`,`x > ${S(-x0)}`,[`x < ${S(-x0)}`,`x > ${x0}`,`x < ${x0}`]];}),
T('7.G.1','Scale drawings',()=>{
  const b=R(2,9),n=R(2,9);
  return Math.random()<.5?[`On a map, 1 inch represents ${b} miles. A road is ${n} inches long on the map. How long is the real road in miles?`,n*b,[n+b,n*b+b,n*b-n,b]]
    :[`A scale drawing uses 1 cm for every ${b} m. A wall is ${b*n} m long. How long is the wall in the drawing, in cm?`,n,[n+1,b*n,n*b-b,b]];}),
T('7.G.2','Can it be a triangle?',()=>{
  const mk=()=>{const a=R(3,9),b=R(a,9),c=R(b-a+1,a+b-1);return[a,b,c];},bad=()=>{const a=R(2,6),b=R(2,6),c=a+b+R(0,3);return[a,b,c];};
  const f=t=>shuf(t).map(x=>`${x} cm`).join(', '),ok=mk();const ws=new Set();while(ws.size<3)ws.add(f(bad()));return['Which three side lengths can form a triangle?',f(ok),[...ws].filter(z=>z!==f(ok))];}),
T('7.G.3','Cross-sections',VOC([
  ['A plane slices a rectangular prism parallel to its base. What is the cross-section?','Rectangle',['Triangle','Circle','Hexagon']],
  ['A plane slices a cylinder parallel to its bases. What is the cross-section?','Circle',['Rectangle','Triangle','Oval that is not a circle']],
  ['A plane slices a cube parallel to one of its faces. What is the cross-section?','Square',['Triangle','Circle','Pentagon']],
  ['A plane slices a sphere. What is the cross-section?','Circle',['Square','Triangle','Rectangle']],
  ['A plane slices a cone parallel to its base. What is the cross-section?','Circle',['Triangle','Square','Rectangle']],
  ['A plane slices a square pyramid parallel to its base. What is the cross-section?','Square',['Triangle','Circle','Pentagon']],
])),
T('7.G.5','Vertical and adjacent angles',()=>{
  const a=R(20,80)+R(0,1)*50;
  return Math.random()<.5?[`Two lines cross. One angle is ${a}°. What is the measure of the vertical angle across from it?`,a,[180-a,90-a>0?90-a:a+10,360-a,a+10]]
    :[`Two lines cross. One angle is ${a}°. What is the measure of an adjacent angle?`,180-a,[a,90-a>0?90-a:a+10,360-a,180-a+10]];}),
T('7.G.6','Area and volume',()=>{
  if(Math.random()<.5){let b,h;do{b=R(3,9);h=R(2,8);}while(b*h%2);const L=R(2,9);return[`A triangular prism has a triangle base of ${b} cm and height ${h} cm. The prism is ${L} cm long. What is its volume in cubic cm?`,b*h/2*L,[b*h*L,b*h/2+L,b+h+L,b*h/2*L+L]];}
  const a=R(6,12),b=R(5,10),c=R(2,Math.min(a,b)-1);return[`A rectangle is ${a} cm by ${b} cm. A ${c} cm by ${c} cm square is cut out of one corner. What is the area that is left, in square cm?`,a*b-c*c,[a*b,a*b-2*c,a*b+c*c,a*b-c]];}),
T('7.SP.1','Sampling',()=>{
  const L=[['Which sample best represents the favorite lunch of all 7th graders in a school?','50 students chosen at random from the whole grade',['The first 10 students in the cafeteria line','Only the students on the soccer team','The students in one classroom']],
    ['A school wants to know how students get to school. Which sample is most likely to be representative?','A random sample of 60 students from the school list',['The students who ride the bus','The first 20 students who arrive','Only the 8th graders']],
    ['Which is a random sample of a town of 5,000 people?','Names drawn from a hat holding every resident',['People at a shopping mall on Saturday','Members of a running club','Neighbors of the person doing the survey']]],[q,a,w]=pick(L);
  return[q,a,w];}),
T('7.SP.2','Inferences from a sample',()=>{
  const n=pick([5,10,20,25]),N=n*R(2,Math.floor(99/n)),k=R(1,n-1),p=k*(N/n);
  return[`In a random sample of ${n} students, ${k} like pizza best. About how many of ${N} students would be expected to like pizza best?`,p,[k*N,p+n,N-p,N/n]];}),
T('7.SP.3','Compare two data sets',()=>{
  const d=R(2,5),k=R(2,4),m1=R(10,20);return[`Class A has a mean of ${m1} and a mean absolute deviation of ${d}. Class B has a mean of ${m1+k*d} and the same mean absolute deviation. The difference between the means is how many times the mean absolute deviation?`,k,[k+1,k-1>0?k-1:k+2,k*d,d]];}),
T('7.SP.4','Compare means of two samples',()=>{
  const mk=m=>{const a=m+R(-3,3),b=m+R(-3,3),c=m+R(-3,3);return[a,b,c,4*m-a-b-c];};
  const mA=R(8,16),dd=R(2,6),mB=mA+dd,A=mk(mA),B=mk(mB);
  return[`Sample A: ${A.join(', ')}. Sample B: ${B.join(', ')}. How much greater is the mean of Sample B than the mean of Sample A?`,dd,[dd+1,dd-1>0?dd-1:dd+2,Math.max(...B)-Math.max(...A)===dd?dd+3:Math.max(...B)-Math.max(...A)>0?Math.max(...B)-Math.max(...A):dd+4,mB]];}),
T('7.SP.6','Experimental probability',()=>{
  if(Math.random()<.5){const n=R(10,40),h=R(3,n-3);return[`A coin lands heads up ${h} times in ${n} flips. What is the experimental probability of heads?`,F(h,n),[F(n-h,n),F(h,n+1),F(h,h+n),F(1,2)]];}
  const d=pick([2,3,4,5,6,10]),t=d*R(2,Math.floor(99/d));return[`The probability of an event is ${FR(1,d)}. About how many times would you expect it to happen in ${t} trials?`,t/d,[t/d+1,t*d>999?t:t*d,t-d,d]];}),
T('7.SP.7','Probability models',()=>{
  if(Math.random()<.5){const n=pick([4,6,8,10,12]);return[`A spinner has ${n} equal sections numbered 1 to ${n}. What is the probability of landing on an even number?`,F(n/2,n),[F(n/2-1,n),F(1,n),F(n/2+1,n),F(n/2,n-1)]];}
  const p1=R(2,9)*5,p2=R(2,9)*5;return[`A model says P(red) = ${p1}% and P(blue) = ${p2}%. All the other outcomes are green. What is P(green)?`,`${100-p1-p2}%`,[`${p1+p2}%`,`${100-p1}%`,`${100-p1-p2+5}%`,`${p1*p2/100}%`]];}),
T('7.SP.8','Compound events',()=>{
  const t=R(0,2);
  if(t===0){const a=R(2,5),b=R(2,6);return[`A shirt comes in ${a} colors and ${b} sizes. How many different shirts are possible?`,a*b,[a+b,a*b+a,a*b-b,2*(a+b)]];}
  if(t===1)return['You flip a coin and roll a number cube (1 to 6). How many different outcomes are possible?',12,[8,6,36,2]];
  return['You flip two coins. What is the probability that both land heads up?',FR(1,4),[FR(1,2),FR(1,3),FR(3,4)]];}),
);

const TRIPLES=[[3,4,5],[5,12,13],[8,15,17],[6,8,10],[9,12,15]];
G[8].push(
T('8.NS.1','Rational and irrational numbers',()=>{
  if(Math.random()<.5){const irr=['√2','√3','√5','√7','√10','π'],rat=['√16','√25','√49','0.25','−7',FR(2,3)];return['Which number is irrational?',pick(irr),shuf(rat).slice(0,3)];}
  const d=R(1,8);return[`Write 0.${d}${d}${d}… as a fraction.`,F(d,9),[FR(d,10),FR(d,100),FR(d,99),FR(d+1,9)]];}),
T('8.EE.1','Zero and negative exponents',()=>{
  if(Math.random()<.4){const b=R(2,9);return[`${b}${sup(0)} = ?`,1,[0,b,b*0+10,-1+2*b]].map((x,i)=>i===2&&Array.isArray(x)?x:x);}
  const b=R(2,5),n=R(1,3);return[`${b}⁻${sup(n)} = ?`,FR(1,b**n),[S(-(b**n)),FR(1,b*n),`${b**n}`,S(-b*n)]];}),
T('8.EE.2','Solve x² and x³',()=>{
  const n=R(3,12);return Math.random()<.6?[`If x² = ${n*n} and x is positive, what is x?`,n,[n*2,n+1,n-1,n*n/2>0?Math.round(n*n/2):1]]:[`If x³ = ${n**3<2000?(R(2,6)**3):8}, what is x?`,0,[1,2,3]].slice(0,0).concat([[`If x³ = 27, what is x?`,3,[9,6,2]]])[0];}),
T('8.EE.4','Scientific notation: multiply',()=>{
  const a=R(1,3),b=R(1,3),m=R(2,6),n=R(2,6);
  return[`(${a} × 10${sup(m)}) × (${b} × 10${sup(n)}) = ?`,`${a*b} × 10${sup(m+n)}`,[`${a*b} × 10${sup(m*n)}`,`${a+b} × 10${sup(m+n)}`,`${a*b} × 10${sup(m+n+1)}`,`${a*b} × 10${sup(m+n-1)}`]];}),
T('8.EE.6','Equations of lines',()=>{
  const m=R(2,6)*sgn(),b=R(1,9)*sgn();
  if(Math.random()<.4)return[`A line goes through the origin with slope ${S(m)}. What is its equation?`,`y = ${m===1?'':m===-1?'−':S(m)}x`,[`y = x ${op(m)}`,`y = ${S(-m)}x`,`y = ${S(m)}`]];
  return[`A line has slope ${S(m)} and y-intercept ${S(b)}. Which equation is it?`,`y = ${lin(m,b)}`,[`y = ${lin(b,m)}`,`y = ${lin(m,-b)}`,`y = ${lin(-m,b)}`]];}),
T('8.EE.7','How many solutions?',()=>{
  const a=R(2,6),b=R(1,9),t=R(0,2);
  if(t===0){let c=R(1,9);while(c===b)c=R(1,9);return[`How many solutions does ${a}x + ${b} = ${a}x + ${c} have?`,'No solution',['Exactly one solution','Infinitely many solutions','Exactly two solutions']];}
  if(t===1)return[`How many solutions does ${a}x + ${b} = ${a}x + ${b} have?`,'Infinitely many solutions',['No solution','Exactly one solution','Exactly two solutions']];
  let c=R(1,6);while(c===a)c=R(1,6);return[`How many solutions does ${a}x + ${b} = ${c}x + ${R(1,9)} have?`,'Exactly one solution',['No solution','Infinitely many solutions','Exactly two solutions']];}),
T('8.EE.8','Systems by substitution',()=>{
  const k=R(2,5),x=R(1,9);return[`If y = ${k}x and x + y = ${(k+1)*x}, what is x?`,x,[x+1,x-1>0?x-1:x+2,k*x,(k+1)*x]];}),
T('8.F.1','Is it a function?',()=>{
  const xs=[1,2,3,4],ys=()=>R(1,9),show=ps=>`{${ps.map(p=>`(${p[0]}, ${p[1]})`).join(', ')}}`;
  const good=xs.map(x=>[x,ys()]),dup=()=>{const p=xs.map(x=>[x,ys()]),i=R(0,2);p[i+1][0]=p[i][0];p[i+1][1]=p[i][1]%9+1;return p;};
  const ws=new Set();while(ws.size<3)ws.add(show(dup()));return['Which set of ordered pairs is a function?',show(good),[...ws]];}),
T('8.F.2','Compare functions',()=>{
  const a=R(2,5),b=R(1,6),x1=R(1,3),x2=x1+R(1,3),y1=R(2,8);let r;do{r=R(1,7);}while(r===a);
  const A=a>r?'Function A':'Function B';
  return[`Function A: y = ${a}x + ${b}. Function B: y = ${y1} when x = ${x1}, and y = ${y1+r*(x2-x1)} when x = ${x2}. Which function has the greater rate of change?`,A,['Function A','Function B','They are equal','Neither is linear'].filter(z=>z!==A).concat(['They are equal']).slice(0,3)];}),
T('8.F.3','Linear or not?',()=>{
  const lin_=['y = 3x + 1','y = −2x','y = 5 − x','y = x ÷ 2 + 4','y = 7x'],non=['y = x²','y = x³ + 1','y = 2 ÷ x','y = 3x² − 2'];
  return Math.random()<.5?['Which equation is linear?',pick(lin_),shuf(non).slice(0,3)]:['Which equation is NOT linear?',pick(non),shuf(lin_).slice(0,3)];}),
T('8.F.4','Rate of change and initial value',()=>{
  const b=R(10,40),m=R(2,9);
  return Math.random()<.5?[`A phone plan costs $${b} to start plus $${m} for each GB used. What is the rate of change, in dollars per GB?`,m,[b,m+b,b-m>0?b-m:m+2,m*2]]
    :[`A phone plan costs $${b} to start plus $${m} for each GB used. What is the initial value, in dollars?`,b,[m,m+b,b+m*2,b-m>0?b-m:b+2]];}),
T('8.G.1','Transformations',VOC([
  ['Which transformation does NOT change the size or shape of a figure?','Reflection',['Dilation by 2','Dilation by 3','Stretch']],
  ['Which transformation changes the size of a figure?','Dilation',['Rotation','Reflection','Translation']],
  ['Which transformation slides every point the same distance in the same direction?','Translation',['Rotation','Reflection','Dilation']],
  ['Which transformation flips a figure over a line?','Reflection',['Rotation','Translation','Dilation']],
  ['Which transformation turns a figure around a point?','Rotation',['Reflection','Translation','Dilation']],
])),
T('8.G.2','Congruent figures',VOC([
  ['Two figures are congruent if you can get from one to the other using...','Rotations, reflections and translations',['Dilations only','Only a change of color','Any change in size']],
  ['Which pair of figures must be congruent?','Two squares with side length 5 cm',['Two squares','Two rectangles with the same perimeter','Two triangles with the same height']],
  ['Congruent figures always have the same...','Size and shape',['Size only','Shape only','Color']],
])),
T('8.G.3','Coordinates of transformations',()=>{
  const x=R(1,8)*sgn(),y=R(1,8)*sgn(),t=R(0,4),all=`(${S(x)}, ${S(y)})`;
  const P=(a,b)=>`(${S(a)}, ${S(b)})`;
  if(t===0){const dx=R(1,6)*sgn(),dy=R(1,6)*sgn();return[`Translate ${all} by ${S(dx)} in the x direction and ${S(dy)} in the y direction. What are the new coordinates?`,P(x+dx,y+dy),[P(x+dy,y+dx),P(x-dx,y-dy),P(x+dx,y-dy)]];}
  if(t===1)return[`Reflect ${all} across the y-axis. What are the new coordinates?`,P(-x,y),[P(x,-y),P(-x,-y),P(y,x)]];
  if(t===2)return[`Reflect ${all} across the x-axis. What are the new coordinates?`,P(x,-y),[P(-x,y),P(-x,-y),P(y,x)]];
  if(t===3)return[`Rotate ${all} 90° counterclockwise about the origin. What are the new coordinates?`,P(-y,x),[P(y,-x),P(-x,-y),P(y,x)]];
  const k=R(2,4);return[`Dilate ${all} by a scale factor of ${k} from the origin. What are the new coordinates?`,P(k*x,k*y),[P(x+k,y+k),P(x*k,y),P(x/k,y/k),P(-k*x,-k*y)]];}),
T('8.G.4','Similar figures',()=>{
  const k=R(2,5),a=R(2,6),b=R(3,8);
  return Math.random()<.5?[`Triangle ABC is similar to triangle DEF. AB = ${a} and DE = ${a*k}. BC = ${b}. What is EF?`,b*k,[b+k,b*k+a,a*k,b*k-b]]
    :[`A triangle with sides 3, 4 and 5 is dilated by a scale factor of ${k}. What is the length of the longest side of the new triangle?`,5*k,[5+k,3*k,4*k,12*k]];}),
T('8.G.5','Angles in triangles and lines',()=>{
  const a=R(30,80),b=R(30,90-0>a?85:80),t=R(0,2);
  if(t===0)return[`Two angles of a triangle measure ${a}° and ${b}°. What is the third angle?`,180-a-b,[180-a,a+b,90-a,180-a-b+10]];
  if(t===1)return[`Two parallel lines are cut by a transversal. One angle is ${a}°. What is the measure of its alternate interior angle?`,a,[180-a,90-a>0?90-a:a+10,360-a,a+10]];
  return[`An exterior angle of a triangle is ${a+b}°. One remote interior angle is ${a}°. What is the other remote interior angle?`,b,[180-a-b,a+b,180-b,a]];}),
T('8.G.6','Is it a right triangle?',()=>{
  const k=R(1,2),good=pick(TRIPLES).map(x=>x*k),bad=[[4,5,6],[5,6,8],[6,7,9],[7,8,11],[8,9,12],[5,7,10],[6,9,12],[9,10,14]],f=t=>t.join(', ');
  return['Which set of side lengths forms a right triangle?',f(good),shuf(bad).slice(0,3).map(f)];}),
T('8.G.8','Distance between two points',()=>{
  const[a,b,c]=pick(TRIPLES),x1=R(-5,5),y1=R(-5,5),sx=sgn(),sy=sgn();
  return[`What is the distance between (${S(x1)}, ${S(y1)}) and (${S(x1+sx*a)}, ${S(y1+sy*b)})?`,c,[a+b,c+1,c-1,Math.abs(a-b)||c+2]];}),
T('8.G.9','Volume of cones and spheres',()=>{
  const r=R(2,6);
  if(Math.random()<.5){const h=3*R(1,4);return[`A cone has radius ${r} cm and height ${h} cm. What is its volume in terms of π (cubic cm)?`,`${r*r*h/3}π`,[`${r*r*h}π`,`${r*h/3}π`,`${r*r*h/3+r}π`,`${2*r*h}π`]];}
  const s=pick([3,6]);return[`A sphere has radius ${s} cm. What is its volume in terms of π (cubic cm)?`,`${4*s**3/3}π`,[`${4*s*s}π`,`${s**3}π`,`${4*s**3}π`,`${2*s**3/3}π`]];}),
T('8.SP.3','Interpret a line of best fit',()=>{
  const m=R(2,9),b=R(30,60);
  return Math.random()<.5?[`A line of best fit is y = ${m}x + ${b}, where x is hours studied and y is the test score. What does the slope ${m} mean?`,`Each extra hour of study adds about ${m} points`,[`The score with 0 hours of study is ${m}`,`Each extra point adds ${m} hours`,`The score is always ${b}`]]
    :[`A line of best fit is y = ${m}x + ${b}, where x is hours studied and y is the test score. What does the number ${b} mean?`,`The predicted score with 0 hours of study is ${b}`,[`Each extra hour adds ${b} points`,`The most hours anyone studied is ${b}`,`The slope is ${b}`]];}),
T('8.SP.4','Two-way tables',()=>{
  const a=R(2,9),b=R(2,9),c=R(2,9),d=R(2,9);
  return[`In a survey, ${a} students play sports and like pizza, ${b} play sports and do not like pizza, ${c} do not play sports and like pizza, and ${d} do not play sports and do not like pizza. What fraction of the students who play sports like pizza?`,F(a,a+b),[F(a,a+b+c+d),F(b,a+b),F(a,a+c),F(a+c,a+b+c+d)]];}),
);
