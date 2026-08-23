(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (min, value, max) => Math.min(max, Math.max(min, value));
  const body = document.body;
  const root = document.documentElement;

  const installMotionStyles = () => {
    if (!document.querySelector('link[data-motion-v4]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/motion-v4.css';
      link.dataset.motionV4 = '';
      document.head.append(link);
    }

    if (!document.querySelector('style[data-hf-intro-critical]')) {
      const style = document.createElement('style');
      style.dataset.hfIntroCritical = '';
      style.textContent = `
        body.hf-intro-active{overflow:hidden!important;overscroll-behavior:none}
        .opening-sequence.hf-intro{position:fixed!important;inset:0!important;z-index:2147480000!important;display:grid!important;place-items:center!important;width:100%!important;height:100dvh!important;background:#070809!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important;animation:none!important;transition:opacity .52s cubic-bezier(.16,1,.3,1),visibility .52s!important}
        .opening-sequence.hf-intro::before,.opening-sequence.hf-intro::after{display:none!important}
        .opening-sequence.hf-intro.is-exiting{opacity:0!important;pointer-events:none!important}
        .opening-sequence.hf-intro.is-complete{opacity:0!important;visibility:hidden!important;pointer-events:none!important}
        .hf-intro__video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#070809;opacity:0;transform:scale(1.008);transition:opacity .42s ease,transform 6s cubic-bezier(.22,.72,.22,1)}
        .hf-intro.is-playing .hf-intro__video{opacity:1;transform:scale(1)}
        .hf-intro__loading{position:absolute;inset:0;display:grid;place-items:center;color:rgba(242,239,232,.72);font:500 10px/1 'DM Mono',monospace;letter-spacing:.18em;text-transform:uppercase;transition:opacity .35s ease}
        .hf-intro.is-playing .hf-intro__loading{opacity:0;pointer-events:none}
        .hf-intro__loading span{display:flex;align-items:center;gap:12px}.hf-intro__loading i{display:block;width:38px;height:1px;background:#ff5a1f;transform-origin:left;animation:hfLoad 1.1s cubic-bezier(.16,1,.3,1) infinite alternate}
        .hf-intro__controls{position:absolute;z-index:5;top:max(20px,env(safe-area-inset-top));right:max(22px,env(safe-area-inset-right));display:flex;align-items:center;gap:7px;opacity:0;transform:translateY(-6px);transition:opacity .5s .35s ease,transform .6s .35s cubic-bezier(.16,1,.3,1)}
        .hf-intro.is-playing .hf-intro__controls{opacity:1;transform:none}
        .hf-intro__button{appearance:none;border:1px solid rgba(242,239,232,.18);background:rgba(7,8,9,.52);color:rgba(242,239,232,.72);padding:9px 11px;border-radius:999px;font:500 9px/1 'DM Mono',monospace;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;backdrop-filter:blur(8px);transition:color .25s ease,border-color .25s ease,background .25s ease,transform .25s cubic-bezier(.16,1,.3,1)}
        .hf-intro__button:hover,.hf-intro__button:focus-visible{color:#f2efe8;border-color:rgba(242,239,232,.42);background:rgba(7,8,9,.72);outline:none}.hf-intro__button:active{transform:scale(.96)}
        .hf-intro__progress{position:absolute;z-index:5;left:0;right:0;bottom:0;height:2px;background:rgba(242,239,232,.08);overflow:hidden}.hf-intro__progress i{display:block;width:100%;height:100%;background:#ff5a1f;transform:scaleX(var(--hf-progress,0));transform-origin:left;will-change:transform}
        @keyframes hfLoad{from{transform:scaleX(.18);opacity:.38}to{transform:scaleX(1);opacity:1}}
        @media(max-width:700px){.hf-intro__video{object-fit:contain}.hf-intro__controls{top:max(14px,env(safe-area-inset-top));right:max(14px,env(safe-area-inset-right))}.hf-intro__button{padding:8px 10px;font-size:8px}}
        @media(prefers-reduced-motion:reduce){.hf-intro{display:none!important}.scope-open,.founder-open{display:none!important}}
      `;
      document.head.append(style);
    }
  };

  installMotionStyles();

  class HyperFramesIntro {
    constructor() {
      this.opening = document.querySelector('.opening-sequence');
      this.timer = 0;
      this.raf = 0;
      this.finishing = false;
      this.started = false;

      document.querySelectorAll('.scope-open,.founder-open').forEach((overlay) => overlay.remove());
      if (!this.opening) {
        body.classList.remove('polish-opening');
        return;
      }

      body.classList.add('hf-intro-mode');
      body.classList.remove('polish-opening');

      if (reduced) {
        this.opening.remove();
        return;
      }

      this.opening.className = 'opening-sequence hf-intro';
      this.opening.removeAttribute('aria-hidden');
      this.opening.setAttribute('role', 'presentation');
      this.opening.innerHTML = `
        <video class="hf-intro__video" data-hf-intro-video preload="auto" muted playsinline src="/assets/brayroai-cinematic-opening.mp4"></video>
        <div class="hf-intro__loading" aria-hidden="true"><span><i></i>BRAYROAI / OPENING FILM</span></div>
        <div class="hf-intro__controls" aria-label="Opening film controls">
          <button class="hf-intro__button" type="button" data-hf-sound aria-pressed="false">Sound off</button>
          <button class="hf-intro__button" type="button" data-hf-skip>Skip</button>
        </div>
        <div class="hf-intro__progress" aria-hidden="true"><i></i></div>
      `;

      this.video = this.opening.querySelector('[data-hf-intro-video]');
      this.sound = this.opening.querySelector('[data-hf-sound]');
      this.skip = this.opening.querySelector('[data-hf-skip]');
      if (!this.video) return this.finish(true);

      this.video.volume = .9;
      this.video.muted = true;
      this.video.addEventListener('canplay', () => this.start(), { once:true });
      this.video.addEventListener('playing', () => {
        this.opening.classList.add('is-playing');
        this.started = true;
        this.paintProgress();
      });
      this.video.addEventListener('ended', () => this.finish());
      this.video.addEventListener('error', () => this.finish(true));
      this.sound?.addEventListener('click', () => this.toggleSound());
      this.skip?.addEventListener('click', () => this.finish());
      addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && body.classList.contains('hf-intro-active')) this.finish();
      });

      body.classList.add('hf-intro-active');
      this.video.play().then(() => this.start()).catch(() => {
        this.video.muted = true;
        this.video.play().then(() => this.start()).catch(() => this.finish(true));
      });
      this.timer = window.setTimeout(() => this.finish(true), 9000);
      this.bindReplay();
    }

    start() {
      if (!this.video || this.finishing) return;
      this.opening.classList.add('is-playing');
      this.started = true;
      if (this.video.paused) this.video.play().catch(() => {});
      this.paintProgress();
    }

    toggleSound() {
      if (!this.video) return;
      this.video.muted = !this.video.muted;
      const on = !this.video.muted;
      if (this.sound) {
        this.sound.textContent = on ? 'Sound on' : 'Sound off';
        this.sound.setAttribute('aria-pressed', String(on));
      }
      if (this.video.paused) this.video.play().catch(() => {});
    }

    paintProgress() {
      cancelAnimationFrame(this.raf);
      const tick = () => {
        if (!this.video || this.finishing) return;
        const duration = Number.isFinite(this.video.duration) && this.video.duration > 0 ? this.video.duration : 5.6;
        const progress = clamp(0, this.video.currentTime / duration, 1);
        this.opening.style.setProperty('--hf-progress', progress.toFixed(4));
        this.raf = requestAnimationFrame(tick);
      };
      this.raf = requestAnimationFrame(tick);
    }

    finish(immediate = false) {
      if (this.finishing) return;
      this.finishing = true;
      clearTimeout(this.timer);
      cancelAnimationFrame(this.raf);
      body.classList.remove('hf-intro-active');
      this.opening?.classList.add('is-exiting');
      const done = () => {
        if (!this.opening) return;
        this.opening.classList.add('is-complete');
        this.opening.classList.remove('is-exiting','is-playing');
        this.opening.setAttribute('aria-hidden', 'true');
        this.video?.pause();
      };
      if (immediate) done();
      else setTimeout(done, 520);
    }

    replay() {
      if (!this.opening || !this.video || reduced) return;
      this.finishing = false;
      clearTimeout(this.timer);
      window.scrollTo({ top:0, behavior:'auto' });
      this.opening.classList.remove('is-complete','is-exiting');
      this.opening.setAttribute('aria-hidden', 'false');
      this.opening.style.setProperty('--hf-progress', '0');
      body.classList.add('hf-intro-active');
      this.video.currentTime = 0;
      this.video.muted = true;
      if (this.sound) {
        this.sound.textContent = 'Sound off';
        this.sound.setAttribute('aria-pressed', 'false');
      }
      this.video.play().then(() => this.start()).catch(() => this.finish(true));
      this.timer = window.setTimeout(() => this.finish(true), 9000);
    }

    bindReplay() {
      document.querySelectorAll('footer a[href="#top"]').forEach((link) => {
        if (link.textContent.trim().toLowerCase() !== 'replay') return;
        link.addEventListener('click', (event) => {
          event.preventDefault();
          this.replay();
        });
      });
    }
  }

  class DirectionPointer {
    constructor() {
      if (!fine || reduced) return;
      this.x = 0;
      this.y = 0;
      this.tx = 0;
      this.ty = 0;
      this.raf = 0;
      addEventListener('pointermove', (event) => {
        this.tx = clamp(-1, (event.clientX / innerWidth - .5) * 2, 1);
        this.ty = clamp(-1, (event.clientY / innerHeight - .5) * 2, 1);
        root.style.setProperty('--v4-pointer-x', `${event.clientX}px`);
        root.style.setProperty('--v4-pointer-y', `${event.clientY}px`);
        this.schedule();
      }, { passive:true });
      addEventListener('pointerleave', () => {
        this.tx = 0;
        this.ty = 0;
        this.schedule();
      });
    }

    schedule() {
      if (!this.raf) this.raf = requestAnimationFrame(() => this.tick());
    }

    tick() {
      this.raf = 0;
      this.x += (this.tx - this.x) * .11;
      this.y += (this.ty - this.y) * .11;
      const x = this.x;
      const y = this.y;
      root.style.setProperty('--dir-x', `${(x * 7).toFixed(2)}px`);
      root.style.setProperty('--dir-y', `${(y * 5).toFixed(2)}px`);
      root.style.setProperty('--dir-x-bg', `${(x * -1.4).toFixed(2)}px`);
      root.style.setProperty('--dir-y-bg', `${(y * -.7).toFixed(2)}px`);
      root.style.setProperty('--dir-x-subject', `${(x * 2.5).toFixed(2)}px`);
      root.style.setProperty('--dir-y-subject', `${(y * 1.2).toFixed(2)}px`);
      root.style.setProperty('--dir-x-word', `${(x * -2).toFixed(2)}px`);
      root.style.setProperty('--dir-y-word', `${(y * -.6).toFixed(2)}px`);
      root.style.setProperty('--dir-x-soft', `${(x * .42).toFixed(2)}px`);
      root.style.setProperty('--dir-y-soft', `${(y * .24).toFixed(2)}px`);
      if (Math.abs(this.tx - this.x) > .002 || Math.abs(this.ty - this.y) > .002) this.schedule();
    }
  }

  class EditorialSequence {
    constructor() {
      this.section = document.querySelector('[data-editorial-sequence]');
      if (!this.section) return;
      this.index = this.section.querySelector('[data-editorial-index]');
      this.status = this.section.querySelector('[data-editorial-status]');
      this.raf = 0;
      this.update = this.update.bind(this);
      addEventListener('scroll', () => this.schedule(), { passive:true });
      addEventListener('resize', () => this.schedule(), { passive:true });
      this.schedule();
    }

    schedule() {
      if (!this.raf) this.raf = requestAnimationFrame(this.update);
    }

    update() {
      this.raf = 0;
      const rect = this.section.getBoundingClientRect();
      const range = Math.max(1, this.section.offsetHeight - innerHeight);
      const p = clamp(0, -rect.top / range, 1);
      let phase = 'design';
      let start = 0;
      let end = .25;
      let index = '01 / 04';
      let status = 'DIRECTION / FIND THE POINT OF VIEW';

      if (p >= .25 && p < .5) {
        phase = 'build'; start = .25; end = .5; index = '02 / 04'; status = 'ENGINEERING / MAKE IT REAL';
      } else if (p >= .5 && p < .75) {
        phase = 'ship'; start = .5; end = .75; index = '03 / 04'; status = 'DELIVERY / MAKE IT HOLD UP';
      } else if (p >= .75) {
        phase = 'join'; start = .75; end = 1; index = '04 / 04'; status = 'ONE STUDIO / NO HANDOFF';
      }

      const local = clamp(0, (p - start) / Math.max(.001, end - start), 1);
      this.section.dataset.phase = phase;
      this.section.setAttribute('data-sc-verify-state', `editorial:${phase}`);
      this.section.style.setProperty('--ed-word-x', `${((.5 - local) * 30).toFixed(2)}px`);
      this.section.style.setProperty('--ed-ghost-x', `${((p - .5) * -88).toFixed(2)}px`);
      this.section.style.setProperty('--ed-rule', (0.2 + p * .8).toFixed(3));
      this.section.style.setProperty('--ed-accent', (0.08 + p * .34).toFixed(3));
      this.section.style.setProperty('--v4-editorial-drift', `${((p - .5) * -10).toFixed(2)}px`);
      if (this.index) this.index.textContent = index;
      if (this.status) this.status.textContent = status;
    }
  }

  class SceneDirector {
    constructor() {
      this.sections = [...document.querySelectorAll('.scene,.plan-scene,.founder-scene')];
      this.raf = 0;
      this.lastY = scrollY;
      this.velocity = 0;
      this.update = this.update.bind(this);
      this.stageReveals();
      addEventListener('scroll', () => this.schedule(), { passive:true });
      addEventListener('resize', () => this.schedule(), { passive:true });
      this.schedule();
    }

    stageReveals() {
      this.sections.forEach((section) => {
        [...section.querySelectorAll('[data-reveal]')].forEach((node, index) => {
          node.style.setProperty('--reveal-delay', `${Math.min(index * 78, 234)}ms`);
        });
      });
    }

    schedule() {
      if (!this.raf) this.raf = requestAnimationFrame(this.update);
    }

    update() {
      this.raf = 0;
      let nearest = null;
      let nearestDistance = Infinity;
      const delta = scrollY - this.lastY;
      this.velocity += (clamp(-1, delta / 55, 1) - this.velocity) * .22;
      root.style.setProperty('--v4-scroll-velocity', this.velocity.toFixed(4));

      for (const section of this.sections) {
        const rect = section.getBoundingClientRect();
        const visible = rect.bottom > 0 && rect.top < innerHeight;
        if (!visible) continue;
        const progress = clamp(0, (innerHeight - rect.top) / Math.max(innerHeight + rect.height, 1), 1);
        section.style.setProperty('--v3-progress', progress.toFixed(4));
        section.style.setProperty('--v3-media-y', `${((.5 - progress) * 22).toFixed(2)}px`);
        section.style.setProperty('--v3-scale', (1.035 - progress * .018).toFixed(4));
        section.style.setProperty('--v4-heading-y', `${((.5 - progress) * 9).toFixed(2)}px`);
        section.style.setProperty('--v4-line-p', clamp(0, progress * 1.4, 1).toFixed(3));
        const distance = Math.abs((rect.top + rect.height * .5) - innerHeight * .5);
        if (distance < nearestDistance) {
          nearest = section;
          nearestDistance = distance;
        }
      }

      this.sections.forEach((section) => section.classList.toggle('v3-live', section === nearest));
      body.classList.toggle('dir-down', delta > 2);
      body.classList.toggle('dir-up', delta < -2);
      this.lastY = scrollY;
      if (Math.abs(this.velocity) > .01 && Math.abs(delta) <= 2) this.schedule();
    }
  }

  class MicroInteractions {
    constructor() {
      this.surfaces = [...document.querySelectorAll([
        '.capability-instrument',
        '.work__desktop',
        '.work__mobile',
        '.build-ribbon__item',
        '.build-card',
        '.care-grid article',
        '.founder-preview__portrait',
        '.scope-switch',
        '.principles__stage',
        '.method__visual',
        '.story__copy'
      ].join(','))];

      this.surfaces.forEach((surface) => {
        surface.dataset.microSurface = '';
        if (!fine || reduced) return;
        let raf = 0;
        let px = .5;
        let py = .5;
        const paint = () => {
          raf = 0;
          const x = (px - .5) * 2;
          const y = (py - .5) * 2;
          surface.style.setProperty('--micro-px', `${(px * 100).toFixed(2)}%`);
          surface.style.setProperty('--micro-py', `${(py * 100).toFixed(2)}%`);
          surface.style.setProperty('--micro-tx', `${(x * 2.6).toFixed(2)}px`);
          surface.style.setProperty('--micro-ty', `${(y * 1.8).toFixed(2)}px`);
          surface.style.setProperty('--micro-img-x', `${(x * -4.2).toFixed(2)}px`);
          surface.style.setProperty('--micro-img-y', `${(y * -3.2).toFixed(2)}px`);
        };
        surface.addEventListener('pointermove', (event) => {
          const rect = surface.getBoundingClientRect();
          px = clamp(0, (event.clientX - rect.left) / Math.max(rect.width, 1), 1);
          py = clamp(0, (event.clientY - rect.top) / Math.max(rect.height, 1), 1);
          if (!raf) raf = requestAnimationFrame(paint);
        }, { passive:true });
        surface.addEventListener('pointerleave', () => {
          cancelAnimationFrame(raf);
          raf = 0;
          px = .5;
          py = .5;
          paint();
        });
      });

      document.querySelectorAll('a,button').forEach((control) => {
        control.dataset.microPress = '';
        control.addEventListener('pointerdown', () => control.classList.add('v4-pressed'));
        ['pointerup','pointercancel','pointerleave'].forEach((name) => control.addEventListener(name, () => control.classList.remove('v4-pressed')));
      });

      if ('IntersectionObserver' in window && !reduced) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => entry.target.classList.toggle('v4-in-view', entry.isIntersecting));
        }, { threshold:[0,.12,.5], rootMargin:'-8% 0px -8% 0px' });
        this.surfaces.forEach((surface) => observer.observe(surface));
      } else {
        this.surfaces.forEach((surface) => surface.classList.add('v4-in-view'));
      }
    }
  }

  class SectionTextMotion {
    constructor() {
      if (reduced || !('IntersectionObserver' in window)) return;
      const headings = [...document.querySelectorAll('.section-heading h2,.plan-heading h2,.founder-heading h2,.care__heading h2,.close__copy h2,.plan-close__copy h2,.founder-close__copy h2')];
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('v4-title-live');
        });
      }, { threshold:.38 });
      headings.forEach((heading) => observer.observe(heading));
    }
  }

  new HyperFramesIntro();
  new DirectionPointer();
  new EditorialSequence();
  new SceneDirector();
  new MicroInteractions();
  new SectionTextMotion();
})();
