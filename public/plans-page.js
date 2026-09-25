document.body.classList.add('js');

const plansReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const plansFinePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const plansClamp = (min, value, max) => Math.min(max, Math.max(min, value));

class PlansReveal {
  constructor() {
    const items = [...document.querySelectorAll('[data-reveal]')];
    if (plansReducedMotion || !('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '-3% 0px -11% 0px' });
    items.forEach((item) => observer.observe(item));
  }
}

class PlansSurfaceLight {
  constructor() {
    if (!plansFinePointer || plansReducedMotion) return;
    document.querySelectorAll('.glass-panel').forEach((surface) => {
      surface.addEventListener('pointermove', (event) => {
        const rect = surface.getBoundingClientRect();
        surface.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
        surface.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
      }, { passive: true });
    });
  }
}

class PlansTimeline {
  constructor() {
    this.scenes = [...document.querySelectorAll('[data-plan-scene]')];
    this.progress = document.querySelector('[data-plan-progress]');
    this.nav = document.querySelector('[data-plans-nav]');
    this.frame = 0;
    this.y = scrollY;
    this.update = this.update.bind(this);
    addEventListener('scroll', () => this.schedule(), { passive: true });
    addEventListener('resize', () => this.schedule(), { passive: true });
    this.bindAnchors();
    this.schedule();
  }

  bindAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: plansReducedMotion ? 'auto' : 'smooth', block: 'start' });
      });
    });
  }

  schedule() {
    if (!this.frame) this.frame = requestAnimationFrame(this.update);
  }

  update() {
    this.frame = 0;
    this.y += (scrollY - this.y) * (plansReducedMotion ? 1 : .18);
    if (Math.abs(scrollY - this.y) < .2) this.y = scrollY;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const p = plansClamp(0, this.y / max, 1);
    if (this.progress) this.progress.style.transform = `scaleX(${p.toFixed(4)})`;
    let active = this.scenes[0];
    let distance = Infinity;
    this.scenes.forEach((scene) => {
      const top = scene.offsetTop - this.y;
      const height = scene.offsetHeight;
      const local = plansClamp(0, (innerHeight * .85 - top) / (height + innerHeight * .7), 1);
      scene.style.setProperty('--plan-p', local.toFixed(4));
      const current = Math.abs(top + Math.min(height, innerHeight) * .5 - innerHeight * .48);
      if (top < innerHeight && top + height > 0 && current < distance) {
        active = scene;
        distance = current;
      }
    });
    if (this.nav && active) this.nav.dataset.scVerifyState = `plans:${active.dataset.planScene}:${Math.round(p * 100)}`;
    if (this.y !== scrollY) this.schedule();
  }
}

class PlansBriefs {
  constructor() {
    document.querySelectorAll('[data-plan-key]').forEach((card) => {
      const cta=card.querySelector('a[href^="mailto:"]');
      if (!cta) return;
      const heading=card.querySelector('h3');
      const plan=heading
        ? [...heading.childNodes].map((node)=>node.textContent.trim()).filter(Boolean).join(' ').replace(/\s+/g,' ').trim()
        : 'BRAYROAI plan';
      const monthly=card.dataset.planKey.startsWith('monthly');
      const market=window.BRAYRO_MARKET;
      const offerId=card.dataset.offerId;
      const displayedPrice=market?.price(offerId)||card.querySelector('div > strong')?.textContent.trim()||'';
      const marketName=market?.id==='au'?'Australia':market?.id?.startsWith('ae')?'UAE':'India';
      const arabic=market?.id==='ae-ar';
      const brief=arabic?[
        'مرحباً ياش،','',`أهتم بخدمة ${plan} بسعر منشور ${displayedPrice}. السوق: الإمارات / AED.`,`النوع: ${monthly?'شراكة شهرية':'مشروع متكامل'}.`,'','اسم الشركة:','ما أحتاج إلى بنائه أو تحسينه:','الموقع الحالي إن وجد:','الميزانية والموعد المتوقع:','','طريقة التواصل:'
      ].join('\n'):[
        'Hi Yash,',
        '',
        `I am interested in the ${plan} (${monthly ? 'monthly partnership' : 'one-time build'}) shown at ${displayedPrice}. Market: ${marketName}.`,
        '',
        'Business / brand:',
        'What needs to improve or be built:',
        'Current website, if any:',
        'Approximate budget and target date:',
        '',
        'Best way to reach me:'
      ].join('\n');
      const emailHref=`mailto:yashganesh.work@gmail.com?subject=${encodeURIComponent(`BRAYROAI / ${marketName} / ${plan} / ${displayedPrice}`)}&body=${encodeURIComponent(brief)}`;
      cta.href=`https://wa.me/919175524637?text=${encodeURIComponent(brief)}`;
      cta.target='_blank';cta.rel='noreferrer';
      cta.dataset.leadPlan=offerId;cta.dataset.leadChannel='whatsapp';
      cta.innerHTML=arabic?`ناقش ${plan} عبر واتساب <span>↗</span>`:`Discuss ${plan} on WhatsApp <span>↗</span>`;
      if(!card.querySelector('.plan-email-fallback')){const email=document.createElement('a');email.className='plan-email-fallback';email.href=emailHref;email.dataset.leadPlan=offerId;email.dataset.leadChannel='email';email.textContent=arabic?'تفضل البريد؟ أرسل هذا الموجز ↗':'Prefer email? Send this brief ↗';cta.after(email)}
    });
    const helper=document.querySelector('.plan-close__copy a');
    if(helper){
      const market=window.BRAYRO_MARKET;const arabic=market?.id==='ae-ar';const marketName=market?.id==='au'?'Australia':market?.id?.startsWith('ae')?'UAE':'India';
      const brief=arabic?['مرحباً ياش،','',`أحتاج إلى المساعدة في اختيار خدمة من BRAYROAI. السوق: الإمارات / AED.`,'','اسم الشركة:','ما أريد بناءه أو تحسينه:','الموقع الحالي إن وجد:','الميزانية والوقت المتوقع:','','طريقة التواصل:'].join('\n'):['Hi Yash,','',`I am not sure which BRAYROAI plan fits yet. Market: ${marketName} / ${market?.currency||'INR'}.`,'','Business / brand:','What I need to improve or build:','Current website, if any:','Approximate budget and target date:','','Best way to reach me:'].join('\n');
      const emailHref=`mailto:yashganesh.work@gmail.com?subject=${encodeURIComponent(`BRAYROAI / ${marketName} / help choosing a plan`)}&body=${encodeURIComponent(brief)}`;
      helper.href=`https://wa.me/919175524637?text=${encodeURIComponent(brief)}`;helper.target='_blank';helper.rel='noreferrer';helper.innerHTML=arabic?'اسأل عبر واتساب <span>↗</span>':'Ask on WhatsApp <span>↗</span>';
      if(!helper.parentElement.querySelector('.plan-email-fallback')){const email=document.createElement('a');email.className='plan-email-fallback';email.href=emailHref;email.textContent=arabic?'تفضل البريد؟ أرسل الموجز ↗':'Prefer email? Send the brief ↗';helper.after(email)}
    }
  }
}

class AIServiceDetailLinks {
  constructor() {
    const cards=[...document.querySelectorAll('#ai-systems .ai-plan-card')];
    const links=[
      {href:'/ai-workflow-audit',label:'See exactly how the audit works ↗'},
      {href:'/company-second-brain',label:'See how the Second Brain is integrated ↗'}
    ];
    cards.forEach((card,index)=>{
      if(card.querySelector('[data-ai-detail-link]')||!links[index])return;
      const primary=card.querySelector('a[href]');
      if(!primary)return;
      const detail=document.createElement('a');
      detail.className='plan-email-fallback';
      detail.dataset.aiDetailLink='';
      detail.href=window.BRAYRO_MARKET?.link(links[index].href)||links[index].href;
      detail.textContent=window.BRAYRO_MARKET?.id==='ae-ar'?(index===0?'تعرف على خطوات التدقيق ↗':'تعرف على نظام ذاكرة الشركة ↗'):links[index].label;
      primary.after(detail);
    });
  }
}

class PlansMobileComparison {
  constructor(){
    const tables=[...document.querySelectorAll('#compare .compare-table')];
    if(!tables.length)return;
    const arabic=window.BRAYRO_MARKET?.id==='ae-ar';
    const families=arabic?['الشراكات الشهرية','بناء المواقع','أنظمة الذكاء الاصطناعي']:['Monthly partnerships','One-time builds','AI systems'];
    tables.forEach((table,index)=>{
      const rows=[...table.querySelectorAll('[role="row"]')];
      if(rows.length<3)return;
      const names=[...rows[0].querySelectorAll('[role="columnheader"]')].slice(1);
      const prices=[...rows[1].querySelectorAll('[role="cell"]')];
      const fits=[...rows[2].querySelectorAll('[role="cell"]')];
      const group=document.createElement('section');group.className='compare-mobile';group.setAttribute('aria-label',families[index]);
      const heading=document.createElement('h3');heading.textContent=families[index];group.append(heading);
      names.forEach((name,i)=>{
        const card=document.createElement('article');card.className='compare-mobile__card';
        const title=document.createElement('h4');title.textContent=name.textContent.trim();
        const price=document.createElement('strong');price.textContent=prices[i]?.textContent.trim()||'';
        const best=document.createElement('p');best.textContent=`${arabic?'الأنسب لـ':'Best for'} · ${fits[i]?.textContent.trim()||''}`;
        card.append(title,price,best);group.append(card);
      });
      table.after(group);
    });
    document.body.classList.add('compare-mobile-ready');
  }
}

new PlansReveal();
new PlansSurfaceLight();
new PlansTimeline();
new PlansBriefs();
new AIServiceDetailLinks();
new PlansMobileComparison();
let plansScrollCraftMounted = false;
const plansMountTriggers = ['pointerdown', 'wheel', 'touchstart', 'keydown', 'scroll'];
const mountPlansScrollCraft = () => {
  if (plansScrollCraftMounted || !window.ScrollCraft) return;
  plansScrollCraftMounted = true;
  plansMountTriggers.forEach((eventName) => removeEventListener(eventName, mountPlansScrollCraft));
  window.ScrollCraft.mount(document.body);
};
if (plansReducedMotion) mountPlansScrollCraft();
else plansMountTriggers.forEach((eventName) => addEventListener(eventName, mountPlansScrollCraft, { once: true, passive: eventName !== 'keydown' }));
