import {test,expect} from '@playwright/test';

test('the home journey explains the studio, work and enquiry path',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading',{name:/Make it matter/i})).toBeVisible();
  await expect(page.getByRole('heading',{name:/Three ways to move forward/i})).toBeVisible();
  await page.getByRole('link',{name:/Explore the case/i}).click();
  await expect(page).toHaveURL(/\/clients\/fakhrimart\/?$/);
  await expect(page.getByRole('heading',{name:/A catalogue that knows its job/i})).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading',{name:/Make it matter/i})).toBeVisible();
  const contact=page.getByRole('link',{name:/Start a project/i}).first();
  await expect(contact).toHaveAttribute('href',/wa\.me\/919175524637/);
  expect(errors).toEqual([]);
});

test('manual market changes only prices and persists across pages and reloads',async({page})=>{
  await page.goto('/plans');
  await expect(page.locator('[data-price="launch-website"]')).toHaveText('₹9,999');
  await page.locator('.nav [data-market-open]').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.locator('[data-market-choice="ae"]').click();
  await expect(page).toHaveURL(/\/ae\/plans\/?$/);
  await expect(page.locator('[data-price="launch-website"]')).toHaveText('AED 2,990');
  await expect(page.locator('html')).toHaveAttribute('lang','en-AE');
  await expect(page.getByRole('heading',{name:/Choose the right kind of work/i})).toBeVisible();
  await page.goto('/ae/clients');
  await page.reload();
  await expect(page.locator('.nav [data-market-open]')).toContainText('UAE · AED');
  await page.goto('/plans');
  await expect(page).toHaveURL(/\/ae\/plans\/?$/);
  await page.locator('.nav [data-market-open]').click();
  await page.locator('[data-market-choice="au"]').click();
  await expect(page).toHaveURL(/\/au\/plans\/?$/);
  await expect(page.locator('[data-price="launch-website"]')).toHaveText('A$1,490');
  await expect(page.locator('html')).toHaveAttribute('lang','en-AU');
});

test('country hint picks a market while keeping prices hidden until resolved',async({page})=>{
  await page.route('**/api/market',async route=>{
    await new Promise(resolve=>setTimeout(resolve,350));
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({country:'AU',market:'au',language:'en'})});
  });
  await page.goto('/plans',{waitUntil:'domcontentloaded'});
  await expect(page.locator('body')).not.toHaveClass(/market-ready/);
  await expect(page.locator('[data-price="launch-website"]')).toBeHidden();
  await expect(page).toHaveURL(/\/au\/plans\/?$/);
  await expect(page.locator('[data-price="launch-website"]')).toHaveText('A$1,490');
});

test('mobile navigation, Rae and reduced motion remain usable',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await expect(page.locator('html')).toHaveCSS('scroll-behavior','auto');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.locator('[data-menu-toggle]').click();
  await expect(page.locator('#mobile-menu')).toBeVisible();
  await page.locator('#mobile-menu a[href="/plans"]').click();
  await expect(page).toHaveURL(/\/plans\/?$/);
  await expect(page.locator('#mobile-menu')).toBeHidden();
  await page.locator('[data-rae-shell]').click();
  await expect(page.getByRole('button',{name:/Plan a project with Rae/i})).toBeVisible();
  await expect(page.getByRole('button',{name:/Compare the offers/i})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('retired AI routes resolve to their plans sections',async({page})=>{
  await page.goto('/ai-workflow-audit');
  await expect(page).toHaveURL(/\/plans#ai-workflow-audit$/);
  await expect(page.locator('#ai-workflow-audit')).toBeVisible();
  await page.goto('/company-second-brain');
  await expect(page).toHaveURL(/\/plans#company-second-brain$/);
});
