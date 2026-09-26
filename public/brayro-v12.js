(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const mobile = matchMedia('(max-width:760px)').matches;
  const clamp = (min,value,max) => Math.min(max,Math.max(min,value));

  /* V15 owns capabilities, V14 owns homepage pricing, V22 owns the cursor and
     pointer-reactive surfaces. The retired ledger/cursor/tilt runtimes used to
     build DOM only to have it replaced a few milliseconds later. */

  class IntroPerformanceGuard {
    constructor(){
      if(reduced||mobile)return;
      this.opening=document.querySelector('.opening-sequence.hf-intro');
      this.skip=this.opening?.querySelector('[data-hf-skip]');
      this.sound=this.opening?.querySelector('[data-hf-sound]');
      if(!this.opening||!this.skip||!document.body.classList.contains('hf-intro-active'))return;
      this.timer=setTimeout(()=>{
        if(!document.body.classList.contains('hf-intro-active'))return;
        if(this.sound?.getAttribute('aria-pressed')==='true')return;
        this.skip.click();
      },3200);
      this.skip.addEventListener('click',()=>clearTimeout(this.timer),{once:true});
      addEventListener('pagehide',()=>clearTimeout(this.timer),{once:true});
    }
  }

  class V12Reveal {
    constructor(){
      const nodes=[...document.querySelectorAll('[data-v12-reveal]')];
      if(!nodes.length)return;
      if(reduced||!('IntersectionObserver'in window)){
        nodes.forEach(node=>node.classList.add('is-visible'));
        return;
      }
      this.groups=new Map();
      nodes.forEach(node=>{
        const target=node.closest('section')||node;
        if(!this.groups.has(target))this.groups.set(target,[]);
        this.groups.get(target).push(node);
      });
      this.observer=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
          if(!entry.isIntersecting)return;
          const items=this.groups.get(entry.target)||[entry.target];
          requestAnimationFrame(()=>items.forEach(node=>node.classList.add('is-visible')));
          this.observer.unobserve(entry.target);
        });
      },{threshold:.04,rootMargin:'5% 0px 12% 0px'});
      this.groups.forEach((_items,target)=>this.observer.observe(target));
    }
  }

  const startV12Reveal=()=>{
    let mounted=false;
    const passiveEvents=['scroll','wheel','touchstart','pointerdown'];
    const cleanup=()=>{
      passiveEvents.forEach(type=>removeEventListener(type,mount));
      removeEventListener('keydown',mount);
      removeEventListener('hashchange',mount);
    };
    const mount=()=>{
      if(mounted)return;
      mounted=true;cleanup();new V12Reveal();
    };
    passiveEvents.forEach(type=>addEventListener(type,mount,{once:true,passive:true}));
    addEventListener('keydown',mount,{once:true});
    addEventListener('hashchange',mount,{once:true});
    if(scrollY>0||location.hash)queueMicrotask(mount);
  };

  class FloatingHeader {
    constructor(){
      this.nav=document.querySelector('[data-site-nav]');
      if(!this.nav)return;
      this.links=[...this.nav.querySelectorAll('nav a[href^="#"]')];
      this.sections=this.links.map(link=>({link,section:document.querySelector(link.getAttribute('href'))})).filter(item=>item.section);
      this.scrolled=false;
      this.onScroll=()=>{
        const next=scrollY>84;
        if(next===this.scrolled)return;
        this.scrolled=next;
        this.nav.classList.toggle('v12-scrolled',next);
      };
      addEventListener('scroll',this.onScroll,{passive:true});
      addEventListener('pageshow',event=>{if(event.persisted)this.onScroll()},{passive:true});
      if(!this.sections.length||!('IntersectionObserver'in window))return;
      this.observer=new IntersectionObserver(entries=>{
        const live=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
        if(!live)return;
        const current=this.sections.find(item=>item.section===live.target);
        this.links.forEach(link=>link.classList.toggle('is-current',link===current?.link));
      },{rootMargin:'-24% 0px -58% 0px',threshold:[0,.01,.25,.5]});
      this.sections.forEach(item=>this.observer.observe(item.section));
    }
  }

  class FlipLinks {
    constructor(){
      if(reduced)return;
      document.querySelectorAll('.site-nav nav a').forEach(link=>{
        if(link.classList.contains('brayro-flip')||link.children.length)return;
        const label=link.textContent.trim();
        if(!label)return;
        link.classList.add('brayro-flip');
        link.setAttribute('aria-label',label);
        link.innerHTML=`<span class="brayro-flip__front">${label}</span><span class="brayro-flip__back" aria-hidden="true">${label}</span>`;
      });
    }
  }

  class CurtainReveal {
    constructor(){
      const surfaces=[...document.querySelectorAll('.v12-featured-case .work__desktop,.v12-featured-case .work__mobile')];
      if(!surfaces.length)return;
      surfaces.forEach(surface=>surface.classList.add('brayro-curtain'));
      if(reduced||!('IntersectionObserver'in window)){
        surfaces.forEach(surface=>surface.classList.add('is-revealed'));
        return;
      }
      const observer=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
          if(!entry.isIntersecting)return;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      },{threshold:.26});
      surfaces.forEach(surface=>observer.observe(surface));
    }
  }

  class ProjectPreview {
    constructor(){
      this.preview=document.querySelector('[data-v12-project-preview]');
      this.image=this.preview?.querySelector('img');
      this.rows=[...document.querySelectorAll('[data-v12-project]')];
      if(this.image)this.image.removeAttribute('src');
      if(!fine||reduced||!this.preview||!this.image||!this.rows.length)return;
      this.x=innerWidth/2;this.y=innerHeight/2;this.tx=this.x;this.ty=this.y;this.raf=0;this.tracking=false;
      this.onMove=event=>{this.tx=event.clientX;this.ty=event.clientY;this.schedule()};
      this.rows.forEach(row=>{
        row.addEventListener('pointerenter',event=>this.show(row,event));
        row.addEventListener('pointerleave',()=>this.hide());
        row.addEventListener('focusin',()=>this.show(row));
        row.addEventListener('focusout',()=>this.hide());
      });
    }
    show(row,event){
      const src=row.dataset.preview;
      if(src&&this.image.getAttribute('src')!==src)this.image.src=src;
      this.preview.dataset.label=row.dataset.previewLabel||'VIEW';
      this.preview.classList.add('is-visible');
      if(event){this.tx=event.clientX;this.ty=event.clientY}
      if(!this.tracking){this.tracking=true;addEventListener('pointermove',this.onMove,{passive:true})}
      this.schedule();
    }
    hide(){
      this.preview.classList.remove('is-visible');
      if(this.tracking){this.tracking=false;removeEventListener('pointermove',this.onMove)}
    }
    schedule(){if(!this.raf)this.raf=requestAnimationFrame(()=>this.paint())}
    paint(){
      this.raf=0;
      this.x+=(this.tx-this.x)*.22;this.y+=(this.ty-this.y)*.22;
      const w=Math.min(496,innerWidth*.36);
      const x=clamp(18,this.x+28,innerWidth-w-18);
      const y=clamp(18,this.y-w/2.84,innerHeight-w/1.42-18);
      this.preview.style.setProperty('--preview-x',`${x.toFixed(2)}px`);
      this.preview.style.setProperty('--preview-y',`${y.toFixed(2)}px`);
      if(this.tracking&&(Math.abs(this.tx-this.x)>.2||Math.abs(this.ty-this.y)>.2))this.schedule();
    }
  }

  new IntroPerformanceGuard();
  startV12Reveal();
  new FloatingHeader();
  new FlipLinks();
  new CurtainReveal();
  new ProjectPreview();
})();
