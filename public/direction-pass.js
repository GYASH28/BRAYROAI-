(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (min, value, max) => Math.min(max, Math.max(min, value));

  class StudioIdent {
    constructor() {
      const opening = document.querySelector('.opening-sequence');
      if (!opening) return;
      const label = opening.querySelector('.opening-sequence__mark small');
      if (label) label.textContent = 'BRAYROAI / STUDIO IDENT';
      requestAnimationFrame(() => {
        const meta = opening.querySelector('.polish-open__meta');
        if (!meta) return;
        const items = meta.querySelectorAll('span');
        if (items[0]) items[0].textContent = 'CREATIVE TECHNOLOGY / PUNE';
        if (items[1]) items[1].textContent = 'DIRECTION → DELIVERY';
      });
    }
  }

  class DirectionPointer {
    constructor() {
      if (!fine || reduced) return;
      this.root = document.documentElement;
      this.x = 0;
      this.y = 0;
      this.tx = 0;
      this.ty = 0;
      this.raf = 0;
      addEventListener('pointermove', (event) => {
        this.tx = clamp(-1, (event.clientX / innerWidth - .5) * 2, 1);
        this.ty = clamp(-1, (event.clientY / innerHeight - .5) * 2, 1);
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
      this.root.style.setProperty('--dir-x', `${(x * 7).toFixed(2)}px`);
      this.root.style.setProperty('--dir-y', `${(y * 5).toFixed(2)}px`);
      this.root.style.setProperty('--dir-x-bg', `${(x * -1.4).toFixed(2)}px`);
      this.root.style.setProperty('--dir-y-bg', `${(y * -.7).toFixed(2)}px`);
      this.root.style.setProperty('--dir-x-subject', `${(x * 2.5).toFixed(2)}px`);
      this.root.style.setProperty('--dir-y-subject', `${(y * 1.2).toFixed(2)}px`);
      this.root.style.setProperty('--dir-x-word', `${(x * -2).toFixed(2)}px`);
      this.root.style.setProperty('--dir-y-word', `${(y * -.6).toFixed(2)}px`);
      this.root.style.setProperty('--dir-x-soft', `${(x * .42).toFixed(2)}px`);
      this.root.style.setProperty('--dir-y-soft', `${(y * .24).toFixed(2)}px`);
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
      if (this.index) this.index.textContent = index;
      if (this.status) this.status.textContent = status;
    }
  }

  class SceneDirector {
    constructor() {
      this.sections = [...document.querySelectorAll('.scene,.plan-scene,.founder-scene')];
      this.raf = 0;
      this.lastY = scrollY;
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
      for (const section of this.sections) {
        const rect = section.getBoundingClientRect();
        const visible = rect.bottom > 0 && rect.top < innerHeight;
        if (!visible) continue;
        const progress = clamp(0, (innerHeight - rect.top) / Math.max(innerHeight + rect.height, 1), 1);
        section.style.setProperty('--v3-progress', progress.toFixed(4));
        section.style.setProperty('--v3-media-y', `${((.5 - progress) * 22).toFixed(2)}px`);
        section.style.setProperty('--v3-scale', (1.035 - progress * .018).toFixed(4));
        const distance = Math.abs((rect.top + rect.height * .5) - innerHeight * .5);
        if (distance < nearestDistance) {
          nearest = section;
          nearestDistance = distance;
        }
      }
      this.sections.forEach((section) => section.classList.toggle('v3-live', section === nearest));
      const delta = scrollY - this.lastY;
      document.body.classList.toggle('dir-down', delta > 2);
      document.body.classList.toggle('dir-up', delta < -2);
      this.lastY = scrollY;
    }
  }

  new StudioIdent();
  new DirectionPointer();
  new EditorialSequence();
  new SceneDirector();
})();
