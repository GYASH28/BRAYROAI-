(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (min, value, max) => Math.min(max, Math.max(min, value));
  const root = document.documentElement;
  const body = document.body;

  // V12 owns the homepage interaction architecture. Keep V5 available for
  // Plans / Founder / Terms, but do not let its legacy V6→V11 chain mutate
  // the V12 capability story or project showcase after load.
  if (document.querySelector('.v12-capabilities')) {
    body.classList.add('v12-runtime-isolated');
    return;
  }

  const mountMotionV6 = () => {
    if (mountMotionV6.done) return;
    mountMotionV6.done = true;
    if (!document.querySelector('link[data-motion-v6]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/motion-v6.css';
      link.dataset.motionV6 = '';
      document.head.append(link);
    }
    if (!document.querySelector('script[data-motion-v6]')) {
      const script = document.createElement('script');
      script.src = '/motion-v6.js';
      script.defer = true;
      script.dataset.motionV6 = '';
      document.body.append(script);
    }
  };

  const mountEnhancedLayers = () => {
    const schedule = () => {
      if ('requestIdleCallback' in window) requestIdleCallback(mountMotionV6, { timeout: 450 });
      else setTimeout(mountMotionV6, 90);
    };
    if (!body.classList.contains('hf-intro-active')) return schedule();
    const observer = new MutationObserver(() => {
      if (body.classList.contains('hf-intro-active')) return;
      observer.disconnect();
      schedule();
    });
    observer.observe(body, { attributes:true, attributeFilter:['class'] });
    addEventListener('pagehide', () => observer.disconnect(), { once:true });
  };
  mountEnhancedLayers();

  class MicroCursor {
    constructor() {
      if (!fine || reduced) return;
      this.cursor = document.createElement('i');
      this.cursor.className = 'm5-cursor';
      this.cursor.setAttribute('aria-hidden','true');
      document.body.append(this.cursor);
      addEventListener('pointermove', (event) => {
        root.style.setProperty('--m5-cx', `${event.clientX}px`);
        root.style.setProperty('--m5-cy', `${event.clientY}px`);
      }, { passive:true });
      document.addEventListener('pointerover', (event) => {
        this.cursor.classList.toggle('is-link', Boolean(event.target.closest('a,button,[role="button"]')));
      }, { passive:true });
    }
  }

  class ScrollReadingLine {
    constructor() {
      if (reduced) return;
      this.line = document.createElement('i');
      this.line.className = 'm5-reading-line';
      this.line.setAttribute('aria-hidden','true');
      document.body.append(this.line);
      this.raf = 0;
      addEventListener('scroll', () => this.schedule(), { passive:true });
      addEventListener('resize', () => this.schedule(), { passive:true });
      this.schedule();
    }
    schedule() { if (!this.raf) this.raf = requestAnimationFrame(() => this.paint()); }
    paint() {
      this.raf = 0;
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      root.style.setProperty('--m5-read', clamp(.08, scrollY / max, 1).toFixed(4));
    }
  }

  class SectionMicroDirector {
    constructor() {
      this.sections = [...document.querySelectorAll('.scene,.plan-scene,.founder-scene,.terms-section')];
      this.sections.forEach((section,index) => {
        section.dataset.m5Section = '';
        if (!section.querySelector(':scope > .m5-section-index') && !section.classList.contains('hero') && !section.classList.contains('plans-hero') && !section.classList.contains('founder-hero')) {
          const indexNode = document.createElement('span');
          indexNode.className = 'm5-section-index';
          indexNode.textContent = String(index + 1).padStart(2,'0');
          indexNode.setAttribute('aria-hidden','true');
          section.prepend(indexNode);
        }
      });
      this.raf = 0;
      addEventListener('scroll', () => this.schedule(), { passive:true });
      addEventListener('resize', () => this.schedule(), { passive:true });
      this.schedule();
    }
    schedule(){ if (!this.raf) this.raf=requestAnimationFrame(() => this.paint()); }
    paint(){
      this.raf=0;
      for (const section of this.sections) {
        const rect=section.getBoundingClientRect();
        if (rect.bottom<0 || rect.top>innerHeight) continue;
        const p=clamp(0,(innerHeight-rect.top)/(innerHeight+rect.height),1);
        section.style.setProperty('--m5-local',p.toFixed(4));
      }
    }
  }

  class TextDetails {
    constructor() {
      document.querySelectorAll('a span:last-child,button span:last-child').forEach((node) => {
        const text=node.textContent.trim();
        if (['↗','↘','→','←'].includes(text)) node.classList.add('m5-link-arrow');
      });
    }
  }

  class PricingModeDirector {
    constructor(){
      this.root=document.querySelector('[data-plan-mode-director]');
      this.buttons=[...document.querySelectorAll('[data-plan-mode]')];
      this.output=document.querySelector('[data-plan-mode-output]');
      if(!this.root || !this.buttons.length) return;
      this.states={
        monthly:['MONTHLY / ONGOING PARTNERSHIP','Monthly Growth','₹3,999/mo','Continuous website improvement, content changes and design or conversion refinement without starting a new project each time.','#monthly'],
        onetime:['ONE-TIME / COMPLETE BUILD','Business Experience','₹17,999','A complete business website project with strategy, design, development, responsive refinement and launch as one scoped engagement.','#builds']
      };
      this.buttons.forEach(button=>button.addEventListener('click',()=>this.select(button.dataset.planMode)));
      this.select(this.root.dataset.defaultMode || 'onetime');
    }
    select(key){
      const state=this.states[key]; if(!state) return;
      this.root.dataset.mode=key;
      this.root.setAttribute('data-sc-verify-state',`mode:${key}`);
      this.buttons.forEach(button=>{const active=button.dataset.planMode===key;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active));});
      if(this.output){
        const small=this.output.querySelector('small');const title=this.output.querySelector('h2');const strong=this.output.querySelector('strong');const p=this.output.querySelector('p');const a=this.output.querySelector('a');
        if(small) small.textContent=state[0]; if(title) title.textContent=state[1]; if(strong) strong.textContent=state[2]; if(p) p.textContent=state[3]; if(a) a.href=state[4];
      }
    }
  }

  class HoverVelocity {
    constructor(){
      if(!fine || reduced) return;
      document.querySelectorAll('.pricing-mini,.build-card,.care-grid article,.compare-table>div,.terms-card').forEach(card=>{
        let lastX=0,lastY=0,lastT=performance.now();
        card.addEventListener('pointermove',event=>{
          const now=performance.now();const dt=Math.max(16,now-lastT);const vx=(event.clientX-lastX)/dt;const vy=(event.clientY-lastY)/dt;
          card.style.setProperty('--m5-vx',clamp(-1,vx/1.4,1).toFixed(3));
          card.style.setProperty('--m5-vy',clamp(-1,vy/1.4,1).toFixed(3));
          lastX=event.clientX;lastY=event.clientY;lastT=now;
        },{passive:true});
      });
    }
  }

  new MicroCursor();
  new ScrollReadingLine();
  new SectionMicroDirector();
  new TextDetails();
  new PricingModeDirector();
  new HoverVelocity();
})();