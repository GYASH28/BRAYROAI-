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
  await page.waitForSelector('[data-v18-reel]');
  await page.waitForFunction(()=>document.body.classList.contains('home-v18'));
};

test('V18 cinematic reel preserves the canonical homepage and mounts four real media shots',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await openHome(page);
  await expect(page.locator('[data-scene]')).toHaveCount(8);
  await expect(page.locator('link[href="/cinematic-v18.css"]')).toHaveCount(1);
  await expect(page.locator('script[src="/cinematic-v18.js"]')).toHaveCount(1);
  const reel=page.locator('[data-v18-reel]');
  await expect(reel).toBeVisible();
  await expect(reel.locator('[data-v18-shot]')).toHaveCount(4);
  await expect(reel.locator('video source')).toHaveAttribute('src','/assets/brayroai-cinematic-opening-silent.mp4');
  await expect(reel.locator('img[src="/assets/brayroai-process-table.webp"]')).toHaveCount(1);
  await expect(reel.locator('img[src="/assets/fakhrimart-case-desktop.png"]')).toHaveCount(1);
  await expect(reel.locator('img[src="/assets/about-yash.webp"]')).toHaveCount(1);
});

test('V18 cinematic playhead follows scroll and advances the media sequence',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await openHome(page);
  const reel=page.locator('[data-v18-reel]');
  await reel.evaluate(node=>{
    const top=node.getBoundingClientRect().top+scrollY;
    const travel=Math.max(node.offsetHeight-innerHeight,1);
    scrollTo(0,top+travel*.7);
  });
  await page.waitForFunction(()=>{
    const reel=document.querySelector('[data-v18-reel]');
    const p=parseFloat(getComputedStyle(reel).getPropertyValue('--v18-reel-progress'))||0;
    return p>.55 && Number(reel.dataset.v18Active)>=2;
  },null,{timeout:5000});
  const progress=await reel.evaluate(node=>parseFloat(getComputedStyle(node).getPropertyValue('--v18-reel-progress'))||0);
  expect(progress).toBeGreaterThan(.55);
  expect(Number(await reel.getAttribute('data-v18-active'))).toBeGreaterThanOrEqual(2);
  const visible=await reel.locator('[data-v18-shot]').evaluateAll(nodes=>nodes.filter(node=>getComputedStyle(node).visibility!=='hidden'&&parseFloat(getComputedStyle(node).opacity)>.01).length);
  expect(visible).toBeGreaterThanOrEqual(1);
  expect(visible).toBeLessThanOrEqual(2);
});

test('V18 reduced motion becomes a readable static media grid instead of a pinned film',async({browser})=>{
  const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1280,height:800}});
  const page=await context.newPage();
  await openHome(page);
  const reel=page.locator('[data-v18-reel]');
  await expect(reel.locator('[data-v18-shot]')).toHaveCount(4);
  const state=await reel.evaluate(node=>({
    height:getComputedStyle(node).height,
    sticky:getComputedStyle(node.querySelector('.v18-reel__sticky')).position,
    videoDisplay:getComputedStyle(node.querySelector('[data-v18-video]')).display,
    shotPositions:[...node.querySelectorAll('[data-v18-shot]')].map(shot=>getComputedStyle(shot).position)
  }));
  expect(state.sticky).toBe('relative');
  expect(state.videoDisplay).toBe('none');
  expect(state.shotPositions.every(value=>value==='relative')).toBeTruthy();
  await context.close();
});
