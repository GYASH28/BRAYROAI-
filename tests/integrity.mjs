import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const exists=f=>fs.existsSync(path.join(root,f));
const home=read('index.html'),plans=read('plans.html'),founder=read('founder.html'),terms=read('terms.html');
const files={homeJs:read('public/commercial-cut.js'),directionJs:read('public/direction-pass.js'),motion4:read('public/motion-v4.css'),motion5:read('public/motion-v5.css'),motion5js:read('public/motion-v5.js'),motion6:read('public/motion-v6.css'),motion6js:read('public/motion-v6.js'),v7:read('public/art-direction-v7.css'),v7contrast:read('public/art-direction-v7-contrast.css'),v7js:read('public/art-direction-v7.js'),v8:read('public/work-showcase-v8.css'),v8js:read('public/work-showcase-v8.js'),v9:read('public/authored-flow-v9.css'),v9js:read('public/authored-flow-v9.js'),plansJs:read('public/plans-page.js'),founderJs:read('public/founder-page.js'),termsCss:read('public/terms-page.css'),termsJs:read('public/terms-page.js')};
const vite=read('vite.config.mjs'),vercel=read('vercel.json');
const errors=[];const expect=(c,m)=>{if(!c)errors.push(m)};
expect((home.match(/data-scene=/g)||[]).length===7,'homepage must keep seven scenes');
for(const p of ['₹2,599','₹3,999','₹5,999+','₹9,999','₹17,999','₹25K–₹35K+']){expect(home.includes(p),`homepage missing ${p}`);expect(plans.includes(p),`plans missing ${p}`)}
for(const p of ['₹2,599/mo','₹3,999/mo','₹5,999+/mo']) expect(plans.includes(p),`plans comparison missing ${p}`);
expect(home.includes('TWO WAYS TO WORK')&&home.includes('Ongoing website partnership')&&home.includes('Complete website builds'),'homepage pricing families unclear');
expect((plans.match(/data-plan-scene=/g)||[]).length===6,'plans page must contain six purposeful scenes');
expect((plans.match(/class="build-card/g)||[]).length===6,'plans page must contain six plan cards');
expect((plans.match(/data-plan-mode=/g)||[]).length===2,'plans mode director needs monthly and one-time');
expect(!files.plansJs.includes("'Website Starter', '₹2,599'"),'obsolete low-price one-time scope director returned');

expect(files.motion5js.includes('class PricingModeDirector')&&files.motion5js.includes('class MicroCursor'),'Motion V5 runtime incomplete');
expect(files.motion5js.includes("link.href = '/motion-v6.css'")&&files.motion5js.includes("script.src = '/motion-v6.js'"),'Motion V6 is not loaded sitewide');
for(const token of ['class ProgressiveBlur','class ActiveNavIndicator','class SpotlightSurfaces','class BorderTrails','class WorkMorphDialog','class ContextCursor']) expect(files.motion6js.includes(token),`Motion V6 runtime missing ${token}`);
for(const token of ['.m6-case-dialog','[data-m6-spotlight]','.m6-border-trail','.m6-highlight','body::before']) expect(files.motion6.includes(token),`Motion V6 CSS missing ${token}`);
expect(files.motion6js.includes("link.href = '/art-direction-v7.css'")&&files.motion6js.includes("script.src = '/art-direction-v7.js'"),'Art Direction V7 is not mounted after Motion V6');
for(const token of ['.capability-instrument{','.founder-preview','.pricing-mini.v7-recommended','.build-card.is-featured','body.terms-body','.v7-browserbar']) expect(files.v7.includes(token),`Art Direction V7 CSS missing ${token}`);
for(const token of ['class HeroMeta','class WorkFrame','class RecommendedPlans','class FounderEditorial','class EntryChoreography','class SectionHairlines']) expect(files.v7js.includes(token),`Art Direction V7 runtime missing ${token}`);
expect(files.v7js.includes("link.href = '/art-direction-v7-contrast.css'"),'V7 contrast hardening is not loaded');
expect(files.v7contrast.includes('--v7-orange-ink:#aa3205')&&files.v7contrast.includes('.terms-nav{z-index:100!important}')&&files.v7contrast.includes('.build-card{position:relative!important}'),'V7 paper contrast or positioning hardening incomplete');
expect(files.v7.includes('@media(prefers-reduced-motion:reduce)'),'Art Direction V7 reduced-motion safeguards missing');
expect(!/transition\s*:\s*all/i.test(files.v7),'Art Direction V7 contains prohibited transition: all');

expect(files.v7js.includes("link.href = '/work-showcase-v8.css'")&&files.v7js.includes("script.src = '/work-showcase-v8.js'"),'Work Showcase V8 is not mounted after V7');
for(const token of ['.v8-work-modebar','.v8-work-detail','.v8-work-lens','.v8-work-chapters','.v8-dialog-profile','.v8-section-state']) expect(files.v8.includes(token),`Work Showcase V8 CSS missing ${token}`);
for(const token of ['class WorkShowcaseV8','class CaseDialogV8','class SectionStateV8','class ScrollVelocityV8','class StaggerV8','class TactileLinksV8']) expect(files.v8js.includes(token),`Work Showcase V8 runtime missing ${token}`);
for(const token of ["'desktop'","'mobile'","'detail'",'FLAGSHIP CASE / PROJECT 01','FakhriMart / Fakhri Yarns','YARN WHOLESALE','DIRECTION + UI + FRONTEND']) expect(files.v8js.includes(token),`V8 client proof missing ${token}`);
expect(files.v8js.includes("this.stage.dataset.scVerifyState=`work:${mode}`"),'V8 work verification state missing');
expect(files.v8.includes('@media(prefers-reduced-motion:reduce)'),'V8 reduced-motion safeguards missing');
expect(!/transition\s*:\s*all/i.test(files.v8),'V8 contains prohibited transition: all');

expect(files.v7js.includes("link.href = '/authored-flow-v9.css'")&&files.v7js.includes("script.src = '/authored-flow-v9.js'"),'Authored Flow V9 is not mounted after V8');
for(const token of ['.v9-scene-bridge','.v9-discipline-rail','.v9-work-proof-grid','.v9-case-plate','.v9-plan-guide','.v9-founder-note','.v9-contact-signal']) expect(files.v9.includes(token),`Authored Flow V9 CSS missing ${token}`);
for(const token of ['class ScrollDirectorV9','class ContinuityBridgesV9','class DisciplineRailV9','class WorkProofV9','class PricingGuideV9','class FounderNoteV9','class ContactSignalV9']) expect(files.v9js.includes(token),`Authored Flow V9 runtime missing ${token}`);
for(const token of ['Catalogue-led browsing','Desktop + mobile','Direct enquiry route','Live website']) expect(files.v9js.includes(token),`V9 truthful client proof missing ${token}`);
expect(files.v9.includes('@media(prefers-reduced-motion:reduce)'),'V9 reduced-motion safeguards missing');
expect(!/transition\s*:\s*all/i.test(files.v9),'V9 contains prohibited transition: all');

expect(Buffer.byteLength(files.motion6)<18000,'Motion V6 CSS exceeds 18KB guardrail');
expect(Buffer.byteLength(files.motion6js)<18000,'Motion V6 JS exceeds 18KB guardrail');
expect(Buffer.byteLength(files.v7)<26000,'Art Direction V7 CSS exceeds 26KB guardrail');
expect(Buffer.byteLength(files.v7contrast)<5000,'V7 contrast CSS exceeds 5KB guardrail');
expect(Buffer.byteLength(files.v7js)<15000,'Art Direction V7 JS exceeds 15KB guardrail');
expect(Buffer.byteLength(files.v8)<20000,'Work Showcase V8 CSS exceeds 20KB guardrail');
expect(Buffer.byteLength(files.v8js)<16000,'Work Showcase V8 JS exceeds 16KB guardrail');
expect(Buffer.byteLength(files.v9)<18000,'Authored Flow V9 CSS exceeds 18KB guardrail');
expect(Buffer.byteLength(files.v9js)<14000,'Authored Flow V9 JS exceeds 14KB guardrail');

expect(home.includes('href="/terms"')&&plans.includes('href="/terms"')&&founder.includes('href="/terms"'),'Terms links missing from public pages');
for(const phrase of ['Terms & Conditions','Effective 24 August 2026','Monthly plans currently start at ₹2,599/month','One-time website builds currently start at ₹9,999','OWNERSHIP & PORTFOLIO','CANCELLATION & REFUNDS','laws of India']) expect(terms.includes(phrase),`Terms page missing: ${phrase}`);
expect(vite.includes("terms:resolve(process.cwd(),'terms.html')"),'Terms missing from Vite inputs');
expect(vercel.includes('"source":"/terms"'),'Terms route missing from Vercel');
expect(files.termsCss.includes('@media(prefers-reduced-motion:reduce)')&&files.termsJs.includes('IntersectionObserver'),'Terms accessibility/motion support incomplete');
expect(files.directionJs.includes('class HyperFramesIntro')&&files.directionJs.includes('/assets/brayroai-cinematic-opening.mp4'),'HyperFrames intro integration missing');
expect(!home.includes('data-commercial-film')&&!home.includes('data-signal-chamber'),'obsolete background film/signal chamber returned');
expect(home.includes('REAL WORK / FAKHRIMART')&&home.includes('fakhriyarns.vercel.app'),'homepage must preserve the real FakhriMart case study');
for(const asset of ['hero-background.webp','yash-cutout.webp','about-yash.webp','fakhrimart-case-desktop.png','fakhrimart-case-mobile.png','brayroai-cinematic-opening.mp4']) expect(exists(path.join('public/assets',asset)),`missing ${asset}`);
for(const file of ['public/motion-v5.css','public/motion-v5.js','public/motion-v6.css','public/motion-v6.js','public/art-direction-v7.css','public/art-direction-v7-contrast.css','public/art-direction-v7.js','public/work-showcase-v8.css','public/work-showcase-v8.js','public/authored-flow-v9.css','public/authored-flow-v9.js','public/terms-page.css','public/terms-page.js']) expect(exists(file),`missing ${file}`);
expect((founder.match(/data-founder-scene=/g)||[]).length===6,'founder page scene count changed');
expect((founder.match(/data-principle=/g)||[]).length===3&&files.founderJs.includes('class PrincipleInstrument'),'founder principles broken');
for(const [name,html] of Object.entries({home,plans,founder,terms})){
  const refs=[...html.matchAll(/(?:src|href)="\/(?!\/)([^"?#]+)["?#]?/g)].map(m=>m[1]).filter(ref=>ref&&!['plans','founder','terms'].includes(ref));
  for(const ref of refs) expect([path.join(root,'public',ref),path.join(root,ref)].some(fs.existsSync),`missing local ${name} reference: /${ref}`);
}
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Integrity OK: dual pricing + Terms + HyperFrames + V7 + V8 + Authored Flow V9 checked');
