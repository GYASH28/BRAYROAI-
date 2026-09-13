(() => {
  'use strict';
  if (document.documentElement.dataset.v22CursorMounted) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const body = document.body;
  const root = document.documentElement;
  const path = location.pathname.replace(/\/$/,'') || '/';
  const clamp = (min,value,max) => Math.min(max,Math.max(min,value));
  const lerp = (a,b,t) => a + (b-a)*t;

  const page = (() => {
    if (path === '/' || path.endsWith('/index.html')) return 'home';
    if (path === '/plans' || path.endsWith('/plans.html')) return 'plans';
    if (path === '/clients') return 'clients';
    if (path === '/clients/fakhrimart' || path.endsWith('/fakhrimart-case-study.html')) return 'case';
    if (path === '/founder' || path.endsWith('/founder.html')) return 'founder';
    if (path === '/terms' || path.endsWith('/terms.html')) return 'terms';
    if (path === '/ai-workflow-audit' || path === '/company-second-brain' || path.endsWith('/ai-workflow-audit.html') || path.endsWith('/company-second-brain.html')) return 'ai';
    return 'default';
  })();

  root.dataset.v22CursorMounted = 'true';
  body.dataset.v22CursorPage = page;
  if (!fine || reduced) return;

  const cursor = document.createElement('div');
  cursor.className = 'v22-cursor';
  cursor.setAttribute('aria-hidden','true');
  cursor.innerHTML = '<span class="v22-cursor__label" data-v22-cursor-label></span><small class="v22-cursor__meta" data-v22-cursor-meta></small>';
  const dot = document.createElement('i');
  dot.className = 'v22-cursor__dot';
  dot.setAttribute('aria-hidden','true');
  const echo = document.createElement('i');
  echo.className = 'v22-cursor__echo';
  echo.setAttribute('aria-hidden','true');
  body.append(cursor,dot,echo);

  const labelNode = cursor.querySelector('[data-v22-cursor-label]');
  const metaNode = cursor.querySelector('[data-v22-cursor-meta]');
  const pageMeta = {home:'BRAYROAI',plans:'PLANS',clients:'CLIENTS',case:'CASE STUDY',founder:'FOUNDER',terms:'READ',ai:'AI SYSTEMS',default:'BRAYROAI'};
  metaNode.textContent = pageMeta[page] || 'BRAYROAI';

  const interactiveSelector = 'a[href],button,summary,[role="button"],[data-cursor-label],[data-v15-control],[data-project-type],[data-colour-toggle]';
  const mediaSelector = '.v12-project-row,.work__canvas,.case-proof,.client-work-card,[data-client-card],[data-case-link]';
  const surfaceSelector = '#work .work__canvas,#ai-systems .v12-product-card,#plans [data-v14-rate],#studio .founder-preview__portrait,.build-card,.ai-plan-card,.terms-card,.terms-quick a,.process-stage,.arch-node,.scope-row,.compare-table,.glass-control,.glass-panel';
  const magnetSelector = '.magnetic,.site-nav__cta,.primary-action,.text-link,.close__action,.v12-product-card__cta';

  let tx = -120, ty = -120, ringX = -120, ringY = -120, dotX = -120, dotY = -120;
  let lastRawTarget = null;
  let activeTarget = null;
  let activeSurface = null;
  let activeMagnet = null;
  let targetRect = null;
  let surfaceRect = null;
  let magnetRect = null;
  let geometryDirty = true;
  let frame = 0;
  let visible = false;

  const schedule = () => { if (!frame) frame = requestAnimationFrame(tick); };
  const safeRect = node => node?.isConnected ? node.getBoundingClientRect() : null;

  const setMode = (mode,label='') => {
    cursor.classList.remove('is-action','is-media','is-control','is-reading');
    if (mode) cursor.classList.add(`is-${mode}`);
    const next = label || '';
    if (labelNode.textContent !== next) {
      labelNode.textContent = next;
      if (next && labelNode.animate) labelNode.animate([
        {opacity:.15,transform:'translate(-50%,-43%) scale(.94)'},
        {opacity:1,transform:'translate(-50%,-50%) scale(1)'}
      ],{duration:220,easing:'cubic-bezier(.16,1,.3,1)'});
    }
  };

  const labelFor = node => {
    if (!node) return '';
    if (node.dataset?.cursorLabel) return node.dataset.cursorLabel;
    if (node.matches?.('[data-v15-control]')) return 'SELECT';
    if (node.matches?.('[data-project-type]')) return 'CHOOSE';
    if (node.matches?.('[data-colour-toggle]')) return 'COLOUR';
    if (node.matches?.('summary')) return 'OPEN';
    const href = node.getAttribute?.('href') || '';
    if (href.startsWith('mailto:')) return 'EMAIL ↗';
    if (href.includes('wa.me/')) return 'CHAT ↗';
    if (href === '/clients/fakhrimart' || href.includes('fakhrimart-case-study')) return 'CASE ↗';
    if (href === '/clients') return 'CLIENTS ↗';
    if (href.startsWith('/plans')) return 'PRICING ↗';
    if (href.startsWith('/founder')) return 'FOUNDER ↗';
    if (href.startsWith('http')) return 'OPEN ↗';
    if (page === 'plans') return 'CHOOSE';
    if (page === 'clients') return 'VIEW';
    if (page === 'case') return 'EXPLORE';
    if (page === 'founder') return 'EXPLORE';
    if (page === 'terms') return 'READ';
    if (page === 'ai') return 'EXPLORE';
    return node.matches?.('button') ? 'SELECT' : 'OPEN';
  };

  const resetMagnet = () => {
    if (!activeMagnet) return;
    activeMagnet.style.removeProperty('--v22-mag-x');
    activeMagnet.style.removeProperty('--v22-mag-y');
    activeMagnet.classList.remove('v22-magnetic');
    activeMagnet = null;
    magnetRect = null;
  };

  const resolveTarget = raw => {
    lastRawTarget = raw;
    const interactive = raw?.closest?.(interactiveSelector) || null;
    const media = raw?.closest?.(mediaSelector) || null;
    const next = interactive || media;
    if (next !== activeTarget) {
      activeTarget = next;
      targetRect = null;
      geometryDirty = true;
      if (media && !interactive) setMode('media', page === 'case' ? 'CASE' : 'VIEW');
      else if (interactive) setMode(interactive.matches('[data-v15-control],[data-project-type],[data-colour-toggle]') ? 'control' : 'action',labelFor(interactive));
      else setMode(page === 'terms' ? 'reading' : '', '');
    }

    const surface = raw?.closest?.(surfaceSelector) || null;
    if (surface !== activeSurface) {
      if (activeSurface) activeSurface.style.setProperty('--v20-spot-o','0');
      activeSurface = surface;
      surfaceRect = null;
      geometryDirty = true;
    }

    const magnet = interactive?.closest?.(magnetSelector) || null;
    if (magnet !== activeMagnet) {
      resetMagnet();
      activeMagnet = magnet;
      if (activeMagnet) {
        activeMagnet.classList.add('v22-magnetic');
        magnetRect = null;
        geometryDirty = true;
      }
    }
  };

  const updateGeometry = () => {
    geometryDirty = false;
    targetRect = activeTarget ? safeRect(activeTarget) : null;
    surfaceRect = activeSurface ? safeRect(activeSurface) : null;
    magnetRect = activeMagnet ? safeRect(activeMagnet) : null;
  };

  const paintReactiveSurface = () => {
    if (!activeSurface || !surfaceRect || !surfaceRect.width || !surfaceRect.height) return;
    const px = clamp(0,(tx-surfaceRect.left)/surfaceRect.width,1);
    const py = clamp(0,(ty-surfaceRect.top)/surfaceRect.height,1);
    activeSurface.style.setProperty('--v20-local-x',`${(px*100).toFixed(2)}%`);
    activeSurface.style.setProperty('--v20-local-y',`${(py*100).toFixed(2)}%`);
    activeSurface.style.setProperty('--v20-spot-o','1');
    activeSurface.style.setProperty('--v16-sx',`${(px*100).toFixed(2)}%`);
    activeSurface.style.setProperty('--v16-sy',`${(py*100).toFixed(2)}%`);
    activeSurface.style.setProperty('--spot-x',`${(px*100).toFixed(2)}%`);
    activeSurface.style.setProperty('--spot-y',`${(py*100).toFixed(2)}%`);
    activeSurface.style.setProperty('--brayro-spot-x',`${(px*100).toFixed(2)}%`);
    activeSurface.style.setProperty('--brayro-spot-y',`${(py*100).toFixed(2)}%`);
  };

  const paintMagnet = () => {
    if (!activeMagnet || !magnetRect || !magnetRect.width || !magnetRect.height) return;
    if (magnetRect.width > 430 || magnetRect.height > 180) return;
    const nx = clamp(-1,(tx-magnetRect.left)/magnetRect.width*2-1,1);
    const ny = clamp(-1,(ty-magnetRect.top)/magnetRect.height*2-1,1);
    activeMagnet.style.setProperty('--v22-mag-x',`${(nx*4.6).toFixed(2)}px`);
    activeMagnet.style.setProperty('--v22-mag-y',`${(ny*3.4).toFixed(2)}px`);
  };

  function tick(){
    frame = 0;
    if (geometryDirty) updateGeometry();
    const ringRate = .34;
    const dotRate = .72;
    ringX = lerp(ringX,tx,ringRate);
    ringY = lerp(ringY,ty,ringRate);
    dotX = lerp(dotX,tx,dotRate);
    dotY = lerp(dotY,ty,dotRate);
    root.style.setProperty('--v22-ring-x',`${ringX.toFixed(2)}px`);
    root.style.setProperty('--v22-ring-y',`${ringY.toFixed(2)}px`);
    root.style.setProperty('--v22-dot-x',`${dotX.toFixed(2)}px`);
    root.style.setProperty('--v22-dot-y',`${dotY.toFixed(2)}px`);
    paintReactiveSurface();
    paintMagnet();
    const delta = Math.abs(tx-ringX)+Math.abs(ty-ringY)+Math.abs(tx-dotX)+Math.abs(ty-dotY);
    if (visible && delta > .35) schedule();
  }

  addEventListener('pointermove', event => {
    tx = event.clientX;
    ty = event.clientY;
    if (event.target !== lastRawTarget) resolveTarget(event.target);
    if (!visible) {
      visible = true;
      cursor.classList.add('is-visible');
      dot.classList.add('is-visible');
    }
    schedule();
  },{passive:true});

  addEventListener('pointerdown', event => {
    if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    cursor.classList.add('is-down');
    echo.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
    echo.getAnimations().forEach(animation=>animation.cancel());
    echo.animate([
      {opacity:.72,transform:`translate3d(${event.clientX}px,${event.clientY}px,0) scale(.45)`},
      {opacity:0,transform:`translate3d(${event.clientX}px,${event.clientY}px,0) scale(2.2)`}
    ],{duration:420,easing:'cubic-bezier(.16,1,.3,1)'});
  },{passive:true});

  addEventListener('pointerup',()=>cursor.classList.remove('is-down'),{passive:true});
  addEventListener('pointercancel',()=>cursor.classList.remove('is-down'),{passive:true});
  addEventListener('pointerleave',()=>{
    visible = false;
    cursor.classList.remove('is-visible','is-down');
    dot.classList.remove('is-visible');
    if (activeSurface) activeSurface.style.setProperty('--v20-spot-o','0');
    resetMagnet();
  },{passive:true});

  const dirty = () => {
    geometryDirty = true;
    if (visible) schedule();
  };
  addEventListener('scroll',dirty,{passive:true});
  addEventListener('resize',dirty,{passive:true});
  document.fonts?.ready?.then(dirty);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){visible=false;cursor.classList.remove('is-visible');dot.classList.remove('is-visible')}});

  body.classList.add('v22-cursor-ready');
})();
