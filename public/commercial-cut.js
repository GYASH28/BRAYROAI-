const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const clamp = (min, value, max) => Math.min(max, Math.max(min, value));

let scrollCraftMounted = false;
const scrollCraftTriggers = ['pointerdown', 'wheel', 'touchstart', 'keydown', 'scroll'];
const mountScrollCraft = () => {
  if (scrollCraftMounted || !window.ScrollCraft) return;
  scrollCraftMounted = true;
  scrollCraftTriggers.forEach((eventName) => removeEventListener(eventName, mountScrollCraft));
  window.ScrollCraft.mount(document.body);
};

const heroEntrance = document.querySelector('.hero-copy');
heroEntrance?.classList.add('sc-in');
[...(heroEntrance?.children || [])].forEach((element) => element.classList.add('sc-in'));

if (reducedMotion) mountScrollCraft();
else {
  scrollCraftTriggers.forEach((eventName) => addEventListener(eventName, mountScrollCraft, { once: true, passive: eventName !== 'keydown' }));
  if ('requestIdleCallback' in window) requestIdleCallback(mountScrollCraft, { timeout: 2600 });
  else setTimeout(mountScrollCraft, 1800);
}

class OpeningSequence {
  constructor() {
    const finish = () => document.body.classList.remove('is-opening');
    if (reducedMotion) {
      finish();
      return;
    }
    addEventListener('load', () => setTimeout(finish, 1420), { once: true });
    setTimeout(finish, 2600);
  }
}

class EditTransition {
  constructor() {
    this.root = document.querySelector('[data-edit-flash]');
    this.timer = 0;
  }

  play(theme) {
    if (!this.root || reducedMotion) return;
    const colours = { dark: '#ff4e19', light: '#2e61ff', cobalt: '#c8ff28', orange: '#101116' };
    this.root.style.setProperty('--edit-colour', colours[theme] || colours.dark);
    this.root.classList.remove('is-cutting');
    void this.root.offsetWidth;
    this.root.classList.add('is-cutting');
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.root.classList.remove('is-cutting'), 560);
  }
}

class Loader {
  constructor() {
    const loader = document.querySelector('[data-loader]');
    if (!loader || reducedMotion) {
      loader?.remove();
      return;
    }
    Promise.race([
      document.fonts?.ready || Promise.resolve(),
      new Promise((resolve) => setTimeout(resolve, 800))
    ]).finally(() => {
      setTimeout(() => loader.classList.add('is-gone'), 220);
      setTimeout(() => loader.remove(), 720);
    });
  }
}

class ColourDirector {
  constructor() {
    this.stage = document.querySelector('[data-colour-stage]');
    this.button = document.querySelector('[data-colour-toggle]');
    this.locked = false;
    if (!this.stage || !this.button) return;
    this.button.addEventListener('click', () => this.setLocked(!this.locked));
    if (finePointer && !reducedMotion) {
      this.stage.addEventListener('pointerenter', () => this.stage.classList.add('is-hovering'));
      this.stage.addEventListener('pointerleave', () => {
        if (!this.locked) this.stage.classList.remove('is-hovering');
      });
      this.stage.addEventListener('pointermove', (event) => this.move(event), { passive: true });
      this.stage.addEventListener('pointerdown', (event) => {
        if (event.target.closest('a,button')) return;
        this.setLocked(!this.locked);
      });
    }
  }

  move(event) {
    const rect = this.stage.getBoundingClientRect();
    const x = clamp(0, (event.clientX - rect.left) / rect.width, 1);
    const y = clamp(0, (event.clientY - rect.top) / rect.height, 1);
    this.stage.style.setProperty('--colour-x', `${(x * 100).toFixed(2)}%`);
    this.stage.style.setProperty('--colour-y', `${(y * 100).toFixed(2)}%`);
    this.stage.style.setProperty('--lean-x', (x - 0.5).toFixed(3));
    this.stage.style.setProperty('--lean-y', (y - 0.5).toFixed(3));
  }

  setLocked(locked) {
    this.locked = locked;
    this.stage.classList.toggle('is-locked', locked);
    this.stage.classList.toggle('is-hovering', locked || this.stage.matches(':hover'));
    this.button.setAttribute('aria-pressed', String(locked));
    this.button.querySelector('span').textContent = locked ? 'Release the grade' : 'Direct the colour';
    this.stage.dataset.scVerifyState = locked ? 'colour:locked' : 'colour:mono';
  }
}

class ResponsivePreview {
  constructor() {
    this.preview = document.querySelector('[data-responsive-preview]');
    this.proof = document.querySelector('[data-proof-stage]');
    this.label = document.querySelector('[data-proof-label]');
    this.buttons = [...document.querySelectorAll('button[data-preview-mode]')];
    if (!this.preview || !this.proof || !this.buttons.length) return;
    this.buttons.forEach((button) => {
      button.addEventListener('click', () => this.select(button.dataset.previewMode));
      button.addEventListener('keydown', (event) => this.navigate(event, button));
    });
    this.select('desktop');
  }

  navigate(event, button) {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const index = this.buttons.indexOf(button);
    const next = this.buttons[(index + direction + this.buttons.length) % this.buttons.length];
    next.focus();
    this.select(next.dataset.previewMode);
  }

  select(mode) {
    if (!['desktop', 'mobile'].includes(mode)) return;
    this.preview.dataset.previewMode = mode;
    this.preview.dataset.scVerifyState = `preview:${mode}`;
    this.proof.dataset.proofView = mode;
    this.proof.dataset.scVerifyState = `proof:${mode}`;
    this.buttons.forEach((button) => {
      const active = button.dataset.previewMode === mode;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (this.label) {
      this.label.textContent = mode === 'desktop'
        ? 'Desktop leads. Mobile stays in frame.'
        : 'Mobile leads. Desktop keeps the context.';
    }
  }
}

class ClarityControl {
  constructor() {
    this.console = document.querySelector('[data-relief-console]');
    this.input = document.querySelector('[data-clarity]');
    this.output = document.querySelector('[data-clarity-output]');
    if (!this.console || !this.input || !this.output) return;
    this.update = this.update.bind(this);
    this.input.addEventListener('input', this.update);
    this.update();
  }

  update() {
    const value = Number(this.input.value);
    this.console.style.setProperty('--clarity', (value / 100).toFixed(2));
    this.output.value = `${value}%`;
    this.console.dataset.scVerifyState = `clarity:${value}`;
  }
}

class AIWorkflow {
  constructor() {
    this.root = document.querySelector('[data-ai-demo]');
    this.buttons = [...document.querySelectorAll('[data-ai-choice]')];
    this.title = document.querySelector('[data-ai-title]');
    this.answer = document.querySelector('[data-ai-answer]');
    this.states = {
      leads: ['Qualify before the inbox.', 'Capture intent, score fit and route each enquiry to the right next action without making the customer wait.'],
      content: ['Turn knowledge into a system.', 'Structure source material, draft against approved context and keep a human decision at the final publishing step.'],
      support: ['Resolve the repeatable. Escalate the important.', 'Answer known questions immediately, preserve context and move unusual cases to a person with the full conversation attached.']
    };
    this.buttons.forEach((button) => button.addEventListener('click', () => this.select(button.dataset.aiChoice)));
  }

  select(key) {
    const state = this.states[key];
    if (!state) return;
    this.buttons.forEach((button) => {
      const active = button.dataset.aiChoice === key;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    this.title.textContent = state[0];
    this.answer.textContent = state[1];
    this.root.dataset.scVerifyState = `workflow:${key}`;
  }
}

class FilmController {
  constructor() {
    this.video = document.querySelector('[data-commercial-film]');
    this.controls = document.querySelector('[data-film-controls]');
    this.toggle = document.querySelector('[data-film-toggle]');
    this.icon = document.querySelector('[data-film-icon]');
    this.label = document.querySelector('[data-film-label]');
    this.range = document.querySelector('[data-film-range]');
    this.time = document.querySelector('[data-film-time]');
    this.userPaused = false;
    if (!this.video || !this.controls || reducedMotion) return;
    this.visible = false;
    this.ready = false;
    this.toggle?.addEventListener('click', () => this.togglePlayback());
    this.range?.addEventListener('input', () => this.seek());
    this.video.addEventListener('timeupdate', () => this.paint());
    this.video.addEventListener('play', () => this.paint());
    this.video.addEventListener('pause', () => this.paint());
    this.playbackObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        this.visible = entry.isIntersecting;
        if (!this.ready) return;
        if (this.visible && !this.userPaused) {
          this.video.play().catch(() => {});
        } else {
          this.video.pause();
        }
      });
    }, { threshold: 0.28 });
    this.playbackObserver.observe(this.video);
    this.loadObserver = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      this.loadObserver.disconnect();
      this.load();
    }, { rootMargin: '120% 0px', threshold: 0.01 });
    this.loadObserver.observe(this.video);
  }

  async load() {
    const source = innerWidth <= 700 ? this.video.dataset.srcMobile : this.video.dataset.src;
    if (!source) return;
    try {
      const response = await fetch(source);
      if (!response.ok) throw new Error(`Film request failed: ${response.status}`);
      const blob = await response.blob();
      this.video.src = URL.createObjectURL(blob);
      this.video.preload = 'auto';
      this.video.load();
      await new Promise((resolve) => {
        if (this.video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) resolve();
        else this.video.addEventListener('canplaythrough', resolve, { once: true });
      });
      this.ready = true;
      this.controls.classList.add('is-ready');
      this.paint();
      if (this.visible && !this.userPaused) this.video.play().catch(() => {});
    } catch (error) {
      console.warn(error);
      this.controls.dataset.scVerifyState = 'film:fallback';
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
    const safe = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
    return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`;
  }

  paint() {
    if (!this.ready) return;
    const duration = Number.isFinite(this.video.duration) ? this.video.duration : 0;
    const ratio = duration ? this.video.currentTime / duration : 0;
    if (this.range && document.activeElement !== this.range) this.range.value = String(Math.round(ratio * 1000));
    if (this.time) this.time.value = `${this.format(this.video.currentTime)} / ${this.format(duration)}`;
    const playing = !this.video.paused;
    if (this.icon) this.icon.textContent = playing ? 'Ⅱ' : '▶';
    if (this.label) this.label.textContent = playing ? 'Pause' : 'Play';
    if (this.toggle) this.toggle.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} brand film`);
    this.controls.dataset.scVerifyState = `film:ready:${playing ? 'playing' : 'paused'}:${Math.round(ratio * 100)}`;
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
    const index = this.buttons.indexOf(button);
    const next = this.buttons[(index + direction + this.buttons.length) % this.buttons.length];
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
    if (this.label) this.label.textContent = names[type];
    this.cta.href = `mailto:yashganesh.work@gmail.com?subject=${encodeURIComponent(`Start a BRAYROAI ${names[type]} project`)}`;
    this.root.dataset.scVerifyState = `project:${type}`;
  }
}

class CommercialTimeline {
  constructor(editTransition) {
    this.cuts = [...document.querySelectorAll('[data-commercial-cut]')];
    this.bar = document.querySelector('[data-broadcast]');
    this.name = document.querySelector('[data-cut-name]');
    this.timecode = document.querySelector('[data-timecode]');
    this.progress = document.querySelector('[data-progress]');
    this.frame = 0;
    this.activeIndex = 0;
    this.hasPainted = false;
    this.smoothY = scrollY;
    this.lastY = scrollY;
    this.lastTime = performance.now();
    this.energy = 0;
    this.editTransition = editTransition;
    this.update = this.update.bind(this);
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
    const distanceTravelled = Math.abs(scrollY - this.lastY);
    const rawEnergy = reducedMotion ? 0 : clamp(0, distanceTravelled / (elapsed * 2.4), 1);
    this.energy += (rawEnergy - this.energy) * (rawEnergy > this.energy ? 0.45 : 0.16);
    if (this.energy < 0.006) this.energy = 0;
    this.lastY = scrollY;
    this.lastTime = now;
    const smoothing = reducedMotion ? 1 : 0.22;
    this.smoothY += (scrollY - this.smoothY) * smoothing;
    if (Math.abs(scrollY - this.smoothY) < 0.25) this.smoothY = scrollY;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const p = clamp(0, this.smoothY / max, 1);
    const focal = innerHeight * 0.46;
    let index = 0;
    let distance = Infinity;
    this.cuts.forEach((cut, cutIndex) => {
      const top = cut.offsetTop - this.smoothY;
      const height = cut.offsetHeight;
      const bottom = top + height;
      const local = clamp(0, (innerHeight - top) / (innerHeight + height), 1);
      cut.style.setProperty('--cut-p', local.toFixed(4));
      cut.style.setProperty('--cut-o', ((local - 0.5) * 2).toFixed(4));
      const current = Math.abs(top + Math.min(height, innerHeight) * 0.5 - focal);
      if (bottom > 0 && top < innerHeight && current < distance) {
        index = cutIndex;
        distance = current;
      }
    });
    const changed = this.hasPainted && index !== this.activeIndex;
    this.activeIndex = index;
    const active = this.cuts[index];
    if (changed) this.editTransition?.play(active?.dataset.cutTheme);
    this.hasPainted = true;
    const totalFrames = Math.round(p * 30 * 24);
    const seconds = Math.floor(totalFrames / 24);
    const frames = totalFrames % 24;
    if (this.name) this.name.textContent = active?.dataset.commercialCut || 'DIRECTOR\'S CUT';
    if (this.timecode) this.timecode.textContent = `00:00:${String(seconds).padStart(2, '0')}:${String(Math.max(0, frames)).padStart(2, '0')}`;
    if (this.progress) this.progress.style.transform = `scaleX(${p.toFixed(4)})`;
    if (this.bar) this.bar.dataset.scVerifyState = `cut-${index + 1}:${Math.round(p * 100)}`;
    document.documentElement.style.setProperty('--motion-energy', this.energy.toFixed(3));
    document.body.dataset.cut = String(index + 1);
    document.body.dataset.theme = active?.dataset.cutTheme || 'dark';
    document.body.dataset.motion = this.energy > 0.5 ? 'rush' : this.energy > 0.12 ? 'moving' : 'settled';
    this.cuts.forEach((cut, cutIndex) => cut.classList.toggle('is-current-cut', cutIndex === index));
    if (this.energy > 0 || this.smoothY !== scrollY) this.schedule();
  }
}

new OpeningSequence();
new Loader();
new ColourDirector();
new ResponsivePreview();
new ClarityControl();
new AIWorkflow();
new FilmController();
new ProjectIntent();
new CommercialTimeline(new EditTransition());
