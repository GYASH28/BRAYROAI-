import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const googleFontsHref='https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=optional';

const experienceTransform={
  name:'brayro-experience-transform',
  transformIndexHtml:{
    order:'pre',
    handler(html,context){
      const filename=context?.filename||'';
      const isHome=context?.path==='/'||context?.path==='/index.html'||filename.endsWith('/index.html');
      const isAiDetail=filename.endsWith('/ai-workflow-audit.html')||filename.endsWith('/company-second-brain.html');

      // Shared finish across every public page. The skip link remains fully
      // keyboard-accessible but never appears as stray visible chrome until it
      // actually receives focus.
      if(!html.includes('data-v21-global')){
        html=html.replace('</head>',`  <style data-v21-global>
    .skip-link{position:fixed!important;z-index:9999!important;top:.75rem!important;left:.75rem!important;transform:translate3d(0,-180%,0)!important;opacity:0!important;pointer-events:none!important;transition:transform .28s cubic-bezier(.16,1,.3,1),opacity .2s ease!important}
    .skip-link:focus,.skip-link:focus-visible{transform:translate3d(0,0,0)!important;opacity:1!important;pointer-events:auto!important}
    @media(prefers-reduced-motion:reduce){.skip-link{transition:none!important}}
  </style>\n</head>`);
      }

      if(isAiDetail&&!html.includes('href="/v15-accessibility.css"')){
        html=html.replace('</head>','  <link rel="stylesheet" href="/v15-accessibility.css" data-v15-accessibility>\n</head>');
      }

      if(isHome){
        html=html.replace(
          `<link href="${googleFontsHref}" rel="stylesheet">`,
          `<link rel="preload" as="style" href="${googleFontsHref}" onload="this.onload=null;this.rel='stylesheet'">\n  <noscript><link rel="stylesheet" href="${googleFontsHref}"></noscript>`
        );

        // The homepage no longer mounts ScrollCraft. V19/V20 own its eight flow scenes,
        // so avoid shipping legacy ScrollCraft CSS/JS on the critical path while
        // preserving ScrollCraft on the dedicated pages that still use it.
        html=html.replace(/\s*<link rel="stylesheet" href="\/scrollcraft\.css">\s*/,'\n  ');
        html=html.replace(/\s*<script src="\/scrollcraft\.js"><\/script>\s*/,'\n  ');

        // Make the 21st-inspired hero text cycle part of initial HTML instead of
        // injecting a layout-affecting node after first paint. This removes CLS.
        if(!html.includes('data-v20-text-cycle')){
          html=html.replace(
            '<div class="v12-hero-meta" aria-label="BRAYROAI disciplines"><span>Web Experiences</span><span>Product Design</span><span>Frontend Engineering</span><span>AI Systems</span></div>',
            '<div class="v12-hero-meta" aria-label="BRAYROAI disciplines"><span>Web Experiences</span><span>Product Design</span><span>Frontend Engineering</span><span>AI Systems</span></div>\n          <div class="v20-text-cycle" data-v20-text-cycle aria-hidden="true"><span>BUILT FOR</span><strong><i data-v20-cycle-word>BRANDS</i><b aria-hidden="true"></b></strong></div>'
          );
        }

        // Make the two visible hero image layers explicit high-priority/eager
        // resources. Duplicate URLs still coalesce to one network request.
        html=html.replaceAll(
          '<img class="hero__background" src="/assets/hero-background.webp" width="1440" height="810" alt="">',
          '<img class="hero__background" src="/assets/hero-background.webp" width="1440" height="810" loading="eager" fetchpriority="high" alt="">'
        );
        html=html.replace(
          '<img class="hero__subject" src="/assets/yash-cutout.webp" width="900" height="697" alt="Yash Ganesh, founder of BRAYROAI.">',
          '<img class="hero__subject" src="/assets/yash-cutout.webp" width="900" height="697" loading="eager" fetchpriority="high" alt="Yash Ganesh, founder of BRAYROAI.">'
        );

        // Keep the opening sequence, but make it a crisp title-card rather than
        // holding first paint hostage for nearly two seconds. The same shutter/
        // scan language remains, only the pacing is tightened.
        if(!html.includes('data-v21-critical')){
          html=html.replace('</head>',`  <style data-v21-critical>
    .opening-sequence{animation:openingAway 0s 1.08s both}
    .opening-sequence__mark{animation-duration:.66s}
    .opening-sequence__shutter--top,.opening-sequence__shutter--bottom{animation-duration:.74s;animation-delay:.24s}
    .opening-sequence>span{animation-duration:.56s;animation-delay:.16s}
    .site-nav{animation-duration:.46s;animation-delay:.58s}
    @media(max-width:760px){
      .opening-sequence{animation-delay:.92s}
      .opening-sequence__mark{animation-duration:.58s}
      .opening-sequence__shutter--top,.opening-sequence__shutter--bottom{animation-duration:.64s;animation-delay:.2s}
      .opening-sequence>span{animation-duration:.48s;animation-delay:.12s}
      .site-nav{animation-delay:.48s}
    }
  </style>\n</head>`);
        }

        if(!html.includes('href="/brayro-v13.css"')){
          html=html.replace(
            '<link rel="stylesheet" href="/brayro-v12.css">',
            '<link rel="stylesheet" href="/brayro-v12.css">\n  <link rel="stylesheet" href="/brayro-v13.css" data-brayro-v13>'
          );
        }
        if(!html.includes('href="/brayro-v14.css"')){
          html=html.replace(
            '<link rel="stylesheet" href="/brayro-v13.css" data-brayro-v13>',
            '<link rel="stylesheet" href="/brayro-v13.css" data-brayro-v13>\n  <link rel="stylesheet" href="/brayro-v14.css" data-brayro-v14>\n  <link rel="stylesheet" href="/brayro-v14-polish.css" data-brayro-v14-polish>'
          );
        }
        if(!html.includes('href="/brayro-v15.css"')){
          html=html.replace(
            '<link rel="stylesheet" href="/brayro-v14-polish.css" data-brayro-v14-polish>',
            '<link rel="stylesheet" href="/brayro-v14-polish.css" data-brayro-v14-polish>\n  <link rel="stylesheet" href="/brayro-v15.css" data-brayro-v15>\n  <link rel="stylesheet" href="/v15-accessibility.css" data-v15-accessibility>'
          );
        }

        html=html.replace(
          '<div class="v12-project-preview" data-v12-project-preview data-label="VIEW" aria-hidden="true"><img src="/assets/fakhrimart-case-desktop.png" alt=""></div>',
          '<div class="v12-project-preview" data-v12-project-preview data-label="VIEW" aria-hidden="true"><img alt=""></div>'
        );

        if(!html.includes('src="/brayro-v14.js"')){
          html=html.replace(
            '<script src="/brayro-v12.js"></script>',
            '<script src="/brayro-v12.js"></script>\n  <script src="/brayro-v14.js"></script>'
          );
        }
        if(!html.includes('src="/brayro-v15.js"')){
          html=html.replace(
            '<script src="/brayro-v14.js"></script>',
            '<script src="/brayro-v14.js"></script>\n  <script src="/brayro-v15.js"></script>'
          );
        }
      }

      if(!html.includes('href="/experience-motion-v16.css"')){
        html=html.replace('</head>','  <link rel="stylesheet" href="/experience-motion-v16.css" data-v16-motion>\n</head>');
      }
      if(!html.includes('src="/experience-motion-v16.js"')){
        html=html.replace('</body>','  <script src="/experience-motion-v16.js" data-v16-motion></script>\n</body>');
      }

      if(isHome&&!html.includes('href="/cinematic-v18.css"')){
        html=html.replace('</head>','  <link rel="stylesheet" href="/cinematic-v18.css" data-v18-cinematic>\n</head>');
      }
      if(isHome&&!html.includes('src="/cinematic-v18.js"')){
        html=html.replace('</body>','  <script src="/cinematic-v18.js" data-v18-cinematic></script>\n</body>');
      }

      if(isHome&&!html.includes('href="/cinematic-v20.css"')){
        html=html.replace('</head>','  <link rel="stylesheet" href="/cinematic-v20.css" data-v20-polish>\n</head>');
      }
      if(isHome&&!html.includes('src="/cinematic-v20.js"')){
        html=html.replace('</body>','  <script src="/cinematic-v20.js" data-v20-polish></script>\n</body>');
      }

      return html;
    }
  }
};

export default defineConfig({
  publicDir:'public',
  plugins:[experienceTransform],
  build:{
    outDir:'dist',
    emptyOutDir:true,
    assetsInlineLimit:4096,
    rollupOptions:{
      input:{
        home:resolve(process.cwd(),'index.html'),
        plans:resolve(process.cwd(),'plans.html'),
        founder:resolve(process.cwd(),'founder.html'),
        terms:resolve(process.cwd(),'terms.html'),
        audit:resolve(process.cwd(),'ai-workflow-audit.html'),
        secondBrain:resolve(process.cwd(),'company-second-brain.html')
      }
    }
  }
});
