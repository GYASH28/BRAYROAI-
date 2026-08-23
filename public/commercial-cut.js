document.body.classList.add('js');

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const clamp = (min, value, max) => Math.min(max, Math.max(min, value));
const lerp = (from, to, amount) => from + (to - from) * amount;

class OpeningSequence {
  constructor() {
    const finish = () => document.body.classList.remove('is-opening');
    if (reducedMotion) return finish();
    addEventListener('load', () => setTimeout(finish, 1340), { once: true });
    setTimeout(finish, 2200);
  }
}

class RevealDirector {
  constructor() {
    this.items = [...document.querySelectorAll('[data-reveal]')];
    if (reducedMotion || !('IntersectionObserver' in window)) {
      this.items.forEach((item) => item.classList.add('is-visible'));
      return;
    }
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        this.observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '-3% 0px -11% 0px' });
    this.items.forEach((item) => this.observer.observe(item));
  }
}

class MobileMenu {
  constructor() {
    this.button = document.querySelector('[data-menu-button]');
    this.menu = document.querySelector('[data-mobile-menu]');
    if (!this.button || !this.menu) return;
    this.button.addEventListener('click', () => this.setOpen(this.button.getAttribute('aria-expanded') !== 'true'));
    this.menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => this.setOpen(false)));
    addEventListener('keydown', (event) => {
      if (event.key === 'Escape') this.setOpen(false);
    });
  }

  setOpen(open) {
    this.button.setAttribute('aria-expanded', String(open));
    this.menu.setAttribute('aria-hidden', String(!open));
    this.menu.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  }
}

class ColourDirector {
  constructor() {
    this.stage = document.querySelector('[data-colour-stage]');
    this.button = document.querySelector('[data-colour-toggle]');
    this.locked = false;
    if (!this.stage || !this.button) return;
    this.button.addEventListener('click', () => this.setLocked(!this.locked));
    if (!finePointer || reducedMotion) return;
    this.stage.addEventListener('pointerenter', () => this.stage.classList.add('is-hovering'));
    this.stage.addEventListener('pointerleave', () => {
      if (!this.locked) this.stage.classList.remove('is-hovering');
    });
    this.stage.addEventListener('pointermove', (event) => this.move(event), { passive: true });
  }

  move(event) {
    const rect = this.stage.getBoundingClientRect();
    const x = clamp(0, (event.clientX - rect.left) / rect.width, 1);
    const y = clamp(0, (event.clientY - rect.top) / rect.height, 1);
    this.stage.style.setProperty('--colour-x', `${(x * 100).toFixed(2)}%`);
    this.stage.style.setProperty('--colour-y', `${(y * 100).toFixed(2)}%`);
    this.stage.style.setProperty('--pointer-x', (x - 0.5).toFixed(3));
    this.stage.style.setProperty('--pointer-y', (y - 0.5).toFixed(3));
  }

  setLocked(locked) {
    this.locked = locked;
    this.stage.classList.toggle('is-locked', locked);
    this.stage.classList.toggle('is-hovering', locked || this.stage.matches(':hover'));
    this.stage.dataset.scVerifyState = locked ? 'colour:locked' : 'colour:mono';
    this.button.setAttribute('aria-pressed', String(locked));
    this.button.querySelector('span').textContent = locked ? 'Release the colour' : 'Hold the colour';
  }
}

class CapabilityInstrument {
  constructor() {
    this.root = document.querySelector('[data-capability-stage]');
    this.buttons = [...document.querySelectorAll('[data-capability]')];
    this.index = document.querySelector('[data-capability-index]');
    this.title = document.querySelector('[data-capability-title]');
    this.copy = document.querySelector('[data-capability-copy]');
    this.states = {
      design: ['01 / DESIGN', 'Make the right impression deliberate.', 'Positioning, art direction, interface and motion shaped around the action your visitor needs to take.'],
      engineering: ['02 / ENGINEERING', 'Make the idea survive the browser.', 'Responsive frontend systems, accessible interactions and production detail that hold up beyond the presentation.'],
      ai: ['03 / USEFUL AI', 'Remove friction without adding theatre.', 'Practical intelligent workflows that qualify, organise or respond while keeping human judgment where it matters.']
    };
    if (!this.root || !this.buttons.length) return;
    this.buttons.forEach((button) => {
      button.addEventListener('click', () => this.select(button.dataset.capability));
      button.addEventListener('keydown', (event) => this.navigate(event, button));
    });
    this.select('design');
  }

  navigate(event, button) {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const next = this.buttons[(this.buttons.indexOf(button) + direction + this.buttons.length) % this.buttons.length];
    next.focus();
    this.select(next.dataset.capability);
  }

  select(key) {
    const state = this.states[key];
    if (!state) return;
    const position = ['design', 'engineering', 'ai'].indexOf(key);
    this.root.dataset.mode = key;
    this.root.dataset.scVerifyState = `capability:${key}`;
    this.root.style.setProperty('--capability', String(position));
    this.buttons.forEach((button) => {
      const active = button.dataset.capability === key;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    this.index.textContent = state[0];
    this.title.textContent = state[1];
    this.copy.textContent = state[2];
  }
}

class FilmController {
  constructor() {
    this.video = document.querySelector('[data-commercial-film]');
    this.controls = document.querySelector('[data-film-controls]');
    this.toggle = document.querySelector('[data-film-toggle]');
    this.range = document.querySelector('[data-film-range]');
    this.output = document.querySelector('[data-film-time]');
    this.icon = document.querySelector('[data-film-icon]');
    this.label = document.querySelector('[data-film-label]');
    this.ready = false;
    this.visible = false;
    this.userPaused = false;
    if (!this.video || reducedMotion) return;
    this.toggle?.addEventListener('click', () => this.togglePlayback());
    this.range?.addEventListener('input', () => this.seek());
    this.video.addEventListener('timeupdate', () => this.paint());
    this.video.addEventListener('play', () => this.paint());
    this.video.addEventListener('pause', () => this.paint());
    this.visibilityObserver = new IntersectionObserver((entries) => {
      this.visible = entries.some((entry) => entry.isIntersecting);
      if (!this.ready) return;
      if (this.visible && !this.userPaused) this.video.play().catch(() => {});
      else this.video.pause();
    }, { threshold: 0.22 });
    this.visibilityObserver.observe(this.video);
    this.loadObserver = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      this.loadObserver.disconnect();
      this.load();
    }, { rootMargin: '20% 0px', threshold: 0.01 });
    this.loadObserver.observe(this.video);
  }

  async load() {
    const source = innerWidth <= 700 ? this.video.dataset.srcMobile : this.video.dataset.src;
    try {
      const response = await fetch(source);
      if (!response.ok) throw new Error(`Film request failed: ${response.status}`);
      const blob = await response.blob();
      this.video.src = URL.createObjectURL(blob);
      this.video.load();
      await new Promise((resolve) => {
        if (this.video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) resolve();
        else this.video.addEventListener('canplaythrough', resolve, { once: true });
      });
      this.ready = true;
      this.video.classList.add('is-ready');
      this.controls?.classList.add('is-ready');
      this.paint();
      if (this.visible && !this.userPaused) this.video.play().catch(() => {});
    } catch (error) {
      console.warn(error);
      if (this.controls) this.controls.dataset.scVerifyState = 'film:fallback';
    }
  }

  togglePlayback() {
    if (!this.ready) return;
    if (this.video.paused) {
      this.userPaused = false;
      this.video.play().catch(() => {});
    } else {
      this.userPaused = true;
      this.video.pause();
    }
    this.paint();
  }

  seek() {
    if (!this.ready || !Number.isFinite(this.video.duration)) return;
    this.video.currentTime = (Number(this.range.value) / 1000) * this.video.duration;
    this.paint();
  }

  format(value) {
    const seconds = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
    return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  }

  paint() {
    if (!this.ready) return;
    const duration = Number.isFinite(this.video.duration) ? this.video.duration : 0;
    const ratio = duration ? this.video.currentTime / duration : 0;
    if (this.range && document.activeElement !== this.range) this.range.value = String(Math.round(ratio * 1000));
    if (this.output) this.output.value = `${this.format(this.video.currentTime)} / ${this.format(duration)}`;
    const playing = !this.video.paused;
    if (this.icon) this.icon.textContent = playing ? 'Ⅱ' : '▶';
    if (this.label) this.label.textContent = playing ? 'Pause' : 'Play';
    if (this.toggle) this.toggle.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} brand film`);
    if (this.controls) this.controls.dataset.scVerifyState = `film:ready:${playing ? 'playing' : 'paused'}:${Math.round(ratio * 100)}`;
  }
}

class WorkFocus {
  constructor() {
    this.stage = document.querySelector('[data-work-stage]');
    this.button = document.querySelector('[data-work-toggle]');
    if (!this.stage || !this.button) return;
    this.button.addEventListener('click', () => this.toggle());
  }

  toggle() {
    const mobile = !this.stage.classList.contains('is-mobile');
    this.stage.classList.toggle('is-mobile', mobile);
    this.stage.dataset.scVerifyState = mobile ? 'work:mobile' : 'work:desktop';
    this.button.setAttribute('aria-pressed', String(mobile));
    this.button.querySelector('i').textContent = mobile ? 'MOBILE' : 'DESKTOP';
  }
}

class ProjectIntent {
  constructor() {
    this.root = document.querySelector('[data-project-intent]');
    this.buttons = [...document.querySelectorAll('[data-project-type]')];
    this.cta = document.querySelector('[data-project-cta]');
    this.label = document.querySelector('[data-project-label]');
    if (!this.root || !this.cta || !this.buttons.length) return;
    this.buttons.forEach((button) => {
      button.addEventListener('click', () => this.select(button.dataset.projectType));
      button.addEventListener('keydown', (event) => this.navigate(event, button));
    });
    this.select('website');
  }

  navigate(event, button) {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const next = this.buttons[(this.buttons.indexOf(button) + direction + this.buttons.length) % this.buttons.length];
    next.focus();
    this.select(next.dataset.projectType);
  }

  select(type) {
    const names = { website: 'website', product: 'digital product', ai: 'useful AI' };
    if (!names[type]) return;
    this.buttons.forEach((button) => {
      const active = button.dataset.projectType === type;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    this.label.textContent = names[type];
    this.cta.href = `mailto:yashganesh.work@gmail.com?subject=${encodeURIComponent(`Start a BRAYROAI ${names[type]} project`)}`;
    this.root.dataset.scVerifyState = `project:${type}`;
  }
}

class SurfaceLight {
  constructor() {
    if (!finePointer || reducedMotion) return;
    document.querySelectorAll('.glass-panel,.glass-control').forEach((surface) => {
      surface.addEventListener('pointermove', (event) => {
        const rect = surface.getBoundingClientRect();
        surface.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
        surface.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
      }, { passive: true });
    });
    document.querySelectorAll('.magnetic').forEach((element) => {
      element.addEventListener('pointermove', (event) => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        element.style.transform = `translate3d(${(x * 7).toFixed(2)}px, ${(y * 5).toFixed(2)}px, 0)`;
      }, { passive: true });
      element.addEventListener('pointerleave', () => { element.style.transform = ''; });
    });
  }
}

class SmoothTimeline {
  constructor() {
    this.scenes = [...document.querySelectorAll('[data-scene]')];
    this.progress = document.querySelector('[data-progress]');
    this.nav = document.querySelector('[data-site-nav]');
    this.currentY = scrollY;
    this.targetY = scrollY;
    this.frame = 0;
    this.tick = this.tick.bind(this);
    this.schedule = this.schedule.bind(this);
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
        target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      });
    });
  }

  schedule() {
    this.targetY = scrollY;
    if (!this.frame) this.frame = requestAnimationFrame(this.tick);
  }

  tick() {
    this.frame = 0;
    this.currentY = reducedMotion ? this.targetY : lerp(this.currentY, this.targetY, 0.16);
    if (Math.abs(this.currentY - this.targetY) < 0.2) this.currentY = this.targetY;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const pageProgress = clamp(0, this.currentY / max, 1);
    if (this.progress) this.progress.style.transform = `scaleX(${pageProgress.toFixed(4)})`;
    let active = this.scenes[0];
    let activeDistance = Infinity;
    this.scenes.forEach((scene) => {
      const top = scene.offsetTop - this.currentY;
      const height = scene.offsetHeight;
      const local = clamp(0, (innerHeight * 0.86 - top) / (height + innerHeight * 0.7), 1);
      scene.style.setProperty('--scene-p', local.toFixed(4));
      const distance = Math.abs(top + Math.min(height, innerHeight) * 0.5 - innerHeight * 0.48);
      if (top < innerHeight && top + height > 0 && distance < activeDistance) {
        active = scene;
        activeDistance = distance;
      }
    });
    this.paintFilm();
    if (this.nav && active) this.nav.dataset.scVerifyState = `scene:${active.dataset.scene}:${Math.round(pageProgress * 100)}`;
    if (this.currentY !== this.targetY) this.schedule();
  }

  paintFilm() {
    const film = document.querySelector('.film');
    if (!film || reducedMotion) return;
    const p = Number(getComputedStyle(film).getPropertyValue('--scene-p')) || 0;
    const windowOpacity = (start, peak, end) => {
      if (p <= start || p >= end) return 0;
      if (p < peak) return clamp(0, (p - start) / (peak - start), 1);
      return clamp(0, (end - p) / (end - peak), 1);
    };
    const values = [windowOpacity(.05, .18, .38), windowOpacity(.34, .5, .69), p < .65 ? 0 : clamp(0, (p - .65) / .16, 1)];
    document.querySelectorAll('[data-film-line]').forEach((line, index) => {
      const opacity = values[index];
      line.style.opacity = opacity.toFixed(3);
      if (index === 2) line.style.transform = `translate3d(0, ${(-35 + (1 - opacity) * 10).toFixed(2)}%, 0) scale(${(.96 + opacity * .04).toFixed(3)})`;
      else line.style.transform = `translate3d(0, ${((1 - opacity) * 2).toFixed(2)}rem, 0)`;
    });
  }
}

let scrollCraftMounted = false;
const scrollCraftTriggers = ['pointerdown', 'wheel', 'touchstart', 'keydown', 'scroll'];
const mountScrollCraft = () => {
  if (scrollCraftMounted || !window.ScrollCraft) return;
  scrollCraftMounted = true;
  scrollCraftTriggers.forEach((eventName) => removeEventListener(eventName, mountScrollCraft));
  window.ScrollCraft.mount(document.body);
};

new OpeningSequence();
new RevealDirector();
new MobileMenu();
new ColourDirector();
new CapabilityInstrument();
new FilmController();
new WorkFocus();
new ProjectIntent();
new SurfaceLight();
new SmoothTimeline();
if (reducedMotion) mountScrollCraft();
else scrollCraftTriggers.forEach((eventName) => addEventListener(eventName, mountScrollCraft, { once: true, passive: eventName !== 'keydown' }));
