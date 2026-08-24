import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const serious=r=>r.violations.filter(v=>['serious','critical'].includes(v.impact));
const clearOpening=async page=>{await page.evaluate(()=>{document.querySelectorAll('.opening-sequence,.scope-open,.founder-open').forEach(n=>n.remove());document.body.classList.remove('polish-opening','hf-intro-active')})};
const openPage=async(page,route='/')=>{
  await page.goto(route,{waitUntil:'networkidle'});
  await clearOpening(page);
  await page.waitForSelector('link[data-useful-ux-v11][href="/useful-ux-v11.css"]',{state:'attached'});
  await page.waitForSelector('script[data-useful-ux-v11][src="/useful-ux-v11.js"]',{state:'attached'});
  await page.waitForFunction(()=>document.body.classList.contains('v11-ready'));
  if(route==='/'){
    await page.waitForSelector('[data-v11-outcomes]');
    await page.waitForFunction(()=>document.querySelector('[data-work-stage]')?.dataset.v11Stable==='true');
  }
};

test('homepage keeps seven scenes but replaces the old second scene with useful problem-first guidance',async({page})=>{
  await openPage(page);
  await expect(page.locator('[data-scene]')).toHaveCount(7);
  await expect(page.locator('#services')).toHaveAttribute('data-scene','outcomes');
  await expect(page.locator('#services')).toHaveClass(/useful-outcomes/);
  await expect(page.locator('#services [data-capability-stage]')).toHaveCount(0);
  await expect(page.locator('#services [data-v11-outcome]')).toHaveCount(3);
  await expect(page.locator('#services')).toContainText('A better website should do a job.');
  await expect(page.locator('header.site-nav a[href="#services"]')).toHaveText('What we fix');
  await expect(page.locator('#mobile-menu a[href="#services"]')).toContainText('What we fix');
});

test('problem-first scene is useful, stateful and keyboard friendly',async({page})=>{
  await openPage(page);
  const section=page.locator('#services');
  await expect(section).toHaveAttribute('data-sc-verify-state','outcome:clarity');
  await expect(page.locator('[data-v11-title]')).toHaveText('Make the business obvious in seconds.');
  const enquiries=page.locator('[data-v11-outcome="enquiries"]');
  await enquiries.click();
  await expect(section).toHaveAttribute('data-sc-verify-state','outcome:enquiries');
  await expect(page.locator('[data-v11-title]')).toHaveText('Turn browsing into better enquiries.');
  const scopeHref=await page.locator('[data-v11-scope]').getAttribute('href');
  expect(decodeURIComponent(scopeHref)).toContain('Enquiries arrive with no context');
  await enquiries.focus();
  await page.keyboard.press('ArrowRight');
  await expect(section).toHaveAttribute('data-sc-verify-state','outcome:system');
  await expect(page.locator('[data-v11-title]')).toHaveText('Build something you can keep improving.');
  await expect(page.locator('#v11-outcome-panel')).toHaveAttribute('aria-labelledby','v11-tab-system');
});

test('FakhriMart client display has one desktop control system and uses the real mobile proof',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await openPage(page);
  await page.locator('#work').scrollIntoViewIfNeeded();
  await page.waitForSelector('.v9-proof-reel__item');
  await expect(page.locator('[data-work-toggle]')).toHaveCount(0);
  await expect(page.locator('.v8-work-chapters')).toHaveCount(0);
  await expect(page.locator('.v8-work-progress')).toHaveCount(0);
  await expect(page.locator('.v9-proof-reel')).toBeVisible();
  await expect(page.locator('.v8-work-modebar')).toBeHidden();
  await expect(page.locator('[data-v9-proof="mobile"] img')).toHaveAttribute('src','/assets/fakhrimart-case-mobile.png');
  await expect(page.locator('[data-work-stage]')).toHaveAttribute('data-v11-stable','true');
});

test('manual client mode remains stable while the user inspects it',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await openPage(page);
  await page.locator('#work').scrollIntoViewIfNeeded();
  await page.waitForSelector('[data-v9-proof="mobile"]');
  const stage=page.locator('[data-work-stage]');
  await page.locator('[data-v9-proof="mobile"]').click();
  await expect(stage).toHaveAttribute('data-sc-verify-state','work:mobile');
  await page.evaluate(()=>scrollBy(0,420));
  await page.waitForTimeout(220);
  await expect(stage).toHaveAttribute('data-sc-verify-state','work:mobile');
  await expect(page.locator('.v11-work-feedback')).toContainText('mobile website view');
  await page.locator('[data-v9-proof="detail"]').click();
  await expect(stage).toHaveAttribute('data-sc-verify-state','work:detail');
  await expect(page.locator('.v8-work-detail')).toHaveAttribute('aria-hidden','false');
});

test('mobile client display exposes only the compact mode selector',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await openPage(page);
  await page.locator('#work').scrollIntoViewIfNeeded();
  await expect(page.locator('.v9-proof-reel')).toBeHidden();
  await expect(page.locator('.v8-work-modebar')).toBeVisible();
  await expect(page.locator('.v8-work-modebar button')).toHaveCount(3);
  const stage=page.locator('[data-work-stage]');
  await page.locator('.v8-work-modebar [data-v8-work-mode="mobile"]').click();
  await expect(stage).toHaveAttribute('data-sc-verify-state','work:mobile');
  await page.locator('.v8-work-modebar [data-v8-work-mode="detail"]').click();
  await expect(stage).toHaveAttribute('data-sc-verify-state','work:detail');
});

test('case-study dialog still opens with real client proof',async({page})=>{
  await openPage(page);
  await page.locator('#work').scrollIntoViewIfNeeded();
  const trigger=page.locator('.m6-view-tag');
  await expect(trigger).toBeVisible();
  await trigger.click();
  const dialog=page.locator('.m6-case-dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('FakhriMart');
  await expect(dialog.locator('.v8-dialog-mobile img[src="/assets/fakhrimart-case-mobile.png"]')).toHaveCount(1);
  await dialog.locator('.m6-case-dialog__close').click();
  await expect(dialog).not.toBeVisible();
});

test('contact gives direct user-friendly alternatives',async({page})=>{
  await openPage(page);
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-v11-copy-email]')).toBeVisible();
  await expect(page.locator('.v11-contact-tools a[href="/plans"]')).toContainText('See pricing first');
  await expect(page.locator('.v11-contact-note')).toContainText('No form');
  await expect(page.locator('.close__brief-note')).toContainText('project brief is ready');
});

test('mobile quick actions appear only after the hero and disappear near the final CTA',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await openPage(page);
  const quick=page.locator('.v11-mobile-actions');
  await expect(quick).toHaveAttribute('aria-hidden','true');
  await page.evaluate(()=>scrollTo(0,innerHeight*.9));
  await page.waitForTimeout(120);
  await expect(quick).toHaveClass(/is-visible/);
  await expect(quick).toHaveAttribute('aria-hidden','false');
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.waitForTimeout(120);
  await expect(quick).toHaveAttribute('aria-hidden','true');
});

test('pricing model remains correct after V11 UX changes',async({page})=>{
  await openPage(page,'/plans');
  for(const text of ['₹2,599','₹3,999','₹5,999+','₹9,999','₹17,999','₹25K–₹35K+'])await expect(page.locator('main')).toContainText(text);
  await expect(page.locator('.build-card')).toHaveCount(6);
  await expect(page.locator('.compare-hint')).toContainText('Swipe sideways');
  const planHref=await page.locator('#business a[href^="mailto:"]').getAttribute('href');
  expect(decodeURIComponent(planHref)).toContain('I am interested in the Business Experience');
});

test('Founder and Terms remain intact',async({page})=>{
  await openPage(page,'/founder');
  await expect(page.locator('[data-founder-scene]')).toHaveCount(6);
  const reveal=page.locator('[data-founder-colour-toggle]');
  await reveal.click();
  await expect(reveal).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('[data-founder-portrait]')).toHaveClass(/is-revealed/);
  const founderHref=await page.locator('[data-founder-project-cta]').getAttribute('href');
  expect(decodeURIComponent(founderHref)).toContain('What needs to improve:');
  await openPage(page,'/terms');
  await expect(page.locator('.terms-section')).toHaveCount(12);
  await expect(page.locator('.terms-quick__grid a')).toHaveCount(4);
  await expect(page.locator('body')).toContainText('Monthly plans currently start at ₹2,599/month');
});

test('HyperFrames intro and editorial handoff remain intact',async({page})=>{
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await expect(page.locator('[data-hf-intro-video]')).toHaveCount(1);
  await page.locator('[data-hf-skip]').click();
  await page.waitForTimeout(600);
  await expect(page.locator('[data-editorial-sequence] .editorial-sequence__word')).toHaveCount(3);
  await expect(page.locator('[data-editorial-sequence]')).toContainText('ONE STUDIO.');
});

test('the opening film never flashes past before its minimum watch window, but Skip remains immediate',async({page})=>{
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await expect(page.locator('[data-hf-intro-video]')).toHaveCount(1);
  await page.waitForTimeout(900);
  await expect(page.locator('body')).toHaveClass(/hf-intro-active/);
  await page.locator('[data-hf-skip]').click();
  await page.waitForTimeout(600);
  await expect(page.locator('body')).not.toHaveClass(/hf-intro-active/);
});

test('project CTA opens a structured brief for the selected project type',async({page})=>{
  await openPage(page);
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.locator('[data-project-type="ai"]').click();
  const href=await page.locator('[data-project-cta]').getAttribute('href');
  expect(decodeURIComponent(href)).toContain('I would like help with a useful AI project.');
  expect(decodeURIComponent(href)).toContain('Approximate budget:');
});

for(const route of ['/','/plans','/founder','/terms']) test(`${route} has no serious accessibility violations under V11`,async({page})=>{
  await openPage(page,route);
  const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  expect(serious(results)).toEqual([]);
});

for(const [w,h] of [[320,720],[390,844],[768,1024],[1440,900],[1920,1080]]) test(`V11 public pages avoid overflow at ${w}x${h}`,async({page})=>{
  await page.setViewportSize({width:w,height:h});
  for(const route of ['/','/plans','/founder','/terms']){
    await openPage(page,route);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth),`${route}@${w}`).toBeLessThanOrEqual(1);
  }
});

test('reduced motion keeps useful guidance and client controls available',async({browser})=>{
  const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1280,height:800}});
  const page=await context.newPage();
  await page.goto('/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.body.classList.contains('v11-ready'));
  await expect(page.locator('.opening-sequence')).toBeHidden();
  await expect(page.locator('[data-v11-outcomes]')).toBeVisible();
  await expect(page.locator('[data-work-stage]')).toBeVisible();
  await expect(page.locator('.v9-proof-reel')).toBeVisible();
  await context.close();
});
