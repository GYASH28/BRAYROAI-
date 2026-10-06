import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {load} from 'cheerio';
import {MARKETS} from '../data/markets.js';
import {OFFERS,priceFor} from '../data/pricing.js';

const pages={'/':'index.html','/plans':'plans.html','/clients':'clients.html','/clients/fakhrimart':'fakhrimart-case-study.html','/work/lernio':'work-lernio.html','/work/brace':'work-brace.html','/founder':'founder.html','/ai-workflow-audit':'ai-workflow-audit.html','/company-second-brain':'company-second-brain.html','/terms':'terms.html','/privacy':'privacy.html'};
const destination=route=>route==='/'?'index.html':route.slice(1)+'/index.html';
const origin='https://brayroai.vercel.app';
const routes=new Set(Object.keys(pages));
const regionalize=(value,prefix)=>{
 if(typeof value!=='string'||!value.startsWith(origin))return value;
 const url=new URL(value);
 const route=url.pathname.replace(/\/$/,'')||'/';
 if(!routes.has(route)||url.hash==='#organization'||url.hash==='#website')return value;
 return`${origin}${prefix}${route==='/'?'/':route}${url.hash||''}`;
};
const walk=(value,prefix)=>{
 if(Array.isArray(value))return value.map(item=>walk(item,prefix));
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,walk(item,prefix)]));
 return regionalize(value,prefix);
};
for(const market of ['in','ae','au']){
 for(const [route,source] of Object.entries(pages)){
  const $=load(readFileSync(resolve('dist',source),'utf8'),{decodeEntities:false});
  $('html').attr('lang','en').removeAttr('dir');
  $('[data-price]').each((_,node)=>{$(node).text(priceFor($(node).attr('data-price'),market))});
  $('[data-market-open]').each((_,node)=>{$(node).contents().filter((_,child)=>child.type==='text').first().replaceWith(MARKETS[market].label+' ')});
  $('[data-market-choice]').each((_,node)=>{$(node).attr('aria-checked',$(node).attr('data-market-choice')===market?'true':'false')});
  const prefix=MARKETS[market].prefix;
  $('a[href^="/"]').each((_,node)=>{const href=$(node).attr('href');if(!href.startsWith('//')&&!href.startsWith('/assets/')&&!href.startsWith('/api/'))$(node).attr('href',prefix+href)});
  $('link[rel="canonical"],meta[property="og:url"]').each((_,node)=>{const attr=node.tagName==='link'?'href':'content';$(node).attr(attr,`https://brayroai.vercel.app${prefix}${route}`)});
  $('meta[property="og:locale"]').attr('content',MARKETS[market].locale.replace('-','_'));
  $('script[type="application/ld+json"]').each((_,node)=>{try{const data=JSON.parse($(node).text());$(node).text(JSON.stringify(walk(data,prefix)).replace(/</g,'\\u003c'))}catch{}});
  const path=resolve('dist',prefix.slice(1),destination(route));mkdirSync(dirname(path),{recursive:true});writeFileSync(path,$.html());
 }
}
