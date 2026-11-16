
// ---- coverage fill: grades 3 and 4 ----
const others=(ans,pool,n=3)=>shuf(pool.filter(x=>x!==ans)).slice(0,n);
const tm=(h,m)=>`${((h-1)%12+12)%12+1}:${String(m).padStart(2,'0')}`;
const tmT=t=>tm(Math.floor(t/60),((t%60)+60)%60);
const comma=n=>n.toLocaleString('en-US');
// a reusable "pick the right word" question from [question, answer, wrong pool]
const VOC=(list)=>()=>{const[q,a,pool]=pick(list);return[q,a,others(a,pool)];};

G[3].push(
T('3.OA.1','Interpret products',()=>{
  const a=R(2,9);let b=R(2,9);while(b===a)b=R(2,9);
  return Math.random()<.5?[`Which multiplication fact shows ${a} groups of ${b}?`,`${a} × ${b}`,[`${a} + ${b}`,`${a} × ${a}`,`${b} × ${b}`]]
    :[`A tray holds ${b} cookies. There are ${a} trays. Which number sentence shows the total number of cookies?`,`${a} × ${b}`,[`${a} + ${b}`,`${a} ÷ ${b}`,`${a*b} − ${a}`]];}),
T('3.OA.2','Interpret quotients',()=>{
  const g=R(2,9),b=R(2,9),n=g*b;
  return Math.random()<.5?[`${n} apples are put into ${g} equal bags. Which number sentence shows how many apples are in each bag?`,`${n} ÷ ${g}`,[`${n} × ${g}`,`${g} ÷ ${n}`,`${n} − ${g}`]]
    :[`${n} stickers are put in rows of ${g}. Which number sentence shows how many rows?`,`${n} ÷ ${g}`,[`${n} × ${g}`,`${n} + ${g}`,`${g} ÷ ${n}`]];}),
T('3.OA.4','Find the unknown number',()=>{
  const a=R(2,9),b=R(2,9),p=a*b,t=R(0,2);
  if(t===0)return[`${a} × ? = ${p}`,b,[b+1,b-1,p-a,a]];
  if(t===1)return[`? ÷ ${a} = ${b}`,p,[p+a,a+b,p-a,b]];
  return[`${p} ÷ ? = ${b}`,a,[a+1,a-1,p-b,b]];}),
T('3.OA.5','Properties of multiplication',()=>{
  if(Math.random()<.5){const a=R(2,8),b=R(2,6),c=R(2,6);return[`${a} × ${b+c} = ${a} × ${b} + ${a} × ?`,c,[b,c+1,b+c,a]];}
  const a=R(2,5),b=R(2,4),c=R(2,4);return[`${a} × ${b} × ${c} = ${a} × ?`,b*c,[b+c,a*b,b*c+1,c]];}),
T('3.OA.6','Division as an unknown factor',()=>{
  const a=R(2,9);let b=R(2,9);while(b===a)b=R(2,9);const p=a*b;
  return[`Which multiplication fact helps you solve ${p} ÷ ${a}?`,`${a} × ${b} = ${p}`,[`${a} × ${b+1} = ${a*(b+1)}`,`${a+1} × ${b} = ${(a+1)*b}`,`${a} + ${b} = ${a+b}`]];}),
T('3.OA.9','Patterns',()=>{
  const d=R(2,9),s=R(1,9)*(Math.random()<.4?d:1),down=Math.random()<.25&&s>4*d;
  const step=down?-d:d,seq=[0,1,2,3].map(i=>s+i*step),nx=s+4*step;
  return[`What number comes next? ${seq.join(', ')}, ?`,nx,[nx+d,nx-d,nx+1,nx+2*d]];}),
T('3.NBT.3','Multiply by multiples of 10',()=>{
  const a=R(2,9),b=R(2,9),p=a*b*10;return[`${a} × ${b*10} = ?`,p,[a*b,p*10,p+a,p-b]];}),
T('3.NF.1','Understand fractions',()=>{
  const d=R(3,8),n=R(2,d-1);
  return Math.random()<.5?[`A pizza is cut into ${d} equal slices. ${n} slices are eaten. What fraction of the pizza was eaten?`,FR(n,d),[FR(d,n),FR(n,d+1),FR(n+1,d),FR(1,d)]]
    :[`A ribbon is cut into ${d} equal pieces. Each piece is what fraction of the whole ribbon?`,FR(1,d),[FR(d,1),FR(1,d+1),FR(d-1,d),FR(2,d)]];}),
T('3.MD.1','Time',()=>{
  const h=R(1,10),m=R(0,11)*5,d=R(2,15)*5,s=h*60+m,e=s+d;
  if(Math.random()<.5)return[`A movie starts at ${tm(h,m)} and lasts ${d} minutes. What time does it end?`,tmT(e),[tmT(e+10),tmT(e-10),tmT(e+60),tmT(e-5)]];
  const d2=R(2,10)*5,e2=h*60+m+d2;
  return[`How many minutes pass from ${tmT(s)} to ${tmT(e2)}?`,d2,[d2+10,d2-5,d2+5,d2+15]];}),
T('3.MD.2','Liquid volume and mass',()=>{
  const t=R(0,2),a=R(2,9),k=R(2,9);
  if(t===0)return[`Each bag of apples has a mass of ${a} kg. A box holds ${k} bags. What is the mass of the box in kg?`,a*k,[a+k,a*k+a,a*k-k,a*k+10]];
  if(t===1)return[`A jug holds ${a*k} liters of juice. It is shared equally into ${k} bottles. How many liters are in each bottle?`,a,[a+1,a-1,k,a*k-k]];
  const n=R(30,90),m=R(10,n-10);return[`A tank has ${n} liters of water. ${m} liters are poured out. How many liters are left?`,n-m,[n+m,n-m+10,n-m-10,m]];}),
T('3.MD.5','Area with unit squares',()=>{
  const r=R(2,9),c=R(2,9);return[`A rectangle is covered by ${r} rows of ${c} unit squares. What is its area in square units?`,r*c,[r+c,2*(r+c),r*c+r,r*c-c]];}),
T('3.MD.6','Measure area by counting squares',()=>{
  const r=R(3,9),c=R(2,8);return[`A floor is ${r} tiles long and ${c} tiles wide. Each tile is 1 square foot. What is the area of the floor in square feet?`,r*c,[r+c,2*(r+c),r*c+c,r*c-r]];}),
T('3.G.1','Shapes and their attributes',VOC([
  ['Which shape has exactly 5 sides?','Pentagon',['Hexagon','Square','Triangle','Octagon']],
  ['Which shape has exactly 6 sides?','Hexagon',['Pentagon','Square','Triangle','Octagon']],
  ['Which shape has exactly 3 sides?','Triangle',['Pentagon','Square','Hexagon','Octagon']],
  ['Which shape has 4 equal sides and 4 right angles?','Square',['Triangle','Pentagon','Hexagon','Circle']],
  ['Which shape has exactly 8 sides?','Octagon',['Pentagon','Hexagon','Square','Triangle']],
  ['Which shape has 4 sides and 4 right angles, with opposite sides equal?','Rectangle',['Triangle','Pentagon','Hexagon','Circle']],
  ['Which shape has 4 equal sides but does not have to have right angles?','Rhombus',['Triangle','Pentagon','Hexagon','Circle']],
  ['A shape with 4 sides is called a?','Quadrilateral',['Pentagon','Hexagon','Triangle','Octagon']],
])),
T('3.G.2','Equal parts of a shape',()=>{
  const d=pick([2,3,4,6,8]);return[`A rectangle is cut into ${d} equal parts. Each part is what fraction of the whole?`,FR(1,d),[`${d}`,FR(1,d+1),FR(1,d+2),FR(2,d)]];}),
);

G[4].push(
T('4.OA.2','Multiplicative comparison problems',()=>{
  const k=R(2,8),b=R(3,12);
  return Math.random()<.5?[`A red scarf is ${k} times as long as a blue scarf. The red scarf is ${k*b} cm long. How long is the blue scarf in cm?`,b,[b+k,k*b+k,k,k*b-b]]
    :[`Max has ${k*b} cards. Zoe has ${b} cards. How many times as many cards does Max have as Zoe?`,k,[k+1,k*b-b,b,k-1]];}),
T('4.OA.4','Factors, multiples and primes',()=>{
  const t=R(0,3);
  if(t===0){const n=pick([12,18,20,24,28,30,36,40,42,48]),fs=[2,3,4,5,6,7,8,9,12].filter(f=>n%f===0&&f<n),nf=[2,3,4,5,6,7,8,9,11,13].filter(f=>n%f!==0);
    const a=pick(fs);return[`Which number is a factor of ${n}?`,a,others(a,nf).slice(0,3)];}
  if(t===1){const m=R(3,9),k=R(3,9);return[`Which number is a multiple of ${m}?`,m*k,[m*k+1,m*k-1,m*k+2,m*k+m-1].filter(x=>x%m!==0)];}
  const P=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47],C=[4,6,8,9,10,12,14,15,16,18,20,21,22,24,25,26,27,28,30,33,35,39,45,49];
  if(t===2){const a=pick(P);return['Which number is prime?',a,shuf(C).slice(0,3)];}
  const a=pick(C);return['Which number is composite?',a,shuf(P).slice(0,3)];}),
T('4.OA.5','Number patterns',()=>{
  const d=R(2,9),s=R(1,9);
  if(Math.random()<.5){const seq=[0,1,2,3].map(i=>s+i*d);return[`What is the rule for this pattern? ${seq.join(', ')}, ...`,`Add ${d}`,[`Add ${d+1}`,`Multiply by ${d}`,`Subtract ${d}`,`Add ${d-1>0?d-1:d+2}`]];}
  const n=R(5,8);return[`A pattern starts at ${s} and the rule is add ${d}. What is the ${n}th number?`,s+(n-1)*d,[s+n*d,s+(n-2)*d,s+n*d+d,s*n+d]];}),
T('4.NBT.1','Place value',()=>{
  const d=R(1,9),e2=R(0,2),e1=e2+R(1,2),n=d*10**e1+d*10**e2,names=['ones','tens','hundreds','thousands','ten thousands'],ans=10**(e1-e2);
  return[`In ${comma(n)}, the ${d} in the ${names[e1]} place is how many times the value of the ${d} in the ${names[e2]} place?`,ans,[10,100,1000,1].filter(x=>x!==ans).concat([d]).slice(0,3)];}),
T('4.NBT.2','Read, write and compare numbers',()=>{
  if(Math.random()<.5){const s=new Set();const base=R(2,9)*1000+R(1,9)*100;while(s.size<4)s.add(base+R(-8,8)*10+R(-4,4));const a=[...s],m=Math.max(...a);
    return['Which number is the greatest?',comma(m),a.filter(x=>x!==m).map(comma)];}
  let th=R(1,9),h=R(1,9),t=R(1,9),o=R(1,9);while(h===t)t=R(1,9);
  return[`Which is the expanded form of ${comma(th*1000+h*100+t*10+o)}?`,`${th*1000} + ${h*100} + ${t*10} + ${o}`,[`${th*100} + ${h*10} + ${t} + ${o}`,`${th*1000} + ${h*10} + ${t*100} + ${o}`,`${th*10000} + ${h*100} + ${t*10} + ${o}`]];}),
T('4.NF.2','Compare fractions',()=>{
  const ds=[2,3,4,5,6,8,10,12];let arr;
  for(;;){const set=new Map();for(let i=0;i<4;i++){const d=pick(ds),n=R(1,d-1);set.set(n/d,[n,d]);}if(set.size===4){arr=[...set.entries()];break;}}
  const best=Math.max(...arr.map(x=>x[0]));
  return['Which fraction is the greatest?',FR(...arr.find(x=>x[0]===best)[1]),arr.filter(x=>x[0]!==best).map(x=>FR(...x[1]))];}),
T('4.NF.3','Decompose and add fractions',()=>{
  if(Math.random()<.5){const d=R(4,10),n=R(3,d-1),a=R(1,n-1);return[`${FR(n,d)} = ${FR(a,d)} + ?`,FR(n-a,d),[FR(n+a,d),FR(a,d),FR(n-a,d+1),FR(n-a+1,d)]];}
  const d=R(4,9),w1=R(1,4),w2=R(1,4),n1=R(1,d-2),n2=R(1,d-n1-1);
  return[`${w1} ${FR(n1,d)} + ${w2} ${FR(n2,d)} = ?`,`${w1+w2} ${FR(n1+n2,d)}`,[`${w1+w2} ${FR(n1+n2,2*d)}`,`${w1+w2+1} ${FR(n1+n2,d)}`,`${w1+w2} ${FR(n1+n2+1,d)}`,`${w1*w2} ${FR(n1+n2,d)}`]];}),
T('4.NF.5','Tenths and hundredths',()=>{
  const a=R(1,9),b=R(1,9);return[`${FR(a,10)} + ${FR(b,100)} = ?`,FR(10*a+b,100),[FR(a+b,10),FR(a+b,100),FR(10*a+b,110),FR(a*b,100)]];}),
T('4.NF.7','Compare decimals',()=>{
  const s=new Map();while(s.size<4){const v=Math.random()<.5?R(1,9)/10:R(11,99)/100;s.set(v,1);}
  const a=[...s.keys()],m=Math.max(...a);return['Which decimal is the greatest?',D(m,2),a.filter(x=>x!==m).map(x=>D(x,2))];}),
T('4.MD.2','Money, distance and time',()=>{
  const t=R(0,2);
  if(t===0){const x=R(2,9)+pick([0,.25,.5,.75]),y=R(1,6)+pick([0,.25,.5,.75]);return[`Ben buys a notebook for $${x.toFixed(2)} and a pencil for $${y.toFixed(2)}. How much does he spend in all?`,`$${(x+y).toFixed(2)}`,[`$${(x+y+1).toFixed(2)}`,`$${(x+y-.5).toFixed(2)}`,`$${(x+y+.25).toFixed(2)}`,`$${(x-y>0?x-y:x+y+2).toFixed(2)}`]];}
  if(t===1){const a=R(5,12),b=R(2,a-2);return[`A trail is ${a} km long. Rin has walked ${b} km. How many more km does she have to walk?`,a-b,[a+b,a-b+1,a-b-1,b]];}
  const c=R(2,9),k=R(2,5),tot=c*k,bill=tot<=20?20:50;return[`A snack costs $${c}. Mia buys ${k} snacks and pays with a $${bill} bill. How many dollars of change does she get?`,bill-tot,[bill+tot,tot,bill-tot+c,bill-tot-1]];}),
T('4.MD.5','Angles and turns',()=>{
  const L=[[FR(1,4),90],[FR(1,2),180],[FR(3,4),270],[FR(1,3),120],[FR(1,6),60],[FR(1,8),45],[FR(1,10),36],[FR(1,12),30]],[f,d]=pick(L);
  return[`An angle that turns through ${f} of a circle measures how many degrees?`,d,others(d,L.map(x=>x[1]))];}),
T('4.G.1','Lines and angles',VOC([
  ['Two lines that never meet are called?','Parallel lines',['Perpendicular lines','A ray','A line segment','An obtuse angle']],
  ['Two lines that meet to make a right angle are called?','Perpendicular lines',['Parallel lines','A ray','A line segment','An acute angle']],
  ['A part of a line with one endpoint that goes on forever is called?','A ray',['A line segment','Parallel lines','A right angle','An obtuse angle']],
  ['A part of a line with two endpoints is called?','A line segment',['A ray','Parallel lines','A right angle','An obtuse angle']],
  ['An angle that measures 90° is called?','A right angle',['An acute angle','An obtuse angle','A straight angle']],
  ['An angle that measures 130° is called?','An obtuse angle',['An acute angle','A right angle','A straight angle']],
  ['An angle that measures 45° is called?','An acute angle',['An obtuse angle','A right angle','A straight angle']],
  ['An angle that measures 180° is called?','A straight angle',['An acute angle','An obtuse angle','A right angle']],
])),
T('4.G.2','Classify shapes',VOC([
  ['Which shape has exactly one pair of parallel sides?','Trapezoid',['Parallelogram','Rectangle','Square','Triangle']],
  ['A triangle with all 3 sides equal is called?','Equilateral',['Scalene','Right','Obtuse']],
  ['A triangle with exactly 2 equal sides is called?','Isosceles',['Equilateral','Scalene','Right']],
  ['A triangle with no equal sides is called?','Scalene',['Equilateral','Isosceles','Right']],
  ['A triangle with one 90° angle is called a?','Right triangle',['Acute triangle','Obtuse triangle','Equilateral triangle']],
  ['Which shape has 2 pairs of parallel sides and 4 equal sides but no right angles?','Rhombus',['Rectangle','Square','Trapezoid','Triangle']],
  ['Which shape has 4 right angles and sides that are not all equal?','Rectangle',['Square','Rhombus','Trapezoid','Triangle']],
])),
T('4.G.3','Lines of symmetry',()=>{
  const L=[['square',4],['rectangle that is not a square',2],['equilateral triangle',3],['regular pentagon',5],['regular hexagon',6],['isosceles triangle that is not equilateral',1]],[s,n]=pick(L);
  return[`How many lines of symmetry does a ${s} have?`,n,others(n,[0,1,2,3,4,5,6])];}),
);
