import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const serious=result=>result.violations.filter(violation=>['serious','critical'].includes(violation.impact));
const clearOpening=async page=>page.evaluate(()=>{document.querySelectorAll('.opening-sequence,.scope-open,.founder-open').forEach(node=>node.remove());document.body.classList.remove('polish-opening','hf-intro-active','is-opening')});
const openPage=async(page,route='/')=>{await page.goto(route,{waitUntil:'networkidle'});await clearOpening(page);if(route==='/'){await page.waitForSelector('[data-v15-play]');await page.waitForSelector('[data-v14-rates]');await page.waitForFunction(()=>document.body.classList.contains('home-v20'))}};

test('current homepage runtime keeps eight scenes and the V15/V20 experience layers',async({page})=>{
  await openPage(page);await expect(page.locator('[data-scene]')).toHaveCount(8);await expect(page.locator('link[href="/assets/brayro-home.css"]')).toHaveCount(1);await expect(page.locator('body')).toHaveClass(/home-v20/);await expect(page.locator('#services')).toHaveAttribute('data-v15-play','');await expect(page.locator('#services [data-v15-control]')).toHaveCount(4);await expect(page.locator('#services [data-v14-frame]')).toHaveCount(0);await expect(page.locator('#plans')).toHaveAttribute('data-v14-rates','');await expect(page.locator('#plans [data-v14-rate]')).toHaveCount(3);await expect(page.locator('[data-v20-scene-rail]')).toHaveCount(1);
});

test('hero remains readable and structurally stable',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await openPage(page);const title=page.locator('.v12-hero-title');await expect(title).toBeVisible();await expect(title).toContainText('Digital, designed');await expect(title).toContainText('to feel different.');const box=await title.boundingBox();expect(box).not.toBeNull();expect(box.width).toBeLessThanOrEqual(1440*.93);expect(box.x).toBeGreaterThanOrEqual(0);await expect(page.locator('.hero__body')).toContainText('practical AI systems');
});

test('playful second scene responds to hover, click and pointer movement',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await openPage(page);const play=page.locator('#services');await play.scrollIntoViewIfNeeded();await expect(play.locator('[data-v15-stage]')).toBeVisible();await expect(play).toHaveAttribute('data-play-state','web');await play.locator('[data-v15-control="1"]').hover();await expect(play).toHaveAttribute('data-play-state','product');await play.locator('[data-v15-control="3"]').click();await expect(play).toHaveAttribute('data-play-state','ai');await expect(play.locator('[data-v15-counter]')).toHaveText('04 / 04');await expect(play.locator('[data-v12-story-word]')).toHaveText('AI');
});

test('selected work uses verified FakhriMart proof',async({page})=>{
  await openPage(page);const work=page.locator('#work');await work.scrollIntoViewIfNeeded();await expect(work.locator('[data-v12-project]')).toHaveCount(3);const client=work.locator('[data-v12-project]').first();await expect(client).toContainText('FakhriMart');await expect(client).toHaveAttribute('href','https://fakhriyarns.vercel.app/');await client.dispatchEvent('pointerenter');await expect(page.locator('[data-v12-project-preview]')).toHaveClass(/is-visible/);await expect(page.locator('[data-v12-project-preview] img')).toHaveAttribute('src','/assets/fakhrimart-case-desktop.png');
});

test('AI products expose verified prices and detailed service pages',async({page})=>{
  await openPage(page);const ai=page.locator('#ai-systems');await ai.scrollIntoViewIfNeeded();await expect(ai.locator('.v12-product-card')).toHaveCount(2);for(const text of ['AI Workflow Audit','₹9,999','Company Second Brain','From ₹29,999'])await expect(ai).toContainText(text);await expect(ai.locator('a[href="/ai-workflow-audit"]')).toHaveCount(1);await expect(ai.locator('a[href="/company-second-brain"]')).toHaveCount(1);
});

test('homepage pricing stays concise while /plans stays detailed',async({page})=>{
  await openPage(page);const rates=page.locator('#plans');await rates.scrollIntoViewIfNeeded();await expect(rates.locator('[data-v14-rate]')).toHaveCount(3);for(const text of ['Website partnership','Complete website build','AI systems','₹2,599','₹9,999','₹29,999+ build'])await expect(rates).toContainText(text);await openPage(page,'/plans');await expect(page.locator('.build-card')).toHaveCount(6);await expect(page.locator('.ai-plan-card')).toHaveCount(2);await expect(page.locator('.compare-table')).toHaveCount(3);
});

test('AI service detail interactions remain complete',async({page})=>{
  await openPage(page,'/ai-workflow-audit');await expect(page.locator('[data-process-tab]')).toHaveCount(5);await page.locator('[data-process-tab]').nth(2).click();await expect(page.locator('[data-process-title]')).toContainText('Score opportunities');await expect(page.locator('.deliver')).toHaveCount(6);await openPage(page,'/company-second-brain');await expect(page.locator('[data-arch-node]')).toHaveCount(5);await page.locator('[data-arch-node="drive"]').click();await expect(page.locator('[data-arch-status]')).toContainText('Drive folders');await expect(page.locator('main')).toContainText('14 days of launch support');
});

test('core homepage controls still work',async({page})=>{
  await openPage(page);const colour=page.locator('[data-colour-toggle]');await colour.click();await expect(colour).toHaveAttribute('aria-pressed','true');await page.locator('#work').scrollIntoViewIfNeeded();const toggle=page.locator('[data-work-toggle]');await toggle.click();await expect(page.locator('[data-work-stage]')).toHaveAttribute('data-sc-verify-state','work:mobile');await page.locator('#contact').scrollIntoViewIfNeeded();await page.locator('[data-project-type="ai"]').click();await expect(page.locator('[data-project-intent]')).toHaveAttribute('data-sc-verify-state','project:ai');
});

test('Plans preserves all public web and AI offers',async({page})=>{
  await openPage(page,'/plans');await expect(page.locator('[data-plan-scene]')).toHaveCount(7);await expect(page.locator('.build-card')).toHaveCount(6);await expect(page.locator('.ai-plan-card')).toHaveCount(2);for(const text of ['₹2,599','₹3,999','₹5,999+','₹17,999','₹25K–₹35K+','AI Workflow Audit','₹9,999','Company Second Brain','From ₹29,999','Knowledge Care','From ₹2,999/mo'])await expect(page.locator('main')).toContainText(text);
});

test('opening film remains intact and skippable',async({page})=>{
  await page.goto('/',{waitUntil:'domcontentloaded'});await expect(page.locator('[data-hf-intro-video]')).toHaveCount(1);await expect(page.locator('[data-hf-skip]')).toBeVisible();await page.locator('[data-hf-skip]').click();await page.waitForTimeout(600);await expect(page.locator('body')).not.toHaveClass(/hf-intro-active/);
});

for(const route of ['/','/plans','/founder','/terms','/ai-workflow-audit','/company-second-brain'])test(`${route} has no serious accessibility violations`,async({page})=>{await openPage(page,route);const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();expect(serious(results)).toEqual([])});

for(const [width,height] of [[320,720],[390,844],[768,1024],[1440,900],[1920,1080]])test(`public pages avoid horizontal overflow at ${width}x${height}`,async({page})=>{await page.setViewportSize({width,height});for(const route of ['/','/plans','/founder','/terms','/ai-workflow-audit','/company-second-brain']){await openPage(page,route);expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth),`${route}@${width}`).toBeLessThanOrEqual(1)}});

test('reduced motion keeps the site readable and operable',async({browser})=>{
  const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1280,height:800}});const page=await context.newPage();await page.goto('/',{waitUntil:'networkidle'});await expect(page.locator('.opening-sequence')).toBeHidden();await expect(page.locator('[data-v15-play]')).toBeVisible();await expect(page.locator('[data-v15-control]')).toHaveCount(4);await page.locator('[data-v15-control="3"]').click();await expect(page.locator('#services')).toHaveAttribute('data-play-state','ai');await context.close();
});
