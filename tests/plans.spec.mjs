import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ready = async (page) => {
  await page.goto('/plans', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.ScrollCraft && document.querySelectorAll('[data-plan-scene]').length === 5);
  await page.evaluate(() => document.body.classList.remove('is-opening'));
};

test('plans page has five purposeful scenes and exact pricing', async ({ page }) => {
  await ready(page);
  await expect(page.locator('[data-plan-scene]')).toHaveCount(5);
  await expect(page.locator('.build-card')).toHaveCount(3);
  await expect(page.locator('.care-grid article')).toHaveCount(3);
  for (const price of ['₹9,999', '₹17,999', '₹25K–₹35K+', '₹2,499', '₹3,999', '₹5,999+']) await expect(page.locator('body')).toContainText(price);
});

test('monthly care is stated as separate from the website build', async ({ page }) => {
  await ready(page);
  const care = page.locator('#care');
  await expect(care).toContainText('A SEPARATE SERVICE / PAID MONTHLY');
  await expect(care).toContainText('These are not smaller website builds');
  await expect(care).toContainText('once the website is live');
  await expect(page.locator('#builds')).toContainText('THE WEBSITE / PAID ONCE');
});

test('scope director supports keyboard navigation', async ({ page }) => {
  await ready(page);
  const business = page.locator('[data-scope-choice="business"]');
  await business.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('[data-scope-choice="custom"]')).toBeFocused();
  await expect(page.locator('[data-scope-choice="custom"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-scope-price]')).toHaveText('₹25K–₹35K+');
  await expect(page.locator('[data-scope-link]')).toHaveAttribute('href', '#custom');
  await expect(page.locator('[data-scope-director]')).toHaveAttribute('data-sc-verify-state', 'scope:custom');
});

test('plans reveals happen near the viewport instead of above it', async ({ page }) => {
  await ready(page);
  const target = page.locator('#care [data-reveal]').first();
  await expect(target).not.toHaveClass(/is-visible/);
  await target.scrollIntoViewIfNeeded();
  await expect(target).toHaveClass(/is-visible/);
});

test('plans page has no serious or critical accessibility violations', async ({ page }) => {
  await ready(page);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact))).toEqual([]);
});

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`plans page has no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await ready(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  });
}

test('reduced motion keeps every plan readable and removes opening hold', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await ready(page);
  await expect(page.locator('body')).not.toHaveClass(/is-opening/);
  for (const item of await page.locator('[data-reveal]').all()) expect(Number(await item.evaluate((node) => getComputedStyle(node).opacity))).toBeGreaterThan(.9);
  await context.close();
});
