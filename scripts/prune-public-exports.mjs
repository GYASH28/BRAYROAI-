import {existsSync,rmSync} from 'node:fs';
import {resolve} from 'node:path';

const targets=['outbound-fresh'];
for(const target of targets){
  const path=resolve(process.cwd(),'dist',target);
  if(existsSync(path)){rmSync(path,{recursive:true,force:true});console.log(`Pruned non-production public export: ${target}`)}
}
