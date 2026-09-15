import {readdirSync,readFileSync,writeFileSync} from 'node:fs';
import {join,resolve} from 'node:path';

const root=resolve(process.cwd(),'dist');
const googleFontsHref='https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=optional';
const htmlFiles=[];
const walk=dir=>{for(const entry of readdirSync(dir,{withFileTypes:true})){const full=join(dir,entry.name);if(entry.isDirectory())walk(full);else if(entry.name.endsWith('.html'))htmlFiles.push(full)}};
walk(root);
for(const file of htmlFiles){
  let html=readFileSync(file,'utf8');
  html=html.replace(/<script\s+data-js-bootstrap>[^<]*<\/script>/g,'<script src="/js-bootstrap.js" data-js-bootstrap></script>');
  html=html.replace(new RegExp(`<link rel="preload" as="style" href="${googleFontsHref.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}" onload="[^"]*" data-layout-stable-fonts>`,'g'),`<link rel="stylesheet" href="${googleFontsHref}" data-layout-stable-fonts>`);
  html=html.replace(/\s*<noscript><link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Archivo\+Black[^>]+><\/noscript>/g,'');
  if(!html.includes('data-mobile-polish-v25'))html=html.replace('</head>','  <link rel="stylesheet" href="/mobile-polish-v25.css" data-mobile-polish-v25>\n</head>');
  writeFileSync(file,html);
}
console.log(`Post-build hardening complete for ${htmlFiles.length} HTML files: CSP-safe bootstrap/fonts + Mobile V25.`);
