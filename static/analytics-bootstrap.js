window.si=window.si||function(){(window.siq=window.siq||[]).push(arguments)};

const localHost=location.hostname==='localhost'||location.hostname==='127.0.0.1'||location.hostname==='0.0.0.0';
if(!localHost){
 const script=document.createElement('script');
 script.src='/_vercel/speed-insights/script.js';
 script.defer=true;
 script.dataset.brayroObservability='true';
 document.head.append(script);
}
