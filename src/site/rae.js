import { currentMarket } from './market.js';
import { marketRoute } from '../../data/markets.js';
import { characterMarkup } from './rae-character.js';
import './rae-polish.css';

const planAnchors = {
  'launch-website': 'launch-website',
  'business-experience': 'business-experience',
  'premium-experience': 'premium-experience',
  'monthly-starter': 'monthly-starter',
  'monthly-growth': 'monthly-growth',
  'monthly-studio': 'monthly-studio',
  'ai-workflow-audit': 'ai-audit',
  'company-second-brain': 'second-brain',
};

const safeRoute = (action) => {
  if (!action || typeof action !== 'object') return null;
  if (action.name === 'showPlan' && Object.hasOwn(planAnchors, action.args?.planId)) {
    if (action.args.planId === 'ai-workflow-audit') return '/ai-workflow-audit';
    if (action.args.planId === 'company-second-brain') return '/company-second-brain';
    return `/plans#${planAnchors[action.args.planId]}`;
  }
  if (action.name === 'openProject' && action.args?.name === 'fakhrimart') return '/clients/fakhrimart';
  if (
    action.name === 'scrollToSection'
    && ['work', 'approach', 'method', 'studio', 'starting-points', 'contact'].includes(action.args?.section)
  ) {
    return `/#${action.args.section === 'approach' ? 'method' : action.args.section}`;
  }
  if (
    action.name === 'navigateToRoute'
    && [
      '/', '/#work', '/#approach', '/#method', '/#studio', '/#contact', '/plans',
      '/plans#ai-audit', '/plans#second-brain', '/clients', '/clients/fakhrimart',
      '/founder', '/ai-workflow-audit', '/company-second-brain', '/terms',
    ].includes(action.args?.route)
  ) {
    return action.args.route === '/#approach' ? '/#method' : action.args.route;
  }
  return null;
};

export function initRae() {
  const dialog = document.querySelector('#rae-dialog');
  if (!dialog || dialog.dataset.raeInitialized) return;
  dialog.dataset.raeInitialized = 'true';

  const form = dialog.querySelector('.rae-form');
  const input = dialog.querySelector('#rae-input');
  const log = dialog.querySelector('.rae-messages');
  const scroller = dialog.querySelector('.rae-thread') || log;
  const status = dialog.querySelector('.rae-status');
  const actor = dialog.querySelector('[data-rae-actor]');
  const sendButton = form.querySelector('button[type="submit"]');
  const stopButton = dialog.querySelector('[data-rae-stop]');
  const launcher = document.querySelector('.rae-launcher');
  const draftKey = 'brayro_rae_draft';

  let history = [];
  let activeRequest = null;
  let requestVersion = 0;
  let openingTimer = 0;

  // Only the bundled static SVG is parsed. All conversation text and action
  // labels are assigned with textContent.
  const characterNode = (variant) => {
    const range = document.createRange();
    range.selectNode(document.body);
    return range.createContextualFragment(characterMarkup(variant));
  };
  actor.replaceChildren(characterNode('stage'));
  if (!document.querySelector('link[data-rae-emotions]')) {
    const skin = document.createElement('link');
    skin.rel = 'stylesheet';
    skin.href = '/rae/rae-character-emotions.css';
    skin.dataset.raeEmotions = '';
    document.head.append(skin);
  }
  const character = actor.querySelector('[data-rae-character]');
  if (launcher) launcher.replaceChildren(characterNode('launcher'));

  const setCharacter = (next) => {
    dialog.dataset.raeState = next;
    character?.setAttribute('data-state', next);
    launcher?.querySelector('[data-rae-character]')?.setAttribute('data-state', next);
  };
  const state = (text) => {
    status.textContent = text;
    dialog.classList.toggle('rae-has-status', Boolean(text));
  };
  const saveDraft = () => {
    try {
      if (input.value) sessionStorage.setItem(draftKey, input.value);
      else sessionStorage.removeItem(draftKey);
    } catch {}
  };
  const setBusy = (busy) => {
    sendButton.disabled = busy;
    if (stopButton) stopButton.hidden = !busy;
    log.setAttribute('aria-busy', String(busy));
    dialog.classList.toggle('rae-is-busy', busy);
  };
  const followsLatest = () => scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < 80;
  const scrollLatest = () => { scroller.scrollTop = scroller.scrollHeight; };
  const message = (role, text) => {
    const node = document.createElement('div');
    node.className = `rae-message ${role}`;
    node.setAttribute('role', 'group');
    node.setAttribute('aria-label', role === 'assistant' ? 'Rae' : 'You');
    node.textContent=text;
    log.append(node);
    scrollLatest();
    return node;
  };
  const renderMeta = (node, metadata) => {
    const actions = metadata.flatMap(meta => [meta?.card?.action, ...(Array.isArray(meta?.actions) ? meta.actions : [])]);
    const links = new Map();
    for (const action of actions) {
      const route = safeRoute(action);
      if (route && !links.has(route)) links.set(route, action);
    }
    if (!links.size) return;
    const group = document.createElement('div');
    group.className = 'rae-actions';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Related pages');
    for (const [route, action] of [...links].slice(0, 4)) {
      const link = document.createElement('a');
      const [pathname, hash = ''] = route.split('#');
      link.href = marketRoute(currentMarket(), pathname, hash ? `#${hash}` : '');
      link.textContent = String(action.label || 'View on the site').slice(0, 80);
      group.append(link);
    }
    node.after(group);
  };
  const ownsRequest = (request) => activeRequest === request && request.version === requestVersion;
  const cancelActive = ({ restoreDraft = false } = {}) => {
    const request = activeRequest;
    requestVersion += 1;
    activeRequest = null;
    request?.controller.abort();
    if (request) {
      request.answer.remove();
      request.user.remove();
      if (restoreDraft && !input.value.trim()) input.value = request.question;
      saveDraft();
    }
    setBusy(false);
    dialog.classList.toggle('rae-has-conversation', Boolean(log.children.length));
  };
  const resetConversation = () => {
    clearTimeout(openingTimer);
    cancelActive();
    history = [];
    log.replaceChildren();
    dialog.classList.remove('rae-has-conversation');
    state('');
    input.value = '';
    saveDraft();
    input.focus();
    setCharacter('listening');
  };

  try { input.value = (sessionStorage.getItem(draftKey) || '').slice(0, 1200); } catch {}
  input.addEventListener('input', saveDraft);
  input.addEventListener('focus', () => { if (!activeRequest) setCharacter('listening'); });
  input.addEventListener('blur', () => { if (!activeRequest) setCharacter('idle'); });
  input.addEventListener('keydown', (event) => {
    if (!event.isComposing && event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  dialog.querySelectorAll('[data-rae-prompt]').forEach((button) => {
    button.addEventListener('click', () => {
      if (activeRequest) return;
      input.value = button.dataset.raePrompt;
      saveDraft();
      form.requestSubmit();
    });
  });

  // visualViewport also covers keyboard height on browsers whose layout
  // viewport stays full-sized while the on-screen keyboard is visible.
  const syncViewport = () => {
    const viewport = window.visualViewport;
    dialog.style.setProperty('--rae-viewport-height', `${viewport?.height || window.innerHeight}px`);
    dialog.style.setProperty('--rae-viewport-top', `${viewport?.offsetTop || 0}px`);
    dialog.classList.toggle('rae-compact-viewport', (viewport?.height || window.innerHeight) < 520);
  };
  window.visualViewport?.addEventListener('resize', syncViewport, { passive: true });
  window.visualViewport?.addEventListener('scroll', syncViewport, { passive: true });
  window.addEventListener('resize', syncViewport, { passive: true });
  syncViewport();
  const opened = () => {
    syncViewport();
    clearTimeout(openingTimer);
    input.focus({ preventScroll: true });
    if (activeRequest) return;
    setCharacter('opening');
    openingTimer = window.setTimeout(() => {
      if (dialog.open && !activeRequest) setCharacter('listening');
    }, 620);
  };
  // Observing native open also catches the first lazy-loaded opener in app.js.
  new MutationObserver(() => { if (dialog.open) opened(); }).observe(dialog, { attributes: true, attributeFilter: ['open'] });
  document.querySelectorAll('[data-rae-open]').forEach((button) => {
    button.addEventListener('click', () => { if (!dialog.open) dialog.showModal(); });
  });
  dialog.querySelector('[data-rae-close]').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-rae-reset]')?.addEventListener('click', resetConversation);
  stopButton?.addEventListener('click', () => {
    cancelActive({ restoreDraft: true });
    state('Response stopped. Your draft is ready to edit.');
    input.focus();
    setCharacter('listening');
  });
  dialog.addEventListener('close', () => {
    if (dialog.open) return;
    clearTimeout(openingTimer);
    cancelActive({ restoreDraft: true });
    state('');
    setCharacter('idle');
  });
  // A drag from inside the panel to its backdrop should not close the dialog.
  let backdropPress = false;
  dialog.addEventListener('pointerdown', event => { backdropPress = event.target === dialog; });
  dialog.addEventListener('click', event => {
    if (event.target === dialog && backdropPress) dialog.close();
    backdropPress = false;
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (activeRequest) return;
    const question = input.value.trim();
    if (!question) { input.focus(); return; }

    clearTimeout(openingTimer);
    const request = { version: ++requestVersion, controller: new AbortController(), question, metadata: [] };
    activeRequest = request;
    setBusy(true);
    setCharacter('thinking');
    dialog.classList.add('rae-has-conversation');
    request.user = message('user', question);
    input.value = '';
    saveDraft();
    state('Rae is thinking…');
    const answer = message('assistant', '');
    request.answer = answer;
    let completed = false;
    let error = null;
    let reader;

    try {
      const response = await fetch('/api/rae-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: question,
          supportsStreamReset: true,
          history: history.slice(-8),
          context: {
            pathname: location.pathname,
            pageTitle: document.title,
            pageKey: document.body.className.replace('page-', ''),
            market: currentMarket(),
          },
          session: {},
        }),
        signal: request.controller.signal,
      });
      if (!ownsRequest(request)) { response.body?.cancel().catch(() => {}); return; }
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Rae is unavailable right now.');
      }
      if (!response.body) throw new Error('Rae could not start a response.');
      reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let eventName = '';
      let data = [];
      const flush = () => {
        const raw = data.join('\n');
        const name = eventName;
        eventName = '';
        data = [];
        if (!raw || !ownsRequest(request) || completed || error) return;
        let payload;
        try { payload = JSON.parse(raw); } catch { return; }
        if (!payload || typeof payload !== 'object') return;
        const follow = followsLatest();
        eventName = name;
        if (eventName==='delta' && typeof payload.text === 'string') {
          answer.textContent+=payload.text;
          setCharacter('speaking');
        }
        if (eventName === 'meta') request.metadata.push(payload);
        if (eventName === 'reset') {
          answer.textContent = '';
          request.metadata = [];
          setCharacter('thinking');
          state('Rae is trying another connection…');
        }
        if (eventName === 'state') {
          state(payload.recovering ? 'Rae is trying another connection…' : payload.state === 'thinking' ? 'Rae is thinking…' : 'Rae is answering…');
        }
        if (eventName==='error') error = payload.message || 'Rae was interrupted. Please retry.';
        if (eventName==='done') completed = true;
        eventName = '';
        if (follow) scrollLatest();
      };
      const readLine = (line) => {
        if (!line) { flush(); return; }
        if (line.startsWith('event:')) eventName = line.slice(6).trim();
        if (line.startsWith('data:')) data.push(line.slice(5).replace(/^ /, ''));
      };
      while (ownsRequest(request) && !completed && !error) {
        const chunk = await reader.read();
        if (!ownsRequest(request)) return;
        buffer += decoder.decode(chunk.value, { stream: !chunk.done });
        let cut;
        while ((cut = buffer.indexOf('\n')) >= 0) {
          readLine(buffer.slice(0, cut).replace(/\r$/, ''));
          buffer = buffer.slice(cut + 1);
        }
        if (chunk.done) { if (buffer) readLine(buffer.replace(/\r$/, '')); flush(); break; }
      }
      if (!ownsRequest(request)) return;
      if (error || !completed || !answer.textContent.trim()) throw new Error(error || 'Rae’s response stopped early. Please retry.');
      answer.textContent = answer.textContent.replace(/\*\*/g, '').replace(/^\s*[-*]\s+/gm, '• ');
      const follow = followsLatest();
      renderMeta(answer, request.metadata);
      history.push({ role: 'user', text: question }, { role: 'assistant', text: answer.textContent });
      history = history.slice(-8);
      state('');
      const emotion = request.metadata.find(meta => meta?.emotion)?.emotion;
      setCharacter(['positive', 'proud', 'curious', 'surprised', 'playful', 'shy', 'laugh', 'wink'].includes(emotion) ? emotion : 'positive');
      if (follow) scrollLatest();
    } catch (caught) {
      if (!ownsRequest(request)) return;
      answer.textContent = 'Rae could not answer right now.';
      state(caught.message || 'Please retry or contact Yash directly.');
      setCharacter('error');
      if (!input.value.trim()) { input.value = question; saveDraft(); }
    } finally {
      if (reader) reader.cancel().catch(() => {});
      if (ownsRequest(request)) {
        activeRequest = null;
        setBusy(false);
      }
    }
  });
}
