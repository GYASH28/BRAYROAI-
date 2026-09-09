import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const googleFontsHref='https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=optional';
const productionOrigin='https://brayroai.vercel.app';

const pagePathFor=(filename='')=>{
  if(filename.endsWith('/plans.html')) return '/plans';
  if(filename.endsWith('/founder.html')) return '/founder';
  if(filename.endsWith('/terms.html')) return '/terms';
  if(filename.endsWith('/ai-workflow-audit.html')) return '/ai-workflow-audit';
  if(filename.endsWith('/company-second-brain.html')) return '/company-second-brain';
  return '/';
};

const experienceTransform={
  name:'brayro-experience-transform',
  transformIndexHtml:{
    order:'pre',
    handler(html,context){
      const filename=context?.filename||'';
      const isHome=context?.path==='/'||context?.path==='/index.html'||filename.endsWith('/index.html');
      const isPlans=filename.endsWith('/plans.html');
      const isAiDetail=filename.endsWith('/ai-workflow-audit.html')||filename.endsWith('/company-second-brain.html');
      const canonicalUrl=`${productionOrigin}${pagePathFor(filename)}`;

      if(!html.includes('data-v21-global')){
        html=html.replace('</head>',`  <style data-v21-global>
    .skip-link{position:fixed!important;z-index:9999!important;top:.75rem!important;left:.75rem!important;transform:translate3d(0,-180%,0)!important;opacity:0!important;pointer-events:none!important;transition:transform .28s cubic-bezier(.16,1,.3,1),opacity .2s ease!important}
    .skip-link:focus,.skip-link:focus-visible{transform:translate3d(0,0,0)!important;opacity:1!important;pointer-events:auto!important}
    @media(prefers-reduced-motion:reduce){.skip-link{transition:none!important}}
  </style>\n</head>`);
      }

      if(!html.includes('rel="canonical"')){
        html=html.replace('</head>',`  <link rel="canonical" href="${canonicalUrl}" data-safe-v20-meta>\n  <meta property="og:url" content="${canonicalUrl}">\n  <meta property="og:image" content="${productionOrigin}/assets/hero-background.webp">\n  <meta name="twitter:image" content="${productionOrigin}/assets/hero-background.webp">\n</head>`);
      }

      if(isAiDetail&&!html.includes('href="/v15-accessibility.css"')){
        html=html.replace('</head>','  <link rel="stylesheet" href="/v15-accessibility.css" data-v15-accessibility>\n</head>');
      }

      if(isHome){
        html=html.replace(
          `<link href="${googleFontsHref}" rel="stylesheet">`,
          `<link href="${googleFontsHref}" rel="stylesheet" data-layout-stable-fonts>`
        );

        html=html.replace(/\s*<link rel="stylesheet" href="\/scrollcraft\.css">\s*/,'\n  ');
        html=html.replace(/\s*<script src="\/scrollcraft\.js"><\/script>\s*/,'\n  ');

        html=html.replace(
          'Distinctive websites, digital products and practical AI systems. Strategy through launch, directed as one complete production.',
          'Distinctive websites, digital products and practical AI systems—built to make businesses easier to understand and trust. Strategy through launch, one connected production.'
        );
        html=html.replace(
          'Move across the index. Real client work stays first; BRAYROAI lab entries show the interaction and system thinking behind the studio itself.',
          'Real client work stays first. BRAYROAI studio studies are labelled separately so client proof and internal experimentation never blur together.'
        );
        html=html.replace(
          'Catalogue-led yarn website / responsive commerce enquiry experience',
          'Verified client work / catalogue-led yarn website / responsive enquiry experience'
        );
        html=html.replace(
          'A live business interface, not a fake case study.',
          'A real client website, built for browsing and enquiries.'
        );
        html=html.replace(
          'A catalogue-led yarn website designed for confident browsing and direct enquiries across desktop and mobile.',
          'A live catalogue-led yarn website shaped around clear product browsing, responsive usability and direct enquiries across desktop and mobile.'
        );
        html=html.replace(
          'Yash leads strategy, interface and implementation. The idea stays intact because it does not disappear between departments.',
          'Yash leads strategy, interface and implementation, so clients stay close to the person making the decisions instead of being passed between departments.'
        );
        html=html.replace(
          'WhatsApp is fastest. A short project brief is ready in email if you need it.',
          'WhatsApp is fastest. Tell us what needs to improve and we will recommend the smallest sensible scope—not force a bigger package.'
        );

        if(!html.includes('data-v20-text-cycle')){
          html=html.replace(
            '<div class="v12-hero-meta" aria-label="BRAYROAI disciplines"><span>Web Experiences</span><span>Product Design</span><span>Frontend Engineering</span><span>AI Systems</span></div>',
            '<div class="v12-hero-meta" aria-label="BRAYROAI disciplines"><span>Web Experiences</span><span>Product Design</span><span>Frontend Engineering</span><span>AI Systems</span></div>\n          <div class="v20-text-cycle" data-v20-text-cycle aria-hidden="true"><span>BUILT FOR</span><strong><i data-v20-cycle-word>BRANDS</i><b aria-hidden="true"></b></strong></div>'
          );
        }

        html=html.replaceAll(
          '<img class="hero__background" src="/assets/hero-background.webp" width="1440" height="810" alt="">',
          '<img class="hero__background" src="/assets/hero-background.webp" width="1440" height="810" loading="eager" fetchpriority="high" decoding="sync" alt="">'
        );
        html=html.replace(
          '<img class="hero__subject" src="/assets/yash-cutout.webp" width="900" height="697" alt="Yash Ganesh, founder of BRAYROAI.">',
          '<img class="hero__subject" src="/assets/yash-cutout.webp" width="900" height="697" loading="eager" fetchpriority="high" decoding="sync" alt="Yash Ganesh, founder of BRAYROAI.">'
        );

        if(!html.includes('data-v21-critical')){
          html=html.replace('</head>',`  <style data-v21-critical>
    .opening-sequence{animation:openingAway 0s .90s both}
    .opening-sequence__mark{animation-duration:.60s}
    .opening-sequence__shutter--top,.opening-sequence__shutter--bottom{animation-duration:.64s;animation-delay:.20s}
    .opening-sequence>span{animation-duration:.50s;animation-delay:.13s}
    .site-nav{animation-duration:.42s;animation-delay:.50s}
    @media(max-width:760px){
      .opening-sequence{animation-delay:.80s}
      .opening-sequence__mark{animation-duration:.54s}
      .opening-sequence__shutter--top,.opening-sequence__shutter--bottom{animation-duration:.57s;animation-delay:.17s}
      .opening-sequence>span{animation-duration:.43s;animation-delay:.10s}
      .site-nav{animation-delay:.42s}
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

      if(isPlans){
        html=html.replace(
          'Use a monthly partnership for ongoing website attention, a one-time build for a complete launch, or a focused AI system when the work inside the company needs to become easier.',
          'Choose monthly support for ongoing website improvement, a one-time build for a complete launch, or a focused AI system for internal work. If you are unsure, start with the outcome you need and we will point you to the smallest sensible scope.'
        );
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

      if(!html.includes('href="/performance-v22.css"')){
        html=html.replace('</head>','  <link rel="stylesheet" href="/performance-v22.css" data-v22-performance>\n</head>');
      }
      if(!html.includes('src="/performance-v22.js"')){
        html=html.replace('</body>','  <script src="/performance-v22.js" data-v22-performance></script>\n</body>');
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