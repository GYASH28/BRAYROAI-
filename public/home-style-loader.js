(() => {
  'use strict';
  const root=document.documentElement;
  const sheet=document.querySelector('link[data-brayro-home-styles]');
  if(!sheet)return;

  let activated=sheet.media!=='(min-width:701px)';
  let ready=activated;
  let timer=0;

  const markReady=()=>{
    if(ready)return;
    ready=true;
    requestAnimationFrame(()=>requestAnimationFrame(()=>root.classList.add('home-full-ready')));
  };
  const waitForSheet=()=>{
    if(sheet.sheet)return markReady();
    setTimeout(waitForSheet,24);
  };
  const activate=()=>{
    if(activated){if(!root.classList.contains('home-full-ready'))waitForSheet();return}
    activated=true;
    if(timer){clearTimeout(timer);timer=0}
    sheet.media='all';
    waitForSheet();
  };

  window.__BRAYRO_HOME_STYLES__={activate};

  if(matchMedia('(min-width:701px)').matches){
    root.classList.add('home-full-ready');
    return;
  }

  const intentEvents=['pointerdown','touchstart','keydown','wheel','scroll'];
  intentEvents.forEach(type=>addEventListener(type,activate,{once:true,passive:type!=='keydown',capture:true}));
  addEventListener('pageshow',event=>{if(event.persisted)activate()},{once:true});
  const schedule=()=>{timer=setTimeout(activate,4500)};
  if(document.readyState==='complete')schedule();else addEventListener('load',schedule,{once:true});
})();
