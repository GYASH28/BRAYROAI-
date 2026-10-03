import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {chromium} from '@playwright/test';

const [base='http://127.0.0.1:4173/',folder='artifacts/performance']=process.argv.slice(2);
mkdirSync(folder,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--enable-precise-memory-info']});
const context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1,reducedMotion:'no-preference'});
await context.addInitScript(()=>{
 try{localStorage.setItem('brayro_market_manual','in')}catch{}
 window.__brayroPerf={longTasks:[],longAnimationFrames:[],intervals:[]};
 const supported=PerformanceObserver.supportedEntryTypes||[];
 if(supported.includes('longtask'))new PerformanceObserver(list=>{for(const entry of list.getEntries())window.__brayroPerf.longTasks.push({startTime:entry.startTime,duration:entry.duration,name:entry.name})}).observe({type:'longtask',buffered:true});
 if(supported.includes('long-animation-frame'))new PerformanceObserver(list=>{for(const entry of list.getEntries())window.__brayroPerf.longAnimationFrames.push({startTime:entry.startTime,duration:entry.duration,blockingDuration:entry.blockingDuration,scripts:(entry.scripts||[]).slice(0,8).map(script=>({sourceURL:script.sourceURL,sourceFunctionName:script.sourceFunctionName,duration:script.duration,forcedStyleAndLayoutDuration:script.forcedStyleAndLayoutDuration}))})}).observe({type:'long-animation-frame',buffered:true});
 window.__startFrameProbe=label=>{const probe={label,last:0,intervals:[],frame:0};const tick=time=>{if(probe.last)probe.intervals.push(time-probe.last);probe.last=time;probe.frame=requestAnimationFrame(tick)};probe.frame=requestAnimationFrame(tick);window.__frameProbe=probe};
 window.__stopFrameProbe=()=>{const probe=window.__frameProbe;if(!probe)return[];cancelAnimationFrame(probe.frame);window.__frameProbe=null;window.__brayroPerf.intervals.push({label:probe.label,intervals:probe.intervals});return probe.intervals};
});
const page=await context.newPage();
const cdp=await context.newCDPSession(page);
await cdp.send('Performance.enable');
let traceCompleteResolve;
const traceComplete=new Promise(resolve=>{traceCompleteResolve=resolve});
cdp.once('Tracing.tracingComplete',traceCompleteResolve);
await cdp.send('Tracing.start',{categories:'devtools.timeline,blink.user_timing,disabled-by-default-devtools.timeline.frame',transferMode:'ReturnAsStream'});

const summaries={};
const summarise=values=>{
 const sorted=[...values].sort((a,b)=>a-b),pick=q=>sorted.length?sorted[Math.min(sorted.length-1,Math.floor((sorted.length-1)*q))]:null;
 return {samples:sorted.length,median:pick(.5),p95:pick(.95),p99:pick(.99),above20:sorted.filter(value=>value>20).length,above33_3:sorted.filter(value=>value>33.3).length,above50:sorted.filter(value=>value>=50).length,max:sorted.at(-1)??null};
};
try{
 await page.goto(new URL('/',base).href,{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.querySelector('.hero-stage')?.dataset.openingState==='playing',undefined,{timeout:1800});
 await page.evaluate(()=>window.__startFrameProbe('opening'));
 await page.waitForFunction(()=>document.querySelector('.hero-stage')?.dataset.openingState==='settled',undefined,{timeout:5000});
 summaries.opening=summarise(await page.evaluate(()=>window.__stopFrameProbe()));

 await page.waitForFunction(()=>['ready','fallback'].includes(document.querySelector('[data-sculpture]')?.dataset.renderState),undefined,{timeout:6000});
 // Measure a warmed interaction, separately from imports and the first draw.
 await page.waitForTimeout(1200);
 await page.evaluate(()=>window.__startFrameProbe('pointer'));
 const box=await page.locator('.hero-stage').boundingBox();
 if(box){
  const points=[[.2,.45],[.42,.32],[.62,.5],[.78,.38],[.55,.64],[.3,.58],[.5,.45]];
  const started=performance.now();
  do{for(const [x,y] of points){await page.mouse.move(box.x+box.width*x,box.y+box.height*y,{steps:8});await page.waitForTimeout(70)}}while(performance.now()-started<10000);
  await page.mouse.move(2,2,{steps:5});await page.waitForTimeout(180);
 }
 summaries.pointer=summarise(await page.evaluate(()=>window.__stopFrameProbe()));

 await page.evaluate(()=>window.__startFrameProbe('scroll'));
 const progress=[0,.18,.4,.58,.66,.86,.94,1,.72,.51,.27,0];
 for(const value of progress){await page.evaluate(value=>{const section=document.querySelector('.studio-hero');scrollTo({top:section.offsetTop+(section.offsetHeight-innerHeight)*value,behavior:'instant'})},value);await page.waitForTimeout(110)}
 const workProgress=[.15,.5,.82,.34];
 for(const value of workProgress){await page.evaluate(value=>{const section=document.querySelector('#work');scrollTo({top:section.offsetTop+(section.offsetHeight-innerHeight)*value,behavior:'instant'})},value);await page.waitForTimeout(110)}
 summaries.scroll=summarise(await page.evaluate(()=>window.__stopFrameProbe()));

 const runtime=await page.evaluate(()=>{
  const canvas=document.querySelector('.sculpture-canvas'),host=document.querySelector('[data-sculpture]');
  const gl=canvas&&(canvas.getContext('webgl2')||canvas.getContext('webgl'));
  const debug=gl?.getExtension('WEBGL_debug_renderer_info');
  return {userAgent:navigator.userAgent,viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},hardwareConcurrency:navigator.hardwareConcurrency??null,deviceMemory:navigator.deviceMemory??null,webgl:gl?{renderer:debug?gl.getParameter(debug.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),vendor:debug?gl.getParameter(debug.UNMASKED_VENDOR_WEBGL):gl.getParameter(gl.VENDOR),drawingBuffer:{width:gl.drawingBufferWidth,height:gl.drawingBufferHeight},drawCalls:Number(host?.dataset.drawCalls||NaN),points:Number(host?.dataset.renderPoints||NaN),state:host?.dataset.renderState||null}:null,performance:window.__brayroPerf};
 });
 const metrics=await cdp.send('Performance.getMetrics');
 const report={capturedAt:new Date().toISOString(),url:page.url(),browser:`Chromium ${browser.version()}`,environment:'Headless Chromium lab workload in CI/local automation; not physical-device qualification.',measurementLimits:'rAF intervals measure callback scheduling, not guaranteed displayed GPU frames. Use the accompanying Chromium trace for presentation/main-thread attribution and treat physical 60/90/120Hz qualification separately.',workloads:summaries,runtime,cdpMetrics:Object.fromEntries(metrics.metrics.map(metric=>[metric.name,metric.value]))};
 writeFileSync(resolve(folder,'home-profile.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify({browser:report.browser,workloads:report.workloads,webgl:report.runtime.webgl,longTasks:report.runtime.performance.longTasks.length,longAnimationFrames:report.runtime.performance.longAnimationFrames.length},null,2));
}finally{
 await cdp.send('Tracing.end');
 const complete=await traceComplete;
 if(complete.stream){let trace='';for(;;){const chunk=await cdp.send('IO.read',{handle:complete.stream});trace+=chunk.data;if(chunk.eof)break}await cdp.send('IO.close',{handle:complete.stream});writeFileSync(resolve(folder,'home-trace.json'),trace)}
 await context.close();await browser.close();
}
