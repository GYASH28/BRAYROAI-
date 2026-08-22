const base=process.env.BASE_URL||'http://127.0.0.1:4173';
const concurrency=Number(process.env.STRESS_CONCURRENCY||36);
const total=Number(process.env.STRESS_REQUESTS||720);
const routes=[
  '/',
  '/services',
  '/work',
  '/plans',
  '/contact',
  '/styles.css',
  '/film.css',
  '/pages.css',
  '/app.js',
  '/pages.js',
  '/robots.txt',
  '/sitemap.xml',
  '/assets/hero-background.webp',
  '/assets/yash-cutout.webp',
  '/assets/about-yash.webp',
  '/assets/fakhrimart-case-desktop.png',
  '/assets/fakhrimart-case-mobile.png'
];
let cursor=0,failures=0;const durations=[];
async function worker(id){while(true){const current=cursor++;if(current>=total)return;const route=routes[current%routes.length],started=performance.now();try{const response=await fetch(`${base}${route}`,{headers:{'x-ykg-stress':String(id)}});await response.arrayBuffer();durations.push(performance.now()-started);if(!response.ok){failures++;console.error(`HTTP ${response.status}: ${route}`)}}catch(error){failures++;console.error(`Request failed: ${route}: ${error.message}`)}}}
await Promise.all(Array.from({length:concurrency},(_,index)=>worker(index+1)));durations.sort((a,b)=>a-b);const quantile=q=>durations[Math.min(durations.length-1,Math.floor(durations.length*q))]||Infinity,median=quantile(.5),p95=quantile(.95),p99=quantile(.99),successRate=((total-failures)/total)*100;console.log(JSON.stringify({total,concurrency,failures,successRate,medianMs:Math.round(median),p95Ms:Math.round(p95),p99Ms:Math.round(p99)},null,2));if(failures>0){console.error(`Stress test failed with ${failures} failed requests.`);process.exit(1)}if(p95>1500){console.error(`Stress test failed: local p95 ${Math.round(p95)}ms exceeds 1500ms guardrail.`);process.exit(1)}console.log('Stress test passed: zero HTTP failures under concurrent local load.');
