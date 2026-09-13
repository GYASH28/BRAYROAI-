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
expect(api.includes('safeProfile')&&api.includes("['name','business','businessType','budget','goal','stage','timeline']"),'Rae API profile allowlist missing');
expect(api.includes('Known visitor context from this browser session'),'Rae API is not carrying bounded session context');
expect(api.includes('ACTUAL LAST RESORT'),'Rae API is not explicitly last-resort');
expect(api.includes('You are Rae')&&api.includes('tiny website-native best-friend companion'),'Rae fallback persona contract missing');
expect(api.includes('recommend the smallest sensible')||api.includes('smallest sensible next step'),'Rae fallback must avoid upsell bias');
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Rae API contract OK: server-only key, bounded context, last-resort use and buddy voice verified.');
