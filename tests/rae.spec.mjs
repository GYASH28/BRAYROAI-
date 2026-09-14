import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const defaultEvents=[
  ['state',{state:'thinking'}],['state',{state:'speaking'}],['delta',{text:'BRAYROAI can help with '}],['delta',{text:'websites, products and practical AI systems.'}],['meta',{quickReplies:['Show relevant work','Compare plans'],emotion:'positive'}],['done',{finishReason:'stop',emotion:'positive'}]
];

async function mockAI(page,{events=defaultEvents,delay=35,failFirst=false,status=200,errorCode='provider_unavailable',errorMessage='temporary failure'}={}){
  await page.addInitScript(({events,delay,failFirst,status,errorCode,errorMessage})=>{
    const original=window.fetch.bind(window);window.__raeApiCalls=0;
    window.fetch=async(input,init={})=>{
      const url=typeof input==='string'?input:input?.url||'';if(!url.includes('/api/rae-chat'))return original(input,init);
      window.__raeApiCalls+=1;
      if((failFirst&&window.__raeApiCalls===1)||status!==200)return new Response(JSON.stringify({error:errorMessage,code:errorCode}),{status:status===200?503:status,headers:{'Content-Type':'application/json'}});
      const encoder=new TextEncoder();let index=0,timer;
      const stream=new ReadableStream({start(controller){
        const push=()=>{if(init.signal?.aborted){try{controller.error(new DOMException('Aborted','AbortError'))}catch{}return}if(index>=events.length){controller.close();return}const [type,data]=events[index++];controller.enqueue(encoder.encode(`event: ${type}\ndata: ${JSON.stringify(data)}\n\n`));timer=setTimeout(push,delay)};push();
        init.signal?.addEventListener('abort',()=>{clearTimeout(timer);try{controller.error(new DOMException('Aborted','AbortError'))}catch{}},{once:true});
      }});
      return new Response(stream,{status:200,headers:{'Content-Type':'text/event-stream; charset=utf-8'}});
    };
  },{events,delay,failFirst,status,errorCode,errorMessage});
}

async function loadRae(page,route='/'){
  await page.goto(route,{waitUntil:'domcontentloaded'});
  await expect(page.locator('[data-rae-root]')).toHaveCount(1);
  await page.evaluate(()=>{
    const shell=document.querySelector('[data-rae-shell]');
    if(shell)shell.dispatchEvent(new PointerEvent('pointerenter',{bubbles:true,pointerType:'mouse'}));
  });
  await expect(page.locator('[data-rae-toggle]')).toHaveCount(1,{timeout:8000});
  await expect(page.locator('[data-rae-root]')).toHaveAttribute('data-rae-app-ready','true',{timeout:8000});
}
async function openRae(page,route='/'){await loadRae(page,route);await page.locator('[data-rae-toggle]').click();await expect(page.locator('[data-rae-panel]')).toHaveAttribute('aria-hidden','false')}
const serious=results=>results.violations.filter(item=>['serious','critical'].includes(item.impact));

for(const [route,pageName] of [['/','home'],['/plans','plans'],['/founder','founder'],['/terms','terms'],['/ai-workflow-audit','ai'],['/company-second-brain','ai'],['/clients','clients'],['/clients/fakhrimart','case']]){
  test(`Rae mounts once and becomes page-aware on ${route}`,async({page})=>{await loadRae(page,route);await expect(page.locator('body')).toHaveAttribute('data-rae-page',pageName);await expect(page.locator('[data-rae-toggle]')).toHaveAttribute('aria-label','Chat with Rae, BRAYROAI AI assistant')});
}

test('free-text conversation uses the real streaming transport and renders progressively',async({page})=>{
  await mockAI(page,{delay:450});await openRae(page,'/');await page.locator('[data-rae-input]').fill('What can BRAYROAI build for my company?');await page.locator('[data-rae-form]').press('Enter');await expect(page.locator('[data-rae-root]')).toHaveAttribute('data-rae-state','thinking');
  const reply=page.locator('.rae-message[data-who="rae"] .rae-message__bubble').last();
  await expect(reply).toContainText('BRAYROAI can help with');expect(await reply.textContent()).not.toContain('practical AI systems.');await expect(reply).toContainText('practical AI systems.',{timeout:3000});await expect(page.locator('[data-rae-stop]')).toBeHidden();expect(await page.evaluate(()=>window.__raeApiCalls)).toBe(1);
});

test('Rae can stop an in-flight streamed answer immediately',async({page})=>{
  const events=[['state',{state:'thinking'}],['delta',{text:'First useful thought. '}],['delta',{text:'This should never arrive after stop.'}],['done',{finishReason:'stop'}]];await mockAI(page,{events,delay:1500});await openRae(page,'/');await page.locator('[data-rae-input]').fill('Think through my project');await page.locator('[data-rae-form]').press('Enter');await expect(page.locator('[data-rae-feed]')).toContainText('First useful thought.');await page.locator('[data-rae-stop]').click();await expect(page.locator('[data-rae-feed]')).toContainText('Stopped');await page.waitForTimeout(1750);await expect(page.locator('[data-rae-feed]')).not.toContainText('never arrive after stop');
});

test('Rae retries after provider failure without losing the transcript',async({page})=>{
  await mockAI(page,{failFirst:true,delay:20});await openRae(page,'/');await page.locator('[data-rae-input]').fill('Help me choose what to build');await page.locator('[data-rae-form]').press('Enter');await expect(page.locator('[data-rae-feed]')).toContainText('lost the connection');await page.locator('[data-rae-retry]').click();await expect(page.locator('[data-rae-feed]')).toContainText('websites, products and practical AI systems.');expect(await page.evaluate(()=>window.__raeApiCalls)).toBe(2);
});

test('Clear chat removes Rae transcript, profile memory and retry state',async({page})=>{
  await mockAI(page,{delay:15});await openRae(page,'/');const prompt='I run a bakery business and need more booking leads within 3 weeks for ₹20,000';await page.locator('[data-rae-input]').fill(prompt);await page.locator('[data-rae-form]').press('Enter');await expect(page.locator('[data-rae-feed]')).toContainText('practical AI systems.');await expect.poll(async()=>page.evaluate(()=>window.__BRAYRO_RAE__?.session.history().length||0)).toBeGreaterThanOrEqual(2);await page.locator('[data-rae-clear]').click();await expect(page.locator('[data-rae-feed]')).not.toContainText(prompt);await expect(page.locator('[data-rae-feed]')).toContainText('Ask me the useful version.');const state=await page.evaluate(()=>({history:window.__BRAYRO_RAE__.session.history(),snapshot:window.__BRAYRO_RAE__.session.snapshot(),lastPrompt:window.__BRAYRO_RAE__.lastPrompt,lastRequest:window.__BRAYRO_RAE__.client.lastRequest}));expect(state.history).toEqual([]);expect(state.snapshot.summary).toBe('');expect(state.snapshot.profile).toEqual({});expect(state.snapshot.recentAction).toBe('');expect(state.lastPrompt).toBe('');expect(state.lastRequest).toBeNull();
});

test('server metadata can render verified case UI and safe allowlisted actions',async({page})=>{
  const events=[['delta',{text:'FakhriMart is the clearest verified client example.'}],['meta',{card:{type:'case',eyebrow:'VERIFIED CLIENT WORK',title:'FakhriMart',copy:'A catalogue-led craft experience.',action:{name:'openProject',args:{name:'fakhrimart'},label:'View case study'}},quickReplies:['Can you build something similar?'],emotion:'positive'}],['done',{finishReason:'stop'}]];await mockAI(page,{events});await openRae(page,'/clients');await page.locator('[data-rae-input]').fill('Tell me about FakhriMart');await page.locator('[data-rae-form]').press('Enter');await expect(page.locator('.rae-card--case')).toContainText('FakhriMart');await expect(page.locator('[data-rae-action="openProject"]')).toHaveCount(1);
});

test('project handoff is editable and never auto-opens WhatsApp',async({page})=>{
  const events=[['delta',{text:'That sounds like real project intent. I would keep the next step small.'}],['meta',{card:{type:'project',eyebrow:'PROJECT HANDOFF',title:'A useful starting brief',copy:'Edit this before continuing.',brief:'Project: Redesign my restaurant booking journey'},emotion:'curious'}],['done',{finishReason:'stop'}]];await mockAI(page,{events});await openRae(page,'/');let opened=0;await page.exposeFunction('__opened',()=>{opened+=1});await page.evaluate(()=>{window.open=(...args)=>{window.__opened(args[0]);return null}});await page.locator('[data-rae-input]').fill('I want to start a project for my restaurant');await page.locator('[data-rae-form]').press('Enter');await expect(page.locator('.rae-card--project')).toBeVisible();expect(opened).toBe(0);await page.locator('.rae-card__brief').fill('Project: Better restaurant booking experience');await page.locator('.rae-card__cta').click();await expect.poll(()=>opened).toBe(1);
});

test('model HTML is rendered as inert text, never executable markup',async({page})=>{
  const events=[['delta',{text:'<script>window.__raeXss=1</script><img src=x onerror=alert(1)> safe text'}],['done',{finishReason:'stop'}]];await mockAI(page,{events});await openRae(page,'/');await page.locator('[data-rae-input]').fill('test safety');await page.locator('[data-rae-form]').press('Enter');await expect(page.locator('[data-rae-feed]')).toContainText('<script>window.__raeXss=1</script>');expect(await page.locator('[data-rae-feed] script').count()).toBe(0);expect(await page.locator('[data-rae-feed] img').count()).toBe(0);expect(await page.evaluate(()=>window.__raeXss||0)).toBe(0);
});

test('keyboard open/close restores focus and Escape works',async({page})=>{
  await mockAI(page);await loadRae(page,'/plans');await page.locator('[data-rae-toggle]').focus();await page.keyboard.press('Enter');await expect(page.locator('[data-rae-panel]')).toHaveAttribute('aria-hidden','false');await expect(page.locator('[data-rae-input]')).toBeFocused();await page.keyboard.press('Escape');await expect(page.locator('[data-rae-panel]')).toHaveAttribute('aria-hidden','true');await expect(page.locator('[data-rae-toggle]')).toBeFocused();
});

test('all Rae V3 emotional states are addressable without breaking the rig',async({page})=>{
  await loadRae(page,'/');const states=['idle','attention','opening','listening','thinking','speaking','positive','curious','confused','surprised','playful','proud','shy','skeptical','laughing','wink','error','offline','celebrate','sleep'];
  for(const state of states){await page.evaluate(value=>window.__BRAYRO_RAE__.director.setState(value),state);await expect(page.locator('[data-rae-root]')).toHaveAttribute('data-rae-state',state);await expect(page.locator('.rae-character[data-rae-rig="v3"]').first()).toHaveAttribute('data-state',state)}
});

test('Rae has no serious accessibility violations while open',async({page,browserName})=>{
  test.skip(browserName!=='chromium','Axe audit runs once in Chromium');await mockAI(page);await openRae(page,'/plans');const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();expect(serious(results)).toEqual([]);
});

for(const width of [320,390,768,1440,1920])test(`Rae has no horizontal overflow and remains usable at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:width<500?844:900});await mockAI(page);await openRae(page,'/');const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);expect(overflow).toBeLessThanOrEqual(1);const panel=await page.locator('[data-rae-panel]').boundingBox();expect(panel).not.toBeNull();expect(panel.x).toBeGreaterThanOrEqual(-1);expect(panel.x+panel.width).toBeLessThanOrEqual(width+1);if(width<=700){expect(panel.x).toBeLessThanOrEqual(1);expect(panel.width).toBeGreaterThanOrEqual(width-2)}await expect(page.locator('[data-rae-input]')).toBeVisible();await expect(page.locator('[data-rae-close]')).toBeVisible();
});

test('Rae respects reduced motion while all chat functionality remains',async({browser})=>{
  const context=await browser.newContext({reducedMotion:'reduce',viewport:{width:1280,height:800}}),page=await context.newPage();await mockAI(page);await openRae(page,'/terms');const animation=await page.locator('.rae-character__body').first().evaluate(node=>getComputedStyle(node).animationName);expect(animation).toBe('none');await page.locator('[data-rae-input]').fill('Explain this page');await page.locator('[data-rae-form]').press('Enter');await expect(page.locator('[data-rae-feed]')).toContainText('BRAYROAI can help with');await context.close();
});

test('Rae reserves real space above the WhatsApp and email contact dock and owns the corner while open',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await loadRae(page,'/');const dock=page.locator('.brayro-contact-dock');await expect(dock).toBeVisible();await expect(dock.locator('.brayro-contact-dock__whatsapp')).toHaveCount(1);await expect(dock.locator('.brayro-contact-dock__email')).toHaveCount(1);
  await expect.poll(async()=>{const raeBox=await page.locator('[data-rae-toggle]').boundingBox(),dockBox=await dock.boundingBox();return raeBox&&dockBox?Math.round(dockBox.y-(raeBox.y+raeBox.height)):-999},{timeout:3000}).toBeGreaterThanOrEqual(10);
  await page.locator('[data-rae-toggle]').click();await expect(page.locator('body')).toHaveClass(/rae-conversation-open/);await expect(dock).toHaveCSS('pointer-events','none');await expect(dock).toHaveCSS('opacity','0');await page.locator('[data-rae-close]').click();await expect(page.locator('body')).not.toHaveClass(/rae-conversation-open/);await expect.poll(async()=>parseFloat(await dock.evaluate(node=>getComputedStyle(node).opacity))).toBeGreaterThan(.9);
  await expect.poll(async()=>{const raeBox=await page.locator('[data-rae-toggle]').boundingBox(),dockBox=await dock.boundingBox();return raeBox&&dockBox?Math.round(dockBox.y-(raeBox.y+raeBox.height)):-999},{timeout:3000}).toBeGreaterThanOrEqual(10);
});

test('launcher dynamically lifts above another fixed bottom-right control',async({page})=>{
  await loadRae(page,'/');await page.evaluate(()=>{const fake=document.createElement('button');fake.id='collision-probe';fake.textContent='fixed';Object.assign(fake.style,{position:'fixed',right:'12px',bottom:'12px',width:'72px',height:'72px',zIndex:'99999'});document.body.append(fake);dispatchEvent(new Event('resize'))});await page.waitForTimeout(250);const lift=await page.locator('[data-rae-root]').evaluate(node=>parseFloat(getComputedStyle(node).getPropertyValue('--rae-collision-lift'))||0);expect(lift).toBeGreaterThan(0);
});

test('provider unavailable leaves Rae as an honest deterministic site guide',async({page})=>{
  await mockAI(page,{status:503,errorCode:'provider_not_configured',errorMessage:'Rae AI is not configured on this deployment.'});await openRae(page,'/');await page.locator('[data-rae-input]').fill('Can you advise me?');await page.locator('[data-rae-form]').press('Enter');await expect(page.locator('[data-rae-feed]')).toContainText('not configured');await expect(page.locator('[data-rae-suggestions]')).toContainText('Show plans');await expect(page.locator('[data-rae-root]')).toHaveAttribute('data-rae-state','offline');
});