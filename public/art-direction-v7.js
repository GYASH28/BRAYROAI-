(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (min, value, max) => Math.min(max, Math.max(min, value));
  const body = document.body;

  if (!document.querySelector('link[data-art-direction-v7-contrast]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/art-direction-v7-contrast.css';
    link.dataset.artDirectionV7Contrast = '';
    document.head.append(link);
  }

  body.classList.add('v7-ready');

  class NavCompact {
    constructor(){
      this.raf=0;
      addEventListener('scroll',()=>this.schedule(),{passive:true});
      this.schedule();
    }
    schedule(){if(!this.raf)this.raf=requestAnimationFrame(()=>this.paint());}
    paint(){this.raf=0;body.classList.toggle('v7-nav-compact',scrollY>78);}
  }

  class HeroMeta {
    constructor(){
      const stage=document.querySelector('.hero__stage');
      if(!stage||stage.querySelector('.v7-hero-meta'))return;
      const meta=document.createElement('div');
      meta.className='v7-hero-meta';
      meta.setAttribute('aria-hidden','true');
      meta.innerHTML='<span>PUNE / INDIA</span><span>DESIGN + ENGINEERING + AI</span><span>FOUNDER-LED</span>';
      stage.append(meta);
    }
  }

  class WorkFrame {
    constructor(){
      this.stage=document.querySelector('.work__canvas');
      this.desktop=document.querySelector('.work__desktop');
      if(!this.stage||!this.desktop)return;

      if(!this.desktop.querySelector('.v7-browserbar')){
        const bar=document.createElement('div');
        bar.className='v7-browserbar';
        bar.setAttribute('aria-hidden','true');
        bar.innerHTML='<i></i><i></i><i></i><span>FAKHRIYARNS.VERCEL.APP</span>';
        this.desktop.prepend(bar);
      }

      if(!this.stage.querySelector('.v7-work-proof')){
        const proof=document.createElement('div');
        proof.className='v7-work-proof';
        proof.setAttribute('aria-hidden','true');
        proof.innerHTML='<span>ROLE<b>DIRECTION + BUILD</b></span><span>FORMAT<b>RESPONSIVE WEB</b></span><span>STATUS<b>LIVE PROJECT</b></span>';
        this.stage.append(proof);
      }

      if(!fine||reduced)return;
      let raf=0,rx=0,ry=0;
      const paint=()=>{
        raf=0;
        this.desktop.style.setProperty('--v7-tilt-x',`${rx.toFixed(2)}deg`);
        this.desktop.style.setProperty('--v7-tilt-y',`${ry.toFixed(2)}deg`);
      };
      this.stage.addEventListener('pointermove',event=>{
        const r=this.stage.getBoundingClientRect();
        const x=clamp(-1,((event.clientX-r.left)/Math.max(r.width,1)-.5)*2,1);
        const y=clamp(-1,((event.clientY-r.top)/Math.max(r.height,1)-.5)*2,1);
        ry=x*1.15;rx=y*-0.8;
        if(!raf)raf=requestAnimationFrame(paint);
      },{passive:true});
      this.stage.addEventListener('pointerleave',()=>{
        rx=0;ry=0;if(!raf)raf=requestAnimationFrame(paint);
      });
    }
  }

  class RecommendedPlans {
    constructor(){
      document.querySelectorAll('.pricing-band').forEach(band=>{
        const cards=[...band.querySelectorAll('.pricing-mini')];
        const card=cards[1];
        if(!card)return;
        card.classList.add('v7-recommended');
        if(!card.querySelector('.v7-reco-badge')){
          const badge=document.createElement('span');
          badge.className='v7-reco-badge';
          badge.textContent='RECOMMENDED';
          card.append(badge);
        }
      });

      document.querySelectorAll('.build-card.is-featured').forEach(card=>{
        if(card.querySelector('.v7-reco-badge'))return;
        const badge=document.createElement('span');
        badge.className='v7-reco-badge';
        badge.textContent='RECOMMENDED';
        badge.setAttribute('aria-hidden','true');
        card.append(badge);
      });
    }
  }

  class FounderEditorial {
    constructor(){
      const preview=document.querySelector('.founder-preview .section-heading');
      if(preview&&!preview.querySelector('.v7-founder-kicker')){
        const kicker=document.createElement('span');
        kicker.className='v7-founder-kicker';
        kicker.textContent='A SMALL STUDIO BY DESIGN';
        preview.prepend(kicker);
      }
    }
  }

  class EntryChoreography {
    constructor(){
      this.targets=[...document.querySelectorAll([
        '.pricing-band__head',
        '.plan-family__heading',
        '.v7-work-proof',
        '.founder-preview__portrait',
        '.method__image',
        '.care-grid',
        '.terms-intro'
      ].join(','))];
      this.targets.forEach(node=>node.dataset.v7Enter='');
      if(reduced||!('IntersectionObserver' in window)){
        this.targets.forEach(node=>node.classList.add('v7-entered'));
        return;
      }
      const observer=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){entry.target.classList.add('v7-entered');observer.unobserve(entry.target);}
        });
      },{threshold:.18,rootMargin:'0px 0px -8% 0px'});
      this.targets.forEach(node=>observer.observe(node));
    }
  }

  class SectionHairlines {
    constructor(){
      this.sections=[...document.querySelectorAll('.scene,.plan-scene,.founder-scene,.terms-section')]
        .filter(section=>!section.classList.contains('hero')&&!section.classList.contains('plans-hero')&&!section.classList.contains('founder-hero'));
      this.sections.forEach(section=>{
        if(section.querySelector(':scope > .v7-hairline'))return;
        const line=document.createElement('i');
        line.className='v7-hairline';
        line.setAttribute('aria-hidden','true');
        section.prepend(line);
      });
      if(reduced||!('IntersectionObserver' in window)){
        this.sections.forEach(section=>section.style.setProperty('--v7-line','1'));
        return;
      }
      const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
        entry.target.style.setProperty('--v7-line',entry.isIntersecting?'1':'0');
      }),{threshold:.08,rootMargin:'-5% 0px -5% 0px'});
      this.sections.forEach(section=>observer.observe(section));
    }
  }

  class WorkDialogPolish {
    constructor(){
      const dialog=document.querySelector('.m6-case-dialog');
      if(!dialog)return;
      const copy=dialog.querySelector('.m6-case-dialog__copy');
      if(copy&&!copy.querySelector('.v7-dialog-meta')){
        const meta=document.createElement('div');
        meta.className='v7-dialog-meta';
        meta.setAttribute('aria-hidden','true');
        meta.innerHTML='<span>DESKTOP + MOBILE</span><span>LIVE / PRODUCTION</span>';
        copy.insertBefore(meta,copy.querySelector('.m6-case-dialog__actions'));
      }
    }
  }

  new NavCompact();
  new HeroMeta();
  new WorkFrame();
  new RecommendedPlans();
  new FounderEditorial();
  new EntryChoreography();
  new SectionHairlines();

  requestAnimationFrame(()=>new WorkDialogPolish());
})();
