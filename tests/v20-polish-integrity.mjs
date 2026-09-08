import fs from 'node:fs';

const read=file=>fs.readFileSync(file,'utf8');
const errors=[];
const expect=(condition,message)=>{if(!condition)errors.push(message)};

const css=read('public/cinematic-v20.css');
const js=read('public/cinematic-v20.js');
const v15css=read('public/brayro-v15.css');
const v15js=read('public/brayro-v15.js');
const vite=read('vite.config.mjs');
const pkg=read('package.json');
const pw=read('playwright.config.mjs');

for(const token of [
  'class ComponentMounts','class HeroTextCycle','class SelectorDirector','class PointerPolish','class PolishDirector',
  'mountHeroLens()','mountHeroTextCycle()','mountServicesSignal()','mountSelectorIndicator()','mountFilmGate()','mountWorkAperture()','mountAIPaths()','mountPricingLights()','mountFounderScan()','mountContactLines()','mountShineButtons()','mountSceneRail()'
]) expect(js.includes(token),`V20 runtime missing ${token}`);

for(const token of [
  '.v20-scene-rail','.v20-lens','.v20-text-cycle','.v20-signal-field','.v20-selector-indicator','.v20-film-gate','.v20-aperture','.v20-data-path','.v20-rate-light','.v20-portrait-scan','.v20-background-lines','.v20-shine-button'
]) expect(css.includes(token),`V20 CSS missing ${token}`);

expect(js.includes("matchMedia('(prefers-reduced-motion: reduce)')"),'V20 reduced-motion guard missing');
expect(js.includes("matchMedia('(hover:hover) and (pointer:fine)')"),'V20 fine-pointer guard missing');
expect(css.includes('@media(prefers-reduced-motion:reduce)'),'V20 reduced-motion CSS missing');
expect(!/transition\s*:\s*all/i.test(css),'V20 must not use transition: all');
expect(!/backdrop-filter/i.test(css),'V20 should not introduce additional backdrop-filter cost');
expect(!css.includes('#plans [data-v14-rate]::after'),'V20 must not override the authored pricing ::after layer');
expect(!v15css.includes('transition:transform .12s linear'),'capabilities pointer must not retain the stiff linear transform transition');
expect(v15js.includes('schedulePointer()')&&v15js.includes('tickPointer()'),'capabilities spring pointer loop missing');
const dataKeyframes=css.match(/@keyframes v20-data\{[^}]*\}[^}]*\}[^}]*\}[^}]*\}/)?.[0]||'';
expect(dataKeyframes.includes('translate3d'),'V20 AI pulse must animate with transforms');
expect(!/left\s*:/.test(dataKeyframes),'V20 AI pulse must not animate the layout property left');
expect(vite.includes('/cinematic-v20.css')&&vite.includes('/cinematic-v20.js'),'Vite does not inject V20 assets');
expect(pkg.includes('node --check public/cinematic-v20.js'),'Syntax suite does not check V20 runtime');
expect(pkg.includes('node tests/v20-polish-integrity.mjs'),'Integrity suite does not guard V20');
expect(!vite.includes('data-v18-reel')&&!vite.includes('cinematicReel'),'V20 must not restore the removed cinematic reel');
expect(!js.includes("document.createElement('section')"),'V20 must not generate a new homepage section');
expect(Buffer.byteLength(css)<30000,'V20 CSS exceeds 30KB guardrail');
expect(Buffer.byteLength(js)<24000,'V20 JS exceeds 24KB guardrail');
expect(pw.includes('cinematic-v20'),'Playwright config must include V20 regression coverage');

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('V20 polish integrity OK: fluid spring motion, 21st-inspired components, reduced-motion protection, authored layers and bundle guardrails are intact.');
