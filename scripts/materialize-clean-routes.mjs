import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
for(const [route,file] of [['plans','plans.html'],['clients','clients.html'],['clients/fakhrimart','fakhrimart-case-study.html'],['work/lernio','work-lernio.html'],['work/brace','work-brace.html'],['founder','founder.html'],['ai-workflow-audit','ai-workflow-audit.html'],['company-second-brain','company-second-brain.html'],['terms','terms.html'],['privacy','privacy.html']]){
 const path=resolve('dist',route,'index.html');mkdirSync(dirname(path),{recursive:true});writeFileSync(path,readFileSync(resolve('dist',file)));
}
