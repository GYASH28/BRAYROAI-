import fs from 'node:fs';

const read=file=>fs.readFileSync(file,'utf8');
const exists=file=>fs.existsSync(file);
const loader=read('public/art-direction-v7.js');
const css=read('public/continuity-v10.css');
const js=read('public/continuity-v10.js');
const pkg=read('package.json');
const errors=[];
const expect=(condition,message)=>{if(!condition)errors.push(message)};

expect(exists('public/continuity-v10.css'),'missing continuity-v10.css');
expect(exists('public/continuity-v10.js'),'missing continuity-v10.js');
expect(loader.includes("link.href = '/continuity-v10.css'"),'V10 CSS is not mounted after V9');
expect(loader.includes("script.src = '/continuity-v10.js'"),'V10 JS is not mounted after V9');
for(const token of ['@view-transition','.v10-snap-status','.v10-keyboard-hint','.v10-pressable','body.v10-leaving::after','main::before']) expect(css.includes(token),`V10 CSS missing ${token}`);
for(const token of ['class PageTransitionsV10','class AtmosphereV10','class KeyboardGroupsV10','class PricingFocusV10','class MobileSnapV10','class PressFeedbackV10','class PrefetchV10']) expect(js.includes(token),`V10 runtime missing ${token}`);
expect(css.includes('@media(prefers-reduced-motion:reduce)'),'V10 reduced-motion CSS missing');
expect(js.includes("matchMedia('(prefers-reduced-motion: reduce)')"),'V10 reduced-motion runtime missing');
expect(!/transition\s*:\s*all/i.test(css),'V10 contains prohibited transition: all');
expect(Buffer.byteLength(css)<14000,'V10 CSS exceeds 14KB guardrail');
expect(Buffer.byteLength(js)<14000,'V10 JS exceeds 14KB guardrail');
expect(pkg.includes('node --check public/art-direction-v9.js'),'syntax suite does not check V9');
expect(pkg.includes('node --check public/continuity-v10.js'),'syntax suite does not check V10');
expect(pkg.includes('node tests/v10-integrity.mjs'),'qa:static does not enforce V10 integrity');

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('V10 integrity OK: cross-page continuity, atmosphere, keyboard, snap and reduced-motion contracts checked');
