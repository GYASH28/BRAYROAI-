import { chromium } from '@playwright/test';

const base=process.env.BASE_URL||'http://127.0.0.1:4173';
const concurrency=Number(process.env.STRESS_CONCURRENCY||28);
const total=Number(process.env.STRESS_REQUESTS||800);
const routes=[
  '/','/plans','/founder','/terms','/privacy','/audit','/us','/uae','/lab','/work/fakhrimart',
  '/ai-workflow-audit','/company-second-brain',
  '/international-growth.css','/international-growth.js','/v21-cinematic-bridge.css','/v21-cinematic-bridge.js',
  '/brayro-v12.css','/brayro-v12.js','/brayro-v14.css','/brayro-v14.js','/brayro-v15.css','/brayro-v15.js',
  '/experience-motion-v16.css','/experience-motion-v16.js','/cinematic-v18.css','/cinematic-v18.js','/cinematic-v20.css','/cinematic-v20.js',
  '/ai-service-pages.css','/ai-service-pages.js','/assets/hero-background.webp','/assets/yash-cutout.webp','/assets/about-yash.webp',
  '/assets/fakhrimart-case-desktop.png','/assets/fakhrimart-case-mobile.png','/assets/brayroai-cinematic-opening.mp4'
];
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
    document.body.classList.remove('polish-opening','hf-intro-active','is-opening');
  });
}

async function waitHome(page){
  await page.waitForSelector('[data-ig-demo]');
  await page.waitForFunction(()=>document.body.classList.contains('home-v20'));
  await page.waitForFunction(()=>document.documentElement.dataset.v21CinematicBridge==='true');
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

async function noOverflow(page,label){
  const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
  assert(overflow<=2,`${label}: horizontal overflow ${overflow}px`);
}

async function browserLoad(){
  const browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:{width:1440,height:900}});
  const page=await context.newPage();
  const runtime=[];
  page.on('pageerror',error=>runtime.push(error.message));
  page.on('console',message=>{if(message.type()==='error')runtime.push(message.text())});

  for(const viewport of [{width:390,height:844},{width:1440,height:900},{width:1920,height:1080}]){
    await page.setViewportSize(viewport);
    await page.goto(`${base}/`,{waitUntil:'networkidle'});
    await clear(page);
    await waitHome(page);

    assert(await page.locator('[data-scene]').count()===8,`eight V21 cinematic scenes @${viewport.width}`);
    for(const scene of ['hero','growth-services','growth-engine','brayro-os','work','process','founder','contact']){
      assert(await page.locator(`[data-scene="${scene}"]`).count()===1,`${scene} scene missing @${viewport.width}`);
    }
    assert(await page.locator('#services').getAttribute('data-scene')==='growth-services',`V21 solutions scene identity regressed @${viewport.width}`);
    assert(await page.locator('#services').getAttribute('data-v15-play')===null,`V15 capability runtime hijacked V21 @${viewport.width}`);
    assert(await page.locator('[data-v20-lens]').count()===1,`V20 hero lens missing @${viewport.width}`);
    assert(await page.locator('#services [data-v20-signal]').count()===1,`V21 solution signal missing @${viewport.width}`);
    assert(await page.locator('[data-v20-scene-rail]').count()===1,`scene rail missing @${viewport.width}`);
    assert(await page.locator('[data-v20-rail-dot]').count()===8,`scene rail dot count @${viewport.width}`);
    assert(await page.locator('[data-ig-demo] .v21-system-pulse').count()===1,`Growth Engine pulse missing @${viewport.width}`);
    assert(await page.locator('[data-v12-project]').count()===3,`project index incomplete @${viewport.width}`);
    assert((await page.locator('#services').textContent()).includes('BRAYRO GROWTH ENGINE'),`Growth Engine offer missing @${viewport.width}`);
    assert(!(await page.locator('body').textContent()).includes('₹2,599'),`retired low-ticket pricing returned @${viewport.width}`);
    await noOverflow(page,`home@${viewport.width}`);
    await scrollStorm(page,2,18);
    assert(await page.locator('[data-v20-scene-rail]').count()===1,`scene rail DOM changed after scroll storm @${viewport.width}`);
  }

  await page.setViewportSize({width:1440,height:900});
  await page.goto(`${base}/`,{waitUntil:'networkidle'});
  await clear(page);
  await waitHome(page);

  const demo=page.locator('[data-ig-demo]');
  await demo.scrollIntoViewIfNeeded();
  for(let i=0;i<5;i++)await page.locator('[data-ig-next]').click();
  assert((await page.locator('[data-ig-progress]').textContent()).includes('STEP 06'),'Growth Engine demo lost final state');
  assert(await page.locator('[data-ig-event].is-active').count()===6,'Growth Engine timeline incomplete');
  await page.locator('[data-ig-scenario]').selectOption('consulting');
  assert((await page.locator('[data-ig-lead-name]').textContent()).includes('Daniel'),'Growth Engine scenario switch failed');

  const calculator=page.locator('[data-ig-calculator]');
  await calculator.scrollIntoViewIfNeeded();
  await page.locator('[name="monthlyLeads"]').fill('100');
  await page.locator('[name="leadValue"]').fill('2000');
  assert((await page.locator('[data-ig-revenue-opportunity]').textContent()).includes('$10,000'),'Opportunity calculator regressed');

  await page.locator('#work').scrollIntoViewIfNeeded();
  const workToggle=page.locator('[data-work-toggle]');
  if(await workToggle.count()){
    await workToggle.click();
    assert((await page.locator('[data-work-stage]').getAttribute('data-sc-verify-state'))==='work:mobile','client proof toggle failed');
    assert((await page.locator('.work__mobile img').getAttribute('src'))==='/assets/fakhrimart-case-mobile.png','client mobile proof regressed');
  }

  await page.goto(`${base}/audit`,{waitUntil:'networkidle'});
  await page.getByRole('button',{name:'Faster follow-up'}).click();
  await page.locator('[data-ig-audit-next]').click();
  await page.locator('#audit-name').fill('Load Test');
  await page.locator('#audit-email').fill('load@example.com');
  await page.locator('#audit-company').fill('BRAYRO QA');
  await page.locator('#audit-region').selectOption('United States');
  await page.locator('#audit-budget').selectOption('US$3,000–$7,500');
  await page.locator('[data-ig-audit-next]').click();
  await page.locator('#audit-notes').fill('Stress-test qualification journey.');
  await page.locator('[data-ig-audit-next]').click();
  await page.locator('[data-ig-audit-next]').click();
  assert((await page.locator('[data-ig-audit-summary]').textContent()).includes('Faster follow-up'),'Growth Audit preparation failed');
  assert((await page.locator('[data-ig-audit-whatsapp]').getAttribute('href')).includes('wa.me/919175524637'),'Growth Audit WhatsApp route failed');

  await page.goto(`${base}/plans`,{waitUntil:'networkidle'});
  await clear(page);
  const planText=await page.locator('main').textContent();
  assert(planText.includes('Pay for a connected outcome'),'V21 plans hero missing');
  assert(planText.includes('From US$1,500'),'Growth Engine pricing missing');
  assert(planText.includes('From US$2,500'),'AI Operations pricing missing');
  assert(!planText.includes('₹2,599'),'retired low-ticket plan leaked into V21');
  await noOverflow(page,'plans');

  await page.goto(`${base}/us`,{waitUntil:'networkidle'});
  const usText=await page.locator('main').textContent();
  assert(usText.includes('Pune, India'),'US location disclosure missing');
  assert(usText.includes('From US$1,500'),'US pricing missing');

  await page.goto(`${base}/uae`,{waitUntil:'networkidle'});
  const uaeText=await page.locator('main').textContent();
  assert(uaeText.includes('does not claim a Dubai office'),'UAE location honesty missing');
  assert(uaeText.includes('WhatsApp'),'UAE WhatsApp funnel missing');

  await page.goto(`${base}/work/fakhrimart`,{waitUntil:'networkidle'});
  const caseText=await page.locator('main').textContent();
  assert(caseText.includes('Proof without invented metrics'),'Case-study truth guard missing');
  assert(await page.locator('img[src="/assets/fakhrimart-case-desktop.png"]').count()===1,'Case desktop proof missing');
  assert(await page.locator('img[src="/assets/fakhrimart-case-mobile.png"]').count()===1,'Case mobile proof missing');

  // Legacy detail products remain available as explicitly preserved routes.
  await page.goto(`${base}/ai-workflow-audit`,{waitUntil:'networkidle'});
  assert(await page.locator('body.ai-detail--audit').count()===1,'Legacy AI Workflow Audit route missing');
  assert(await page.locator('[data-process-lab]').count()===1,'Legacy AI Workflow Audit lab missing');
  assert(await page.locator('[data-process-tab]').count()===5,'Legacy audit process incomplete');
  await page.locator('[data-process-tab]').last().click();

  await page.goto(`${base}/company-second-brain`,{waitUntil:'networkidle'});
  assert(await page.locator('body.ai-detail--brain').count()===1,'Legacy Second Brain route missing');
  assert(await page.locator('[data-architecture]').count()===1,'Legacy Second Brain architecture missing');
  assert(await page.locator('[data-arch-node]').count()===5,'Second Brain architecture sources incomplete');
  await page.locator('[data-arch-node="whatsapp"]').click();
  assert((await page.locator('[data-arch-status]').textContent()).includes('WhatsApp'),'Second Brain integration interaction failed');

  await page.goto(`${base}/privacy`,{waitUntil:'networkidle'});
  assert((await page.locator('main').textContent()).includes('does not send form contents'),'Privacy implementation statement missing');

  failures.push(...runtime);
  await browser.close();
}

const started=performance.now();
await httpLoad();
await browserLoad();
timings.sort((a,b)=>a-b);
const q=n=>timings[Math.min(timings.length-1,Math.floor(timings.length*n))]||Infinity;
const summary={httpRequests:total,concurrency,routes:routes.length,pages:10,failures:failures.length,medianMs:Math.round(q(.5)),p95Ms:Math.round(q(.95)),elapsedMs:Math.round(performance.now()-started)};
console.log(JSON.stringify(summary,null,2));
if(summary.p95Ms>2200)failures.push(`HTTP p95 ${summary.p95Ms}ms exceeds 2200ms`);
if(failures.length){console.error(failures.slice(0,30).join('\n'));process.exit(1)}
console.log('Stress test passed: V21 growth, audit, regional, proof and cinematic journeys stayed coherent under load while legacy AI detail routes remained available.');
