import { chromium } from '@playwright/test';
const base=process.env.BASE_URL||'http://127.0.0.1:4173';
const concurrency=Number(process.env.STRESS_CONCURRENCY||28),total=Number(process.env.STRESS_REQUESTS||800);
const routes=['/','/plans','/founder','/terms','/commercial-cut.css','/commercial-cut.js','/direction-pass.css','/direction-pass.js','/motion-v4.css','/motion-v5.css','/motion-v5.js','/motion-v6.css','/motion-v6.js','/art-direction-v7.css','/art-direction-v7-contrast.css','/art-direction-v7.js','/work-showcase-v8.css','/work-showcase-v8.js','/art-direction-v9.css','/art-direction-v9.js','/continuity-v10.css','/continuity-v10.js','/useful-ux-v11.css','/useful-ux-v11.js','/stability-v12.css','/stability-v12.js','/plans-page.css','/plans-page.js','/founder-page.css','/founder-page.js','/terms-page.css','/terms-page.js','/scrollcraft.css','/scrollcraft.js','/assets/hero-background.webp','/assets/yash-cutout.webp','/assets/about-yash.webp','/assets/fakhrimart-case-desktop.png','/assets/fakhrimart-case-mobile.png','/assets/brayroai-cinematic-opening.mp4'];
const failures=[],timings=[];const assert=(c,m)=>{if(!c)failures.push(m)};
async function httpLoad(){let cursor=0;async function worker(){while(cursor<total){const i=cursor++;const route=routes[i%routes.length],start=performance.now();try{const r=await fetch(`${base}${route}`);await r.arrayBuffer();timings.push(performance.now()-start);if(!r.ok)failures.push(`HTTP ${r.status}: ${route}`)}catch(e){failures.push(`${route}: ${e.message}`)}}}await Promise.all(Array.from({length:concurrency},worker))}
async function clear(page){await page.evaluate(()=>{document.querySelectorAll('.opening-sequence,.scope-open,.founder-open').forEach(n=>n.remove());document.body.classList.remove('polish-opening','hf-intro-active')})}
async function waitV12(page){await page.waitForSelector('link[data-useful-ux-v11]',{state:'attached'});await page.waitForSelector('script[data-useful-ux-v11]',{state:'attached'});await page.waitForFunction(()=>document.body.classList.contains('v11-ready'));if(new URL(page.url()).pathname==='/'){await page.waitForSelector('link[data-stability-v12]',{state:'attached'});await page.waitForFunction(()=>document.body.classList.contains('v12-ready'));}}
async function scrollStorm(page,passes=3,steps=22){await page.evaluate(async({passes,steps})=>{document.documentElement.style.scrollBehavior='auto';for(let pass=0;pass<passes;pass++)for(let step=0;step<=steps;step++){const r=pass%2===0?step/steps:1-step/steps;scrollTo(0,(document.documentElement.scrollHeight-innerHeight)*r);if(step%4===0)await new Promise(requestAnimationFrame)}},{passes,steps})}
async function browserLoad(){
  const browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:{width:1440,height:900}});
  const page=await context.newPage();
  const runtime=[];
  page.on('pageerror',e=>runtime.push(e.message));
  page.on('console',m=>{if(m.type()==='error')runtime.push(m.text())});

  await page.goto(`${base}/`,{waitUntil:'networkidle'});
  await page.waitForSelector('[data-hf-intro-video]');
  assert(await page.locator('[data-hf-intro-video]').count()===1,'HyperFrames intro missing');
  await page.locator('[data-hf-skip]').click();await page.waitForTimeout(600);
  assert(await page.locator('[data-editorial-sequence] video').count()===0,'background film returned');

  for(const vp of [{width:390,height:844},{width:1440,height:900},{width:1920,height:1080}]){
    await page.setViewportSize(vp);await page.goto(`${base}/`,{waitUntil:'networkidle'});await clear(page);await waitV12(page);
    assert(await page.locator('[data-scene]').count()===7,`home scenes @${vp.width}`);
    assert(await page.locator('#services').count()===0,`legacy Services scene returned @${vp.width}`);
    assert((await page.locator('#outcomes').getAttribute('data-scene'))==='outcomes',`static outcomes scene missing @${vp.width}`);
    assert(await page.locator('[data-v12-outcome]').count()===3,`static outcome controls missing @${vp.width}`);
    assert((await page.locator('#outcomes').textContent()).includes('Make the business obvious in seconds.'),`second scene content collapsed @${vp.width}`);
    assert((await page.locator('#plans').textContent()).includes('₹25K–₹35K+'),'homepage premium one-time tier missing');
    assert(await page.locator('.v7-browserbar').count()===1,'work browser frame missing');
    assert(await page.locator('[data-work-toggle]').count()===0,'legacy Work toggle returned');
    assert(await page.locator('.v8-work-chapters').count()===0,'duplicate Work chapters returned');
    assert(await page.locator('[data-work-stage][data-v11-stable="true"]').count()===1,'V11 Work stability marker missing');
    const hero=await page.evaluate(()=>{const c=document.querySelector('.hero__copy').getBoundingClientRect(),a=document.querySelector('.hero__actions').getBoundingClientRect(),s=document.querySelector('.hero__subject').getBoundingClientRect();return {w:innerWidth,h:innerHeight,c:{l:c.left,r:c.right,t:c.top,b:c.bottom},a:{l:a.left,r:a.right},s:{l:s.left,r:s.right,t:s.top}}});
    assert(hero.c.l>=-1&&hero.c.r<=hero.w+1&&hero.c.t>=-1&&hero.c.b<=hero.h+2,`hero copy alignment failed @${vp.width}`);
    assert(hero.a.l>=-1&&hero.a.r<=hero.w+1,`hero actions alignment failed @${vp.width}`);
    assert(hero.s.r>hero.w*.48&&hero.s.l<hero.w*.92&&hero.s.t<hero.h*.88,`hero subject alignment failed @${vp.width}`);
    await scrollStorm(page,2,18);
  }

  await page.setViewportSize({width:1440,height:900});
  await page.goto(`${base}/`,{waitUntil:'networkidle'});await clear(page);await waitV12(page);
  for(let i=0;i<90;i++){
    const keys=['clarity','enquiries','system'];
    await page.locator(`[data-v12-outcome="${keys[i%3]}"]`).click();
  }
  assert((await page.locator('#outcomes').getAttribute('data-sc-verify-state'))==='outcome:system','outcome selector lost final state');
  await page.locator('#work').scrollIntoViewIfNeeded();await page.waitForSelector('[data-v9-proof="desktop"]');
  const modes=['desktop','mobile','detail'];
  for(let i=0;i<90;i++)await page.locator(`[data-v9-proof="${modes[i%3]}"]`).click();
  assert((await page.locator('[data-work-stage]').getAttribute('data-sc-verify-state'))==='work:detail','client display lost final detail state');
  assert((await page.locator('[data-v9-proof="mobile"] img').getAttribute('src'))==='/assets/fakhrimart-case-mobile.png','client mobile proof regressed to desktop asset');
  await page.evaluate(()=>scrollBy(0,360));await page.waitForTimeout(180);
  assert((await page.locator('[data-work-stage]').getAttribute('data-sc-verify-state'))==='work:detail','manual client mode was overridden by scroll');

  await page.goto(`${base}/plans`,{waitUntil:'networkidle'});await clear(page);await waitV12(page);
  assert(await page.locator('[data-plan-scene]').count()===6,'plans scene count');
  assert(await page.locator('.build-card').count()===6,'plans card count');
  for(let i=0;i<80;i++)await page.locator(i%2?'[data-plan-mode="onetime"]':'[data-plan-mode="monthly"]').click();
  assert(await page.locator('[data-plan-mode-output] strong').innerText()==='₹17,999','pricing mode director lost final one-time state');
  await scrollStorm(page);

  await page.goto(`${base}/founder`,{waitUntil:'networkidle'});await clear(page);await waitV12(page);
  for(let i=0;i<60;i++){const choices=page.locator('[data-principle]');await choices.nth(i%3).click()}
  assert((await page.locator('[data-principle-stage]').getAttribute('data-sc-verify-state'))==='principle:use','founder principle state');
  await scrollStorm(page,2,18);

  await page.goto(`${base}/terms`,{waitUntil:'networkidle'});await waitV12(page);
  assert(await page.locator('.terms-section').count()===12,'terms section count');
  await scrollStorm(page,2,16);
  assert((await page.locator('body').textContent()).includes('₹9,999'),'terms missing one-time pricing');
  assert((await page.locator('body').evaluate(n=>getComputedStyle(n).backgroundColor))==='rgb(236, 232, 223)','terms paper design missing');

  failures.push(...runtime);await browser.close();
}
const started=performance.now();await httpLoad();await browserLoad();timings.sort((a,b)=>a-b);const q=n=>timings[Math.min(timings.length-1,Math.floor(timings.length*n))]||Infinity;const summary={httpRequests:total,concurrency,routes:routes.length,pages:4,failures:failures.length,medianMs:Math.round(q(.5)),p95Ms:Math.round(q(.95)),elapsedMs:Math.round(performance.now()-started)};console.log(JSON.stringify(summary,null,2));if(summary.p95Ms>2200)failures.push(`HTTP p95 ${summary.p95Ms}ms exceeds 2200ms`);if(failures.length){console.error(failures.slice(0,30).join('\n'));process.exit(1)}console.log('Stress test passed: static outcomes, hero geometry, FakhriMart modes, pricing and Terms stayed coherent under V12.');