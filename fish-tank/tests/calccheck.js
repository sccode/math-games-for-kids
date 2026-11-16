const fs=require('fs');
fs.writeFileSync(__dirname+'/_q2.js',fs.readFileSync(__dirname+'/questions.js','utf8')+'\nmodule.exports={G,GRADES};');
const {G,GRADES}=require('./_q2.js');
let n=0,bad=0,skipped=0;
const sups={'²':'**2','³':'**3'};
for(const g of GRADES){
  const t=G[g].find(x=>x.name==='Quick calculation');
  for(let i=0;i<3000;i++){
    const r=t.gen();n++;
    if(r.q.includes('[[')||r.a.includes('[[')){skipped++;continue;}
    let e=r.q.replace(' = ?','').replace(/(\d+)% of (\d+)/,'($1/100*$2)').replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/([²³])/g,m=>sups[m]).replace(/√(\d+)/g,'Math.sqrt($1)');
    let v=eval(e);const a=parseFloat(r.a.replace(/−/g,'-'));
    if(Math.abs(v-a)>1e-9){bad++;if(bad<10)console.log('MISMATCH',g,r.q,r.a,v);}
  }
}
console.log('checked',n,'skipped (fractions)',skipped,'mismatches',bad);
console.log('weights',GRADES.map(g=>g+':'+G[g].find(x=>x.name==='Quick calculation').w+'/'+G[g].length).join(' '));
