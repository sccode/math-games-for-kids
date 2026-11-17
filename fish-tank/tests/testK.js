const fs=require('fs');
const src=fs.readFileSync(__dirname+'/qA.js','utf8')+fs.readFileSync(__dirname+'/qB.js','utf8')+fs.readFileSync(__dirname+'/qC.js','utf8')+fs.readFileSync(__dirname+'/qD.js','utf8')+fs.readFileSync(__dirname+'/qK.js','utf8')+'\nmodule.exports={G,KEY};';
fs.writeFileSync(__dirname+'/_qk.js',src);const {G,KEY}=require('./_qk.js');
let bad=0,total=0;
for(const g of [0,1,2]){for(const t of G[g]){let first=null,seen=new Set();
 for(let i=0;i<4000;i++){let r;try{r=t.gen();}catch(e){console.log('THROW',g,t.name,e.message);bad++;break;}
  total++;if(!first)first=r;seen.add(r.q);const keys=r.c.map(KEY),errs=[];
  if(r.c.length!==4)errs.push('len');if(new Set(keys).size!==4)errs.push('dup');if(!r.c.includes(r.a))errs.push('noans');
  const all=r.q+r.c.join('|');if(/NaN|undefined|Infinity|null/.test(all))errs.push('tok');if(/-\d/.test(all))errs.push('minus');
  if(errs.length){bad++;console.log('ERR',g,t.name,errs.join(','),JSON.stringify(r));break;}}
 console.log(`G${g} [${t.std}] ${t.name} (${seen.size} distinct): ${first.q} => ${first.a} {${first.c.join(' , ')}}`);}}
console.log('total',total,'bad',bad);
