import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('new visitor reaches real work, case study, and returns',async({page})=>{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/');
 await expect(page.getByRole('heading',{name:/An independent digital studio/i})).toBeVisible();
 await page.locator('#sculpture-shape').fill('55');
 await expect(page.locator('#sculpture-shape')).toHaveValue('55');
 await page.locator('.object-index a[href="#work"]').click();
 await expect(page).toHaveURL(/#work$/);
 await expect(page.locator('#work')).toBeInViewport();
 await page.locator('.work-desktop').scrollIntoViewIfNeeded();
 await expect.poll(()=>page.locator('.work-desktop img').evaluate(image=>image.complete&&image.naturalWidth>0)).toBe(true);
 await page.getByRole('link',{name:'Open the FakhriMart case study'}).click();
 await expect(page).toHaveURL(/\/clients\/fakhrimart$/);
 await expect(page.getByRole('heading',{level:1,name:/Fakhri\s*Mart/i})).toBeVisible();
 await expect(page.getByRole('link',{name:'Visit the live website'})).toHaveAttribute('href','https://fakhriyarns.vercel.app/');
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

test('restored founder, client and AI pages stay navigable in each market',async({page})=>{
 for(const prefix of ['', '/ae', '/au']){
  for(const route of ['/clients','/founder','/ai-workflow-audit','/company-second-brain']){
   await page.goto(prefix+route);
   await expect(page.locator('main h1')).toBeVisible();
   await expect(page.locator('.premium-footer')).toBeVisible();
   await expect(page).toHaveURL(new RegExp(`${prefix}${route}$`));
  }
 }
 await page.goto('/founder');
 await page.locator('[data-founder-colour]').click();
 await expect(page.locator('.founder-hero')).toHaveClass(/is-colour/);
 await page.goto('/clients');
 await page.locator('.archive-case-title').click();
 await expect(page).toHaveURL(/\/clients\/fakhrimart$/);
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
 await page.getByRole('button',{name:/Send message to Rae/}).click();
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
 await page.getByRole('button',{name:/Send message to Rae/}).click();
 await expect(page.locator('.rae-message.assistant')).toContainText('focused first step');
 await expect(page.locator('.rae-actions a')).toHaveAttribute('href','/ae/ai-workflow-audit');
 await expect(page.locator('.rae-actions a')).toHaveCount(1);
});

test('small screens, reduced motion and enhancement failure preserve content',async({page})=>{
 for(const width of [360,390,768,1440]){
  await page.setViewportSize({width,height:844});await page.goto('/');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow,`horizontal overflow at ${width}px`).toBeLessThanOrEqual(1);
  await expect(page.getByRole('heading',{name:/An independent digital studio/i})).toBeVisible();
 }
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');
 await expect(page.locator('#approach')).toBeVisible();
 await page.route('**/assets/app-*.js',route=>route.abort());
 await page.goto('/plans');
 await expect(page.getByRole('heading',{name:/Different starts/i})).toBeVisible();
 await expect(page.locator('#ai-systems')).toBeVisible();
});

test('sculpture and pinned proof respond across resize, reversed scroll and tab return',async({page,context})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto('/');
 await expect(page.locator('[data-sc-root]')).toBeVisible();
 await page.locator('#sculpture-shape').fill('75');
 await expect.poll(()=>page.locator('[data-sculpture]').getAttribute('data-render-state')).toBe('ready');
 await page.locator('#sculpture-shape').focus();
 await page.keyboard.press('ArrowLeft');
 await expect(page.locator('#sculpture-shape')).toHaveValue('74');
 await page.evaluate(()=>{const section=document.querySelector('#work');scrollTo({top:section.offsetTop+(section.offsetHeight-innerHeight)*.72,behavior:'instant'})});
 await expect.poll(()=>page.locator('#work').getAttribute('data-proof-progress')).toMatch(/^0\.[6-9]/);
 const forward=await page.locator('.work-desktop').evaluate(node=>getComputedStyle(node).transform);
 await page.evaluate(()=>{const section=document.querySelector('#work');scrollTo({top:section.offsetTop+(section.offsetHeight-innerHeight)*.15,behavior:'instant'})});
 await expect.poll(()=>page.locator('.work-desktop').evaluate(node=>getComputedStyle(node).transform)).not.toBe(forward);
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
 const other=await context.newPage();await other.bringToFront();await page.bringToFront();await other.close();
 for(const [width,height] of [[390,844],[320,568],[667,375]]){
  await page.setViewportSize({width,height});
  await expect(page.locator('#hero-title')).toBeVisible();
  await page.locator('#sculpture-shape').fill('35');
  await expect(page.locator('#sculpture-shape')).toHaveValue('35');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
 }
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();
 await expect(page.locator('.sculpture-poster')).toBeVisible();
 await expect(page.locator('.sculpture-canvas')).toHaveCount(0);
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
 for(const route of ['/','/plans','/clients','/clients/fakhrimart','/founder','/ai-workflow-audit','/company-second-brain','/terms']){
  await page.goto(route);await page.waitForTimeout(1200);
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  expect(result.violations.map(item=>item.id)).toEqual([]);
 }
});
