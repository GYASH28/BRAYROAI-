(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (min, value, max) => Math.min(max, Math.max(min, value));

  class SignalChamber {
    constructor() {
      this.section = document.querySelector('[data-signal-chamber]');
      if (!this.section) return;
      this.status = this.section.querySelector('[data-signal-status]');
      this.index = this.section.querySelector('[data-signal-index]');
      this.raf = 0;
      this.update = this.update.bind(this);
      addEventListener('scroll', () => this.schedule(), { passive: true });
      addEventListener('resize', () => this.schedule(), { passive: true });
      if (fine && !reduced) {
        this.section.addEventListener('pointermove', (event) => {
          const rect = this.section.getBoundingClientRect();
          const x = clamp(-1, ((event.clientX - rect.left) / Math.max(1, rect.width) - .5) * 2, 1);
          const y = clamp(-1, ((event.clientY - rect.top) / Math.max(1, rect.height) - .5) * 2, 1);
          this.section.style.setProperty('--signal-px', x.toFixed(3));
          this.section.style.setProperty('--signal-py', y.toFixed(3));
        }, { passive: true });
        this.section.addEventListener('pointerleave', () => {
          this.section.style.setProperty('--signal-px', '0');
          this.section.style.setProperty('--signal-py', '0');
        });
      }
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
      this.section.style.setProperty('--signal-p', p.toFixed(4));
      let label = 'FINDING THE SIGNAL';
      let index = '01 / 03';
      if (p >= .34) { label = 'ALIGNING THE SYSTEM'; index = '02 / 03'; }
      if (p >= .68) { label = 'SHIPPING THE EXPERIENCE'; index = '03 / 03'; }
      if (this.status) this.status.textContent = label;
      if (this.index) this.index.textContent = index;
    }
  }

  class MotionV2 {
    constructor() {
      this.sections = [...document.querySelectorAll('.scene,.plan-scene,.founder-scene')];
      this.raf = 0;
      this.lastY = scrollY;
      this.tick = this.tick.bind(this);
      addEventListener('scroll', () => this.schedule(), { passive: true });
      addEventListener('resize', () => this.schedule(), { passive: true });
      this.installHoverDepth();
      this.schedule();
    }

    schedule() {
      if (!this.raf) this.raf = requestAnimationFrame(this.tick);
    }

    tick() {
      this.raf = 0;
      const delta = scrollY - this.lastY;
      document.body.classList.toggle('v2-scroll-down', delta > 2);
      document.body.classList.toggle('v2-scroll-up', delta < -2);
      this.lastY = scrollY;
      let closest = null;
      let distance = Infinity;
      for (const section of this.sections) {
        const rect = section.getBoundingClientRect();
        const center = rect.top + rect.height * .5;
        const d = Math.abs(center - innerHeight * .5);
        if (rect.bottom > 0 && rect.top < innerHeight && d < distance) {
          closest = section;
          distance = d;
        }
      }
      this.sections.forEach((section) => section.classList.toggle('v2-live', section === closest));
    }

    installHoverDepth() {
      if (!fine || reduced) return;
      const targets = document.querySelectorAll('.build-ribbon__item,.build-card,.work__desktop,.work__mobile,.founder-preview__portrait,.method__image,.principle-instrument,.scope-switch');
      targets.forEach((target) => {
        target.addEventListener('pointermove', (event) => {
          const rect = target.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / Math.max(1, rect.width) - .5) * 2;
          const y = ((event.clientY - rect.top) / Math.max(1, rect.height) - .5) * 2;
          target.style.setProperty('--v2-px', x.toFixed(3));
          target.style.setProperty('--v2-py', y.toFixed(3));
        }, { passive: true });
        target.addEventListener('pointerleave', () => {
          target.style.setProperty('--v2-px', '0');
          target.style.setProperty('--v2-py', '0');
        });
      });
    }
  }

  new SignalChamber();
  new MotionV2();
})();
