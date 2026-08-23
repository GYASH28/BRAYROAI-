import { test, expect } from '@playwright/test';

const settle = (page) => page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
const open = async (page, route = '/') => {
  await page.goto(route, { waitUntil: 'networkidle' });
  await settle(page);
};

test('homepage keeps native document scrolling and seven authored scenes', async ({ page }) => {
  await open(page);
  await expect(page.locator('[data-scene]')).toHaveCount(7);
  const behavior = await page.evaluate(() => ({
    html: getComputedStyle(document.documentElement).overflowY,
    body: getComputedStyle(document.body).overflowY,
    scrollHeight: document.scrollingElement.scrollHeight,
    viewport: innerHeight
  }));
  expect(behavior.html).not.toBe('hidden');
  expect(behavior.body).not.toBe('hidden');
  expect(behavior.scrollHeight).toBeGreaterThan(behavior.viewport * 5);
  await page.evaluate(() => { document.documentElement.style.scrollBehavior='auto'; scrollTo(0, 700); });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
});

test('colour director preserves the latest interactive hero treatment', async ({ page }) => {
  await open(page);
  const stage = page.locator('[data-colour-stage]');
  const button = page.locator('[data-colour-toggle]');
  await expect(stage).toHaveAttribute('data-sc-verify-state','colour:mono');
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed','true');
  await expect(stage).toHaveAttribute('data-sc-verify-state','colour:locked');
  await button.click();
  await expect(stage).toHaveAttribute('data-sc-verify-state','colour:mono');
});

test('capability instrument switches design, engineering and useful AI states', async ({ page }) => {
  await open(page);
  const stage = page.locator('[data-capability-stage]');
  for (const key of ['design','engineering','ai']) {
    const button = page.locator(`[data-capability="${key}"]`);
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed','true');
    await expect(stage).toHaveAttribute('data-sc-verify-state',`capability:${key}`);
  }
  await expect(page.locator('[data-capability-title]')).toContainText('Remove friction');
});

test('work proof can shift between desktop and mobile focus', async ({ page }) => {
  await open(page);
  const stage = page.locator('[data-work-stage]');
  const toggle = page.locator('[data-work-toggle]');
  await expect(stage).toHaveAttribute('data-sc-verify-state','work:desktop');
  await toggle.click();
  await expect(stage).toHaveAttribute('data-sc-verify-state','work:mobile');
  await expect(toggle).toHaveAttribute('aria-pressed','true');
  await toggle.click();
  await expect(stage).toHaveAttribute('data-sc-verify-state','work:desktop');
});

test('project intent updates the latest contact CTA', async ({ page }) => {
  await open(page);
  const root = page.locator('[data-project-intent]');
  for (const key of ['website','product','ai']) {
    const button = page.locator(`[data-project-type="${key}"]`);
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed','true');
    await expect(root).toHaveAttribute('data-sc-verify-state',`project:${key}`);
  }
  await expect(page.locator('[data-project-label]')).toHaveText('useful AI');
  await expect(page.locator('[data-project-cta]')).toHaveAttribute('href',/useful%20AI/);
});

test('plans scope director never falls back to the obsolete high or monthly prices', async ({ page }) => {
  await open(page,'/plans');
  const states = [
    ['starter','₹2,599','Website Starter'],
    ['business','₹3,999','Business Website'],
    ['custom','₹5,999+','Premium Website']
  ];
  for (const [key,price,title] of states) {
    const button = page.locator(`[data-scope-choice="${key}"]`);
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed','true');
    await expect(page.locator('[data-scope-price]')).toHaveText(price);
    await expect(page.locator('[data-scope-title]')).toHaveText(title);
  }
  const text = await page.locator('body').innerText();
  for (const obsolete of ['₹9,999','₹17,999','₹25K–₹35K+','/mo']) expect(text).not.toContain(obsolete);
});

test('founder principle instrument remains part of the true latest version', async ({ page }) => {
  await open(page,'/founder');
  const stage = page.locator('[data-principle-stage]');
  for (const key of ['clarity','craft','use']) {
    const button = page.locator(`[data-principle="${key}"]`);
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed','true');
    await expect(stage).toHaveAttribute('data-sc-verify-state',`principle:${key}`);
  }
});

test('reduced motion keeps all three latest pages readable', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion:'reduce', viewport:{width:1280,height:800} });
  const page = await context.newPage();
  for (const [route,selector] of [['/','main'],['/plans','#plans-main'],['/founder','#founder-main']]) {
    await page.goto(route,{waitUntil:'networkidle'});
    await expect(page.locator(selector)).toBeVisible();
    const hiddenByMotion = await page.evaluate(() => [...document.querySelectorAll('[data-reveal]')].filter((node) => Number(getComputedStyle(node).opacity) < .9).length);
    expect(hiddenByMotion, route).toBe(0);
  }
  await context.close();
});
