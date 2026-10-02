import './premium-motion.css';

// Text remains semantic and selectable; only its visual word surfaces move.
export function initPremiumMotion(){
 const preference=matchMedia('(prefers-reduced-motion:reduce)');
 if(preference.matches||!('IntersectionObserver' in window))return;
 const targets=[];
 const observer=new IntersectionObserver(entries=>{
  for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('motion-seen');observer.unobserve(entry.target)}
 },{threshold:.08,rootMargin:'0px 0px -4% 0px'});
 document.querySelectorAll('main h2,main h3').forEach(heading=>{
  if(heading.closest('dialog,.hero-next')||heading.querySelector('button,input,svg'))return;
  heading.dataset.motionText=heading.closest('.offer,.terms-section,.method-list')?'sweep':heading.closest('.person-copy,.studio-letter,.inner-close')?'resolve':'rise';
  const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT),nodes=[];
  while(walker.nextNode())if(walker.currentNode.textContent.trim())nodes.push(walker.currentNode);
  let wordIndex=0;
  for(const node of nodes){
   const fragment=document.createDocumentFragment();
   for(const part of node.textContent.split(/(\s+)/)){
    if(!part.trim()){fragment.append(document.createTextNode(part));continue}
    const clip=document.createElement('span'),word=document.createElement('span');
    clip.className='motion-word-clip';word.className='motion-word';word.textContent=part;
    word.style.setProperty('--word-delay',`${Math.min(wordIndex++,10)*35}ms`);clip.append(word);fragment.append(clip);
   }node.replaceWith(fragment);
  }
  targets.push(heading);observer.observe(heading);
 });
 document.querySelectorAll('main section:not(:first-child) .label,main .inner-kicker').forEach(label=>{
  if(label.closest('.hero-next')||label.hasAttribute('data-opening'))return;
  label.classList.add('motion-label');targets.push(label);observer.observe(label);
 });
 document.querySelectorAll('.client-feature-screen,.case-product-screen,.founder-origin-photo,.case-picture').forEach(media=>{
  if(media.matches('[data-parallax]')||media.querySelector('[data-parallax]'))return;
  media.classList.add('motion-media');targets.push(media);observer.observe(media);
 });
 // The focus surface follows real destinations, then returns to the route.
 const nav=document.querySelector('.desktop-nav');
 if(nav){
  const place=link=>{nav.style.setProperty('--nav-visible',link?'1':'0');if(link){nav.style.setProperty('--nav-x',`${link.offsetLeft}px`);nav.style.setProperty('--nav-width',`${link.offsetWidth}px`)}};
  const resting=()=>place(nav.querySelector('a:focus-visible')||nav.querySelector('a[aria-current]'));
  nav.classList.add('motion-nav');
  nav.querySelectorAll('a').forEach(link=>{link.addEventListener('pointerenter',()=>place(link));link.addEventListener('focus',()=>place(link));link.addEventListener('blur',resting)});
  nav.addEventListener('pointerleave',resting);resting();
  const resize=new ResizeObserver(resting);resize.observe(nav);
  window.addEventListener('pagehide',event=>{if(!event.persisted)resize.disconnect()});
 }
 document.querySelectorAll('main .text-link,main .offer-detail-action').forEach(link=>{
  for(const node of [...link.childNodes]){
   if(node.nodeType!==Node.TEXT_NODE||!node.textContent.trim())continue;
   const label=document.createElement('span'),front=document.createElement('span'),back=document.createElement('span');
   label.className='motion-link-label';front.textContent=node.textContent;back.textContent=node.textContent;back.setAttribute('aria-hidden','true');label.append(front,back);node.replaceWith(label);
  }
 });
 const revealAll=()=>{if(preference.matches){targets.forEach(target=>target.classList.add('motion-seen'));observer.disconnect()}};
 preference.addEventListener('change',revealAll);
 window.addEventListener('pagehide',event=>{if(!event.persisted){observer.disconnect();preference.removeEventListener('change',revealAll)}});
}
