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
    if(open)menu.querySelector('[data-global-close]')?.focus();else priorFocus?.focus?.();
  };
  toggle.addEventListener('click',()=>setOpen(menu.hidden));
  menu.querySelector('[data-global-close]')?.addEventListener('click',()=>setOpen(false));
  menu.addEventListener('click',event=>{if(event.target.closest('a'))setOpen(false)});
  addEventListener('keydown',event=>{
    if(menu.hidden)return;
    if(event.key==='Escape'){event.preventDefault();setOpen(false);return}
    if(event.key!=='Tab')return;
    const focusables=[...menu.querySelectorAll('a,button')].filter(node=>!node.hidden);
    if(!focusables.length)return;
    const first=focusables[0],last=focusables.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  });
  const update=()=>{
    frame=0;
    if(!progress)return;
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    progress.style.transform=`scaleX(${Math.min(1,Math.max(0,scrollY/max)).toFixed(4)})`;
  };
  addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(update)},{passive:true});
  addEventListener('resize',()=>{if(!frame)frame=requestAnimationFrame(update)},{passive:true});
  addEventListener('pageshow',()=>{if(scrollY>0&&!frame)frame=requestAnimationFrame(update)});
  // The page starts at progress zero. Measuring scrollHeight here forces a
  // synchronous layout of every chapter before the first frame; the scroll
  // handler updates the indicator once the visitor actually moves.
  const chapter=[...document.querySelectorAll('.chapter-nav a[href^="#"]')];
  const targets=chapter.map(link=>({link,node:document.getElementById(link.hash.slice(1))})).filter(item=>item.node);
  const setChapterActive=active=>chapter.forEach(link=>{
    const current=link===active;
    link.classList.toggle('is-active',current);
    if(current)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
  });
  const syncInitialChapter=()=>{
    if(!chapter.length)return;
    const hash=location.hash;
    const preferred=hash?chapter.find(link=>link.hash===hash):chapter[0];
    const current=chapter.find(link=>link.classList.contains('is-active'))||preferred;
    if(current)setChapterActive(current);
  };
  syncInitialChapter();
  addEventListener('hashchange',()=>{
    const active=chapter.find(link=>link.hash===location.hash);
    if(!active)return;
    setChapterActive(active);
  });
  if('IntersectionObserver'in window&&targets.length){
    const observer=new IntersectionObserver(entries=>{
      const current=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!current)return;
      setChapterActive(chapter.find(link=>link.hash==='#'+current.target.id));
    },{rootMargin:'-24% 0px -55% 0px',threshold:[0,.15,.45]});
    targets.forEach(item=>observer.observe(item.node));
  }
  document.querySelectorAll('.chapter-nav a[href^="#"],.global-footer__base a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{
    const target=document.getElementById(link.hash.slice(1));
    if(!target)return;
    event.preventDefault();
    if(!link.matches('[data-back-to-top]'))history.pushState(null,'',link.hash);
    setChapterActive(chapter.includes(link)?link:chapter[0]);
    target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  }));
  document.querySelectorAll('[data-footer-rae]').forEach(button=>button.addEventListener('click',()=>document.querySelector('[data-rae-toggle],[data-rae-shell]')?.click()));
  const footer=document.querySelector('.site-footer,.global-footer');
  if(footer&&'IntersectionObserver'in window){
    const observer=new IntersectionObserver(entries=>document.body.classList.toggle('rae-footer-visible',entries[0].isIntersecting));
    observer.observe(footer);
  }
})();


/* BRAYROAI V25 / restore compact-on-scroll header without disturbing menu state. */
(() => {
  const nav=document.querySelector('[data-global-nav]');
  const chapter=document.querySelector('.chapter-nav');
  if(!nav)return;
  let frame=0,compact=null;
  const apply=()=>{
    frame=0;
    const next=scrollY>72;
    if(next===compact)return;
    compact=next;
    nav.classList.toggle('is-compact',next);
    document.documentElement.classList.toggle('global-nav-compact',next);
    chapter?.classList.toggle('is-nav-compact',next);
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(apply)};
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  addEventListener('pageshow',apply);
  addEventListener('popstate',()=>requestAnimationFrame(apply));
  apply();
})();


/* BRAYROAI V27 / keep the active chapter centered in the compact mobile rail. */
(() => {
  const track=document.querySelector('.chapter-nav>div');
  if(!track)return;
  const links=[...track.querySelectorAll('a')];
  if(!links.length)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0,last=null;
  const center=()=>{
    frame=0;
    if(innerWidth>700)return;
    const active=track.querySelector('a.is-active');
    if(!active||active===last)return;
    last=active;
    active.scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'nearest',inline:'center'});
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(center)};
  const observer=new MutationObserver(schedule);
  links.forEach(link=>observer.observe(link,{attributes:true,attributeFilter:['class']}));
  addEventListener('resize',schedule,{passive:true});
  addEventListener('pageshow',schedule);
  schedule();
})();
