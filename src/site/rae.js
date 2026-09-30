import {currentMarket} from './market.js';
import {marketRoute} from '../../data/markets.js';
import {characterMarkup} from './rae-character.js';
import './rae-polish.css';
const planAnchors={
 'launch-website':'launch-website','business-experience':'business-experience','premium-experience':'premium-experience',
 'monthly-starter':'monthly-starter','monthly-growth':'monthly-growth','monthly-studio':'monthly-studio',
 'ai-workflow-audit':'ai-audit','company-second-brain':'second-brain'
};
const safeRoute=action=>{
 if(!action||typeof action!=='object')return null;
 if(action.name==='showPlan'&&Object.hasOwn(planAnchors,action.args?.planId))return action.args.planId==='ai-workflow-audit'?'/ai-workflow-audit':action.args.planId==='company-second-brain'?'/company-second-brain':`/plans#${planAnchors[action.args.planId]}`;
 if(action.name==='openProject'&&action.args?.name==='fakhrimart')return '/clients/fakhrimart';
 if(action.name==='scrollToSection'&&['work','approach','method','studio','starting-points','contact'].includes(action.args?.section))return `/#${action.args.section==='approach'?'method':action.args.section}`;
 if(action.name==='navigateToRoute'&&['/','/#work','/#approach','/#method','/#studio','/#contact','/plans','/plans#ai-audit','/plans#second-brain','/clients','/clients/fakhrimart','/founder','/ai-workflow-audit','/company-second-brain','/terms'].includes(action.args?.route))return action.args.route==='/#approach'?'/#method':action.args.route;
 return null;
};
export function initRae(){
 const dialog=document.querySelector('#rae-dialog'),form=dialog.querySelector('form'),input=dialog.querySelector('textarea'),log=dialog.querySelector('.rae-messages'),status=dialog.querySelector('.rae-status');
 const actor=dialog.querySelector('[data-rae-actor]');
 // Parse only our bundled static SVG actor. Conversation content always uses textContent below.
 const characterNode=variant=>{const range=document.createRange();range.selectNode(document.body);return range.createContextualFragment(characterMarkup(variant))};
 actor.replaceChildren(characterNode('stage'));
 if(!document.querySelector('link[data-rae-emotions]')){const skin=document.createElement('link');skin.rel='stylesheet';skin.href='/rae/rae-character-emotions.css';skin.dataset.raeEmotions='';document.head.append(skin)}
 const character=actor.querySelector('[data-rae-character]');
 const launcher=document.querySelector('.rae-launcher');
 if(launcher)launcher.replaceChildren(characterNode('launcher'));
 const setCharacter=next=>{character.dataset.state=next;launcher?.querySelector('[data-rae-character]')?.setAttribute('data-state',next)};
 input.addEventListener('focus',()=>setCharacter('listening'));
 input.addEventListener('blur',()=>{if(!busy)setCharacter('idle')});
 dialog.querySelectorAll('[data-rae-prompt]').forEach(button=>button.addEventListener('click',()=>{input.value=button.dataset.raePrompt;form.requestSubmit()}));
 let history=[],busy=false,controller=null;
 const draftKey='brayro_rae_draft';
 try{input.value=sessionStorage.getItem(draftKey)||''}catch{}
 input.addEventListener('input',()=>{try{sessionStorage.setItem(draftKey,input.value)}catch{}});
 const state=text=>{status.textContent=text};
 const message=(role,text)=>{const node=document.createElement('div');node.className=`rae-message ${role}`;node.textContent=text;log.append(node);log.scrollTop=log.scrollHeight;return node};
 const renderMeta=(node,meta)=>{
  const actions=[meta?.card?.action,...(Array.isArray(meta?.actions)?meta.actions:[])];
  const links=actions.map(action=>({action,route:safeRoute(action)})).filter(item=>item.route);
  if(!links.length)return;
  const group=document.createElement('div');group.className='rae-actions';
  for(const {action,route} of links){const link=document.createElement('a');link.href=marketRoute(currentMarket(),route.split('#')[0],route.includes('#')?`#${route.split('#')[1]}`:'');link.textContent=String(action.label||'View on the site').slice(0,80);group.append(link)}
  node.after(group);
 };
 document.querySelectorAll('[data-rae-open]').forEach(button=>button.addEventListener('click',()=>{dialog.showModal();setCharacter('opening');setTimeout(()=>{if(dialog.open)setCharacter('listening')},780);input.focus()}));
 dialog.querySelector('[data-rae-close]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{controller?.abort();controller=null;busy=false;form.querySelector('button').disabled=false;state('');setCharacter('idle')});
 dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(busy)return;const question=input.value.trim();if(!question)return;
  busy=true;setCharacter('thinking');dialog.classList.add('rae-has-conversation');form.querySelector('button').disabled=true;controller=new AbortController();message('user',question);input.value='';try{sessionStorage.removeItem(draftKey)}catch{}state('Rae is thinking…');
  const answer=message('assistant','');let completed=false,error=null;
  try{
   const response=await fetch('/api/rae-chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:question,history:history.slice(-8),context:{pathname:location.pathname,pageTitle:document.title,pageKey:document.body.className.replace('page-',''),market:currentMarket()},session:{}}),signal:controller.signal});
   if(!response.ok){const payload=await response.json().catch(()=>({}));throw new Error(payload.error||'Rae is unavailable right now.')}
   if(!response.body)throw new Error('Rae could not start a response.');
   const reader=response.body.getReader(),decoder=new TextDecoder();let buffer='',eventName='',data='';
   const flush=()=>{if(!data)return;let payload;try{payload=JSON.parse(data)}catch{return}
    if(eventName==='delta'){answer.textContent+=payload.text||'';setCharacter('speaking')}
    if(eventName==='meta')renderMeta(answer,payload);
    if(eventName==='state')state(payload.state==='thinking'?'Rae is thinking…':'Rae is answering…');
    if(eventName==='error')error=payload.message||'Rae was interrupted. Please retry.';
    if(eventName==='done')completed=true;
    log.scrollTop=log.scrollHeight;eventName='';data='';
   };
   while(true){const chunk=await reader.read();if(chunk.done)break;buffer+=decoder.decode(chunk.value,{stream:true});let cut;while((cut=buffer.indexOf('\n'))>=0){const line=buffer.slice(0,cut).replace(/\r$/,'');buffer=buffer.slice(cut+1);if(!line){flush();continue}if(line.startsWith('event:'))eventName=line.slice(6).trim();if(line.startsWith('data:'))data+=line.slice(5).trim()}}
   flush();if(error||!completed)throw new Error(error||'Rae’s response stopped early. Please retry.');
   answer.textContent=answer.textContent.replace(/\*\*/g,'').replace(/^\s*[-*]\s+/gm,'• ');
   history.push({role:'user',text:question},{role:'assistant',text:answer.textContent});state('');setCharacter('positive');
  }catch(caught){if(caught.name==='AbortError')return;answer.textContent=answer.textContent||'Rae could not answer right now.';state(caught.message||'Please retry or contact Yash directly.');setCharacter('error')}finally{busy=false;controller=null;form.querySelector('button').disabled=false}
 });
}
