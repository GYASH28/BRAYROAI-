import fs from 'node:fs';
const api=fs.readFileSync('api/rae.js','utf8');
const errors=[];
const expect=(v,m)=>{if(!v)errors.push(m)};
expect(api.includes("req.method!=='POST'"),'Rae API must reject non-POST requests');
expect(api.includes('process.env.GEMINI_API_KEY'),'Rae API key must stay server-side');
expect(api.includes('MAX_PER_WINDOW=8'),'Rae API rate limit missing');
expect(api.includes('message=String(body.message'),'Rae API input cap missing');
expect(api.includes('history.slice(-6)'),'Rae API history cap missing');
expect(api.includes('maxOutputTokens:180'),'Rae API output cap missing');
expect(api.includes("'x-goog-api-key':key"),'Rae Gemini auth header missing');
expect(api.includes("Cache-Control','no-store"),'Rae API must not cache visitor conversations');
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Rae API contract OK: server-only key, bounded context, rate limit and no-store responses verified.');
