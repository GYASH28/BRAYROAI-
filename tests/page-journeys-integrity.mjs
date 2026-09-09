import fs from 'node:fs';

const read=file=>fs.readFileSync(file,'utf8');
const exists=file=>fs.existsSync(file);
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
const isV21=exists('tests/v21-growth-integrity.mjs');
const errors=[];
const expect=(condition,message)=>{if(!condition)errors.push(message)};

if(isV21){
  expect(plans.includes('Pay for a connected outcome')&&plans.includes('WHAT CHANGES THE PRICE?'),'V21 plans do not support clear commercial decision-making');
  expect(plans.includes('Growth Engine')&&plans.includes('AI Operations')&&plans.includes('Custom Digital Systems'),'V21 plans do not expose the three primary paths');
  expect((plans.match(/href="\/audit"/g)||[]).length>=3,'V21 plans do not provide enough direct audit actions');
  expect(plans.includes('From US$1,500')&&plans.includes('From US$2,500')&&plans.includes('US$3,000–$15,000+'),'V21 plans do not provide transparent qualification ranges');

  expect(founder.includes('YASH GANESH / FOUNDER · PUNE, INDIA'),'V21 founder identity and operating base are unclear');
  expect(founder.includes('No fake offices')&&founder.includes('No invented metrics'),'V21 founder trust standards are incomplete');
  expect(founder.includes('Book an AI Growth Audit')&&founder.includes('See verified work'),'V21 founder page lacks useful next actions');
  expect(founder.includes('/assets/about-yash.webp'),'V21 founder page is missing the real founder visual');

  expect(home.includes('Book an AI Growth Audit')&&home.includes('See how the system works'),'V21 homepage does not prioritize the audit and product explanation paths');
  expect(home.includes('data-ig-whatsapp-context')||home.includes('wa.me/919175524637'),'V21 homepage lacks a direct WhatsApp contact path');
  expect(home.includes('FEATURED CLIENT / FAKHRIMART'),'V21 homepage does not connect buyer decisions to verified proof');

  expect(exists('privacy.html')&&read('privacy.html').includes('Nothing is represented as stored in a BRAYROAI database'),'V21 privacy journey does not explain current Audit behavior');
  expect(exists('404.html')&&read('404.html').includes('This page missed the pipeline.'),'V21 has no useful branded not-found journey');
}else{
  expect(plans.includes('compare-hint')&&plans.includes('Swipe sideways to compare every column.'),'Plans mobile comparison guidance is missing');
  expect(plansJs.includes('class PlansBriefs')&&plansJs.includes('Approximate budget and target date:'),'Plans CTAs do not prefill a useful brief');
  expect(plansCss.includes('.compare-hint')&&plansCss.includes('.compare-hint { display:block; }'),'Plans comparison hint is not responsive');
  expect(plans.includes('AI Workflow Audit')&&plans.includes('Company Second Brain')&&plans.includes('Knowledge Care'),'Plans AI decision path is missing');

  expect(founder.includes('data-founder-colour-toggle')&&founder.includes('data-founder-project-cta'),'Founder page lacks accessible portrait and project actions');
  expect(founderJs.includes('setLocked(locked)')&&founderJs.includes('What should the website or product help people do:'),'Founder interactions do not support keyboard/touch or a usable project brief');
  expect(founderCss.includes('.is-revealed .founder-hero__image--colour')&&founderCss.includes('.founder-close__note'),'Founder visual and CTA feedback styles are missing');

  for(const [name,page] of [['home',home],['plans',plans],['founder',founder],['terms',terms]])expect(page.includes('/contact-priority.css')&&page.includes('/contact-priority.js')&&page.includes('/visual-finish.css'),`${name} is missing shared contact or visual finish assets`);
  expect(home.includes('data-project-whatsapp')&&home.includes('Start a project'),'Homepage does not prioritize a direct project start path');
  expect(home.includes('href="#ai-systems"')&&home.includes('Plan the system'),'Homepage AI products do not expose a clear decision/action path');
  expect(plansJs.includes('https://wa.me/919175524637')&&plansJs.includes('plan-email-fallback'),'Plans do not offer WhatsApp first with an email fallback');
  expect(founderJs.includes('https://wa.me/919175524637')&&founderJs.includes('founder-email-fallback'),'Founder page does not offer WhatsApp first with an email fallback');
}

// Terms remain a production contract surface across both architectures.
expect(terms.includes('terms-quick')&&terms.includes('The four things most clients need to know.'),'Terms quick-answer guide is missing');
expect(termsJs.includes('navLinks')&&termsJs.includes('.terms-quick a'),'Terms navigation does not keep quick links and nav links in sync');
expect(termsCss.includes('.terms-quick__grid')&&termsCss.includes('grid-template-columns:1fr'),'Terms quick-answer layout is not responsive');
expect(terms.includes('Ask on WhatsApp')&&terms.includes('terms-close__email'),'Terms page does not provide both contact paths');

// Legacy shared contact assets remain available to the production pages that still use them.
expect(contactJs.includes('brayro-contact-dock')&&contactCss.includes('.brayro-contact-dock'),'Shared WhatsApp/email contact dock is missing');
expect(fs.existsSync('public/visual-finish.css')&&read('public/visual-finish.css').includes('visual finishing pass'),'Shared visual finishing pass is missing');

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Page journey integrity OK: current commercial routes keep clear decisions, proof, trust and contact paths.');
