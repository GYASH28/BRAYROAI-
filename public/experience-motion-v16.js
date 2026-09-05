(() => {
  if (document.documentElement.dataset.v16MotionMounted) return;
  document.documentElement.dataset.v16MotionMounted = 'true';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const clamp = (min, value, max) => Math.min(max, Math.max(min, value));
  const body = document.body;
  const path = location.pathname.replace(/\/$/,'') || '/';

  body.classList.add('v16-motion');
  if (path === '/') body.classList.add('home-v16');
  else if (path === '/plans' || path.endsWith('/plans.html')) body.classList.add('plans-v16');
  else if (path === '/founder' || path.endsWith('/founder.html')) body.classList.add('founder-v16');
  else if (path === '/terms' || path.endsWith('/terms.html')) body.classList.add('terms-v16');
  else if (path === '/ai-workflow-audit' || path === '/company-second-brain' || path.endsWith('/ai-workflow-audit.html') || path.endsWith('/company-second-brain.html')) body.classList.add('ai-v16');

  class PageCurtain {
    constructor() {
      this.node = document.createElement('div');
      this.node.className = 'v16-page-transition is-entering';
      this.node.setAttribute('aria-hidden','true');
      this.node.innerHTML = '<i></i><i></i><i></i><i></i>';
      body.append(this.node);
      if (!reduced) setTimeout(() => this.node.classList.remove('is-entering'), 980);
      else this.node.classList.remove('is-entering');
      document.addEventListener('click', event => this.onClick(event));
    }
    onClick(event) {
      if (reduced || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest('a[href]');
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
      const href = link.getAttribute('href') || '';
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;
      let url;
      try { url = new URL(link.href, location.href); } catch { return; }
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.hash) return;
      event.preventDefault();
      this.node.classList.remove('is-entering');
      this.node.classList.add('is-leaving');
      setTimeout(() => { location.href = url.href; }, 330);
    }
  }

  class RevealDirector {
    constructor() {
      this.items = [];
      this.decorate();
      if (reduced || !('IntersectionObserver' in window)) {
        this.items.forEach(item => item.classList.add('v16-in'));
        return;
      }
      this.observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('v16-in');
          this.observer.unobserve(entry.target);
        });
      }, { threshold:.1, rootMargin:'0px 0px -8% 0px' });
      this.items.forEach(item => this.observer.observe(item));
    }
    decorate() {
      const selectors = [
        'main h1','main h2',
        '.plan-family__heading','.build-card','.ai-plan-card','.compare-table',
        '.story__copy','.principle-instrument','.method__image','.method__copy','.conviction blockquote',
        '.terms-intro','.terms-quick','.terms-section',
        '.process-lab','.matrix','.deliver-grid','.architecture','.scope-table','.faq'
      ];
      const seen = new Set();
      document.querySelectorAll(selectors.join(',')).forEach((item,index) => {
        if (seen.has(item) || item.closest('.opening-sequence')) return;
        seen.add(item);
        item.dataset.v16Reveal = '';
        if (index % 4) item.dataset.v16Delay = String(index % 4);
        this.items.push(item);
      });
    }
  }

  class SceneKinetics {
    constructor() {
      this.scenes = [...document.querySelectorAll('main > section,[data-scene],[data-plan-scene],[data-founder-scene]')]
        .filter((scene,index,array) => array.indexOf(scene) === index);
      this.frame = 0;
      this.lastY = scrollY;
      this.velocity = 0;
      this.scenes.forEach((scene,index) => {
        scene.dataset.v16Scene = '';
        scene.dataset.v16Index = String(index);
        if (!scene.querySelector(':scope > .v16-section-line')) {
          const line = document.createElement('i');
          line.className = 'v16-section-line';
          line.setAttribute('aria-hidden','true');
          scene.prepend(line);
        }
      });
      addEventListener('scroll', () => this.schedule(), {passive:true});
      addEventListener('resize', () => this.schedule(), {passive:true});
      this.schedule();
    }
    schedule() { if (!this.frame) this.frame = requestAnimationFrame(() => this.update()); }
    update() {
      this.frame = 0;
      const y = scrollY;
      this.velocity += ((y - this.lastY) - this.velocity) * .18;
      this.lastY = y;
      document.documentElement.style.setProperty('--v16-scroll', String(y));
      document.documentElement.style.setProperty('--v16-velocity', this.velocity.toFixed(3));
      this.scenes.forEach((scene,index) => {
        const rect = scene.getBoundingClientRect();
        const center = rect.top + rect.height * .5;
        const delta = (center - innerHeight * .5) / Math.max(innerHeight,1);
        const focus = clamp(0, 1 - Math.abs(delta) * 1.15, 1);
        const line = clamp(0, (innerHeight * .9 - rect.top) / Math.max(innerHeight * .7,1), 1);
        const driftY = clamp(-100, delta * -52, 100);
        const driftX = clamp(-90, delta * (index % 2 ? 38 : -38), 90);
        scene.style.setProperty('--v16-focus', focus.toFixed(4));
        scene.style.setProperty('--v16-line', line.toFixed(4));
        scene.style.setProperty('--v16-drift-y', driftY.toFixed(3));
        scene.style.setProperty('--v16-drift-x', driftX.toFixed(3));
        if (scene.matches('.hero,[data-scene="hero"],.plans-hero,.founder-hero,.ai-hero,.terms-hero')) {
          const heroDepth = clamp(0, -rect.top / Math.max(innerHeight,1), 1);
          scene.style.setProperty('--v16-hero-depth', heroDepth.toFixed(4));
          scene.style.setProperty('--v16-hero-shift', (heroDepth * -18).toFixed(3));
        }
      });
      this.updateTermsReading();
    }
    updateTermsReading() {
      if (!body.classList.contains('terms-v16')) return;
      const terms = [...document.querySelectorAll('.terms-section')];
      let active = null;
      let distance = Infinity;
      terms.forEach(section => {
        const rect = section.getBoundingClientRect();
        const d = Math.abs(rect.top - innerHeight * .28);
        if (rect.bottom > innerHeight * .16 && rect.top < innerHeight * .78 && d < distance) { active = section; distance = d; }
        const term = clamp(0, (innerHeight * .75 - rect.top) / Math.max(rect.height,1), 1);
        section.style.setProperty('--v16-term', term.toFixed(3));
      });
      terms.forEach(section => section.classList.toggle('v16-reading', section === active));
      const toc = document.querySelector('.terms-toc');
      if (toc) toc.style.setProperty('--v16-toc-shift', String(clamp(-8, this.velocity * -.08, 8)));
    }
  }

  class PointerFeedback {
    constructor() {
      if (!fine || reduced) return;
      this.cursor = document.createElement('div');
      this.cursor.className = 'v16-cursor';
      this.cursor.setAttribute('aria-hidden','true');
      body.append(this.cursor);
      this.x = -100; this.y = -100; this.tx = -100; this.ty = -100; this.frame = 0;
      addEventListener('pointermove', event => this.move(event), {passive:true});
      addEventListener('pointerleave', () => this.cursor.classList.remove('is-visible'));
      this.decorateInteractive();
      this.decorateSurfaces();
    }
    move(event) {
      this.tx = event.clientX; this.ty = event.clientY;
      this.cursor.classList.add('is-visible');
      if (!this.frame) this.frame = requestAnimationFrame(() => this.paint());
    }
    paint() {
      this.frame = 0;
      this.x += (this.tx - this.x) * .32;
      this.y += (this.ty - this.y) * .32;
      document.documentElement.style.setProperty('--v16-cx',`${this.x.toFixed(2)}px`);
      document.documentElement.style.setProperty('--v16-cy',`${this.y.toFixed(2)}px`);
      if (Math.abs(this.tx-this.x) > .25 || Math.abs(this.ty-this.y) > .25) this.frame = requestAnimationFrame(() => this.paint());
    }
    decorateInteractive() {
      const candidates = [...document.querySelectorAll('a[href],button')].filter(node => !node.closest('.opening-sequence'));
      candidates.forEach(node => {
        node.addEventListener('pointerenter', () => this.cursor.classList.add('is-active'));
        node.addEventListener('pointerleave', () => this.cursor.classList.remove('is-active'));
        const rect = node.getBoundingClientRect();
        if (rect.width <= 340 && rect.height <= 120) {
          node.dataset.v16Magnet = '';
          node.addEventListener('pointermove', event => {
            const r = node.getBoundingClientRect();
            const dx = (event.clientX - r.left - r.width/2) * .12;
            const dy = (event.clientY - r.top - r.height/2) * .16;
            node.style.setProperty('--v16-mx',`${dx.toFixed(2)}px`);
            node.style.setProperty('--v16-my',`${dy.toFixed(2)}px`);
          }, {passive:true});
          node.addEventListener('pointerleave', () => {
            node.style.setProperty('--v16-mx','0px');
            node.style.setProperty('--v16-my','0px');
          });
        }
      });
    }
    decorateSurfaces() {
      const selector = '.build-card,.ai-plan-card,.compare-table,.principle-instrument,.terms-quick a,.terms-card,.process-stage,.deliver,.matrix-row,.scope-row,.arch-node,.v12-product-card,[data-v14-rate]';
      document.querySelectorAll(selector).forEach(surface => {
        surface.dataset.v16Surface = '';
        if (surface.matches('.build-card,.ai-plan-card,.terms-quick a,.deliver,.v12-product-card,[data-v14-rate]')) surface.dataset.v16Lift = '';
        surface.addEventListener('pointermove', event => {
          const rect = surface.getBoundingClientRect();
          surface.style.setProperty('--v16-sx',`${(event.clientX-rect.left).toFixed(1)}px`);
          surface.style.setProperty('--v16-sy',`${(event.clientY-rect.top).toFixed(1)}px`);
        }, {passive:true});
      });
    }
  }

  class InteractionChoreography {
    constructor() {
      this.processLabs();
      this.principles();
      this.planModes();
      this.faqs();
    }
    pulse(node, options={}) {
      if (!node || reduced || !node.animate) return;
      node.animate([
        {transform:'scale(.985)',filter:'brightness(.92)'},
        {transform:'scale(1.008)',filter:'brightness(1.06)'},
        {transform:'scale(1)',filter:'brightness(1)'}
      ], {duration:520,easing:'cubic-bezier(.16,1,.3,1)',...options});
    }
    processLabs() {
      document.querySelectorAll('[data-process-tab]').forEach(tab => tab.addEventListener('click', () => this.pulse(tab.closest('[data-process-lab]')?.querySelector('[data-process-stage]'))));
      document.querySelectorAll('[data-arch-node]').forEach(node => node.addEventListener('click', () => this.pulse(node.closest('[data-architecture]')?.querySelector('.arch-engine'))));
    }
    principles() {
      document.querySelectorAll('[data-principle]').forEach(button => button.addEventListener('click', () => this.pulse(document.querySelector('[data-principle-stage]'))));
    }
    planModes() {
      document.querySelectorAll('[data-plan-mode]').forEach(button => button.addEventListener('click', () => this.pulse(document.querySelector('[data-plan-mode-output]'))));
    }
    faqs() {
      document.querySelectorAll('.faq details').forEach(item => item.addEventListener('toggle', () => { if (item.open) this.pulse(item,{duration:420}); }));
    }
  }

  new PageCurtain();
  new RevealDirector();
  new SceneKinetics();
  new PointerFeedback();
  new InteractionChoreography();
})();
