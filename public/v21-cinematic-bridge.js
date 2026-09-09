(() => {
  'use strict';
  if (document.documentElement.dataset.v21CinematicBridge) return;
  const path = location.pathname.replace(/\/$/,'') || '/';
  if (path !== '/' && !path.endsWith('/index.html')) return;

  const root=document.documentElement;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
  root.dataset.v21CinematicBridge='true';

  const create=(tag,className,html='')=>{
    const node=document.createElement(tag);
    node.className=className;
    if(html)node.innerHTML=html;
    return node;
  };

  function mountSolutionSignal(){
    const stage=document.querySelector('#services .v12-story__visual');
    if(!stage||stage.querySelector('[data-v20-signal]'))return;
    const field=create('div','v20-signal-field','<i class="v20-signal-field__orbit"></i><i class="v20-signal-field__orbit"></i><i class="v20-signal-field__orbit"></i>');
    field.dataset.v20Signal='';
    field.setAttribute('aria-hidden','true');
    stage.prepend(field);
  }

  function fixSceneRailLabels(){
    const label=document.querySelector('[data-v20-rail-label]');
    if(!label)return;
    const labels={
      hero:'OPEN',services:'SOLUTIONS','growth-engine':'GROWTH ENGINE','brayro-os':'BRAYRO OS',work:'WORK',process:'PROCESS',founder:'FOUNDER',contact:'CONTACT'
    };
    const paint=()=>{
      const key=document.body.dataset.v20Scene||'hero';
      label.textContent=labels[key]||String(key).replaceAll('-',' ').toUpperCase();
    };
    paint();
    new MutationObserver(paint).observe(document.body,{attributes:true,attributeFilter:['data-v20-scene']});
  }

  class SpringSpotlights{
    constructor(){
      this.frame=0;
      this.items=[...document.querySelectorAll('[data-ig-demo],.ig-flow-panel--active,.ig-os-window,.v12-featured-case,.ig-calculator')].map(node=>({node,x:50,y:50,tx:50,ty:50,o:0,to:0}));
      if(reduced||!fine||!this.items.length)return;
      this.items.forEach(item=>{
        item.node.addEventListener('pointerenter',event=>this.point(item,event,1));
        item.node.addEventListener('pointermove',event=>this.point(item,event,1),{passive:true});
        item.node.addEventListener('pointerleave',()=>{item.tx=50;item.ty=50;item.to=0;this.schedule()});
      });
    }
    point(item,event,opacity){
      const rect=item.node.getBoundingClientRect();
      item.tx=rect.width?((event.clientX-rect.left)/rect.width)*100:50;
      item.ty=rect.height?((event.clientY-rect.top)/rect.height)*100:50;
      item.to=opacity;
      this.schedule();
    }
    schedule(){if(!this.frame)this.frame=requestAnimationFrame(()=>this.tick())}
    tick(){
      this.frame=0;
      let delta=0;
      for(const item of this.items){
        item.x+=(item.tx-item.x)*.16;item.y+=(item.ty-item.y)*.16;item.o+=(item.to-item.o)*.2;
        item.node.style.setProperty('--v21-spot-x',`${item.x.toFixed(2)}%`);
        item.node.style.setProperty('--v21-spot-y',`${item.y.toFixed(2)}%`);
        item.node.style.setProperty('--v21-spot-o',item.o.toFixed(4));
        delta+=Math.abs(item.tx-item.x)+Math.abs(item.ty-item.y)+Math.abs(item.to-item.o)*12;
      }
      if(delta>.08)this.schedule();
    }
  }

  function syncDemoPulse(){
    const demo=document.querySelector('[data-ig-demo]');
    if(!demo)return;
    const pulse=create('div','v21-system-pulse','<i></i><i></i><i></i>');
    pulse.setAttribute('aria-hidden','true');
    demo.prepend(pulse);
    const update=()=>pulse.dataset.state=document.querySelectorAll('[data-ig-event].is-active').length>1?'moving':'ready';
    update();
    new MutationObserver(update).observe(demo,{subtree:true,attributes:true,attributeFilter:['class']});
  }

  const start=()=>{
    mountSolutionSignal();
    fixSceneRailLabels();
    new SpringSpotlights();
    syncDemoPulse();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
