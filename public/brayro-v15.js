(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const items = [
    {key:'web',index:'01',label:'WEB',kicker:'WEB EXPERIENCES',title:'Make it feel alive.',accent:'alive.',body:'Move the pointer. Change the mood. We design websites as responsive experiences—not screenshots stacked into a page.',ticker:'TYPE · RHYTHM · SCROLL · STORY · TYPE · RHYTHM · SCROLL · STORY ·'},
    {key:'product',index:'02',label:'PRODUCT',kicker:'PRODUCT DESIGN',title:'Make the flow feel obvious.',accent:'obvious.',body:'Interfaces should explain themselves through movement, hierarchy and feedback. The interaction is part of the product story.',ticker:'FLOW · STATE · FEEDBACK · CLARITY · FLOW · STATE · FEEDBACK · CLARITY ·'},
    {key:'build',index:'03',label:'BUILD',kicker:'FRONTEND ENGINEERING',title:'Keep the idea intact.',accent:'intact.',body:'The browser should preserve the concept without sacrificing mobile UX, accessibility or performance.',ticker:'FAST · RESPONSIVE · ACCESSIBLE · SHIPPED · FAST · RESPONSIVE · ACCESSIBLE · SHIPPED ·'},
    {key:'ai',index:'04',label:'AI',kicker:'PRACTICAL AI SYSTEMS',title:'Solve one real problem.',accent:'real problem.',body:'Audit the workflow. Ground the knowledge. Automate only where it removes real friction. Useful beats futuristic.',ticker:'SOURCE · CONTEXT · ANSWER · ACTION · SOURCE · CONTEXT · ANSWER · ACTION ·'}
  ];

  class PlayfulCapabilities {
    constructor() {
      this.section = document.querySelector('#services[data-scene="services"]');
      if (!this.section) return;
      this.current = 0;
      this.touchX = 0;
      this.pointerFrame = 0;
      this.pointerTarget = { x:-100, y:-100, nx:0, ny:0, scale:0 };
      this.pointerCurrent = { x:-100, y:-100, nx:0, ny:0, scale:0 };
      this.build();
      this.stage = this.section.querySelector('[data-v15-stage]');
      this.ghost = this.section.querySelector('[data-v15-ghost]');
      this.kicker = this.section.querySelector('[data-v15-kicker]');
      this.title = this.section.querySelector('[data-v15-title]');
      this.body = this.section.querySelector('[data-v15-body]');
      this.counter = this.section.querySelector('[data-v15-counter]');
      this.ticker = [...this.section.querySelectorAll('[data-v15-ticker]')];
      this.controls = [...this.section.querySelectorAll('[data-v15-control]')];
      this.bind();
      this.set(0, false);
    }

    build() {
      this.section.className = 'scene play-scene';
      this.section.dataset.v15Play = '';
      this.section.dataset.playState = 'web';
      this.section.innerHTML = `
        <div class="play-scene__stage" data-v15-stage data-v12-story data-v12-story-visual data-state="web" data-sc-verify-state="play:web">
          <div class="play-scene__top"><span>BRAYROAI / PLAYGROUND 02</span><strong data-v15-counter>01 / 04</strong></div>
          <div class="play-scene__canvas">
            <div class="play-scene__rings" aria-hidden="true"><i></i><i></i><i></i></div>
            <div class="play-scene__ticker" aria-hidden="true"><span data-v15-ticker></span><span data-v15-ticker></span><span data-v15-ticker></span></div>
            <strong class="play-scene__ghost" data-v15-ghost data-v12-story-word aria-hidden="true">WEB</strong>
            <div class="play-scene__copy" aria-live="polite">
              <small data-v15-kicker>WEB EXPERIENCES</small>
              <h2 data-v15-title>Make it feel <em>alive.</em></h2>
              <p data-v15-body>Move the pointer. Change the mood. We design websites as responsive experiences—not screenshots stacked into a page.</p>
            </div>
            <div class="play-scene__cursor" data-v15-cursor aria-hidden="true">PLAY</div>
          </div>
          <div class="play-scene__controls" role="tablist" aria-label="Explore BRAYROAI capabilities">
            ${items.map((item,index)=>`<button type="button" role="tab" aria-selected="${index===0?'true':'false'}" class="play-scene__control${index===0?' is-active':''}" data-v15-control="${index}" data-v12-step="${item.key}"><span>${item.index}</span><b>${item.label}</b><i>↗</i></button>`).join('')}
          </div>
          <div class="play-scene__hint"><span>MOVE / HOVER / CLICK</span><span>ON MOBILE: TAP OR SWIPE</span></div>
        </div>`;
    }

    bind() {
      this.controls.forEach((control,index) => {
        control.addEventListener('click', () => this.set(index));
        control.addEventListener('focus', () => this.set(index));
        if (fine) control.addEventListener('pointerenter', () => this.set(index));
        control.addEventListener('keydown', event => {
          if (!['ArrowRight','ArrowLeft'].includes(event.key)) return;
          event.preventDefault();
          const next = (index + (event.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length;
          this.controls[next].focus();
          this.set(next);
        });
      });

      if (fine && !reduced) {
        this.stage.addEventListener('pointerenter', () => {
          this.pointerTarget.scale = 1;
          this.schedulePointer();
        });
        this.stage.addEventListener('pointerleave', () => {
          this.pointerTarget.scale = 0;
          this.pointerTarget.nx = 0;
          this.pointerTarget.ny = 0;
          this.schedulePointer();
        });
        this.stage.addEventListener('pointermove', event => this.pointer(event), { passive:true });
      }

      this.stage.addEventListener('click', event => {
        if (event.target.closest('button,a')) return;
        this.set((this.current + 1) % items.length);
      });
      this.stage.addEventListener('touchstart', event => { this.touchX = event.changedTouches[0]?.clientX || 0; }, { passive:true });
      this.stage.addEventListener('touchend', event => {
        const x = event.changedTouches[0]?.clientX || this.touchX;
        const dx = x - this.touchX;
        if (Math.abs(dx) < 42) return;
        this.set((this.current + (dx < 0 ? 1 : -1) + items.length) % items.length);
      }, { passive:true });
    }

    pointer(event) {
      const rect = this.stage.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this.pointerTarget.x = x;
      this.pointerTarget.y = y;
      this.pointerTarget.nx = (x / Math.max(rect.width,1) - .5) * 2;
      this.pointerTarget.ny = (y / Math.max(rect.height,1) - .5) * 2;
      this.pointerTarget.scale = 1;
      this.schedulePointer();
    }

    schedulePointer() {
      if (!this.pointerFrame) this.pointerFrame = requestAnimationFrame(() => this.tickPointer());
    }

    tickPointer() {
      this.pointerFrame = 0;
      const c = this.pointerCurrent;
      const t = this.pointerTarget;
      const posRate = .14;
      const scaleRate = .2;
      c.x += (t.x-c.x)*posRate;
      c.y += (t.y-c.y)*posRate;
      c.nx += (t.nx-c.nx)*.12;
      c.ny += (t.ny-c.ny)*.12;
      c.scale += (t.scale-c.scale)*scaleRate;
      this.stage.style.setProperty('--v15-cx',`${c.x.toFixed(2)}px`);
      this.stage.style.setProperty('--v15-cy',`${c.y.toFixed(2)}px`);
      this.stage.style.setProperty('--v15-cs',c.scale.toFixed(4));
      this.stage.style.setProperty('--v15-px',`${(c.nx*28).toFixed(2)}px`);
      this.stage.style.setProperty('--v15-py',`${(c.ny*20).toFixed(2)}px`);
      this.stage.style.setProperty('--v15-rot',`${(c.nx*1.55).toFixed(3)}deg`);
      this.stage.style.setProperty('--v15-row-a',`${(c.nx*55).toFixed(2)}px`);
      this.stage.style.setProperty('--v15-row-b',`${(c.nx*-72).toFixed(2)}px`);
      this.stage.style.setProperty('--v15-row-c',`${(c.nx*38).toFixed(2)}px`);
      const delta=Math.abs(t.x-c.x)+Math.abs(t.y-c.y)+Math.abs(t.nx-c.nx)*12+Math.abs(t.ny-c.ny)*12+Math.abs(t.scale-c.scale)*20;
      if(delta>.12)this.schedulePointer();
    }

    set(index, animate = true) {
      const item = items[index];
      if (!item) return;
      this.current = index;
      this.section.dataset.playState = item.key;
      this.section.dataset.reelState = item.key;
      this.stage.dataset.state = item.key;
      this.stage.dataset.scVerifyState = `play:${item.key}`;
      this.counter.textContent = `${item.index} / 04`;
      this.ghost.textContent = item.label;
      this.kicker.textContent = item.kicker;
      this.title.innerHTML = item.title.replace(item.accent,`<em>${item.accent}</em>`);
      this.body.textContent = item.body;
      this.ticker.forEach(node => node.textContent = item.ticker);
      this.controls.forEach((control,i) => {
        const active = i === index;
        control.classList.toggle('is-active', active);
        control.setAttribute('aria-selected', String(active));
      });
      if (animate && !reduced) {
        const copy = this.section.querySelector('.play-scene__copy');
        copy.animate([
          {opacity:.48,transform:'translate3d(0,16px,0) scale(.994)',filter:'blur(3px)'},
          {opacity:1,transform:'translate3d(0,-2px,0) scale(1.002)',filter:'blur(0)'},
          {opacity:1,transform:'translate3d(0,0,0) scale(1)',filter:'blur(0)'}
        ],{duration:620,easing:'cubic-bezier(.22,1,.36,1)'});
        this.ghost.animate([
          {opacity:.12,scale:.955},
          {opacity:1,scale:1.012,offset:.72},
          {opacity:1,scale:1}
        ],{duration:760,easing:'cubic-bezier(.22,1,.36,1)'});
      }
    }
  }

  class AIServiceLinks {
    constructor() {
      const cards=[...document.querySelectorAll('#ai-systems .v12-product-card')];
      const details=[
        {href:'/ai-workflow-audit',label:'See the full audit process'},
        {href:'/company-second-brain',label:'See how integration works'}
      ];
      cards.forEach((card,index)=>{
        if(!details[index]||card.querySelector('[data-v15-ai-detail]'))return;
        const primary=card.querySelector('.v12-product-card__cta');
        if(!primary)return;
        const link=document.createElement('a');
        link.className='v12-product-card__cta v15-detail-link';
        link.dataset.v15AiDetail='';
        link.href=details[index].href;
        link.innerHTML=`${details[index].label} <span>↗</span>`;
        primary.after(link);
      });
    }
  }

  new PlayfulCapabilities();
  new AIServiceLinks();
})();