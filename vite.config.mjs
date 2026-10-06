import {defineConfig} from 'vite';
import {resolve} from 'node:path';
import {readFileSync} from 'node:fs';
import {raeDialog} from './src/site/rae-dialog-shell.mjs';

const origin='https://brayroai.vercel.app';
const footerVector=readFileSync(resolve('static/brand/logo-horizontal-reverse.svg'),'utf8').replace(/<\?xml[^>]+>/,'').replace('id="title"','id="footer-brand-title"').replace('aria-labelledby="title"','aria-hidden="true"').replace('<svg ','<svg class="footer-logo" ');
const routeFiles={'/':'index.html','/plans':'plans.html','/clients':'clients.html','/clients/fakhrimart':'fakhrimart-case-study.html','/work/lernio':'work-lernio.html','/work/brace':'work-brace.html','/founder':'founder.html','/ai-workflow-audit':'ai-workflow-audit.html','/company-second-brain':'company-second-brain.html','/terms':'terms.html','/privacy':'privacy.html'};
const pathForFile=file=>Object.entries(routeFiles).find(([,name])=>file.endsWith(name))?.[0]||'/';
const routeLabels=Object.freeze({
 '/':'Home','/plans':'Plans','/clients':'Work','/clients/fakhrimart':'FakhriMart','/work/lernio':'Lernio AI','/work/brace':'BRACE','/founder':'Studio','/ai-workflow-audit':'AI Workflow Audit','/company-second-brain':'Company Second Brain','/terms':'Terms','/privacy':'Privacy'
});
const routeDescriptions=Object.freeze({
 '/':'BRAYRO AI is an independent creative technology studio for distinctive websites and practical AI systems.',
 '/plans':'Compare BRAYRO AI monthly website builds, one-time website projects and practical AI systems with published starting prices.',
 '/clients':'Verified client work plus self-initiated BRAYRO studio systems with inspectable live builds and repositories.',
 '/clients/fakhrimart':'How BRAYRO AI designed and built FakhriMart around catalogue discovery and useful WhatsApp enquiries.',
 '/work/lernio':'Lernio AI is a self-initiated BRAYRO studio system spanning curriculum, tutoring, practice, revision, planning and analytics.',
 '/work/brace':'BRACE is a self-initiated local-first AI memory system with provenance, MCP connections, desktop workflows and automation.',
 '/founder':'Meet Yash Ganesh, founder of BRAYRO AI, where strategy, interface design and implementation stay connected.',
 '/ai-workflow-audit':'A focused AI Workflow Audit to find realistic automation opportunities before buying tools or building a system.',
 '/company-second-brain':'A grounded internal AI knowledge assistant built around approved company information and clear human review.',
 '/terms':'BRAYRO AI working terms for website projects, monthly builds and AI systems.',
 '/privacy':'How BRAYRO AI handles market preferences, analytics, project enquiries and conversations with Rae.'
});
const breadcrumbRoutes=Object.freeze({
 '/clients/fakhrimart':[['Work','/clients'],['FakhriMart','/clients/fakhrimart']],
 '/work/lernio':[['Work','/clients'],['Lernio AI','/work/lernio']],
 '/work/brace':[['Work','/clients'],['BRACE','/work/brace']],
 '/ai-workflow-audit':[['Plans','/plans'],['AI Workflow Audit','/ai-workflow-audit']],
 '/company-second-brain':[['Plans','/plans'],['Company Second Brain','/company-second-brain']],
 '/terms':[['Home','/'],['Terms','/terms']],
 '/privacy':[['Home','/'],['Privacy','/privacy']]
});
const absolute=(route,prefix='')=>`${origin}${prefix}${route==='/'?'/':route}`;
const json=value=>JSON.stringify(value).replace(/</g,'\\u003c');
const schemaFor=(route,canonical)=>{
 const graph=[];
 if(route==='/'){
  graph.push({'@type':'Organization','@id':`${origin}/#organization`,name:'BRAYRO AI',url:`${origin}/`,logo:`${origin}/brand/brayro-monogram.svg`,email:'yashganesh.work@gmail.com',founder:{'@type':'Person',name:'Yash Ganesh',url:`${origin}/founder`},areaServed:[{'@type':'Country',name:'India'},{'@type':'Country',name:'United Arab Emirates'},{'@type':'Country',name:'Australia'}],sameAs:['https://github.com/GYASH28']});
  graph.push({'@type':'WebSite','@id':`${origin}/#website`,url:`${origin}/`,name:'BRAYRO AI',publisher:{'@id':`${origin}/#organization`}});
 }
 if(route==='/plans')graph.push({'@type':'OfferCatalog',name:'BRAYRO AI services',url:canonical,itemListElement:[
  {'@type':'Offer','itemOffered':{'@type':'Service',name:'Website design and development',provider:{'@id':`${origin}/#organization`}}},
  {'@type':'Offer','itemOffered':{'@type':'Service',name:'AI workflow systems',provider:{'@id':`${origin}/#organization`}}}
 ]});
 if(route==='/ai-workflow-audit'||route==='/company-second-brain')graph.push({'@type':'Service',name:routeLabels[route],url:canonical,provider:{'@id':`${origin}/#organization`},areaServed:['India','United Arab Emirates','Australia']});
 if(route==='/clients/fakhrimart'||route.startsWith('/work/'))graph.push({'@type':'CreativeWork',name:routeLabels[route],url:canonical,creator:{'@id':`${origin}/#organization`},isPartOf:{'@id':`${origin}/#website`}});
 const crumbs=breadcrumbRoutes[route];
 if(crumbs)graph.push({'@type':'BreadcrumbList',itemListElement:crumbs.map(([name,path],index)=>({'@type':'ListItem',position:index+1,name,item:absolute(path)}))});
 return graph.length?{`@context`:'https://schema.org','@graph':graph}:null;
};

const nav=`<a class="brand" href="/" aria-label="BRAYRO AI Agency home"><picture><source media="(max-width:760px)" srcset="/brand/brayro-monogram.svg"><img src="/brand/logo-horizontal-compact-reverse.svg" alt="BRAYRO AI Agency" width="900" height="210"></picture></a><nav class="desktop-nav" aria-label="Main navigation"><a href="/clients" aria-label="Work"><span class="nav-index" aria-hidden="true">01</span><span class="nav-word"><span>Work</span><span aria-hidden="true">Work</span></span></a><a href="/plans" aria-label="Plans"><span class="nav-index" aria-hidden="true">02</span><span class="nav-word"><span>Plans</span><span aria-hidden="true">Plans</span></span></a><a href="/founder" aria-label="Studio"><span class="nav-index" aria-hidden="true">03</span><span class="nav-word"><span>Studio</span><span aria-hidden="true">Studio</span></span></a></nav><div class="header-actions"><button class="market-button" type="button" data-market-open aria-haspopup="dialog" aria-controls="market-dialog">India · INR <svg class="market-chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg></button><a class="header-cta" href="/#contact">Start a project <span aria-hidden="true">↗</span></a><button class="menu-button" type="button" data-menu-open aria-label="Open menu" aria-haspopup="dialog" aria-controls="menu-dialog"><span></span><span></span></button></div>`;
const footer=`<footer class="footer premium-footer" id="site-footer"><div class="wrap footer-head"><p>BRAYRO AI<br>Independent creative technology studio</p><a class="footer-contact" href="mailto:yashganesh.work@gmail.com">Start a project <span aria-hidden="true">↗</span></a></div><div class="wrap footer-columns"><nav aria-label="Explore the site"><strong>THE STUDIO</strong><a href="/">Home</a><a href="/clients">Client archive</a><a href="/clients/fakhrimart">FakhriMart case</a><a href="/founder">Meet Yash</a><a href="/plans">Plans &amp; scope</a></nav><nav aria-label="AI and details"><strong>THE PRACTICE</strong><a href="/#method">How we work</a><a href="/ai-workflow-audit">AI Workflow Audit</a><a href="/company-second-brain">Company Second Brain</a><a href="/work/lernio">Lernio AI system</a><a href="/work/brace">BRACE system</a><button type="button" data-rae-open>Ask Rae ↗</button><a href="/terms">Terms</a><a href="/privacy">Privacy</a></nav><div><strong>A CONVERSATION</strong><a href="mailto:yashganesh.work@gmail.com">Email Yash ↗</a><a href="https://wa.me/919175524637" target="_blank" rel="noreferrer">WhatsApp ↗</a><p>Based in Pune, India.<br>Built for the browser, everywhere.</p></div><div class="footer-monogram"><img src="/brand/brayro-monogram.svg" alt="" width="200" height="200" loading="lazy"></div></div><a class="wrap footer-mark" href="#top" aria-label="BRAYRO AI — return to the top" data-footer-wordmark><img src="/brand/logo-horizontal-reverse.svg" alt="" width="900" height="240" loading="lazy"><template data-footer-vector>${footerVector}</template></a><div class="wrap footer-base"><span>© 2026 BRAYRO AI</span><span>Strategy × Creativity × Real impact</span><a href="#top">Back to top ↑</a></div></footer>`;
const dialogs=`<dialog id="menu-dialog" class="menu-dialog" aria-label="Site menu" data-menu-scene="work">
 <div class="dialog-head"><span>BRAYRO AI <small>Independent creative technology studio</small></span><button type="button" data-menu-close aria-label="Close menu">×</button></div>
 <div class="menu-layout"><nav aria-label="Mobile navigation"><a href="/#work" aria-label="Work" aria-describedby="menu-description-0" data-menu-scene="work"><span class="menu-link-title">Work</span><small id="menu-description-0">Inside the FakhriMart build.</small><span class="menu-link-arrow" aria-hidden="true">↗</span></a><a href="/clients" aria-label="Clients" aria-describedby="menu-description-1" data-menu-scene="work"><span class="menu-link-title">Clients</span><small id="menu-description-1">Browse the client archive.</small><span class="menu-link-arrow" aria-hidden="true">↗</span></a><a href="/#method" aria-label="Method" aria-describedby="menu-description-2" data-menu-scene="mark"><span class="menu-link-title">Method</span><small id="menu-description-2">Websites, monthly builds, or AI.</small><span class="menu-link-arrow" aria-hidden="true">↗</span></a><a href="/plans" aria-label="Plans" aria-describedby="menu-description-3" data-menu-scene="mark"><span class="menu-link-title">Plans</span><small id="menu-description-3">Compare scope and starting prices.</small><span class="menu-link-arrow" aria-hidden="true">↗</span></a><a href="/founder" aria-label="Studio" aria-describedby="menu-description-4" data-menu-scene="studio"><span class="menu-link-title">Studio</span><small id="menu-description-4">Yash Ganesh. From idea to launch.</small><span class="menu-link-arrow" aria-hidden="true">↗</span></a><a href="/#contact" aria-label="Start a project" aria-describedby="menu-description-5" data-menu-scene="mark"><span class="menu-link-title">Start a project</span><small id="menu-description-5">Tell us what you want to build.</small><span class="menu-link-arrow" aria-hidden="true">↗</span></a></nav>
 <aside class="menu-preview" aria-hidden="true"><div class="menu-preview-art"><figure data-menu-art="work"><img src="/assets/fakhrimart-case-desktop-small.webp" width="900" height="563" alt="" loading="lazy" decoding="async"></figure><figure data-menu-art="studio"><img src="/assets/about-yash.webp" width="800" height="1000" alt="" loading="lazy" decoding="async"></figure><figure data-menu-art="mark"><img src="/brand/brayro-monogram.svg" width="200" height="200" alt="" loading="lazy"></figure></div><div class="menu-preview-copy"><span>YOUR NEXT MOVE</span><p data-menu-preview-title>Work</p><small data-menu-preview-summary>Inside the FakhriMart build.</small></div></aside></div>
 <div class="menu-base"><div class="menu-secondary"><a href="/ai-workflow-audit">AI Workflow Audit ↗</a><a href="/company-second-brain">Company Second Brain ↗</a><a href="/terms">Terms ↗</a></div><button class="menu-market" type="button" data-market-open>India · INR <span aria-hidden="true">⌄</span></button></div>
</dialog>
<dialog id="market-dialog" class="market-dialog" aria-labelledby="market-heading"><div class="dialog-head"><div><small class="market-kicker">A LOCAL STARTING POINT</small><h2 id="market-heading">Your corner<br>of the world<span>.</span></h2></div><button type="button" data-market-close aria-label="Close market selector">×</button></div><p>Same studio. A price book for your market.</p><div role="radiogroup" aria-label="Market and currency"><button type="button" role="radio" data-market-choice="in" aria-checked="true"><i aria-hidden="true">IN</i><strong>India<small>Indian rupee</small></strong><span>INR</span><b aria-hidden="true">✓</b></button><button type="button" role="radio" data-market-choice="ae" aria-checked="false"><i aria-hidden="true">AE</i><strong>United Arab Emirates<small>UAE dirham</small></strong><span>AED</span><b aria-hidden="true">✓</b></button><button type="button" role="radio" data-market-choice="au" aria-checked="false"><i aria-hidden="true">AU</i><strong>Australia<small>Australian dollar</small></strong><span>AUD</span><b aria-hidden="true">✓</b></button></div><p class="market-foot">Published regional prices. Your route and enquiry stay together.</p></dialog>
<button class="rae-launcher" type="button" data-rae-open aria-label="Ask Rae, BRAYRO AI's AI assistant"><img src="/assets/rae-face.svg" alt="" width="46" height="46"></button>
${raeDialog}`;
function shell(){
 return {name:'living-sketchbook-html',transformIndexHtml:{order:'pre',handler(html,ctx){
  const route=pathForFile(ctx.filename||''),canonical=absolute(route);
  const navRoute=route.startsWith('/clients/')||route.startsWith('/work/')?'/clients':route;
  const currentNav=nav.replace(`href="${navRoute}"`,`href="${navRoute}" aria-current="${route===navRoute?'page':'location'}"`);
  const title=html.match(/<title>([^<]+)<\/title>/i)?.[1]||`${routeLabels[route]||'BRAYRO AI'} · BRAYRO AI`;
  const description=html.match(/<meta name="description" content="([^"]+)"/i)?.[1]||routeDescriptions[route]||routeDescriptions['/'];
  const alternates=[
   ['en-IN',absolute(route)],['en-AE',absolute(route,'/ae')],['en-AU',absolute(route,'/au')],['x-default',absolute(route)]
  ].map(([lang,url])=>`<link rel="alternate" hreflang="${lang}" href="${url}">`).join('');
  const crumbs=breadcrumbRoutes[route];
  const breadcrumb=crumbs?`<nav class="page-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span>${crumbs.map(([name,path],index)=>index===crumbs.length-1?`<b aria-current="page">${name}</b>`:`<a href="${path}">${name}</a><span>/</span>`).join('')}</nav>`:'';
  const schema=schemaFor(route,canonical);
  const verification=process.env.GOOGLE_SITE_VERIFICATION?`<meta name="google-site-verification" content="${process.env.GOOGLE_SITE_VERIFICATION}">`:'';
  const social=`<meta name="robots" content="index,follow,max-image-preview:large"><meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical}"><meta property="og:locale" content="en_IN"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${description}"><meta name="twitter:image" content="https://brayroai.vercel.app/brand/og-card.png">`;
  const observability='<script src="/analytics-bootstrap.js"></script><script defer src="/_vercel/insights/script.js"></script><script defer src="/_vercel/speed-insights/script.js"></script>';
  return html.replace('<head>','<head><script src="/view-transition-lifecycle.js"></script>').replace('<body ','<body id="top" ').replace('<!-- SHELL_HEADER -->',`<header class="site-header"><div class="container header-inner">${currentNav}</div></header>`)
   .replace('<main id="main">',`<main id="main">${breadcrumb}`)
   .replace('<!-- SHELL_FOOTER -->',footer)
   .replace('<!-- SHELL_DIALOGS -->',dialogs)
   .replace('</head>',`<link rel="stylesheet" href="/src/site/global-polish.css"><link rel="stylesheet" href="/src/site/proof-conversion.css"><link rel="preload" href="/fonts/manrope-latin-variable.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/fonts/space-grotesk-variable.woff2" as="font" type="font/woff2" crossorigin><link rel="canonical" href="${canonical}">${alternates}${social}${html.includes('property="og:image"')?'':'<meta property="og:image" content="https://brayroai.vercel.app/brand/og-card.png">'}${verification}${schema?`<script type="application/ld+json">${json(schema)}</script>`:''}${observability}<meta name="x-brayro-commit" content="${process.env.VERCEL_GIT_COMMIT_SHA||process.env.GITHUB_SHA||'local'}"></head>`);
 }}};
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
 const retired={'/case-studies/fakhrimart':'/clients/fakhrimart','/fakhrimart-case-study.html':'/clients/fakhrimart','/clients.html':'/clients','/work-lernio.html':'/work/lernio','/work-brace.html':'/work/brace','/founder.html':'/founder','/ai-workflow-audit.html':'/ai-workflow-audit','/company-second-brain.html':'/company-second-brain','/plans.html':'/plans','/terms.html':'/terms','/privacy.html':'/privacy'};
 if(retired[route])return redirect(prefix+retired[route]);
 if(routeFiles[route])req.url=`${prefix}${route==='/'?'':route}/index.html${url.search}`;
 next();
})}
export default defineConfig({publicDir:'static',plugins:[shell(),{name:'preview-routes',configureServer:cleanRoutes,configurePreviewServer:previewRoutes}],build:{outDir:'dist',emptyOutDir:true,rollupOptions:{input:{home:resolve('index.html'),plans:resolve('plans.html'),clients:resolve('clients.html'),case:resolve('fakhrimart-case-study.html'),lernio:resolve('work-lernio.html'),brace:resolve('work-brace.html'),founder:resolve('founder.html'),audit:resolve('ai-workflow-audit.html'),brain:resolve('company-second-brain.html'),terms:resolve('terms.html'),privacy:resolve('privacy.html')}}}});
