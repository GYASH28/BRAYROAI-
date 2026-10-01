// Incoming document transitions start before deferred module scripts run.
(() => {
  const observeTransition = ({viewTransition}) => {
    if (!viewTransition) return;
    viewTransition.ready.catch(error => {
      if (error?.name === 'AbortError' || error?.name === 'TimeoutError') return;
      // Keep actual transition defects visible to normal browser error reporting.
      setTimeout(() => { throw error; });
    });
  };
  window.addEventListener('pageswap', observeTransition);
  window.addEventListener('pagereveal', observeTransition);
})();
