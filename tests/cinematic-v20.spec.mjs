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
  await page.waitForFunction(()=>document.body.classList.contains('home-v20'));
};

test('V20 adds cinematic components without adding homepage sections',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await openHome(page);
  await expect(page.locator('[data-scene]')).toHaveCount(8);
  await expect(page.locator('[data-v18-reel],.v18-reel')).toHaveCount(0);
  await expect(page.locator('[data-v20-lens]')).toHaveCount(1);
  await expect(page.locator('[data-v20-signal]')).toHaveCount(1);
  await expect(page.locator('[data-v20-film-gate]')).toHaveCount(1);
  await expect(page.locator('[data-v20-aperture]')).toHaveCount(1);
  await expect(page.locator('[data-v20-data-path]')).toHaveCount(2);
  await expect(page.locator('[data-v20-rate-light]')).toHaveCount(3);
  await expect(page.locator('[data-v20-portrait-scan]')).toHaveCount(1);
  await expect(page.locator('[data-v20-scene-rail]')).toHaveCount(1);
});

test('scene rail and film polish respond to the same scroll journey',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await openHome(page);
  await page.locator('#work').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.body.dataset.v20Scene==='work');
  await expect(page.locator('[data-v20-rail-label]')).toHaveText('WORK');
  const workPage=await page.evaluate(()=>parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--v20-page'))||0);
  expect(workPage).toBeGreaterThan(.2);

  await page.locator('.editorial-sequence').scrollIntoViewIfNeeded();
  await page.waitForTimeout(180);
  const scan=await page.locator('.editorial-sequence').evaluate(node=>getComputedStyle(node).getPropertyValue('--v20-film-scan').trim());
  expect(scan).not.toBe('');
});

test('pointer polish updates local light fields, pricing light and magnetic controls without changing layout',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await openHome(page);

  const card=page.locator('#ai-systems .v12-product-card').first();
  await card.scrollIntoViewIfNeeded();
  const box=await card.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box.x+box.width*.72,box.y+box.height*.28);
  const vars=await card.evaluate(node=>({
    x:getComputedStyle(node).getPropertyValue('--v20-local-x').trim(),
    y:getComputedStyle(node).getPropertyValue('--v20-local-y').trim(),
    o:getComputedStyle(node).getPropertyValue('--v20-spot-o').trim()
  }));
  expect(vars.x).not.toBe('');
  expect(vars.y).not.toBe('');
  expect(vars.o).toBe('1');

  const rate=page.locator('#plans [data-v14-rate]').first();
  await rate.scrollIntoViewIfNeeded();
  const rateBox=await rate.boundingBox();
  expect(rateBox).not.toBeNull();
  await page.mouse.move(rateBox.x+rateBox.width*.7,rateBox.y+rateBox.height*.35);
  await expect(rate.locator('[data-v20-rate-light]')).toHaveCount(1);
  const rateVars=await rate.evaluate(node=>({
    x:getComputedStyle(node).getPropertyValue('--v20-local-x').trim(),
    o:getComputedStyle(node).getPropertyValue('--v20-spot-o').trim(),
    authoredAfter:getComputedStyle(node,'::after').content
  }));
  expect(rateVars.x).not.toBe('');
  expect(rateVars.o).toBe('1');
  expect(rateVars.authoredAfter).not.toBe('none');

  await page.locator('#top').scrollIntoViewIfNeeded();
  const cta=page.locator('.primary-action.magnetic').first();
  const ctaBox=await cta.boundingBox();
  expect(ctaBox).not.toBeNull();
  await page.mouse.move(ctaBox.x+ctaBox.width*.84,ctaBox.y+ctaBox.height*.65);
  const magnetic=await cta.evaluate(node=>getComputedStyle(node).getPropertyValue('--v20-mag-x').trim());
  expect(magnetic).not.toBe('');
});

test('V20 stays free of runtime errors while traversing the full homepage',async({page})=>{
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text())});
  await page.setViewportSize({width:1440,height:900});
  await openHome(page);
  for(const selector of ['#top','#services','.editorial-sequence','#work','#ai-systems','#plans','#studio','#contact']){
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.waitForTimeout(90);
  }
  expect(errors).toEqual([]);
});

test('V20 overlays do not create horizontal overflow across key viewports',async({page})=>{
  for(const [width,height] of [[320,720],[390,844],[768,1024],[1440,900],[1920,1080]]){
    await page.setViewportSize({width,height});
    await openHome(page);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    expect(overflow,`${width}x${height}`).toBeLessThanOrEqual(1);
  }
});

test('reduced motion keeps V20 decorative components static and core interactions usable',async({browser})=>{
  const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1280,height:800}});
  const page=await context.newPage();
  await openHome(page);
  await expect(page.locator('[data-scene]')).toHaveCount(8);
  await expect(page.locator('[data-v20-lens]')).toHaveCount(1);
  await expect(page.locator('[data-v20-rate-light]')).toHaveCount(3);
  const orbitAnimation=await page.locator('.v20-signal-field__orbit').first().evaluate(node=>getComputedStyle(node).animationName);
  const dataAnimation=await page.locator('.v20-data-path i').first().evaluate(node=>getComputedStyle(node,'::after').animationName);
  expect(orbitAnimation).toBe('none');
  expect(dataAnimation).toBe('none');
  await page.locator('#services [data-v15-control="3"]').click();
  await expect(page.locator('#services')).toHaveAttribute('data-play-state','ai');
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.locator('[data-project-type="ai"]').click();
  await expect(page.locator('[data-project-intent]')).toHaveAttribute('data-sc-verify-state','project:ai');
  await context.close();
});
