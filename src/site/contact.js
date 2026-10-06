import {OFFERS,leadText} from '../../data/pricing.js';
import {currentMarket} from './market.js';
const briefKey='brayro_project_brief';
const qualifierKey='brayro_project_qualifiers';
const source=()=>location.pathname+location.hash;

export function initContact(){
 const field=document.querySelector('#project-brief');
 const qualifiers=[...document.querySelectorAll('[data-project-qualifier]')];
 const restore=()=>{
  try{
   if(field)field.value=sessionStorage.getItem(briefKey)||'';
   const saved=JSON.parse(sessionStorage.getItem(qualifierKey)||'{}');
   qualifiers.forEach(control=>{if(saved[control.dataset.projectQualifier]!=null)control.value=saved[control.dataset.projectQualifier]});
  }catch{}
 };
 restore();

 const composedBrief=()=>{
  const selected=Object.fromEntries(qualifiers.map(control=>[control.dataset.projectQualifier,control.value]).filter(([,value])=>value));
  const lines=[];
  if(selected.service)lines.push(`Project type: ${selected.service}`);
  if(selected.budget)lines.push(`Approx. budget: ${selected.budget}`);
  if(selected.timeline)lines.push(`Preferred timing: ${selected.timeline}`);
  const free=field?.value.trim()||'';
  return[lines.join('\n'),free].filter(Boolean).join('\n\n');
 };
 const persist=()=>{
  try{
   if(field)sessionStorage.setItem(briefKey,field.value);
   sessionStorage.setItem(qualifierKey,JSON.stringify(Object.fromEntries(qualifiers.map(control=>[control.dataset.projectQualifier,control.value]))));
  }catch{}
 };
 const update=()=>{
  const brief=composedBrief();
  const message=leadText({market:currentMarket(),source:source(),brief});
  const whatsapp=`https://wa.me/919175524637?text=${encodeURIComponent(message)}`;
  const email=`mailto:yashganesh.work@gmail.com?subject=${encodeURIComponent('BRAYRO AI project enquiry')}&body=${encodeURIComponent(message)}`;
  const callMessage=leadText({market:currentMarket(),source:source(),brief:`I would like to request a 15-minute intro call.\n\n${brief}`});
  const whatsAppLink=document.querySelector('[data-contact-whatsapp]');
  const emailLink=document.querySelector('[data-contact-email]');
  const callLink=document.querySelector('[data-contact-call]');
  if(whatsAppLink)whatsAppLink.href=whatsapp;
  if(emailLink)emailLink.href=email;
  if(callLink)callLink.href=`https://wa.me/919175524637?text=${encodeURIComponent(callMessage)}`;
 };
 field?.addEventListener('input',()=>{persist();update()});
 qualifiers.forEach(control=>control.addEventListener('change',()=>{persist();update()}));
 update();

 document.querySelectorAll('[data-offer-contact]').forEach(link=>{
  const id=link.dataset.offerContact;if(!OFFERS[id])return;
  link.href=`https://wa.me/919175524637?text=${encodeURIComponent(leadText({market:currentMarket(),offerId:id,source:source()}))}`;
  link.target='_blank';link.rel='noreferrer';
 });
}
