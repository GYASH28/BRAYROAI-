(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const mobile = matchMedia('(max-width:760px)').matches;
  const clamp = (min, value, max) => Math.min(max, Math.max(min, value));

  class IntroPerformanceGuard {
    constructor() {
      if (reduced) return;
      this.opening = document.querySelector('.opening-sequence.hf-intro');
      this.skip = this.opening?.querySelector('[data-hf-skip]');
      this.sound = this.opening?.querySelector('[data-hf-sound]');
      this.video = this.opening?.querySelector('[data-hf-intro-video]');
      if (!this.opening || !document.body.classList.contains('hf-intro-active')) return;

      if (mobile) {
        this.mountLiteMobileIdent();
        return;
      }

      if (!this.skip) return;
      // Desktop keeps the film. Passive visits get a concise cut; sound-on means the user opted into the full film.
      this.timer = window.setTimeout(() => {
        if (!document.body.classList.contains('hf-intro-active')) return;
        if (this.sound?.getAttribute('aria-pressed') === 'true') return;
        this.skip.click();
      }, 3200);

      this.skip.addEventListener('click', () => clearTimeout(this.timer), { once:true });
      addEventListener('pagehide', () => clearTimeout(this.timer), { once:true });
    }

    mountLiteMobileIdent() {
      if (document.querySelector('.v12-mobile-ident')) return;

      const style = document.createElement('style');
      style.dataset.v12MobileIdent = '';
      style.textContent = `
        body.v12-mobile-ident-active{overflow:hidden!important;overscroll-behavior:none}
        .v12-mobile-ident{position:fixed;z-index:2147481000;inset:0;display:grid;align-content:end;padding:max(1.25rem,env(safe-area-inset-top)) 1.2rem max(2rem,env(safe-area-inset-bottom));background:#070809;color:#f3f0ea;overflow:hidden;opacity:1;transition:opacity .48s cubic-bezier(.16,1,.3,1)}
        .v12-mobile-ident::before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent 0 8%,rgba(255,255,255,.05) 8% calc(8% + 1px),transparent calc(8% + 1px) 92%,rgba(255,255,255,.05) 92% calc(92% + 1px),transparent calc(92% + 1px)),linear-gradient(180deg,transparent 0 14%,rgba(255,255,255,.04) 14% calc(14% + 1px),transparent calc(14% + 1px));pointer-events:none}
        .v12-mobile-ident::after{content:"";position:absolute;left:1.2rem;right:1.2rem;bottom:max(1rem,env(safe-area-inset-bottom));height:1px;background:rgba(255,255,255,.1)}
        .v12-mobile-ident__meta{position:absolute;top:max(1.2rem,env(safe-area-inset-top));left:1.2rem;right:1.2rem;display:flex;justify-content:space-between;color:rgba(243,240,234,.5);font:500 .56rem/1 "DM Mono",monospace;letter-spacing:.13em;text-transform:uppercase}
        .v12-mobile-ident__copy{position:relative;z-index:2;padding-bottom:1.8rem}
        .v12-mobile-ident__copy small{display:block;margin-bottom:.9rem;color:rgba(243,240,234,.52);font:500 .58rem/1 "DM Mono",monospace;letter-spacing:.14em;text-transform:uppercase;animation:v12IdentMeta .65s .08s both cubic-bezier(.16,1,.3,1)}
        .v12-mobile-ident__copy strong{display:block;max-width:8ch;font:600 clamp(3.8rem,18vw,6.6rem)/.77 "Space Grotesk",Manrope,sans-serif;letter-spacing:-.075em;text-transform:uppercase;animation:v12IdentWord .9s .12s both cubic-bezier(.16,1,.3,1)}
        .v12-mobile-ident__copy i{display:block;width:5rem;height:2px;margin-top:1.4rem;background:#ff6b2c;transform-origin:left;animation:v12IdentRule 1.2s .38s both cubic-bezier(.16,1,.3,1)}
        .v12-mobile-ident__progress{position:absolute;z-index:3;left:1.2rem;right:1.2rem;bottom:max(1rem,env(safe-area-inset-bottom));height:1px;overflow:hidden}.v12-mobile-ident__progress i{display:block;width:100%;height:100%;background:#ff6b2c;transform-origin:left;animation:v12IdentProgress 2.55s linear both}
        .v12-mobile-ident.is-exiting{opacity:0;pointer-events:none}
        @keyframes v12IdentMeta{from{opacity:0;transform:translateY(.7rem);filter:blur(6px)}}
        @keyframes v12IdentWord{from{opacity:0;transform:translateY(1.4rem);filter:blur(10px)}}
        @keyframes v12IdentRule{from{transform:scaleX(0)}}
        @keyframes v12IdentProgress{from{transform:scaleX(0)}to{transform:scaleX(1)}}
      `;
      document.head.append(style);

      const ident = document.createElement('div');
      ident.className = 'v12-mobile-ident';
      ident.setAttribute('role', 'presentation');
      ident.innerHTML = `
        <div class="v12-mobile-ident__meta"><span>BRAYROAI / MOBILE CUT</span><span>01</span></div>
        <div class="v12-mobile-ident__copy"><small>Creative technology studio</small><strong>Make the difference.</strong><i></i></div>
        <div class="v12-mobile-ident__progress" aria-hidden="true"><i></i></div>`;
      document.body.append(ident);
      document.body.classList.add('v12-mobile-ident-active');

      // Cancel the 2 MB desktop film before it becomes a mobile network dependency.
      this.opening.style.setProperty('display', 'none', 'important');
      this.opening.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('hf-intro-active');
      if (this.video) {
        try {
          this.video.pause();
          this.video.removeAttribute('src');
          this.video.load();
        } catch {}
      }

      this.exitTimer = window.setTimeout(() => ident.classList.add('is-exiting'), 2550);
      this.removeTimer = window.setTimeout(() => {
        ident.remove();
        style.remove();
        document.body.classList.remove('v12-mobile-ident-active');
      }, 3050);
      addEventListener('pagehide', () => {
        clearTimeout(this.exitTimer);
        clearTimeout(this.removeTimer);
      }, { once:true });
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
