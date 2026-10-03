import {mkdirSync} from 'node:fs';
import {chromium} from '@playwright/test';
const base=process.env.BASE_URL||'http://127.0.0.1:4173',folder='artifacts/screenshots';
mkdirSync(folder,{recursive:true});
const browser=await chromium.launch({headless:true});
for(const [device,width,height] of [['desktop',1440,900],['mobile',390,844]]){
 const openingContext=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'no-preference'});
 await openingContext.addInitScript(()=>{try{localStorage.setItem('brayro_market_manual','in')}catch{}});
 const openingPage=await openingContext.newPage();
 await openingPage.goto(base+'/',{waitUntil:'domcontentloaded'});
 await openingPage.locator('.brand-opening').waitFor({state:'attached',timeout:1500});
 let elapsed=0;
 for(const time of [300,1100,1650,2200,3100]){await openingPage.waitForTimeout(Math.max(0,time-elapsed));elapsed=time;await openingPage.screenshot({path:`${folder}/${device}-opening-${String(time).padStart(4,'0')}.png`})}
 await openingPage.waitForFunction(()=>document.querySelector('.hero-stage')?.dataset.openingState==='settled',undefined,{timeout:5000});
 await openingPage.screenshot({path:`${folder}/${device}-opening-settled.png`});
 await openingPage.evaluate(()=>{const section=document.querySelector('.studio-hero');scrollTo({top:section.offsetTop+(section.offsetHeight-innerHeight)*.94,behavior:'instant'})});
 await openingPage.waitForTimeout(900);
 await openingPage.screenshot({path:`${folder}/${device}-hero-handoff.png`});
 await openingContext.close();

 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce'});
 await context.addInitScript(()=>{try{localStorage.setItem('brayro_market_manual','in')}catch{}});
 const page=await context.newPage();
 await page.goto(base+'/',{waitUntil:'networkidle'});
 await page.screenshot({path:`${folder}/${device}-hero.png`});
 await page.locator('#work').scrollIntoViewIfNeeded();
 await page.locator('.work-desktop img').evaluate(image=>image.decode());
 await page.screenshot({path:`${folder}/${device}-work.png`});
 await page.locator('[data-project-path] .path-heading').scrollIntoViewIfNeeded();
 await page.screenshot({path:`${folder}/${device}-project-path.png`});
 for(const [route,name] of [['/plans','plans'],['/clients','clients'],['/clients/fakhrimart','case'],['/founder','founder'],['/ai-workflow-audit','audit'],['/company-second-brain','brain'],['/terms','terms']]){
  await page.goto(base+route,{waitUntil:'networkidle'});await page.screenshot({path:`${folder}/${device}-${name}.png`});
  if(name==='plans'){
    await page.locator('#monthly-builds').evaluate(node=>node.scrollIntoView({block:'start',behavior:'instant'}));await page.waitForTimeout(120);await page.screenshot({path:`${folder}/${device}-plans-monthly.png`});
    await page.locator('#one-time-builds').evaluate(node=>node.scrollIntoView({block:'start',behavior:'instant'}));await page.waitForTimeout(120);await page.screenshot({path:`${folder}/${device}-plans-onetime.png`});
   }
  if(name==='founder'){await page.locator('.founder-opening').scrollIntoViewIfNeeded();await page.screenshot({path:`${folder}/${device}-founder-opening.png`})}
  if(name==='terms'){await page.locator('#pricing').scrollIntoViewIfNeeded();await page.screenshot({path:`${folder}/${device}-terms-reading.png`})}
 }
 await page.locator('.rae-launcher').click();
 await page.locator('#rae-dialog').waitFor({state:'visible'});
 await page.screenshot({path:`${folder}/${device}-rae.png`});
 await context.close();
}
await browser.close();
