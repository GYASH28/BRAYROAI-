import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const serious=result=>result.violations.filter(violation=>['serious','critical'].includes(violation.impact));
const clearOpening=async page=>{
  await page.evaluate(()=>{
    document.querySelectorAll('.opening-sequence,.scope-open,.founder-open').forEach(node=>node.remove());
    document.body.classList.remove('polish-opening','hf-intro-active');
  });
};
const openPage=async(page,route='/')=>{
  await page.goto(route,{waitUntil:'networkidle'});
  await clearOpening(page);
  if(route==='/'){
    await page.waitForSelector('[data-v12-story]');
    await page.waitForFunction(()=>document.body.classList.contains('v12-runtime-isolated'));
  }
};

test('V12 homepage owns eight scenes and keeps the legacy mutation chain isolated',async({page})=>{
  await openPage(page);
  await expect(page.locator('[data-scene]')).toHaveCount(8);
  await expect(page.locator('link[href="/brayro-v12.css"]')).toHaveCount(1);
  await expect(page.locator('script[src="/brayro-v12.js"]')).toHaveCount(1);
  await expect(page.locator('body')).toHaveClass(/v12-runtime-isolated/);
  await page.waitForTimeout(700);
  await expect(page.locator('script[data-motion-v6]')).toHaveCount(0);
  await expect(page.locator('script[data-useful-ux-v11]')).toHaveCount(0);
  await expect(page.locator('#services')).toHaveAttribute('data-scene','services');
  await expect(page.locator('#services [data-v12-step]')).toHaveCount(4);
});

test('hero text remains readable and structurally stable',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await openPage(page);
  const title=page.locator('.v12-hero-title');
  await expect(title).toBeVisible();
  await expect(title).toContainText('Digital, designed');
  await expect(title).toContainText('to feel different.');
  const box=await title.boundingBox();
  expect(box).not.toBeNull();
  expect(box.width).toBeLessThanOrEqual(1440*.93);
  expect(box.x).toBeGreaterThanOrEqual(0);
  await expect(page.locator('.hero__body')).toContainText('practical AI systems');
});

test('four-discipline scrolling story advances to AI Systems',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await openPage(page);
  await expect(page.locator('[data-v12-step]')).toHaveCount(4);
  await expect(page.locator('[data-v12-story-visual]')).toHaveAttribute('data-state','web');
  const ai=page.locator('[data-v12-step="ai"]');
  await ai.scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelector('[data-v12-story-visual]')?.dataset.state==='ai');
  await expect(page.locator('[data-v12-story-word]')).toHaveText('AI SYSTEMS');
  await expect(ai).toHaveClass(/is-active/);
});

test('selected work uses real proof and the cursor-following showcase layer',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await openPage(page);
  const work=page.locator('#work');
  await work.scrollIntoViewIfNeeded();
  await expect(work.locator('[data-v12-project]')).toHaveCount(3);
  const client=work.locator('[data-v12-project]').first();
  await expect(client).toContainText('FakhriMart');
  await expect(client).toHaveAttribute('href','https://fakhriyarns.vercel.app/');
  await client.hover();
  await expect(page.locator('[data-v12-project-preview]')).toHaveClass(/is-visible/);
  await expect(page.locator('[data-v12-project-preview] img')).toHaveAttribute('src','/assets/fakhrimart-case-desktop.png');
  await expect(work.locator('.v12-featured-case img[src="/assets/fakhrimart-case-mobile.png"]')).toHaveCount(1);
});

test('AI products have clear prices, scopes and direct WhatsApp actions',async({page})=>{
  await openPage(page);
  const ai=page.locator('#ai-systems');
  await ai.scrollIntoViewIfNeeded();
  await expect(ai.locator('.v12-product-card')).toHaveCount(2);
  await expect(ai).toContainText('AI Workflow Audit');
  await expect(ai).toContainText('₹9,999');
  await expect(ai).toContainText('Company Second Brain');
  await expect(ai).toContainText('From ₹29,999');
  await expect(ai).toContainText('credited toward an AI system');
  const hrefs=await ai.locator('.v12-product-card__cta').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href')));
  expect(hrefs.every(href=>href?.startsWith('https://wa.me/919175524637'))).toBeTruthy();
});

test('core homepage controls still work under V12',async({page})=>{
  await openPage(page);
  const colour=page.locator('[data-colour-toggle]');
  await colour.click();
  await expect(colour).toHaveAttribute('aria-pressed','true');
  await page.locator('#work').scrollIntoViewIfNeeded();
  const toggle=page.locator('[data-work-toggle]');
  await toggle.click();
  await expect(page.locator('[data-work-stage]')).toHaveAttribute('data-sc-verify-state','work:mobile');
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.locator('[data-project-type="ai"]').click();
  await expect(page.locator('[data-project-intent]')).toHaveAttribute('data-sc-verify-state','project:ai');
  const email=decodeURIComponent(await page.locator('[data-project-cta]').getAttribute('href'));
  expect(email).toContain('I would like help with a useful AI project.');
});

test('Plans preserves web offers and adds the AI product family',async({page})=>{
  await openPage(page,'/plans');
  await expect(page.locator('[data-plan-scene]')).toHaveCount(7);
  await expect(page.locator('.build-card')).toHaveCount(6);
  await expect(page.locator('.ai-plan-card')).toHaveCount(2);
  for(const text of ['₹2,599','₹3,999','₹5,999+','₹17,999','₹25K–₹35K+','AI Workflow Audit','₹9,999','Company Second Brain','From ₹29,999','Knowledge Care','From ₹2,999/mo']){
    await expect(page.locator('main')).toContainText(text);
  }
  await expect(page.locator('.compare-table')).toHaveCount(3);
  await expect(page.locator('#ai-systems')).toContainText('API');
  await expect(page.locator('#ai-systems')).toContainText('approved');
});

test('HyperFrames opening remains intact and skippable',async({page})=>{
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await expect(page.locator('[data-hf-intro-video]')).toHaveCount(1);
  await expect(page.locator('[data-hf-skip]')).toBeVisible();
  await page.locator('[data-hf-skip]').click();
  await page.waitForTimeout(600);
  await expect(page.locator('body')).not.toHaveClass(/hf-intro-active/);
  await expect(page.locator('[data-editorial-sequence] .editorial-sequence__word')).toHaveCount(3);
});

for(const route of ['/','/plans','/founder','/terms']){
  test(`${route} has no serious accessibility violations in the V12 release`,async({page})=>{
    await openPage(page,route);
    const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
    expect(serious(results)).toEqual([]);
  });
}

for(const [width,height] of [[320,720],[390,844],[768,1024],[1440,900],[1920,1080]]){
  test(`V12 public pages avoid horizontal overflow at ${width}x${height}`,async({page})=>{
    await page.setViewportSize({width,height});
    for(const route of ['/','/plans','/founder','/terms']){
      await openPage(page,route);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth),`${route}@${width}`).toBeLessThanOrEqual(1);
    }
  });
}

test('reduced motion keeps the new story, work and AI offers available',async({browser})=>{
  const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1280,height:800}});
  const page=await context.newPage();
  await page.goto('/',{waitUntil:'networkidle'});
  await expect(page.locator('.opening-sequence')).toBeHidden();
  await expect(page.locator('[data-v12-story]')).toBeVisible();
  await expect(page.locator('#work')).toBeVisible();
  await expect(page.locator('#ai-systems')).toBeVisible();
  await expect(page.locator('.v12-cursor')).toBeHidden();
  await context.close();
});
