import {RaeDirector,emitRae} from './rae-director.js';
import {RaeChatClient} from './rae-chat-client.js';
import {RaeUI} from './rae-ui.js';
import {RaeActions,safeActionFromPrompt,buildProjectBrief} from './rae-actions.js';
import {RaeSession,RaePageContext,PAGE_INFO,getPageKey} from './rae-context.js';

const clean=value=>String(value??'').trim().replace(/\s+/g,' ');
const isCoarse=()=>matchMedia('(pointer:coarse)').matches;

class RaeApp{
  constructor(root){
    this.root=root;this.pageKey=getPageKey();this.session=new RaeSession();this.pageContext=new RaePageContext(section=>this.onSection(section));this.actions=new RaeActions(this.session);this.client=new RaeChatClient('/api/rae-chat');this.pendingMeta={};this.lastPrompt='';this.firstToken=false;this.guide=null;this.collisionFrame=0;this.collisionObserver=null;this.collisionResizeObserver=null;this.nudgeTimer=0;this.thinkTimer=0;this.slowTimer=0;this.inerted=[];
    const pageInfo={...(PAGE_INFO[this.pageKey]||PAGE_INFO.default)};
    if(this.pageKey==='audit')pageInfo.summary=`A ${window.BRAYRO_MARKET?.price('ai-workflow-audit')||'₹9,999'} workflow audit that maps the current process and prioritises useful AI opportunities.`;
    if(this.pageKey==='brain')pageInfo.summary=`A grounded internal knowledge system starting at ${window.BRAYRO_MARKET?.price('company-second-brain')||'₹29,999'}.`;
    this.ui=new RaeUI(root,{pageInfo,onSend:text=>this.send(text),onStop:()=>this.stop(),onRetry:()=>this.retry(),onAction:(name,args,element)=>this.action(name,args,element),onOpenChange:open=>this.openChanged(open),onFocus:()=>emitRae('rae:user-focus'),onClear:()=>this.clearChat(),onGuideStart:()=>this.beginGuide(),onGuideAnswer:answer=>this.answerGuide(answer),onCompare:()=>this.showComparison(),onProof:()=>this.showProof()});
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
    if(this.guide&&!retry){this.answerGuide(prompt);return}
    if(!retry&&/^compare (the )?(offers|plans)$/i.test(prompt)){this.showComparison();return}
    if(!retry&&/^(show|explore) (real )?work$/i.test(prompt)){this.showProof();return}
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
    this.clearLatencyTimers();if(this.ui.generating)this.client.abort('user');this.session.clear();this.client.lastRequest=null;this.lastPrompt='';this.pendingMeta={};this.firstToken=false;this.guide=null;this.ui.setGenerating(false,navigator.onLine?'READY':'OFFLINE');this.ui.setStage('I’m Rae.','I can explain the site, compare options and think through your project with you.');emitRae(navigator.onLine?'rae:stream-abort':'rae:offline');
  }
  stop(){this.clearLatencyTimers();this.client.abort('user');this.ui.setGenerating(false,'READY');this.ui.markStopped();emitRae('rae:stream-abort')}
  retry(){if(!this.lastPrompt||this.ui.generating)return;this.send(this.lastPrompt,{retry:true})}
  showComparison(){
    if(this.ui.generating)return;
    const price=id=>window.BRAYRO_MARKET?.price(id)||({'monthly-starter':'₹2,599/mo','launch-website':'₹9,999','ai-workflow-audit':'₹9,999','company-second-brain':'₹29,999'})[id];
    const ar=this.ui.arabic;
    this.ui.addMessage('assistant',ar?'هذه أسعار البداية المنشورة. يعتمد الخيار المناسب على حاجتك إلى تطوير مستمر أو موقع متكامل أو نظام ذكاء اصطناعي محدد.':'Here are the published starting points. They serve different kinds of work, so the right fit depends on whether you need ongoing care, a full build, or a focused AI system.',{card:{type:'compare',eyebrow:ar?'BRAYROAI / خريطة الخدمات':'BRAYROAI / OFFER MAP',title:ar?'اختر نوع العمل أولاً.':'Choose the kind of work first.',copy:ar?'الأسعار نقاط بداية منشورة. يُتفق على النطاق النهائي مع ياش.':'Prices shown are published starting points. Final scope is agreed with Yash.',options:ar?[
      {name:'شراكة شهرية للموقع',price:`ابتداءً من ${price('monthly-starter')}`,detail:'تحديثات وتحسينات مستمرة بعد الإطلاق.',route:'/plans'},
      {name:'بناء موقع متكامل',price:`ابتداءً من ${price('launch-website')}`,detail:'موقع محدد النطاق من التخطيط إلى الإطلاق.',route:'/plans'},
      {name:'تدقيق سير العمل',price:price('ai-workflow-audit'),detail:'حدد فرصة مفيدة قبل بناء نظام.',route:'/ai-workflow-audit'},
      {name:'ذاكرة الشركة الذكية',price:`ابتداءً من ${price('company-second-brain')}`,detail:'معرفة معتمدة قابلة للاستخدام من الفريق.',route:'/company-second-brain'}
    ]:[
      {name:'Website partnership',price:`From ${price('monthly-starter')}`,detail:'Ongoing updates and improvement after launch.',route:'/plans'},
      {name:'One-time website build',price:`From ${price('launch-website')}`,detail:'A scoped site from direction through launch.',route:'/plans'},
      {name:'AI Workflow Audit',price:price('ai-workflow-audit'),detail:'Find a useful AI opportunity before a build.',route:'/ai-workflow-audit'},
      {name:'Company Second Brain',price:`From ${price('company-second-brain')}`,detail:'Approved-source knowledge for a team.',route:'/company-second-brain'}
    ]}});
    this.ui.setStage(ar?'مقارنة أوضح.':'A clearer comparison.',ar?'ابدأ بالعمل الذي تحتاجه. سأساعدك في تحويله إلى موجز.':'Start with the work you need. I can help turn it into a brief.');this.ui.setChips(ar?['ما الأنسب لموقع صغير؟','ما هو تدقيق الذكاء الاصطناعي؟','شاهد عملاً حقيقياً']:['What fits a small website?','What is the AI audit?','Show real work']);this.director.trigger('curious');
  }
  showProof(){
    if(this.ui.generating)return;
    const ar=this.ui.arabic;
    this.ui.addMessage('assistant',ar?'FakhriMart مثال منشور لعمل BRAYROAI مع عميل حقيقي. ركز المشروع على تصفح أوضح ومسار استفسار مباشر وتجربة متجاوبة. توضح دراسة الحالة القرارات وتربط بالموقع المباشر.':'FakhriMart is BRAYROAI’s live client example. The work focused on clearer yarn discovery, responsive browsing and a direct enquiry path. The case study explains those choices and links to the live site.',{card:{type:'case',eyebrow:ar?'عميل حقيقي / عمل موثق':'REAL CLIENT / VERIFIED WORK',title:'FakhriMart',copy:ar?'موقع كتالوج للخيوط يركز على التصفح والاستفسار في الهاتف والحاسوب.':'A catalogue-led yarn website built around browsing and enquiry on desktop and mobile.',action:{name:'navigateToRoute',args:{route:'/clients/fakhrimart'},label:ar?'اقرأ دراسة الحالة ↗':'Read the case study ↗'}}});
    this.ui.setStage(ar?'العمل الحقيقي.':'The work, not a claim.',ar?'افتح دراسة الحالة لرؤية الواجهة والقرارات والرابط المباشر.':'Open the case study for the interface, decisions and live link.');this.ui.setChips(ar?['ما الذي تغير في FakhriMart؟','قارن الخدمات','خطط لمشروع مشابه']:['What changed for FakhriMart?','Compare the offers','Plan a similar project']);this.director.trigger('positive');
  }
  beginGuide(){
    if(this.ui.generating)return;
    this.guide={step:0,answers:[]};this.root.dataset.raeGuide='active';this.ui.addMessage('assistant',this.ui.arabic?'لنجهز موجزاً أولياً مفيداً. ثلاثة أسئلة؛ اختر إجابة أو اكتب إجابتك. يعمل هذا الدليل حتى لو لم يتصل الذكاء الاصطناعي.':'Let’s shape a useful first brief. Three questions; you can choose an option or type your own answer. This works even if my AI connection is unavailable.');this.askGuide();emitRae('rae:user-focus');
  }
  askGuide(){
    if(!this.guide)return;
    const steps=[
      {title:'01 / THE WORK',question:'What would you like to make or improve?',options:['A website','A digital product','An internal AI workflow','I’m not sure yet','Cancel']},
      {title:'02 / THE OUTCOME',question:'What should feel easier or work better when this is done?',options:['More qualified enquiries','Clearer product discovery','Less manual work','A stronger first impression','Cancel']},
      {title:'03 / THE TIMING',question:'When would you like to start the conversation?',options:['As soon as possible','This month','Still exploring','Cancel']}
    ];
    const current=steps[this.guide.step];const arabicQuestions=['ما الذي تريد بناءه أو تحسينه؟','ما الذي ينبغي أن يصبح أسهل أو أفضل بعد إنجاز المشروع؟','متى تريد بدء المحادثة؟'];const question=this.ui.arabic?arabicQuestions[this.guide.step]:current.question;this.ui.setStage(this.ui.arabic?`٠${this.guide.step+1} / خطط لمشروعك`:current.title,this.ui.arabic?`${this.guide.step+1} من ٣ · ${question}`:`${this.guide.step+1} of 3 · ${question}`);this.ui.addMessage('assistant',question);this.ui.setGuideOptions(current.options);this.ui.live.textContent=this.ui.arabic?`السؤال ${this.guide.step+1} من ٣.`:`Project guide, question ${this.guide.step+1} of 3.`;
  }
  answerGuide(value){
    if(!this.guide)return;
    const answer=clean(value).slice(0,260);if(!answer)return;
    if(/^cancel$/i.test(answer)){this.guide=null;delete this.root.dataset.raeGuide;this.ui.addMessage('assistant',this.ui.arabic?'لا بأس. يمكنك سؤالي عن أي شيء أو بدء دليل المشروع وقتما تريد.':'No problem. You can ask me anything or restart the project guide whenever you like.');this.ui.setChips(this.ui.pageInfo?.chips||[]);this.ui.setStage(this.ui.arabic?'أنا راي.':'I’m Rae.',this.ui.arabic?'اسأل أو خطط لمشروعك على راحتك.':'Ask a question or plan a project at your own pace.');return}
    this.ui.addMessage('user',answer);this.session.add('user',answer);this.guide.answers.push(answer);this.guide.step++;
    if(this.guide.step<3)this.askGuide();else this.finishGuide();
  }
  finishGuide(){
    const [type,outcome,timeline]=this.guide.answers;const kind=type.toLowerCase(),intent=`${type} ${outcome}`.toLowerCase();
    const price=id=>window.BRAYRO_MARKET?.price(id)||({'company-second-brain':'₹29,999','ai-workflow-audit':'₹9,999','monthly-starter':'₹2,599/month','launch-website':'₹9,999'})[id];
    let option='A short discovery conversation',detail='The project needs a little more definition before choosing a package.',route='/plans';
    if(/product|app|platform/.test(kind)){option='A scoped digital product build';detail='A product needs its flows and functionality defined before a reliable price can be given.'}
    else if(/ai|workflow|automat|manual|knowledge|document/.test(kind)||(/not sure/.test(kind)&&/ai|workflow|automat|manual|knowledge|document/.test(intent))){
      if(/knowledge|document|search|team/.test(intent)){option=`Company Second Brain · from ${price('company-second-brain')}`;detail='This is the listed starting point for an approved-source knowledge system; integrations and access need scoping.';route='/company-second-brain'}
      else{option=`AI Workflow Audit · ${price('ai-workflow-audit')}`;detail='The fixed-scope audit is the smaller starting point for finding a useful AI opportunity before building a system.';route='/ai-workflow-audit'}
    }else if(/website|site|web|brand/.test(kind)||(/not sure/.test(kind)&&/enquir|discovery|brand/.test(intent))){
      if(/existing|ongoing|update|maintain/.test(intent)){option=`Website partnership · from ${price('monthly-starter')}`;detail='Ongoing work fits the published monthly scope; the exact tier depends on how much changes each month.'}
      else{option=`One-time website build · from ${price('launch-website')}`;detail='A focused build is the published entry point. Pages, features and interactions determine the final scope.'}
    }
    const brief=this.ui.arabic?`السوق: الإمارات / AED\nنوع المشروع: ${type}\nالنتيجة المطلوبة: ${outcome}\nالتوقيت: ${timeline}\nنقطة البداية المقترحة: ${option}\n\nاسم الشركة:\nتفاصيل إضافية:`:buildProjectBrief({business:this.session.state.profile?.business,goal:`${type}. Desired outcome: ${outcome}.`,timeline,suggestion:option});
    const arabicOption=option.replace('Company Second Brain','ذاكرة الشركة الذكية').replace('AI Workflow Audit','تدقيق سير العمل بالذكاء الاصطناعي').replace('Website partnership','شراكة شهرية للموقع').replace('One-time website build','بناء موقع متكامل').replace('A scoped digital product build','مشروع منتج رقمي محدد النطاق').replace('A short discovery conversation','محادثة اكتشاف قصيرة').replace('from ','ابتداءً من ');
    const reply=this.ui.arabic?`نقطة بداية مناسبة: ${arabicOption}. هذا إرشاد مبني على الخدمات المنشورة، وليس عرض سعر نهائياً. عدّل الموجز أدناه قبل أن تختار مشاركته مع ياش.`:`Here’s a sensible starting point: ${option}. ${detail} This is guidance from the published offers, not a quote. Edit the brief below before you choose to share it with Yash.`;
    this.session.state.profile={...this.session.state.profile,goal:`${type}. ${outcome}`,timeline};this.session.save();this.session.add('assistant',reply);
    this.ui.addMessage('assistant',reply,{card:{type:'project',eyebrow:this.ui.arabic?'موجز مشروعك':'YOUR PROJECT BRIEF',title:this.ui.arabic?'جاهز لمحادثة حقيقية':'Ready for a real conversation',copy:this.ui.arabic?'أُعدت الإجابات داخل متصفحك. اختر طريقة التواصل فقط عندما تكون جاهزاً.':'The guided questions ran in your browser. Choose a handoff only when you are ready to contact Yash.',brief},actions:[{name:'navigateToRoute',args:{route},label:this.ui.arabic?'قارن الخطط المنشورة':'Compare published plans'}]});
    this.guide=null;delete this.root.dataset.raeGuide;this.ui.setChips(this.ui.arabic?['ما الذي يشمله العرض؟','شاهد أعمالاً ذات صلة','هل يوجد خيار أصغر؟']:['What is included?','Show relevant work','Is there a smaller option?']);this.ui.setStage(this.ui.arabic?'خطوة مفيدة تالية.':'A useful next step.',this.ui.arabic?'يمكنك تعديل الموجز. لم تُرسل أي رسالة إلى ياش.':'The brief is yours to edit. No message has been sent to Yash.');this.director.trigger('positive');
  }
  async action(name,args={},element){
    if(name==='startProject'){
      const brief=clean(args.brief||buildProjectBrief({goal:this.session.state.profile?.goal,business:this.session.state.profile?.business,timeline:this.session.state.profile?.timeline,budget:this.session.state.profile?.budget}));if(!brief)return;const context=`Market: ${window.BRAYRO_MARKET?.id||'India'} / ${window.BRAYRO_MARKET?.currency||'INR'}. Page: ${location.pathname}.\n`;this.session.setRecentAction('startProject:whatsapp');emitRae('rae:tool-success',{name});this.director.trigger('celebrate');window.open(`https://wa.me/919175524637?text=${encodeURIComponent(context+brief)}`,'_blank','noopener,noreferrer');return;
    }
    if(name==='emailProject'){
      const brief=clean(args.brief||buildProjectBrief({goal:this.session.state.profile?.goal,timeline:this.session.state.profile?.timeline}));if(!brief)return;const context=`Market: ${window.BRAYRO_MARKET?.id||'India'} / ${window.BRAYRO_MARKET?.currency||'INR'}. Page: ${location.pathname}.\n`;this.session.setRecentAction('startProject:email');emitRae('rae:tool-success',{name});location.href=`mailto:yashganesh.work@gmail.com?subject=${encodeURIComponent(`BRAYROAI / ${window.BRAYRO_MARKET?.id||'India'} / project brief`)}&body=${encodeURIComponent(context+brief)}`;return;
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
