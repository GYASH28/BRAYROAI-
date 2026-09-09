(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function track(event, detail = {}) {
    const safe = { event, path: window.location.pathname, ...detail };
    window.dispatchEvent(new CustomEvent('brayro:analytics', { detail: safe }));
    if (Array.isArray(window.dataLayer)) window.dataLayer.push(safe);
  }

  const scenarios = {
    realEstate: {
      label: 'Real estate enquiry',
      lead: 'Maya / Apartment enquiry',
      source: 'Google Ads → Property page',
      summary: ['Qualified', '2 bed / Downtown', 'Viewing requested'],
      events: [
        ['10:02', 'Website enquiry received'],
        ['10:02', 'Source and property interest recorded'],
        ['10:03', 'Lead qualification completed'],
        ['10:03', 'Added to Qualified pipeline'],
        ['10:04', 'Personalized WhatsApp follow-up prepared'],
        ['10:11', 'Viewing request captured']
      ]
    },
    consulting: {
      label: 'Consulting lead',
      lead: 'Daniel / Operations project',
      source: 'LinkedIn → Service page',
      summary: ['Qualified', '10–25 employees', 'Discovery requested'],
      events: [
        ['14:21', 'Consulting enquiry received'],
        ['14:21', 'Company and source context recorded'],
        ['14:22', 'Project intent classified'],
        ['14:22', 'Lead routed to Qualified pipeline'],
        ['14:23', 'Discovery questions sent'],
        ['14:31', 'Call request received']
      ]
    },
    homeService: {
      label: 'Home-service quote',
      lead: 'Aisha / AC service quote',
      source: 'Instagram → Quote page',
      summary: ['Qualified', 'Urgent service', 'Visit requested'],
      events: [
        ['18:04', 'Quote request received'],
        ['18:04', 'Service type and location recorded'],
        ['18:05', 'Urgency and eligibility classified'],
        ['18:05', 'Lead routed to Service pipeline'],
        ['18:06', 'WhatsApp confirmation sent'],
        ['18:13', 'Preferred visit window received']
      ]
    }
  };

  function initGrowthDemo() {
    const root = $('[data-ig-demo]');
    if (!root) return;

    const select = $('[data-ig-scenario]', root);
    const leadName = $('[data-ig-lead-name]', root);
    const leadSource = $('[data-ig-lead-source]', root);
    const summary = $$('[data-ig-summary]', root);
    const timeline = $('[data-ig-timeline]', root);
    const progress = $('[data-ig-progress]', root);
    const prev = $('[data-ig-prev]', root);
    const next = $('[data-ig-next]', root);
    const play = $('[data-ig-play]', root);
    const pipeline = $$('[data-ig-pipeline]', root);
    let key = select?.value || 'realEstate';
    let step = 0;
    let timer = null;
    let started = false;

    function renderScenario(reset = true) {
      const scenario = scenarios[key] || scenarios.realEstate;
      if (reset) step = 0;
      if (leadName) leadName.textContent = scenario.lead;
      if (leadSource) leadSource.textContent = scenario.source;
      summary.forEach((el, index) => { el.textContent = scenario.summary[index] || '—'; });
      if (timeline) {
        timeline.innerHTML = scenario.events.map(([time, text], index) => `
          <div class="ig-event${index <= step ? ' is-active' : ''}" data-ig-event="${index}">
            <time>${time}</time><strong>${text}</strong>
          </div>`).join('');
      }
      renderStep();
    }

    function renderStep() {
      const scenario = scenarios[key] || scenarios.realEstate;
      $$('[data-ig-event]', root).forEach((el, index) => el.classList.toggle('is-active', index <= step));
      pipeline.forEach((el, index) => el.classList.toggle('is-active', index === Math.min(Math.floor(step / 2), pipeline.length - 1)));
      if (progress) progress.textContent = `STEP ${String(step + 1).padStart(2, '0')} / ${String(scenario.events.length).padStart(2, '0')}`;
      if (step === scenario.events.length - 1) track('growth_demo_completed', { scenario: key });
    }

    function markStarted() {
      if (started) return;
      started = true;
      track('growth_demo_started', { scenario: key });
    }

    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
      if (play) play.textContent = 'Play';
    }

    function advance(direction = 1) {
      markStarted();
      const max = scenarios[key].events.length - 1;
      step = Math.max(0, Math.min(max, step + direction));
      renderStep();
      if (step >= max && direction > 0) stop();
    }

    select?.addEventListener('change', () => {
      stop();
      key = select.value;
      started = false;
      renderScenario(true);
      track('growth_demo_scenario', { scenario: key });
    });
    prev?.addEventListener('click', () => { stop(); advance(-1); });
    next?.addEventListener('click', () => { stop(); advance(1); });
    play?.addEventListener('click', () => {
      markStarted();
      if (timer) return stop();
      if (step >= scenarios[key].events.length - 1) step = 0;
      if (play) play.textContent = 'Pause';
      if (reduceMotion) return advance(1);
      timer = window.setInterval(() => advance(1), 900);
    });

    renderScenario(true);
  }

  function initCalculator() {
    const root = $('[data-ig-calculator]');
    if (!root) return;
    const fields = {
      leads: $('[name="monthlyLeads"]', root),
      value: $('[name="leadValue"]', root),
      rate: $('[name="bookingRate"]', root),
      hours: $('[name="adminHours"]', root),
      hourly: $('[name="hourlyCost"]', root)
    };
    const revenue = $('[data-ig-revenue-opportunity]', root);
    const admin = $('[data-ig-admin-cost]', root);
    const hours = $('[data-ig-hours-recoverable]', root);
    let tracked = false;

    const number = (input, fallback = 0) => {
      const value = Number.parseFloat(input?.value || '');
      return Number.isFinite(value) ? Math.max(0, value) : fallback;
    };
    const money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value || 0);

    function render() {
      const leads = number(fields.leads);
      const value = number(fields.value);
      const rate = Math.min(100, number(fields.rate));
      const adminHours = number(fields.hours);
      const hourlyCost = number(fields.hourly);
      const currentBookings = leads * (rate / 100);
      const improvedBookings = leads * (Math.min(rate + 5, 100) / 100);
      const opportunity = Math.max(0, (improvedBookings - currentBookings) * value);
      const monthlyAdminCost = adminHours * 4.33 * hourlyCost;
      const recoverable = adminHours * 4.33 * .4;
      if (revenue) revenue.textContent = `${money(opportunity)} / mo`;
      if (admin) admin.textContent = `${money(monthlyAdminCost)} / mo`;
      if (hours) hours.textContent = `${recoverable.toFixed(1)} hrs / mo`;
    }

    Object.values(fields).forEach(input => input?.addEventListener('input', () => {
      if (!tracked) {
        tracked = true;
        track('opportunity_calculator_used');
      }
      render();
    }));
    render();
  }

  function initAuditForm() {
    const form = $('[data-ig-audit-form]');
    if (!form) return;
    const steps = $$('[data-ig-audit-step]', form);
    const progress = $('[data-ig-audit-progress]', form);
    const back = $('[data-ig-audit-back]', form);
    const next = $('[data-ig-audit-next]', form);
    const choices = $$('[data-ig-choice]', form);
    const summary = $('[data-ig-audit-summary]', form);
    const email = $('[data-ig-audit-email]', form);
    const whatsapp = $('[data-ig-audit-whatsapp]', form);
    const status = document.createElement('p');
    status.className = 'sr-only';
    status.setAttribute('aria-live', 'polite');
    form.append(status);
    let index = 0;
    let goal = '';
    let started = false;

    function announce(message) {
      status.textContent = '';
      window.setTimeout(() => { status.textContent = message; }, 10);
    }

    function render() {
      steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
      if (progress) progress.textContent = `STEP ${index + 1} / ${steps.length}`;
      if (back) back.hidden = index === 0;
      if (next) next.textContent = index === steps.length - 1 ? 'Prepare request' : 'Continue';
      const heading = $('h2', steps[index]);
      if (heading && index > 0) heading.setAttribute('tabindex', '-1');
    }

    function validateCurrentStep() {
      if (index === 0 && !goal) {
        announce('Choose one priority before continuing.');
        choices[0]?.focus();
        return false;
      }
      const required = $$('input[required],select[required],textarea[required]', steps[index]);
      const invalid = required.find(field => !field.checkValidity());
      if (invalid) {
        announce('Please complete the required fields before continuing.');
        invalid.reportValidity();
        invalid.focus();
        return false;
      }
      return true;
    }

    choices.forEach(button => button.addEventListener('click', () => {
      if (!started) {
        started = true;
        track('audit_started');
      }
      choices.forEach(item => item.classList.remove('is-selected'));
      button.classList.add('is-selected');
      goal = button.dataset.igChoice || button.textContent.trim();
      button.setAttribute('aria-pressed', 'true');
      choices.filter(item => item !== button).forEach(item => item.setAttribute('aria-pressed', 'false'));
    }));

    back?.addEventListener('click', () => {
      index = Math.max(0, index - 1);
      render();
      $('h2', steps[index])?.focus();
    });

    next?.addEventListener('click', () => {
      if (!validateCurrentStep()) return;
      if (index < steps.length - 1) {
        track('audit_step_completed', { step: index + 1 });
        index += 1;
        render();
        $('h2', steps[index])?.focus();
        return;
      }

      const data = new FormData(form);
      const name = data.get('name') || 'Not provided';
      const workEmail = data.get('email') || 'Not provided';
      const company = data.get('company') || 'Not provided';
      const website = data.get('website') || 'Not provided';
      const region = data.get('region') || 'Global';
      const budget = data.get('budget') || 'Not sure yet';
      const notes = data.get('notes') || 'No additional notes';
      const text = `Hi Yash, I want a BRAYROAI AI Growth Audit.\n\nName: ${name}\nWork email: ${workEmail}\nCompany: ${company}\nWebsite: ${website}\nRegion: ${region}\nPriority: ${goal}\nBudget: ${budget}\nNotes: ${notes}`;
      const subject = `BRAYROAI AI Growth Audit — ${company}`;
      if (summary) summary.textContent = `Priority: ${goal} · Region: ${region} · Budget: ${budget}`;
      if (email) email.href = `mailto:yashganesh.work@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
      if (whatsapp) whatsapp.href = `https://wa.me/919175524637?text=${encodeURIComponent(text)}`;
      form.dataset.ready = 'true';
      announce('Your request is ready. Choose email or WhatsApp to send it.');
      track('audit_prepared');
    });

    form.addEventListener('submit', event => event.preventDefault());
    render();
  }

  function initRegionAwareLinks() {
    const path = window.location.pathname.toLowerCase();
    const region = path.includes('/uae') ? 'UAE' : path.includes('/us') ? 'US' : 'Global';
    $$('[data-ig-region]').forEach(el => el.textContent = region);
    $$('[data-ig-whatsapp-context]').forEach(link => {
      const base = link.dataset.igWhatsappContext || 'I want to discuss a BRAYROAI Growth Engine.';
      link.href = `https://wa.me/919175524637?text=${encodeURIComponent(`${base} Region: ${region}.`)}`;
    });
  }

  function initCtaTracking() {
    document.addEventListener('click', event => {
      const link = event.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href') || '';
      let name = '';
      if (href === '/audit' || href.startsWith('/audit?')) name = 'audit_cta_clicked';
      else if (href.includes('wa.me/')) name = 'whatsapp_clicked';
      else if (href.startsWith('mailto:')) name = 'email_clicked';
      else if (href.startsWith('/work/fakhrimart')) name = 'case_study_opened';
      else if (href === '/us' || href.startsWith('/us?')) name = 'us_page_clicked';
      else if (href === '/uae' || href.startsWith('/uae?')) name = 'uae_page_clicked';
      else if (href.includes('fakhriyarns.vercel.app')) name = 'verified_client_site_clicked';
      if (name) track(name);
    }, { passive: true });
  }

  function initReveal() {
    const items = $$('[data-ig-reveal]');
    if (!items.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(el => el.dataset.igVisible = 'true');
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.dataset.igVisible = 'true';
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    items.forEach(el => observer.observe(el));
  }

  initGrowthDemo();
  initCalculator();
  initAuditForm();
  initRegionAwareLinks();
  initCtaTracking();
  initReveal();
})();
