import {MARKETS,splitMarketPath,marketRoute} from '../../data/markets.js';
import {priceFor} from '../../data/pricing.js';

const valid=id=>id==='in'||id==='ae'||id==='au';
const remember=id=>{try{localStorage.setItem('brayro_market_manual',id)}catch{}document.cookie=`brayro_market_manual=${id}; Max-Age=31536000; Path=/; SameSite=Lax`};
const normalized=id=>id==='ae-ar'?'ae':id;
const recalled=()=>{try{
 const saved=normalized(localStorage.getItem('brayro_market_manual'));
 if(valid(saved)){if(saved!==localStorage.getItem('brayro_market_manual'))remember(saved);return saved}
 const old=localStorage.getItem('brayro_market_source')==='manual'?normalized(localStorage.getItem('brayro_market')):null;
 const cookie=normalized(document.cookie.split('; ').find(part=>part.startsWith('brayro_market_manual='))?.split('=')[1]);
 const chosen=valid(old)?old:valid(cookie)?cookie:null;if(chosen)remember(chosen);return chosen;
}catch{return null}};
const oldPreference=()=>{try{localStorage.removeItem('brayro_lang');localStorage.removeItem('brayro_market_language')}catch{}};
export const currentMarket=()=>splitMarketPath(location.pathname).market;
export function initMarket(){
 oldPreference();
 const here=splitMarketPath(location.pathname),manual=recalled();
 if(manual&&manual!==here.market){location.replace(marketRoute(manual,here.route,location.hash)+location.search);return false}
 const dialog=document.querySelector('#market-dialog');
 let detectionCancelled=false;
 const buttons=[...document.querySelectorAll('[data-market-open]')];
 const paint=id=>{
  document.querySelectorAll('[data-market-open]').forEach(button=>{button.firstChild.textContent=MARKETS[id].label+' '});
  document.querySelectorAll('[data-market-choice]').forEach(button=>button.setAttribute('aria-checked',button.dataset.marketChoice===id?'true':'false'));
  document.querySelectorAll('[data-price]').forEach(node=>{node.textContent=priceFor(node.dataset.price,id)});
 };
 paint(here.market);
 buttons.forEach(button=>button.addEventListener('click',()=>{detectionCancelled=true;document.documentElement.classList.remove('market-detecting');document.querySelector('#menu-dialog')?.close();dialog.showModal();dialog.querySelector('[aria-checked=true]')?.focus()}));
 dialog.querySelector('[data-market-close]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
 dialog.querySelectorAll('[data-market-choice]').forEach(button=>button.addEventListener('click',()=>{
  const chosen=button.dataset.marketChoice;remember(chosen);paint(chosen);dialog.close();
  if(chosen!==currentMarket())location.assign(marketRoute(chosen,here.route,location.hash)+location.search);
 }));
 dialog.addEventListener('keydown',event=>{
  if(!['ArrowDown','ArrowRight','ArrowUp','ArrowLeft'].includes(event.key))return;
  const choices=[...dialog.querySelectorAll('[data-market-choice]')],index=choices.indexOf(document.activeElement);
  if(index<0)return;event.preventDefault();choices[(index+(event.key==='ArrowDown'||event.key==='ArrowRight'?1:choices.length-1))%choices.length].focus();
 });
 if(!manual&&here.market==='in'&&location.pathname==='/'){
  document.documentElement.classList.add('market-detecting');
  fetch('/api/market',{credentials:'same-origin',cache:'no-store'}).then(response=>response.ok?response.json():null).then(data=>{
   if(detectionCancelled||recalled()||!data||!valid(data.market)||data.market==='in'||location.pathname!=='/')return;
   location.replace(marketRoute(data.market,'/',location.hash));
  }).catch(()=>{}).finally(()=>document.documentElement.classList.remove('market-detecting'));
 }
 return true;
}
