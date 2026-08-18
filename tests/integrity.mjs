import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('index.html'),css=read('public/styles.css'),fixes=read('public/site-fixes.css'),js=read('public/app.js');
const errors=[]; const expect=(condition,message)=>{if(!condition) errors.push(message)};
expect(html.includes('YKG Digital — Design + Engineering'),'canonical title missing');
for(const id of ['main','top','intro','services','work','client-proof','lab','about','engage']) expect(html.includes(`id="${id}"`),`missing #${id}`);
for(const asset of ['hero-background.webp','yash-cutout.webp','about-yash.webp']) expect(fs.existsSync(path.join(root,'public/assets',asset)),`missing ${asset}`);
expect(html.includes('mobile-menu__bg'),'mobile menu background layer missing');
expect(html.includes('/site-fixes.css')&&html.includes('/site-fixes.js'),'QA fix layer not wired');
expect(css.includes('.hero-v3')&&css.includes('.capability-story'),'canonical visual system missing');
expect(js.includes('paintHero')&&js.includes('paintCapability'),'canonical interaction system missing');
expect(fixes.includes('.brand-dot')&&fixes.includes('.cap-step:not(.is-active)'),'critical CSS fixes missing');
expect(!html.includes('BRAYROAI'),'obsolete BRAYROAI markup leaked into recovered site');
expect(!html.includes('brayroai-'),'obsolete BRAYROAI asset reference leaked into recovered site');
const localRefs=[...html.matchAll(/(?:src|href)="\/(?!\/)([^"?#]+)["?#]?/g)].map(m=>m[1]);
for(const ref of localRefs){const candidates=[path.join(root,'public',ref),path.join(root,ref)];expect(candidates.some(fs.existsSync),`missing local reference /${ref}`)}
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log(`Integrity OK: ${localRefs.length} local references checked`);
