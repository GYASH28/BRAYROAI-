const aliases={'builds':'new-website','monthly':'monthly-support','ai-audit':'ai-systems','second-brain':'ai-systems','company-second-brain':'ai-systems','ai-workflow-audit':'ai-systems'};
const categoryFor=hash=>{
 const id=hash.replace(/^#/,'');
 if(['new-website','monthly-support','ai-systems'].includes(id))return id;
 if(aliases[id])return aliases[id];
 const offer=document.getElementById(id);return offer?.closest('[data-category-panel]')?.dataset.categoryPanel||'new-website';
};
export function initPlans(){
 const tabs=[...document.querySelectorAll('[data-category]')],panels=[...document.querySelectorAll('[data-category-panel]')];if(!tabs.length)return;
 function choose(category,scroll=false){
  tabs.forEach(tab=>{const active=tab.dataset.category===category;tab.setAttribute('aria-selected',active?'true':'false');tab.tabIndex=active?0:-1});
  panels.forEach(panel=>panel.classList.toggle('is-selected',panel.dataset.categoryPanel===category));
  document.documentElement.classList.add('js-ready');
  if(scroll){const target=document.getElementById(location.hash.slice(1))||document.getElementById(category);target?.scrollIntoView({block:'start'})}
 }
 tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>{const category=tab.dataset.category;history.pushState({},'',`#${category}`);choose(category,true)});
 tab.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const offset=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:tabs.length-1))%tabs.length;tabs[offset].focus();tabs[offset].click()})});
 const sync=()=>choose(categoryFor(location.hash),Boolean(location.hash));window.addEventListener('popstate',sync);window.addEventListener('hashchange',sync);sync();
}
