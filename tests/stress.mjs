import { chromium } from '@playwright/test';

const base = process.env.BASE_URL || 'http://127.0.0.1:4173';
const concurrency = Number(process.env.STRESS_CONCURRENCY || 24);
const total = Number(process.env.STRESS_REQUESTS || 600);
const routes = ['/', '/plans', '/founder', '/commercial-cut.css', '/commercial-cut.js', '/premium-polish.css', '/premium-polish.js', '/direction-pass.css', '/direction-pass.js', '/plans-page.css', '/plans-page.js', '/founder-page.css', '/founder-page.js', '/scrollcraft.css', '/scrollcraft.js', '/assets/hero-background.webp', '/assets/yash-cutout.webp', '/assets/about-yash.webp', '/assets/brayroai-installation-hero.webp', '/assets/brayroai-process-table.webp', '/assets/fakhrimart-case-desktop.png', '/assets/fakhrimart-case-mobile.png'];
const failures = [];
const timings = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

async function httpLoad() {
  let cursor = 0;
  async function worker(id) {
    while (cursor < total) {
      const current = cursor++;
      if (current >= total) return;
      const route = routes[current % routes.length];
      const start = performance.now();
      try {
        const response = await fetch(`${base}${route}`, { headers: { 'x-brayroai-stress': String(id) } });
        await response.arrayBuffer();
        timings.push(performance.now() - start);
        if (!response.ok) failures.push(`HTTP ${response.status}: ${route}`);
      } catch (error) { failures.push(`Request failed: ${route}: ${error.message}`); }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, (_, index) => worker(index + 1)));
}

async function scrollStorm(page, passes = 4, steps = 26) {
  await page.evaluate(async ({ passes, steps }) => {
    document.documentElement.style.scrollBehavior = 'auto';
    for (let pass = 0; pass < passes; pass += 1) {
      for (let step = 0; step <= steps; step += 1) {
        const ratio = pass % 2 === 0 ? step / steps : 1 - step / steps;
        scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * ratio);
        if (step % 4 === 0) await new Promise(requestAnimationFrame);
      }
    }
  }, { passes, steps });
}

async function inspectPage(page, route, selector, count, viewport) {
  await page.setViewportSize(viewport);
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(({ selector, count }) => document.querySelectorAll(selector).length === count, { selector, count });
  await page.evaluate(() => {
    document.querySelectorAll('.opening-sequence,.scope-open,.founder-open').forEach((node) => node.remove());
    document.body.classList.remove('polish-opening');
  });
  const dimensions = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth - innerWidth, screens: document.documentElement.scrollHeight / innerHeight }));
  assert(dimensions.overflow <= 1, `${route} overflow at ${viewport.width}px: ${dimensions.overflow}px`);
  assert(dimensions.screens >= 5 && dimensions.screens <= 18, `${route} unexpected length at ${viewport.width}px: ${dimensions.screens.toFixed(2)} screens`);
}

async function browserLoad() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const runtimeErrors = [];
  page.on('pageerror', (error) => runtimeErrors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => { if (message.type() === 'error') runtimeErrors.push(`console: ${message.text()}`); });
  page.on('requestfailed', (request) => { if (request.url().startsWith(base)) runtimeErrors.push(`requestfailed: ${request.url()} (${request.failure()?.errorText || 'unknown'})`); });

  for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1440, height: 900 }, { width: 1920, height: 1080 }]) {
    await inspectPage(page, '/', '[data-scene]', 7, viewport);
  }
  await scrollStorm(page, 5, 28);
  await page.evaluate(() => {
    const colour = document.querySelector('[data-colour-toggle]');
    for (let i = 0; i < 40; i += 1) colour.click();
    const capabilities = [...document.querySelectorAll('[data-capability]')];
    for (let i = 0; i < 90; i += 1) capabilities[i % capabilities.length].click();
    const work = document.querySelector('[data-work-toggle]');
    for (let i = 0; i < 40; i += 1) work.click();
    const intents = [...document.querySelectorAll('[data-project-type]')];
    for (let i = 0; i < 90; i += 1) intents[i % intents.length].click();
  });
  assert(await page.locator('[data-colour-toggle]').getAttribute('aria-pressed') === 'false', 'colour toggle lost parity');
  assert(await page.locator('[data-capability-stage]').getAttribute('data-sc-verify-state') === 'capability:ai', 'capability selector lost final state');
  assert(await page.locator('[data-work-stage]').getAttribute('data-sc-verify-state') === 'work:desktop', 'work focus lost parity');
  assert(await page.locator('[data-project-intent]').getAttribute('data-sc-verify-state') === 'project:ai', 'project intent lost final state');

  assert(await page.locator('video').count() === 0, 'removed background video returned');
  assert(await page.locator('[data-signal-chamber],.signal-chamber__core,.signal-chamber__orbit').count() === 0, 'obsolete AI-dashboard chamber returned');
  const sequence = page.locator('[data-editorial-sequence]');
  await sequence.scrollIntoViewIfNeeded();
  await page.evaluate(async () => {
    const node = document.querySelector('[data-editorial-sequence]');
    const top = node.getBoundingClientRect().top + scrollY;
    const range = Math.max(1,node.offsetHeight-innerHeight);
    for (let i = 0; i <= 40; i += 1) {
      scrollTo(0, top + range * (i / 40));
      if (i % 3 === 0) await new Promise(requestAnimationFrame);
    }
  });
  await page.waitForTimeout(120);
  const editorial = await page.evaluate(() => {
    const node = document.querySelector('[data-editorial-sequence]');
    return {
      state: node?.getAttribute('data-sc-verify-state'),
      index: document.querySelector('[data-editorial-index]')?.textContent,
      status: document.querySelector('[data-editorial-status]')?.textContent,
      words: node?.querySelectorAll('.editorial-sequence__word').length,
      join: Number(getComputedStyle(node.querySelector('.editorial-sequence__join')).opacity)
    };
  });
  assert(editorial.state === 'editorial:join', 'editorial sequence did not reach final narrative state');
  assert(editorial.index === '04 / 04', 'editorial sequence index did not progress');
  assert(editorial.status === 'ONE STUDIO / NO HANDOFF', 'editorial sequence payoff did not resolve');
  assert(editorial.words === 3 && editorial.join >= .8, 'editorial sequence composition incomplete');

  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    await inspectPage(page, '/plans', '[data-plan-scene]', 5, viewport);
    await scrollStorm(page);
    await page.evaluate(() => { const choices = [...document.querySelectorAll('[data-scope-choice]')]; for (let i = 0; i < 90; i += 1) choices[i % choices.length].click(); });
    assert(await page.locator('[data-scope-director]').getAttribute('data-sc-verify-state') === 'scope:custom', `plans director lost final state at ${viewport.width}px`);
    assert(await page.locator('[data-scope-choice][aria-pressed="true"]').count() === 1, 'plans director has multiple active choices');
  }

  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    await inspectPage(page, '/founder', '[data-founder-scene]', 6, viewport);
    await scrollStorm(page);
    await page.evaluate(() => { const choices = [...document.querySelectorAll('[data-principle]')]; for (let i = 0; i < 90; i += 1) choices[i % choices.length].click(); });
    assert(await page.locator('[data-principle-stage]').getAttribute('data-sc-verify-state') === 'principle:use', `principle selector lost final state at ${viewport.width}px`);
    assert(await page.locator('[data-principle][aria-pressed="true"]').count() === 1, 'principle selector has multiple active choices');
  }

  failures.push(...runtimeErrors);
  await context.close();
  await browser.close();
}

const started = performance.now();
await httpLoad();
await browserLoad();
timings.sort((a, b) => a - b);
const quantile = (q) => timings[Math.min(timings.length - 1, Math.floor(timings.length * q))] || Infinity;
const summary = { httpRequests: total, concurrency, routes: routes.length, pages: 3, viewports: 4, scrollWrites: 396, interactionWrites: 470, failures: failures.length, medianMs: Math.round(quantile(.5)), p95Ms: Math.round(quantile(.95)), p99Ms: Math.round(quantile(.99)), elapsedMs: Math.round(performance.now() - started) };
console.log(JSON.stringify(summary, null, 2));
if (summary.p95Ms > 2000) failures.push(`HTTP p95 ${summary.p95Ms}ms exceeds 2000ms`);
if (failures.length) { console.error(failures.slice(0,30).join('\n')); process.exit(1); }
console.log('Stress test passed: load, resize, editorial handoff, scroll and interaction pressure stayed coherent across all three pages.');
