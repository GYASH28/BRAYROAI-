import {initMarket} from './market.js';
import {initPlans} from './plans.js';
import {initContact} from './contact.js';

if(initMarket()){
 const customArrow=direction=>{const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 240 90');svg.setAttribute('class',`ui-arrow ${direction==='↘'?'ui-arrow--down':''}`);svg.setAttribute('aria-hidden','true');const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d','M8 70C48 28 105 18 204 39m-30-25 34 26-38 22');svg.append(path);return svg};
 document.querySelectorAll('a,button').forEach(control=>{const walker=document.createTreeWalker(control,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())if(/[↗↘]/.test(walker.currentNode.textContent))nodes.push(walker.currentNode);for(const node of nodes){const parts=node.textContent.split(/([↗↘])/);const fragment=document.createDocumentFragment();for(const part of parts)fragment.append(/[↗↘]/.test(part)?customArrow(part):document.createTextNode(part));node.replaceWith(fragment)}});
 const menu=document.querySelector('#menu-dialog');
 document.querySelector('[data-menu-open]')?.addEventListener('click',()=>menu.showModal());
 document.querySelector('[data-menu-close]')?.addEventListener('click',()=>menu.close());
 menu?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>menu.close()));
 const colour=document.querySelector('[data-colour-toggle]');
 colour?.addEventListener('click',()=>{const on=document.querySelector('.legacy-hero')?.classList.toggle('is-colour');colour.setAttribute('aria-pressed',String(on));document.querySelector('.hero-person').src=on?'/assets/yash-cutout.webp':'/assets/yash-cutout-mono.webp'});
 const founderColour=document.querySelector('[data-founder-colour]');
 founderColour?.addEventListener('click',()=>{const on=document.querySelector('.founder-hero').classList.toggle('is-colour');founderColour.setAttribute('aria-pressed',String(on))});
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

 import('./motion.js').then(module=>module.initStudioMotion()).catch(error=>console.error('Studio motion failed',error));
}
