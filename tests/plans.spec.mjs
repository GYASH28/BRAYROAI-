import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Plans page restores both one-time and ongoing pricing paths',async({page})=>{
  await page.goto('/plans.html',{waitUntil:'networkidle'});
  await expect(page).toHaveTitle(/BRAYROAI Plans/);
  await expect(page.locator('[data-price-panel="build"] .price-card')).toHaveCount(3);
  await expect(page.locator('[data-price-panel="ongoing"] .price-card')).toHaveCount(3);
  await expect(page.locator('body')).toContainText('₹9,999');
  await expect(page.locator('body')).toContainText('₹17,999');
  await expect(page.locator('body')).toContainText('₹25K–35K+');
  await expect(page.locator('body')).toContainText('₹2,499');
  await expect(page.locator('body')).toContainText('₹3,999');
  await expect(page.locator('body')).toContainText('₹5,999+');
});

test('pricing choice architecture highlights the balanced option without fake urgency',async({page})=>{
  await page.goto('/plans.html',{waitUntil:'networkidle'});
  await expect(page.locator('[data-price-panel="build"] .price-card--recommended')).toHaveCount(1);
  await expect(page.locator('[data-price-panel="build"] .price-card--recommended')).toContainText('BEST BALANCE');
  const text=(await page.locator('body').innerText()).toLowerCase();
  expect(text).not.toContain('limited time');
  expect(text).not.toContain('countdown');
  expect(text).not.toMatch(/save \d+%/);
});

test('build and ongoing tabs switch without losing the pricing page context',async({page})=>{
  await page.goto('/plans.html#build',{waitUntil:'networkidle'});
  const ongoing=page.locator('[data-price-tab="ongoing"]');
  await ongoing.click();
  await expect(page).toHaveURL(/#ongoing$/);
  await expect(page.locator('[data-price-panel="ongoing"]')).toBeVisible();
  await expect(page.locator('[data-price-panel="build"]')).toBeHidden();
  await expect(ongoing).toHaveAttribute('aria-selected','true');
});

test('Plans page has no serious or critical accessibility violations',async({page})=>{
  await page.goto('/plans.html',{waitUntil:'networkidle'});
  const results=await new AxeBuilder({page}).analyze();
  const blocking=results.violations.filter(v=>['critical','serious'].includes(v.impact));
  expect(blocking,blocking.map(v=>`${v.id}: ${v.help}`).join('\n')).toEqual([]);
});

for(const width of [360,390,768,1440]){
  test(`Plans page has no horizontal overflow at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.goto('/plans.html',{waitUntil:'networkidle'});
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}
