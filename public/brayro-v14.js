(() => {
  'use strict';
  const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* V15 owns scene 02. V14 now owns only the compact homepage pricing
     architecture plus static finishing hooks. This avoids constructing an
     entire 430svh film and registering another scroll loop just to replace it. */
  class CinematicPricingPreview{
    constructor(){
      this.section=document.querySelector('#plans[data-scene="plans"]');
      if(!this.section)return;
      this.build();
      this.rows=[...this.section.querySelectorAll('[data-v14-rate]')];
      this.bind();
    }
    build(){
      this.section.className='scene brayro-rates';
      this.section.dataset.v14Rates='';
      const market=window.BRAYRO_MARKET;
      const price=id=>(market?.price(id)||({"monthly-starter":"₹2,599","monthly-growth":"₹3,999","monthly-studio":"₹5,999+","launch-website":"₹9,999","business-experience":"₹17,999","premium-experience":"₹25K–₹35K+","ai-workflow-audit":"₹9,999","company-second-brain":"₹29,999+"}[id])).replace(/\/(?:month|mo)$/,'');
      const link=(target,hash='')=>market?.link(target,hash)||target+hash;
      this.section.innerHTML=`
        <div class="scene-shell">
          <header class="brayro-rates__head">
            <p class="eyebrow">STARTING POINTS / NOT A PRICING WALL</p>
            <h2>Choose the way<br>we <em>work together.</em></h2>
            <p>The detailed pricing page stays detailed. Here, you only need the three decisions that matter.</p>
          </header>
          <div class="brayro-rates__list">
            <a class="brayro-rate is-active" data-v14-rate="monthly" href="${link('/plans','#monthly')}">
              <span class="brayro-rate__index">01 / MONTHLY</span>
              <div class="brayro-rate__name"><small>KEEP IT MOVING</small><h3>Website partnership</h3></div>
              <div class="brayro-rate__price"><small>FROM</small><strong>${price('monthly-starter')}</strong><i>/mo</i></div>
              <p>Ongoing updates, refinement and growth.</p>
              <span class="brayro-rate__levels">${price('monthly-starter')} · ${price('monthly-growth')} · ${price('monthly-studio')}</span><b>VIEW MONTHLY ↗</b>
            </a>
            <a class="brayro-rate" data-v14-rate="build" href="${link('/plans','#builds')}">
              <span class="brayro-rate__index">02 / ONE-TIME</span>
              <div class="brayro-rate__name"><small>MAKE THE WHOLE THING</small><h3>Complete website build</h3></div>
              <div class="brayro-rate__price"><small>FROM</small><strong>${price('launch-website')}</strong></div>
              <p>Direction, interface, development and launch.</p>
              <span class="brayro-rate__levels">${price('launch-website')} · ${price('business-experience')} · ${price('premium-experience')}</span><b>VIEW BUILDS ↗</b>
            </a>
            <a class="brayro-rate" data-v14-rate="ai" href="${link('/plans','#ai-systems')}">
              <span class="brayro-rate__index">03 / PRACTICAL AI</span>
              <div class="brayro-rate__name"><small>SOLVE ONE REAL PROBLEM</small><h3>AI systems</h3></div>
              <div class="brayro-rate__price"><small>FROM</small><strong>${price('ai-workflow-audit')}</strong></div>
              <p>Audit first. Build only what proves useful.</p>
              <span class="brayro-rate__levels">${price('ai-workflow-audit')} audit · ${price('company-second-brain')}+ build</span><b>VIEW AI ↗</b>
            </a>
          </div>
          <footer class="brayro-rates__foot">
            <p>Domains, hosting, API usage and paid third-party services remain separate unless included in writing.</p>
            <a href="${link('/plans')}" data-cursor-label="PRICING ↗">Open the full pricing page <span>↗</span></a>
          </footer>
        </div>`;
    }
    bind(){
      this.rows.forEach(row=>{
        const activate=()=>this.rows.forEach(item=>item.classList.toggle('is-active',item===row));
        row.addEventListener('focus',activate);
        if(fine)row.addEventListener('pointerenter',activate);
      });
    }
  }

  document.querySelector('#work')?.classList.add('v14-work-polish');
  document.querySelector('#studio')?.classList.add('v14-founder-polish');
  new CinematicPricingPreview();
})();
