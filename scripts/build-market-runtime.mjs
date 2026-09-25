import {writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {MARKETS} from '../data/markets.js';
import {OFFERS} from '../data/pricing.js';
const prices=Object.fromEntries(Object.entries(OFFERS).map(([id,offer])=>[id,offer.prices]));
const source=`/* Generated from data/markets.js and data/pricing.js. Do not edit directly. */\n(()=>{const path=location.pathname;const id=path==='/ae/ar'||path.startsWith('/ae/ar/')?'ae-ar':path==='/ae'||path.startsWith('/ae/')?'ae':path==='/au'||path.startsWith('/au/')?'au':'in';const table=${JSON.stringify(prices)};const markets=${JSON.stringify(MARKETS)};const route=path.replace(/^\\/(?:ae\\/ar|ae|au)(?=\\/|$)/,'')||'/';const base=id==='ae-ar'?'ae':id;const prices=Object.fromEntries(Object.entries(table).map(([key,values])=>[key,values[base]]));window.BRAYRO_MARKET=Object.freeze({id,locale:markets[id].locale,currency:markets[id].currency,route,prices,price:key=>prices[key],link:(target,hash='')=>markets[id].prefix+(target==='/'?'/':target)+(hash||'')});})();\n`;
writeFileSync(resolve('public/market-context.js'),source);
console.log('Generated public/market-context.js from the fixed price books.');
