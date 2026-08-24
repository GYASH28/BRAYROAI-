import fs from 'node:fs';
const read=file=>fs.readFileSync(file,'utf8');
const home=read('index.html');
const css=read('public/stability-v12.css');
const js=read('public/stability-v12.js');
const pkg=read('package.json');
const errors=[];
const expect=(condition,message)=>{if(!condition)errors.push(message)};

expect(home.includes('id="outcomes" class="scene useful-outcomes"'),'second scene is not static outcomes HTML');
expect(!home.includes('id="services" class="scene services"'),'legacy Services scene still exists in static homepage');
expect(home.includes('href="#outcomes">What we fix'),'desktop navigation does not point at static outcomes');
expect(home.includes('data-v12-outcome="clarity"')&&home.includes('data-v12-outcome="enquiries"')&&home.includes('data-v12-outcome="system"'),'static outcomes tabs missing');
expect(home.includes('Make the business obvious in seconds.'),'static first-paint outcome content missing');
expect(home.includes('class="v12-outcome-strip"'),'useful deliverable strip missing');
expect(home.includes('href="/useful-ux-v11.css" data-useful-ux-v11'),'V11 styling is not first-paint CSS');
expect(home.includes('src="/stability-v12.js"'),'V12 runtime missing from homepage');
expect((home.match(/data-scene=/g)||[]).length===7,'homepage must remain exactly seven scenes');
for(const price of ['₹2,599','₹3,999','₹5,999+','₹9,999','₹17,999','₹25K–₹35K+'])expect(home.includes(price),`homepage pricing changed: ${price}`);

for(const token of ['#outcomes.useful-outcomes','.hero__copy','.hero__subject','@media(max-width:760px)','.v12-outcome-strip'])expect(css.includes(token),`V12 CSS missing ${token}`);
expect(css.includes('content-visibility:visible!important'),'outcomes scene can still be deferred/blanked');
expect(!/transition\s*:\s*all/i.test(css),'V12 CSS contains prohibited transition: all');
expect(Buffer.byteLength(css)<16000,'V12 CSS exceeds 16KB guardrail');
for(const token of ['class StaticOutcomesV12','data-v12-outcome','link.href=\'/stability-v12.css\'','body.classList.add(\'v12-ready\')'])expect(js.includes(token),`V12 runtime missing ${token}`);
expect(Buffer.byteLength(js)<10000,'V12 JS exceeds 10KB guardrail');
expect(pkg.includes('node --check public/stability-v12.js'),'syntax suite does not check V12');
expect(pkg.includes('node tests/v12-integrity.mjs'),'integrity suite does not enforce V12');

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('V12 integrity OK: static second scene, authoritative hero geometry and seven-scene architecture checked');
