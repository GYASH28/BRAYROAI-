const root = document.documentElement;
const body = document.body;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;
const desktopMotion = matchMedia('(min-width: 761px)').matches;

const clamp = (min, value, max) => Math.min(max, Math.max(min, value));
const loader = document.querySelector('.loader');
const transition = document.querySelector('[data-page-transition]');
const progressBar = document.querySelector('.progress span');
const header = document.querySelector('[data-header]');
const hero = document.querySelector('[data-hero]');
const capStage = document.querySelector('[data-capability-stage]');
const statement = document.querySelector('[data-statement-track]');
const workStories = [...document.querySelectorAll('[data-work-story]')];
const capButtons = [...document.querySelectorAll('[data-cap-target]')];
const capPanels = [...document.querySelectorAll('[data-cap-panel]')];
const capProgress = document.querySelector('.capability-progress');

let lastY = scrollY;
let ticking = false;
let activeCap = 0;
let pointerNX = 0;
let pointerNY = 0;

if (loader) {
  const seen = sessionStorage.getItem('brayroai-intro');
  const finish = () => {
    loader.classList.add('done');
    body.classList.add('loaded');
    sessionStorage.setItem('brayroai-intro', '1');
  };
  if (seen || reduced) finish();
  else setTimeout(finish, 1250);
} else body.classList.add('loaded');

function activateCap(index) {
  const next = clamp(0, Number(index) || 0, Math.max(0, capPanels.length - 1));
  if (next === activeCap && capPanels[next]?.classList.contains('active')) return;
  activeCap = next;
  capButtons.forEach((button, i) => {
    button.classList.toggle('active', i === next);
    button.setAttribute('aria-pressed', i === next ? 'true' : 'false');
  });
  capPanels.forEach((panel, i) => {
    panel.classList.toggle('active', i === next);
    panel.setAttribute('aria-hidden', i === next ? 'false' : 'true');
  });
  if (capProgress) {
    const label = capProgress.querySelector('b');
    if (label) label.textContent = `${String(next + 1).padStart(2, '0')} / ${String(capPanels.length).padStart(2, '0')}`;
  }
}

capButtons.forEach((button, index) => {
  button.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
  button.addEventListener('click', () => {
    activateCap(index);
    if (desktopMotion && capStage) {
      const stageTop = scrollY + capStage.getBoundingClientRect().top;
      const usable = Math.max(1, capStage.offsetHeight - innerHeight);
      const target = stageTop + (index / Math.max(1, capPanels.length - 1)) * usable;
      scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' });
    }
  });
});
capPanels.forEach((panel, index) => panel.setAttribute('aria-hidden', index === 0 ? 'false' : 'true'));

function updateFrame() {
  const y = scrollY;
  const viewport = innerHeight;
  const max = Math.max(1, document.documentElement.scrollHeight - viewport);
  const documentProgress = clamp(0, y / max, 1);

  if (progressBar) progressBar.style.transform = `scaleX(${documentProgress})`;
  if (header) {
    header.classList.toggle('scrolled', y > 80);
    if (!body.classList.contains('menu-open')) {
      if (y > lastY + 7 && y > 220) header.classList.add('hidden');
      else if (y < lastY - 7 || y < 130) header.classList.remove('hidden');
    }
  }

  if (hero && !reduced) {
    const rect = hero.getBoundingClientRect();
    const travel = Math.max(1, hero.offsetHeight - viewport);
    const p = clamp(0, -rect.top / travel, 1);
    root.style.setProperty('--hero-p', p.toFixed(4));
  }

  if (capStage && capPanels.length && desktopMotion) {
    const rect = capStage.getBoundingClientRect();
    const travel = Math.max(1, rect.height - viewport);
    const p = clamp(0, -rect.top / travel, 1);
    const index = Math.min(capPanels.length - 1, Math.floor(p * capPanels.length));
    activateCap(index);
    capStage.style.setProperty('--cap-progress', `${(p * 100).toFixed(2)}%`);
  }

  workStories.forEach(story => {
    const rect = story.getBoundingClientRect();
    const travel = Math.max(1, story.offsetHeight - viewport);
    const p = clamp(0, -rect.top / travel, 1);
    story.style.setProperty('--story-p', p.toFixed(4));
  });

  if (statement && !reduced) {
    const parent = statement.parentElement;
    const rect = parent.getBoundingClientRect();
    const centerProgress = clamp(0, (viewport - rect.top) / Math.max(1, viewport + rect.height), 1);
    const maxShift = Math.max(0, statement.scrollWidth - innerWidth);
    statement.style.setProperty('--statement-x', `${(-maxShift * centerProgress).toFixed(1)}px`);
  }

  lastY = y;
  ticking = false;
}

addEventListener('scroll', () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(updateFrame);
  }
}, { passive: true });
addEventListener('resize', () => requestAnimationFrame(updateFrame), { passive: true });
updateFrame();

const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .1, rootMargin: '0px 0px -5% 0px' }) : null;

document.querySelectorAll('[data-reveal]').forEach((el, index) => {
  el.style.transitionDelay = `${Math.min((index % 3) * 45, 90)}ms`;
  if (revealObserver) revealObserver.observe(el);
  else el.classList.add('revealed');
});

const navLinks = [...document.querySelectorAll('[data-nav-section]')];
const navSections = [...document.querySelectorAll('[data-section]')];
if ('IntersectionObserver' in window && navLinks.length) {
  const sectionObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const id = visible.target.dataset.section;
    navLinks.forEach(link => link.classList.toggle('active', link.dataset.navSection === id));
  }, { threshold: [.18, .35, .55], rootMargin: '-20% 0px -55% 0px' });
  navSections.forEach(section => sectionObserver.observe(section));
}

const compare = document.querySelector('[data-compare]');
if (compare) {
  const input = compare.querySelector('input[type="range"]');
  const sync = () => compare.style.setProperty('--split', `${input.value}%`);
  input?.addEventListener('input', sync);
  sync();
}

const menuToggle = document.querySelector('[data-menu-toggle]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
let menuReturnFocus = null;
function setMenu(open) {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  mobileMenu.classList.toggle('open', open);
  mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
  body.classList.toggle('menu-open', open);
  header?.classList.remove('hidden');
  if (open) {
    menuReturnFocus = document.activeElement;
    requestAnimationFrame(() => mobileMenu.querySelector('a')?.focus());
  } else if (menuReturnFocus instanceof HTMLElement) menuReturnFocus.focus({ preventScroll: true });
}
menuToggle?.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', event => {
  if (event.key === 'Escape' && body.classList.contains('menu-open')) setMenu(false);
});

function shouldTransition(anchor, event) {
  if (reduced || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return false;
  const href = anchor.getAttribute('href') || '';
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return false;
  const url = new URL(anchor.href, location.href);
  if (url.origin !== location.origin) return false;
  if (url.pathname === location.pathname && url.hash) return false;
  return true;
}

document.addEventListener('click', event => {
  const anchor = event.target.closest('a');
  if (!shouldTransition(anchor, event) || !transition) return;
  event.preventDefault();
  transition.classList.add('active');
  setTimeout(() => { location.href = anchor.href; }, 460);
});
addEventListener('pageshow', () => transition?.classList.remove('active'));

if (finePointer && !reduced) {
  const cursor = document.querySelector('.signal-cursor');
  addEventListener('pointermove', event => {
    root.style.setProperty('--pointer-x', `${event.clientX}px`);
    root.style.setProperty('--pointer-y', `${event.clientY}px`);
    pointerNX = (event.clientX / innerWidth - .5) * 2;
    pointerNY = (event.clientY / innerHeight - .5) * 2;
    root.style.setProperty('--pointer-nx', pointerNX.toFixed(3));
    root.style.setProperty('--pointer-ny', pointerNY.toFixed(3));
  }, { passive: true });

  document.querySelectorAll('.button,.archive-project,.lab-item,.text-route').forEach(el => {
    el.addEventListener('mouseenter', () => cursor?.classList.add('orange'));
    el.addEventListener('mouseleave', () => cursor?.classList.remove('orange'));
  });

  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('pointermove', event => {
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * .12;
      const y = (event.clientY - rect.top - rect.height / 2) * .12;
      el.style.transform = `translate3d(${x}px,${y}px,0)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = 'translate3d(0,0,0)'; });
  });
}
