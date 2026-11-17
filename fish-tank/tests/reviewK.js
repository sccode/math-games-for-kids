const fs=require('fs');
const src=['qA','qB','qC','qD','qK'].map(f=>fs.readFileSync(__dirname+'/'+f+'.js','utf8')).join('')+'\nmodule.exports={G,KEY};';
fs.writeFileSync(__dirname+'/_rk.js',src);const {G,KEY}=require('./_rk.js');
let n=0,bad=0;const log=(m)=>{bad++;if(bad<15)console.log(m)};
const num=x=>Number(String(x).replace(/[^\d-]/g,''));
for(const g of [0,1,2])for(const t of G[g])for(let i=0;i<3000;i++){const r=t.gen();n++;
 let m;
 if(m=r.q.match(/^(\d+) ([+−]) (\d+) = \?$/)){const v=m[2]==='+'?+m[1]+ +m[3]:m[1]-m[3];if(Number(r.a)!==v)log('ARITH '+r.q+' '+r.a);}
 if(m=r.q.match(/^(\d+) \+ \? = (\d+)$/)){if(Number(r.a)!==m[2]-m[1])log('MISS '+r.q+' '+r.a);}
 if(m=r.q.match(/^\? \+ (\d+) = (\d+)$/)){if(Number(r.a)!==m[2]-m[1])log('MISS '+r.q+' '+r.a);}
 if(m=r.q.match(/^(\d+) \+ (\d+) \+ (\d+) = \?$/)){}
 if(m=r.q.match(/^What is (\d+) (more|less) than (\d+)\?$/)){const v=m[2]==='more'?+m[3]+ +m[1]:m[3]-m[1];if(Number(r.a)!==v)log('MOREL '+r.q+' '+r.a);}
 if(m=r.q.match(/^What is 10 (more|less) than (\d+)\?$/)){}
 if(r.q.includes('GREATEST')||/greatest|biggest/.test(r.q)&&/^Which number/.test(r.q)){if(Number(r.a)!==Math.max(...r.c.map(Number)))log('MAX '+r.q+JSON.stringify(r));}
 if(/least|smallest/.test(r.q)&&/^Which number/.test(r.q)){if(Number(r.a)!==Math.min(...r.c.map(Number)))log('MIN '+r.q+JSON.stringify(r));}
 if(m=r.q.match(/^(\d+) (?:tens?) and (\d+) ones? = \?$/)){if(Number(r.a)!==10*m[1]+ +m[2])log('TENS '+r.q+r.a);}
 if(m=r.q.match(/^(\d+) \+ (\d+) \+ (\d+) = \?$/)){if(Number(r.a)!==+m[1]+ +m[2]+ +m[3])log('EXP '+r.q+r.a);}
 if(m=r.q.match(/^(\d+) rows of (\d+)/)){if(Number(r.a)!==m[1]*m[2])log('ARR '+r.q);}
 if(m=r.q.match(/^((?:\d+ \+ )+\d+) = \?$/)){const v=eval(m[1]);if(Number(r.a)!==v)log('ADDS '+r.q+r.a);}
 if(m=r.q.match(/^How many\? (\S+)$/u)){const cnt=[...m[1]].length;if(Number(r.a)!==cnt)log('COUNT '+r.q);}
 // answer must be the only choice that is true in same-form arithmetic
 if(/^Which is true/.test(r.q)){const t2=c=>{const k=c.match(/(\d+) \+ (\d+) = (\d+)/);return +k[1]+ +k[2]===+k[3];};if(r.c.filter(t2).length!==1||!t2(r.a))log('TRUE '+JSON.stringify(r));}
 if(/Which number is (odd|even)/.test(r.q)){const odd=/odd/.test(r.q);if(r.c.filter(c=>(c%2===1)===odd).length!==1)log('PARITY '+JSON.stringify(r));}
 if(m=r.q.match(/^(\S+) = how many cents\?/)){}
 if(/how many cents/.test(r.q)){const q=r.q.split(' = ')[0],vals={quarter:25,dime:10,nickel:5,penny:1,pennies:1};let v=0;for(const mm of q.matchAll(/(\d+) (quarter|dime|nickel|penny|pennies)/g))v+=+mm[1]*vals[mm[2]];if(Number(String(r.a).replace('¢',''))!==v)log('COINS '+r.q+r.a);}
 const sel=r.c.filter(c=>KEY(c)===KEY(r.a));if(sel.length!==1)log('ONEANS '+JSON.stringify(r));
}
console.log('checked',n,'problems',bad);
