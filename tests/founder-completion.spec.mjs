import {test,expect} from '@playwright/test';

for(const viewport of [{width:360,height:800},{width:390,height:844}]){
  test(`Founder mobile first fold communicates identity at ${viewport.width}px`,async({page,browserName})=>{
    test.skip(browserName!=='chromium','Founder first-fold geometry only needs one rendering engine');
    await page.setViewportSize(viewport);
    await page.goto('/founder',{waitUntil:'domcontentloaded'});
    await page.evaluate(()=>document.fonts?.ready);

    const hero=page.locator('.founder-hero');
    const portrait=page.locator('.founder-hero__portrait');
    const eyebrow=page.locator('.founder-hero__copy .eyebrow');
    const heading=page.locator('.founder-hero__copy h1');
    const copy=page.locator('.founder-hero__copy > p:last-of-type');
    const cta=page.locator('.founder-hero__copy > a');

    await expect(eyebrow).toBeVisible();
    await expect(heading).toBeVisible();
    await expect(copy).toBeVisible();
    await expect(cta).toBeVisible();
    await expect(eyebrow).toContainText('YASH GANESH / FOUNDER');
    await expect(heading).toContainText('The work stays');
    await expect(copy).toContainText('founder-led by design');
    await expect(cta).toContainText('See how the studio thinks');

    const [heroBox,portraitBox,eyebrowBox,headingBox,copyBox,ctaBox]=await Promise.all([
      hero.boundingBox(),portrait.boundingBox(),eyebrow.boundingBox(),heading.boundingBox(),copy.boundingBox(),cta.boundingBox()
    ]);
    for(const box of [heroBox,portraitBox,eyebrowBox,headingBox,copyBox,ctaBox])expect(box).not.toBeNull();

    expect(heroBox.height).toBeGreaterThanOrEqual(viewport.height-1);
    expect(portraitBox.height).toBeGreaterThan(viewport.height*.54);
    expect(eyebrowBox.y).toBeLessThan(viewport.height*.70);
    expect(headingBox.y+headingBox.height).toBeLessThan(viewport.height*.88);
    expect(copyBox.y+copyBox.height).toBeLessThan(viewport.height*.97);
    expect(ctaBox.y+ctaBox.height).toBeLessThanOrEqual(viewport.height-4);

    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}
