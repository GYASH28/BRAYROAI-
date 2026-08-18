(() => {
  const polish=document.createElement('link');
  polish.rel='stylesheet';
  polish.href='/polish.css';
  document.head.appendChild(polish);

  const experienceStyles=document.createElement('link');
  experienceStyles.rel='stylesheet';
  experienceStyles.href='/experience.css';
  document.head.appendChild(experienceStyles);

  const experienceFixes=document.createElement('link');
  experienceFixes.rel='stylesheet';
  experienceFixes.href='/experience-fixes.css';
  document.head.appendChild(experienceFixes);

  /* Accessibility finish: keep decorative background type out of the rendered text layer and lift footer microcopy above AA contrast. */
  const finish=document.createElement('style');
  finish.textContent='.engage-word{display:none!important}.footer,.footer .shell,.footer .shell>*{color:#A5AAB3!important}';
  document.head.appendChild(finish);

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer:fine)').matches;
  const q = (selector, root=document) => root.querySelector(selector);
  const qa = (selector, root=document) => [...root.querySelectorAll(selector)];
  const clamp = (min,value,max) => Math.min(max,Math.max(min,value));

  const button=q('[data-menu-button]');
  const menu=q('[data-mobile-menu]');
  if(button&&menu){
    const focusables=()=>qa('a[href],button:not([disabled])',menu).filter(el=>el.offsetParent!==null);
    document.addEventListener('keydown',event=>{
      if(event.key!=='Tab'||button.getAttribute('aria-expanded')!=='true') return;
      const items=focusables();
      if(!items.length) return;
      const first=items[0],last=items[items.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    });
    addEventListener('resize',()=>{
      if(innerWidth>760&&button.getAttribute('aria-expanded')==='true') button.click();
    },{passive:true});
  }

  const navLinks=qa('.desktop-nav a[href^="#"]');
  const chapters=qa('.chapter[id]');
  if('IntersectionObserver' in window){
    const sectionObserver=new IntersectionObserver(entries=>{
      const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!visible) return;
      const id=visible.target.id;
      navLinks.forEach(link=>link.classList.toggle('is-active',link.getAttribute('href')===`#${id}`));
      visible.target.classList.add('chapter-entered');
    },{threshold:[.18,.35,.55],rootMargin:'-14% 0px -42% 0px'});
    chapters.forEach(section=>sectionObserver.observe(section));
  }else chapters.forEach(section=>section.classList.add('chapter-entered'));

  qa('[data-stagger]').forEach(group=>[...group.children].forEach((child,index)=>child.style.setProperty('--stagger-delay',`${index*70}ms`)));

  if(finePointer&&!reduced){
    qa('.interactive-surface').forEach(surface=>surface.addEventListener('pointermove',event=>{
      const r=surface.getBoundingClientRect();
      surface.style.setProperty('--mx',`${event.clientX-r.left}px`);
      surface.style.setProperty('--my',`${event.clientY-r.top}px`);
    },{passive:true}));
  }

  const capSteps=qa('[data-cap-step]');
  const capProgress=q('[data-capability-progress]');
  const paintCapabilityProgress=()=>{
    if(!capProgress||!capSteps.length) return;
    const active=Math.max(0,capSteps.findIndex(step=>step.classList.contains('is-active')));
    capProgress.style.transform=`scaleX(${(active+1)/capSteps.length})`;
  };
  if(capSteps.length){
    const capMutation=new MutationObserver(paintCapabilityProgress);
    capSteps.forEach(step=>capMutation.observe(step,{attributes:true,attributeFilter:['class']}));
    capSteps.forEach(step=>step.addEventListener('click',()=>{
      if(innerWidth<=1050) return;
      const r=step.getBoundingClientRect();
      const target=Math.max(0,scrollY+r.top+r.height/2-innerHeight*.52);
      scrollTo({top:target,behavior:reduced?'auto':'smooth'});
    }));
    paintCapabilityProgress();
  }

  const processRows=qa('.process-row');
  let processFrame=0;
  const paintProcess=()=>{
    processFrame=0;
    if(!processRows.length) return;
    const focus=innerHeight*.54;
    let best=null,bestDistance=Infinity;
    processRows.forEach(row=>{
      const r=row.getBoundingClientRect();
      const distance=Math.abs((r.top+r.height/2)-focus);
      if(r.bottom>0&&r.top<innerHeight&&distance<bestDistance){best=row;bestDistance=distance;}
    });
    processRows.forEach(row=>row.classList.toggle('is-current',row===best));
  };
  const scheduleProcess=()=>{if(!processFrame) processFrame=requestAnimationFrame(paintProcess)};
  if(processRows.length){addEventListener('scroll',scheduleProcess,{passive:true});addEventListener('resize',scheduleProcess,{passive:true});scheduleProcess()}

  const driftItems=[{el:q('.feature-project__media'),factor:16},{el:q('.about-portrait img'),factor:13},{el:q('.studio-standard'),factor:7}].filter(item=>item.el);
  let driftFrame=0;
  const paintDrift=()=>{
    driftFrame=0;
    if(reduced) return;
    driftItems.forEach(({el,factor})=>{
      const r=el.getBoundingClientRect();
      if(r.bottom<0||r.top>innerHeight) return;
      const progress=clamp(-1,(innerHeight/2-(r.top+r.height/2))/innerHeight,1);
      if(el.matches('img')) el.style.translate=`0 ${progress*factor}px`; else el.style.setProperty('--scroll-drift',`${progress*factor}px`);
    });
  };
  const scheduleDrift=()=>{if(!driftFrame) driftFrame=requestAnimationFrame(paintDrift)};
  if(driftItems.length&&!reduced){addEventListener('scroll',scheduleDrift,{passive:true});addEventListener('resize',scheduleDrift,{passive:true});scheduleDrift()}

  const revealFallback=()=>qa('.reveal:not(.in-view)').forEach(el=>{
    const r=el.getBoundingClientRect();
    if(r.top<innerHeight*1.15&&r.bottom>-100) el.classList.add('in-view');
  });
  let revealFrame=0;
  const scheduleRevealFallback=()=>{if(!revealFrame) revealFrame=requestAnimationFrame(()=>{revealFrame=0;revealFallback()})};
  addEventListener('scroll',scheduleRevealFallback,{passive:true});
  addEventListener('resize',scheduleRevealFallback,{passive:true});
  addEventListener('load',revealFallback,{once:true});
  setTimeout(revealFallback,1400);

  const experienceScript=document.createElement('script');
  experienceScript.src='/experience.js';
  experienceScript.defer=true;
  document.body.appendChild(experienceScript);
})();
