import React,{useState,useEffect} from 'react';
import {createRoot} from 'react-dom/client';

const options=[
 {id:'new-website',name:'Website builds',detail:'A defined new presence',count:'03 offers'},
 {id:'monthly-support',name:'Monthly care',detail:'Improve what is live',count:'03 offers'},
 {id:'ai-systems',name:'AI systems',detail:'Start with a real workflow',count:'03 offers'}
];
const selectedCategory=()=>document.querySelector('[data-category][aria-selected="true"]')?.dataset.category||'new-website';

function PlanDesk(){
 const [active,setActive]=useState(selectedCategory);
 useEffect(()=>{
  const sync=event=>setActive(event?.detail?.category||selectedCategory());
  sync();window.addEventListener('studio:category',sync);
  return()=>window.removeEventListener('studio:category',sync);
 },[]);
 const choose=id=>{
  const tab=document.querySelector(`[data-category="${id}"]`);
  tab?.click();tab?.focus({preventScroll:true});
 };
 return <nav className="plan-desk" aria-label="Plans overview">
  <p><span>Choose a route</span><strong>9 published starting points</strong></p>
  {options.map((item,index)=><button type="button" className={`desk-sheet ${active===item.id?'is-active':''}`} key={item.id} aria-pressed={active===item.id} onClick={()=>choose(item.id)}>
   <span className="desk-sheet-number">0{index+1}</span>
   <span className="desk-sheet-copy"><strong>{item.name}</strong><small>{item.detail}</small></span>
   <span className="desk-sheet-count">{item.count}</span><span aria-hidden="true">↘</span>
  </button>)}
 </nav>;
}

export function mountPlanDesk(host){
 const root=createRoot(host);root.render(<PlanDesk/>);
 return()=>root.unmount();
}
