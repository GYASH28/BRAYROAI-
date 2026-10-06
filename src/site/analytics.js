const analyticsOff=()=>{
 try{return localStorage.getItem('va-disable')==='1'}catch{return false}
};
const localHost=()=>location.hostname==='localhost'||location.hostname==='127.0.0.1'||location.hostname==='0.0.0.0';
const send=(name,data)=>{
 try{
  if(analyticsOff()||localHost())return;
  const clean=Object.fromEntries(Object.entries(data||{}).filter(([,value])=>value!==undefined&&value!==null&&value!=='').slice(0,2));
  fetch('/api/telemetry',{
   method:'POST',
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify({event:name,path:location.pathname,data:clean}),
   keepalive:true,
   credentials:'same-origin'
  }).catch(()=>{});
 }catch{}
};

export function initAnalytics(){
 const disable=document.querySelector('[data-analytics-disable]');
 if(disable){
  const paint=()=>{const off=analyticsOff();disable.textContent=off?'Analytics disabled on this browser':'Disable analytics on this browser';disable.setAttribute('aria-pressed',String(off))};
  paint();
  disable.addEventListener('click',()=>{try{localStorage.setItem('va-disable','1')}catch{}paint()});
 }
 send('Page view',{market:document.documentElement.dataset.market||''});

 let briefStarted=false;
 const brief=document.querySelector('#project-brief');
 const markBrief=()=>{
  if(briefStarted)return;
  briefStarted=true;
  send('Project brief started');
 };
 brief?.addEventListener('focus',markBrief,{once:true});
 document.querySelectorAll('[data-project-qualifier]').forEach(control=>control.addEventListener('change',markBrief,{once:true}));

 document.addEventListener('click',event=>{
  const target=event.target instanceof Element?event.target.closest('a,button'):null;
  if(!target)return;
  if(target.matches('[data-contact-whatsapp]')){
   send('WhatsApp enquiry',{brief:brief?.value.trim()?'with brief':'no brief'});
   return;
  }
  if(target.matches('[data-contact-email]')){send('Email enquiry');return}
  if(target.matches('[data-contact-call]')){send('Intro call request');return}
  if(target.matches('[data-plan-detail]')){send('Plan detail opened',{plan:target.dataset.planDetail});return}
  if(target.matches('[data-offer-contact]')){send('Offer enquiry',{offer:target.dataset.offerContact});return}
  if(target.matches('[data-market-choice]')){send('Market changed',{market:target.dataset.marketChoice});return}
  if(target.matches('[data-system-case]')){send('Studio system opened',{system:target.dataset.systemCase});return}
  if(target.closest('.archive-case-title,.work-heading,.work-caption'))send('Client case opened',{case:'fakhrimart'});
 });
}

export const trackBrayro=send;
