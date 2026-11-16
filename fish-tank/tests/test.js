const fs=require('fs');
const src=fs.readFileSync(__dirname+'/questions.js','utf8')+'\nmodule.exports={G,KEY,GRADES};';
fs.writeFileSync(__dirname+'/_q.js',src);
const {G,KEY,GRADES}=require('./_q.js');
let bad=0,total=0;
for(const g of GRADES){
  for(const t of G[g]){
    let first=null;
    for(let i=0;i<500;i++){
      let r;try{r=t.gen();}catch(e){console.log('THROW',g,t.name,e.message);bad++;break;}
      total++;
      if(!first)first=r;
      const keys=r.c.map(KEY);
      const errs=[];
      if(r.c.length!==4)errs.push('len'+r.c.length);
      if(new Set(keys).size!==r.c.length)errs.push('dup');
      if(!r.c.includes(r.a))errs.push('noans');
      const all=r.q+r.c.join('|');
      if(/NaN|undefined|Infinity|null/.test(all))errs.push('bad token');
      if(/-\d/.test(all.replace(/\[\[-?\d+\|\d+\]\]/g,'')))errs.push('ascii minus');
      if(/^0\d/.test(r.a))errs.push('lead0');
      if(errs.length){bad++;if(bad<25)console.log('ERR',g,t.name,errs.join(','),JSON.stringify(r));break;}
    }
    console.log(`G${g} [${t.std}] ${t.name}: ${first.q}  =>  ${first.a}   {${first.c.join(' , ')}}`);
  }
}
console.log('total',total,'bad',bad);
