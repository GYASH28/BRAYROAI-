import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const googleFontsHref='https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=optional';

const homePerformanceTransform={
  name:'brayro-home-performance-transform',
  transformIndexHtml:{
    order:'pre',
    handler(html,context){
      const filename=context?.filename||'';
      const isHome=context?.path==='/'||context?.path==='/index.html'||filename.endsWith('/index.html');
      const isAiDetail=filename.endsWith('/ai-workflow-audit.html')||filename.endsWith('/company-second-brain.html');

      if(isAiDetail&&!html.includes('href="/v15-accessibility.css"')){
        html=html.replace('</head>','  <link rel="stylesheet" href="/v15-accessibility.css" data-v15-accessibility>\n</head>');
      }
      if(!isHome)return html;

      html=html.replace(
        `<link href="${googleFontsHref}" rel="stylesheet">`,
        `<link rel="preload" as="style" href="${googleFontsHref}" onload="this.onload=null;this.rel='stylesheet'">\n  <noscript><link rel="stylesheet" href="${googleFontsHref}"></noscript>`
      );

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

      return html;
    }
  }
};

export default defineConfig({
  publicDir:'public',
  plugins:[homePerformanceTransform],
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