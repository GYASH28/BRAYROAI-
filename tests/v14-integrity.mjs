import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const exists=file=>fs.existsSync(path.join(root,file));
const css=read('public/brayro-v14.css');
const js=read('public/brayro-v14.js');
const vite=read('vite.config.mjs');
const plans=read('plans.html');
const errors=[];
const expect=(condition,message)=>{if(!condition)errors.push(message)};

for(const token of ['.brayro-film','.brayro-film__sticky','.brayro-film__frame','.brayro-film__copy','.brayro-rates','.brayro-rate','.v14-work-polish'])expect(css.includes(token),`V14 CSS missing ${token}`);
for(const token of ['class CinematicCapabilities','class CinematicPricingPreview','class FilmPolish','data-v14-frame','data-v14-rate'])expect(js.includes(token),`V14 runtime missing ${token}`);
expect(js.includes("label:'USEFUL AI'")&&js.includes('No robot imagery. No fake intelligence theatre.'),'V14 practical AI cut must stay visually restrained');
expect(js.includes('Website partnership')&&js.includes('Complete website build')&&js.includes('AI systems'),'V14 homepage rate card must keep exactly three decision paths');
expect(css.includes('@media(prefers-reduced-motion:reduce)'),'V14 reduced-motion fallback is missing');
expect(!/brayro-ledger|v12-story__orb/i.test(css+js),'V14 must not reintroduce the retired ledger/orb visual language');
expect(!/transition\s*:\s*all/i.test(css),'V14 contains prohibited transition: all');
expect(Buffer.byteLength(css)<26000,'V14 CSS exceeds 26KB guardrail');
expect(Buffer.byteLength(js)<18000,'V14 JS exceeds 18KB guardrail');
expect(vite.includes('/brayro-v14.css')&&vite.includes('/brayro-v14.js'),'V14 assets are not mounted by the Vite homepage transform');
expect(exists('public/brayro-v14.css')&&exists('public/brayro-v14.js'),'V14 public assets are missing');

// The detailed pricing page is deliberately not redesigned by V14.
expect((plans.match(/class="build-card/g)||[]).length===6,'Detailed /plans website cards must remain intact');
expect((plans.match(/class="ai-plan-card/g)||[]).length===2,'Detailed /plans AI cards must remain intact');
expect(plans.includes('Knowledge Care')&&plans.includes('From ₹2,999/mo'),'Detailed /plans content must remain intact');

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('V14 integrity OK: cinematic capability film, three-choice homepage rate card, performance limits and untouched detailed pricing verified');
