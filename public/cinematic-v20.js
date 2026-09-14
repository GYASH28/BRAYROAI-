(() => {
  'use strict';
  if(document.documentElement.dataset.v20PolishMounted)return;
  const path=location.pathname.replace(/\/$/,'')||'/';if(path!=='/'&&!path.endsWith('/index.html'))return;
  const root=document.documentElement,body=document.body;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp=(min,value,max)=>Math.min(max,Math.max(min,value));const clamp01=value=>clamp(0,value,1);const lerp=(a,b,t)=>a+(b-a)*t;
  root.dataset.v20PolishMounted='true';body.classList.add('home-v20');
  const create=(tag,className,html='')=>{const node=document.createElement(tag);node.className=className;if(html)node.innerHTML=html;return node};

  class ComponentMounts{
    constructor(){this.mountHeroLens();this.mountHeroTextCycle();this.mountServicesSignal();this.mountSelectorIndicator();this.mountFilmGate();this.mountWorkAperture();this.mountAIPaths();this.mountPricingLights();this.mountFounderScan();this.mountContactLines();this.mountShineButtons();this.mountSceneRail()}
    mountHeroLens(){const stage=document.querySelector('.hero__stage');if(!stage||stage.querySelector('[data-v20-lens]'))return;const lens=create('div','v20-lens','<i class="v20-lens__ring"></i><i class="v20-lens__axis"></i><i class="v20-lens__tick v20-lens__tick--a"></i><i class="v20-lens__tick v20-lens__tick--b"></i><i class="v20-lens__tick v20-lens__tick--c"></i><i class="v20-lens__tick v20-lens__tick--d"></i>');lens.dataset.v20Lens='';lens.setAttribute('aria-hidden','true');stage.appendChild(lens)}
    mountHeroTextCycle(){const meta=document.querySelector('.v12-hero-meta');if(!meta||document.querySelector('[data-v20-text-cycle]'))return;const cycle=create('div','v20-text-cycle','<span>BUILT FOR</span><strong><i data-v20-cycle-word>BRANDS</i><b aria-hidden="true"></b></strong>');cycle.dataset.v20TextCycle='';cycle.setAttribute('aria-hidden','true');meta.after(cycle)}
    mountServicesSignal(){const canvas=document.querySelector('#services .play-scene__canvas');if(!canvas||canvas.querySelector('[data-v20-signal]'))return;const field=create('div','v20-signal-field','<i class="v20-signal-field__orbit"></i><i class="v20-signal-field__orbit"></i><i class="v20-signal-field__orbit"></i>');field.dataset.v20Signal='';field.setAttribute('aria-hidden','true');canvas.prepend(field)}
    mountSelectorIndicator(){const controls=document.querySelector('#services .play-scene__controls');if(!controls||controls.querySelector('[data-v20-selector]'))return;const indicator=create('i','v20-selector-indicator');indicator.dataset.v20Selector='';indicator.setAttribute('aria-hidden','true');controls.prepend(indicator)}
    mountFilmGate(){const stage=document.querySelector('.editorial-sequence__stage');if(!stage||stage.querySelector('[data-v20-film-gate]'))return;const gate=create('div','v20-film-gate');gate.dataset.v20FilmGate='';gate.setAttribute('aria-hidden','true');stage.appendChild(gate)}
    mountWorkAperture(){const canvas=document.querySelector('#work .work__canvas');if(!canvas||canvas.querySelector('[data-v20-aperture]'))return;const aperture=create('div','v20-aperture','<i></i><i></i><i></i><i></i>');aperture.dataset.v20Aperture='';aperture.setAttribute('aria-hidden','true');canvas.appendChild(aperture)}
    mountAIPaths(){document.querySelectorAll('#ai-systems .v12-product-card').forEach(card=>{if(card.querySelector('[data-v20-data-path]'))return;const dataPath=create('div','v20-data-path','<i></i><i></i><i></i>');dataPath.dataset.v20DataPath='';dataPath.setAttribute('aria-hidden','true');card.appendChild(dataPath)})}
    mountPricingLights(){document.querySelectorAll('#plans [data-v14-rate]').forEach(rate=>{if(rate.querySelector('[data-v20-rate-light]'))return;const light=create('i','v20-rate-light');light.dataset.v20RateLight='';light.setAttribute('aria-hidden','true');rate.appendChild(light)})}
    mountFounderScan(){const portrait=document.querySelector('#studio .founder-preview__portrait');if(!portrait||portrait.querySelector('[data-v20-portrait-scan]'))return;const scan=create('i','v20-portrait-scan');scan.dataset.v20PortraitScan='';scan.setAttribute('aria-hidden','true');portrait.appendChild(scan)}
    mountContactLines(){const contact=document.querySelector('#contact');if(!contact||contact.querySelector('[data-v20-lines]'))return;const lines=create('div','v20-background-lines','<i></i><i></i><i></i><i></i><i></i><i></i>');lines.dataset.v20Lines='';lines.setAttribute('aria-hidden','true');contact.prepend(lines)}
    mountShineButtons(){document.querySelectorAll('.primary-action.magnetic,.close__action.magnetic').forEach(button=>{if(button.querySelector('[data-v20-button-shine]'))return;button.classList.add('v20-shine-button');const shine=create('i','v20-button-shine');shine.dataset.v20ButtonShine='';shine.setAttribute('aria-hidden','true');button.appendChild(shine)})}
    mountSceneRail(){if(document.querySelector('[data-v20-scene-rail]'))return;const labels=['OPEN','CAPABILITIES','PROCESS','WORK','AI','PRICING','FOUNDER','CONTACT'],rail=create('div','v20-scene-rail');rail.dataset.v20SceneRail='';rail.setAttribute('aria-hidden','true');rail.innerHTML=`<span class="v20-scene-rail__label" data-v20-rail-label>${labels[0]}</span><div class="v20-scene-rail__track"><i class="v20-scene-rail__progress"></i>${labels.map((_,i)=>`<b class="v20-scene-rail__dot${i===0?' is-active':''}" data-v20-rail-dot="${i}"></b>`).join('')}</div>`;body.appendChild(rail)}
  }

  class HeroTextCycle{
    constructor(){this.word=document.querySelector('[data-v20-cycle-word]');this.words=['BRANDS','PRODUCTS','TEAMS','SYSTEMS'];this.index=0;this.timer=0;if(!this.word||reduced)return;this.schedule();document.addEventListener('visibilitychange',()=>{clearTimeout(this.timer);if(!document.hidden)this.schedule()})}
    schedule(){this.timer=setTimeout(()=>this.next(),2800)}
    next(){if(document.hidden)return this.schedule();const out=this.word.animate([{opacity:1,transform:'translate3d(0,0,0)'},{opacity:0,transform:'translate3d(0,-55%,0)'}],{duration:180,easing:'cubic-bezier(.4,0,1,1)'});out.onfinish=()=>{this.index=(this.index+1)%this.words.length;this.word.textContent=this.words[this.index];this.word.animate([{opacity:0,transform:'translate3d(0,55%,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],{duration:360,easing:'cubic-bezier(.16,1,.3,1)'});this.schedule()}}
  }

  class SelectorDirector{
    constructor(){this.root=document.querySelector('#services .play-scene__controls');this.indicator=this.root?.querySelector('[data-v20-selector]');this.controls=this.root?[...this.root.querySelectorAll('[data-v15-control]')]:[];this.frame=0;if(!this.root||!this.indicator||!this.controls.length)return;const schedule=()=>this.schedule();this.controls.forEach(control=>{control.addEventListener('click',schedule);control.addEventListener('focus',schedule);control.addEventListener('pointerenter',schedule)});this.observer=new MutationObserver(schedule);this.controls.forEach(control=>this.observer.observe(control,{attributes:true,attributeFilter:['class','aria-selected']}));addEventListener('resize',schedule,{passive:true});this.schedule()}
    schedule(){if(!this.frame)this.frame=requestAnimationFrame(()=>this.paint())}
    paint(){this.frame=0;const active=this.controls.find(control=>control.classList.contains('is-active'))||this.controls[0];if(!active)return;this.root.style.setProperty('--v20-select-x',`${active.offsetLeft}px`);this.root.style.setProperty('--v20-select-y',`${active.offsetTop}px`);this.root.style.setProperty('--v20-select-w',`${active.offsetWidth}px`);this.root.style.setProperty('--v20-select-h',`${active.offsetHeight}px`)}
  }

  class PolishDirector{
    constructor(){
      this.labels=['OPEN','CAPABILITIES','PROCESS','WORK','AI','PRICING','FOUNDER','CONTACT'];
      this.records=[...document.querySelectorAll('main [data-scene]')].map((scene,index)=>({scene,index,key:scene.dataset.scene||String(index),top:0,height:1}));
      this.railLabel=document.querySelector('[data-v20-rail-label]');this.railDots=[...document.querySelectorAll('[data-v20-rail-dot]')];this.active=-1;this.frame=0;this.pageCurrent=0;this.filmCurrent=.5;this.founderCurrent=.5;this.measure();this.bind();this.schedule(true);
    }
    measure(){this.records.forEach(record=>{const rect=record.scene.getBoundingClientRect();record.top=rect.top+scrollY;record.height=record.scene.offsetHeight||rect.height||1});this.hero=this.records.find(record=>record.key==='hero');this.film=this.records.find(record=>record.key==='film');this.founder=this.records.find(record=>record.key==='founder')}
    bind(){addEventListener('scroll',()=>this.schedule(),{passive:true});addEventListener('resize',()=>{this.measure();this.schedule(true)},{passive:true});addEventListener('pageshow',()=>{this.measure();this.schedule(true)},{passive:true});document.fonts?.ready?.then(()=>{this.measure();this.schedule(true)});if('ResizeObserver'in window){this.ro=new ResizeObserver(()=>{this.measure();this.schedule(true)});this.records.forEach(record=>this.ro.observe(record.scene))}}
    schedule(force=false){if(force)this.force=true;if(!this.frame)this.frame=requestAnimationFrame(()=>this.tick())}
    sceneProgress(record){if(!record)return 0;const top=record.top-scrollY;return clamp01((innerHeight-top)/Math.max(record.height+innerHeight,1))}
    updateRail(force){
      const maxScroll=Math.max(document.documentElement.scrollHeight-innerHeight,1),target=clamp01(scrollY/maxScroll);this.pageCurrent=lerp(this.pageCurrent,target,reduced||force?1:.17);root.style.setProperty('--v20-page',this.pageCurrent.toFixed(5));
      const viewportCenter=scrollY+innerHeight*.5;let best=0,distance=Infinity;this.records.forEach(record=>{const d=Math.abs(record.top+record.height*.5-viewportCenter);if(d<distance){distance=d;best=record.index}});
      if(best!==this.active){this.active=best;body.dataset.v20Scene=this.records[best]?.key||String(best);if(this.railLabel){this.railLabel.textContent=this.labels[best]||`SCENE ${best+1}`;if(!reduced)this.railLabel.animate([{opacity:.2,transform:'translate3d(0,4px,0)'},{opacity:.76,transform:'translate3d(0,0,0)'}],{duration:260,easing:'cubic-bezier(.16,1,.3,1)'})}this.railDots.forEach((dot,index)=>dot.classList.toggle('is-active',index===best))}
      return Math.abs(target-this.pageCurrent);
    }
    updateHero(){if(!this.hero)return;const p=this.sceneProgress(this.hero),phase=(p-.5)*2,speed=Number(root._v19Speed)||0,hero=this.hero.scene;hero.style.setProperty('--v20-lens-x',`${(phase*4).toFixed(2)}px`);hero.style.setProperty('--v20-lens-y',`${(phase*-7).toFixed(2)}px`);hero.style.setProperty('--v20-lens-scale',(1.01+Math.abs(phase)*.025+speed*.012).toFixed(5));hero.style.setProperty('--v20-lens-o',(0.23+Math.max(0,1-Math.abs(phase))*.18).toFixed(4))}
    updateFilm(force){if(!this.film)return 0;const target=this.sceneProgress(this.film);this.filmCurrent=lerp(this.filmCurrent,target,reduced||force?1:.17);this.film.scene.style.setProperty('--v20-film-scan',`${(10+this.filmCurrent*80).toFixed(2)}%`);return Math.abs(target-this.filmCurrent)}
    updateFounder(force){if(!this.founder)return 0;const target=this.sceneProgress(this.founder);this.founderCurrent=lerp(this.founderCurrent,target,reduced||force?1:.17);this.founder.scene.style.setProperty('--v20-founder-scan',`${(14+this.founderCurrent*72).toFixed(2)}%`);return Math.abs(target-this.founderCurrent)}
    tick(){this.frame=0;const force=!!this.force;this.force=false;const unsettled=this.updateRail(force)+this.updateFilm(force)+this.updateFounder(force);this.updateHero();if(!reduced&&unsettled>.0025)this.schedule()}
  }

  new ComponentMounts();
  new HeroTextCycle();
  new SelectorDirector();
  new PolishDirector();
})();
