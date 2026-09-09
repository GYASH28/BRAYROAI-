import { readFileSync } from 'node:fs';

const read=path=>readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const index=read('index.html');
const plans=read('plans.html');
const vite=read('vite.config.mjs');

const requireText=(source,text,label)=>{
  if(!source.includes(text)) throw new Error(`${label} missing: ${text}`);
};
const forbid=(source,text,label)=>{
  if(source.includes(text)) throw new Error(`${label} unexpectedly contains: ${text}`);
};

// V20's visual/content skeleton is the source of truth for this safety pass.
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
const expectedScenes=['hero','services','film','work','ai-systems','plans','founder','contact'];
for(const scene of expectedScenes){
  if(!sceneIds.includes(scene)) throw new Error(`V20 scene removed: ${scene}`);
}

// Pricing architecture must remain unchanged unless deliberately reviewed later.
for(const price of ['₹2,599','₹3,999','₹5,999+','₹9,999','₹17,999','₹25K–₹35K+','₹29,999+','₹2,999/mo+']){
  requireText(`${index}\n${plans}`,price,'existing pricing');
}

// Prevent the rejected V21 redesign from creeping back into this branch.
for(const rejected of ['Turn missed enquiries into booked customers','BRAYRO Growth Engine','AI Operations — from','/uae','/us']){
  forbid(`${index}\n${plans}\n${vite}`,rejected,'safe V20 branch');
}

// This pass is intentionally limited to deterministic supporting-copy and metadata polish.
requireText(vite,'built to make your business easier to understand, trust and use','safe hero support copy');
requireText(vite,'A real client website, built for browsing and enquiries.','safe proof copy');
requireText(vite,'smallest sensible scope—not force a bigger package','safe contact reassurance');
requireText(vite,'rel="canonical"','canonical metadata');
requireText(vite,'data-safe-v20-meta','safe metadata marker');

// V18/V20 cinematic layers must remain mounted exactly as the current production architecture expects.
requireText(vite,'/cinematic-v18.css','V18 cinematic CSS');
requireText(vite,'/cinematic-v18.js','V18 cinematic JS');
requireText(vite,'/cinematic-v20.css','V20 cinematic CSS');
requireText(vite,'/cinematic-v20.js','V20 cinematic JS');

console.log('Safe V20 polish integrity passed: visual structure and pricing preserved; only scoped copy/metadata refinements are allowed.');
