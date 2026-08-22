import { test, expect } from '@playwright/test';

test.describe('BRAYROAI scroll film behavior',()=>{
  test('activates scenes as the user scrolls',async({page})=>{
    await page.goto('/');
    await page.waitForFunction(()=>document.body.classList.contains('hero-ready'));
    await page.locator('#services').scrollIntoViewIfNeeded();
    await page.waitForTimeout(120);
    await expect(page.locator('body')).toHaveClass(/post-hero-active/);
    await page.locator('#work').scrollIntoViewIfNeeded();
    await page.waitForTimeout(120);
    await expect(page.locator('#work')).toHaveAttribute('data-active','true');
  });

  test('services remain interactive while scroll also directs them',async({page})=>{
    await page.goto('/');
    await page.locator('#services').scrollIntoViewIfNeeded();
    const ai=page.locator('[data-capability="ai"]');
    await ai.click();
    await expect(ai).toHaveAttribute('aria-pressed','true');
    await expect(page.locator('[data-capability-title]')).toHaveText('AI Systems');
  });

  test('motion can be paused without disabling the page',async({page})=>{
    await page.goto('/');
    const button=page.locator('[data-motion-toggle]');
    await button.click();
    await expect(page.locator('body')).toHaveClass(/motion-paused/);
    await expect(button).toHaveAttribute('aria-pressed','true');
  });

  test('theme persists after reload',async({page})=>{
    await page.goto('/');
    const button=page.locator('[data-theme-toggle]');
    await button.click();
    const theme=await page.locator('html').getAttribute('data-theme');
    expect(theme).toBe('light');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  });

  test('reduced motion produces a readable non-sticky cut',async({page})=>{
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('/');
    await expect(page.locator('#services .scene-stick')).toHaveCSS('position','relative');
    await expect(page.locator('#contact h2')).toBeAttached();
  });

  test('runtime produces no uncaught page errors during a full pass',async({page})=>{
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto('/');
    for(const id of ['services','work','plans','contact']){
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await page.waitForTimeout(90);
    }
    expect(errors).toEqual([]);
  });
});
