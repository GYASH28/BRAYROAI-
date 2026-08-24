(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine=matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp=(min,value,max)=>Math.min(max,Math.max(min,value));
  const body=document.body;
  const root=document.documentElement;
  body.classList.add('v10-ready');

  class PageTransitionsV10{
    constructor(){
      if(reduced)return;
      document.addEventListener('click',event=>{
        const link=event.target.closest('a[href]');
        if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
        const href=link.getAttribute('href');
        if(!href||href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('tel:')||link.target==='_blank'||link.hasAttribute('download'))return;
        let url;
        try{url=new URL(link.href,location.href)}catch{return}
        if(url.origin!==location.origin||url.pathname===location.pathname&&url.hash)return;
        if('startViewTransition' in document)return;
        event.preventDefault();
        body.classList.add('v10-leaving');
        setTimeout(()=>location.href=url.href,310);
      });
      addEventListener('pageshow',()=>body.classList.remove('v10-leaving'));
    }
  }

  class AtmosphereV10{
    constructor(){
      this.sections=[...document.querySelectorAll('.scene,.plan-scene,.founder-scene')];
      if(!this.sections.length)return;
      this.raf=0;this.lastY=scrollY;this.velocity=0;
      addEventListener('scroll',()=>this.schedule(),{passive:true});
      addEventListener('resize',()=>this.schedule(),{passive:true});
      if(fine)addEventListener('pointermove',event=>{root.style.setProperty('--v10-pointer-x',`${event.clientX}px`);root.style.setProperty('--v10-pointer-y',`${event.clientY}px`)},{passive:true});
      this.schedule();
    }
    schedule(){if(!this.raf)this.raf=requestAnimationFrame(()=>this.paint())}
    paint(){
      this.raf=0;
      const total=Math.max(1,document.documentElement.scrollHeight-innerHeight);
      root.style.setProperty('--v10-page-p',clamp(0,scrollY/total,1).toFixed(4));
      let active=null,best=Infinity;
      this.sections.forEach((section,index)=>{
        const r=section.getBoundingClientRect();
        const center=Math.abs((r.top+r.height*.5)-innerHeight*.5);
        const edge=clamp(0,1-Math.abs(r.top)/Math.max(innerHeight*.9,1),1);
        section.style.setProperty('--v10-edge',edge.toFixed(3));
        if(r.bottom>0&&r.top<innerHeight&&center<best){active=section;best=center;body.style.setProperty('--v10-current',String(index))}
      });
      const tone=active?this.toneFor(active):0;
      root.style.setProperty('--v10-scene-tone',tone.toFixed(3));
      const delta=scrollY-this.lastY;
      this.velocity=this.velocity*.76+clamp(-1,delta/46,1)*.24;
      body.classList.toggle('v10-scroll-fast',Math.abs(this.velocity)>.22);
      this.lastY=scrollY;
    }
    toneFor(section){
      if(section.classList.contains('film')||section.classList.contains('founder-preview'))return .15;
      if(section.classList.contains('work'))return .72;
      if(section.classList.contains('plans-preview')||section.classList.contains('plans'))return .35;
      if(section.classList.contains('contact')||section.classList.contains('close'))return .55;
      return .24;
    }
  }

  class KeyboardGroupsV10{
    constructor(){
      this.bind('[data-capability-stage]','[data-capability]');
      this.bind('[data-work-stage]','[data-v8-work-mode]');
      this.bind('[data-plan-mode-stage]','[data-plan-mode]');
    }
    bind(stageSelector,buttonSelector){
      const stage=document.querySelector(stageSelector);
      if(!stage)return;
      let buttons=[...stage.querySelectorAll(buttonSelector)];
      if(!buttons.length&&stageSelector==='[data-work-stage]')buttons=[...document.querySelectorAll(buttonSelector)];
      if(buttons.length<2)return;
      stage.addEventListener('focusin',()=>stage.classList.add('v10-keyboard-live'));
      stage.addEventListener('focusout',event=>{if(!stage.contains(event.relatedTarget))stage.classList.remove('v10-keyboard-live')});
      buttons.forEach(button=>button.addEventListener('keydown',event=>{
        if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;
        event.preventDefault();
        const horizontal=['ArrowLeft','ArrowRight'].includes(event.key);
        const direction=(event.key==='ArrowRight'||event.key==='ArrowDown')?1:-1;
        const current=buttons.indexOf(button);
        const next=buttons[(current+direction+buttons.length)%buttons.length];
        next.focus();next.click();
        if(horizontal)stage.classList.add('v10-keyboard-live');
      }));
      if(!stage.querySelector('.v10-keyboard-hint')&&stageSelector==='[data-capability-stage]'){
        const hint=document.createElement('div');
        hint.className='v10-keyboard-hint';hint.setAttribute('aria-hidden','true');
        hint.innerHTML='<kbd>←</kbd><kbd>→</kbd><span>switch discipline</span>';
        const copy=stage.querySelector('.capability-instrument__copy');
        copy?.append(hint);
      }
    }
  }

  class PricingFocusV10{
    constructor(){
      document.querySelectorAll('.pricing-band__grid,.build-grid').forEach(grid=>{
        const cards=[...grid.querySelectorAll('.pricing-mini,.build-card')];
        if(cards.length<2)return;
        const position=card=>{
          const r=grid.getBoundingClientRect(),c=card.getBoundingClientRect();
          const x=clamp(0,((c.left+c.width*.5)-r.left)/Math.max(r.width,1),1)*100;
          grid.style.setProperty('--v10-focus-x',`${x.toFixed(2)}%`);
        };
        cards.forEach(card=>{
          card.addEventListener('pointerenter',()=>{position(card);grid.classList.add('v10-focus-live')});
          card.addEventListener('focusin',()=>{position(card);grid.classList.add('v10-focus-live')});
        });
        grid.addEventListener('pointerleave',()=>grid.classList.remove('v10-focus-live'));
        grid.addEventListener('focusout',event=>{if(!grid.contains(event.relatedTarget))grid.classList.remove('v10-focus-live')});
      });
    }
  }

  class MobileSnapV10{
    constructor(){
      if(innerWidth>760)return;
      document.querySelectorAll('.pricing-band__grid,.build-grid').forEach(grid=>this.mount(grid));
    }
    mount(grid){
      const cards=[...grid.querySelectorAll('.pricing-mini,.build-card')];
      if(cards.length<2||grid.nextElementSibling?.classList.contains('v10-snap-status'))return;
      const status=document.createElement('div');status.className='v10-snap-status';status.setAttribute('aria-hidden','true');
      cards.forEach((_,index)=>{const dot=document.createElement('i');if(index===0)dot.classList.add('is-active');status.append(dot)});
      grid.after(status);
      let raf=0;
      const paint=()=>{
        raf=0;const center=grid.scrollLeft+grid.clientWidth*.5;let active=0,best=Infinity;
        cards.forEach((card,index)=>{const c=card.offsetLeft+card.offsetWidth*.5,d=Math.abs(c-center);if(d<best){best=d;active=index}});
        [...status.children].forEach((dot,index)=>dot.classList.toggle('is-active',index===active));
      };
      grid.addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(paint)},{passive:true});paint();
    }
  }

  class PressFeedbackV10{
    constructor(){
      document.querySelectorAll('a,button').forEach(node=>{
        node.classList.add('v10-pressable');
        node.addEventListener('pointerdown',event=>{
          const r=node.getBoundingClientRect();
          node.style.setProperty('--v10-click-x',`${clamp(0,(event.clientX-r.left)/Math.max(r.width,1),1)*100}%`);
          node.style.setProperty('--v10-click-y',`${clamp(0,(event.clientY-r.top)/Math.max(r.height,1),1)*100}%`);
          node.classList.add('v10-hit');
        });
        ['pointerup','pointercancel','pointerleave'].forEach(type=>node.addEventListener(type,()=>node.classList.remove('v10-hit')));
      });
    }
  }

  class PrefetchV10{
    constructor(){
      const seen=new Set();
      document.querySelectorAll('a[href]').forEach(link=>{
        const href=link.getAttribute('href');
        if(!href||href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('tel:'))return;
        let url;try{url=new URL(link.href,location.href)}catch{return}
        if(url.origin!==location.origin||seen.has(url.pathname))return;
        const warm=()=>{if(seen.has(url.pathname))return;seen.add(url.pathname);const p=document.createElement('link');p.rel='prefetch';p.href=url.pathname;document.head.append(p)};
        link.addEventListener('pointerenter',warm,{once:true,passive:true});
        link.addEventListener('focus',warm,{once:true});
      });
    }
  }

  new PageTransitionsV10();
  new AtmosphereV10();
  new KeyboardGroupsV10();
  new PricingFocusV10();
  new MobileSnapV10();
  new PressFeedbackV10();
  new PrefetchV10();
})();
