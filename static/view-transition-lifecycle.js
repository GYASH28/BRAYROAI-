// Incoming document transitions start before deferred module scripts run.
(() => {
  let revealed;
  window.brayroPageRevealed = 'onpagereveal' in window
    ? new Promise(resolve => { revealed = resolve; })
    : Promise.resolve();
  const observeTransition = ({viewTransition}) => {
    if (!viewTransition) return Promise.resolve();
    return viewTransition.ready.catch(error => {
      if (error?.name === 'AbortError' || error?.name === 'TimeoutError') return;
      // Keep actual transition defects visible to normal browser error reporting.
      setTimeout(() => { throw error; });
    });
  };
  window.addEventListener('pageswap', observeTransition);
  window.addEventListener('pagereveal', event => {
    // A rendering callback can run before pagereveal. Preference redirects
    // wait for this actual event and for its observed ready promise to settle.
    observeTransition(event).then(() => revealed?.());
  });
})();
