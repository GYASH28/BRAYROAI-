const base=process.env.BASE_URL||'http://127.0.0.1:4173',routes=['/','/plans','/clients/fakhrimart','/terms','/ae','/ae/plans','/au','/au/plans'];
const requests=Number(process.env.STRESS_REQUESTS||240),concurrency=Number(process.env.STRESS_CONCURRENCY||24);
let next=0,failures=[];
await Promise.all(Array.from({length:concurrency},async()=>{while(next<requests){const route=routes[next++%routes.length];try{const response=await fetch(base+route),body=await response.text();if(!response.ok||!body.includes('BRAYRO'))failures.push(route+':'+response.status)}catch(error){failures.push(route+':'+error.message)}}}));
if(failures.length)throw new Error(failures.slice(0,10).join('\n'));
console.log(`Stress OK: ${requests} requests across ${routes.length} routes`);
