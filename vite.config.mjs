import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const googleFontsHref='https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=optional';
const siteOrigin='https://brayroai.vercel.app';

const experienceTransform={
  name:'brayro-experience-transform',
  transformIndexHtml:{
    order:'pre',
    handler(html,context){
      const filename=context?.filename||'';
      const isHome=context?.path==='/'||context?.path==='/index.html'||filename.endsWith('/index.html');
      const isAiDetail=filename.endsWith('/ai-workflow-audit.html')||filename.endsWith('/company-second-brain.html');
      const routeMap=[
        ['index.html','/'],['plans.html','/plans'],['founder.html','/founder'],['terms.html','/terms'],
        ['audit.html','/audit'],['us.html','/us'],['uae.html','/uae'],['lab.html','/lab'],
        ['fakhrimart.html','/work/fakhrimart'],['ai-workflow-audit.html','/ai-workflow-audit'],
        ['company-second-brain.html','/company-second-brain']
      ];
      const route=(isHome?'/':routeMap.find(([file])=>filename.endsWith(`/${file}`)||filename.endsWith(file))?.[1])||null;
      const escapeAttr=value=>String(value||'').replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
      const title=html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
      const description=html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1]?.trim();
      const canonical=route?`${siteOrigin}${route}`:null;
      let metadata='';
      if(canonical&&!html.includes('rel="canonical"')) metadata+=`  <link rel="canonical" href="${canonical}">\n`;
      if(title&&!html.includes('property="og:title"')) metadata+=`  <meta property="og:title" content="${escapeAttr(title)}">\n`;
      if(description&&!html.includes('property="og:description"')) metadata+=`  <meta property="og:description" content="${escapeAttr(description)}">\n`;
      if(!html.includes('property="og:type"')) metadata+='  <meta property="og:type" content="website">\n';
      if(!html.includes('property="og:site_name"')) metadata+='  <meta property="og:site_name" content="BRAYROAI">\n';
      if(canonical&&!html.includes('property="og:url"')) metadata+=`  <meta property="og:url" content="${canonical}">\n`;
      if(!html.includes('property="og:image"')) metadata+=`  <meta property="og:image" content="${siteOrigin}/assets/brayroai-installation-hero.webp">\n`;
      if(!html.includes('name="twitter:card"')) metadata+='  <meta name="twitter:card" content="summary_large_image">\n';
      if(metadata) html=html.replace('</head>',`${metadata}</head>`);

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

        html=html.replace(/\s*<link rel="stylesheet" href="\/scrollcraft\.css">\s*/,'\n  ');
        html=html.replace(/\s*<script src="\/scrollcraft\.js"><\/script>\s*/,'\n  ');

        if(!html.includes('data-v20-text-cycle')){
          const legacyMeta='<div class="v12-hero-meta" aria-label="BRAYROAI disciplines"><span>Web Experiences</span><span>Product Design</span><span>Frontend Engineering</span><span>AI Systems</span></div>';
          const growthMeta='<div class="v12-hero-meta" aria-label="BRAYROAI growth system"><span>Capture</span><span>Qualify</span><span>Follow up</span><span>Book + measure</span></div>';
          if(html.includes(growthMeta)){
            html=html.replace(growthMeta,`${growthMeta}\n          <div class="v20-text-cycle" data-v20-text-cycle aria-hidden="true"><span>BUILT FOR</span><strong><i data-v20-cycle-word>GROWTH</i><b aria-hidden="true"></b></strong></div>`);
          }else{
            html=html.replace(legacyMeta,`${legacyMeta}\n          <div class="v20-text-cycle" data-v20-text-cycle aria-hidden="true"><span>BUILT FOR</span><strong><i data-v20-cycle-word>BRANDS</i><b aria-hidden="true"></b></strong></div>`);
          }
        }

        html=html.replaceAll(
          '<img class="hero__background" src="/assets/hero-background.webp" width="1440" height="810" alt="">',
          '<img class="hero__background" src="/assets/hero-background.webp" width="1440" height="810" loading="eager" fetchpriority="high" alt="">'
        );
        html=html.replace(
          '<img class="hero__subject" src="/assets/yash-cutout.webp" width="900" height="697" alt="Yash Ganesh, founder of BRAYROAI.">',
          '<img class="hero__subject" src="/assets/yash-cutout.webp" width="900" height="697" loading="eager" fetchpriority="high" alt="Yash Ganesh, founder of BRAYROAI.">'
        );

        html=html.replace(
          '<a class="text-link magnetic" data-cursor-label="LIVE ↗" href="https://fakhriyarns.vercel.app/" target="_blank" rel="noreferrer">Visit the live website <span>↗</span></a>',
          '<a class="text-link magnetic" data-cursor-label="CASE ↗" href="/work/fakhrimart">Read the verified case study <span>↗</span></a>'
        );

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
        growthAudit:resolve(process.cwd(),'audit.html'),
        us:resolve(process.cwd(),'us.html'),
        uae:resolve(process.cwd(),'uae.html'),
        lab:resolve(process.cwd(),'lab.html'),
        fakhrimart:resolve(process.cwd(),'fakhrimart.html'),
        audit:resolve(process.cwd(),'ai-workflow-audit.html'),
        secondBrain:resolve(process.cwd(),'company-second-brain.html')
      }
    }
  }
});
