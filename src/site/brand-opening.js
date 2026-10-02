import monogramSource from '../../static/brand/brayro-monogram.svg?raw';
import './brand-opening.css';

// A short brand impression, never a loading gate. Native animations own these
// transforms until cleanup; scroll and pointer typography take over afterwards.
export function initBrandOpening() {
 const stage=document.querySelector('.page-home .hero-stage');
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const navigation=performance.getEntriesByType('navigation')[0];
 const idle={finished:Promise.resolve()};
 if(!stage)return idle;
 stage.dataset.openingState='settled';
 if(reduced.matches||location.hash||scrollY>8||document.hidden||navigation?.type==='back_forward'||document.activeElement?.matches('a,button,input,textarea,summary')||!Element.prototype.animate)return idle;

 const line=stage.querySelector('.hero-mark-line');
 const bounds=line.getBoundingClientRect(),scene=stage.getBoundingClientRect();
 const compact=scene.width<761;
 const centerX=bounds.left+bounds.width/2-scene.left;
 const centerY=bounds.top+bounds.height/2-scene.top;
 const ceiling=Math.max(0,document.querySelector('.site-header').getBoundingClientRect().bottom-scene.top+8);
 const floor=stage.querySelector('.hero-bottom').getBoundingClientRect().top-scene.top-10;
 // Fit the visible 111.5..400.5 tile silhouette between controls and offer copy,
 // including short landscape viewports. Its viewBox includes generous margins.
 const size=Math.max(24,Math.min(compact?scene.width*.62:scene.width*.32,440,(centerY-ceiling)*512/145,(floor-centerY)*512/145));
 const root=document.createElement('div');
 root.className='brand-opening';root.setAttribute('aria-hidden','true');
 root.style.setProperty('--opening-x',`${centerX}px`);
 root.style.setProperty('--opening-y',`${centerY-ceiling}px`);
 root.style.setProperty('--opening-size',`${size}px`);
 root.style.setProperty('--opening-ceiling',`${ceiling}px`);
 root.style.setProperty('--opening-floor',`${floor-ceiling}px`);
 root.innerHTML='<div class="opening-rails"><i></i><i></i><i></i></div><div class="opening-frame"><i></i><i></i><i></i><i></i></div><div class="opening-mosaic"></div><div class="opening-strike"></div>';
 const mosaic=root.querySelector('.opening-mosaic');
 // Use the supplied mark itself. No second hand-maintained logo coordinate set.
 const source=new DOMParser().parseFromString(monogramSource,'image/svg+xml');
 const fragments=source.querySelectorAll('g rect');
 const tiles=[];
 for(const rect of fragments){
  const tile=document.createElement('span');tile.className='opening-tile';
  for(const [property,attribute] of [['left','x'],['top','y'],['width','width'],['height','height']])tile.style[property]=`${Number(rect.getAttribute(attribute))/512*100}%`;
  mosaic.append(tile);tiles.push(tile);
 }
 stage.dataset.openingState='playing';stage.append(root);
 const controller=new AbortController(),animations=[];
 let done=false,resolveFinished,safetyTimer;
 const finished=new Promise(resolve=>{resolveFinished=resolve});
 const play=(element,keyframes,options)=>{
  const animation=element.animate(keyframes,{fill:'both',...options,id:`brand-opening-${animations.length}`});
  animations.push(animation);return animation;
 };
 const settle=()=>{
  if(done)return;done=true;clearTimeout(safetyTimer);controller.abort();
  reduced.removeEventListener('change',settle);
  for(const animation of animations)animation.cancel();
  root.remove();stage.dataset.openingState='settled';resolveFinished();
 };
 const listen=(target,type,handler=settle)=>target.addEventListener(type,handler,{passive:true,signal:controller.signal});
 for(const type of ['wheel','scroll','touchstart','pointerdown','keydown','hashchange','resize','pagehide'])listen(window,type);
 listen(document,'visibilitychange',()=>{if(document.hidden)settle()});
 reduced.addEventListener('change',settle);

 try{
  const resolve='cubic-bezier(.16,1,.3,1)',depart='cubic-bezier(.4,0,.2,1)';
  // Different depths and approach vectors make the mark feel assembled by a
  // press, then its fragments fan outward through four typographic columns.
  tiles.forEach((tile,index)=>{
   const rect=fragments[index],x=Number(rect.getAttribute('x')),y=Number(rect.getAttribute('y'));
   const side=x<256?-1:1,wave=((y-111.5)/289.5)*85;
   const lane=index%4,spin=(index%2?-1:1)*(16+(index%5)*9);
   const startX=side*(scene.width*(compact?.34:.32)+(index%5)*12);
   const startY=(index%3-1)*scene.height*.28;
   const endX=(lane-1.5)*scene.width*.34;
   const endY=(index%2?-1:1)*scene.height*.28;
   play(tile,[
    {offset:0,opacity:0,transform:`translate3d(${startX}px,${startY}px,-260px) rotateX(${side*65}deg) rotate(${spin}deg) scale(.3)`,easing:resolve},
    {offset:.3,opacity:1,transform:'translate3d(0,0,0) rotateX(0deg) rotate(0deg) scale(1)',easing:'linear'},
    {offset:.4,opacity:1,transform:'translate3d(0,0,0) rotateX(0deg) rotate(0deg) scale(1)',easing:depart},
    {offset:.57,opacity:0,transform:`translate3d(${endX*.6}px,${endY*.6}px,80px) rotateY(${side*50}deg) rotate(${-spin*.7}deg) scale(.4)`},
    {offset:.8,opacity:0,transform:`translate3d(${endX}px,${endY}px,120px) rotateY(${side*80}deg) rotate(${-spin}deg) scale(.25)`},
    {offset:1,opacity:0,transform:`translate3d(${endX}px,${endY}px,120px) scale(.25)`},
   ],{duration:1680,delay:wave});
  });
  root.querySelectorAll('.opening-rails i').forEach((ray,index)=>play(ray,[
   {opacity:0,transform:`rotate(${[-22,22,90][index]}deg) scaleX(.05)`},
   {offset:.35,opacity:.5,transform:`rotate(${[-22,22,90][index]}deg) scaleX(1)`},
   {opacity:0,transform:`rotate(${[-7,7,90][index]}deg) scaleX(1.18)`},
  ],{duration:1150,delay:80+index*45,easing:resolve}));
  play(root.querySelector('.opening-frame'),[
   {opacity:0,transform:'translate(-50%,-50%) rotate(-14deg) scale(1.7)'},
   {offset:.48,opacity:.65,transform:'translate(-50%,-50%) rotate(0deg) scale(1)'},
   {opacity:0,transform:'translate(-50%,-50%) rotate(8deg) scale(1.5)'},
  ],{duration:1250,easing:resolve});
  play(root.querySelector('.opening-strike'),[
   {opacity:0,transform:'translate(-50%,-50%) rotate(-12deg) scaleX(0)'},
   {offset:.4,opacity:.65,transform:'translate(-50%,-50%) rotate(-12deg) scaleX(1)'},
   {opacity:0,transform:'translate(-50%,-140%) rotate(-12deg) scaleX(1.15)'},
  ],{duration:700,delay:650,easing:resolve});
  stage.querySelectorAll('.hero-word').forEach((letter,index)=>play(letter,[
   {opacity:0,transform:`translate3d(${(index-1.5)*.15}em,.27em,-100px) rotateY(${index%2?52:-52}deg) rotateX(-18deg) scale(.78)`},
   {offset:.75,opacity:1,transform:'translate3d(0,-.015em,0) rotateY(0deg) rotateX(0deg) scale(1.01)'},
   {opacity:1,transform:'none'},
  ],{duration:720,delay:820+index*45,easing:resolve}));
  play(stage.querySelector('.hero-prelude'),[{opacity:0,transform:'translate3d(0,12px,0)'},{opacity:1,transform:'none'}],{duration:600,delay:660,easing:resolve});
  play(stage.querySelector('.hero-mark-line i'),[
   {opacity:0,transform:'translate3d(-.7em,-.8em,0) rotate(-110deg) scale(.2)'},
   {offset:.75,opacity:1,transform:'translate3d(0,.03em,0) rotate(0deg) scale(1.12)'},
   {opacity:1,transform:'none'},
  ],{duration:620,delay:1110,easing:resolve});
  // Consume only our finite animations' cancellation promises. No global browser
  // errors are suppressed, and no animation remains attached after settlement.
  Promise.allSettled(animations.map(animation=>animation.finished)).then(settle);
  safetyTimer=setTimeout(settle,2400);
 }catch(error){settle();throw error}
 return {finished};
}
