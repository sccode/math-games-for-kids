// Fish Tank Math: question generators, aligned to the California Common Core State Standards for Mathematics
const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[R(0,a.length-1)];
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=R(0,i);[a[i],a[j]]=[a[j],a[i]];}return a;};
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const FR=(n,d)=>`[[${n}|${d}]]`;
const F=(n,d)=>{const g=gcd(n,d)||1;n/=g;d/=g;if(d<0){n=-n;d=-d;}return d===1?String(n):FR(n,d);};
const D=(x,p=4)=>String(+x.toFixed(p));
const KEY=s=>{s=String(s).replace(/−/g,'-');let m=s.match(/^\[\[(-?\d+)\|(\d+)\]\]$/);if(m)return String(+(m[1]/m[2]).toFixed(9));if(/^-?\d+(\.\d+)?$/.test(s))return String(+s);return s;};
function mc(ans,wrongs){
  ans=String(ans);const seen=new Set([KEY(ans)]),out=[];
  const add=s=>{s=String(s);if(/-\d/.test(s)||/[+−] 0$/.test(s)||/^0x/.test(s))return;const k=KEY(s);if(!seen.has(k)){seen.add(k);out.push(s);}};
  wrongs.forEach(add);
  if(out.length<3){
    const toks=[...ans.matchAll(/[−-]?\d+(?:\.\d+)?/g)];
    for(let i=0;out.length<3&&i<400&&toks.length;i++){
      const t=pick(toks),raw=t[0],dec=(raw.split('.')[1]||'').length,v=parseFloat(raw.replace('−','-'));
      const span=Math.max(3,Math.round(Math.abs(v)*0.15))*(i>60?2:1),nv=v+R(-span,span)*Math.pow(10,-dec);
      if(v>=0&&nv<0)continue;
      if(/\[\[/.test(ans)&&nv<=0)continue;
      add(ans.slice(0,t.index)+D(nv,dec).replace('-','−')+ans.slice(t.index+raw.length));
    }
  }
  return{a:ans,c:shuf([ans,...out.slice(0,3)])};
}
const T=(std,name,fn)=>({std,name,gen(){const[q,a,w]=fn();const m=mc(a,w||[]);return{q,a:m.a,c:m.c,std,topic:name};}});
const G={};

G[3]=[
T('3.OA.7','Multiplication facts',()=>{const a=R(2,10),b=R(2,10),p=a*b;return[`${a} × ${b} = ?`,p,[p+a,p-b,p+b,p-a]];}),
T('3.OA.7','Division facts',()=>{const a=R(2,9),b=R(2,9);return[`${a*b} ÷ ${a} = ?`,b,[b+1,b-1,a,b+2]];}),
T('3.NBT.2','Add and subtract within 1,000',()=>{
  if(Math.random()<.5){const a=R(120,640),b=R(100,350),s=a+b;return[`${a} + ${b} = ?`,s,[s+10,s-10,s+100,s-1]];}
  const a=R(400,990),b=R(100,a-50),d=a-b;return[`${a} − ${b} = ?`,d,[d+10,d-10,d+100,d+1]];}),
T('3.NBT.1','Rounding',()=>{let n=R(112,988);if(n%10===0)n+=3;const p=pick([10,100]),r=Math.round(n/p)*p;
  return[`Round ${n} to the nearest ${p}.`,r,[Math.floor(n/p)*p,Math.ceil(n/p)*p,Math.round(n/(p*10))*p*10,r+p,r-p]];}),
T('3.MD.8','Perimeter',()=>{const l=R(4,12),w=R(2,l-1);return[`A rectangle is ${l} cm long and ${w} cm wide. What is its perimeter in cm?`,2*(l+w),[l*w,l+w,2*l+w,2*(l+w)+2]];}),
T('3.MD.7','Area of rectangles',()=>{const l=R(3,12),w=R(2,l-1);return[`A rectangle is ${l} cm long and ${w} cm wide. What is its area in square cm?`,l*w,[2*(l+w),l+w,l*w+l,l*w-w]];}),
T('3.OA.3','Word problems',()=>{const g=R(3,9),n=R(3,9);return Math.random()<.5?[`There are ${g} boxes with ${n} crayons in each box. How many crayons are there in all?`,g*n,[g+n,g*n+g,g*n-n,g*(n+1)]]:[`${g*n} stickers are shared equally among ${g} friends. How many stickers does each friend get?`,n,[n+1,n-1,g,g*n-g]];}),
T('3.OA.8','Two-step problems',()=>{const a=R(20,60),b=R(10,40),c=R(5,Math.min(30,a+b-5)),r=a+b-c;return[`Mia has ${a} stickers. She gets ${b} more, then gives ${c} away. How many stickers does she have now?`,r,[a+b+c,a+b,r+10,r-10]];}),
T('3.NF.3','Compare fractions',()=>{const ds=shuf([2,3,4,5,6,8,10]).slice(0,4),best=Math.min(...ds);return['Which fraction is the greatest?',FR(1,best),ds.filter(d=>d!==best).map(d=>FR(1,d))];}),
];

G[4]=[
T('4.NBT.5','Multiply by one digit',()=>{const a=R(23,98),b=R(3,9),p=a*b;return[`${a} × ${b} = ?`,p,[p+10,p-10,p+100,p-b]];}),
T('4.NBT.5','Multiply two-digit numbers',()=>{const a=R(12,49),b=R(11,29),p=a*b;return[`${a} × ${b} = ?`,p,[p+10,p-10,p+100,p-a]];}),
T('4.NBT.6','Divide by one digit',()=>{const d=R(3,9),q=R(5,Math.floor(99/d));return[`${d*q} ÷ ${d} = ?`,q,[q+1,q-1,q+10,q-10]];}),
T('4.NBT.4','Add and subtract big numbers',()=>{
  if(Math.random()<.5){const a=R(1200,5900),b=R(1100,3900),s=a+b;return[`${a} + ${b} = ?`,s,[s+100,s-100,s+10,s-10]];}
  const a=R(4200,9900),b=R(1100,a-1500),d=a-b;return[`${a} − ${b} = ?`,d,[d+100,d-100,d+10,d-10]];}),
T('4.NBT.3','Rounding',()=>{let n=R(1234,9876);if(n%10===0)n+=7;const p=pick([10,100,1000]),r=Math.round(n/p)*p;
  return[`Round ${n} to the nearest ${p}.`,r,[Math.floor(n/p)*p,Math.ceil(n/p)*p,Math.round(n/(p*10))*p*10,r+p,r-p]];}),
T('4.OA.1','Multiplicative comparison',()=>{const b=R(4,12),k=R(3,9);return[`Sam has ${b} marbles. Ana has ${k} times as many. How many marbles does Ana have?`,b*k,[b+k,b*k+k,b*(k+1),b*k-b]];}),
T('4.OA.3','Multi-step problems',()=>{const a=R(6,12),b=R(3,9),c=R(5,Math.min(a*b-5,99)),r=a*b-c;return[`A bakery bakes ${a} muffins on each of ${b} trays. It sells ${c} muffins. How many muffins are left?`,r,[a*b+c,a+b-c>0?a+b-c:r+10,r+10,r-10]];}),
T('4.NF.1','Equivalent fractions',()=>{const d=pick([2,3,4,5,6]),n=R(1,d-1),k=R(2,5);return[`${FR(n,d)} = ?/${d*k}`,n*k,[n+k,n*k+1,n*k-1,d*k-n]];}),
T('4.NF.3','Add fractions, same denominator',()=>{const d=R(5,12),a=R(1,d-3),b=R(1,d-a-1);return[`${FR(a,d)} + ${FR(b,d)} = ?`,FR(a+b,d),[FR(a+b,2*d),FR(a+b+1,d),FR(a+b-1,d),FR(a*b,d)]];}),
T('4.NF.4','Whole number times fraction',()=>{const d=R(3,8),n=R(1,d-1),w=R(2,6);return[`${w} × ${FR(n,d)} = ?`,FR(w*n,d),[FR(w*n,w*d),FR(w+n,d),FR(w*n+1,d),FR(w*n-1,d)]];}),
T('4.NF.6','Fractions and decimals',()=>{if(Math.random()<.5){const n=R(1,9);return[`${FR(n,10)} as a decimal is?`,D(n/10),[D(n/100),D(n),D(n/10+0.1),D(n/1000)]];}
  let m=R(11,99);if(m%10===0)m++;return[`${FR(m,100)} as a decimal is?`,D(m/100),[D(m/10),D(m/1000),D(m),D(m/100+0.1)]];}),
T('4.MD.3','Area and perimeter',()=>{const l=R(5,15),w=R(2,l-1),isA=Math.random()<.5;return isA?[`A garden is ${l} m long and ${w} m wide. What is its area in square meters?`,l*w,[l+w,2*(l+w),l*w+l,l*w-w]]:[`A garden is ${l} m long and ${w} m wide. What is its perimeter in meters?`,2*(l+w),[l*w,l+w,2*l+w,2*(l+w)+2]];}),
T('4.MD.1','Unit conversion',()=>{const[big,small,f]=pick([['feet','inches',12],['yards','feet',3],['meters','centimeters',100],['kilometers','meters',1000],['hours','minutes',60],['pounds','ounces',16],['weeks','days',7]]),n=R(2,9);return[`${n} ${big} = ? ${small}`,n*f,[n+f,n*f*10,n*(f+1),n*f/10]];}),
T('4.MD.7','Angles',()=>{const a=R(60,170),b=R(20,a-20);return[`A ${a}° angle is split into two angles. One of them is ${b}°. How big is the other angle in degrees?`,a-b,[a+b,a-b+10,a-b-10,180-a]];}),
];
