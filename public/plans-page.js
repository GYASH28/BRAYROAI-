document.body.classList.add('js');

const plansReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const plansFinePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const plansClamp = (min, value, max) => Math.min(max, Math.max(min, value));

class PlansReveal {
  constructor() {
    const items = [...document.querySelectorAll('[data-reveal]')];
    if (plansReducedMotion || !('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '-3% 0px -11% 0px' });
    items.forEach((item) => observer.observe(item));
  }
}

class PlansSurfaceLight {
  constructor() {
    if (!plansFinePointer || plansReducedMotion) return;
    document.querySelectorAll('.glass-panel').forEach((surface) => {
      surface.addEventListener('pointermove', (event) => {
        const rect = surface.getBoundingClientRect();
        surface.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
        surface.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
      }, { passive: true });
    });
  }
}

class PlansTimeline {
  constructor() {
    this.scenes = [...document.querySelectorAll('[data-plan-scene]')];
    this.progress = document.querySelector('[data-plan-progress]');
    this.nav = document.querySelector('[data-plans-nav]');
    this.frame = 0;
    this.y = scrollY;
    this.update = this.update.bind(this);
    addEventListener('scroll', () => this.schedule(), { passive: true });
    addEventListener('resize', () => this.schedule(), { passive: true });
    this.bindAnchors();
    this.schedule();
  }

  bindAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: plansReducedMotion ? 'auto' : 'smooth', block: 'start' });
      });
    });
  }

  schedule() {
    if (!this.frame) this.frame = requestAnimationFrame(this.update);
  }

  update() {
    this.frame = 0;
    this.y += (scrollY - this.y) * (plansReducedMotion ? 1 : .18);
    if (Math.abs(scrollY - this.y) < .2) this.y = scrollY;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const p = plansClamp(0, this.y / max, 1);
    if (this.progress) this.progress.style.transform = `scaleX(${p.toFixed(4)})`;
    let active = this.scenes[0];
    let distance = Infinity;
    this.scenes.forEach((scene) => {
      const top = scene.offsetTop - this.y;
      const height = scene.offsetHeight;
      const local = plansClamp(0, (innerHeight * .85 - top) / (height + innerHeight * .7), 1);
      scene.style.setProperty('--plan-p', local.toFixed(4));
      const current = Math.abs(top + Math.min(height, innerHeight) * .5 - innerHeight * .48);
      if (top < innerHeight && top + height > 0 && current < distance) {
        active = scene;
        distance = current;
      }
    });
    if (this.nav && active) this.nav.dataset.scVerifyState = `plans:${active.dataset.planScene}:${Math.round(p * 100)}`;
    if (this.y !== scrollY) this.schedule();
  }
}

class PlansBriefs {
  constructor() {
    document.querySelectorAll('[data-plan-key]').forEach((card) => {
      const cta=card.querySelector('a[href^="mailto:"]');
      if (!cta) return;
      const heading=card.querySelector('h3');
      const plan=heading
        ? [...heading.childNodes].map((node)=>node.textContent.trim()).filter(Boolean).join(' ').replace(/\s+/g,' ').trim()
        : 'BRAYROAI plan';
      const monthly=card.dataset.planKey.startsWith('monthly');
      const brief=[
        'Hi Yash,',
        '',
        `I am interested in the ${plan} (${monthly ? 'monthly partnership' : 'one-time build'}).`,
        '',
        'Business / brand:',
        'What needs to improve or be built:',
        'Current website, if any:',
        'Approximate budget and target date:',
        '',
        'Best way to reach me:'
      ].join('\n');
      const emailHref=`mailto:yashganesh.work@gmail.com?subject=${encodeURIComponent(`BRAYROAI ${plan}`)}&body=${encodeURIComponent(brief)}`;
      cta.href=`https://wa.me/919175524637?text=${encodeURIComponent(`Hi Yash, I am interested in the ${plan}.\n\n${brief}`)}`;
      cta.target='_blank';cta.rel='noreferrer';
      cta.innerHTML=`Chat about ${plan} <span>↗</span>`;
      if(!card.querySelector('.plan-email-fallback')){const email=document.createElement('a');email.className='plan-email-fallback';email.href=emailHref;email.textContent='Prefer email? Send this brief ↗';cta.after(email)}
    });
    const helper=document.querySelector('.plan-close__copy a');
    if(helper){
      const brief=['Hi Yash,','','I am not sure which BRAYROAI plan fits yet.','','Business / brand:','What I need to improve or build:','Current website, if any:','Approximate budget and target date:','','Best way to reach me:'].join('\n');
      const emailHref=`mailto:yashganesh.work@gmail.com?subject=${encodeURIComponent('Help me choose a BRAYROAI plan')}&body=${encodeURIComponent(brief)}`;
      helper.href=`https://wa.me/919175524637?text=${encodeURIComponent(`Hi Yash, I need help choosing a BRAYROAI plan.\n\n${brief}`)}`;helper.target='_blank';helper.rel='noreferrer';helper.innerHTML='Ask on WhatsApp <span>↗</span>';
      if(!helper.parentElement.querySelector('.plan-email-fallback')){const email=document.createElement('a');email.className='plan-email-fallback';email.href=emailHref;email.textContent='Prefer email? Send the brief ↗';helper.after(email)}
    }
  }
}

new PlansReveal();
new PlansSurfaceLight();
new PlansTimeline();
new PlansBriefs();
let plansScrollCraftMounted = false;
const plansMountTriggers = ['pointerdown', 'wheel', 'touchstart', 'keydown', 'scroll'];
const mountPlansScrollCraft = () => {
  if (plansScrollCraftMounted || !window.ScrollCraft) return;
  plansScrollCraftMounted = true;
  plansMountTriggers.forEach((eventName) => removeEventListener(eventName, mountPlansScrollCraft));
  window.ScrollCraft.mount(document.body);
};
if (plansReducedMotion) mountPlansScrollCraft();
else plansMountTriggers.forEach((eventName) => addEventListener(eventName, mountPlansScrollCraft, { once: true, passive: eventName !== 'keydown' }));
