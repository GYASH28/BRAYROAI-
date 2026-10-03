// The atmosphere owns its movement; pointer updates do not inherit through
// the headline, canvas, links and every other descendant of the hero stage.
export function initHeroLight(stage) {
  const atmosphere = stage.querySelector('.hero-atmosphere');
  if (!atmosphere) return () => {};
  const preference = matchMedia('(prefers-reduced-motion:reduce)');
  let enabled = !preference.matches;
  let bounds = null;
  let pointer = null;
  let frame = 0;
  let lastTransform = '';
  const apply = transform => {
    if (transform === lastTransform) return;
    atmosphere.style.transform = transform;
    lastTransform = transform;
  };
  const reset = () => {
    pointer = null;
    cancelAnimationFrame(frame);
    frame = 0;
    apply('translate3d(0px,0px,0)');
  };
  const invalidate = () => { bounds = null; };
  const paint = () => {
    frame = 0;
    if (!enabled || !pointer || document.hidden) return;
    bounds ||= stage.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const x = (Math.max(0, Math.min(1, (pointer.x - bounds.left) / bounds.width)) - .5) * 36;
    const y = (Math.max(0, Math.min(1, (pointer.y - bounds.top) / bounds.height)) - .5) * 24;
    apply(`translate3d(${x}px,${y}px,0)`);
  };
  const move = event => {
    if (!enabled || document.hidden) return;
    pointer = {x:event.clientX,y:event.clientY};
    if (!frame) frame = requestAnimationFrame(paint);
  };
  const preferenceChanged = () => { enabled = !preference.matches; reset(); };
  const visibilityChanged = () => { invalidate(); if (document.hidden) reset(); };
  const resize = new ResizeObserver(invalidate);
  resize.observe(stage);
  stage.addEventListener('pointermove', move, {passive:true});
  stage.addEventListener('pointerleave', reset);
  window.addEventListener('scroll', invalidate, {passive:true});
  document.addEventListener('visibilitychange', visibilityChanged);
  preference.addEventListener('change', preferenceChanged);
  const pagehide = event => { reset(); invalidate(); if (!event.persisted) dispose(); };
  window.addEventListener('pagehide', pagehide);
  function dispose() {
    enabled = false;
    reset();
    resize.disconnect();
    stage.removeEventListener('pointermove', move);
    stage.removeEventListener('pointerleave', reset);
    window.removeEventListener('scroll', invalidate);
    window.removeEventListener('pagehide', pagehide);
    document.removeEventListener('visibilitychange', visibilityChanged);
    preference.removeEventListener('change', preferenceChanged);
  }
  return dispose;
}
