import fs from 'node:fs';

const read=file=>fs.readFileSync(file,'utf8');
const errors=[];
const expect=(condition,message)=>{if(!condition)errors.push(message)};

const css=read('public/cinematic-v18.css');
const js=read('public/cinematic-v18.js');
const vite=read('vite.config.mjs');
const pkg=read('package.json');

for(const token of [
  'class CinematicScrollDirector',
  'paintHero(scene,phase,focus)',
  'paintServices(scene,phase,focus)',
  'paintFilm(scene,phase,focus)',
  'paintWork(scene,phase,focus)',
  'paintAI(scene,phase,focus)',
  'paintPlans(scene,phase,focus)',
  'paintFounder(scene,phase,focus)',
  'paintContact(scene,phase,focus)'
]) expect(js.includes(token),`Cinematic runtime missing ${token}`);

for(const token of ['--v19-page','--v19-speed','--v19-phase','--v19-hero-bg-y','--v19-work-desktop-y','--v19-founder-image-y'])expect(js.includes(token),`Cinematic runtime missing ${token}`);
for(const token of ['body.home-v19','.hero__background','#services .play-scene__stage','.editorial-sequence__frame','#work .work__desktop','#ai-systems .v12-product-card','#plans [data-v14-rate]','#studio .founder-preview__portrait','#contact .close__orb'])expect(css.includes(token),`Cinematic CSS missing ${token}`);

expect(css.includes('@media(prefers-reduced-motion:reduce)'),'Reduced-motion fallback missing');
expect(!/transition\s*:\s*all/i.test(css),'Cinematic CSS must not use transition: all');
expect(js.includes("matchMedia('(prefers-reduced-motion: reduce)')"),'Reduced-motion JS guard missing');
expect(vite.includes('/cinematic-v18.css')&&vite.includes('/cinematic-v18.js'),'Vite does not inject the cinematic motion assets');
expect(!vite.includes('data-v18-reel'),'Homepage build must not inject a V18 reel or extra section');
expect(!vite.includes('cinematicReel'),'Homepage build still contains the removed cinematic reel template');
expect(!css.includes('.v18-reel')&&!css.includes('.v18-shot'),'Removed reel CSS is still present');
expect(!js.includes('updateReel(')&&!js.includes('scrubVideo('),'Removed reel runtime is still present');
expect(pkg.includes('node --check public/cinematic-v18.js'),'Syntax suite does not check cinematic runtime');
expect(pkg.includes('node tests/v18-cinematic-integrity.mjs'),'Integrity suite does not guard cinematic motion');
expect(Buffer.byteLength(css)<22000,'Cinematic CSS exceeds 22KB guardrail');
expect(Buffer.byteLength(js)<18000,'Cinematic JS exceeds 18KB guardrail');

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Cinematic motion integrity OK: original homepage structure preserved and all eight scenes receive scroll direction.');
