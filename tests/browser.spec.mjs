import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const waitReady=async page=>{
  await page.goto('/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.body.classList.contains('hero-ready'));
  await page.waitForFunction(()=>document.body.classList.contains('experience-ready'));
};
const seriousViolations=results=>results.violations.filter(violation=>['serious','critical'].includes(violation.impact));
const settle=page=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
const scrollTo=async(page,selector,offset=0)=>{
  await page.evaluate(({selector,offset})=>{document.documentElement.style.scrollBehavior='auto';const element=document.querySelector(selector);window.scrollTo(0,element.getBoundingClientRect().top+scrollY+offset)},{selector,offset});
  await settle(page);
};
const expectInsideViewport=async(page,locator,padding=1)=>{
  const box=await locator.boundingBox();expect(box).toBeTruthy();const width=await page.evaluate(()=>innerWidth);expect(box.x).toBeGreaterThanOrEqual(-padding);expect(box.x+box.width).toBeLessThanOrEqual(width+padding);
};

test('frozen opening hero remains intact',async({page})=>{
  await waitReady(page);
  await expect(page.locator('#top')).toContainText('Digital, designed');
  await expect(page.locator('#top')).toContainText('SCROLL TO SHAPE THE STORY');
  await expect(page.locator('#top img[src="/assets/hero-background.webp"]')).toHaveCount(1);
  await expect(page.locator('#top img[src="/assets/yash-cutout.webp"]')).toHaveCount(1);
});

test('homepage has no serious or critical accessibility violations',async({page})=>{
  await waitReady(page);
  const results=await new AxeBuilder({page}).analyze();
  expect(seriousViolations(results)).toEqual([]);
});

test('public navigation and chapter order stay coherent',async({page})=>{
  await waitReady(page);
  const order=await page.evaluate(()=>[...document.querySelectorAll('.v9-main>section')].map(section=>section.id));
  expect(order).toEqual(['starting-point','difference','services','work','plans','studio','contact']);
  const links=page.locator('.desktop-nav a');
  await expect(links.first()).toHaveAttribute('href','#plans');
  for(const href of ['#plans','#work','#services','#studio'])await expect(page.locator(`.desktop-nav a[href="${href}"]`)).toHaveCount(1);
  await expect(page.locator('#system')).toHaveCount(1);
  await expect(page.locator('a[href="/plans.html"],a[href="/case-studies/fakhrimart.html"]')).toHaveCount(0);
});

test('build offers and optional support are visible and honestly scoped',async({page})=>{
  await waitReady(page);await scrollTo(page,'#plans');
  const plans=page.locator('#plans');
  for(const text of ['Website Starter','₹2,599','Business Website','₹3,999','Custom Experience','₹5,999+'])await expect(plans).toContainText(text);
  const featured=plans.locator('[data-plan-recommended]');
  await expect(featured).toHaveAttribute('data-plan','business');
  await expect(featured).toContainText('Most Chosen');
  await expect(plans).toContainText('After launch, stay sharp.');
  await expect(plans).toContainText('Monthly support is separate from the one-time website build');
  for(const support of ['Launch','₹2,499','Grow','₹3,999','Pro','₹5,999+'])await expect(plans).toContainText(support);
  await expect(plans).toContainText('Hosting, domains, paid tools, ecommerce, large content work and advanced integrations are quoted separately');
  await expect(plans.locator('[hidden]')).toHaveCount(0);
});

test('every plan CTA carries its direct mail intent',async({page})=>{
  await waitReady(page);
  const intents=[
    ['[data-plan="starter"] .plan-cta',/Website%20Starter%20%E2%80%94%20%E2%82%B92%2C599/],
    ['[data-plan="business"] .plan-cta',/Business%20Website%20%E2%80%94%20%E2%82%B93%2C999/],
    ['[data-plan="custom"] .plan-cta',/Custom%20Experience%20enquiry/],
    ['.care-plans article:nth-child(1) a',/Launch%20support/],
    ['.care-plans article:nth-child(2) a',/Grow%20support/],
    ['.care-plans article:nth-child(3) a',/Pro%20support/],
    ['.contact-primary',/Help%20me%20choose%20a%20BRAYROAI%20plan/]
  ];
  for(const [selector,subject] of intents)await expect(page.locator(selector)).toHaveAttribute('href',subject);
});

test('real FakhriMart proof is factual and links to the live build',async({page})=>{
  await waitReady(page);
  const work=page.locator('#work');
  await expect(work.locator('img[src="/assets/fakhrimart-case-desktop.png"]')).toHaveCount(1);
  await expect(work.locator('img[src="/assets/fakhrimart-case-mobile.png"]')).toHaveCount(1);
  await expect(work.locator('a[href="https://fakhriyarns.vercel.app/"]')).toHaveCount(1);
  for(const fact of ['Yarn wholesaler','Catalogue-led browsing','Desktop + mobile experience','Enquiry-led flow'])await expect(work).toContainText(fact);
  await expect(page.locator('iframe')).toHaveCount(0);
});

test('capability constellation supports pointer and keyboard selection',async({page})=>{
  await waitReady(page);await scrollTo(page,'#services');
  const stage=page.locator('.capability-stage');
  const ai=page.locator('[data-capability="ai"]');
  await ai.click();
  await expect(ai).toHaveAttribute('aria-pressed','true');
  await expect(stage).toHaveClass(/is-mode-ai/);
  await expect(page.locator('.capability-copy')).toContainText('workflow friction');
  const engineering=page.locator('[data-capability="engineering"]');
  await engineering.focus();await page.keyboard.press('Enter');
  await expect(engineering).toHaveAttribute('aria-pressed','true');
  await expect(stage).toHaveClass(/is-mode-engineering/);
  await expect(page.locator('.capability-index')).toHaveText('03 / ENGINEERING');
});

test('mobile menu remains keyboard usable',async({page})=>{
  await page.setViewportSize({width:390,height:844});await waitReady(page);
  const button=page.locator('[data-menu-button]');const box=await button.boundingBox();
  expect(box.width).toBeGreaterThanOrEqual(44);expect(box.height).toBeGreaterThanOrEqual(44);
  await button.click();await expect(button).toHaveAttribute('aria-expanded','true');
  await expect(page.locator('[data-mobile-menu]')).toHaveClass(/open/);
  await expect(page.locator('[data-mobile-menu] a[href="#plans"]')).toBeVisible();
  await page.keyboard.press('Escape');await expect(button).toHaveAttribute('aria-expanded','false');
});

test('mobile uses flowing chapters, full-width actions, and touch controls',async({page})=>{
  await page.setViewportSize({width:390,height:844});await waitReady(page);
  for(const selector of ['#starting-point .chapter-sticky','#difference .chapter-sticky','#services .chapter-sticky','#work .chapter-sticky']){
    expect(await page.locator(selector).evaluate(element=>getComputedStyle(element).position)).not.toBe('sticky');
  }
  await scrollTo(page,'#plans');
  const featured=await page.locator('[data-plan-recommended]').boundingBox();
  const starter=await page.locator('[data-plan="starter"]').boundingBox();
  expect(featured.y).toBeLessThan(starter.y);
  for(const action of await page.locator('#plans .plan-cta').all()){const box=await action.boundingBox();expect(box.height).toBeGreaterThanOrEqual(52);expect(box.width).toBeGreaterThan(300)}
  await scrollTo(page,'#services');
  for(const button of await page.locator('[data-capability]').all()){const box=await button.boundingBox();expect(box.height).toBeGreaterThanOrEqual(44)}
});

test('no-JavaScript experience keeps all plan content readable',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();await page.goto('/',{waitUntil:'domcontentloaded'});
  const plans=page.locator('#plans');
  for(const text of ['Website Starter','₹2,599','Business Website','₹3,999','Custom Experience','₹5,999+','After launch'])await expect(plans).toContainText(text);
  await expect(plans).toBeVisible();
  await context.close();
});

test('canvas failure exposes the static decorative fallback',async({browser})=>{
  const context=await browser.newContext();
  await context.addInitScript(()=>{HTMLCanvasElement.prototype.getContext=()=>null});
  const page=await context.newPage();await waitReady(page);
  await expect(page.locator('body')).toHaveClass(/canvas-unavailable/);
  const opacity=Number(await page.locator('.particle-fallback').evaluate(element=>getComputedStyle(element).opacity));
  expect(opacity).toBeGreaterThan(0);
  await context.close();
});

test('reduced motion disables pinning and continuous canvas motion without concealing content',async({browser})=>{
  const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1280,height:800}});
  const page=await context.newPage();await waitReady(page);
  expect(await page.locator('#starting-point .chapter-sticky').evaluate(element=>getComputedStyle(element).position)).not.toBe('sticky');
  expect(await page.locator('[data-particle-field]').evaluate(element=>getComputedStyle(element).display)).toBe('none');
  for(const item of await page.locator('.reveal-item').all())expect(Number(await item.evaluate(element=>getComputedStyle(element).opacity))).toBeGreaterThan(.9);
  for(const selector of ['#starting-point','#difference','#services','#work','#plans','#studio','#contact'])await expect(page.locator(selector)).toBeVisible();
  await page.waitForTimeout(150);
  expect(await page.evaluate(()=>window.__BRAYROAI__.frame)).toBe(0);
  await context.close();
});

for(const [width,height] of [[1920,1080],[1440,900],[1366,768],[1280,720],[1024,768],[768,1024],[430,932],[390,844],[375,812],[360,800]]){
  test(`no horizontal overflow at ${width}x${height}`,async({page})=>{
    await page.setViewportSize({width,height});await waitReady(page);
    for(const selector of ['#starting-point','#difference','#services','#work','#plans','#studio','#contact']){
      await scrollTo(page,selector);
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(1);
    }
  });
}

for(const width of [430,390,375,360]){
  test(`mobile chapter headings stay inside ${width}px viewport`,async({page})=>{
    await page.setViewportSize({width,height:844});await waitReady(page);
    for(const selector of ['#starting-title','#difference-title','#services-title','#work-title','#plans-title','#studio-title','#contact-title']){
      await scrollTo(page,selector);await expectInsideViewport(page,page.locator(selector));
    }
  });
}
