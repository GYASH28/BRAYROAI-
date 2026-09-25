import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';

const h=React.createElement;
const clean=node=>(node?.innerText||node?.textContent||'').replace(/\s+/g,' ').trim();

function PlanFinder({items,language}){
  const [active,setActive]=useState(Math.min(1,items.length-1));
  const item=items[active]||items[0];
  const copy=language==='ar'
    ? {eyebrow:'مسار سريع',title:'اختر ما تريد تغييره أولاً.',selected:'المسار المختار',cta:'افتح هذا المسار'}
    : {eyebrow:'QUICK ROUTE FINDER',title:'Choose what needs to change first.',selected:'SELECTED DIRECTION',cta:'Open this route'};
  return h('div',{className:'plan-react',role:'group','aria-label':copy.title},
    h('div',{className:'plan-react__head'},h('span',null,copy.eyebrow),h('strong',null,copy.title)),
    h('div',{className:'plan-react__choices'},
      items.map((choice,index)=>h('button',{
        key:choice.href,type:'button','aria-pressed':String(index===active),
        className:'plan-react__choice'+(index===active?' is-active':''),
        onClick:()=>setActive(index)
      },h('small',null,String(index+1).padStart(2,'0')),h('span',null,choice.title),h('b',null,index===active?'●':'○')))
    ),
    item?h('div',{className:'plan-react__preview','aria-live':'polite'},
      h('span',null,copy.selected),
      h('div',null,h('strong',null,item.title),h('p',null,item.description),h('small',null,item.meta)),
      h('a',{href:item.href},copy.cta,h('i',{'aria-hidden':'true'},'↘'))
    ):null
  );
}

export function mountPlanFinderIsland(){
  const host=document.querySelector('[data-react-plan-island]');
  if(!host||host.dataset.reactMounted==='true')return;
  const shell=host.closest('.plan-shell');if(!shell)return;
  const items=[...shell.querySelectorAll('.plan-decision__card')].map(node=>({
    href:node.getAttribute('href')||'#',
    title:clean(node.querySelector('strong')),
    description:clean(node.querySelector('p')),
    meta:clean(node.querySelector('small'))
  })).filter(item=>item.title);
  if(!items.length)return;
  host.dataset.reactMounted='true';shell.classList.add('has-react-plan-finder');
  createRoot(host).render(h(PlanFinder,{items,language:document.documentElement.lang||'en'}));
}
