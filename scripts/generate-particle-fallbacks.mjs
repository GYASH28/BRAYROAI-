// Optional authoring command: node scripts/generate-particle-fallbacks.mjs
// Uses the project's Playwright Chromium and ImageMagick for PNG → WebP.
import {chromium} from 'playwright';
import {writeFileSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createParticleFieldSvg} from '../src/site/particle-points.js';
const temporary=mkdtempSync(join(tmpdir(),'brayro-particle-'));
const browser=await chromium.launch();
try{
 for(const [name,assembly] of [['cloud',0],['mark',1]]){
  const svg=createParticleFieldSvg({assembly,sampleCount:2800});
  writeFileSync(`static/assets/particle-${name}.svg`,svg);
  const page=await browser.newPage({viewport:{width:1000,height:800}});
  await page.goto(`data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`);
  const png=join(temporary,`${name}.png`);
  await page.screenshot({path:png,omitBackground:true});await page.close();
  for(const [suffix,size,quality] of [['',null,'90'],['-small','600x480','87']]){
   const args=[png,...(size?['-resize',size]:[]),'-quality',quality,`static/assets/particle-${name}${suffix}.webp`];
   const result=spawnSync('convert',args,{stdio:'inherit'});
   if(result.status!==0)throw new Error('ImageMagick PNG conversion failed');
  }
 }
}finally{await browser.close();rmSync(temporary,{recursive:true,force:true})}
