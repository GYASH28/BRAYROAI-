import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ready = async (page) => {
  await page.goto('/founder', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.ScrollCraft && document.querySelectorAll('[data-founder-scene]').length === 6);
  await page.evaluate(() => document.body.classList.remove('is-opening'));
};

test('founder page is complete and uses real studio assets', async ({ page }) => {
  await ready(page);
  await expect(page.locator('[data-founder-scene]')).toHaveCount(6);
  await expect(page.locator('img[src="/assets/about-yash.webp"]')).toHaveCount(2);
  await expect(page.locator('img[src="/assets/brayroai-process-table.webp"]')).toHaveCount(1);
  await expect(page.locator('img[src="/assets/brayroai-installation-hero.webp"]')).toHaveCount(1);
  await expect(page.locator('body')).toContainText(/YASH GANESH/i);
  await expect(page.locator('a[href="https://github.com/GYASH28"]')).toHaveCount(1);
});

test('founder principles are keyboard-operable', async ({ page }) => {
  await ready(page);
  const clarity = page.locator('[data-principle="clarity"]');
  await clarity.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('[data-principle="craft"]')).toBeFocused();
  await expect(page.locator('[data-principle-stage]')).toHaveAttribute('data-sc-verify-state', 'principle:craft');
  await expect(page.locator('[data-principle-title]')).toContainText('browser agrees');
});

test('founder page has no serious or critical accessibility violations', async ({ page }) => {
  await ready(page);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact))).toEqual([]);
});

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`founder page has no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await ready(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  });
}

test('reduced motion keeps the founder story readable', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await ready(page);
  for (const item of await page.locator('[data-reveal]').all()) expect(Number(await item.evaluate((node) => getComputedStyle(node).opacity))).toBeGreaterThan(.9);
  await context.close();
});
