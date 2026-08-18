import { test, expect } from '@playwright/test';

test('BRAYROAI visual density keeps Work client-only without dead space', async ({ page }) => {
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.body.classList.contains('hero-ready'));
  await page.waitForFunction(()=>document.body.classList.contains('commercial-ready'));

  const cap=page.locator('[data-cap-step]').first();
  const capBox=await cap.boundingBox();
  expect(capBox?.height||999,'desktop capability step is still excessively tall').toBeLessThan(500);

  await page.locator('#work').scrollIntoViewIfNeeded();
  await expect(page.locator('#work .project-grid')).toHaveCount(0);
  await expect(page.locator('#work .feature-project')).toHaveCount(1);
  await expect(page.locator('#work .case-gallery')).toHaveCount(1);
  await expect(page.locator('#work .case-gallery__frame')).toHaveCount(2);
  await expect(page.locator('#work .case-study-story')).toHaveCount(1);
  const featureBox=await page.locator('#work .feature-project').boundingBox();
  const galleryBox=await page.locator('#work .case-gallery').boundingBox();
  expect(featureBox?.height||0,'featured FakhriMart proof has no meaningful height').toBeGreaterThan(450);
  expect(galleryBox?.height||0,'real screenshot gallery has no meaningful height').toBeGreaterThan(450);

  await page.locator('#clients').scrollIntoViewIfNeeded();
  await expect(page.locator('#clients .client-row')).toHaveCount(1);
  await expect(page.locator('#clients')).toContainText('FakhriMart');

  await page.locator('#lab').scrollIntoViewIfNeeded();
  await expect(page.locator('#lab .lab-card')).toHaveCount(3);
  for(const selector of ['.lab-card--large .lab-orb','.lab-card .brace-orb','.lab-card .systems-art']){
    const visual=page.locator(selector);
    await expect(visual).toBeVisible();
    const box=await visual.boundingBox();
    expect(box?.height||0,`${selector} has no meaningful visual height`).toBeGreaterThan(90);
  }
});
