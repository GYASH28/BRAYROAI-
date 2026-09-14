import { readFileSync } from 'node:fs';

const read=path=>readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const index=read('index.html');
const plans=read('plans.html');
const vite=read('vite.config.mjs');

const requireText=(source,text,label)=>{if(!source.includes(text))throw new Error(`${label} missing: ${text}`)};
const forbid=(source,text,label)=>{if(source.includes(text))throw new Error(`${label} unexpectedly contains: ${text}`)};

requireText(index,'Digital, designed to feel different.','V20 hero headline');
requireText(index,'class="scene hero"','hero scene');
requireText(index,'class="scene v12-capabilities"','capabilities scene');
requireText(index,'class="scene film editorial-sequence"','editorial scene');
requireText(index,'id="work" class="scene v12-work"','work scene');
requireText(index,'id="ai-systems" class="scene v12-ai-products"','AI scene');
requireText(index,'id="plans" class="scene plans-preview"','plans scene');
requireText(index,'id="studio" class="scene founder-preview"','founder scene');
requireText(index,'id="contact" class="scene close"','contact scene');

const sceneIds=[...index.matchAll(/data-scene="([^"]+)"/g)].map(match=>match[1]);
for(const scene of ['hero','services','film','work','ai-systems','plans','founder','contact'])if(!sceneIds.includes(scene))throw new Error(`V20 scene removed: ${scene}`);
for(const price of ['₹2,599','₹3,999','₹5,999+','₹9,999','₹17,999','₹25K–₹35K+','₹29,999+','₹2,999/mo+'])requireText(`${index}\n${plans}`,price,'existing pricing');
for(const rejected of ['Turn missed enquiries into booked customers','BRAYRO Growth Engine','AI Operations — from','/uae','/us'])forbid(`${index}\n${plans}\n${vite}`,rejected,'safe V20 branch');

requireText(vite,'built to make businesses easier to understand and trust','safe hero support copy');
requireText(vite,'A real client website, built for browsing and enquiries.','safe proof copy');
requireText(vite,'smallest sensible scope—not force a bigger package','safe contact reassurance');
requireText(vite,'rel="canonical"','canonical metadata');
requireText(vite,'data-safe-v20-meta','safe metadata marker');
requireText(vite,'data-layout-stable-fonts','layout-stable hero typography');
requireText(vite,'.opening-sequence{animation:openingAway 0s .90s both}','crisper desktop opening');
requireText(vite,'.opening-sequence{animation-delay:.80s}','crisper mobile opening');
requireText(vite,"'cinematic-v18.css'",'V18 cinematic CSS bundle source');
requireText(vite,'/cinematic-v18.js','V18 cinematic JS');
requireText(vite,"'cinematic-v20.css'",'V20 cinematic CSS bundle source');
requireText(vite,'/cinematic-v20.js','V20 cinematic JS');
if(!(vite.includes("fileName:'assets/brayro-home.css'")||vite.includes("fileName: 'assets/brayro-home.css'")))throw new Error('homepage CSS bundle output missing');

console.log('Safe V20 polish integrity passed: visual structure and pricing preserved; scoped copy, metadata and production bundling remain intact.');
