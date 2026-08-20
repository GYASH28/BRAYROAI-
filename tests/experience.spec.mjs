import { test, expect } from '@playwright/test';

const ready=async page=>{
  await page.goto('/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.body.classList.contains('hero-ready'));
  await page.waitForFunction(()=>document.body.classList.contains('experience-ready'));
};
const scrollScene=async(page,selector,p)=>page.evaluate(({selector,p})=>{const el=document.querySelector(selector);const distance=Math.max(1,el.offsetHeight-innerHeight);scrollTo(0,el.offsetTop+distance*p)},{selector,p});

test('service moments enter, hold, then leave the camera',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await ready(page);
  await scrollScene(page,'#services',.125);await page.waitForTimeout(120);
  const held=page.locator('[data-service-moment]').first();
  expect(Number(await held.evaluate(el=>getComputedStyle(el).opacity))).toBeGreaterThan(.9);
  expect(await held.evaluate(el=>el.classList.contains('is-current'))).toBeTruthy();
  await scrollScene(page,'#services',.24);await page.waitForTimeout(120);
  const exitTransform=await held.evaluate(el=>el.style.transform);
  expect(exitTransform).toContain('translate3d(-');
});

test('work transitions from real browser to split build layers',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await ready(page);
  await scrollScene(page,'#work',.40);await page.waitForTimeout(100);
  await expect(page.locator('.work-stage')).toHaveAttribute('data-work-phase','hold');
  const fill=Number(await page.locator('.work-stage').evaluate(el=>getComputedStyle(el).getPropertyValue('--work-fill')));
  expect(fill).toBeGreaterThan(.9);
  await scrollScene(page,'#work',.78);await page.waitForTimeout(100);
  await expect(page.locator('.work-stage')).toHaveAttribute('data-work-phase','split');
  const split=Number(await page.locator('.work-stage').evaluate(el=>getComputedStyle(el).getPropertyValue('--work-split')));
  expect(split).toBeGreaterThan(.4);
});

test('one system surface automatically changes discipline with scroll',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await ready(page);
  await scrollScene(page,'#system',.16);await page.waitForTimeout(100);
  await expect(page.locator('[data-craft-board]')).toHaveAttribute('data-mode','design');
  await scrollScene(page,'#system',.52);await page.waitForTimeout(100);
  await expect(page.locator('[data-craft-board]')).toHaveAttribute('data-mode','build');
  await scrollScene(page,'#system',.84);await page.waitForTimeout(100);
  await expect(page.locator('[data-craft-board]')).toHaveAttribute('data-mode','ai');
});

test('fine pointer gets contextual work inspection without replacing links',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await ready(page);
  await scrollScene(page,'#work',.42);await page.waitForTimeout(120);
  const frame=page.locator('[data-work-frame]');
  await frame.hover({position:{x:400,y:260}});
  await expect(page.locator('[data-context-cursor]')).toHaveClass(/is-visible/);
  await expect(frame.locator('.work-open')).toHaveAttribute('href','https://fakhriyarns.vercel.app/');
});

test('experience uses native scroll and one RAF-driven controller',async({page})=>{
  await ready(page);
  const behavior=await page.evaluate(()=>({overflow:getComputedStyle(document.documentElement).overflowY,ready:document.body.classList.contains('experience-ready')}));
  expect(behavior.ready).toBeTruthy();
  expect(behavior.overflow).not.toBe('hidden');
  await page.mouse.wheel(0,700);
  expect(await page.evaluate(()=>scrollY)).toBeGreaterThan(0);
});
