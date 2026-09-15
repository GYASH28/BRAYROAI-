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

// Keep the phone layer inside the homepage's consolidated stylesheet. Mobile first paint
// now uses a tiny critical stylesheet, while the complete bundle is promoted after intent.
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
  // Keep Google Fonts CSP-safe without making the remote stylesheet part of the critical
  // render path. commercial-cut.js promotes this print-media sheet after window load.
  html=html.replace(new RegExp(`<link rel="preload" as="style" href="${googleFontsHref.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}" onload="[^"]*" data-layout-stable-fonts>`,'g'),`<link rel="stylesheet" href="${googleFontsHref}" media="print" data-layout-stable-fonts>`);
  html=html.replace(/\s*<noscript><link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Archivo\+Black[^>]+><\/noscript>/g,'');
  const isHome=file===resolve(root,'index.html');
  if(isHome){
    html=html.replace(/\s*<link rel="stylesheet" href="\/mobile-polish-v25\.css"[^>]*>/g,'');
    html=html.replace(
      /<link rel="stylesheet" href="\/assets\/brayro-home\.css" data-brayro-home-styles data-brayro-v13>/g,
      '<link rel="stylesheet" href="/home-critical.css" data-brayro-home-critical>\n  <link rel="stylesheet" href="/assets/brayro-home.css" media="(min-width:701px)" data-brayro-home-styles data-brayro-v13>'
    );
    if(!html.includes('data-home-style-loader'))html=html.replace('</body>','  <script src="/home-style-loader.js" data-home-style-loader></script>\n</body>');
  }else if(!html.includes('data-mobile-polish-v25')){
    html=html.replace('</head>','  <link rel="stylesheet" href="/mobile-polish-v25.css" data-mobile-polish-v25>\n</head>');
  }
  writeFileSync(file,html);
}
console.log(`Post-build hardening complete for ${htmlFiles.length} HTML files: static JS capability, CSP-safe non-blocking fonts, critical mobile home CSS + intent-loaded full home styles, and Mobile V25.`);
