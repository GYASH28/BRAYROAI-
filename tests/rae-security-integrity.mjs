import fs from 'node:fs';
const files=['public/rae.js','public/rae.css','vite.config.mjs'];
const text=files.map(file=>fs.readFileSync(file,'utf8')).join('\n');
if(text.includes('GEMINI_API_KEY')){console.error('Public/client files must never contain GEMINI_API_KEY');process.exit(1)}
if(/AIza[0-9A-Za-z_-]{20,}/.test(text)){console.error('Possible Google API key leaked into public/client files');process.exit(1)}
console.log('Rae security integrity OK: no Gemini secret material is shipped to the browser.');
