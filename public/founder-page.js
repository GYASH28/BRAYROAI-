document.body.classList.add('js');

const founderReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const founderFinePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const founderClamp = (min, value, max) => Math.min(max, Math.max(min, value));

class FounderOpening {
  constructor() {
    const finish = () => document.body.classList.remove('is-opening');
    if (founderReducedMotion) return finish();
    addEventListener('load', () => setTimeout(finish, 1220), { once: true });
    setTimeout(finish, 2100);
  }
}

class FounderReveal {
  constructor() {
    const items = [...document.querySelectorAll('[data-reveal]')];
    if (founderReducedMotion || !('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .14, rootMargin: '-3% 0px -11% 0px' });
    items.forEach((item) => observer.observe(item));
  }
}

class PortraitReveal {
  constructor() {
    this.stage = document.querySelector('[data-founder-portrait]');
    this.toggle = document.querySelector('[data-founder-colour-toggle]');
    this.locked = false;
    if (!this.stage) return;
    this.toggle?.addEventListener('click', () => this.setLocked(!this.locked));
    if (!founderFinePointer || founderReducedMotion) return;
    this.stage.addEventListener('pointerenter', () => {
      this.stage.classList.add('is-hovering');
      this.stage.dataset.scVerifyState = 'portrait:colour';
    });
    this.stage.addEventListener('pointerleave', () => {
      if (!this.locked) {
        this.stage.classList.remove('is-hovering');
        this.stage.dataset.scVerifyState = 'portrait:mono';
      }
    });
    this.stage.addEventListener('pointermove', (event) => {
      const rect = this.stage.getBoundingClientRect();
      const x = founderClamp(0, (event.clientX - rect.left) / rect.width, 1);
      const y = founderClamp(0, (event.clientY - rect.top) / rect.height, 1);
      this.stage.style.setProperty('--portrait-cx', `${(x * 100).toFixed(2)}%`);
      this.stage.style.setProperty('--portrait-cy', `${(y * 100).toFixed(2)}%`);
      this.stage.style.setProperty('--portrait-x', (x - .5).toFixed(3));
      this.stage.style.setProperty('--portrait-y', (y - .5).toFixed(3));
    }, { passive: true });
  }

  setLocked(locked) {
    this.locked = locked;
    this.stage.classList.toggle('is-revealed', locked);
    this.stage.dataset.scVerifyState = locked ? 'portrait:colour' : 'portrait:mono';
    if (!this.toggle) return;
    this.toggle.setAttribute('aria-pressed', String(locked));
    this.toggle.querySelector('span').textContent = locked ? 'Return to monochrome' : 'Reveal the original grade';
  }
}

class PrincipleInstrument {
  constructor() {
    this.root = document.querySelector('[data-principle-stage]');
    this.buttons = [...document.querySelectorAll('[data-principle]')];
    this.index = document.querySelector('[data-principle-index]');
    this.title = document.querySelector('[data-principle-title]');
    this.copy = document.querySelector('[data-principle-copy]');
    this.states = {
      clarity: ['01 / CLARITY', 'Make the decision clear before making it beautiful.', 'A visitor should know what matters, why it matters and what to do next. Style strengthens that structure; it never replaces it.'],
      craft: ['02 / CRAFT', 'The design is not finished until the browser agrees.', 'Motion, typography and interaction must survive responsive layouts, keyboard input and real performance budgets. Implementation is part of the direction.'],
      use: ['03 / USE', 'Technology should remove friction, not perform intelligence.', 'AI earns its place when it helps someone decide, organise or respond more clearly. If it adds theatre without utility, it does not ship.']
    };
    if (!this.root || !this.buttons.length) return;
    this.buttons.forEach((button) => {
      button.addEventListener('click', () => this.select(button.dataset.principle));
      button.addEventListener('keydown', (event) => this.navigate(event, button));
    });
    this.select('clarity');
  }

  navigate(event, button) {
    if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const next = this.buttons[(this.buttons.indexOf(button) + direction + this.buttons.length) % this.buttons.length];
    next.focus();
    this.select(next.dataset.principle);
  }

  select(key) {
    const state = this.states[key];
    if (!state) return;
    const position = ['clarity','craft','use'].indexOf(key);
    this.root.dataset.mode = key;
    this.root.dataset.scVerifyState = `principle:${key}`;
    this.root.style.setProperty('--principle', String(position));
    this.buttons.forEach((button) => {
      const active = button.dataset.principle === key;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    this.index.textContent = state[0];
    this.title.textContent = state[1];
    this.copy.textContent = state[2];
  }
}

class FounderSurfaceLight {
  constructor() {
    if (!founderFinePointer || founderReducedMotion) return;
    document.querySelectorAll('.glass-panel').forEach((surface) => {
      surface.addEventListener('pointermove', (event) => {
        const rect = surface.getBoundingClientRect();
        surface.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
        surface.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
      }, { passive:true });
    });
  }
}

class FounderTimeline {
  constructor() {
    this.scenes = [...document.querySelectorAll('[data-founder-scene]')];
    this.progress = document.querySelector('[data-founder-progress]');
    this.nav = document.querySelector('[data-founder-nav]');
    this.y = scrollY;
    this.frame = 0;
    this.update = this.update.bind(this);
    addEventListener('scroll', () => this.schedule(), { passive:true });
    addEventListener('resize', () => this.schedule(), { passive:true });
    this.bindAnchors();
    this.schedule();
  }

  bindAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior:founderReducedMotion ? 'auto' : 'smooth', block:'start' });
      });
    });
  }

  schedule() {
    if (!this.frame) this.frame = requestAnimationFrame(this.update);
  }

  update() {
    this.frame = 0;
    this.y += (scrollY - this.y) * (founderReducedMotion ? 1 : .18);
    if (Math.abs(scrollY - this.y) < .2) this.y = scrollY;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const p = founderClamp(0, this.y / max, 1);
    if (this.progress) this.progress.style.transform = `scaleX(${p.toFixed(4)})`;
    let active = this.scenes[0];
    let distance = Infinity;
    this.scenes.forEach((scene) => {
      const top = scene.offsetTop - this.y;
      const height = scene.offsetHeight;
      const local = founderClamp(0, (innerHeight * .85 - top) / (height + innerHeight * .7), 1);
      scene.style.setProperty('--founder-p', local.toFixed(4));
      const current = Math.abs(top + Math.min(height,innerHeight) * .5 - innerHeight * .48);
      if (top < innerHeight && top + height > 0 && current < distance) { active = scene; distance = current; }
    });
    if (this.nav && active) this.nav.dataset.scVerifyState = `founder:${active.dataset.founderScene}:${Math.round(p * 100)}`;
    if (this.y !== scrollY) this.schedule();
  }
}

new FounderOpening();
new FounderReveal();
new PortraitReveal();
new PrincipleInstrument();
new FounderSurfaceLight();
new FounderTimeline();
const founderProjectCta=document.querySelector('[data-founder-project-cta]');
if(founderProjectCta){
  const brief=['Hi Yash,','','I would like to discuss a project with BRAYROAI.','','Business / brand:','What needs to improve:','What should the website or product help people do:','Approximate budget and target date:','','Best way to reach me:'].join('\\n');
  const emailHref=`mailto:yashganesh.work@gmail.com?subject=${encodeURIComponent('Start a project with Yash at BRAYROAI')}&body=${encodeURIComponent(brief)}`;
  founderProjectCta.href=`https://wa.me/919175524637?text=${encodeURIComponent(`Hi Yash, I would like to discuss a project with BRAYROAI.\n\n${brief}`)}`;founderProjectCta.target='_blank';founderProjectCta.rel='noreferrer';founderProjectCta.innerHTML='Chat on WhatsApp <span>↗</span>';
  const email=document.createElement('a');email.className='founder-email-fallback';email.href=emailHref;email.textContent='Prefer email? Send the project brief ↗';founderProjectCta.after(email);
}
let founderScrollCraftMounted = false;
const founderMountTriggers = ['pointerdown', 'wheel', 'touchstart', 'keydown', 'scroll'];
const mountFounderScrollCraft = () => {
  if (founderScrollCraftMounted || !window.ScrollCraft) return;
  founderScrollCraftMounted = true;
  founderMountTriggers.forEach((eventName) => removeEventListener(eventName, mountFounderScrollCraft));
  window.ScrollCraft.mount(document.body);
};
if (founderReducedMotion) mountFounderScrollCraft();
else founderMountTriggers.forEach((eventName) => addEventListener(eventName, mountFounderScrollCraft, { once: true, passive: eventName !== 'keydown' }));
