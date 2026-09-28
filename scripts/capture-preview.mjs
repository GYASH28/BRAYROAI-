import {mkdirSync} from 'node:fs';
import {chromium} from '@playwright/test';
const base=process.env.BASE_URL||'http://127.0.0.1:4173',folder='artifacts/screenshots';
mkdirSync(folder,{recursive:true});
const browser=await chromium.launch({headless:true});
for(const [device,width,height] of [['desktop',1440,900],['mobile',390,844]]){
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce'});
 const page=await context.newPage();
 await page.goto(base+'/',{waitUntil:'networkidle'});
 await page.screenshot({path:`${folder}/${device}-hero.png`});
 await page.locator('#work').scrollIntoViewIfNeeded();
 await page.locator('.work-desktop').evaluate(image=>image.decode());
 await page.screenshot({path:`${folder}/${device}-work.png`});
 await page.locator('#approach').scrollIntoViewIfNeeded();
 await page.screenshot({path:`${folder}/${device}-artboard.png`});
 for(const [route,name] of [['/plans','plans'],['/clients/fakhrimart','case'],['/terms','terms']]){
  await page.goto(base+route,{waitUntil:'networkidle'});await page.screenshot({path:`${folder}/${device}-${name}.png`});
 }
 await page.locator('.rae-launcher').click();
 await page.screenshot({path:`${folder}/${device}-rae.png`});
 await context.close();
}
await browser.close();
