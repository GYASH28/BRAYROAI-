(() => {
  'use strict';

  if (document.documentElement.dataset.v20PolishMounted) return;
  const path = location.pathname.replace(/\/$/,'') || '/';
  if (path !== '/' && !path.endsWith('/index.html')) return;

  const root = document.documentElement;
  const body = document.body;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const clamp = (min,value,max) => Math.min(max,Math.max(min,value));
  const clamp01 = value => clamp(0,value,1);
  const lerp = (a,b,t) => a + (b-a)*t;

  root.dataset.v20PolishMounted = 'true';
  body.classList.add('home-v20');

  const create = (tag,className,html='') => {
    const node=document.createElement(tag);
    node.className=className;
    if(html) node.innerHTML=html;
    return node;
  };

  class ComponentMounts {
    constructor(){
      this.mountHeroLens();
      this.mountHeroTextCycle();
      this.mountServicesSignal();
      this.mountSelectorIndicator();
      this.mountFilmGate();
      this.mountWorkAperture();
      this.mountAIPaths();
      this.mountPricingLights();
      this.mountFounderScan();
      this.mountContactLines();
      this.mountShineButtons();
      this.mountSceneRail();
    }

    mountHeroLens(){
      const stage=document.querySelector('.hero__stage');
      if(!stage||stage.querySelector('[data-v20-lens]'))return;
      const lens=create('div','v20-lens',`<i class="v20-lens__ring"></i><i class="v20-lens__axis"></i><i class="v20-lens__tick v20-lens__tick--a"></i><i class="v20-lens__tick v20-lens__tick--b"></i><i class="v20-lens__tick v20-lens__tick--c"></i><i class="v20-lens__tick v20-lens__tick--d"></i>`);
      lens.dataset.v20Lens='';lens.setAttribute('aria-hidden','true');stage.appendChild(lens);
    }

    mountHeroTextCycle(){
      const meta=document.querySelector('.v12-hero-meta');
      if(!meta||document.querySelector('[data-v20-text-cycle]'))return;
      const cycle=create('div','v20-text-cycle','<span>BUILT FOR</span><strong><i data-v20-cycle-word>BRANDS</i><b aria-hidden="true"></b></strong>');
      cycle.dataset.v20TextCycle='';cycle.setAttribute('aria-hidden','true');meta.after(cycle);
    }

    mountServicesSignal(){
      const canvas=document.querySelector('#services .play-scene__canvas');
      if(!canvas||canvas.querySelector('[data-v20-signal]'))return;
      const field=create('div','v20-signal-field','<i class="v20-signal-field__orbit"></i><i class="v20-signal-field__orbit"></i><i class="v20-signal-field__orbit"></i>');
      field.dataset.v20Signal='';field.setAttribute('aria-hidden','true');canvas.prepend(field);
    }

    mountSelectorIndicator(){
      const controls=document.querySelector('#services .play-scene__controls');
      if(!controls||controls.querySelector('[data-v20-selector]'))return;
      const indicator=create('i','v20-selector-indicator');
      indicator.dataset.v20Selector='';indicator.setAttribute('aria-hidden','true');controls.prepend(indicator);
    }

    mountFilmGate(){
      const stage=document.querySelector('.editorial-sequence__stage');
      if(!stage||stage.querySelector('[data-v20-film-gate]'))return;
      const gate=create('div','v20-film-gate');gate.dataset.v20FilmGate='';gate.setAttribute('aria-hidden','true');stage.appendChild(gate);
    }

    mountWorkAperture(){
      const canvas=document.querySelector('#work .work__canvas');
      if(!canvas||canvas.querySelector('[data-v20-aperture]'))return;
      const aperture=create('div','v20-aperture','<i></i><i></i><i></i><i></i>');aperture.dataset.v20Aperture='';aperture.setAttribute('aria-hidden','true');canvas.appendChild(aperture);
    }

    mountAIPaths(){
      document.querySelectorAll('#ai-systems .v12-product-card').forEach(card=>{
        if(card.querySelector('[data-v20-data-path]'))return;
        const path=create('div','v20-data-path','<i></i><i></i><i></i>');path.dataset.v20DataPath='';path.setAttribute('aria-hidden','true');card.appendChild(path);
      });
    }

    mountPricingLights(){
      document.querySelectorAll('#plans [data-v14-rate]').forEach(rate=>{
        if(rate.querySelector('[data-v20-rate-light]'))return;
        const light=create('i','v20-rate-light');light.dataset.v20RateLight='';light.setAttribute('aria-hidden','true');rate.appendChild(light);
      });
    }

    mountFounderScan(){
      const portrait=document.querySelector('#studio .founder-preview__portrait');
      if(!portrait||portrait.querySelector('[data-v20-portrait-scan]'))return;
      const scan=create('i','v20-portrait-scan');scan.dataset.v20PortraitScan='';scan.setAttribute('aria-hidden','true');portrait.appendChild(scan);
    }

    mountContactLines(){
      const contact=document.querySelector('#contact');
      if(!contact||contact.querySelector('[data-v20-lines]'))return;
      const lines=create('div','v20-background-lines','<i></i><i></i><i></i><i></i><i></i><i></i>');
      lines.dataset.v20Lines='';lines.setAttribute('aria-hidden','true');contact.prepend(lines);
    }

    mountShineButtons(){
      document.querySelectorAll('.primary-action.magnetic,.close__action.magnetic').forEach(button=>{
        if(button.querySelector('[data-v20-button-shine]'))return;
        button.classList.add('v20-shine-button');
        const shine=create('i','v20-button-shine');shine.dataset.v20ButtonShine='';shine.setAttribute('aria-hidden','true');button.appendChild(shine);
      });
    }

    mountSceneRail(){
      if(document.querySelector('[data-v20-scene-rail]'))return;
      const labels=['OPEN','CAPABILITIES','PROCESS','WORK','AI','PRICING','FOUNDER','CONTACT'];
      const rail=create('div','v20-scene-rail');rail.dataset.v20SceneRail='';rail.setAttribute('aria-hidden','true');
      rail.innerHTML=`<span class="v20-scene-rail__label" data-v20-rail-label>${labels[0]}</span><div class="v20-scene-rail__track"><i class="v20-scene-rail__progress"></i>${labels.map((_,i)=>`<b class="v20-scene-rail__dot${i===0?' is-active':''}" data-v20-rail-dot="${i}"></b>`).join('')}</div>`;
      body.appendChild(rail);
    }
  }

  class HeroTextCycle {
    constructor(){
      this.word=document.querySelector('[data-v20-cycle-word]');
      this.hero=document.querySelector('#top');
      this.words=['BRANDS','PRODUCTS','TEAMS','SYSTEMS'];
      this.index=0;
      this.timer=0;
      this.visible=true;
      if(!this.word||reduced)return;
      if('IntersectionObserver' in window&&this.hero){
        this.observer=new IntersectionObserver(entries=>{
          this.visible=!!entries[0]?.isIntersecting;
          clearTimeout(this.timer);
          if(this.visible&&!document.hidden)this.schedule();
        },{rootMargin:'20% 0px',threshold:0});
        this.observer.observe(this.hero);
      }
      this.schedule();
      document.addEventListener('visibilitychange',()=>{clearTimeout(this.timer);if(!document.hidden&&this.visible)this.schedule()});
    }
    schedule(){if(this.visible&&!document.hidden)this.timer=setTimeout(()=>this.next(),2600)}
    next(){
      if(document.hidden||!this.visible)return;
      const out=this.word.animate([{opacity:1,transform:'translate3d(0,0,0)'},{opacity:0,transform:'translate3d(0,-70%,0)'}],{duration:260,easing:'cubic-bezier(.4,0,1,1)'});
      out.onfinish=()=>{
        this.index=(this.index+1)%this.words.length;
        this.word.textContent=this.words[this.index];
        this.word.animate([{opacity:0,transform:'translate3d(0,75%,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],{duration:560,easing:'cubic-bezier(.16,1,.3,1)'});
        this.schedule();
      };
    }
  }

  class SelectorDirector {
    constructor(){
      this.root=document.querySelector('#services .play-scene__controls');
      this.indicator=this.root?.querySelector('[data-v20-selector]');
      this.controls=this.root?[...this.root.querySelectorAll('[data-v15-control]')]:[];
      this.frame=0;
      if(!this.root||!this.indicator||!this.controls.length)return;
      const schedule=()=>this.schedule();
      this.controls.forEach(control=>{
        control.addEventListener('click',schedule);
        control.addEventListener('focus',schedule);
        control.addEventListener('pointerenter',schedule);
      });
      this.observer=new MutationObserver(schedule);
      this.controls.forEach(control=>this.observer.observe(control,{attributes:true,attributeFilter:['class','aria-selected']}));
      addEventListener('resize',schedule,{passive:true});
      this.schedule();
    }
    schedule(){if(!this.frame)this.frame=requestAnimationFrame(()=>this.paint())}
    paint(){
      this.frame=0;
      const active=this.controls.find(control=>control.classList.contains('is-active'))||this.controls[0];
      if(!active)return;
      this.root.style.setProperty('--v20-select-x',`${active.offsetLeft}px`);
      this.root.style.setProperty('--v20-select-y',`${active.offsetTop}px`);
      this.root.style.setProperty('--v20-select-w',`${active.offsetWidth}px`);
      this.root.style.setProperty('--v20-select-h',`${active.offsetHeight}px`);
    }
  }

  class PointerPolish {
    constructor(){
      this.frame=0;
      this.spotlights=[];
      this.magnets=[];
      if(!fine||reduced)return;
      this.spotlights=[...document.querySelectorAll('#work .work__canvas,#ai-systems .v12-product-card,#plans [data-v14-rate],#studio .founder-preview__portrait')].map(node=>({node,rect:null,x:50,y:50,tx:50,ty:50,o:0,to:0}));
      this.magnets=[...document.querySelectorAll('.primary-action.magnetic,.site-nav__cta.magnetic,.text-link.magnetic,.close__action.magnetic')].map(node=>({node,rect:null,x:0,y:0,tx:0,ty:0}));
      this.bindSpotlights();this.bindMagnets();
      addEventListener('resize',()=>this.invalidateRects(),{passive:true});
      addEventListener('scroll',()=>this.invalidateRects(),{passive:true});
    }
    invalidateRects(){this.spotlights.forEach(record=>record.rect=null);this.magnets.forEach(record=>record.rect=null)}
    local(event,record){
      const rect=record.rect||(record.rect=record.node.getBoundingClientRect());
      return {nx:rect.width?((event.clientX-rect.left)/rect.width-.5)*2:0,ny:rect.height?((event.clientY-rect.top)/rect.height-.5)*2:0,px:rect.width?((event.clientX-rect.left)/rect.width)*100:50,py:rect.height?((event.clientY-rect.top)/rect.height)*100:50};
    }
    schedule(){if(!this.frame)this.frame=requestAnimationFrame(()=>this.tick())}
    bindSpotlights(){
      this.spotlights.forEach(record=>{
        const {node}=record;
        node.addEventListener('pointerenter',event=>{record.rect=node.getBoundingClientRect();const p=this.local(event,record);record.tx=p.px;record.ty=p.py;record.to=1;this.schedule()});
        node.addEventListener('pointermove',event=>{const p=this.local(event,record);record.tx=p.px;record.ty=p.py;record.to=1;this.schedule()},{passive:true});
        node.addEventListener('pointerleave',()=>{record.rect=null;record.tx=50;record.ty=50;record.to=0;this.schedule()});
      });
    }
    bindMagnets(){
      this.magnets.forEach(record=>{
        const {node}=record;
        node.addEventListener('pointerenter',()=>{record.rect=node.getBoundingClientRect()});
        node.addEventListener('pointermove',event=>{const p=this.local(event,record);record.tx=p.nx*5.5;record.ty=p.ny*4.5;this.schedule()},{passive:true});
        node.addEventListener('pointerleave',()=>{record.rect=null;record.tx=0;record.ty=0;this.schedule()});
      });
    }
    tick(){
      this.frame=0;
      let delta=0;
      this.spotlights.forEach(record=>{
        record.x=lerp(record.x,record.tx,.2);record.y=lerp(record.y,record.ty,.2);record.o=lerp(record.o,record.to,.24);
        record.node.style.setProperty('--v20-local-x',`${record.x.toFixed(2)}%`);record.node.style.setProperty('--v20-local-y',`${record.y.toFixed(2)}%`);record.node.style.setProperty('--v20-spot-o',record.o.toFixed(4));
        delta+=Math.abs(record.tx-record.x)+Math.abs(record.ty-record.y)+Math.abs(record.to-record.o)*12;
      });
      this.magnets.forEach(record=>{
        record.x=lerp(record.x,record.tx,.22);record.y=lerp(record.y,record.ty,.22);
        record.node.style.setProperty('--v20-mag-x',`${record.x.toFixed(2)}px`);record.node.style.setProperty('--v20-mag-y',`${record.y.toFixed(2)}px`);
        delta+=Math.abs(record.tx-record.x)+Math.abs(record.ty-record.y);
      });
      if(delta>.08)this.schedule();
    }
  }

  class PolishDirector {
    constructor(){
      this.scenes=[...document.querySelectorAll('main [data-scene]')];
      this.labels=['OPEN','CAPABILITIES','PROCESS','WORK','AI','PRICING','FOUNDER','CONTACT'];
      this.railLabel=document.querySelector('[data-v20-rail-label]');
      this.railDots=[...document.querySelectorAll('[data-v20-rail-dot]')];
      this.active=-1;this.frame=0;this.pointerX=.5;this.pointerY=.5;this.pointerTargetX=.5;this.pointerTargetY=.5;
      this.pageCurrent=0;this.filmCurrent=.5;this.founderCurrent=.5;
      this.vh=innerHeight;this.metrics=new Map();
      this.refreshMetrics();
      this.bind();this.schedule(true);
    }
    refreshMetrics(){
      this.vh=innerHeight;
      const y=scrollY;
      this.scenes.forEach(scene=>{const rect=scene.getBoundingClientRect();this.metrics.set(scene,{top:rect.top+y,height:rect.height})});
    }
    bind(){
      addEventListener('scroll',()=>this.schedule(),{passive:true});
      addEventListener('resize',()=>{this.refreshMetrics();this.schedule(true)},{passive:true});
      addEventListener('pageshow',()=>{this.refreshMetrics();this.schedule(true)},{passive:true});
      document.fonts?.ready?.then(()=>{this.refreshMetrics();this.schedule(true)});
      if(fine&&!reduced)addEventListener('pointermove',event=>{this.pointerTargetX=clamp01(event.clientX/Math.max(innerWidth,1));this.pointerTargetY=clamp01(event.clientY/Math.max(innerHeight,1));this.schedule()},{passive:true});
    }
    schedule(force=false){if(force)this.force=true;if(!this.frame)this.frame=requestAnimationFrame(()=>this.tick())}
    sceneProgress(node){const metric=this.metrics.get(node);if(!metric)return .5;const top=metric.top-scrollY;return clamp01((this.vh-top)/Math.max(metric.height+this.vh,1))}
    updateRail(force){
      const maxScroll=Math.max(document.documentElement.scrollHeight-this.vh,1);const target=clamp01(scrollY/maxScroll);this.pageCurrent=lerp(this.pageCurrent,target,reduced||force?1:.16);root.style.setProperty('--v20-page',this.pageCurrent.toFixed(5));
      const center=scrollY+this.vh*.5;let best=0,distance=Infinity;
      this.scenes.forEach((scene,index)=>{const metric=this.metrics.get(scene);if(!metric)return;const d=Math.abs(metric.top+metric.height*.5-center);if(d<distance){distance=d;best=index}});
      if(best!==this.active){
        this.active=best;body.dataset.v20Scene=this.scenes[best]?.dataset.scene||String(best);
        if(this.railLabel){this.railLabel.textContent=this.labels[best]||`SCENE ${best+1}`;if(!reduced)this.railLabel.animate([{opacity:.15,transform:'translate3d(0,5px,0)'},{opacity:.76,transform:'translate3d(0,0,0)'}],{duration:360,easing:'cubic-bezier(.16,1,.3,1)'})}
        this.railDots.forEach((dot,index)=>dot.classList.toggle('is-active',index===best));
      }
      return Math.abs(target-this.pageCurrent);
    }
    updateHero(){
      const hero=document.querySelector('#top');if(!hero)return;
      const p=this.sceneProgress(hero),phase=(p-.5)*2,speed=parseFloat(root.style.getPropertyValue('--v19-speed'))||0,px=(this.pointerX-.5)*12,py=(this.pointerY-.5)*9;
      hero.style.setProperty('--v20-lens-x',`${(px+phase*4).toFixed(2)}px`);hero.style.setProperty('--v20-lens-y',`${(py+phase*-7).toFixed(2)}px`);hero.style.setProperty('--v20-lens-scale',(1.01+Math.abs(phase)*.025+speed*.012).toFixed(5));hero.style.setProperty('--v20-lens-o',(0.23+Math.max(0,1-Math.abs(phase))*.18).toFixed(4));
    }
    updateFilm(force){
      const film=document.querySelector('.editorial-sequence');if(!film)return 0;
      const target=this.sceneProgress(film);this.filmCurrent=lerp(this.filmCurrent,target,reduced||force?1:.15);film.style.setProperty('--v20-film-scan',`${(10+this.filmCurrent*80).toFixed(2)}%`);return Math.abs(target-this.filmCurrent);
    }
    updateFounder(force){
      const founder=document.querySelector('#studio');if(!founder)return 0;
      const target=this.sceneProgress(founder);this.founderCurrent=lerp(this.founderCurrent,target,reduced||force?1:.15);founder.style.setProperty('--v20-founder-scan',`${(14+this.founderCurrent*72).toFixed(2)}%`);return Math.abs(target-this.founderCurrent);
    }
    tick(){
      this.frame=0;const force=!!this.force;this.force=false;const rate=reduced||force?1:.18;
      this.pointerX=lerp(this.pointerX,this.pointerTargetX,rate);this.pointerY=lerp(this.pointerY,this.pointerTargetY,rate);
      let unsettled=this.updateRail(force)+this.updateFilm(force)+this.updateFounder(force);this.updateHero();
      unsettled+=Math.abs(this.pointerX-this.pointerTargetX)+Math.abs(this.pointerY-this.pointerTargetY);
      if(!reduced&&unsettled>.0035)this.schedule();
    }
  }

  new ComponentMounts();
  new HeroTextCycle();
  new SelectorDirector();
  new PointerPolish();
  new PolishDirector();
})();