(() => {
  if (window.__BRAYROAI_COMMERCIAL__) return;
  window.__BRAYROAI_COMMERCIAL__ = true;
  const q=(s,r=document)=>r.querySelector(s);
  const qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const onHome=location.pathname==='/'||location.pathname.endsWith('/index.html');
  if(!onHome) return;

  document.body.classList.add('commercial-ready');

  // Plans is the second main destination; Clients replaces the old Lab nav slot.
  const desktop=q('.desktop-nav');
  if(desktop){
    const work=q('a[href="#work"]',desktop);
    if(work&&!q('a[href="/plans.html"]',desktop)){
      const plans=document.createElement('a');
      plans.href='/plans.html';plans.textContent='Plans';plans.className='internal-transition';
      work.insertAdjacentElement('afterend',plans);
    }
    const lab=q('a[href="#lab"]',desktop);
    if(lab){lab.href='#clients';lab.textContent='Clients';}
  }

  const mobile=q('.mobile-menu-inner');
  if(mobile){
    const work=q('a[href="#work"]',mobile);
    if(work&&!q('a[href="/plans.html"]',mobile)){
      const plans=document.createElement('a');
      plans.href='/plans.html';plans.className='internal-transition';plans.innerHTML='<span>02</span>Plans';
      work.insertAdjacentElement('afterend',plans);
    }
    const capability=q('a[href="#services"]',mobile); if(capability) capability.querySelector('span')?.replaceChildren('03');
    const lab=q('a[href="#lab"]',mobile); if(lab){lab.href='#clients';lab.innerHTML='<span>04</span>Clients';}
    const studio=q('a[href="#about"]',mobile); if(studio) studio.innerHTML='<span>05</span>Studio';
    const start=q('a[href="#engage"]',mobile); if(start) start.innerHTML='<span>06</span>Start a project';
    qa('a',mobile).forEach(link=>link.addEventListener('click',()=>{
      const button=q('[data-menu-button]');
      if(button?.getAttribute('aria-expanded')==='true') button.click();
    }));
  }

  // Put a simple, persuasive plan choice directly after the hero.
  const hero=q('#top');
  if(hero&&!q('#plans-snapshot')){
    const snapshot=document.createElement('section');
    snapshot.id='plans-snapshot';snapshot.className='plans-snapshot';
    snapshot.innerHTML=`
      <div class="shell plans-snapshot__head">
        <div><p class="eyebrow dark"><i></i> PLANS / A CLEAR WAY TO START</p><h2>BUILD ONCE.<br/><em>OR KEEP MOVING.</em></h2></div>
        <p>Choose the level of support that matches the job. No fake countdowns, no crossed-out fantasy prices, and no forcing a monthly plan when a focused build is enough.</p>
      </div>
      <div class="shell plan-paths">
        <a class="plan-path internal-transition" href="/plans.html#build">
          <span class="plan-path__meta"><b>01 / PROJECT BUILD</b><b>ONE-TIME</b></span>
          <h3>Digital Makeover</h3><strong>From ₹9,999 <small>/ one-time</small></strong>
          <p>For a business that needs a sharper website, clearer presentation and a professional digital reset.</p><span class="plan-path__arrow">↗</span>
        </a>
        <a class="plan-path plan-path--ongoing internal-transition" href="/plans.html#ongoing">
          <span class="plan-path__meta"><b>02 / ONGOING STUDIO</b><b>MONTHLY</b></span>
          <h3>Launch → Grow → Pro</h3><strong>From ₹2,499 <small>/ month</small></strong>
          <p>For teams that want a reliable design-and-engineering partner after launch, without hiring a full in-house team.</p><span class="plan-path__arrow">↗</span>
        </a>
      </div>`;
    hero.insertAdjacentElement('afterend',snapshot);
  }

  // Work means client work. Internal products remain only in the explicitly-labelled Lab.
  const work=q('#work');
  if(work){
    q('.project-grid',work)?.remove();
    const head=q('.work-head',work);
    if(head){
      const title=q('h2',head); if(title) title.innerHTML='ONE CLIENT.<br/><em>FULL PROOF.</em>';
      const copy=q('p:last-child',head); if(copy) copy.textContent='FakhriMart is shown as an actual shipped client case study using current captures from the live responsive website—no fake project art and no invented performance numbers.';
    }
    const rail=q('.work-proof-rail',work);
    if(rail) rail.innerHTML='<span>FAKHRIMART / REAL CLIENT</span><i></i><span>LIVE SITE CAPTURES</span><i></i><span>DESIGN → BUILD → DEPLOY</span><i></i><span>2026</span>';
  }

  const replaceFrame=(selector,src,alt)=>{
    const frame=q(selector); if(!frame) return;
    const iframe=q('iframe',frame); if(!iframe) return;
    const img=document.createElement('img');
    img.src=src;img.alt=alt;img.loading='lazy';img.decoding='async';
    iframe.replaceWith(img);
  };
  replaceFrame('.project-screen','/assets/fakhrimart-case-desktop.png','Current FakhriMart desktop website');
  replaceFrame('.project-phone','/assets/fakhrimart-case-mobile.png','Current FakhriMart mobile website');
  replaceFrame('.live-browser','/assets/fakhrimart-case-desktop.png','Current FakhriMart desktop client experience');
  replaceFrame('.live-phone','/assets/fakhrimart-case-mobile.png','Current FakhriMart mobile client experience');

  // Real-image case study sequence.
  const feature=q('.feature-project',work||document);
  if(feature&&!q('.case-gallery',work)){
    const gallery=document.createElement('div');gallery.className='shell case-gallery';
    gallery.innerHTML=`
      <figure class="case-gallery__frame case-gallery__frame--desktop"><span class="case-gallery__label">LIVE CAPTURE / DESKTOP</span><img src="/assets/fakhrimart-case-desktop.png" alt="FakhriMart live desktop homepage showing the yarn catalogue experience" loading="lazy" decoding="async"></figure>
      <figure class="case-gallery__frame case-gallery__frame--mobile"><span class="case-gallery__label">LIVE CAPTURE / MOBILE</span><img src="/assets/fakhrimart-case-mobile.png" alt="FakhriMart live mobile homepage with search, product shades and enquiry action" loading="lazy" decoding="async"></figure>`;
    feature.insertAdjacentElement('afterend',gallery);

    const story=document.createElement('div');story.className='shell case-study-story';
    story.innerHTML=`
      <div class="case-study-story__intro"><span>FAKHRIMART / CASE STUDY</span><h3>FROM CATALOGUE<br>TO ENQUIRY.</h3></div>
      <div class="case-study-story__steps">
        <article class="case-study-step"><b>01 / CHALLENGE</b><h4>Make a traditional catalogue easier to browse.</h4><p>Yarn, shades and craft materials needed a clearer digital structure that could feel trustworthy without becoming another generic ecommerce template.</p></article>
        <article class="case-study-step"><b>02 / DIRECTION</b><h4>Design around discovery first.</h4><p>The experience puts search, material exploration, colour choices, saved items and enquiry actions close to the user—especially on mobile.</p></article>
        <article class="case-study-step"><b>03 / SHIPPED</b><h4>A responsive path to enquiry.</h4><p>The live site now combines catalogue discovery, product presentation, shortlist/enquiry behaviour and WhatsApp contact in one responsive system.</p></article>
      </div>`;
    gallery.insertAdjacentElement('afterend',story);
  }

  // One real-client section is stronger than a wall of pretend logos.
  const clientProof=q('#client-proof');
  if(clientProof&&!q('#clients')){
    const clients=document.createElement('section');clients.id='clients';clients.className='clients-section';
    clients.innerHTML=`
      <div class="shell clients-head"><div><p class="eyebrow dark"><i></i> CLIENTS / REAL RELATIONSHIPS</p><h2>NO LOGO<br/><em>WALLPAPER.</em></h2></div><p>BRAYROAI only shows client relationships that are real. Right now, the public client proof is FakhriMart—so that is exactly what appears here.</p></div>
      <div class="shell client-row">
        <div class="client-row__name">FakhriMart</div>
        <div class="client-row__meta"><span>BUSINESS</span><b>Yarn & craft materials / Pune</b></div>
        <div class="client-row__meta"><span>BRAYROAI SCOPE</span><b>Experience design / frontend / deployment</b></div>
        <a href="https://fakhriyarns.vercel.app/" target="_blank" rel="noreferrer" aria-label="Visit live FakhriMart website">↗</a>
      </div>`;
    clientProof.insertAdjacentElement('afterend',clients);
  }

  // Make the existing project proof text explicitly client-only.
  const meta=q('.feature-project__meta'); if(meta) meta.innerHTML='<span>01 / CLIENT CASE STUDY</span><span>WEB EXPERIENCE + FRONTEND</span><span>LIVE / 2026</span>';
  const bottom=q('.feature-project__bottom'); if(bottom){
    const link=q('a',bottom); if(link){link.textContent='Read the case study →';link.href='#client-proof';}
  }

  // Extra plans CTA without mutating the existing bound anchor behaviour.
  const heroCtas=q('.hero-cta-stack');
  if(heroCtas&&!q('.hero-plan-link',heroCtas)){
    const plan=document.createElement('a');plan.className='hero-plan-link';plan.href='/plans.html';plan.textContent='View plans ↗';
    heroCtas.appendChild(plan);
  }
})();
