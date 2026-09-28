import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
for(const [route,file] of [['plans','plans.html'],['clients/fakhrimart','fakhrimart-case-study.html'],['terms','terms.html']]){
 const path=resolve('dist',route,'index.html');mkdirSync(dirname(path),{recursive:true});writeFileSync(path,readFileSync(resolve('dist',file)));
}
