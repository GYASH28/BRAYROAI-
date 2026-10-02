import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {OFFERS,leadText,priceFor} from '../data/pricing.js';
import {OFFER_DETAILS} from '../data/offer-details.js';

const runtimeErrors=new WeakMap();
test.beforeEach(({page})=>{const errors=[];runtimeErrors.set(page,errors);page.on('pageerror',error=>errors.push(error.message))});
test.afterEach(({page})=>{expect(runtimeErrors.get(page),'Uncaught browser exceptions').toEqual([])});

test('brand opening hands control to visitors without blocking or replaying over deep links',async({page})=>{
 await page.goto('/',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.hero-stage')).toHaveAttribute('data-opening-state','playing');
 await expect(page.getByRole('button',{name:'Skip intro'})).toBeVisible();
 await expect(page.locator('.opening-tile')).toHaveCount(38);
 await expect(page.locator('.opening-plane')).toHaveCount(2);
 const openingBox=await page.locator('.brand-opening').boundingBox();
 const viewport=page.viewportSize();
 expect(Math.abs(openingBox.x)).toBeLessThan(2);expect(Math.abs(openingBox.y)).toBeLessThan(2);
 expect(Math.abs(openingBox.width-viewport.width)).toBeLessThan(2);expect(Math.abs(openingBox.height-viewport.height)).toBeLessThan(2);
 await expect(page.locator('.hero-actions .pill-link')).toBeVisible();
 // Early physical intent settles immediately rather than consuming scroll progress.
 await page.waitForTimeout(260);
 await page.evaluate(()=>window.dispatchEvent(new WheelEvent('wheel',{deltaY:20})));
 await expect(page.locator('.brand-opening')).toHaveCount(0);
 await expect(page.locator('.hero-stage')).toHaveAttribute('data-opening-state','settled');

 // A fresh uninterrupted entry owns at most its finite 3.2 second score.
 await page.reload({waitUntil:'domcontentloaded'});
 await expect(page.locator('.hero-stage')).toHaveAttribute('data-opening-state','playing');
 await expect(page.locator('.hero-stage')).toHaveAttribute('data-opening-state','settled',{timeout:5000});
 await expect(page.locator('.brand-opening,.brand-opening-skip')).toHaveCount(0);
 expect(await page.evaluate(()=>document.getAnimations().filter(a=>a.id.startsWith('brand-opening-')).length)).toBe(0);
 await expect(page.locator('.hero-word').first()).toHaveCSS('opacity','1');
 await expect(page.locator('.hero-actions .pill-link')).toBeVisible();

 // The visible skip action and keyboard/control intent both hand ownership back.
 await page.reload({waitUntil:'domcontentloaded'});
 await page.getByRole('button',{name:'Skip intro'}).click();
 await expect(page.locator('.brand-opening')).toHaveCount(0);

 // Portrait beats keep opaque mosaic material above the commercial copy.
 const desktopViewport=page.viewportSize();
 await page.setViewportSize({width:390,height:844});
 await page.reload({waitUntil:'domcontentloaded'});
 await expect(page.locator('.hero-stage')).toHaveAttribute('data-opening-state','playing');
 for(const time of [1100,1650,2200]){
  const overlap=await page.evaluate(time=>{
   const animations=document.getAnimations().filter(animation=>animation.id.startsWith('brand-opening-'));
   animations.forEach(animation=>{animation.pause();animation.currentTime=time});
   const copy=document.querySelector('.hero-bottom').getBoundingClientRect();
   return [...document.querySelectorAll('.opening-tile')].filter(tile=>Number(getComputedStyle(tile).opacity)>.35).filter(tile=>{
    const rect=tile.getBoundingClientRect();
    return rect.right>copy.left&&rect.left<copy.right&&rect.bottom>copy.top&&rect.top<copy.bottom;
   }).length;
  },time);
  expect(overlap,`opaque portrait fragments over sales copy at ${time}ms`).toBe(0);
 }
 await page.getByRole('button',{name:'Skip intro'}).click();
 await page.setViewportSize(desktopViewport);
 await page.reload({waitUntil:'domcontentloaded'});
 await page.keyboard.press('Tab');
 await expect(page.locator('.brand-opening')).toHaveCount(0);
 await expect(page.locator('.skip-link')).toBeFocused();
 await page.reload({waitUntil:'domcontentloaded'});
 await page.locator('.header-inner [data-market-open]').click();
 await expect(page.locator('#market-dialog')).toBeVisible();
 await expect(page.locator('.brand-opening')).toHaveCount(0);
 await page.keyboard.press('Escape');

 await page.goto('/#work');
 await expect(page.locator('.brand-opening')).toHaveCount(0);
 await expect(page.locator('#work h2')).toBeInViewport();
 await page.goto('/');
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(page.locator('.brand-opening')).toHaveCount(0);
 await expect(page.locator('.hero-word').first()).toHaveCSS('opacity','1');
 await page.reload();
 await expect(page.locator('.brand-opening')).toHaveCount(0);
 await expect(page.locator('.hero-prelude')).toHaveCSS('opacity','1');
});


test('new visitor reaches real work, case study, and returns',async({page})=>{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/');
 await expect(page.getByRole('heading',{name:/Make your mark/i})).toBeVisible();
 await expect(page.locator('.sculpture-control')).toHaveCount(0);
 await page.locator('.object-index a[href="#work"]').click();
 await expect(page).toHaveURL(/#work$/);
 await expect(page.locator('#work')).toBeInViewport();
 await expect.poll(()=>page.locator('#work').evaluate(node=>Math.abs(node.getBoundingClientRect().top-document.querySelector('.site-header').getBoundingClientRect().bottom-16))).toBeLessThan(2);
 await page.locator('.work-desktop').scrollIntoViewIfNeeded();
 await expect.poll(()=>page.locator('.work-desktop img').evaluate(image=>image.complete&&image.naturalWidth>0)).toBe(true);
 await page.getByRole('link',{name:'Open the FakhriMart case study'}).click();
 await expect(page).toHaveURL(/\/clients\/fakhrimart$/);
 await expect(page.getByRole('heading',{level:1,name:/Fakhri\s*Mart/i})).toBeVisible();
 await expect(page.getByRole('link',{name:'Visit the live website'})).toHaveAttribute('href','https://fakhriyarns.vercel.app/');
 await page.goBack();
 await expect(page).toHaveURL(/#work$/);
 // Same-document anchors must settle after the deferred scene has measured its layout.
 for(const hash of ['method','contact']){
  await page.goto('/#'+hash);
  await expect.poll(()=>page.locator('#'+hash).evaluate(node=>Math.round(node.getBoundingClientRect().top))).toBeLessThan(250);
  await expect(page.locator('#'+hash+' h2')).toBeInViewport();
 }
 expect(errors).toEqual([]);
});

test('regional price books are English and exact',async({page})=>{
 for(const [route,label,price] of [['/plans','India · INR','₹2,599'],['/ae/plans','UAE · AED','AED 690'],['/au/plans','Australia · AUD','A$390']]){
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
 await page.locator('#principles summary').filter({hasText:'Motion with meaning.'}).focus();
 await page.keyboard.press('Enter');
 await expect(page.locator('#principles details').nth(1)).toHaveAttribute('open','');
 await expect(page.locator('#principles details').nth(1)).toContainText('when motion is reduced');
 await page.goto('/clients');
 await page.locator('.archive-case-title').click();
 await expect(page).toHaveURL(/\/clients\/fakhrimart$/);
});

test('plans keep complete website builds separate from optional monthly care',async({page})=>{
 await page.goto('/plans');
 await expect(page.getByRole('heading',{level:1,name:/Build the site. Choose the depth./i})).toBeVisible();
 await expect(page.locator('#starter-build [data-price="launch-website"]')).toHaveText('₹2,599');
 await expect(page.locator('#business-build [data-price="business-experience"]')).toHaveText('₹3,999');
 await expect(page.locator('#premium-build [data-price="premium-experience"]')).toHaveText('₹5,999+');
 await expect(page.locator('#new-website')).toContainText('complete website builds, not maintenance plans');
 await expect(page.locator('#monthly-support')).toBeHidden();
 await page.getByRole('tab',{name:/Monthly care/i}).click();
 await expect(page.locator('#monthly-support')).toBeVisible();
 await expect(page.locator('#new-website')).toBeHidden();
 await expect(page.locator('#monthly-starter [data-price="monthly-starter"]')).toHaveText('₹2,599/mo');
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
 await page.goto('/plans?ref=brief#monthly-support');
 await expect(page).toHaveURL(/\/ae\/plans\?ref=brief#monthly-support$/);
 await expect(page.locator('[data-category="monthly-support"]')).toHaveAttribute('aria-selected','true');
 await expect(page.locator('[data-price="launch-website"]').first()).toHaveText('AED 690');
});

test('old Arabic URLs and manual preferences resolve to English UAE',async({page})=>{
 await page.goto('/ae/ar/plans');
 await expect(page).toHaveURL(/\/ae\/plans$/);
 await expect(page.locator('html')).toHaveAttribute('lang','en');
 await expect(page.locator('[data-price="launch-website"]').first()).toHaveText('AED 690');
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
 await page.getByRole('tab',{name:/Monthly care/i}).click();
 await expect(page).toHaveURL(/#monthly-support$/);
 await page.getByRole('tab',{name:'AI systems'}).click();
 await page.goBack();
 await expect(page.getByRole('tab',{name:/Monthly care/i})).toHaveAttribute('aria-selected','true');
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
 await page.unroute('**/api/rae-chat');
 await page.route('**/api/rae-chat',route=>route.fulfill({status:200,contentType:'text/event-stream',body:'event: delta\ndata: {"text":"An incomplete explanation cut off at"}\n\nevent: error\ndata: {"code":"output_truncated","message":"The answer ended early. Please retry."}\n\n'}));
 await page.locator('#rae-input').fill('Please compare the offers.');
 await page.getByRole('button',{name:/Send message to Rae/}).click();
 await expect(page.locator('.rae-status')).toContainText('ended early');
 await expect(page.locator('.rae-message.assistant').last()).toHaveText('Rae could not answer right now.');
 await expect(page.locator('.rae-messages')).not.toContainText('incomplete explanation');
 await page.locator('[data-rae-close]').click();
 await expect(page.locator('#rae-dialog')).not.toBeVisible();
});

test('Rae replaces interrupted text and retains only completed answers',async({page})=>{
 const requests=[];
 await page.route('**/api/rae-chat',async route=>{
  requests.push(route.request().postDataJSON());
  const replacement='Website Starter starts at ₹2,599. Monthly support starts at ₹2,599.';
  const body=requests.length===1?`event: delta\ndata: {"text":"Discard this partial"}\n\nevent: reset\ndata: {"reason":"provider_recovery"}\n\nevent: state\ndata: {"state":"thinking","attempt":2,"recovering":true}\n\nevent: delta\ndata: ${JSON.stringify({text:replacement})}\n\nevent: done\ndata: {"finishReason":"stop"}\n\n`:'event: delta\ndata: {"text":"We can discuss your scope."}\n\nevent: done\ndata: {"finishReason":"stop"}\n\n';
  await route.fulfill({status:200,contentType:'text/event-stream',body});
 });
 await page.goto('/');await page.locator('.rae-launcher').click();
 await page.locator('#rae-input').fill('What are the starting prices?');await page.getByRole('button',{name:'Send message to Rae'}).click();
 await expect(page.locator('.rae-message.assistant').last()).toHaveText('Website Starter starts at ₹2,599. Monthly support starts at ₹2,599.');
 await expect(page.locator('.rae-messages')).not.toContainText('Discard this partial');
 await page.locator('#rae-input').fill('What happens next?');await page.getByRole('button',{name:'Send message to Rae'}).click();
 await expect(page.locator('.rae-message.assistant').last()).toHaveText('We can discuss your scope.');
 expect(requests[0].supportsStreamReset).toBe(true);
 expect(requests[1].history).toEqual([{role:'user',text:'What are the starting prices?'},{role:'assistant',text:'Website Starter starts at ₹2,599. Monthly support starts at ₹2,599.'}]);
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
  await expect(page.getByRole('heading',{name:/Make your mark/i})).toBeVisible();
 }
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');
 await expect(page.locator('#method')).toBeVisible();
 await page.route('**/assets/*.js',route=>route.abort());
 await page.goto('/plans');
 await expect(page.getByRole('heading',{name:/Build the site/i})).toBeVisible();
 await expect(page.locator('#ai-systems')).toBeVisible();
 await page.goto('/#method');
 await page.getByRole('radio',{name:'A better live website'}).check();
 await expect(page.locator('[data-path-panel=monthly]')).toBeVisible();
 await expect(page.locator('[data-path-panel=monthly] a')).toHaveAttribute('href','/plans#monthly-support');
});

test('particle hero, footer and pinned proof respond across input, resize and reversed scroll',async({page,context})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto('/');
 await expect(page.locator('[data-sc-root]')).toBeVisible();
 await page.waitForTimeout(1200);
 const title=await page.locator('#hero-title').boundingBox();
 expect(Math.abs(title.x+title.width/2-720)).toBeLessThan(2);
 await page.mouse.move(790,340);
 await expect.poll(()=>page.locator('.hero-word').evaluateAll(words=>words.some(word=>parseFloat(word.style.getPropertyValue('--type-y'))<-.1))).toBe(true);
 await page.mouse.move(0,0);
 await expect.poll(()=>page.locator('.hero-word').evaluateAll(words=>words.every(word=>!word.style.getPropertyValue('--type-y')))).toBe(true);
 const geometry=await page.locator('.hero-stage').evaluate(el=>({top:el.getBoundingClientRect().top,height:el.getBoundingClientRect().height,viewport:innerHeight}));
 expect(geometry.top).toBe(0);expect(Math.abs(geometry.height-geometry.viewport)).toBeLessThan(2);
 const heroPosition=async progress=>page.evaluate(progress=>{const section=document.querySelector('.studio-hero');scrollTo({top:section.offsetTop+(section.offsetHeight-innerHeight)*progress,behavior:'instant'})},progress);
 await heroPosition(.66);
 await expect.poll(()=>page.locator('[data-sculpture]').getAttribute('data-render-state')).toBe('ready');
 await expect(page.locator('[data-sculpture]')).toHaveAttribute('data-draw-calls','1');
 await expect(page.locator('[data-sculpture]')).toHaveAttribute('data-render-points','9600');
 const canLoseContext=await page.locator('.sculpture-canvas').evaluate(canvas=>{const gl=canvas.getContext('webgl2')||canvas.getContext('webgl'),extension=gl?.getExtension('WEBGL_lose_context');if(!extension)return false;window.__brayroLoseContext=extension;extension.loseContext();return true});
 if(canLoseContext){
  await expect.poll(()=>page.locator('[data-sculpture]').getAttribute('data-render-state')).toBe('fallback');
  await page.evaluate(()=>window.__brayroLoseContext?.restoreContext());
  await expect.poll(()=>page.locator('[data-sculpture]').getAttribute('data-render-state')).toBe('ready');
 }
 await expect(page.locator('.studio-hero')).toHaveAttribute('data-assembly-progress','1.000');
 await expect(page.locator('.hero-next')).toHaveAttribute('aria-hidden','false');
 await expect(page.getByRole('heading',{name:/Strategy becomes structure. Character becomes experience/i})).toBeInViewport();
 await heroPosition(.94);
 const handoff=page.locator('.hero-handoff');
 await expect(handoff).toHaveCount(1);
 await expect.poll(()=>handoff.evaluate(node=>Number(getComputedStyle(node).opacity))).toBeGreaterThan(.6);
 const handoffBox=await handoff.boundingBox();
 expect(handoffBox.height).toBeLessThan(150);
 expect(handoffBox.y).toBeGreaterThan(page.viewportSize().height-170);
 await expect.poll(()=>page.locator('.hero-object').evaluate(node=>Number(getComputedStyle(node).opacity))).toBeGreaterThan(.85);
 await heroPosition(0);
 await expect(page.locator('.hero-intro')).toHaveAttribute('aria-hidden','false');
 await expect(page.locator('.studio-hero')).toHaveAttribute('data-assembly-progress','0.000');
 await page.evaluate(()=>{const section=document.querySelector('#work');scrollTo({top:section.offsetTop+(section.offsetHeight-innerHeight)*.72,behavior:'instant'})});
 await expect.poll(()=>page.locator('#work').getAttribute('data-proof-progress')).toMatch(/^0\.[6-9]/);
 const forward=await page.locator('.work-desktop').evaluate(node=>getComputedStyle(node).transform);
 await page.evaluate(()=>{const section=document.querySelector('#work');scrollTo({top:section.offsetTop+(section.offsetHeight-innerHeight)*.15,behavior:'instant'})});
 await expect.poll(()=>page.locator('.work-desktop').evaluate(node=>getComputedStyle(node).transform)).not.toBe(forward);
 await page.locator('#method').scrollIntoViewIfNeeded();
 const choices=page.getByRole('group',{name:'What does your business need?'});
 await choices.getByRole('radio',{name:'A new website'}).focus();
 await page.keyboard.press('ArrowDown');
 await expect(choices.getByRole('radio',{name:'A better live website'})).toBeChecked();
 await expect(page.locator('[data-path-panel="monthly"]')).toBeVisible();
 await expect(page.locator('[data-path-panel="monthly"] [data-price]')).toHaveText('₹2,599/mo');
 await choices.getByRole('radio',{name:'A lighter way to work'}).check();
 await expect(page.locator('[data-path-panel="ai"]')).toContainText('Three to five realistic opportunities');
 await expect(page.locator('[data-path-panel="ai"] a')).toHaveAttribute('href','/ai-workflow-audit');
 const processAccess=await new AxeBuilder({page}).include('.path-studio').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
 expect(processAccess.violations).toEqual([]);
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
 const mark=page.getByRole('link',{name:'BRAYRO AI — return to the top'});
 await mark.scrollIntoViewIfNeeded();
 await expect(mark.locator('.footer-logo rect')).toHaveCount(161);
 const box=await mark.boundingBox();
 await page.mouse.move(box.x+box.width*.38,box.y+box.height*.55);
 await expect.poll(()=>mark.locator('rect').evaluateAll(nodes=>nodes.filter(node=>node.style.transform&&node.style.transform!=='none').length)).toBeGreaterThan(0);
 await page.mouse.move(0,0);
 await expect.poll(()=>mark.locator('rect').evaluateAll(nodes=>nodes.filter(node=>node.style.transform&&node.style.transform!=='none').length)).toBe(0);
 await mark.focus();await page.keyboard.press('Enter');
 await expect(page).toHaveURL(/#top$/);
 await expect.poll(()=>page.evaluate(()=>scrollY)).toBeLessThan(2);
 const other=await context.newPage();await other.bringToFront();await page.bringToFront();await other.close();
 for(const [width,height] of [[390,844],[320,568],[667,375]]){
  await page.setViewportSize({width,height});
  await expect(page.locator('#hero-title')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
 }
 await heroPosition(.999);
 await expect(page.locator('.hero-handoff')).toHaveCount(1);
 await expect.poll(()=>page.locator('.hero-handoff').evaluate(node=>Number(getComputedStyle(node).opacity))).toBeGreaterThan(.95);
 await expect.poll(()=>page.locator('.hero-object').evaluate(node=>Number(getComputedStyle(node).opacity))).toBeGreaterThan(.85);
 await expect(page.locator('.hero-next')).toHaveAttribute('aria-hidden','false');
 await page.emulateMedia({reducedMotion:'reduce'});
 // A preference change after enhancement must leave one readable link label.
 await page.locator('.person-copy .text-link').scrollIntoViewIfNeeded();
 await expect.poll(async()=>(await page.locator('.person-copy .text-link').innerText()).trim()).toBe('Meet Yash');
 await expect(page.getByRole('heading',{name:'One mind. Many ways to make.'})).toBeVisible();
 await page.reload();
 await expect(page.locator('.particle-cloud')).toBeVisible();
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
 const marketAccess=await new AxeBuilder({page}).include('#market-dialog').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
 expect(marketAccess.violations).toEqual([]);
 await page.keyboard.press('Escape');
 await expect(page.locator('#market-dialog')).not.toBeVisible();
 for(const route of ['/','/plans','/clients','/clients/fakhrimart','/founder','/ai-workflow-audit','/company-second-brain','/terms']){
  await page.goto(route);await page.waitForTimeout(1200);
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  expect(result.violations.map(item=>item.id)).toEqual([]);
 }
});


test('full plans explain every offer in each market and restore keyboard focus',async({page})=>{
 test.setTimeout(90_000);
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 for(const [market,prefix] of [['in',''],['ae','/ae'],['au','/au']]){
  await page.goto(prefix+'/plans');
  for(const id of Object.keys(OFFERS)){
   const category=id.startsWith('monthly')?'monthly-support':['ai-workflow-audit','company-second-brain','knowledge-care'].includes(id)?'ai-systems':'new-website';
   await page.locator(`[data-category="${category}"]`).click();
   const opener=page.locator(`[data-plan-detail="${id}"]`);
   await opener.click();
   const modal=page.locator('#plan-detail-dialog');
   await expect(modal).toBeVisible();
   await expect(modal.locator('#plan-detail-title')).toHaveText(OFFERS[id].name);
   await expect(modal.locator('[data-detail-price]')).toHaveText(priceFor(id,market));
   await expect(modal.locator('.plan-detail-inclusions li')).toHaveText(OFFER_DETAILS[id].inclusions);
   await expect(modal.locator('.plan-detail-benefits li')).toHaveText(OFFER_DETAILS[id].benefits);
   await expect(modal.locator('.plan-detail-boundaries li')).toHaveText(OFFER_DETAILS[id].boundaries);
   await expect(modal.locator('[data-detail-terms]')).toHaveAttribute('href',prefix+'/terms');
   const href=await modal.locator('[data-detail-enquire]').getAttribute('href');
   expect(new URL(href).searchParams.get('text')).toBe(leadText({market,offerId:id,source:prefix+'/plans#'+category}));
   if(market==='in'&&id==='launch-website'){
    const access=await new AxeBuilder({page}).include('#plan-detail-dialog').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(access.violations).toEqual([]);
    await page.mouse.wheel(0,500);
    expect(await page.locator('html').evaluate(node=>getComputedStyle(node).overflow)).toBe('hidden');
   }
   await page.keyboard.press('Escape');
   await expect(modal).not.toBeVisible();
   await expect(opener).toBeFocused();
  }
 }
 await page.goto('/plans#premium-experience');
 await expect(page.locator('#plan-detail-dialog')).toHaveCount(0);
 await page.locator('[data-plan-detail="premium-experience"]').click();
 await expect(page.locator('#plan-detail-dialog')).toBeVisible();
 await page.mouse.click(5,5);
 await expect(page.locator('#plan-detail-dialog')).not.toBeVisible();
 expect(errors).toEqual([]);
});

test('Rae cancellation discards late stream events and conversation reset clears history',async({page})=>{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.addInitScript(()=>{
  const nativeFetch=window.fetch;window.raeRequests=[];
  window.fetch=(url,options)=>{
   if(!String(url).includes('/api/rae-chat'))return nativeFetch(url,options);
   window.raeRequests.push(JSON.parse(options.body));
   const encoder=new TextEncoder();let controller;
   const stream=new ReadableStream({start(c){controller=c}});
   if(window.raeRequests.length===1){
    window.finishOldRae=()=>{try{controller.enqueue(encoder.encode('event: meta\ndata: {"actions":[{"name":"navigateToRoute","args":{"route":"/terms"},"label":"Stale link"}]}\n\nevent: done\ndata: {"finishReason":"stop"}\n\n'));controller.close()}catch{}};
    controller.enqueue(encoder.encode('event: delta\ndata: {"text":"The unfinished answer"}\n\n'));
   }else{controller.enqueue(encoder.encode('event: delta\ndata: {"text":"The fresh answer"}\n\nevent: done\ndata: {"finishReason":"stop"}\n\n'));controller.close()}
   return Promise.resolve(new Response(stream,{headers:{'Content-Type':'text/event-stream'}}));
  };
 });
 await page.goto('/');await page.locator('.rae-launcher').click();
 await page.locator('#rae-input').fill('The old question');await page.getByRole('button',{name:'Send message to Rae'}).click();
 await expect(page.locator('.rae-message.assistant')).toHaveText('The unfinished answer');
 await page.getByRole('button',{name:'Stop response'}).click();
 await expect(page.locator('.rae-message')).toHaveCount(0);
 await expect(page.locator('#rae-input')).toHaveValue('The old question');
 await page.locator('#rae-input').fill('A fresh question');await page.getByRole('button',{name:'Send message to Rae'}).click();
 await expect(page.locator('.rae-message.assistant')).toHaveText('The fresh answer');
 await page.evaluate(()=>window.finishOldRae());
 await expect(page.locator('.rae-message.assistant')).toHaveText('The fresh answer');
 await expect(page.locator('.rae-actions')).toHaveCount(0);
 await page.getByRole('button',{name:'Start a new conversation with Rae'}).click();
 await expect(page.locator('.rae-message')).toHaveCount(0);
 await page.locator('#rae-input').fill('After a new thread');await page.getByRole('button',{name:'Send message to Rae'}).click();
 await expect(page.locator('.rae-message.assistant')).toHaveText('The fresh answer');
 const requests=await page.evaluate(()=>window.raeRequests);expect(requests[1].history).toEqual([]);expect(requests[2].history).toEqual([]);
 const access=await new AxeBuilder({page}).include('#rae-dialog').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(access.violations).toEqual([]);
 expect(errors).toEqual([]);
});
