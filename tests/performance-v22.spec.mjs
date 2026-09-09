import { test, expect } from '@playwright/test';

const clearOpening=async page=>{
  await page.evaluate(()=>{
    document.querySelectorAll('.opening-sequence,.scope-open,.founder-open').forEach(node=>node.remove());
    document.body.classList.remove('polish-opening','hf-intro-active','is-opening');
  });
};

test('V22 keeps V20 quality while budgeting offscreen work',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/',{waitUntil:'networkidle'});
  await clearOpening(page);
  await expect(page.locator('html')).toHaveAttribute('data-perf-v22-mounted','true');
  await expect(page.locator('link[href="/performance-v22.css"]')).toHaveCount(1);
  await expect(page.locator('script[src="/performance-v22.js"]')).toHaveCount(1);
  await expect(page.locator('[data-v20-lens]')).toHaveCount(1);
  await expect(page.locator('[data-v20-scene-rail]')).toHaveCount(1);
  await expect(page.locator('[data-v20-signal]')).toHaveCount(1);
  await expect(page.locator('.v16-cursor')).toHaveCount(0);
  await page.waitForTimeout(150);
  await expect(page.locator('#top')).toHaveAttribute('data-perf-active','true');
  await expect(page.locator('#contact')).toHaveAttribute('data-perf-active','false');
});

test('hero stays eager while offscreen images are scheduled cheaply',async({page})=>{
  await page.goto('/',{waitUntil:'networkidle'});
  await clearOpening(page);
  await expect(page.locator('.hero__picture--mono .hero__background')).toHaveAttribute('loading','eager');
  await expect(page.locator('.hero__picture--mono .hero__background')).toHaveAttribute('decoding','sync');
  await expect(page.locator('.v12-featured-case img').first()).toHaveAttribute('loading','lazy');
  await expect(page.locator('.v12-featured-case img').first()).toHaveAttribute('decoding','async');
});

test('internal pages are prefetched on intent without changing navigation',async({page})=>{
  await page.goto('/',{waitUntil:'networkidle'});
  await clearOpening(page);
  const plans=page.locator('a[href="/plans"]').first();
  await plans.hover();
  await expect(page.locator('link[rel="prefetch"][href="/plans"]')).toHaveCount(1,{timeout:2500});
  await expect(plans).toHaveAttribute('href','/plans');
});

test('simulated low-end hardware preserves the full cinematic interface',async({browser})=>{
  const context=await browser.newContext({viewport:{width:390,height:844}});
  await context.addInitScript(()=>{
    Object.defineProperty(navigator,'hardwareConcurrency',{configurable:true,get:()=>2});
    Object.defineProperty(navigator,'deviceMemory',{configurable:true,get:()=>2});
  });
  const page=await context.newPage();
  await page.goto('/',{waitUntil:'networkidle'});
  await clearOpening(page);
  await expect(page.locator('html')).toHaveAttribute('data-perf-tier','constrained');
  await expect(page.locator('.v12-hero-title')).toContainText('Digital, designed');
  await expect(page.locator('#services [data-v15-control]')).toHaveCount(4);
  await expect(page.locator('#plans [data-v14-rate]')).toHaveCount(3);
  await expect(page.locator('[data-v20-lens]')).toHaveCount(1);
  await expect(page.locator('[data-v20-text-cycle]')).toHaveCount(1);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.locator('#services').scrollIntoViewIfNeeded();
  await page.locator('[data-v15-control="3"]').click();
  await expect(page.locator('#services')).toHaveAttribute('data-play-state','ai');
  await context.close();
});

test('frame-health sampling is bounded instead of running forever',async({page})=>{
  await page.goto('/',{waitUntil:'networkidle'});
  await clearOpening(page);
  await expect(page.locator('html')).toHaveAttribute('data-frame-health',/smooth|strained/,{timeout:5000});
});