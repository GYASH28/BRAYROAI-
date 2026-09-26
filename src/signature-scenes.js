const mounted=[];

const mountCapabilitySignal=()=>{
  const visual=document.querySelector('[data-v12-story-visual]');
  const beam=visual?.querySelector('.capability-ai__beam');
  if(!visual||!beam||beam.querySelector('[data-v43-source-particles]'))return;
  const field=document.createElement('span');
  field.className='v43-source-particles';field.dataset.v43SourceParticles='';field.setAttribute('aria-hidden','true');
  for(let i=0;i<9;i++){
    const particle=document.createElement('i');
    particle.style.setProperty('--v43-i',String(i));
    const lane=(i%3-1)*9;
    particle.style.setProperty('--v43-lane',String(lane)+'px');
    particle.style.setProperty('--v43-end-lane',String(Math.round(lane*-.35))+'px');
    particle.style.setProperty('--v43-delay',String((-i*.31).toFixed(2))+'s');
    field.append(particle);
  }
  beam.append(field);
  const sync=()=>beam.style.setProperty('--v43-travel',String(Math.max(92,Math.round(beam.getBoundingClientRect().width+72)))+'px');
  sync();
  const ro='ResizeObserver'in window?new ResizeObserver(sync):null;ro?.observe(beam);
  const io='IntersectionObserver'in window?new IntersectionObserver(entries=>{visual.dataset.v43Inview=String(entries.some(entry=>entry.isIntersecting))},{rootMargin:'120px 0px',threshold:.05}):null;
  io?.observe(visual);if(!io)visual.dataset.v43Inview='true';
  mounted.push(()=>{ro?.disconnect();io?.disconnect();field.remove();delete visual.dataset.v43Inview});
};

const mountEditorialRelay=()=>{
  const sequence=document.querySelector('[data-editorial-sequence]');
  const stage=sequence?.querySelector('.editorial-sequence__stage');
  if(!sequence||!stage||stage.querySelector('[data-v43-handoff-relay]'))return;
  const relay=document.createElement('span');
  relay.className='v43-handoff-relay';relay.dataset.v43HandoffRelay='';relay.setAttribute('aria-hidden','true');
  relay.innerHTML='<i></i>';
  stage.append(relay);
  const io='IntersectionObserver'in window?new IntersectionObserver(entries=>{sequence.dataset.v43Inview=String(entries.some(entry=>entry.isIntersecting))},{rootMargin:'80px 0px',threshold:.04}):null;
  io?.observe(sequence);if(!io)sequence.dataset.v43Inview='true';
  mounted.push(()=>{io?.disconnect();relay.remove();delete sequence.dataset.v43Inview});
};

export function mountSignatureScenes(){
  if(document.documentElement.dataset.v43SignatureMounted)return()=>{};
  document.documentElement.dataset.v43SignatureMounted='true';
  mountCapabilitySignal();
  mountEditorialRelay();
  return()=>{while(mounted.length)mounted.pop()?.();delete document.documentElement.dataset.v43SignatureMounted};
}
