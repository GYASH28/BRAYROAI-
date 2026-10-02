export function initFooterWordmark(mark){
 const template=mark.querySelector('[data-footer-vector]');if(!template)return;
 mark.append(template.content.cloneNode(true));const svg=mark.querySelector('svg');if(!svg)return;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),fine=matchMedia('(pointer:fine)');
 const tiles=[...svg.querySelectorAll('rect')].map(tile=>{const x=Number(tile.getAttribute('x')),y=Number(tile.getAttribute('y')),w=Number(tile.getAttribute('width')),h=Number(tile.getAttribute('height'));tile.style.setProperty('--tile-delay',`${x*.3}ms`);return{tile,x:x+w/2,y:y+h/2,last:'none'}});
 const defs=document.createElementNS('http://www.w3.org/2000/svg','defs');defs.innerHTML='<radialGradient id="footer-ink" gradientUnits="userSpaceOnUse" cx="450" cy="120" r="250"><stop stop-color="#ff8b57"/><stop offset=".4" stop-color="#afc2ff"/><stop offset="1" stop-color="#f3f0ea"/></radialGradient>';svg.prepend(defs);const light=defs.querySelector('radialGradient');
 tiles.forEach(({tile})=>tile.setAttribute('fill','url(#footer-ink)'));mark.classList.add('mark-ready');
 let frame=0,event=null;
 const paint=()=>{frame=0;if(!event)return;const box=svg.getBoundingClientRect(),x=(event.clientX-box.left)/box.width*900,y=(event.clientY-box.top)/box.height*240;light.setAttribute('cx',x);light.setAttribute('cy',y);
  if(reduced.matches)return;
  for(const item of tiles){const dx=item.x-x,dy=item.y-y,d=Math.hypot(dx,dy),force=Math.max(0,1-d/145);const transform=d&&force?`translate(${dx/d*force*7}px,${dy/d*force*7}px) rotate(${force*dx*.018}deg)`:'none';if(transform!==item.last){item.tile.style.transform=transform;item.last=transform}}
 };
 const move=e=>{if(!fine.matches||e.pointerType==='touch')return;event=e;if(!frame)frame=requestAnimationFrame(paint)};
 const settle=()=>{event=null;cancelAnimationFrame(frame);frame=0;tiles.forEach(item=>{if(item.last!=='none'){item.tile.style.transform='none';item.last='none'}});light.setAttribute('cx','450');light.setAttribute('cy','120')};
 mark.addEventListener('pointermove',move,{passive:true});mark.addEventListener('pointerleave',settle);mark.addEventListener('blur',settle);
 mark.addEventListener('focus',()=>{light.setAttribute('cx','330');light.setAttribute('cy','100')});
 window.addEventListener('pagehide',settle);
 reduced.addEventListener('change',settle);
}
