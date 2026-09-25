import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const serious=result=>result.violations.filter(violation=>['serious','critical'].includes(violation.impact));
const clearOpening=async page=>page.evaluate(()=>{document.querySelectorAll('.opening-sequence,.scope-open,.founder-open').forEach(node=>node.remove());document.body.classList.remove('polish-opening','hf-intro-active','is-opening')});
const openPage=async(page,route='/')=>{await page.goto(route,{waitUntil:'networkidle'});await clearOpening(page);if(route==='/'){await page.waitForSelector('[data-v15-play]');await page.waitForSelector('[data-v14-rates]');await page.waitForFunction(()=>document.body.classList.contains('home-v20'))}};
const scrollTo=async locator=>locator.evaluate(node=>node.scrollIntoView({block:'center',behavior:'auto'}));

test('homepage keeps work in its existing section and has a complete direct-contact footer',async({page})=>{
  await openPage(page);
  await expect(page.locator('.field-note,[data-project-studio-root]')).toHaveCount(0);
  await expect(page.locator('#work')).toContainText('FakhriMart');
  await expect(page.locator('#work [data-fakhri-case-link]')).toHaveAttribute('href','/clients/fakhrimart');
  const footer=page.locator('.site-footer');
  await expect(footer.getByRole('heading',{name:/Have something/})).toBeVisible();
  await expect(footer.locator('a[href="/clients"]')).toHaveCount(1);
  await expect(footer.locator('a[href="#work"]')).toHaveCount(1);
  await expect(footer.locator('a[href="mailto:yashganesh.work@gmail.com"]')).toHaveCount(1);
  await expect(footer.locator('a[href="#top"]')).toHaveCount(1);
});

test('current homepage runtime keeps eight scenes and the V15/V20 experience layers',async({page})=>{
  await openPage(page);await expect(page.locator('[data-scene]')).toHaveCount(8);await expect(page.locator('link[href="/assets/brayro-home.css"]')).toHaveCount(1);await expect(page.locator('body')).toHaveClass(/home-v20/);await expect(page.locator('#services')).toHaveAttribute('data-v15-play','');await expect(page.locator('#services [data-v15-control]')).toHaveCount(4);await expect(page.locator('#services [data-v14-frame]')).toHaveCount(0);await expect(page.locator('#plans')).toHaveAttribute('data-v14-rates','');await expect(page.locator('#plans [data-v14-rate]')).toHaveCount(3);await expect(page.locator('[data-v20-scene-rail]')).toHaveCount(1);
});

test('hero remains readable and structurally stable',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await openPage(page);const title=page.locator('.v12-hero-title');await expect(title).toBeVisible();await expect(title).toContainText('Digital, designed');await expect(title).toContainText('to feel different.');const box=await title.boundingBox();expect(box).not.toBeNull();expect(box.width).toBeLessThanOrEqual(1440*.93);expect(box.x).toBeGreaterThanOrEqual(0);await expect(page.locator('.hero__body')).toContainText('practical AI systems');
});

test('playful second scene responds to hover, click and pointer movement',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await openPage(page);const play=page.locator('#services');await scrollTo(play);await expect(play.locator('[data-v15-stage]')).toBeVisible();await expect(play).toHaveAttribute('data-play-state','web');await play.locator('[data-v15-control="1"]').hover();await expect(play).toHaveAttribute('data-play-state','product');await play.locator('[data-v15-control="3"]').dispatchEvent('click');await expect(play).toHaveAttribute('data-play-state','ai');await expect(play.locator('[data-v15-counter]')).toHaveText('04 / 04');await expect(play.locator('[data-v12-story-word]')).toHaveText('AI');
});

test('selected work uses verified FakhriMart proof',async({page})=>{
  await openPage(page);const work=page.locator('#work');await work.scrollIntoViewIfNeeded();await expect(work.locator('[data-v12-project]')).toHaveCount(3);const client=work.locator('[data-v12-project]').first();await expect(client).toContainText('FakhriMart');await expect(client).toHaveAttribute('href','https://fakhriyarns.vercel.app/');await client.dispatchEvent('pointerenter');await expect(page.locator('[data-v12-project-preview]')).toHaveClass(/is-visible/);await expect(page.locator('[data-v12-project-preview] img')).toHaveAttribute('src','/assets/fakhrimart-case-desktop.webp');
});

test('AI products expose verified prices and detailed service pages',async({page})=>{
  await openPage(page);const ai=page.locator('#ai-systems');await ai.scrollIntoViewIfNeeded();await expect(ai.locator('.v12-product-card')).toHaveCount(2);for(const text of ['AI Workflow Audit','₹9,999','Company Second Brain','From ₹29,999'])await expect(ai).toContainText(text);await expect(ai.locator('a[href="/ai-workflow-audit"]')).toHaveCount(1);await expect(ai.locator('a[href="/company-second-brain"]')).toHaveCount(1);
});

test('homepage pricing stays concise while /plans stays detailed',async({page})=>{
  await openPage(page);const rates=page.locator('#plans');await rates.scrollIntoViewIfNeeded();await expect(rates.locator('[data-v14-rate]')).toHaveCount(3);for(const text of ['Website partnership','Complete website build','AI systems','₹2,599','₹9,999','₹29,999+ build'])await expect(rates).toContainText(text);await openPage(page,'/plans');await expect(page.locator('.build-card')).toHaveCount(6);await expect(page.locator('.ai-plan-card')).toHaveCount(2);await expect(page.locator('.compare-table')).toHaveCount(3);
});

test('AI service detail interactions remain complete',async({page})=>{
  await openPage(page,'/ai-workflow-audit');const tabs=page.locator('[data-process-tab]');await expect(tabs).toHaveCount(5);await expect(tabs.first()).toHaveAttribute('tabindex','0');await expect(tabs.nth(1)).toHaveAttribute('tabindex','-1');await expect(tabs.first()).toHaveAttribute('aria-controls','audit-process-stage');await expect(tabs.first().locator('xpath=..')).toHaveAttribute('aria-orientation','vertical');await expect(page.locator('#audit-process-stage')).toHaveAttribute('role','tabpanel');await tabs.nth(2).click();await expect(tabs.nth(2)).toHaveAttribute('tabindex','0');await tabs.nth(2).press('End');await expect(tabs.last()).toHaveAttribute('tabindex','0');await tabs.last().press('Home');await expect(tabs.first()).toHaveAttribute('tabindex','0');await expect(page.locator('[data-process-title]')).toContainText('Choose one workflow');await expect(page.locator('.deliver')).toHaveCount(6);await openPage(page,'/company-second-brain');const nodes=page.locator('[data-arch-node]');await expect(nodes).toHaveCount(5);await expect(page.locator('[data-arch-status]')).toHaveAttribute('aria-live','polite');await page.locator('[data-arch-node="drive"]').click();await expect(page.locator('[data-arch-node="drive"]')).toHaveAttribute('aria-pressed','true');await expect(page.locator('[data-arch-node="docs"]')).toHaveAttribute('aria-pressed','false');await expect(page.locator('[data-arch-status]')).toContainText('Drive folders');await expect(page.locator('main')).toContainText('14 days of launch support');
});

test('core homepage controls still work',async({page})=>{
  await openPage(page);const colour=page.locator('[data-colour-toggle]');await colour.click();await expect(colour).toHaveAttribute('aria-pressed','true');await page.locator('#work').scrollIntoViewIfNeeded();const toggle=page.locator('[data-work-toggle]');await toggle.click();await expect(page.locator('[data-work-stage]')).toHaveAttribute('data-sc-verify-state','work:mobile');await page.locator('#contact').scrollIntoViewIfNeeded();await expect(page.locator('#contact .close__action')).toHaveAttribute('href',/wa\.me/);await expect(page.locator('#contact .close__email')).toHaveAttribute('href',/mailto:/);
});

test('Plans preserves all public web and AI offers',async({page})=>{
  await openPage(page,'/plans');await expect(page.locator('[data-plan-scene]')).toHaveCount(7);await expect(page.locator('.build-card')).toHaveCount(6);await expect(page.locator('.ai-plan-card')).toHaveCount(2);for(const text of ['₹2,599','₹3,999','₹5,999+','₹17,999','₹25K–₹35K+','AI Workflow Audit','₹9,999','Company Second Brain','From ₹29,999','Knowledge Care','From ₹2,999/mo'])await expect(page.locator('main')).toContainText(text);
});

test('opening film remains intact and skippable',async({page})=>{
  await page.goto('/',{waitUntil:'domcontentloaded'});await expect(page.locator('[data-hf-intro-video]')).toHaveCount(1);const skip=page.locator('[data-hf-skip]');await skip.click({timeout:1200}).catch(()=>{});await expect(page.locator('body')).not.toHaveClass(/hf-intro-active/,{timeout:9000});
});

for(const route of ['/','/plans','/founder','/terms','/ai-workflow-audit','/company-second-brain'])test(`${route} has no serious accessibility violations`,async({page})=>{await openPage(page,route);const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();expect(serious(results)).toEqual([])});

for(const [width,height] of [[320,720],[390,844],[768,1024],[1440,900],[1920,1080]])test(`public pages avoid horizontal overflow at ${width}x${height}`,async({page})=>{await page.setViewportSize({width,height});for(const route of ['/','/plans','/founder','/terms','/ai-workflow-audit','/company-second-brain']){await openPage(page,route);expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth),`${route}@${width}`).toBeLessThanOrEqual(1)}});

test('reduced motion keeps the site readable and operable',async({browser})=>{
  const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1280,height:800}});const page=await context.newPage();await page.goto('/',{waitUntil:'networkidle'});await expect(page.locator('.opening-sequence')).toBeHidden();await expect(page.locator('[data-v15-play]')).toBeVisible();await expect(page.locator('[data-v15-control]')).toHaveCount(4);await page.locator('[data-v15-control="3"]').click();await expect(page.locator('#services')).toHaveAttribute('data-play-state','ai');await context.close();
});


test('desktop menu remains open through harmless viewport resizing',async({page,browserName})=>{
  test.skip(browserName!=='chromium','Desktop navigation interaction only needs one engine');
  await page.setViewportSize({width:1440,height:900});
  await openPage(page,'/plans');
  await page.locator('[data-global-toggle]').click();
  await expect(page.locator('[data-global-menu]')).toBeVisible();
  await page.setViewportSize({width:1400,height:900});
  await expect(page.locator('[data-global-menu]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-global-menu]')).toBeHidden();
});

test('Terms desktop first fold stays compact and intentional',async({page,browserName})=>{
  test.skip(browserName!=='chromium','Terms first-fold geometry only needs one engine');
  await page.setViewportSize({width:1440,height:1000});
  await openPage(page,'/terms');
  const hero=await page.locator('.terms-hero').boundingBox();
  const copy=await page.locator('.terms-hero__copy').boundingBox();
  expect(hero).not.toBeNull();
  expect(copy).not.toBeNull();
  expect(hero.height).toBeLessThan(760);
  expect(copy.y).toBeLessThan(420);
  await expect(page.locator('.terms-hero h1')).toContainText('Clear terms');
});


test('AI process tab semantics follow compact-screen orientation',async({page,browserName})=>{
  test.skip(browserName!=='chromium','Responsive tab semantics only need one rendering engine');
  await page.setViewportSize({width:390,height:844});
  await openPage(page,'/ai-workflow-audit');
  await expect(page.locator('.process-tabs')).toHaveAttribute('aria-orientation','horizontal');
});
