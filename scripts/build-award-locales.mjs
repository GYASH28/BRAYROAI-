import {readFileSync,writeFileSync,mkdirSync,copyFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {load} from 'cheerio';
import {OFFERS} from '../data/pricing.js';

const root=resolve(process.cwd(),'dist');
const origin='https://brayroai.vercel.app';
const routes=[['/','index.html'],['/plans','plans.html'],['/clients','clients.html'],['/clients/fakhrimart','fakhrimart-case-study.html'],['/founder','founder.html'],['/terms','terms.html']];
const prefix={in:'',ae:'/ae',au:'/au'};
const labels={in:'India · INR',ae:'UAE · AED',au:'Australia · AUD'};
const locales={in:'en-IN',ae:'en-AE',au:'en-AU'};
const urls=[];
const local=(market,path)=>`${prefix[market]}${path==='/'?'/':path}`;
for(const [route,file] of routes){
  const html=readFileSync(resolve(root,file),'utf8');
  for(const market of ['in','ae','au']){
    const $=load(html,{decodeEntities:false});
    $('html').attr('lang',locales[market]);
    $('body').attr('data-market',market);
    $('[data-price]').each((_,node)=>{const id=$(node).attr('data-price');const value=OFFERS[id]?.prices[market];if(!value)throw new Error(`Missing approved price: ${id}/${market}`);$(node).text(value)});
    $('[data-market-open]').text(`${labels[market]} ↗`);
    $('a[href]').each((_,node)=>{
      const href=$(node).attr('href');
      if(href?.startsWith('/')&&!href.startsWith('//')&&!href.startsWith('/assets/')&&!href.startsWith('/rae/'))$(node).attr('href',`${prefix[market]}${href}`);
    });
    $('[data-market-choice]').each((_,node)=>{const target=$(node).attr('data-market-choice');$(node).attr('href',local(target,route));if(target===market)$(node).attr('aria-current','page')});
    const url=origin+local(market,route);
    $('head').append(`<link rel="canonical" href="${url}"><meta property="og:url" content="${url}">`);
    if(route==='/plans'&&market!=='in')$('meta[name="description"]').attr('content',`Published ${market==='ae'?'AED':'AUD'} prices for BRAYROAI website, monthly and AI offers.`);
    const target=market==='in'?resolve(root,file):resolve(root,`${market}${route==='/'?'':route}/index.html`);
    mkdirSync(dirname(target),{recursive:true});
    writeFileSync(target,$.html());
    if(market==='in'&&route!=='/'){
      const clean=resolve(root,route.slice(1),'index.html');mkdirSync(dirname(clean),{recursive:true});copyFileSync(target,clean);
    }
    urls.push(url);
  }
}
writeFileSync(resolve(root,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url=>`<url><loc>${url}</loc></url>`).join('')}</urlset>`);
writeFileSync(resolve(root,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
console.log(`Generated ${urls.length} English market routes and sitemap entries.`);
