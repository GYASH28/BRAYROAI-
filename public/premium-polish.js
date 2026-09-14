(() => {
  'use strict';
  const body=document.body;
  body.classList.add('motion-polished');

  /* This layer used to run another global pointer spring, another active-nav
     observer and an opening enrichment pass. V22/V12/HyperFrames own those
     jobs now. Keep only visibility/direction state that CSS still consumes. */
  const scenes=[...document.querySelectorAll('[data-scene],[data-plan-scene],[data-founder-scene]')];
  scenes.forEach((scene,index)=>scene.style.setProperty('--polish-index',String(index)));

  if('IntersectionObserver'in window){
    const sceneObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>entry.target.classList.toggle('is-scene-live',entry.isIntersecting));
    },{rootMargin:'18% 0px 18% 0px',threshold:[0,.05]});
    scenes.forEach(scene=>sceneObserver.observe(scene));
  }else scenes.forEach(scene=>scene.classList.add('is-scene-live'));

  const buckets=new Map();
  document.querySelectorAll('[data-reveal]').forEach(item=>{
    const parent=item.closest('[data-scene],[data-plan-scene],[data-founder-scene]')||item.parentElement;
    if(!buckets.has(parent))buckets.set(parent,[]);
    buckets.get(parent).push(item);
  });
  buckets.forEach(items=>items.forEach((item,index)=>item.style.setProperty('--reveal-delay',`${Math.min(index*72,216)}ms`)));

  let lastY=scrollY,frame=0;
  const paint=()=>{
    frame=0;
    const y=scrollY,delta=y-lastY;
    body.classList.toggle('has-scrolled',y>48);
    if(Math.abs(delta)>1){
      body.classList.toggle('scrolling-down',delta>0&&y>180);
      body.classList.toggle('scrolling-up',delta<0);
      lastY=y;
    }
  };
  addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(paint)},{passive:true});
  paint();

  document.querySelectorAll('.build-ribbon__item,.build-card,.care-grid article,.compare-table>div').forEach((element,index)=>element.style.setProperty('--polish-item',String(index)));
})();
