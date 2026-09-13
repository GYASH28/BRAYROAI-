import { readFileSync } from 'node:fs';

const read=path=>readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const clients=read('clients.html');
const fakhri=read('fakhrimart-case-study.html');
const js=read('public/client-work.js');
const css=read('public/client-work.css');
const vite=read('vite.config.mjs');
const vercel=read('vercel.json');
const errors=[];
const expect=(condition,message)=>{if(!condition)errors.push(message)};

for(const token of ['BRAYROAI / CLIENT ARCHIVE','data-client-filter="live"','data-client-filter="in-progress"','data-client-filter="upcoming"','data-client-grid','No invented outcome metrics'])expect(clients.includes(token),`Client archive missing ${token}`);
for(const token of ['FakhriMart','VERIFIED CLIENT / 2026 / PUNE · INDIA','Not a fake ecommerce store.','CATALOGUE ARCHITECTURE','DECISION SUPPORT','ENQUIRY FLOW','React 19','Vite 6','React Router 8','No fabricated conversion uplift','https://fakhriyarns.vercel.app/'])expect(fakhri.includes(token),`FakhriMart case study missing ${token}`);
for(const token of ['const CLIENTS = [','slug: \'fakhrimart\'','status: \'live\'','caseStudy: \'/clients/fakhrimart\'','window.BRAYRO_CLIENTS','class ClientArchive','class CaseStudyTimeline'])expect(js.includes(token),`Client registry/runtime missing ${token}`);
for(const token of ['.client-grid','.client-card','.case-hero','.case-flow','.case-outcome','@media(prefers-reduced-motion:reduce)'])expect(css.includes(token),`Client work CSS missing ${token}`);

expect(vite.includes("if(filename.endsWith('/clients.html')) return '/clients'"),'Vite canonical path missing /clients');
expect(vite.includes("if(filename.endsWith('/fakhrimart-case-study.html')) return '/clients/fakhrimart'"),'Vite canonical path missing FakhriMart case study');
expect(vite.includes("clients:resolve(process.cwd(),'clients.html')"),'Vite input missing clients archive');
expect(vite.includes("fakhrimartCase:resolve(process.cwd(),'fakhrimart-case-study.html')"),'Vite input missing FakhriMart case study');
expect(vite.includes('data-client-archive-link')&&vite.includes('data-fakhri-case-link'),'Homepage does not expose client publishing routes');
expect(vercel.includes('{"source":"/clients","destination":"/clients.html"}'),'Vercel /clients rewrite missing');
expect(vercel.includes('{"source":"/clients/fakhrimart","destination":"/fakhrimart-case-study.html"}'),'Vercel FakhriMart rewrite missing');
expect(vercel.includes('{"source":"/case-studies/fakhrimart","destination":"/clients/fakhrimart"'),'Legacy FakhriMart case route does not redirect to new case study');
expect(vercel.includes('client-work.css|client-work.js'),'Client work assets missing from Vercel cache policy');

expect(!/\b\d+%\b/.test(fakhri),'FakhriMart case study contains an unverified percentage claim');
expect(!/testimonial/i.test(fakhri),'FakhriMart case study should not invent a testimonial');
expect(js.includes("matchMedia('(prefers-reduced-motion: reduce)')"),'Client runtime missing reduced-motion handling');
expect(Buffer.byteLength(js)<10000,'Client work JS exceeds 10KB guardrail');
expect(Buffer.byteLength(css)<26000,'Client work CSS exceeds 26KB guardrail');

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Client work integrity passed: scalable archive, verified FakhriMart case study, routes and no-fake-metrics contract are intact.');
