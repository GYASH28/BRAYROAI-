import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const googleFontsHref='https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=optional';

const cinematicReel=`
    <section class="scene v18-reel" data-v18-reel data-scene="cinematic-reel" aria-labelledby="v18-reel-title">
      <div class="v18-reel__sticky">
        <div class="v18-reel__stage">
          <figure class="v18-shot v18-shot--film" data-v18-shot>
            <video data-v18-video muted playsinline preload="metadata" poster="/assets/brayroai-installation-hero.webp" aria-label="BRAYROAI cinematic motion study">
              <source src="/assets/brayroai-cinematic-opening-silent.mp4" type="video/mp4">
            </video>
            <figcaption>01 / MOTION STUDY — THE OPENING FRAME BECOMES SCROLL TIME</figcaption>
          </figure>
          <figure class="v18-shot v18-shot--process" data-v18-shot>
            <img src="/assets/brayroai-process-table.webp" loading="lazy" alt="BRAYROAI process interface study">
            <figcaption>02 / SYSTEM — DIRECTION, ENGINEERING AND DELIVERY STAY CONNECTED</figcaption>
          </figure>
          <figure class="v18-shot v18-shot--client" data-v18-shot>
            <img src="/assets/fakhrimart-case-desktop.png" loading="lazy" alt="FakhriMart client website shown on desktop">
            <figcaption>03 / REAL CLIENT — A LIVE BUSINESS INTERFACE, NOT A CONCEPT FRAME</figcaption>
          </figure>
          <figure class="v18-shot v18-shot--founder" data-v18-shot>
            <img src="/assets/about-yash.webp" loading="lazy" alt="Yash Ganesh, founder of BRAYROAI">
            <figcaption>04 / AUTHORSHIP — ONE POINT OF VIEW FROM THE FIRST FRAME TO LAUNCH</figcaption>
          </figure>

          <div class="v18-reel__chrome" aria-hidden="true"><span>BRAYROAI / SCROLL-DIRECTED MOTION REEL</span><strong data-v18-reel-index>01 / 04</strong></div>
          <div class="v18-reel__copy">
            <small>ONE CONTINUOUS TAKE / CONTROLLED BY YOUR SCROLL</small>
            <h2 id="v18-reel-title"><span>Direction becomes</span><span>motion. Motion becomes <em>memory.</em></span></h2>
            <p data-v18-reel-status>DIRECTION / FIND THE FRAME BEFORE ADDING THE EFFECT</p>
          </div>
          <div class="v18-reel__progress" aria-hidden="true"><i></i></div>
        </div>
        <i class="v18-reel__matte v18-reel__matte--top" aria-hidden="true"></i>
        <i class="v18-reel__matte v18-reel__matte--bottom" aria-hidden="true"></i>
      </div>
    </section>
`;

const experienceTransform={
  name:'brayro-experience-transform',
  transformIndexHtml:{
    order:'pre',
    handler(html,context){
      const filename=context?.filename||'';
      const isHome=context?.path==='/'||context?.path==='/index.html'||filename.endsWith('/index.html');
      const isAiDetail=filename.endsWith('/ai-workflow-audit.html')||filename.endsWith('/company-second-brain.html');

      if(isAiDetail&&!html.includes('href="/v15-accessibility.css"')){
        html=html.replace('</head>','  <link rel="stylesheet" href="/v15-accessibility.css" data-v15-accessibility>\n</head>');
      }

      if(isHome){
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

        if(!html.includes('data-v18-reel')){
          html=html.replace('    <section id="work" class="scene v12-work"',`${cinematicReel}\n    <section id="work" class="scene v12-work"`);
        }

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
