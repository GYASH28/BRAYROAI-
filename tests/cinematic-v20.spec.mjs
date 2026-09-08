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

const cssNumber=async(locator,name)=>Number.parseFloat(await locator.evaluate((node,name)=>getComputedStyle(node).getPropertyValue(name)||'0',name))||0;
const dispatchPointer=async(locator,x=.7,y=.3)=>locator.evaluate((node,{x,y})=>{
  const rect=node.getBoundingClientRect();
  const init={bubbles:true,clientX:rect.left+rect.width*x,clientY:rect.top+rect.height*y,pointerType:'mouse'};
  node.dispatchEvent(new PointerEvent('pointerenter',init));
  node.dispatchEvent(new PointerEvent('pointermove',init));
},{x,y});

test('V20 adds cinematic components without adding homepage sections',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await openHome(page);
  await expect(page.locator('[data-scene]')).toHaveCount(8);
  await expect(page.locator('[data-v18-reel],.v18-reel')).toHaveCount(0);
  await expect(page.locator('[data-v20-lens]')).toHaveCount(1);
  await expect(page.locator('[data-v20-text-cycle]')).toHaveCount(1);
  await expect(page.locator('[data-v20-signal]')).toHaveCount(1);
  await expect(page.locator('[data-v20-selector]')).toHaveCount(1);
  await expect(page.locator('[data-v20-film-gate]')).toHaveCount(1);
  await expect(page.locator('[data-v20-aperture]')).toHaveCount(1);
  await expect(page.locator('[data-v20-data-path]')).toHaveCount(2);
  await expect(page.locator('[data-v20-rate-light]')).toHaveCount(3);
  await expect(page.locator('[data-v20-portrait-scan]')).toHaveCount(1);
  await expect(page.locator('[data-v20-lines]')).toHaveCount(1);
  await expect(page.locator('[data-v20-button-shine]')).toHaveCount(2);
  await expect(page.locator('[data-v20-scene-rail]')).toHaveCount(1);
});

test('scene rail, selector and film polish respond to one continuous journey',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await openHome(page);
  await page.locator('#services').scrollIntoViewIfNeeded();
  const selector=page.locator('[data-v20-selector]');
  const before=await selector.evaluate(node=>getComputedStyle(node).transform);
  await page.locator('[data-v15-control="2"]').click();
  await expect(page.locator('#services')).toHaveAttribute('data-play-state','build');
  await expect.poll(()=>selector.evaluate(node=>getComputedStyle(node).transform)).not.toBe(before);
  await page.locator('#work').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.body.dataset.v20Scene==='work');
  await expect(page.locator('[data-v20-rail-label]')).toHaveText('WORK');
  await expect.poll(()=>page.evaluate(()=>parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--v20-page'))||0)).toBeGreaterThan(.14);
  await page.locator('.editorial-sequence').scrollIntoViewIfNeeded();
  await expect.poll(()=>page.locator('.editorial-sequence').evaluate(node=>getComputedStyle(node).getPropertyValue('--v20-film-scan').trim())).not.toBe('');
});

test('spring pointer polish follows live element positions without layout regression',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await openHome(page);

  const card=page.locator('#ai-systems .v12-product-card').first();
  await card.scrollIntoViewIfNeeded();
  await dispatchPointer(card,.72,.28);
  await expect.poll(()=>cssNumber(card,'--v20-spot-o')).toBeGreaterThan(.55);
  await expect.poll(()=>cssNumber(card,'--v20-local-x')).toBeGreaterThan(55);

  const rate=page.locator('#plans [data-v14-rate]').first();
  await rate.scrollIntoViewIfNeeded();
  await dispatchPointer(rate,.7,.35);
  await expect(rate.locator('[data-v20-rate-light]')).toHaveCount(1);
  await expect.poll(()=>cssNumber(rate,'--v20-spot-o')).toBeGreaterThan(.55);
  expect(await rate.evaluate(node=>getComputedStyle(node,'::after').content)).not.toBe('none');

  await page.locator('#top').scrollIntoViewIfNeeded();
  const cta=page.locator('.primary-action.magnetic').first();
  await dispatchPointer(cta,.84,.65);
  await expect.poll(async()=>Math.abs(await cssNumber(cta,'--v20-mag-x'))).toBeGreaterThan(.5);
});

test('V20 stays free of runtime errors while traversing the full homepage',async({page})=>{
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text())});
  await page.setViewportSize({width:1440,height:900});
  await openHome(page);
  for(const selector of ['#top','#services','.editorial-sequence','#work','#ai-systems','#plans','#studio','#contact']){
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
  }
  expect(errors).toEqual([]);
});

test('V20 overlays do not create horizontal overflow across key viewports',async({page})=>{
  for(const [width,height] of [[320,720],[390,844],[768,1024],[1440,900],[1920,1080]]){
    await page.setViewportSize({width,height});
    await openHome(page);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth),`${width}x${height}`).toBeLessThanOrEqual(1);
  }
});

test('reduced motion keeps decorative motion static and core interactions usable',async({browser})=>{
  const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1280,height:800}});
  const page=await context.newPage();
  await openHome(page);
  await expect(page.locator('[data-scene]')).toHaveCount(8);
  await expect(page.locator('[data-v20-lines]')).toHaveCount(1);
  await expect(page.locator('[data-v20-rate-light]')).toHaveCount(3);
  expect(await page.locator('.v20-signal-field__orbit').first().evaluate(node=>getComputedStyle(node).animationName)).toBe('none');
  expect(await page.locator('.v20-data-path i').first().evaluate(node=>getComputedStyle(node,'::after').animationName)).toBe('none');
  expect(await page.locator('.v20-background-lines i').first().evaluate(node=>getComputedStyle(node).animationName)).toBe('none');
  await page.locator('#services [data-v15-control="3"]').click();
  await expect(page.locator('#services')).toHaveAttribute('data-play-state','ai');
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.locator('[data-project-type="ai"]').click();
  await expect(page.locator('[data-project-intent]')).toHaveAttribute('data-sc-verify-state','project:ai');
  await context.close();
});
