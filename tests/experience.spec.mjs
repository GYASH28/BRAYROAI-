import { test, expect } from '@playwright/test';

const ready=async page=>{await page.goto('/',{waitUntil:'networkidle'});await page.waitForFunction(()=>document.body.classList.contains('hero-ready'));await page.waitForFunction(()=>document.body.classList.contains('experience-ready'))};
const scrollTo=async(page,selector)=>{await page.evaluate(selector=>{document.documentElement.style.scrollBehavior='auto';const el=document.querySelector(selector);window.scrollTo(0,el.getBoundingClientRect().top+scrollY)},selector);await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))))};

test('plans appear before proof and services in real document order',async({page})=>{
  await ready(page);const order=await page.evaluate(()=>[...document.querySelectorAll('.v9-main>section')].map(el=>el.id));expect(order.slice(0,3)).toEqual(['plans','work','services']);
});

test('desktop work scene adds subtle progress without hijacking scroll',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await ready(page);await scrollTo(page,'#work');
  await page.evaluate(()=>window.scrollBy(0,450));await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const progress=Number(await page.locator('#work').evaluate(el=>getComputedStyle(el).getPropertyValue('--work-progress')||0));expect(progress).toBeGreaterThan(0);
  const position=await page.locator('#work').evaluate(el=>getComputedStyle(el).position);expect(position).not.toBe('sticky');
});

test('system modes keep one stable surface and update its meaning',async({page})=>{
  await ready(page);await scrollTo(page,'#system');const panel=page.locator('[data-system-panel]');
  await page.locator('[data-system-mode="build"]').click();await expect(panel).toHaveAttribute('data-mode','build');await expect(page.locator('[data-system-meta]')).toHaveText('COMPONENTS / STATES / PERFORMANCE');
  await page.locator('[data-system-mode="ai"]').click();await expect(panel).toHaveAttribute('data-mode','ai');await expect(page.locator('[data-system-copy]')).toContainText('workflow');
});

test('fine pointer gets contextual labels while real links stay clickable',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await ready(page);await scrollTo(page,'#work');const frame=page.locator('[data-work-frame]');await frame.hover({position:{x:400,y:260}});await expect(page.locator('[data-context-cursor]')).toHaveClass(/is-visible/);await expect(frame.locator('a[href="https://fakhriyarns.vercel.app/"]')).toBeVisible();
});

test('reveal motion resolves content instead of leaving invisible sections',async({page})=>{
  await ready(page);for(const selector of ['#plans','#work','#services','#system','#studio','#contact']){await scrollTo(page,selector);await expect.poll(async()=>Number(await page.locator(`${selector} .reveal-item`).first().evaluate(el=>getComputedStyle(el).opacity))).toBeGreaterThan(.9)}
});

test('experience uses native document scrolling and a single RAF scheduler',async({page})=>{
  await ready(page);const behavior=await page.evaluate(()=>({htmlOverflow:getComputedStyle(document.documentElement).overflowY,bodyOverflow:getComputedStyle(document.body).overflowY,scrollHeight:document.scrollingElement.scrollHeight,viewport:innerHeight,ready:document.body.classList.contains('experience-ready')}));expect(behavior.ready).toBeTruthy();expect(behavior.htmlOverflow).not.toBe('hidden');expect(behavior.bodyOverflow).not.toBe('hidden');expect(behavior.scrollHeight).toBeGreaterThan(behavior.viewport*3);await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,700)});await expect.poll(()=>page.evaluate(()=>window.scrollY)).toBeGreaterThan(0);
});
