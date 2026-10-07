import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import './scrollcraft.js';

gsap.registerPlugin(ScrollTrigger);
export async function initStudioMotion(){
 await document.fonts.ready;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const root=document.querySelector('[data-sc-root]');
 if(root&&!reduced.matches)window.ScrollCraft.mount(root);
 const scene=document.querySelector('[data-sculpture]');
 function reading(){const sections=[...document.querySelectorAll('.terms-section')],nav=document.querySelector('.terms-layout>nav');if(!nav)return;ScrollTrigger.create({trigger:'.terms-sections',start:'top center',end:'bottom bottom',onUpdate:s=>nav.style.setProperty('--reading',s.progress)});sections.forEach(section=>ScrollTrigger.create({trigger:section,start:'top 35%',end:'bottom 35%',onToggle:s=>{if(s.isActive)nav.querySelectorAll('a').forEach(a=>a.setAttribute('aria-current',String(a.hash==='#'+section.id)))}}))}
 reading();
 if(reduced.matches)return;
 const mm=gsap.matchMedia();
 mm.add('(prefers-reduced-motion:no-preference)',context=>{
  let roomRefresh=0;
  const refreshRoom=()=>{cancelAnimationFrame(roomRefresh);roomRefresh=requestAnimationFrame(()=>ScrollTrigger.refresh())};
  const rooms=[...document.querySelectorAll('.page-home main>section:not(.studio-hero),.page-home .premium-footer')];
  // Rendering a cached room does not necessarily change its geometry. Refresh
  // trigger measurements only when its border box actually changes, using the
  // observer's already-computed sizes rather than forcing another layout read.
  let roomResize=null;
  if('ResizeObserver' in window){
   const sizes=new WeakMap();
   roomResize=new ResizeObserver(entries=>{
    let changed=false;
    for(const entry of entries){
     const box=entry.borderBoxSize?.[0]||entry.borderBoxSize;
     const size={width:box?.inlineSize??entry.contentRect.width,height:box?.blockSize??entry.contentRect.height};
     const previous=sizes.get(entry.target);
     if(previous&&(Math.abs(size.width-previous.width)>.5||Math.abs(size.height-previous.height)>.5))changed=true;
     sizes.set(entry.target,size);
    }
    if(changed)refreshRoom();
   });
   rooms.forEach(room=>roomResize.observe(room,{box:'border-box'}));
  }else rooms.forEach(room=>room.addEventListener('contentvisibilityautostatechange',refreshRoom));
  const arrivals=new WeakMap();
  const arrivalObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;arrivalObserver.unobserve(entry.target);arrivals.get(entry.target)?.()}},{rootMargin:'0px 0px -8% 0px'});
  const onArrival=(el,run)=>{arrivals.set(el,run);arrivalObserver.observe(el)};
  document.querySelectorAll('[data-letters]:not([data-opening]):not([data-motion-text])').forEach(el=>{
   const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())if(walker.currentNode.textContent.trim())nodes.push(walker.currentNode);
   for(const node of nodes){const frag=document.createDocumentFragment();node.textContent.split(/(\s+)/).forEach(word=>{if(!word.trim()){frag.append(document.createTextNode(word));return}const clip=document.createElement('span');clip.className='word-clip';const span=document.createElement('span');span.className='moving-word';span.textContent=word;clip.append(span);frag.append(clip)});node.replaceWith(frag)}
   el.querySelectorAll('.moving-word').forEach(word=>word.style.transform='translateY(115%) rotate(3deg)');
   onArrival(el,()=>gsap.fromTo(el.querySelectorAll('.moving-word'),{yPercent:115,y:0,rotate:3},{yPercent:0,y:0,rotate:0,duration:1.05,stagger:.055,ease:'power3.out',clearProps:'transform'}));
  });
  document.querySelectorAll('[data-enter]:not([data-opening]):not([data-motion-text])').forEach(el=>{el.style.opacity='0';el.style.transform='translate3d(0,35px,0)';onArrival(el,()=>gsap.to(el,{y:0,opacity:1,duration:.85,ease:'power3.out',clearProps:'transform,opacity'}))});
  const revealParallax=context.add('revealParallax',el=>{
   const amount=Number(el.dataset.parallax)||-.1;
   gsap.fromTo(el,{y:()=>-innerHeight*amount*.5},{y:()=>innerHeight*amount*.5,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:.55,invalidateOnRefresh:true}});
  });
  // GSAP reads a target's computed transform while creating its tween. Keep
  // distant content-visibility rooms asleep by observing their reserved outer
  // boxes, then create the original parallax before the reader reaches them.
  // Visible inner-page artwork retains immediate setup and the media context
  // also owns deferred tweens, so reduced motion reverts them normally.
  const parallaxRooms=new Map();
  const parallaxApproach=new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(!entry.isIntersecting)continue;
    parallaxApproach.unobserve(entry.target);
    if(!reduced.matches)parallaxRooms.get(entry.target)?.forEach(revealParallax);
    parallaxRooms.delete(entry.target);
   }
  },{rootMargin:'300px'});
  document.querySelectorAll('[data-parallax]').forEach(el=>{
   const room=el.closest('.page-home main>section:not(.studio-hero)');
   if(!room){revealParallax(el);return}
   if(!parallaxRooms.has(room)){parallaxRooms.set(room,[]);parallaxApproach.observe(room)}
   parallaxRooms.get(room).push(el);
  });
  document.querySelectorAll('[data-line]').forEach(path=>{path.style.opacity='0';onArrival(path,()=>{const length=path.getTotalLength();gsap.fromTo(path,{opacity:1,strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,duration:1.15,ease:'power2.out'})})});
  document.querySelectorAll('[data-process]').forEach(process=>{const items=[...process.querySelectorAll('[data-step]')];items.forEach((item,i)=>{item.style.opacity='0';item.style.transform='translate3d(0,40px,0)';onArrival(item,()=>gsap.to(item,{y:0,opacity:1,duration:.8,delay:matchMedia('(min-width:761px)').matches?i*.09:0,ease:'power3.out',clearProps:'transform,opacity'}))})});
  const work=document.querySelector('.work-exhibit');
  if(work){
   const desktop=document.querySelector('.work-desktop'),phone=document.querySelector('.work-mobile'),state={progress:0};
   const pose=p=>{work.dataset.proofProgress=p.toFixed(3);gsap.set(desktop,{rotateY:innerWidth<761?0:-22*(1-p),rotateX:13*(1-p),scale:.68+.32*p,rotateZ:-3*(1-p)});gsap.set(phone,{yPercent:60*(1-p),rotateZ:10-15*p,scale:.85+.15*p})};
   const follow=gsap.quickTo(state,'progress',{duration:.3,ease:'power2.out',onUpdate:()=>pose(state.progress)});
   ScrollTrigger.create({trigger:work,start:'top top',end:()=>`+=${work.offsetHeight-innerHeight}`,onUpdate:s=>follow(s.progress),onRefresh:s=>{follow.tween.pause();state.progress=s.progress;pose(s.progress)}});
  }
  const hero=document.querySelector('.studio-hero');
  if(hero){
   const intro=hero.querySelector('.hero-intro'),next=hero.querySelector('.hero-next');
   const blend=(a,b,p)=>{const t=Math.max(0,Math.min(1,(p-a)/(b-a)));return t*t*(3-2*t)};
   const lastValues={};
   const pose=p=>{
    const leave=blend(.1,.34,p),assembly=Math.max(0,Math.min(1,(p-.18)/.4)),arrive=blend(.53,.65,p),close=blend(.965,1,p),handoff=blend(.86,.96,p),nextOpacity=arrive;
    const values={'--intro-opacity':1-leave,'--intro-y':`${leave*-70}px`,'--next-opacity':nextOpacity,'--next-y':`${(1-arrive)*25}px`,'--object-x':'0px','--object-y':`${close*-12}px`,'--object-scale':1+leave*.08-close*.04,'--object-opacity':.88+leave*.12,'--halo-rise':`${p*-100}px`,'--halo-slide':`${p*-75}px`,'--control-opacity':1-blend(.18,.38,p),'--assembly-progress':assembly,'--veil-opacity':1-leave,'--handoff-opacity':handoff,'--handoff-y':`${(1-handoff)*72}px`,'--handoff-line':handoff};
    Object.entries(values).forEach(([key,value])=>{if(lastValues[key]!==value){hero.style.setProperty(key,value);lastValues[key]=value}});hero.dataset.heroProgress=p.toFixed(3);hero.dataset.assemblyProgress=assembly.toFixed(3);
    if(intro){intro.inert=leave>.96;intro.setAttribute('aria-hidden',String(leave>.96))}
    if(next){const active=nextOpacity>.08;next.inert=!active;next.setAttribute('aria-hidden',String(!active));next.classList.toggle('is-active',active)}
    if(scene){scene.dispatchEvent(new CustomEvent('studio:travel',{detail:{progress:p}}));scene.dispatchEvent(new CustomEvent('studio:assembly',{detail:{progress:assembly}}))}
   };
   const state={progress:0};
   const follow=gsap.quickTo(state,'progress',{duration:.24,ease:'power2.out',onUpdate:()=>pose(state.progress)});
   ScrollTrigger.create({trigger:hero,start:'top top',end:()=>`+=${Math.max(1,hero.offsetHeight-innerHeight)}`,onUpdate:s=>follow(s.progress),onRefresh:s=>{follow.tween.pause();state.progress=s.progress;pose(s.progress)}});
  }
  // The footer room has content-visibility:auto. Reading its descendant's
  // transform at first scroll forces that distant room to render early.
  // Observe the room's reserved box, then keep the original reveal in the
  // media context so preference changes also revert this deferred tween.
  let footerApproach=null;
  const footerMark=document.querySelector('.footer-mark');
  if(footerMark){
   const revealFooter=context.add('revealFooter',()=>gsap.from(footerMark,{yPercent:8,opacity:.6,ease:'none',scrollTrigger:{trigger:footerMark,start:'top bottom',end:'bottom bottom',scrub:.7}}));
   footerApproach=new IntersectionObserver(entries=>{
    if(entries.some(entry=>entry.isIntersecting)){
     footerApproach.disconnect();
     if(!reduced.matches)revealFooter();
    }
   },{rootMargin:'300px'});
   footerApproach.observe(footerMark.closest('.premium-footer')||footerMark);
  }
  return()=>{
   arrivalObserver.disconnect();parallaxApproach.disconnect();parallaxRooms.clear();footerApproach?.disconnect();cancelAnimationFrame(roomRefresh);roomResize?.disconnect();rooms.forEach(room=>room.removeEventListener('contentvisibilityautostatechange',refreshRoom));
   if(hero){hero.removeAttribute('style');hero.removeAttribute('data-hero-progress');hero.removeAttribute('data-assembly-progress');hero.querySelector('.hero-intro')?.removeAttribute('inert');hero.querySelector('.hero-intro')?.removeAttribute('aria-hidden');const next=hero.querySelector('.hero-next');if(next){next.inert=true;next.setAttribute('aria-hidden','true')}}
   document.querySelectorAll('[data-enter],[data-step],.moving-word').forEach(el=>{el.style.removeProperty('transform');el.style.removeProperty('opacity')});
   document.querySelectorAll('[data-line]').forEach(path=>{path.style.removeProperty('opacity');path.style.removeProperty('stroke-dasharray');path.style.removeProperty('stroke-dashoffset')});
  };
 });
 ScrollTrigger.refresh();
 window.addEventListener('pageshow',event=>{if(event.persisted)ScrollTrigger.refresh()});
 window.addEventListener('studio:category',()=>{ScrollTrigger.refresh();gsap.fromTo('.plan-category.is-selected .offer',{y:18,opacity:.5},{y:0,opacity:1,duration:.4,stagger:.05,clearProps:'transform,opacity'})});

}
