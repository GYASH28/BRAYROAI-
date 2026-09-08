import { test, expect } from '@playwright/test';

const clearOpening=async page=>{
  await page.evaluate(()=>{
    document.querySelectorAll('.opening-sequence,.scope-open,.founder-open').forEach(node=>node.remove());
    document.body.classList.remove('polish-opening','hf-intro-active','is-opening');
  });
};

const openHome=async page=>{
  await page.goto('/',{waitUntil:'networkidle'});
  await clearOpening(page);
  await page.waitForFunction(()=>document.body.classList.contains('home-v19'));
};

test('cinematic motion preserves the original eight homepage scenes with no extra reel',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await openHome(page);
  await expect(page.locator('[data-scene]')).toHaveCount(8);
  await expect(page.locator('[data-v18-reel]')).toHaveCount(0);
  await expect(page.locator('.v18-reel')).toHaveCount(0);
  await expect(page.locator('link[href="/cinematic-v18.css"]')).toHaveCount(1);
  await expect(page.locator('script[src="/cinematic-v18.js"]')).toHaveCount(1);
  for(const selector of ['#top','#services','.editorial-sequence','#work','#ai-systems','#plans','#studio','#contact'])await expect(page.locator(selector)).toHaveCount(1);
});

test('the existing scenes receive continuous smoothed scroll camera variables',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await openHome(page);
  const work=page.locator('#work');
  await work.scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>{
    const node=document.querySelector('#work');
    const p=parseFloat(getComputedStyle(node).getPropertyValue('--v19-p'))||0;
    const y=getComputedStyle(node).getPropertyValue('--v19-work-desktop-y').trim();
    return p>.08 && y!=='';
  },null,{timeout:5000});
  const values=await work.evaluate(node=>({
    p:parseFloat(getComputedStyle(node).getPropertyValue('--v19-p'))||0,
    focus:parseFloat(getComputedStyle(node).getPropertyValue('--v19-focus'))||0,
    mediaY:getComputedStyle(node).getPropertyValue('--v19-work-desktop-y').trim(),
    scale:getComputedStyle(node).getPropertyValue('--v19-work-media-scale').trim()
  }));
  expect(values.p).toBeGreaterThan(.08);
  expect(values.focus).toBeGreaterThanOrEqual(0);
  expect(values.mediaY).not.toBe('');
  expect(values.scale).not.toBe('');
  const translate=await page.locator('#work .work__desktop').evaluate(node=>getComputedStyle(node).translate);
  expect(translate).not.toBe('none');
});

test('hero, services, pricing, founder and contact keep their current UI while gaining scroll direction',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await openHome(page);
  await expect(page.locator('#services [data-v15-stage]')).toHaveCount(1);
  await expect(page.locator('#services [data-v15-control]')).toHaveCount(4);
  await expect(page.locator('#plans [data-v14-rate]')).toHaveCount(3);
  await expect(page.locator('#studio .founder-preview__portrait img')).toHaveCount(1);
  await expect(page.locator('#contact [data-project-type]')).toHaveCount(3);

  for(const selector of ['#services','#plans','#studio','#contact']){
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.waitForTimeout(180);
    const phase=await page.locator(selector).evaluate(node=>getComputedStyle(node).getPropertyValue('--v19-phase').trim());
    expect(phase).not.toBe('');
  }
});

test('reduced motion keeps the original page static and operable',async({browser})=>{
  const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1280,height:800}});
  const page=await context.newPage();
  await openHome(page);
  await expect(page.locator('[data-scene]')).toHaveCount(8);
  await expect(page.locator('[data-v18-reel]')).toHaveCount(0);
  await page.locator('#services [data-v15-control="3"]').click();
  await expect(page.locator('#services')).toHaveAttribute('data-play-state','ai');
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.locator('[data-project-type="ai"]').click();
  await expect(page.locator('[data-project-intent]')).toHaveAttribute('data-sc-verify-state','project:ai');
  const founderTranslate=await page.locator('#studio .founder-preview__portrait').evaluate(node=>getComputedStyle(node).translate);
  expect(['none','0px','0px 0px'].includes(founderTranslate)).toBeTruthy();
  await context.close();
});
