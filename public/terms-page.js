document.body.classList.add('js');
const termsReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const links=[...document.querySelectorAll('.terms-toc a')];
const sections=[...document.querySelectorAll('.terms-section')];
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver((entries)=>{
    const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
    if(!visible.length)return;
    const id=visible[0].target.id;
    links.forEach(link=>link.classList.toggle('is-current',link.getAttribute('href')===`#${id}`));
  },{rootMargin:'-30% 0px -55% 0px',threshold:[0,.1,.35,.7]});
  sections.forEach(section=>observer.observe(section));
}
links.forEach(link=>link.addEventListener('click',event=>{
  const target=document.querySelector(link.getAttribute('href'));if(!target)return;
  event.preventDefault();target.scrollIntoView({behavior:termsReduced?'auto':'smooth',block:'start'});
}));
