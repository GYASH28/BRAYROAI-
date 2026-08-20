import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const waitReady=async page=>{
  await page.goto('/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.body.classList.contains('hero-ready'));
  await page.waitForFunction(()=>document.body.classList.contains('experience-ready'));
};
const seriousViolations=results=>results.violations.filter(v=>['serious','critical'].includes(v.impact));
const scrollTo=async(page,selector)=>{
  await page.evaluate(selector=>{document.documentElement.style.scrollBehavior='auto';const el=document.querySelector(selector);window.scrollTo(0,el.getBoundingClientRect().top+window.scrollY)},selector);
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
};
const expectInsideViewport=async(page,locator,padding=0)=>{
  const box=await locator.boundingBox();expect(box).toBeTruthy();const width=await page.evaluate(()=>innerWidth);expect(box.x).toBeGreaterThanOrEqual(-padding);expect(box.x+box.width).toBeLessThanOrEqual(width+padding);
};

test('locked opening and hero remain intact',async({page})=>{
  await waitReady(page);
  await expect(page.locator('#top')).toContainText('Digital, designed');
  await expect(page.locator('#top')).toContainText('SCROLL TO SHAPE THE STORY');
  await expect(page.locator('#top img[src="/assets/hero-background.webp"]')).toHaveCount(1);
  await expect(page.locator('#top img[src="/assets/yash-cutout.webp"]')).toHaveCount(1);
});

test('homepage has no serious or critical accessibility violations',async({page})=>{
  await waitReady(page);const results=await new AxeBuilder({page}).analyze();expect(seriousViolations(results)).toEqual([]);
});

test('navigation leads with Plans and stays one-page',async({page})=>{
  await waitReady(page);
  const links=page.locator('.desktop-nav a');
  await expect(links.first()).toHaveAttribute('href','#plans');
  await expect(links.first()).toHaveText('Plans');
  for(const href of ['#plans','#work','#services','#studio'])await expect(page.locator(`.desktop-nav a[href="${href}"]`)).toHaveCount(1);
  await expect(page.locator('a[href="/plans.html"],a[href="/case-studies/fakhrimart.html"]')).toHaveCount(0);
});

test('Plans is first and the lowest build price is the highlighted starting point',async({page})=>{
  await waitReady(page);
  const firstPostHero=await page.locator('#top + .v9-main > section').first().getAttribute('id');expect(firstPostHero).toBe('plans');
  const featured=page.locator('[data-plan-recommended]');
  await expect(featured).toHaveAttribute('data-plan','makeover');
  await expect(featured).toContainText('START HERE');
  await expect(featured).toContainText('₹9,999');
  await expect(featured).toContainText('Lowest entry / fastest upgrade');
  await expect(featured.locator('.plan-cta')).toContainText('Start at ₹9,999');
  await expect(page.locator('[data-plan="website"]')).not.toHaveClass(/plan-card--featured/);
});

test('lowest monthly support plan is highlighted too',async({page})=>{
  await waitReady(page);await scrollTo(page,'#plans');
  const care=page.locator('.care-plans article[data-care-highlight]');
  await expect(care).toHaveCount(1);await expect(care).toContainText('₹2,499');await expect(care).toContainText('ENTRY');
});

test('all build and monthly plan prices are visible without tab hunting',async({page})=>{
  await waitReady(page);await scrollTo(page,'#plans');const plans=page.locator('#plans');
  for(const price of ['₹9,999','₹17,999','₹25K–35K+','₹2,499','₹3,999','₹5,999+'])await expect(plans).toContainText(price);
  await expect(plans.locator('[hidden]')).toHaveCount(0);
});

test('real FakhriMart proof uses one desktop and one mobile capture',async({page})=>{
  await waitReady(page);const work=page.locator('#work');
  await expect(work.locator('img[src="/assets/fakhrimart-case-desktop.png"]')).toHaveCount(1);
  await expect(work.locator('img[src="/assets/fakhrimart-case-mobile.png"]')).toHaveCount(1);
  await expect(work.locator('a[href="https://fakhriyarns.vercel.app/"]')).toHaveCount(1);
  await expect(page.locator('iframe')).toHaveCount(0);
  for(const image of await work.locator('img').all())await expect(image).toHaveAttribute('loading','lazy');
});

test('system surface changes state through visitor controls',async({page})=>{
  await waitReady(page);await scrollTo(page,'#system');const panel=page.locator('[data-system-panel]');
  await page.locator('[data-system-mode="ai"]').click();await expect(panel).toHaveAttribute('data-mode','ai');await expect(page.locator('[data-system-label]')).toHaveText('AI');
  await page.locator('[data-system-mode="build"]').click();await expect(panel).toHaveAttribute('data-mode','build');await expect(page.locator('[data-system-label]')).toHaveText('BUILD');
  await page.locator('[data-system-mode="design"]').click();await expect(panel).toHaveAttribute('data-mode','design');
});

test('mobile menu remains keyboard usable',async({page})=>{
  await page.setViewportSize({width:390,height:844});await waitReady(page);const button=page.locator('[data-menu-button]');
  const box=await button.boundingBox();expect(box.width).toBeGreaterThanOrEqual(44);expect(box.height).toBeGreaterThanOrEqual(44);
  await button.click();await expect(button).toHaveAttribute('aria-expanded','true');await expect(page.locator('[data-mobile-menu]')).toHaveClass(/open/);await expect(page.locator('[data-mobile-menu] a[href="#plans"]')).toBeVisible();
  await page.keyboard.press('Escape');await expect(button).toHaveAttribute('aria-expanded','false');
});

test('mobile starts with the ₹9,999 highlighted plan and uses full-size actions',async({page})=>{
  await page.setViewportSize({width:390,height:844});await waitReady(page);await scrollTo(page,'#plans');
  const featured=await page.locator('[data-plan-recommended]').boundingBox();const standard=await page.locator('[data-plan="website"]').boundingBox();expect(featured.y).toBeLessThan(standard.y);
  await expect(page.locator('[data-plan-recommended]')).toContainText('₹9,999');
  for(const action of await page.locator('#plans .plan-cta').all()){const box=await action.boundingBox();expect(box.height).toBeGreaterThanOrEqual(52);expect(box.width).toBeGreaterThan(300)}
});

test('desktop entry plan has the strongest visual treatment',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await waitReady(page);await scrollTo(page,'#plans');
  const cards=page.locator('.plan-grid .plan-card');await expect(cards).toHaveCount(3);
  const featured=page.locator('[data-plan-recommended]');const box=await featured.boundingBox();expect(box.width).toBeGreaterThan(360);expect(box.height).toBeGreaterThan(520);await expect(featured).toContainText('₹9,999');
  const background=await featured.evaluate(el=>getComputedStyle(el).backgroundImage);expect(background).not.toBe('none');
  const standardClass=await page.locator('[data-plan="website"]').getAttribute('class');expect(standardClass).not.toContain('plan-card--featured');
});

test('visual polish runtime activates across post-hero experience',async({page})=>{
  await waitReady(page);await expect(page.locator('body')).toHaveClass(/v10-polished/);
  await expect(page.locator('#plans .plan-card')).toHaveCount(3);await expect(page.locator('#services .service-row')).toHaveCount(4);
  const ctaHeight=await page.locator('.contact-primary').evaluate(el=>el.getBoundingClientRect().height);expect(ctaHeight).toBeGreaterThanOrEqual(64);
});

test('final conversion CTA closes on the ₹9,999 entry offer',async({page})=>{
  await waitReady(page);await scrollTo(page,'#contact');const cta=page.locator('.contact-primary');
  await expect(cta).toContainText('Start at ₹9,999');
  await expect(cta).toHaveAttribute('href',/BRAYROAI%20Digital%20Makeover/);
  await expect(cta).toHaveAttribute('aria-label','Start with the ₹9,999 Digital Makeover plan');
});

test('post-hero styles activate without blocking hero paint',async({page})=>{
  await page.goto('/',{waitUntil:'domcontentloaded'});
  for(const id of ['post-fixes-styles','experience-styles'])expect(['print','all']).toContain(await page.locator(`#${id}`).getAttribute('media'));
  await page.waitForFunction(()=>document.body.classList.contains('experience-ready'));
  await expect(page.locator('#experience-styles')).toHaveAttribute('media','all');await expect(page.locator('#post-fixes-styles')).toHaveAttribute('media','all');
});

for(const [width,height] of [[1920,1080],[1440,900],[1366,768],[1280,720],[1024,768],[768,1024],[430,932],[390,844],[375,812],[360,800]]){
  test(`no horizontal overflow anywhere at ${width}x${height}`,async({page})=>{
    await page.setViewportSize({width,height});await waitReady(page);
    for(const selector of ['#plans','#work','#services','#system','#studio','#contact']){await scrollTo(page,selector);const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);expect(overflow).toBeLessThanOrEqual(1)}
  });
}

for(const width of [430,390,375,360]){
  test(`mobile typography stays inside the viewport at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:844});await waitReady(page);
    for(const [section,heading] of [['#plans','#plans-title'],['#work','#work-title'],['#services','#services-title'],['#system','#system-title'],['#studio','#studio-title'],['#contact','#contact-title']]){await scrollTo(page,section);await expectInsideViewport(page,page.locator(heading),1)}
    for(const row of await page.locator('.service-row h3').all())await expectInsideViewport(page,row,1);
  });
}

test('mobile sections use normal document flow instead of sticky desktop choreography',async({page})=>{
  await page.setViewportSize({width:390,height:844});await waitReady(page);
  for(const selector of ['#plans','#work','#services','#system','#studio']){const position=await page.locator(selector).evaluate(el=>getComputedStyle(el).position);expect(position).not.toBe('sticky')}
  const planHeight=await page.locator('#plans').evaluate(el=>el.getBoundingClientRect().height);expect(planHeight).toBeLessThan(5000);
});

test('reduced motion keeps every sales section visible',async({browser})=>{
  const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1280,height:800}});const page=await context.newPage();await waitReady(page);
  for(const selector of ['#plans','#work','#services','#system','#studio','#contact'])await expect(page.locator(selector)).toBeVisible();
  for(const item of await page.locator('.reveal-item').all())expect(Number(await item.evaluate(el=>getComputedStyle(el).opacity))).toBeGreaterThan(.9);
  await context.close();
});
