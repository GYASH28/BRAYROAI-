import { test, expect } from '@playwright/test';

const openHome = async (page) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    document.querySelectorAll('.opening-sequence,.scope-open,.founder-open').forEach((node) => node.remove());
    document.body.classList.remove('polish-opening','hf-intro-active');
  });
  await page.waitForSelector('#services[data-scene="services"] [data-v12-story]');
  await page.waitForFunction(() => document.body.classList.contains('v12-runtime-isolated'));
};

for (const [label, width, height] of [
  ['desktop', 1440, 900],
  ['mobile', 390, 844],
]) {
  test(`V12 capability scene paints after hero scroll on ${label}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await openHome(page);

    const section = page.locator('#services');
    await section.scrollIntoViewIfNeeded();

    await page.waitForFunction(() => {
      const reveals = [...document.querySelectorAll('#services [data-v12-reveal]')];
      return reveals.length >= 2 && reveals.every((node) => Number.parseFloat(getComputedStyle(node).opacity) > 0.95);
    });

    const renderState = await section.evaluate((node) => {
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return {
        contentVisibility: style.contentVisibility,
        height: rect.height,
        width: rect.width,
      };
    });

    expect(renderState.contentVisibility).not.toBe('hidden');
    expect(renderState.height).toBeGreaterThan(height * 0.8);
    expect(renderState.width).toBeGreaterThan(width * 0.85);
    await expect(section).toContainText('FOUR DISCIPLINES / ONE POINT OF VIEW');
    await expect(section.locator('[data-v12-story]')).toBeVisible();
    await expect(section.locator('[data-v12-step]')).toHaveCount(4);
    await expect(section.locator('[data-v12-story-visual]')).toBeVisible();
  });
}
