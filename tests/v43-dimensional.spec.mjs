import {test,expect} from '@playwright/test';

test('V43 signature scenes mount on the authored homepage chapters',async({page})=>{
  await page.goto('/');
  await page.locator('#services').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-v43-source-particles]')).toHaveCount(1);
  await expect(page.locator('[data-v43-source-particles] i')).toHaveCount(9);
  await expect(page.locator('[data-v43-handoff-relay]')).toHaveCount(1);
});

test('reduced motion keeps Rae on SVG and never downloads the WebGL chunk',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  const launcher=page.locator('[data-rae-shell],[data-rae-toggle]').first();
  await expect(launcher).toBeVisible();
  await launcher.click();
  await expect(page.locator('[data-rae-panel]')).toBeVisible();
  await expect(page.locator('[data-rae-3d-host]')).toHaveCount(1);
  await page.waitForTimeout(350);
  const state=await page.locator('[data-rae-root]').getAttribute('data-rae-dimensional');
  expect(state).not.toBe('active');
  const resources=await page.evaluate(()=>performance.getEntriesByType('resource').map(entry=>entry.name));
  expect(resources.some(name=>/rae-3d-island|three-r186/i.test(name))).toBeFalsy();
});


test('desktop Rae activates the lazy WebGL actor on a capable browser',async({page})=>{
  await page.addInitScript(()=>{
    try{Object.defineProperty(navigator,'deviceMemory',{configurable:true,get:()=>8})}catch{}
    try{Object.defineProperty(navigator,'hardwareConcurrency',{configurable:true,get:()=>8})}catch{}
  });
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/');
  const hasWebGL=await page.evaluate(()=>{
    const canvas=document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2')||canvas.getContext('webgl'));
  });
  test.skip(!hasWebGL,'Headless browser has no WebGL context');
  const launcher=page.locator('[data-rae-shell],[data-rae-toggle]').first();
  await expect(launcher).toBeVisible();
  await launcher.click();
  await expect(page.locator('[data-rae-panel]')).toBeVisible();
  await expect(page.locator('[data-rae-root]')).toHaveAttribute('data-rae-dimensional','active',{timeout:12000});
  await expect(page.locator('[data-rae-3d-host] canvas')).toHaveCount(1);
  const resources=await page.evaluate(()=>performance.getEntriesByType('resource').map(entry=>entry.name));
  expect(resources.some(name=>/rae-3d-island/i.test(name))).toBeTruthy();
  const canvasSize=await page.locator('[data-rae-3d-host] canvas').evaluate(canvas=>({width:canvas.width,height:canvas.height}));
  expect(canvasSize.width).toBeGreaterThan(0);
  expect(canvasSize.height).toBeGreaterThan(0);
});
