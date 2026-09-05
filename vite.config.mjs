import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const googleFontsHref='https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=optional';

const homePerformanceTransform={
  name:'brayro-home-performance-transform',
  transformIndexHtml:{
    order:'pre',
    handler(html,context){
      const isHome=context?.path==='/'||context?.path==='/index.html'||context?.filename?.endsWith('/index.html');
      if(!isHome)return html;

      // Keep typography available without making the external Google Fonts stylesheet
      // a first-paint blocker. Font display remains optional, so fallback text is stable.
      html=html.replace(
        `<link href="${googleFontsHref}" rel="stylesheet">`,
        `<link rel="preload" as="style" href="${googleFontsHref}" onload="this.onload=null;this.rel='stylesheet'">\n  <noscript><link rel="stylesheet" href="${googleFontsHref}"></noscript>`
      );

      // Keep the prior V13 compatibility layer, then let the V14 film layer own the
      // homepage capability reel and rate card. Both are direct stylesheet dependencies.
      if(!html.includes('href="/brayro-v13.css"')){
        html=html.replace(
          '<link rel="stylesheet" href="/brayro-v12.css">',
          '<link rel="stylesheet" href="/brayro-v12.css">\n  <link rel="stylesheet" href="/brayro-v13.css" data-brayro-v13>'
        );
      }
      if(!html.includes('href="/brayro-v14.css"')){
        html=html.replace(
          '<link rel="stylesheet" href="/brayro-v13.css" data-brayro-v13>',
          '<link rel="stylesheet" href="/brayro-v13.css" data-brayro-v13>\n  <link rel="stylesheet" href="/brayro-v14.css" data-brayro-v14>'
        );
      }

      // The cursor preview is invisible until a user hovers a project row. Leaving its
      // 1.36 MB PNG in source made the HTML parser fetch it during initial navigation.
      // ProjectPreview assigns the src on demand, so production ships an empty img shell.
      html=html.replace(
        '<div class="v12-project-preview" data-v12-project-preview data-label="VIEW" aria-hidden="true"><img src="/assets/fakhrimart-case-desktop.png" alt=""></div>',
        '<div class="v12-project-preview" data-v12-project-preview data-label="VIEW" aria-hidden="true"><img alt=""></div>'
      );

      // V14 executes immediately after the existing V12 runtime. The old capability
      // structure is replaced in the same parse turn, before first meaningful paint.
      if(!html.includes('src="/brayro-v14.js"')){
        html=html.replace(
          '<script src="/brayro-v12.js"></script>',
          '<script src="/brayro-v12.js"></script>\n  <script src="/brayro-v14.js"></script>'
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
        terms:resolve(process.cwd(),'terms.html')
      }
    }
  }
});