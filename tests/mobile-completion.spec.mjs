import {test,expect} from '@playwright/test';

const routes=['/','/plans','/founder','/terms','/ai-workflow-audit','/company-second-brain','/clients','/clients/fakhrimart'];
const clearOpening=page=>page.evaluate(()=>{document.querySelectorAll('.opening-sequence,.scope-open,.founder-open').forEach(node=>node.remove());document.body.classList.remove('polish-opening','hf-intro-active','is-opening')});

for(const width of [320,390]){
  for(const route of routes){
    test(`Mobile V25 stays intentional on ${route} at ${width}px`,async({page,browserName})=>{
      test.skip(browserName!=='chromium','Full phone composition audit runs once in Chromium');
      await page.setViewportSize({width,height:844});
      await page.goto(route,{waitUntil:'domcontentloaded'});
      await clearOpening(page);
      await expect(page.locator('link[data-mobile-polish-v25]')).toHaveCount(1);
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(1);
      const main=page.locator('main').first();
      await expect(main).toBeVisible();
      const mainBox=await main.boundingBox();
      expect(mainBox).not.toBeNull();
      expect(mainBox.x).toBeGreaterThanOrEqual(-1);
      expect(mainBox.x+mainBox.width).toBeLessThanOrEqual(width+1);
      const bodyFont=await page.locator('body').evaluate(node=>parseFloat(getComputedStyle(node).fontSize));
      expect(bodyFont).toBeGreaterThanOrEqual(12);
      const visibleText=page.locator('main h1,main h2,main p').filter({visible:true}).first();
      await expect(visibleText).toBeVisible();
    });
  }
}

test('Mobile homepage first fold has readable hierarchy and reachable actions',async({page,browserName})=>{
  test.skip(browserName!=='chromium','Phone geometry audit runs once in Chromium');
  await page.setViewportSize({width:390,height:844});
  await page.goto('/',{waitUntil:'domcontentloaded'});await clearOpening(page);
  const heading=page.locator('.hero__copy h1');const body=page.locator('.hero__body');const actions=page.locator('.hero__actions');
  await expect(heading).toBeVisible();await expect(body).toBeVisible();await expect(actions).toBeVisible();
  const [h,b,a]=await Promise.all([heading.boundingBox(),body.boundingBox(),actions.boundingBox()]);
  expect(h.x).toBeGreaterThanOrEqual(12);expect(h.x+h.width).toBeLessThanOrEqual(378);expect(parseFloat(await heading.evaluate(node=>getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(44);
  expect(b.y+b.height).toBeLessThan(790);expect(a.y+a.height).toBeLessThanOrEqual(842);
  const controls=actions.locator('a,button');expect(await controls.count()).toBeGreaterThanOrEqual(2);
  for(let i=0;i<await controls.count();i++){const box=await controls.nth(i).boundingBox();expect(box.height).toBeGreaterThanOrEqual(44)}
});
