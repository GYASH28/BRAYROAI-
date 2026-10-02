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
 mm.add('(prefers-reduced-motion:no-preference)',()=>{
  let roomRefresh=0;
  const refreshRoom=()=>{cancelAnimationFrame(roomRefresh);roomRefresh=requestAnimationFrame(()=>ScrollTrigger.refresh())};
  const rooms=[...document.querySelectorAll('.page-home main>section:not(.studio-hero),.page-home .premium-footer')];
  rooms.forEach(room=>room.addEventListener('contentvisibilityautostatechange',refreshRoom));
  const arrivals=new WeakMap();
  const arrivalObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;arrivalObserver.unobserve(entry.target);arrivals.get(entry.target)?.()}},{rootMargin:'0px 0px -8% 0px'});
  const onArrival=(el,run)=>{arrivals.set(el,run);arrivalObserver.observe(el)};
  document.querySelectorAll('[data-letters]:not([data-opening])').forEach(el=>{
   const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())if(walker.currentNode.textContent.trim())nodes.push(walker.currentNode);
   for(const node of nodes){const frag=document.createDocumentFragment();node.textContent.split(/(\s+)/).forEach(word=>{if(!word.trim()){frag.append(document.createTextNode(word));return}const clip=document.createElement('span');clip.className='word-clip';const span=document.createElement('span');span.className='moving-word';span.textContent=word;clip.append(span);frag.append(clip)});node.replaceWith(frag)}
   el.querySelectorAll('.moving-word').forEach(word=>word.style.transform='translateY(115%) rotate(3deg)');
   onArrival(el,()=>gsap.fromTo(el.querySelectorAll('.moving-word'),{yPercent:115,y:0,rotate:3},{yPercent:0,y:0,rotate:0,duration:1.05,stagger:.055,ease:'power3.out',clearProps:'transform'}));
  });
  document.querySelectorAll('[data-enter]:not([data-opening])').forEach(el=>{el.style.opacity='0';el.style.transform='translate3d(0,35px,0)';onArrival(el,()=>gsap.to(el,{y:0,opacity:1,duration:.85,ease:'power3.out',clearProps:'transform,opacity'}))});
  document.querySelectorAll('[data-parallax]').forEach(el=>{const amount=Number(el.dataset.parallax)||-.1;gsap.fromTo(el,{y:()=>-innerHeight*amount*.5},{y:()=>innerHeight*amount*.5,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:.55,invalidateOnRefresh:true}})});
  document.querySelectorAll('[data-line]').forEach(path=>{path.style.opacity='0';onArrival(path,()=>{const length=path.getTotalLength();gsap.fromTo(path,{opacity:1,strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,duration:1.15,ease:'power2.out'})})});
  document.querySelectorAll('[data-process]').forEach(process=>{const items=[...process.querySelectorAll('[data-step]')];items.forEach((item,i)=>{item.style.opacity='0';item.style.transform='translate3d(0,40px,0)';onArrival(item,()=>gsap.to(item,{y:0,opacity:1,duration:.8,delay:matchMedia('(min-width:761px)').matches?i*.09:0,ease:'power3.out',clearProps:'transform,opacity'}))})});
  const work=document.querySelector('.work-exhibit');
  if(work){const desktop=document.querySelector('.work-desktop'),phone=document.querySelector('.work-mobile');const isPhone=()=>innerWidth<761;ScrollTrigger.create({trigger:work,start:'top top',end:()=>`+=${work.offsetHeight-innerHeight}`,onUpdate:s=>{const p=s.progress;work.dataset.proofProgress=p.toFixed(3);gsap.set(desktop,{rotateY:isPhone()?0:-22*(1-p),rotateX:13*(1-p),scale:.68+.32*p,rotateZ:-3*(1-p)});gsap.set(phone,{yPercent:60*(1-p),rotateZ:10-15*p,scale:.85+.15*p})},onRefresh:s=>{gsap.set(desktop,{rotateY:-22*(1-s.progress),rotateX:13*(1-s.progress),scale:.68+.32*s.progress})}})}
  const hero=document.querySelector('.studio-hero');
  if(hero){
   const intro=hero.querySelector('.hero-intro'),next=hero.querySelector('.hero-next');
   const blend=(a,b,p)=>{const t=Math.max(0,Math.min(1,(p-a)/(b-a)));return t*t*(3-2*t)};
   const pose=p=>{
    const leave=blend(.1,.34,p),assembly=Math.max(0,Math.min(1,(p-.18)/.4)),arrive=blend(.53,.65,p),close=blend(.86,1,p),nextOpacity=arrive*(1-close);
    const values={'--intro-opacity':1-leave,'--intro-blur':`${leave*10}px`,'--intro-y':`${leave*-70}px`,'--next-opacity':nextOpacity,'--next-y':`${(1-arrive)*25-close*20}px`,'--next-blur':`${(1-arrive)*5}px`,'--object-x':'0px','--object-y':`${close*-20}px`,'--object-scale':1+leave*.08-close*.18,'--object-blur':`${close*12}px`,'--object-opacity':(.88+leave*.12)*(1-close),'--halo-rise':`${p*-100}px`,'--halo-slide':`${p*-75}px`,'--control-opacity':1-blend(.18,.38,p),'--handoff-opacity':blend(.852,.87,p),'--handoff-scale':.005+close*1.03,'--assembly-progress':assembly,'--veil-opacity':1-leave};
    Object.entries(values).forEach(([key,value])=>hero.style.setProperty(key,value));hero.dataset.heroProgress=p.toFixed(3);hero.dataset.assemblyProgress=assembly.toFixed(3);
    if(intro){intro.inert=leave>.96;intro.setAttribute('aria-hidden',String(leave>.96))}
    if(next){const active=nextOpacity>.08;next.inert=!active;next.setAttribute('aria-hidden',String(!active));next.classList.toggle('is-active',active)}
    if(scene){scene.dispatchEvent(new CustomEvent('studio:travel',{detail:{progress:p}}));scene.dispatchEvent(new CustomEvent('studio:assembly',{detail:{progress:assembly}}))}
   };
   ScrollTrigger.create({trigger:hero,start:'top top',end:()=>`+=${Math.max(1,hero.offsetHeight-innerHeight)}`,onUpdate:s=>pose(s.progress),onRefresh:s=>pose(s.progress)});
  }
  gsap.from('.footer-mark',{yPercent:8,opacity:.6,ease:'none',scrollTrigger:{trigger:'.footer-mark',start:'top bottom',end:'bottom bottom',scrub:.7}});
  return()=>{
   arrivalObserver.disconnect();cancelAnimationFrame(roomRefresh);rooms.forEach(room=>room.removeEventListener('contentvisibilityautostatechange',refreshRoom));
   if(hero){hero.removeAttribute('style');hero.removeAttribute('data-hero-progress');hero.removeAttribute('data-assembly-progress');hero.querySelector('.hero-intro')?.removeAttribute('inert');hero.querySelector('.hero-intro')?.removeAttribute('aria-hidden');const next=hero.querySelector('.hero-next');if(next){next.inert=true;next.setAttribute('aria-hidden','true')}}
   document.querySelectorAll('[data-enter],[data-step],.moving-word').forEach(el=>{el.style.removeProperty('transform');el.style.removeProperty('opacity')});
   document.querySelectorAll('[data-line]').forEach(path=>{path.style.removeProperty('opacity');path.style.removeProperty('stroke-dasharray');path.style.removeProperty('stroke-dashoffset')});
  };
 });
 ScrollTrigger.refresh();
 window.addEventListener('pageshow',event=>{if(event.persisted)ScrollTrigger.refresh()});
 window.addEventListener('studio:category',()=>{ScrollTrigger.refresh();gsap.fromTo('.plan-category.is-selected .offer',{y:18,opacity:.5},{y:0,opacity:1,duration:.4,stagger:.05,clearProps:'transform,opacity'})});

}
