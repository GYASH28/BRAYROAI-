const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer=matchMedia('(hover:hover) and (pointer:fine)').matches;
const clamp=(min,value,max)=>Math.min(max,Math.max(min,value));

class RevealDirector{
  constructor(){
    this.items=[...document.querySelectorAll('[data-reveal]')];
    if(reducedMotion||!('IntersectionObserver'in window)){
      this.items.forEach(item=>item.classList.add('is-visible'));return;
    }
    this.groups=new Map();
    this.items.forEach(item=>{
      const target=item.closest('section,[data-scene],[data-plan-scene],[data-founder-scene]')||item;
      if(!this.groups.has(target))this.groups.set(target,[]);
      this.groups.get(target).push(item);
    });
    this.observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        const items=this.groups.get(entry.target)||[entry.target];
        requestAnimationFrame(()=>items.forEach(item=>item.classList.add('is-visible')));
        this.observer.unobserve(entry.target);
      });
    },{threshold:.02,rootMargin:'12% 0px 18% 0px'});
    this.groups.forEach((_items,target)=>this.observer.observe(target));
  }
}

class MobileMenu{
  constructor(){
    this.button=document.querySelector('[data-menu-button]');
    this.menu=document.querySelector('[data-mobile-menu]');
    if(!this.button||!this.menu)return;
    this.button.addEventListener('click',()=>this.setOpen(this.button.getAttribute('aria-expanded')!=='true'));
    this.menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>this.setOpen(false)));
    addEventListener('keydown',event=>{if(event.key==='Escape')this.setOpen(false)});
  }
  setOpen(open){
    this.button.setAttribute('aria-expanded',String(open));
    this.menu.setAttribute('aria-hidden',String(!open));
    this.menu.classList.toggle('open',open);
    document.body.classList.toggle('menu-open',open);
  }
}

class ColourDirector{
  constructor(){
    this.stage=document.querySelector('[data-colour-stage]');
    this.button=document.querySelector('[data-colour-toggle]');
    this.locked=false;this.rect=null;
    if(!this.stage||!this.button)return;
    this.button.addEventListener('click',()=>this.setLocked(!this.locked));
    if(!finePointer||reducedMotion)return;
    this.stage.addEventListener('pointerenter',event=>{this.rect=this.stage.getBoundingClientRect();this.stage.classList.add('is-hovering');this.move(event)});
    this.stage.addEventListener('pointerleave',()=>{if(!this.locked)this.stage.classList.remove('is-hovering')});
    this.stage.addEventListener('pointermove',event=>this.move(event),{passive:true});
    addEventListener('resize',()=>{this.rect=null},{passive:true});
  }
  move(event){
    const rect=this.rect||(this.rect=this.stage.getBoundingClientRect());
    const x=clamp(0,(event.clientX-rect.left)/Math.max(rect.width,1),1);
    const y=clamp(0,(event.clientY-rect.top)/Math.max(rect.height,1),1);
    this.stage.style.setProperty('--colour-x',`${(x*100).toFixed(2)}%`);
    this.stage.style.setProperty('--colour-y',`${(y*100).toFixed(2)}%`);
    this.stage.style.setProperty('--pointer-x',(x-.5).toFixed(3));
    this.stage.style.setProperty('--pointer-y',(y-.5).toFixed(3));
  }
  setLocked(locked){
    this.locked=locked;
    this.stage.classList.toggle('is-locked',locked);
    this.stage.classList.toggle('is-hovering',locked||this.stage.matches(':hover'));
    this.stage.dataset.scVerifyState=locked?'colour:locked':'colour:mono';
    this.button.setAttribute('aria-pressed',String(locked));
    const label=this.button.querySelector('span');if(label)label.textContent=locked?'Release the colour':'Hold the colour';
  }
}

class WorkFocus{
  constructor(){
    this.stage=document.querySelector('[data-work-stage]');
    this.button=document.querySelector('[data-work-toggle]');
    if(!this.stage||!this.button)return;
    this.button.addEventListener('click',()=>this.toggle());
  }
  toggle(){
    const mobile=!this.stage.classList.contains('is-mobile');
    this.stage.classList.toggle('is-mobile',mobile);
    this.stage.dataset.scVerifyState=mobile?'work:mobile':'work:desktop';
    this.button.setAttribute('aria-pressed',String(mobile));
    const label=this.button.querySelector('i');if(label)label.textContent=mobile?'MOBILE':'DESKTOP';
  }
}

class PageProgress{
  constructor(){
    this.progress=document.querySelector('[data-progress]');
    this.nav=document.querySelector('[data-site-nav]');
    this.frame=0;
    this.schedule=this.schedule.bind(this);
    addEventListener('scroll',this.schedule,{passive:true});
    addEventListener('resize',this.schedule,{passive:true});
    addEventListener('pageshow',event=>{if(event.persisted)this.schedule()},{passive:true});
    this.bindAnchors();
  }
  bindAnchors(){
    document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{
      const href=link.getAttribute('href');
      if(!href||href==='#')return;
      const target=document.querySelector(href);if(!target)return;
      event.preventDefault();target.scrollIntoView({behavior:reducedMotion?'auto':'smooth',block:'start'});
    }));
  }
  schedule(){if(!this.frame)this.frame=requestAnimationFrame(()=>this.paint())}
  paint(){
    this.frame=0;
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    const p=clamp(0,scrollY/max,1);
    if(this.progress)this.progress.style.transform=`scaleX(${p.toFixed(4)})`;
    if(this.nav){const scene=document.body.dataset.v20Scene||document.body.dataset.v19Scene||'hero';this.nav.dataset.scVerifyState=`scene:${scene}:${Math.round(p*100)}`}
  }
}

const startReveals=()=>{
  let mounted=false;
  const passiveEvents=['scroll','wheel','touchstart','pointerdown'];
  const cleanup=()=>{
    passiveEvents.forEach(type=>removeEventListener(type,mount));
    removeEventListener('keydown',mount);
    removeEventListener('hashchange',mount);
  };
  const mount=()=>{
    if(mounted)return;
    mounted=true;cleanup();new RevealDirector();
  };
  passiveEvents.forEach(type=>addEventListener(type,mount,{once:true,passive:true}));
  addEventListener('keydown',mount,{once:true});
  addEventListener('hashchange',mount,{once:true});
  if(scrollY>0||location.hash)queueMicrotask(mount);
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',startReveals,{once:true});
else startReveals();
new MobileMenu();
new ColourDirector();
new WorkFocus();
new PageProgress();
