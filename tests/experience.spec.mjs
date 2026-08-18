import { test, expect } from '@playwright/test';

async function ready(page){
  await page.goto('/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.body.classList.contains('hero-ready'));
  await page.waitForFunction(()=>document.body.classList.contains('experience-ready'));
  await page.waitForFunction(()=>document.body.classList.contains('commercial-ready'));
}

test('v5 experience layer is present without replacing core content', async ({page}) => {
  await ready(page);
  await expect(page.locator('.chapter-signal')).toHaveCount(9);
  await expect(page.locator('.hero-signal-deck')).toHaveCount(1);
  await expect(page.locator('.studio-matrix')).toHaveCount(1);
  await expect(page.locator('.studio-matrix > div')).toHaveCount(4);
  await expect(page.locator('.project-fit-rail')).toHaveCount(1);
  await expect(page.locator('.experience-word')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveCount(1);
});

test('chapter progress actually scrubs with scroll instead of being decorative-only', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  await ready(page);
  const section=page.locator('#lab');
  const before=Number(await section.evaluate(el=>getComputedStyle(el).getPropertyValue('--chapter-progress')||0));
  await section.evaluate(el=>{
    document.documentElement.style.scrollBehavior='auto';
    window.scrollTo(0,el.offsetTop);
  });
  await expect.poll(async()=>Number(await section.evaluate(el=>getComputedStyle(el).getPropertyValue('--chapter-progress')||0)),{timeout:3000}).toBeGreaterThan(.05);
  const after=Number(await section.evaluate(el=>getComputedStyle(el).getPropertyValue('--chapter-progress')||0));
  expect(after).toBeGreaterThan(before);
  expect(after).toBeLessThanOrEqual(1);
});

test('capability panels expose the staged BRAYROAI transition contract', async ({page}) => {
  await ready(page);
  await page.locator('#services').scrollIntoViewIfNeeded();

  const panels=page.locator('.cap-visual');
  await expect(panels).toHaveCount(4);
  await expect(page.locator('.cap-visual.is-active')).toHaveCount(1);

  const styles=await panels.evaluateAll(elements=>elements.map(el=>{
    const style=getComputedStyle(el);
    return {
      property:style.transitionProperty,
      duration:style.transitionDuration,
      clip:style.clipPath
    };
  }));

  for(const style of styles){
    expect(style.property).toContain('opacity');
    expect(style.property).toContain('transform');
    expect(style.property).toContain('clip-path');
    expect(style.property).toContain('filter');
    expect(style.duration.split(',').some(value=>parseFloat(value)>=.45)).toBeTruthy();
    expect(style.clip).not.toBe('none');
  }
});

test('project and client proof surfaces render persisted real FakhriMart captures', async ({page}) => {
  await ready(page);
  await page.locator('#work').scrollIntoViewIfNeeded();
  const desktop=page.locator('.project-screen img[src="/assets/fakhrimart-case-desktop.png"]');
  const mobile=page.locator('.project-phone img[src="/assets/fakhrimart-case-mobile.png"]');
  await expect(desktop).toHaveCount(1);
  await expect(mobile).toHaveCount(1);
  await expect.poll(async()=>desktop.evaluate(img=>img.naturalWidth),{timeout:8000}).toBeGreaterThan(1000);
  await expect.poll(async()=>mobile.evaluate(img=>img.naturalWidth),{timeout:8000}).toBeGreaterThan(300);

  await page.locator('#client-proof').scrollIntoViewIfNeeded();
  await expect(page.locator('.live-browser > img[src="/assets/fakhrimart-case-desktop.png"]')).toHaveCount(1);
  await expect(page.locator('.live-phone > img[src="/assets/fakhrimart-case-mobile.png"]')).toHaveCount(1);
});

test('pointer depth remains a fine-pointer progressive enhancement', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  await ready(page);
  await page.locator('#lab').scrollIntoViewIfNeeded();
  const card=page.locator('.lab-card.interactive-surface').nth(1);
  await expect(card).toBeVisible();
  const box=await card.boundingBox();
  expect(box).not.toBeNull();
  const finePointer=await page.evaluate(()=>matchMedia('(pointer:fine)').matches);

  /* Dispatch on the actual interactive surface so the test verifies the listener contract
     without depending on headless pointer hit-testing through animated/overlapping children. */
  await card.dispatchEvent('pointermove',{clientX:box.x+box.width*.8,clientY:box.y+box.height*.3,pointerType:'mouse'});
  await page.waitForTimeout(60);
  const moved=await card.evaluate(el=>getComputedStyle(el).getPropertyValue('--pointer-x').trim());
  if(finePointer){
    expect(Math.abs(Number(moved))).toBeGreaterThan(.1);
    await card.dispatchEvent('pointerleave',{pointerType:'mouse'});
    await page.waitForTimeout(60);
    const reset=await card.evaluate(el=>getComputedStyle(el).getPropertyValue('--pointer-x').trim());
    expect(Number(reset)).toBe(0);
  }else{
    expect(['','0','0.000'].includes(moved)).toBeTruthy();
  }
});

test('reduced motion keeps the v5 content while removing motion-dependent behavior', async ({browser}) => {
  const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1280,height:800}});
  const page=await context.newPage();
  await ready(page);
  await expect(page.locator('.studio-matrix')).toBeVisible();
  const capTransition=await page.locator('[data-cap-panel="0"]').evaluate(el=>getComputedStyle(el).transitionDuration);
  expect(capTransition.split(',').every(value=>parseFloat(value)===0)).toBeTruthy();
  const card=page.locator('.lab-card').nth(1);
  await card.scrollIntoViewIfNeeded();
  const box=await card.boundingBox();
  if(box) await page.mouse.move(box.x+box.width*.8,box.y+box.height*.3);
  await page.waitForTimeout(100);
  const pointer=await card.evaluate(el=>getComputedStyle(el).getPropertyValue('--pointer-x').trim());
  expect(['','0','0.000'].includes(pointer)).toBeTruthy();
  await context.close();
});
