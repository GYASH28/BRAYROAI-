let loading=null;

const load=()=>{
  if(!loading)loading=import('./react/market-switcher-island.js')
    .then(module=>module.mountMarketSwitcherIsland())
    .catch(error=>console.warn('Market React island skipped',error));
  return loading;
};

document.addEventListener('brayro:market-opened',load);

const canPreload=!navigator.connection?.saveData;
if(canPreload){
  document.querySelectorAll('[data-market-trigger]').forEach(trigger=>{
    trigger.addEventListener('pointerenter',load,{once:true,passive:true});
    trigger.addEventListener('focus',load,{once:true});
  });
}
