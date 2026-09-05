(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const clamp = (min, value, max) => Math.min(max, Math.max(min, value));

  class IntroPerformanceGuard {
    constructor() {
      if (reduced) return;
      this.opening = document.querySelector('.opening-sequence.hf-intro');
      this.skip = this.opening?.querySelector('[data-hf-skip]');
      this.sound = this.opening?.querySelector('[data-hf-sound]');
      if (!this.opening || !this.skip || !document.body.classList.contains('hf-intro-active')) return;

      // Keep the ident intentional, but do not let a passive cinematic intro become the page LCP.
      // If someone explicitly enables sound, they have opted into the full film and we leave it alone.
      this.timer = window.setTimeout(() => {
        if (!document.body.classList.contains('hf-intro-active')) return;
        if (this.sound?.getAttribute('aria-pressed') === 'true') return;
        this.skip.click();
      }, 3200);

      this.skip.addEventListener('click', () => clearTimeout(this.timer), { once:true });
      addEventListener('pagehide', () => clearTimeout(this.timer), { once:true });
    }
  }

  class V12Reveal {
    constructor() {
      const nodes = [...document.querySelectorAll('[data-v12-reveal]')];
      if (!nodes.length) return;
      if (reduced || !('IntersectionObserver' in window)) {
        nodes.forEach((node) => node.classList.add('is-visible'));
        return;
      }
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: .13, rootMargin: '-2% 0px -9% 0px' });
      nodes.forEach((node) => observer.observe(node));
    }
  }

  class FloatingHeader {
    constructor() {
      this.nav = document.querySelector('[data-site-nav]');
      if (!this.nav) return;
      this.links = [...this.nav.querySelectorAll('nav a[href^="#"]')];
      this.sections = this.links.map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) })).filter((item) => item.section);
      this.raf = 0;
      addEventListener('scroll', () => this.schedule(), { passive: true });
      addEventListener('resize', () => this.schedule(), { passive: true });
      this.schedule();
    }
    schedule() {
      if (this.raf) return;
      this.raf = requestAnimationFrame(() => this.paint());
    }
    paint() {
      this.raf = 0;
      this.nav.classList.toggle('v12-scrolled', scrollY > 84);
      const anchor = innerHeight * .34;
      let current = null;
      for (const item of this.sections) {
        const rect = item.section.getBoundingClientRect();
        if (rect.top <= anchor && rect.bottom >= anchor) current = item;
      }
      this.links.forEach((link) => link.classList.toggle('is-current', current?.link === link));
    }
  }

  class CapabilityStory {
    constructor() {
      this.root = document.querySelector('[data-v12-story]');
      if (!this.root) return;
      this.visual = this.root.querySelector('[data-v12-story-visual]');
      this.word = this.root.querySelector('[data-v12-story-word]');
      this.index = this.root.querySelector('[data-v12-story-index]');
      this.steps = [...this.root.querySelectorAll('[data-v12-step]')];
      this.states = {
        web: { word: 'WEB', index: '01 / 04', accent: 'rgba(255,107,44,.34)', x: '68%', y: '28%' },
        product: { word: 'PRODUCT', index: '02 / 04', accent: 'rgba(243,240,234,.22)', x: '35%', y: '34%' },
        frontend: { word: 'FRONTEND', index: '03 / 04', accent: 'rgba(62,123,255,.30)', x: '70%', y: '66%' },
        ai: { word: 'AI SYSTEMS', index: '04 / 04', accent: 'rgba(62,123,255,.40)', x: '34%', y: '70%' }
      };
      if (!this.steps.length) return;
      const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) this.select(visible.target.dataset.v12Step);
      }, { threshold: [.28,.42,.58,.72], rootMargin: '-18% 0px -25% 0px' });
      this.steps.forEach((step) => observer.observe(step));
      this.select(this.steps[0].dataset.v12Step);
    }
    select(key) {
      const state = this.states[key];
      if (!state || !this.visual) return;
      this.visual.dataset.state = key;
      this.visual.style.setProperty('--v12-story-accent', state.accent);
      this.visual.style.setProperty('--v12-story-x', state.x);
      this.visual.style.setProperty('--v12-story-y', state.y);
      if (this.word && this.word.textContent !== state.word) {
        this.word.style.opacity = '0';
        this.word.style.transform = 'translateY(18px)';
        setTimeout(() => {
          this.word.textContent = state.word;
          this.word.style.opacity = '1';
          this.word.style.transform = '';
        }, reduced ? 0 : 180);
      }
      if (this.index) this.index.textContent = state.index;
      this.steps.forEach((step) => step.classList.toggle('is-active', step.dataset.v12Step === key));
    }
  }

  class ProjectPreview {
    constructor() {
      this.preview = document.querySelector('[data-v12-project-preview]');
      this.image = this.preview?.querySelector('img');
      this.rows = [...document.querySelectorAll('[data-v12-project]')];
      if (!fine || reduced || !this.preview || !this.image || !this.rows.length) return;
      this.x = innerWidth / 2;
      this.y = innerHeight / 2;
      this.tx = this.x;
      this.ty = this.y;
      this.raf = 0;
      addEventListener('pointermove', (event) => {
        this.tx = event.clientX;
        this.ty = event.clientY;
        this.schedule();
      }, { passive: true });
      this.rows.forEach((row) => {
        row.addEventListener('pointerenter', () => this.show(row));
        row.addEventListener('pointerleave', () => this.hide());
        row.addEventListener('focusin', () => this.show(row));
        row.addEventListener('focusout', () => this.hide());
      });
    }
    show(row) {
      const src = row.dataset.preview;
      if (src) this.image.src = src;
      this.image.alt = '';
      this.preview.dataset.label = row.dataset.previewLabel || 'VIEW';
      this.preview.classList.add('is-visible');
      this.schedule();
    }
    hide() { this.preview.classList.remove('is-visible'); }
    schedule() {
      if (!this.raf) this.raf = requestAnimationFrame(() => this.paint());
    }
    paint() {
      this.raf = 0;
      this.x += (this.tx - this.x) * .16;
      this.y += (this.ty - this.y) * .16;
      const w = Math.min(496, innerWidth * .36);
      const x = clamp(18, this.x + 28, innerWidth - w - 18);
      const y = clamp(18, this.y - w / 2.84, innerHeight - w / 1.42 - 18);
      this.preview.style.setProperty('--preview-x', `${x}px`);
      this.preview.style.setProperty('--preview-y', `${y}px`);
      if (Math.abs(this.tx - this.x) > .15 || Math.abs(this.ty - this.y) > .15) this.schedule();
    }
  }

  class ContextCursor {
    constructor() {
      this.cursor = document.querySelector('[data-v12-cursor]');
      if (!fine || reduced || !this.cursor) return;
      this.targets = [...document.querySelectorAll('[data-cursor-label]')];
      addEventListener('pointermove', (event) => {
        document.documentElement.style.setProperty('--cursor-x', `${event.clientX}px`);
        document.documentElement.style.setProperty('--cursor-y', `${event.clientY}px`);
      }, { passive: true });
      this.targets.forEach((target) => {
        target.addEventListener('pointerenter', () => {
          this.cursor.textContent = target.dataset.cursorLabel || 'VIEW';
          this.cursor.dataset.mode = target.dataset.cursorMode || 'view';
          this.cursor.classList.add('is-visible');
        });
        target.addEventListener('pointerleave', () => this.cursor.classList.remove('is-visible'));
      });
    }
  }

  class ProductTilt {
    constructor() {
      if (!fine || reduced) return;
      document.querySelectorAll('[data-v12-tilt]').forEach((card) => {
        card.addEventListener('pointermove', (event) => {
          const rect = card.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width - .5;
          const py = (event.clientY - rect.top) / rect.height - .5;
          card.style.transform = `perspective(1100px) rotateX(${(-py * 2.4).toFixed(2)}deg) rotateY(${(px * 3.2).toFixed(2)}deg) translateY(-8px)`;
        }, { passive: true });
        card.addEventListener('pointerleave', () => { card.style.transform = ''; });
      });
    }
  }

  class HeroTextGuard {
    constructor() {
      const title = document.querySelector('.v12-hero-title');
      if (!title) return;
      const fit = () => {
        const max = innerWidth <= 760 ? innerWidth - 32 : innerWidth * .88;
        title.style.maxWidth = `${Math.max(280, max)}px`;
      };
      addEventListener('resize', fit, { passive: true });
      fit();
    }
  }

  new IntroPerformanceGuard();
  new V12Reveal();
  new FloatingHeader();
  new CapabilityStory();
  new ProjectPreview();
  new ContextCursor();
  new ProductTilt();
  new HeroTextGuard();
})();
