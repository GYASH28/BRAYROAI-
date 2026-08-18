import { readFileSync } from 'node:fs';

const files = process.argv.slice(2);
if (!files.length) {
  console.error('Usage: node tests/lighthouse-budget.mjs <report.json> [...]');
  process.exit(1);
}

const minimums = {
  performance: 0.78,
  accessibility: 0.95,
  'best-practices': 0.95,
  seo: 0.95
};

let failed = false;
for (const file of files) {
  const report = JSON.parse(readFileSync(file, 'utf8'));
  console.log(`\n${file}`);
  for (const [category, minimum] of Object.entries(minimums)) {
    const score = report.categories?.[category]?.score ?? 0;
    console.log(`  ${category}: ${Math.round(score * 100)} (minimum ${Math.round(minimum * 100)})`);
    if (score < minimum) failed = true;
  }
  const lcp = report.audits?.['largest-contentful-paint']?.numericValue;
  const cls = report.audits?.['cumulative-layout-shift']?.numericValue;
  if (Number.isFinite(lcp)) console.log(`  LCP: ${Math.round(lcp)}ms`);
  if (Number.isFinite(cls)) console.log(`  CLS: ${cls.toFixed(3)}`);
  if (Number.isFinite(cls) && cls >= 0.1) failed = true;
}

if (failed) {
  console.error('\nLighthouse launch guardrails failed.');
  process.exit(1);
}
console.log('\nLighthouse launch guardrails passed.');
