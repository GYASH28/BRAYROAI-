(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine=matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp=(min,value,max)=>Math.min(max,Math.max(min,value));
  const body=document.body;
  const root=document.documentElement;
  body.classList.add('v9-ready');

  class ScrollDirectorV9{
    constructor(){
      this.sections=[...document.querySelectorAll('.scene,.plan-scene,.founder-scene')];
      if(!this.sections.length)return;
      this.raf=0;
      addEventListener('scroll',()=>this.schedule(),{passive:true});
      addEventListener('resize',()=>this.schedule(),{passive:true});
      this.schedule();
    }
    schedule(){if(!this.raf)this.raf=requestAnimationFrame(()=>this.paint())}
    paint(){
      this.raf=0;
      const total=Math.max(1,document.documentElement.scrollHeight-innerHeight);
      root.style.setProperty('--v9-page-p',clamp(0,scrollY/total,1).toFixed(4));
      let best=null,bestDistance=Infinity;
      this.sections.forEach(section=>{
        const r=section.getBoundingClientRect();
        const local=clamp(0,(innerHeight-r.top)/Math.max(innerHeight+r.height,1),1);
        const center=clamp(0,1-Math.abs((r.top+r.height*.5)-innerHeight*.5)/Math.max(innerHeight,r.height*.8),1);
        section.style.setProperty('--v9-local',local.toFixed(4));
        section.style.setProperty('--v9-center',center.toFixed(4));
        const d=Math.abs((r.top+r.height*.5)-innerHeight*.5);
        if(r.bottom>0&&r.top<innerHeight&&d<bestDistance){best=section;bestDistance=d}
      });
      this.sections.forEach(section=>section.classList.toggle('v9-active',section===best));
    }
  }

  class ContinuityBridgesV9{
    constructor(){
      const sections=[...document.querySelectorAll('.scene,.plan-scene,.founder-scene')];
      const labels=sections.map(section=>this.label(section));
      sections.forEach((section,index)=>{
        if(section.classList.contains('hero')||section.classList.contains('plans-hero')||section.classList.contains('founder-hero')||section.querySelector(':scope > .v9-scene-bridge'))return;
        const next=labels[index+1]||'END';
        const bridge=document.createElement('div');
        bridge.className='v9-scene-bridge';
        bridge.setAttribute('aria-hidden','true');
        bridge.innerHTML=`<span>${String(index+1).padStart(2,'0')} / ${labels[index]}</span><i class="v9-scene-bridge__line"></i><b>NEXT / ${next}</b>`;
        section.append(bridge);
      });
    }
    label(section){
      if(section.id)return section.id.toUpperCase();
      return String(section.dataset.scene||section.dataset.planScene||section.dataset.founderScene||'SECTION').replaceAll('-',' ').toUpperCase();
    }
  }

  class HeroFramingV9{
    constructor(){
      const stage=document.querySelector('.hero__stage');
      if(!stage||stage.querySelector('.v9-frame-marks'))return;
      const marks=document.createElement('i');
      marks.className='v9-frame-marks';
      marks.setAttribute('aria-hidden','true');
      stage.append(marks);
    }
  }

  class DisciplineRailV9{
    constructor(){
      this.stage=document.querySelector('[data-capability-stage]');
      if(!this.stage)return;
      if(!this.stage.querySelector('.v9-discipline-rail')){
        const rail=document.createElement('div');
        rail.className='v9-discipline-rail';
        rail.setAttribute('aria-hidden','true');
        rail.innerHTML='<span></span><span></span><span></span>';
        this.stage.append(rail);
      }
      this.buttons=[...this.stage.querySelectorAll('[data-capability]')];
      this.rail=[...this.stage.querySelectorAll('.v9-discipline-rail span')];
      this.buttons.forEach(button=>button.addEventListener('click',()=>requestAnimationFrame(()=>this.paint())));
      this.paint();
    }
    paint(){
      let active=Math.max(0,this.buttons.findIndex(button=>button.getAttribute('aria-pressed')==='true'||button.classList.contains('is-active')));
      this.rail.forEach((node,index)=>{
        node.classList.toggle('is-active',index===active);
        node.classList.toggle('is-past',index<active);
      });
    }
  }

  class WorkProofV9{
    constructor(){
      this.section=document.querySelector('#work');
      this.stage=document.querySelector('[data-work-stage]');
      const header=this.section?.querySelector('.section-heading');
      if(!this.section||!this.stage||!header)return;
      if(!this.stage.querySelector('.v9-case-plate')){
        const plate=document.createElement('div');
        plate.className='v9-case-plate';
        plate.setAttribute('aria-hidden','true');
        plate.innerHTML='<i></i><span>PROJECT 01 / LIVE CLIENT WORK</span>';
        this.stage.append(plate);
      }
      if(!header.querySelector('.v9-work-proof-grid')){
        const proof=document.createElement('div');
        proof.className='v9-work-proof-grid';
        proof.setAttribute('aria-label','FakhriMart project scope');
        proof.innerHTML='<span><small>01 / STRUCTURE</small><b>Catalogue-led browsing</b></span><span><small>02 / RESPONSIVE</small><b>Desktop + mobile</b></span><span><small>03 / PATH</small><b>Direct enquiry route</b></span><span><small>04 / STATUS</small><b>Live website</b></span>';
        header.append(proof);
      }
      this.section.dataset.v9Focus='true';
    }
  }

  class PricingGuideV9{
    constructor(){
      document.querySelectorAll('.pricing-mini.v7-recommended,.build-card.is-featured').forEach(card=>{
        if(card.querySelector('.v9-plan-guide'))return;
        const monthly=/2,599|3,999|5,999|monthly/i.test(card.textContent);
        const guide=document.createElement('div');
        guide.className='v9-plan-guide';
        guide.setAttribute('aria-hidden','true');
        guide.innerHTML=monthly?'<span>ongoing</span><span>iterative</span><span>monthly</span>':'<span>scoped</span><span>launch-ready</span><span>one-time</span>';
        card.append(guide);
      });
    }
  }

  class FounderNoteV9{
    constructor(){
      const heading=document.querySelector('.founder-preview .section-heading');
      if(!heading||heading.querySelector('.v9-founder-note'))return;
      const note=document.createElement('div');
      note.className='v9-founder-note';
      note.innerHTML='<b>FOUNDER-LED</b><span>Direction, interface and implementation stay close enough to keep one point of view from brief to browser.</span>';
      heading.append(note);
    }
  }

  class ContactSignalV9{
    constructor(){
      document.querySelectorAll('.contact,.close,.plan-close,.founder-close').forEach(section=>{
        const target=section.querySelector('.close__copy,.plan-close__copy,.founder-close__copy,.scene-shell')||section.firstElementChild;
        if(!target||target.querySelector('.v9-contact-signal'))return;
        const signal=document.createElement('div');
        signal.className='v9-contact-signal';
        signal.innerHTML='<i></i><span>START WITH THE BRIEF / SHAPE THE RIGHT SCOPE</span>';
        target.prepend(signal);
      });
    }
  }

  class HoverFocusV9{
    constructor(){
      if(!fine||reduced)return;
      document.querySelectorAll('.pricing-band__grid,.care-grid,.compare-table').forEach(group=>{
        group.addEventListener('pointerover',event=>{
          const item=event.target.closest('.pricing-mini,.build-card,article,.compare-table>div');
          if(item&&group.contains(item))group.dataset.v9Hover='true';
        });
        group.addEventListener('pointerleave',()=>delete group.dataset.v9Hover);
      });
    }
  }

  class EditorialPulseV9{
    constructor(){
      const sequence=document.querySelector('[data-editorial-sequence]');
      if(!sequence)return;
      const status=sequence.querySelector('[data-editorial-status]');
      if(!status)return;
      const observer=new MutationObserver(()=>{
        sequence.dataset.v9Status=String(status.textContent||'').toLowerCase().replace(/\s*\/\s*/g,'-').replace(/\s+/g,'-');
      });
      observer.observe(status,{childList:true,subtree:true,characterData:true});
    }
  }

  class LinkArrowV9{
    constructor(){
      document.querySelectorAll('a,button').forEach(node=>{
        if(node.querySelector('span')&&/[↗→]/.test(node.textContent||''))node.classList.add('v9-arrow-action');
      });
    }
  }

  new ScrollDirectorV9();
  new ContinuityBridgesV9();
  new HeroFramingV9();
  new DisciplineRailV9();
  new WorkProofV9();
  new PricingGuideV9();
  new FounderNoteV9();
  new ContactSignalV9();
  new HoverFocusV9();
  new EditorialPulseV9();
  new LinkArrowV9();
})();
