import fs from 'node:fs';
const read=file=>fs.readFileSync(file,'utf8');
const exists=file=>fs.existsSync(file);
const home=read('index.html');
const v10=read('public/continuity-v10.js');
const v11=read('public/useful-ux-v11.js');
const v11css=read('public/useful-ux-v11.css');
const work=read('public/work-showcase-v8.js');
const errors=[];
const expect=(condition,message)=>{if(!condition)errors.push(message)};

expect(exists('public/useful-ux-v11.js')&&exists('public/useful-ux-v11.css'),'V11 assets missing');
expect(v10.includes("link.href='/useful-ux-v11.css'")&&v10.includes("script.src='/useful-ux-v11.js'"),'V11 is not mounted from Continuity V10');
for(const token of ['class UsefulSecondSceneV11','class WorkReliabilityV11','class ContactHelpersV11','class MobileQuickActionsV11'])expect(v11.includes(token),`V11 runtime missing ${token}`);
for(const token of ['START WITH THE PROBLEM','A better website should','People do not get it fast enough','Enquiries arrive with no context','The website keeps becoming outdated','outcome:'])expect(v11.includes(token),`problem-first second scene missing ${token}`);
expect(v11.includes("this.section.dataset.scene='outcomes'"),'second scene is not converted from generic services to outcomes');
expect(v11.includes("mobileImage.src='/assets/fakhrimart-case-mobile.png'"),'FakhriMart mobile proof is not using the real mobile asset');
expect(v11.includes("this.section.querySelector('[data-work-toggle]')?.remove()")&&v11.includes("this.section.querySelector('.v8-work-chapters')?.remove()"),'duplicate Work controls are not retired');
expect(work.includes('this.scrollAuto=innerWidth>=981&&!reduced'),'Work auto choreography must be desktop-only');
expect(work.includes('performance.now()+7000'),'manual Work mode must stay stable long enough to inspect');
expect(work.includes("this.legacyToggle.hidden=true")&&work.includes("this.stage.dispatchEvent(new CustomEvent('brayro:workmode'"),'Work state source-of-truth hardening missing');
expect(work.includes("const group=button.closest('.v8-work-modebar,.v8-work-chapters')"),'Work keyboard navigation is not scoped to the active control group');
for(const token of ['.work__toggle,.v8-work-chapters,.v8-work-progress{display:none!important}','@media(min-width:981px)','#work .v8-work-modebar{display:none!important}','@media(max-width:980px)','#work .v9-proof-reel{display:none!important}','.v11-mobile-actions','.v11-contact-tools'])expect(v11css.includes(token),`V11 CSS missing ${token}`);
expect(v11css.includes('@media(prefers-reduced-motion:reduce)'),'V11 reduced-motion safeguards missing');
expect(!/transition\s*:\s*all/i.test(v11css),'V11 contains prohibited transition: all');
expect(Buffer.byteLength(v11css)<18000,'V11 CSS exceeds 18KB guardrail');
expect(Buffer.byteLength(v11)<18000,'V11 JS exceeds 18KB guardrail');
expect((home.match(/data-scene=/g)||[]).length===7,'homepage static architecture must remain seven scenes before V11 enhancement');
for(const price of ['₹2,599','₹3,999','₹5,999+','₹9,999','₹17,999','₹25K–₹35K+'])expect(home.includes(price),`homepage pricing changed: ${price}`);

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('V11 integrity OK: useful second scene, stable client proof and user-friendly helpers checked');
