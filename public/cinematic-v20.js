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
      this.mountServicesSignal();
      this.mountFilmGate();
      this.mountWorkAperture();
      this.mountAIPaths();
      this.mountFounderScan();
      this.mountSceneRail();
    }

    mountHeroLens(){
      const stage=document.querySelector('.hero__stage');
      if(!stage||stage.querySelector('[data-v20-lens]'))return;
      const lens=create('div','v20-lens',`
        <i class="v20-lens__ring"></i>
        <i class="v20-lens__axis"></i>
        <i class="v20-lens__tick v20-lens__tick--a"></i>
        <i class="v20-lens__tick v20-lens__tick--b"></i>
        <i class="v20-lens__tick v20-lens__tick--c"></i>
        <i class="v20-lens__tick v20-lens__tick--d"></i>`);
      lens.dataset.v20Lens='';
      lens.setAttribute('aria-hidden','true');
      stage.appendChild(lens);
    }

    mountServicesSignal(){
      const canvas=document.querySelector('#services .play-scene__canvas');
      if(!canvas||canvas.querySelector('[data-v20-signal]'))return;
      const field=create('div','v20-signal-field','<i class="v20-signal-field__orbit"></i><i class="v20-signal-field__orbit"></i><i class="v20-signal-field__orbit"></i>');
      field.dataset.v20Signal='';
      field.setAttribute('aria-hidden','true');
      canvas.prepend(field);
    }

    mountFilmGate(){
      const stage=document.querySelector('.editorial-sequence__stage');
      if(!stage||stage.querySelector('[data-v20-film-gate]'))return;
      const gate=create('div','v20-film-gate');
      gate.dataset.v20FilmGate='';
      gate.setAttribute('aria-hidden','true');
      stage.appendChild(gate);
    }

    mountWorkAperture(){
      const canvas=document.querySelector('#work .work__canvas');
      if(!canvas||canvas.querySelector('[data-v20-aperture]'))return;
      const aperture=create('div','v20-aperture','<i></i><i></i><i></i><i></i>');
      aperture.dataset.v20Aperture='';
      aperture.setAttribute('aria-hidden','true');
      canvas.appendChild(aperture);
    }

    mountAIPaths(){
      document.querySelectorAll('#ai-systems .v12-product-card').forEach(card=>{
        if(card.querySelector('[data-v20-data-path]'))return;
        const path=create('div','v20-data-path','<i></i><i></i><i></i>');
        path.dataset.v20DataPath='';
        path.setAttribute('aria-hidden','true');
        card.appendChild(path);
      });
    }

    mountFounderScan(){
      const portrait=document.querySelector('#studio .founder-preview__portrait');
      if(!portrait||portrait.querySelector('[data-v20-portrait-scan]'))return;
      const scan=create('i','v20-portrait-scan');
      scan.dataset.v20PortraitScan='';
      scan.setAttribute('aria-hidden','true');
      portrait.appendChild(scan);
    }

    mountSceneRail(){
      if(document.querySelector('[data-v20-scene-rail]'))return;
      const labels=['OPEN','CAPABILITIES','PROCESS','WORK','AI','PRICING','FOUNDER','CONTACT'];
      const rail=create('div','v20-scene-rail');
      rail.dataset.v20SceneRail='';
      rail.setAttribute('aria-hidden','true');
      rail.innerHTML=`<span class="v20-scene-rail__label" data-v20-rail-label>${labels[0]}</span><div class="v20-scene-rail__track"><i class="v20-scene-rail__progress"></i>${labels.map((_,i)=>`<b class="v20-scene-rail__dot${i===0?' is-active':''}" data-v20-rail-dot="${i}"></b>`).join('')}</div>`;
      body.appendChild(rail);
    }
  }

  class PointerPolish {
    constructor(){
      if(!fine||reduced)return;
      this.spotlights=[...document.querySelectorAll('#work .work__canvas,#ai-systems .v12-product-card,#plans [data-v14-rate],#studio .founder-preview__portrait')];
      this.magnets=[...document.querySelectorAll('.primary-action.magnetic,.site-nav__cta.magnetic,.text-link.magnetic')];
      this.bindSpotlights();
      this.bindMagnets();
    }

    local(event,node){
      const rect=node.getBoundingClientRect();
      return {
        x:clamp(0,event.clientX-rect.left,rect.width),
        y:clamp(0,event.clientY-rect.top,rect.height),
        nx:rect.width?((event.clientX-rect.left)/rect.width-.5)*2:0,
        ny:rect.height?((event.clientY-rect.top)/rect.height-.5)*2:0,
        px:rect.width?((event.clientX-rect.left)/rect.width)*100:50,
        py:rect.height?((event.clientY-rect.top)/rect.height)*100:50
      };
    }

    bindSpotlights(){
      this.spotlights.forEach(node=>{
        node.addEventListener('pointerenter',()=>node.style.setProperty('--v20-spot-o','1'));
        node.addEventListener('pointerleave',()=>{
          node.style.setProperty('--v20-spot-o','0');
          node.style.setProperty('--v20-local-x','50%');
          node.style.setProperty('--v20-local-y','50%');
        });
        node.addEventListener('pointermove',event=>{
          const p=this.local(event,node);
          node.style.setProperty('--v20-local-x',`${p.px.toFixed(2)}%`);
          node.style.setProperty('--v20-local-y',`${p.py.toFixed(2)}%`);
        },{passive:true});
      });
    }

    bindMagnets(){
      this.magnets.forEach(node=>{
        node.addEventListener('pointermove',event=>{
          const p=this.local(event,node);
          node.style.setProperty('--v20-mag-x',`${(p.nx*5.5).toFixed(2)}px`);
          node.style.setProperty('--v20-mag-y',`${(p.ny*4.5).toFixed(2)}px`);
        },{passive:true});
        node.addEventListener('pointerleave',()=>{
          node.style.setProperty('--v20-mag-x','0px');
          node.style.setProperty('--v20-mag-y','0px');
        });
      });
    }
  }

  class PolishDirector {
    constructor(){
      this.scenes=[...document.querySelectorAll('main [data-scene]')];
      this.labels=['OPEN','CAPABILITIES','PROCESS','WORK','AI','PRICING','FOUNDER','CONTACT'];
      this.railLabel=document.querySelector('[data-v20-rail-label]');
      this.railDots=[...document.querySelectorAll('[data-v20-rail-dot]')];
      this.active=-1;
      this.frame=0;
      this.pointerX=.5;
      this.pointerY=.5;
      this.pointerTargetX=.5;
      this.pointerTargetY=.5;
      this.bind();
      this.schedule(true);
    }

    bind(){
      addEventListener('scroll',()=>this.schedule(),{passive:true});
      addEventListener('resize',()=>this.schedule(true),{passive:true});
      addEventListener('pageshow',()=>this.schedule(true),{passive:true});
      if(fine&&!reduced){
        addEventListener('pointermove',event=>{
          this.pointerTargetX=clamp01(event.clientX/Math.max(innerWidth,1));
          this.pointerTargetY=clamp01(event.clientY/Math.max(innerHeight,1));
          this.schedule();
        },{passive:true});
      }
    }

    schedule(force=false){
      if(force)this.force=true;
      if(!this.frame)this.frame=requestAnimationFrame(()=>this.tick());
    }

    sceneProgress(node){
      const rect=node.getBoundingClientRect();
      return clamp01((innerHeight-rect.top)/Math.max(rect.height+innerHeight,1));
    }

    updateRail(){
      const maxScroll=Math.max(document.documentElement.scrollHeight-innerHeight,1);
      const page=clamp01(scrollY/maxScroll);
      root.style.setProperty('--v20-page',page.toFixed(5));

      let best=0;
      let distance=Infinity;
      this.scenes.forEach((scene,index)=>{
        const rect=scene.getBoundingClientRect();
        const d=Math.abs(rect.top+rect.height*.5-innerHeight*.5);
        if(d<distance){distance=d;best=index}
      });
      if(best!==this.active){
        this.active=best;
        body.dataset.v20Scene=this.scenes[best]?.dataset.scene||String(best);
        if(this.railLabel)this.railLabel.textContent=this.labels[best]||`SCENE ${best+1}`;
        this.railDots.forEach((dot,index)=>dot.classList.toggle('is-active',index===best));
      }
    }

    updateHero(){
      const hero=document.querySelector('#top');
      if(!hero)return;
      const p=this.sceneProgress(hero);
      const phase=(p-.5)*2;
      const speed=parseFloat(getComputedStyle(root).getPropertyValue('--v19-speed'))||0;
      const px=(this.pointerX-.5)*12;
      const py=(this.pointerY-.5)*9;
      hero.style.setProperty('--v20-lens-x',`${(px+phase*4).toFixed(2)}px`);
      hero.style.setProperty('--v20-lens-y',`${(py+phase*-7).toFixed(2)}px`);
      hero.style.setProperty('--v20-lens-scale',(1.01+Math.abs(phase)*.025+speed*.012).toFixed(5));
      hero.style.setProperty('--v20-lens-o',(0.23+Math.max(0,1-Math.abs(phase))*.18).toFixed(4));
    }

    updateFilm(){
      const film=document.querySelector('.editorial-sequence');
      if(!film)return;
      const p=this.sceneProgress(film);
      film.style.setProperty('--v20-film-scan',`${(10+p*80).toFixed(2)}%`);
    }

    updateFounder(){
      const founder=document.querySelector('#studio');
      if(!founder)return;
      const p=this.sceneProgress(founder);
      founder.style.setProperty('--v20-founder-scan',`${(14+p*72).toFixed(2)}%`);
    }

    tick(){
      this.frame=0;
      const force=!!this.force;
      this.force=false;
      const rate=reduced||force?1:.16;
      this.pointerX=lerp(this.pointerX,this.pointerTargetX,rate);
      this.pointerY=lerp(this.pointerY,this.pointerTargetY,rate);
      this.updateRail();
      this.updateHero();
      this.updateFilm();
      this.updateFounder();
      const pointerDelta=Math.abs(this.pointerX-this.pointerTargetX)+Math.abs(this.pointerY-this.pointerTargetY);
      if(!reduced&&pointerDelta>.002)this.schedule();
    }
  }

  new ComponentMounts();
  new PointerPolish();
  new PolishDirector();
})();
