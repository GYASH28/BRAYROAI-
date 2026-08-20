import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const waitReady=async page=>{
  await page.goto('/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.body.classList.contains('hero-ready'));
  await page.waitForFunction(()=>document.body.classList.contains('experience-ready'));
};

const seriousViolations=results=>results.violations.filter(v=>['serious','critical'].includes(v.impact));
const scrollScene=async(page,selector,p=0)=>{
  await page.evaluate(({selector,p})=>{
    document.documentElement.style.scrollBehavior='auto';
    const el=document.querySelector(selector);const rect=el.getBoundingClientRect();const top=rect.top+scrollY;const d=Math.max(1,rect.height-innerHeight);scrollTo(0,top+d*p);
  },{selector,p});
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
};

test('locked opening and hero remain intact',async({page})=>{
  await waitReady(page);
  await expect(page.locator('#top')).toContainText('Digital, designed');
  await expect(page.locator('#top')).toContainText('SCROLL TO SHAPE THE STORY');
  await expect(page.locator('#top img[src="/assets/hero-background.webp"]')).toHaveCount(1);
  await expect(page.locator('#top img[src="/assets/yash-cutout.webp"]')).toHaveCount(1);
  await expect(page.locator('[data-service-moment]')).toHaveCount(4);
});

test('homepage has no serious or critical accessibility violations',async({page})=>{
  await waitReady(page);
  const results=await new AxeBuilder({page}).analyze();
  expect(seriousViolations(results)).toEqual([]);
});

test('navigation is one-page and contains no removed routes',async({page})=>{
  await waitReady(page);
  await expect(page.locator('a[href="/plans.html"]')).toHaveCount(0);
  await expect(page.locator('a[href="/case-studies/fakhrimart.html"]')).toHaveCount(0);
  for(const href of ['#work','#services','#pricing','#studio'])await expect(page.locator(`.desktop-nav a[href="${href}"]`)).toHaveCount(1);
});

test('mobile menu remains keyboard usable',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await waitReady(page);
  const button=page.locator('[data-menu-button]');
  await button.click();
  await expect(button).toHaveAttribute('aria-expanded','true');
  await expect(page.locator('[data-mobile-menu]')).toHaveClass(/open/);
  await page.keyboard.press('Escape');
  await expect(button).toHaveAttribute('aria-expanded','false');
});

test('real FakhriMart work owns the project sequence',async({page})=>{
  await waitReady(page);
  const work=page.locator('#work');
  await expect(work.locator('img[src="/assets/fakhrimart-case-desktop.png"]')).toHaveCount(5);
  await expect(work.locator('img[src="/assets/fakhrimart-case-mobile.png"]')).toHaveCount(1);
  await expect(work.locator('a[href="https://fakhriyarns.vercel.app/"]')).toHaveCount(1);
  await expect(page.locator('iframe')).toHaveCount(0);
  for(const image of await work.locator('.work-slices img').all()){
    await expect(image).toHaveAttribute('loading','lazy');
    await expect(image).toHaveAttribute('fetchpriority','low');
  }
});

test('integrated pricing switches without leaving the page',async({page})=>{
  await waitReady(page);
  await page.locator('#pricing').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-pricing-panel="build"]')).toBeVisible();
  await expect(page.locator('[data-pricing-panel="build"]')).toContainText('₹17,999');
  await page.locator('[data-pricing-tab="ongoing"]').click();
  await expect(page.locator('[data-pricing-panel="build"]')).toBeHidden();
  await expect(page.locator('[data-pricing-panel="ongoing"]')).toBeVisible();
  await expect(page.locator('[data-pricing-panel="ongoing"]')).toContainText('₹3,999');
});

test('system surface can be interrupted by the visitor',async({page})=>{
  await waitReady(page);
  await page.locator('#system').scrollIntoViewIfNeeded();
  await page.locator('[data-system-mode="ai"]').click();
  await expect(page.locator('[data-craft-board]')).toHaveAttribute('data-mode','ai');
  await expect(page.locator('[data-system-label]')).toHaveText('AI');
  await page.locator('[data-system-mode="build"]').click();
  await expect(page.locator('[data-craft-board]')).toHaveAttribute('data-mode','build');
});

test('desktop cinematic scenes actually own the viewport',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await waitReady(page);
  await scrollScene(page,'#services',.13);
  const heroBottom=await page.locator('#top').evaluate(el=>el.getBoundingClientRect().bottom);
  expect(heroBottom).toBeLessThanOrEqual(2);
  const active=page.locator('[data-service-moment].is-current h3');
  const box=await active.boundingBox();
  expect(box).toBeTruthy();
  expect(box.y).toBeGreaterThan(90);
  expect(box.y+box.height).toBeLessThan(850);
  const hiddenHeading=page.locator('#services-title');
  const hiddenBox=await hiddenHeading.boundingBox();
  expect(hiddenBox?.width??0).toBeLessThanOrEqual(1);
  expect(hiddenBox?.height??0).toBeLessThanOrEqual(1);
});

test('desktop client work fills the camera without losing its action',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await waitReady(page);
  await scrollScene(page,'#work',.43);
  const frame=page.locator('[data-work-frame]');
  const box=await frame.boundingBox();
  expect(box).toBeTruthy();
  expect(box.width).toBeGreaterThan(950);
  expect(box.height).toBeGreaterThan(500);
  await expect(frame.locator('.work-open')).toBeVisible();
});

test('mobile controls have comfortable touch targets and pricing does not collide',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await waitReady(page);
  const menu=await page.locator('[data-menu-button]').boundingBox();
  expect(menu.width).toBeGreaterThanOrEqual(44);expect(menu.height).toBeGreaterThanOrEqual(44);
  await page.locator('#pricing').scrollIntoViewIfNeeded();
  for(const button of await page.locator('.pricing-toggle button').all()){
    const b=await button.boundingBox();expect(b.height).toBeGreaterThanOrEqual(44);
  }
  const first=page.locator('[data-pricing-panel="build"] article').first();
  const price=await first.locator('strong').boundingBox();const action=await first.locator('a').boundingBox();
  expect(price.x+price.width).toBeLessThanOrEqual(action.x+2);
});

test('post-hero styles are activated without being render blocking',async({page})=>{
  await page.goto('/',{waitUntil:'domcontentloaded'});
  for(const id of ['post-fixes-styles','experience-styles']){
    const media=await page.locator(`#${id}`).getAttribute('media');
    expect(['print','all']).toContain(media);
  }
  await page.waitForFunction(()=>document.body.classList.contains('experience-ready'));
  await expect(page.locator('#experience-styles')).toHaveAttribute('media','all');
  await expect(page.locator('#post-fixes-styles')).toHaveAttribute('media','all');
});

for(const [width,height] of [[1920,1080],[1440,900],[1366,768],[1280,720],[1024,768],[768,1024],[430,932],[390,844],[375,812],[360,800]]){
  test(`layout has no horizontal overflow at ${width}x${height}`,async({page})=>{
    await page.setViewportSize({width,height});
    await waitReady(page);
    for(const selector of ['#services','#work','#system','#pricing','#studio','#contact']){
      await page.locator(selector).scrollIntoViewIfNeeded();
      await page.waitForTimeout(40);
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(1);
    }
  });
}

test('reduced motion keeps all content and removes long sticky choreography',async({browser})=>{
  const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1280,height:800}});
  const page=await context.newPage();
  await waitReady(page);
  const servicesPosition=await page.locator('.service-stage').evaluate(el=>getComputedStyle(el).position);
  const workPosition=await page.locator('.work-stage').evaluate(el=>getComputedStyle(el).position);
  expect(servicesPosition).not.toBe('sticky');
  expect(workPosition).not.toBe('sticky');
  await expect(page.locator('[data-service-moment]')).toHaveCount(4);
  await expect(page.locator('[data-pricing-panel="build"]')).toBeVisible();
  await context.close();
});
