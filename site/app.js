import {OFFERS} from '../data/pricing.js';

const market=document.body.dataset.market||'in';
const labels={in:'India · INR',ae:'UAE · AED',au:'Australia · AUD'};
const prefixes={in:'',ae:'/ae',au:'/au'};
const currentPrefix=prefixes[market];
const route=location.pathname.replace(new RegExp(`^${currentPrefix||'\u0000'}`),'').replace(/\/$/,'')||'/';
const prices=Object.fromEntries(Object.entries(OFFERS).map(([id,offer])=>[id,offer.prices[market]]));
window.BRAYRO_MARKET=Object.freeze({id:market,locale:`en-${market==='in'?'IN':market==='ae'?'AE':'AU'}`,currency:{in:'INR',ae:'AED',au:'AUD'}[market],route,prices,price:id=>prices[id],link:(target,hash='')=>`${currentPrefix}${target==='/'?'/':target}${hash}`});

for(const button of document.querySelectorAll('[data-market-open]'))button.textContent=labels[market]+' ↗';
for(const option of document.querySelectorAll('[data-market-choice]')){
  const target=option.dataset.marketChoice;
  option.href=`${prefixes[target]}${route==='/'?'/':route}${location.hash}`;
  if(target===market)option.setAttribute('aria-current','page');
  option.addEventListener('click',()=>{
    localStorage.setItem('brayro-market',target);
    document.cookie=`brayro_market_manual=${target}; Max-Age=31536000; Path=/; SameSite=Lax`;
  });
}

const manual=localStorage.getItem('brayro-market');
if(manual&&manual!==market&&Object.hasOwn(prefixes,manual)){
  location.replace(`${prefixes[manual]}${route==='/'?'/':route}${location.hash}`);
 }else if(!manual&&market==='in'){
  fetch('/api/market',{credentials:'same-origin',cache:'no-store',signal:AbortSignal.timeout(900)})
    .then(response=>response.ok?response.json():null)
    .then(result=>{const detected=result?.market;if(detected&&detected!=='in'&&Object.hasOwn(prefixes,detected))location.replace(`${prefixes[detected]}${route==='/'?'/':route}${location.hash}`);else document.body.classList.add('market-ready')})
    .catch(()=>document.body.classList.add('market-ready'));
}else{
  document.body.classList.add('market-ready');
}

const dialog=document.querySelector('#market-dialog');
let trigger=null;
for(const button of document.querySelectorAll('[data-market-open]'))button.addEventListener('click',()=>{trigger=button;dialog?.showModal()});
dialog?.querySelector('[data-market-close]')?.addEventListener('click',()=>dialog.close());
dialog?.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
dialog?.addEventListener('close',()=>trigger?.focus());

const menu=document.querySelector('#mobile-menu');
const toggle=document.querySelector('[data-menu-toggle]');
function closeMenu(){menu.hidden=true;document.body.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false');toggle.querySelector('.sr-only').textContent='Open menu'}
toggle?.addEventListener('click',()=>{if(menu.hidden){menu.hidden=false;document.body.classList.add('menu-open');toggle.setAttribute('aria-expanded','true');toggle.querySelector('.sr-only').textContent='Close menu';menu.querySelector('a')?.focus()}else closeMenu()});
menu?.addEventListener('click',event=>{if(event.target.closest('a,button'))closeMenu()});
addEventListener('keydown',event=>{if(event.key==='Escape'&&!menu.hidden)closeMenu()});
addEventListener('resize',()=>{if(innerWidth>760&&!menu.hidden)closeMenu()},{passive:true});

const nav=document.querySelector('[data-nav]');
let scheduled=false;
function updateNav(){scheduled=false;nav.classList.toggle('is-scrolled',scrollY>32)}
addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateNav)}},{passive:true});
updateNav();

const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduced&&'IntersectionObserver'in window){
  const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}},{rootMargin:'0px 0px -7% 0px',threshold:.08});
  document.querySelectorAll('[data-reveal]').forEach(node=>observer.observe(node));
}else document.querySelectorAll('[data-reveal]').forEach(node=>node.classList.add('is-visible'));

document.querySelectorAll('[data-open-rae]').forEach(button=>button.addEventListener('click',()=>document.querySelector('[data-rae-shell],[data-rae-toggle]')?.click()));
