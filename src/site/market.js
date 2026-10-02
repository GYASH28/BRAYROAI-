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
let changingMarket=false;
// A country change replaces the whole price context. Fade it as one operation;
// a native snapshot transition can race the modal leaving the top layer.
const changeMarket=(url,replace=false)=>{
 if(changingMarket)return;changingMarket=true;
 (window.brayroPageRevealed||Promise.resolve()).then(()=>{
  const style=document.createElement('style');style.dataset.marketNavigation='';style.textContent='@view-transition{navigation:none}';document.head.append(style);
  document.documentElement.classList.add('market-switching');
  const delay=matchMedia('(prefers-reduced-motion:reduce)').matches?0:180;
  setTimeout(()=>replace?location.replace(url):location.assign(url),delay);
 });
};
window.addEventListener('pageshow',event=>{if(!event.persisted)return;changingMarket=false;document.documentElement.classList.remove('market-switching');document.querySelector('style[data-market-navigation]')?.remove()});
const oldPreference=()=>{try{localStorage.removeItem('brayro_lang');localStorage.removeItem('brayro_market_language')}catch{}};
export const currentMarket=()=>splitMarketPath(location.pathname).market;
const marketDestination=(id,route)=>marketRoute(id,route)+location.search+location.hash;
export function initMarket(){
 oldPreference();
 const here=splitMarketPath(location.pathname),manual=recalled();
 if(manual&&manual!==here.market){changeMarket(marketDestination(manual,here.route),true);return false}
 const dialog=document.querySelector('#market-dialog');
 let detectionCancelled=false;
 const buttons=[...document.querySelectorAll('[data-market-open]')];
 const paint=id=>{
  document.querySelectorAll('[data-market-open]').forEach(button=>{button.firstChild.textContent=MARKETS[id].label+' '});
  document.querySelectorAll('[data-market-choice]').forEach(button=>{const active=button.dataset.marketChoice===id;button.setAttribute('aria-checked',String(active));button.tabIndex=active?0:-1});
  document.querySelectorAll('[data-price]').forEach(node=>{node.textContent=priceFor(node.dataset.price,id)});
 };
 paint(here.market);
 buttons.forEach(button=>button.addEventListener('click',()=>{detectionCancelled=true;document.documentElement.classList.remove('market-detecting');document.querySelector('#menu-dialog')?.close();dialog.showModal();dialog.querySelector('[aria-checked=true]')?.focus()}));
 dialog.querySelector('[data-market-close]').addEventListener('click',()=>dialog.close());
 let backdropStart=false;
 const isBackdrop=event=>{const rect=dialog.getBoundingClientRect();return event.target===dialog&&(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)};
 dialog.addEventListener('pointerdown',event=>{backdropStart=isBackdrop(event)});
 dialog.addEventListener('click',event=>{if(backdropStart&&isBackdrop(event))dialog.close();backdropStart=false});
 dialog.querySelectorAll('[data-market-choice]').forEach(button=>button.addEventListener('click',()=>{
  const chosen=button.dataset.marketChoice;remember(chosen);paint(chosen);dialog.close();
  if(chosen!==currentMarket())changeMarket(marketDestination(chosen,here.route));
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
   changeMarket(marketDestination(data.market,'/'),true);
  }).catch(()=>{}).finally(()=>document.documentElement.classList.remove('market-detecting'));
 }
 return true;
}
