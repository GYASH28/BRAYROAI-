import React,{useMemo,useState} from 'react';
import {createRoot} from 'react-dom/client';

const h=React.createElement;
const COPY={
  en:{
    eyebrow:'30-SECOND BRIEF',title:'Give the conversation a useful starting point.',
    type:'What are we shaping?',stage:'Where are you now?',send:'Send the brief on WhatsApp',email:'Use email instead',
    types:[['website','Website'],['ai','AI system'],['unsure','Not sure yet']],
    stages:[['new','Starting fresh'],['improve','Improving something live'],['stuck','I know the problem, not the solution']]
  },
  ar:{
    eyebrow:'ملخص سريع',title:'امنح المحادثة نقطة بداية واضحة.',
    type:'ماذا نريد أن نبني؟',stage:'أين أنت الآن؟',send:'أرسل الملخص عبر واتساب',email:'استخدم البريد بدلاً من ذلك',
    types:[['website','موقع إلكتروني'],['ai','نظام ذكاء اصطناعي'],['unsure','لست متأكداً بعد']],
    stages:[['new','أبدأ من الصفر'],['improve','أطوّر شيئاً موجوداً'],['stuck','أعرف المشكلة وليس الحل']]
  }
};

function ProjectBrief({whatsapp,email,language}){
  const copy=language==='ar'?COPY.ar:COPY.en;
  const [type,setType]=useState(copy.types[0][0]);
  const [stage,setStage]=useState(copy.stages[0][0]);
  const typeLabel=copy.types.find(item=>item[0]===type)?.[1]||'';
  const stageLabel=copy.stages.find(item=>item[0]===stage)?.[1]||'';
  const href=useMemo(()=>{
    try{
      const url=new URL(whatsapp,location.href);
      const message=language==='ar'
        ? `مرحباً Yash، أريد مناقشة مشروع مع BRAYROAI. النوع: ${typeLabel}. المرحلة: ${stageLabel}.`
        : `Hi Yash, I want to discuss a project with BRAYROAI. Project type: ${typeLabel}. Current stage: ${stageLabel}.`;
      url.searchParams.set('text',message);return url.href;
    }catch{return whatsapp}
  },[whatsapp,language,typeLabel,stageLabel]);
  const group=(label,items,value,setter)=>h('fieldset',null,h('legend',null,label),h('div',{className:'brief-react__chips'},items.map(item=>h('button',{
    key:item[0],type:'button','aria-pressed':String(value===item[0]),className:value===item[0]?'is-active':'',onClick:()=>setter(item[0])
  },item[1]))));
  return h('div',{className:'brief-react'},
    h('div',{className:'brief-react__head'},h('span',null,copy.eyebrow),h('strong',null,copy.title)),
    h('div',{className:'brief-react__grid'},group(copy.type,copy.types,type,setType),group(copy.stage,copy.stages,stage,setStage)),
    h('div',{className:'brief-react__actions'},h('a',{href,target:'_blank',rel:'noreferrer'},copy.send,h('span',{'aria-hidden':'true'},'→')),h('a',{href:email},copy.email))
  );
}

export function mountProjectBriefIsland(){
  const host=document.querySelector('[data-react-brief-island]');
  if(!host||host.dataset.reactMounted==='true')return;
  const section=host.closest('#contact');if(!section)return;
  const whatsapp=section.querySelector('[data-project-whatsapp]')?.href;
  const email=section.querySelector('.close__email')?.href;
  if(!whatsapp||!email)return;
  host.dataset.reactMounted='true';section.classList.add('has-react-project-brief');
  createRoot(host).render(h(ProjectBrief,{whatsapp,email,language:document.documentElement.lang||'en'}));
}
