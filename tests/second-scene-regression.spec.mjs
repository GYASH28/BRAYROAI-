import { test, expect } from '@playwright/test';

const openHome = async (page) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    document.querySelectorAll('.opening-sequence,.scope-open,.founder-open').forEach((node) => node.remove());
    document.body.classList.remove('polish-opening','hf-intro-active');
  });
  await page.waitForSelector('#services[data-v15-play] [data-v15-stage]');
  await page.waitForFunction(() => document.body.classList.contains('v12-runtime-isolated'));
};

for (const [label, width, height] of [
  ['desktop', 1440, 900],
  ['mobile', 390, 844],
]) {
  test(`V15 playful capability stage paints and switches on ${label}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await openHome(page);

    const section = page.locator('#services');
    await section.evaluate((node) => node.scrollIntoView({ block:'start', behavior:'auto' }));
    const renderState = await section.evaluate((node) => {
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return { contentVisibility:style.contentVisibility, height:rect.height, width:rect.width };
    });

    expect(renderState.contentVisibility).not.toBe('hidden');
    expect(renderState.height).toBeGreaterThan(height * .82);
    expect(renderState.height).toBeLessThan(height * 1.45);
    expect(renderState.width).toBeGreaterThan(width * .95);
    await expect(section.locator('[data-v15-stage]')).toBeVisible();
    await expect(section.locator('[data-v15-control]')).toHaveCount(4);
    await expect(section.locator('[data-v12-step]')).toHaveCount(4);
    await expect(section).toContainText('PLAYGROUND 02');
    await expect(section).toContainText('Make it feel');

    await section.locator('[data-v15-control="3"]').click();
    await expect(section).toHaveAttribute('data-play-state','ai');
    await expect(section.locator('[data-v15-counter]')).toHaveText('04 / 04');
    await expect(section.locator('[data-v12-story-word]')).toHaveText('AI');
    await expect(section.locator('[data-v15-title]')).toContainText('real problem');
  });
}
