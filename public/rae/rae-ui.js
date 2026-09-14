import {characterMarkup} from './rae-character.js';

const clean=value=>String(value??'').replace(/\u0000/g,'').trim();
const safeText=value=>clean(value).slice(0,5000);

export class RaeUI{
  constructor(root,{pageInfo,onSend,onStop,onRetry,onAction,onOpenChange,onFocus,onClear}={}){
    this.root=root;this.pageInfo=pageInfo;this.handlers={onSend,onStop,onRetry,onAction,onOpenChange,onFocus,onClear};this.open=false;this.generating=false;this.streamNode=null;this.lastUserNearBottom=true;this.lastFocused=null;this.visualViewportHandler=null;this.focusTimer=0;
    this.build();this.bind();this.renderStarter();
  }
  build(){
    this.root.innerHTML=`
      <button class="rae-presence" type="button" data-rae-toggle aria-expanded="false" aria-controls="rae-panel" aria-label="Chat with Rae, BRAYROAI AI assistant">
        <span class="rae-presence__actor">${characterMarkup('launcher')}</span>
        <span class="rae-presence__copy"><strong>Rae</strong><small>BRAYROAI companion</small></span><i class="rae-presence__ping" aria-hidden="true"></i>
      </button>
      <button class="rae-nudge" data-rae-nudge type="button" aria-label="Open Rae suggestion"><span data-rae-nudge-copy></span><i aria-hidden="true">×</i></button>
      <section class="rae-panel" id="rae-panel" data-rae-panel role="dialog" aria-modal="true" aria-label="Chat with Rae" aria-hidden="true">
        <header class="rae-panel__head">
          <div class="rae-panel__mini">${characterMarkup('header')}</div>
          <div class="rae-panel__identity"><strong>Rae</strong><span>BRAYROAI companion</span></div>
          <span class="rae-panel__status" data-rae-status>READY</span>
          <button class="rae-icon-button" type="button" data-rae-close aria-label="Close Rae">×</button>
        </header>
        <div class="rae-stage" data-rae-stage>
          <div class="rae-stage__actor">${characterMarkup('stage')}</div>
          <div class="rae-stage__copy"><strong data-rae-stage-title>I’m Rae.</strong><span data-rae-stage-copy>I can explain the site, compare options and think through your project with you.</span></div>
        </div>
        <div class="rae-feed" data-rae-feed tabindex="0" aria-label="Conversation with Rae"></div>
        <button class="rae-jump" type="button" data-rae-jump hidden>Jump to latest ↓</button>
        <div class="rae-suggestions" data-rae-suggestions aria-label="Suggested questions"></div>
        <form class="rae-composer" data-rae-form>
          <textarea data-rae-input rows="1" maxlength="1200" placeholder="Ask Rae anything about your project…" aria-label="Message Rae"></textarea>
          <button class="rae-send" type="submit" data-rae-send aria-label="Send message to Rae">↗</button>
          <button class="rae-stop" type="button" data-rae-stop aria-label="Stop Rae response" hidden>■</button>
        </form>
        <div class="rae-panel__foot"><span>AI companion · verified BRAYROAI context</span><button type="button" data-rae-clear>Clear chat</button></div>
        <div class="rae-sr-status" data-rae-live role="status" aria-live="polite"></div>
      </section>`;
    this.toggle=this.root.querySelector('[data-rae-toggle]');this.panel=this.root.querySelector('[data-rae-panel]');this.feed=this.root.querySelector('[data-rae-feed]');this.input=this.root.querySelector('[data-rae-input]');this.status=this.root.querySelector('[data-rae-status]');this.chips=this.root.querySelector('[data-rae-suggestions]');this.stage=this.root.querySelector('[data-rae-stage]');this.live=this.root.querySelector('[data-rae-live]');this.jump=this.root.querySelector('[data-rae-jump]');
  }
  bind(){
    this.root.addEventListener('click',event=>{
      if(event.target.closest('[data-rae-toggle]'))return this.setOpen(!this.open);
      if(event.target.closest('[data-rae-close]'))return this.setOpen(false);
      if(event.target.closest('[data-rae-nudge]'))return this.setOpen(true);
      if(event.target.closest('[data-rae-stop]'))return this.handlers.onStop?.();
      if(event.target.closest('[data-rae-retry]'))return this.handlers.onRetry?.();
      if(event.target.closest('[data-rae-clear]')){this.handlers.onClear?.();this.resetConversation();return}
      if(event.target.closest('[data-rae-jump]'))return this.scrollLatest(true);
      const chip=event.target.closest('[data-rae-prompt]');if(chip)return this.submit(chip.dataset.raePrompt||'');
      const action=event.target.closest('[data-rae-action]');if(action)return this.handlers.onAction?.(action.dataset.raeAction,JSON.parse(action.dataset.raeArgs||'{}'),action);
    });
    this.toggle.addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&!this.open){event.preventDefault();event.stopPropagation();this.setOpen(true)}});
    this.root.querySelector('[data-rae-form]').addEventListener('submit',event=>{event.preventDefault();this.submit(this.input.value)});
    this.input.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();this.submit(this.input.value)}});
    this.input.addEventListener('input',()=>this.resizeComposer());this.input.addEventListener('focus',()=>this.handlers.onFocus?.());
    this.feed.addEventListener('scroll',()=>{const gap=this.feed.scrollHeight-this.feed.scrollTop-this.feed.clientHeight;this.lastUserNearBottom=gap<90;this.jump.hidden=this.lastUserNearBottom},{passive:true});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&this.open){event.preventDefault();this.setOpen(false)}});
    this.panel.addEventListener('keydown',event=>this.trapFocus(event));
    if(window.visualViewport){this.visualViewportHandler=()=>{this.root.style.setProperty('--rae-vv-height',`${visualViewport.height}px`);this.root.toggleAttribute('data-keyboard',visualViewport.height<innerHeight*.78)};visualViewport.addEventListener('resize',this.visualViewportHandler);this.visualViewportHandler()}
  }
  trapFocus(event){
    if(event.key!=='Tab')return;const focusable=[...this.panel.querySelectorAll('button:not([hidden]),textarea,a[href],[tabindex="0"]')].filter(node=>!node.disabled&&node.offsetParent!==null);if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  }
  focusComposer(){
    clearTimeout(this.focusTimer);const focus=()=>{if(this.open&&!this.generating&&this.input?.isConnected&&!this.input.disabled)this.input.focus({preventScroll:true})};
    focus();queueMicrotask(focus);requestAnimationFrame(()=>{focus();this.focusTimer=setTimeout(focus,280)});
  }
  setOpen(value){
    this.open=Boolean(value);if(this.open)this.lastFocused=document.activeElement;
    this.root.classList.toggle('is-open',this.open);this.panel.setAttribute('aria-hidden',String(!this.open));this.toggle.setAttribute('aria-expanded',String(this.open));document.body.classList.toggle('rae-dialog-open',this.open);
    this.handlers.onOpenChange?.(this.open);
    if(this.open)this.focusComposer();else{clearTimeout(this.focusTimer);const target=this.lastFocused&&document.contains(this.lastFocused)?this.lastFocused:this.toggle;requestAnimationFrame(()=>target?.focus({preventScroll:true}))}
  }
  renderStarter(){
    const wrap=document.createElement('article');wrap.className='rae-welcome';const title=document.createElement('strong');title.textContent='Ask me the useful version.';const copy=document.createElement('p');copy.textContent=`You’re on ${this.pageInfo?.label||'BRAYROAI'}. ${this.pageInfo?.summary||''}`;wrap.append(title,copy);this.feed.append(wrap);this.setChips(this.pageInfo?.chips||[]);
  }
  restore(messages=[]){for(const message of messages.slice(-8))this.addMessage(message.role,message.text,{announce:false})}
  resetConversation(){this.feed.replaceChildren();this.streamNode=null;this.lastUserNearBottom=true;this.input.value='';this.resizeComposer();this.renderStarter();this.live.textContent='Chat cleared.'}
  submit(value){const text=clean(value);if(!text||this.generating)return;this.input.value='';this.resizeComposer();this.handlers.onSend?.(text)}
  setChips(items=[]){this.chips.replaceChildren();for(const label of items.slice(0,4)){const button=document.createElement('button');button.type='button';button.className='rae-chip';button.dataset.raePrompt=label;button.textContent=label;this.chips.append(button)}}
  addMessage(role,text,{actions=[],card=null,announce=true,partial=false}={}){
    const article=document.createElement('article');article.className='rae-message';article.dataset.who=role==='user'?'user':'rae';if(partial)article.dataset.partial='true';
    const meta=document.createElement('span');meta.className='rae-message__meta';meta.textContent=role==='user'?'YOU':'RAE';const bubble=document.createElement('div');bubble.className='rae-message__bubble';bubble.textContent=safeText(text);article.append(meta,bubble);
    if(card)this.appendCard(article,card);if(actions.length)this.appendActions(article,actions);this.feed.append(article);if(this.lastUserNearBottom)this.scrollLatest();if(announce&&role!=='user'){this.live.textContent='Rae replied.'}return{article,bubble};
  }
  beginStream(){const node=this.addMessage('assistant','',{announce:false,partial:true});this.streamNode=node;return node}
  appendStream(text){if(!this.streamNode)this.beginStream();this.streamNode.bubble.append(document.createTextNode(String(text||'')));if(this.lastUserNearBottom)this.scrollLatest()}
  finishStream({actions=[],card=null}={}){if(!this.streamNode)return;this.streamNode.article.removeAttribute('data-partial');if(card)this.appendCard(this.streamNode.article,card);if(actions.length)this.appendActions(this.streamNode.article,actions);this.streamNode=null;this.live.textContent='Rae finished responding.';this.scrollLatest()}
  markStopped(){if(this.streamNode){const note=document.createElement('small');note.className='rae-message__stopped';note.textContent='Stopped';this.streamNode.article.append(note);this.streamNode.article.removeAttribute('data-partial');this.streamNode=null}this.live.textContent='Response stopped.'}
  showError(message='I lost the connection for a second. Want me to try that again?'){
    const node=this.addMessage('assistant',message,{announce:true});const retry=document.createElement('button');retry.type='button';retry.className='rae-action';retry.dataset.raeRetry='';retry.textContent='Retry';const row=document.createElement('div');row.className='rae-message__actions';row.append(retry);node.article.append(row);
  }
  appendActions(article,actions){const row=document.createElement('div');row.className='rae-message__actions';for(const action of actions.slice(0,3)){if(!action?.label||!action?.name)continue;const button=document.createElement('button');button.type='button';button.className='rae-action';button.dataset.raeAction=action.name;button.dataset.raeArgs=JSON.stringify(action.args||{});button.textContent=action.label;row.append(button)}if(row.children.length)article.append(row)}
  appendCard(article,card){
    if(!card||!['plan','case','project'].includes(card.type))return;const box=document.createElement('section');box.className=`rae-card rae-card--${card.type}`;const eyebrow=document.createElement('span');eyebrow.textContent=card.eyebrow||card.type.toUpperCase();const title=document.createElement('strong');title.textContent=safeText(card.title||'');const copy=document.createElement('p');copy.textContent=safeText(card.copy||'');box.append(eyebrow,title,copy);
    if(card.price){const price=document.createElement('b');price.textContent=safeText(card.price);box.append(price)}
    if(card.type==='project'){const area=document.createElement('textarea');area.className='rae-card__brief';area.rows=5;area.value=safeText(card.brief||'');area.setAttribute('aria-label','Editable project brief');box.append(area);const button=document.createElement('button');button.type='button';button.className='rae-card__cta';button.textContent='Continue on WhatsApp ↗';button.addEventListener('click',()=>this.handlers.onAction?.('startProject',{brief:area.value},button));box.append(button)}
    else if(card.action?.name){const button=document.createElement('button');button.type='button';button.className='rae-card__cta';button.dataset.raeAction=card.action.name;button.dataset.raeArgs=JSON.stringify(card.action.args||{});button.textContent=card.action.label||'View';box.append(button)}article.append(box);
  }
  setGenerating(value,status='THINKING'){this.generating=Boolean(value);this.status.textContent=status;this.root.querySelector('[data-rae-send]').hidden=this.generating;this.root.querySelector('[data-rae-stop]').hidden=!this.generating;this.input.disabled=this.generating;this.input.setAttribute('aria-busy',String(this.generating))}
  setStatus(value){this.status.textContent=String(value||'READY').toUpperCase().slice(0,28)}
  setStage(title,copy){const titleNode=this.root.querySelector('[data-rae-stage-title]'),copyNode=this.root.querySelector('[data-rae-stage-copy]');if(titleNode)titleNode.textContent=title;if(copyNode)copyNode.textContent=copy}
  scrollLatest(force=false){if(!force&&!this.lastUserNearBottom)return;requestAnimationFrame(()=>{this.feed.scrollTop=this.feed.scrollHeight;this.jump.hidden=true;this.lastUserNearBottom=true})}
  resizeComposer(){this.input.style.height='auto';this.input.style.height=`${Math.min(128,Math.max(42,this.input.scrollHeight))}px`}
  showNudge(text){const node=this.root.querySelector('[data-rae-nudge-copy]');if(node)node.textContent=safeText(text);this.root.classList.add('has-nudge');setTimeout(()=>this.root.classList.remove('has-nudge'),7000)}
  destroy(){clearTimeout(this.focusTimer);if(this.visualViewportHandler)visualViewport?.removeEventListener('resize',this.visualViewportHandler);document.body.classList.remove('rae-dialog-open')}
}
