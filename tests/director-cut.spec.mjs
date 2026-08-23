import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ready = async (page) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.ScrollCraft && document.querySelectorAll('[data-scene]').length === 7);
  await page.evaluate(() => document.body.classList.remove('is-opening'));
};

test('homepage is a focused seven-scene experience with meaningful routes', async ({ page }) => {
  await ready(page);
  await expect(page.locator('[data-scene]')).toHaveCount(7);
  for (const selector of ['#top', '#services', '#work', '#plans', '#studio', '#contact']) await expect(page.locator(selector)).toHaveCount(1);
  await expect(page.locator('a[href="/plans"]')).toHaveCount(3);
  await expect(page.locator('a[href="/founder"]')).toHaveCount(3);
  await expect(page.locator('.edit-flash,.impact-cut,.product-cut,.frontend-cut,.ai-cut,.silence-cut')).toHaveCount(0);
});

test('hero begins monochrome and locks the original colour grade', async ({ page }) => {
  await ready(page);
  expect(await page.locator('.hero__picture--mono').evaluate((element) => getComputedStyle(element).filter)).toContain('grayscale');
  const control = page.locator('[data-colour-toggle]');
  await control.click();
  await expect(control).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-colour-stage]')).toHaveClass(/is-locked/);
  await expect(control).toContainText('Release the colour');
});

test('capability instrument supports pointer and keyboard choices', async ({ page }) => {
  await ready(page);
  const engineering = page.locator('[data-capability="engineering"]');
  await engineering.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('[data-capability="ai"]')).toBeFocused();
  await expect(page.locator('[data-capability="ai"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-capability-stage]')).toHaveAttribute('data-sc-verify-state', 'capability:ai');
  await expect(page.locator('[data-capability-title]')).toContainText('Remove friction');
});

test('builds and monthly care are explicitly separate', async ({ page }) => {
  await ready(page);
  const plans = page.locator('#plans');
  for (const price of ['₹9,999', '₹17,999', '₹25K–₹35K+', '₹2,499/mo', '₹3,999/mo', '₹5,999+/mo']) await expect(plans).toContainText(price);
  await expect(plans).toContainText('Three one-time website scopes');
  await expect(plans).toContainText('SEPARATE MONTHLY CARE');
  await expect(plans).toContainText('Optional support after your website is live');
});

test('work focus and project intent preserve a single active state', async ({ page }) => {
  await ready(page);
  await page.locator('[data-work-toggle]').click();
  await expect(page.locator('[data-work-stage]')).toHaveAttribute('data-sc-verify-state', 'work:mobile');
  const usefulAI = page.locator('[data-project-type="ai"]');
  await usefulAI.click();
  await expect(usefulAI).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-project-label]')).toHaveText('useful AI');
  await expect(page.locator('[data-project-cta]')).toHaveAttribute('href', /useful%20AI%20project/i);
});

test('film is fetched as a playable blob and the timeline can seek', async ({ page }) => {
  await ready(page);
  await page.locator('.film').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const film = document.querySelector('[data-commercial-film]');
    return film.currentSrc.startsWith('blob:') && film.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA;
  });
  await page.locator('[data-film-range]').fill('620');
  await expect(page.locator('[data-film-controls]')).toHaveAttribute('data-sc-verify-state', /film:ready:.*:6[01-3]/);
  await expect(page.locator('[data-film-time]')).not.toHaveText('00:00 / 00:00');
});

test('reveal timing does not pre-reveal content far below the viewport', async ({ page }) => {
  await ready(page);
  const target = page.locator('#work [data-reveal]').first();
  await expect(target).not.toHaveClass(/is-visible/);
  await target.scrollIntoViewIfNeeded();
  await expect(target).toHaveClass(/is-visible/);
});

test('homepage has no serious or critical accessibility violations', async ({ page }) => {
  await ready(page);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact))).toEqual([]);
});

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`homepage has no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await ready(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  });
}

test('mobile menu is keyboard reachable and closes with Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page);
  const button = page.locator('[data-menu-button]');
  await button.click();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('[data-mobile-menu]')).toHaveClass(/open/);
  await page.keyboard.press('Escape');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
});

test('reduced motion keeps every scene readable and uses the film poster', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await ready(page);
  await expect(page.locator('[data-scene]')).toHaveCount(7);
  await expect(page.locator('[data-commercial-film]')).toBeHidden();
  await expect(page.locator('.film__poster')).toBeVisible();
  for (const item of await page.locator('[data-reveal]').all()) expect(Number(await item.evaluate((node) => getComputedStyle(node).opacity))).toBeGreaterThan(.9);
  await context.close();
});
