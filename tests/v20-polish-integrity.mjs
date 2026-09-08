import fs from 'node:fs';

const read=file=>fs.readFileSync(file,'utf8');
const errors=[];
const expect=(condition,message)=>{if(!condition)errors.push(message)};

const css=read('public/cinematic-v20.css');
const js=read('public/cinematic-v20.js');
const vite=read('vite.config.mjs');
const pkg=read('package.json');
const pw=read('playwright.config.mjs');

for(const token of [
  'class ComponentMounts',
  'class PointerPolish',
  'class PolishDirector',
  'mountHeroLens()',
  'mountServicesSignal()',
  'mountFilmGate()',
  'mountWorkAperture()',
  'mountAIPaths()',
  'mountPricingLights()',
  'mountFounderScan()',
  'mountSceneRail()'
]) expect(js.includes(token),`V20 runtime missing ${token}`);

for(const token of [
  '.v20-scene-rail',
  '.v20-lens',
  '.v20-signal-field',
  '.v20-film-gate',
  '.v20-aperture',
  '.v20-data-path',
  '.v20-rate-light',
  '.v20-portrait-scan'
]) expect(css.includes(token),`V20 CSS missing ${token}`);

expect(js.includes("matchMedia('(prefers-reduced-motion: reduce)')"),'V20 reduced-motion guard missing');
expect(js.includes("matchMedia('(hover:hover) and (pointer:fine)')"),'V20 fine-pointer guard missing');
expect(css.includes('@media(prefers-reduced-motion:reduce)'),'V20 reduced-motion CSS missing');
expect(!/transition\s*:\s*all/i.test(css),'V20 must not use transition: all');
expect(!/backdrop-filter/i.test(css),'V20 should not introduce additional backdrop-filter cost');
expect(!css.includes('#plans [data-v14-rate]::after'),'V20 must not override the authored pricing ::after layer');
expect(vite.includes('/cinematic-v20.css')&&vite.includes('/cinematic-v20.js'),'Vite does not inject V20 assets');
expect(pkg.includes('node --check public/cinematic-v20.js'),'Syntax suite does not check V20 runtime');
expect(pkg.includes('node tests/v20-polish-integrity.mjs'),'Integrity suite does not guard V20');
expect(!vite.includes('data-v18-reel')&&!vite.includes('cinematicReel'),'V20 must not restore the removed cinematic reel');
expect(!js.includes("document.createElement('section')"),'V20 must not generate a new homepage section');
expect(Buffer.byteLength(css)<26000,'V20 CSS exceeds 26KB guardrail');
expect(Buffer.byteLength(js)<18000,'V20 JS exceeds 18KB guardrail');
expect(pw.includes('cinematic-v20'),'Playwright config must include V20 regression coverage');

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('V20 polish integrity OK: animated components mount inside the existing eight scenes with pointer/reduced-motion protections and authored pricing layers preserved.');
