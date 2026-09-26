import React,{useState} from 'react';
import {ToggleGroup,ToggleGroupItem} from './ui/toggle-group.js';
import {MagneticAction} from './ui/magnetic-action.js';
import {createRoot} from 'react-dom/client';

const h=React.createElement;
const clean=node=>(node?.innerText||node?.textContent||'').replace(/\s+/g,' ').trim();

function PlanFinder({items,language}){
  const [active,setActive]=useState(Math.min(1,items.length-1));
  const item=items[active]||items[0];
  const arabic=String(language||'').toLowerCase().startsWith('ar');
  const copy=arabic
    ? {eyebrow:'مسار سريع',title:'ماذا تريد أن تبني أو تحسّن؟',selected:'المسار المختار',cta:'افتح هذا المسار'}
    : {eyebrow:'QUICK ROUTE FINDER',title:'What do you need to build or improve?',selected:'SELECTED DIRECTION',cta:'Explore this route'};
  return h('div',{className:'plan-react',role:'group','aria-label':copy.title},
    h('div',{className:'plan-react__head'},h('span',null,copy.eyebrow),h('strong',null,copy.title)),
    h(ToggleGroup,{
      className:'plan-react__choices',value:String(active),
      onValueChange:value=>setActive(Number(value)),
      ariaLabel:copy.title,dir:arabic?'rtl':'ltr'
    },
      items.map((choice,index)=>h(ToggleGroupItem,{
        key:choice.href,index,value:String(index),
        className:'plan-react__choice'+(index===active?' is-active':'')
      },h('small',null,String(index+1).padStart(2,'0')),h('span',null,choice.title),h('b',{'aria-hidden':'true'},index===active?'●':'○')))
    ),
    item?h('div',{className:'plan-react__preview','aria-live':'polite'},
      h('span',null,copy.selected),
      h('div',null,h('strong',null,item.title),h('p',null,item.description),h('small',null,item.meta)),
      h(MagneticAction,{href:item.href,className:'plan-react__cta'},copy.cta,h('i',{'aria-hidden':'true'},'↘'))
    ):null
  );
}

export function mountPlanFinderIsland(){
  const host=document.querySelector('[data-react-plan-island]');
  if(!host||host.dataset.reactMounted==='true')return;
  const shell=host.closest('.plan-shell');if(!shell)return;
  const items=[...shell.querySelectorAll('.plan-decision__card')].map(node=>({
    href:node.getAttribute('href')||'#',title:clean(node.querySelector('strong')),description:clean(node.querySelector('p')),meta:clean(node.querySelector('small'))
  })).filter(item=>item.title);
  if(!items.length)return;
  host.dataset.reactMounted='true';shell.classList.add('has-react-plan-finder');
  createRoot(host).render(h(PlanFinder,{items,language:document.documentElement.lang||'en'}));
}
