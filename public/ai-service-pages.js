(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = [...document.querySelectorAll('.reveal')];

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
      this.tablist = this.root.querySelector('[role="tablist"]');
      this.stage = this.root.querySelector('[data-process-stage]');
      this.title = this.root.querySelector('[data-process-title]');
      this.body = this.root.querySelector('[data-process-body]');
      this.label = this.root.querySelector('[data-process-label]');
      this.outputs = this.root.querySelector('[data-process-outputs]');
      this.items = JSON.parse(this.root.dataset.processItems || '[]');
      this.stage.id ||= 'audit-process-stage';
      this.stage.setAttribute('role','tabpanel');
      this.syncOrientation=()=>this.tablist?.setAttribute('aria-orientation',innerWidth<=900?'horizontal':'vertical');
      this.syncOrientation();
      addEventListener('resize',this.syncOrientation,{passive:true});
      this.tabs.forEach((tab, index) => {
        tab.id ||= `audit-process-tab-${index + 1}`;
        tab.setAttribute('aria-controls',this.stage.id);
        tab.addEventListener('click', () => this.set(index));
        tab.addEventListener('keydown', event => {
          if (!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Home','End'].includes(event.key)) return;
          event.preventDefault();
          const delta = ['ArrowRight','ArrowDown'].includes(event.key) ? 1 : -1;
          const next = event.key==='Home'?0:event.key==='End'?this.tabs.length-1:(index + delta + this.tabs.length) % this.tabs.length;
          this.tabs[next].focus();
          this.set(next);
        });
      });
      this.set(0, false);
    }
    set(index, animate = true) {
      const item = this.items[index];
      if (!item) return;
      this.tabs.forEach((tab, i) => {
        const active=i===index;
        tab.setAttribute('aria-selected',String(active));
        tab.tabIndex=active?0:-1;
      });
      const activeTab=this.tabs[index];
      this.stage.setAttribute('aria-labelledby',activeTab.id);
      if(animate&&innerWidth<=900)activeTab.scrollIntoView({behavior:reduced?'auto':'smooth',block:'nearest',inline:'center'});
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
      this.status?.setAttribute('aria-live','polite');
      this.copy = this.root.dataset.archCopy ? JSON.parse(this.root.dataset.archCopy) : {
        docs:'Approved PDFs, SOPs, policies and internal documents become searchable knowledge.',
        drive:'Selected Drive folders can be connected as expanded scope while respecting the agreed access model.',
        crm:'CRM records can be integrated when the use case needs account or pipeline context.',
        whatsapp:'WhatsApp knowledge or workflow connections are possible where technically and operationally appropriate.',
        manual:'A curated upload path keeps the first version simple when live connectors are not necessary.'
      };
      this.nodes.forEach(node => {
        const activate = () => this.set(node.dataset.archNode);
        node.addEventListener('click', () => { this.pinned=node.dataset.archNode;activate(); });
        node.addEventListener('focus', activate);
        node.addEventListener('pointerenter', () => { if (!this.pinned) activate(); });
      });
      if (this.nodes[0]) this.set(this.nodes[0].dataset.archNode);
    }
    set(key) {
      this.nodes.forEach(node => {
        const active=node.dataset.archNode===key;
        node.classList.toggle('is-active',active);
        node.setAttribute('aria-pressed',String(active));
      });
      if (this.status) this.status.textContent = this.copy[key] || 'Approved company knowledge becomes retrievable context for grounded answers.';
    }
  }

  class LeadHandoff {
    constructor(){
      const whatsapp=document.querySelector('.ai-cta__actions a[href*="wa.me"]');if(!whatsapp)return;
      const market=window.BRAYRO_MARKET,path=location.pathname,brain=path.includes('company-second-brain');
      const offerId=brain?'company-second-brain':'ai-workflow-audit',title=brain?'Company Second Brain':'AI Workflow Audit';
      const price=market?.price(offerId)||document.querySelector('.ai-price strong')?.textContent.trim()||'';
      const marketName=market?.id==='au'?'Australia':market?.id?.startsWith('ae')?'UAE':'India';
      const source=brain?'/company-second-brain':'/ai-workflow-audit';
      const brief=(market?.id==='ae-ar'?['مرحباً ياش،','',title+' / '+price,'السوق: '+marketName+' / '+(market?.currency||'AED'),'','الشركة أو الفريق:','المشكلة أو سير العمل:','الأدوات الحالية:','النتيجة المطلوبة:','','المصدر: '+source]:['Hi Yash','',title+' / '+price,'Market: '+marketName+' / '+(market?.currency||'INR'),'','Business / team:','Workflow or knowledge problem:','Current tools:','Outcome we need:','','Source: '+source]).join('\n');
      whatsapp.href='https://wa.me/919175524637?text='+encodeURIComponent(brief);
      const email=document.querySelector('.ai-cta__actions a[href^="mailto:"]');
      if(email)email.href='mailto:yashganesh.work@gmail.com?subject='+encodeURIComponent('BRAYROAI / '+marketName+' / '+title+' / '+price)+'&body='+encodeURIComponent(brief);
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
  new LeadHandoff();
})();
