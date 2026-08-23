import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ready = async (page) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.ScrollCraft && document.querySelector('[data-commercial-cut]'));
};

test('commercial edit contains twelve paced cuts, corrected plans and project proof', async ({ page }) => {
  await ready(page);
  await expect(page.locator('[data-commercial-cut]')).toHaveCount(12);
  await expect(page.locator('img[src="/assets/fakhrimart-case-desktop.png"]')).toHaveCount(2);
  await expect(page.locator('img[src="/assets/fakhrimart-case-mobile.png"]')).toHaveCount(2);
  await expect(page.locator('a[href="https://fakhriyarns.vercel.app/"]')).toHaveCount(1);
  await expect(page.locator('[data-plans-preview]')).toContainText('₹9,999');
  await expect(page.locator('[data-plans-preview]')).toContainText('₹17,999');
  await expect(page.locator('[data-plans-preview]')).toContainText('₹25K–₹35K+');
  await expect(page.locator('a[href="/plans.html"]')).toHaveCount(2);
});

test('hero starts monochrome and its director control locks the full colour grade', async ({ page }) => {
  await ready(page);
  expect(await page.locator('.hero-picture--mono').evaluate((element) => getComputedStyle(element).filter)).toContain('grayscale');
  const control = page.locator('[data-colour-toggle]');
  await control.click();
  await expect(control).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-colour-stage]')).toHaveClass(/is-locked/);
  await expect(control).toContainText('Release the grade');
});

test('neumorphic clarity control changes the rendered hierarchy state', async ({ page }) => {
  await ready(page);
  const input = page.locator('[data-clarity]');
  await input.fill('84');
  await expect(page.locator('[data-clarity-output]')).toHaveText('84%');
  await expect(page.locator('[data-relief-console]')).toHaveAttribute('data-sc-verify-state', 'clarity:84');
});

test('AI workflow is keyboard-operable and returns a real response state', async ({ page }) => {
  await ready(page);
  const support = page.locator('[data-ai-choice="support"]');
  await support.focus();
  await page.keyboard.press('Enter');
  await expect(support).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-ai-title]')).toContainText('Resolve the repeatable');
  await expect(page.locator('[data-ai-demo]')).toHaveAttribute('data-sc-verify-state', 'workflow:support');
});

test('responsive preview selection carries into the proof composition', async ({ page }) => {
  await ready(page);
  const mobile = page.locator('button[data-preview-mode="mobile"]');
  await mobile.focus();
  await page.keyboard.press('Enter');
  await expect(mobile).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-responsive-preview]')).toHaveAttribute('data-preview-mode', 'mobile');
  await expect(page.locator('[data-proof-stage]')).toHaveAttribute('data-proof-view', 'mobile');
  await expect(page.locator('[data-proof-label]')).toContainText('Mobile leads');
});

test('project intent changes the real enquiry subject and remains keyboard-operable', async ({ page }) => {
  await ready(page);
  const usefulAI = page.locator('[data-project-type="ai"]');
  await usefulAI.focus();
  await page.keyboard.press('Enter');
  await expect(usefulAI).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-project-label]')).toHaveText('useful AI');
  await expect(page.locator('[data-project-cta]')).toHaveAttribute('href', /Start(?:%20|\+)a(?:%20|\+)BRAYROAI(?:%20|\+)useful(?:%20|\+)AI(?:%20|\+)project/i);
});

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`commercial film is fetched completely at ${viewport.width}px`, async ({ page }) => {
    const failed = [];
    page.on('requestfailed', (request) => failed.push(request.url()));
    await page.setViewportSize(viewport);
    await ready(page);
    await page.locator('.film-cut').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => {
      const film = document.querySelector('[data-commercial-film]');
      return film.currentSrc.startsWith('blob:') && film.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA;
    });
    expect(failed.filter((url) => url.includes('brayroai-convergence'))).toEqual([]);
  });
}

test('brand film timeline can be paused, scrubbed and resumed', async ({ page }) => {
  await ready(page);
  await page.locator('.film-cut').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => {
    const film = document.querySelector('[data-commercial-film]');
    return film.currentSrc.startsWith('blob:') && film.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA;
  });
  const range = page.locator('[data-film-range]');
  await range.fill('620');
  await expect(page.locator('[data-film-controls]')).toHaveAttribute('data-sc-verify-state', /film:ready:.*:6[01-3]/);
  const toggle = page.locator('[data-film-toggle]');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-label', /brand film/);
  await expect(page.locator('[data-film-time]')).not.toHaveText('00:00 / 00:00');
});

test('scroll choreography publishes finite cut progress and velocity state', async ({ page }) => {
  await ready(page);
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight * 0.58));
  await page.waitForTimeout(120);
  const state = await page.evaluate(() => ({
    energy: getComputedStyle(document.documentElement).getPropertyValue('--motion-energy').trim(),
    cuts: [...document.querySelectorAll('[data-commercial-cut]')].map((cut) => getComputedStyle(cut).getPropertyValue('--cut-p').trim()),
    motion: document.body.dataset.motion
  }));
  expect(Number.isFinite(Number(state.energy))).toBe(true);
  expect(state.cuts.every((value) => Number.isFinite(Number(value)))).toBe(true);
  expect(['rush', 'moving', 'settled']).toContain(state.motion);
});

test('homepage has no serious or critical accessibility violations', async ({ page }) => {
  await ready(page);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact))).toEqual([]);
});

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await ready(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test('reduced motion keeps the full edit readable and uses the film poster', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await ready(page);
  await expect(page.locator('[data-commercial-cut]')).toHaveCount(12);
  await expect(page.locator('[data-commercial-film]')).toBeHidden();
  await expect(page.locator('.film-cut__poster')).toBeVisible();
  await context.close();
});
