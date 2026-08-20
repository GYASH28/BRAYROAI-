import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const exists=file=>fs.existsSync(path.join(root,file));
const html=read('index.html');
const criticalCss=read('public/styles.css');
const experience=read('public/experience.css');
const fixes=read('public/site-fixes.css');
const js=read('public/app.js');
const vite=read('vite.config.mjs');
const vercel=read('vercel.json');
const lighthouse=read('tests/lighthouse-budget.mjs');
const context=read('BRAYROAI_PROJECT_CONTEXT.md');
const errors=[];
const expect=(condition,message)=>{if(!condition)errors.push(message)};

// Frozen opening sequence and hero contract.
for(const locked of [
  '<div aria-hidden="true" class="intro-loader" data-loader="">',
  'BRAYROAI / CREATIVE TECHNOLOGY STUDIO',
  'Digital, designed<br/><em>to feel different.</em>',
  'BRAYROAI builds premium websites, digital experiences, and AI-powered systems for modern brands.',
  'SCROLL TO SHAPE THE STORY',
  '/assets/hero-background.webp',
  '/assets/yash-cutout.webp'
])expect(html.includes(locked),`locked opening contract changed: ${locked}`);
expect(js.includes('class LockedHeroController'),'locked hero controller missing');
expect(js.includes('},920)'),'locked loader timing changed');
expect(js.includes('this.px*34*depth')&&js.includes('scrollP*86*depth'),'locked hero depth behavior changed');
expect(criticalCss.includes('/* HERO V3 — visual contract frozen. */'),'frozen hero CSS marker missing');
for(const token of [
  "font:800 clamp(72px,8.8vw,148px)/.78 'Space Grotesk'",
  'filter:saturate(.86) contrast(1.06) brightness(.63)',
  'width:clamp(860px,72vw,1200px)',
  'left:59%;bottom:-5%',
  'font-size:12.1vw',
  'font-size:11.7vw',
  'padding-top:30.5vh',
  'font-size:clamp(36px,10.7vw,52px)'
])expect(criticalCss.includes(token),`locked hero visual token changed: ${token}`);
expect(Buffer.byteLength(criticalCss,'utf8')<24000,'critical styles.css grew above 24KB');

// Connection-only report is complete and does not expose secrets.
expect(context.includes('GitHub account: `GYASH28`')&&context.includes('Vercel project: `brayroai`'),'connection report is incomplete');
expect(context.includes('Environment variables: None configured'),'Vercel environment-name result is missing');
expect(!/(?:token|password|secret|api[_-]?key)\s*[:=]\s*\S+/i.test(context),'connection report appears to contain a secret value');

// Seven semantic chapters in the required narrative order.
const requiredOrder=['starting-point','difference','services','work','plans','studio','contact'];
const positions=requiredOrder.map(id=>html.indexOf(`id="${id}"`));
requiredOrder.forEach((id,index)=>expect(positions[index]>=0,`missing #${id}`));
expect(positions.every((position,index)=>index===0||position>positions[index-1]),'post-hero chapter order changed');
for(const id of ['main','top','pricing','system'])expect(html.includes(`id="${id}"`),`preserved #${id} anchor missing`);
for(const key of ['starting','difference','capabilities','proof','plans','studio','contact'])expect(html.includes(`data-scroll-chapter="${key}"`),`missing scroll chapter contract: ${key}`);
for(const headline of [
  'A great website should not feel <em>out of reach.</em>',
  'A website can exist.<br/><em>Or it can make people stop.</em>',
  'One idea. Four disciplines. <em>No handoff gap.</em>',
  'Proof, before <em>promises.</em>',
  'Clear scope.<br/><em>Serious first impression.</em>',
  'Small studio.<br/><em>Close to the work.</em>',
  'Your business is judged online before you get the chance to <em>explain it.</em>'
])expect(html.includes(headline),`chapter headline missing: ${headline}`);

// Honest build and care offers.
const plans=html.slice(positions[4],positions[5]);
for(const [name,price] of [['Website Starter','₹2,599'],['Business Website','₹3,999'],['Custom Experience','₹5,999+']])expect(plans.includes(name)&&plans.includes(price),`build offer missing: ${name} ${price}`);
expect(plans.indexOf('₹2,599')<plans.indexOf('₹3,999')&&plans.indexOf('₹3,999')<plans.indexOf('₹5,999+'),'build offers must remain ordered by starting scope');
expect(plans.includes('Most Chosen')&&html.includes('data-plan-recommended'),'Business Website must remain the marked recommendation');
expect(plans.includes('Hosting, domains, paid tools, ecommerce, large content work and advanced integrations are quoted separately'),'separate-scope disclosure missing');
expect(plans.includes('After launch, <em>stay sharp.</em>')&&plans.includes('Monthly support is separate from the one-time website build'),'optional care framing missing');
for(const [name,price] of [['Launch','₹2,499'],['Grow','₹3,999'],['Pro','₹5,999+']])expect(plans.includes(name)&&plans.includes(price),`care plan missing: ${name} ${price}`);
for(const legacy of ['₹9,999','₹17,999','₹25K–35K+','Digital Makeover','Full Website','Bespoke Experience','ENTRY-FIRST','entry-priority'])expect(!(html+js+experience+fixes+context).includes(legacy),`retired offer leaked into production/context: ${legacy}`);

// Every conversion link has an approved intent.
for(const encoded of [
  'BRAYROAI%20Website%20Starter%20%E2%80%94%20%E2%82%B92%2C599',
  'BRAYROAI%20Business%20Website%20%E2%80%94%20%E2%82%B93%2C999',
  'BRAYROAI%20Custom%20Experience%20enquiry',
  'Help%20me%20choose%20a%20BRAYROAI%20plan',
  'BRAYROAI%20Launch%20support',
  'BRAYROAI%20Grow%20support',
  'BRAYROAI%20Pro%20support'
])expect(html.includes(encoded),`mailto intent missing: ${encoded}`);
expect(!html.includes('subject=BRAYROAI%20Website%20enquiry'),'generic website email subject remains');

// Capabilities are real controls and proof remains factual.
expect((html.match(/data-capability="/g)||[]).length===4,'capability constellation must expose four buttons');
for(const outcome of ['Give people a reason to stay.','Make every next step obvious.','Make the detail hold up.','Remove friction where it counts.'])expect(html.includes(outcome),`capability outcome missing: ${outcome}`);
expect(html.includes('aria-pressed="true"')&&js.includes("button.setAttribute('aria-pressed'"),'capability selected-state semantics missing');
expect(html.includes('/assets/fakhrimart-case-desktop.png')&&html.includes('/assets/fakhrimart-case-mobile.png'),'real FakhriMart captures are not wired');
expect((html.match(/fakhrimart-case-desktop\.png/g)||[]).length===1&&(html.match(/fakhrimart-case-mobile\.png/g)||[]).length===1,'FakhriMart captures must not be duplicated for animation');
expect(html.includes('https://fakhriyarns.vercel.app/'),'live FakhriMart destination missing');
for(const fact of ['Yarn wholesaler','Catalogue-led browsing','Desktop + mobile experience','Enquiry-led flow'])expect(html.includes(fact),`FakhriMart fact missing: ${fact}`);
expect(!html.includes('<iframe'),'client proof must not depend on a live iframe');

// Runtime architecture: native scroll, one central loop, deterministic 2D canvas.
for(const controller of ['ScrollNarrativeController','ParticleField','CapabilityController','FakhriMartScene','BRAYROExperience'])expect(js.includes(`class ${controller}`),`runtime controller missing: ${controller}`);
for(const retired of ['PlanPriorityController','WorkScene','SystemTabs'])expect(!js.includes(`class ${retired}`),`retired controller remains: ${retired}`);
expect((js.match(/addEventListener\('scroll'/g)||[]).length===1,'scroll work must use exactly one listener');
expect(js.includes("addEventListener('scroll',this.schedule,{passive:true})"),'central scroll listener must be passive');
expect((js.match(/requestAnimationFrame\(/g)||[]).length===1,'all continuous work must share one RAF scheduler');
expect(js.includes("getContext?.('2d'")&&!/webgl|three\.js/i.test(js+html),'particle field must remain Canvas 2D');
expect(js.includes('document.hidden')&&js.includes('this.visible'),'particle field visibility pausing missing');
expect(js.includes('chapter.dataset.chapterProgress'),'chapter progress data contract missing');
expect(js.includes("document.body.classList.add('experience-ready')"),'experience readiness contract missing');
expect(!/Lenis|ScrollTrigger|Locomotive Scroll|gsap|three\.js/i.test(js+html+experience),'scroll or rendering dependency slipped into production');

// Desktop-only pinning, complete mobile flow, fallback, and reduced motion.
expect(experience.includes('@media (min-width:801px) and (prefers-reduced-motion:no-preference)'),'bounded desktop pinning media query missing');
expect(experience.includes('.scroll-chapter>.chapter-sticky{position:sticky'),'desktop sticky chapter contract missing');
expect(experience.includes('@media(max-width:800px)')&&experience.includes('@media(max-width:430px)'),'mobile layouts missing');
expect(experience.includes('@media(prefers-reduced-motion:reduce)')&&experience.includes('.particle-layer canvas{display:none}'),'reduced-motion particle pause missing');
expect(experience.includes('.particle-fallback')&&js.includes("document.body.classList.add('canvas-unavailable')"),'canvas fallback missing');
expect(fixes.includes('html{overflow-x:clip}')&&fixes.includes(':focus-visible'),'overflow/focus safeguards missing');
expect(html.includes('DM+Serif+Display')&&experience.includes("font-family:'DM Serif Display'"),'post-hero expressive serif missing');

// Routes, local assets, build, and quality budgets.
expect(!exists('plans.html')&&!exists('case-studies/fakhrimart.html')&&!exists('public/plans.js'),'removed standalone pages/scripts returned');
expect(vite.includes("input:{home:resolve(process.cwd(),'index.html')}")&&!vite.includes('plans:'),'Vite multi-page build returned');
expect(vercel.includes('"/plans"')&&vercel.includes('"/#plans"')&&vercel.includes('"/#work"'),'public route redirects changed');
for(const asset of ['hero-background.webp','yash-cutout.webp','about-yash.webp','fakhrimart-case-desktop.png','fakhrimart-case-mobile.png'])expect(exists(path.join('public/assets',asset)),`missing asset: ${asset}`);
expect(exists('public/outbound-fresh'),'private outbound workflow assets were removed');
expect(lighthouse.includes('performance: 0.78')&&lighthouse.includes('accessibility: 0.95')&&lighthouse.includes("'best-practices': 0.95")&&lighthouse.includes('seo: 0.95'),'Lighthouse category guardrails changed');
expect(lighthouse.includes('cls >= 0.1'),'CLS guardrail changed');
expect(html.includes('id="experience-styles" media="print"')&&html.includes('id="post-fixes-styles" media="print"'),'post-hero CSS must remain deferred');

const refs=[...html.matchAll(/(?:src|href)="\/(?!\/)([^"?#]+)["?#]?/g)].map(match=>match[1]).filter(Boolean);
for(const ref of refs){const candidates=[path.join(root,'public',ref),path.join(root,ref)];expect(candidates.some(fs.existsSync),`missing local homepage reference: /${ref}`)}

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Integrity OK: frozen hero + seven cinematic chapters + honest offers + accessible native-scroll runtime checked');
