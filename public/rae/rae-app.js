import {RaeDirector,emitRae} from './rae-director.js';
import {RaeChatClient} from './rae-chat-client.js';
import {RaeUI} from './rae-ui.js';
import {RaeActions,safeActionFromPrompt,buildProjectBrief} from './rae-actions.js';
import {RaeSession,RaePageContext,PAGE_INFO,getPageKey} from './rae-context.js';

const clean=value=>String(value??'').trim().replace(/\s+/g,' ');
const isCoarse=()=>matchMedia('(pointer:coarse)').matches;

class RaeApp{
  constructor(root){
    this.root=root;this.pageKey=getPageKey();this.session=new RaeSession();this.pageContext=new RaePageContext(section=>this.onSection(section));this.actions=new RaeActions(this.session);this.client=new RaeChatClient('/api/rae-chat');this.pendingMeta={};this.lastPrompt='';this.firstToken=false;this.collisionFrame=0;this.nudgeTimer=0;
    this.ui=new RaeUI(root,{pageInfo:PAGE_INFO[this.pageKey]||PAGE_INFO.default,onSend:text=>this.send(text),onStop:()=>this.stop(),onRetry:()=>this.retry(),onAction:(name,args,element)=>this.action(name,args,element),onOpenChange:open=>this.openChanged(open),onFocus:()=>emitRae('rae:user-focus')});
    this.director=new RaeDirector(root);this.ui.restore(this.session.history());this.pageContext.start();this.bind();this.applyDeferredPlanHighlight();this.resolveCollisions();this.scheduleNudge();emitRae('rae:boot');
  }
  bind(){
    this.onPointer=event=>this.director.pointer(event);this.onResize=()=>this.queueCollision();this.onOnline=()=>{this.ui.setStatus('READY');emitRae('rae:wake')};this.onOffline=()=>{this.ui.setStatus('OFFLINE');emitRae('rae:offline')};
    if(!isCoarse())addEventListener('pointermove',this.onPointer,{passive:true});else this.root.querySelector('[data-rae-toggle]')?.addEventListener('pointerdown',()=>this.director.touchReact(),{passive:true});
    addEventListener('resize',this.onResize,{passive:true});addEventListener('online',this.onOnline);addEventListener('offline',this.onOffline);
    this.root.querySelector('[data-rae-toggle]')?.addEventListener('mouseenter',()=>emitRae('rae:user-focus'));
    if(!navigator.onLine)this.onOffline();
  }
  openChanged(open){emitRae(open?'rae:opened':'rae:closed');this.resolveCollisions();if(open)this.root.classList.remove('has-nudge')}
  async send(text,{retry=false}={}){
    const prompt=clean(text);if(!prompt||this.ui.generating)return;
    const localAction=safeActionFromPrompt(prompt);
    if(localAction&&!retry){
      this.ui.addMessage('user',prompt);this.session.add('user',prompt);emitRae('rae:user-submit');
      try{await this.actions.execute(localAction.name,localAction.args)}catch{this.ui.addMessage('assistant','I could not reach that section just now. Try the navigation or ask me where it lives.');}
      return;
    }
    if(!retry){this.ui.addMessage('user',prompt);this.session.add('user',prompt)}
    this.lastPrompt=prompt;this.pendingMeta={};this.firstToken=false;emitRae('rae:user-submit');emitRae('rae:request-start');this.ui.setGenerating(true,'THINKING');this.ui.setStage('Thinking with you…','I’m using verified BRAYROAI context plus the project details you gave me.');
    try{
      await this.client.stream({message:prompt,history:this.session.history(),context:this.pageContext.payload(this.session.state.recentAction),session:this.session.snapshot(),onEvent:event=>this.onStreamEvent(event)});
    }catch(error){
      this.ui.setGenerating(false,navigator.onLine?'READY':'OFFLINE');
      if(error?.name==='AbortError'&&error.code==='aborted'){this.ui.markStopped();emitRae('rae:stream-abort');return}
      if(error?.code==='provider_not_configured'){emitRae('rae:offline');this.ui.showError('My AI connection is not configured right now. I can still guide you to plans, verified work and contact options.');this.ui.setChips(['Show plans','Show client work','Open FakhriMart','Contact']);return}
      emitRae('rae:network-error',{code:error?.code||'network'});this.ui.showError(error?.code==='timeout'?'That took too long and I stopped the request. Want me to retry?':'I lost the connection for a second. Want me to try that again?');
    }
  }
  onStreamEvent({type,data}){
    if(type==='state'){this.ui.setStatus(data?.state||'THINKING');return}
    if(type==='delta'){
      const text=String(data?.text||'');if(!text)return;
      if(!this.firstToken){this.firstToken=true;this.ui.beginStream();this.ui.setStatus('SPEAKING');emitRae('rae:first-token')}
      this.ui.appendStream(text);emitRae('rae:stream-chunk',{text});return;
    }
    if(type==='meta'){this.pendingMeta={...this.pendingMeta,...data};if(Array.isArray(data?.quickReplies))this.ui.setChips(data.quickReplies);return}
    if(type==='action'){if(data?.name&&data?.label){this.pendingMeta.actions=[...(this.pendingMeta.actions||[]),{name:data.name,label:data.label,args:data.args||{}}]}return}
    if(type==='done'){
      const text=this.ui.streamNode?.bubble?.textContent||'';if(text)this.session.add('assistant',text);
      this.ui.finishStream({actions:this.pendingMeta.actions||[],card:this.pendingMeta.card||null});this.ui.setGenerating(false,'READY');this.ui.setStage('Still here.','Ask a follow-up, compare an option, or let me guide you to the relevant part of the site.');emitRae('rae:stream-complete',{emotion:this.pendingMeta.emotion||data?.emotion||'neutral'});return;
    }
    if(type==='error'){const error=new Error(data?.message||'Rae AI unavailable');error.code=data?.code||'provider_error';throw error}
  }
  stop(){this.client.abort('user');this.ui.setGenerating(false,'READY');this.ui.markStopped();emitRae('rae:stream-abort')}
  retry(){if(!this.lastPrompt||this.ui.generating)return;this.send(this.lastPrompt,{retry:true})}
  async action(name,args={},element){
    if(name==='startProject'){
      const brief=clean(args.brief||buildProjectBrief({goal:this.session.state.profile?.goal,business:this.session.state.profile?.business,timeline:this.session.state.profile?.timeline,budget:this.session.state.profile?.budget}));if(!brief)return;
      this.session.setRecentAction('startProject:whatsapp');emitRae('rae:tool-success',{name});this.director.trigger('celebrate');window.open(`https://wa.me/919175524637?text=${encodeURIComponent(brief)}`,'_blank','noopener,noreferrer');return;
    }
    try{element?.setAttribute('aria-busy','true');await this.actions.execute(name,args)}catch(error){this.ui.addMessage('assistant',`I couldn't complete that action: ${clean(error?.message||'target unavailable')}.`,{announce:true})}finally{element?.removeAttribute('aria-busy')}
  }
  onSection(section){
    if(this.ui.open)return;const meaningful={work:'I noticed you reached the real client work. I can explain what changed for FakhriMart.',plans:'If the pricing starts feeling like a spreadsheet, I can compare the options with your actual project in mind.','ai-systems':'If you have a messy workflow, describe it in one sentence and I’ll help work out whether AI belongs there.'};
    const text=meaningful[section];if(text)this.maybeNudge(text,`section:${section}`);
  }
  scheduleNudge(){
    clearTimeout(this.nudgeTimer);this.nudgeTimer=setTimeout(()=>{const copy={home:'Need a shortcut? I can compare plans, explain the real work, or think through a project idea.',plans:'Tell me what you actually need. I’ll compare the options without automatically picking the expensive one.',case:'Want the useful 20-second version of FakhriMart? I know what changed and what was intentionally not faked.',audit:'Describe one annoying workflow. I can help decide whether this audit is even necessary.'}[this.pageKey];if(copy)this.maybeNudge(copy,`welcome:${this.pageKey}`)},17000);
  }
  maybeNudge(text,key){
    try{if(sessionStorage.getItem('rae:v2:nudge-shown'))return;sessionStorage.setItem('rae:v2:nudge-shown',key)}catch{}if(this.ui.open)return;this.ui.showNudge(text);this.director.setState('curious')
  }
  applyDeferredPlanHighlight(){
    if(this.pageKey!=='plans')return;let plan='';try{plan=sessionStorage.getItem('rae:plan-highlight')||'';sessionStorage.removeItem('rae:plan-highlight')}catch{}if(plan)setTimeout(()=>this.actions.showPlan(plan).catch(()=>{}),700)
  }
  queueCollision(){if(this.collisionFrame)return;this.collisionFrame=requestAnimationFrame(()=>{this.collisionFrame=0;this.resolveCollisions()})}
  resolveCollisions(){
    this.root.style.setProperty('--rae-collision-lift','0px');if(this.ui.open)return;
    const rae=this.root.querySelector('[data-rae-toggle]');if(!rae)return;const rect=rae.getBoundingClientRect();let lift=0;
    for(const node of document.querySelectorAll('a,button,[role="button"]')){
      if(this.root.contains(node)||node.offsetParent===null)continue;const style=getComputedStyle(node);if(!['fixed','sticky'].includes(style.position))continue;const other=node.getBoundingClientRect();const overlap=rect.left<other.right+10&&rect.right>other.left-10&&rect.top<other.bottom+10&&rect.bottom>other.top-10;if(overlap&&other.bottom>innerHeight*.55)lift=Math.max(lift,other.height+18);
    }
    this.root.style.setProperty('--rae-collision-lift',`${Math.min(180,lift)}px`);
  }
  destroy(){clearTimeout(this.nudgeTimer);this.client.abort('destroy');this.director.dispose();this.pageContext.dispose();this.ui.destroy();if(!isCoarse())removeEventListener('pointermove',this.onPointer);removeEventListener('resize',this.onResize);removeEventListener('online',this.onOnline);removeEventListener('offline',this.onOffline)}
}

export function mountRae(root=document.querySelector('[data-rae-root]')){if(!root||root.dataset.raeAppReady)return null;root.dataset.raeAppReady='true';const app=new RaeApp(root);window.__BRAYRO_RAE__=app;return app}
