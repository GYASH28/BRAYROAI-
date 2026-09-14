(() => {
  if (window.__BRAYRO_RAE__) return;
  window.__BRAYRO_RAE__ = true;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const canSpeak = 'speechSynthesis' in window;
  const state = { open:false, busy:false, voice:false, history:[], section:'', blinkTimer:0, hintTimer:0, speech:null };

  const root = document.createElement('section');
  root.className = 'rae-root';
  root.dataset.state = 'idle';
  root.dataset.open = 'false';
  root.dataset.hint = 'false';
  root.setAttribute('aria-label', 'Rae, BRAYROAI studio guide');
  root.innerHTML = `
    <div class="rae-panel" role="dialog" aria-modal="false" aria-labelledby="rae-title" aria-hidden="true">
      <header class="rae-head">
        <div class="rae-head-mini" aria-hidden="true">R</div>
        <div class="rae-head-copy"><strong id="rae-title">Rae / Studio guide</strong><span data-rae-status>Here when you need me</span></div>
        <button class="rae-close" type="button" data-rae-close aria-label="Close Rae">×</button>
      </header>
      <div class="rae-log" data-rae-log role="log" aria-live="polite" aria-relevant="additions"></div>
      <div class="rae-compose-wrap">
        <div class="rae-suggestions" data-rae-suggestions aria-label="Suggested questions"></div>
        <form class="rae-compose" data-rae-form>
          <button class="rae-mic" type="button" data-rae-mic aria-label="Talk to Rae" aria-pressed="false">
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 10.5a6.5 6.5 0 0 0 13 0M12 17v4M9 21h6"/></svg>
          </button>
          <textarea class="rae-input" data-rae-input rows="1" maxlength="1800" placeholder="Ask Rae about the studio, plans, AI or your project…" aria-label="Message Rae"></textarea>
          <button class="rae-send" type="submit" aria-label="Send message">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 12 15-7-4.5 14-3-5.5L4 12Z"/><path d="m11.5 13.5 7.5-8.5"/></svg>
          </button>
        </form>
        <div class="rae-note">Rae can be wrong. Prices and scope follow the current BRAYROAI site/terms. Voice only starts when you press the mic.</div>
      </div>
    </div>

    <button class="rae-launcher" type="button" data-rae-launch aria-label="Open Rae, BRAYROAI studio guide" aria-expanded="false">
      <span class="rae-character" aria-hidden="true">
        <svg viewBox="0 0 96 96" role="img">
          <ellipse class="rae-shadow" cx="48" cy="88" rx="23" ry="4"/>
          <path class="rae-halo" d="M17 50c1-21 14-35 31-37 18-2 32 10 34 28"/>
          <path d="M80 47c0 18-13 33-30 36" fill="none" stroke="rgba(255,107,44,.5)" stroke-width="1.4" stroke-linecap="round"/>
          <circle class="rae-signal" cx="18" cy="48" r="2.6"/>
          <circle class="rae-accent" cx="79" cy="45" r="2"/>
          <path class="rae-shell-shape" d="M30 25c7-13 24-17 35-8 11 9 13 27 8 43-5 15-17 24-31 21-13-3-22-14-21-29 1-11 3-20 9-27Z"/>
          <path class="rae-face" d="M31 35c4-8 13-12 23-11 10 1 17 8 18 18 1 12-6 23-17 27-10 4-21 1-27-8-6-8-5-18 3-26Z"/>
          <path class="rae-eye" d="M34 44c2-4 6-5 9-2 2 2 2 7-1 9-4 3-10-2-8-7Z"/><path class="rae-eye" d="M55 41c4-2 8 0 9 4 1 3-2 7-5 7-5 0-7-8-4-11Z"/>
          <circle class="rae-pupil" cx="39.5" cy="45.5" r="1.35"/><circle class="rae-pupil" cx="59.2" cy="46" r="1.35"/>
          <ellipse class="rae-cheek" cx="31.5" cy="55" rx="3.4" ry="1.8"/>
          <path class="rae-mouth" d="M41 57c4 3 9 3 13-1"/>
          <path class="rae-arm rae-arm--left" d="M29 55c-6 0-10 5-11 11"/>
          <circle class="rae-face" cx="17.5" cy="68" r="3"/>
          <path class="rae-arm rae-arm--right" d="M69 55c6-1 10-5 12-11"/>
          <path d="M78 39c3-2 5-1 6 1" fill="none" stroke="#f3f0ea" stroke-width="2.7" stroke-linecap="round"/>
          <path class="rae-accent" d="M42 72c5 2 10 2 15-1l-3 8c-5 2-10 2-15 0l3-7Z"/>
          <path class="rae-signal" d="M45 14c0-4 2-7 5-9 1 4 0 7-2 10Z"/>
          <path class="rae-accent" d="M54 15c1-5 5-8 9-8-1 4-4 7-8 9Z"/>
          <path d="M28 31c-5 2-8 6-9 10" fill="none" stroke="#3e7bff" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>
          <path d="M66 28c4 2 7 5 8 9" fill="none" stroke="#ff6b2c" stroke-width="2.4" stroke-linecap="round" opacity=".72"/>
        </svg>
      </span>
    </button>
    <div class="rae-label">Rae / ask the studio</div>`;
  document.body.append(root);

  const launcher = root.querySelector('[data-rae-launch]');
  const panel = root.querySelector('.rae-panel');
  const closeButton = root.querySelector('[data-rae-close]');
  const form = root.querySelector('[data-rae-form]');
  const input = root.querySelector('[data-rae-input]');
  const log = root.querySelector('[data-rae-log]');
  const status = root.querySelector('[data-rae-status]');
  const suggestions = root.querySelector('[data-rae-suggestions]');
  const mic = root.querySelector('[data-rae-mic]');

  const suggestionItems = [
    'Which plan fits me?',
    'Show me your client work',
    'What can you automate with AI?',
    'I want to start a project',
  ];

  function setState(next, label) {
    root.dataset.state = next;
    if (label) status.textContent = label;
    else {
      const labels = { idle:'Here when you need me', listening:'Listening…', thinking:'Thinking through it…', speaking:'Speaking…', happy:'That helps.', confused:'Let me clarify that.', error:'Connection hiccup.' };
      status.textContent = labels[next] || labels.idle;
    }
  }

  function setOpen(open) {
    state.open = open;
    root.dataset.open = String(open);
    panel.setAttribute('aria-hidden', String(!open));
    launcher.setAttribute('aria-expanded', String(open));
    launcher.setAttribute('aria-label', open ? 'Close Rae' : 'Open Rae, BRAYROAI studio guide');
    if (open) {
      root.dataset.hint = 'false';
      window.setTimeout(() => input.focus({ preventScroll:true }), reduced ? 0 : 220);
      if (!log.children.length) welcome();
    }
  }

  function messageNode(role, text, extraClass = '') {
    const node = document.createElement('div');
    node.className = `rae-message rae-message--${role}${extraClass ? ` ${extraClass}` : ''}`;
    node.textContent = text;
    return node;
  }

  function addMessage(role, text) {
    const clean = String(text || '').trim();
    if (!clean) return null;
    const node = messageNode(role, clean);
    log.append(node);
    log.scrollTop = log.scrollHeight;
    return node;
  }

  function addActions(actions = []) {
    if (!actions.length) return;
    const wrap = document.createElement('div');
    wrap.className = 'rae-actions';
    actions.slice(0, 2).forEach((action) => {
      const a = document.createElement('a');
      a.className = 'rae-action';
      a.href = action.href;
      a.textContent = `${action.label} ↗`;
      if (action.kind === 'external') { a.target = '_blank'; a.rel = 'noreferrer'; }
      wrap.append(a);
    });
    log.append(wrap);
    log.scrollTop = log.scrollHeight;
  }

  function showThinking() {
    const node = document.createElement('div');
    node.className = 'rae-message rae-message--assistant rae-message--thinking';
    node.innerHTML = '<span class="rae-thinking-dots" aria-label="Rae is thinking"><i></i><i></i><i></i></span>';
    log.append(node);
    log.scrollTop = log.scrollHeight;
    return node;
  }

  function localFallback(message) {
    const q = message.toLowerCase();
    if (/price|pricing|plan|cost|budget/.test(q)) return { reply:'I can still point you in the right direction: the current website and AI offers are on the Plans page. For exact scope, use the live plan details rather than a remembered quote.', actions:[{label:'View plans',href:'/plans',kind:'navigate'}] };
    if (/work|client|case|portfolio|fakhri/.test(q)) return { reply:'The verified client archive is the safest place to judge the work. FakhriMart is the current full public case study.', actions:[{label:'See client work',href:'/clients',kind:'navigate'}] };
    if (/audit|workflow/.test(q)) return { reply:'The AI Workflow Audit is the smaller first step when the AI use case is still fuzzy. It starts from one real workflow instead of from a tool.', actions:[{label:'Explore the Audit',href:'/ai-workflow-audit',kind:'navigate'}] };
    if (/second brain|knowledge|documents/.test(q)) return { reply:'The Company Second Brain is for approved company knowledge that people repeatedly need to find and use. The public page has the current base scope and boundaries.', actions:[{label:'Explore Second Brain',href:'/company-second-brain',kind:'navigate'}] };
    if (/contact|start|hire|project|quote/.test(q)) return { reply:'The fastest next step is WhatsApp with a short note about what you are trying to build. You do not need a perfect brief.', actions:[{label:'Start on WhatsApp',href:'https://wa.me/919175524637?text=Hi%20Yash%2C%20I%20was%20speaking%20with%20Rae%20and%20would%20like%20to%20discuss%20a%20project%20with%20BRAYROAI.',kind:'external'}] };
    return { reply:'My AI connection is unavailable right now, but I can still guide you around the studio. Try asking about plans, client work, the AI Workflow Audit, the Company Second Brain, or starting a project.', actions:[{label:'Explore capabilities',href:'/#services',kind:'navigate'}] };
  }

  function pageContext() {
    return { path: location.pathname, title: document.title, section: state.section || activeSectionLabel() };
  }

  function activeSectionLabel() {
    const candidate = document.elementFromPoint(innerWidth * .5, Math.min(innerHeight * .42, 360))?.closest?.('section,[data-scene],[data-plan-scene],[data-founder-scene]');
    return candidate?.id || candidate?.dataset?.scene || candidate?.dataset?.planScene || candidate?.dataset?.founderScene || '';
  }

  async function send(text) {
    const message = String(text || input.value || '').trim();
    if (!message || state.busy) return;
    state.busy = true;
    input.value = '';
    resizeInput();
    addMessage('user', message);
    state.history.push({ role:'user', content:message });
    state.history = state.history.slice(-12);
    setState('thinking');
    const thinking = showThinking();

    let data;
    try {
      const response = await fetch('/api/rae-chat', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body:JSON.stringify({ message, history:state.history.slice(0, -1), page:pageContext() }),
      });
      data = await response.json().catch(() => ({}));
      if (!response.ok || !data.reply) throw new Error(data.error || 'Rae request failed');
    } catch (error) {
      data = localFallback(message);
      data.__fallback = true;
    } finally {
      thinking.remove();
    }

    const reply = String(data.reply || '').trim();
    addMessage('assistant', reply);
    addActions(Array.isArray(data.actions) ? data.actions : []);
    state.history.push({ role:'assistant', content:reply });
    state.history = state.history.slice(-12);
    state.busy = false;

    if (data.__fallback) setState('error', 'AI offline / site guide active');
    else if (/great|good fit|yes|recommend|best fit|makes sense/i.test(reply)) setState('happy');
    else if (/\?$/.test(reply) || /could you|which one|what kind|tell me a little/i.test(reply)) setState('confused');
    else setState('idle');

    if (state.voice && canSpeak && !data.__fallback) speak(reply);
    else window.setTimeout(() => { if (!state.busy && root.dataset.state !== 'speaking') setState('idle'); }, 850);
  }

  function speak(text) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/\s+/g, ' ').slice(0, 1000));
    utterance.rate = 1.04;
    utterance.pitch = 1.03;
    utterance.volume = 0.9;
    utterance.onstart = () => setState('speaking');
    utterance.onend = utterance.onerror = () => { if (!state.busy) setState('idle'); };
    window.speechSynthesis.speak(utterance);
  }

  function welcome() {
    addMessage('assistant', 'Hey — I’m Rae. I can help you compare plans, understand what BRAYROAI actually builds, explore the verified work, or figure out the smallest sensible next step for your project.');
    renderSuggestions();
  }

  function renderSuggestions() {
    suggestions.replaceChildren();
    suggestionItems.forEach((label) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'rae-chip';
      button.textContent = label;
      button.addEventListener('click', () => send(label));
      suggestions.append(button);
    });
  }

  function resizeInput() {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 112)}px`;
  }

  function setupVoice() {
    if (!SpeechRecognition) { mic.hidden = true; return; }
    const recognition = new SpeechRecognition();
    recognition.lang = document.documentElement.lang || 'en-IN';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;
    state.speech = recognition;
    let finalText = '';
    recognition.onstart = () => { state.voice = true; mic.setAttribute('aria-pressed','true'); setState('listening'); };
    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0]?.transcript || '';
        if (event.results[i].isFinal) finalText += transcript;
        else interim += transcript;
      }
      input.value = finalText || interim;
      resizeInput();
    };
    recognition.onerror = () => { mic.setAttribute('aria-pressed','false'); setState('error','Voice input unavailable'); window.setTimeout(() => setState('idle'),1200); };
    recognition.onend = () => {
      mic.setAttribute('aria-pressed','false');
      const spoken = String(finalText || input.value || '').trim();
      finalText = '';
      if (spoken) send(spoken); else setState('idle');
    };
    mic.addEventListener('click', () => {
      try {
        if (mic.getAttribute('aria-pressed') === 'true') recognition.stop();
        else { window.speechSynthesis?.cancel?.(); recognition.start(); }
      } catch { setState('error','Voice input unavailable'); }
    });
  }

  function setupBlink() {
    if (reduced) return;
    const blink = () => {
      root.dataset.blink = 'true';
      setTimeout(() => { root.dataset.blink = 'false'; }, 115);
      state.blinkTimer = window.setTimeout(blink, 2600 + Math.random() * 4200);
    };
    state.blinkTimer = window.setTimeout(blink, 1900 + Math.random() * 2400);
  }

  function setupGaze() {
    if (!fine || reduced) return;
    addEventListener('pointermove', (event) => {
      const rect = launcher.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = Math.max(-2.4, Math.min(2.4, (event.clientX - cx) / 90));
      const dy = Math.max(-1.8, Math.min(1.8, (event.clientY - cy) / 110));
      root.style.setProperty('--rae-look-x', dx.toFixed(2));
      root.style.setProperty('--rae-look-y', dy.toFixed(2));
      root.style.setProperty('--rae-tilt', `${Math.max(-2.2, Math.min(2.2, dx * .45)).toFixed(2)}deg`);
    }, { passive:true });
  }

  function setupSectionAwareness() {
    if (!('IntersectionObserver' in window)) return;
    const sections = [...document.querySelectorAll('main section[id],main [data-scene],main [data-plan-scene],main [data-founder-scene]')];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const node = visible.target;
      state.section = node.id || node.dataset.scene || node.dataset.planScene || node.dataset.founderScene || '';
    }, { threshold:[.18,.35,.55], rootMargin:'-16% 0px -45% 0px' });
    sections.forEach((section) => observer.observe(section));
  }

  launcher.addEventListener('click', () => setOpen(!state.open));
  closeButton.addEventListener('click', () => setOpen(false));
  form.addEventListener('submit', (event) => { event.preventDefault(); send(); });
  input.addEventListener('input', resizeInput);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(); }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && state.open) setOpen(false);
  });

  renderSuggestions();
  setupVoice();
  setupBlink();
  setupGaze();
  setupSectionAwareness();

  state.hintTimer = window.setTimeout(() => {
    if (!state.open && document.visibilityState === 'visible') {
      root.dataset.hint = 'true';
      window.setTimeout(() => { root.dataset.hint = 'false'; }, 3600);
    }
  }, 6500);

  addEventListener('pagehide', () => {
    clearTimeout(state.blinkTimer);
    clearTimeout(state.hintTimer);
    state.speech?.abort?.();
    window.speechSynthesis?.cancel?.();
  }, { once:true });
})();
