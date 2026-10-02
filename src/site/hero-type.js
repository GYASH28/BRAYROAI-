// Four letterforms share the particle field's pointer; the headline remains real text.
export function initHeroType(stage, initialPointer) {
 const preference=matchMedia('(prefers-reduced-motion:reduce)');
 if(preference.matches)return()=>{};
 const title=stage.querySelector('#hero-title'),words=[...title.querySelectorAll('.hero-word')];
 let bounds=[],frame=0,pointer=null,enabled=true;
 const measure=()=>{bounds=words.map(word=>{const rect=word.getBoundingClientRect();return{x:rect.left+rect.width/2,y:rect.top+rect.height/2,width:rect.width}})};
 const paint=()=>{
  frame=0;
  if(!enabled||!pointer||stage.closest('.studio-hero').dataset.heroProgress>.1)return;
  words.forEach((word,index)=>{
   const rect=bounds[index],dx=pointer.x-rect.x,dy=pointer.y-rect.y;
   const influence=Math.max(0,1-Math.hypot(dx,dy)/Math.max(240,rect.width*1.7));
   word.style.setProperty('--type-y',`${-influence*18}px`);
   word.style.setProperty('--type-r',`${Math.max(-1,Math.min(1,dx/300))*influence*3.5}deg`);
   word.style.setProperty('--type-rx',`${Math.max(-1,Math.min(1,-dy/160))*influence*12}deg`);
   word.style.setProperty('--type-ry',`${Math.max(-1,Math.min(1,dx/160))*influence*10}deg`);
   word.style.setProperty('--type-light',String(influence*.9));
  });
 };
 const move=event=>{pointer={x:event.clientX,y:event.clientY};if(!frame)frame=requestAnimationFrame(paint)};
 const reset=()=>{pointer=null;cancelAnimationFrame(frame);frame=0;words.forEach(word=>{word.style.removeProperty('--type-y');word.style.removeProperty('--type-r');word.style.removeProperty('--type-light');word.style.removeProperty('--type-rx');word.style.removeProperty('--type-ry')})};
 const remeasure=()=>{const retained=pointer;reset();measure();pointer=retained;if(pointer)paint()};
 const preferenceChanged=()=>{enabled=!preference.matches;reset()};
 measure();
 stage.addEventListener('pointermove',move,{passive:true});stage.addEventListener('pointerleave',reset);
 title.addEventListener('animationend',remeasure);
 window.addEventListener('resize',remeasure,{passive:true});window.addEventListener('scroll',reset,{passive:true});
 preference.addEventListener('change',preferenceChanged);
 if(initialPointer)move(initialPointer);
 return()=>{reset();stage.removeEventListener('pointermove',move);stage.removeEventListener('pointerleave',reset);title.removeEventListener('animationend',remeasure);window.removeEventListener('resize',remeasure);window.removeEventListener('scroll',reset);preference.removeEventListener('change',preferenceChanged)};
}
