import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = ['/', '/work.html', '/work/fakhrimart.html'];

for (const path of pages) {
  test(`${path} has no critical accessibility violations`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'networkidle' });
    const results = await new AxeBuilder({ page }).analyze();
    const critical = results.violations.filter(v => ['critical', 'serious'].includes(v.impact));
    expect(critical, critical.map(v => `${v.id}: ${v.help}`).join('\n')).toEqual([]);
  });
}

test('homepage desktop storytelling remains stable', async ({ page }) => {
  const errors = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.locator('h1')).toContainText('Digital, designed');
  await expect(page.locator('.hero-portrait')).toBeVisible();
  const initialOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(initialOverflow).toBeLessThanOrEqual(1);
  await page.locator('#capabilities').scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, innerHeight * 1.6));
  await page.waitForTimeout(250);
  const activeCapability = await page.locator('[data-cap-target].active').getAttribute('data-cap-target');
  expect(Number(activeCapability)).toBeGreaterThan(0);
  await page.locator('#work').scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  const storyProgress = await page.locator('[data-work-story]').first().evaluate(el => Number.parseFloat(getComputedStyle(el).getPropertyValue('--story-p')) || 0);
  expect(storyProgress).toBeGreaterThanOrEqual(0);
  expect(errors).toEqual([]);
});

test('mobile navigation is keyboard-safe and closes cleanly', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'networkidle' });
  const toggle = page.locator('[data-menu-toggle]');
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('[data-mobile-menu]')).toHaveClass(/open/);
  await expect(page.locator('body')).toHaveClass(/menu-open/);
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('body')).not.toHaveClass(/menu-open/);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test('reduced motion removes cinematic transforms', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.locator('.loader')).toBeHidden();
  const behavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
  expect(behavior).toBe('auto');
  await context.close();
});

test('case-study comparison control updates split state', async ({ page }) => {
  await page.goto('/work/fakhrimart.html', { waitUntil: 'networkidle' });
  const compare = page.locator('[data-compare]');
  await compare.scrollIntoViewIfNeeded();
  const range = compare.locator('input[type="range"]');
  await range.fill('72');
  const split = await compare.evaluate(el => el.style.getPropertyValue('--split'));
  expect(split).toBe('72%');
});

for (const viewport of [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 }
]) {
  test(`layout has no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    for (const path of pages) {
      await page.goto(path, { waitUntil: 'networkidle' });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${path} overflowed by ${overflow}px at ${viewport.width}px`).toBeLessThanOrEqual(1);
    }
  });
}
