import {OFFER_DETAILS} from '../../data/offer-details.js';
import {OFFERS,leadText,priceFor} from '../../data/pricing.js';
import {MARKETS,marketRoute} from '../../data/markets.js';
import {currentMarket} from './market.js';

let dialog;
let returnTarget;
const visible=element=>element instanceof HTMLElement&&element.isConnected&&!element.closest('[hidden]')&&element.getClientRects().length>0;

function list(items){
 const element=document.createElement('ul');
 items.forEach(item=>{const row=document.createElement('li');row.textContent=item;element.append(row)});
 return element;
}

function section(label,title,content,className=''){
 const element=document.createElement('section');element.className=`plan-detail-section ${className}`.trim();
 const eyebrow=document.createElement('p');eyebrow.className='plan-detail-eyebrow';eyebrow.textContent=label;
 const heading=document.createElement('h3');heading.textContent=title;
 element.append(eyebrow,heading,content);return element;
}

function buildDialog(){
 const modal=document.createElement('dialog');
 modal.id='plan-detail-dialog';modal.className='plan-detail-dialog';
 modal.setAttribute('aria-labelledby','plan-detail-title');modal.setAttribute('aria-describedby','plan-detail-summary');
 modal.innerHTML=`<div class="plan-detail-frame">
  <header class="plan-detail-head"><div><span data-detail-index></span><span data-detail-label></span></div><button type="button" data-detail-close aria-label="Close full plan">×</button></header>
  <div class="plan-detail-body">
   <div class="plan-detail-title-row"><div><p class="plan-detail-kicker">FULL PLAN / PUBLISHED STARTING SCOPE</p><h2 id="plan-detail-title"></h2></div><div class="plan-detail-price"><span data-detail-price-label></span><strong data-detail-price></strong><small data-detail-market></small></div></div>
   <p class="plan-detail-summary" id="plan-detail-summary"></p>
   <div class="plan-detail-grid" data-detail-grid></div>
   <footer class="plan-detail-foot"><p>Final deliverables, timing, revisions and payment schedule are confirmed in the written proposal. The published price is a starting point for that conversation.</p><div><a data-detail-terms>Read the working terms</a><a class="plan-detail-enquire" data-detail-enquire target="_blank" rel="noreferrer">Discuss this plan <span aria-hidden="true">↗</span></a></div></footer>
  </div>
 </div>`;
 document.body.append(modal);
 modal.querySelector('[data-detail-close]').addEventListener('click',()=>modal.close());
 // A dismissal starts and ends on the backdrop, so dragging out of the content keeps the plan open.
 let backdropStart=false;
 const onBackdrop=event=>{const rect=modal.getBoundingClientRect();return event.target===modal&&(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)};
 modal.addEventListener('pointerdown',event=>{backdropStart=onBackdrop(event)});
 modal.addEventListener('click',event=>{if(backdropStart&&onBackdrop(event))modal.close();backdropStart=false});
 modal.addEventListener('close',()=>{
  if(modal.open)return;
  document.documentElement.classList.remove('plan-detail-open');
  const target=returnTarget;returnTarget=null;
  requestAnimationFrame(()=>{
   if(modal.open)return;
   const fallback=document.querySelector('[data-category][aria-selected="true"]');
   (visible(target)?target:fallback)?.focus({preventScroll:true});
  });
 });
 window.addEventListener('studio:category',()=>{if(modal.open&&!visible(returnTarget))modal.close()});
 return modal;
}

function priceLabel(id,kind){
 if(id==='ai-workflow-audit')return 'Fixed starting scope · one-time';
 if(kind==='monthly')return 'From · per month';
 if(kind==='scoped')return 'From · scoped implementation';
 return 'From · one-time';
}

export function openPlanDetails(id,opener){
 const detail=OFFER_DETAILS[id],offer=OFFERS[id];
 if(!detail||!offer)return;
 const modal=dialog||(dialog=buildDialog()),market=currentMarket();
 const target=opener instanceof HTMLElement?opener:document.activeElement;
 if(!modal.contains(target))returnTarget=target;
 modal.dataset.offerId=id;
 modal.querySelector('[data-detail-index]').textContent=detail.index;
 modal.querySelector('[data-detail-label]').textContent=detail.label;
 modal.querySelector('#plan-detail-title').textContent=offer.name;
 modal.querySelector('[data-detail-price-label]').textContent=priceLabel(id,offer.kind);
 modal.querySelector('[data-detail-market]').textContent=MARKETS[market].label;
 const price=modal.querySelector('[data-detail-price]');price.dataset.price=id;price.textContent=priceFor(id,market);
 modal.querySelector('#plan-detail-summary').textContent=detail.summary;
 const fit=document.createElement('p');fit.textContent=detail.fit;
 modal.querySelector('[data-detail-grid]').replaceChildren(
  section('01 / THE RIGHT START','Who this fits',fit,'plan-detail-fit'),
  section('02 / THE WORK','What is included',list(detail.inclusions),'plan-detail-inclusions'),
  section('03 / PRACTICAL VALUE','What this can help with',list(detail.benefits),'plan-detail-benefits'),
  section('04 / AGREED LIMITS','Boundaries & separate scope',list(detail.boundaries),'plan-detail-boundaries')
 );
 modal.querySelector('[data-detail-terms]').href=marketRoute(market,'/terms');
 const enquiry=modal.querySelector('[data-detail-enquire]');
 enquiry.dataset.offerContact=id;
 enquiry.href=`https://wa.me/919175524637?text=${encodeURIComponent(leadText({market,offerId:id,source:location.pathname+location.hash}))}`;
 if(!modal.open)modal.showModal();
 document.documentElement.classList.add('plan-detail-open');
 modal.querySelector('.plan-detail-body').scrollTop=0;
 modal.querySelector('[data-detail-close]').focus({preventScroll:true});
}
