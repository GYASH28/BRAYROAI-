import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const serious=r=>r.violations.filter(v=>['serious','critical'].includes(v.impact));
const clearOpening=async page=>{await page.evaluate(()=>{document.querySelectorAll('.opening-sequence,.scope-open,.founder-open').forEach(n=>n.remove());document.body.classList.remove('polish-opening','hf-intro-active')})};
const openPage=async(page,route='/')=>{
  await page.goto(route,{waitUntil:'networkidle'});
  await clearOpening(page);
  await page.waitForSelector('link[data-useful-ux-v11][href="/useful-ux-v11.css"]',{state:'attached'});
  await page.waitForSelector('script[data-useful-ux-v11][src="/useful-ux-v11.js"]',{state:'attached'});
  if(route==='/'){
    await page.waitForSelector('link[data-stability-v12][href="/stability-v12.css"]',{state:'attached'});
    await page.waitForFunction(()=>document.body.classList.contains('v12-ready'));
    await page.waitForFunction(()=>document.querySelector('[data-work-stage]')?.dataset.v11Stable==='true');
  }
};

test('second scene is useful static HTML instead of runtime replacement',async({page})=>{
  await openPage(page);
  await expect(page.locator('[data-scene]')).toHaveCount(7);
  await expect(page.locator('#services')).toHaveCount(0);
  const section=page.locator('#outcomes');
  await expect(section).toHaveClass(/useful-outcomes/);
  await expect(section).toHaveAttribute('data-scene','outcomes');
  await expect(section.locator('[data-v12-outcome]')).toHaveCount(3);
  await expect(section).toContainText('A better website should do a job.');
  await expect(section).toContainText('Make the business obvious in seconds.');
  await expect(section.locator('.v12-outcome-strip>span')).toHaveCount(4);
  await expect(page.locator('header.site-nav a[href="#outcomes"]')).toHaveText('What we fix');
  await expect(page.locator('#mobile-menu a[href="#outcomes"]')).toContainText('What we fix');
});

test('second scene content exists even with JavaScript disabled',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:1280,height:800}});
  const page=await context.newPage();
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await expect(page.locator('#outcomes')).toContainText('A better website should do a job.');
  await expect(page.locator('#outcomes')).toContainText('Make the business obvious in seconds.');
  await expect(page.locator('#outcomes [data-v12-outcome]')).toHaveCount(3);
  await context.close();
});

test('outcomes tabs update useful content and keyboard state',async({page})=>{
  await openPage(page);
  const section=page.locator('#outcomes');
  await expect(section).toHaveAttribute('data-sc-verify-state','outcome:clarity');
  const enquiries=page.locator('[data-v12-outcome="enquiries"]');
  await enquiries.click();
  await expect(section).toHaveAttribute('data-sc-verify-state','outcome:enquiries');
  await expect(page.locator('[data-v12-title]')).toHaveText('Turn browsing into better enquiries.');
  await enquiries.focus();
  await page.keyboard.press('ArrowRight');
  await expect(section).toHaveAttribute('data-sc-verify-state','outcome:system');
  await expect(page.locator('[data-v12-title]')).toHaveText('Build something you can keep improving.');
  await expect(page.locator('#v12-outcome-panel')).toHaveAttribute('aria-labelledby','v12-tab-system');
});

for(const [w,h] of [[320,720],[390,844],[768,1024],[1440,900],[1920,1080]]) test(`hero geometry stays aligned at ${w}x${h}`,async({page})=>{
  await page.setViewportSize({width:w,height:h});
  await openPage(page);
  const m=await page.evaluate(()=>{
    const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}};
    return {w:innerWidth,h:innerHeight,copy:rect('.hero__copy'),headline:rect('.hero__copy h1'),actions:rect('.hero__actions'),subject:rect('.hero__subject'),stage:rect('.hero__stage')};
  });
  expect(m.copy.left,`copy left @${w}`).toBeGreaterThanOrEqual(-1);
  expect(m.copy.right,`copy right @${w}`).toBeLessThanOrEqual(m.w+1);
  expect(m.copy.top,`copy top @${w}`).toBeGreaterThanOrEqual(-1);
  expect(m.copy.bottom,`copy bottom @${w}`).toBeLessThanOrEqual(m.h+2);
  expect(m.headline.width,`headline width @${w}`).toBeLessThanOrEqual(m.w);
  expect(m.actions.left,`actions left @${w}`).toBeGreaterThanOrEqual(-1);
  expect(m.actions.right,`actions right @${w}`).toBeLessThanOrEqual(m.w+1);
  expect(m.subject.right,`subject should intersect viewport @${w}`).toBeGreaterThan(m.w*.48);
  expect(m.subject.left,`subject should not drift offscreen @${w}`).toBeLessThan(m.w*.92);
  expect(m.subject.top,`subject should be visible @${w}`).toBeLessThan(m.h*.88);
  expect(m.stage.height,`hero stage height @${w}`).toBeGreaterThanOrEqual(Math.min(m.h,700));
});

test('second scene has substantial visible content on desktop and mobile',async({page})=>{
  for(const viewport of [{width:390,height:844},{width:1440,height:900}]){
    await page.setViewportSize(viewport);
    await openPage(page);
    await page.locator('#outcomes').scrollIntoViewIfNeeded();
    const metrics=await page.locator('#outcomes').evaluate(node=>{const r=node.getBoundingClientRect();const panel=node.querySelector('.v11-outcome-panel').getBoundingClientRect();return {section:r.height,panel:panel.height}});
    expect(metrics.section,`outcomes section ${viewport.width}`).toBeGreaterThan(viewport.height*.85);
    expect(metrics.panel,`outcomes panel ${viewport.width}`).toBeGreaterThan(260);
    await expect(page.locator('#outcomes .v11-outcome-panel')).toBeVisible();
  }
});

test('FakhriMart client display remains stable after layout fix',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await openPage(page);
  await page.locator('#work').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-work-toggle]')).toHaveCount(0);
  await expect(page.locator('.v8-work-chapters')).toHaveCount(0);
  await expect(page.locator('.v9-proof-reel')).toBeVisible();
  await expect(page.locator('[data-v9-proof="mobile"] img')).toHaveAttribute('src','/assets/fakhrimart-case-mobile.png');
  const stage=page.locator('[data-work-stage]');
  await page.locator('[data-v9-proof="mobile"]').click();
  await expect(stage).toHaveAttribute('data-sc-verify-state','work:mobile');
  await page.evaluate(()=>scrollBy(0,420));
  await page.waitForTimeout(220);
  await expect(stage).toHaveAttribute('data-sc-verify-state','work:mobile');
  await page.locator('[data-v9-proof="detail"]').click();
  await expect(stage).toHaveAttribute('data-sc-verify-state','work:detail');
});

test('mobile client display keeps one compact control system',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await openPage(page);
  await page.locator('#work').scrollIntoViewIfNeeded();
  await expect(page.locator('.v9-proof-reel')).toBeHidden();
  await expect(page.locator('.v8-work-modebar')).toBeVisible();
  await expect(page.locator('.v8-work-modebar button')).toHaveCount(3);
  await page.locator('.v8-work-modebar [data-v8-work-mode="mobile"]').click();
  await expect(page.locator('[data-work-stage]')).toHaveAttribute('data-sc-verify-state','work:mobile');
});

test('case-study dialog and contact helpers still work',async({page})=>{
  await openPage(page);
  await page.locator('#work').scrollIntoViewIfNeeded();
  const trigger=page.locator('.m6-view-tag');
  await expect(trigger).toBeVisible();
  await trigger.click();
  const dialog=page.locator('.m6-case-dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('FakhriMart');
  await dialog.locator('.m6-case-dialog__close').click();
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-v11-copy-email]')).toBeVisible();
  await expect(page.locator('.v11-contact-tools a[href="/plans"]')).toContainText('See pricing first');
});

test('pricing, Founder, Terms and HyperFrames remain intact',async({page})=>{
  await openPage(page,'/plans');
  for(const text of ['₹2,599','₹3,999','₹5,999+','₹9,999','₹17,999','₹25K–₹35K+'])await expect(page.locator('main')).toContainText(text);
  await openPage(page,'/founder');
  await expect(page.locator('[data-founder-scene]')).toHaveCount(6);
  await openPage(page,'/terms');
  await expect(page.locator('.terms-section')).toHaveCount(12);
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await expect(page.locator('[data-hf-intro-video]')).toHaveCount(1);
});

for(const route of ['/','/plans','/founder','/terms']) test(`${route} has no serious accessibility violations under V12`,async({page})=>{
  await openPage(page,route);
  const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  expect(serious(results)).toEqual([]);
});

for(const [w,h] of [[320,720],[390,844],[768,1024],[1440,900],[1920,1080]]) test(`V12 public pages avoid overflow at ${w}x${h}`,async({page})=>{
  await page.setViewportSize({width:w,height:h});
  for(const route of ['/','/plans','/founder','/terms']){
    await openPage(page,route);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth),`${route}@${w}`).toBeLessThanOrEqual(1);
  }
});

test('reduced motion keeps static outcomes and client controls available',async({browser})=>{
  const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1280,height:800}});
  const page=await context.newPage();
  await page.goto('/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.body.classList.contains('v12-ready'));
  await expect(page.locator('.opening-sequence')).toBeHidden();
  await expect(page.locator('#outcomes')).toBeVisible();
  await expect(page.locator('[data-v12-outcome]')).toHaveCount(3);
  await expect(page.locator('[data-work-stage]')).toBeVisible();
  await expect(page.locator('.v9-proof-reel')).toBeVisible();
  await context.close();
});
