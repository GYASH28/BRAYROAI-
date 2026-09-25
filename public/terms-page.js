document.body.classList.add('js');
const termsReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const links=[...document.querySelectorAll('.terms-toc a')];
const navLinks=[...document.querySelectorAll('.terms-nav nav a')];
const sections=[...document.querySelectorAll('.terms-section')];
const setTermsCurrent=id=>{
  links.forEach(link=>{const current=link.getAttribute('href')===`#${id}`;link.classList.toggle('is-current',current);if(current)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')});
  navLinks.forEach(link=>{const current=link.getAttribute('href')===`#${id}`;link.classList.toggle('is-current',current);if(current)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')});
};
const syncTermsHash=()=>{const id=location.hash.slice(1);if(id&&sections.some(section=>section.id===id))setTermsCurrent(id)};
syncTermsHash();
addEventListener('popstate',syncTermsHash);
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver((entries)=>{
    const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
    if(!visible.length)return;
    const id=visible[0].target.id;
    setTermsCurrent(id);
  },{rootMargin:'-30% 0px -55% 0px',threshold:[0,.1,.35,.7]});
  sections.forEach(section=>observer.observe(section));
}
document.querySelectorAll('.terms-toc a,.terms-nav nav a,.terms-quick a').forEach(link=>link.addEventListener('click',event=>{
  const target=document.querySelector(link.getAttribute('href'));if(!target)return;
  event.preventDefault();history.pushState(null,'',link.hash);setTermsCurrent(target.id);target.scrollIntoView({behavior:termsReduced?'auto':'smooth',block:'start'});
}));
