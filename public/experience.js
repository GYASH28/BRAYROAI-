(() => {
  if (window.__BRAYROAI_EXPERIENCE__) return;
  window.__BRAYROAI_EXPERIENCE__ = true;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  const q = (selector, root = document) => root.querySelector(selector);
  const qa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const clamp = (min, value, max) => Math.min(max, Math.max(min, value));

  /* Chapter identifiers turn the page into one continuous studio story. */
  const chapters = qa('.chapter[id]');
  chapters.forEach(section => {
    if (!q('.chapter-signal', section)) {
      const signal = document.createElement('div');
      signal.className = 'chapter-signal';
      signal.setAttribute('aria-hidden', 'true');
      signal.innerHTML = `<b>${section.dataset.chapter || ''}</b><i></i><span>${section.dataset.chapterName || ''}</span>`;
      section.appendChild(signal);
    }

    if (!q('.chapter-wash', section) && section.id !== 'top') {
      const wash = document.createElement('div');
      wash.className = `chapter-wash ${Number(section.dataset.chapter || 0) % 2 ? 'chapter-wash--orange' : 'chapter-wash--blue'}`;
      wash.setAttribute('aria-hidden', 'true');
      section.appendChild(wash);
    }
  });

  /* Hero signal deck: identity detail, not another marketing card. */
  const hero = q('#top');
  if (hero && !q('.hero-signal-deck', hero)) {
    const deck = document.createElement('div');
    deck.className = 'hero-signal-deck';
    deck.setAttribute('aria-hidden', 'true');
    deck.innerHTML = `
      <p>BRAYROAI / SIGNAL SYSTEM</p>
      <div>CRAFT <span>AUTHORED</span></div>
      <div>TECH <span>USEFUL</span></div>
      <div>MOTION <span>PURPOSEFUL</span></div>`;
    hero.appendChild(deck);
  }

  /* Project cards get authored index typography. */
  qa('.project-grid .project-tile').forEach((card, index) => {
    card.dataset.projectIndex = String(index + 2).padStart(2, '0');
  });

  /* Pointer depth is decorative and never required to understand the page. */
  const depthTargets = [
    ...qa('.principle-line h3'),
    ...qa('.project-tile__art'),
    ...qa('.lab-card > div:first-child'),
    ...qa('.engage-card h3'),
    ...qa('.about-portrait img')
  ];
  depthTargets.forEach(target => target.setAttribute('data-depth-hover', ''));

  if (finePointer && !reduced) {
    qa('.interactive-surface').forEach(surface => {
      const update = event => {
        const rect = surface.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const x = clamp(-1, ((event.clientX - rect.left) / rect.width - .5) * 2, 1);
        const y = clamp(-1, ((event.clientY - rect.top) / rect.height - .5) * 2, 1);
        surface.style.setProperty('--pointer-x', x.toFixed(3));
        surface.style.setProperty('--pointer-y', y.toFixed(3));
      };
      surface.addEventListener('pointermove', update, { passive: true });
      surface.addEventListener('pointerleave', () => {
        surface.style.setProperty('--pointer-x', '0');
        surface.style.setProperty('--pointer-y', '0');
      });
    });
  }

  /* Useful studio descriptors fill the founder chapter without inventing KPIs. */
  const aboutPrinciples = q('.about-principles');
  if (aboutPrinciples && !q('.studio-matrix')) {
    const matrix = document.createElement('div');
    matrix.className = 'studio-matrix';
    matrix.setAttribute('aria-label', 'BRAYROAI studio characteristics');
    matrix.innerHTML = `
      <div><b>FOUNDER-LED</b><span>CLOSE TO THE WORK</span></div>
      <div><b>DESIGN ↔ CODE</b><span>ONE BUILD SYSTEM</span></div>
      <div><b>PUNE / REMOTE</b><span>BUILT FOR MODERN TEAMS</span></div>
      <div><b>BUILD → SHIP</b><span>DIRECTION TO PRODUCTION</span></div>`;
    aboutPrinciples.insertAdjacentElement('afterend', matrix);
  }

  /* A practical project-fit rail closes the awkward gap before the two engagement cards. */
  const engage = q('#engage');
  const engageTitle = q('.engage-title', engage || document);
  if (engage && engageTitle && !q('.project-fit-rail', engage)) {
    const rail = document.createElement('div');
    rail.className = 'shell project-fit-rail';
    rail.innerHTML = '<span>GOOD FIT /</span><b>BRAND SITES</b><b>DIGITAL PRODUCTS</b><b>AI SYSTEMS</b><b>EXPERIENCE REBUILDS</b>';
    engageTitle.insertAdjacentElement('afterend', rail);

    const word = document.createElement('div');
    word.className = 'experience-word';
    word.setAttribute('aria-hidden', 'true');
    word.textContent = 'BRAYROAI';
    engage.prepend(word);
  }

  /* Process rail follows the currently focused step from the existing scroll logic. */
  const processList = q('.process-list');
  const processRows = qa('.process-row');
  const syncProcess = () => {
    if (!processList || !processRows.length) return;
    const index = Math.max(0, processRows.findIndex(row => row.classList.contains('is-current')));
    processList.style.setProperty('--process-index', String(index));
  };
  if (processList && processRows.length) {
    const mutation = new MutationObserver(syncProcess);
    processRows.forEach(row => mutation.observe(row, { attributes: true, attributeFilter: ['class'] }));
    syncProcess();
  }

  /* Live embeds have a visible designed fallback underneath while loading. */
  qa('iframe[data-src]').forEach(frame => {
    const parent = frame.parentElement;
    parent?.classList.add('frame-loading');
    frame.addEventListener('load', () => parent?.classList.remove('frame-loading'), { once: true });
  });

  /* Scroll-scrub each chapter with one shared RAF. No scroll hijacking, no permanent loop. */
  let frame = 0;
  let previousY = scrollY;
  const paint = () => {
    frame = 0;
    const viewport = innerHeight || 1;
    const y = scrollY;
    const velocity = clamp(-1, (y - previousY) / 80, 1);
    previousY = y;
    document.documentElement.style.setProperty('--scroll-velocity', velocity.toFixed(3));

    chapters.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.bottom < -viewport * .3 || rect.top > viewport * 1.3) return;
      const travel = rect.height + viewport;
      const progress = reduced ? .5 : clamp(0, (viewport - rect.top) / Math.max(1, travel), 1);
      section.style.setProperty('--chapter-progress', progress.toFixed(4));
    });
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  schedule();

  /* Mark enhancement readiness for QA without delaying real content. */
  document.body.classList.add('experience-ready');
})();
