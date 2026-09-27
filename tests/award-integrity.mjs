import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {load} from 'cheerio';
import {OFFERS} from '../data/pricing.js';

const root=resolve(process.cwd(),'dist');
const routes=['/','/plans','/clients','/clients/fakhrimart','/founder','/terms'];
const market={in:{prefix:'',lang:'en-IN'},ae:{prefix:'/ae',lang:'en-AE'},au:{prefix:'/au',lang:'en-AU'}};
const fileFor=(id,route)=>resolve(root,id==='in'&&route==='/'?'index.html':`${market[id].prefix}${route==='/'?'':route}/index.html`.replace(/^\//,''));
for(const [id,config] of Object.entries(market))for(const route of routes){
  const file=fileFor(id,route);
  assert(existsSync(file),`Missing ${file}`);
  const html=readFileSync(file,'utf8');const $=load(html);
  assert.equal($('html').attr('lang'),config.lang,`Language: ${file}`);
  assert.equal($('html').attr('dir'),undefined,`RTL found: ${file}`);
  assert(!/[\u0600-\u06ff]/.test(html),`Arabic copy found: ${file}`);
  assert.equal($('main').length,1,`Main landmark: ${file}`);
  assert.equal($('h1').length,1,`Heading: ${file}`);
  assert.equal($('link[rel=canonical]').attr('href'),`https://brayroai.vercel.app${config.prefix}${route}`);
  for(const node of $('[data-price]').toArray()){
    const offer=$(node).attr('data-price');assert.equal($(node).text(),OFFERS[offer].prices[id],`Price ${offer}/${id}`);
  }
  for(const node of $('a[href]').toArray()){
    const href=$(node).attr('href');if(!href.startsWith('/')||href.startsWith('//'))continue;
    const path=href.split(/[?#]/)[0];
    assert(existsSync(resolve(root,path.slice(1)))||existsSync(resolve(root,path.slice(1),'index.html')),`Broken internal path ${href} in ${file}`);
  }
}
assert(!existsSync(resolve(root,'ae/ar')),`Arabic site unexpectedly generated`);
assert(!existsSync(resolve(root,'ai-workflow-audit.html')),`Old AI detail page unexpectedly generated`);
assert(!existsSync(resolve(root,'company-second-brain.html')),`Old AI detail page unexpectedly generated`);
const config=JSON.parse(readFileSync('vercel.json','utf8'));
assert(config.redirects.some(item=>item.source==='/ai-workflow-audit'&&item.destination==='/plans#ai-workflow-audit'));
assert(config.redirects.some(item=>item.source==='/ae/ar'));
const js=readFileSync('site/app.js','utf8');
assert(js.includes('brayro_market_manual='));
assert(js.includes('localStorage.setItem'));
console.log('Award site integrity: 18 English pages, approved prices, links, redirects and market persistence passed.');
