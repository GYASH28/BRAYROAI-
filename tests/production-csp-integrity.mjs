import assert from 'node:assert/strict';
import {existsSync,readdirSync,readFileSync,statSync} from 'node:fs';
import {resolve,relative} from 'node:path';

const root=resolve(process.cwd(),'dist');
const walk=dir=>readdirSync(dir).flatMap(name=>{
  const full=resolve(dir,name);
  return statSync(full).isDirectory()?walk(full):[full];
});
const htmlFiles=walk(root).filter(file=>file.endsWith('.html'));
assert.ok(htmlFiles.length>=8,'expected built HTML routes');
assert.ok(!existsSync(resolve(root,'outbound-fresh')),'legacy outbound export must not ship in production dist');

const inlineScript=/<script\b(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi;
const inlineHandler=/\son[a-z]+\s*=/i;
for(const file of htmlFiles){
  const html=readFileSync(file,'utf8');
  const label=relative(root,file);
  assert.doesNotMatch(html,inlineHandler,`${label} contains an inline event handler blocked by production CSP`);
  for(const match of html.matchAll(inlineScript)){
    const attrs=match[1]||'',body=(match[2]||'').trim();
    const inert=/\btype=["'](?:application\/ld\+json|application\/json)["']/i.test(attrs);
    assert.ok(inert||!body,`${label} contains executable inline script blocked by production CSP: ${attrs.trim()||'(no attrs)'}`);
  }
  assert.match(html,/<script[^>]+src="\/market-context\.js"[^>]+data-market-context|<script[^>]+data-market-context[^>]+src="\/market-context\.js"/i,`${label} must load market context from same-origin script`);
}
const home=readFileSync(resolve(root,'index.html'),'utf8');
assert.match(home,/<script[^>]+src="\/js-bootstrap\.js"[^>]+data-js-bootstrap|<script[^>]+data-js-bootstrap[^>]+src="\/js-bootstrap\.js"/i,'homepage must externalize JS bootstrap');
assert.match(home,/<script[^>]+src="\/layout-fonts\.js"[^>]+data-layout-fonts-script|<script[^>]+data-layout-fonts-script[^>]+src="\/layout-fonts\.js"/i,'font activation must use same-origin script');
for(const asset of ['js-bootstrap.js','layout-fonts.js','market-context.js'])assert.ok(existsSync(resolve(root,asset)),`missing CSP-safe runtime asset ${asset}`);

const vercel=JSON.parse(readFileSync(resolve(process.cwd(),'vercel.json'),'utf8'));
const csp=vercel.headers?.flatMap(entry=>entry.headers||[]).find(header=>header.key==='Content-Security-Policy')?.value||'';
const scriptDirective=csp.match(/(?:^|;)\s*script-src\s+([^;]+)/)?.[1]?.trim()||'';
assert.equal(scriptDirective,"'self'",'production script-src must remain strict same-origin only');

console.log(`Production CSP dist integrity passed: ${htmlFiles.length} HTML files contain no executable inline JS/event handlers.`);
