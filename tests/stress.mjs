const base = (process.env.BASE_URL || 'http://127.0.0.1:4173').replace(/\/$/, '');
const concurrency = Number(process.env.STRESS_CONCURRENCY || 36);
const total = Number(process.env.STRESS_REQUESTS || 720);
const pageRoutes = ['/', '/work.html', '/work/fakhrimart.html'];

const baseUrl = new URL(base);
const targets = new Set(pageRoutes);

async function discoverBuiltResources() {
  for (const route of pageRoutes) {
    const response = await fetch(`${base}${route}`);
    if (!response.ok) throw new Error(`Discovery failed: HTTP ${response.status} for ${route}`);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) continue;
    const html = await response.text();
    for (const match of html.matchAll(/\b(?:src|href)=["']([^"']+)["']/gi)) {
      const value = match[1];
      if (!value || value.startsWith('#') || value.startsWith('mailto:') || value.startsWith('tel:') || value.startsWith('data:')) continue;
      try {
        const resolved = new URL(value, `${base}${route}`);
        if (resolved.origin !== baseUrl.origin) continue;
        targets.add(`${resolved.pathname}${resolved.search}`);
      } catch {
        // Ignore malformed/non-network href values. The integrity suite catches broken local references.
      }
    }
  }
}

await discoverBuiltResources();
const routes = [...targets];
console.log(`Stress target graph: ${routes.length} routes/resources`);

let cursor = 0;
let failures = 0;
const durations = [];

async function worker(id) {
  while (true) {
    const current = cursor++;
    if (current >= total) return;
    const route = routes[current % routes.length];
    const started = performance.now();
    try {
      const response = await fetch(`${base}${route}`, { headers: { 'x-brayroai-stress': String(id) } });
      await response.arrayBuffer();
      durations.push(performance.now() - started);
      if (!response.ok) {
        failures++;
        console.error(`HTTP ${response.status}: ${route}`);
      }
    } catch (error) {
      failures++;
      console.error(`Request failed: ${route}: ${error.message}`);
    }
  }
}

await Promise.all(Array.from({ length: concurrency }, (_, index) => worker(index + 1)));
durations.sort((a, b) => a - b);
const quantile = q => durations[Math.min(durations.length - 1, Math.floor(durations.length * q))] || Infinity;
const median = quantile(.5);
const p95 = quantile(.95);
const p99 = quantile(.99);
const successRate = ((total - failures) / total) * 100;

console.log(JSON.stringify({ targets: routes.length, total, concurrency, failures, successRate, medianMs: Math.round(median), p95Ms: Math.round(p95), p99Ms: Math.round(p99) }, null, 2));

if (failures > 0) {
  console.error(`Stress test failed with ${failures} failed requests.`);
  process.exit(1);
}
if (p95 > 1500) {
  console.error(`Stress test failed: p95 ${Math.round(p95)}ms exceeds 1500ms guardrail.`);
  process.exit(1);
}
console.log('Stress test passed: zero HTTP failures across the built route/resource graph.');
