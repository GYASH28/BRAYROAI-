import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('FakhriMart is the only public client case study and uses real captures',async({page})=>{
  await page.goto('/case-studies/fakhrimart.html',{waitUntil:'networkidle'});
  await expect(page).toHaveTitle(/FakhriMart Case Study/);
  await expect(page.locator('h1')).toContainText('FAKHRI');
  await expect(page.locator('h1')).toContainText('MART.');
  await expect(page.locator('img[src="/assets/fakhrimart-case-desktop.png"]')).toHaveCount(1);
  await expect(page.locator('img[src="/assets/fakhrimart-case-mobile.png"]')).toHaveCount(1);
  await expect.poll(async()=>page.locator('img[src="/assets/fakhrimart-case-desktop.png"]').evaluate(img=>img.naturalWidth),{timeout:8000}).toBeGreaterThan(1000);
  await expect(page.locator('a[href="https://fakhriyarns.vercel.app/"]')).not.toHaveCount(0);
  await expect(page.locator('body')).toContainText('A REAL SITE.');
  await expect(page.locator('body')).toContainText('NOT A');
  await expect(page.locator('body')).toContainText('PORTFOLIO PROP.');
});

test('case study avoids unverified performance claims',async({page})=>{
  await page.goto('/case-studies/fakhrimart.html',{waitUntil:'networkidle'});
  const text=(await page.locator('body').innerText()).toLowerCase();
  expect(text).not.toMatch(/sales (?:grew|increased|up)/);
  expect(text).not.toMatch(/revenue (?:grew|increased|up)/);
  expect(text).not.toMatch(/conversion rate (?:grew|increased|up)/);
  expect(text).not.toMatch(/\+\d+%/);
});

test('FakhriMart case study has no serious or critical accessibility violations',async({page})=>{
  await page.goto('/case-studies/fakhrimart.html',{waitUntil:'networkidle'});
  const results=await new AxeBuilder({page}).analyze();
  const blocking=results.violations.filter(v=>['critical','serious'].includes(v.impact));
  expect(blocking,blocking.map(v=>`${v.id}: ${v.help}`).join('\n')).toEqual([]);
});

for(const width of [360,390,768,1440]){
  test(`FakhriMart case study has no horizontal overflow at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.goto('/case-studies/fakhrimart.html',{waitUntil:'networkidle'});
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}
