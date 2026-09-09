(() => {
  'use strict';

  const root=document.documentElement;
  if(root.dataset.perfV22Mounted)return;
  root.dataset.perfV22Mounted='true';

  const connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
  const saveData=!!connection?.saveData;
  const slowNetwork=['slow-2g','2g'].includes(connection?.effectiveType||'');
  const memory=Number(navigator.deviceMemory||0);
  const cores=Number(navigator.hardwareConcurrency||0);
  const constrained=saveData||slowNetwork||(memory>0&&memory<=4)||(cores>0&&cores<=4);
  root.dataset.perfTier=constrained?'constrained':'full';

  class VisibilityBudget {
    constructor(){
      this.nodes=[...document.querySelectorAll('main [data-scene],main [data-plan-scene],main [data-founder-scene],main [data-ai-scene]')];
      if(!this.nodes.length)return;
      if(!('IntersectionObserver' in window)){
        this.nodes.forEach(node=>node.dataset.perfActive='true');
        return;
      }
      this.observer=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{entry.target.dataset.perfActive=entry.isIntersecting?'true':'false'});
      },{rootMargin:'90% 0px 90% 0px',threshold:0});
      this.nodes.forEach(node=>{node.dataset.perfActive='false';this.observer.observe(node)});
    }
  }

  class ImageScheduler {
    constructor(){
      document.querySelectorAll('main img').forEach(image=>{
        const hero=!!image.closest('#top');
        if(!hero&&!image.hasAttribute('loading'))image.loading='lazy';
        if(!image.hasAttribute('decoding'))image.decoding=hero?'sync':'async';
        if(!hero&&!image.hasAttribute('fetchpriority'))image.fetchPriority='low';
      });
    }
  }

  class InternalPrefetch {
    constructor(){
      if(saveData||slowNetwork)return;
      this.prefetched=new Set();
      this.timer=0;
      const warm=event=>{
        const link=event.target.closest?.('a[href]');
        if(!link)return;
        let url;
        try{url=new URL(link.href,location.href)}catch{return}
        if(url.origin!==location.origin||url.pathname===location.pathname||url.hash)return;
        clearTimeout(this.timer);
        this.timer=setTimeout(()=>this.prefetch(url),90);
      };
      document.addEventListener('pointerover',warm,{passive:true});
      document.addEventListener('focusin',warm);
      document.addEventListener('touchstart',warm,{passive:true});
    }
    prefetch(url){
      const href=`${url.pathname}${url.search}`;
      if(this.prefetched.has(href))return;
      this.prefetched.add(href);
      const link=document.createElement('link');
      link.rel='prefetch';link.href=href;link.as='document';
      document.head.append(link);
    }
  }

  class PageState {
    constructor(){
      const paint=()=>{root.dataset.pageHidden=document.hidden?'true':'false'};
      document.addEventListener('visibilitychange',paint,{passive:true});
      addEventListener('pagehide',()=>{root.dataset.pageHidden='true'},{passive:true});
      addEventListener('pageshow',()=>{root.dataset.pageHidden='false'},{passive:true});
      paint();
    }
  }

  class FrameHealth {
    constructor(){
      this.samples=[];
      this.last=0;
      this.raf=0;
      this.remaining=120;
      if(document.hidden)return;
      this.loop=timestamp=>{
        if(this.last)this.samples.push(timestamp-this.last);
        this.last=timestamp;
        this.remaining-=1;
        if(this.remaining<=0){
          const sorted=[...this.samples].sort((a,b)=>a-b);
          const p90=sorted[Math.floor(sorted.length*.9)]||16.7;
          root.dataset.frameHealth=p90>28?'strained':'smooth';
          this.raf=0;
          return;
        }
        this.raf=requestAnimationFrame(this.loop);
      };
      this.raf=requestAnimationFrame(this.loop);
    }
  }

  new VisibilityBudget();
  new ImageScheduler();
  new InternalPrefetch();
  new PageState();
  new FrameHealth();
})();