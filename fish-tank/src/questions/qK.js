
// ---- kindergarten, grade 1, grade 2: short, easy questions (CA CCSS-M K.*, 1.*, 2.*) ----
const KE=['🍎','🐟','⭐','🍪','🎈','🐱','🌸','🚗'];
const kn=(e,n)=>e.repeat(n);
const kNear=(n,lo,hi)=>[n+1,n-1,n+2,n-2,n+3,n-3].filter(x=>x>=lo&&x<=hi);
const kRank=['ant','mouse','cat','person','car','bus','house','mountain'];   // clearly increasing in size
const kShapes={circle:'●',square:'■',triangle:'▲',rectangle:'▬'};
const kName=['circle','square','triangle','rectangle'];
const kSides={triangle:3,square:4,rectangle:4,pentagon:5,hexagon:6};
const kT=(h,m)=>{h=((h-1+Math.floor(m/60))%12+12)%12+1;m=((m%60)+60)%60;return `${h}:${m<10?'0'+m:m}`;};
const kU=(n,w)=>n===1?w:w+'s';
const kWho=['Mia','Leo','Sam','Ava','Ben','Zoe'];

G[0]=[
T('K.CC.1','Count and what comes next',()=>{
  const n=R(1,18),t=R(0,2);
  if(t===0)return[`What comes next? ${n}, ${n+1}, ${n+2}, ?`,n+3,[n+2,n+4,n+1,n+5]];
  if(t===1)return[`What number comes after ${n}?`,n+1,[n,n+2,n-1>0?n-1:n+3,n+3]];
  const m=R(2,19);return[`What number comes before ${m}?`,m-1,[m,m+1,m-2>0?m-2:m+2,m+2]];}),
T('K.CC.5','Count the objects',()=>{const n=R(1,10),e=pick(KE);return[`How many? ${kn(e,n)}`,n,kNear(n,0,12)];}),
T('K.CC.6','Which group has more?',()=>{
  const s=new Set();while(s.size<4)s.add(R(1,9));const a=[...s],e=pick(KE),more=Math.random()<.5,t=more?Math.max(...a):Math.min(...a);
  return[more?'Which group has MORE?':'Which group has FEWER?',kn(e,t),a.filter(x=>x!==t).map(x=>kn(e,x))];}),
T('K.CC.7','Compare numbers',()=>{
  const s=new Set();while(s.size<4)s.add(R(0,20));const a=[...s],big=Math.random()<.5,t=big?Math.max(...a):Math.min(...a);
  return[big?'Which number is the biggest?':'Which number is the smallest?',t,a.filter(x=>x!==t)];}),
T('K.OA.2','Add within 5',()=>{const a=R(0,5),b=R(0,5-a),s=a+b,e=pick(KE);
  if(Math.random()<.5&&a>0&&b>0)return[`${kn(e,a)} + ${kn(e,b)} = ?`,s,kNear(s,0,8)];
  return[`${a} + ${b} = ?`,s,kNear(s,0,8)];}),
T('K.OA.2','Subtract within 5',()=>{const a=R(1,5),b=R(0,a),d=a-b;return[`${a} − ${b} = ?`,d,kNear(d,0,7)];}),
T('K.OA.3','Add within 10',()=>{const a=R(1,9),b=R(1,10-a),s=a+b;return[`${a} + ${b} = ?`,s,kNear(s,0,12)];}),
T('K.OA.5','Subtract within 10',()=>{const a=R(2,10),b=R(1,a-1),d=a-b;return[`${a} − ${b} = ?`,d,kNear(d,0,12)];}),
T('K.OA.4','Make 10',()=>{const a=R(1,9),b=10-a;return[`${a} + ? = 10`,b,kNear(b,0,10)];}),
T('K.NBT.1','Teen numbers',()=>{const o=R(1,9);
  return Math.random()<.5?[`10 + ${o} = ?`,10+o,[o,10+o+1,10+o-1>10?10+o-1:20,20+o]]:[`${10+o} is 10 and how many more?`,o,[10,o+1,o-1>0?o-1:o+2,o+2]];}),
T('K.MD.2','Compare size',()=>{
  const idx=shuf([...kRank.keys()]).slice(0,4),big=Math.random()<.5,t=big?Math.max(...idx):Math.min(...idx);
  return[big?'Which one is the biggest?':'Which one is the smallest?',kRank[t],idx.filter(i=>i!==t).map(i=>kRank[i])];}),
T('K.G.2','Name the shape',()=>{
  const n=pick(kName),rest=shuf(kName.filter(x=>x!==n)).slice(0,3);
  return[`What shape is this? ${kShapes[n]}`,n[0].toUpperCase()+n.slice(1),rest.map(x=>x[0].toUpperCase()+x.slice(1))];}),
T('K.G.4','Sides of shapes',()=>{
  const n=pick(['triangle','square','rectangle']);return[`How many sides does a ${n} have?`,kSides[n],[kSides[n]+1,kSides[n]-1,kSides[n]+2,2]];}),
];

G[1]=[
T('1.OA.1','Add and subtract word problems',()=>{
  const w=pick(kWho),e=pick(KE);
  if(Math.random()<.5){const a=R(3,10),b=R(2,9),s=a+b;return[`${w} has ${a} ${e}. ${w} gets ${b} more. How many now?`,s,kNear(s,0,20)];}
  const a=R(8,18),b=R(2,a-3),d=a-b;return[`${w} has ${a} ${e}. ${w} gives away ${b}. How many left?`,d,kNear(d,0,20)];}),
T('1.OA.4','Find the missing number',()=>{
  const a=R(2,12),b=R(2,20-a),s=a+b;
  return Math.random()<.5?[`${a} + ? = ${s}`,b,kNear(b,0,20)]:[`? + ${b} = ${s}`,a,kNear(a,0,20)];}),
T('1.OA.6','Add within 20',()=>{
  const t=R(0,1);
  if(t===0){const a=R(2,9);return[`${a} + ${a} = ?`,2*a,[2*a+1,2*a-1,2*a+2,a+1]];}
  const a=R(6,9),b=R(4,9),s=a+b;return[`${a} + ${b} = ?`,s,kNear(s,10,20)];}),
T('1.OA.6','Subtract within 20',()=>{const a=R(11,18),b=R(3,9),d=a-b;return[`${a} − ${b} = ?`,d,kNear(d,0,20)];}),
T('1.OA.7','Which is true?',()=>{
  const a=R(2,9),b=R(1,9),s=a+b,wr=[s+1,s-1,s+2,s-2].filter(x=>x>=0);
  return[`Which is true?`,`${a} + ${b} = ${s}`,shuf(wr).slice(0,3).map(x=>`${a} + ${b} = ${x}`)];}),
T('1.NBT.1','Count to 100',()=>{
  const n=R(10,95),t=R(0,1);
  return t===0?[`What comes next? ${n}, ${n+1}, ${n+2}, ?`,n+3,[n+2,n+4,n+1,n+5]]:[`What number comes after ${n}?`,n+1,[n,n+2,n+10,n-1]];}),
T('1.NBT.2','Tens and ones',()=>{
  const t=R(1,9),o=R(0,9);
  return Math.random()<.5?[`${t} ${kU(t,'ten')} and ${o} ${kU(o,'one')} = ?`,t*10+o,[t+o,o*10+t||t*10+o+10,t*10+o+10,t*10+o-1>0?t*10+o+1:t*10+o+2]]:[`${t*10+o} is ${t} ${kU(t,'ten')} and how many ones?`,o,[t,o+1,o+2,o+3]];}),
T('1.NBT.3','Compare two-digit numbers',()=>{
  const s=new Set();while(s.size<4)s.add(R(10,99));const a=[...s],big=Math.random()<.5,t=big?Math.max(...a):Math.min(...a);
  return[big?'Which number is the greatest?':'Which number is the least?',t,a.filter(x=>x!==t)];}),
T('1.NBT.5','10 more, 10 less',()=>{
  const n=R(2,8)*10+R(1,9),more=Math.random()<.5;
  return[more?`What is 10 more than ${n}?`:`What is 10 less than ${n}?`,more?n+10:n-10,[more?n+1:n-1,more?n+100:n-100>0?n-100:n+2,more?n-10:n+10,n+(more?20:-20)]];}),
T('1.NBT.4','Add within 100',()=>{
  const t=R(0,1);
  if(t===0){const a=R(1,8)*10+R(1,5),b=R(1,4),s=a+b;return[`${a} + ${b} = ?`,s,[s+10,s-1,s+1,s-10]];}
  const a=R(1,7)*10,b=R(1,9-a/10<2?1:2)*10,s=a+b;return[`${a} + ${b} = ?`,s,[s+10,s-10,s+1,s+100]];}),
T('1.NBT.6','Subtract tens',()=>{const a=R(3,9)*10,b=R(1,a/10-1)*10,d=a-b;return[`${a} − ${b} = ?`,d,[d+10,d-10>0?d-10:d+20,d+1,d+20]];}),
T('1.MD.3','Tell time',()=>{
  const h=R(1,12),half=Math.random()<.5,m=half?30:0,ans=kT(h,m),wr=[kT(h,half?0:30),kT(h%12+1,m),kT((h+10)%12+1,m),kT(h%12+1,half?0:30)];
  return[half?`Half past ${h} is what time?`:`${h} o'clock is what time?`,ans,wr];}),
T('1.MD.4','How many more?',()=>{
  const a=R(5,9),b=R(1,a-2),[e1,e2]=shuf(KE).slice(0,2);
  return[`${kn(e1,a)}  ${kn(e2,b)}  How many more ${e1} than ${e2}?`,a-b,kNear(a-b,0,10)];}),
T('1.G.1','Sides and corners',()=>{
  const n=pick(['triangle','square','rectangle','pentagon','hexagon']),c=kSides[n];
  return[`How many ${Math.random()<.5?'sides':'corners'} does a ${n} have?`,c,[c+1,c-1,c+2,c-2>0?c-2:c+3]];}),
T('1.G.3','Halves and fourths',()=>{
  const two=Math.random()<.5;
  return[`A pizza is cut into ${two?2:4} equal parts. Each part is one what?`,two?'Half':'Quarter',two?['Quarter','Whole','Third']:['Half','Whole','Third']];}),
];

G[2]=[
T('2.OA.1','Word problems within 100',()=>{
  const w=pick(kWho),e=pick(KE);
  if(Math.random()<.5){const a=R(2,6)*10+R(0,4),b=R(1,4)*10,s=a+b;return[`${w} has ${a} ${e}. ${w} finds ${b} more. How many now?`,s,[s+10,s-10,s+1,s-1]];}
  const a=R(5,9)*10+R(0,5),b=R(1,4)*10,d=a-b;return[`${w} has ${a} ${e}. ${w} gives away ${b}. How many left?`,d,[d+10,d-10,d+1,d-1]];}),
T('2.OA.2','Add and subtract within 20',()=>{
  if(Math.random()<.5){const a=R(6,9),b=R(5,9),s=a+b;return[`${a} + ${b} = ?`,s,kNear(s,10,20)];}
  const a=R(12,18),b=R(4,9),d=a-b;return[`${a} − ${b} = ?`,d,kNear(d,0,20)];}),
T('2.OA.3','Odd or even',()=>{
  const odd=Math.random()<.5,s=new Set();const pickN=(p)=>{let x;do{x=R(2,40);}while(x%2!==p);return x;};
  const t=odd?pickN(1):pickN(0);const others=new Set();while(others.size<3)others.add(pickN(odd?0:1));
  return[odd?'Which number is odd?':'Which number is even?',t,[...others]];}),
T('2.OA.4','Rows and arrays',()=>{
  const r=R(2,5),c=R(2,5),e=pick(KE);
  return Math.random()<.5?[`${r} rows of ${c} ${e}. How many ${e} in all?`,r*c,[r+c,r*c+c,r*c-r,r*c+r]]:[`${Array(r).fill(c).join(' + ')} = ?`,r*c,[r*c+c,r*c-c,r*c+1,r+c]];}),
T('2.NBT.1','Place value',()=>{
  const d=shuf([1,2,3,4,5,6,7,8,9]).slice(0,3),n=d[0]*100+d[1]*10+d[2],k=R(0,2),pl=['hundreds','tens','ones'];
  const pu=['hundred','ten','one'],lab=(x,i)=>`${x} ${kU(x,pu[i])}`;
  const ans=lab(d[k],k),wr=[0,1,2].filter(i=>i!==k).map(i=>lab(d[k],i)).concat([lab(d[(k+1)%3],k)]);
  return[`In ${n}, what does the ${d[k]} stand for?`,ans,wr];}),
T('2.NBT.2','Skip counting',()=>{
  const st=pick([5,10,100]),a=st===100?R(1,5)*100:R(1,6)*st;
  const e=a+4*st;return[`${a}, ${a+st}, ${a+2*st}, ${a+3*st}, ?`,e,[e+st,e-st,e+1,e+2*st]];}),
T('2.NBT.3','Read and write numbers',()=>{
  const h=R(1,9),t=R(0,9),o=R(1,9),n=h*100+t*10+o;
  return[t?`${h*100} + ${t*10} + ${o} = ?`:`${h*100} + ${o} = ?`,n,[h*100+t+o,h*100+o*10+t,n+10,n-1]];}),
T('2.NBT.4','Compare three-digit numbers',()=>{
  const s=new Set();while(s.size<4)s.add(R(100,999));const a=[...s],big=Math.random()<.5,t=big?Math.max(...a):Math.min(...a);
  return[big?'Which number is the greatest?':'Which number is the least?',t,a.filter(x=>x!==t)];}),
T('2.NBT.5','Add and subtract within 100',()=>{
  if(Math.random()<.5){const a=R(1,6)*10+R(1,6),b=R(1,3)*10+R(1,3),s=a+b;return[`${a} + ${b} = ?`,s,[s+10,s-10,s+1,s-1]];}
  const a=R(5,9)*10+R(3,9),b=R(1,4)*10+R(1,3),d=a-b;return[`${a} − ${b} = ?`,d,[d+10,d-10,d+1,d-1]];}),
T('2.NBT.8','10 or 100 more or less',()=>{
  const n=R(2,8)*100+R(1,9)*10+R(0,9),by=pick([10,100]),more=Math.random()<.5,r=more?n+by:n-by;
  return[`What is ${by} ${more?'more':'less'} than ${n}?`,r,[more?n-by:n+by,r+(by===10?100:10),r+(by===10?-100:-10),n+(more?1:-1)*(by===10?1:10)*2]];}),
T('2.MD.8','Coins and money',()=>{
  let q,d,n,p;do{q=R(0,2);d=R(0,3);n=R(0,2);p=R(0,4);}while(q+d+n+p<2);
  const parts=[];if(q)parts.push(`${q} quarter${q>1?'s':''}`);if(d)parts.push(`${d} dime${d>1?'s':''}`);if(n)parts.push(`${n} nickel${n>1?'s':''}`);if(p)parts.push(`${p} penn${p>1?'ies':'y'}`);
  const v=q*25+d*10+n*5+p,txt=parts.length>1?parts.slice(0,-1).join(', ')+' and '+parts[parts.length-1]:parts[0];
  return[`${txt} = how many cents?`,`${v}¢`,[`${v+10}¢`,`${v-5>0?v-5:v+15}¢`,`${v+5}¢`,`${v+1}¢`]];}),
T('2.MD.7','Time to 5 minutes',()=>{
  const h=R(1,11),m=pick([5,10,15,20,25,30,35,40,45,50]),add=pick([5,10,15,30]);
  if(m+add>=60)return[`What time is it 30 minutes after ${kT(h,0)}?`,kT(h,30),[kT(h,0),kT(h+1,30),kT(h,15),kT(h+1,0)]];
  const r=kT(h,m+add);return[`The time is ${kT(h,m)}. What time is it ${add} minutes later?`,r,[kT(h,m+add+5),kT(h,m+add>=5?m+add-5:m+add+10),kT(h+1,m+add),kT(h,m)]];}),
T('2.G.1','Shapes by sides',()=>{
  const n={3:'Triangle',4:'Quadrilateral',5:'Pentagon',6:'Hexagon'},k=R(3,6);
  return[`A shape with ${k} sides is called a what?`,n[k],[3,4,5,6].filter(x=>x!==k).map(x=>n[x])];}),
T('2.G.3','Equal parts',()=>{
  const k=pick([2,3,4]),nm={2:'Half',3:'Third',4:'Fourth'};
  if(Math.random()<.5)return[`A shape is cut into ${k} equal parts. Each part is one what?`,nm[k],['Half','Third','Fourth','Whole'].filter(x=>x!==nm[k])];
  return[`How many ${k===2?'halves':k===3?'thirds':'fourths'} make 1 whole?`,k,[k+1,k-1>0?k-1:k+3,k+2,k*2]];}),
];

// plain calculation for the youngest grades (about 4 questions in 10)
const QK={
0:()=>{if(Math.random()<.6){const a=R(1,9),b=R(1,10-a),s=a+b;return[`${a} + ${b} = ?`,s,kNear(s,0,12)];}
  const a=R(2,10),b=R(1,a-1),d=a-b;return[`${a} − ${b} = ?`,d,kNear(d,0,12)];},
1:()=>{const t=R(0,2);
  if(t===0){const a=R(3,12),b=R(3,20-a),s=a+b;return[`${a} + ${b} = ?`,s,kNear(s,0,24)];}
  if(t===1){const a=R(10,20),b=R(2,9),d=a-b;return[`${a} − ${b} = ?`,d,kNear(d,0,24)];}
  const a=R(1,9)*10,b=R(1,9)*10,s=a+b;return[`${a} + ${b} = ?`,s,[s+10,s-10,s+1,s+100]];},
2:()=>{const t=R(0,3);
  if(t===0){const a=R(1,7)*10,b=R(1,7)*10,s=a+b;return[`${a} + ${b} = ?`,s,[s+10,s-10,s+1,s+100]];}
  if(t===1){const a=R(5,9)*10,b=R(1,4)*10,d=a-b;return[`${a} − ${b} = ?`,d,[d+10,d-10,d+1,d-1]];}
  if(t===2){const a=R(11,49),b=R(11,39),s=a+b;return[`${a} + ${b} = ?`,s,[s+10,s-10,s+1,s-1]];}
  const a=R(40,99),b=R(11,a-10),d=a-b;return[`${a} − ${b} = ?`,d,[d+10,d-10,d+1,d-1]];}
};
[[0,'K.OA.5'],[1,'1.OA.6'],[2,'2.NBT.5']].forEach(([g,std])=>{const t=T(std,'Quick calculation',QK[g]);t.calc=true;G[g].push(t);});
GRADES.unshift(0,1,2);
