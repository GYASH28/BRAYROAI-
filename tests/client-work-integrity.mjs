import { readFileSync } from 'node:fs';

const read=path=>readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const clients=read('clients.html');
const fakhri=read('fakhrimart-case-study.html');
const js=read('public/client-work.js');
const css=read('public/client-work.css');
const a11yCss=read('public/client-work-accessibility.css');
const vite=read('vite.config.mjs');
const vercel=read('vercel.json');
const materializer=read('scripts/materialize-clean-routes.mjs');
const pkg=read('package.json');
const errors=[];
const expect=(condition,message)=>{if(!condition)errors.push(message)};

for(const token of ['BRAYROAI / CLIENT ARCHIVE','data-client-filter="live"','data-client-filter="in-progress"','data-client-filter="upcoming"','data-client-grid','No invented outcome metrics'])expect(clients.includes(token),`Client archive missing ${token}`);
for(const token of ['FakhriMart','VERIFIED CLIENT / 2026 / PUNE · INDIA','Not a fake ecommerce store.','CATALOGUE ARCHITECTURE','DECISION SUPPORT','ENQUIRY FLOW','React 19','Vite 6','React Router 8','No fabricated conversion uplift','https://fakhriyarns.vercel.app/'])expect(fakhri.includes(token),`FakhriMart case study missing ${token}`);
for(const token of ['const CLIENTS = [','slug: \'fakhrimart\'','status: \'live\'','caseStudy: \'/clients/fakhrimart\'','window.BRAYRO_CLIENTS','class ClientArchive','class CaseStudyTimeline','ensureAccessibilityStyles','/client-work-accessibility.css'])expect(js.includes(token),`Client registry/runtime missing ${token}`);
for(const token of ['.client-grid','.client-card','.case-hero','.case-flow','.case-outcome','@media(prefers-reduced-motion:reduce)'])expect(css.includes(token),`Client work CSS missing ${token}`);
expect(a11yCss.includes('.client-close__action')&&a11yCss.includes('color:var(--cw-ink)!important'),'Client CTA accessibility contrast fix is missing');
expect(a11yCss.includes(':focus-visible'),'Client CTA keyboard focus treatment is missing');

// Route assertions intentionally ignore formatter/spacing changes. They verify
// both clean-route middleware and canonical/build-input ownership.
expect(/['"]\/clients['"]\s*:\s*['"]\/clients\.html['"]/.test(vite),'Vite clean route missing /clients');
expect(/['"]\/clients\/fakhrimart['"]\s*:\s*['"]\/fakhrimart-case-study\.html['"]/.test(vite),'Vite clean route missing FakhriMart case study');
expect(/clients\.html['"]\)\)\s*return\s*['"]\/clients['"]/.test(vite),'Vite canonical path missing /clients');
expect(/fakhrimart-case-study\.html['"]\)\)\s*return\s*['"]\/clients\/fakhrimart['"]/.test(vite),'Vite canonical path missing FakhriMart case study');
expect(/clients\s*:\s*resolve\(process\.cwd\(\),\s*['"]clients\.html['"]\)/.test(vite),'Vite input missing clients archive');
expect(/fakhrimartCase\s*:\s*resolve\(process\.cwd\(\),\s*['"]fakhrimart-case-study\.html['"]\)/.test(vite),'Vite input missing FakhriMart case study');
expect(vite.includes('data-client-archive-link')&&vite.includes('data-fakhri-case-link'),'Homepage does not expose client publishing routes');
expect(vercel.includes('{"source":"/clients","destination":"/clients.html"}'),'Vercel /clients rewrite missing');
expect(vercel.includes('{"source":"/clients/fakhrimart","destination":"/fakhrimart-case-study.html"}'),'Vercel FakhriMart rewrite missing');
expect(vercel.includes('{"source":"/case-studies/fakhrimart","destination":"/clients/fakhrimart"'),'Legacy FakhriMart case route does not redirect to new case study');
expect(vercel.includes('client-work.css|client-work.js'),'Client work assets missing from Vercel cache policy');
expect(materializer.includes("['clients.html', 'clients/index.html'")&&materializer.includes("['fakhrimart-case-study.html', 'clients/fakhrimart/index.html'"),'Physical clean-route materialization is missing');
expect(pkg.includes('scripts/materialize-clean-routes.mjs')&&pkg.includes('tests/dist-integrity.mjs'),'Build does not materialize and verify clean static routes');

expect(!/\b\d+%\b/.test(fakhri),'FakhriMart case study contains an unverified percentage claim');
expect(!fakhri.includes('class="client-testimonial"'),'FakhriMart case study contains an unsupported testimonial component');
expect(fakhri.includes('No fabricated conversion uplift, revenue percentage or customer testimonial.'),'No-fake-proof statement is missing');
expect(js.includes("matchMedia('(prefers-reduced-motion: reduce)')"),'Client runtime missing reduced-motion handling');
expect(Buffer.byteLength(js)<11000,'Client work JS exceeds 11KB guardrail');
expect(Buffer.byteLength(css)<26000,'Client work CSS exceeds 26KB guardrail');
expect(Buffer.byteLength(a11yCss)<2000,'Client accessibility CSS exceeds 2KB guardrail');

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Client work integrity passed: verified case study, accessible CTA, clean routes and no-fake-metrics contract are intact.');
