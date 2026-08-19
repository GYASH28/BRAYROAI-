import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
const html=read('index.html');
const plans=read('plans.html');
const caseStudy=read('case-studies/fakhrimart.html');
const css=read('public/styles.css');
const fixes=read('public/site-fixes.css');
const experienceCss=read('public/experience.css');
const js=read('public/app.js');
const commercialCss=read('public/commercial.css');
const commercialFixes=read('public/commercial-fixes.css');
const commercialA11y=read('public/commercial-accessibility.css');
const plansJs=read('public/plans.js');
const errors=[];
const expect=(condition,message)=>{if(!condition) errors.push(message)};

expect(html.includes('BRAYROAI — Design. Engineering. AI.'),'BRAYROAI title missing');
expect(html.includes('Digital, designed<br/><em>to feel different.</em>'),'locked hero promise changed');
expect(html.includes('BRAYROAI / CREATIVE TECHNOLOGY STUDIO'),'locked hero identity changed');
expect(html.includes('SCROLL TO SHAPE THE STORY'),'locked hero meta changed');
expect(html.includes('hero-background.webp')&&html.includes('yash-cutout.webp'),'locked hero assets changed');
expect(!/YKG Digital|YKG DIGITAL|YKG \/|YKG\b/.test(html),'legacy YKG naming remains in production HTML');

for(const id of ['main','top','services','work','client-proof','process','lab','about','engage']) expect(html.includes(`id="${id}"`),`missing #${id}`);
expect((html.match(/data-scene=/g)||[]).length===6,'homepage must expose exactly six authored post-hero scenes');
for(const scene of ['forces','project','process','lab','studio','resolution']) expect(html.includes(`data-scene="${scene}"`),`missing ${scene} scene`);
expect(!html.includes('class="manifesto chapter"'),'old manifesto section still present');
expect(!html.includes('capability-steps'),'old capability card/step architecture still present');
expect(!html.includes('process-row'),'old numbered process-row architecture still present');
expect(!html.includes('iframe'),'homepage should use persisted real project captures, not fragile iframe proof');
expect(html.includes('/assets/fakhrimart-case-desktop.png')&&html.includes('/assets/fakhrimart-case-mobile.png'),'real FakhriMart captures are not wired');
expect(html.includes('/case-studies/fakhrimart.html'),'homepage does not link the real case study');
expect(html.includes('/plans.html'),'Plans route disappeared from homepage navigation');
expect(html.includes('/experience.css')&&html.includes('/app.js'),'central experience assets are not wired');
expect(!html.includes('/site-fixes.js'),'runtime patch loader is still wired');

for(const asset of ['hero-background.webp','yash-cutout.webp','about-yash.webp','fakhrimart-case-desktop.png','fakhrimart-case-mobile.png']) expect(exists(path.join('public/assets',asset)),`missing ${asset}`);
for(const asset of ['public/experience.css','public/commercial.css','public/commercial-fixes.css','public/commercial-accessibility.css','public/plans.js','plans.html','case-studies/fakhrimart.html']) expect(exists(asset),`missing ${asset}`);
for(const obsolete of ['public/site-fixes.js','public/polish.css','public/experience-fixes.css','public/experience.js','public/refinement.css','public/refinement.js','public/commercial.js']) expect(!exists(obsolete),`obsolete patch layer remains: ${obsolete}`);

expect(css.includes('.hero-v3'),'stable base hero primitives missing');
expect(fixes.includes('--blue:#3E7BFF')&&fixes.includes('--orange:#FF6B2C'),'production hero brand tokens missing');
expect(experienceCss.includes('locked hero compatibility'),'hero compatibility layer missing');
expect(experienceCss.includes('.forces-scene[data-state="engineering"]'),'three-forces transformation states missing');
expect(experienceCss.includes('--approach:0')&&experienceCss.includes('--deconstruct:0'),'project immersion state variables missing');
expect(experienceCss.includes('--explode:0')&&experienceCss.includes('.decon-layer'),'project deconstruction system missing');
expect(experienceCss.includes('.lab-workbench')&&experienceCss.includes('.motion-demo.is-running'),'interactive Lab styling missing');
expect(experienceCss.includes('@media(prefers-reduced-motion:reduce)'),'reduced-motion experience missing');
expect(experienceCss.includes('@media(max-width:760px)'),'intentional mobile choreography missing');

expect(js.includes('class ExperienceController'),'central ExperienceController missing');
expect(js.includes('class LockedHeroController'),'locked hero controller missing');
expect(js.includes('class ForcesScene')&&js.includes('class ProjectScene')&&js.includes('class ProcessScene'),'core scene abstractions missing');
expect(js.includes('class PointerSystem')&&js.includes('data-cursor'),'contextual pointer system missing');
expect(js.includes("setTimeout(()=>")&&js.includes("},920)"),'locked loader timing changed');
expect(js.includes('this.px*34*depth')&&js.includes('scrollP*86*depth'),'locked hero depth behavior changed');
expect((js.match(/addEventListener\('scroll'/g)||[]).length===1,'scroll motion should be centralized through one controller listener');
expect(js.includes("document.body.classList.add('experience-ready')"),'experience readiness contract missing');

expect(commercialCss.includes('.pricing-grid')&&commercialCss.includes('.case-study-story'),'Plans/case-study visual system incomplete');
expect(commercialFixes.includes('.case-page')&&commercialFixes.includes('.case-mobile-proof'),'case-study visual hardening missing');
expect(commercialA11y.includes(':focus-visible'),'commercial accessibility hardening missing');
for(const price of ['₹9,999','₹17,999','₹25K–35K+','₹2,499','₹3,999','₹5,999+']) expect(plans.includes(price),`plans page missing price ${price}`);
for(const name of ['DIGITAL MAKEOVER','FULL WEBSITE','BESPOKE EXPERIENCE','LAUNCH','GROW','PRO']) expect(plans.includes(name),`plans page missing ${name}`);
expect(plansJs.includes('data-price-tab')||plansJs.includes('dataset.priceTab'),'plans toggle logic missing');
expect(caseStudy.includes('/assets/fakhrimart-case-desktop.png')&&caseStudy.includes('/assets/fakhrimart-case-mobile.png'),'case study lost real client captures');
expect(caseStudy.includes('A REAL SITE.')&&caseStudy.includes('PORTFOLIO PROP.'),'case study real-work framing missing');
expect(caseStudy.includes('https://fakhriyarns.vercel.app/'),'case study live destination missing');

const validateRefs=(markup,label)=>{
  const refs=[...markup.matchAll(/(?:src|href)="\/(?!\/)([^"?#]+)["?#]?/g)].map(match=>match[1]);
  for(const ref of refs){
    const candidates=[path.join(root,'public',ref),path.join(root,ref)];
    expect(candidates.some(fs.existsSync),`${label} missing local reference /${ref}`);
  }
};
validateRefs(html,'homepage');
validateRefs(plans,'Plans');
validateRefs(caseStudy,'case study');

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Integrity OK: locked hero + authored scene architecture + real work + Plans/case-study continuity checked');
