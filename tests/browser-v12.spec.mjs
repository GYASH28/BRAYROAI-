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
    await page.waitForSelector('[data-v14-reel]');
    await page.waitForSelector('[data-v14-rates]');
    await page.waitForFunction(()=>document.body.classList.contains('v12-runtime-isolated'));
  }
};

test('V14 homepage owns eight scenes and mounts the cinematic layer over the isolated legacy runtime',async({page})=>{
  await openPage(page);
  await expect(page.locator('[data-scene]')).toHaveCount(8);
  await expect(page.locator('link[href="/brayro-v12.css"]')).toHaveCount(1);
  await expect(page.locator('link[href="/brayro-v14.css"]')).toHaveCount(1);
  await expect(page.locator('script[src="/brayro-v12.js"]')).toHaveCount(1);
  await expect(page.locator('script[src="/brayro-v14.js"]')).toHaveCount(1);
  await expect(page.locator('body')).toHaveClass(/v12-runtime-isolated/);
  await page.waitForTimeout(350);
  await expect(page.locator('script[data-motion-v6]')).toHaveCount(0);
  await expect(page.locator('script[data-useful-ux-v11]')).toHaveCount(0);
  await expect(page.locator('#services')).toHaveAttribute('data-v14-reel','');
  await expect(page.locator('#services [data-v14-frame]')).toHaveCount(4);
  await expect(page.locator('#plans')).toHaveAttribute('data-v14-rates','');
  await expect(page.locator('#plans [data-v14-rate]')).toHaveCount(3);
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
  await expect(page.locator('.v12-signal-strip').first()).toBeHidden();
});

test('cinematic capability film advances continuously to the practical AI cut',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await openPage(page);
  const reel=page.locator('#services');
  await expect(reel.locator('[data-v14-frame]')).toHaveCount(4);
  await expect(reel.locator('[data-v14-copy]')).toHaveCount(4);
  await expect(reel.locator('[data-v14-stage]')).toBeVisible();
  await expect(reel).toHaveAttribute('data-reel-state','web');
  await page.evaluate(()=>{
    const node=document.querySelector('#services');
    scrollTo(0,node.offsetTop+(node.offsetHeight-innerHeight)*.98);
  });
  await page.waitForFunction(()=>document.querySelector('#services')?.dataset.reelState==='ai');
  await expect(reel.locator('[data-v14-counter]')).toHaveText('04 / 04');
  await expect(reel.locator('[data-v12-story-word]')).toHaveText('AI SYSTEMS');
  await expect(reel).toContainText('No robot imagery. No fake intelligence theatre.');
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

test('homepage pricing is a three-choice rate card while detailed /plans remains untouched',async({page})=>{
  await openPage(page);
  const rates=page.locator('#plans');
  await rates.scrollIntoViewIfNeeded();
  await expect(rates.locator('[data-v14-rate]')).toHaveCount(3);
  for(const text of ['Website partnership','Complete website build','AI systems','₹2,599','₹9,999','₹29,999+ build'])await expect(rates).toContainText(text);
  await expect(rates.locator('a[href="/plans"]')).toContainText('Open the full pricing page');
  await rates.locator('[data-v14-rate="build"]').hover();
  await expect(rates.locator('[data-v14-rate="build"]')).toHaveClass(/is-active/);

  await openPage(page,'/plans');
  await expect(page.locator('.build-card')).toHaveCount(6);
  await expect(page.locator('.ai-plan-card')).toHaveCount(2);
  await expect(page.locator('.compare-table')).toHaveCount(3);
});

test('core homepage controls still work under V14',async({page})=>{
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
  test(`${route} has no serious accessibility violations in the V14 release`,async({page})=>{
    await openPage(page,route);
    const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
    expect(serious(results)).toEqual([]);
  });
}

for(const [width,height] of [[320,720],[390,844],[768,1024],[1440,900],[1920,1080]]){
  test(`V14 public pages avoid horizontal overflow at ${width}x${height}`,async({page})=>{
    await page.setViewportSize({width,height});
    for(const route of ['/','/plans','/founder','/terms']){
      await openPage(page,route);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth),`${route}@${width}`).toBeLessThanOrEqual(1);
    }
  });
}

test('reduced motion turns the film into readable static cuts and keeps all offers available',async({browser})=>{
  const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1280,height:800}});
  const page=await context.newPage();
  await page.goto('/',{waitUntil:'networkidle'});
  await expect(page.locator('.opening-sequence')).toBeHidden();
  await expect(page.locator('[data-v14-reel]')).toBeVisible();
  await expect(page.locator('[data-v14-copy]')).toHaveCount(4);
  await expect(page.locator('#work')).toBeVisible();
  await expect(page.locator('#ai-systems')).toBeVisible();
  await expect(page.locator('#plans [data-v14-rate]')).toHaveCount(3);
  await expect(page.locator('.v12-cursor')).toBeHidden();
  await context.close();
});
