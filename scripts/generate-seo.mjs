import {writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {MARKETS,MARKET_ROUTES} from '../data/markets.js';

const origin='https://brayroai.vercel.app';
const markets=['in','ae','au'];
const loc=(market,route)=>`${origin}${MARKETS[market].prefix}${route==='/'?'/':route}`;
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const lastmod=new Date().toISOString().slice(0,10);
const entries=[];

for(const market of markets){
 for(const route of MARKET_ROUTES){
  const alternates=[
   ['en-IN',loc('in',route)],
   ['en-AE',loc('ae',route)],
   ['en-AU',loc('au',route)],
   ['x-default',loc('in',route)]
  ].map(([lang,url])=>`    <xhtml:link rel="alternate" hreflang="${lang}" href="${escape(url)}"/>`).join('\n');
  entries.push(`  <url>\n    <loc>${escape(loc(market,route))}</loc>\n    <lastmod>${lastmod}</lastmod>\n${alternates}\n  </url>`);
 }
}

const sitemap=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`;
const robots=`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${origin}/sitemap.xml\n`;

writeFileSync(resolve('dist/sitemap.xml'),sitemap);
writeFileSync(resolve('dist/robots.txt'),robots);
console.log(`Generated sitemap with ${entries.length} regional URLs.`);
