(() => {
  if (window.__BRAYROAI_REFINEMENT__) return;
  window.__BRAYROAI_REFINEMENT__ = true;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const q = (selector, root = document) => root.querySelector(selector);
  const qa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const clamp = (min, value, max) => Math.min(max, Math.max(min, value));
  const onHome = location.pathname === '/' || location.pathname.endsWith('/index.html');

  let attempts = 0;
  const boot = () => {
    /* Commercial content is authored synchronously by commercial.js. Wait for it rather
       than racing dynamic script downloads on slower connections. */
    if (onHome && !q('#plans-snapshot') && attempts++ < 60) {
      setTimeout(boot, 50);
      return;
    }

    document.body.classList.add('refinement-ready');

    if (!onHome) return;

    const sections = [
      '#plans-snapshot', '#intro', '#work', '#client-proof', '#clients',
      '#lab', '#process', '#about', '#engage'
    ].map(selector => q(selector)).filter(Boolean);

    const processRows = qa('.process-row');
    const capabilityScroller = q('.capability-steps');
    const capabilitySteps = qa('[data-cap-step]');

    if (capabilityScroller) {
      capabilityScroller.setAttribute('aria-label', 'Capabilities. Swipe horizontally on smaller screens to explore four disciplines.');
      capabilityScroller.setAttribute('tabindex', '0');
    }

    const syncCapabilityA11y = () => {
      capabilitySteps.forEach(step => {
        if (step.classList.contains('is-active')) step.setAttribute('aria-current', 'step');
        else step.removeAttribute('aria-current');
      });
    };
    if (capabilitySteps.length) {
      const observer = new MutationObserver(syncCapabilityA11y);
      capabilitySteps.forEach(step => observer.observe(step, { attributes: true, attributeFilter: ['class'] }));
      syncCapabilityA11y();
    }

    let raf = 0;
    const paint = () => {
      raf = 0;
      if (reduced) {
        sections.forEach(section => {
          section.style.setProperty('--ref-enter', '1');
          section.style.setProperty('--ref-center', '0');
        });
        processRows.forEach(row => {
          row.style.setProperty('--row-focus', '1');
          row.removeAttribute('aria-current');
        });
        return;
      }

      const vh = innerHeight || 1;
      const focusY = vh * .53;

      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.bottom < -vh * .35 || rect.top > vh * 1.35) return;

        /* Entry completes before the section midpoint reaches the focal line. This gives
           the content a settled reading state instead of keeping it in motion forever. */
        const enter = clamp(0, (vh * .92 - rect.top) / Math.max(vh * .62, 1), 1);
        const center = clamp(-1, (focusY - (rect.top + rect.height / 2)) / Math.max(vh * .72, 1), 1);
        section.style.setProperty('--ref-enter', enter.toFixed(4));
        section.style.setProperty('--ref-center', center.toFixed(4));
      });

      let currentRow = null;
      let currentFocus = -1;
      processRows.forEach(row => {
        const rect = row.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const closeness = clamp(0, 1 - Math.abs(center - focusY) / Math.max(vh * .46, 1), 1);
        row.style.setProperty('--row-focus', closeness.toFixed(4));
        if (rect.bottom > 0 && rect.top < vh && closeness > currentFocus) {
          currentFocus = closeness;
          currentRow = row;
        }
      });
      processRows.forEach(row => {
        if (row === currentRow) row.setAttribute('aria-current', 'step');
        else row.removeAttribute('aria-current');
      });
    };

    const schedule = () => { if (!raf) raf = requestAnimationFrame(paint); };
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule, { passive: true });
    capabilityScroller?.addEventListener('scroll', schedule, { passive: true });
    schedule();
  };

  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
