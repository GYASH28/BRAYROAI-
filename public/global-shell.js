(() => {
  const toggle=document.querySelector('[data-global-toggle]');
  const menu=document.querySelector('[data-global-menu]');
  const nav=document.querySelector('[data-global-nav]');
  const progress=document.querySelector('[data-global-progress]');
  if(!toggle||!menu||!nav)return;
  let priorFocus=null,frame=0;
  const setOpen=(open)=>{
    if(open===!menu.hidden)return;
    if(open)priorFocus=document.activeElement;
    menu.hidden=!open;
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');
    document.documentElement.classList.toggle('global-menu-open',open);
    if(open)menu.querySelector('a')?.focus();else priorFocus?.focus?.();
  };
  toggle.addEventListener('click',()=>setOpen(menu.hidden));
  menu.addEventListener('click',event=>{if(event.target.closest('a'))setOpen(false)});
  addEventListener('keydown',event=>{
    if(menu.hidden)return;
    if(event.key==='Escape'){event.preventDefault();setOpen(false);return}
    if(event.key!=='Tab')return;
    const focusables=[toggle,...menu.querySelectorAll('a,button')];
    const first=focusables[0],last=focusables.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  });
  addEventListener('resize',()=>{if(innerWidth>1280&&!menu.hidden)setOpen(false)},{passive:true});
  const update=()=>{
    frame=0;
    if(!progress)return;
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    progress.style.transform=`scaleX(${Math.min(1,Math.max(0,scrollY/max)).toFixed(4)})`;
  };
  addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(update)},{passive:true});
  addEventListener('resize',()=>{if(!frame)frame=requestAnimationFrame(update)},{passive:true});
  // The page starts at progress zero. Measuring scrollHeight here forces a
  // synchronous layout of every chapter before the first frame; the scroll
  // handler updates the indicator once the visitor actually moves.
  const chapter=[...document.querySelectorAll('.chapter-nav a[href^="#"]')];
  const targets=chapter.map(link=>({link,node:document.getElementById(link.hash.slice(1))})).filter(item=>item.node);
  if('IntersectionObserver'in window&&targets.length){
    const observer=new IntersectionObserver(entries=>{
      const current=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!current)return;
      chapter.forEach(link=>link.classList.toggle('is-active',link.hash==='#'+current.target.id));
    },{rootMargin:'-24% 0px -55% 0px',threshold:[0,.15,.45]});
    targets.forEach(item=>observer.observe(item.node));
  }
  document.querySelectorAll('.chapter-nav a[href^="#"],.global-footer__base a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{
    const target=document.getElementById(link.hash.slice(1));
    if(!target)return;
    event.preventDefault();
    history.pushState(null,'',link.hash);
    target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  }));
  document.querySelectorAll('[data-footer-rae]').forEach(button=>button.addEventListener('click',()=>document.querySelector('[data-rae-toggle],[data-rae-shell]')?.click()));
  const footer=document.querySelector('.site-footer,.global-footer');
  if(footer&&'IntersectionObserver'in window){
    const observer=new IntersectionObserver(entries=>document.body.classList.toggle('rae-footer-visible',entries[0].isIntersecting));
    observer.observe(footer);
  }
})();
