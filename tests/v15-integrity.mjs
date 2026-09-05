import fs from 'node:fs';

const read=file=>fs.readFileSync(file,'utf8');
const errors=[];
const expect=(condition,message)=>{if(!condition)errors.push(message)};

const vite=read('vite.config.mjs');
const v15js=read('public/brayro-v15.js');
const v15css=read('public/brayro-v15.css');
const serviceJs=read('public/ai-service-pages.js');
const serviceCss=read('public/ai-service-pages.css');
const audit=read('ai-workflow-audit.html');
const brain=read('company-second-brain.html');
const plansJs=read('public/plans-page.js');
const vercel=read('vercel.json');

for(const token of ['class PlayfulCapabilities','PLAYGROUND 02','data-v15-control','MOVE / HOVER / CLICK','ON MOBILE: TAP OR SWIPE'])expect(v15js.includes(token),`V15 playful scene missing ${token}`);
for(const token of ['#services.play-scene','.play-scene__cursor','.play-scene__ticker','.play-scene__controls','@media(prefers-reduced-motion:reduce)'])expect(v15css.includes(token),`V15 CSS missing ${token}`);
expect(!v15js.includes('CAPABILITY FILM'),'V15 must not restore the retired cinematic capability film');
expect(!/shader|neural|robot imagery/i.test(v15css),'V15 visual layer must avoid generic AI visual language');

for(const token of ['AI WORKFLOW AUDIT / ₹9,999','Five steps.','Workflow map','Opportunity shortlist','Priority matrix','30-minute review'])expect(audit.includes(token),`Audit page missing ${token}`);
for(const token of ['COMPANY SECOND BRAIN / FROM ₹29,999','APPROVED SOURCES','KNOWLEDGE LAYER','BASE SCOPE VS EXPANDED SCOPE','14 days of launch support','Knowledge Care'])expect(brain.includes(token),`Second Brain page missing ${token}`);
expect(audit.includes('/company-second-brain')&&brain.includes('/ai-workflow-audit'),'AI detail pages are not cross-linked');
expect(audit.includes('/ai-service-pages.css')&&brain.includes('/ai-service-pages.css'),'AI detail pages missing shared CSS');
expect(audit.includes('/ai-service-pages.js')&&brain.includes('/ai-service-pages.js'),'AI detail pages missing shared runtime');
for(const token of ['class ProcessLab','class ArchitectureLab','class FAQAccordion'])expect(serviceJs.includes(token),`AI service runtime missing ${token}`);
for(const token of ['.process-lab','.architecture','.scope-table','.faq','.ai-cta'])expect(serviceCss.includes(token),`AI service CSS missing ${token}`);

expect(vite.includes("audit:resolve(process.cwd(),'ai-workflow-audit.html')"),'Vite input missing audit page');
expect(vite.includes("secondBrain:resolve(process.cwd(),'company-second-brain.html')"),'Vite input missing Second Brain page');
expect(vite.includes('/brayro-v15.css')&&vite.includes('/brayro-v15.js'),'Homepage V15 assets are not mounted');
expect(vercel.includes('/ai-workflow-audit')&&vercel.includes('/company-second-brain'),'Vercel routes missing AI detail pages');
expect(plansJs.includes("href:'/ai-workflow-audit'")&&plansJs.includes("href:'/company-second-brain'"),'Plans page does not expose AI detail links');
expect(v15js.includes("href:'/ai-workflow-audit'")&&v15js.includes("href:'/company-second-brain'"),'Homepage AI offers do not expose detail links');

expect(Buffer.byteLength(v15js)<18000,'V15 JS exceeds 18KB guardrail');
expect(Buffer.byteLength(v15css)<18000,'V15 CSS exceeds 18KB guardrail');
expect(Buffer.byteLength(serviceJs)<12000,'AI service JS exceeds 12KB guardrail');
expect(Buffer.byteLength(serviceCss)<26000,'AI service CSS exceeds 26KB guardrail');

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('V15 integrity OK: two detailed AI pages, production routing, service detail links and playful second scene verified.');