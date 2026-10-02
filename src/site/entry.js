import {initPremiumMotion} from './premium-motion.js';
// The first frame has native entry motion; below-fold choreography loads on arrival.
export function initStudioEntry(){
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 if(!reduced.matches){
  document.querySelectorAll('h1:not(#hero-title)').forEach(el=>{
   let index=0;const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),nodes=[];
   while(walker.nextNode())if(walker.currentNode.textContent.trim())nodes.push(walker.currentNode);
   for(const node of nodes){const fragment=document.createDocumentFragment();node.textContent.split(/(\s+)/).forEach(word=>{
    if(!word.trim()){fragment.append(document.createTextNode(word));return}
    const clip=document.createElement('span'),span=document.createElement('span');clip.className='word-clip';span.className='opening-word';span.textContent=word;span.style.setProperty('--word-index',index++);clip.append(span);fragment.append(clip);
   });node.replaceWith(fragment)}
   el.dataset.opening='true';
  });
  document.querySelectorAll('main>section:first-child [data-enter]:not([data-opening])').forEach(el=>{el.classList.add('opening-block');el.dataset.opening='true'});
 }
 initPremiumMotion();
 const root=document.querySelector('[data-sc-root]');
 if(root&&!reduced.matches)root.classList.add('studio-ready');
 let motionPromise=null;
 const loadMotion=()=>motionPromise||(motionPromise=import('./motion.js').then(m=>m.initStudioMotion()).catch(error=>{root?.classList.remove('studio-ready');console.error('Studio motion failed',error)}));
 const alignHash=()=>{
  const hash=location.hash,target=hash&&document.getElementById(hash.slice(1));if(!target)return;
  loadMotion().then(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{if(location.hash===hash)target.scrollIntoView({block:'start',behavior:'instant'})})));
 };
 window.addEventListener('hashchange',alignHash);
 const firstRoom=document.querySelector('main>section:nth-child(2)');
 if(location.hash||!firstRoom){loadMotion();alignHash()}else{
  const arrival=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){arrival.disconnect();loadMotion()}},{rootMargin:'0px 0px -2px 0px'});arrival.observe(firstRoom);
  window.addEventListener('scroll',()=>{arrival.disconnect();loadMotion()},{once:true,passive:true});
  window.addEventListener('pageshow',event=>{if(event.persisted&&scrollY>0){arrival.disconnect();loadMotion()}});
 }
 const scene=document.querySelector('[data-sculpture]');
 let sculpture=null,loading=null;
 const loadSculpture=()=>{
  if(!scene||reduced.matches)return Promise.resolve();if(loading)return loading;
  const sync=()=>{const hero=scene.closest('.studio-hero');scene.dispatchEvent(new CustomEvent('studio:travel',{detail:{progress:Number(hero?.dataset.heroProgress||0)}}));scene.dispatchEvent(new CustomEvent('studio:assembly',{detail:{progress:Number(hero?.dataset.assemblyProgress||0)}}))};
  scene.addEventListener('studio:ready',sync,{once:true});
  loading=import('./sculpture.jsx').then(m=>{sculpture=m.mountSculpture(scene)}).catch(()=>{scene.dataset.renderState='fallback'});return loading;
 };
 if(scene&&!reduced.matches&&matchMedia('(min-width:761px)').matches){const timer=setTimeout(loadSculpture,2400);scene.addEventListener('pointerenter',()=>{clearTimeout(timer);loadSculpture()},{once:true});scene.addEventListener('pointerdown',()=>{clearTimeout(timer);loadSculpture()},{once:true})}
 window.addEventListener('scroll',loadSculpture,{once:true,passive:true});
 const hero=document.querySelector('.hero-stage');
 if(hero&&!reduced.matches&&matchMedia('(pointer:fine)').matches){
  let disposeType=null;
  hero.addEventListener('pointermove',event=>{const pointer={clientX:event.clientX,clientY:event.clientY};import('./hero-type.js').then(m=>{disposeType=m.initHeroType(hero,pointer)}).catch(()=>{})},{once:true,passive:true});
  window.addEventListener('pagehide',()=>disposeType?.());
  let lightFrame=0,lightPointer=null;
  hero.addEventListener('pointermove',event=>{lightPointer={x:event.clientX,y:event.clientY};if(!lightFrame)lightFrame=requestAnimationFrame(()=>{lightFrame=0;if(!lightPointer)return;const rect=hero.getBoundingClientRect();hero.style.setProperty('--light-x',`${((lightPointer.x-rect.left)/rect.width-.5)*36}px`);hero.style.setProperty('--light-y',`${((lightPointer.y-rect.top)/rect.height-.5)*24}px`)})},{passive:true});
  hero.addEventListener('pointerleave',()=>{lightPointer=null;cancelAnimationFrame(lightFrame);lightFrame=0;hero.style.setProperty('--light-x','0px');hero.style.setProperty('--light-y','0px')});
 }
 const mark=document.querySelector('[data-footer-wordmark]');if(mark){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();import('./footer-wordmark.js').then(m=>m.initFooterWordmark(mark)).catch(()=>{})}},{rootMargin:'300px'});observer.observe(mark)}
 const path=document.querySelector('[data-project-path]');if(path){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();import('./project-path.js').then(m=>m.initProjectPath(path)).catch(()=>{})}},{rootMargin:'500px'});observer.observe(path)}
 const planDesk=document.querySelector('[data-plan-desk]');if(planDesk)import('./plan-desk.jsx').then(m=>m.mountPlanDesk(planDesk)).catch(()=>{});
 window.addEventListener('pagehide',()=>{if(!document.hidden)sculpture?.()});
}
