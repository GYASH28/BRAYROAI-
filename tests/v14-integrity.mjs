import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(),read=file=>fs.readFileSync(path.join(root,file),'utf8'),exists=file=>fs.existsSync(path.join(root,file)),errors=[],expect=(condition,message)=>{if(!condition)errors.push(message)};
const css=read('public/brayro-v14.css'),polish=read('public/brayro-v14-polish.css'),js=read('public/brayro-v14.js'),vite=read('vite.config.mjs'),plans=read('plans.html');

for(const token of ['.brayro-rates','.brayro-rate','.v14-work-polish'])expect(css.includes(token),`V14 CSS missing ${token}`);
for(const token of ['#ai-systems .v12-ai-grid','#ai-systems .v12-product-card','.close__orb{display:none'])expect(polish.includes(token),`V14 polish missing ${token}`);
for(const token of ['class CinematicPricingPreview','data-v14-rate','Website partnership','Complete website build','AI systems'])expect(js.includes(token),`V14 pricing runtime missing ${token}`);
for(const retired of ['class CinematicCapabilities','class FilmPolish','data-v14-frame','CAPABILITY FILM'])expect(!js.includes(retired),`replaced V14 film runtime still ships: ${retired}`);
expect(!css.includes('.brayro-film'),'replaced V14 film CSS still ships');
expect(!js.includes("addEventListener('scroll'"),'V14 compatibility layer must not own another scroll loop');
expect(css.includes('@media(prefers-reduced-motion:reduce)')&&polish.includes('@media(prefers-reduced-motion:reduce)'),'V14 reduced-motion fallback is missing');
expect(!/transition\s*:\s*all/i.test(css+polish),'V14 contains prohibited transition: all');
expect(Buffer.byteLength(css)<14000,'V14 CSS exceeds 14KB after retired film purge');
expect(Buffer.byteLength(polish)<9000,'V14 finishing CSS exceeds 9KB guardrail');
expect(Buffer.byteLength(js)<9000,'V14 pricing JS exceeds 9KB after retired film purge');
expect(vite.includes("'brayro-v14.css'")&&vite.includes("'brayro-v14-polish.css'")&&vite.includes('/brayro-v14.js'),'V14 assets are not owned by the Vite homepage build');
expect(vite.includes("fileName:'assets/brayro-home.css'")||vite.includes("fileName: 'assets/brayro-home.css'"),'V14 CSS is not assigned to the consolidated homepage stylesheet');
expect(exists('public/brayro-v14.css')&&exists('public/brayro-v14-polish.css')&&exists('public/brayro-v14.js'),'V14 public assets are missing');
expect((plans.match(/class="build-card/g)||[]).length===6,'Detailed /plans website cards must remain intact');
expect((plans.match(/class="ai-plan-card/g)||[]).length===2,'Detailed /plans AI cards must remain intact');
expect(plans.includes('Knowledge Care')&&plans.includes('From ₹2,999/mo'),'Detailed /plans content must remain intact');

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('V14 integrity OK: three-choice rate card retained; replaced film runtime/CSS and duplicate scroll work removed.');
