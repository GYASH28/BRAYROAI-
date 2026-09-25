import {MARKETS,marketRoute,splitMarketPath} from '../data/markets.js';

const path=splitMarketPath(location.pathname);
const market=path.market,route=path.route;
const arabic=market==='ae-ar';
const baseMarket=value=>String(value||'in').startsWith('ae')?'ae':String(value||'in');
const read=(key)=>{try{return localStorage.getItem(key)}catch{return null}};
const save=(key,value)=>{try{localStorage.setItem(key,value)}catch{}};
const readSession=(key)=>{try{return sessionStorage.getItem(key)}catch{return null}};
const saveSession=(key,value)=>{try{sessionStorage.setItem(key,value)}catch{}};

const manualMarket=read('brayro_market_source')==='manual'?baseMarket(read('brayro_market')):null;
const sessionMarket=baseMarket(readSession('brayro_auto_market')||'');
let detectedMarket=readSession('brayro_detected_market')||null;

const remember=(next,source='manual')=>{
  const nextBase=baseMarket(next);
  if(source==='manual'){
    save('brayro_market',nextBase);
    save('brayro_market_source','manual');
    try{document.cookie=`brayro_market_manual=${nextBase}; Path=/; Max-Age=31536000; SameSite=Lax`}catch{}
  }
  save('brayro_lang',next==='ae-ar'?'ar':'en');
  if(source==='auto')saveSession('brayro_auto_market',nextBase);
};

if(market!=='in'){
  saveSession('brayro_last_explicit_market',baseMarket(market));
  save('brayro_lang',market==='ae-ar'?'ar':'en');
}

// A manual market always wins. Auto-detection is session scoped so travel,
// VPN changes or a new session can be detected again without trapping users.
if(market==='in'){
  const preferred=manualMarket||((sessionMarket==='ae'||sessionMarket==='au')?sessionMarket:null);
  if(preferred&&preferred!=='in'){
    location.replace(marketRoute(preferred,route,location.hash));
  }
}

const triggers=[...document.querySelectorAll('[data-market-trigger]')];
triggers.forEach(button=>{button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls','market-sheet');button.setAttribute('aria-expanded','false')});
const label=MARKETS[market]?.label||MARKETS.in.label;
triggers.forEach(button=>{button.firstChild.textContent=arabic?'الإمارات · AED ':label+' '});

for(const link of document.querySelectorAll('[data-market-language-link]')){
  link.hidden=!market.startsWith('ae');
  if(!link.hidden){
    link.href=marketRoute(arabic?'ae':'ae-ar',route,location.hash);
    link.textContent=arabic?'العربية / EN':'EN / العربية';
    link.setAttribute('aria-label',arabic?'Switch UAE site to English':'التبديل إلى العربية');
    link.addEventListener('click',()=>remember(arabic?'ae':'ae-ar','manual'));
  }
}

const dialog=document.createElement('dialog');
dialog.id='market-sheet';
dialog.className='market-sheet';
dialog.setAttribute('aria-label',arabic?'اختر السوق واللغة':'Choose market and language');

const option=(id,name,meta,code)=>`<a data-market-choice="${id}" href="${marketRoute(id,route,location.hash)}"><span class="market-sheet__code" aria-hidden="true">${code}</span><strong>${name}</strong><span class="market-sheet__meta">${meta}</span></a>`;

dialog.innerHTML=`<div class="market-sheet__head"><span>${arabic?'BRAYROAI / اختر السوق':'BRAYROAI / MARKET MODE'}</span><button type="button" data-market-close aria-label="${arabic?'إغلاق اختيار السوق':'Close market choices'}">×</button></div>
  <h2>${arabic?'أين تبني مشروعك؟':'Where are you building?'}</h2>
  <p>${arabic?'اختر السوق الذي تريد الأسعار والعرض له. يمكننا اقتراح السوق تلقائياً، لكن اختيارك اليدوي يبقى دائماً هو الأولوية.':'Choose the market you want prices and project context for. We can select it automatically from your country, but your manual choice always wins.'}</p>
  <div class="market-react-host" data-react-market-island hidden></div>
  <div class="market-sheet__options" data-market-fallback>
    ${option('in',arabic?'الهند':'India','INR · English','IN')}
    ${option('ae',arabic?'الإمارات العربية المتحدة':'United Arab Emirates',arabic?'AED · الإنجليزية':'AED · English','AE')}
    ${option('au',arabic?'أستراليا':'Australia',arabic?'AUD · الإنجليزية':'AUD · English','AU')}
  </div>
  <div class="market-sheet__language" data-market-language>
    <span>${arabic?'لغة موقع الإمارات':'UAE language'}</span>
    <a data-market-choice="ae" href="${marketRoute('ae',route,location.hash)}">English</a>
    <a data-market-choice="ae-ar" href="${marketRoute('ae-ar',route,location.hash)}">العربية</a>
  </div>
  <div class="market-sheet__status" data-market-status role="status">${arabic?'الاكتشاف التلقائي يعمل في الزيارة الأولى.':'Automatic country selection runs on the first visit.'}</div>
  <small>${arabic?'الهند تبقى باللغة الإنجليزية. الأسعار كتب أسعار ثابتة لكل سوق وليست تحويلاً فورياً للعملة.':'India stays in English. Prices use fixed market price books rather than live currency conversion.'}</small>`;

document.body.append(dialog);
const language=dialog.querySelector('[data-market-language]');
language.hidden=!market.startsWith('ae');

const getState=()=>({
  currentMarket:market,
  route,
  detectedMarket,
  manualMarket,
  labels:MARKETS
});

const select=(next,source='manual')=>{
  if(!MARKETS[next])return;
  remember(next,source);
  const target=marketRoute(next,route,location.hash);
  dialog.close();
  if(target===location.pathname+location.hash)return;
  location.assign(target);
};

window.BRAYRO_MARKET_SWITCHER={select,getState};

for(const link of dialog.querySelectorAll('[data-market-choice]')){
  if(link.dataset.marketChoice===market)link.setAttribute('aria-current','true');
  link.addEventListener('click',event=>{
    const next=link.dataset.marketChoice;
    if(!next)return;
    event.preventDefault();
    select(next,'manual');
  });
}

let marketOpener=null;
triggers.forEach(button=>button.addEventListener('click',()=>{
  document.querySelector('[data-rae-panel][aria-hidden="false"] [data-rae-close]')?.click();
  const fromGlobalMenu=Boolean(button.closest('[data-global-menu]'));
  if(document.querySelector('[data-global-menu]')?.hidden===false)document.querySelector('[data-global-toggle]')?.click();
  marketOpener=fromGlobalMenu?document.querySelector('[data-global-toggle]'):button;
  triggers.forEach(trigger=>trigger.setAttribute('aria-expanded',String(trigger===button)));
  language.hidden=!market.startsWith('ae');
  dialog.showModal();
  document.dispatchEvent(new CustomEvent('brayro:market-opened',{detail:getState()}));
}));
dialog.querySelector('[data-market-close]').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
dialog.addEventListener('close',()=>{triggers.forEach(trigger=>trigger.setAttribute('aria-expanded','false'));marketOpener?.focus?.();marketOpener=null});

const updateDetectionStatus=(next,country='')=>{
  const status=dialog.querySelector('[data-market-status]');
  if(!status)return;
  if(!next){status.textContent=arabic?'تعذر الاقتراح التلقائي. اختر السوق يدوياً.':'Automatic suggestion is unavailable. Choose a market manually.';return}
  const name=MARKETS[next]?.name||MARKETS[baseMarket(next)]?.name||next.toUpperCase();
  status.textContent=arabic?`تم التعرف على ${country||name}. اقتراح السوق: ${name}.`:`Detected ${country||name}. Suggested market: ${name}.`;
};

const detectMarket=async()=>{
  if(market!=='in'||manualMarket||readSession('brayro_market_detection_attempted')==='1')return;
  saveSession('brayro_market_detection_attempted','1');
  try{
    const response=await fetch('/api/market',{headers:{accept:'application/json'},credentials:'same-origin'});
    if(!response.ok)throw new Error('market detection unavailable');
    const data=await response.json();
    const next=baseMarket(data.market);
    if(!['in','ae','au'].includes(next))throw new Error('unsupported market');
    detectedMarket=next;
    saveSession('brayro_detected_market',next);
    updateDetectionStatus(next,data.country||'');
    document.dispatchEvent(new CustomEvent('brayro:market-detected',{detail:getState()}));
    if(next!=='in'&&read('brayro_market_source')!=='manual'){
      remember(next,'auto');
      location.replace(marketRoute(next,route,location.hash));
    }
  }catch{
    updateDetectionStatus(null);
  }
};

if(!manualMarket&&!readSession('brayro_auto_market')){
  if('requestIdleCallback'in window)requestIdleCallback(()=>detectMarket(),{timeout:900});
  else setTimeout(detectMarket,80);
}
