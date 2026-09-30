import './scrollcraft.js';

const reduced=matchMedia('(prefers-reduced-motion: reduce)');

function connectDetails(){
 const work=document.querySelector('.work-media');
 if(work&&matchMedia('(pointer:fine)').matches&&!reduced.matches){
  work.addEventListener('pointermove',event=>{
   const box=work.getBoundingClientRect();
   work.style.setProperty('--pointer-x',((event.clientX-box.left)/box.width-.5).toFixed(3));
   work.style.setProperty('--pointer-y',((event.clientY-box.top)/box.height-.5).toFixed(3));
  },{passive:true});
  work.addEventListener('pointerleave',()=>{work.style.setProperty('--pointer-x',0);work.style.setProperty('--pointer-y',0)});
 }
 const contact=document.querySelector('.contact-section');
 if(contact){
  const observer=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){contact.classList.add('is-visible');observer.disconnect()}},{threshold:.35});
  observer.observe(contact);
 }
 const chapters=[...document.querySelectorAll('.hero-chapters a[href^="#"]')];
 const targets=chapters.map(link=>({link,section:document.querySelector(link.getAttribute('href')==='#top'?'.hero':link.getAttribute('href'))})).filter(item=>item.section);
 if(targets.length){
  const observer=new IntersectionObserver(()=>{
   let current=targets[0];
   for(const item of targets){if(item.section.getBoundingClientRect().top<innerHeight*.45)current=item}
   chapters.forEach(link=>link.removeAttribute('aria-current'));
   current.link.setAttribute('aria-current','location');
  },{rootMargin:'-40% 0px -40% 0px'});
  targets.forEach(item=>observer.observe(item.section));
 }
}

export function initExperience(){
 const root=document.querySelector('[data-sc-root]');
 if(!root)return;
 window.ScrollCraft.mount(root);
 connectDetails();
}
