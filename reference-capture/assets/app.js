const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = matchMedia('(pointer: coarse)').matches;
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const clamp = (min, value, max) => Math.min(max, Math.max(min, value));

// Opening sequence: short, non-blocking, and backed by a CSS fail-safe.
const loader = $('[data-loader]');
if (loader) {
  if (reduced) {
    loader.remove();
    document.body.classList.add('hero-ready');
  } else {
    setTimeout(() => {
      loader.classList.add('is-done');
      document.body.classList.add('hero-ready');
    }, 920);
  }
} else {
  document.body.classList.add('hero-ready');
}

// Native anchor navigation keeps the site dependency-free.
$$('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
  const id = link.getAttribute('href');
  if (!id || id === '#') return;
  const target = $(id);
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  history.replaceState(null, '', id);
}));

// Internal route transition fallback.
const transitionLayer = $('[data-page-transition]');
$$('.internal-transition').forEach(link => link.addEventListener('click', event => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank') return;
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#')) return;
  event.preventDefault();
  if (reduced) { location.href = href; return; }
  transitionLayer?.classList.add('is-covering');
  setTimeout(() => { location.href = href; }, 480);
}));

// Defer expensive live embeds until they are close to view.
const lazyFrames = $$('iframe[data-src]');
if ('IntersectionObserver' in window) {
  const frameObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const frame = entry.target;
      if (!frame.src && frame.dataset.src) frame.src = frame.dataset.src;
      frameObserver.unobserve(frame);
    });
  }, { rootMargin: '900px 0px', threshold: 0.01 });
  lazyFrames.forEach(frame => frameObserver.observe(frame));
} else {
  lazyFrames.forEach(frame => { if (frame.dataset.src) frame.src = frame.dataset.src; });
}

// Mobile navigation with focus return and Escape handling.
const menuButton = $('[data-menu-button]');
const mobileMenu = $('[data-mobile-menu]');
let menuWasOpen = false;
function setMenu(open) {
  menuButton?.setAttribute('aria-expanded', String(open));
  mobileMenu?.classList.toggle('open', open);
  mobileMenu?.setAttribute('aria-hidden', String(!open));
  document.body.classList.toggle('menu-open', open);
  if (open) {
    menuWasOpen = true;
    requestAnimationFrame(() => mobileMenu?.querySelector('a')?.focus({ preventScroll: true }));
  } else if (menuWasOpen) {
    menuWasOpen = false;
    menuButton?.focus({ preventScroll: true });
  }
}
menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
$$('[data-mobile-menu] a').forEach(a => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', e => { if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) setMenu(false); });

// Entrance reveals.
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in-view');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
$$('.reveal').forEach(el => reduced ? el.classList.add('in-view') : revealObserver.observe(el));

// Chapter index and page mood.
const chapterNumber = $('[data-chapter-number]');
const chapterName = $('[data-chapter-name]');
const chapterObserver = new IntersectionObserver(entries => {
  const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  const el = visible.target;
  if (chapterNumber) chapterNumber.textContent = el.dataset.chapter || '';
  if (chapterName) chapterName.textContent = el.dataset.chapterName || '';
  document.body.classList.toggle('theme-light', ['paper', 'warm'].includes(el.dataset.themeSection));
}, { threshold: [0.15, 0.35, 0.55, 0.75] });
$$('.chapter').forEach(el => chapterObserver.observe(el));

// Sticky capability storytelling. The nearest step to the focal line wins,
// which avoids observer races when tall steps overlap the same threshold.
const capSteps = $$('[data-cap-step]');
const capPanels = $$('[data-cap-panel]');
const capabilityStory = $('.capability-story');
const capabilityScroller = $('.capability-steps');
let capabilityVisible = false;
function activateCapability(index) {
  capSteps.forEach((step, i) => step.classList.toggle('is-active', i === index));
  capPanels.forEach((panel, i) => panel.classList.toggle('is-active', i === index));
}
const capObserver = new IntersectionObserver(entries => {
  capabilityVisible = entries.some(entry => entry.isIntersecting);
  scheduleMotion();
}, { rootMargin: '15% 0px', threshold: 0 });
if (capabilityStory) capObserver.observe(capabilityStory);
function paintCapability() {
  if (!capabilityStory || !capSteps.length) return;
  const storyRect = capabilityStory.getBoundingClientRect();
  if (storyRect.bottom < -80 || storyRect.top > innerHeight + 80) return;
  let bestIndex = 0;
  let bestDistance = Infinity;
  if (innerWidth <= 1050 && capabilityScroller) {
    const sr = capabilityScroller.getBoundingClientRect();
    const focusX = sr.left + capabilityScroller.clientWidth / 2;
    capSteps.forEach((step, index) => {
      const r = step.getBoundingClientRect();
      const distance = Math.abs((r.left + r.width / 2) - focusX);
      if (distance < bestDistance) { bestDistance = distance; bestIndex = index; }
    });
  } else {
    const focusY = innerHeight * 0.52;
    capSteps.forEach((step, index) => {
      const r = step.getBoundingClientRect();
      const distance = Math.abs((r.top + r.height / 2) - focusY);
      if (distance < bestDistance) { bestDistance = distance; bestIndex = index; }
    });
  }
  activateCapability(bestIndex);
}
if (capabilityScroller) capabilityScroller.addEventListener('scroll', scheduleMotion, { passive: true });
capSteps.forEach((step, index) => step.addEventListener('click', () => {
  activateCapability(index);
  if (innerWidth <= 1050) step.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
}));

// Fine-pointer cursor light, scheduled only while it is moving.
if (!coarse && !reduced) {
  const orb = $('[data-cursor-orb]');
  let cx = -300, cy = -300, tx = -300, ty = -300, cursorFrame = 0;
  const drawCursor = () => {
    cx += (tx - cx) * 0.14;
    cy += (ty - cy) * 0.14;
    if (orb) orb.style.transform = `translate3d(${cx}px,${cy}px,0)`;
    if (Math.abs(tx - cx) > 0.4 || Math.abs(ty - cy) > 0.4) cursorFrame = requestAnimationFrame(drawCursor);
    else cursorFrame = 0;
  };
  addEventListener('pointermove', e => {
    tx = e.clientX - 90; ty = e.clientY - 90;
    if (!cursorFrame) cursorFrame = requestAnimationFrame(drawCursor);
  }, { passive: true });

  $$('.magnetic').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.12;
      const y = (e.clientY - r.top - r.height / 2) * 0.12;
      el.style.transform = `translate3d(${x}px,${y}px,0)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

// Scroll-linked motion uses one shared RAF instead of multiple perpetual loops.
const progress = $('[data-progress]');
const nav = $('[data-nav]');
const hero = $('.hero');
const depthRoot = $('[data-depth-root]');
const depthLayers = depthRoot ? $$('[data-depth]', depthRoot) : [];
const heroUI = hero ? $('.hero-ui', hero) : null;
const brandType = hero ? $('.hero-brand-type', hero) : null;
const kinetic = $('[data-kinetic]');
const floatObject = $('[data-float-object]');
const liveStack = $('[data-live-stack]');
const liveLayers = liveStack ? $$('[data-live-layer]', liveStack) : [];
let px = 0, py = 0, lastY = scrollY, motionFrame = 0;
let heroVisible = true, kineticVisible = false, liveVisible = false;

const visibilityObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.target === hero) heroVisible = entry.isIntersecting;
    if (entry.target === kinetic?.closest('.manifesto')) kineticVisible = entry.isIntersecting;
    if (entry.target === liveStack) liveVisible = entry.isIntersecting;
  });
  // Repaint when a section re-enters so returning to the hero never leaves stale opacity/transforms.
  scheduleMotion();
}, { rootMargin: '25% 0px', threshold: 0 });
if (hero) visibilityObserver.observe(hero);
if (kinetic?.closest('.manifesto')) visibilityObserver.observe(kinetic.closest('.manifesto'));
if (liveStack) visibilityObserver.observe(liveStack);

if (hero && depthRoot && !reduced && !coarse) {
  depthRoot.addEventListener('pointermove', e => {
    const r = depthRoot.getBoundingClientRect();
    px = (e.clientX - r.left) / r.width - 0.5;
    py = (e.clientY - r.top) / r.height - 0.5;
    scheduleMotion();
  }, { passive: true });
  depthRoot.addEventListener('pointerleave', () => { px = 0; py = 0; scheduleMotion(); });
}

function paintHero() {
  if (!hero || !depthRoot || reduced || !heroVisible) return;
  const rect = hero.getBoundingClientRect();
  const scrollP = clamp(0, -rect.top / Math.max(1, rect.height), 1);
  hero.style.setProperty('--hero-scroll', String(scrollP));
  if (heroUI) {
    heroUI.style.opacity = String(1 - clamp(0, scrollP * 1.45, 1));
    heroUI.style.translate = `0 ${scrollP * -30}px`;
  }
  if (brandType) brandType.style.filter = `blur(${scrollP * 1.7}px)`;
  depthLayers.forEach(layer => {
    const d = Number(layer.dataset.depth || 0.3);
    const x = px * 34 * d;
    const y = py * 24 * d - scrollP * 86 * d;
    const s = 1 + scrollP * 0.035 * d;
    layer.style.transform = `translate3d(${x}px,${y}px,0) scale(${s})`;
  });
}

function paintKinetic() {
  if (!kinetic || reduced || !kineticVisible) return;
  const section = kinetic.closest('.manifesto');
  if (!section) return;
  const r = section.getBoundingClientRect();
  const p = clamp(0, 1 - (r.bottom / (innerHeight + r.height)), 1);
  kinetic.style.transform = `translate3d(${(p - 0.5) * -34}px,${(p - 0.5) * 18}px,0)`;
  if (floatObject) floatObject.style.transform = `translate3d(0,${(p - 0.5) * -60}px,0) rotate(${(p - 0.5) * 5}deg)`;
}

function paintLive() {
  if (!liveStack || reduced || !liveVisible) return;
  const r = liveStack.getBoundingClientRect();
  const p = clamp(-1, (innerHeight / 2 - (r.top + r.height / 2)) / innerHeight, 1);
  liveLayers.forEach(layer => {
    const d = Number(layer.dataset.liveLayer || 0.2);
    layer.style.translate = `0 ${p * 36 * d}px`;
  });
}

function onScrollFrame() {
  const y = scrollY;
  const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  if (progress) progress.style.transform = `scaleX(${clamp(0, y / max, 1)})`;
  nav?.classList.toggle('scrolled', y > 70);
  nav?.classList.toggle('hidden', y > lastY && y > 280);
  lastY = y;
  paintHero();
  paintKinetic();
  paintLive();
  paintCapability();
  motionFrame = 0;
}
function scheduleMotion() {
  if (!motionFrame) motionFrame = requestAnimationFrame(onScrollFrame);
}
addEventListener('scroll', scheduleMotion, { passive: true });
addEventListener('resize', scheduleMotion, { passive: true });
scheduleMotion();

// Pointer-follow project label.
if (!coarse && !reduced) {
  const media = $('[data-project-hover]');
  const label = media?.querySelector('.project-hover-label');
  if (media && label) {
    media.addEventListener('pointermove', e => {
      const r = media.getBoundingClientRect();
      label.style.left = `${e.clientX - r.left}px`;
      label.style.top = `${e.clientY - r.top}px`;
    });
  }

  // Restrained 3D tilt for cards; no permanent animation loop.
  $$('[data-tilt-card]').forEach(card => {
    card.classList.add('tilting');
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(1000px) rotateX(${-ny * 2.4}deg) rotateY(${nx * 2.8}deg) translateZ(0)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}

// Pause decorative infinite animations when their chapter is well outside the viewport.
// This keeps the expressive motion while avoiding background CPU/GPU work.
const ambientMotionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => entry.target.classList.toggle('motion-active', entry.isIntersecting));
}, { rootMargin: '35% 0px', threshold: 0 });
$$('.chapter').forEach(section => ambientMotionObserver.observe(section));
