const send=(name,data)=>{
 try{
  const clean=Object.fromEntries(Object.entries(data||{}).filter(([,value])=>value!==undefined&&value!==null&&value!=='').slice(0,2));
  window.va?.('event',{name,data:clean});
 }catch{}
};

export function initAnalytics(){
 let briefStarted=false;
 const brief=document.querySelector('#project-brief');
 const markBrief=()=>{
  if(briefStarted)return;
  briefStarted=true;
  send('Project brief started',{path:location.pathname});
 };
 brief?.addEventListener('focus',markBrief,{once:true});
 document.querySelectorAll('[data-project-qualifier]').forEach(control=>control.addEventListener('change',markBrief,{once:true}));

 document.addEventListener('click',event=>{
  const target=event.target instanceof Element?event.target.closest('a,button'):null;
  if(!target)return;
  if(target.matches('[data-contact-whatsapp]')){
   send('WhatsApp enquiry',{path:location.pathname,brief:brief?.value.trim()?'with brief':'no brief'});
   return;
  }
  if(target.matches('[data-contact-email]')){send('Email enquiry',{path:location.pathname});return}
  if(target.matches('[data-contact-call]')){send('Intro call request',{path:location.pathname});return}
  if(target.matches('[data-plan-detail]')){send('Plan detail opened',{plan:target.dataset.planDetail});return}
  if(target.matches('[data-offer-contact]')){send('Offer enquiry',{offer:target.dataset.offerContact});return}
  if(target.matches('[data-market-choice]')){send('Market changed',{market:target.dataset.marketChoice});return}
  if(target.matches('[data-system-case]')){send('Studio system opened',{system:target.dataset.systemCase});return}
  if(target.closest('.archive-case-title,.work-heading,.work-caption')){send('Client case opened',{case:'fakhrimart'});}
 });
}

export const trackBrayro=send;
