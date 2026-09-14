import {test,expect} from '@playwright/test';

async function loadRae(page,route='/plans'){
  await page.goto(route,{waitUntil:'domcontentloaded'});
  await expect(page.locator('[data-rae-root]')).toHaveCount(1);
  await page.evaluate(()=>document.querySelector('[data-rae-shell]')?.dispatchEvent(new PointerEvent('pointerenter',{bubbles:true,pointerType:'mouse'})));
  await expect(page.locator('[data-rae-root]')).toHaveAttribute('data-rae-app-ready','true',{timeout:8000});
}
async function openRae(page,route='/plans'){
  await loadRae(page,route);await page.locator('[data-rae-toggle]').click();await expect(page.locator('[data-rae-panel]')).toHaveAttribute('aria-hidden','false');
}

for(const width of [320,390])test(`Rae mobile stage remains composed at ${width}px`,async({page})=>{
  const height=844;await page.setViewportSize({width,height});await loadRae(page);
  const launcher=await page.locator('.rae-character--launcher').boundingBox();expect(launcher).not.toBeNull();expect(launcher.y+launcher.height).toBeLessThanOrEqual(height-12);
  await page.locator('[data-rae-toggle]').click();await expect(page.locator('[data-rae-panel]')).toHaveAttribute('aria-hidden','false');
  const panel=page.locator('[data-rae-panel]'),character=page.locator('.rae-stage .rae-character--stage'),copy=page.locator('.rae-stage__copy');
  await expect(panel).toHaveCSS('opacity','1');
  const transitionProperties=await panel.evaluate(node=>getComputedStyle(node).transitionProperty);expect(transitionProperties).not.toContain('opacity');
  const [charBox,copyBox,panelBox]=await Promise.all([character.boundingBox(),copy.boundingBox(),panel.boundingBox()]);
  expect(charBox).not.toBeNull();expect(copyBox).not.toBeNull();expect(panelBox).not.toBeNull();
  expect(panelBox.x).toBeGreaterThanOrEqual(-1);expect(panelBox.x+panelBox.width).toBeLessThanOrEqual(width+1);
  expect(charBox.x+charBox.width).toBeLessThanOrEqual(copyBox.x+6);
  expect(copyBox.x+copyBox.width).toBeLessThanOrEqual(width-4);
});

test('Rae desktop reads as a dedicated companion surface',async({page,browserName})=>{
  test.skip(browserName!=='chromium','Visual hierarchy check only needs one browser');
  await page.setViewportSize({width:1440,height:1000});await openRae(page);
  const panel=await page.locator('[data-rae-panel]').boundingBox(),stage=await page.locator('[data-rae-stage]').boundingBox();
  expect(panel.width).toBeGreaterThan(460);expect(stage.height).toBeGreaterThan(170);
  const kicker=await page.locator('.rae-stage__copy').evaluate(node=>getComputedStyle(node,'::before').content);
  expect(kicker).toContain('BRAYROAI');
  await expect(page.locator('.v22-cursor')).toHaveCSS('display','none');
});
