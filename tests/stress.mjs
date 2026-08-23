import { chromium } from '@playwright/test';

const base = process.env.BASE_URL || 'http://127.0.0.1:4173';
const concurrency = Number(process.env.STRESS_CONCURRENCY || 24);
const total = Number(process.env.STRESS_REQUESTS || 600);
const routes = [
  '/',
  '/plans.html',
  '/commercial-cut.css',
  '/commercial-cut.js',
  '/plans-page.css',
  '/plans-page.js',
  '/scrollcraft.css',
  '/scrollcraft.js',
  '/robots.txt',
  '/assets/hero-background.webp',
  '/assets/yash-cutout.webp',
  '/assets/about-yash.webp',
  '/assets/fakhrimart-case-desktop.png',
  '/assets/fakhrimart-case-mobile.png',
  '/assets/brayroai-convergence-poster.webp'
];

const failures = [];
const timings = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

async function httpLoad() {
  let cursor = 0;
  async function worker(id) {
    while (cursor < total) {
      const current = cursor++;
      if (current >= total) return;
      const route = routes[current % routes.length];
      const started = performance.now();
      try {
        const response = await fetch(`${base}${route}`, { headers: { 'x-brayroai-stress': String(id) } });
        await response.arrayBuffer();
        timings.push(performance.now() - started);
        if (!response.ok) failures.push(`HTTP ${response.status}: ${route}`);
      } catch (error) {
        failures.push(`Request failed: ${route}: ${error.message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, (_, index) => worker(index + 1)));
}

async function browserLoad() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const runtimeErrors = [];
  page.on('pageerror', (error) => runtimeErrors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(`console: ${message.text()}`);
  });
  page.on('requestfailed', (request) => {
    if (request.url().startsWith(base)) runtimeErrors.push(`requestfailed: ${request.url()} (${request.failure()?.errorText || 'unknown'})`);
  });

  const viewports = [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
    { width: 1920, height: 1080 }
  ];

  for (let cycle = 0; cycle < 4; cycle += 1) {
    await page.setViewportSize(viewports[cycle % viewports.length]);
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.ScrollCraft && document.querySelectorAll('[data-commercial-cut]').length === 12);
    const dimensions = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - innerWidth,
      screens: document.documentElement.scrollHeight / innerHeight
    }));
    assert(dimensions.overflow <= 1, `Horizontal overflow after reload cycle ${cycle + 1}: ${dimensions.overflow}px`);
    assert(dimensions.screens >= 10 && dimensions.screens <= 16, `Unexpected page length after reload cycle ${cycle + 1}: ${dimensions.screens.toFixed(2)} screens`);
  }

  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto';
    for (let pass = 0; pass < 6; pass += 1) {
      const down = pass % 2 === 0;
      for (let step = 0; step <= 24; step += 1) {
        const ratio = down ? step / 24 : 1 - step / 24;
        scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * ratio);
        if (step % 4 === 0) await new Promise(requestAnimationFrame);
      }
    }
  });
  await page.waitForTimeout(220);

  await page.evaluate(() => {
    const button = document.querySelector('[data-colour-toggle]');
    for (let index = 0; index < 40; index += 1) button.click();
  });
  assert(await page.locator('[data-colour-toggle]').getAttribute('aria-pressed') === 'false', 'Hero grade toggle lost parity after 40 clicks');

  await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('button[data-preview-mode]')];
    for (let index = 0; index < 60; index += 1) buttons[index % 2].click();
  });
  assert(await page.locator('[data-responsive-preview]').getAttribute('data-preview-mode') === 'mobile', 'Responsive preview did not preserve its last state');
  assert(await page.locator('[data-proof-stage]').getAttribute('data-proof-view') === 'mobile', 'Responsive proof diverged from preview state');

  await page.evaluate(() => {
    const input = document.querySelector('[data-clarity]');
    for (const value of [24, 92, 41, 83, 68, 29, 90, 53, 76, 68]) {
      input.value = String(value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  assert(await page.locator('[data-clarity-output]').textContent() === '68%', 'Clarity output desynchronised under repeated input');

  await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('[data-ai-choice]')];
    for (let index = 0; index < 60; index += 1) buttons[index % buttons.length].click();
  });
  assert(await page.locator('[data-ai-demo]').getAttribute('data-sc-verify-state') === 'workflow:support', 'AI workflow lost its last selected state');

  await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('[data-project-type]')];
    for (let index = 0; index < 60; index += 1) buttons[index % buttons.length].click();
  });
  const projectHref = await page.locator('[data-project-cta]').getAttribute('href');
  assert(projectHref?.includes('useful%20AI%20project'), 'Project intent did not reach the enquiry href');

  await page.waitForFunction(() => {
    const film = document.querySelector('[data-commercial-film]');
    return film?.currentSrc.startsWith('blob:') && film.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA;
  }, null, { timeout: 20_000 });
  await page.evaluate(() => {
    const range = document.querySelector('[data-film-range]');
    const toggle = document.querySelector('[data-film-toggle]');
    for (let index = 0; index < 24; index += 1) {
      range.value = String((index * 137) % 1000);
      range.dispatchEvent(new Event('input', { bubbles: true }));
      if (index % 6 === 0) toggle.click();
    }
  });
  assert((await page.locator('[data-film-time]').textContent()) !== '00:00 / 00:00', 'Film timeline did not report media time');

  const focusResults = await page.evaluate(() => [
    '[data-colour-toggle]',
    'button[data-preview-mode="desktop"]',
    '[data-clarity]',
    '[data-ai-choice="leads"]',
    '[data-film-toggle]',
    '[data-project-type="website"]',
    '[data-project-cta]'
  ].map((selector) => {
    const element = document.querySelector(selector);
    element.focus({ preventScroll: true });
    return { selector, focused: element === document.activeElement };
  }));
  focusResults.forEach(({ selector, focused }) => assert(focused, `Focus failed for ${selector}`));

  const finalState = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - innerWidth,
    energy: getComputedStyle(document.documentElement).getPropertyValue('--motion-energy').trim(),
    progress: [...document.querySelectorAll('[data-commercial-cut]')].map((cut) => getComputedStyle(cut).getPropertyValue('--cut-p').trim()),
    activePreview: document.querySelectorAll('button[data-preview-mode][aria-pressed="true"]').length,
    activeWorkflow: document.querySelectorAll('[data-ai-choice][aria-pressed="true"]').length,
    activeProject: document.querySelectorAll('[data-project-type][aria-pressed="true"]').length
  }));
  assert(finalState.overflow <= 1, `Horizontal overflow after interaction storm: ${finalState.overflow}px`);
  assert(Number.isFinite(Number(finalState.energy)), `Non-finite motion energy: ${finalState.energy}`);
  assert(finalState.progress.every((value) => Number.isFinite(Number(value))), 'Non-finite cut progress detected');
  assert(finalState.activePreview === 1, `Responsive group has ${finalState.activePreview} active choices`);
  assert(finalState.activeWorkflow === 1, `AI group has ${finalState.activeWorkflow} active choices`);
  assert(finalState.activeProject === 1, `Project group has ${finalState.activeProject} active choices`);

  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await page.goto(`${base}/plans.html`, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.querySelectorAll('[data-plan-cut]').length === 9);
    const plansDimensions = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - innerWidth,
      screens: document.documentElement.scrollHeight / innerHeight
    }));
    assert(plansDimensions.overflow <= 1, `Plans overflow at ${viewport.width}px: ${plansDimensions.overflow}px`);
    assert(plansDimensions.screens >= 8 && plansDimensions.screens <= 18, `Unexpected plans length at ${viewport.width}px: ${plansDimensions.screens.toFixed(2)} screens`);
  }

  await page.evaluate(async () => {
    const choices = [...document.querySelectorAll('[data-scope-choice]')];
    for (let index = 0; index < 90; index += 1) choices[index % choices.length].click();
    for (let pass = 0; pass < 4; pass += 1) {
      for (let step = 0; step <= 20; step += 1) {
        const ratio = pass % 2 === 0 ? step / 20 : 1 - step / 20;
        scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * ratio);
        if (step % 5 === 0) await new Promise(requestAnimationFrame);
      }
    }
  });
  await page.waitForTimeout(220);
  const plansState = await page.evaluate(() => ({
    scope: document.querySelector('[data-scope-director]').dataset.scVerifyState,
    active: document.querySelectorAll('[data-scope-choice][aria-pressed="true"]').length,
    overflow: document.documentElement.scrollWidth - innerWidth,
    energy: getComputedStyle(document.documentElement).getPropertyValue('--plan-energy').trim(),
    progress: [...document.querySelectorAll('[data-plan-cut]')].map((cut) => getComputedStyle(cut).getPropertyValue('--plan-p').trim())
  }));
  assert(plansState.scope === 'scope:custom', `Plans director lost final state: ${plansState.scope}`);
  assert(plansState.active === 1, `Plans director has ${plansState.active} active choices`);
  assert(plansState.overflow <= 1, `Plans overflow after interaction storm: ${plansState.overflow}px`);
  assert(Number.isFinite(Number(plansState.energy)), `Non-finite plans energy: ${plansState.energy}`);
  assert(plansState.progress.every((value) => Number.isFinite(Number(value))), 'Non-finite plans cut progress detected');

  failures.push(...runtimeErrors);
  await context.close();
  await browser.close();
}

const started = performance.now();
await httpLoad();
await browserLoad();
timings.sort((a, b) => a - b);
const quantile = (q) => timings[Math.min(timings.length - 1, Math.floor(timings.length * q))] || Infinity;
const summary = {
  httpRequests: total,
  concurrency,
  reloadCycles: 4,
  scrollWrites: 150,
  interactionWrites: 428,
  failures: failures.length,
  medianMs: Math.round(quantile(0.5)),
  p95Ms: Math.round(quantile(0.95)),
  p99Ms: Math.round(quantile(0.99)),
  elapsedMs: Math.round(performance.now() - started)
};

console.log(JSON.stringify(summary, null, 2));
if (summary.p95Ms > 2000) failures.push(`Local HTTP p95 ${summary.p95Ms}ms exceeds the 2000ms guardrail`);
if (failures.length) {
  console.error(failures.slice(0, 30).join('\n'));
  process.exit(1);
}
console.log('Stress test passed: repeated load, resize, scroll, media, state, and keyboard pressure stayed coherent.');
