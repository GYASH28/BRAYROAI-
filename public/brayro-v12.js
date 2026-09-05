(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const mobile = matchMedia('(max-width:760px)').matches;
  const clamp = (min, value, max) => Math.min(max, Math.max(min, value));

  const installV13Styles = () => {
    if (document.querySelector('link[data-brayro-v13]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/brayro-v13.css';
    link.dataset.brayroV13 = '';
    document.head.append(link);
  };

  class IntroPerformanceGuard {
    constructor() {
      if (reduced || mobile) return;
      this.opening = document.querySelector('.opening-sequence.hf-intro');
      this.skip = this.opening?.querySelector('[data-hf-skip]');
      this.sound = this.opening?.querySelector('[data-hf-sound]');
      if (!this.opening || !this.skip || !document.body.classList.contains('hf-intro-active')) return;
      this.timer = window.setTimeout(() => {
        if (!document.body.classList.contains('hf-intro-active')) return;
        if (this.sound?.getAttribute('aria-pressed') === 'true') return;
        this.skip.click();
      }, 3200);
      this.skip.addEventListener('click', () => clearTimeout(this.timer), { once:true });
      addEventListener('pagehide', () => clearTimeout(this.timer), { once:true });
    }
  }

  class CapabilityLedger {
    constructor() {
      this.section = document.querySelector('#services[data-scene="services"]');
      if (!this.section) return;
      this.states = {
        web: {
          index:'01 / 04', word:'WEB', kicker:'WEB EXPERIENCES', status:'FIRST IMPRESSION / INTERACTION / CONVERSION',
          copy:'Editorial hierarchy, responsive UX and purposeful motion shaped into a website that feels authored instead of assembled.',
          tags:['Direction','Responsive UX','Motion','Conversion paths'], diagram:['TYPE','LAYOUT','MOTION','CTA'], heights:['38%','72%','54%','88%']
        },
        product: {
          index:'02 / 04', word:'PRODUCT', kicker:'PRODUCT DESIGN', status:'FLOW / STATE / SYSTEM / PROTOTYPE',
          copy:'Complex flows become clear interfaces, with interaction states and design systems built around what people are actually trying to do.',
          tags:['Flows','Interaction','Design systems','Prototypes'], diagram:['FLOW','STATE','SYSTEM','PROTOTYPE'], heights:['70%','44%','86%','58%']
        },
        frontend: {
          index:'03 / 04', word:'FRONTEND', kicker:'FRONTEND ENGINEERING', status:'SEMANTICS / RESPONSIVE / PERFORMANCE / ACCESSIBILITY',
          copy:'The visual idea survives the browser through responsive engineering, accessible interaction and performance-aware implementation.',
          tags:['Vite','React-ready','Performance','Accessibility'], diagram:['SEMANTICS','RESPONSIVE','PERF','A11Y'], heights:['48%','82%','64%','76%']
        },
        ai: {
          index:'04 / 04', word:'AI SYSTEMS', kicker:'PRACTICAL AI SYSTEMS', status:'SOURCE / CONTEXT / ASSIST / ACTION',
          copy:'Useful AI starts with the company workflow and approved knowledge—not a chatbot skin. We audit the friction first, then build only the system that earns its place.',
          tags:['Workflow audits','Second brains','Knowledge systems','Automation'], diagram:['SOURCE','CONTEXT','ASSIST','ACTION'], heights:['62%','84%','50%','74%']
        }
      };
      this.build();
      this.stage = this.section.querySelector('[data-v12-story-visual]');
      this.word = this.section.querySelector('[data-v12-story-word]');
      this.index = this.section.querySelector('[data-ledger-index]');
      this.status = this.section.querySelector('[data-ledger-status]');
      this.copy = this.section.querySelector('[data-ledger-copy]');
      this.diagram = [...this.section.querySelectorAll('[data-ledger-diagram] span')];
      this.rows = [...this.section.querySelectorAll('[data-v12-step]')];
      this.bind();
      this.select('web', true);
    }

    build() {
      this.section.className = 'scene brayro-ledger';
      this.section.dataset.v13Ledger = '';
      this.section.innerHTML = `
        <div class="scene-shell">
          <header class="v12-capabilities__head brayro-ledger__head">
            <div data-v12-reveal>
              <p class="eyebrow">FOUR DISCIPLINES / ONE POINT OF VIEW</p>
              <h2>Less decoration.<br>More <em>direction.</em></h2>
            </div>
            <p data-v12-reveal data-delay="1">The studio is deliberately small, so strategy, interface, engineering and useful AI stay connected. Scroll the ledger—the same standard changes medium, not personality.</p>
          </header>

          <div class="brayro-ledger__layout" data-v12-story>
            <aside class="brayro-ledger__stage" data-v12-story-visual data-state="web" aria-live="polite">
              <div class="brayro-ledger__stage-top"><span>BRAYROAI / CAPABILITY LEDGER</span><strong class="brayro-ledger__stage-index" data-ledger-index>01 / 04</strong></div>
              <div class="brayro-ledger__diagram" data-ledger-diagram aria-hidden="true"><span>TYPE</span><span>LAYOUT</span><span>MOTION</span><span>CTA</span></div>
              <div class="brayro-ledger__stage-word" data-v12-story-word>WEB</div>
              <i class="brayro-ledger__stage-rule" aria-hidden="true"></i>
              <div class="brayro-ledger__stage-copy"><small data-ledger-status>FIRST IMPRESSION / INTERACTION / CONVERSION</small><p data-ledger-copy>Editorial hierarchy, responsive UX and purposeful motion shaped into a website that feels authored instead of assembled.</p></div>
            </aside>

            <div class="brayro-ledger__rows" role="list" aria-label="BRAYROAI capabilities">
              ${Object.entries(this.states).map(([key,state]) => `
                <article class="brayro-ledger__row${key === 'web' ? ' is-active' : ''}" data-v12-step="${key}" data-ledger-row="${key}" role="listitem">
                  <button class="brayro-ledger__button" type="button" aria-expanded="${key === 'web'}" data-ledger-button="${key}">
                    <span class="brayro-ledger__num">${state.index.slice(0,2)}</span><h3 class="brayro-ledger__title">${state.kicker.replace('PRACTICAL ','')}</h3><span class="brayro-ledger__arrow" aria-hidden="true">↗</span>
                  </button>
                  <div class="brayro-ledger__detail"><div class="brayro-ledger__detail-inner"><p>${state.copy}</p><div class="brayro-ledger__tags">${state.tags.map(tag => `<span>${tag}</span>`).join('')}</div></div></div>
                </article>`).join('')}
            </div>
          </div>
          <div class="brayro-ledger__foot"><span>DESIGN → ENGINEERING → PRACTICAL AI</span><span>NO GENERIC TEMPLATE LAYERS / NO HANDOFF THEATRE</span></div>
        </div>`;
    }

    bind() {
      if (!this.rows.length) return;
      const selectFromRow = (row) => this.select(row.dataset.v12Step);
      this.rows.forEach((row) => {
        const button = row.querySelector('[data-ledger-button]');
        button?.addEventListener('click', () => selectFromRow(row));
        row.addEventListener('focusin', () => selectFromRow(row));
        if (fine) row.addEventListener('pointerenter', () => selectFromRow(row));
        if (fine) row.addEventListener('pointermove', (event) => {
          const rect = row.getBoundingClientRect();
          row.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
          row.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
        }, { passive:true });
      });
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (visible) selectFromRow(visible.target);
        }, { threshold:[.28,.45,.62], rootMargin:'-18% 0px -24% 0px' });
        this.rows.forEach(row => observer.observe(row));
      }
    }

    select(key, immediate = false) {
      const state = this.states[key];
      if (!state || !this.stage) return;
      if (this.stage.dataset.state === key && !immediate) return;
      this.stage.dataset.state = key;
      this.rows.forEach(row => {
        const active = row.dataset.v12Step === key;
        row.classList.toggle('is-active', active);
        row.querySelector('[data-ledger-button]')?.setAttribute('aria-expanded', String(active));
      });
      if (this.index) this.index.textContent = state.index;
      if (this.status) this.status.textContent = state.status;
      if (this.copy) this.copy.textContent = state.copy;
      this.diagram.forEach((bar, i) => {
        bar.textContent = state.diagram[i];
        bar.style.setProperty('--bar-h', state.heights[i]);
      });
      if (!this.word) return;
      if (immediate || reduced) {
        this.word.textContent = state.word;
        return;
      }
      this.word.classList.add('is-changing');
      setTimeout(() => {
        this.word.textContent = state.word;
        this.word.classList.remove('is-changing');
      }, 170);
    }
  }

  class V12Reveal {
    constructor() {
      const nodes = [...document.querySelectorAll('[data-v12-reveal]')];
      if (!nodes.length) return;
      if (reduced || !('IntersectionObserver' in window)) {
        nodes.forEach(node => node.classList.add('is-visible'));
        return;
      }
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold:.13, rootMargin:'-2% 0px -9% 0px' });
      nodes.forEach(node => observer.observe(node));
    }
  }

  class FloatingHeader {
    constructor() {
      this.nav = document.querySelector('[data-site-nav]');
      if (!this.nav) return;
      this.links = [...this.nav.querySelectorAll('nav a[href^="#"]')];
      this.sections = this.links.map(link => ({ link, section:document.querySelector(link.getAttribute('href')) })).filter(item => item.section);
      this.raf = 0;
      addEventListener('scroll', () => this.schedule(), { passive:true });
      addEventListener('resize', () => this.schedule(), { passive:true });
      this.schedule();
    }
    schedule() { if (!this.raf) this.raf = requestAnimationFrame(() => this.paint()); }
    paint() {
      this.raf = 0;
      this.nav.classList.toggle('v12-scrolled', scrollY > 84);
      const anchor = innerHeight * .34;
      let current = null;
      for (const item of this.sections) {
        const rect = item.section.getBoundingClientRect();
        if (rect.top <= anchor && rect.bottom >= anchor) current = item;
      }
      this.links.forEach(link => link.classList.toggle('is-current', current?.link === link));
    }
  }

  class FlipLinks {
    constructor() {
      if (reduced) return;
      document.querySelectorAll('.site-nav nav a').forEach((link) => {
        if (link.classList.contains('brayro-flip') || link.children.length) return;
        const label = link.textContent.trim();
        if (!label) return;
        link.classList.add('brayro-flip');
        link.setAttribute('aria-label', label);
        link.innerHTML = `<span class="brayro-flip__front">${label}</span><span class="brayro-flip__back" aria-hidden="true">${label}</span>`;
      });
    }
  }

  class SpotlightSurfaces {
    constructor() {
      if (!fine || reduced) return;
      this.selector = '.v12-product-card,.pricing-mini,.ai-plan-card,.build-card';
      document.querySelectorAll(this.selector).forEach(node => node.classList.add('brayro-spotlight-surface'));
      document.addEventListener('pointermove', (event) => {
        const surface = event.target.closest?.(this.selector);
        if (!surface) return;
        const rect = surface.getBoundingClientRect();
        surface.style.setProperty('--brayro-spot-x', `${event.clientX - rect.left}px`);
        surface.style.setProperty('--brayro-spot-y', `${event.clientY - rect.top}px`);
      }, { passive:true });
    }
  }

  class CurtainReveal {
    constructor() {
      const surfaces = [...document.querySelectorAll('.v12-featured-case .work__desktop,.v12-featured-case .work__mobile')];
      if (!surfaces.length) return;
      surfaces.forEach(surface => surface.classList.add('brayro-curtain'));
      if (reduced || !('IntersectionObserver' in window)) {
        surfaces.forEach(surface => surface.classList.add('is-revealed'));
        return;
      }
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      }, { threshold:.26 });
      surfaces.forEach(surface => observer.observe(surface));
    }
  }

  class ProjectPreview {
    constructor() {
      this.preview = document.querySelector('[data-v12-project-preview]');
      this.image = this.preview?.querySelector('img');
      this.rows = [...document.querySelectorAll('[data-v12-project]')];
      if (this.image) this.image.removeAttribute('src');
      if (!fine || reduced || !this.preview || !this.image || !this.rows.length) return;
      this.x = innerWidth / 2; this.y = innerHeight / 2; this.tx = this.x; this.ty = this.y; this.raf = 0;
      addEventListener('pointermove', event => { this.tx = event.clientX; this.ty = event.clientY; this.schedule(); }, { passive:true });
      this.rows.forEach(row => {
        row.addEventListener('pointerenter', () => this.show(row));
        row.addEventListener('pointerleave', () => this.hide());
        row.addEventListener('focusin', () => this.show(row));
        row.addEventListener('focusout', () => this.hide());
      });
    }
    show(row) {
      const src = row.dataset.preview;
      if (src && this.image.getAttribute('src') !== src) this.image.src = src;
      this.image.alt = '';
      this.preview.dataset.label = row.dataset.previewLabel || 'VIEW';
      this.preview.classList.add('is-visible');
      this.schedule();
    }
    hide() { this.preview.classList.remove('is-visible'); }
    schedule() { if (!this.raf) this.raf = requestAnimationFrame(() => this.paint()); }
    paint() {
      this.raf = 0;
      this.x += (this.tx - this.x) * .16; this.y += (this.ty - this.y) * .16;
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
      addEventListener('pointermove', event => {
        document.documentElement.style.setProperty('--cursor-x', `${event.clientX}px`);
        document.documentElement.style.setProperty('--cursor-y', `${event.clientY}px`);
      }, { passive:true });
      this.targets.forEach(target => {
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
      document.querySelectorAll('[data-v12-tilt]').forEach(card => {
        card.addEventListener('pointermove', event => {
          const rect = card.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width - .5;
          const py = (event.clientY - rect.top) / rect.height - .5;
          card.style.transform = `perspective(1100px) rotateX(${(-py * 2.2).toFixed(2)}deg) rotateY(${(px * 2.8).toFixed(2)}deg) translateY(-7px)`;
        }, { passive:true });
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
      addEventListener('resize', fit, { passive:true });
      fit();
    }
  }

  installV13Styles();
  new IntroPerformanceGuard();
  new CapabilityLedger();
  new V12Reveal();
  new FloatingHeader();
  new FlipLinks();
  new SpotlightSurfaces();
  new CurtainReveal();
  new ProjectPreview();
  new ContextCursor();
  new ProductTilt();
  new HeroTextGuard();
})();
