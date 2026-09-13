import { test, expect } from '@playwright/test';

const openRae=async(page,route='/')=>{
  await page.goto(route,{waitUntil:'networkidle'});
  await expect(page.locator('[data-rae-root]')).toHaveCount(1);
  await page.locator('[data-rae-toggle]').click();
  await expect(page.locator('[data-rae-panel]')).toHaveAttribute('aria-hidden','false');
};

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

test('Rae knows the live client case and can route visitors to it',async({page})=>{
  await openRae(page,'/clients');
  await page.locator('[data-rae-input]').fill('Show me real work');
  await page.locator('[data-rae-form]').press('Enter');
  await expect(page.locator('[data-rae-feed]')).toContainText('FakhriMart');
  await expect(page.locator('[data-rae-feed] a[href="/clients/fakhrimart"]')).toHaveCount(1);
});

test('Rae stays playful instead of sounding like a support bot',async({page})=>{
  await openRae(page,'/');
  await page.locator('[data-rae-input]').fill('Tell me a joke');
  await page.locator('[data-rae-form]').press('Enter');
  const text=(await page.locator('[data-rae-feed]').innerText()).toLowerCase();
  expect(text).not.toContain('how may i assist');
  expect(text).not.toContain('as an ai');
  expect(text.length).toBeGreaterThan(20);
});

test('Rae only uses the server fallback for an open-ended business question',async({page})=>{
  let apiCalls=0;
  await page.route('**/api/rae',async route=>{
    apiCalls+=1;
    const request=route.request();
    const body=request.postDataJSON();
    expect(body.page).toBe('home');
    expect(body.message).toContain('restaurant');
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({reply:'For a restaurant, I would first fix the booking and menu journey before adding AI. Then measure where enquiries actually drop.'})});
  });
  await openRae(page,'/');
  await page.locator('[data-rae-input]').fill('How could BRAYROAI improve my restaurant business and help me get more useful enquiries?');
  await page.locator('[data-rae-form]').press('Enter');
  await expect(page.locator('[data-rae-feed]')).toContainText('booking and menu journey');
  expect(apiCalls).toBe(1);
});

test('Rae fails gracefully when deep mode is unavailable',async({page})=>{
  await page.route('**/api/rae',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'not configured'})}));
  await openRae(page,'/');
  await page.locator('[data-rae-input]').fill('How could you automate the lead qualification process for my manufacturing company and decide what to build first?');
  await page.locator('[data-rae-form]').press('Enter');
  await expect(page.locator('[data-rae-feed]')).toContainText('tea break');
  await expect(page.locator('[data-rae-feed] a[href*="wa.me"]')).toHaveCount(1);
});

test('Rae respects reduced motion and keeps the native interface usable',async({browser})=>{
  const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1280,height:800}});
  const page=await context.newPage();
  await openRae(page,'/terms');
  const animation=await page.locator('.rae-avatar__spark').first().evaluate(node=>getComputedStyle(node).animationName);
  expect(animation).toBe('none');
  await page.locator('[data-rae-input]').fill('Give me the simple version');
  await page.locator('[data-rae-form]').press('Enter');
  await expect(page.locator('[data-rae-feed]')).toContainText('Human version');
  await context.close();
});
