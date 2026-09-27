(()=>{
  const links=[...document.querySelectorAll('link[data-layout-stable-fonts]')];
  if(!links.length)return;
  const desktop=matchMedia('(min-width: 761px)');
  const activate=()=>{
    if(!desktop.matches)return;
    for(const link of links){link.rel='stylesheet';link.removeAttribute('as')}
    desktop.removeEventListener('change',activate);
  };
  desktop.addEventListener('change',activate);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',activate,{once:true});
  else activate();
})();
