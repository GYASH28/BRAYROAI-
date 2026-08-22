import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('BRAYROAI five-scene site',()=>{
  test('loads a focused five-item navigation and frozen hero',async({page})=>{
    await page.goto('/');
    await expect(page).toHaveTitle(/BRAYROAI/);
    await expect(page.locator('#top h1')).toContainText('Digital, designed');
    await expect(page.locator('.desktop-nav a')).toHaveCount(5);
    await expect(page.locator('[data-scroll-chapter]')).toHaveCount(4);
    await expect(page.locator('#services')).toBeAttached();
    await expect(page.locator('#work')).toBeAttached();
    await expect(page.locator('#plans')).toBeAttached();
    await expect(page.locator('#contact')).toBeAttached();
    await expect(page.locator('#difference')).toHaveCount(0);
    await expect(page.locator('#studio')).toHaveCount(0);
  });

  test('keeps the homepage commercially useful without becoming a pricing wall',async({page})=>{
    await page.goto('/');
    await expect(page.locator('[data-plan]')).toHaveCount(3);
    await expect(page.locator('#plans')).toContainText('₹2,599');
    await expect(page.locator('#plans')).toContainText('₹3,999');
    await expect(page.locator('#plans')).toContainText('₹5,999+');
    await expect(page.locator('#plans')).toContainText('₹2,499/mo');
    await expect(page.locator('#plans a[href="/plans?plan=starter"]')).toHaveCount(1);
  });

  test('shows real proof once and links to the live client build',async({page})=>{
    await page.goto('/');
    await expect(page.locator('img[src="/assets/fakhrimart-case-desktop.png"]')).toHaveCount(1);
    await expect(page.locator('img[src="/assets/fakhrimart-case-mobile.png"]')).toHaveCount(1);
    await expect(page.locator('#work a[href="https://fakhriyarns.vercel.app/"]')).toHaveCount(1);
  });

  test('does not horizontally overflow on desktop or mobile',async({page})=>{
    for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
      await page.setViewportSize(viewport);
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(1);
    }
  });

  test('mobile menu exposes the same five destinations',async({page})=>{
    await page.setViewportSize({width:390,height:844});
    await page.goto('/');
    await page.locator('[data-menu-button]').click();
    await expect(page.locator('[data-menu-button]')).toHaveAttribute('aria-expanded','true');
    await expect(page.locator('.mobile-menu-inner>a[href^="#"]')).toHaveCount(5);
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-menu-button]')).toHaveAttribute('aria-expanded','false');
  });

  test('has no serious or critical automated accessibility violations',async({page})=>{
    await page.goto('/');
    await page.waitForFunction(()=>document.body.classList.contains('hero-ready'));
    const results=await new AxeBuilder({page}).disableRules(['color-contrast']).analyze();
    const blocking=results.violations.filter(item=>item.impact==='serious'||item.impact==='critical');
    expect(blocking,blocking.map(item=>`${item.id}: ${item.help}`).join('\n')).toEqual([]);
  });

  test('dedicated plans route stays available for detail',async({page})=>{
    const response=await page.goto('/plans');
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('body')).toContainText('Website Starter');
  });
});
