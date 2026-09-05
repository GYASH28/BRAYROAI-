import { test, expect } from '@playwright/test';

const clearOpening=async page=>{
  await page.evaluate(()=>{
    document.querySelectorAll('.opening-sequence,.scope-open,.founder-open').forEach(node=>node.remove());
    document.body.classList.remove('polish-opening','hf-intro-active','is-opening');
  });
};

const cases=[
  ['/', 'home-v16'],
  ['/plans', 'plans-v16'],
  ['/founder', 'founder-v16'],
  ['/terms', 'terms-v16'],
  ['/ai-workflow-audit', 'ai-v16'],
  ['/company-second-brain', 'ai-v16']
];

for(const [route,pageClass] of cases){
  test(`V16 motion runtime mounts on ${route}`,async({page})=>{
    await page.goto(route,{waitUntil:'networkidle'});
    await clearOpening(page);
    await page.waitForFunction(()=>document.body.classList.contains('v16-motion'));
    await expect(page.locator('link[href="/experience-motion-v16.css"]')).toHaveCount(1);
    await expect(page.locator('script[src="/experience-motion-v16.js"]')).toHaveCount(1);
    await expect(page.locator('body')).toHaveClass(new RegExp(pageClass));
    expect(await page.locator('[data-v16-scene]').count()).toBeGreaterThan(0);
    expect(await page.locator('[data-v16-reveal]').count()).toBeGreaterThan(0);
  });
}

test('V16 scroll choreography updates scene progress without layout overflow',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/plans',{waitUntil:'networkidle'});
  await clearOpening(page);
  await page.waitForFunction(()=>document.body.classList.contains('plans-v16'));
  const scene=page.locator('[data-plan-scene="builds"]');
  await scene.scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);
  const values=await scene.evaluate(node=>({
    focus:getComputedStyle(node).getPropertyValue('--v16-focus').trim(),
    line:getComputedStyle(node).getPropertyValue('--v16-line').trim(),
    drift:getComputedStyle(node).getPropertyValue('--v16-drift-y').trim()
  }));
  expect(values.focus).not.toBe('');
  expect(values.line).not.toBe('');
  expect(values.drift).not.toBe('');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test('V16 pointer feedback adds magnetic and surface states on desktop',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/ai-workflow-audit',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.body.classList.contains('ai-v16'));
  const tab=page.locator('[data-process-tab]').first();
  await tab.scrollIntoViewIfNeeded();
  await tab.hover();
  await expect(page.locator('.v16-cursor')).toHaveClass(/is-active/);
  const surface=page.locator('[data-process-stage]');
  await surface.hover({position:{x:120,y:120}});
  await expect(surface).toHaveAttribute('data-v16-surface','');
  const sheen=await surface.evaluate(node=>getComputedStyle(node).getPropertyValue('--v16-sx').trim());
  expect(sheen).not.toBe('');
});

test('V16 Terms motion keeps the active reading section explicit',async({page})=>{
  await page.setViewportSize({width:1280,height:800});
  await page.goto('/terms',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.body.classList.contains('terms-v16'));
  await page.locator('#ownership').scrollIntoViewIfNeeded();
  await page.waitForTimeout(120);
  expect(await page.locator('.terms-section.v16-reading').count()).toBe(1);
});

test('V16 respects reduced motion while keeping content readable and operable',async({browser})=>{
  const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1280,height:800}});
  const page=await context.newPage();
  await page.goto('/company-second-brain',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.body.classList.contains('v16-motion'));
  await expect(page.locator('.v16-cursor')).toHaveCount(0);
  const reveal=page.locator('[data-v16-reveal]').first();
  const state=await reveal.evaluate(node=>({opacity:getComputedStyle(node).opacity,clip:getComputedStyle(node).clipPath}));
  expect(state.opacity).toBe('1');
  expect(['none','inset(0px)']).toContain(state.clip);
  await page.locator('[data-arch-node="drive"]').click();
  await expect(page.locator('[data-arch-status]')).toContainText('Drive folders');
  await context.close();
});
