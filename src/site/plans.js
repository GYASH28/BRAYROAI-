const categories=['new-website','monthly-support','ai-systems'];
const aliases={builds:'new-website',websites:'new-website',starter:'new-website','starter-build':'new-website','business-build':'new-website','premium-build':'new-website',monthly:'monthly-support',ai:'ai-systems','ai-audit':'ai-systems','second-brain':'ai-systems','company-second-brain':'ai-systems','ai-workflow-audit':'ai-systems'};
const targetAliases={builds:'new-website',websites:'new-website',starter:'starter-build',monthly:'monthly-support',ai:'ai-systems','company-second-brain':'second-brain','ai-workflow-audit':'ai-audit'};
const categoryFor=hash=>{const id=hash.replace(/^#/,'');if(categories.includes(id))return id;if(aliases[id])return aliases[id];return document.getElementById(id)?.closest('[data-category-panel]')?.dataset.categoryPanel||'new-website'};

export function initPlans(){
 const tabs=[...document.querySelectorAll('[data-category]')],panels=[...document.querySelectorAll('[data-category-panel]')];
 if(!tabs.length)return;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 document.documentElement.classList.add('js-ready');
 const reveals=[...document.querySelectorAll('[data-plan-reveal]')];
 if(reduced.matches||!('IntersectionObserver'in window))reveals.forEach(node=>node.classList.add('is-in'));
 else{
  const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-in');observer.unobserve(entry.target)}},{rootMargin:'0px 0px -8% 0px',threshold:.05});
  reveals.forEach(node=>observer.observe(node));
 }
 const hero=document.querySelector('.plans-hero');
 if(hero&&!reduced.matches&&matchMedia('(pointer:fine)').matches){
  let frame=0,last=null;
  const paint=()=>{frame=0;if(!last)return;const rect=hero.getBoundingClientRect();hero.style.setProperty('--plan-px',`${((last.x-rect.left)/rect.width-.5)*32}px`);hero.style.setProperty('--plan-py',`${((last.y-rect.top)/rect.height-.5)*24}px`)};
  hero.addEventListener('pointermove',event=>{last={x:event.clientX,y:event.clientY};if(!frame)frame=requestAnimationFrame(paint)},{passive:true});
  hero.addEventListener('pointerleave',()=>{last=null;cancelAnimationFrame(frame);frame=0;hero.style.setProperty('--plan-px','0px');hero.style.setProperty('--plan-py','0px')});
 }
 let detailModule,request=0,activeCategory;
 function choose(category,scroll=false){
  if(activeCategory&&activeCategory!==category)request++;
  activeCategory=category;
  tabs.forEach(tab=>{const active=tab.dataset.category===category;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1});
  panels.forEach(panel=>{const active=panel.dataset.categoryPanel===category;panel.classList.toggle('is-selected',active);panel.hidden=!active;if(active)panel.querySelectorAll('[data-plan-reveal]').forEach(node=>node.classList.add('is-in'))});
  window.dispatchEvent(new CustomEvent('studio:category',{detail:{category}}));
  if(scroll){const hash=location.hash.slice(1),target=document.getElementById(targetAliases[hash]||hash)||document.getElementById(category);target?.scrollIntoView({block:'start'})}
 }
 tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>{const category=tab.dataset.category;if(location.hash!==`#${category}`)history.pushState({},'',`#${category}`);choose(category,true)});
  tab.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const offset=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:tabs.length-1))%tabs.length;tabs[offset].focus();tabs[offset].click()});
 });
 document.addEventListener('click',async event=>{
  const trigger=event.target instanceof Element?event.target.closest('[data-plan-detail]'):null;if(!trigger)return;
  event.preventDefault();const ticket=++request,id=trigger.dataset.planDetail;trigger.setAttribute('aria-busy','true');
  try{detailModule||=import('./plan-details.js');const module=await detailModule;if(ticket!==request||!trigger.isConnected||trigger.closest('[hidden]'))return;module.openPlanDetails(id,trigger)}
  catch(error){detailModule=null;if(ticket===request&&!trigger.closest('[hidden]')){const scope=trigger.closest('[data-offer-id]')?.querySelector('details');if(scope){scope.open=true;scope.querySelector('summary')?.focus()}}console.error('Plan details failed',error)}
  finally{trigger.removeAttribute('aria-busy')}
 });
 const sync=()=>choose(categoryFor(location.hash),Boolean(location.hash));window.addEventListener('popstate',sync);window.addEventListener('hashchange',sync);sync();
}
