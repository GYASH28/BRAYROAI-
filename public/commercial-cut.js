(() => {
  let started=false,ready=false,pendingControl=null;
  const events=['scroll','wheel','touchstart','pointerdown'];
  const cleanup=()=>{
    events.forEach(type=>removeEventListener(type,load));
    removeEventListener('keydown',load);
    removeEventListener('hashchange',load);
    document.removeEventListener('brayro:market-opened',load);
    document.removeEventListener('rae:opened',load);
  };
  const captureFirstControl=event=>{
    const control=event.target.closest?.('[data-colour-toggle],[data-work-toggle]');
    if(!control||ready)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    pendingControl=control;
    load();
  };
  const load=()=>{
    if(started)return;
    started=true;
    cleanup();
    const script=document.createElement('script');
    script.src='/commercial-cut-runtime.js';
    script.async=false;
    script.dataset.commercialCutRuntime='true';
    script.onload=()=>{
      ready=true;
      document.removeEventListener('click',captureFirstControl,true);
      const control=pendingControl;
      pendingControl=null;
      if(control?.isConnected)control.click();
    };
    script.onerror=()=>document.removeEventListener('click',captureFirstControl,true);
    document.body.append(script);
  };
  document.addEventListener('click',captureFirstControl,true);
  const mobile=matchMedia('(max-width:760px)').matches;
  if(!mobile){load();return}
  events.forEach(type=>addEventListener(type,load,{once:true,passive:true}));
  addEventListener('keydown',load,{once:true});
  addEventListener('hashchange',load,{once:true});
  document.addEventListener('brayro:market-opened',load,{once:true});
  document.addEventListener('rae:opened',load,{once:true});
  if(scrollY>0||location.hash)queueMicrotask(load);
})();
