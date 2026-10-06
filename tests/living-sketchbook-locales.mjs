import {readFileSync,existsSync} from 'node:fs';
import {priceFor,OFFERS} from '../data/pricing.js';
const assert=(ok,message)=>{if(!ok)throw new Error(message)};
for(const [prefix,market,label] of [['','in','India · INR'],['ae/','ae','UAE · AED'],['au/','au','Australia · AUD']]){
 for(const route of ['index.html','plans/index.html','clients/index.html','clients/fakhrimart/index.html','work/lernio/index.html','work/brace/index.html','founder/index.html','ai-workflow-audit/index.html','company-second-brain/index.html','terms/index.html','privacy/index.html']){
  const file=`dist/${prefix}${route}`;assert(existsSync(file),'Missing '+file);const html=readFileSync(file,'utf8');
  assert(html.includes('lang="en"'),'English page missing '+file);assert(html.includes(label),'Market label missing '+file);
  assert(!/[\u0600-\u06ff]/.test(html),'Arabic text shipped '+file);
  const expectedCanonical=`https://brayroai.vercel.app/${prefix}${route==='index.html'?'':route.replace('/index.html','')}`.replace(/\/$/,'/') ;
  assert(html.includes('rel="alternate" hreflang="en-IN"'),'Regional alternates missing '+file);
  assert(html.includes('property="og:locale"'),'Open Graph locale missing '+file);
 }
 const plans=readFileSync(`dist/${prefix}plans/index.html`,'utf8');
 for(const id of Object.keys(OFFERS))assert(plans.includes(`data-price="${id}">${priceFor(id,market)}`),'Wrong '+market+' price for '+id);
}
console.log('Living Sketchbook locale integrity OK');
