import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const label=process.argv[2]||'baseline';
const base=process.env.BASE_URL||'http://127.0.0.1:4174';
const output=resolve('artifacts/experience',label);
const routes=['/','/plans','/founder','/clients','/clients/fakhrimart','/ai-workflow-audit','/company-second-brain','/terms'];
const viewports=[
  {name:'phone-360',width:360,height:780},
  {name:'phone-390',width:390,height:844},
  {name:'tablet-768',width:768,height:1024},
  {name:'tablet-1024',width:1024,height:768},
  {name:'desktop-1440',width:1440,height:900},
  {name:'landscape-phone',width:667,height:375},
  {name:'tall-desktop',width:1440,height:1200}
];
const slug=route=>route==='/'?'home':route.slice(1).replaceAll('/','-');
await mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({reducedMotion:'reduce',deviceScaleFactor:1});
const report={label,base,recordedAt:new Date().toISOString(),routes:{}};
try{
  for(const route of routes){
    const page=await context.newPage();
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    const response=await page.goto(new URL(route,base).href,{waitUntil:'networkidle',timeout:45000});
    await page.evaluate(()=>document.fonts?.ready);
    const entry={status:response?.status(),title:await page.title(),errors,viewports:{}};
    for(const viewport of viewports){
      await page.setViewportSize({width:viewport.width,height:viewport.height});
      await page.evaluate(()=>scrollTo(0,0));
      const measurement=await page.evaluate(()=>{
        const rect=node=>{const box=node.getBoundingClientRect();return{x:Math.round(box.x),y:Math.round(box.y),width:Math.round(box.width),height:Math.round(box.height)}};
        const heading=document.querySelector('main h1');
        const header=document.querySelector('header');
        return {
          documentWidth:document.documentElement.scrollWidth,
          viewportWidth:innerWidth,
          overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth),
          pageHeight:document.documentElement.scrollHeight,
          heading:heading?.textContent?.trim().replace(/\s+/g,' ')||null,
          headingRect:heading?rect(heading):null,
          headerRect:header?rect(header):null,
          missingLocalFragments:[...document.querySelectorAll('a[href^="#"]')].map(link=>link.getAttribute('href')).filter(href=>href&&href!=='#'&&!document.getElementById(decodeURIComponent(href.slice(1)))),
          primaryContacts:[...document.querySelectorAll('main a[href^="https://wa.me/"],main a[href^="mailto:"]')].slice(0,12).map(link=>({text:link.textContent.trim().replace(/\s+/g,' '),href:link.href}))
        };
      });
      entry.viewports[viewport.name]=measurement;
      if(viewport.name==='phone-390'||viewport.name==='desktop-1440'){
        await page.screenshot({path:resolve(output,`${slug(route)}-${viewport.name}.jpg`),type:'jpeg',quality:78});
      }
    }
    report.routes[route]=entry;
    console.log(`${route}: status ${entry.status}; overflow ${Object.values(entry.viewports).map(item=>item.overflow).join('/')}; errors ${errors.length}`);
    await page.close();
  }
}finally{await browser.close()}
await writeFile(resolve(output,'report.json'),JSON.stringify(report,null,2));
console.log(`Saved ${output}`);
