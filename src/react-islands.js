const loads=new Map();

const loadOnce=(key,importer)=>{
  if(!loads.has(key))loads.set(key,importer().catch(error=>{console.warn(`${key} React island skipped`,error);loads.delete(key)}));
  return loads.get(key);
};

const loadMarket=()=>loadOnce('Market',()=>import('./react/market-switcher-island.js').then(module=>module.mountMarketSwitcherIsland()));
const loadPlanFinder=()=>loadOnce('Plan finder',()=>import('./react/plan-finder-island.js').then(module=>module.mountPlanFinderIsland()));
const loadProjectBrief=()=>loadOnce('Project brief',()=>import('./react/project-brief-island.js').then(module=>module.mountProjectBriefIsland()));
const loadAiSignal=()=>loadOnce('AI signal',()=>import('./react/ai-signal-island.js').then(module=>module.mountAiSignalIslands()));
const loadRaeDimensional=()=>loadOnce('Rae dimensional',()=>import('./rae-3d-island.js').then(module=>module.mountRaeDimensional()));
const loadSignatureScenes=()=>loadOnce('Signature scenes',()=>import('./signature-scenes.js').then(module=>module.mountSignatureScenes()));

document.addEventListener('brayro:market-opened',loadMarket);
document.addEventListener('rae:opened',()=>{
  const memory=Number(navigator.deviceMemory||8),cores=Number(navigator.hardwareConcurrency||8);
  if(!saveData&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&matchMedia('(min-width:701px)').matches&&memory>=4&&cores>=4)loadRaeDimensional();
});

const saveData=Boolean(navigator.connection?.saveData);
if(!saveData){
  document.querySelectorAll('[data-market-trigger]').forEach(trigger=>{
    trigger.addEventListener('pointerenter',loadMarket,{once:true,passive:true});
    trigger.addEventListener('focus',loadMarket,{once:true});
  });
}

const observe=(selector,load)=>{
  const hosts=[...document.querySelectorAll(selector)];
  hosts.forEach(host=>{
    const target=host.closest('section')||host.parentElement||host;
    if(!('IntersectionObserver'in window)){load();return}
    const observer=new IntersectionObserver(entries=>{
      if(!entries.some(entry=>entry.isIntersecting))return;
      observer.disconnect();load();
    },{rootMargin:(saveData?'120px 0px':'650px 0px'),threshold:0});
    observer.observe(target);
  });
};

observe('[data-react-plan-island]',loadPlanFinder);
observe('[data-react-brief-island]',loadProjectBrief);
observe('[data-react-ai-signal-island]',loadAiSignal);

observe('[data-v12-story-visual],[data-editorial-sequence]',loadSignatureScenes);
