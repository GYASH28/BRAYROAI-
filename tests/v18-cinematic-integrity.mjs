import fs from 'node:fs';

const read=file=>fs.readFileSync(file,'utf8');
const errors=[];
const expect=(condition,message)=>{if(!condition)errors.push(message)};

const css=read('public/cinematic-v18.css');
const js=read('public/cinematic-v18.js');
const vite=read('vite.config.mjs');
const pkg=read('package.json');

for(const token of ['class CinematicScrollDirector','updateScene(record,force)','updateReel(force)','scrubVideo(p,maxIndex,force)'])expect(js.includes(token),`V18 runtime missing ${token}`);
for(const token of ['--v18-camera-y','--v18-camera-x','--v18-camera-scale','--v18-reel-progress','--v18-shot-o'])expect(js.includes(token),`V18 runtime missing ${token}`);
for(const token of ['.v18-reel','.v18-shot','.v18-reel__copy','body.home-v18','.hero__background','.work__desktop img','.founder-preview__portrait img'])expect(css.includes(token),`V18 CSS missing ${token}`);
expect(css.includes('@media(prefers-reduced-motion:reduce)'),'V18 reduced-motion fallback missing');
expect(!/transition\s*:\s*all/i.test(css),'V18 must not use transition: all');
expect(js.includes("matchMedia('(prefers-reduced-motion: reduce)')"),'V18 JS reduced-motion guard missing');
expect(vite.includes('data-v18-reel'),'V18 reel is not injected into the homepage build');
expect(vite.includes('/cinematic-v18.css')&&vite.includes('/cinematic-v18.js'),'Vite does not inject V18 assets');
expect(vite.includes('brayroai-cinematic-opening-silent.mp4'),'V18 reel is not using the owned cinematic media asset');
expect(vite.includes('fakhrimart-case-desktop.png')&&vite.includes('about-yash.webp'),'V18 reel is missing real project/founder imagery');
expect(pkg.includes('node --check public/cinematic-v18.js'),'syntax suite does not check V18 runtime');
expect(pkg.includes('node tests/v18-cinematic-integrity.mjs'),'integrity suite does not guard V18 motion');
expect(Buffer.byteLength(css)<30000,'V18 CSS exceeds 30KB guardrail');
expect(Buffer.byteLength(js)<18000,'V18 JS exceeds 18KB guardrail');

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('V18 cinematic integrity OK: reel, smoothed camera depth, real media, and reduced-motion protections verified.');
