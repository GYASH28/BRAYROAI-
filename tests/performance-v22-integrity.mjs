import { readFileSync } from 'node:fs';

const read=path=>readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const index=read('index.html');
const vite=read('vite.config.mjs');
const v16=read('public/experience-motion-v16.js');
const v18=read('public/cinematic-v18.js');
const v20=read('public/cinematic-v20.js');
const perf=read('public/performance-v22.js');
const perfCss=read('public/performance-v22.css');

const requireText=(source,text,label)=>{if(!source.includes(text))throw new Error(`${label} missing: ${text}`)};
const forbid=(source,text,label)=>{if(source.includes(text))throw new Error(`${label} unexpectedly contains: ${text}`)};

// The approved V20 visual/commercial structure remains the source of truth.
for(const text of ['Digital, designed to feel different.','data-scene="hero"','data-scene="services"','data-scene="film"','data-scene="work"','data-scene="ai-systems"','data-scene="plans"','data-scene="founder"','data-scene="contact"'])requireText(index,text,'V20 structure');
for(const rejected of ['Turn missed enquiries into booked customers','BRAYRO Growth Engine'])forbid(`${index}\n${vite}`,rejected,'rejected redesign');

// V22 must be mounted globally without replacing the V18/V20 art-direction layers.
for(const asset of ['/performance-v22.css','/performance-v22.js','/cinematic-v18.css','/cinematic-v18.js','/cinematic-v20.css','/cinematic-v20.js'])requireText(vite,asset,'runtime mount');

// V16: no duplicate hidden pointer engine on the V20 homepage; scene geometry is cached.
requireText(v16,"if (home || !fine || reduced) return;",'V16 homepage pointer dedupe');
requireText(v16,'this.metrics = new Map()','V16 metric cache');
requireText(v16,'bottom < -this.vh * .9 || top > this.vh * 1.9','V16 offscreen budget');
requireText(v16,"CSS.supports?.('view-transition-name: root')",'native transition fallback detection');

// V18: expensive DOM geometry reads happen during refresh, not every painted frame.
requireText(v18,'this.metrics = new Map()','V18 metric cache');
requireText(v18,'paintScene(record,force,y)','V18 cached paint path');
requireText(v18,'bottom < -this.vh*1.15 || top > this.vh*2.15','V18 offscreen scene budget');

// V20: cached scene geometry + cached pointer rects replace repeated layout reads.
requireText(v20,'this.metrics=new Map()','V20 metric cache');
requireText(v20,'record.rect||(record.rect=record.node.getBoundingClientRect())','V20 pointer rect cache');
requireText(v20,"root.style.getPropertyValue('--v19-speed')",'V20 inline speed read');
forbid(v20,"getComputedStyle(root).getPropertyValue('--v19-speed')",'V20 computed-style hot path');

// Adaptive layer: offscreen animation pausing, image scheduling, network-aware prefetch and bounded frame sampling.
for(const text of ['dataset.perfActive','IntersectionObserver','image.loading=\'lazy\'','link.rel=\'prefetch\'','saveData','this.remaining=120'])requireText(perf,text,'V22 scheduler');
requireText(perfCss,'@view-transition{navigation:auto}','cross-document view transitions');
requireText(perfCss,'animation-play-state:paused!important','offscreen animation pause');
forbid(perfCss,'transition: all','performance CSS');

if(Buffer.byteLength(perf,'utf8')>9000)throw new Error('performance-v22.js exceeded 9 KB guardrail');
if(Buffer.byteLength(perfCss,'utf8')>5000)throw new Error('performance-v22.css exceeded 5 KB guardrail');

console.log('V22 performance integrity passed: V20 quality preserved while layout, pointer, offscreen and navigation work is budgeted.');