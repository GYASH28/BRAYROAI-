import { test, expect } from '@playwright/test';

const openHome = async (page) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    document.querySelectorAll('.opening-sequence,.scope-open,.founder-open').forEach((node) => node.remove());
    document.body.classList.remove('polish-opening','hf-intro-active');
  });
  await page.waitForSelector('#services[data-v14-reel] [data-v14-stage]');
  await page.waitForFunction(() => document.body.classList.contains('v12-runtime-isolated'));
};

for (const [label, width, height] of [
  ['desktop', 1440, 900],
  ['mobile', 390, 844],
]) {
  test(`V14 cinematic capability film paints after hero scroll on ${label}`, async ({ page }) => {
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
    expect(renderState.height).toBeGreaterThan(height * 3.2);
    expect(renderState.width).toBeGreaterThan(width * .95);
    await expect(section.locator('[data-v14-stage]')).toBeVisible();
    await expect(section.locator('[data-v14-frame]')).toHaveCount(4);
    await expect(section.locator('[data-v14-copy]')).toHaveCount(4);
    await expect(section.locator('[data-v12-step]')).toHaveCount(4);
    await expect(section).toContainText('CAPABILITY FILM');

    await page.evaluate(() => {
      const node=document.querySelector('#services');
      scrollTo(0,node.offsetTop + (node.offsetHeight-innerHeight)*.98);
    });
    await page.waitForFunction(()=>document.querySelector('#services')?.dataset.reelState==='ai');
    await expect(section.locator('[data-v14-counter]')).toHaveText('04 / 04');
    await expect(section.locator('[data-v12-story-word]')).toHaveText('AI SYSTEMS');
  });
}
