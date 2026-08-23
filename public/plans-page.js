document.body.classList.add('js');

const plansReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const plansFinePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const plansClamp = (min, value, max) => Math.min(max, Math.max(min, value));

class PlansOpening {
  constructor() {
    const finish = () => document.body.classList.remove('is-opening');
    if (plansReducedMotion) return finish();
    addEventListener('load', () => setTimeout(finish, 1180), { once: true });
    setTimeout(finish, 2100);
  }
}

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

class ScopeDirector {
  constructor() {
    this.root = document.querySelector('[data-scope-director]');
    this.buttons = [...document.querySelectorAll('[data-scope-choice]')];
    this.index = document.querySelector('[data-scope-index]');
    this.title = document.querySelector('[data-scope-title]');
    this.price = document.querySelector('[data-scope-price]');
    this.answer = document.querySelector('[data-scope-answer]');
    this.link = document.querySelector('[data-scope-link]');
    this.states = {
      starter: ['01 / 03', 'Website Starter', '₹9,999', 'A focused one-page launch for a business that needs to look credible and make the next action obvious.', '#starter'],
      business: ['02 / 03', 'Business Website', '₹17,999', 'A complete brand and enquiry system with room to explain, persuade and convert.', '#business'],
      custom: ['03 / 03', 'Custom Experience', '₹25K–₹35K+', 'A purpose-built digital experience with deeper motion, functionality or integrations.', '#custom']
    };
    if (!this.root || !this.buttons.length) return;
    this.buttons.forEach((button) => {
      button.addEventListener('click', () => this.select(button.dataset.scopeChoice));
      button.addEventListener('keydown', (event) => this.navigate(event, button));
    });
  }

  navigate(event, button) {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1;
    const next = this.buttons[(this.buttons.indexOf(button) + direction + this.buttons.length) % this.buttons.length];
    next.focus();
    this.select(next.dataset.scopeChoice);
  }

  select(key) {
    const state = this.states[key];
    if (!state) return;
    this.buttons.forEach((button) => {
      const active = button.dataset.scopeChoice === key;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    [this.index.textContent, this.title.textContent, this.price.textContent, this.answer.textContent] = state;
    this.link.href = state[4];
    this.link.firstChild.textContent = `See ${state[1]} `;
    this.root.dataset.scVerifyState = `scope:${key}`;
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

new PlansOpening();
new PlansReveal();
new ScopeDirector();
new PlansSurfaceLight();
new PlansTimeline();
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
