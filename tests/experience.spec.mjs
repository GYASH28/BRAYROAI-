import { test, expect } from '@playwright/test';

async function ready(page){
  await page.goto('/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.body.classList.contains('hero-ready'),null,{timeout:5000});
  await page.waitForFunction(()=>document.body.classList.contains('experience-ready'),null,{timeout:5000});
}

const scrollSceneTo=async(page,selector,ratio)=>{
  await page.locator(selector).evaluate((el,ratio)=>{
    document.documentElement.style.scrollBehavior='auto';
    const max=Math.max(1,el.offsetHeight-window.innerHeight);
    const top=el.getBoundingClientRect().top+window.scrollY;
    window.scrollTo(0,top+max*ratio);
  },ratio);
  await page.waitForTimeout(100);
};

test('one ExperienceController owns the six post-hero scenes', async ({page}) => {
  await ready(page);
  expect(await page.evaluate(()=>Boolean(window.__BRAYROAI__))).toBe(true);
  expect(await page.evaluate(()=>window.__BRAYROAI__.constructor.name)).toBe('ExperienceController');
  expect(await page.evaluate(()=>window.__BRAYROAI__.scenes.length)).toBe(6);
  await expect(page.locator('[data-scene="forces"]')).toHaveCount(1);
  await expect(page.locator('[data-scene="project"]')).toHaveCount(1);
  await expect(page.locator('[data-scene="process"]')).toHaveCount(1);
});

test('three forces transform through design, engineering, intelligence and convergence', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  await ready(page);
  const scene=page.locator('#services');
  for(const [ratio,state,title] of [[.08,'design','DESIGN'],[.34,'engineering','ENGINEERING'],[.62,'intelligence','INTELLIGENCE'],[.9,'converged','ONE SYSTEM']]){
    await scrollSceneTo(page,'#services',ratio);
    await expect(scene).toHaveAttribute('data-state',state);
    await expect(scene.locator('[data-force-title]')).toHaveText(title);
  }
});

test('real work approaches, fills the camera, opens up and hands off', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  await ready(page);
  const scene=page.locator('#work');
  await scrollSceneTo(page,'#work',.12);
  await expect(scene).toHaveAttribute('data-state','approach');
  await scrollSceneTo(page,'#work',.38);
  await expect(scene).toHaveAttribute('data-state','immersive');
  const immerse=Number(await scene.evaluate(el=>getComputedStyle(el).getPropertyValue('--immerse')));
  expect(immerse).toBeGreaterThan(.4);
  await scrollSceneTo(page,'#work',.68);
  await expect(scene).toHaveAttribute('data-state','deconstruct');
  const deconstruct=Number(await scene.evaluate(el=>getComputedStyle(el).getPropertyValue('--deconstruct')));
  expect(deconstruct).toBeGreaterThan(.25);
  await scrollSceneTo(page,'#work',.92);
  await expect(scene).toHaveAttribute('data-state','handoff');
  const handoff=Number(await scene.evaluate(el=>getComputedStyle(el).getPropertyValue('--handoff')));
  expect(handoff).toBeGreaterThan(.5);
});

test('process is explained by deconstructing the same product rather than numbered rows', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  await ready(page);
  await expect(page.locator('.process-row')).toHaveCount(0);
  await expect(page.locator('#process .decon-layer')).toHaveCount(5);
  await scrollSceneTo(page,'#process',.12);
  await expect(page.locator('[data-process-word]')).toHaveText('FINISHED PRODUCT');
  await scrollSceneTo(page,'#process',.58);
  const middle=await page.locator('[data-process-word]').textContent();
  expect(['SYSTEM','INTERACTION','ENGINEERING']).toContain(middle);
  await scrollSceneTo(page,'#process',.96);
  await expect(page.locator('[data-process-word]')).toHaveText('SHIP');
});

test('fine pointer gets contextual cursor state while touch does not depend on it', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  await ready(page);
  await page.locator('#work').scrollIntoViewIfNeeded();
  const target=page.locator('[data-cursor="OPEN"]');
  const fine=await page.evaluate(()=>matchMedia('(pointer:fine)').matches);
  if(fine){
    await target.hover();
    await expect(page.locator('[data-context-cursor]')).toHaveClass(/is-visible/);
    await expect(page.locator('[data-context-cursor] span')).toHaveText('OPEN');
  }
});

test('navigation stays native-scroll based with no scroll hijacking library', async ({page}) => {
  await ready(page);
  const behavior=await page.evaluate(()=>({
    bodyOverflow:getComputedStyle(document.body).overflowY,
    htmlScrollBehavior:getComputedStyle(document.documentElement).scrollBehavior,
    hasLenis:Boolean(window.lenis||window.Lenis),
    hasGsap:Boolean(window.gsap)
  }));
  expect(behavior.hasLenis).toBe(false);
  expect(behavior.hasGsap).toBe(false);
  expect(['auto','visible','scroll'].includes(behavior.bodyOverflow)).toBeTruthy();
  await page.locator('.desktop-nav a[href="#lab"]').click();
  await expect(page).toHaveURL(/#lab$/);
});
