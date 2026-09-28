export function initStory(){
 const story=document.querySelector('[data-story]');if(!story)return;
 const steps=[...story.querySelectorAll('[data-story-step]')],number=story.querySelector('[data-story-number]');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width: 760px)');
 let active=false,frame=0;
 function update(){
  frame=0;if(!active||document.hidden||reduced.matches||mobile.matches)return;
  const rect=story.getBoundingClientRect(),range=Math.max(1,rect.height-innerHeight),progress=Math.max(0,Math.min(1,-rect.top/range));
  let nearest=0,best=Infinity;
  steps.forEach((step,index)=>{const box=step.getBoundingClientRect(),distance=Math.abs((box.top+box.bottom)/2-innerHeight/2);if(distance<best){best=distance;nearest=index}});
  story.dataset.active=String(nearest);story.style.setProperty('--story-progress',progress.toFixed(3));number.textContent=`0${nearest+1} / 03`;
  steps.forEach((step,index)=>step.classList.toggle('is-active',index===nearest));
 }
 const queue=()=>{if(!frame)frame=requestAnimationFrame(update)};
 const observer=new IntersectionObserver(entries=>{active=entries[0].isIntersecting;queue()},{rootMargin:'100px 0px'});
 observer.observe(story);window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',queue);document.addEventListener('visibilitychange',queue);
 const reset=()=>{if(reduced.matches||mobile.matches){story.dataset.active='2';story.style.setProperty('--story-progress','1');number.textContent='03 / 03';steps.forEach(step=>step.classList.add('is-active'))}else queue()};
 reduced.addEventListener('change',reset);mobile.addEventListener('change',reset);reset();
 window.addEventListener('pagehide',()=>{observer.disconnect();window.removeEventListener('scroll',queue);window.removeEventListener('resize',queue);document.removeEventListener('visibilitychange',queue);reduced.removeEventListener('change',reset);mobile.removeEventListener('change',reset);if(frame)cancelAnimationFrame(frame)},{once:true});
}
