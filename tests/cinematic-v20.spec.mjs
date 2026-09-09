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
  await page.waitForFunction(()=>document.documentElement.dataset.v21CinematicBridge==='true');
};

const expectNoHorizontalOverflow=async page=>{
  const metrics=await page.evaluate(()=>({
    doc:document.documentElement.scrollWidth,
    viewport:document.documentElement.clientWidth,
    body:document.body.scrollWidth
  }));
  expect(Math.max(metrics.doc,metrics.body)).toBeLessThanOrEqual(metrics.viewport+2);
};

test('V20 cinematic runtime is bridged onto eight V21 commercial scenes',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await openHome(page);

  await expect(page.locator('[data-scene]')).toHaveCount(8);
  for(const scene of ['hero','growth-services','growth-engine','brayro-os','work','process','founder','contact']){
    await expect(page.locator(`[data-scene="${scene}"]`)).toHaveCount(1);
  }
  await expect(page.locator('#services')).toContainText('BRAYRO GROWTH ENGINE');
  await expect(page.locator('#services')).not.toHaveAttribute('data-v15-play','');
  await expect(page.locator('#services')).not.toHaveAttribute('data-v14-reel','');
  await expect(page.locator('#services')).not.toHaveAttribute('data-v13-ledger','');

  await expect(page.locator('link[href="/cinematic-v20.css"]')).toHaveCount(1);
  await expect(page.locator('script[src="/cinematic-v20.js"]')).toHaveCount(1);
  await expect(page.locator('link[href="/v21-cinematic-bridge.css"]')).toHaveCount(1);
  await expect(page.locator('script[src="/v21-cinematic-bridge.js"]')).toHaveCount(1);
  await expect(page.locator('[data-v20-scene-rail]')).toHaveCount(1);
  await expect(page.locator('[data-v20-rail-dot]')).toHaveCount(8);
  await expect(page.locator('[data-v20-lens]')).toHaveCount(1);
  await expect(page.locator('[data-v20-text-cycle]')).toHaveCount(1);
  await expect(page.locator('#services [data-v20-signal]')).toHaveCount(1);
  await expect(page.locator('[data-ig-demo] .v21-system-pulse')).toHaveCount(1);
});

test('scene rail follows the V21 solutions, Growth Engine, OS, proof and delivery chapters',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await openHome(page);

  for(const [selector,label] of [
    ['#services','SOLUTIONS'],
    ['#growth-engine','GROWTH ENGINE'],
    ['#brayro-os','BRAYRO OS'],
    ['#work','WORK'],
    ['[data-scene="process"]','PROCESS'],
    ['#studio','FOUNDER'],
    ['#contact','CONTACT']
  ]){
    await page.locator(selector).scrollIntoViewIfNeeded();
    await expect.poll(()=>page.evaluate(()=>document.body.dataset.v20Scene||'')).not.toBe('');
    await expect.poll(()=>page.locator('[data-v20-rail-label]').textContent()).toBe(label);
  }
});

test('V21 bridge gives new growth-system surfaces spring spotlight feedback',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await openHome(page);
  const demo=page.locator('[data-ig-demo]');
  await demo.scrollIntoViewIfNeeded();
  const box=await demo.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box.x+box.width*.72,box.y+Math.min(box.height*.35,260));
  await expect.poll(()=>demo.evaluate(node=>Number.parseFloat(getComputedStyle(node).getPropertyValue('--v21-spot-o'))||0)).toBeGreaterThan(.45);
  await expect.poll(()=>demo.evaluate(node=>Number.parseFloat(getComputedStyle(node).getPropertyValue('--v21-spot-x'))||0)).toBeGreaterThan(55);

  await page.locator('[data-ig-next]').click();
  await expect(page.locator('[data-ig-demo] .v21-system-pulse')).toHaveAttribute('data-state','moving');
});

test('V20 + V21 runtime stays error-free through the core commercial journey',async({page})=>{
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text())});
  await page.setViewportSize({width:1440,height:900});
  await openHome(page);
  for(const selector of ['#top','#services','#growth-engine','#brayro-os','#work','[data-scene="process"]','#studio','#contact']){
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
  }
  await page.locator('#growth-engine [data-ig-next]').click();
  expect(errors).toEqual([]);
});

test('cinematic bridge creates no horizontal overflow across key viewports',async({page})=>{
  for(const [width,height] of [[320,720],[390,844],[768,1024],[1440,900],[1920,1080]]){
    await page.setViewportSize({width,height});
    await openHome(page);
    await expectNoHorizontalOverflow(page);
  }
});

test('reduced motion keeps V21 cinematic bridge static and core controls usable',async({browser})=>{
  const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1280,height:800}});
  const page=await context.newPage();
  await openHome(page);
  await expect(page.locator('[data-scene]')).toHaveCount(8);
  await expect(page.locator('#services [data-v20-signal]')).toHaveCount(1);
  await expect(page.locator('[data-ig-demo] .v21-system-pulse')).toHaveCount(1);
  expect(await page.locator('.v21-system-pulse i').first().evaluate(node=>getComputedStyle(node).animationName)).toBe('none');
  await page.locator('#growth-engine [data-ig-play]').click();
  await expect(page.locator('#growth-engine [data-ig-progress]')).toContainText('STEP 02');
  await context.close();
});

test('homepage remains lean and skip links stay keyboard-only',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/',{waitUntil:'networkidle'});
  await expect(page.locator('link[href="/scrollcraft.css"]')).toHaveCount(0);
  await expect(page.locator('script[src="/scrollcraft.js"]')).toHaveCount(0);
  await expect(page.locator('[data-v20-text-cycle]')).toHaveCount(1);
  await expect(page.locator('img.hero__background').first()).toHaveAttribute('fetchpriority','high');

  await page.goto('/founder',{waitUntil:'networkidle'});
  const skip=page.locator('.skip-link');
  await expect(skip).toHaveCount(1);
  const hidden=await skip.evaluate(node=>({opacity:getComputedStyle(node).opacity,pointer:getComputedStyle(node).pointerEvents}));
  expect(hidden.opacity).toBe('0');
  expect(hidden.pointer).toBe('none');
  await skip.focus();
  await expect.poll(()=>skip.evaluate(node=>getComputedStyle(node).opacity)).toBe('1');
  await expect.poll(()=>skip.evaluate(node=>getComputedStyle(node).pointerEvents)).toBe('auto');
});
