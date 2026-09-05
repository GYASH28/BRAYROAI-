(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const clamp = (min, value, max) => Math.min(max, Math.max(min, value));

  const CAPABILITIES = [
    {
      kicker:'01 / WEB EXPERIENCES',
      title:'Make the page feel directed.',
      body:'Art direction, responsive UX and motion shaped as one continuous impression—not a stack of sections.',
      cue:'DIRECTION / TYPE / MOTION',
      asset:'/assets/brayroai-installation-hero.webp',
      label:'WEB'
    },
    {
      kicker:'02 / PRODUCT DESIGN',
      title:'Show the product by letting it move.',
      body:'Flows and interface states are introduced the way a product film would introduce them: one clear action at a time.',
      cue:'FLOW / STATE / INTERACTION',
      asset:'/assets/fakhrimart-case-desktop.png',
      label:'PRODUCT'
    },
    {
      kicker:'03 / FRONTEND ENGINEERING',
      title:'Keep the idea intact in the browser.',
      body:'Responsive engineering, accessibility and performance are part of the visual direction—not cleanup after design.',
      cue:'BUILD / PERFORMANCE / A11Y',
      asset:'/assets/brayroai-process-table.webp',
      label:'BUILD'
    },
    {
      kicker:'04 / PRACTICAL AI',
      title:'Use AI only where it earns the screen time.',
      body:'Workflow audits, company knowledge systems and useful automation. No robot imagery. No fake intelligence theatre.',
      cue:'SOURCE / CONTEXT / ACTION',
      asset:'',
      label:'USEFUL AI'
    }
  ];

  class CinematicCapabilities {
    constructor() {
      this.section = document.querySelector('#services[data-scene="services"]');
      if (!this.section) return;
      this.build();
      this.stage = this.section.querySelector('[data-v14-stage]');
      this.frames = [...this.section.querySelectorAll('[data-v14-frame]')];
      this.copies = [...this.section.querySelectorAll('[data-v14-copy]')];
      this.counter = this.section.querySelector('[data-v14-counter]');
      this.progress = this.section.querySelector('[data-v14-progress]');
      this.current = -1;
      this.raf = 0;
      this.bind();
      this.paint(true);
    }

    build() {
      this.section.className = 'scene brayro-film';
      this.section.dataset.v14Reel = '';
      this.section.innerHTML = `
        <div class="brayro-film__sticky" data-v14-stage>
          <div class="brayro-film__media" aria-hidden="true">
            ${CAPABILITIES.map((item, index) => `
              <figure class="brayro-film__frame brayro-film__frame--${index + 1}" data-v14-frame="${index}">
                ${item.asset ? `<img src="${item.asset}" alt="" loading="${index === 0 ? 'eager' : 'lazy'}">` : ''}
                <div class="brayro-film__graphic"><span>${String(index + 1).padStart(2,'0')}</span><strong>${item.label}</strong><i></i></div>
              </figure>`).join('')}
          </div>

          <div class="brayro-film__wash" aria-hidden="true"></div>
          <div class="brayro-film__topline"><span>BRAYROAI / CAPABILITY FILM</span><strong data-v14-counter>01 / 04</strong></div>

          <div class="brayro-film__copies">
            ${CAPABILITIES.map((item, index) => `
              <article class="brayro-film__copy" data-v14-copy="${index}">
                <small>${item.kicker}</small>
                <h2>${item.title.replace('directed.','<em>directed.</em>').replace('move.','<em>move.</em>').replace('browser.','<em>browser.</em>').replace('screen time.','<em>screen time.</em>')}</h2>
                <p>${item.body}</p>
                <span>${item.cue}</span>
              </article>`).join('')}
          </div>

          <div class="brayro-film__timeline" aria-hidden="true"><i data-v14-progress></i><span>SCROLL TO PLAY</span></div>
          <div class="brayro-film__caption" aria-hidden="true"><span>DESIGN</span><span>PRODUCT</span><span>ENGINEERING</span><span>AI</span></div>
        </div>
        <div class="brayro-film__scroll" aria-hidden="true">${CAPABILITIES.map(() => '<div></div>').join('')}</div>`;
    }

    bind() {
      if (reduced) {
        this.section.classList.add('is-reduced');
        return;
      }
      const schedule = () => {
        if (this.raf) return;
        this.raf = requestAnimationFrame(() => {
          this.raf = 0;
          this.paint();
        });
      };
      addEventListener('scroll', schedule, { passive:true });
      addEventListener('resize', schedule, { passive:true });
    }

    paint(force = false) {
      if (!this.stage || reduced) return;
      const rect = this.section.getBoundingClientRect();
      const travel = Math.max(1, this.section.offsetHeight - innerHeight);
      const p = clamp(0, -rect.top / travel, 1);
      const scaled = p * (CAPABILITIES.length - 1);
      const active = Math.round(scaled);

      this.frames.forEach((frame, index) => {
        const d = Math.abs(scaled - index);
        const opacity = clamp(0, 1 - d * 1.12, 1);
        const scale = 1.035 + d * .025;
        const y = (index - scaled) * 2.8;
        frame.style.opacity = opacity.toFixed(3);
        frame.style.transform = `translate3d(0,${y.toFixed(2)}vh,0) scale(${scale.toFixed(4)})`;
        frame.style.pointerEvents = opacity > .65 ? 'auto' : 'none';
      });

      this.copies.forEach((copy, index) => {
        const d = Math.abs(scaled - index);
        const opacity = clamp(0, 1 - d * 1.55, 1);
        const y = (index - scaled) * 32;
        copy.style.opacity = opacity.toFixed(3);
        copy.style.transform = `translate3d(0,${y.toFixed(1)}px,0)`;
        copy.style.visibility = opacity < .02 ? 'hidden' : 'visible';
      });

      if (this.progress) this.progress.style.transform = `scaleX(${p.toFixed(4)})`;
      if (force || active !== this.current) {
        this.current = active;
        if (this.counter) this.counter.textContent = `${String(active + 1).padStart(2,'0')} / 04`;
        this.section.dataset.reelState = ['web','product','frontend','ai'][active];
      }
    }
  }

  class CinematicPricingPreview {
    constructor() {
      this.section = document.querySelector('#plans[data-scene="plans"]');
      if (!this.section) return;
      this.build();
      this.rows = [...this.section.querySelectorAll('[data-v14-rate]')];
      this.bind();
    }

    build() {
      this.section.className = 'scene brayro-rates';
      this.section.dataset.v14Rates = '';
      this.section.innerHTML = `
        <div class="scene-shell">
          <header class="brayro-rates__head">
            <p class="eyebrow">STARTING POINTS / NOT A PRICING WALL</p>
            <h2>Choose the way<br>we <em>work together.</em></h2>
            <p>The detailed pricing page stays detailed. Here, you only need the three decisions that matter.</p>
          </header>

          <div class="brayro-rates__list">
            <a class="brayro-rate is-active" data-v14-rate="monthly" href="/plans#monthly">
              <span class="brayro-rate__index">01 / MONTHLY</span>
              <div class="brayro-rate__name"><small>KEEP IT MOVING</small><h3>Website partnership</h3></div>
              <div class="brayro-rate__price"><small>FROM</small><strong>₹2,599</strong><i>/mo</i></div>
              <p>Ongoing updates, refinement and growth.</p>
              <span class="brayro-rate__levels">₹2,599 · ₹3,999 · ₹5,999+</span>
              <b>VIEW MONTHLY ↗</b>
            </a>

            <a class="brayro-rate" data-v14-rate="build" href="/plans#builds">
              <span class="brayro-rate__index">02 / ONE-TIME</span>
              <div class="brayro-rate__name"><small>MAKE THE WHOLE THING</small><h3>Complete website build</h3></div>
              <div class="brayro-rate__price"><small>FROM</small><strong>₹9,999</strong></div>
              <p>Direction, interface, development and launch.</p>
              <span class="brayro-rate__levels">₹9,999 · ₹17,999 · ₹25K–₹35K+</span>
              <b>VIEW BUILDS ↗</b>
            </a>

            <a class="brayro-rate" data-v14-rate="ai" href="/plans#ai-systems">
              <span class="brayro-rate__index">03 / PRACTICAL AI</span>
              <div class="brayro-rate__name"><small>SOLVE ONE REAL PROBLEM</small><h3>AI systems</h3></div>
              <div class="brayro-rate__price"><small>FROM</small><strong>₹9,999</strong></div>
              <p>Audit first. Build only what proves useful.</p>
              <span class="brayro-rate__levels">₹9,999 audit · ₹29,999+ build</span>
              <b>VIEW AI ↗</b>
            </a>
          </div>

          <footer class="brayro-rates__foot">
            <p>Domains, hosting, API usage and paid third-party services remain separate unless included in writing.</p>
            <a href="/plans" data-cursor-label="PRICING ↗">Open the full pricing page <span>↗</span></a>
          </footer>
        </div>`;
    }

    bind() {
      this.rows.forEach(row => {
        const activate = () => this.rows.forEach(item => item.classList.toggle('is-active', item === row));
        row.addEventListener('focus', activate);
        if (fine) row.addEventListener('pointerenter', activate);
      });
    }
  }

  class FilmPolish {
    constructor() {
      this.work = document.querySelector('#work');
      this.founder = document.querySelector('#studio');
      if (this.work) this.work.classList.add('v14-work-polish');
      if (this.founder) this.founder.classList.add('v14-founder-polish');
      if (reduced) return;
      this.raf = 0;
      const schedule = () => {
        if (this.raf) return;
        this.raf = requestAnimationFrame(() => {
          this.raf = 0;
          this.paint();
        });
      };
      addEventListener('scroll', schedule, { passive:true });
      addEventListener('resize', schedule, { passive:true });
      schedule();
    }

    paint() {
      [this.work, this.founder].forEach(section => {
        if (!section) return;
        const media = section.querySelector('img');
        if (!media) return;
        const rect = section.getBoundingClientRect();
        const p = clamp(-1, (innerHeight * .5 - rect.top) / Math.max(innerHeight, rect.height), 1);
        media.style.setProperty('--v14-media-y', `${(p * -18).toFixed(1)}px`);
      });
    }
  }

  new CinematicCapabilities();
  new CinematicPricingPreview();
  new FilmPolish();
})();
