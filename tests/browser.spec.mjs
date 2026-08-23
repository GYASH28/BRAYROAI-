import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const serious=r=>r.violations.filter(v=>['serious','critical'].includes(v.impact));
const clearOpening=async page=>{await page.evaluate(()=>{document.querySelectorAll('.opening-sequence,.scope-open,.founder-open').forEach(n=>n.remove());document.body.classList.remove('polish-opening','hf-intro-active')})};
const openPage=async(page,route='/')=>{await page.goto(route,{waitUntil:'networkidle'});await clearOpening(page);await page.waitForSelector('link[data-art-direction-v7]',{state:'attached'})};

test('homepage keeps seven scenes, dual pricing and Art Direction V7',async({page})=>{
  await openPage(page);
  await expect(page.locator('[data-scene]')).toHaveCount(7);
  await expect(page.locator('link[data-motion-v6][href="/motion-v6.css"]')).toHaveCount(1);
  await expect(page.locator('script[data-motion-v6][src="/motion-v6.js"]')).toHaveCount(1);
  await expect(page.locator('link[data-art-direction-v7][href="/art-direction-v7.css"]')).toHaveCount(1);
  await expect(page.locator('script[data-art-direction-v7][src="/art-direction-v7.js"]')).toHaveCount(1);
  await expect(page.locator('.v7-hero-meta')).toHaveCount(1);
  await expect(page.locator('.v7-browserbar')).toHaveCount(1);
  await expect(page.locator('.v7-work-proof')).toHaveCount(1);
  await expect(page.locator('#plans .pricing-mini.v7-recommended')).toHaveCount(2);
  expect(await page.locator('[data-m6-spotlight]').count()).toBeGreaterThanOrEqual(5);
  const plans=page.locator('#plans');
  for(const t of ['₹2,599','₹3,999','₹5,999+','₹9,999','₹17,999','₹25K–₹35K+','Ongoing website partnership','Complete website builds']) await expect(plans).toContainText(t);
});

test('HyperFrames intro is the only homepage video experience',async({page})=>{
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await expect(page.locator('[data-hf-intro-video]')).toHaveCount(1);
  await expect(page.locator('[data-editorial-sequence] video,[data-commercial-film]')).toHaveCount(0);
  await expect(page.locator('[data-hf-sound]')).toBeVisible();
  await page.locator('[data-hf-skip]').click();
  await page.waitForTimeout(600);
  await expect(page.locator('body')).not.toHaveClass(/hf-intro-active/);
});

test('case-study dialog opens and closes accessibly',async({page})=>{
  await openPage(page);
  await page.locator('#work').scrollIntoViewIfNeeded();
  const trigger=page.locator('.m6-view-tag');
  await expect(trigger).toBeVisible();
  await trigger.click();
  const dialog=page.locator('.m6-case-dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Built to make browsing feel obvious.');
  await expect(dialog.locator('a[href="https://fakhriyarns.vercel.app/"]')).toHaveCount(1);
  await dialog.locator('.m6-case-dialog__close').click();
  await expect(dialog).not.toBeVisible();
});

test('editorial DESIGN BUILD SHIP sequence remains native',async({page})=>{
  await openPage(page);
  const sequence=page.locator('[data-editorial-sequence]');
  await expect(sequence.locator('.editorial-sequence__word')).toHaveCount(3);
  await expect(sequence).toContainText('ONE STUDIO.');
  await page.evaluate(()=>{const n=document.querySelector('[data-editorial-sequence]');const top=n.getBoundingClientRect().top+scrollY;const range=n.offsetHeight-innerHeight;scrollTo(0,top+range*.84)});
  await page.waitForTimeout(180);
  await expect(sequence).toHaveAttribute('data-sc-verify-state','editorial:join');
});

test('core homepage interactions still work under V7',async({page})=>{
  await openPage(page);
  await page.locator('[data-colour-toggle]').click();await expect(page.locator('[data-colour-toggle]')).toHaveAttribute('aria-pressed','true');
  await page.locator('[data-capability="ai"]').click();await expect(page.locator('[data-capability-stage]')).toHaveAttribute('data-sc-verify-state','capability:ai');
  await page.locator('[data-work-toggle]').click();await expect(page.locator('[data-work-stage]')).toHaveAttribute('data-sc-verify-state','work:mobile');
  await page.locator('[data-project-type="ai"]').click();await expect(page.locator('[data-project-intent]')).toHaveAttribute('data-sc-verify-state','project:ai');
});

test('Plans keeps six offers and featured paper hierarchy',async({page})=>{
  await openPage(page,'/plans');
  await expect(page.locator('[data-plan-scene]')).toHaveCount(6);
  await expect(page.locator('.build-card')).toHaveCount(6);
  await expect(page.locator('.build-card.is-featured')).toHaveCount(2);
  for(const t of ['₹2,599','₹3,999','₹5,999+','PER MONTH / ONGOING','₹9,999','₹17,999','₹25K–₹35K+','ONE-TIME BUILD']) await expect(page.locator('main')).toContainText(t);
  const monthly=page.locator('[data-plan-mode="monthly"]');await monthly.click();await expect(monthly).toHaveAttribute('aria-pressed','true');await expect(page.locator('[data-plan-mode-output] strong')).toHaveText('₹3,999/mo');
  const once=page.locator('[data-plan-mode="onetime"]');await once.click();await expect(page.locator('[data-plan-mode-output] strong')).toHaveText('₹17,999');
});

test('Terms becomes a readable paper document without losing content',async({page})=>{
  await openPage(page,'/terms');
  await expect(page.locator('h1')).toContainText('Clear terms.');
  await expect(page.locator('.terms-section')).toHaveCount(12);
  await expect(page.locator('body')).toContainText('Monthly plans currently start at ₹2,599/month');
  await expect(page.locator('body')).toContainText('One-time website builds currently start at ₹9,999');
  const background=await page.locator('body').evaluate(node=>getComputedStyle(node).backgroundColor);
  expect(background).toBe('rgb(236, 232, 223)');
});

test('Founder page keeps six scenes and editorial contrast',async({page})=>{
  await openPage(page,'/founder');
  await expect(page.locator('[data-founder-scene]')).toHaveCount(6);
  await page.locator('[data-principle="craft"]').click();
  await expect(page.locator('[data-principle-stage]')).toHaveAttribute('data-sc-verify-state','principle:craft');
  const storyBg=await page.locator('#story').evaluate(node=>getComputedStyle(node).backgroundColor);
  expect(storyBg).toBe('rgb(236, 232, 223)');
});

for(const route of ['/','/plans','/founder','/terms']) test(`${route} has no serious accessibility violations`,async({page})=>{await openPage(page,route);const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();expect(serious(results)).toEqual([])});

for(const [w,h] of [[320,720],[390,844],[768,1024],[1440,900],[1920,1080]]) test(`public pages avoid overflow at ${w}x${h}`,async({page})=>{await page.setViewportSize({width:w,height:h});for(const route of ['/','/plans','/founder','/terms']){await openPage(page,route);expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth),`${route}@${w}`).toBeLessThanOrEqual(1)}});

test('reduced motion keeps all content available',async({browser})=>{const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1280,height:800}});const page=await context.newPage();await page.goto('/',{waitUntil:'networkidle'});await expect(page.locator('.opening-sequence')).toBeHidden();for(const s of ['#services','[data-editorial-sequence]','#work','#plans','#studio','#contact'])await expect(page.locator(s)).toBeVisible();await context.close()});
