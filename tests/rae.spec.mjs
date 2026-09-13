import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const openRae=async(page,route='/')=>{
  await page.goto(route,{waitUntil:'networkidle'});
  await expect(page.locator('[data-rae-root]')).toHaveCount(1);
  await page.locator('[data-rae-toggle]').click();
  await expect(page.locator('[data-rae-panel]')).toHaveAttribute('aria-hidden','false');
};
const serious=results=>results.violations.filter(item=>['serious','critical'].includes(item.impact));

for(const [route,pageName] of [['/','home'],['/plans','plans'],['/founder','founder'],['/terms','terms'],['/ai-workflow-audit','ai'],['/company-second-brain','ai'],['/clients','clients'],['/clients/fakhrimart','case']]){
  test(`Rae mounts once on ${route} with the right visual personality`,async({page})=>{
    await page.goto(route,{waitUntil:'networkidle'});
    await expect(page.locator('[data-rae-root]')).toHaveCount(1);
    await expect(page.locator('body')).toHaveAttribute('data-rae-page',pageName);
    await expect(page.locator('[data-rae-toggle]')).toHaveAttribute('aria-expanded','false');
  });
}

test('Rae answers pricing locally without waking Gemini',async({page})=>{
  let apiCalls=0;
  await page.route('**/api/rae',async route=>{apiCalls+=1;await route.abort()});
  await openRae(page,'/plans');
  await page.locator('[data-rae-input]').fill('How much is a website?');
  await page.locator('[data-rae-form]').press('Enter');
  const feed=page.locator('[data-rae-feed]');
  await expect(feed).toContainText('₹2,599');
  await expect(feed).toContainText('₹9,999');
  expect(apiCalls).toBe(0);
});

test('Rae reasons about a restaurant locally before Gemini',async({page})=>{
  let apiCalls=0;
  await page.route('**/api/rae',async route=>{apiCalls+=1;await route.abort()});
  await openRae(page,'/');
  await page.locator('[data-rae-input]').fill('How could BRAYROAI improve my restaurant business and help me get more bookings?');
  await page.locator('[data-rae-form]').press('Enter');
  const feed=page.locator('[data-rae-feed]');
  await expect(feed).toContainText('menu');
  await expect(feed).toContainText('booking');
  expect(apiCalls).toBe(0);
});

test('Rae remembers project context for the visit and uses it conversationally',async({page})=>{
  let apiCalls=0;
  await page.route('**/api/rae',async route=>{apiCalls+=1;await route.abort()});
  await openRae(page,'/');
  await page.locator('[data-rae-input]').fill('I run a restaurant and my budget is around 15k. I need more bookings.');
  await page.locator('[data-rae-form]').press('Enter');
  await expect(page.locator('[data-rae-feed]')).toContainText('restaurant');
  await page.locator('[data-rae-input]').fill('What do you remember about me?');
  await page.locator('[data-rae-form]').press('Enter');
  const feed=page.locator('[data-rae-feed]');
  await expect(feed).toContainText('restaurant business');
  await expect(feed).toContainText('15k');
  await expect(feed).toContainText('more useful enquiries');
  expect(apiCalls).toBe(0);
});

test('Rae recommends the smallest sensible website route locally',async({page})=>{
  let apiCalls=0;
  await page.route('**/api/rae',async route=>{apiCalls+=1;await route.abort()});
  await openRae(page,'/plans');
  await page.locator('[data-rae-input]').fill('I already have a website and want to improve it. Which plan would you choose?');
  await page.locator('[data-rae-form]').press('Enter');
  const feed=page.locator('[data-rae-feed]');
  await expect(feed).toContainText('not jump straight to a full rebuild');
  await expect(feed).toContainText('₹2,599');
  expect(apiCalls).toBe(0);
});

test('Rae knows the live client case and can route visitors to it',async({page})=>{
  await openRae(page,'/clients');
  await page.locator('[data-rae-input]').fill('Show me real work');
  await page.locator('[data-rae-form]').press('Enter');
  await expect(page.locator('[data-rae-feed]')).toContainText('FakhriMart');
  await expect(page.locator('[data-rae-feed] a[href="/clients/fakhrimart"]')).toHaveCount(1);
});

test('Rae stays playful and visibly expressive instead of sounding like a support bot',async({page})=>{
  await openRae(page,'/');
  await page.locator('[data-rae-input]').fill('Tell me a joke');
  await page.locator('[data-rae-form]').press('Enter');
  const feed=page.locator('[data-rae-feed]');
  await expect(feed).toContainText(/Agency joke|raise|logo bigger|synergy|landing page|Git diff/);
  const text=(await feed.innerText()).toLowerCase();
  expect(text).not.toContain('how may i assist');
  expect(text).not.toContain('as an ai');
  await expect.poll(async()=>page.locator('.rae-avatar').first().getAttribute('data-action')).toMatch(/celebrate|talk|idle/);
});

test('Rae uses Gemini only for genuinely complex business reasoning and passes buddy context',async({page})=>{
  let apiCalls=0;
  await page.route('**/api/rae',async route=>{
    apiCalls+=1;
    const body=route.request().postDataJSON();
    expect(body.page).toBe('home');
    expect(body.message).toContain('Compare');
    expect(body.profile.businessType).toBe('restaurant');
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({reply:'I would test the booking journey first, then compare lead qualification automation against staff time saved. Bigger system later; cleaner evidence first.'})});
  });
  await openRae(page,'/');
  await page.locator('[data-rae-input]').fill('Compare two approaches for my restaurant business: redesigning the booking journey versus automating lead qualification, and tell me the trade-offs.');
  await page.locator('[data-rae-form]').press('Enter');
  await expect(page.locator('[data-rae-feed]')).toContainText('cleaner evidence first');
  expect(apiCalls).toBe(1);
});

test('Rae refuses unrelated world trivia locally instead of wasting Gemini',async({page})=>{
  let apiCalls=0;
  await page.route('**/api/rae',async route=>{apiCalls+=1;await route.abort()});
  await openRae(page,'/');
  await page.locator('[data-rae-input]').fill('What is the weather in Tokyo and who won the football match yesterday?');
  await page.locator('[data-rae-form]').press('Enter');
  await expect(page.locator('[data-rae-feed]')).toContainText(/outside my useful lane|Windows error sound|Rephrase/);
  expect(apiCalls).toBe(0);
});

test('Rae fails gracefully when deep mode is unavailable',async({page})=>{
  await page.route('**/api/rae',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'not configured'})}));
  await openRae(page,'/');
  await page.locator('[data-rae-input]').fill('Compare multiple strategies and prioritise a roadmap for automating customer qualification across my service business, including the trade-offs.');
  await page.locator('[data-rae-form]').press('Enter');
  await expect(page.locator('[data-rae-feed]')).toContainText('tea break');
  await expect(page.locator('[data-rae-feed] a[href*="wa.me"]')).toHaveCount(1);
});

test('Rae open panel has no serious accessibility violations',async({page,browserName})=>{
  test.skip(browserName!=='chromium','Axe open-state audit runs once in Chromium');
  await openRae(page,'/plans');
  await page.locator('[data-rae-input]').fill('Which plan fits me?');
  await page.locator('[data-rae-form]').press('Enter');
  const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  expect(serious(results)).toEqual([]);
});

test('Rae launcher avoids another fixed bottom-right icon and does not duplicate itself over the open panel',async({page})=>{
  await page.goto('/',{waitUntil:'networkidle'});
  await page.evaluate(()=>{
    const fake=document.createElement('button');fake.id='collision-probe';fake.textContent='fixed';
    Object.assign(fake.style,{position:'fixed',right:'12px',bottom:'12px',width:'68px',height:'68px',zIndex:'99999'});
    document.body.append(fake);dispatchEvent(new Event('resize'));
  });
  await page.waitForTimeout(320);
  const lift=await page.locator('[data-rae-root]').evaluate(node=>getComputedStyle(node).getPropertyValue('--rae-collision-lift').trim());
  expect(parseFloat(lift)).toBeGreaterThan(0);
  await page.locator('[data-rae-toggle]').click();
  await expect(page.locator('[data-rae-panel]')).toHaveAttribute('aria-hidden','false');
  await expect(page.locator('[data-rae-toggle]')).toHaveCSS('visibility','hidden');
});

test('Rae respects reduced motion and keeps the native interface usable',async({browser})=>{
  const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1280,height:800}});
  const page=await context.newPage();
  await openRae(page,'/terms');
  const animation=await page.locator('.rae-avatar__spark').first().evaluate(node=>getComputedStyle(node).animationName);
  expect(animation).toBe('none');
  await page.locator('[data-rae-input]').fill('Give me the human version');
  await page.locator('[data-rae-form]').press('Enter');
  await expect(page.locator('[data-rae-feed]')).toContainText('Human version');
  await context.close();
});
