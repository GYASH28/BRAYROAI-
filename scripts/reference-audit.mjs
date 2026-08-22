import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const target = process.env.REFERENCE_URL || 'https://zexvro.in/';
const outDir = process.env.REFERENCE_OUT || 'artifacts/reference-zexvro';
const viewports = [
  ['1920x1080',1920,1080],
  ['1440x900',1440,900],
  ['1280x800',1280,800],
  ['768x1024',768,1024],
  ['430x932',430,932],
  ['390x844',390,844],
  ['360x800',360,800]
];
const progressStops=[0,.1,.2,.3,.4,.5,.6,.7,.8,.9,1];
await fs.mkdir(outDir,{recursive:true});

const browser=await chromium.launch({headless:true});
const report={
  target,
  capturedAt:new Date().toISOString(),
  philosophy:'Reference quality study only. No source, assets, graphics, wording, or exact motion are copied.',
  viewports:[],
  interaction:{}
};

const clean=s=>String(s||'').replace(/\s+/g,' ').trim();

for(const [name,width,height] of viewports){
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'no-preference'});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(String(error)));
  page.on('console',msg=>{ if(msg.type()==='error') errors.push(`console: ${msg.text()}`); });
  await page.goto(target,{waitUntil:'domcontentloaded',timeout:45_000});
  await page.waitForTimeout(1800);
  const metrics=await page.evaluate(()=>({
    title:document.title,
    scrollHeight:document.documentElement.scrollHeight,
    clientHeight:document.documentElement.clientHeight,
    clientWidth:document.documentElement.clientWidth,
    bodyText:document.body.innerText.slice(0,9000),
    links:[...document.querySelectorAll('a')].slice(0,80).map(a=>({text:(a.textContent||'').trim(),href:a.href})),
    positioned:[...document.querySelectorAll('body *')].filter(el=>{const p=getComputedStyle(el).position;return p==='fixed'||p==='sticky'}).slice(0,80).map(el=>({tag:el.tagName.toLowerCase(),cls:el.className?.toString?.().slice(0,120)||'',position:getComputedStyle(el).position,top:getComputedStyle(el).top,bottom:getComputedStyle(el).bottom})),
    typography:[...document.querySelectorAll('h1,h2,h3,p')].slice(0,35).map(el=>{const s=getComputedStyle(el);return{tag:el.tagName.toLowerCase(),text:(el.textContent||'').trim().slice(0,180),fontSize:s.fontSize,lineHeight:s.lineHeight,fontFamily:s.fontFamily,maxWidth:s.maxWidth}})
  }));
  const maxScroll=Math.max(0,metrics.scrollHeight-height);
  const states=[];
  for(const stop of progressStops){
    await page.evaluate(y=>window.scrollTo(0,y),Math.round(maxScroll*stop));
    await page.waitForTimeout(240);
    const state=await page.evaluate(()=>{
      const cx=innerWidth/2,cy=innerHeight/2;
      const centre=document.elementFromPoint(cx,cy);
      const visible=[...document.querySelectorAll('h1,h2,h3,p,button,a')].filter(el=>{const r=el.getBoundingClientRect();const s=getComputedStyle(el);return r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth&&s.visibility!=='hidden'&&s.display!=='none'&&Number(s.opacity)!==0}).slice(0,35);
      return{
        scrollY:window.scrollY,
        centre:centre?{tag:centre.tagName.toLowerCase(),cls:centre.className?.toString?.().slice(0,100)||''}:null,
        visibleText:visible.map(el=>(el.textContent||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,20),
        bodyBackground:getComputedStyle(document.body).backgroundColor
      };
    });
    states.push({progress:stop,...state});
    await page.screenshot({path:path.join(outDir,`${name}-${String(Math.round(stop*100)).padStart(3,'0')}.png`),fullPage:false});
  }
  report.viewports.push({name,width,height,metrics:{...metrics,bodyText:clean(metrics.bodyText)},states,errors});
  await context.close();
}

// Interaction pass: navigation, hover, keyboard, fast/reverse scroll, and mobile touch-size inventory.
{
  const context=await browser.newContext({viewport:{width:1440,height:900}});
  const page=await context.newPage();
  await page.goto(target,{waitUntil:'domcontentloaded',timeout:45_000});
  await page.waitForTimeout(1600);
  report.interaction.desktop=await page.evaluate(()=>({
    nav:[...document.querySelectorAll('nav a,header a')].map(a=>({text:(a.textContent||'').replace(/\s+/g,' ').trim(),href:a.href})).filter(x=>x.text).slice(0,30),
    buttons:[...document.querySelectorAll('button,a')].map(el=>({text:(el.textContent||'').replace(/\s+/g,' ').trim(),tag:el.tagName.toLowerCase()})).filter(x=>x.text).slice(0,45)
  }));
  const interactive=page.locator('a,button').filter({visible:true});
  if(await interactive.count()){
    await interactive.first().hover().catch(()=>{});
    report.interaction.desktop.firstHover=await interactive.first().evaluate(el=>{const s=getComputedStyle(el);return{transform:s.transform,color:s.color,background:s.backgroundColor}}).catch(()=>null);
  }
  await page.keyboard.press('Tab');
  report.interaction.desktop.firstTab=await page.evaluate(()=>({tag:document.activeElement?.tagName?.toLowerCase(),text:(document.activeElement?.textContent||'').replace(/\s+/g,' ').trim(),outline:getComputedStyle(document.activeElement).outline}));
  const max=await page.evaluate(()=>document.documentElement.scrollHeight-innerHeight);
  await page.evaluate(y=>window.scrollTo(0,y),max*.78); await page.waitForTimeout(140);
  await page.evaluate(y=>window.scrollTo(0,y),max*.34); await page.waitForTimeout(140);
  report.interaction.desktop.reverseScroll=await page.evaluate(()=>({scrollY:window.scrollY,activeText:[...document.querySelectorAll('h1,h2,h3')].filter(el=>{const r=el.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight}).map(el=>(el.textContent||'').replace(/\s+/g,' ').trim()).slice(0,8)}));
  await context.close();
}
{
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  const page=await context.newPage();
  await page.goto(target,{waitUntil:'domcontentloaded',timeout:45_000}); await page.waitForTimeout(1300);
  report.interaction.mobile=await page.evaluate(()=>({
    overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
    targets:[...document.querySelectorAll('a,button')].map(el=>{const r=el.getBoundingClientRect();return{text:(el.textContent||'').replace(/\s+/g,' ').trim().slice(0,80),w:Math.round(r.width),h:Math.round(r.height)}}).filter(x=>x.text).slice(0,45)
  }));
  await context.close();
}

await fs.writeFile(path.join(outDir,'report.json'),JSON.stringify(report,null,2));
const summary=[
  '# ZEXVRO reference audit',
  '',
  `Target: ${target}`,
  `Captured: ${report.capturedAt}`,
  '',
  '## Rules',
  '- Study pacing, restraint, hierarchy, negative space, transition continuity, and responsive simplification.',
  '- Do not copy source, assets, wording, brand, section structure, or exact animation.',
  '',
  '## Observed content density by viewport',
  ...report.viewports.map(v=>`- ${v.name}: ${v.metrics.scrollHeight}px document height; ${v.metrics.positioned.length} fixed/sticky elements sampled; ${v.states.length} timeline captures.`),
  '',
  '## Interaction',
  `- Mobile accidental overflow observed: ${report.interaction.mobile?.overflow ?? 'n/a'}px`,
  `- Desktop nav/header links sampled: ${report.interaction.desktop?.nav?.length ?? 0}`,
  '- Full evidence lives in report.json and captured screenshots.'
].join('\n');
await fs.writeFile(path.join(outDir,'SUMMARY.md'),summary);
await browser.close();
console.log(`Reference audit complete: ${report.viewports.length} viewports × ${progressStops.length} timeline states.`);
