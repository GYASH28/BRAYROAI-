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
 let revealObserver=null;
 if(reduced.matches||!('IntersectionObserver'in window))reveals.forEach(node=>node.classList.add('is-in'));
 else{
  revealObserver=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-in');revealObserver.unobserve(entry.target)}},{rootMargin:'0px 0px -9% 0px',threshold:.05});
  reveals.forEach(node=>revealObserver.observe(node));
 }
 // Visitors can enable reduced motion while the Plans page is open.
 // Reveal pending content immediately; never leave sections waiting for a scroll.
 reduced.addEventListener('change',()=>{
  if(!reduced.matches)return;
  revealObserver?.disconnect();
  reveals.forEach(node=>node.classList.add('is-in'));
 });
 const tiltCards=[...document.querySelectorAll('[data-plan-tilt]')];
 const resetTilt=card=>{
  card.style.setProperty('--rx','0deg');
  card.style.setProperty('--ry','0deg');
  card.style.removeProperty('--mx');
  card.style.removeProperty('--my');
 };
 reduced.addEventListener('change',()=>{if(reduced.matches)tiltCards.forEach(resetTilt)});
 if(matchMedia('(hover:hover) and (pointer:fine)').matches){
  for(const card of tiltCards){
   let frame=0,lastEvent=null;
   const paint=()=>{
    frame=0;
    if(!lastEvent||reduced.matches)return;
    const rect=card.getBoundingClientRect();
    const px=Math.max(0,Math.min(1,(lastEvent.clientX-rect.left)/rect.width));
    const py=Math.max(0,Math.min(1,(lastEvent.clientY-rect.top)/rect.height));
    const strength=card.classList.contains('hero-plan-card')?4:2.4;
    card.style.setProperty('--ry',`${((px-.5)*strength*2).toFixed(2)}deg`);
    card.style.setProperty('--rx',`${((.5-py)*strength*2).toFixed(2)}deg`);
    card.style.setProperty('--mx',`${(px*100).toFixed(1)}%`);
    card.style.setProperty('--my',`${(py*100).toFixed(1)}%`);
   };
   card.addEventListener('pointermove',event=>{if(reduced.matches)return;lastEvent=event;if(!frame)frame=requestAnimationFrame(paint)},{passive:true});
   card.addEventListener('pointerleave',()=>{
    lastEvent=null;
    if(frame){cancelAnimationFrame(frame);frame=0}
    resetTilt(card);
   },{passive:true});
  }
 }
 const routeLinks=[...document.querySelectorAll('[data-plan-route]')];
 const sections=[...document.querySelectorAll('[data-plan-section]')];
 if('IntersectionObserver'in window&&sections.length){
  // IntersectionObserver reports only changed entries, not every section.
  // Keep the full visible set so a departing section cannot steal the highlight.
  const ratios=new Map(sections.map(section=>[section,0]));
  const activeObserver=new IntersectionObserver(entries=>{
   for(const entry of entries)ratios.set(entry.target,entry.isIntersecting?entry.intersectionRatio:0);
   const current=[...ratios].filter(([,ratio])=>ratio>0).sort((a,b)=>b[1]-a[1])[0]?.[0];
   routeLinks.forEach(link=>{
    const on=Boolean(current)&&link.dataset.planRoute===current.id;
    link.classList.toggle('is-active',on);
    if(on)link.setAttribute('aria-current','location');
    else link.removeAttribute('aria-current');
   });
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
   trigger.parentElement?.querySelector('[data-plan-load-error]')?.remove();
   module.openPlanDetails(id,trigger);
  }catch(error){
   detailModule=null;
   console.error('Plan details failed',error);
   if(ticket===request&&visible(trigger)){
    let feedback=trigger.parentElement?.querySelector('[data-plan-load-error]');
    if(!feedback&&trigger.parentElement){
     feedback=document.createElement('small');
     feedback.dataset.planLoadError='';
     feedback.setAttribute('role','alert');
     trigger.parentElement.append(feedback);
    }
    if(feedback)feedback.textContent='Full details could not load. Try again, or use the enquiry link for this plan.';
   }
  }finally{trigger.removeAttribute('aria-busy')}
 });
}
