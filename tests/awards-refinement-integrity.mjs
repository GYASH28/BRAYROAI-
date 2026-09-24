import fs from 'node:fs';

const read=path=>fs.readFileSync(path,'utf8');
const expect=(ok,message)=>{if(!ok){console.error('FAIL:',message);process.exitCode=1}else console.log('PASS:',message)};

const shellCss=read('public/global-shell.css');
const shellJs=read('public/global-shell.js');
const homeCss=read('public/experience-upgrade.css');
const pagesCss=read('public/experience-pages.css');
const rae=read('public/rae/rae-character.js');
const boot=read('public/rae.js');

expect(shellCss.includes('@view-transition')&&shellCss.includes('.global-nav.is-compact'),'global shell has route continuity and compact navigation styling');
expect(shellJs.includes('scrollY>72')&&shellJs.includes('global-nav-compact'),'global shell restores compact-on-scroll behavior');
expect(shellCss.includes('prefers-reduced-motion')&&homeCss.includes('prefers-reduced-motion')&&pagesCss.includes('prefers-reduced-motion'),'motion layers expose reduced-motion fallbacks');
expect(homeCss.includes('editorial finish')&&homeCss.includes('.v12-project-row'),'homepage has authored V25 visual refinement');
expect(pagesCss.includes('one art direction across existing inner routes')&&pagesCss.includes('content-visibility:auto'),'inner routes share the V25 system and offscreen rendering optimization');
expect(rae.includes('data-rae-vector="full-body"')&&!rae.includes('<image')&&!rae.includes('rae-illustration.webp'),'Rae full character is vector-only');
expect(boot.includes('data-rae-vector-launcher')&&!boot.includes('rae-illustration-thumb.webp'),'Rae launcher is vector-only');
expect(!shellCss.includes('scroll-behavior:smooth!important'),'navigation polish does not force motion globally');

if(process.exitCode)process.exit(process.exitCode);
