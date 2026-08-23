(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const root = document.documentElement;
  const body = document.body;
  body.classList.add('motion-polished');

  const overlays = [...document.querySelectorAll('.opening-sequence,.scope-open,.founder-open')];
  const overlayConfig = (overlay) => {
    if (overlay.classList.contains('opening-sequence')) return {
      meta: ['BRAYROAI / CREATIVE TECHNOLOGY', 'PUNE / 2026'],
      beats: ['SIGNAL', 'DIRECTION', 'SYSTEM', 'LAUNCH'],
      duration: innerWidth <= 700 ? 3320 : 4240
    };
    if (overlay.classList.contains('scope-open')) return {
      meta: ['BRAYROAI / WEBSITE BUILDS', 'SCOPE / 01'],
      beats: ['BRIEF', 'SCOPE', 'BUILD', 'LAUNCH'],
      duration: 3240
    };
    return {
      meta: ['BRAYROAI / FOUNDER', 'STORY / 01'],
      beats: ['IDEA', 'CRAFT', 'METHOD', 'FORM'],
      duration: 3240
    };
  };

  const enrichOpening = (overlay) => {
    const config = overlayConfig(overlay);
    if (!overlay.querySelector('.polish-open__meta')) {
      const meta = document.createElement('div');
      meta.className = 'polish-open__meta';
      meta.innerHTML = `<span>${config.meta[0]}</span><span>${config.meta[1]}</span>`;
      overlay.append(meta);

      const beats = document.createElement('div');
      beats.className = 'polish-open__beats';
      beats.innerHTML = config.beats.map((beat, index) => `<span style="--beat-delay:${(.42 + index * .52).toFixed(2)}s">0${index + 1} / ${beat}</span>`).join('');
      overlay.append(beats);

      const progress = document.createElement('div');
      progress.className = 'polish-open__progress';
      progress.innerHTML = '<i></i>';
      overlay.append(progress);
    }
    return config.duration;
  };

  if (reduced) {
    overlays.forEach((overlay) => overlay.remove());
  } else if (overlays.length) {
    body.classList.add('polish-opening');
    const duration = Math.max(...overlays.map(enrichOpening));
    const finish = () => body.classList.remove('polish-opening');
    setTimeout(finish, duration);
    addEventListener('pageshow', (event) => { if (event.persisted) finish(); }, { once: true });
  }

  const scenes = [...document.querySelectorAll('[data-scene],[data-plan-scene],[data-founder-scene]')];
  scenes.forEach((scene, index) => scene.style.setProperty('--polish-index', String(index)));

  if ('IntersectionObserver' in window) {
    const sceneObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-scene-live', entry.isIntersecting);
      });
    }, { rootMargin: '-18% 0px -18% 0px', threshold: [0, .08, .3, .7] });
    scenes.forEach((scene) => sceneObserver.observe(scene));
  } else {
    scenes.forEach((scene) => scene.classList.add('is-scene-live'));
  }

  const reveals = [...document.querySelectorAll('[data-reveal]')];
  const buckets = new Map();
  reveals.forEach((item) => {
    const parent = item.closest('[data-scene],[data-plan-scene],[data-founder-scene]') || item.parentElement;
    if (!buckets.has(parent)) buckets.set(parent, []);
    buckets.get(parent).push(item);
  });
  buckets.forEach((items) => items.forEach((item, index) => item.style.setProperty('--reveal-delay', `${Math.min(index * 72, 216)}ms`)));

  const navSets = [
    { nav: document.querySelector('.site-nav nav'), scenes: '[data-scene]' },
    { nav: document.querySelector('.plans-nav nav'), scenes: '[data-plan-scene]' },
    { nav: document.querySelector('.founder-nav nav'), scenes: '[data-founder-scene]' }
  ].filter((set) => set.nav);

  const markNav = (scene) => {
    navSets.forEach(({ nav }) => {
      const links = [...nav.querySelectorAll('a[href^="#"]')];
      links.forEach((link) => {
        const href = link.getAttribute('href');
        const match = href && href.length > 1 && scene.id && href === `#${scene.id}`;
        link.classList.toggle('is-current', Boolean(match));
      });
    });
  };

  if ('IntersectionObserver' in window && scenes.length) {
    let currentScene = null;
    const activeObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (!visible.length) return;
      const next = visible[0].target;
      if (next !== currentScene) {
        currentScene = next;
        markNav(next);
      }
    }, { rootMargin: '-38% 0px -42% 0px', threshold: [0, .01, .2, .5] });
    scenes.forEach((scene) => activeObserver.observe(scene));
  }

  let lastY = scrollY;
  let scrollTick = 0;
  const paintScrollState = () => {
    scrollTick = 0;
    const y = scrollY;
    body.classList.toggle('has-scrolled', y > 48);
    body.classList.toggle('scrolling-down', y > lastY + 1 && y > 180);
    body.classList.toggle('scrolling-up', y < lastY - 1);
    lastY = y;
  };
  addEventListener('scroll', () => {
    if (!scrollTick) scrollTick = requestAnimationFrame(paintScrollState);
  }, { passive: true });
  paintScrollState();

  if (fine && !reduced) {
    let px = innerWidth / 2;
    let py = innerHeight / 2;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let pointerFrame = 0;

    const paintPointer = () => {
      pointerFrame = 0;
      currentX += (targetX - currentX) * .12;
      currentY += (targetY - currentY) * .12;
      const x = currentX * 7;
      const y = currentY * 5;
      root.style.setProperty('--polish-x', `${x.toFixed(2)}px`);
      root.style.setProperty('--polish-y', `${y.toFixed(2)}px`);
      root.style.setProperty('--polish-x-neg', `${(-x).toFixed(2)}px`);
      root.style.setProperty('--polish-y-neg', `${(-y).toFixed(2)}px`);
      if (Math.abs(targetX - currentX) > .002 || Math.abs(targetY - currentY) > .002) pointerFrame = requestAnimationFrame(paintPointer);
    };

    addEventListener('pointermove', (event) => {
      px = event.clientX;
      py = event.clientY;
      targetX = (px / innerWidth - .5) * 2;
      targetY = (py / innerHeight - .5) * 2;
      if (!pointerFrame) pointerFrame = requestAnimationFrame(paintPointer);
    }, { passive: true });

    addEventListener('pointerleave', () => {
      targetX = 0;
      targetY = 0;
      if (!pointerFrame) pointerFrame = requestAnimationFrame(paintPointer);
    });
  }

  document.querySelectorAll('.build-ribbon__item,.build-card,.care-grid article,.compare-table>div').forEach((element, index) => {
    element.style.setProperty('--polish-item', String(index));
  });
})();
