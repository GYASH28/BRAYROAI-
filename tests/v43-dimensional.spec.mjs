import {test,expect} from '@playwright/test';

test('V43 signature scenes mount on the authored homepage chapters',async({page})=>{
  await page.goto('/');
  await page.locator('#services').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-v43-source-particles]')).toHaveCount(1);
  await expect(page.locator('[data-v43-source-particles] i')).toHaveCount(9);
  await expect(page.locator('[data-v43-handoff-relay]')).toHaveCount(1);
});

test('reduced motion keeps Rae on SVG and never downloads the WebGL chunk',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  const launcher=page.locator('[data-rae-shell],[data-rae-toggle]').first();
  await expect(launcher).toBeVisible();
  await launcher.click();
  await expect(page.locator('[data-rae-panel]')).toBeVisible();
  await expect(page.locator('[data-rae-3d-host]')).toHaveCount(1);
  await page.waitForTimeout(350);
  const state=await page.locator('[data-rae-root]').getAttribute('data-rae-dimensional');
  expect(state).not.toBe('active');
  const resources=await page.evaluate(()=>performance.getEntriesByType('resource').map(entry=>entry.name));
  expect(resources.some(name=>/rae-3d-island|three-r186/i.test(name))).toBeFalsy();
});
