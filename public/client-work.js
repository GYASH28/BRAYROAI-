(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const CLIENTS = [
    {
      slug: 'fakhrimart',
      name: 'FakhriMart',
      year: '2026',
      status: 'live',
      statusLabel: 'Live',
      sector: 'Yarn & craft supply',
      location: 'Pune · India',
      summary: 'A verified catalogue, discovery and WhatsApp-enquiry system for a yarn and craft supplier serving retail, reseller and bulk buyers.',
      services: ['Strategy', 'UX/UI', 'React', 'Frontend', 'Catalogue architecture', 'SEO', 'QA'],
      caseStudy: '/clients/fakhrimart',
      live: 'https://fakhriyarns.vercel.app/',
      previewDesktop: '/assets/fakhrimart-case-desktop.webp',
      previewMobile: '/assets/fakhrimart-case-mobile.webp',
      proof: 'Verified client work'
    }
  ];

  const qs = (s, root = document) => root.querySelector(s);
  const qsa = (s, root = document) => [...root.querySelectorAll(s)];

  const ensureAccessibilityStyles = () => {
    if (document.querySelector('link[data-client-accessibility]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/client-work-accessibility.css';
    link.dataset.clientAccessibility = '';
    document.head.append(link);
  };

  class ClientArchive {
    constructor() {
      this.grid = qs('[data-client-grid]');
      if (!this.grid) return;
      this.filters = qsa('[data-client-filter]');
      this.count = qs('[data-client-count]');
      this.search = qs('[data-client-search]');
      this.empty = qs('[data-client-empty]');
      this.status='all';
      this.render();
      this.filters.forEach(button => button.addEventListener('click', () => this.filter(button.dataset.clientFilter)));
      this.search?.addEventListener('input',()=>this.apply());
      qs('[data-client-reset]')?.addEventListener('click',()=>{this.search.value='';this.filter('all');this.search.focus()});
      this.filter('all');
    }

    render() {
      this.grid.innerHTML = CLIENTS.map((client, index) => `
        <article class="client-card" data-client-card data-status="${client.status}" data-sector="${client.sector.toLowerCase()}" style="--client-index:${index}">
          <a class="client-card__media" href="${window.BRAYRO_MARKET?.link(client.caseStudy)||client.caseStudy}" aria-label="Read the ${client.name} case study">
            <img src="${client.previewDesktop}" width="1440" height="900" loading="${index ? 'lazy' : 'eager'}" alt="${client.name} website shown on desktop.">
            <span class="client-card__badge">${client.proof}</span>
            <span class="client-card__visit">Open case study ↗</span>
          </a>
          <div class="client-card__body">
            <div class="client-card__meta"><span>${String(index + 1).padStart(2, '0')}</span><span>${client.year}</span><span class="client-card__status">${client.statusLabel}</span></div>
            <h2><a href="${window.BRAYRO_MARKET?.link(client.caseStudy)||client.caseStudy}">${client.name}</a></h2>
            <p>${client.summary}</p>
            <div class="client-card__details"><span>${client.sector}</span><span>${client.location}</span></div>
            <div class="client-card__services">${client.services.map(service => `<span>${service}</span>`).join('')}</div>
            <div class="client-card__actions"><a href="${window.BRAYRO_MARKET?.link(client.caseStudy)||client.caseStudy}">Read the case study <span>↗</span></a><a href="${client.live}" target="_blank" rel="noreferrer">View live site <span>↗</span></a></div>
          </div>
        </article>
      `).join('');
    }

    filter(status) {
      this.status=status;
      this.filters.forEach(button => {
        const active = button.dataset.clientFilter === status;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      this.apply();
    }

    apply(){
      const query=(this.search?.value||'').trim().toLocaleLowerCase();
      let visible = 0;
      qsa('[data-client-card]', this.grid).forEach(card => {
        const show = (this.status === 'all' || card.dataset.status === this.status) && (!query || card.textContent.toLocaleLowerCase().includes(query));
        card.hidden = !show;
        if (show) visible += 1;
      });
      if (this.count) this.count.textContent = `${visible} ${visible === 1 ? 'project' : 'projects'}`;
      if(this.empty)this.empty.hidden=visible>0;
    }
  }

  class Reveal {
    constructor() {
      const items = qsa('[data-client-reveal]');
      if (!items.length) return;
      if (reduced || !('IntersectionObserver' in window)) {
        items.forEach(item => item.classList.add('is-visible'));
        return;
      }
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        });
      }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
      items.forEach(item => io.observe(item));
    }
  }

  class Progress {
    constructor() {
      this.bar = qs('[data-client-progress]');
      if (!this.bar) return;
      this.frame = 0;
      addEventListener('scroll', () => this.schedule(), { passive: true });
      addEventListener('resize', () => this.schedule(), { passive: true });
      this.schedule();
    }
    schedule() {
      if (this.frame) return;
      this.frame = requestAnimationFrame(() => {
        this.frame = 0;
        const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
        this.bar.style.transform = `scaleX(${Math.min(1, Math.max(0, scrollY / max)).toFixed(4)})`;
      });
    }
  }

  class CursorLight {
    constructor() {
      if (reduced || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
      qsa('[data-client-surface]').forEach(surface => {
        surface.addEventListener('pointermove', event => {
          const rect = surface.getBoundingClientRect();
          surface.style.setProperty('--client-x', `${event.clientX - rect.left}px`);
          surface.style.setProperty('--client-y', `${event.clientY - rect.top}px`);
        }, { passive: true });
      });
    }
  }

  class CaseStudyTimeline {
    constructor() {
      this.sections = qsa('[data-case-section]');
      this.label = qs('[data-case-state]');
      if (!this.sections.length || !this.label || !('IntersectionObserver' in window)) return;
      const io = new IntersectionObserver(entries => {
        const active = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!active) return;
        this.label.textContent = active.target.dataset.caseSection;
      }, { rootMargin: '-25% 0px -55% 0px', threshold: [0, .15, .35, .65] });
      this.sections.forEach(section => io.observe(section));
    }
  }

  ensureAccessibilityStyles();
  new ClientArchive();
  new Reveal();
  new Progress();
  new CursorLight();
  new CaseStudyTimeline();

  window.BRAYRO_CLIENTS = Object.freeze(CLIENTS.map(client => Object.freeze({ ...client })));
})();
