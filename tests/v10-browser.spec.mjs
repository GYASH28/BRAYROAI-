import { test, expect } from '@playwright/test';

const clearOpening=async page=>{await page.evaluate(()=>{document.querySelectorAll('.opening-sequence,.scope-open,.founder-open').forEach(n=>n.remove());document.body.classList.remove('polish-opening','hf-intro-active')})};
const openV10=async(page,route='/')=>{await page.goto(route,{waitUntil:'networkidle'});await clearOpening(page);await page.waitForSelector('link[data-continuity-v10]',{state:'attached'});await page.waitForSelector('script[data-continuity-v10]',{state:'attached'});await page.waitForFunction(()=>document.body.classList.contains('v10-ready'))};

test('V10 mounts after V9 and preserves the seven-scene homepage',async({page})=>{
  await openV10(page);
  await expect(page.locator('link[data-continuity-v10][href="/continuity-v10.css"]')).toHaveCount(1);
  await expect(page.locator('script[data-continuity-v10][src="/continuity-v10.js"]')).toHaveCount(1);
  await expect(page.locator('[data-scene]')).toHaveCount(7);
  await expect(page.locator('[data-hf-intro-video]')).toHaveCount(0);
});

test('services support keyboard arrow cycling in V10',async({page})=>{
  await openV10(page);
  const design=page.locator('[data-capability="design"]');
  const engineering=page.locator('[data-capability="engineering"]');
  await design.focus();
  await page.keyboard.press('ArrowRight');
  await expect(engineering).toBeFocused();
  await expect(page.locator('[data-capability-stage]')).toHaveAttribute('data-sc-verify-state','capability:engineering');
  await expect(page.locator('[data-capability-stage]')).toHaveClass(/v10-keyboard-live/);
});

test('pricing focus rail follows focused cards without changing pricing',async({page})=>{
  await openV10(page);
  const grid=page.locator('#plans .pricing-band__grid').first();
  const cards=grid.locator('.pricing-mini');
  await cards.nth(1).focus();
  await expect(grid).toHaveClass(/v10-focus-live/);
  await expect(page.locator('#plans')).toContainText('₹2,599');
  await expect(page.locator('#plans')).toContainText('₹3,999');
  await expect(page.locator('#plans')).toContainText('₹5,999+');
  await expect(page.locator('#plans')).toContainText('₹9,999');
  await expect(page.locator('#plans')).toContainText('₹17,999');
  await expect(page.locator('#plans')).toContainText('₹25K–₹35K+');
});

test('mobile pricing rails receive V10 snap indicators',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await openV10(page);
  const grids=page.locator('#plans .pricing-band__grid');
  await expect(grids).toHaveCount(2);
  await expect(page.locator('#plans .v10-snap-status')).toHaveCount(2);
  await expect(page.locator('#plans .v10-snap-status').first().locator('i')).toHaveCount(3);
});

test('V10 exists on Plans Founder and Terms without adding overflow',async({page})=>{
  for(const route of ['/plans','/founder','/terms']){
    await openV10(page,route);
    await expect(page.locator('body')).toHaveClass(/v10-ready/);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    expect(overflow,route).toBeLessThanOrEqual(1);
  }
});

test('reduced motion disables transition curtain while retaining V10 functionality',async({browser})=>{
  const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1280,height:800}});
  const page=await context.newPage();
  await page.goto('/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.body.classList.contains('v10-ready'));
  await expect(page.locator('[data-capability-stage]')).toBeVisible();
  const display=await page.evaluate(()=>getComputedStyle(document.body,'::after').display);
  expect(display).toBe('none');
  await context.close();
});
