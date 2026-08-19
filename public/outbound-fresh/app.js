(async()=>{
  const gunzip=async b=>{const bin=Uint8Array.from(atob(b),c=>c.charCodeAt(0));const ds=new DecompressionStream('gzip');return await new Response(new Blob([bin]).stream().pipeThrough(ds)).text()};
  const q=new URLSearchParams(location.search).get('site');
  const pathSlug=location.pathname.split('/').filter(Boolean).at(-1);
  const slug=q||((pathSlug&&pathSlug!=='outbound-fresh')?pathSlug:null);
  const replacement=slug&&window.__BRAY_REPLACEMENTS?.[slug];
  if(replacement){
    const html=await gunzip(replacement);
    document.open();document.write(html);document.close();
    setTimeout(()=>{
      document.querySelectorAll('.options button,.choices button').forEach(b=>b.onclick=()=>{
        const group=b.closest('.widget');group?.querySelectorAll('button').forEach(x=>x.classList.remove('active'));b.classList.add('active');
        const out=document.getElementById('out');if(out)out.textContent=b.dataset.v+(b.closest('.choices')?' → continue to size + application':' → ready for conditions + load details');
      });
    },0);
    return;
  }
  const pages=JSON.parse(await gunzip(window.__BRAY_DATA));
  const p=slug&&pages[slug];
  if(p){
    document.title=p.t;
    ['--bg','--ink','--accent','--accent2'].forEach((k,i)=>document.documentElement.style.setProperty(k,p.p[i]));
    document.body.innerHTML=p.b;
  }else{
    const excluded=new Set(['ekbotes-logs-lumbers','shree-industries-pune']);
    const names={...Object.fromEntries(Object.entries(pages).filter(([k])=>!excluded.has(k)).map(([k,v])=>[k,(v.t||k).replace(/ — BRAYROAI.*$/,'')])),...(window.__BRAY_REPLACEMENT_NAMES||{})};
    document.body.innerHTML=`<div class="demo-notice">BRAYROAI private outbound concept index · noindex</div><main style="padding:6vw"><span class="eyebrow">BRAYROAI / FRESH OUTBOUND</span><h1 style="font-size:8vw;line-height:.85;letter-spacing:-.07em">25 concepts.<br>Built around the business.</h1><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px">${Object.entries(names).map(([k,n])=>`<a href="?site=${encodeURIComponent(k)}">${n}</a>`).join('')}</div></main>`;
  }
  document.querySelectorAll('.feature-option').forEach(x=>x.onclick=()=>{document.querySelectorAll('.feature-option').forEach(y=>y.classList.remove('active'));x.classList.add('active');const o=document.getElementById('selected-output');if(o)o.textContent=x.dataset.value+' → requirement path ready';});
  document.querySelectorAll('a[href="#prototype-contact"]').forEach(a=>a.onclick=e=>{e.preventDefault();document.getElementById('wow-feature')?.scrollIntoView({behavior:'smooth'})});
})();