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
 let sculpture=null,loading=null;
 const loadSculpture=()=>{
  if(!scene||reduced.matches||loading)return;
  loading=import('./sculpture.jsx').then(m=>{sculpture=m.mountSculpture(scene);setTimeout(()=>scene.dispatchEvent(new CustomEvent('studio:shape',{detail:{value:Number(shape?.value||0)/100}})),100)}).catch(()=>{scene.dataset.renderState='fallback'});
 };
 const shape=document.querySelector('#sculpture-shape');
 shape?.addEventListener('input',()=>{loadSculpture();scene?.dispatchEvent(new CustomEvent('studio:shape',{detail:{value:Number(shape.value)/100}}));const poster=document.querySelector('.sculpture-poster');if(poster&&!scene?.classList.contains('is-ready'))poster.style.transform=`rotate(${Number(shape.value)*.05}deg) scale(${1+Number(shape.value)*.0008})`});
 if(scene&&!reduced.matches){
  const desktop=matchMedia('(min-width:761px)');
  if(desktop.matches){const timer=setTimeout(loadSculpture,2400);scene.addEventListener('pointerdown',()=>{clearTimeout(timer);loadSculpture()},{once:true});}
 }
 const planDesk=document.querySelector('[data-plan-desk]');if(planDesk)import('./plan-desk.jsx').then(m=>m.mountPlanDesk(planDesk)).catch(()=>{});
 const bench=document.querySelector('[data-workbench]');
 if(bench){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();import('./workbench.jsx').then(m=>m.mountWorkbench(bench)).catch(()=>{})}},{rootMargin:'300px'});observer.observe(bench)}
 function reading(){const sections=[...document.querySelectorAll('.terms-section')],nav=document.querySelector('.terms-layout>nav');if(!nav)return;ScrollTrigger.create({trigger:'.terms-sections',start:'top center',end:'bottom bottom',onUpdate:s=>nav.style.setProperty('--reading',s.progress)});sections.forEach(section=>ScrollTrigger.create({trigger:section,start:'top 35%',end:'bottom 35%',onToggle:s=>{if(s.isActive)nav.querySelectorAll('a').forEach(a=>a.setAttribute('aria-current',String(a.hash==='#'+section.id)))}}))}
 reading();
 if(reduced.matches)return;
 const hero=document.querySelector('.studio-hero');
 if(hero&&matchMedia('(pointer:fine)').matches){
  hero.addEventListener('pointermove',event=>{
   const rect=hero.getBoundingClientRect();
   hero.style.setProperty('--light-x',`${(event.clientX/rect.width-.5)*36}px`);
   hero.style.setProperty('--light-y',`${((event.clientY-rect.top)/rect.height-.5)*24}px`);
  },{passive:true});
  hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--light-x','0px');hero.style.setProperty('--light-y','0px')});
 }
 const mm=gsap.matchMedia();
 mm.add('(prefers-reduced-motion:no-preference)',()=>{
  const arrivals=new WeakMap();
  const arrivalObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;arrivalObserver.unobserve(entry.target);arrivals.get(entry.target)?.()}},{rootMargin:'0px 0px -8% 0px'});
  const onArrival=(el,run)=>{arrivals.set(el,run);arrivalObserver.observe(el)};
  document.querySelectorAll('[data-letters]').forEach(el=>{
   const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())if(walker.currentNode.textContent.trim())nodes.push(walker.currentNode);
   for(const node of nodes){const frag=document.createDocumentFragment();node.textContent.split(/(\s+)/).forEach(word=>{if(!word.trim()){frag.append(document.createTextNode(word));return}const clip=document.createElement('span');clip.className='word-clip';const span=document.createElement('span');span.className='moving-word';span.textContent=word;clip.append(span);frag.append(clip)});node.replaceWith(frag)}
   el.querySelectorAll('.moving-word').forEach(word=>word.style.transform='translateY(115%) rotate(3deg)');
   onArrival(el,()=>gsap.fromTo(el.querySelectorAll('.moving-word'),{yPercent:115,y:0,rotate:3},{yPercent:0,y:0,rotate:0,duration:1.05,stagger:.055,ease:'power3.out',clearProps:'transform'}));
  });
  document.querySelectorAll('[data-enter]').forEach(el=>{el.style.opacity='0';el.style.transform='translate3d(0,35px,0)';onArrival(el,()=>gsap.to(el,{y:0,opacity:1,duration:.85,ease:'power3.out',clearProps:'transform,opacity'}))});
  document.querySelectorAll('[data-parallax]').forEach(el=>{const amount=Number(el.dataset.parallax)||-.1;gsap.fromTo(el,{y:()=>-innerHeight*amount*.5},{y:()=>innerHeight*amount*.5,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:.55,invalidateOnRefresh:true}})});
  document.querySelectorAll('[data-line]').forEach(path=>{path.style.opacity='0';onArrival(path,()=>{const length=path.getTotalLength();gsap.fromTo(path,{opacity:1,strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,duration:1.15,ease:'power2.out'})})});
  document.querySelectorAll('[data-process]').forEach(process=>{const items=[...process.querySelectorAll('[data-step]')];items.forEach((item,i)=>{item.style.opacity='0';item.style.transform='translate3d(0,40px,0)';onArrival(item,()=>gsap.to(item,{y:0,opacity:1,duration:.8,delay:matchMedia('(min-width:761px)').matches?i*.09:0,ease:'power3.out',clearProps:'transform,opacity'}))})});
  const work=document.querySelector('.work-exhibit');
  if(work){const desktop=document.querySelector('.work-desktop'),phone=document.querySelector('.work-mobile');const isPhone=()=>innerWidth<761;ScrollTrigger.create({trigger:work,start:'top top',end:()=>`+=${work.offsetHeight-innerHeight}`,onUpdate:s=>{const p=s.progress;work.dataset.proofProgress=p.toFixed(3);gsap.set(desktop,{rotateY:isPhone()?0:-22*(1-p),rotateX:13*(1-p),scale:.68+.32*p,rotateZ:-3*(1-p)});gsap.set(phone,{yPercent:60*(1-p),rotateZ:10-15*p,scale:.85+.15*p});if(scene&&p<.15)scene.dispatchEvent(new CustomEvent('studio:progress',{detail:{progress:Math.min(1,p*5)}}))},onRefresh:s=>{gsap.set(desktop,{rotateY:-22*(1-s.progress),rotateX:13*(1-s.progress),scale:.68+.32*s.progress})}})}
  if(scene){ScrollTrigger.create({trigger:'.studio-hero',start:'top top',end:'bottom top',onUpdate:s=>{if(!shape||Number(shape.value)===0)scene.dispatchEvent(new CustomEvent('studio:progress',{detail:{progress:s.progress*.75}}))}})}
  gsap.from('.footer-mark img',{yPercent:20,opacity:.6,ease:'none',scrollTrigger:{trigger:'.footer-mark',start:'top bottom',end:'bottom bottom',scrub:.7}});
  return()=>{
   arrivalObserver.disconnect();
   document.querySelectorAll('[data-enter],[data-step],.moving-word').forEach(el=>{el.style.removeProperty('transform');el.style.removeProperty('opacity')});
   document.querySelectorAll('[data-line]').forEach(path=>{path.style.removeProperty('opacity');path.style.removeProperty('stroke-dasharray');path.style.removeProperty('stroke-dashoffset')});
  };
 });
 ScrollTrigger.refresh();
 let measuredBench=false;const resizeObserver=new ResizeObserver(()=>{if(measuredBench)ScrollTrigger.refresh();measuredBench=true});if(bench)resizeObserver.observe(bench);
 window.addEventListener('pageshow',event=>{if(event.persisted)ScrollTrigger.refresh()});
 window.addEventListener('studio:category',()=>{ScrollTrigger.refresh();gsap.fromTo('.plan-category.is-selected .offer',{y:18,opacity:.5},{y:0,opacity:1,duration:.4,stagger:.05,clearProps:'transform,opacity'})});
 window.addEventListener('pagehide',()=>{if(!document.hidden)sculpture?.()});
}
