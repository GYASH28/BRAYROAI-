import './inner-motion.css';

export function initInnerMotion(){
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const selectors='.inner-pad h2,.inner-pad h3,.inner-pad figure,.inner-pad article,.inner-close h2,.client-feature-screen,.client-feature-info,.case-text-grid h2,.case-text-grid p,.offer,.premium-footer-call,.premium-footer-columns';
 const targets=[...document.querySelectorAll(selectors)];
 if(!('IntersectionObserver' in window))return;
 const observer=new IntersectionObserver(entries=>{
  for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-seen');observer.unobserve(entry.target)}
 },{threshold:.08,rootMargin:'0px 0px -5% 0px'});
 targets.forEach((target,index)=>{target.classList.add('motion-target');target.style.setProperty('--motion-index',String(index%4));observer.observe(target)});
}
