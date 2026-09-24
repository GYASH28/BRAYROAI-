import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
import {MARKETS,MARKET_ROUTES,marketRoute} from '../data/markets.js';
import {OFFERS,priceFor} from '../data/pricing.js';

const origin='https://brayroai.vercel.app';
const routeFile=(market,route)=>resolve('dist',marketRoute(market,route).slice(1),'index.html');
const shortPrice=(id,market)=>priceFor(id,market).replace(/\/(?:month|mo)$/,'');
let pages=0,offers=0,leads=0;
for(const market of ['ae','ae-ar','au'])for(const route of MARKET_ROUTES){
  const html=readFileSync(routeFile(market,route),'utf8');const $=load(html);const canonical=origin+marketRoute(market,route);
  assert.equal($('html').attr('lang'),MARKETS[market].locale,`${market}${route} lang`);
  assert.equal($('html').attr('dir')||'ltr',market==='ae-ar'?'rtl':'ltr',`${market}${route} dir`);
  assert.equal($('link[rel="canonical"]').attr('href'),canonical,`${market}${route} canonical`);
  assert.equal($('meta[property="og:url"]').attr('content'),canonical,`${market}${route} OG URL`);
  const marketScript=$('script[data-market-context]');
  assert.equal(marketScript.length,1,`${market}${route} market runtime`);
  assert.ok(!marketScript.attr('src')&&marketScript.html()?.includes('BRAYRO_MARKET'),`${market}${route} market runtime must be inline`);
  assert.ok(!marketScript.html()?.includes('₹'),`${market}${route} runtime leaks INR`);
  assert.ok(!$('body').text().includes('₹'),`${market}${route} leaks INR into visible text`);
  assert.ok(!/(?:AED|A\$)[\d,\s]+\+\+/.test($('body').text()),`${market}${route} duplicates a starting-price plus sign`);
  assert.ok(!$('meta[name="description"]').attr('content')?.includes('India-first'),`${market}${route} stale description`);
  for(const [lang,id] of [['en-AE','ae'],['ar-AE','ae-ar'],['en-AU','au'],['x-default','in']])assert.equal($(`link[rel="alternate"][hreflang="${lang}"]`).attr('href'),origin+marketRoute(id,route),`${market}${route} ${lang}`);
  for(const a of $('a[href^="/"]').toArray()){
    const href=$(a).attr('href');
    if(href.startsWith('/assets/')||href.startsWith('/#')||href.startsWith('/api/'))continue;
    const target=href.split(/[?#]/)[0];
    if(MARKET_ROUTES.includes(target))assert.fail(`${market}${route} has unlocalized internal link ${href}`);
  }
  for(const node of $('[data-offer-id]').toArray()){
    const id=$(node).attr('data-offer-id');assert.ok(OFFERS[id],`${market}${route} unknown offer ${id}`);
    const displayed=$(node).find('strong').filter((_,strong)=>/AED|A\$/.test($(strong).text())).first().text().replace(/^From\s*/, '').trim();
    if(displayed)assert.ok(displayed.includes(shortPrice(id,market)),`${market}${route} ${id} displays ${displayed}, expected ${shortPrice(id,market)}`);
    const direct=$(node).find('a[data-market-lead]').first();
    if(direct.length){
      const href=direct.attr('href');const decoded=decodeURIComponent(href);
      assert.ok(decoded.includes(priceFor(id,market)),`${market}${route} ${id} lead lacks exact price`);
      assert.ok(decoded.includes(market==='ae-ar'?'الإمارات':MARKETS[market].contactName),`${market}${route} ${id} lead lacks market`);
      leads++;
    }
    offers++;
  }
  if(route==='/plans'){
    const monthlyRow=$('#compare [role="table"]').first().find('[role="row"]').eq(1).text();
    for(const id of ['monthly-starter','monthly-growth','monthly-studio'])assert.ok(monthlyRow.includes(priceFor(id,market)),`${market} comparison mismatches ${id}`);
    const schema=$('script[type="application/ld+json"]').toArray().map(el=>{try{return JSON.parse($(el).html())}catch{return null}}).find(value=>value?.['@type']==='OfferCatalog');
    assert.ok(schema,`${market} missing OfferCatalog`);
    for(const item of schema.itemListElement)assert.equal(item.priceCurrency,MARKETS[market].currency,`${market} schema currency`);
    for(const id of Object.keys(OFFERS))assert.ok(schema.itemListElement.some(item=>item.name===OFFERS[id].name),`${market} schema missing ${id}`);
  }
  pages++;
}
assert.ok(readFileSync('dist/sitemap.xml','utf8').includes(origin+'/ae/ar/plans'),'sitemap missing Arabic plans');
console.log(`Localization integrity passed: ${pages} pages, ${offers} offer placements, ${leads} price-aware leads, canonical and hreflang metadata.`);
