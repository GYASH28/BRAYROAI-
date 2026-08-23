const plansReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const plansFinePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const plansClamp = (min, value, max) => Math.min(max, Math.max(min, value));

let plansScrollCraftMounted = false;
const plansMountTriggers = ['pointerdown', 'wheel', 'touchstart', 'keydown', 'scroll'];
const mountPlansScrollCraft = () => {
  if (plansScrollCraftMounted || !window.ScrollCraft) return;
  plansScrollCraftMounted = true;
  plansMountTriggers.forEach((eventName) => removeEventListener(eventName, mountPlansScrollCraft));
  window.ScrollCraft.mount(document.body);
};

if (plansReducedMotion) mountPlansScrollCraft();
else {
  plansMountTriggers.forEach((eventName) => addEventListener(eventName, mountPlansScrollCraft, { once: true, passive: eventName !== 'keydown' }));
  if ('requestIdleCallback' in window) requestIdleCallback(mountPlansScrollCraft, { timeout: 2600 });
  else setTimeout(mountPlansScrollCraft, 1800);
}

class PlansOpening {
  constructor() {
    if (plansReducedMotion) {
      document.body.classList.remove('is-opening');
      return;
    }
    setTimeout(() => document.body.classList.remove('is-opening'), 1250);
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
      starter: {
        index: '01 / 03', title: 'Website Starter', price: '₹9,999',
        answer: 'A focused one-page launch system for businesses that need to look credible, explain the offer and make the next action obvious.',
        label: 'See Website Starter', href: '#starter'
      },
      business: {
        index: '02 / 03', title: 'Business Website', price: '₹17,999',
        answer: 'A multi-section brand and enquiry system for businesses that need more room to explain, persuade and convert.',
        label: 'See Business Website', href: '#business'
      },
      custom: {
        index: '03 / 03', title: 'Custom Experience', price: '₹25K–₹35K+',
        answer: 'A purpose-built digital experience for advanced interactions, additional structures, useful AI or custom functionality.',
        label: 'See Custom Experience', href: '#custom'
      }
    };
    if (!this.root || !this.buttons.length) return;
    this.buttons.forEach((button) => {
      button.addEventListener('click', () => this.select(button.dataset.scopeChoice));
      button.addEventListener('keydown', (event) => this.navigate(event, button));
    });
    if (plansFinePointer && !plansReducedMotion) {
      this.root.addEventListener('pointermove', (event) => this.move(event), { passive: true });
      this.root.addEventListener('pointerleave', () => {
        this.root.style.setProperty('--scope-x', '0');
        this.root.style.setProperty('--scope-y', '0');
      });
    }
    this.select('business');
  }

  navigate(event, button) {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const forward = ['ArrowRight', 'ArrowDown'].includes(event.key);
    const position = this.buttons.indexOf(button);
    const next = this.buttons[(position + (forward ? 1 : -1) + this.buttons.length) % this.buttons.length];
    next.focus();
    this.select(next.dataset.scopeChoice);
  }

  move(event) {
    const rect = this.root.getBoundingClientRect();
    this.root.style.setProperty('--scope-x', (((event.clientX - rect.left) / rect.width - 0.5) * 2).toFixed(3));
    this.root.style.setProperty('--scope-y', (((event.clientY - rect.top) / rect.height - 0.5) * 2).toFixed(3));
  }

  select(key) {
    const state = this.states[key];
    if (!state) return;
    this.buttons.forEach((button) => {
      const active = button.dataset.scopeChoice === key;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    this.index.textContent = state.index;
    this.title.textContent = state.title;
    this.price.textContent = state.price;
    this.answer.textContent = state.answer;
    this.link.href = state.href;
    this.link.childNodes[0].nodeValue = `${state.label} `;
    this.root.dataset.scVerifyState = `scope:${key}`;
  }
}

class PlansTimeline {
  constructor() {
    this.cuts = [...document.querySelectorAll('[data-plan-cut]')];
    this.nav = document.querySelector('[data-plans-nav]');
    this.name = document.querySelector('[data-plan-cut-name]');
    this.timecode = document.querySelector('[data-plan-timecode]');
    this.progress = document.querySelector('[data-plan-progress]');
    this.frame = 0;
    this.smoothY = scrollY;
    this.lastY = scrollY;
    this.lastTime = performance.now();
    this.energy = 0;
    this.activeIndex = 0;
    this.schedule = this.schedule.bind(this);
    this.update = this.update.bind(this);
    addEventListener('scroll', this.schedule, { passive: true });
    addEventListener('resize', this.schedule, { passive: true });
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
        history.replaceState(null, '', link.getAttribute('href'));
      });
    });
  }

  schedule() {
    if (!this.frame) this.frame = requestAnimationFrame(this.update);
  }

  update() {
    this.frame = 0;
    const now = performance.now();
    const elapsed = Math.max(16, now - this.lastTime);
    const moved = Math.abs(scrollY - this.lastY);
    const rawEnergy = plansReducedMotion ? 0 : plansClamp(0, moved / (elapsed * 2.2), 1);
    this.energy += (rawEnergy - this.energy) * (rawEnergy > this.energy ? 0.42 : 0.14);
    if (this.energy < 0.005) this.energy = 0;
    this.smoothY += (scrollY - this.smoothY) * (plansReducedMotion ? 1 : 0.26);
    if (Math.abs(scrollY - this.smoothY) < 0.1) this.smoothY = scrollY;
    this.lastY = scrollY;
    this.lastTime = now;

    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const pageProgress = plansClamp(0, this.smoothY / max, 1);
    const focal = innerHeight * 0.47;
    let activeIndex = 0;
    let nearest = Infinity;
    this.cuts.forEach((cut, index) => {
      const top = cut.offsetTop - this.smoothY;
      const height = cut.offsetHeight;
      const local = plansClamp(0, (innerHeight - top) / (innerHeight + height), 1);
      cut.style.setProperty('--plan-p', local.toFixed(4));
      cut.style.setProperty('--plan-o', ((local - 0.5) * 2).toFixed(4));
      const distance = Math.abs(top + Math.min(height, innerHeight) * 0.5 - focal);
      if (top + height > 0 && top < innerHeight && distance < nearest) {
        nearest = distance;
        activeIndex = index;
      }
    });
    this.activeIndex = activeIndex;
    const active = this.cuts[activeIndex];
    const totalFrames = pageProgress * 42 * 24;
    const seconds = Math.floor(totalFrames / 24);
    const frames = Math.floor(totalFrames % 24);
    if (this.name) this.name.textContent = active?.dataset.planCut || 'PLANS';
    if (this.timecode) this.timecode.textContent = `00:00:${String(seconds).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
    if (this.progress) this.progress.style.transform = `scaleX(${pageProgress.toFixed(4)})`;
    if (this.nav) this.nav.dataset.scVerifyState = `plan-cut:${activeIndex + 1}:${Math.round(pageProgress * 100)}`;
    document.documentElement.style.setProperty('--plan-energy', this.energy.toFixed(3));
    document.body.dataset.planTheme = active?.dataset.planTheme || 'dark';
    this.cuts.forEach((cut, index) => cut.classList.toggle('is-current-plan-cut', index === activeIndex));
    if (this.energy > 0 || this.smoothY !== scrollY) this.schedule();
  }
}

new PlansOpening();
new ScopeDirector();
new PlansTimeline();
