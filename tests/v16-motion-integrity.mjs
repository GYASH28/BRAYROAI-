import fs from 'node:fs';

const read=file=>fs.readFileSync(file,'utf8');
const errors=[];
const expect=(condition,message)=>{if(!condition)errors.push(message)};

const css=read('public/experience-motion-v16.css');
const js=read('public/experience-motion-v16.js');
const vite=read('vite.config.mjs');
const pkg=read('package.json');

for(const token of ['class PageCurtain','class RevealDirector','class SceneKinetics','class PointerFeedback','class InteractionChoreography'])expect(js.includes(token),`V16 runtime missing ${token}`);
for(const token of ['home-v16','plans-v16','founder-v16','terms-v16','ai-v16'])expect(js.includes(token),`V16 page classifier missing ${token}`);
for(const token of ['data-v16-reveal','data-v16-scene','data-v16-magnet','data-v16-surface'])expect(js.includes(token),`V16 runtime missing ${token}`);
for(const token of ['.v16-page-transition','.v16-cursor','body.home-v16','body.plans-v16','body.founder-v16','body.terms-v16','body.ai-v16','@media(prefers-reduced-motion:reduce)'])expect(css.includes(token),`V16 CSS missing ${token}`);
expect(css.includes('.terms-section.v16-reading'),'Terms reading-state choreography missing');
expect(css.includes('.arch-arrow')&&css.includes('@keyframes v16Engine'),'AI architecture motion missing');
expect(css.includes('.build-card:nth-child(odd)'),'Plans staggered motion missing');
expect(css.includes('.method__image img'),'Founder method parallax missing');
expect(css.includes('#work .v12-featured-case img'),'Homepage work depth missing');
expect(!/transition\s*:\s*all/i.test(css),'V16 must not use transition: all');
expect(js.includes("matchMedia('(prefers-reduced-motion: reduce)')"),'V16 JS reduced-motion guard missing');
expect(vite.includes('/experience-motion-v16.css')&&vite.includes('/experience-motion-v16.js'),'Vite does not inject V16 motion assets');
expect(vite.includes("html=html.replace('</head>'")&&vite.includes("html=html.replace('</body>'"),'V16 assets are not mounted for every HTML entry');
expect(pkg.includes('"version": "16.0.0"'),'package version is not V16');
expect(pkg.includes('node --check public/experience-motion-v16.js'),'syntax suite does not check V16 runtime');
expect(pkg.includes('node tests/v16-motion-integrity.mjs'),'integrity suite does not guard V16 motion');
expect(Buffer.byteLength(css)<30000,'V16 CSS exceeds 30KB guardrail');
expect(Buffer.byteLength(js)<26000,'V16 JS exceeds 26KB guardrail');

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('V16 motion integrity OK: page-specific choreography, pointer feedback, transitions and reduced-motion protections verified.');
