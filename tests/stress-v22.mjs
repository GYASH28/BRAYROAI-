import {chromium} from '@playwright/test';

const base=process.env.BASE_URL||'http://127.0.0.1:4173';
const concurrency=Number(process.env.STRESS_CONCURRENCY||28);
const total=Number(process.env.STRESS_REQUESTS||800);
const routes=[
  '/','/plans','/founder','/terms','/ai-workflow-audit','/company-second-brain','/clients','/clients/fakhrimart',
  '/assets/brayro-home.css','/commercial-cut.js','/direction-pass.js','/brayro-v12.js','/brayro-v14.js','/brayro-v15.js','/experience-motion-v16.js','/cinematic-v18.js','/cinematic-v20.js','/brayro-cursor-v22.js','/rae.js',
  '/rae/rae-app.js','/rae/rae-director.js','/rae/rae-chat-client.js','/rae/rae-ui.js','/rae/rae-actions.js','/rae/rae-context.js','/rae/rae-character.js',
  '/ai-service-pages.css','/ai-service-pages.js','/client-work.css','/client-work.js','/plans-page.js','/founder-page.js','/terms-page.js','/assets/hero-background.webp','/assets/yash-cutout.webp','/assets/about-yash.webp','/assets/fakhrimart-case-desktop.webp','/assets/fakhrimart-case-mobile.webp','/assets/brayroai-cinematic-opening-silent.mp4'
];
const failures=[],timings=[];const assert=(condition,message)=>{if(!condition)failures.push(message)};

async function httpLoad(){let cursor=0;async function worker(){while(cursor<total){const i=cursor++,route=routes[i%routes.length],start=performance.now();try{const response=await fetch(`${base}${route}`);await response.arrayBuffer();timings.push(performance.now()-start);if(!response.ok)failures.push(`HTTP ${response.status}: ${route}`)}catch(error){failures.push(`${route}: ${error.message}`)}}}await Promise.all(Array.from({length:concurrency},worker))}
const clearOpening=page=>page.evaluate(()=>{document.querySelectorAll('.opening-sequence,.scope-open,.founder-open').forEach(node=>node.remove());document.body.classList.remove('polish-opening','hf-intro-active','is-opening')});
async function waitRaeApp(page){await page.waitForSelector('[data-rae-root]');await page.evaluate(()=>{const shell=document.querySelector('[data-rae-shell]');if(shell)shell.dispatchEvent(new PointerEvent('pointerenter',{bubbles:true,pointerType:'mouse'}))});await page.waitForSelector('[data-rae-toggle]');await page.waitForFunction(()=>document.querySelector('[data-rae-root]')?.dataset.raeAppReady==='true')}
async function waitHome(page){await page.waitForSelector('[data-v15-play] [data-v15-stage]');await page.waitForFunction(()=>document.body.classList.contains('home-v20'));await page.waitForFunction(()=>document.documentElement.dataset.v22CursorMounted==='true');await waitRaeApp(page)}
async function waitLegacy(page){await page.waitForSelector('link[data-useful-ux-v11]',{state:'attached'});await page.waitForSelector('script[data-useful-ux-v11]',{state:'attached'});await page.waitForFunction(()=>document.body.classList.contains('v11-ready'));await waitRaeApp(page)}
async function scrollStorm(page,passes=2,steps=18){await page.evaluate(async({passes,steps})=>{document.documentElement.style.scrollBehavior='auto';for(let pass=0;pass<passes;pass++)for(let step=0;step<=steps;step++){const ratio=pass%2===0?step/steps:1-step/steps;scrollTo(0,(document.documentElement.scrollHeight-innerHeight)*ratio);if(step%3===0)await new Promise(requestAnimationFrame)}},{passes,steps})}

async function verifyLazyHomeArt(page,width){
  for(const [scene,selector,count,label] of [
    ['#ai-systems','[data-v20-data-path]',2,'AI paths'],
    ['#plans','[data-v20-rate-light]',3,'pricing lights']
  ]){
    await page.locator(scene).evaluate(node=>node.scrollIntoView({behavior:'instant',block:'center'}));
    await page.waitForFunction(({selector,count})=>document.querySelectorAll(selector).length===count,{selector,count},{timeout:5000});
    assert(await page.locator(selector).count()===count,`${label} missing @${width}`);
  }
}

async function browserLoad(){
  const browser=await chromium.launch({headless:true}),context=await browser.newContext({viewport:{width:1440,height:900}});\n  // Vite preview does not execute the Vercel /api directory. Mock the first-visit\n  // market probe here so the stress suite measures the site instead of recording\n  // a deliberate local 404 from /api/market. Dedicated market journey tests still\n  // exercise AU/AE auto-detection and manual overrides independently.\n  await context.route('**/api/market',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({country:'IN',market:'in',language:'en',source:'ci-preview'})}));\n  const page=await context.newPage(),runtime=[];
  page.on('pageerror',error=>runtime.push(error.message));page.on('console',message=>{if(message.type()==='error'&&!message.text().includes('Rae failed to load'))runtime.push(message.text())});
  await page.goto(`${base}/`,{waitUntil:'networkidle'});await page.waitForSelector('[data-hf-intro-video]');assert(await page.locator('[data-hf-intro-video]').count()===1,'opening film missing');await page.locator('[data-hf-skip]').click();await page.waitForTimeout(450);

  for(const viewport of [{width:390,height:844},{width:1440,height:900},{width:1920,height:1080}]){
    await page.setViewportSize(viewport);await page.goto(`${base}/`,{waitUntil:'networkidle'});await clearOpening(page);await waitHome(page);
    assert(await page.locator('[data-scene]').count()===8,`home scene count @${viewport.width}`);assert(await page.locator('[data-v18-reel],.v18-reel').count()===0,`retired reel returned @${viewport.width}`);assert(await page.locator('.brayro-ledger').count()===0,`retired ledger returned @${viewport.width}`);assert(await page.locator('#services [data-v15-control]').count()===4,`play controls missing @${viewport.width}`);assert(await page.locator('[data-v20-lens]').count()===1,`hero lens missing @${viewport.width}`);assert(await page.locator('[data-v20-scene-rail]').count()===(viewport.width>760?1:0),`scene rail visibility wrong @${viewport.width}`);assert(await page.locator('[data-rae-root]').count()===1,`Rae duplicated/missing @${viewport.width}`);assert((await page.locator('body').getAttribute('data-rae-page'))==='home',`Rae page context wrong @${viewport.width}`);assert(await page.locator('[data-rae-character]').count()>=3,`Rae layered actor missing @${viewport.width}`);assert(await page.locator('.v12-cursor,.m5-cursor,.v16-cursor').count()===0,`legacy cursor returned @${viewport.width}`);assert((await page.locator('#plans').textContent()).includes('₹25K–₹35K+'),'premium one-time tier missing');await verifyLazyHomeArt(page,viewport.width);await scrollStorm(page);assert(await page.locator('[data-rae-root]').count()===1,`Rae changed after scroll storm @${viewport.width}`);
  }

  await page.setViewportSize({width:1440,height:900});await page.goto(`${base}/`,{waitUntil:'networkidle'});await clearOpening(page);await waitHome(page);await page.locator('#services').scrollIntoViewIfNeeded();for(let i=0;i<4;i++)await page.locator(`[data-v15-control="${i}"]`).click();assert((await page.locator('#services').getAttribute('data-play-state'))==='ai','playground lost AI state');assert((await page.locator('[data-v15-title]').textContent()).includes('real problem'),'playground AI copy missing');

  await page.locator('[data-rae-toggle]').click();assert((await page.locator('[data-rae-panel]').getAttribute('aria-hidden'))==='false','Rae panel did not open under load');assert(await page.locator('[data-rae-input]').count()===1,'Rae composer missing under load');assert(await page.locator('[data-rae-suggestions] .rae-chip').count()>=3,'Rae starter chips missing under load');assert(await page.locator('[data-rae-character]').count()>=3,'Rae actor layers missing under load');await page.keyboard.press('Escape');assert((await page.locator('[data-rae-panel]').getAttribute('aria-hidden'))==='true','Rae panel did not close under load');

  await page.locator('#work').scrollIntoViewIfNeeded();const workToggle=page.locator('[data-work-toggle]');for(let i=0;i<15;i++)await workToggle.click();assert((await page.locator('.work__mobile img').getAttribute('src'))==='/assets/fakhrimart-case-mobile.webp','client mobile proof regressed');
  await page.goto(`${base}/plans`,{waitUntil:'networkidle'});await clearOpening(page);await waitLegacy(page);assert(await page.locator('[data-plan-scene]').count()===7,'plans scene count');assert(await page.locator('.build-card').count()===6,'website plans card count');assert(await page.locator('.ai-plan-card').count()===2,'AI plans card count');assert(await page.locator('[data-rae-root]').count()===1,'Rae missing on Plans');
  await page.goto(`${base}/clients`,{waitUntil:'networkidle'});await waitRaeApp(page);assert(await page.locator('[data-client-grid]').count()===1,'client archive missing');assert(await page.locator('[data-rae-root]').count()===1,'Rae missing on Clients');
  await page.goto(`${base}/clients/fakhrimart`,{waitUntil:'networkidle'});await waitRaeApp(page);assert((await page.locator('body').textContent()).includes('Not a fake ecommerce store.'),'FakhriMart case missing');
  await page.goto(`${base}/ai-workflow-audit`,{waitUntil:'networkidle'});assert(await page.locator('[data-process-tab]').count()===5,'Audit process incomplete');for(let i=0;i<5;i++)await page.locator('[data-process-tab]').nth(i).click();assert((await page.locator('[data-process-title]').textContent()).includes('Leave with a plan'),'Audit process lost final state');
  await page.goto(`${base}/company-second-brain`,{waitUntil:'networkidle'});assert(await page.locator('[data-arch-node]').count()===5,'Second Brain sources incomplete');await page.locator('[data-arch-node="whatsapp"]').click();assert((await page.locator('[data-arch-status]').textContent()).includes('WhatsApp'),'Second Brain integration interaction failed');
  await page.goto(`${base}/founder`,{waitUntil:'networkidle'});await clearOpening(page);await waitLegacy(page);const choices=page.locator('[data-principle]');for(let i=0;i<12;i++)await choices.nth(i%3).click({force:true});assert((await page.locator('[data-principle-stage]').getAttribute('data-sc-verify-state'))==='principle:use','founder principle state');
  await page.goto(`${base}/terms`,{waitUntil:'networkidle'});await waitLegacy(page);assert(await page.locator('.terms-section').count()===12,'terms section count');assert((await page.locator('body').textContent()).includes('₹9,999'),'terms pricing missing');
  failures.push(...runtime);await browser.close();
}

const started=performance.now();await httpLoad();await browserLoad();timings.sort((a,b)=>a-b);const q=n=>timings[Math.min(timings.length-1,Math.floor(timings.length*n))]||Infinity;const summary={httpRequests:total,concurrency,routes:routes.length,pages:8,failures:failures.length,medianMs:Math.round(q(.5)),p95Ms:Math.round(q(.95)),elapsedMs:Math.round(performance.now()-started)};console.log(JSON.stringify(summary,null,2));if(summary.p95Ms>2200)failures.push(`HTTP p95 ${summary.p95Ms}ms exceeds 2200ms`);if(failures.length){console.error(failures.slice(0,30).join('\n'));process.exit(1)}console.log('V22 stress passed: cinematic site, modular Rae actor, client work and AI pages stayed coherent under concurrent load.');
