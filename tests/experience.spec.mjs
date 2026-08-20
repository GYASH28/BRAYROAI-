import { test, expect } from '@playwright/test';

const ready=async page=>{
  await page.goto('/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.body.classList.contains('hero-ready'));
  await page.waitForFunction(()=>document.body.classList.contains('experience-ready'));
};

const scrollScene=async(page,selector,p)=>{
  await page.evaluate(({selector,p})=>{
    document.documentElement.style.scrollBehavior='auto';
    const el=document.querySelector(selector);
    const rect=el.getBoundingClientRect();
    const top=rect.top+window.scrollY;
    const distance=Math.max(1,rect.height-innerHeight);
    window.scrollTo(0,top+distance*p);
  },{selector,p});
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
};

test('service moments enter, hold, then leave the camera',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await ready(page);
  await scrollScene(page,'#services',.125);
  const held=page.locator('[data-service-moment]').first();
  await expect.poll(async()=>Number(await held.evaluate(el=>getComputedStyle(el).opacity))).toBeGreaterThan(.9);
  await expect(held).toHaveClass(/is-current/);
  await scrollScene(page,'#services',.24);
  await expect.poll(async()=>held.evaluate(el=>el.style.transform)).toContain('translate3d(-');
});

test('work transitions from real browser to split build layers',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await ready(page);
  await scrollScene(page,'#work',.40);
  await expect(page.locator('.work-stage')).toHaveAttribute('data-work-phase','hold');
  await expect.poll(async()=>Number(await page.locator('.work-stage').evaluate(el=>getComputedStyle(el).getPropertyValue('--work-fill')))).toBeGreaterThan(.9);
  await scrollScene(page,'#work',.78);
  await expect(page.locator('.work-stage')).toHaveAttribute('data-work-phase','split');
  await expect.poll(async()=>Number(await page.locator('.work-stage').evaluate(el=>getComputedStyle(el).getPropertyValue('--work-split')))).toBeGreaterThan(.4);
});

test('one system surface automatically changes discipline with scroll',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await ready(page);
  await scrollScene(page,'#system',.16);
  await expect(page.locator('[data-craft-board]')).toHaveAttribute('data-mode','design');
  await scrollScene(page,'#system',.52);
  await expect(page.locator('[data-craft-board]')).toHaveAttribute('data-mode','build');
  await scrollScene(page,'#system',.84);
  await expect(page.locator('[data-craft-board]')).toHaveAttribute('data-mode','ai');
});

test('fine pointer gets contextual work inspection without replacing links',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await ready(page);
  await scrollScene(page,'#work',.42);
  const frame=page.locator('[data-work-frame]');
  await frame.hover({position:{x:400,y:260}});
  await expect(page.locator('[data-context-cursor]')).toHaveClass(/is-visible/);
  await expect(frame.locator('.work-open')).toHaveAttribute('href','https://fakhriyarns.vercel.app/');
});

test('experience uses native document scrolling and one RAF-driven controller',async({page})=>{
  await ready(page);
  const behavior=await page.evaluate(()=>({
    htmlOverflow:getComputedStyle(document.documentElement).overflowY,
    bodyOverflow:getComputedStyle(document.body).overflowY,
    scrollHeight:document.scrollingElement.scrollHeight,
    viewport:innerHeight,
    ready:document.body.classList.contains('experience-ready')
  }));
  expect(behavior.ready).toBeTruthy();
  expect(behavior.htmlOverflow).not.toBe('hidden');
  expect(behavior.bodyOverflow).not.toBe('hidden');
  expect(behavior.scrollHeight).toBeGreaterThan(behavior.viewport*3);
  await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,700)});
  await expect.poll(()=>page.evaluate(()=>window.scrollY)).toBeGreaterThan(0);
});
