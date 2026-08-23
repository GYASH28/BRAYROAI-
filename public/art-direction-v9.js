(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine=matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp=(min,value,max)=>Math.min(max,Math.max(min,value));
  const body=document.body;
  const root=document.documentElement;
  body.classList.add('v9-ready');

  class HeroContinuityV9{
    constructor(){
      this.hero=document.querySelector('.hero__stage');
      if(!this.hero)return;
      if(!this.hero.querySelector('.v9-hero-corners')){const corners=document.createElement('div');corners.className='v9-hero-corners';corners.setAttribute('aria-hidden','true');corners.innerHTML='<i></i><i></i><i></i><i></i>';this.hero.append(corners)}
      if(!this.hero.querySelector('.v9-hero-scroll')){const cue=document.createElement('div');cue.className='v9-hero-scroll';cue.setAttribute('aria-hidden','true');cue.innerHTML='<span>SCROLL / ENTER THE STUDIO</span><i></i>';this.hero.append(cue)}
      if(reduced)return;
      this.raf=0;addEventListener('scroll',()=>this.schedule(),{passive:true});addEventListener('resize',()=>this.schedule(),{passive:true});this.schedule();
    }
    schedule(){if(!this.raf)this.raf=requestAnimationFrame(()=>this.paint())}
    paint(){this.raf=0;const h=Math.max(1,this.hero.offsetHeight-innerHeight*.15);root.style.setProperty('--v9-scene-p',clamp(.08,scrollY/h,1).toFixed(3))}
  }

  class ServiceStateV9{
    constructor(){
      this.stage=document.querySelector('[data-capability-stage]');if(!this.stage)return;
      this.buttons=[...this.stage.querySelectorAll('[data-capability]')];
      this.states={design:['DESI<em>GN</em>','01 / DESIGN','DIRECTION ACTIVE'],engineering:['ENGI<em>NEERING</em>','02 / ENGINEERING','SYSTEM ACTIVE'],ai:['USEFUL <em>AI</em>','03 / USEFUL AI','UTILITY ACTIVE']};
      if(!this.stage.querySelector('.v9-service-word')){const word=document.createElement('div');word.className='v9-service-word';word.setAttribute('aria-hidden','true');this.stage.prepend(word);this.word=word}else this.word=this.stage.querySelector('.v9-service-word');
      if(!this.stage.querySelector('.v9-service-state')){const state=document.createElement('div');state.className='v9-service-state';state.setAttribute('aria-hidden','true');state.innerHTML='<i></i><span>01 / DESIGN</span><b>DIRECTION ACTIVE</b>';this.stage.append(state);this.state=state}else this.state=this.stage.querySelector('.v9-service-state');
      this.buttons.forEach(button=>button.addEventListener('click',()=>requestAnimationFrame(()=>this.sync(button.dataset.capability))));
      const observer=new MutationObserver(()=>this.sync(this.activeKey()));observer.observe(this.stage,{attributes:true,attributeFilter:['data-sc-verify-state']});
      this.sync(this.activeKey());
    }
    activeKey(){const active=this.buttons.find(button=>button.classList.contains('is-active'));return active?.dataset.capability||'design'}
    sync(key){
      const state=this.states[key]||this.states.design;this.word.innerHTML=state[0];this.state.querySelector('span').textContent=state[1];this.state.querySelector('b').textContent=state[2];
      const index=['design','engineering','ai'].indexOf(key);const safeIndex=index<0?0:index;this.stage.style.setProperty('--v9-service-p',String(.18+safeIndex*.32));this.stage.style.setProperty('--v9-service-x',`${(1-safeIndex)*7}px`);
    }
  }

  class WorkProofReelV9{
    constructor(){
      this.section=document.querySelector('#work');this.header=this.section?.querySelector('.section-heading');this.stage=this.section?.querySelector('[data-work-stage]');if(!this.section||!this.header||!this.stage)return;
      this.injectReel();this.injectCaption();this.bindStage();this.sync(this.stage.dataset.v8Mode||'desktop');
    }
    injectReel(){
      if(this.header.querySelector('.v9-proof-reel'))return;
      const reel=document.createElement('div');reel.className='v9-proof-reel';reel.innerHTML=`<small>REAL INTERFACE DETAILS / TAP TO FOCUS</small><button class="v9-proof-reel__item" type="button" data-v9-proof="desktop" style="--v9-crop-x:-8%;--v9-crop-y:-4%"><span class="v9-proof-reel__shot"><img src="/assets/fakhrimart-case-desktop.png" width="1440" height="1000" loading="lazy" alt=""></span><span class="v9-proof-reel__copy"><small>01 / CATALOGUE</small><b>Desktop browsing</b><span>Real production interface</span></span><i>↗</i></button><button class="v9-proof-reel__item" type="button" data-v9-proof="mobile" style="--v9-crop-x:-58%;--v9-crop-y:-24%"><span class="v9-proof-reel__shot"><img src="/assets/fakhrimart-case-desktop.png" width="1440" height="1000" loading="lazy" alt=""></span><span class="v9-proof-reel__copy"><small>02 / RESPONSIVE</small><b>Mobile hierarchy</b><span>Same system, smaller screen</span></span><i>↗</i></button><button class="v9-proof-reel__item" type="button" data-v9-proof="detail" style="--v9-crop-x:-122%;--v9-crop-y:-42%"><span class="v9-proof-reel__shot"><img src="/assets/fakhrimart-case-desktop.png" width="1440" height="1000" loading="lazy" alt=""></span><span class="v9-proof-reel__copy"><small>03 / ENQUIRY</small><b>Project decisions</b><span>Browse clearly, enquire directly</span></span><i>↗</i></button>`;
      this.header.append(reel);this.reel=reel;this.items=[...reel.querySelectorAll('[data-v9-proof]')];this.items.forEach(item=>item.addEventListener('click',()=>this.activate(item.dataset.v9Proof)));
    }
    injectCaption(){if(this.stage.querySelector('.v9-work-caption'))return;const caption=document.createElement('div');caption.className='v9-work-caption';caption.setAttribute('aria-hidden','true');caption.innerHTML='<i></i><span>LIVE PROJECT / <b>FAKHRIMART</b></span>';this.stage.append(caption)}
    bindStage(){const observer=new MutationObserver(()=>this.sync(this.stage.dataset.v8Mode||'desktop'));observer.observe(this.stage,{attributes:true,attributeFilter:['data-v8-mode','data-sc-verify-state']})}
    activate(mode){const control=document.querySelector(`[data-v8-work-mode="${mode}"]`);if(control){control.click();control.focus({preventScroll:true})}else{this.stage.dataset.v8Mode=mode;this.stage.dataset.scVerifyState=`work:${mode}`}this.sync(mode)}
    sync(mode){if(!this.items)this.items=[...document.querySelectorAll('[data-v9-proof]')];this.items.forEach(item=>{const active=item.dataset.v9Proof===mode;item.classList.toggle('is-active',active);item.setAttribute('aria-pressed',String(active))})}
  }

  class FounderNoteV9{
    constructor(){const preview=document.querySelector('.founder-preview .section-heading');if(!preview||preview.querySelector('.v9-founder-note'))return;const note=document.createElement('div');note.className='v9-founder-note';note.innerHTML='<span>FOUNDER-LED / WHY IT MATTERS</span><p>Direction, interface and implementation stay close enough that the final browser still feels like the original idea.</p>';preview.append(note)}
  }

  class ContactFinaleV9{
    constructor(){
      this.close=document.querySelector('.close');this.copy=this.close?.querySelector('.close__copy');if(!this.close||!this.copy)return;
      if(!this.copy.querySelector('.v9-contact-process')){const process=document.createElement('div');process.className='v9-contact-process';process.innerHTML='<div><small>01 / BRIEF</small><b>Define the job</b><p>What needs to exist, who it is for and what it should achieve.</p></div><div><small>02 / DIRECTION</small><b>Choose the point of view</b><p>Structure, art direction and interaction before polish for polish’s sake.</p></div><div><small>03 / BUILD</small><b>Make it real</b><p>Responsive implementation, refinement and launch as one connected production.</p></div>';this.copy.append(process)}
      if(!this.copy.querySelector('.v9-contact-status')){const status=document.createElement('div');status.className='v9-contact-status';status.innerHTML='<i></i><span>EMAIL OPENS WITH YOUR SELECTED PROJECT TYPE</span>';this.copy.append(status)}
    }
  }

  class SceneBridgesV9{
    constructor(){this.sections=[...document.querySelectorAll('.scene,.plan-scene,.founder-scene')];if(innerWidth<981)return;this.sections.forEach((section,index)=>{if(index===this.sections.length-1||section.querySelector(':scope > .v9-bridge'))return;const next=this.sections[index+1];const bridge=document.createElement('div');bridge.className='v9-bridge';bridge.setAttribute('aria-hidden','true');bridge.innerHTML=`<span>${this.label(section)}</span><span>NEXT / ${this.label(next)}</span>`;section.append(bridge)})}
    label(section){return (section.id||section.dataset.scene||section.dataset.planScene||section.dataset.founderScene||'SECTION').replace(/-/g,' ').toUpperCase()}
  }

  class EntrySystemV9{
    constructor(){
      const selectors=['.pricing-band','.plan-family','.founder-heading','.terms-section','.v9-proof-reel__item','.v9-contact-process>div'];this.targets=[...document.querySelectorAll(selectors.join(','))];this.targets.forEach((target,index)=>{target.classList.add('v9-enter');target.dataset.v9Delay=String(index%4)});
      if(reduced||!('IntersectionObserver' in window)){this.targets.forEach(target=>target.classList.add('v9-in'));return}
      const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('v9-in');observer.unobserve(entry.target)}}),{threshold:.1,rootMargin:'0px 0px -6% 0px'});this.targets.forEach(target=>observer.observe(target));
    }
  }

  class EditorialPointerV9{
    constructor(){this.section=document.querySelector('[data-editorial-sequence]');if(!this.section||!fine||reduced)return;this.section.addEventListener('pointermove',event=>{const r=this.section.getBoundingClientRect();const x=clamp(0,(event.clientX-r.left)/Math.max(r.width,1),1);const y=clamp(0,(event.clientY-r.top)/Math.max(r.height,1),1);this.section.style.setProperty('--v9-editorial-x',`${(x*100).toFixed(1)}%`);this.section.style.setProperty('--v9-editorial-y',`${(y*100).toFixed(1)}%`)},{passive:true})}
  }

  new HeroContinuityV9();new ServiceStateV9();new WorkProofReelV9();new FounderNoteV9();new ContactFinaleV9();new SceneBridgesV9();new EntrySystemV9();new EditorialPointerV9();
})();
