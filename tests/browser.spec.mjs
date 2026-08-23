import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const waitHome=async page=>{await page.goto('/',{waitUntil:'networkidle'});await page.waitForFunction(()=>document.body.classList.contains('hero-ready'));await page.waitForFunction(()=>document.body.classList.contains('experience-ready'))};
const routes=[['/services','One direction.'],['/work','Fewer claims.'],['/plans','Accessible entry.'],['/contact','Bring the rough brief.']];

test.describe('BRAYROAI rebuilt public experience',()=>{
  test('keeps the latest launch film visible long enough to be perceived',async({page})=>{
    await page.goto('/',{waitUntil:'domcontentloaded'});
    await page.waitForTimeout(1250);
    const mid=await page.locator('[data-loader]').evaluate(el=>({opacity:Number(getComputedStyle(el).opacity),visibility:getComputedStyle(el).visibility}));
    expect(mid.visibility).toBe('visible');
    expect(mid.opacity).toBeGreaterThan(.8);
    await page.waitForTimeout(3200);
    const end=await page.locator('[data-loader]').evaluate(el=>({opacity:Number(getComputedStyle(el).opacity),visibility:getComputedStyle(el).visibility}));
    expect(end.opacity).toBeLessThan(.1);
    expect(end.visibility).toBe('hidden');
  });

  test('keeps the frozen hero and exposes only the five primary destinations',async({page})=>{
    await waitHome(page);
    await expect(page.locator('#top h1')).toContainText('Digital, designed');
    const labels=await page.locator('.desktop-nav a').allTextContents();
    expect(labels.map(v=>v.trim())).toEqual(['Home','Services','Work','Plans','Contact']);
    await expect(page.locator('[data-scroll-chapter]')).toHaveCount(5);
    const ids=await page.locator('[data-scroll-chapter]').evaluateAll(nodes=>nodes.map(n=>n.id));
    expect(ids).toEqual(['thesis','services','work','plans','contact']);
  });

  test('keeps commercial facts clear without turning the homepage into a pricing dashboard',async({page})=>{
    await waitHome(page);
    const text=await page.locator('body').innerText();
    for(const price of ['₹2,599','₹3,999','₹5,999+'])expect(text).toContain(price);
    expect(text).toContain('Every plan below is a complete website build');
    expect(text).toContain('not a maintenance subscription');
    expect(text).not.toContain('₹9,999');
    expect(text).not.toContain('₹17,999');
    await expect(page.locator('a[href="https://fakhriyarns.vercel.app/"]')).toHaveCount(1);
    await expect(page.locator('a[href="https://github.com/GYASH28/LERNIOAI"]')).toHaveCount(1);
    await expect(page.locator('a[href="https://github.com/GYASH28/B.R.A.C.E"]')).toHaveCount(1);
  });

  test('dedicated plans page makes the one-time website-build model explicit',async({page})=>{
    await page.goto('/plans',{waitUntil:'domcontentloaded'});
    const text=await page.locator('main').innerText();
    expect(text).toContain('Every plan on this page is for making a complete website');
    expect(text).toContain('These are not monthly maintenance plans');
    await expect(page.locator('[data-plan-row]')).toHaveCount(3);
    await expect(page.locator('[data-plan-row="business"]')).toHaveClass(/is-featured/);
  });

  test('all four deep destinations build as real pages',async({page})=>{
    for(const [route,copy] of routes){
      const response=await page.goto(route,{waitUntil:'domcontentloaded'});
      expect(response?.ok(),route).toBeTruthy();
      await expect(page.locator('main')).toContainText(copy);
      const canonical=await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toContain(route);
    }
  });

  test('does not horizontally overflow at master-prompt breakpoints',async({page})=>{
    const sizes=[[320,568],[360,800],[375,812],[390,844],[412,915],[430,932],[768,1024],[1280,800],[1440,900]];
    for(const [width,height] of sizes){
      await page.setViewportSize({width,height});
      await page.goto('/',{waitUntil:'domcontentloaded'});
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
      expect(overflow,`${width}x${height}`).toBeLessThanOrEqual(1);
    }
  });

  test('deep pages reflow without horizontal overflow on small mobile',async({page})=>{
    await page.setViewportSize({width:320,height:720});
    for(const [route] of routes){
      await page.goto(route,{waitUntil:'domcontentloaded'});
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
      expect(overflow,route).toBeLessThanOrEqual(1);
    }
  });

  test('mobile navigation exposes the same five destinations',async({page})=>{
    await page.setViewportSize({width:390,height:844});
    await waitHome(page);
    const button=page.locator('[data-menu-button]');
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded','true');
    const labels=await page.locator('.mobile-menu-inner>a:not(.mobile-contact)').allTextContents();
    expect(labels.map(v=>v.replace(/^\d+\s*/,'').trim())).toEqual(['Home','Services','Work','Plans','Contact']);
    await page.keyboard.press('Escape');
    await expect(button).toHaveAttribute('aria-expanded','false');
  });

  test('homepage has no serious or critical automated accessibility violations',async({page})=>{
    await waitHome(page);
    const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
    const blocking=results.violations.filter(v=>['serious','critical'].includes(v.impact));
    expect(blocking).toEqual([]);
  });

  test('deep pages have no serious or critical automated accessibility violations',async({page})=>{
    for(const [route] of routes){
      await page.goto(route,{waitUntil:'networkidle'});
      const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
      const blocking=results.violations.filter(v=>['serious','critical'].includes(v.impact));
      expect(blocking,route).toEqual([]);
    }
  });

  test('keyboard can reach the primary project action',async({page})=>{
    await page.goto('/contact',{waitUntil:'domcontentloaded'});
    for(let i=0;i<14;i++){
      await page.keyboard.press('Tab');
      const text=await page.evaluate(()=>document.activeElement?.textContent?.replace(/\s+/g,' ').trim()||'');
      if(text.includes('Start on WhatsApp'))return;
    }
    throw new Error('Primary WhatsApp action was not reachable in keyboard order');
  });
});
