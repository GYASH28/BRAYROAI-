import monogramSource from '../../static/brand/brayro-monogram.svg?raw';
import './brand-opening.css';
import {playStudioPrelude} from './studio-prelude.js';

const OPENING_DURATION=3200;

// A finite brand impression, never a loading gate. The live proposition and
// controls stay above this decorative layer while native animations own only
// opening transforms. Pointer and scroll systems take over after cleanup.
function initMosaicOpening(){
 const stage=document.querySelector('.page-home .hero-stage');
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const navigation=performance.getEntriesByType('navigation')[0];
 const idle={finished:Promise.resolve()};
 if(!stage)return idle;
 const skipEntry=reduced.matches||location.hash||scrollY>8||document.hidden||navigation?.type==='back_forward'||document.activeElement?.matches('a,button,input,textarea,summary')||!Element.prototype.animate;
 stage.dataset.openingState='settled';
 if(skipEntry)return idle;

 const line=stage.querySelector('.hero-mark-line'),bottom=stage.querySelector('.hero-bottom'),header=document.querySelector('.site-header');
 if(!line||!bottom||!header)return idle;
 // One measurement pass before any opening markup is written.
 const scene=stage.getBoundingClientRect(),lineBounds=line.getBoundingClientRect(),bottomBounds=bottom.getBoundingClientRect(),headerBounds=header.getBoundingClientRect();
 const compact=scene.width<761,short=scene.height<520;
 const centerX=lineBounds.left+lineBounds.width/2-scene.left;
 const headlineY=lineBounds.top+lineBounds.height/2-scene.top;
 const ceiling=Math.max(0,headerBounds.bottom-scene.top+6);
 const offerTop=Math.max(headlineY+40,bottomBounds.top-scene.top-8);
 const availableHeight=Math.max(120,offerTop-ceiling);
 const size=Math.max(92,Math.min(compact?scene.width*.58:scene.width*.34,short?scene.height*.54:scene.height*.48,460));
 const naturalCenter=Math.max(ceiling+availableHeight*.48,Math.min(headlineY,offerTop-availableHeight*.2));
 // Portrait choreography lives above the sales copy. The visible BR silhouette
 // occupies roughly 56% of the square, so this keeps its lower edge clear.
 const centerY=compact?Math.max(ceiling+size*.31,Math.min(headlineY-12,offerTop-size*.30-14)):naturalCenter;
 const mosaicLeft=centerX-size/2,mosaicTop=centerY-size/2;
 const seamAngle=compact?-16:-11,seamSlope=Math.tan(seamAngle*Math.PI/180);

 const root=document.createElement('div');
 root.className='brand-opening';root.setAttribute('aria-hidden','true');
 root.style.setProperty('--opening-x',`${centerX}px`);root.style.setProperty('--opening-y',`${centerY}px`);root.style.setProperty('--opening-size',`${size}px`);root.style.setProperty('--opening-angle',`${seamAngle}deg`);
 root.innerHTML='<div class="opening-silhouette"><span>BRAYRO</span><span>AI STUDIO</span></div><div class="opening-ribbons"><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="opening-planes"><i class="opening-plane opening-plane-a"></i><i class="opening-plane opening-plane-b"></i></div><div class="opening-seam"></div><div class="opening-accent"></div><div class="opening-mosaic"></div>';
 const skip=document.createElement('button');skip.type='button';skip.className='brand-opening-skip';skip.textContent='Skip intro';skip.setAttribute('aria-label','Skip intro');
 const mosaic=root.querySelector('.opening-mosaic');
 const source=new DOMParser().parseFromString(monogramSource,'image/svg+xml');
 const fragments=[...source.querySelectorAll('g rect')],tiles=[];
 for(const rect of fragments){
  const tile=document.createElement('span');tile.className='opening-tile';
  for(const [property,attribute] of [['left','x'],['top','y'],['width','width'],['height','height']])tile.style[property]=`${Number(rect.getAttribute(attribute))/512*100}%`;
  mosaic.append(tile);tiles.push(tile);
 }
 stage.dataset.openingState='playing';stage.append(root,skip);

 const controller=new AbortController(),animations=[];
 let done=false,resolveFinished,safetyTimer;
 const finished=new Promise(resolve=>{resolveFinished=resolve});
 const play=(element,keyframes,options={})=>{
  if(!element)return null;
  const animation=element.animate(keyframes,{duration:OPENING_DURATION,fill:'both',...options,id:`brand-opening-${animations.length}`});
  animations.push(animation);return animation;
 };
 const settle=()=>{
  if(done)return;done=true;clearTimeout(safetyTimer);controller.abort();reduced.removeEventListener('change',settle);
  for(const animation of animations)animation.cancel();
  root.remove();skip.remove();stage.dataset.openingState='settled';resolveFinished();
 };
 const listen=(target,type,handler=settle,options={})=>target.addEventListener(type,handler,{passive:true,signal:controller.signal,...options});
 for(const type of ['wheel','scroll','touchstart','hashchange','resize','pagehide'])listen(window,type);
 listen(window,'pointerdown',event=>{if(event.target===skip)return;settle()});
 listen(window,'keydown',settle);
 listen(document,'visibilitychange',()=>{if(document.hidden)settle()});
 skip.addEventListener('click',settle,{signal:controller.signal});
 reduced.addEventListener('change',settle);

 try{
  const resolve='cubic-bezier(.16,1,.3,1)',compress='cubic-bezier(.65,0,.35,1)',depart='cubic-bezier(.4,0,.2,1)';
  const count=Math.max(1,tiles.length-1);
  tiles.forEach((tile,index)=>{
   const rect=fragments[index],x=Number(rect.getAttribute('x')),y=Number(rect.getAttribute('y')),w=Number(rect.getAttribute('width')),h=Number(rect.getAttribute('height'));
   const tileX=mosaicLeft+(x+w/2)/512*size,tileY=mosaicTop+(y+h/2)/512*size;
   const seamX=scene.width*(.08+.84*(index/count)),seamBaseY=compact?centerY:scene.height*.49;
   const rawSeamY=seamBaseY+(seamX-centerX)*seamSlope;
   // Keep the portrait seam and its opaque tiles inside a protected visual band
   // above the proposition, even on the low/left end of the diagonal.
   const seamY=compact?Math.min(rawSeamY,offerTop-56):rawSeamY;
   const compressX=seamX-tileX,compressY=seamY-tileY;
   const side=index%2?-1:1,depth=(index%3-1)*150;
   const startX=((index*83)%101)/100*scene.width-tileX+side*scene.width*.22;
   const startY=((index*47)%97)/96*scene.height-tileY+(index%3-1)*scene.height*.14;
   const passX=compressX+side*scene.width*(.16+(index%5)*.018),passY=compressY+(index%4-1.5)*scene.height*(compact?.018:.075);
   const lane=index%4,fanX=(lane-1.5)*scene.width*(compact?.34:.28);
   const fanY=compact?((index%3)-1)*scene.height*.035-scene.height*.04:(index%2?-1:1)*scene.height*.22;
   const spin=side*(18+(index%5)*8);
   const compressAt=compact?.46:.52,resolveAt=compact?.58:.69,holdAt=compact?.64:.76,fanAt=compact?.80:.93;
   play(tile,[
    {offset:0,opacity:0,transform:`translate3d(${startX}px,${startY}px,${-320+depth}px) rotateX(${side*58}deg) rotate(${spin}deg) scale(.28)`,easing:resolve},
    {offset:.10,opacity:.2,transform:`translate3d(${startX*.68}px,${startY*.68}px,${-220+depth*.6}px) rotateX(${side*42}deg) rotate(${spin*.7}deg) scale(.46)`,easing:resolve},
    {offset:.34,opacity:1,transform:`translate3d(${passX}px,${passY}px,${-55+depth*.25}px) rotateY(${side*22}deg) rotate(${spin*.25}deg) scale(.78)`,easing:compress},
    {offset:compressAt,opacity:1,transform:`translate3d(${compressX}px,${compressY}px,0) rotate(${seamAngle}deg) scale(.56)`,easing:resolve},
    {offset:resolveAt,opacity:1,transform:'translate3d(0,0,0) rotate(0deg) scale(1)',easing:'linear'},
    {offset:holdAt,opacity:1,transform:'translate3d(0,0,0) rotate(0deg) scale(1)',easing:depart},
    {offset:fanAt,opacity:.08,transform:`translate3d(${fanX}px,${fanY}px,100px) rotateY(${side*62}deg) rotate(${-spin*.8}deg) scale(.38)`},
    {offset:1,opacity:0,transform:`translate3d(${fanX*1.12}px,${fanY*1.12}px,130px) rotateY(${side*76}deg) rotate(${-spin}deg) scale(.26)`},
   ],{easing:'linear'});
  });

  root.querySelectorAll('.opening-ribbons i').forEach((ribbon,index)=>{
   const direction=index%2?-1:1,vertical=(index-2.5)*8,angle=seamAngle+(index-2.5)*2.4;
   play(ribbon,[
    {offset:0,opacity:0,transform:`translate3d(${direction*62}vw,${vertical-18}vh,${-220+index*35}px) rotate(${angle-direction*11}deg) scaleX(.55)`},
    {offset:.10,opacity:.15,transform:`translate3d(${direction*44}vw,${vertical-11}vh,${-160+index*25}px) rotate(${angle-direction*8}deg) scaleX(.72)`},
    {offset:.34,opacity:.55,transform:`translate3d(${direction*15}vw,${vertical*.55}vh,${-60+index*14}px) rotate(${angle-direction*3}deg) scaleX(1)`},
    {offset:.52,opacity:.7,transform:`translate3d(0,0,0) rotate(${seamAngle}deg) scaleX(.62)`},
    {offset:.69,opacity:0,transform:`translate3d(${-direction*18}vw,${-vertical*.2}vh,90px) rotate(${seamAngle+direction*5}deg) scaleX(.35)`},
    {offset:1,opacity:0,transform:`translate3d(${-direction*22}vw,0,120px) rotate(${seamAngle}deg) scaleX(.2)`},
   ],{easing:'linear'});
  });

  root.querySelectorAll('.opening-silhouette span').forEach((word,index)=>play(word,[
   {offset:0,opacity:.04,transform:`translate3d(${index?-12:10}vw,${index?8:-7}vh,-260px) scale(.92)`},
   {offset:.10,opacity:.1,transform:`translate3d(${index?-8:7}vw,${index?5:-4}vh,-180px) scale(.96)`},
   {offset:.34,opacity:.16,transform:`translate3d(${index?-3:2}vw,${index?2:-2}vh,-80px) scale(1)`},
   {offset:.52,opacity:.05,transform:'translate3d(0,0,-20px) scale(1.03)'},
   {offset:.69,opacity:0,transform:`translate3d(${index?8:-8}vw,0,60px) scale(1.05)`},
   {offset:1,opacity:0,transform:'translate3d(0,0,80px) scale(1.05)'},
  ],{easing:'linear'}));

  const planeA=root.querySelector('.opening-plane-a'),planeB=root.querySelector('.opening-plane-b');
  play(planeA,[
   {offset:0,opacity:0,transform:'perspective(1100px) translate3d(0,0,0) rotateY(0deg)'},
   {offset:.48,opacity:0,transform:'perspective(1100px) translate3d(0,0,0) rotateY(0deg)'},
   {offset:.52,opacity:.96,transform:'perspective(1100px) translate3d(0,0,0) rotateY(0deg)',easing:depart},
   {offset:.69,opacity:0,transform:'perspective(1100px) translate3d(-31vw,-9vh,170px) rotateY(-58deg) rotateZ(-4deg)'},
   {offset:1,opacity:0,transform:'perspective(1100px) translate3d(-34vw,-10vh,180px) rotateY(-62deg) rotateZ(-5deg)'},
  ],{easing:'linear'});
  play(planeB,[
   {offset:0,opacity:0,transform:'perspective(1100px) translate3d(0,0,0) rotateY(0deg)'},
   {offset:.48,opacity:0,transform:'perspective(1100px) translate3d(0,0,0) rotateY(0deg)'},
   {offset:.52,opacity:.96,transform:'perspective(1100px) translate3d(0,0,0) rotateY(0deg)',easing:depart},
   {offset:.69,opacity:0,transform:'perspective(1100px) translate3d(31vw,9vh,170px) rotateY(58deg) rotateZ(4deg)'},
   {offset:1,opacity:0,transform:'perspective(1100px) translate3d(34vw,10vh,180px) rotateY(62deg) rotateZ(5deg)'},
  ],{easing:'linear'});
  play(root.querySelector('.opening-seam'),[
   {offset:0,opacity:.14,transform:`translate(-50%,-50%) rotate(${seamAngle}deg) scaleX(.14)`},
   {offset:.10,opacity:.28,transform:`translate(-50%,-50%) rotate(${seamAngle}deg) scaleX(.38)`},
   {offset:.34,opacity:.6,transform:`translate(-50%,-50%) rotate(${seamAngle}deg) scaleX(.72)`},
   {offset:.52,opacity:1,transform:`translate(-50%,-50%) rotate(${seamAngle}deg) scaleX(1)`},
   {offset:.69,opacity:.16,transform:`translate(-50%,-50%) rotate(${seamAngle}deg) scaleX(1.08)`},
   {offset:1,opacity:0,transform:`translate(-50%,-50%) rotate(${seamAngle}deg) scaleX(1.1)`},
  ],{easing:'linear'});
  play(root.querySelector('.opening-accent'),[
   {offset:0,opacity:0,transform:`translate(-50%,-50%) rotate(${seamAngle}deg) translateX(-48vw) scaleX(.04)`},
   {offset:.50,opacity:0,transform:`translate(-50%,-50%) rotate(${seamAngle}deg) translateX(-48vw) scaleX(.04)`},
   {offset:.56,opacity:1,transform:`translate(-50%,-50%) rotate(${seamAngle}deg) translateX(-14vw) scaleX(.18)`,easing:resolve},
   {offset:.66,opacity:.8,transform:`translate(-50%,-50%) rotate(${seamAngle}deg) translateX(28vw) scaleX(.12)`},
   {offset:.72,opacity:0,transform:`translate(-50%,-50%) rotate(${seamAngle}deg) translateX(48vw) scaleX(.05)`},
   {offset:1,opacity:0,transform:`translate(-50%,-50%) rotate(${seamAngle}deg) translateX(48vw) scaleX(.05)`},
  ],{easing:'linear'});

  stage.querySelectorAll('.hero-word').forEach((letter,index)=>{
   const arrival=(compact?.78:.70)+index*(compact?.012:.018),settled=Math.min(compact?.95:.94,arrival+(compact?.11:.15)),side=index%2?-1:1;
   play(letter,[
    {offset:0,opacity:0,transform:`translate3d(${(index-1.5)*.2}em,.34em,-130px) rotateY(${side*58}deg) rotateX(-22deg) scale(.72)`},
    {offset:arrival,opacity:0,transform:`translate3d(${(index-1.5)*.16}em,.29em,-100px) rotateY(${side*48}deg) rotateX(-18deg) scale(.78)`,easing:resolve},
    {offset:settled,opacity:1,transform:'translate3d(0,-.012em,0) rotateY(0deg) rotateX(0deg) scale(1.008)'},
    {offset:.97,opacity:1,transform:'none'},
    {offset:1,opacity:1,transform:'none'},
   ],{easing:'linear'});
  });
  play(stage.querySelector('.hero-prelude'),[
   {offset:0,opacity:0,transform:'translate3d(0,16px,0)'},
   {offset:compact?.74:.67,opacity:0,transform:'translate3d(0,16px,0)'},
   {offset:compact?.87:.80,opacity:1,transform:'translate3d(0,0,0)'},
   {offset:1,opacity:1,transform:'none'},
  ],{easing:'linear'});
  play(stage.querySelector('.hero-mark-line i'),[
   {offset:0,opacity:0,transform:'translate3d(-.7em,-.8em,0) rotate(-110deg) scale(.2)'},
   {offset:compact?.86:.81,opacity:0,transform:'translate3d(-.7em,-.8em,0) rotate(-110deg) scale(.2)'},
   {offset:compact?.96:.94,opacity:1,transform:'translate3d(0,.03em,0) rotate(0deg) scale(1.12)',easing:resolve},
   {offset:1,opacity:1,transform:'none'},
  ],{easing:'linear'});

  Promise.allSettled(animations.map(animation=>animation.finished)).then(settle);
  safetyTimer=setTimeout(settle,3380);
 }catch(error){settle();throw error}
 return {finished};
}


// Owner's 3 October direction: a separate full-screen editorial sequence first,
// then the existing 38-tile impression, with one interruption contract for both.
export function initBrandOpening(){
 const stage=document.querySelector('.page-home .hero-stage');
 if(!stage)return{finished:Promise.resolve()};
 const navigation=performance.getEntriesByType('navigation')[0];
 const skipEntry=matchMedia('(prefers-reduced-motion:reduce)').matches||location.hash||scrollY>8||document.hidden||navigation?.type==='back_forward'||document.activeElement?.matches('a,button,input,textarea,summary')||!Element.prototype.animate;
 stage.dataset.openingState='settled';
 stage.dataset.preludeState='skipped';
 if(skipEntry)return{finished:Promise.resolve()};
 const prelude=playStudioPrelude(stage);
 const finished=prelude.finished.then(completed=>{
  if(!completed)return;
  return initMosaicOpening().finished;
 });
 return{finished};
}
