import { chromium } from '@playwright/test';

const base=process.env.BASE_URL||'http://127.0.0.1:4173';
const concurrency=Number(process.env.STRESS_CONCURRENCY||28);
const total=Number(process.env.STRESS_REQUESTS||800);
const routes=['/','/plans','/founder','/terms','/commercial-cut.css','/commercial-cut.js','/direction-pass.css','/direction-pass.js','/motion-v4.css','/motion-v5.css','/motion-v5.js','/motion-v6.css','/motion-v6.js','/art-direction-v7.css','/art-direction-v7-contrast.css','/art-direction-v7.js','/work-showcase-v8.css','/work-showcase-v8.js','/art-direction-v9.css','/art-direction-v9.js','/continuity-v10.css','/continuity-v10.js','/useful-ux-v11.css','/useful-ux-v11.js','/brayro-v12.css','/brayro-v12.js','/plans-page.css','/plans-page.js','/founder-page.css','/founder-page.js','/terms-page.css','/terms-page.js','/scrollcraft.css','/scrollcraft.js','/assets/hero-background.webp','/assets/yash-cutout.webp','/assets/about-yash.webp','/assets/fakhrimart-case-desktop.png','/assets/fakhrimart-case-mobile.png','/assets/brayroai-cinematic-opening.mp4'];
const failures=[];
const timings=[];
const assert=(condition,message)=>{if(!condition)failures.push(message)};

async function httpLoad(){
  let cursor=0;
  async function worker(){
    while(cursor<total){
      const i=cursor++;
      const route=routes[i%routes.length];
      const start=performance.now();
      try{
        const response=await fetch(`${base}${route}`);
        await response.arrayBuffer();
        timings.push(performance.now()-start);
        if(!response.ok)failures.push(`HTTP ${response.status}: ${route}`);
      }catch(error){failures.push(`${route}: ${error.message}`)}
    }
  }
  await Promise.all(Array.from({length:concurrency},worker));
}

async function clear(page){
  await page.evaluate(()=>{
    document.querySelectorAll('.opening-sequence,.scope-open,.founder-open').forEach(node=>node.remove());
    document.body.classList.remove('polish-opening','hf-intro-active');
  });
}

async function waitV12(page){
  await page.waitForSelector('[data-v12-story]');
  await page.waitForFunction(()=>document.body.classList.contains('v12-runtime-isolated'));
}

async function waitLegacy(page){
  await page.waitForSelector('link[data-useful-ux-v11]',{state:'attached'});
  await page.waitForSelector('script[data-useful-ux-v11]',{state:'attached'});
  await page.waitForFunction(()=>document.body.classList.contains('v11-ready'));
}

async function scrollStorm(page,passes=3,steps=22){
  await page.evaluate(async({passes,steps})=>{
    document.documentElement.style.scrollBehavior='auto';
    for(let pass=0;pass<passes;pass++){
      for(let step=0;step<=steps;step++){
        const ratio=pass%2===0?step/steps:1-step/steps;
        scrollTo(0,(document.documentElement.scrollHeight-innerHeight)*ratio);
        if(step%4===0)await new Promise(requestAnimationFrame);
      }
    }
  },{passes,steps});
}

async function browserLoad(){
  const browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:{width:1440,height:900}});
  const page=await context.newPage();
  const runtime=[];
  page.on('pageerror',error=>runtime.push(error.message));
  page.on('console',message=>{if(message.type()==='error')runtime.push(message.text())});

  await page.goto(`${base}/`,{waitUntil:'networkidle'});
  await page.waitForSelector('[data-hf-intro-video]');
  assert(await page.locator('[data-hf-intro-video]').count()===1,'HyperFrames intro missing');
  await page.locator('[data-hf-skip]').click();
  await page.waitForTimeout(600);
  assert(await page.locator('[data-editorial-sequence] video').count()===0,'background film returned');

  for(const viewport of [{width:390,height:844},{width:1440,height:900},{width:1920,height:1080}]){
    await page.setViewportSize(viewport);
    await page.goto(`${base}/`,{waitUntil:'networkidle'});
    await clear(page);
    await waitV12(page);
    assert(await page.locator('[data-scene]').count()===8,`V12 home scenes @${viewport.width}`);
    assert((await page.locator('#services').getAttribute('data-scene'))==='services',`V12 capability scene mutated @${viewport.width}`);
    assert(await page.locator('[data-v12-step]').count()===4,`four capability steps missing @${viewport.width}`);
    assert(await page.locator('[data-v11-outcome]').count()===0,`legacy V11 outcome rewrite returned @${viewport.width}`);
    assert(await page.locator('[data-v12-project]').count()===3,`project index incomplete @${viewport.width}`);
    assert(await page.locator('#ai-systems .v12-product-card').count()===2,`AI product cards missing @${viewport.width}`);
    assert((await page.locator('#ai-systems').textContent()).includes('₹29,999'),`Second Brain pricing missing @${viewport.width}`);
    assert((await page.locator('#plans').textContent()).includes('₹25K–₹35K+'),'homepage premium one-time tier missing');
    assert(await page.locator('script[data-motion-v6]').count()===0,`legacy runtime mounted on V12 home @${viewport.width}`);
    await scrollStorm(page,2,18);
    assert((await page.locator('#services').getAttribute('data-scene'))==='services',`capability scene changed after scroll storm @${viewport.width}`);
  }

  await page.setViewportSize({width:1440,height:900});
  await page.goto(`${base}/`,{waitUntil:'networkidle'});
  await clear(page);
  await waitV12(page);
  await page.locator('#services').scrollIntoViewIfNeeded();
  for(const key of ['web','product','frontend','ai']){
    const step=page.locator(`[data-v12-step="${key}"]`);
    await step.scrollIntoViewIfNeeded();
    await page.waitForTimeout(90);
  }
  assert((await page.locator('[data-v12-story-visual]').getAttribute('data-state'))==='ai','capability story lost final AI state');

  await page.locator('#work').scrollIntoViewIfNeeded();
  const workToggle=page.locator('[data-work-toggle]');
  for(let i=0;i<31;i++)await workToggle.click();
  assert((await page.locator('[data-work-stage]').getAttribute('data-sc-verify-state'))==='work:mobile','client display lost final mobile state');
  assert((await page.locator('.work__mobile img').getAttribute('src'))==='/assets/fakhrimart-case-mobile.png','client mobile proof regressed');
  await page.evaluate(()=>scrollBy(0,360));
  await page.waitForTimeout(180);
  assert(await page.locator('[data-v12-project]').count()===3,'project showcase changed after interaction storm');

  await page.goto(`${base}/plans`,{waitUntil:'networkidle'});
  await clear(page);
  await waitLegacy(page);
  assert(await page.locator('[data-plan-scene]').count()===7,'plans V12 scene count');
  assert(await page.locator('.build-card').count()===6,'website plans card count');
  assert(await page.locator('.ai-plan-card').count()===2,'AI plans card count');
  assert((await page.locator('#ai-systems').textContent()).includes('Company Second Brain'),'Second Brain missing from Plans');
  for(let i=0;i<80;i++)await page.locator(i%2?'[data-plan-mode="onetime"]':'[data-plan-mode="monthly"]').click();
  assert(await page.locator('[data-plan-mode-output] strong').innerText()==='₹17,999','pricing mode director lost final one-time state');
  await scrollStorm(page);

  await page.goto(`${base}/founder`,{waitUntil:'networkidle'});
  await clear(page);
  await waitLegacy(page);
  for(let i=0;i<60;i++){
    const choices=page.locator('[data-principle]');
    await choices.nth(i%3).click();
  }
  assert((await page.locator('[data-principle-stage]').getAttribute('data-sc-verify-state'))==='principle:use','founder principle state');
  await scrollStorm(page,2,18);

  await page.goto(`${base}/terms`,{waitUntil:'networkidle'});
  await waitLegacy(page);
  assert(await page.locator('.terms-section').count()===12,'terms section count');
  await scrollStorm(page,2,16);
  assert((await page.locator('body').textContent()).includes('₹9,999'),'terms missing one-time pricing');
  assert((await page.locator('body').evaluate(node=>getComputedStyle(node).backgroundColor))==='rgb(236, 232, 223)','terms paper design missing');

  failures.push(...runtime);
  await browser.close();
}

const started=performance.now();
await httpLoad();
await browserLoad();
timings.sort((a,b)=>a-b);
const q=n=>timings[Math.min(timings.length-1,Math.floor(timings.length*n))]||Infinity;
const summary={httpRequests:total,concurrency,routes:routes.length,pages:4,failures:failures.length,medianMs:Math.round(q(.5)),p95Ms:Math.round(q(.95)),elapsedMs:Math.round(performance.now()-started)};
console.log(JSON.stringify(summary,null,2));
if(summary.p95Ms>2200)failures.push(`HTTP p95 ${summary.p95Ms}ms exceeds 2200ms`);
if(failures.length){console.error(failures.slice(0,30).join('\n'));process.exit(1)}
console.log('Stress test passed: V12 story, project showcase, AI products, pricing, Founder and Terms stayed coherent under load.');
