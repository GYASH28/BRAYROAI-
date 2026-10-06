import {readFileSync,existsSync} from 'node:fs';
import {OFFERS,priceFor,leadText} from '../data/pricing.js';
import {MARKETS} from '../data/markets.js';
const assert=(ok,message)=>{if(!ok)throw new Error(message)};
const home=readFileSync('index.html','utf8'),plans=readFileSync('plans.html','utf8'),clients=readFileSync('clients.html','utf8'),casePage=readFileSync('fakhrimart-case-study.html','utf8'),config=JSON.parse(readFileSync('vercel.json','utf8'));
assert(Object.keys(MARKETS).join(',')==='in,ae,au','Market set must be India/UAE/Australia only');
assert(Object.keys(OFFERS).length===9,'All nine approved offers must remain');
for(const id of Object.keys(OFFERS)){assert(plans.includes(`data-price="${id}"`),'Plan price missing '+id);for(const market of ['in','ae','au'])assert(priceFor(id,market)===OFFERS[id].prices[market],'Price book changed for '+id+'/'+market)}
for(const id of ['work','approach','studio','starting-points','contact'])assert(home.includes(`id="${id}"`),'Homepage scene missing '+id);
assert(home.indexOf('id="work"')<home.indexOf('id="approach"'),'Real work must precede explanation');
assert(home.includes('/assets/fakhrimart-case-desktop.webp')&&casePage.includes('fakhriyarns.vercel.app'),'Genuine work evidence missing');
assert(clients.includes('SELF-INITIATED')&&clients.includes('/work/lernio')&&clients.includes('/work/brace'),'Studio systems must be separated from verified client work');
assert(existsSync('work-lernio.html')&&existsSync('work-brace.html')&&existsSync('privacy.html'),'New proof/privacy pages missing');
assert(existsSync('scripts/generate-seo.mjs')&&readFileSync('vite.config.mjs','utf8').includes('GOOGLE_SITE_VERIFICATION'),'SEO infrastructure missing');
assert(!home.includes('₹17,999')&&!home.includes('₹29,999'),'Homepage repeats the full price book');
for(const route of ['/clients','/founder','/ai-workflow-audit','/company-second-brain']){assert(config.rewrites.some(item=>item.source===route),'Restored route rewrite missing '+route);assert(existsSync(`${route.slice(1)}.html`),'Restored page missing '+route)}
assert(config.redirects.some(item=>item.source==='/ae/ar/:path*'),'Retired Arabic route redirect missing');
assert(!readFileSync('scripts/build-locales.mjs','utf8').includes('arabic'),'Arabic generation must be retired');
assert(existsSync('static/assets/yash-cutout.webp')&&existsSync('static/assets/hero-background.webp'),'Original GitHub hero assets must be preserved');
const lead=leadText({market:'ae',offerId:'company-second-brain',source:'/ae/plans#second-brain'});
assert(lead.includes('AED 7,900')&&lead.includes('English')===false,'English AED lead mismatch');
console.log('Living Sketchbook source integrity OK');
