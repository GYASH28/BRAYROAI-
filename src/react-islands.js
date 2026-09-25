const loads=new Map();

const loadOnce=(key,importer)=>{
  if(!loads.has(key))loads.set(key,importer().catch(error=>{console.warn(`${key} React island skipped`,error);loads.delete(key)}));
  return loads.get(key);
};

const loadMarket=()=>loadOnce('Market',()=>import('./react/market-switcher-island.js').then(module=>module.mountMarketSwitcherIsland()));
const loadPlanFinder=()=>loadOnce('Plan finder',()=>import('./react/plan-finder-island.js').then(module=>module.mountPlanFinderIsland()));
const loadProjectBrief=()=>loadOnce('Project brief',()=>import('./react/project-brief-island.js').then(module=>module.mountProjectBriefIsland()));

document.addEventListener('brayro:market-opened',loadMarket);

const canPreload=!navigator.connection?.saveData;
if(canPreload){
  document.querySelectorAll('[data-market-trigger]').forEach(trigger=>{
    trigger.addEventListener('pointerenter',loadMarket,{once:true,passive:true});
    trigger.addEventListener('focus',loadMarket,{once:true});
  });
  const observe=(selector,load)=>{
    const host=document.querySelector(selector);if(!host)return;
    if(!('IntersectionObserver'in window)){load();return}
    const observer=new IntersectionObserver(entries=>{if(!entries.some(entry=>entry.isIntersecting))return;observer.disconnect();load()},{rootMargin:'650px 0px',threshold:0});
    observer.observe(host);
  };
  observe('[data-react-plan-island]',loadPlanFinder);
  observe('[data-react-brief-island]',loadProjectBrief);
}
