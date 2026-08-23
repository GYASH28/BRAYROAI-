(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (min,value,max) => Math.min(max,Math.max(min,value));
  const root = document.documentElement;
  const body = document.body;
  body.classList.add('v8-ready');

  class WorkShowcaseV8 {
    constructor(){
      this.section=document.querySelector('#work');
      this.stage=document.querySelector('[data-work-stage]');
      this.desktop=this.stage?.querySelector('.work__desktop');
      this.mobile=this.stage?.querySelector('.work__mobile');
      this.legacyToggle=document.querySelector('[data-work-toggle]');
      this.header=this.section?.querySelector('.section-heading');
      if(!this.section||!this.stage||!this.desktop||!this.mobile||!this.header)return;
      this.manualUntil=0;
      this.mode='desktop';
      this.injectCopy();
      this.injectControls();
      this.injectDetail();
      this.injectProgress();
      this.injectLens();
      this.bindScroll();
      this.bindLegacy();
      this.setMode('desktop',false);
    }

    injectCopy(){
      if(!this.header.querySelector('.v8-work-kicker')){
        const kicker=document.createElement('span');
        kicker.className='v8-work-kicker';
        kicker.textContent='FLAGSHIP CASE / PROJECT 01';
        this.header.prepend(kicker);
      }
      if(!this.header.querySelector('.v8-work-title')){
        const title=document.createElement('div');
        title.className='v8-work-title';
        title.innerHTML='<strong>FakhriMart / Fakhri Yarns</strong><span>LIVE / RESPONSIVE / PRODUCTION</span>';
        this.header.append(title);
      }
      if(!this.header.querySelector('.v8-work-meta')){
        const meta=document.createElement('div');
        meta.className='v8-work-meta';
        meta.innerHTML='<span>CLIENT TYPE<b>YARN WHOLESALE</b></span><span>ROLE<b>DIRECTION + UI + FRONTEND</b></span><span>PRIMARY JOB<b>CATALOGUE BROWSING</b></span><span>DELIVERY<b>DESKTOP + MOBILE</b></span>';
        this.header.append(meta);
      }
      if(!this.header.querySelector('.v8-work-chapters')){
        const chapters=document.createElement('div');
        chapters.className='v8-work-chapters';
        chapters.innerHTML='<button type="button" data-v8-work-mode="desktop"><small>01 / OVERVIEW</small><b>Desktop system</b></button><button type="button" data-v8-work-mode="mobile"><small>02 / RESPONSIVE</small><b>Mobile hierarchy</b></button><button type="button" data-v8-work-mode="detail"><small>03 / PROOF</small><b>Project decisions</b></button>';
        this.header.append(chapters);
      }
    }

    injectControls(){
      if(this.stage.querySelector('.v8-work-modebar'))return;
      const controls=document.createElement('div');
      controls.className='v8-work-modebar';
      controls.setAttribute('role','group');
      controls.setAttribute('aria-label','FakhriMart project view');
      controls.innerHTML='<button type="button" data-v8-work-mode="desktop">Desktop</button><button type="button" data-v8-work-mode="mobile">Mobile</button><button type="button" data-v8-work-mode="detail">Detail</button>';
      this.stage.append(controls);
      this.controls=[...document.querySelectorAll('[data-v8-work-mode]')];
      this.controls.forEach(button=>{
        button.addEventListener('click',()=>{this.manualUntil=performance.now()+4200;this.setMode(button.dataset.v8WorkMode,true)});
        button.addEventListener('keydown',event=>this.navigate(event,button));
      });
    }

    navigate(event,button){
      if(!['ArrowLeft','ArrowRight'].includes(event.key))return;
      event.preventDefault();
      const buttons=[...this.stage.querySelectorAll('[data-v8-work-mode]')];
      const direction=event.key==='ArrowRight'?1:-1;
      const next=buttons[(buttons.indexOf(button)+direction+buttons.length)%buttons.length];
      next.focus();this.manualUntil=performance.now()+4200;this.setMode(next.dataset.v8WorkMode,true);
    }

    injectDetail(){
      if(this.stage.querySelector('.v8-work-detail'))return;
      const detail=document.createElement('aside');
      detail.className='v8-work-detail';
      detail.setAttribute('aria-label','FakhriMart project details');
      detail.innerHTML='<small>PROJECT PROOF / 03</small><h3>One system across the buying journey.</h3><p>The work was shaped around browsing yarn clearly on different screens and keeping the route to enquiry direct.</p><ul><li><span>CATALOGUE</span><b>Browse-first hierarchy</b></li><li><span>RESPONSIVE</span><b>Desktop + mobile</b></li><li><span>HANDOFF</span><b>Direct enquiry path</b></li></ul>';
      this.stage.append(detail);
    }

    injectProgress(){
      if(this.stage.querySelector('.v8-work-progress'))return;
      const progress=document.createElement('div');
      progress.className='v8-work-progress';progress.setAttribute('aria-hidden','true');
      progress.innerHTML='<i></i><span>CASE / SCROLL</span>';
      this.stage.append(progress);
    }

    injectLens(){
      if(!fine||reduced||this.stage.querySelector('.v8-work-lens'))return;
      const lens=document.createElement('i');
      lens.className='v8-work-lens';lens.setAttribute('aria-hidden','true');
      this.stage.append(lens);this.lens=lens;
      this.desktop.addEventListener('pointerenter',()=>{if(this.mode==='desktop')this.stage.classList.add('v8-lens-live')});
      this.desktop.addEventListener('pointerleave',()=>this.stage.classList.remove('v8-lens-live'));
      this.desktop.addEventListener('pointermove',event=>{
        if(this.mode!=='desktop')return;
        const sr=this.stage.getBoundingClientRect();const dr=this.desktop.getBoundingClientRect();
        const x=clamp(0,(event.clientX-dr.left)/Math.max(dr.width,1),1),y=clamp(0,(event.clientY-dr.top)/Math.max(dr.height,1),1);
        lens.style.left=`${event.clientX-sr.left}px`;lens.style.top=`${event.clientY-sr.top}px`;
        lens.style.backgroundPosition=`${(x*100).toFixed(1)}% ${(y*100).toFixed(1)}%`;
      },{passive:true});
    }

    bindLegacy(){
      if(!this.legacyToggle)return;
      this.legacyToggle.addEventListener('click',()=>requestAnimationFrame(()=>this.setMode(this.stage.classList.contains('is-mobile')?'mobile':'desktop',false)));
    }

    bindScroll(){
      if(reduced){this.section.style.setProperty('--v8-work-p','0');return;}
      this.raf=0;
      const schedule=()=>{if(!this.raf)this.raf=requestAnimationFrame(()=>this.paint())};
      addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});schedule();
    }

    paint(){
      this.raf=0;
      const rect=this.section.getBoundingClientRect();
      const range=Math.max(1,this.section.offsetHeight-innerHeight);
      const top=rect.top+scrollY;
      const p=clamp(0,(scrollY-top)/range,1);
      this.section.style.setProperty('--v8-work-p',p.toFixed(4));
      if(performance.now()<this.manualUntil)return;
      const next=p<.34?'desktop':p<.68?'mobile':'detail';
      if(next!==this.mode)this.setMode(next,false);
    }

    setMode(mode,user){
      if(!['desktop','mobile','detail'].includes(mode))return;
      this.mode=mode;
      this.stage.dataset.v8Mode=mode;
      this.stage.classList.toggle('is-mobile',mode==='mobile');
      this.stage.classList.toggle('v8-detail-mode',mode==='detail');
      this.stage.dataset.scVerifyState=`work:${mode}`;
      this.stage.classList.toggle('v8-lens-live',false);
      document.querySelectorAll('[data-v8-work-mode]').forEach(button=>{
        const active=button.dataset.v8WorkMode===mode;
        button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active));
      });
      if(this.legacyToggle){
        this.legacyToggle.setAttribute('aria-pressed',String(mode==='mobile'));
        const label=this.legacyToggle.querySelector('i');if(label)label.textContent=mode==='mobile'?'MOBILE':'DESKTOP';
      }
      if(user&&this.stage.scrollIntoView){/* preserve position; manual interaction only changes state */}
    }
  }

  class CaseDialogV8 {
    constructor(){this.decorate();this.observer=new MutationObserver(()=>this.decorate());this.observer.observe(body,{childList:true,subtree:true});}
    decorate(){
      const dialog=document.querySelector('.m6-case-dialog');if(!dialog||dialog.classList.contains('v8-case-dialog'))return;
      dialog.classList.add('v8-case-dialog');
      const copy=dialog.querySelector('.m6-case-dialog__copy');const media=dialog.querySelector('.m6-case-dialog__media');
      if(copy&&!copy.querySelector('.v8-dialog-profile')){
        const profile=document.createElement('div');profile.className='v8-dialog-profile';
        profile.innerHTML='<div><small>CLIENT</small><b>FakhriMart</b></div><div><small>INDUSTRY</small><b>Yarn wholesale</b></div><div><small>SCOPE</small><b>Design + frontend</b></div><div><small>STATUS</small><b>Live website</b></div>';
        copy.insertBefore(profile,copy.querySelector('.m6-case-dialog__actions'));
      }
      if(media&&!media.querySelector('.v8-dialog-mobile')){
        const phone=document.createElement('figure');phone.className='v8-dialog-mobile';
        phone.innerHTML='<img src="/assets/fakhrimart-case-mobile.png" width="390" height="844" alt="FakhriMart mobile website view">';
        media.append(phone);
      }
    }
  }

  class SectionStateV8 {
    constructor(){
      this.sections=[...document.querySelectorAll('[data-scene],[data-plan-scene],[data-founder-scene],.terms-section')];
      if(!this.sections.length)return;
      this.node=document.createElement('div');this.node.className='v8-section-state';this.node.setAttribute('aria-hidden','true');
      this.node.innerHTML='<span>01</span><i></i><b>INTRO</b>';body.append(this.node);
      this.raf=0;addEventListener('scroll',()=>this.schedule(),{passive:true});addEventListener('resize',()=>this.schedule(),{passive:true});this.schedule();
    }
    schedule(){if(!this.raf)this.raf=requestAnimationFrame(()=>this.paint())}
    paint(){
      this.raf=0;let best=this.sections[0],distance=Infinity,index=0;
      this.sections.forEach((section,i)=>{const r=section.getBoundingClientRect();const d=Math.abs(r.top-innerHeight*.32);if(r.bottom>0&&r.top<innerHeight&&d<distance){best=section;distance=d;index=i}});
      const rect=best.getBoundingClientRect();const local=clamp(.08,(innerHeight-rect.top)/(innerHeight+rect.height),1);
      this.node.querySelector('span').textContent=String(index+1).padStart(2,'0');
      this.node.querySelector('b').textContent=this.label(best);
      this.node.style.setProperty('--v8-section-p',local.toFixed(3));
    }
    label(section){
      if(section.id)return section.id.toUpperCase();
      return (section.dataset.scene||section.dataset.planScene||section.dataset.founderScene||'SECTION').toUpperCase();
    }
  }

  class ScrollVelocityV8 {
    constructor(){if(reduced)return;this.lastY=scrollY;this.lastT=performance.now();this.value=0;this.raf=0;addEventListener('scroll',()=>this.schedule(),{passive:true});}
    schedule(){if(!this.raf)this.raf=requestAnimationFrame(()=>this.paint())}
    paint(){const now=performance.now(),dt=Math.max(16,now-this.lastT),v=(scrollY-this.lastY)/dt;this.value=this.value*.72+clamp(-18,v*8,18)*.28;root.style.setProperty('--v8-velocity',this.value.toFixed(3));body.classList.toggle('v8-velocity-live',Math.abs(this.value)>.45);this.lastY=scrollY;this.lastT=now;this.raf=0;}
  }

  class StaggerV8 {
    constructor(){
      this.targets=[...document.querySelectorAll('.care-grid article,.method__copy li,.terms-card,.pricing-mini,.build-card')];
      this.targets.forEach((node,index)=>{node.dataset.v8Stagger='';node.style.transitionDelay=`${(index%4)*55}ms`});
      if(reduced||!('IntersectionObserver' in window)){this.targets.forEach(n=>n.classList.add('v8-in'));return;}
      const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('v8-in');observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -7% 0px'});
      this.targets.forEach(n=>observer.observe(n));
    }
  }

  class TactileLinksV8 {
    constructor(){document.querySelectorAll('.text-link,.primary-action,.site-nav__cta,.close__action,.plan-close__copy a,.founder-close__copy a,.terms-close a').forEach(node=>node.classList.add('v8-tactile'));}
  }

  new WorkShowcaseV8();
  new CaseDialogV8();
  new SectionStateV8();
  new ScrollVelocityV8();
  new StaggerV8();
  new TactileLinksV8();
})();
