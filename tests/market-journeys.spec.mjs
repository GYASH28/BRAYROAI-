import {test,expect} from '@playwright/test';

test('UAE Business enquiry carries the visible AED price in WhatsApp and email',async({page})=>{
  await page.goto('/ae/plans',{waitUntil:'domcontentloaded'});
  const card=page.locator('[data-offer-id="business-experience"]');
  await expect(card.locator('div > strong')).toContainText('AED 5,990');
  const whatsapp=card.locator('a[data-lead-channel="whatsapp"]');
  const email=card.locator('a[data-lead-channel="email"]');
  await expect(whatsapp).toHaveAttribute('href',/wa\.me\/919175524637/);
  const message=decodeURIComponent(await whatsapp.getAttribute('href'));
  expect(message).toContain('Business Experience');expect(message).toContain('AED 5,990');expect(message).toContain('Market: UAE');
  const draft=decodeURIComponent(await email.getAttribute('href'));
  expect(draft).toContain('UAE / Business Experience / AED 5,990');
});

test('Australia Premium enquiry retains its A$ price and written brief',async({page})=>{
  await page.goto('/au/plans',{waitUntil:'domcontentloaded'});
  const card=page.locator('[data-offer-id="premium-experience"]');
  await expect(card.locator('div > strong')).toContainText('A$5,900–8,900+');
  const email=decodeURIComponent(await card.locator('a[data-lead-channel="email"]').getAttribute('href'));
  expect(email).toContain('Australia / Premium Experience / A$5,900–8,900+');
  expect(email).toContain('Current website, if any:');
});

test('market and language controls preserve a deep route and anchor',async({page})=>{
  await page.goto('/ae/plans#business',{waitUntil:'domcontentloaded'});
  await page.locator('[data-market-trigger]:visible').first().click();
  await expect(page.locator('#market-sheet')).toBeVisible();
  await page.locator('#market-sheet [data-market-choice="au"]').click();
  await expect(page).toHaveURL(/\/au\/plans#business$/);
  await expect(page.locator('[data-offer-id="business-experience"] div > strong')).toContainText('A$2,990');
  await page.locator('[data-market-trigger]:visible').first().click();
  await page.locator('#market-sheet [data-market-choice="ae"]').first().click();
  await expect(page).toHaveURL(/\/ae\/plans#business$/);
  await page.locator('[data-market-trigger]:visible').first().click();
  await page.locator('#market-sheet [data-market-choice="ae-ar"]').click();
  await expect(page).toHaveURL(/\/ae\/ar\/plans#business$/);
  await expect(page.locator('html')).toHaveAttribute('lang','ar-AE');
  await expect(page.locator('html')).toHaveAttribute('dir','rtl');
  await expect(page.locator('[data-offer-id="business-experience"] div > strong')).toContainText('AED 5,990');
});

test('Arabic Rae compares the published catalog without a network request',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/ae/ar/plans',{waitUntil:'domcontentloaded'});
  await page.locator('[data-rae-toggle]').click();
  await expect(page.locator('[data-rae-panel]')).toHaveAttribute('aria-hidden','false');
  await expect(page.locator('.rae-welcome')).toContainText('الخطوة التالية');
  await page.locator('[data-rae-compare]').click();
  await expect(page.locator('.rae-card--compare')).toContainText('AED 690');
  await expect(page.locator('.rae-card--compare')).toContainText('AED 2,990');
});

test('Arabic Rae guides an editable brief without sending a message',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/ae/ar/plans',{waitUntil:'domcontentloaded'});
  await page.locator('[data-rae-toggle]').click();
  await page.locator('[data-rae-guide-start]').click();
  await expect(page.locator('.rae-message').last()).toContainText('ما الذي تريد بناءه');
  await page.locator('[data-rae-guide-answer="A website"]').click();
  await page.locator('[data-rae-guide-answer="More qualified enquiries"]').click();
  await page.locator('[data-rae-guide-answer="This month"]').click();
  await expect(page.locator('.rae-card--project textarea')).toHaveValue(/AED 2,990/);
  await expect(page.locator('.rae-stage')).toContainText('لم تُرسل');
});

test('phone comparison presents each offer without a sideways table',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/ae/plans#compare',{waitUntil:'domcontentloaded'});
  await expect(page.locator('body')).toHaveClass(/compare-mobile-ready/);
  await expect(page.locator('#compare .compare-table').first()).toBeHidden();
  await expect(page.locator('#compare .compare-mobile__card').first()).toBeVisible();
  await expect(page.locator('#compare .compare-mobile').first()).toContainText('AED 690');
  await expect(page.locator('#compare .compare-mobile').nth(1)).toContainText('AED 5,990');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test('Arabic AI offer pages keep translated interactive content and local prices',async({page})=>{
  await page.goto('/ae/ar/ai-workflow-audit',{waitUntil:'domcontentloaded'});
  await expect(page.locator('#how h2')).toContainText('خمس خطوات');
  await page.locator('[data-process-tab]').nth(2).click();
  await expect(page.locator('[data-process-title]')).toContainText('قيّم الفرص');
  await expect(page.locator('.ai-price strong')).toContainText('AED 2,490');
  await expect(page.locator('.ai-cta')).toContainText('احجز عبر واتساب');
  await page.goto('/ae/ar/company-second-brain',{waitUntil:'domcontentloaded'});
  await expect(page.locator('#architecture h2')).toContainText('مصادر معتمدة');
  await page.locator('[data-arch-node="drive"]').click();
  await expect(page.locator('[data-arch-status]')).toContainText('Drive');
  await expect(page.locator('.ai-price strong')).toContainText('AED 7,900');
});


test('Arabic mobile chapter rail keeps its active item visible and directional',async({page,browserName})=>{
  test.skip(browserName!=='chromium','Bidirectional geometry only needs one rendering engine');
  await page.setViewportSize({width:390,height:844});
  await page.goto('/ae/ar/plans',{waitUntil:'domcontentloaded'});
  const active=page.locator('.chapter-nav a[aria-current="location"]');
  await expect(active).toBeVisible();
  const [trackBox,activeBox,origin]=await Promise.all([
    page.locator('.chapter-nav>div').boundingBox(),
    active.boundingBox(),
    page.locator('.global-nav__progress i').evaluate(node=>getComputedStyle(node).transformOrigin)
  ]);
  expect(activeBox.x).toBeGreaterThanOrEqual(trackBox.x-1);
  expect(activeBox.x+activeBox.width).toBeLessThanOrEqual(trackBox.x+trackBox.width+1);
  expect(origin.split(' ')[0]).not.toBe('0px');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});


test('market dialog reports its state and restores focus',async({page,browserName})=>{
  test.skip(browserName!=='chromium','Modal focus behavior only needs one rendering engine');
  await page.goto('/plans',{waitUntil:'domcontentloaded'});
  const trigger=page.locator('.global-nav [data-market-trigger]');
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded','true');
  await expect(page.locator('#market-sheet')).toBeVisible();
  await page.locator('#market-sheet [data-market-close]').click();
  await expect(page.locator('#market-sheet')).toBeHidden();
  await expect(trigger).toHaveAttribute('aria-expanded','false');
  await expect(trigger).toBeFocused();
});
