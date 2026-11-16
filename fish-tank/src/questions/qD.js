
// ---- plain calculation (+ − × ÷), about 4 of every 10 questions ----
const QC={
3:()=>{const t=R(0,4);
  if(t===0){const a=R(2,10),b=R(2,10),p=a*b;return[`${a} × ${b} = ?`,p,[p+a,p-b,p+b,p-a]];}
  if(t===1){const a=R(2,9),b=R(2,9);return[`${a*b} ÷ ${a} = ?`,b,[b+1,b-1,a,b+2]];}
  if(t===2){const a=R(2,9),b=R(1,5)*10,p=a*b;return[`${a} × ${b} = ?`,p,[p*10,p/10,p+a,p+b]];}
  if(t===3){const a=R(12,59),b=R(11,39),s=a+b;return[`${a} + ${b} = ?`,s,[s+10,s-10,s+1,s-1]];}
  const a=R(40,99),b=R(11,a-10),d=a-b;return[`${a} − ${b} = ?`,d,[d+10,d-10,d+1,d-1]];},
4:()=>{const t=R(0,4);
  if(t===0){const a=R(2,12),p=a*12;return[`${a} × 12 = ?`,p,[p+10,p-10,p+a,p-a]];}
  if(t===1){const a=R(11,25),b=R(2,5),p=a*b;return[`${a} × ${b} = ?`,p,[p+10,p-10,p+b,p-b]];}
  if(t===2){const d=R(2,9),q=R(5,Math.min(20,Math.floor(99/d)));return[`${d*q} ÷ ${d} = ?`,q,[q+1,q-1,q+10,q-10]];}
  if(t===3){const a=R(2,9)*10+R(0,1)*5,b=R(2,9)*10,s=a+b;return[`${a} + ${b} = ?`,s,[s+10,s-10,s+100,s-5]];}
  const a=R(20,99),b=R(10,a-5),d=a-b;return[`${a} − ${b} = ?`,d,[d+10,d-10,d+1,d-1]];},
5:()=>{const t=R(0,5);
  if(t===0){const a=R(12,49),b=R(2,6),p=a*b;return[`${a} × ${b} = ?`,p,[p+10,p-10,p+b,p-b]];}
  if(t===1){const d=R(3,9),q=R(11,Math.floor(99/d));return[`${d*q} ÷ ${d} = ?`,q,[q+1,q-1,q+10,q-10]];}
  if(t===2){const A=R(11,99),B=R(11,99),s=A+B;return[`${D(A/10,1)} + ${D(B/10,1)} = ?`,D(s/10,1),[D((s+1)/10,1),D((s-1)/10,1),D((s+10)/10,1),D((s-10)/10,1)]];}
  if(t===3){const A=R(2,9),w=R(2,9),p=A*w;return[`${D(A/10,1)} × ${w} = ?`,D(p/10,1),[D(p/100,2),D(p,0),D((p+10)/10,1),D((p-10)/10,1)]];}
  if(t===4){const a=R(2,9),b=R(2,6),c=R(2,6);return[`${a} + ${b} × ${c} = ?`,a+b*c,[(a+b)*c,a*b+c,a+b+c,a+b*c+b]];}
  const a=R(50,99),b=R(11,a-10),d=a-b;return[`${a} − ${b} = ?`,d,[d+10,d-10,d+1,d-1]];},
6:()=>{const t=R(0,5);
  if(t===0){const d1=pick([2,3,4]),m=pick([2,3]),d2=d1*m,n1=R(1,d1-1),n2=R(1,d2-1),top=n1*m+n2;
    return[`${FR(n1,d1)} + ${FR(n2,d2)} = ?`,F(top,d2),[F(n1+n2,d1+d2),F(n1+n2,d2),F(top+1,d2),F(top-1,d2)]];}
  if(t===1){const d1=R(2,6),d2=R(2,6),n1=R(1,d1-1),n2=R(1,d2-1);return[`${FR(n1,d1)} × ${FR(n2,d2)} = ?`,F(n1*n2,d1*d2),[F(n1+n2,d1+d2),F(n1*n2,d1+d2),F(n1*d2,d1*n2),F(n1*n2+1,d1*d2)]];}
  if(t===2){const A=R(2,9),B=R(2,9),p=A*B;return[`${D(A/10,1)} × ${D(B/10,1)} = ?`,D(p/100,2),[D(p/10,1),D(p/1000,3),D(p,0),D((p+10)/100,2)]];}
  if(t===3){const p=pick([10,20,25,50,75]),m={10:10,20:5,25:4,50:2,75:4}[p],n=R(2,Math.floor(99/m))*m,a=p*n/100;return[`${p}% of ${n} = ?`,a,[a*2,n-a,a+p,a*10]];}
  if(t===4){let d=R(2,6),e=R(2,8);while(d===e)e=R(2,8);return[`${FR(1,d)} ÷ ${FR(1,e)} = ?`,F(e,d),[F(d,e),F(1,d*e),F(e+1,d),F(e,d+1)]];}
  const a=R(2,12),k=R(2,5);return[`${D(a*k/10,1)} ÷ ${D(k/10,1)} = ?`,a,[a*10,a+1,a-1>0?a-1:a+2,a/10]];},
7:()=>{const t=R(0,5);
  let a=R(-9,9),b=R(-9,9),c=R(-9,9);if(!a)a=7;if(!b)b=-4;if(!c)c=3;
  if(t===0)return[`${S(a)} + ${PN(b)} = ?`,S(a+b),[S(a-b),S(-(a+b)),S(a+b+2),S(a+b-2)]];
  if(t===1)return[`${S(a)} − ${PN(b)} = ?`,S(a-b),[S(a+b),S(b-a),S(a-b+2),S(a-b-2)]];
  if(t===2)return[`${S(a)} × ${PN(b)} = ?`,S(a*b),[S(-a*b),S(a+b),S(a*b+a),S(a*b-b)]];
  if(t===3){const p=a*b;return[`${S(p)} ÷ ${PN(a)} = ?`,S(b),[S(-b),S(b+1),S(b-1),S(a)]];}
  if(t===4)return[`${S(a)} + ${PN(b)} − ${PN(c)} = ?`,S(a+b-c),[S(a+b+c),S(a-b-c),S(a-b+c),S(a+b-c+2)]];
  const A=R(-30,30)||15,B=R(-30,30)||-12;return[`${SD(A/10,1)} + ${B<0?`(${SD(B/10,1)})`:SD(B/10,1)} = ?`,SD((A+B)/10,1),[SD((A-B)/10,1),SD(-(A+B)/10,1),SD((A+B+10)/10,1),SD((A+B-10)/10,1)]];},
8:()=>{const t=R(0,4);
  const a=R(2,6),b=R(2,6),c=R(2,6);
  if(t===0)return[`${a} − ${b} × ${c} = ?`,S(a-b*c),[S((a-b)*c),S(a+b*c),S(b*c-a),S(a-b+c)]];
  if(t===1){const n=R(3,9);return[`√${n*n} + ${b} × ${c} = ?`,S(n+b*c),[S((n+b)*c),S(n*b+c),S(n+b+c),S(n+b*c+b)]];}
  if(t===2)return[`${a}${sup(2)} − ${b} × ${c} = ?`,S(a*a-b*c),[S((a*a-b)*c),S(a*a+b*c),S(a*(a-b*c)),S(2*a-b*c)]];
  if(t===3)return[`(−${a}) × (−${b}) + ${c} = ?`,S(a*b+c),[S(a*b-c),S(-a*b+c),S(-a*b-c),S(a*b+c+a)]];
  const dd=R(2,6),e=R(2,9);return[`${dd*e} ÷ ${dd} + ${b} × ${c} = ?`,S(e+b*c),[S((e+b)*c),S(dd*e/dd*b+c),S(e+b+c),S(e+b*c+dd)]];}
};
[[3,'3.OA.7'],[4,'4.NBT.5'],[5,'5.NBT.5'],[6,'6.NS.3'],[7,'7.NS.3'],[8,'8.EE.1 review']].forEach(([g,std])=>{
  const t=T(std,'Quick calculation',QC[g]);t.calc=true;G[g].push(t);
});
