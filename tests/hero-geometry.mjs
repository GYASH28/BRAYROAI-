import { chromium } from '@playwright/test';

const base=process.env.BASE_URL||'http://127.0.0.1:4173';
const viewports=[[320,720],[390,844],[768,1024],[1440,900],[1920,1080]];
const browser=await chromium.launch({headless:true});
const context=await browser.newContext();
const page=await context.newPage();
let failed=false;

for(const [width,height] of viewports){
  await page.setViewportSize({width,height});
  await page.goto(`${base}/`,{waitUntil:'networkidle'});
  await page.evaluate(()=>{document.querySelectorAll('.opening-sequence,.scope-open,.founder-open').forEach(n=>n.remove());document.body.classList.remove('polish-opening','hf-intro-active')});
  await page.waitForSelector('link[data-stability-v12]',{state:'attached'});
  await page.waitForFunction(()=>document.body.classList.contains('v12-ready'));
  const m=await page.evaluate(()=>{
    const rect=selector=>{const r=document.querySelector(selector).getBoundingClientRect();return {left:+r.left.toFixed(2),right:+r.right.toFixed(2),top:+r.top.toFixed(2),bottom:+r.bottom.toFixed(2),width:+r.width.toFixed(2),height:+r.height.toFixed(2)}};
    const copy=document.querySelector('.hero__copy');
    const style=getComputedStyle(copy);
    return {viewport:{width:innerWidth,height:innerHeight},scrollY,copy:rect('.hero__copy'),headline:rect('.hero__copy h1'),actions:rect('.hero__actions'),subject:rect('.hero__subject'),stage:rect('.hero__stage'),copyStyle:{top:style.top,right:style.right,bottom:style.bottom,left:style.left,width:style.width,maxWidth:style.maxWidth,maxHeight:style.maxHeight,transform:style.transform,translate:style.translate}};
  });
  const ok=m.copy.left>=-1&&m.copy.right<=width+1&&m.copy.top>=-1&&m.copy.bottom<=height+2&&m.actions.left>=-1&&m.actions.right<=width+1&&m.subject.right>width*.48&&m.subject.left<width*.92&&m.subject.top<height*.88;
  console.log(`HERO_GEOMETRY_${width}x${height} ${JSON.stringify(m)}`);
  if(!ok){console.error(`Hero geometry failed at ${width}x${height}: ${JSON.stringify(m)}`);failed=true;break;}
}

await browser.close();
if(failed)process.exit(1);
console.log('Hero geometry guard passed at 320, 390, 768, 1440 and 1920 widths.');
