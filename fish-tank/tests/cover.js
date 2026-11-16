const fs=require('fs');
fs.writeFileSync(__dirname+'/_q6.js',fs.readFileSync(__dirname+'/questions.js','utf8')+'\n'+fs.readFileSync(__dirname+'/cov.js','utf8')+'\nmodule.exports={G,GRADES,STD};');
const {G,GRADES,STD}=require('./_q6.js');
let totalAll=0,doneAll=0,picAll=0;
for(const g of GRADES){
  const have=new Set();
  G[g].forEach(t=>{[t.std,...(t.cov||[])].forEach(s=>{if(s)have.add(s.replace(' review','').trim());});});
  const missing=[],pics=[];let n=0,ok=0;
  STD[g].forEach(([c,d,pic])=>{n++;if(have.has(c))ok++;else if(pic)pics.push(c);else missing.push(c+' '+d);});
  console.log(`Grade ${g}: ${ok}/${n} covered, ${pics.length} need pictures (${pics.join(', ')||'-'}), ${missing.length} missing`);
  if(process.argv[2]==='-v')missing.forEach(m=>console.log('   -',m));
  totalAll+=n;doneAll+=ok;picAll+=pics.length;
}
console.log(`TOTAL ${doneAll}/${totalAll} covered; ${picAll} need pictures; ${totalAll-doneAll-picAll} missing`);
