import { test, expect } from '@playwright/test';

const ready=async page=>{await page.goto('/',{waitUntil:'networkidle'});await page.waitForFunction(()=>document.body.classList.contains('hero-ready'));await page.waitForFunction(()=>document.body.classList.contains('experience-ready'));await page.evaluate(()=>document.documentElement.style.scrollBehavior='auto')};
const go=async(page,id)=>{await page.evaluate(id=>document.querySelector(`#${id}`)?.scrollIntoView({block:'start',behavior:'auto'}),id);await page.waitForTimeout(140)};

test.describe('BRAYROAI authored scroll film',()=>{
  test('activates the five narrative scenes in both directions',async({page})=>{
    await ready(page);
    for(const id of ['thesis','services','work','plans','contact']){
      await go(page,id);
      await expect(page.locator(`#${id}`)).toHaveAttribute('data-active','');
    }
    for(const id of ['plans','work','services','thesis']){
      await go(page,id);
      await expect(page.locator(`#${id}`)).toHaveAttribute('data-active','');
    }
  });

  test('services stay directly interactive while scroll can also direct the system',async({page})=>{
    await ready(page);await go(page,'services');
    await page.locator('[data-service="ai"]').click();
    await expect(page.locator('[data-service-title]')).toHaveText('AI Systems');
    await expect(page.locator('[data-service-stage]')).toHaveAttribute('data-active','ai');
    await expect(page.locator('[data-service="ai"]')).toHaveAttribute('aria-pressed','true');
    await page.locator('[data-service="product"]').click();
    await expect(page.locator('[data-service-title]')).toHaveText('Product Design');
  });

  test('ambient motion can be paused without disabling navigation or content',async({page})=>{
    await ready(page);await go(page,'services');
    const button=page.locator('[data-motion-toggle]');
    await button.click();
    await expect(page.locator('body')).toHaveClass(/motion-paused/);
    await expect(button).toHaveAttribute('aria-pressed','true');
    await go(page,'work');
    await expect(page.locator('#work')).toHaveAttribute('data-active','');
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed','false');
  });

  test('theme preference persists after a reload',async({page})=>{
    await ready(page);
    const button=page.locator('[data-theme-toggle]');
    await button.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme','light');
    await page.reload({waitUntil:'domcontentloaded'});
    await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  });

  test('reduced motion resolves the homepage into readable non-sticky document flow',async({page})=>{
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto('/',{waitUntil:'domcontentloaded'});
    await expect(page.locator('[data-particle-field]')).toHaveCSS('display','none');
    await expect(page.locator('#services .scene-pin')).not.toHaveCSS('position','sticky');
    await expect(page.locator('#work h2')).toBeVisible();
    await expect(page.locator('[data-motion-toggle]')).toHaveCSS('display','none');
  });

  test('fast full-pass scrolling produces no uncaught page errors',async({page})=>{
    const errors=[];page.on('pageerror',error=>errors.push(String(error)));
    await ready(page);
    for(const id of ['thesis','services','work','plans','contact','plans','services','thesis']){await go(page,id)}
    expect(errors).toEqual([]);
  });

  test('WebGL has a resilient non-WebGL fallback path',async({browser})=>{
    const context=await browser.newContext({viewport:{width:1280,height:800}});
    const page=await context.newPage();
    await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){if(type==='webgl')return null;return original.call(this,type,...args)}});
    await page.goto('/',{waitUntil:'domcontentloaded'});
    await page.mouse.wheel(0,800);
    await page.waitForTimeout(120);
    await expect(page.locator('body')).toHaveAttribute('data-particle-mode','fallback');
    await expect(page.locator('#thesis h2')).toBeVisible();
    await context.close();
  });
});
