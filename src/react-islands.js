const mobile=matchMedia('(max-width:760px)').matches;
let runtimePromise=null;
const load=(reason='interaction')=>{if(!runtimePromise)runtimePromise=import('./react-islands-runtime.js');return runtimePromise.then(module=>module.startReactIslands(reason)).catch(error=>{console.warn('React enhancements skipped',error);runtimePromise=null})};
if(!mobile){load('startup')}else{
  const events=['scroll','wheel','touchstart','pointerdown'];
  const cleanup=()=>{events.forEach(type=>removeEventListener(type,onInteraction));removeEventListener('keydown',onInteraction);removeEventListener('hashchange',onInteraction)};
  const onInteraction=()=>{cleanup();load('interaction')};
  events.forEach(type=>addEventListener(type,onInteraction,{once:true,passive:true}));
  addEventListener('keydown',onInteraction,{once:true});
  addEventListener('hashchange',onInteraction,{once:true});
  document.addEventListener('brayro:market-opened',()=>load('market'),{once:true});
  document.addEventListener('rae:opened',()=>load('rae'),{once:true});
  if(scrollY>0||location.hash)queueMicrotask(onInteraction);
}
