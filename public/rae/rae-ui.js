import {characterMarkup} from './rae-character.js';

const clean=value=>String(value??'').replace(/\u0000/g,'').trim();
const safeText=value=>clean(value).slice(0,5000);
const arabicChoices={'A website':'موقع إلكتروني','A digital product':'منتج رقمي','An internal AI workflow':'سير عمل داخلي بالذكاء الاصطناعي','I’m not sure yet':'لست متأكداً بعد','More qualified enquiries':'استفسارات أنسب','Clearer product discovery':'عرض أوضح للمنتج','Less manual work':'عمل يدوي أقل','A stronger first impression':'انطباع أول أقوى','As soon as possible':'في أقرب وقت','This month':'هذا الشهر','Still exploring':'ما زلت أستكشف','Cancel':'إلغاء','Show plans':'شاهد الخطط','Show client work':'شاهد أعمال العملاء','Open FakhriMart':'افتح دراسة FakhriMart','Contact':'تواصل','Compare these plans':'قارن هذه الخطط','Which one fits me?':'ما الخيار الأنسب لي؟','What is included?':'ماذا يشمل السعر؟','Start a project':'ابدأ مشروعاً','What can BRAYROAI build?':'ماذا تبني BRAYROAI؟','Which plan fits my project?':'ما الخطة المناسبة لمشروعي؟','Show me your work':'شاهد أعمال الاستوديو','I have a project idea':'لدي فكرة مشروع','Show me FakhriMart':'شاهد FakhriMart','What changed for the client?':'ما الذي تغير للعميل؟','Can you build something similar?':'هل يمكنك بناء شيء مشابه؟','What did BRAYROAI do here?':'ما الذي قدمته BRAYROAI؟','Show me the process':'اشرح العملية','Who is Yash?':'من ياش؟','Why a small studio?':'لماذا استوديو صغير؟','How does BRAYRO work?':'كيف تعمل BRAYROAI؟','Give me the human version':'اشرح الشروط ببساطة','What about payments?':'كيف تتم الدفعات؟','What counts as extra?':'ما الذي يُسعّر منفصلاً؟','I have a project question':'لدي سؤال عن المشروع','Explain this simply':'اشرح هذا ببساطة','Is this right for my business?':'هل يناسب شركتي؟','What do I get?':'ماذا سأحصل عليه؟','Audit or Second Brain?':'التدقيق أم ذاكرة الشركة؟','Would this help my team?':'هل سيفيد فريقي؟','What sources can it use?':'ما المصادر التي يستخدمها؟'};

export class RaeUI{
  constructor(root,{pageInfo,onSend,onStop,onRetry,onAction,onOpenChange,onFocus,onClear,onGuideStart,onGuideAnswer,onCompare,onProof}={}){
    this.root=root;this.pageInfo=pageInfo;this.arabic=window.BRAYRO_MARKET?.id==='ae-ar';this.handlers={onSend,onStop,onRetry,onAction,onOpenChange,onFocus,onClear,onGuideStart,onGuideAnswer,onCompare,onProof};this.open=false;this.generating=false;this.streamNode=null;this.lastUserNearBottom=true;this.lastFocused=null;this.visualViewportHandler=null;this.resizeHandler=null;this.focusTimer=0;this.focusRecoveryTimer=0;
    this.build();this.syncLauncherPosition(false);this.syncModality();this.bind();this.renderStarter();
  }
  build(){
    this.root.innerHTML=`
      <button class="rae-presence" type="button" data-rae-toggle aria-expanded="false" aria-controls="rae-panel" aria-label="Chat with Rae, BRAYROAI AI assistant">
        <span class="rae-presence__actor">${characterMarkup('launcher')}</span>
        <span class="rae-presence__copy"><strong>Rae</strong><small>BRAYROAI companion</small></span><i class="rae-presence__ping" aria-hidden="true"></i>
      </button>
      <div class="rae-nudge" data-rae-nudge><button type="button" data-rae-nudge-open aria-label="Open Rae suggestion"><span data-rae-nudge-copy></span></button><button type="button" data-rae-nudge-dismiss aria-label="Dismiss Rae suggestion">×</button></div>
      <section class="rae-panel" id="rae-panel" data-rae-panel role="dialog" aria-modal="false" aria-label="Chat with Rae" aria-hidden="true">
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
    if(this.arabic){
      const labels={'[data-rae-toggle]':'تحدث مع راي، مساعد BRAYROAI','[data-rae-nudge-open]':'افتح اقتراح راي','[data-rae-nudge-dismiss]':'تجاهل اقتراح راي','[data-rae-panel]':'المحادثة مع راي','[data-rae-close]':'أغلق راي','[data-rae-feed]':'المحادثة مع راي','[data-rae-suggestions]':'أسئلة مقترحة','[data-rae-input]':'اكتب رسالة إلى راي','[data-rae-send]':'أرسل الرسالة','[data-rae-stop]':'أوقف رد راي'};
      for(const [selector,label] of Object.entries(labels))this.root.querySelector(selector)?.setAttribute('aria-label',label);
      this.input.placeholder='اسأل راي عن مشروعك…';this.root.querySelectorAll('.rae-presence__copy small,.rae-panel__identity span').forEach(node=>node.textContent='رفيقتك الإبداعية');
      this.root.querySelector('[data-rae-stage-title]').textContent='أنا راي.';this.root.querySelector('[data-rae-stage-copy]').textContent='أساعدك في فهم الخدمات ومقارنة الخيارات وتخطيط الخطوة التالية.';
      this.jump.textContent='اذهب إلى الأحدث ↓';this.root.querySelector('.rae-panel__foot span').textContent='مساعدة ذكية · معلومات موثقة عن BRAYROAI';this.root.querySelector('[data-rae-clear]').textContent='امسح المحادثة';this.status.textContent='جاهزة';
    }
  }
  bind(){
    this.root.addEventListener('click',event=>{
      if(event.target.closest('[data-rae-toggle]'))return this.setOpen(!this.open);
      if(event.target.closest('[data-rae-close]'))return this.setOpen(false);
      if(event.target.closest('[data-rae-nudge-dismiss]')){this.root.classList.remove('has-nudge');try{sessionStorage.setItem('rae:v2:nudge-shown','dismissed')}catch{}return}
      if(event.target.closest('[data-rae-nudge-open]'))return this.setOpen(true);
      if(event.target.closest('[data-rae-stop]'))return this.handlers.onStop?.();
      if(event.target.closest('[data-rae-retry]'))return this.handlers.onRetry?.();
      if(event.target.closest('[data-rae-clear]')){this.handlers.onClear?.();this.resetConversation();return}
      if(event.target.closest('[data-rae-jump]'))return this.scrollLatest(true);
      if(event.target.closest('[data-rae-guide-start]'))return this.handlers.onGuideStart?.();
      if(event.target.closest('[data-rae-compare]'))return this.handlers.onCompare?.();
      if(event.target.closest('[data-rae-proof]'))return this.handlers.onProof?.();
      const answer=event.target.closest('[data-rae-guide-answer]');if(answer)return this.handlers.onGuideAnswer?.(answer.dataset.raeGuideAnswer||'');
      const chip=event.target.closest('[data-rae-prompt]');if(chip)return this.submit(chip.dataset.raePrompt||'');
      const action=event.target.closest('[data-rae-action]');if(action)return this.handlers.onAction?.(action.dataset.raeAction,JSON.parse(action.dataset.raeArgs||'{}'),action);
    });
    this.root.querySelector('[data-rae-form]').addEventListener('submit',event=>{event.preventDefault();this.submit(this.input.value)});
    this.input.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();this.submit(this.input.value)}});
    this.input.addEventListener('input',()=>this.resizeComposer());this.input.addEventListener('focus',()=>this.handlers.onFocus?.());
    this.feed.addEventListener('scroll',()=>{const gap=this.feed.scrollHeight-this.feed.scrollTop-this.feed.clientHeight;this.lastUserNearBottom=gap<90;this.jump.hidden=this.lastUserNearBottom},{passive:true});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&this.open){event.preventDefault();this.setOpen(false)}});
    this.panel.addEventListener('keydown',event=>this.trapFocus(event));
    this.resizeHandler=()=>{this.syncLauncherPosition(this.open);this.syncModality()};addEventListener('resize',this.resizeHandler,{passive:true});
    if(window.visualViewport){this.visualViewportHandler=()=>{this.root.style.setProperty('--rae-vv-height',`${visualViewport.height}px`);this.root.toggleAttribute('data-keyboard',visualViewport.height<innerHeight*.78);this.syncLauncherPosition(this.open)};visualViewport.addEventListener('resize',this.visualViewportHandler);this.visualViewportHandler()}
  }
  syncModality(){
    const modal=this.open&&matchMedia('(max-width:700px)').matches;
    this.panel.setAttribute('aria-modal',String(modal));
    this.root.toggleAttribute('data-rae-modal',modal);
    document.body.classList.toggle('rae-dialog-open',modal);
    document.documentElement.classList.toggle('rae-dialog-open',modal);
  }
  trapFocus(event){
    if(this.panel.getAttribute('aria-modal')!=='true'||event.key!=='Tab')return;const focusable=[...this.panel.querySelectorAll('button:not([hidden]),textarea,a[href],[tabindex="0"]')].filter(node=>!node.disabled&&node.offsetParent!==null);if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  }
  settleFocus(target,expectOpen){
    clearTimeout(this.focusTimer);clearTimeout(this.focusRecoveryTimer);const delays=[0,72,180,360,620];let index=0;
    const blockedByOverlay=()=>!expectOpen&&(document.documentElement.classList.contains('global-menu-open')||document.querySelector('#market-sheet[open]'));
    const apply=()=>{if(this.open!==expectOpen||!target?.isConnected||blockedByOverlay())return;try{target.focus({preventScroll:true})}catch{}if(index<delays.length-1){index+=1;this.focusTimer=setTimeout(apply,delays[index])}};
    queueMicrotask(apply);
    // Heavy page transitions can finish after the short focus retries. Recover only
    // when focus has fallen outside the open dialog or remained inside the closed one.
    this.focusRecoveryTimer=setTimeout(()=>{if(this.open!==expectOpen||!target?.isConnected||blockedByOverlay())return;const active=document.activeElement,modal=this.panel.getAttribute('aria-modal')==='true';const lost=expectOpen?(modal?!this.panel.contains(active):active===document.body):active===document.body||this.panel.contains(active);if(lost)try{target.focus({preventScroll:true})}catch{}},2000);
  }
  focusComposer(){if(!this.generating&&!this.input.disabled)this.settleFocus(this.input,true)}
  preparePanelTransition(next){
    const compact=matchMedia('(max-width:700px)').matches;
    if(compact&&next)this.panel.style.transition='scale .34s var(--rae-ease), translate .34s var(--rae-ease), visibility 0s';
    else this.panel.style.removeProperty('transition');
  }
  syncLauncherPosition(nextOpen=this.open){
    const compact=matchMedia('(max-width:700px)').matches;
    if(compact&&!nextOpen)this.root.style.bottom='calc(max(2rem,env(safe-area-inset-bottom)) + var(--rae-collision-lift))';
    else this.root.style.removeProperty('bottom');
  }
  setOpen(value){
    const next=Boolean(value);this.preparePanelTransition(next);this.syncLauncherPosition(next);this.open=next;if(this.open)this.lastFocused=document.activeElement;
    this.root.classList.toggle('is-open',this.open);this.panel.setAttribute('aria-hidden',String(!this.open));this.toggle.setAttribute('aria-expanded',String(this.open));this.syncModality();
    this.handlers.onOpenChange?.(this.open);
    if(this.open)this.focusComposer();else{const target=this.lastFocused&&document.contains(this.lastFocused)?this.lastFocused:this.toggle;this.settleFocus(target,false)}
  }
  renderStarter(){
    const wrap=document.createElement('article');wrap.className='rae-welcome';const title=document.createElement('strong');title.textContent=this.arabic?'لنجعل الخطوة التالية أوضح.':'Make the next step clearer.';const copy=document.createElement('p');copy.textContent=this.arabic?'أستطيع شرح الخيارات والأسعار المنشورة، ومساعدتك في إعداد فكرة مشروع قبل التواصل مع ياش.':`You’re on ${this.pageInfo?.label||'BRAYROAI'}. ${this.pageInfo?.summary||''}`;
    const guide=document.createElement('button');guide.type='button';guide.className='rae-welcome__guide';guide.dataset.raeGuideStart='';guide.innerHTML=`<span><b>${this.arabic?'خطط لمشروعك مع راي':'Plan a project with Rae'}</b><small>${this.arabic?'ثلاثة أسئلة · موجز أولي مفيد':'Three questions · a useful starting brief'}</small></span><i aria-hidden="true">↗</i>`;
    const paths=document.createElement('div');paths.className='rae-welcome__paths';
    const compare=document.createElement('button');compare.type='button';compare.dataset.raeCompare='';compare.innerHTML=`<b>${this.arabic?'قارن الخدمات':'Compare the offers'}</b><small>${this.arabic?'النطاق والأسعار المنشورة':'Published scope and starting prices'}</small>`;
    const proof=document.createElement('button');proof.type='button';proof.dataset.raeProof='';proof.innerHTML=`<b>${this.arabic?'شاهد عملاً حقيقياً':'Explore real work'}</b><small>${this.arabic?'FakhriMart مع المصادر':'FakhriMart, with sources'}</small>`;
    paths.append(compare,proof);wrap.append(title,copy,guide,paths);this.feed.append(wrap);this.setChips(this.pageInfo?.chips||[]);
  }
  restore(messages=[]){for(const message of messages.slice(-8))this.addMessage(message.role,message.text,{announce:false})}
  resetConversation(){this.feed.replaceChildren();this.streamNode=null;this.lastUserNearBottom=true;this.input.value='';this.resizeComposer();this.renderStarter();this.live.textContent='Chat cleared.'}
  submit(value){const text=clean(value);if(!text||this.generating)return;this.input.value='';this.resizeComposer();this.handlers.onSend?.(text)}
  localizePrompt(label){return this.arabic?(arabicChoices[label]||label):label}
  setChips(items=[]){this.chips.replaceChildren();for(const label of items.slice(0,4)){const button=document.createElement('button');button.type='button';button.className='rae-chip';button.dataset.raePrompt=label;button.textContent=this.localizePrompt(label);this.chips.append(button)}}
  setGuideOptions(items=[]){this.chips.replaceChildren();for(const label of items){const button=document.createElement('button');button.type='button';button.className='rae-chip rae-chip--guide';button.dataset.raeGuideAnswer=label;button.textContent=this.localizePrompt(label);this.chips.append(button)}this.scrollLatest(true)}
  addMessage(role,text,{actions=[],card=null,announce=true,partial=false}={}){
    const article=document.createElement('article');article.className='rae-message';article.dataset.who=role==='user'?'user':'rae';if(partial)article.dataset.partial='true';
    const meta=document.createElement('span');meta.className='rae-message__meta';meta.textContent=role==='user'?(this.arabic?'أنت':'YOU'):'RAE';const bubble=document.createElement('div');bubble.className='rae-message__bubble';bubble.textContent=role==='user'&&this.arabic?(arabicChoices[text]||safeText(text)):safeText(text);article.append(meta,bubble);
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
    if(!card||!['plan','case','project','compare'].includes(card.type))return;const box=document.createElement('section');box.className=`rae-card rae-card--${card.type}`;const eyebrow=document.createElement('span');eyebrow.textContent=card.eyebrow||card.type.toUpperCase();const title=document.createElement('strong');title.textContent=safeText(card.title||'');const copy=document.createElement('p');copy.textContent=safeText(card.copy||'');box.append(eyebrow,title,copy);
    if(card.price){const price=document.createElement('b');price.textContent=safeText(card.price);box.append(price)}
    if(card.type==='compare'){
      const list=document.createElement('div');list.className='rae-compare-list';
      for(const option of (card.options||[]).slice(0,4)){
        const route=['/plans','/ai-workflow-audit','/company-second-brain'].includes(option.route)?option.route:'/plans';
        const button=document.createElement('button');button.type='button';button.dataset.raeAction='navigateToRoute';button.dataset.raeArgs=JSON.stringify({route});
        const name=document.createElement('strong');name.textContent=safeText(option.name);const price=document.createElement('b');price.textContent=safeText(option.price);const detail=document.createElement('small');detail.textContent=safeText(option.detail);button.append(name,price,detail);list.append(button);
      }
      box.append(list);
    }else if(card.type==='project'){
      const area=document.createElement('textarea');area.className='rae-card__brief';area.rows=5;area.value=safeText(card.brief||'');area.setAttribute('aria-label','Editable project brief');box.append(area);
      const handoff=document.createElement('div');handoff.className='rae-card__handoff';
      const chat=document.createElement('button');chat.type='button';chat.className='rae-card__cta';chat.textContent=this.arabic?'تابع عبر واتساب ↗':'Continue on WhatsApp ↗';chat.addEventListener('click',()=>this.handlers.onAction?.('startProject',{brief:area.value},chat));
      const email=document.createElement('button');email.type='button';email.className='rae-card__cta';email.textContent=this.arabic?'أرسل مسودة بالبريد ↗':'Email draft ↗';email.addEventListener('click',()=>this.handlers.onAction?.('emailProject',{brief:area.value},email));
      handoff.append(chat,email);box.append(handoff);
    }
    else if(card.action?.name){const button=document.createElement('button');button.type='button';button.className='rae-card__cta';button.dataset.raeAction=card.action.name;button.dataset.raeArgs=JSON.stringify(card.action.args||{});button.textContent=card.action.label||'View';box.append(button)}article.append(box);
  }
  setGenerating(value,status='THINKING'){this.generating=Boolean(value);this.setStatus(status);this.root.querySelector('[data-rae-send]').hidden=this.generating;this.root.querySelector('[data-rae-stop]').hidden=!this.generating;this.input.disabled=this.generating;this.input.setAttribute('aria-busy',String(this.generating))}
  setStatus(value){const status=String(value||'READY').toUpperCase().slice(0,28);this.status.textContent=this.arabic?({'READY':'جاهزة','LISTENING':'أستمع','THINKING':'أفكر','SPEAKING':'أجيب','OFFLINE':'غير متصلة'}[status]||status):status}
  setStage(title,copy){const titleNode=this.root.querySelector('[data-rae-stage-title]'),copyNode=this.root.querySelector('[data-rae-stage-copy]');if(titleNode)titleNode.textContent=title;if(copyNode)copyNode.textContent=copy}
  scrollLatest(force=false){if(!force&&!this.lastUserNearBottom)return;requestAnimationFrame(()=>{this.feed.scrollTop=this.feed.scrollHeight;this.jump.hidden=true;this.lastUserNearBottom=true})}
  resizeComposer(){this.input.style.height='auto';this.input.style.height=`${Math.min(128,Math.max(42,this.input.scrollHeight))}px`}
  showNudge(text){const node=this.root.querySelector('[data-rae-nudge-copy]');if(node)node.textContent=safeText(text);this.root.classList.add('has-nudge');setTimeout(()=>this.root.classList.remove('has-nudge'),7000)}
  destroy(){clearTimeout(this.focusTimer);clearTimeout(this.focusRecoveryTimer);this.panel.style.removeProperty('transition');this.root.style.removeProperty('bottom');if(this.resizeHandler)removeEventListener('resize',this.resizeHandler);if(this.visualViewportHandler)visualViewport?.removeEventListener('resize',this.visualViewportHandler);document.body.classList.remove('rae-dialog-open');document.documentElement.classList.remove('rae-dialog-open')}
}
