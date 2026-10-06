window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments)};
window.si=window.si||function(){(window.siq=window.siq||[]).push(arguments)};

window.va('beforeSend',event=>{
 try{return localStorage.getItem('va-disable')==='1'?null:event}catch{return event}
});

const localHost=location.hostname==='localhost'||location.hostname==='127.0.0.1'||location.hostname==='0.0.0.0';
if(!localHost){
 const mount=(src)=>{
  const script=document.createElement('script');
  script.src=src;
  script.defer=true;
  script.dataset.brayroObservability='true';
  document.head.append(script);
 };
 mount('/_vercel/insights/script.js');
 mount('/_vercel/speed-insights/script.js');
}
