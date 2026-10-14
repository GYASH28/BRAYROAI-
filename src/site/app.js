import {initStudioEntry} from './entry.js';
import {initMarket} from './market.js';
import {initPlans} from './plans.js';
import {initContact} from './contact.js';
import {initMenu} from './menu.js';
import {initAnalytics} from './analytics.js';

if(initMarket()){
 const customArrow=direction=>{const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 240 90');svg.setAttribute('class',`ui-arrow ${direction==='↘'?'ui-arrow--down':''}`);svg.setAttribute('aria-hidden','true');const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d','M8 70C48 28 105 18 204 39m-30-25 34 26-38 22');svg.append(path);return svg};
 document.querySelectorAll('a,button').forEach(control=>{const walker=document.createTreeWalker(control,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())if(/[↗↘]/.test(walker.currentNode.textContent))nodes.push(walker.currentNode);for(const node of nodes){const parts=node.textContent.split(/([↗↘])/);const fragment=document.createDocumentFragment();for(const part of parts)fragment.append(/[↗↘]/.test(part)?customArrow(part):document.createTextNode(part));node.replaceWith(fragment)}});
 initMenu();
 const colour=document.querySelector('[data-colour-toggle]');
 colour?.addEventListener('click',()=>{const on=document.querySelector('.legacy-hero')?.classList.toggle('is-colour');colour.setAttribute('aria-pressed',String(on));document.querySelector('.hero-person').src=on?'/assets/yash-cutout.webp':'/assets/yash-cutout-mono.webp'});
 const founderColour=document.querySelector('[data-founder-colour]');
 founderColour?.addEventListener('click',()=>{const on=document.querySelector('.founder-hero').classList.toggle('is-colour');founderColour.setAttribute('aria-pressed',String(on))});
 const header=document.querySelector('.site-header');
 if(document.body.classList.contains('page-home')){
  const syncHeader=()=>header?.classList.toggle('is-scrolled',scrollY>40);
  addEventListener('scroll',syncHeader,{passive:true});syncHeader();
 }
 initPlans();
 initContact();
 initAnalytics();

 // Rae loads on demand. Keep the opener available if a chunk fails to load,
 // so visitors can retry instead of losing access to the assistant.
 const raeButtons=[...document.querySelectorAll('[data-rae-open]')];
 let loadingRae=null;
 const openRae=async()=>{
  raeButtons.forEach(button=>button.setAttribute('aria-busy','true'));
  try{
   loadingRae ||= import('./rae.js').then(module=>module.initRae());
   await loadingRae;
   const dialog=document.querySelector('#rae-dialog');
   if(!dialog)throw new Error('Rae dialog is unavailable');
   dialog.querySelector('.rae-status')?.replaceChildren();
   // initRae owns subsequent openings, but only after initialization succeeds.
   raeButtons.forEach(button=>button.removeEventListener('click',openRae));
   if(!dialog.open)dialog.showModal();
   dialog.querySelector('textarea')?.focus();
  }catch(error){
   loadingRae=null;
   console.error('Rae could not load',error);
   const dialog=document.querySelector('#rae-dialog');
   if(dialog){
    const status=dialog.querySelector('.rae-status');
    if(status)status.textContent='Rae could not load. Close this window and try again, or contact the studio by email.';
    if(!dialog.open)dialog.showModal();
    // The close handler is normally installed by the lazy module.
    if(!dialog.dataset.raeInitialized){
     dialog.querySelector('[data-rae-close]')?.addEventListener('click',()=>dialog.close(),{once:true});
    }
   }
  }finally{
   raeButtons.forEach(button=>button.removeAttribute('aria-busy'));
  }
 };
 raeButtons.forEach(button=>button.addEventListener('click',openRae));

 initStudioEntry();
}
