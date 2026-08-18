import { test, expect } from '@playwright/test';

async function ready(page){
  await page.goto('/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.body.classList.contains('hero-ready'));
  await page.waitForFunction(()=>document.body.classList.contains('experience-ready'));
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
      clip:style.clipPath,
      filter:style.filter
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

  expect(styles.some(style=>style.filter==='none')).toBeTruthy();
  expect(styles.some(style=>style.filter.includes('saturate'))).toBeTruthy();
});

test('project and client frames always have designed visual fallback surfaces', async ({page}) => {
  await ready(page);
  await page.locator('#work').scrollIntoViewIfNeeded();
  await expect(page.locator('.project-screen')).toHaveCSS('background-image',/gradient/);
  await expect(page.locator('.project-phone')).toHaveCSS('background-image',/gradient/);
  await page.locator('#client-proof').scrollIntoViewIfNeeded();
  await expect(page.locator('.live-browser')).toHaveCSS('background-image',/gradient/);
  await expect(page.locator('.live-phone')).toHaveCSS('background-image',/gradient/);
});

test('pointer depth is progressive enhancement and returns to neutral', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  await ready(page);
  await page.locator('#lab').scrollIntoViewIfNeeded();
  const card=page.locator('.lab-card').nth(1);
  const box=await card.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box.x+box.width*.8,box.y+box.height*.3);
  await page.waitForTimeout(80);
  const moved=await card.evaluate(el=>getComputedStyle(el).getPropertyValue('--pointer-x').trim());
  expect(Math.abs(Number(moved))).toBeGreaterThan(.1);
  await page.mouse.move(4,4);
  await page.waitForTimeout(80);
  const reset=await card.evaluate(el=>getComputedStyle(el).getPropertyValue('--pointer-x').trim());
  expect(Number(reset)).toBe(0);
});

test('reduced motion keeps the v5 content while removing motion-dependent transforms', async ({browser}) => {
  const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1280,height:800}});
  const page=await context.newPage();
  await ready(page);
  await expect(page.locator('.studio-matrix')).toBeVisible();
  const capTransition=await page.locator('[data-cap-panel="0"]').evaluate(el=>getComputedStyle(el).transitionDuration);
  expect(capTransition.split(',').every(value=>parseFloat(value)===0)).toBeTruthy();
  const hoverTransform=await page.locator('.project-tile__art').first().evaluate(el=>getComputedStyle(el).transform);
  expect(hoverTransform).toBe('none');
  await context.close();
});
