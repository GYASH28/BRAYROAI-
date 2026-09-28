import {initMarket} from './market.js';
import {initPlans} from './plans.js';
import {initContact} from './contact.js';

if(initMarket()){
 const menu=document.querySelector('#menu-dialog');
 document.querySelector('[data-menu-open]')?.addEventListener('click',()=>menu.showModal());
 document.querySelector('[data-menu-close]')?.addEventListener('click',()=>menu.close());
 menu?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>menu.close()));
 const colour=document.querySelector('[data-colour-toggle]');
 colour?.addEventListener('click',()=>{const on=document.querySelector('.legacy-hero').classList.toggle('is-colour');colour.setAttribute('aria-pressed',String(on));document.querySelector('.hero-person').src=on?'/assets/yash-cutout.webp':'/assets/yash-cutout-mono.webp'});
 initPlans();
 initContact();

 // Rae's transport and panel handlers are loaded when the visitor actually asks.
 const raeButtons=[...document.querySelectorAll('[data-rae-open]')];
 let loadingRae=null;
 const openRae=async()=>{
  raeButtons.forEach(button=>button.removeEventListener('click',openRae));
  loadingRae ||= import('./rae.js').then(module=>module.initRae());
  await loadingRae;
  const dialog=document.querySelector('#rae-dialog');
  if(!dialog.open)dialog.showModal();
  dialog.querySelector('textarea')?.focus();
 };
 raeButtons.forEach(button=>button.addEventListener('click',openRae));

 // The scroll artboard acquires its timeline only as it approaches the viewport.
 const story=document.querySelector('[data-story]');
 if(story&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  const observer=new IntersectionObserver(entries=>{
   if(!entries[0].isIntersecting)return;
   observer.disconnect();
   import('./story.js').then(module=>module.initStory());
  },{rootMargin:'600px 0px'});
  observer.observe(story);
 }
}
