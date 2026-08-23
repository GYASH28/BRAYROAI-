import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const seriousViolations = (results) => results.violations.filter((violation) => ['serious','critical'].includes(violation.impact));
const waitHome = async (page) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelectorAll('[data-scene]').length === 7);
};

test('latest commercial-cut homepage and deep routes are present', async ({ page }) => {
  await waitHome(page);
  await expect(page.locator('#top h1')).toContainText('Digital, designed');
  await expect(page.locator('[data-scene]')).toHaveCount(7);
  await expect(page.locator('a[href="/plans"]')).toHaveCount(2);
  await expect(page.locator('a[href="/founder"]')).toHaveCount(2);
  await expect(page.locator('[data-commercial-film]')).toHaveCount(1);
  await expect(page.locator('[data-colour-stage]')).toHaveCount(1);
  await expect(page.locator('[data-capability-stage]')).toHaveCount(1);
});

test('opening sequence remains visible long enough to read', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const opening = page.locator('.opening-sequence');
  await expect(opening).toBeVisible();
  await page.waitForTimeout(1900);
  await expect(opening).toBeVisible();
  await expect(opening).toContainText('MAKE');
  await page.waitForTimeout(2100);
  await expect.poll(async () => opening.evaluate((element) => getComputedStyle(element).visibility)).toBe('hidden');
});

test('homepage sells complete low-cost website builds, not maintenance plans', async ({ page }) => {
  await waitHome(page);
  const plans = page.locator('#plans');
  for (const text of ['Website Starter','₹2,599','Business Website','₹3,999','Premium Website','₹5,999+']) await expect(plans).toContainText(text);
  await expect(plans).toContainText('Every plan below is for building and launching a complete website');
  await expect(plans).toContainText('NO MAINTENANCE SUBSCRIPTION REQUIRED');
  const body = await page.locator('body').innerText();
  for (const obsolete of ['₹9,999','₹17,999','₹25K–₹35K+','₹2,499/mo','₹3,999/mo','₹5,999+/mo']) expect(body).not.toContain(obsolete);
});

test('dedicated plans page keeps all three tiers as one-time complete builds', async ({ page }) => {
  await page.goto('/plans', { waitUntil: 'networkidle' });
  await expect(page.locator('[data-plan-scene]')).toHaveCount(5);
  await expect(page.locator('.build-card')).toHaveCount(3);
  const main = page.locator('main');
  for (const text of ['₹2,599','₹3,999','₹5,999+','ONE-TIME BUILD','You do not need a maintenance subscription']) await expect(main).toContainText(text);
  const body = await page.locator('body').innerText();
  expect(body).not.toContain('/mo');
  expect(body).not.toContain('These are not smaller website builds');

  const starter = page.locator('[data-scope-choice="starter"]');
  await starter.click();
  await expect(starter).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('[data-scope-price]')).toHaveText('₹2,599');
  await expect(page.locator('[data-scope-title]')).toHaveText('Website Starter');

  const premium = page.locator('[data-scope-choice="custom"]');
  await premium.click();
  await expect(premium).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('[data-scope-price]')).toHaveText('₹5,999+');
  await expect(page.locator('[data-scope-title]')).toHaveText('Premium Website');
});

test('founder page from the actual latest branch remains intact', async ({ page }) => {
  const response = await page.goto('/founder', { waitUntil: 'networkidle' });
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator('[data-founder-scene]')).toHaveCount(6);
  await expect(page.locator('h1')).toContainText('The work stays');
  await expect(page.locator('body')).toContainText('YASH GANESH / FOUNDER');
});

test('homepage interactions remain functional after pricing corrections', async ({ page }) => {
  await waitHome(page);
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
});

test('mobile navigation uses the latest routes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await waitHome(page);
  const button = page.locator('[data-menu-button]');
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
    await page.goto(route, { waitUntil: 'networkidle' });
    await page.waitForSelector(selector);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    expect(seriousViolations(results)).toEqual([]);
  });
}

for (const [width,height] of [[320,720],[390,844],[768,1024],[1440,900]]) {
  test(`latest pages avoid horizontal overflow at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    for (const route of ['/','/plans','/founder']) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${route} @ ${width}px`).toBeLessThanOrEqual(1);
    }
  });
}
