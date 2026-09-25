import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const productionOrigin='https://brayroai.vercel.app';
const googleFontsHref='https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=optional';
const buildCommit=(process.env.VERCEL_GIT_COMMIT_SHA||process.env.GITHUB_SHA||'local').trim();

const cleanRouteMap=Object.freeze({'/plans':'/plans.html','/founder':'/founder.html','/terms':'/terms.html','/ai-workflow-audit':'/ai-workflow-audit.html','/company-second-brain':'/company-second-brain.html','/clients':'/clients.html','/clients/fakhrimart':'/fakhrimart-case-study.html'});

// Keep source passes modular in the repo, but ship one ordered homepage sheet.
// V5 is intentionally absent: its homepage runtime exits immediately beneath V15,
// so its home-only CSS/JS is stripped instead of downloaded and parsed.
const homeStyleFiles=Object.freeze([
  'commercial-cut.css','latest-refinements.css','premium-polish.css','direction-pass.css','motion-v4.css','contact-priority.css','visual-finish.css','brayro-v12.css','brayro-v13.css','brayro-v14.css','brayro-v14-polish.css','brayro-v15.css','v15-accessibility.css','experience-motion-v16.css','cinematic-v18.css','cinematic-v20.css','brayro-cursor-v22.css','rae.css','home-performance.css','experience-upgrade.css'
]);
const readHomeStyles=()=>homeStyleFiles.map(file=>`/* ${file} */\n${readFileSync(resolve(process.cwd(),'public',file),'utf8')}`).join('\n\n');
// The homepage sheet is emitted manually, so it bypasses Vite's normal CSS optimizer.
// Compact comments and whitespace at build time while keeping source files readable.
const buildHomeStyles=()=>readHomeStyles().replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,' ').trim();

const normalisePath=(url='/')=>{const parsed=new URL(url,'http://brayro.local');return{parsed,pathname:parsed.pathname.length>1?parsed.pathname.replace(/\/$/,''):parsed.pathname}};
const mountCleanRoutes=server=>{server.middlewares.use((req,_res,next)=>{if(!req.url)return next();const{parsed,pathname}=normalisePath(req.url),target=cleanRouteMap[pathname];if(target)req.url=`${target}${parsed.search}`;next()})};
const mountLocalePreviewRoutes=server=>{server.middlewares.use((req,_res,next)=>{if(!req.url)return next();const{parsed,pathname}=normalisePath(req.url);if(/^\/(?:ae(?:\/ar)?|au)(?:\/.*)?$/.test(pathname)&&!pathname.includes('.'))req.url=`${pathname.replace(/\/$/,'')}/index.html${parsed.search}`;next()})};
const mountMarketPreviewApi=server=>{server.middlewares.use((req,res,next)=>{if(!req.url)return next();const{pathname}=normalisePath(req.url);if(pathname!=='/api/market')return next();res.statusCode=200;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','private, no-store, max-age=0');res.end(JSON.stringify({country:null,market:'in',language:'en',source:'local-preview'}))})};
const serveHomeStyleBundle=server=>{server.middlewares.use((req,res,next)=>{if(!req.url)return next();const{pathname}=normalisePath(req.url);if(pathname!=='/assets/brayro-home.css')return next();res.statusCode=200;res.setHeader('Content-Type','text/css; charset=utf-8');res.setHeader('Cache-Control','no-cache');res.end(readHomeStyles())})};
const pagePathFor=(filename='')=>filename.endsWith('/plans.html')?'/plans':filename.endsWith('/founder.html')?'/founder':filename.endsWith('/terms.html')?'/terms':filename.endsWith('/ai-workflow-audit.html')?'/ai-workflow-audit':filename.endsWith('/company-second-brain.html')?'/company-second-brain':filename.endsWith('/clients.html')?'/clients':filename.endsWith('/fakhrimart-case-study.html')?'/clients/fakhrimart':'/';
const globalLinks=Object.freeze([['Home','/'],['Capabilities','/#services'],['Clients','/clients'],['AI','/plans#ai-systems'],['Plans','/plans'],['Founder','/founder'],['Terms','/terms'],['Contact','/#contact']]);
const chapterLinks=Object.freeze({
  '/':[['Start','#top'],['Capabilities','#services'],['Work','#work'],['AI systems','#ai-systems'],['Plans','#plans'],['Contact','#contact']],
  '/plans':[['Choose','#choose'],['Monthly','#monthly'],['One-time','#builds'],['AI systems','#ai-systems'],['Compare','#compare']],
  '/founder':[['Story','#story'],['Principles','#principles'],['Method','#method'],['Contact','#contact']],
  '/clients':[['Index','#client-index'],['FakhriMart','/clients/fakhrimart']],
  '/clients/fakhrimart':[['Overview','#overview'],['Approach','#approach'],['Experience','#experience'],['Outcome','#outcome']],
  '/ai-workflow-audit':[['How it works','#how'],['Deliverables','#deliverables'],['Fit','#fit'],['FAQ','#faq']],
  '/company-second-brain':[['Architecture','#architecture'],['Integration','#integration'],['Scope','#scope'],['FAQ','#faq']],
  '/terms':[['Services','#services'],['Pricing','#pricing'],['Payments','#payments'],['Ownership','#ownership'],['Liability','#liability']]
});
const chapterTitles=Object.freeze({
  '/':'INDEX','/plans':'PLANS','/founder':'FOUNDER','/clients':'CLIENTS',
  '/clients/fakhrimart':'CASE','/ai-workflow-audit':'AI AUDIT',
  '/company-second-brain':'AI BRAIN','/terms':'TERMS'
});
const isGlobalCurrent=(label,href,path)=>href===path||(label==='Clients'&&path.startsWith('/clients'))||(label==='AI'&&(path==='/ai-workflow-audit'||path==='/company-second-brain'));
const globalShell=path=>{
  const links=globalLinks.map(([label,href])=>`<a href="${href}"${isGlobalCurrent(label,href,path)?' aria-current="page"':''}>${label}</a>`).join('');
  const chapter=(chapterLinks[path]||[]).map(([label,href])=>`<a href="${href}">${label}</a>`).join('');
  return `<header class="global-nav" data-global-nav><a class="global-nav__brand" href="/" aria-label="BRAYROAI home">BRAYRO<span>AI</span><small>CREATIVE TECHNOLOGY STUDIO</small></a><nav class="global-nav__links" aria-label="Global navigation">${links}</nav><div class="global-nav__right"><button class="market-trigger" type="button" data-market-trigger aria-haspopup="dialog" aria-controls="market-sheet" aria-expanded="false">Choose market <span aria-hidden="true">⌄</span></button><a class="market-language" data-market-language-link hidden href="#" aria-label="Switch UAE language">EN / العربية</a><a class="global-nav__cta" href="https://wa.me/919175524637?text=Hi%20Yash%2C%20I%20would%20like%20to%20discuss%20a%20project%20with%20BRAYROAI." target="_blank" rel="noreferrer">Start a project <span aria-hidden="true">↗</span></a><button class="global-nav__toggle" type="button" aria-label="Open navigation" aria-controls="global-menu" aria-haspopup="dialog" aria-expanded="false" data-global-toggle><span></span><span></span></button></div><span class="global-nav__progress" aria-hidden="true"><i data-global-progress></i></span></header><nav class="chapter-nav" aria-label="On this page"><span>${chapterTitles[path]||'INDEX'}</span><div>${chapter}</div></nav><div class="global-menu" id="global-menu" role="dialog" aria-modal="true" aria-label="Site navigation" hidden data-global-menu><button class="global-menu__close" type="button" data-global-close aria-label="Close navigation"><span aria-hidden="true">×</span><b>Close</b></button><nav aria-label="Mobile global navigation">${links}</nav><button class="global-menu__market" type="button" data-market-trigger aria-haspopup="dialog" aria-controls="market-sheet" aria-expanded="false">Choose market · currency</button><a class="global-menu__language" data-market-language-link hidden href="#" aria-label="Switch UAE language">EN / العربية</a><a class="global-menu__cta" href="https://wa.me/919175524637?text=Hi%20Yash%2C%20I%20would%20like%20to%20discuss%20a%20project%20with%20BRAYROAI." target="_blank" rel="noreferrer">Start a project ↗</a></div>`;
};
const innerFooter=`<footer class="global-footer" aria-label="BRAYROAI site footer"><div class="global-footer__top"><div><small>BRAYROAI / PUNE · INDIA</small><h2>Make something<br><em>worth returning to.</em></h2><p>Strategy, interface, engineering and practical AI with the person making the work.</p><a class="global-footer__cta" href="https://wa.me/919175524637?text=Hi%20Yash%2C%20I%20would%20like%20to%20discuss%20a%20project%20with%20BRAYROAI." target="_blank" rel="noreferrer">Tell us what you are building <span>↗</span></a></div><nav aria-label="Footer navigation"><div><small>EXPLORE</small><a href="/">Home</a><a href="/#services">Capabilities</a><a href="/clients">Client work</a><a href="/plans">Plans</a></div><div><small>GO DEEPER</small><a href="/ai-workflow-audit">AI Workflow Audit</a><a href="/company-second-brain">Company Second Brain</a><a href="/founder">Founder</a><a href="/terms">Terms</a></div><div><small>REACH US</small><a href="mailto:yashganesh.work@gmail.com">Email Yash ↗</a><a href="https://wa.me/919175524637" target="_blank" rel="noreferrer">WhatsApp ↗</a><button type="button" data-footer-rae>Ask Rae ↗</button><span>Pune, India · Working worldwide</span></div></nav></div><div class="global-footer__word" aria-hidden="true">BRAYRO<span>AI</span></div><div class="global-footer__base"><span>© 2026 BRAYROAI · DESIGN · ENGINEERING · USEFUL AI</span><a href="#top" data-back-to-top>BACK TO TOP ↑</a></div></footer>`;
const injectBefore=(html,marker,value)=>html.replace(marker,`${value}\n${marker}`);
const optimiseFonts=html=>{const blocking=`<link href="${googleFontsHref}" rel="stylesheet">`;if(!html.includes(blocking))return html;const nonBlocking=`<link rel="preload" as="style" media="(min-width: 761px)" href="${googleFontsHref}" onload="this.onload=null;this.rel='stylesheet'" data-layout-stable-fonts>\n  <noscript><link href="${googleFontsHref}" rel="stylesheet" media="(min-width: 761px)"></noscript>`;return html.replace(blocking,nonBlocking)};
const removeHomepageStyleLinks=html=>{let next=html;for(const file of homeStyleFiles){const escaped=file.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');next=next.replace(new RegExp(`\\s*<link rel="stylesheet" href="/${escaped}"(?: [^>]*)?>\\s*`,'g'),'\n  ')}return next};

const experienceTransform={
  name:'brayro-experience-transform',
  configureServer(server){mountMarketPreviewApi(server);mountCleanRoutes(server);serveHomeStyleBundle(server)},
  configurePreviewServer(server){mountMarketPreviewApi(server);mountLocalePreviewRoutes(server);mountCleanRoutes(server)},
  generateBundle(){this.emitFile({type:'asset',fileName:'assets/brayro-home.css',source:buildHomeStyles()})},
  transformIndexHtml:{order:'pre',handler(html,context){
    const filename=context?.filename||'',isHome=context?.path==='/'||context?.path==='/index.html'||filename.endsWith('/index.html'),isPlans=filename.endsWith('/plans.html'),isAiDetail=filename.endsWith('/ai-workflow-audit.html')||filename.endsWith('/company-second-brain.html'),isFakhriCase=filename.endsWith('/fakhrimart-case-study.html'),canonicalUrl=`${productionOrigin}${pagePathFor(filename)}`,shareImage=isFakhriCase?`${productionOrigin}/assets/fakhrimart-case-desktop.png`:`${productionOrigin}/assets/hero-background.webp`;
    html=optimiseFonts(html);

    if(!html.includes('data-v21-global'))html=injectBefore(html,'</head>',`  <style data-v21-global>
    .skip-link{position:fixed!important;z-index:9999!important;top:.75rem!important;left:.75rem!important;transform:translate3d(0,-180%,0)!important;opacity:0!important;pointer-events:none!important;transition:transform .28s cubic-bezier(.16,1,.3,1),opacity .2s ease!important}
    .skip-link:focus,.skip-link:focus-visible{transform:translate3d(0,0,0)!important;opacity:1!important;pointer-events:auto!important}
    @media(prefers-reduced-motion:reduce){.skip-link{transition:none!important}}
  </style>`);
    if(!html.includes('name="x-brayro-commit"'))html=injectBefore(html,'</head>',`  <meta name="x-brayro-commit" content="${buildCommit}">`);
    if(!html.includes('rel="canonical"'))html=injectBefore(html,'</head>',`  <link rel="canonical" href="${canonicalUrl}" data-safe-v20-meta>\n  <meta property="og:url" content="${canonicalUrl}">\n  <meta property="og:image" content="${shareImage}">\n  <meta name="twitter:image" content="${shareImage}">`);
    if(isAiDetail&&!html.includes('href="/v15-accessibility.css"'))html=injectBefore(html,'</head>','  <link rel="stylesheet" href="/v15-accessibility.css" data-v15-accessibility>');

    if(isHome){
      html=html.replace(/\s*<link rel="stylesheet" href="\/scrollcraft\.css">\s*/g,'\n  ').replace(/\s*<script src="\/scrollcraft\.js"><\/script>\s*/g,'\n  ').replace(/\s*<link rel="stylesheet" href="\/motion-v5\.css">\s*/g,'\n  ').replace(/\s*<script src="\/motion-v5\.js"><\/script>\s*/g,'\n  ');
      html=html.replace(/\s*<div class="v12-cursor"[^>]*>[^<]*<\/div>\s*/g,'\n  ');
      html=removeHomepageStyleLinks(html);
      if(!html.includes('data-js-bootstrap'))html=injectBefore(html,'</head>',`  <script data-js-bootstrap>document.documentElement.classList.add('js')</script>`);
      if(!html.includes('data-brayro-home-styles'))html=injectBefore(html,'</head>','  <link rel="stylesheet" href="/assets/brayro-home.css" data-brayro-home-styles data-brayro-v13>');

      html=html.replace('Distinctive websites, digital products and practical AI systems. Strategy through launch, directed as one complete production.','Distinctive websites, digital products and practical AI systems—built to make businesses easier to understand and trust. Strategy through launch, one connected production.');
      html=html.replace('Move across the index. Real client work stays first; BRAYROAI lab entries show the interaction and system thinking behind the studio itself.','Real client work stays first. BRAYROAI studio studies are labelled separately so client proof and internal experimentation never blur together.');
      html=html.replace('Catalogue-led yarn website / responsive commerce enquiry experience','Verified client work / catalogue-led yarn website / responsive enquiry experience');
      html=html.replace('A live business interface, not a fake case study.','A real client website, built for browsing and enquiries.');
      html=html.replace('A catalogue-led yarn website designed for confident browsing and direct enquiries across desktop and mobile.','A live catalogue-led yarn website shaped around clear product browsing, responsive usability and direct enquiries across desktop and mobile.');
      html=html.replace('Yash leads strategy, interface and implementation. The idea stays intact because it does not disappear between departments.','Yash leads strategy, interface and implementation, so clients stay close to the person making the decisions instead of being passed between departments.');
      html=html.replace('WhatsApp is fastest. A short project brief is ready in email if you need it.','WhatsApp is fastest. Tell us what needs to improve and we will recommend the smallest sensible scope—not force a bigger package.');
      // The main navigation stays on the homepage journey. The full client
      // archive remains linked from the Work section and the footer.

      if(!html.includes('data-client-archive-link'))html=html.replace('Real client work stays first. BRAYROAI studio studies are labelled separately so client proof and internal experimentation never blur together.</p>','Real client work stays first. BRAYROAI studio studies are labelled separately so client proof and internal experimentation never blur together. <a data-client-archive-link class="text-link" href="/clients">Explore all client work <span aria-hidden="true">→</span></a></p>');
      if(!html.includes('data-fakhri-case-link'))html=html.replace('<a class="text-link magnetic" data-cursor-label="LIVE →" href="https://fakhriyarns.vercel.app/" target="_blank" rel="noreferrer">','<a data-fakhri-case-link class="text-link magnetic" data-cursor-label="CASE" href="/clients/fakhrimart">Read the case study <span aria-hidden="true">→</span></a><a class="text-link magnetic" data-cursor-label="LIVE" href="https://fakhriyarns.vercel.app/" target="_blank" rel="noreferrer">');
      if(!html.includes('data-v20-text-cycle'))html=html.replace('<div class="v12-hero-meta" aria-label="BRAYROAI disciplines"><span>Web Experiences</span><span>Product Design</span><span>Frontend Engineering</span><span>AI Systems</span></div>','<div class="v12-hero-meta" aria-label="BRAYROAI disciplines"><span>Web Experiences</span><span>Product Design</span><span>Frontend Engineering</span><span>AI Systems</span></div>\n          <div class="v20-text-cycle" data-v20-text-cycle aria-hidden="true"><span>BUILT FOR</span><strong><i data-v20-cycle-word>BRANDS</i><b aria-hidden="true"></b></strong></div>');

      html=html.replaceAll('<img class="hero__background" src="/assets/hero-background.webp" width="1440" height="810" alt="">','<img class="hero__background" src="/assets/hero-background.webp" width="1440" height="810" loading="eager" fetchpriority="high" alt="">');
      html=html.replace('<img class="hero__subject" src="/assets/yash-cutout.webp" width="900" height="697" alt="Yash Ganesh, founder of BRAYROAI.">','<img class="hero__subject" src="/assets/yash-cutout.webp" width="900" height="697" loading="eager" fetchpriority="high" alt="Yash Ganesh, founder of BRAYROAI.">');

      if(!html.includes('data-v21-critical'))html=injectBefore(html,'</head>',`  <style data-v21-critical>
    .opening-sequence{animation:openingAway 0s .90s both}.opening-sequence__mark{animation-duration:.60s}.opening-sequence__shutter--top,.opening-sequence__shutter--bottom{animation-duration:.64s;animation-delay:.20s}.opening-sequence>span{animation-duration:.50s;animation-delay:.13s}.site-nav{animation-duration:.42s;animation-delay:.50s}
    @media(max-width:760px){.opening-sequence{animation-delay:.80s}.opening-sequence__mark{animation-duration:.54s}.opening-sequence__shutter--top,.opening-sequence__shutter--bottom{animation-duration:.57s;animation-delay:.17s}.opening-sequence>span{animation-duration:.43s;animation-delay:.10s}.site-nav{animation-delay:.42s}}
  </style>`);

      if(!html.includes('src="/brayro-v14.js"'))html=html.replace('<script src="/brayro-v12.js"></script>','<script src="/brayro-v12.js"></script>\n  <script src="/brayro-v14.js"></script>');
      if(!html.includes('src="/brayro-v15.js"'))html=html.replace('<script src="/brayro-v14.js"></script>','<script src="/brayro-v14.js"></script>\n  <script src="/brayro-v15.js"></script>');
    }

    if(isPlans)html=html.replace('Use a monthly partnership for ongoing website attention, a one-time build for a complete launch, or a focused AI system when the work inside the company needs to become easier.','Choose monthly support for ongoing website improvement, a one-time build for a complete launch, or a focused AI system for internal work. If you are unsure, start with the outcome you need and we will point you to the smallest sensible scope.');

    if(!isHome&&!html.includes('href="/experience-motion-v16.css"'))html=injectBefore(html,'</head>','  <link rel="stylesheet" href="/experience-motion-v16.css" data-v16-motion>');
    if(!isHome&&!html.includes('href="/brayro-cursor-v22.css"'))html=injectBefore(html,'</head>','  <link rel="stylesheet" href="/brayro-cursor-v22.css" data-v22-cursor>');
    if(!isHome&&!html.includes('href="/rae.css"'))html=injectBefore(html,'</head>','  <link rel="stylesheet" href="/rae.css" data-rae-style>');
    if(!isHome&&!html.includes('src="/experience-motion-v16.js"'))html=html.replace('</body>','  <script src="/experience-motion-v16.js" data-v16-motion></script>\n</body>');
    if(isHome&&!html.includes('src="/cinematic-v18.js"'))html=html.replace('</body>','  <script src="/cinematic-v18.js" data-v18-cinematic></script>\n</body>');
    if(isHome&&!html.includes('src="/cinematic-v20.js"'))html=html.replace('</body>','  <script src="/cinematic-v20.js" data-v20-polish></script>\n</body>');
    if(!html.includes('src="/brayro-cursor-v22.js"'))html=html.replace('</body>','  <script src="/brayro-cursor-v22.js" data-v22-cursor></script>\n</body>');
    if(!html.includes('src="/rae.js"'))html=html.replace('</body>','  <script src="/rae.js" data-rae></script>\n</body>');
    const route=pagePathFor(filename);
    if(!isHome&&!/<body\b[^>]*\bid=/.test(html))html=html.replace(/<body\b([^>]*)>/,'<body id="top"$1>');
    if(!html.includes('data-global-shell')){
      html=injectBefore(html,'</head>','  <link rel="stylesheet" href="/global-shell.css" data-global-shell>');
      if(!isHome)html=injectBefore(html,'</head>','  <link rel="stylesheet" href="/experience-pages.css">');
      html=html.replace(/(<body\b[^>]*>)/,`$1\n  ${globalShell(route)}`);
      if(!isHome)html=injectBefore(html,'</body>',innerFooter);
      html=injectBefore(html,'</body>','  <script src="/global-shell.js" defer></script>');
      html=injectBefore(html,'</body>','  <script type="module" src="/src/market-switcher.js"></script>');
      html=injectBefore(html,'</body>','  <script type="module" src="/src/react-islands.js" data-react-islands></script>');
      html=injectBefore(html,'</body>','  <script src="/market-events.js" defer></script>');
    }
    if(!html.includes('data-market-context'))html=injectBefore(html,'</head>',`  <script data-market-context>${readFileSync(resolve(process.cwd(),'public/market-context.js'),'utf8')}</script>`);
    return html;
  }}
};

export default defineConfig({publicDir:'public',plugins:[experienceTransform],build:{outDir:'dist',emptyOutDir:true,assetsInlineLimit:4096,rollupOptions:{input:{home:resolve(process.cwd(),'index.html'),plans:resolve(process.cwd(),'plans.html'),founder:resolve(process.cwd(),'founder.html'),terms:resolve(process.cwd(),'terms.html'),audit:resolve(process.cwd(),'ai-workflow-audit.html'),secondBrain:resolve(process.cwd(),'company-second-brain.html'),clients:resolve(process.cwd(),'clients.html'),fakhrimartCase:resolve(process.cwd(),'fakhrimart-case-study.html')}}}});
