import { test, expect } from '@playwright/test';

const ready=async page=>{
  await page.goto('/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.body.classList.contains('hero-ready'));
  await page.waitForFunction(()=>document.body.classList.contains('experience-ready'));
};
const settle=page=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
const scrollProgress=async(page,selector,progress)=>{
  await page.evaluate(({selector,progress})=>{document.documentElement.style.scrollBehavior='auto';const section=document.querySelector(selector);const top=section.getBoundingClientRect().top+scrollY;const range=Math.max(0,section.getBoundingClientRect().height-innerHeight);window.scrollTo(0,top+range*progress)},{selector,progress});
  await settle(page);
};

test('desktop chapters pin only their inner scene and report real progress',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await ready(page);
  const sticky=page.locator('#starting-point .chapter-sticky');
  expect(await sticky.evaluate(element=>getComputedStyle(element).position)).toBe('sticky');
  await scrollProgress(page,'#starting-point',.12);
  const early=Number(await page.locator('#starting-point').getAttribute('data-chapter-progress'));
  await scrollProgress(page,'#starting-point',.74);
  const late=Number(await page.locator('#starting-point').getAttribute('data-chapter-progress'));
  expect(early).toBeGreaterThanOrEqual(0);expect(late).toBeGreaterThan(early);expect(late).toBeLessThanOrEqual(1);
  await expect(page.locator('body')).toHaveAttribute('data-active-chapter','starting');
});

test('scroll progression selects capability meaning and a click pauses auto-selection',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await ready(page);
  await scrollProgress(page,'#services',.1);
  await expect(page.locator('[data-capability="web"]')).toHaveAttribute('aria-pressed','true');
  await scrollProgress(page,'#services',.88);
  await expect(page.locator('[data-capability="ai"]')).toHaveAttribute('aria-pressed','true');
  await page.locator('[data-capability="product"]').click();
  await expect(page.locator('.capability-stage')).toHaveClass(/is-mode-product/);
  await scrollProgress(page,'#services',.96);
  await expect(page.locator('.capability-stage')).toHaveClass(/is-mode-product/);
  await expect(page.locator('.capability-copy')).toContainText('next step');
});

test('FakhriMart scene advances from desktop emergence to settled proof',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await ready(page);
  await scrollProgress(page,'#work',.12);
  const frame=page.locator('.proof-stage');
  await expect(frame).toHaveClass(/is-desktop/);
  const early=Number(await frame.evaluate(element=>getComputedStyle(element).getPropertyValue('--proof-progress')));
  await scrollProgress(page,'#work',.82);
  await expect(frame).toHaveClass(/is-settled/);
  const late=Number(await frame.evaluate(element=>getComputedStyle(element).getPropertyValue('--proof-progress')));
  expect(late).toBeGreaterThan(early);
});

test('particle field uses the shared scheduler and follows the active profile',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await ready(page);
  await scrollProgress(page,'#difference',.55);
  await expect(page.locator('body')).toHaveAttribute('data-active-chapter','difference');
  const state=await page.evaluate(()=>({
    canvas:document.querySelector('[data-particle-field]').getContext('2d')!==null,
    frameType:typeof window.__BRAYROAI__.frame,
    pointCount:window.__BRAYROAI__.particles.points.length,
    profile:window.__BRAYROAI__.narrative.activeKey
  }));
  expect(state.canvas).toBeTruthy();expect(state.frameType).toBe('number');expect(state.pointCount).toBeGreaterThan(40);expect(state.profile).toBe('difference');
});

test('fine pointer labels the real proof while its link stays interactive',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await ready(page);await scrollProgress(page,'#work',.5);
  const frame=page.locator('.proof-stage');await frame.hover({position:{x:400,y:250}});
  await expect(page.locator('[data-context-cursor]')).toHaveClass(/is-visible/);
  await expect(frame.locator('a[href="https://fakhriyarns.vercel.app/"]')).toBeVisible();
});

test('reveals resolve content rather than leaving chapters concealed',async({page})=>{
  await ready(page);
  for(const selector of ['#starting-point','#difference','#services','#work','#plans','#studio','#contact']){
    await scrollProgress(page,selector,.4);
    const item=page.locator(`${selector} .reveal-item`).first();
    await expect.poll(async()=>Number(await item.evaluate(element=>getComputedStyle(element).opacity))).toBeGreaterThan(.9);
  }
});

test('experience preserves native document scrolling',async({page})=>{
  await ready(page);
  const behavior=await page.evaluate(()=>({
    htmlOverflow:getComputedStyle(document.documentElement).overflowY,
    bodyOverflow:getComputedStyle(document.body).overflowY,
    scrollHeight:document.scrollingElement.scrollHeight,
    viewport:innerHeight,
    ready:document.body.classList.contains('experience-ready')
  }));
  expect(behavior.ready).toBeTruthy();expect(behavior.htmlOverflow).not.toBe('hidden');expect(behavior.bodyOverflow).not.toBe('hidden');expect(behavior.scrollHeight).toBeGreaterThan(behavior.viewport*7);
  await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,700)});
  await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(0);
});
