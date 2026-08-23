(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (min, value, max) => Math.min(max, Math.max(min, value));
  const root = document.documentElement;
  const body = document.body;

  class ProgressiveBlur {
    constructor(){
      this.raf=0;
      addEventListener('scroll',()=>this.schedule(),{passive:true});
      this.schedule();
    }
    schedule(){if(!this.raf)this.raf=requestAnimationFrame(()=>this.paint());}
    paint(){
      this.raf=0;
      root.style.setProperty('--m6-blur',clamp(0,scrollY/220,1).toFixed(3));
    }
  }

  class ActiveNavIndicator {
    constructor(){
      this.navs=[...document.querySelectorAll('.site-nav nav,.plans-nav nav,.founder-nav nav')];
      if(!this.navs.length)return;
      this.raf=0;
      addEventListener('scroll',()=>this.schedule(),{passive:true});
      addEventListener('resize',()=>this.schedule(),{passive:true});
      document.addEventListener('pointerover',(event)=>{
        const nav=event.target.closest('.site-nav nav,.plans-nav nav,.founder-nav nav');
        const link=event.target.closest('a');
        if(nav&&link&&nav.contains(link))this.paint(nav,link);
      },{passive:true});
      document.addEventListener('pointerout',(event)=>{
        const nav=event.target.closest?.('.site-nav nav,.plans-nav nav,.founder-nav nav');
        if(nav&&!nav.contains(event.relatedTarget))this.schedule();
      },{passive:true});
      this.schedule();
    }
    schedule(){if(!this.raf)this.raf=requestAnimationFrame(()=>this.sync());}
    sync(){
      this.raf=0;
      this.navs.forEach(nav=>{
        const active=nav.querySelector('.is-current,[aria-current="page"],a.is-active');
        if(active)this.paint(nav,active);else nav.style.setProperty('--m6-nav-o','0');
      });
    }
    paint(nav,link){
      const nr=nav.getBoundingClientRect(),lr=link.getBoundingClientRect();
      nav.style.setProperty('--m6-nav-x',`${(lr.left-nr.left-8).toFixed(2)}px`);
      nav.style.setProperty('--m6-nav-w',`${(lr.width+16).toFixed(2)}px`);
      nav.style.setProperty('--m6-nav-o','1');
    }
  }

  class SpotlightSurfaces {
    constructor(){
      this.targets=[...document.querySelectorAll([
        '.capability-instrument','.pricing-mini','.build-card','.work__desktop','.work__mobile',
        '.principle-instrument','.scope-switch','.care-grid article','.terms-card'
      ].join(','))];
      this.targets.forEach(target=>{
        target.dataset.m6Spotlight='';
        if(!fine||reduced)return;
        let raf=0,x=.5,y=.5;
        const paint=()=>{
          raf=0;
          target.style.setProperty('--m6-sx',`${(x*100).toFixed(2)}%`);
          target.style.setProperty('--m6-sy',`${(y*100).toFixed(2)}%`);
        };
        target.addEventListener('pointermove',event=>{
          const r=target.getBoundingClientRect();
          x=clamp(0,(event.clientX-r.left)/Math.max(r.width,1),1);
          y=clamp(0,(event.clientY-r.top)/Math.max(r.height,1),1);
          if(!raf)raf=requestAnimationFrame(paint);
        },{passive:true});
      });
    }
  }

  class BorderTrails {
    constructor(){
      this.targets=[...document.querySelectorAll('.pricing-band__grid .pricing-mini:nth-child(2),.build-card.is-featured,.site-nav__cta,.primary-action,.close__action')];
      this.targets.forEach(target=>{
        target.dataset.m6Trail='';
        if(!target.querySelector(':scope > .m6-border-trail')){
          const trail=document.createElement('i');
          trail.className='m6-border-trail';
          trail.setAttribute('aria-hidden','true');
          target.append(trail);
        }
      });
      if(!('IntersectionObserver' in window)||reduced){this.targets.forEach(t=>t.classList.add('m6-trail-live'));return;}
      const observer=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('m6-trail-live',entry.isIntersecting)),{threshold:.25,rootMargin:'-8% 0px -8% 0px'});
      this.targets.forEach(t=>observer.observe(t));
    }
  }

  class ShineAndRipple {
    constructor(){
      const shineTargets=[...document.querySelectorAll('.primary-action,.site-nav__cta,.close__action,.plan-close__copy>a,.founder-close__copy a,.build-card>section>a')];
      shineTargets.forEach(control=>{
        control.dataset.m6Shine='';
        if(!control.querySelector(':scope > .m6-shine')){
          const shine=document.createElement('i');
          shine.className='m6-shine';
          shine.setAttribute('aria-hidden','true');
          control.append(shine);
        }
      });
      if(reduced)return;
      document.addEventListener('pointerdown',event=>{
        const control=event.target.closest('a,button');
        if(!control||!control.isConnected)return;
        const r=control.getBoundingClientRect();
        if(r.width>420||r.height>120||r.width<30||r.height<24)return;
        const dot=document.createElement('i');
        dot.className='m6-ripple';
        dot.style.left=`${event.clientX-r.left}px`;
        dot.style.top=`${event.clientY-r.top}px`;
        control.append(dot);
        dot.addEventListener('animationend',()=>dot.remove(),{once:true});
      },{passive:true});
    }
  }

  class ContextCursor {
    constructor(){
      if(!fine||reduced)return;
      this.cursor=document.querySelector('.m5-cursor');
      if(!this.cursor)return;
      const assign=(selector,label)=>document.querySelectorAll(selector).forEach(node=>node.dataset.cursorLabel=label);
      assign('.work__canvas','VIEW CASE');
      assign('.pricing-mini,.build-card','EXPLORE');
      assign('.founder-preview__portrait,.founder-hero__portrait','ABOUT');
      assign('.capability-instrument','MOVE');
      document.addEventListener('pointerover',event=>{
        const node=event.target.closest('[data-cursor-label]');
        const label=node?.dataset.cursorLabel||'';
        this.cursor.dataset.label=label;
        this.cursor.classList.toggle('has-label',Boolean(label));
      },{passive:true});
      document.addEventListener('pointerout',event=>{
        const node=event.target.closest?.('[data-cursor-label]');
        if(node&&!node.contains(event.relatedTarget)){
          this.cursor.dataset.label='';
          this.cursor.classList.remove('has-label');
        }
      },{passive:true});
    }
  }

  class CapabilityCrosshair {
    constructor(){
      this.visual=document.querySelector('.capability-instrument__visual');
      if(!this.visual)return;
      const cross=document.createElement('i');
      cross.className='m6-crosshair';
      cross.setAttribute('aria-hidden','true');
      this.visual.append(cross);
      if(!fine||reduced)return;
      this.visual.addEventListener('pointermove',event=>{
        const r=this.visual.getBoundingClientRect();
        this.visual.style.setProperty('--m6-cx',`${clamp(0,event.clientX-r.left,r.width).toFixed(1)}px`);
        this.visual.style.setProperty('--m6-cy',`${clamp(0,event.clientY-r.top,r.height).toFixed(1)}px`);
      },{passive:true});
    }
  }

  class PricingModeTransition {
    constructor(){
      this.root=document.querySelector('[data-plan-mode-director]');
      this.output=document.querySelector('[data-plan-mode-output]');
      if(!this.root||!this.output)return;
      const prepare=event=>{
        const button=event.target.closest('[data-plan-mode]');
        if(!button||button.classList.contains('is-active'))return;
        this.output.classList.remove('m6-entering');
        this.output.classList.add('m6-switching');
      };
      this.root.addEventListener('pointerdown',prepare,{passive:true});
      this.root.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key))prepare(event);});
      this.root.addEventListener('click',event=>{
        const button=event.target.closest('[data-plan-mode]');
        if(!button)return;
        setTimeout(()=>{
          this.output.classList.remove('m6-switching');
          this.output.classList.add('m6-entering');
          setTimeout(()=>this.output.classList.remove('m6-entering'),620);
        },80);
      });
    }
  }

  class WorkMorphDialog {
    constructor(){
      this.stage=document.querySelector('.work__canvas');
      if(!this.stage)return;
      this.trigger=document.createElement('button');
      this.trigger.type='button';
      this.trigger.className='m6-view-tag';
      this.trigger.textContent='OPEN CASE / ↗';
      this.trigger.setAttribute('aria-haspopup','dialog');
      this.stage.append(this.trigger);

      this.dialog=document.createElement('dialog');
      this.dialog.className='m6-case-dialog';
      this.dialog.setAttribute('aria-label','FakhriMart project preview');
      this.dialog.innerHTML=`
        <div class="m6-case-dialog__grid">
          <div class="m6-case-dialog__media"><img src="/assets/fakhrimart-case-desktop.png" width="1440" height="1000" alt="FakhriMart website case study preview"></div>
          <div class="m6-case-dialog__copy">
            <button class="m6-case-dialog__close" type="button" aria-label="Close project preview">×</button>
            <small>SELECTED WORK / FAKHRIMART</small>
            <h2>Built to make browsing feel obvious.</h2>
            <p>A catalogue-led yarn website where the interface, mobile hierarchy and enquiry path were shaped as one experience instead of separate pages.</p>
            <div class="m6-case-dialog__actions">
              <a href="https://fakhriyarns.vercel.app/" target="_blank" rel="noreferrer">Visit live website <span>↗</span></a>
              <button type="button" data-m6-dialog-close>Back to BRAYROAI</button>
            </div>
          </div>
        </div>`;
      body.append(this.dialog);
      this.trigger.addEventListener('click',()=>this.open());
      this.dialog.querySelectorAll('.m6-case-dialog__close,[data-m6-dialog-close]').forEach(button=>button.addEventListener('click',()=>this.dialog.close()));
      this.dialog.addEventListener('click',event=>{if(event.target===this.dialog)this.dialog.close();});
    }
    open(){if(typeof this.dialog.showModal==='function')this.dialog.showModal();}
  }

  class KeyHighlights {
    constructor(){
      document.querySelectorAll('.section-heading h2 em,.plan-heading h2 em,.founder-heading h2 em,.care__heading h2 em,.plans-hero__copy h1 em,.founder-hero__copy h1 em').forEach(node=>node.classList.add('m6-highlight'));
    }
  }

  new ProgressiveBlur();
  new ActiveNavIndicator();
  new SpotlightSurfaces();
  new BorderTrails();
  new ShineAndRipple();
  new ContextCursor();
  new CapabilityCrosshair();
  new PricingModeTransition();
  new WorkMorphDialog();
  new KeyHighlights();
})();
