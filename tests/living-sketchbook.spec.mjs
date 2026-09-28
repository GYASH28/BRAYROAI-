import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('new visitor reaches real work, case study, and returns',async({page})=>{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/');
 await expect(page.getByRole('heading',{name:/Digital, designed to feel different/i})).toBeVisible();
 await page.getByRole('button',{name:'Hold the colour'}).click();
 await expect(page.locator('.hero-person')).toHaveAttribute('src','/assets/yash-cutout.webp');
 await expect(page.getByRole('button',{name:'Hold the colour'})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Hold the colour'}).click();
 await expect(page.locator('.hero-person')).toHaveAttribute('src','/assets/yash-cutout-mono.webp');
 await page.locator('.hero-chapters a[href="#work"]').click();
 await expect(page).toHaveURL(/#work$/);
 await expect(page.locator('#work')).toBeInViewport();
 await page.locator('.work-media').scrollIntoViewIfNeeded();
 await expect.poll(()=>page.locator('.work-desktop').evaluate(image=>image.complete&&image.naturalWidth>0)).toBe(true);
 await page.getByRole('link',{name:'Read the case study',exact:true}).click();
 await expect(page).toHaveURL(/\/clients\/fakhrimart$/);
 await expect(page.getByRole('heading',{name:/FakhriMart/i})).toBeVisible();
 await page.goBack();
 await expect(page).toHaveURL(/#work$/);
 expect(errors).toEqual([]);
});

test('regional price books are English and exact',async({page})=>{
 for(const [route,label,price] of [['/plans','India · INR','₹9,999'],['/ae/plans','UAE · AED','AED 2,990'],['/au/plans','Australia · AUD','A$1,490']]){
  await page.goto(route);await expect(page.getByRole('button',{name:new RegExp(label)}).first()).toBeVisible();
  await expect(page.locator('[data-price="launch-website"]').first()).toHaveText(price);
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  expect(await page.locator('body').textContent()).not.toMatch(/[\u0600-\u06ff]/);
 }
});

test('manual market choice survives navigation and late detection',async({page})=>{
 let releaseDetection;
 const detectionGate=new Promise(resolve=>{releaseDetection=resolve});
 await page.route('**/api/market',async route=>{await detectionGate;await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({market:'au',language:'en'})}).catch(()=>{})});
 await page.goto('/');
 await page.locator('.header-inner [data-market-open]').click();
 const detected=page.waitForResponse('**/api/market');
 releaseDetection();
 await detected;
 await expect(page).toHaveURL(/\/$/);
 await page.getByRole('radio',{name:/UAE/}).click();
 await expect(page).toHaveURL(/\/ae\/?$/);
 await expect(page.locator('.header-inner [data-market-open]')).toContainText('UAE · AED');
 await expect(page).toHaveURL(/\/ae\/?$/);
 await page.goto('/plans');
 await expect(page).toHaveURL(/\/ae\/plans$/);
 await expect(page.locator('[data-price="launch-website"]').first()).toHaveText('AED 2,990');
});

test('old Arabic URLs and manual preferences resolve to English UAE',async({page})=>{
 await page.goto('/ae/ar/plans');
 await expect(page).toHaveURL(/\/ae\/plans$/);
 await expect(page.locator('html')).toHaveAttribute('lang','en');
 await expect(page.locator('[data-price="launch-website"]').first()).toHaveText('AED 2,990');
 await page.goto('/');
 await page.evaluate(()=>{localStorage.setItem('brayro_market_source','manual');localStorage.setItem('brayro_market','ae-ar');localStorage.setItem('brayro_lang','ar')});
 await page.reload();
 await expect(page).toHaveURL(/\/ae\/?$/);
 await expect(page.locator('.header-inner [data-market-open]')).toContainText('UAE · AED');
 expect(await page.evaluate(()=>localStorage.getItem('brayro_lang'))).toBeNull();
});

test('plans deep links, history, and English enquiry URLs',async({page})=>{
 await page.goto('/au/plans#second-brain');
 await expect(page.locator('#ai-systems')).toBeVisible();
 await expect(page.locator('#second-brain [data-price]')).toHaveText('A$4,900');
 await page.reload();
 await expect(page.locator('#second-brain')).toBeVisible();
 await page.getByRole('tab',{name:'Monthly support'}).click();
 await expect(page).toHaveURL(/#monthly-support$/);
 await page.getByRole('tab',{name:'AI systems'}).click();
 await page.goBack();
 await expect(page.getByRole('tab',{name:'Monthly support'})).toHaveAttribute('aria-selected','true');
 const href=await page.locator('#monthly-starter [data-offer-contact]').getAttribute('href');
 expect(decodeURIComponent(href)).toContain('A$390/month');
 expect(decodeURIComponent(href)).toContain('Monthly Starter');
 await page.goto('/au/#contact');
 await page.locator('#project-brief').fill('A catalogue for my shop');
 const contact=await page.locator('[data-contact-whatsapp]').getAttribute('href');
 expect(decodeURIComponent(contact)).toContain('A catalogue for my shop');
 expect(decodeURIComponent(contact)).toContain('Australia');
});

test('Rae keeps drafts and reports provider failures honestly',async({page})=>{
 await page.route('**/api/rae-chat',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Rae AI is not configured on this deployment.'})}));
 await page.goto('/');
 await page.locator('.rae-launcher').click();
 await page.locator('#rae-input').fill('Can you help with a website?');
 await page.locator('[data-rae-close]').click();
 await page.locator('.header-inner [data-market-open]').click();
 await page.getByRole('radio',{name:/Australia/}).click();
 await expect(page).toHaveURL(/\/au\/?$/);
 await page.locator('.rae-launcher').click();
 await expect(page.locator('#rae-input')).toHaveValue('Can you help with a website?');
 await page.getByRole('button',{name:/Send/}).click();
 await expect(page.locator('.rae-status')).toContainText('not configured');
 await expect(page.locator('.rae-message.assistant')).toContainText('could not answer');
 await page.locator('[data-rae-close]').click();
 await expect(page.locator('#rae-dialog')).not.toBeVisible();
});

test('Rae renders only allowlisted, market-aware suggestions',async({page})=>{
 const body=[
  'event: delta\ndata: {"text":"The audit is a focused first step."}\n\n',
  'event: meta\ndata: {"card":{"action":{"name":"showPlan","args":{"planId":"ai-workflow-audit"},"label":"View this option"}},"actions":[{"name":"navigateToRoute","args":{"route":"https://example.com"},"label":"Unsafe destination"}]}\n\n',
  'event: done\ndata: {"finishReason":"stop"}\n\n'
 ].join('');
 await page.route('**/api/rae-chat',route=>route.fulfill({status:200,contentType:'text/event-stream',body}));
 await page.goto('/ae/');
 await page.locator('.rae-launcher').click();
 await page.locator('#rae-input').fill('Tell me about the audit');
 await page.getByRole('button',{name:/Send/}).click();
 await expect(page.locator('.rae-message.assistant')).toContainText('focused first step');
 await expect(page.locator('.rae-actions a')).toHaveAttribute('href','/ae/plans#ai-audit');
 await expect(page.locator('.rae-actions a')).toHaveCount(1);
});

test('small screens, reduced motion and enhancement failure preserve content',async({page})=>{
 for(const width of [360,390,768,1440]){
  await page.setViewportSize({width,height:844});await page.goto('/');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow,`horizontal overflow at ${width}px`).toBeLessThanOrEqual(1);
  await expect(page.getByRole('heading',{name:/Digital, designed to feel different/i})).toBeVisible();
 }
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');
 await expect(page.locator('#approach')).toBeVisible();
 await page.route('**/assets/app-*.js',route=>route.abort());
 await page.goto('/plans');
 await expect(page.getByRole('heading',{name:/What kind of work needs doing/i})).toBeVisible();
 await expect(page.locator('#ai-systems')).toBeVisible();
});

test('keyboard menu, market dialog, and accessibility',async({page})=>{
 test.setTimeout(90_000);
 await page.setViewportSize({width:390,height:844});
 await page.goto('/');
 await page.getByRole('button',{name:'Open menu'}).click();
 await expect(page.locator('#menu-dialog')).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(page.locator('#menu-dialog')).not.toBeVisible();
 await page.getByRole('button',{name:'Open menu'}).click();
 await page.locator('#menu-dialog [data-market-open]').click();
 await expect(page.locator('#market-dialog')).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(page.locator('#market-dialog')).not.toBeVisible();
 for(const route of ['/','/plans','/clients/fakhrimart','/terms']){
  await page.goto(route);
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  expect(result.violations.map(item=>item.id)).toEqual([]);
 }
});
