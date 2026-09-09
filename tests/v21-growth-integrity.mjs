import fs from 'node:fs';

const read=file=>fs.readFileSync(file,'utf8');
const exists=file=>fs.existsSync(file);
const errors=[];
const expect=(condition,message)=>{if(!condition)errors.push(message)};

const home=read('index.html');
const plans=read('plans.html');
const founder=read('founder.html');
const us=read('us.html');
const uae=read('uae.html');
const lab=read('lab.html');
const audit=read('audit.html');
const caseStudy=read('fakhrimart.html');
const privacy=read('privacy.html');
const notFound=read('404.html');
const css=read('public/international-growth.css');
const js=read('public/international-growth.js');
const bridgeCss=read('public/v21-cinematic-bridge.css');
const bridgeJs=read('public/v21-cinematic-bridge.js');
const vite=read('vite.config.mjs');
const vercel=read('vercel.json');
const pkg=read('package.json');
const robots=read('public/robots.txt');
const sitemap=read('public/sitemap.xml');

expect(home.includes('Turn missed enquiries')&&home.includes('BRAYRO GROWTH ENGINE'),'Homepage does not lead with the growth-system positioning');
expect(home.includes('data-ig-demo')&&home.includes('data-ig-calculator'),'Homepage is missing the Growth Engine demo or opportunity calculator');
expect(home.includes('From US$1,500')&&home.includes('From US$2,500')&&home.includes('US$3K–$15K+'),'Homepage international pricing ranges are missing');
expect(home.includes('FEATURED CLIENT / FAKHRIMART')&&home.includes('Verified client work'),'FakhriMart proof is not clearly labeled as verified work');
expect(home.includes('Built in India')&&home.includes('Pune, India'),'International location honesty is missing');
expect(!home.includes('₹2,599')&&!home.includes('₹17,999'),'Retired low-ticket website pricing leaked into the primary homepage funnel');
expect(!home.includes('world-class solutions')&&!home.includes('10x your growth'),'Homepage contains generic growth hype');

for(const [file,label] of [['us.html','US'],['uae.html','UAE'],['lab.html','Lab'],['audit.html','Audit'],['fakhrimart.html','FakhriMart case study'],['privacy.html','Privacy'],['404.html','404']])expect(exists(file),`${label} page missing`);
expect(us.includes('Founder-led from Pune, India')||us.includes('founder-led from Pune, India'),'US page does not clearly disclose the operating base');
expect(us.includes('From US$1,500')&&us.includes('Book an AI Growth Audit'),'US page is missing localized pricing or audit CTA');
expect(uae.includes('WhatsApp')&&uae.includes('does not claim a Dubai office'),'UAE page is missing WhatsApp-first flow or location honesty');
expect(lab.includes('I RUN A BUSINESS')&&lab.includes('I BUILD / SELL SYSTEMS'),'Lab does not segment business and builder audiences');
expect(audit.includes('data-ig-audit-form')&&audit.includes('Likely implementation budget')&&audit.includes('Work email'),'Audit qualification flow is incomplete');
expect(caseStudy.includes('VERIFIED CLIENT WORK / FAKHRIMART')&&caseStudy.includes('Proof without invented metrics'),'Dedicated case study does not preserve proof honesty');
expect(caseStudy.includes('fakhrimart-case-desktop.png')&&caseStudy.includes('fakhrimart-case-mobile.png'),'Dedicated case study is missing real desktop/mobile evidence');
expect(privacy.includes('does not send form contents into those events')&&privacy.includes('Nothing is represented as stored in a BRAYROAI database'),'Privacy page does not describe the current implementation honestly');
expect(notFound.includes('This page missed the pipeline.')&&notFound.includes('noindex'),'404 page is missing its useful route recovery or noindex policy');

expect(plans.includes('Growth Engine')&&plans.includes('From US$1,500'),'Plans page was not migrated to the international offer architecture');
expect(!plans.includes('₹2,599')&&!plans.includes('₹17,999'),'Legacy low-ticket website plan pricing remains public on /plans');
expect(founder.includes('No fake offices')&&founder.includes('international delivery'),'Founder page does not address international trust explicitly');

for(const token of ['.ig-demo-shell','.ig-offers','.ig-os-window','.ig-calculator','.ig-audit-form','.ig-page-hero','@media (prefers-reduced-motion:reduce)'])expect(css.includes(token),`Growth CSS missing ${token}`);
for(const token of ['initGrowthDemo','initCalculator','initAuditForm','initRegionAwareLinks','initCtaTracking','brayro:analytics'])expect(js.includes(token),`Growth JS missing ${token}`);
expect(js.includes('Work email: ${workEmail}'),'Audit request runtime does not include the submitted work email');
expect(!/transition\s*:\s*all/i.test(css),'Growth CSS contains prohibited transition: all');
expect(Buffer.byteLength(css)<50000,'Growth CSS exceeds 50KB guardrail');
expect(Buffer.byteLength(js)<18000,'Growth JS exceeds 18KB guardrail');

for(const token of ['fixSceneRailLabels','class SpringSpotlights','syncDemoPulse','data-v21-cinematic-bridge'])expect(bridgeJs.includes(token)||vite.includes(token),`V21 cinematic bridge missing ${token}`);
for(const token of ['.v21-system-pulse','--v21-spot-x','@media(prefers-reduced-motion:reduce)'])expect(bridgeCss.includes(token),`V21 cinematic bridge CSS missing ${token}`);
expect(!/transition\s*:\s*all/i.test(bridgeCss),'V21 cinematic bridge must not use transition: all');
expect(Buffer.byteLength(bridgeCss)<10000,'V21 cinematic bridge CSS exceeds 10KB guardrail');
expect(Buffer.byteLength(bridgeJs)<10000,'V21 cinematic bridge JS exceeds 10KB guardrail');
expect(vite.includes('/v21-cinematic-bridge.css')&&vite.includes('/v21-cinematic-bridge.js'),'Vite does not inject the V21 cinematic bridge');
for(const scene of ['growth-engine','brayro-os','process'])expect(vite.includes(`data-scene=\"${scene}\"`),`Vite production transform does not promote ${scene} into the V20 scene director`);

for(const token of ["growthAudit:resolve(process.cwd(),'audit.html')","us:resolve(process.cwd(),'us.html')","uae:resolve(process.cwd(),'uae.html')","lab:resolve(process.cwd(),'lab.html')","fakhrimart:resolve(process.cwd(),'fakhrimart.html')","privacy:resolve(process.cwd(),'privacy.html')","notFound:resolve(process.cwd(),'404.html')"])expect(vite.includes(token),`Vite input missing ${token}`);
expect(vite.includes("audit:resolve(process.cwd(),'ai-workflow-audit.html')"),'Legacy AI Workflow Audit Vite input was not preserved');
for(const route of ['/audit','/us','/uae','/lab','/work/fakhrimart','/privacy'])expect(vercel.includes(route),`Vercel missing ${route} route`);
expect(vercel.includes('international-growth.css')&&vercel.includes('international-growth.js'),'Vercel asset cache policy missing growth assets');
expect(vercel.includes("script-src 'self'"),'Strict first-party script CSP is not preserved');

expect(pkg.includes('node --check public/international-growth.js'),'Syntax suite does not check the growth runtime');
expect(pkg.includes('node --check public/v21-cinematic-bridge.js'),'Syntax suite does not check the V21 cinematic bridge');
expect(pkg.includes('node tests/v21-growth-integrity.mjs'),'Integrity suite does not enforce V21 growth contracts');
expect(robots.includes('Sitemap: https://brayroai.vercel.app/sitemap.xml'),'robots.txt does not advertise sitemap');
for(const route of ['/audit','/us','/uae','/lab','/work/fakhrimart','/privacy'])expect(sitemap.includes(`https://brayroai.vercel.app${route}`),`Sitemap missing ${route}`);

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('V21 growth integrity OK: positioning, proof, regional routes, cinematic bridge, privacy, funnel telemetry, pricing and audit flow verified.');
