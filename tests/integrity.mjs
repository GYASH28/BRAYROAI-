import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
const html=read('index.html');
const css=read('public/styles.css');
const fixes=read('public/site-fixes.css');
const experience=read('public/experience.css');
const js=read('public/app.js');
const vite=read('vite.config.mjs');
const vercel=read('vercel.json');
const errors=[];
const expect=(condition,message)=>{if(!condition)errors.push(message)};

// Opening sequence + hero contract is intentionally frozen visually.
expect(html.includes('<div aria-hidden="true" class="intro-loader" data-loader="">'),'locked opening loader missing');
expect(html.includes('BRAYROAI / CREATIVE TECHNOLOGY STUDIO'),'locked hero identity changed');
expect(html.includes('Digital, designed<br/><em>to feel different.</em>'),'locked hero headline changed');
expect(html.includes('BRAYROAI builds premium websites, digital experiences, and AI-powered systems for modern brands.'),'locked hero description changed');
expect(html.includes('SCROLL TO SHAPE THE STORY'),'locked hero scroll cue changed');
expect(html.includes('/assets/hero-background.webp')&&html.includes('/assets/yash-cutout.webp'),'locked hero assets changed');
expect(js.includes('class LockedHeroController'),'locked hero controller missing');
expect(js.includes('},920)'),'locked loader timing changed');
expect(js.includes('this.px*34*depth')&&js.includes('scrollP*86*depth'),'locked hero depth behavior changed');
expect(css.includes('/* HERO V3 — visual contract frozen. */'),'hero visual contract block missing');
for(const locked of [
  "font:800 clamp(72px,8.8vw,148px)/.78 'Space Grotesk'",
  'filter:saturate(.86) contrast(1.06) brightness(.63)',
  'width:clamp(860px,72vw,1200px)',
  'left:59%;bottom:-5%',
  'font-size:12.1vw',
  'font-size:11.7vw',
  'padding-top:30.5vh',
  'font-size:clamp(36px,10.7vw,52px)'
])expect(css.includes(locked),`locked hero visual token changed: ${locked}`);
expect(css.includes('.sr-only{position:absolute!important'),'screen-reader-only utility missing');

// Dead legacy homepage CSS must not return to the critical path.
expect(!exists('public/site-fixes-core.css'),'obsolete site-fixes-core.css still exists');
expect(!fixes.includes('@import'),'site-fixes must not import a second render-blocking stylesheet');
for(const legacy of ['.manifesto{','.capabilities{','.client-proof{','.lab{','.process{','.about{','.engage{','.case-hero{'])expect(!css.includes(legacy),`dead legacy CSS returned to styles.css: ${legacy}`);
expect(Buffer.byteLength(css,'utf8')<24000,'critical styles.css grew above 24KB');
expect(!/(?:^|\n)(?!\.cinematic-main|\.cinematic-footer|\/\*|\s*$)[^\n]*\{/.test(fixes),'site-fixes contains an unscoped rule that could touch the locked hero');

// One-page commercial architecture.
for(const id of ['main','top','services','work','system','pricing','studio','contact'])expect(html.includes(`id="${id}"`),`missing #${id}`);
expect((html.match(/data-service-moment/g)||[]).length===4,'service rail must contain four authored moments');
expect(html.includes('data-scene="services"')&&html.includes('data-scene="work"')&&html.includes('data-scene="system"'),'cinematic scroll scenes missing');
expect(!html.includes('THREE FORCES')&&!html.includes('DECONSTRUCTION')&&!html.includes('BRAYROAI / LAB'),'old conceptual chapter language remains');
expect(!html.includes('/plans.html')&&!html.includes('/case-studies/fakhrimart.html'),'homepage still routes into removed agency subpages');
expect(!exists('plans.html')&&!exists('case-studies/fakhrimart.html')&&!exists('public/plans.js'),'removed pages/scripts still exist');
for(const dead of ['public/commercial.css','public/commercial-fixes.css','public/commercial-accessibility.css'])expect(!exists(dead),`unused commercial layer remains: ${dead}`);
expect(vite.includes("input:{home:resolve(process.cwd(),'index.html')}")&&!vite.includes('plans:')&&!vite.includes('fakhrimart:'),'Vite still builds removed pages');
expect(vercel.includes('"/plans"')&&vercel.includes('"/#pricing"')&&vercel.includes('"/#work"'),'legacy URLs should redirect into the single-page experience');

// Real work and honest commercial content.
expect(html.includes('/assets/fakhrimart-case-desktop.png')&&html.includes('/assets/fakhrimart-case-mobile.png'),'real FakhriMart captures are not wired');
expect(html.includes('https://fakhriyarns.vercel.app/'),'live FakhriMart destination missing');
expect(!html.includes('<iframe'),'homepage must not depend on a live iframe');
for(const price of ['₹9,999','₹17,999','₹25K–35K+','₹2,499','₹3,999','₹5,999+'])expect(html.includes(price),`integrated pricing missing ${price}`);
for(const asset of ['hero-background.webp','yash-cutout.webp','about-yash.webp','fakhrimart-case-desktop.png','fakhrimart-case-mobile.png'])expect(exists(path.join('public/assets',asset)),`missing ${asset}`);
expect(exists('public/outbound-fresh'),'outbound workflow assets were accidentally removed');

// Motion architecture: Zexvro-like spatial choreography without scroll hijacking.
expect(experience.includes('.service-moment')&&experience.includes('.work-slices')&&experience.includes('.craft-board'),'core cinematic visual systems missing');
expect(experience.includes('@media(max-width:760px)'),'intentional mobile choreography missing');
expect(experience.includes('@media(prefers-reduced-motion:reduce)'),'reduced-motion choreography missing');
expect(js.includes('class CinematicExperience')&&js.includes('class ServiceRail')&&js.includes('class WorkFilm')&&js.includes('class SystemFilm'),'central cinematic controllers missing');
expect(js.includes('ENTER')===false,'implementation should not hard-code old explanatory transition copy in JS');
expect((js.match(/addEventListener\('scroll'/g)||[]).length===1,'scroll work must be centralized through one passive listener');
expect(js.includes('requestAnimationFrame'),'shared RAF scheduler missing');
expect(!/Lenis|ScrollTrigger|locomotive/i.test(js+experience),'scroll-hijacking dependency slipped into production');
expect(js.includes("document.body.classList.add('experience-ready')"),'experience readiness contract missing');
expect(html.includes('data-pricing-tab="build"')&&html.includes('data-pricing-tab="ongoing"'),'integrated pricing control missing');

const validateRefs=markup=>{
  const refs=[...markup.matchAll(/(?:src|href)="\/(?!\/)([^"?#]+)["?#]?/g)].map(match=>match[1]).filter(Boolean);
  for(const ref of refs){
    if(ref.startsWith('#'))continue;
    const candidates=[path.join(root,'public',ref),path.join(root,ref)];
    expect(candidates.some(fs.existsSync),`homepage missing local reference /${ref}`);
  }
};
validateRefs(html);

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Integrity OK: locked hero + lean critical CSS + single-page cinematic architecture checked');
