(() => {
  'use strict';
  if(document.documentElement.dataset.v20PolishMounted)return;
  const path=window.BRAYRO_MARKET?.route||location.pathname.replace(/\/$/,'')||'/';if(path!=='/'&&!path.endsWith('/index.html'))return;
  const root=document.documentElement,body=document.body;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const compact=matchMedia('(max-width:760px), (pointer:coarse)').matches;
  const clamp=(min,value,max)=>Math.min(max,Math.max(min,value));const clamp01=value=>clamp(0,value,1);const lerp=(a,b,t)=>a+(b-a)*t;
  root.dataset.v20PolishMounted='true';body.classList.add('home-v20');
  const create=(tag,className,html='')=>{const node=document.createElement(tag);node.className=className;if(html)node.innerHTML=html;return node};

  class ComponentMounts{
    constructor(){
      this.mountHeroLens();this.mountHeroTextCycle();this.mountShineButtons();if(!compact)this.mountSceneRail();
      const mounts={
        '#services':()=>{this.mountServicesSignal();this.mountSelectorIndicator();new SelectorDirector()},
        '.editorial-sequence':()=>this.mountFilmGate(),
        '#work':()=>this.mountWorkAperture(),
        '#ai-systems':()=>this.mountAIPaths(),
        '#plans':()=>this.mountPricingLights(),
        '#studio':()=>this.mountFounderScan(),
        '#contact':()=>this.mountContactLines()
      };
      if(!('IntersectionObserver'in window)){Object.values(mounts).forEach(mount=>mount());return}
      const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        const selector=Object.keys(mounts).find(key=>document.querySelector(key)===entry.target);
        if(!selector)return;
        observer.unobserve(entry.target);mounts[selector]();delete mounts[selector];
      }),{rootMargin:'600px 0px'});
      Object.keys(mounts).forEach(selector=>{const target=document.querySelector(selector);if(target)observer.observe(target)});
    }
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
    constructor(){
      this.word=document.querySelector('[data-v20-cycle-word]');this.hero=this.word?.closest('[data-scene="hero"]')||document.querySelector('#top');this.words=['BRANDS','PRODUCTS','TEAMS','SYSTEMS'];this.index=0;this.timer=0;this.visible=false;
      if(!this.word||reduced)return;
      document.addEventListener('visibilitychange',()=>{if(document.hidden)this.pause();else if(this.visible)this.schedule()});
      if('IntersectionObserver'in window&&this.hero){this.observer=new IntersectionObserver(entries=>this.setVisible(entries[0]?.isIntersecting===true),{rootMargin:'18% 0px',threshold:.01});this.observer.observe(this.hero)}
      else this.setVisible(true);
    }
    setVisible(visible){if(this.visible===visible)return;this.visible=visible;if(!visible)this.pause();else if(!document.hidden)this.schedule()}
    pause(){clearTimeout(this.timer);this.timer=0;this.word?.getAnimations?.().forEach(animation=>animation.cancel())}
    schedule(){if(!this.visible||document.hidden||this.timer)return;this.timer=setTimeout(()=>{this.timer=0;this.next()},2800)}
    next(){if(!this.visible||document.hidden)return;const out=this.word.animate([{opacity:1,transform:'translate3d(0,0,0)'},{opacity:0,transform:'translate3d(0,-55%,0)'}],{duration:180,easing:'cubic-bezier(.4,0,1,1)'});out.onfinish=()=>{if(!this.visible||document.hidden)return;this.index=(this.index+1)%this.words.length;this.word.textContent=this.words[this.index];this.word.animate([{opacity:0,transform:'translate3d(0,55%,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],{duration:360,easing:'cubic-bezier(.16,1,.3,1)'});this.schedule()}}
  }

  class SelectorDirector{
    constructor(){this.root=document.querySelector('#services .play-scene__controls');this.indicator=this.root?.querySelector('[data-v20-selector]');this.controls=this.root?[...this.root.querySelectorAll('[data-v15-control]')]:[];this.frame=0;if(!this.root||!this.indicator||!this.controls.length)return;const schedule=()=>this.schedule();this.controls.forEach(control=>{control.addEventListener('click',schedule);control.addEventListener('focus',schedule);control.addEventListener('pointerenter',schedule)});this.observer=new MutationObserver(schedule);this.controls.forEach(control=>this.observer.observe(control,{attributes:true,attributeFilter:['class','aria-selected']}));addEventListener('resize',schedule,{passive:true});this.schedule()}
    schedule(){if(!this.frame)this.frame=requestAnimationFrame(()=>this.paint())}
    paint(){this.frame=0;const active=this.controls.find(control=>control.classList.contains('is-active'))||this.controls[0];if(!active)return;this.root.style.setProperty('--v20-select-x',`${active.offsetLeft}px`);this.root.style.setProperty('--v20-select-y',`${active.offsetTop}px`);this.root.style.setProperty('--v20-select-w',`${active.offsetWidth}px`);this.root.style.setProperty('--v20-select-h',`${active.offsetHeight}px`)}
  }

  class SceneVisibilityDirector{
    constructor(){
      this.labels=['OPEN','CAPABILITIES','PROCESS','WORK','AI','PRICING','FOUNDER','CONTACT'];
      this.records=[...document.querySelectorAll('main [data-scene]')].map((scene,index)=>({scene,index,key:scene.dataset.scene||String(index)}));
      this.railLabel=document.querySelector('[data-v20-rail-label]');this.railDots=[...document.querySelectorAll('[data-v20-rail-dot]')];
      if(!this.records.length)return;
      if(!('IntersectionObserver'in window)){this.records.forEach(record=>record.scene.classList.add('is-scene-live'));this.activate(this.records[0]);return}
      this.liveObserver=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('is-scene-live',entry.isIntersecting)),{rootMargin:'45% 0px',threshold:0});
      this.activeObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){const record=this.records.find(item=>item.scene===entry.target);if(record)this.activate(record)}}),{rootMargin:'-44% 0px -44% 0px',threshold:0});
      this.records.forEach(record=>{this.liveObserver.observe(record.scene);this.activeObserver.observe(record.scene)});
      this.activate(this.records[0]);
    }
    activate(record){if(!record||this.active===record.index)return;this.active=record.index;body.dataset.v20Scene=record.key;if(this.railLabel){this.railLabel.textContent=this.labels[record.index]||`SCENE ${record.index+1}`;if(!reduced)this.railLabel.animate([{opacity:.2,transform:'translate3d(0,4px,0)'},{opacity:.76,transform:'translate3d(0,0,0)'}],{duration:260,easing:'cubic-bezier(.16,1,.3,1)'})}this.railDots.forEach((dot,index)=>dot.classList.toggle('is-active',index===record.index))}
  }

  new ComponentMounts();
  new HeroTextCycle();
  if(!compact)new SceneVisibilityDirector();
  else document.querySelectorAll('main [data-scene]').forEach(scene=>scene.classList.add('is-scene-live'));
})();
