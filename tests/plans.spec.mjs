import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ready = async (page) => {
  await page.goto('/plans.html', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.ScrollCraft && document.querySelector('[data-scope-director]'));
};

test('plans film publishes the exact three build and three care prices', async ({ page }) => {
  await ready(page);
  await expect(page.locator('[data-plan-cut]')).toHaveCount(9);
  for (const price of ['₹9,999', '₹17,999', '₹25K–₹35K+', '₹2,499', '₹3,999', '₹5,999+']) {
    await expect(page.locator('body')).toContainText(price);
  }
  await expect(page.locator('.build-plan')).toHaveCount(3);
  await expect(page.locator('.care-index article')).toHaveCount(3);
});

test('scope director works with keyboard and changes the recommendation', async ({ page }) => {
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

test('plans timeline publishes finite cinematic progress', async ({ page }) => {
  await ready(page);
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight * 0.62));
  await page.waitForTimeout(180);
  const state = await page.evaluate(() => ({
    energy: getComputedStyle(document.documentElement).getPropertyValue('--plan-energy').trim(),
    cuts: [...document.querySelectorAll('[data-plan-cut]')].map((cut) => getComputedStyle(cut).getPropertyValue('--plan-p').trim()),
    nav: document.querySelector('[data-plans-nav]').dataset.scVerifyState
  }));
  expect(Number.isFinite(Number(state.energy))).toBe(true);
  expect(state.cuts.every((value) => Number.isFinite(Number(value)))).toBe(true);
  expect(state.nav).toMatch(/^plan-cut:\d+:/);
});

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`plans page has no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await ready(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test('plans page has no serious or critical accessibility violations', async ({ page }) => {
  await ready(page);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact))).toEqual([]);
});

test('reduced motion keeps every plan readable and removes the opening hold', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await ready(page);
  await expect(page.locator('body')).not.toHaveClass(/is-opening/);
  await expect(page.locator('[data-plan-cut]')).toHaveCount(9);
  await expect(page.locator('#custom')).toContainText('₹25K–₹35K+');
  await context.close();
});
