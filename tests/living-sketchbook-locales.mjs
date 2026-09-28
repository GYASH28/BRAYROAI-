import {readFileSync,existsSync} from 'node:fs';
import {priceFor,OFFERS} from '../data/pricing.js';
const assert=(ok,message)=>{if(!ok)throw new Error(message)};
for(const [prefix,market,label] of [['','in','India · INR'],['ae/','ae','UAE · AED'],['au/','au','Australia · AUD']]){
 for(const route of ['index.html','plans/index.html','clients/fakhrimart/index.html','terms/index.html']){
  const file=`dist/${prefix}${route}`;assert(existsSync(file),'Missing '+file);const html=readFileSync(file,'utf8');
  assert(html.includes('lang="en"'),'English page missing '+file);assert(html.includes(label),'Market label missing '+file);
  assert(!/[\u0600-\u06ff]/.test(html),'Arabic text shipped '+file);
 }
 const plans=readFileSync(`dist/${prefix}plans/index.html`,'utf8');
 for(const id of Object.keys(OFFERS))assert(plans.includes(`data-price="${id}">${priceFor(id,market)}`),'Wrong '+market+' price for '+id);
}
console.log('Living Sketchbook locale integrity OK');
