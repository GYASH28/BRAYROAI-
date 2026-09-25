import fs from 'node:fs';
const read=file=>fs.readFileSync(file,'utf8');
const errors=[];const expect=(condition,message)=>{if(!condition)errors.push(message)};
const plans=read('plans.html'),founder=read('founder.html'),terms=read('terms.html');
const audit=read('ai-workflow-audit.html'),brain=read('company-second-brain.html');
const plansJs=read('public/plans-page.js'),founderJs=read('public/founder-page.js');
const aiJs=read('public/ai-service-pages.js'),clientJs=read('public/client-work.js');
const v16=read('public/experience-motion-v16.js'),vite=read('vite.config.mjs'),loader=read('src/react-islands.js');

for(const [name,page] of [['Plans',plans],['Founder',founder]]){
  expect(!page.includes('/scrollcraft.js'),`${name} still loads ScrollCraft runtime`);
  expect(!page.includes('/motion-v5.js'),`${name} still loads V5 runtime`);
}
expect(!terms.includes('/motion-v5.js'),'Terms still loads V5 runtime');
expect(!audit.includes('data-ai-progress')&&!brain.includes('data-ai-progress'),'AI pages still render duplicate progress bars');
expect(!clientJs.includes('class Progress')&&!clientJs.includes('data-client-progress'),'Client runtime still owns duplicate global progress');
expect(plansJs.includes('class CachedPlansTimeline')&&plansJs.includes('new CachedPlansTimeline()')&&!plansJs.includes('window.ScrollCraft.mount'),'Plans does not own one cached timeline runtime');
expect(founderJs.includes('class CachedFounderTimeline')&&founderJs.includes('new CachedFounderTimeline()')&&!founderJs.includes('window.ScrollCraft.mount'),'Founder does not own one cached timeline runtime');
expect(v16.includes('hasDedicatedSceneRuntime')&&v16.includes('if(!isHome&&!hasDedicatedSceneRuntime)new SceneKinetics()'),'V16 dedicated-route ownership guard is missing');
expect(v16.includes('class SceneLifecycle')&&v16.includes('v16-document-hidden'),'V16 offscreen/document lifecycle guard is missing');
expect(vite.includes("if(!isHome&&!html.includes('src=\"/experience-motion-v16.js\"'))"),'Homepage still receives the V16 secondary runtime');
expect(loader.includes("host.closest('section')")&&loader.includes("observe('[data-react-ai-signal-island]'"),'Lazy React islands do not activate from visible section geometry');
expect(!aiJs.includes('progress.style.transform'),'AI detail runtime still paints its own progress bar');

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Runtime ownership integrity passed: one scroll owner per route, no retired secondary runtimes, and lazy/offscreen lifecycles are guarded.');
