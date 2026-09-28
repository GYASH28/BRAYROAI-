import {OFFERS,leadText} from '../../data/pricing.js';
import {currentMarket} from './market.js';
const briefKey='brayro_project_brief';
const source=()=>location.pathname+location.hash;
export function initContact(){
 const field=document.querySelector('#project-brief');
 if(field){try{field.value=sessionStorage.getItem(briefKey)||''}catch{}field.addEventListener('input',()=>{try{sessionStorage.setItem(briefKey,field.value)}catch{}update()})}
 const update=()=>{
  const brief=field?.value.trim()||'';
  const message=leadText({market:currentMarket(),source:source(),brief});
  const whatsapp=`https://wa.me/919175524637?text=${encodeURIComponent(message)}`;
  const email=`mailto:yashganesh.work@gmail.com?subject=${encodeURIComponent('BRAYRO AI project enquiry')}&body=${encodeURIComponent(message)}`;
  const whatsAppLink=document.querySelector('[data-contact-whatsapp]'),emailLink=document.querySelector('[data-contact-email]');
  if(whatsAppLink)whatsAppLink.href=whatsapp;if(emailLink)emailLink.href=email;
 };
 update();
 document.querySelectorAll('[data-offer-contact]').forEach(link=>{
  const id=link.dataset.offerContact;if(!OFFERS[id])return;
  link.href=`https://wa.me/919175524637?text=${encodeURIComponent(leadText({market:currentMarket(),offerId:id,source:source()}))}`;
  link.target='_blank';link.rel='noreferrer';
 });
}
