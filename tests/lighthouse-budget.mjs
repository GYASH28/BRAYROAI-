import { readFileSync } from 'node:fs';

const files = process.argv.slice(2);
if (!files.length) {
  console.error('Usage: node tests/lighthouse-budget.mjs <report.json> [...]');
  process.exit(1);
}

const minimums = {
  performance: 0.90,
  accessibility: 0.98,
  'best-practices': 0.98,
  seo: 0.98
};

const budgets = {
  lcp: 3000,
  cls: 0.05,
  tbt: 300
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
  const tbt = report.audits?.['total-blocking-time']?.numericValue;
  if (Number.isFinite(lcp)) console.log(`  LCP: ${Math.round(lcp)}ms (maximum ${budgets.lcp}ms)`);
  if (Number.isFinite(cls)) console.log(`  CLS: ${cls.toFixed(3)} (maximum ${budgets.cls})`);
  if (Number.isFinite(tbt)) console.log(`  TBT: ${Math.round(tbt)}ms (maximum ${budgets.tbt}ms)`);

  if (Number.isFinite(lcp) && lcp > budgets.lcp) failed = true;
  if (Number.isFinite(cls) && cls >= budgets.cls) failed = true;
  if (Number.isFinite(tbt) && tbt > budgets.tbt) failed = true;
}

if (failed) {
  console.error('\nLighthouse launch guardrails failed.');
  process.exit(1);
}
console.log('\nLighthouse launch guardrails passed.');
