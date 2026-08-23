import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const seriousViolations = (results) => results.violations.filter((violation) => ['serious','critical'].includes(violation.impact));
const clearOpening = async (page) => {
  await page.evaluate(() => {
    document.querySelectorAll('.opening-sequence,.scope-open,.founder-open').forEach((node) => node.remove());
    document.body.classList.remove('polish-opening');
  });
};
const openPage = async (page, route = '/') => {
  await page.goto(route, { waitUntil:'networkidle' });
  await clearOpening(page);
};

test('premium homepage keeps the current seven-scene commercial architecture', async ({ page }) => {
  await openPage(page);
  await expect(page.locator('#top h1')).toContainText('Digital, designed');
  await expect(page.locator('[data-scene]')).toHaveCount(7);
  const scenes = await page.locator('[data-scene]').evaluateAll((nodes) => nodes.map((node) => node.dataset.scene));
  expect(scenes).toEqual(['hero','services','film','work','plans','founder','contact']);
  await expect(page.locator('link[href="/premium-polish.css"]')).toHaveCount(1);
  await expect(page.locator('script[src="/premium-polish.js"]')).toHaveCount(1);
  await expect(page.locator('a[href="/plans"]')).toHaveCount(2);
  await expect(page.locator('a[href="/founder"]')).toHaveCount(2);
});

test('opening sequence reads as a multi-beat cinematic sequence before the hero handoff', async ({ page }) => {
  await page.setViewportSize({ width:1440, height:900 });
  await page.goto('/', { waitUntil:'domcontentloaded' });
  const opening = page.locator('.opening-sequence');
  await expect(opening).toBeVisible();
  await expect(page.locator('.polish-open__beats span')).toHaveCount(4);
  await expect(page.locator('.polish-open__beats')).toContainText('SIGNAL');
  await expect(page.locator('.polish-open__beats')).toContainText('DIRECTION');
  await expect(page.locator('.polish-open__beats')).toContainText('SYSTEM');
  await expect(page.locator('.polish-open__beats')).toContainText('LAUNCH');
  await page.waitForTimeout(1200);
  const during = await opening.evaluate((element) => ({ visibility:getComputedStyle(element).visibility, opacity:Number(getComputedStyle(element).opacity) }));
  expect(during.visibility).not.toBe('hidden');
  expect(during.opacity).toBeGreaterThan(.8);
  await page.waitForTimeout(3400);
  const after = await opening.evaluate((element) => ({ visibility:getComputedStyle(element).visibility, opacity:Number(getComputedStyle(element).opacity) }));
  expect(after.visibility === 'hidden' || after.opacity < .05).toBeTruthy();
  await expect(page.locator('#top h1')).toContainText('Digital, designed');
});

test('homepage sells complete low-cost website builds, not maintenance plans', async ({ page }) => {
  await openPage(page);
  const plans = page.locator('#plans');
  for (const text of ['Website Starter','₹2,599','Business Website','₹3,999','Premium Website','₹5,999+']) await expect(plans).toContainText(text);
  await expect(plans).toContainText('Every plan below is for building and launching a complete website');
  await expect(plans).toContainText('NO MAINTENANCE SUBSCRIPTION REQUIRED');
  const body = await page.locator('body').innerText();
  for (const obsolete of ['₹9,999','₹17,999','₹25K–₹35K+','₹2,499/mo','₹3,999/mo','₹5,999+/mo']) expect(body).not.toContain(obsolete);
});

test('homepage interactions survive the richer motion layer', async ({ page }) => {
  await openPage(page);
  const colour = page.locator('[data-colour-toggle]');
  await colour.click();
  await expect(colour).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('[data-colour-stage]')).toHaveAttribute('data-sc-verify-state','colour:locked');

  const ai = page.locator('[data-capability="ai"]');
  await ai.click();
  await expect(ai).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('[data-capability-stage]')).toHaveAttribute('data-sc-verify-state','capability:ai');

  const work = page.locator('[data-work-toggle]');
  await work.click();
  await expect(work).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('[data-work-stage]')).toHaveAttribute('data-sc-verify-state','work:mobile');

  const project = page.locator('[data-project-type="ai"]');
  await project.click();
  await expect(project).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('[data-project-intent]')).toHaveAttribute('data-sc-verify-state','project:ai');
});

test('scene handoffs resolve live-state motion and active navigation', async ({ page }) => {
  await page.setViewportSize({ width:1440, height:900 });
  await openPage(page);
  await page.locator('#services').scrollIntoViewIfNeeded();
  await page.waitForTimeout(180);
  await expect(page.locator('#services')).toHaveClass(/is-scene-live/);
  await expect(page.locator('.site-nav nav a[href="#services"]')).toHaveClass(/is-current/);
  await page.locator('#work').scrollIntoViewIfNeeded();
  await page.waitForTimeout(180);
  await expect(page.locator('#work')).toHaveClass(/is-scene-live/);
  await expect(page.locator('.site-nav nav a[href="#work"]')).toHaveClass(/is-current/);
});

test('dedicated Plans page keeps one-time pricing and the interactive scope director', async ({ page }) => {
  await openPage(page, '/plans');
  await expect(page.locator('[data-plan-scene]')).toHaveCount(5);
  await expect(page.locator('.build-card')).toHaveCount(3);
  await expect(page.locator('link[href="/premium-polish.css"]')).toHaveCount(1);
  const main = page.locator('main');
  for (const text of ['₹2,599','₹3,999','₹5,999+','ONE-TIME BUILD','You do not need a maintenance subscription']) await expect(main).toContainText(text);
  const starter = page.locator('[data-scope-choice="starter"]');
  await starter.click();
  await expect(page.locator('[data-scope-price]')).toHaveText('₹2,599');
  const premium = page.locator('[data-scope-choice="custom"]');
  await premium.click();
  await expect(page.locator('[data-scope-price]')).toHaveText('₹5,999+');
  await expect(page.locator('[data-scope-director]')).toHaveAttribute('data-sc-verify-state','scope:custom');
});

test('Founder page keeps the portrait story and principle instrument intact', async ({ page }) => {
  await openPage(page, '/founder');
  await expect(page.locator('[data-founder-scene]')).toHaveCount(6);
  await expect(page.locator('h1')).toContainText('The work stays');
  await expect(page.locator('link[href="/premium-polish.css"]')).toHaveCount(1);
  const craft = page.locator('[data-principle="craft"]');
  await craft.click();
  await expect(craft).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('[data-principle-stage]')).toHaveAttribute('data-sc-verify-state','principle:craft');
  await expect(page.locator('[data-principle-title]')).toContainText('browser agrees');
});

test('mobile navigation remains usable and the cinematic opening is visible on touch layouts', async ({ page }) => {
  await page.setViewportSize({ width:390, height:844 });
  await page.goto('/', { waitUntil:'domcontentloaded' });
  await expect(page.locator('.opening-sequence')).toBeVisible();
  await clearOpening(page);
  const button = page.locator('[data-menu-button]');
  const box = await button.boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(44);
  expect(box?.height).toBeGreaterThanOrEqual(40);
  await button.click();
  await expect(button).toHaveAttribute('aria-expanded','true');
  await expect(page.locator('[data-mobile-menu]')).toHaveClass(/open/);
  await expect(page.locator('[data-mobile-menu] a[href="/plans"]')).toBeVisible();
  await expect(page.locator('[data-mobile-menu] a[href="/founder"]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(button).toHaveAttribute('aria-expanded','false');
});

for (const [route, selector] of [['/','[data-scene]'],['/plans','[data-plan-scene]'],['/founder','[data-founder-scene]']]) {
  test(`${route} has no serious or critical accessibility violations`, async ({ page }) => {
    await openPage(page, route);
    await page.waitForSelector(selector);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
    expect(seriousViolations(results)).toEqual([]);
  });
}

for (const [width,height] of [[320,720],[390,844],[768,1024],[1280,800],[1440,900],[1920,1080]]) {
  test(`all public pages avoid horizontal overflow at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    for (const route of ['/','/plans','/founder']) {
      await openPage(page, route);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${route} @ ${width}px`).toBeLessThanOrEqual(1);
    }
  });
}

test('reduced motion removes cinematic blockers without hiding the website', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion:'reduce', viewport:{ width:1280, height:800 } });
  const page = await context.newPage();
  await page.goto('/', { waitUntil:'networkidle' });
  await expect(page.locator('.opening-sequence')).toBeHidden();
  for (const selector of ['#services','#work','#plans','#studio','#contact']) await expect(page.locator(selector)).toBeVisible();
  await context.close();
});
