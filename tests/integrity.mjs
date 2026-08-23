import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const exists=f=>fs.existsSync(path.join(root,f));
const home=read('index.html'),plans=read('plans.html'),founder=read('founder.html'),terms=read('terms.html');
const files={homeJs:read('public/commercial-cut.js'),directionJs:read('public/direction-pass.js'),motion4:read('public/motion-v4.css'),motion5:read('public/motion-v5.css'),motion5js:read('public/motion-v5.js'),plansJs:read('public/plans-page.js'),founderJs:read('public/founder-page.js'),termsCss:read('public/terms-page.css'),termsJs:read('public/terms-page.js')};
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
expect(files.motion5.includes('.pricing-dual')&&files.motion5.includes('.pricing-mini')&&files.motion5.includes('.m5-cursor'),'Motion V5 visual layer incomplete');
expect(home.includes('href="/terms"')&&plans.includes('href="/terms"')&&founder.includes('href="/terms"'),'Terms links missing from public pages');
for(const phrase of ['Terms & Conditions','Effective 24 August 2026','Monthly plans currently start at ₹2,599/month','One-time website builds currently start at ₹9,999','OWNERSHIP & PORTFOLIO','CANCELLATION & REFUNDS','laws of India']) expect(terms.includes(phrase),`Terms page missing: ${phrase}`);
expect(vite.includes("terms:resolve(process.cwd(),'terms.html')"),'Terms missing from Vite inputs');
expect(vercel.includes('"source":"/terms"'),'Terms route missing from Vercel');
expect(files.termsCss.includes('@media(prefers-reduced-motion:reduce)')&&files.termsJs.includes('IntersectionObserver'),'Terms accessibility/motion support incomplete');
expect(files.directionJs.includes('class HyperFramesIntro')&&files.directionJs.includes('/assets/brayroai-cinematic-opening.mp4'),'HyperFrames intro integration missing');
expect(!home.includes('data-commercial-film')&&!home.includes('data-signal-chamber'),'obsolete background film/signal chamber returned');
for(const asset of ['hero-background.webp','yash-cutout.webp','about-yash.webp','fakhrimart-case-desktop.png','fakhrimart-case-mobile.png','brayroai-cinematic-opening.mp4']) expect(exists(path.join('public/assets',asset)),`missing ${asset}`);
for(const file of ['public/motion-v5.css','public/motion-v5.js','public/terms-page.css','public/terms-page.js']) expect(exists(file),`missing ${file}`);
expect((founder.match(/data-founder-scene=/g)||[]).length===6,'founder page scene count changed');
expect((founder.match(/data-principle=/g)||[]).length===3&&files.founderJs.includes('class PrincipleInstrument'),'founder principles broken');
for(const [name,html] of Object.entries({home,plans,founder,terms})){
  const refs=[...html.matchAll(/(?:src|href)="\/(?!\/)([^"?#]+)["?#]?/g)].map(m=>m[1]).filter(ref=>ref&&!['plans','founder','terms'].includes(ref));
  for(const ref of refs) expect([path.join(root,'public',ref),path.join(root,ref)].some(fs.existsSync),`missing local ${name} reference: /${ref}`);
}
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Integrity OK: dual pricing + Terms + HyperFrames intro + Motion V5 checked');