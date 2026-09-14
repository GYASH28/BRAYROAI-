import {RaeDirector,emitRae} from './rae-director.js';
import {RaeChatClient} from './rae-chat-client.js';
import {RaeUI} from './rae-ui.js';
import {RaeActions,safeActionFromPrompt,buildProjectBrief} from './rae-actions.js';
import {RaeSession,RaePageContext,PAGE_INFO,getPageKey} from './rae-context.js';

const clean=value=>String(value??'').trim().replace(/\s+/g,' ');
const isCoarse=()=>matchMedia('(pointer:coarse)').matches;

class RaeApp{
  constructor(root){
    this.root=root;this.pageKey=getPageKey();this.session=new RaeSession();this.pageContext=new RaePageContext(section=>this.onSection(section));this.actions=new RaeActions(this.session);this.client=new RaeChatClient('/api/rae-chat');this.pendingMeta={};this.lastPrompt='';this.firstToken=false;this.collisionFrame=0;this.collisionObserver=null;this.collisionResizeObserver=null;this.nudgeTimer=0;this.thinkTimer=0;this.slowTimer=0;this.inerted=[];
    this.ui=new RaeUI(root,{pageInfo:PAGE_INFO[this.pageKey]||PAGE_INFO.default,onSend:text=>this.send(text),onStop:()=>this.stop(),onRetry:()=>this.retry(),onAction:(name,args,element)=>this.action(name,args,element),onOpenChange:open=>this.openChanged(open),onFocus:()=>emitRae('rae:user-focus'),onClear:()=>this.clearChat()});
    this.director=new RaeDirector(root);this.ui.restore(this.session.history());this.pageContext.start();this.bind();this.applyDeferredPlanHighlight();this.installCollisionObservers();this.resolveCollisions();this.scheduleNudge();emitRae('rae:boot');
  }
  bind(){
    this.onPointer=event=>this.director.pointer(event);this.onResize=()=>this.queueCollision();this.onOnline=()=>{this.ui.setStatus('READY');emitRae('rae:wake')};this.onOffline=()=>{this.ui.setStatus('OFFLINE');emitRae('rae:offline')};this.onDockReady=()=>this.refreshCollisionTargets();
    if(!isCoarse())addEventListener('pointermove',this.onPointer,{passive:true});else this.root.querySelector('[data-rae-toggle]')?.addEventListener('pointerdown',()=>this.director.touchReact(),{passive:true});
    addEventListener('resize',this.onResize,{passive:true});addEventListener('online',this.onOnline);addEventListener('offline',this.onOffline);document.addEventListener('brayro:contact-dock-ready',this.onDockReady);this.root.querySelector('[data-rae-toggle]')?.addEventListener('mouseenter',()=>emitRae('rae:user-focus'));if(!navigator.onLine)this.onOffline();
  }
  openChanged(open){
    document.body.classList.toggle('rae-conversation-open',open);this.setBackgroundInert(open);emitRae(open?'rae:opened':'rae:closed');this.resolveCollisions();if(open){this.root.classList.remove('has-nudge');setTimeout(()=>{if(this.ui.open&&this.director.state==='opening')this.director.setState('idle')},620)}
  }
  setBackgroundInert(open){
    if(open){this.inerted=[];for(const node of document.body.children){if(node===this.root||!(node instanceof HTMLElement))continue;this.inerted.push([node,node.inert]);node.inert=true}}
    else{for(const [node,previous] of this.inerted){if(document.contains(node))node.inert=previous}this.inerted=[]}
  }
  async send(text,{retry=false}={}){
    const prompt=clean(text);if(!prompt||this.ui.generating)return;
    const localAction=safeActionFromPrompt(prompt);
    if(localAction&&!retry){this.ui.addMessage('user',prompt);this.session.add('user',prompt);emitRae('rae:user-submit');try{await this.actions.execute(localAction.name,localAction.args)}catch{this.ui.addMessage('assistant','I could not reach that section just now. Try the navigation or ask me where it lives.')}return}
    if(!retry){this.ui.addMessage('user',prompt);this.session.add('user',prompt)}
    this.lastPrompt=prompt;this.pendingMeta={};this.firstToken=false;emitRae('rae:user-submit');this.ui.setGenerating(true,'LISTENING');this.ui.setStage('Got it.','I’m reading your question and the verified BRAYROAI context now.');
    if(!navigator.onLine){this.ui.setGenerating(false,'OFFLINE');emitRae('rae:offline');this.ui.showError('You’re offline right now. I can still guide you around this site when you’re back online.');this.ui.setChips(['Show plans','Show client work','Open FakhriMart','Contact']);return}
    clearTimeout(this.thinkTimer);clearTimeout(this.slowTimer);
    this.thinkTimer=setTimeout(()=>{if(!this.firstToken&&this.ui.generating)emitRae('rae:request-start')},90);
    this.slowTimer=setTimeout(()=>{if(!this.firstToken&&this.ui.generating)this.ui.setStage('Still thinking…','I’m waiting for the real AI response — no fake progress steps.')},4500);
    try{await this.client.stream({message:prompt,history:this.session.history(),context:this.pageContext.payload(this.session.state.recentAction),session:this.session.snapshot(),onEvent:event=>this.onStreamEvent(event)})}
    catch(error){
      this.clearLatencyTimers();this.ui.setGenerating(false,navigator.onLine?'READY':'OFFLINE');
      if(error?.name==='AbortError'&&error.code==='aborted'){this.ui.markStopped();emitRae('rae:stream-abort');return}
      if(error?.code==='provider_not_configured'||error?.code==='model_not_configured'){emitRae('rae:offline');this.ui.showError('My AI connection is not configured right now. I can still guide you to plans, verified work and contact options.');this.ui.setChips(['Show plans','Show client work','Open FakhriMart','Contact']);return}
      emitRae('rae:network-error',{code:error?.code||'network'});this.ui.showError(error?.code==='timeout'?'That took too long and I stopped the request. Want me to retry?':'I lost the connection for a second. Want me to try that again?');
    }
  }
  onStreamEvent({type,data}){
    if(type==='state'){this.ui.setStatus(data?.state||'THINKING');if(data?.state==='thinking'&&!this.firstToken)emitRae('rae:request-start');return}
    if(type==='delta'){
      const text=String(data?.text||'');if(!text)return;if(!this.firstToken){this.firstToken=true;this.clearLatencyTimers();this.ui.beginStream();this.ui.setStatus('SPEAKING');emitRae('rae:first-token')}this.ui.appendStream(text);emitRae('rae:stream-chunk',{text});return;
    }
    if(type==='meta'){this.pendingMeta={...this.pendingMeta,...data};if(Array.isArray(data?.quickReplies))this.ui.setChips(data.quickReplies);return}
    if(type==='action'){if(data?.name&&data?.label)this.pendingMeta.actions=[...(this.pendingMeta.actions||[]),{name:data.name,label:data.label,args:data.args||{}}];return}
    if(type==='done'){
      this.clearLatencyTimers();const text=this.ui.streamNode?.bubble?.textContent||'';if(text)this.session.add('assistant',text);this.ui.finishStream({actions:this.pendingMeta.actions||[],card:this.pendingMeta.card||null});this.ui.setGenerating(false,'READY');this.ui.setStage('Still here.','Ask a follow-up, compare an option, or let me guide you to the relevant part of the site.');emitRae('rae:stream-complete',{emotion:this.pendingMeta.emotion||data?.emotion||'neutral'});return;
    }
    if(type==='error'){const error=new Error(data?.message||'Rae AI unavailable');error.code=data?.code||'provider_error';throw error}
  }
  clearLatencyTimers(){clearTimeout(this.thinkTimer);clearTimeout(this.slowTimer);this.thinkTimer=0;this.slowTimer=0}
  clearChat(){
    this.clearLatencyTimers();if(this.ui.generating)this.client.abort('user');this.session.clear();this.client.lastRequest=null;this.lastPrompt='';this.pendingMeta={};this.firstToken=false;this.ui.setGenerating(false,navigator.onLine?'READY':'OFFLINE');this.ui.setStage('I’m Rae.','I can explain the site, compare options and think through your project with you.');emitRae(navigator.onLine?'rae:stream-abort':'rae:offline');
  }
  stop(){this.clearLatencyTimers();this.client.abort('user');this.ui.setGenerating(false,'READY');this.ui.markStopped();emitRae('rae:stream-abort')}
  retry(){if(!this.lastPrompt||this.ui.generating)return;this.send(this.lastPrompt,{retry:true})}
  async action(name,args={},element){
    if(name==='startProject'){
      const brief=clean(args.brief||buildProjectBrief({goal:this.session.state.profile?.goal,business:this.session.state.profile?.business,timeline:this.session.state.profile?.timeline,budget:this.session.state.profile?.budget}));if(!brief)return;this.session.setRecentAction('startProject:whatsapp');emitRae('rae:tool-success',{name});this.director.trigger('celebrate');window.open(`https://wa.me/919175524637?text=${encodeURIComponent(brief)}`,'_blank','noopener,noreferrer');return;
    }
    try{element?.setAttribute('aria-busy','true');await this.actions.execute(name,args)}catch(error){this.ui.addMessage('assistant',`I couldn't complete that action: ${clean(error?.message||'target unavailable')}.`,{announce:true})}finally{element?.removeAttribute('aria-busy')}
  }
  onSection(section){if(this.ui.open)return;const meaningful={work:'I noticed you reached the real client work. I can explain what changed for FakhriMart.',plans:'If the pricing starts feeling like a spreadsheet, I can compare the options with your actual project in mind.','ai-systems':'If you have a messy workflow, describe it in one sentence and I’ll help work out whether AI belongs there.'};const text=meaningful[section];if(text)this.maybeNudge(text,`section:${section}`)}
  scheduleNudge(){clearTimeout(this.nudgeTimer);this.nudgeTimer=setTimeout(()=>{const copy={home:'Need a shortcut? I can compare plans, explain the real work, or think through a project idea.',plans:'Tell me what you actually need. I’ll compare the options without automatically picking the expensive one.',case:'Want the useful 20-second version of FakhriMart? I know what changed and what was intentionally not faked.',audit:'Describe one annoying workflow. I can help decide whether this audit is even necessary.'}[this.pageKey];if(copy)this.maybeNudge(copy,`welcome:${this.pageKey}`)},17000)}
  maybeNudge(text,key){try{if(sessionStorage.getItem('rae:v2:nudge-shown'))return;sessionStorage.setItem('rae:v2:nudge-shown',key)}catch{}if(this.ui.open)return;this.ui.showNudge(text);this.director.setState('curious')}
  applyDeferredPlanHighlight(){if(this.pageKey!=='plans')return;let plan='';try{plan=sessionStorage.getItem('rae:plan-highlight')||'';sessionStorage.removeItem('rae:plan-highlight')}catch{}if(plan)setTimeout(()=>this.actions.showPlan(plan).catch(()=>{}),700)}
  queueCollision(){if(this.collisionFrame)return;this.collisionFrame=requestAnimationFrame(()=>{this.collisionFrame=0;this.resolveCollisions()})}
  installCollisionObservers(){
    if('MutationObserver'in window){this.collisionObserver=new MutationObserver(records=>{for(const record of records){const nodes=[...record.addedNodes,...record.removedNodes];if(nodes.some(node=>node instanceof HTMLElement&&!this.root.contains(node))){this.refreshCollisionTargets();break}}});this.collisionObserver.observe(document.body,{childList:true,subtree:true})}
    if('ResizeObserver'in window)this.collisionResizeObserver=new ResizeObserver(()=>this.queueCollision());this.refreshCollisionTargets();
  }
  refreshCollisionTargets(){
    this.collisionResizeObserver?.disconnect();if(this.collisionResizeObserver){for(const node of document.querySelectorAll('.brayro-contact-dock,[data-rae-avoid]'))this.collisionResizeObserver.observe(node)}this.queueCollision();
  }
  resolveCollisions(){
    this.root.style.setProperty('--rae-collision-lift','0px');this.root.dataset.raeClearance='base';if(this.ui.open)return;const rae=this.root.querySelector('[data-rae-toggle]');if(!rae)return;const rect=rae.getBoundingClientRect(),gap=14;let lift=0;
    const candidates=new Set(document.querySelectorAll('.brayro-contact-dock,[data-rae-avoid],a,button,[role="button"],nav,aside'));
    for(const node of candidates){
      if(!(node instanceof HTMLElement)||this.root.contains(node))continue;const style=getComputedStyle(node);if(!['fixed','sticky'].includes(style.position)||style.visibility==='hidden'||style.display==='none'||Number(style.opacity)===0)continue;const other=node.getBoundingClientRect();if(other.width<1||other.height<1||other.bottom<=innerHeight*.55)continue;const horizontal=rect.left<other.right+gap&&rect.right>other.left-gap;if(!horizontal)continue;const threatened=other.top<rect.bottom+gap&&other.bottom>rect.top-gap;if(!threatened)continue;lift=Math.max(lift,rect.bottom-other.top+gap);
    }
    lift=Math.max(0,Math.min(260,lift));this.root.style.setProperty('--rae-collision-lift',`${Math.ceil(lift)}px`);this.root.dataset.raeClearance=lift>0?'lifted':'base';
  }
  destroy(){clearTimeout(this.nudgeTimer);this.clearLatencyTimers();document.body.classList.remove('rae-conversation-open');this.setBackgroundInert(false);this.client.abort('destroy');this.director.dispose();this.pageContext.dispose();this.ui.destroy();this.collisionObserver?.disconnect();this.collisionResizeObserver?.disconnect();if(this.collisionFrame)cancelAnimationFrame(this.collisionFrame);if(!isCoarse())removeEventListener('pointermove',this.onPointer);removeEventListener('resize',this.onResize);removeEventListener('online',this.onOnline);removeEventListener('offline',this.onOffline);document.removeEventListener('brayro:contact-dock-ready',this.onDockReady)}
}

export function mountRae(root=document.querySelector('[data-rae-root]')){if(!root||root.dataset.raeAppReady)return null;root.dataset.raeAppReady='true';const app=new RaeApp(root);window.__BRAYRO_RAE__=app;return app}
