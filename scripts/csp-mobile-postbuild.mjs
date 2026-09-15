import {readdirSync,readFileSync,writeFileSync} from 'node:fs';
import {join,resolve} from 'node:path';

const root=resolve(process.cwd(),'dist');
const sourceRoot=resolve(process.cwd(),'public');
const googleFontsHref='https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=optional';
const htmlFiles=[];
const walk=dir=>{for(const entry of readdirSync(dir,{withFileTypes:true})){const full=join(dir,entry.name);if(entry.isDirectory())walk(full);else if(entry.name.endsWith('.html'))htmlFiles.push(full)}};
const ensureJsClass=html=>html.replace(/<html([^>]*)>/i,(match,attrs)=>{
  const classMatch=attrs.match(/\bclass=(['"])(.*?)\1/i);
  if(classMatch){
    const classes=classMatch[2].split(/\s+/).filter(Boolean);
    if(!classes.includes('js'))classes.push('js');
    return match.replace(classMatch[0],`class=${classMatch[1]}${classes.join(' ')}${classMatch[1]}`);
  }
  return `<html${attrs} class="js">`;
});

walk(root);

// Keep the phone layer inside the homepage's consolidated stylesheet so mobile does not
// pay for a second render-blocking CSS request. Subpages still load the file directly.
const homeBundle=resolve(root,'assets/brayro-home.css');
const mobileCss=readFileSync(resolve(sourceRoot,'mobile-polish-v25.css'),'utf8');
let homeCss=readFileSync(homeBundle,'utf8');
if(!homeCss.includes('BRAYROAI / Mobile V25'))writeFileSync(homeBundle,`${homeCss}\n${mobileCss}\n`);

for(const file of htmlFiles){
  let html=readFileSync(file,'utf8');
  html=ensureJsClass(html);
  // In production the capability class is static, so no CSP-sensitive or render-blocking
  // bootstrap script is needed.
  html=html.replace(/\s*<script(?:\s+src="\/js-bootstrap\.js")?\s+data-js-bootstrap>[^<]*<\/script>/g,'');
  html=html.replace(new RegExp(`<link rel="preload" as="style" href="${googleFontsHref.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}" onload="[^"]*" data-layout-stable-fonts>`,'g'),`<link rel="stylesheet" href="${googleFontsHref}" data-layout-stable-fonts>`);
  html=html.replace(/\s*<noscript><link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Archivo\+Black[^>]+><\/noscript>/g,'');
  const isHome=file===resolve(root,'index.html');
  if(isHome){
    html=html.replace(/\s*<link rel="stylesheet" href="\/mobile-polish-v25\.css"[^>]*>/g,'');
  }else if(!html.includes('data-mobile-polish-v25')){
    html=html.replace('</head>','  <link rel="stylesheet" href="/mobile-polish-v25.css" data-mobile-polish-v25>\n</head>');
  }
  writeFileSync(file,html);
}
console.log(`Post-build hardening complete for ${htmlFiles.length} HTML files: static JS capability, CSP-safe fonts + bundled-home Mobile V25.`);
