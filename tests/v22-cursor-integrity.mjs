import fs from 'node:fs';

const read=file=>fs.readFileSync(file,'utf8');
const errors=[];
const expect=(condition,message)=>{if(!condition)errors.push(message)};
const js=read('public/brayro-cursor-v22.js');
const css=read('public/brayro-cursor-v22.css');
const vite=read('vite.config.mjs');
const pw=read('playwright.config.mjs');

for(const token of ['v22CursorMounted','data.v22CursorPage','setMode','resolveTarget','paintReactiveSurface','paintMagnet','requestAnimationFrame'])expect(js.includes(token),`V22 cursor runtime missing ${token}`);
for(const token of ['.v22-cursor','.v22-cursor__dot','.v22-cursor__echo','is-action','is-media','is-control','is-reading','data-v22-cursor-page="plans"','data-v22-cursor-page="case"'])expect(css.includes(token),`V22 cursor CSS missing ${token}`);
expect(js.includes("matchMedia('(prefers-reduced-motion: reduce)')")&&js.includes("matchMedia('(hover:hover) and (pointer:fine)')"),'V22 cursor input/reduced-motion guards missing');
expect(!/mix-blend-mode|backdrop-filter/i.test(css),'V22 cursor must avoid Firefox-expensive compositing effects');
expect(!/transition\s*:\s*all/i.test(css),'V22 cursor must not use transition: all');
expect(vite.includes("'brayro-cursor-v22.css'")&&vite.includes('/brayro-cursor-v22.js'),'Vite does not mount V22 cursor globally');
expect(pw.includes('firefox-smoke')&&pw.includes("Desktop Firefox"),'Targeted Firefox browser coverage missing');
expect(Buffer.byteLength(js)<22000,'V22 cursor JS exceeds 22KB guardrail');
expect(Buffer.byteLength(css)<14000,'V22 cursor CSS exceeds 14KB guardrail');

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('V22 cursor integrity OK: one compositor-friendly pointer runtime, page personalities and Firefox smoke coverage are intact.');
