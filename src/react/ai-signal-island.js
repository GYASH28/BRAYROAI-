import React,{useEffect,useRef} from 'react';
import {createRoot} from 'react-dom/client';

const h=React.createElement;
const COPY={
  audit:{en:{eyebrow:'WORKFLOW SIGNAL',title:'Map friction before choosing technology.',steps:['WORKFLOW','FRICTION','OPPORTUNITY','NEXT STEP']},ar:{eyebrow:'إشارة سير العمل',title:'افهم العائق قبل اختيار التقنية.',steps:['سير العمل','العائق','الفرصة','الخطوة التالية']}},
  brain:{en:{eyebrow:'GROUNDING SIGNAL',title:'Approved sources stay connected to the answer.',steps:['SOURCES','RETRIEVAL','CITED ANSWER','HUMAN DECISION']},ar:{eyebrow:'إشارة المعرفة',title:'تبقى المصادر المعتمدة مرتبطة بالإجابة.',steps:['المصادر','الاسترجاع','إجابة موثقة','قرار بشري']}}
};

function SignalOrb({kind,language}){
  const root=useRef(null);
  const copy=(COPY[kind]||COPY.audit)[language==='ar'?'ar':'en'];
  useEffect(()=>{
    const node=root.current;if(!node||matchMedia('(prefers-reduced-motion: reduce)').matches||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
    const move=event=>{const rect=node.getBoundingClientRect();node.style.setProperty('--signal-x',((event.clientX-rect.left)/Math.max(rect.width,1)*100).toFixed(2)+'%');node.style.setProperty('--signal-y',((event.clientY-rect.top)/Math.max(rect.height,1)*100).toFixed(2)+'%')};
    node.addEventListener('pointermove',move,{passive:true});return()=>node.removeEventListener('pointermove',move);
  },[]);
  return h('div',{className:'ai-signal-react',ref:root,'data-signal-kind':kind},
    h('div',{className:'ai-signal-react__orb','aria-hidden':'true'},h('i',null),h('i',null),h('i',null),h('b',null)),
    h('div',{className:'ai-signal-react__copy'},h('span',null,copy.eyebrow),h('strong',null,copy.title),h('div',{className:'ai-signal-react__steps'},copy.steps.map((step,index)=>h('small',{key:step},h('b',null,String(index+1).padStart(2,'0')),step))))
  );
}

export function mountAiSignalIslands(){
  document.querySelectorAll('[data-react-ai-signal-island]').forEach(host=>{
    if(host.dataset.reactMounted==='true')return;host.dataset.reactMounted='true';
    createRoot(host).render(h(SignalOrb,{kind:host.dataset.signalKind||'audit',language:document.documentElement.lang||'en'}));
  });
}
