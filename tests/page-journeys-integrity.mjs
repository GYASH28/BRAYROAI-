import fs from 'node:fs';

const read=file=>fs.readFileSync(file,'utf8');
const plans=read('plans.html');
const plansJs=read('public/plans-page.js');
const plansCss=read('public/plans-page.css');
const founder=read('founder.html');
const founderJs=read('public/founder-page.js');
const founderCss=read('public/founder-page.css');
const terms=read('terms.html');
const termsJs=read('public/terms-page.js');
const termsCss=read('public/terms-page.css');
const contactJs=read('public/contact-priority.js');
const contactCss=read('public/contact-priority.css');
const home=read('index.html');
const errors=[];
const expect=(condition,message)=>{if(!condition)errors.push(message)};

expect(plans.includes('compare-hint')&&plans.includes('Swipe sideways to compare every column.'),'Plans mobile comparison guidance is missing');
expect(plansJs.includes('class PlansBriefs')&&plansJs.includes('Approximate budget and target date:'),'Plans CTAs do not prefill a useful brief');
expect(plansCss.includes('.compare-hint')&&plansCss.includes('.compare-hint { display:block; }'),'Plans comparison hint is not responsive');

expect(founder.includes('data-founder-colour-toggle')&&founder.includes('data-founder-project-cta'),'Founder page lacks accessible portrait and project actions');
expect(founderJs.includes('setLocked(locked)')&&founderJs.includes('What should the website or product help people do:'),'Founder interactions do not support keyboard/touch or a usable project brief');
expect(founderCss.includes('.is-revealed .founder-hero__image--colour')&&founderCss.includes('.founder-close__note'),'Founder visual and CTA feedback styles are missing');

expect(terms.includes('terms-quick')&&terms.includes('The four things most clients need to know.'),'Terms quick-answer guide is missing');
expect(termsJs.includes('navLinks')&&termsJs.includes('.terms-quick a'),'Terms navigation does not keep quick links and nav links in sync');
expect(termsCss.includes('.terms-quick__grid')&&termsCss.includes('grid-template-columns:1fr'),'Terms quick-answer layout is not responsive');

for(const [name,page] of [['home',home],['plans',plans],['founder',founder],['terms',terms]])expect(page.includes('/contact-priority.css')&&page.includes('/contact-priority.js')&&page.includes('/visual-finish.css'),`${name} is missing shared contact or visual finish assets`);
expect(home.includes('data-project-whatsapp')&&home.includes('Chat on WhatsApp'),'Homepage does not prioritize WhatsApp at the project CTA');
expect(plansJs.includes('https://wa.me/919175524637')&&plansJs.includes('plan-email-fallback'),'Plans do not offer WhatsApp first with an email fallback');
expect(founderJs.includes('https://wa.me/919175524637')&&founderJs.includes('founder-email-fallback'),'Founder page does not offer WhatsApp first with an email fallback');
expect(terms.includes('Ask on WhatsApp')&&terms.includes('terms-close__email'),'Terms page does not provide both contact paths');
expect(contactJs.includes('brayro-contact-dock')&&contactCss.includes('.brayro-contact-dock'),'Shared WhatsApp/email contact dock is missing');
expect(fs.existsSync('public/visual-finish.css')&&read('public/visual-finish.css').includes('visual finishing pass'),'Shared visual finishing pass is missing');

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Page journey integrity OK: Plans, Founder and Terms keep their decision-making and accessibility improvements.');
