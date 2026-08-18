const root = document.documentElement;
const body = document.body;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;

const loader = document.querySelector('.loader');
if (loader) {
  const seen = sessionStorage.getItem('brayroai-intro');
  if (seen || reduced) loader.classList.add('done');
  else setTimeout(() => { loader.classList.add('done'); sessionStorage.setItem('brayroai-intro','1'); }, 1350);
}
body.classList.add('loaded');

const progressBar = document.querySelector('.progress span');
const header = document.querySelector('[data-header]');
let lastY = scrollY;
let ticking = false;

function onFrame(){
  const y = scrollY;
  const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  if (progressBar) progressBar.style.transform = `scaleX(${Math.min(1,y/max)})`;
  if (header) {
    if (y > lastY + 6 && y > 180) header.classList.add('hidden');
    else if (y < lastY - 6 || y < 120) header.classList.remove('hidden');
  }
  const hero = document.querySelector('[data-hero]');
  if (hero && !reduced) {
    const h = hero.offsetHeight - innerHeight;
    const p = Math.max(0,Math.min(1,y / Math.max(1,h)));
    root.style.setProperty('--hero-p',p.toFixed(4));
  }
  lastY = y;
  ticking = false;
}
addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(onFrame);ticking=true;}},{passive:true});
onFrame();

const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries=>{
  entries.forEach(entry=>{ if(entry.isIntersecting){entry.target.classList.add('revealed'); revealObserver.unobserve(entry.target);} });
},{threshold:.12,rootMargin:'0px 0px -4% 0px'}) : null;
document.querySelectorAll('[data-reveal]').forEach(el=> revealObserver ? revealObserver.observe(el) : el.classList.add('revealed'));

const capButtons = [...document.querySelectorAll('[data-cap-target]')];
const capPanels = [...document.querySelectorAll('[data-cap-panel]')];
function activateCap(index){
  capButtons.forEach((b,i)=>b.classList.toggle('active',i===index));
  capPanels.forEach((p,i)=>p.classList.toggle('active',i===index));
}
capButtons.forEach(btn=>btn.addEventListener('click',()=>activateCap(Number(btn.dataset.capTarget))));
if (capButtons.length && !reduced) {
  let capIndex = 0;
  addEventListener('wheel',e=>{
    const stage = document.querySelector('.capability-stage');
    if(!stage) return;
    const r = stage.getBoundingClientRect();
    if(r.top < innerHeight*.42 && r.bottom > innerHeight*.58 && Math.abs(e.deltaY)>24){
      const next = Math.max(0,Math.min(3,capIndex + (e.deltaY>0?1:-1)));
      if(next!==capIndex){capIndex=next;activateCap(capIndex);}
    }
  },{passive:true});
}

const compare = document.querySelector('[data-compare]');
if(compare){
  const input = compare.querySelector('input[type="range"]');
  input.addEventListener('input',()=>compare.style.setProperty('--split',`${input.value}%`));
}

if (finePointer && !reduced) {
  const cursor = document.querySelector('.signal-cursor');
  if(cursor){
    addEventListener('pointermove',e=>{cursor.style.transform=`translate(${e.clientX-90}px,${e.clientY-90}px)`},{passive:true});
    document.querySelectorAll('.button,.archive-project,.lab-item').forEach(el=>{
      el.addEventListener('mouseenter',()=>cursor.classList.add('orange'));
      el.addEventListener('mouseleave',()=>cursor.classList.remove('orange'));
    });
  }
  document.querySelectorAll('.magnetic').forEach(el=>{
    el.addEventListener('pointermove',e=>{
      const r=el.getBoundingClientRect();
      const x=(e.clientX-r.left-r.width/2)*.12;
      const y=(e.clientY-r.top-r.height/2)*.12;
      el.style.transform=`translate(${x}px,${y}px)`;
    });
    el.addEventListener('pointerleave',()=>el.style.transform='translate(0,0)');
  });
}
