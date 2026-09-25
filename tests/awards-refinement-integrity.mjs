import fs from 'node:fs';

const read=path=>fs.readFileSync(path,'utf8');
const expect=(ok,message)=>{if(!ok){console.error('FAIL:',message);process.exitCode=1}else console.log('PASS:',message)};

const shellCss=read('public/global-shell.css');
const shellJs=read('public/global-shell.js');
const homeCss=read('public/experience-upgrade.css');
const pagesCss=read('public/experience-pages.css');
const rae=read('public/rae/rae-character.js');
const boot=read('public/rae.js');
const aiCss=read('public/ai-service-pages.css');
const termsCss=read('public/terms-page.css');
const vite=read('vite.config.mjs');
const caseStudy=read('fakhrimart-case-study.html');
const home=read('index.html');

expect(shellCss.includes('@view-transition')&&shellCss.includes('.global-nav.is-compact'),'global shell has route continuity and compact navigation styling');
expect(shellJs.includes('scrollY>72')&&shellJs.includes('global-nav-compact'),'global shell restores compact-on-scroll behavior');
expect(shellCss.includes('BRAYROAI V27')&&shellCss.includes('.global-nav__links a:nth-child(7)')&&shellCss.includes('scroll-snap-type:x proximity'),'V27 simplifies desktop chrome and improves mobile chapter navigation');
expect(shellJs.includes('keep the active chapter centered')&&shellJs.includes("track.scrollTo"),'mobile chapter rail follows the active section');
expect(!shellJs.includes("if(innerWidth>1280&&!menu.hidden)setOpen(false)"),'desktop menu is not dismissed by incidental wide-screen resizes');
expect(shellCss.includes('::selection{background:#ff8a00'),'brand selection treatment is consistent across routes');
expect(shellJs.includes('syncInitialChapter')&&shellJs.includes("addEventListener('hashchange'"),'chapter navigation has an immediate and hash-aware active state');
expect(shellCss.includes('micro-navigation details from cross-browser QA')&&shellCss.includes('env(safe-area-inset-top)'), 'mobile navigation respects safe-area chrome');
expect(vite.includes("'/company-second-brain':'AI BRAIN'")&&vite.includes("${chapterTitles[path]||'INDEX'}"),'chapter rail uses short human route labels');
expect(vite.includes("label==='Clients'&&path.startsWith('/clients')")&&vite.includes("path==='/ai-workflow-audit'"),'global navigation preserves nested Clients and AI context');
expect(vite.includes('href="#top" data-back-to-top')&&vite.includes('if(!isHome&&!/<body\\b[^>]*\\bid=/.test(html))')&&shellJs.includes("if(!link.matches('[data-back-to-top]'))history.pushState"),'back-to-top has a progressive target without URL hash pollution');
expect(caseStudy.includes('fakhrimart-case-desktop.webp\" as=\"image\" type=\"image/webp\"')&&!caseStudy.includes('preload\" href=\"/assets/fakhrimart-case-desktop.png'), 'case study preloads the compact WebP instead of the 1.3MB PNG');
expect((caseStudy.match(/fakhrimart-case-desktop\.webp/g)||[]).length>=3&&(caseStudy.match(/fakhrimart-case-mobile\.webp/g)||[]).length>=2,'case study renders WebP proof imagery');
expect(home.includes('src="/assets/fakhrimart-case-desktop.webp"')&&home.includes('src="/assets/fakhrimart-case-mobile.webp"'),'homepage client proof renders WebP imagery');
expect(shellCss.includes('prefers-reduced-motion')&&homeCss.includes('prefers-reduced-motion')&&pagesCss.includes('prefers-reduced-motion'),'motion layers expose reduced-motion fallbacks');
expect(homeCss.includes('editorial finish')&&homeCss.includes('.v12-project-row'),'homepage has authored V25 visual refinement');
expect(pagesCss.includes('one art direction across existing inner routes')&&pagesCss.includes('content-visibility:auto'),'inner routes share the V25 system and offscreen rendering optimization');
expect(rae.includes('data-rae-vector="full-body"')&&!rae.includes('<image')&&!rae.includes('rae-illustration.webp'),'Rae full character is vector-only');
expect(boot.includes('data-rae-vector-launcher')&&!boot.includes('rae-illustration-thumb.webp'),'Rae launcher is vector-only');
const raePolish=read('public/rae/rae-polish-v5.css');
const raeBase=read('public/rae.css');
expect(raeBase.includes('contain:none!important')&&raeBase.includes('width:100dvw!important'),'mobile Rae uses the viewport as its containing block');
expect(Buffer.byteLength(raePolish,'utf8')<8192,'Rae lazy polish stays below its 8KB source guardrail');
expect(!shellCss.includes('scroll-behavior:smooth!important'),'navigation polish does not force motion globally');
expect(vite.includes("if(!isHome)html=injectBefore(html,'</head>','  <link rel=\"stylesheet\" href=\"/experience-pages.css\">');"),'homepage skips the inner-route stylesheet');
expect(aiCss.includes('reserve the bottom-right assistant lane')&&aiCss.includes('margin-right:clamp(7rem,12vw,11.5rem)'),'AI offer pricing reserves room for Rae on wide screens');
expect(termsCss.includes('min-height:68svh')&&termsCss.includes('padding-bottom:3.5rem'),'desktop Terms hero uses the measured compact first fold');

if(process.exitCode)process.exit(process.exitCode);

expect(aiCss.includes('BRAYROAI V30')&&aiCss.includes('scroll-snap-type:x proximity'),'AI process tabs expose a tactile mobile rail');
expect(aiCss.includes('BRAYROAI V31')&&aiCss.includes('.faq summary:focus-visible'),'custom AI controls restore visible focus');
const aiJs=read('public/ai-service-pages.js');
expect(aiJs.includes("this.stage.setAttribute('role','tabpanel')")&&aiJs.includes("tab.setAttribute('aria-controls',this.stage.id)")&&aiJs.includes('tab.tabIndex=active?0:-1')&&aiJs.includes("event.key==='Home'")&&aiJs.includes("event.key==='End'"),'AI process tabs use complete roving-focus keyboard semantics');
expect(aiJs.includes("this.status?.setAttribute('aria-live','polite')")&&aiJs.includes("node.setAttribute('aria-pressed',String(active))"),'AI architecture controls expose selection and live status semantics');
expect(home.includes('fakhrimart-case-desktop.webp" width="1440" height="1000" loading="lazy" decoding="async"'),'homepage proof imagery decodes asynchronously below the fold');
