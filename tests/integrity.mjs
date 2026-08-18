import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('index.html'),css=read('public/styles.css'),fixes=read('public/site-fixes.css'),polish=read('public/polish.css'),experienceCss=read('public/experience.css'),experienceFixes=read('public/experience-fixes.css'),js=read('public/app.js'),enhancements=read('public/site-fixes.js'),experienceJs=read('public/experience.js');
const errors=[]; const expect=(condition,message)=>{if(!condition) errors.push(message)};

expect(html.includes('BRAYROAI — Design. Engineering. AI.'),'BRAYROAI title missing');
expect(html.includes('Digital, designed'),'brand hero promise missing');
expect(html.includes('INTELLIGENT CRAFT'),'brand idea missing');
expect(!/YKG Digital|YKG DIGITAL|YKG \/|YKG\b/.test(html),'legacy YKG naming remains in production HTML');

for(const id of ['main','top','intro','services','work','client-proof','lab','process','about','engage']) expect(html.includes(`id="${id}"`),`missing #${id}`);
for(const asset of ['hero-background.webp','yash-cutout.webp','about-yash.webp']) expect(fs.existsSync(path.join(root,'public/assets',asset)),`missing ${asset}`);
for(const asset of ['public/experience.css','public/experience-fixes.css','public/experience.js']) expect(fs.existsSync(path.join(root,asset)),`missing ${asset}`);

expect((html.match(/data-cap-step=/g)||[]).length===4,'BRAYROAI must expose exactly four capability chapters');
for(const name of ['Web Experiences','Product Design','Frontend Engineering','AI Systems']) expect(html.includes(name),`missing capability ${name}`);

expect(html.includes('mobile-menu__bg'),'mobile menu background layer missing');
expect(html.includes('/site-fixes.css')&&html.includes('/site-fixes.js'),'brand completion layer not wired');
expect(css.includes('.hero-v3')&&css.includes('.capability-story'),'stable recovered visual primitives missing');
expect(js.includes('paintHero')&&js.includes('paintCapability'),'stable recovered interaction primitives missing');
expect(fixes.includes('--blue:#3E7BFF')&&fixes.includes('--orange:#FF6B2C'),'BRAYROAI brand tokens missing');
expect(fixes.includes('content-visibility:visible'),'blank-chapter protection missing');
expect(enhancements.includes('chapter-entered')&&enhancements.includes('revealFallback'),'enhanced interaction/fallback layer missing');
expect(enhancements.includes('/polish.css'),'final polish stylesheet not wired');
expect(enhancements.includes('/experience.css')&&enhancements.includes('/experience-fixes.css')&&enhancements.includes('/experience.js'),'v5 experience layers not wired');
expect(polish.includes('.lab-card--large .lab-orb')&&polish.includes('.project-tile--sky{grid-column:auto'),'visual-completeness polish missing');
expect(experienceCss.includes('.chapter-signal')&&experienceCss.includes('.studio-matrix')&&experienceCss.includes('.project-fit-rail'),'v5 authored visual system missing');
expect(experienceCss.includes('@media(prefers-reduced-motion:reduce)'),'v5 reduced-motion CSS missing');
expect(experienceFixes.includes('.chapter{position:relative;overflow-x:clip}')&&experienceFixes.includes('#5A5F68'),'v5 overflow/contrast hardening missing');
expect(experienceFixes.includes('.cap-step p{color:#A5AAB3!important}'),'capability contrast hardening missing');
expect(experienceFixes.includes('.experience-word::before'),'decorative watermark hardening missing');
expect(experienceJs.includes('--chapter-progress')&&experienceJs.includes('requestAnimationFrame(paint)'),'v5 scroll-scrub system missing');
expect(experienceJs.includes('studio-matrix')&&experienceJs.includes('project-fit-rail'),'v5 density enhancements missing');

const localRefs=[...html.matchAll(/(?:src|href)="\/(?!\/)([^"?#]+)["?#]?/g)].map(m=>m[1]);
for(const ref of localRefs){
  const candidates=[path.join(root,'public',ref),path.join(root,ref)];
  expect(candidates.some(fs.existsSync),`missing local reference /${ref}`);
}

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log(`Integrity OK: BRAYROAI brand + ${localRefs.length} local references + v5 experience system checked`);
