const categories=['new-website','monthly-support','ai-systems'];
const aliases={builds:'new-website',websites:'new-website',monthly:'monthly-support',ai:'ai-systems','ai-audit':'ai-systems','second-brain':'ai-systems','company-second-brain':'ai-systems','ai-workflow-audit':'ai-systems'};
const targetAliases={builds:'new-website',websites:'new-website',monthly:'monthly-support',ai:'ai-systems','company-second-brain':'second-brain','ai-workflow-audit':'ai-audit'};
const categoryFor=hash=>{
 const id=hash.replace(/^#/,'');
 if(categories.includes(id))return id;
 if(aliases[id])return aliases[id];
 return document.getElementById(id)?.closest('[data-category-panel]')?.dataset.categoryPanel||'new-website';
};

export function initPlans(){
 const tabs=[...document.querySelectorAll('[data-category]')],panels=[...document.querySelectorAll('[data-category-panel]')];
 if(!tabs.length)return;
 let detailModule,request=0,activeCategory;
 function choose(category,scroll=false){
  if(activeCategory&&activeCategory!==category)request++;
  activeCategory=category;
  tabs.forEach(tab=>{const active=tab.dataset.category===category;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1});
  panels.forEach(panel=>{const active=panel.dataset.categoryPanel===category;panel.classList.toggle('is-selected',active);panel.hidden=!active});
  document.documentElement.classList.add('js-ready');
  window.dispatchEvent(new CustomEvent('studio:category',{detail:{category}}));
  if(scroll){const hash=location.hash.slice(1),target=document.getElementById(targetAliases[hash]||hash)||document.getElementById(category);target?.scrollIntoView({block:'start'})}
 }
 tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>{const category=tab.dataset.category;if(location.hash!==`#${category}`)history.pushState({},'',`#${category}`);choose(category,true)});
  tab.addEventListener('keydown',event=>{
   if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
   event.preventDefault();
   const offset=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:tabs.length-1))%tabs.length;
   tabs[offset].focus();tabs[offset].click();
  });
 });
 document.addEventListener('click',async event=>{
  const trigger=event.target instanceof Element?event.target.closest('[data-plan-detail]'):null;
  if(!trigger)return;
  event.preventDefault();
  const ticket=++request,id=trigger.dataset.planDetail;
  trigger.setAttribute('aria-busy','true');
  try{
   detailModule||=import('./plan-details.js');
   const module=await detailModule;
   // Only the latest interaction may open a plan, and its category must still be visible.
   if(ticket!==request||!trigger.isConnected||trigger.closest('[hidden]'))return;
   module.openPlanDetails(id,trigger);
  }catch(error){
   detailModule=null;
   if(ticket===request&&!trigger.closest('[hidden]')){
    const scope=trigger.closest('[data-offer-id]')?.querySelector('details');
    if(scope){scope.open=true;scope.querySelector('summary')?.focus()}
   }
   console.error('Plan details failed',error);
  }finally{trigger.removeAttribute('aria-busy')}
 });
 const sync=()=>choose(categoryFor(location.hash),Boolean(location.hash));
 window.addEventListener('popstate',sync);window.addEventListener('hashchange',sync);sync();
}
