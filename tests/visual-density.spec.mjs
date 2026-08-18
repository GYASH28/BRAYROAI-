import { test, expect } from '@playwright/test';

test('BRAYROAI visual density removes accidental half-grid and dead-card space', async ({ page }) => {
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.body.classList.contains('hero-ready'));

  const cap=page.locator('[data-cap-step]').first();
  const capBox=await cap.boundingBox();
  expect(capBox?.height||999,'desktop capability step is still excessively tall').toBeLessThan(500);

  await page.locator('#work').scrollIntoViewIfNeeded();
  const productCards=page.locator('.project-grid .project-tile');
  await expect(productCards).toHaveCount(2);
  const first=await productCards.nth(0).boundingBox();
  const second=await productCards.nth(1).boundingBox();
  expect(Math.abs((first?.y||0)-(second?.y||0)),'two project cards should intentionally share the desktop row').toBeLessThan(12);
  await expect(page.locator('.project-tile__art')).toHaveCount(2);

  await page.locator('#lab').scrollIntoViewIfNeeded();
  for(const selector of ['.lab-card--large .lab-orb','.lab-card .brace-orb','.lab-card .systems-art']){
    const visual=page.locator(selector);
    await expect(visual).toBeVisible();
    const box=await visual.boundingBox();
    expect(box?.height||0,`${selector} has no meaningful visual height`).toBeGreaterThan(90);
  }
});
