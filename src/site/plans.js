const legacyHashes=Object.freeze({
 'new-website':'one-time-builds',builds:'one-time-builds',websites:'one-time-builds',
 monthly:'monthly-builds','monthly-support':'monthly-builds',
 ai:'ai-systems','ai-audit':'ai-systems','second-brain':'ai-systems',
 'company-second-brain':'ai-systems','ai-workflow-audit':'ai-systems','knowledge-care':'ai-systems',
 'launch-website':'one-time-builds','business-experience':'one-time-builds','premium-experience':'one-time-builds',
 'monthly-starter':'monthly-builds','monthly-growth':'monthly-builds','monthly-studio':'monthly-builds'
});
const visible=element=>element instanceof HTMLElement&&element.isConnected&&!element.closest('[hidden]')&&element.getClientRects().length>0;

export function initPlans(){
 if(!document.body.classList.contains('page-plans'))return;
 document.documentElement.classList.add('js-ready');
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const reveals=[...document.querySelectorAll('[data-plan-reveal]')];
 if(reduced.matches||!('IntersectionObserver'in window))reveals.forEach(node=>node.classList.add('is-in'));
 else{
  const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-in');observer.unobserve(entry.target)}},{rootMargin:'0px 0px -9% 0px',threshold:.05});
  reveals.forEach(node=>observer.observe(node));
 }
 const routeLinks=[...document.querySelectorAll('[data-plan-route]')];
 const sections=[...document.querySelectorAll('[data-plan-section]')];
 if('IntersectionObserver'in window&&sections.length){
  const activeObserver=new IntersectionObserver(entries=>{
   const current=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
   if(!current)return;
   routeLinks.forEach(link=>{const on=link.dataset.planRoute===current.target.id;link.classList.toggle('is-active',on);if(on)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')});
  },{rootMargin:'-30% 0px -58% 0px',threshold:[0,.05,.2,.5]});
  sections.forEach(section=>activeObserver.observe(section));
 }
 const resolveHash=()=>{
  const raw=location.hash.slice(1);if(!raw)return;
  const id=legacyHashes[raw]||raw,target=document.getElementById(id);
  if(target&&id!==raw)requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:'instant'}));
 };
 addEventListener('hashchange',resolveHash);resolveHash();

 let detailModule,request=0;
 document.addEventListener('click',async event=>{
  const trigger=event.target instanceof Element?event.target.closest('[data-plan-detail]'):null;
  if(!trigger)return;
  event.preventDefault();const ticket=++request,id=trigger.dataset.planDetail;trigger.setAttribute('aria-busy','true');
  try{
   detailModule||=import('./plan-details.js');
   const module=await detailModule;
   if(ticket!==request||!visible(trigger))return;
   module.openPlanDetails(id,trigger);
  }catch(error){
   detailModule=null;
   console.error('Plan details failed',error);
  }finally{trigger.removeAttribute('aria-busy')}
 });
}
