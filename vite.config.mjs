import {defineConfig} from 'vite';
import {resolve} from 'node:path';

const origin='https://brayroai.vercel.app';
const routeFiles={'/':'index.html','/plans':'plans.html','/clients/fakhrimart':'fakhrimart-case-study.html','/terms':'terms.html'};
const pathForFile=file=>Object.entries(routeFiles).find(([,name])=>file.endsWith(name))?.[0]||'/';
const nav=`<a class="brand" href="/" aria-label="BRAYRO AI home">BRAYRO<span>AI</span><span class="brand-dot" aria-hidden="true">.</span></a>
<nav class="desktop-nav" aria-label="Main navigation"><a href="/#work">Work</a><a href="/#approach">Approach</a><a href="/plans">Plans</a></nav>
<div class="header-actions"><button class="market-button" type="button" data-market-open aria-haspopup="dialog" aria-controls="market-dialog">India · INR <span aria-hidden="true">⌄</span></button><a class="header-cta" href="/#contact">Start a project <span aria-hidden="true">↗</span></a><button class="menu-button" type="button" data-menu-open aria-label="Open menu" aria-haspopup="dialog" aria-controls="menu-dialog"><span></span><span></span></button></div>`;
const footer=`<footer class="footer"><div class="container footer-grid"><a class="brand" href="/" aria-label="BRAYRO AI home">BRAYRO<span>AI</span><span class="brand-dot" aria-hidden="true">.</span></a><p>Design, engineering and useful AI.<br>Made with Yash Ganesh in Pune, India.</p><nav aria-label="Footer navigation"><a href="/#work">Work</a><a href="/#studio">Studio</a><a href="/plans">Plans</a><a href="/terms">Terms</a></nav><div><a href="mailto:yashganesh.work@gmail.com">Email Yash ↗</a><button type="button" data-rae-open>Ask Rae ↗</button></div></div><div class="container footer-base"><span>© 2026 BRAYRO AI</span><a href="#top">Back to top ↑</a></div></footer>`;
const dialogs=`<dialog id="menu-dialog" class="menu-dialog" aria-label="Site menu"><div class="dialog-head"><span>BRAYRO AI</span><button type="button" data-menu-close aria-label="Close menu">×</button></div><nav aria-label="Mobile navigation"><a href="/#work">Work</a><a href="/#approach">Approach</a><a href="/plans">Plans</a><a href="/#studio">Studio</a><a href="/#contact">Start a project</a></nav><button type="button" data-market-open>India · INR ⌄</button></dialog>
<dialog id="market-dialog" class="market-dialog" aria-labelledby="market-heading"><div class="dialog-head"><h2 id="market-heading">Your market</h2><button type="button" data-market-close aria-label="Close market selector">×</button></div><p>Choose the price book that applies to your enquiry.</p><div role="radiogroup" aria-label="Market and currency"><button type="button" role="radio" data-market-choice="in" aria-checked="true">India <span>INR</span></button><button type="button" role="radio" data-market-choice="ae" aria-checked="false">UAE <span>AED</span></button><button type="button" role="radio" data-market-choice="au" aria-checked="false">Australia <span>AUD</span></button></div></dialog>
<button class="rae-launcher" type="button" data-rae-open aria-label="Ask Rae, BRAYRO AI's AI assistant"><img src="/assets/rae-face.svg" alt="" width="46" height="46"></button>
<dialog id="rae-dialog" class="rae-dialog" aria-labelledby="rae-heading"><div class="dialog-head"><div><small>BRAYRO AI · AI COMPANION</small><h2 id="rae-heading">Ask Rae</h2></div><button type="button" data-rae-close aria-label="Close Rae">×</button></div><div class="rae-intro"><img class="rae-face" src="/assets/rae-face.svg" alt="" width="45" height="45"><p>Tell me what you are working on. I can explain the work, compare options or point you to Yash.</p></div><div class="rae-messages" role="log" aria-live="polite" aria-relevant="additions text"></div><p class="rae-status" role="status"></p><form class="rae-form"><label for="rae-input">Your question</label><div><textarea id="rae-input" name="message" rows="2" maxlength="1200" placeholder="What would you like to know?"></textarea><button type="submit">Send ↗</button></div></form><a class="rae-fallback" href="mailto:yashganesh.work@gmail.com">Prefer to email Yash? ↗</a></dialog>`;
function shell(){
 return {name:'living-sketchbook-html',transformIndexHtml(html,ctx){
  const route=pathForFile(ctx.filename||''),canonical=`${origin}${route}`;
  return html.replace('<!-- SHELL_HEADER -->',`<header class="site-header" id="top"><div class="container header-inner">${nav}</div></header>`)
   .replace('<!-- SHELL_FOOTER -->',footer)
   .replace('<!-- SHELL_DIALOGS -->',dialogs)
   .replace('</head>',`<link rel="canonical" href="${canonical}"><meta property="og:url" content="${canonical}"><meta name="x-brayro-commit" content="${process.env.VERCEL_GIT_COMMIT_SHA||process.env.GITHUB_SHA||'local'}"></head>`);
 }};
}
function cleanRoutes(server){server.middlewares.use((req,_res,next)=>{if(!req.url)return next();const url=new URL(req.url,'http://local');const path=url.pathname.replace(/\/$/,'')||'/';let prefix='';let route=path;if(path.startsWith('/ae/')||path==='/ae'){prefix='/ae';route=path.slice(3)||'/'}else if(path.startsWith('/au/')||path==='/au'){prefix='/au';route=path.slice(3)||'/'}const file=routeFiles[route];if(file){req.url=`/${file}${url.search}`;return next()}next()})}
function previewRoutes(server){server.middlewares.use((req,res,next)=>{
 if(!req.url)return next();
 const url=new URL(req.url,'http://local'),path=url.pathname.replace(/\/$/,'')||'/';
 if(path==='/api/market'){res.statusCode=200;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','private, no-store');res.end(JSON.stringify({country:null,market:'in',language:'en',source:'local-preview'}));return}
 const redirect=target=>{const [pathname,hash]=target.split('#');res.statusCode=308;res.setHeader('Location',pathname+url.search+(hash?'#'+hash:''));res.end()};
 if(path==='/ae/ar'||path.startsWith('/ae/ar/'))return redirect('/ae'+path.slice('/ae/ar'.length));
 let prefix='',route=path;
 if(path.startsWith('/ae/')||path==='/ae'){prefix='/ae';route=path.slice(3)||'/'}
 else if(path.startsWith('/au/')||path==='/au'){prefix='/au';route=path.slice(3)||'/'}
 const retired={'/clients':'/#work','/founder':'/#studio','/ai-workflow-audit':'/plans#ai-audit','/company-second-brain':'/plans#second-brain','/case-studies/fakhrimart':'/clients/fakhrimart','/fakhrimart-case-study.html':'/clients/fakhrimart','/clients.html':'/#work','/founder.html':'/#studio','/ai-workflow-audit.html':'/plans#ai-audit','/company-second-brain.html':'/plans#second-brain','/plans.html':'/plans','/terms.html':'/terms'};
 if(retired[route])return redirect(prefix+retired[route]);
 if(routeFiles[route])req.url=`${prefix}${route==='/'?'':route}/index.html${url.search}`;
 next();
})}
export default defineConfig({publicDir:'static',plugins:[shell(),{name:'preview-routes',configureServer:cleanRoutes,configurePreviewServer:previewRoutes}],build:{outDir:'dist',emptyOutDir:true,rollupOptions:{input:{home:resolve('index.html'),plans:resolve('plans.html'),case:resolve('fakhrimart-case-study.html'),terms:resolve('terms.html')}}}});
