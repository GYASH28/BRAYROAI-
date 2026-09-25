(() => {
  'use strict';
  if(document.documentElement.dataset.v16MotionMounted)return;
  document.documentElement.dataset.v16MotionMounted='true';

  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp=(min,value,max)=>Math.min(max,Math.max(min,value));
  const body=document.body;
  const path=window.BRAYRO_MARKET?.route||location.pathname.replace(/\/$/,'')||'/';
  const isHome=path==='/'||path.endsWith('/index.html');

  body.classList.add('v16-motion');
  if(isHome)body.classList.add('home-v16');
  else if(path==='/plans'||path.endsWith('/plans.html'))body.classList.add('plans-v16');
  else if(path==='/founder'||path.endsWith('/founder.html'))body.classList.add('founder-v16');
  else if(path==='/terms'||path.endsWith('/terms.html'))body.classList.add('terms-v16');
  else if(path.startsWith('/clients')||path.endsWith('/clients.html')||path.endsWith('/fakhrimart-case-study.html'))body.classList.add('client-v16');
  else if(path==='/ai-workflow-audit'||path==='/company-second-brain'||path.endsWith('/ai-workflow-audit.html')||path.endsWith('/company-second-brain.html'))body.classList.add('ai-v16');
  const hasDedicatedSceneRuntime=body.classList.contains('plans-v16')||body.classList.contains('founder-v16');

  // Native mobile scene motion and the homepage interaction scripts already
  // cover this route. Avoid decorating every section during its first paint.
  if(isHome&&matchMedia('(max-width:760px), (pointer:coarse)').matches)return;

  class PageCurtain{
    constructor(){
      this.node=document.createElement('div');this.node.className='v16-page-transition is-entering';this.node.setAttribute('aria-hidden','true');this.node.innerHTML='<i></i><i></i><i></i><i></i>';body.append(this.node);
      if(!reduced)setTimeout(()=>this.node.classList.remove('is-entering'),520);else this.node.classList.remove('is-entering');
    }
  }

  class RevealDirector{
    constructor(){
      this.items=[];this.decorate();
      if(reduced||!('IntersectionObserver'in window)){this.items.forEach(item=>item.classList.add('v16-in'));return}
      this.observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;entry.target.classList.add('v16-in');this.observer.unobserve(entry.target)}),{threshold:.1,rootMargin:'0px 0px -8% 0px'});
      this.items.forEach(item=>this.observer.observe(item));
    }
    decorate(){
      const selectors=['main h1','main h2','.plan-family__heading','.build-card','.ai-plan-card','.compare-table','.story__copy','.principle-instrument','.method__image','.method__copy','.conviction blockquote','.terms-intro','.terms-quick','.terms-section','.process-lab','.matrix','.deliver-grid','.architecture','.scope-table','.faq'];
      const seen=new Set();document.querySelectorAll(selectors.join(',')).forEach((item,index)=>{if(seen.has(item)||item.closest('.opening-sequence'))return;seen.add(item);item.dataset.v16Reveal='';if(index%4)item.dataset.v16Delay=String(index%4);this.items.push(item)});
    }
  }

  class SceneKinetics{
    constructor(){
      this.records=[...document.querySelectorAll('main > section,[data-scene],[data-plan-scene],[data-founder-scene]')].filter((scene,index,array)=>array.indexOf(scene)===index).map((scene,index)=>({scene,index,top:0,height:1}));
      this.frame=0;this.lastY=scrollY;this.velocity=0;this.active=new Set(this.records);this.measure();
      this.records.forEach(({scene,index})=>{scene.dataset.v16Scene='';scene.dataset.v16Index=String(index);if(!scene.querySelector(':scope > .v16-section-line')){const line=document.createElement('i');line.className='v16-section-line';line.setAttribute('aria-hidden','true');scene.prepend(line)}});
      if('IntersectionObserver'in window){this.active.clear();this.io=new IntersectionObserver(entries=>{entries.forEach(entry=>{const record=this.records.find(item=>item.scene===entry.target);if(!record)return;if(entry.isIntersecting)this.active.add(record);else this.active.delete(record)});this.schedule()},{rootMargin:'75% 0px'});this.records.forEach(record=>this.io.observe(record.scene))}
      if('ResizeObserver'in window){this.ro=new ResizeObserver(()=>{this.measure();this.schedule()});this.records.forEach(record=>this.ro.observe(record.scene))}
      addEventListener('scroll',()=>this.schedule(),{passive:true});addEventListener('resize',()=>{this.measure();this.schedule()},{passive:true});document.fonts?.ready?.then(()=>{this.measure();this.schedule()});this.schedule();
    }
    measure(){this.records.forEach(record=>{const rect=record.scene.getBoundingClientRect();record.top=rect.top+scrollY;record.height=record.scene.offsetHeight||rect.height||1})}
    schedule(){if(!this.frame)this.frame=requestAnimationFrame(()=>this.update())}
    update(){
      this.frame=0;const y=scrollY;this.velocity+=((y-this.lastY)-this.velocity)*.24;this.lastY=y;document.documentElement.style.setProperty('--v16-scroll',String(y));document.documentElement.style.setProperty('--v16-velocity',this.velocity.toFixed(3));
      const vh=Math.max(innerHeight,1);
      this.records.forEach(record=>{
        const top=record.top-y,bottom=top+record.height;if(bottom<-vh*.4||top>vh*1.4)return;
        const center=top+record.height*.5,delta=(center-vh*.5)/vh,focus=clamp(0,1-Math.abs(delta)*1.15,1),line=clamp(0,(vh*.9-top)/Math.max(vh*.7,1),1),driftY=clamp(-100,delta*-52,100),driftX=clamp(-90,delta*(record.index%2?38:-38),90),scene=record.scene;
        scene.style.setProperty('--v16-focus',focus.toFixed(4));scene.style.setProperty('--v16-line',line.toFixed(4));scene.style.setProperty('--v16-drift-y',driftY.toFixed(3));scene.style.setProperty('--v16-drift-x',driftX.toFixed(3));
        if(scene.matches('.hero,[data-scene="hero"],.plans-hero,.founder-hero,.ai-hero,.terms-hero')){const depth=clamp(0,-top/vh,1);scene.style.setProperty('--v16-hero-depth',depth.toFixed(4));scene.style.setProperty('--v16-hero-shift',(depth*-18).toFixed(3))}
      });
      this.updateTermsReading(y,vh);
    }
    updateTermsReading(y,vh){
      if(!body.classList.contains('terms-v16'))return;let active=null,distance=Infinity;
      this.records.forEach(record=>{const section=record.scene;if(!section.classList.contains('terms-section'))return;const top=record.top-y,bottom=top+record.height,d=Math.abs(top-vh*.28);if(bottom>vh*.16&&top<vh*.78&&d<distance){active=section;distance=d}section.style.setProperty('--v16-term',clamp(0,(vh*.75-top)/Math.max(record.height,1),1).toFixed(3))});
      document.querySelectorAll('.terms-section').forEach(section=>section.classList.toggle('v16-reading',section===active));const toc=document.querySelector('.terms-toc');if(toc)toc.style.setProperty('--v16-toc-shift',String(clamp(-8,this.velocity*-.08,8)));
    }
  }

  class SceneLifecycle{
    constructor(){
      this.scenes=[...document.querySelectorAll('main > section')];
      const syncVisibility=()=>document.documentElement.classList.toggle('v16-document-hidden',document.hidden);
      document.addEventListener('visibilitychange',syncVisibility);syncVisibility();
      if(!this.scenes.length)return;
      if(!('IntersectionObserver'in window)){this.scenes.forEach(scene=>scene.classList.add('is-v16-live'));return}
      this.io=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('is-v16-live',entry.isIntersecting)),{rootMargin:'35% 0px',threshold:0});
      this.scenes.forEach(scene=>this.io.observe(scene));
    }
  }
  class SurfaceDecorations{
    constructor(){
      const selector='.build-card,.ai-plan-card,.compare-table,.principle-instrument,.terms-quick a,.terms-card,.process-stage,.deliver,.matrix-row,.scope-row,.arch-node,.v12-product-card,[data-v14-rate]';
      document.querySelectorAll(selector).forEach(surface=>{surface.dataset.v16Surface='';if(surface.matches('.build-card,.ai-plan-card,.terms-quick a,.deliver,.v12-product-card,[data-v14-rate]'))surface.dataset.v16Lift=''})
    }
  }

  class InteractionChoreography{
    constructor(){this.processLabs();this.principles();this.planModes();this.faqs()}
    pulse(node,options={}){if(!node||reduced||!node.animate)return;node.animate([{transform:'scale(.99)'},{transform:'scale(1.004)'},{transform:'scale(1)'}],{duration:360,easing:'cubic-bezier(.16,1,.3,1)',...options})}
    processLabs(){document.querySelectorAll('[data-process-tab]').forEach(tab=>tab.addEventListener('click',()=>this.pulse(tab.closest('[data-process-lab]')?.querySelector('[data-process-stage]'))));document.querySelectorAll('[data-arch-node]').forEach(node=>node.addEventListener('click',()=>this.pulse(node.closest('[data-architecture]')?.querySelector('.arch-engine'))))}
    principles(){document.querySelectorAll('[data-principle]').forEach(button=>button.addEventListener('click',()=>this.pulse(document.querySelector('[data-principle-stage]'))))}
    planModes(){document.querySelectorAll('[data-plan-mode]').forEach(button=>button.addEventListener('click',()=>this.pulse(document.querySelector('[data-plan-mode-output]'))))}
    faqs(){document.querySelectorAll('.faq details').forEach(item=>item.addEventListener('toggle',()=>{if(item.open)this.pulse(item,{duration:300})}))}
  }

  new PageCurtain();
  new RevealDirector();
  new SceneLifecycle();
  if(!isHome&&!hasDedicatedSceneRuntime)new SceneKinetics();
  new SurfaceDecorations();
  new InteractionChoreography();
})();
