(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = document.querySelector('[data-ai-progress]');
  const reveals = [...document.querySelectorAll('.reveal')];

  if (progress && !reduced) {
    let raf = 0;
    const paint = () => {
      raf = 0;
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const p = Math.min(1, Math.max(0, scrollY / max));
      progress.style.transform = `scaleX(${p.toFixed(4)})`;
    };
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(paint);
    };
    addEventListener('scroll', schedule, { passive:true });
    addEventListener('resize', schedule, { passive:true });
    schedule();
  }

  if (reveals.length) {
    if (reduced || !('IntersectionObserver' in window)) reveals.forEach(node => node.classList.add('is-visible'));
    else {
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        });
      }, { threshold:.12, rootMargin:'0px 0px -6% 0px' });
      reveals.forEach(node => io.observe(node));
    }
  }

  class ProcessLab {
    constructor() {
      this.root = document.querySelector('[data-process-lab]');
      if (!this.root) return;
      this.tabs = [...this.root.querySelectorAll('[data-process-tab]')];
      this.stage = this.root.querySelector('[data-process-stage]');
      this.title = this.root.querySelector('[data-process-title]');
      this.body = this.root.querySelector('[data-process-body]');
      this.label = this.root.querySelector('[data-process-label]');
      this.outputs = this.root.querySelector('[data-process-outputs]');
      this.items = JSON.parse(this.root.dataset.processItems || '[]');
      this.tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => this.set(index));
        tab.addEventListener('keydown', event => {
          if (!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp'].includes(event.key)) return;
          event.preventDefault();
          const delta = ['ArrowRight','ArrowDown'].includes(event.key) ? 1 : -1;
          const next = (index + delta + this.tabs.length) % this.tabs.length;
          this.tabs[next].focus();
          this.set(next);
        });
      });
      this.set(0, false);
    }
    set(index, animate = true) {
      const item = this.items[index];
      if (!item) return;
      this.tabs.forEach((tab, i) => tab.setAttribute('aria-selected', String(i === index)));
      const apply = () => {
        this.stage.dataset.stageNumber = String(index + 1).padStart(2,'0');
        this.label.textContent = item.label;
        this.title.textContent = item.title;
        this.body.textContent = item.body;
        this.outputs.innerHTML = item.outputs.map(output => `<span>${output}</span>`).join('');
        this.stage.dataset.active = String(index);
      };
      if (!animate || reduced) return apply();
      this.stage.animate([{opacity:1,transform:'translateY(0)'},{opacity:.18,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:'cubic-bezier(.16,1,.3,1)'});
      apply();
    }
  }

  class ArchitectureLab {
    constructor() {
      this.root = document.querySelector('[data-architecture]');
      if (!this.root) return;
      this.nodes = [...this.root.querySelectorAll('[data-arch-node]')];
      this.status = this.root.querySelector('[data-arch-status]');
      this.copy = {
        docs:'Approved PDFs, SOPs, policies and internal documents become searchable knowledge.',
        drive:'Selected Drive folders can be connected as expanded scope while respecting the agreed access model.',
        crm:'CRM records can be integrated when the use case needs account or pipeline context.',
        whatsapp:'WhatsApp knowledge or workflow connections are possible where technically and operationally appropriate.',
        manual:'A curated upload path keeps the first version simple when live connectors are not necessary.'
      };
      this.nodes.forEach(node => {
        const activate = () => this.set(node.dataset.archNode);
        node.addEventListener('click', activate);
        node.addEventListener('focus', activate);
        node.addEventListener('pointerenter', activate);
      });
      if (this.nodes[0]) this.set(this.nodes[0].dataset.archNode);
    }
    set(key) {
      this.nodes.forEach(node => node.classList.toggle('is-active', node.dataset.archNode === key));
      if (this.status) this.status.textContent = this.copy[key] || 'Approved company knowledge becomes retrievable context for grounded answers.';
    }
  }

  class FAQAccordion {
    constructor() {
      const items = [...document.querySelectorAll('.faq details')];
      items.forEach(item => item.addEventListener('toggle', () => {
        if (!item.open) return;
        items.forEach(other => { if (other !== item) other.open = false; });
      }));
    }
  }

  new ProcessLab();
  new ArchitectureLab();
  new FAQAccordion();
})();