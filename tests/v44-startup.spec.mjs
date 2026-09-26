import {test,expect} from '@playwright/test';

test('startup keeps reveal and signature enhancement off the critical landing path',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/',{waitUntil:'networkidle'});
  await page.waitForTimeout(500);

  const before=await page.evaluate(()=>performance.getEntriesByType('resource').map(entry=>entry.name));
  expect(before.some(name=>/signature-scenes/i.test(name))).toBeFalsy();
  await expect(page.locator('#plans [data-reveal]').first()).not.toHaveClass(/is-visible/);

  await page.locator('#services').scrollIntoViewIfNeeded();
  await expect.poll(async()=>page.evaluate(()=>performance.getEntriesByType('resource').map(entry=>entry.name).some(name=>/signature-scenes/i.test(name))),{timeout:8000}).toBeTruthy();

  await page.locator('#plans').scrollIntoViewIfNeeded();
  await expect(page.locator('#plans [data-reveal]').first()).toHaveClass(/is-visible/);
});

test('hash navigation arms reveal choreography without a timeout bootstrap',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/#plans',{waitUntil:'domcontentloaded'});
  await expect(page.locator('#plans [data-reveal]').first()).toHaveClass(/is-visible/);
});
