
// ---- coverage fill: grades 5 and 6 ----
const ROMAN4=['I','II','III','IV'];
G[5].push(
T('5.OA.2','Write numerical expressions',()=>{
  let a,b,c,A;
  do{a=R(2,9);b=R(2,9);c=R(2,9);A=[(a+b)*c,a+b*c,a+b+c,a*b+c];}while(new Set(A).size<4);
  return Math.random()<.5?[`Which expression shows "add ${a} and ${b}, then multiply by ${c}"?`,`(${a} + ${b}) × ${c}`,[`${a} + ${b} × ${c}`,`${a} + ${b} + ${c}`,`${a} × ${b} + ${c}`]]
    :[`Which expression shows "${c} times the sum of ${a} and ${b}"?`,`${c} × (${a} + ${b})`,[`${c} × ${a} + ${b}`,`${c} + ${a} + ${b}`,`(${a} + ${b}) ÷ ${c}`]];}),
T('5.OA.3','Two patterns',()=>{
  const d=R(2,6),k=R(2,5);return[`Rule A: start at 0 and add ${d}. Rule B: start at 0 and add ${k*d}. Each number in Rule B is how many times the matching number in Rule A?`,k,[k+1,k-1,d,k*d]];}),
T('5.NBT.1','Place value and decimals',()=>{
  const d=R(1,9),pairs=[[0,1,10],[1,2,10],[0,2,100]],[i,j,r]=pick(pairs),names=['ones','tenths','hundredths'];
  return[`In ${d}.${d}${d}, the ${d} in the ${names[i]} place is how many times the value of the ${d} in the ${names[j]} place?`,r,[10,100,1000,1].filter(x=>x!==r)];}),
T('5.NBT.4','Round decimals',()=>{
  const p=pick([1000,100,10]);let x;do{x=R(1001,9999);}while(x%p===p/2);
  const dec=p===1000?0:p===100?1:2,u=p/1000,r=Math.round(x/p)*u,fl=Math.floor(x/p)*u,ce=Math.ceil(x/p)*u;
  return[`Round ${(x/1000).toFixed(3)} to the nearest ${p===1000?'whole number':p===100?'tenth':'hundredth'}.`,r.toFixed(dec),[fl.toFixed(dec),ce.toFixed(dec),(r+u).toFixed(dec),(r-u).toFixed(dec)]];}),
T('5.NBT.7','Divide decimals',()=>{
  const A=R(11,99),k=R(2,9);return[`${D(A*k/10,1)} ÷ ${k} = ?`,D(A/10,1),[D(A/100,2),D(A,0),D(A/10+0.1,1),D(A/10-0.1,1)]];}),
T('5.NF.2','Fraction word problems',()=>{
  let d1,d2,n1,n2;do{d1=pick([2,3,4,5,6,8]);d2=pick([2,3,4,5,6,8]);n1=R(1,d1-1);n2=R(1,d2-1);}while(d1===d2||n1*d2<=n2*d1||gcd(d1,d2)>1&&d1%d2===0);
  const top=n1*d2-n2*d1,bot=d1*d2,sum=n1*d2+n2*d1;
  return Math.random()<.5?[`A recipe needs ${FR(n1,d1)} cup of sugar. Mia has already added ${FR(n2,d2)} cup. How much more sugar does she need to add?`,F(top,bot),[F(n1-n2,d1-d2>0?d1-d2:d1+d2),F(sum,bot),F(top+1,bot),F(top,bot+1)]]
    :[`Leo walked ${FR(n1,d1)} mile in the morning and ${FR(n2,d2)} mile after lunch. How many miles did he walk in all?`,F(sum,bot),[F(n1+n2,d1+d2),F(top,bot),F(sum+1,bot),F(sum,bot+1)]];}),
T('5.NF.3','Fractions as division',()=>{
  const a=R(1,5),b=R(a+1,8);return[`${a} pizzas are shared equally among ${b} friends. How much pizza does each friend get?`,F(a,b),[F(b,a),F(a,a+b),F(a+1,b),F(a,b+1)]];}),
T('5.NF.5','Multiplication as scaling',()=>{
  const n=R(4,9)*2,b=R(3,6),a=R(1,b-1),a2=R(1,b),k=R(1,3);
  if(Math.random()<.5)return[`Which product is greater than ${n}?`,`${n} × ${FR(b+k,b)}`,[`${n} × ${FR(a,b)}`,`${n} × ${FR(a2>0&&a2<b?a2:1,b+1)}`,`${n} × 1`]];
  return[`Which product is less than ${n}?`,`${n} × ${FR(a,b)}`,[`${n} × ${FR(b+k,b)}`,`${n} × ${FR(b+k+1,b)}`,`${n} × 1`]];}),
T('5.NF.6','Multiply fractions in word problems',()=>{
  const d=R(2,6),n=R(1,d-1),w=R(2,6);
  if(Math.random()<.5)return[`Each glass holds ${FR(n,d)} liter of juice. Ana fills ${w} glasses. How many liters of juice is that?`,F(w*n,d),[F(w+n,d),F(n,d*w),F(w*n+1,d),F(w*n,d+1)]];
  const d2=R(2,5),n2=R(1,d2-1);return[`There is ${FR(n,d)} of a pizza left. Tom eats ${FR(n2,d2)} of what is left. What fraction of the whole pizza did Tom eat?`,F(n*n2,d*d2),[F(n+n2,d+d2),F(n*n2,d+d2),F(n,d),F(n*n2+1,d*d2)]];}),
T('5.MD.1','Convert units',()=>{
  const U=[['meters','centimeters',100],['kilometers','meters',1000],['kilograms','grams',1000],['liters','milliliters',1000],['feet','inches',12],['yards','feet',3],['pounds','ounces',16],['gallons','quarts',4]];
  const[big,small,f]=pick(U),pow10=f>=100;let down=Math.random()<.5;if(!pow10&&f>=33)down=true;
  if(down){const n=R(2,9);return[`${n} ${big} = ? ${small}`,n*f,[n*f*10,n+f,n*(f+1),n*f/10]];}
  const n=R(2,Math.max(2,pow10?9:Math.floor(99/f)));return[`${n*f} ${small} = ? ${big}`,n,[n*10,n+1,n*f,n>2?n-1:n+2]];}),
T('5.MD.3','Volume and unit cubes',()=>{
  const l=R(2,6),w=R(2,5),h=R(2,5);
  return[`A box is filled with unit cubes: ${l} cubes in each row, ${w} rows in each layer, and ${h} layers. How many unit cubes fill the box?`,l*w*h,[l+w+h,l*w+h,l*w*h+l,2*(l*w+l*h+w*h)]];}),
T('5.MD.4','Measure volume with cubes',()=>{
  const layer=R(4,12),k=R(2,6);return[`Each layer of a box holds ${layer} cubes that are 1 cm on each edge. The box has ${k} layers. What is its volume in cubic cm?`,layer*k,[layer+k,layer*k+layer,layer*k-k,layer*k*2]];}),
T('5.G.1','The coordinate plane',()=>{
  const a=R(2,9),t=R(0,2);
  if(t===0)return['What are the coordinates of the origin?','(0, 0)',['(1, 1)','(0, 1)','(1, 0)','(10, 10)']];
  if(t===1)return[`Which ordered pair is on the x-axis?`,`(${a}, 0)`,[`(0, ${a})`,`(${a}, ${a})`,`(${a}, 1)`]];
  return[`In the ordered pair (${a}, ${a+2}), which number tells how far to move right from the origin?`,a,[a+2,0,a+1,a*2]];}),
T('5.G.2','Coordinate plane problems',()=>{
  if(Math.random()<.5){const x=R(1,6),y=R(1,6),dx=R(1,4),dy=R(1,4);return[`Start at (${x}, ${y}). Move ${dx} units right and ${dy} units up. Where do you end up?`,`(${x+dx}, ${y+dy})`,[`(${x+dy}, ${y+dx})`,`(${x+dx}, ${y-dy>=0?y-dy:y+dy+1})`,`(${x-dx>=0?x-dx:x+dx+1}, ${y+dy})`]];}
  const x=R(1,9),y1=R(1,4),y2=R(y1+2,9);return[`Point P is at (${x}, ${y1}) and point Q is at (${x}, ${y2}). How many units apart are they?`,y2-y1,[y2+y1,y2-y1+1,y2-y1-1,x]];}),
T('5.G.3','Properties of shapes',VOC([
  ['Which statement is true?','Every square is a rectangle',['Every rectangle is a square','Every trapezoid is a rectangle','Every triangle has 4 sides','Every rhombus is a square']],
  ['Which statement is true?','Every rhombus is a parallelogram',['Every parallelogram is a rectangle','Every trapezoid is a square','Every triangle is a quadrilateral','Every rectangle is a rhombus']],
  ['Which statement is true?','A square has 4 equal sides and 4 right angles',['A rectangle always has 4 equal sides','A rhombus always has 4 right angles','A triangle has 4 sides','A parallelogram always has right angles']],
])),
T('5.G.4','Classify shapes',VOC([
  ['Which shape belongs in every one of these groups: quadrilaterals, parallelograms, rectangles, rhombuses?','Square',['Trapezoid','Triangle','Kite','Pentagon']],
  ['All of these are parallelograms EXCEPT which shape?','Trapezoid',['Rectangle','Square','Rhombus']],
  ['Which shape has 4 sides and 2 pairs of parallel sides?','Parallelogram',['Trapezoid','Triangle','Pentagon','Hexagon']],
  ['A shape with 4 right angles and 4 equal sides is a?','Square',['Rectangle that is not a square','Rhombus that is not a square','Trapezoid','Triangle']],
])),
);

G[6].push(
T('6.NS.2','Divide with 2-digit divisors',()=>{
  const d=R(11,33),q=R(2,Math.floor(99/d));return[`${d*q} ÷ ${d} = ?`,q,[q+1,q-1,q+10,q+2]];}),
T('6.NS.8','Distance on the coordinate plane',()=>{
  const a=R(1,9)*pick([1,-1]);let b=R(1,9)*pick([1,-1]);while(b===a)b=R(1,9)*pick([1,-1]);const y=R(-6,6),d=Math.abs(a-b);
  return Math.random()<.5?[`What is the distance between (${S(a)}, ${S(y)}) and (${S(b)}, ${S(y)})?`,d,[Math.abs(a)+Math.abs(b)===d?d+1:Math.abs(a)+Math.abs(b),Math.abs(Math.abs(a)-Math.abs(b))||d+2,d+1,d-1>0?d-1:d+3]]
    :[`What is the distance between (${S(y)}, ${S(a)}) and (${S(y)}, ${S(b)})?`,d,[Math.abs(a)+Math.abs(b)===d?d+1:Math.abs(a)+Math.abs(b),Math.abs(Math.abs(a)-Math.abs(b))||d+2,d+1,d-1>0?d-1:d+3]];}),
T('6.EE.3','Equivalent expressions',()=>{
  const k=R(2,9),m=R(2,9);return[`Which expression is equivalent to ${k}(x + ${m})?`,`${k}x + ${k*m}`,[`${k}x + ${m}`,`${k+m}x`,`x + ${k*m}`,`${k}x + ${k+m}`]];}),
T('6.EE.4','Identify equivalent expressions',()=>{
  if(Math.random()<.5){const n=R(3,6);return[`Which expression is equivalent to ${Array(n).fill('x').join(' + ')}?`,`${n}x`,[`x${sup(n)}`,`x + ${n}`,`${n+1}x`]];}
  const a=R(2,9),b=R(2,9);return[`Which expression is equivalent to ${a}x + ${b}x?`,`${a+b}x`,[`${a*b}x`,`${a+b}x${sup(2)}`,`${a+b}`,`${a}${b}x`]];}),
T('6.EE.5','Which value makes it true?',()=>{
  const x=R(2,9),a=R(2,6),b=R(1,a*x-1>9?9:a*x-1);
  if(Math.random()<.5)return[`Which value of x makes ${a}x − ${b} = ${a*x-b} true?`,x,[x+1,x-1,x+2,x*2]];
  return[`Which value of x makes x + ${a} > ${x+a+1} true?`,x+R(2,4),[x+1,x,x-1,x-2]];}),
T('6.EE.6','Write expressions from words',()=>{
  const n=R(2,9),L=[[`${n} more than a number x`,`x + ${n}`,[`${n}x`,`x − ${n}`,`${n} − x`]],[`${n} less than a number x`,`x − ${n}`,[`${n} − x`,`x + ${n}`,`${n}x`]],
    [`the product of ${n} and a number x`,`${n}x`,[`x + ${n}`,`x ÷ ${n}`,`${n} − x`]],[`a number x divided by ${n}`,`x ÷ ${n}`,[`${n} ÷ x`,`${n}x`,`x − ${n}`]],
    [`${n} less than twice a number x`,`2x − ${n}`,[`${n} − 2x`,`2(x − ${n})`,`x − ${n}`]]],[w,a,wr]=pick(L);
  return[`Which expression shows "${w}"?`,a,wr];}),
T('6.EE.9','Two variables',()=>{
  const k=R(2,9);
  if(Math.random()<.5){const x=R(2,9);return[`The equation is y = ${k}x. What is y when x = ${x}?`,k*x,[k+x,k*x+k,x,k*x-x]];}
  return[`When x = 1, 2, 3, the values of y are ${k}, ${2*k}, ${3*k}. Which equation matches?`,`y = ${k}x`,[`y = x + ${k-1}`,`y = ${k}x + 1`,`y = ${k+1}x`,`y = x + ${k}`]];}),
T('6.G.2','Volume with fractions',()=>{
  const l=R(2,6),h=R(2,6),wn=pick([1,3]);
  return[`A box is ${l} units long, ${FR(wn,2)} unit wide and ${h} units tall. What is its volume in cubic units?`,F(l*wn*h,2),[F(l*wn*h,4),F(l*wn+h,2),F(l*h,2),F(l*wn*h+1,2)]];}),
T('6.G.3','Polygons on the coordinate plane',()=>{
  const x=R(1,4),y=R(1,4),w=R(3,8),h=R(2,6);
  return Math.random()<.5?[`A rectangle has vertices (${x}, ${y}), (${x+w}, ${y}), (${x+w}, ${y+h}) and (${x}, ${y+h}). What is its perimeter?`,2*(w+h),[w*h,w+h,2*w+h,2*(w+h)+2]]
    :[`A rectangle has vertices (${x}, ${y}), (${x+w}, ${y}), (${x+w}, ${y+h}) and (${x}, ${y+h}). What is its area?`,w*h,[2*(w+h),w+h,w*h+w,w*h-h]];}),
T('6.G.4','Surface area',()=>{
  if(Math.random()<.5){const s=R(2,9);return[`A cube has edges of ${s} cm. What is its surface area in square cm?`,6*s*s,[s**3,4*s*s,6*s,2*s*s]];}
  const l=R(2,6),w=R(2,5),h=R(2,5);return[`A box is ${l} cm long, ${w} cm wide and ${h} cm tall. What is its surface area in square cm?`,2*(l*w+l*h+w*h),[l*w*h,l*w+l*h+w*h,2*(l*w+l*h+w*h)+2*l,2*l*w+2*l*h]];}),
T('6.SP.1','Statistical questions',()=>{
  const yes=['How many pets does each student in our school have?','How tall are the students in my class?','How many minutes do 6th graders spend on homework each night?','What is the favorite sport of students in our grade?','How many books did the students in our school read this month?'],
    no=['How old is my teacher?','How tall is Mia?','What is 5 + 7?','How many pets does my neighbor have?','What time does our school start?','How many students are in my class today?'];
  return['Which is a statistical question?',pick(yes),shuf(no).slice(0,3)];}),
T('6.SP.2','Center and spread',()=>{
  const t=R(0,2);
  if(t===0)return['Which is a measure of center?',pick(['Mean','Median']),['Range','Maximum','Spread']];
  if(t===1)return['Which tells how spread out the data are?','Range',['Mean','Median','Mode']];
  const mn=R(1,10),mx=mn+R(5,15);return[`The lowest value in a data set is ${mn} and the highest is ${mx}. What is the range?`,mx-mn,[mx+mn,mx,mn,mx-mn+1]];}),
T('6.SP.3','Center versus spread',()=>{
  const m=R(9,14),a=R(1,3),b=a+R(2,4);
  return[`Set A is ${m-a}, ${m}, ${m+a}. Set B is ${m-b}, ${m}, ${m+b}. Both sets have a mean of ${m}. Which set has the greater range?`,'Set B',['Set A','They have the same range','It depends on the mean']];}),
);
