import {MARKETS,marketRoute,splitMarketPath} from '../data/markets.js';

const path=splitMarketPath(location.pathname);
const market=path.market,route=path.route;
const arabic=market==='ae-ar';
const read=(key)=>{try{return localStorage.getItem(key)}catch{return null}};
const save=(key,value)=>{try{localStorage.setItem(key,value)}catch{}};
if(market!=='in'){save('brayro_market',market.startsWith('ae')?'ae':'au');save('brayro_lang',market==='ae-ar'?'ar':'en')}
// The early classic script has already exposed this same generated catalog to
// legacy page scripts before they create any dynamic cards or lead messages.

const triggers=[...document.querySelectorAll('[data-market-trigger]')];
const label=MARKETS[market]?.label||'Choose market';
triggers.forEach(button=>{button.firstChild.textContent=arabic?'الإمارات · AED ':market==='in'?'Choose market':label+' '});
for(const link of document.querySelectorAll('[data-market-language-link]')){
  link.hidden=!market.startsWith('ae');
  if(!link.hidden){link.href=marketRoute(arabic?'ae':'ae-ar',route,location.hash);link.textContent=arabic?'العربية / EN':'EN / العربية';link.setAttribute('aria-label',arabic?'Switch UAE site to English':'التبديل إلى العربية');link.addEventListener('click',()=>save('brayro_lang',arabic?'en':'ar'))}
}
const dialog=document.createElement('dialog');dialog.id='market-sheet';dialog.className='market-sheet';dialog.setAttribute('aria-label',arabic?'اختر السوق واللغة':'Choose market and language');
dialog.innerHTML=`<div class="market-sheet__head"><span>${arabic?'BRAYROAI / اختر السوق':'BRAYROAI / MARKET MODE'}</span><button type="button" data-market-close aria-label="${arabic?'إغلاق اختيار السوق':'Close market choices'}">×</button></div><h2>${arabic?'أين تبني مشروعك؟':'Where are you building?'}</h2><p>${arabic?'اختر السوق الذي تريد الأسعار والعرض له. سيبقى اختيارك في جميع الصفحات.':'Choose the market you want prices and proposals for. Your choice follows every page.'}</p><div class="market-sheet__options"><a data-market-choice="ae" href="${marketRoute('ae',route,location.hash)}"><strong>${arabic?'الإمارات العربية المتحدة':'United Arab Emirates'}</strong><span>${arabic?'AED · الإنجليزية':'AED · English'}</span></a><a data-market-choice="au" href="${marketRoute('au',route,location.hash)}"><strong>${arabic?'أستراليا':'Australia'}</strong><span>${arabic?'A$ · الإنجليزية':'A$ · English'}</span></a></div><div class="market-sheet__language" data-market-language><span>${arabic?'لغة موقع الإمارات':'UAE language'}</span><a data-market-choice="ae" href="${marketRoute('ae',route,location.hash)}">English</a><a data-market-choice="ae-ar" href="${marketRoute('ae-ar',route,location.hash)}">العربية</a></div><small>${arabic?'اختيار السوق يدوي، ولا نحوّل الأسعار آلياً. يعمل BRAYROAI عن بُعد من بونه، الهند.':'Market choice is explicit; prices are not converted automatically. BRAYROAI works remotely from Pune, India.'}</small>`;
document.body.append(dialog);
const language=dialog.querySelector('[data-market-language]');
language.hidden=!market.startsWith('ae');
for(const link of dialog.querySelectorAll('[data-market-choice]')){
  if(link.dataset.marketChoice===market)link.setAttribute('aria-current','true');
  link.addEventListener('click',()=>{const next=link.dataset.marketChoice;save('brayro_market',next.startsWith('ae')?'ae':'au');save('brayro_lang',next==='ae-ar'?'ar':'en')});
}
triggers.forEach(button=>button.addEventListener('click',()=>{
  if(document.querySelector('[data-global-menu]')?.hidden===false)document.querySelector('[data-global-toggle]')?.click();
  language.hidden=!market.startsWith('ae');dialog.showModal();
}));
dialog.querySelector('[data-market-close]').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});

// The root route remains the existing India site. A remembered market is a
// visible suggestion, never a redirect that overrides an explicit URL.
const remembered=read('brayro_market');
if(market==='in'&&(remembered==='ae'||remembered==='au')){
  const suggestion=document.createElement('button');suggestion.type='button';suggestion.className='market-suggestion';suggestion.textContent=`Continue in ${remembered==='ae'?'UAE · AED':'Australia · AUD'} ↗`;
  suggestion.addEventListener('click',()=>location.assign(marketRoute(remembered,route,location.hash)));
  document.body.append(suggestion);
}
