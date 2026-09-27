import {test,expect} from '@playwright/test';

test('signature scenes mount on authored homepage chapters',async({page})=>{
  await page.goto('/');
  await page.locator('#services').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-v43-source-particles]')).toHaveCount(1);
  await expect(page.locator('[data-v43-source-particles] i')).toHaveCount(9);
  await expect(page.locator('[data-v43-handoff-relay]')).toHaveCount(1);
});

for(const reducedMotion of ['no-preference','reduce']){
  test(`Rae stays a full SVG character on desktop with ${reducedMotion} motion`,async({page})=>{
    await page.setViewportSize({width:1440,height:900});
    await page.emulateMedia({reducedMotion});
    await page.goto('/');
    await page.locator('[data-rae-shell],[data-rae-toggle]').first().click();
    await expect(page.locator('[data-rae-panel]')).toBeVisible();
    const actor=page.locator('[data-rae-stage] svg[data-rae-vector="full-body"]');
    await expect(actor).toBeVisible();
    await page.waitForFunction(()=>[...document.styleSheets].some(sheet=>sheet.href?.includes('/rae/rae-character-emotions.css')));
    const materials=await actor.evaluate(node=>({
      shell:getComputedStyle(node.querySelector('.rae-character__torso')).fill,
      face:getComputedStyle(node.querySelector('.rae-character__mouth')).stroke
    }));
    expect(materials.shell).toContain('url(');
    expect(materials.face).toContain('url(');
    await expect(actor.locator('.rae-character__head,.rae-character__torso,.rae-character__arm,.rae-character__leg')).toHaveCount(6);
    await expect(page.locator('[data-rae-3d-host],.rae-dimensional-host,[data-rae-stage] canvas')).toHaveCount(0);
    if(reducedMotion==='reduce'){
      for(const [state,shown,hidden] of [
        ['error','.rae-character__mouth-frown','.rae-character__mouth'],
        ['surprised','.rae-character__mouth-oh','.rae-character__mouth'],
        ['positive','.rae-character__smile-eyes','.rae-character__eye-white']
      ]){
        await actor.evaluate((node,next)=>{node.dataset.state=next},state);
        await expect(actor.locator(shown)).toHaveCSS('opacity','1');
        await expect(actor.locator(hidden).first()).toHaveCSS('opacity','0');
      }
    }
    const resources=await page.evaluate(()=>performance.getEntriesByType('resource').map(entry=>entry.name));
    expect(resources.some(name=>/rae-3d-island|three-r186|three\.core/i.test(name))).toBeFalsy();
  });
}
