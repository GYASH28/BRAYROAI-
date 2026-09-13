(() => {
  'use strict';
  if(document.documentElement.dataset.raeMounted)return;
  document.documentElement.dataset.raeMounted='true';

  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
  const path=location.pathname.replace(/\/$/,'')||'/';
  const body=document.body;
  const clean=value=>String(value||'').trim().replace(/\s+/g,' ');
  const pick=list=>list[Math.floor(Math.random()*list.length)];
  const clamp=(min,value,max)=>Math.min(max,Math.max(min,value));
  const store={
    get(key,fallback=null){try{const raw=sessionStorage.getItem(key);return raw===null?fallback:JSON.parse(raw)}catch{return fallback}},
    set(key,value){try{sessionStorage.setItem(key,JSON.stringify(value))}catch{}}
  };

  const page=path==='/'||path.endsWith('/index.html')?'home'
    :path==='/plans'||path.endsWith('/plans.html')?'plans'
    :path==='/clients'?'clients'
    :path==='/clients/fakhrimart'||path.endsWith('/fakhrimart-case-study.html')?'case'
    :path==='/founder'||path.endsWith('/founder.html')?'founder'
    :path==='/terms'||path.endsWith('/terms.html')?'terms'
    :path==='/ai-workflow-audit'||path.endsWith('/ai-workflow-audit.html')?'audit'
    :path==='/company-second-brain'||path.endsWith('/company-second-brain.html')?'brain':'default';
  body.dataset.raePage=['audit','brain'].includes(page)?'ai':page;

  const PAGE_INFO={
    home:{name:'the BRAYROAI homepage',summary:'BRAYROAI makes distinctive websites, digital products and practical AI systems.',chips:['What can you do for me?','Show me real work','Help me choose a plan','Tell me a joke']},
    plans:{name:'the Plans page',summary:'This page compares monthly website partnerships, one-time builds and focused AI systems.',chips:['Pick a plan for me','Cheapest website option','Audit or Second Brain?','What would you choose?']},
    clients:{name:'the Client Archive',summary:'This is BRAYROAI’s verified client-work archive.',chips:['Show me FakhriMart','What changed for the client?','What should I notice?','Start a project']},
    case:{name:'the FakhriMart case study',summary:'This case shows a clearer discovery and enquiry system for a broad yarn/craft catalogue.',chips:['Give me the 20-second version','What did BRAYRO build?','What was the smart part?','Open the live site']},
    founder:{name:'the Founder page',summary:'This page introduces Yash Ganesh and BRAYROAI’s small-studio approach.',chips:['Who is Yash?','Why a small studio?','How does BRAYRO work?','Start a project']},
    terms:{name:'the Terms page',summary:'This page explains commercial terms, scope boundaries and working expectations.',chips:['Give me the human version','What about payments?','What counts as extra?','I have a project question']},
    audit:{name:'the AI Workflow Audit page',summary:'The ₹9,999 audit maps a workflow, finds useful AI opportunities and prioritises what is worth building.',chips:['Explain this simply','Would my business need this?','What do I get?','Audit or Second Brain?']},
    brain:{name:'the Company Second Brain page',summary:'Second Brain starts at ₹29,999 and turns approved company knowledge into grounded internal answers.',chips:['Explain this simply','Would this help my team?','What sources can it use?','Audit or Second Brain?']},
    default:{name:'this BRAYROAI page',summary:'This is part of the BRAYROAI studio website.',chips:['What does BRAYRO do?','Show me work','Help me choose','Contact Yash']}
  };

  const ACTIONS={
    clients:{label:'See client work ↗',href:'/clients'},caseStudy:{label:'Read FakhriMart case ↗',href:'/clients/fakhrimart'},liveFakhri:{label:'Open live FakhriMart ↗',href:'https://fakhriyarns.vercel.app/',external:true},plans:{label:'Open plans ↗',href:'/plans'},audit:{label:'See the AI audit ↗',href:'/ai-workflow-audit'},brain:{label:'See Second Brain ↗',href:'/company-second-brain'},founder:{label:'Meet Yash ↗',href:'/founder'},terms:{label:'Read terms ↗',href:'/terms'},whatsapp:{label:'WhatsApp Yash ↗',href:'https://wa.me/919175524637?text='+encodeURIComponent('Hi Yash, I came from the BRAYROAI website and would like to discuss a project.'),external:true},email:{label:'Email BRAYROAI ↗',href:'mailto:yashganesh.work@gmail.com?subject='+encodeURIComponent('BRAYROAI project enquiry')}
  };

  const BUSINESS_TYPES=[
    ['restaurant',/restaurant|cafe|food|cloud kitchen|bakery|hotel/],['ecommerce',/e-?commerce|online store|shop|retail|fashion|product brand/],['manufacturer',/manufactur|factory|industrial|supplier|wholesale|distributor/],['clinic',/clinic|doctor|dentist|healthcare|hospital|medical/],['school',/school|college|academy|education|coaching|course/],['real estate',/real estate|property|broker|builder|developer/],['consulting',/consult|coach|lawyer|accountant|professional service/],['agency',/agency|studio|marketing|creative|freelance/],['saas',/saas|software|app|startup|platform|tech product/],['local business',/salon|gym|local business|service business/]
  ];

  class Rae{
    constructor(){
      this.root=null;this.panel=null;this.feed=null;this.input=null;this.avatar=null;this.open=false;this.busy=false;this.section='';this.eyeFrame=0;this.idleTimer=0;this.nudgeTimer=0;this.nudgeHideTimer=0;this.collisionTimer=0;this.actionTimer=0;
      this.fallbackCount=Number(store.get('rae:fallback-count',0))||0;
      this.nudgeCount=Number(store.get('rae:nudge-count',0))||0;
      this.messages=store.get('rae:history',[])||[];
      this.profile=store.get('rae:profile',{name:'',business:'',businessType:'',budget:'',goal:'',stage:'',timeline:''})||{};
      this.dialogue=store.get('rae:dialogue',{pending:'',lastIntent:''})||{pending:'',lastIntent:''};
      this.build();this.bind();this.restore();this.observePage();this.scheduleWelcomeNudge();this.scheduleIdle();this.resolveCollisions();
    }

    avatarMarkup(mood='idle'){
      return `<span class="rae-avatar" data-rae-avatar data-mood="${mood}" data-action="idle" aria-hidden="true"><i class="rae-avatar__ear"></i><span class="rae-avatar__head"><span class="rae-avatar__face"><i class="rae-avatar__brow rae-avatar__brow--l"></i><i class="rae-avatar__brow rae-avatar__brow--r"></i><i class="rae-avatar__eye rae-avatar__eye--l"></i><i class="rae-avatar__eye rae-avatar__eye--r"></i><i class="rae-avatar__cheek rae-avatar__cheek--l"></i><i class="rae-avatar__cheek rae-avatar__cheek--r"></i><i class="rae-avatar__mouth"></i></span></span><i class="rae-avatar__hand"></i><i class="rae-avatar__spark"></i></span>`;
    }

    build(){
      const root=document.createElement('section');
      root.className='rae-root';root.dataset.raeRoot='';root.setAttribute('aria-label','Rae, BRAYROAI website friend');
      root.innerHTML=`<button class="rae-presence" type="button" data-rae-toggle aria-expanded="false" aria-controls="rae-panel">${this.avatarMarkup('curious')}<span class="rae-presence__copy"><strong>Rae</strong><small>your tiny smart friend</small></span><i class="rae-presence__ping" aria-hidden="true"></i></button><button class="rae-nudge" data-rae-nudge type="button" aria-label="Open Rae suggestion"><span data-rae-nudge-copy></span><i class="rae-nudge__close" data-rae-nudge-close aria-label="Dismiss Rae suggestion">×</i></button><aside class="rae-panel" id="rae-panel" data-rae-panel aria-hidden="true"><header class="rae-panel__head">${this.avatarMarkup('grin')}<div class="rae-panel__identity"><strong>Rae</strong><span>BRAYRO buddy / local-first brain</span></div><span class="rae-panel__status" data-rae-status>LOCAL BRAIN</span><button class="rae-panel__close" type="button" data-rae-close aria-label="Close Rae">×</button></header><div class="rae-feed" data-rae-feed aria-live="polite" aria-relevant="additions"></div><div class="rae-suggestions" data-rae-suggestions aria-label="Things to ask Rae"></div><form class="rae-composer" data-rae-form><input data-rae-input maxlength="600" autocomplete="off" placeholder="Talk to Rae…" aria-label="Message Rae"><button type="submit" aria-label="Send message to Rae">↗</button></form><span class="rae-panel__foot">Rae answers locally first · Gemini is last resort</span></aside>`;
      body.append(root);this.root=root;this.panel=root.querySelector('[data-rae-panel]');this.feed=root.querySelector('[data-rae-feed]');this.input=root.querySelector('[data-rae-input]');this.avatar=root.querySelector('.rae-presence .rae-avatar');this.paintChips();
    }

    bind(){
      this.root.addEventListener('click',event=>{
        if(event.target.closest('[data-rae-nudge-close]')){event.stopPropagation();this.hideNudge();return}
        if(event.target.closest('[data-rae-nudge]')){this.setOpen(true);return}
        if(event.target.closest('[data-rae-toggle]')){this.setOpen(!this.open);return}
        if(event.target.closest('[data-rae-close]')){this.setOpen(false);return}
        const chip=event.target.closest('[data-rae-prompt]');if(chip){this.setOpen(true);this.submit(chip.dataset.raePrompt)}
      });
      this.root.querySelector('[data-rae-form]').addEventListener('submit',event=>{event.preventDefault();const value=clean(this.input.value);if(value&&!this.busy){this.input.value='';this.submit(value)}});
      this.input.addEventListener('focus',()=>this.mood('curious'));this.input.addEventListener('blur',()=>{if(!this.busy)this.mood('idle')});
      addEventListener('keydown',event=>{if(event.key==='Escape'&&this.open)this.setOpen(false)});addEventListener('resize',()=>this.queueCollisionCheck(),{passive:true});addEventListener('load',()=>this.resolveCollisions(),{once:true});
      if(fine&&!reduced)addEventListener('pointermove',event=>this.trackEyes(event),{passive:true});
    }

    setOpen(open){
      this.open=open;this.root.classList.toggle('is-open',open);this.panel.setAttribute('aria-hidden',String(!open));this.root.querySelector('[data-rae-toggle]').setAttribute('aria-expanded',String(open));this.hideNudge();this.mood(open?'grin':'idle');this.action(open?'hello':'settle',600);this.resolveCollisions();
      if(open){if(!this.feed.children.length)this.firstHello();setTimeout(()=>this.input.focus({preventScroll:true}),100)}
    }

    mood(value){this.root.querySelectorAll('[data-rae-avatar]').forEach(node=>node.dataset.mood=value)}
    action(value,duration=700){if(reduced)return;this.root.querySelectorAll('[data-rae-avatar]').forEach(node=>node.dataset.action=value);clearTimeout(this.actionTimer);this.actionTimer=setTimeout(()=>this.root?.querySelectorAll('[data-rae-avatar]').forEach(node=>node.dataset.action='idle'),duration)}
    react(mood='grin',action='bounce',duration=900){this.mood(mood);this.action(action,duration);setTimeout(()=>{if(!this.busy)this.mood(this.open?'grin':'idle')},duration+80)}

    firstHello(){
      const name=this.profile.name?` ${this.profile.name}`:'';
      const text={home:pick([`Hey${name}. Rae here 👋 Tell me what you’re trying to build and I’ll help, not just point at menus.`,`Yo${name}. Tiny face, big opinions. Website, AI system, client proof, pricing — throw me the messy version.`,`Hey${name}. Think site guide + project buddy + mildly judgemental friend. What are we figuring out?`]),plans:`Okay${name}, pricing page. Give me the actual problem and I’ll tell you which option makes sense — including “don’t buy the bigger one.”`,clients:`Welcome to the proof shelf${name}. I can show you what FakhriMart actually demonstrates.`,case:`You found FakhriMart${name}. Ask me what changed, why it matters, or what BRAYRO would reuse for a business like yours.`,founder:`Yep, that’s Yash${name}. I can give you the human version, minus the “visionary entrepreneur” fog 😄`,terms:`I volunteer as tribute${name}. Give me the scary sentence and I’ll translate it into normal-person English.`,audit:`This is the “where can AI actually help?” product${name}. Tell me one annoying workflow and I’ll reason through it locally first.`,brain:`Company Second Brain sounds dramatic. It’s really controlled company memory with good retrieval. Ask me the practical version${name}.`,default:`Hey${name}, I’m Rae — BRAYRO’s tiny over-informed buddy. What are we solving?`}[page];
      this.add('rae',text,[],false,'grin');
    }

    escape(value){return String(value).replace(/[&<>"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]))}
    paintChips(custom){const host=this.root.querySelector('[data-rae-suggestions]');const chips=(custom?.length?custom:PAGE_INFO[page]?.chips)||PAGE_INFO.default.chips;host.innerHTML=chips.slice(0,4).map(text=>`<button class="rae-chip" type="button" data-rae-prompt="${this.escape(text)}">${this.escape(text)}</button>`).join('')}

    add(who,text,actions=[],persist=true,finalMood='grin'){
      const item=document.createElement('article');item.className='rae-message';item.dataset.who=who;
      const meta=document.createElement('span');meta.className='rae-message__meta';meta.textContent=who==='rae'?'RAE':'YOU';
      const bubble=document.createElement('div');bubble.className='rae-message__bubble';bubble.textContent=text;item.append(meta,bubble);
      if(actions.length){const row=document.createElement('div');row.className='rae-message__actions';for(const action of actions){const link=document.createElement('a');link.className='rae-action';link.textContent=action.label;link.href=action.href;if(action.external){link.target='_blank';link.rel='noreferrer'}row.append(link)}item.append(row)}
      this.feed.append(item);this.feed.scrollTop=this.feed.scrollHeight;
      if(persist){this.messages.push({who,text});this.messages=this.messages.slice(-14);store.set('rae:history',this.messages)}
      if(who==='rae'){this.mood('talking');this.action(finalMood==='excited'?'celebrate':'talk',Math.min(1300,420+text.length*6));setTimeout(()=>{if(!this.busy)this.mood(finalMood)},Math.min(850,280+text.length*3));setTimeout(()=>{if(!this.busy)this.mood(this.open?'grin':'idle')},Math.min(1800,900+text.length*6))}
    }

    restore(){if(this.messages.length)this.messages.slice(-10).forEach(message=>this.add(message.who,message.text,[],false,'idle'))}
    typing(on,label='THINKING LOCALLY'){this.feed.querySelector('[data-rae-typing]')?.remove();if(!on)return;const item=document.createElement('article');item.className='rae-message';item.dataset.who='rae';item.dataset.raeTyping='';item.innerHTML=`<span class="rae-message__meta">RAE / ${label}</span><div class="rae-message__bubble rae-typing"><i></i><i></i><i></i></div>`;this.feed.append(item);this.feed.scrollTop=this.feed.scrollHeight}
    deliver(reply){if(!reply)return;this.dialogue.lastIntent=reply.intent||this.dialogue.lastIntent;if(reply.pending!==undefined)this.dialogue.pending=reply.pending;store.set('rae:dialogue',this.dialogue);if(reply.chips)this.paintChips(reply.chips);setTimeout(()=>this.add('rae',reply.text,reply.actions||[],true,reply.mood||'grin'),reply.delay??Math.min(420,160+Math.random()*170))}

    async submit(text){
      if(this.busy)return;this.captureMemory(text);this.add('user',text);this.react('curious','listen',430);
      const local=this.localReply(text);if(local){this.deliver(local);return}
      const reasoned=this.reasonLocally(text);if(reasoned){this.deliver(reasoned);return}
      if(!this.shouldUseGemini(text)){this.deliver({intent:'boundary',mood:'skeptical',text:pick(["I don’t know that one well enough to fake confidence 😅 I’m strongest on BRAYRO, websites, digital products, AI workflows and project decisions. Give me the version connected to what you’re building.","That’s outside my useful lane. I could bluff and become a premium chatbot immediately, but I’d rather not. Tie it to your business, website, workflow or project and I’ll take another swing.","My local brain just made the Windows error sound. Rephrase it around your business, website, workflow or project and I’ll take another swing."]),chips:['Help me plan my project','What can BRAYRO build?','Show me real work','Contact Yash']});return}
      await this.askGemini(text);
    }

    captureMemory(raw){
      const text=clean(raw),lower=text.toLowerCase();let changed=false;
      const type=BUSINESS_TYPES.find(([,rx])=>rx.test(lower));if(type){this.profile.businessType=type[0];changed=true}
      const name=text.match(/(?:my name is|call me)\s+([A-Z][a-z]{1,20})/);if(name){this.profile.name=name[1];changed=true}
      const business=text.match(/(?:i run|we run|my business is|my company is|i own)\s+([^,.!?]{3,60})/i);if(business){this.profile.business=clean(business[1]);changed=true}
      const budget=text.match(/(?:budget(?: is| around| about| of)?|₹|rs\.?|inr)\s*[:~-]?\s*(?:₹|rs\.?|inr)?\s*([\d,.]+\s*(?:k|thousand|lakh)?)/i);if(budget){this.profile.budget=clean(budget[1]);changed=true}
      if(/more leads|lead generation|enquir|bookings?/.test(lower)){this.profile.goal='more useful enquiries';changed=true}else if(/sell more|sales|conversion|convert/.test(lower)){this.profile.goal='more sales/conversion';changed=true}else if(/automat|save time|repetitive|manual/.test(lower)){this.profile.goal='reduce manual work';changed=true}else if(/knowledge|documents|internal answers|team.*find/.test(lower)){this.profile.goal='make company knowledge easier to use';changed=true}
      if(/existing website|already have.*website|redesign|improve (my|our|the) (site|website)/.test(lower)){this.profile.stage='existing website';changed=true}else if(/new website|from scratch|need (a|new) website/.test(lower)){this.profile.stage='new website';changed=true}
      const timeline=text.match(/(?:in|within|by)\s+(\d+\s*(?:day|week|month)s?)/i);if(timeline){this.profile.timeline=timeline[1];changed=true}
      if(changed)store.set('rae:profile',this.profile);
    }

    localReply(raw){
      const text=clean(raw),lower=text.toLowerCase(),actions=(...keys)=>keys.map(key=>ACTIONS[key]).filter(Boolean),name=this.profile.name?` ${this.profile.name}`:'';
      if(/^(hi|hey|hello|yo|sup|hola|namaste|hii+|heyy+)[!. ]*$/.test(lower))return{intent:'greet',mood:'excited',text:pick([`Hey${name} 👋 What are we solving — website, AI, pricing, or “I’m just snooping”?`,`Yo${name} 😄 Give me the messy version; I’m better at that than polished briefs.`,`Hey${name}. I’m awake and unnecessarily informed. What’s up?`]),chips:['I need a website','I have an AI problem','Show me real work','Just chatting']};
      if(/how are you|you good|what.?s up|wassup/.test(lower))return{intent:'smalltalk',mood:'excited',text:pick(["Pretty good. Zero rent, unlimited page access, emotionally attached to clean navigation. You?","Alive-ish. I’ve been staring at the pricing section for several thousand milliseconds. What are you working on?","Great. People hate forms, vague AI is expensive, and orange is apparently my entire personality."]),chips:['I am building something','Tell me a joke','What can you do?']};
      if(/thank|thanks|thx/.test(lower))return{intent:'thanks',mood:'proud',text:pick(["Anytime 😌 I literally live here.","Got you 🤝 That’s approximately 73% of my job.","No problem. My rent is zero, so I can afford to be helpful."])};
      if(/bye|see you|later|good night/.test(lower))return{intent:'bye',mood:'sleepy',text:pick(["Later 👋 If you get lost, I’ll still be awkwardly floating in the corner.","See you. I’ll guard the pixels.","Bye 😌 I’m going back to pretending I don’t listen to the cursor."])};
      if(/joke|funny|make me laugh/.test(lower))return{intent:'joke',mood:'excited',text:pick(["Agency joke: ‘final_final_v7_REAL.fig’. Terrifying.","I asked Yash for a raise. He reminded me I’m 14 KB of JavaScript.","My biggest fear? Someone saying ‘make the logo bigger’ and meaning it.","I don’t use synergy unless legally required.","Why did the landing page cross the road? Better conversion on the other side. I’m sorry.","Client: ‘tiny change.’ Git diff: 847 lines. Classic."])};
      if(/you.?re (cute|funny|cool|good|smart)|i like you|love you|nice rae/.test(lower))return{intent:'compliment',mood:'shy',text:pick(["Careful. I’ll become unbearable 😌","Okay wow. Compliment accepted and permanently stored in absolutely nowhere.","Thank you. I worked very hard on having two eyes and opinions."]),chips:['What can you do?','Tell me a joke','Help with my project']};
      if(/you.?re (bad|dumb|stupid|annoying)|shut up|hate you/.test(lower))return{intent:'banter',mood:'skeptical',text:pick(["Brutal. Fair. Give me one useful question and let me attempt the redemption arc.","Ouch 😭 Tiny character, full-size emotional damage. What did I get wrong?","That review is going straight on my imaginary Trustpilot. What should I fix?"])};
      if(/who are you|what are you|your name|are you (a )?(bot|ai)|are you real/.test(lower))return{intent:'identity',text:"I’m Rae — BRAYROAI’s website buddy. My useful site/business brain runs locally first, so most conversations never touch Gemini. Gemini only gets called when a genuinely complex business question beats my local reasoning.",chips:['What can you do?','How smart are you?','Help with my project']};
      if(/how smart|what can you do|your skills|capabilities/.test(lower))return{intent:'skills',mood:'proud',text:"I can explain every BRAYRO page, compare plans, reason through common business/site problems, remember your project context for this visit, recommend the smallest sensible scope, show proof, translate terms and navigate you around. Weirdly specific strategy problem? I have one last-resort bigger brain.",chips:['Plan my project','Pick a plan','Show proof','Explain this page']};
      if(/remember me|what do you know about me|what did i tell you/.test(lower)){const bits=[this.profile.name&&`your name is ${this.profile.name}`,this.profile.businessType&&`you’re around a ${this.profile.businessType} business`,this.profile.goal&&`your goal is ${this.profile.goal}`,this.profile.budget&&`you mentioned a budget around ${this.profile.budget}`,this.profile.stage&&`you’re thinking about a ${this.profile.stage}`].filter(Boolean);return{intent:'memory',text:bits.length?`For this browser session, I remember ${bits.join(', ')}. Nothing dramatic — just enough not to ask the same questions like a goldfish.`:"You haven’t given me much project context yet. Tell me what you’re building, the goal and rough budget and I’ll keep it in mind for this visit."}}
      if(/forget|clear.*memory|reset.*context/.test(lower)){this.profile={name:'',business:'',businessType:'',budget:'',goal:'',stage:'',timeline:''};this.dialogue={pending:'',lastIntent:''};store.set('rae:profile',this.profile);store.set('rae:dialogue',this.dialogue);return{intent:'memory-reset',mood:'surprised',text:"Poof. Session project context cleared. We’re strangers again. Slightly dramatic, but effective."}}
      if(/what.*(page|here)|where am i|explain this page/.test(lower))return{intent:'page',text:`You’re on ${PAGE_INFO[page].name}. ${PAGE_INFO[page].summary}`,chips:PAGE_INFO[page].chips};
      if(/what.*brayro|what do you do|services|what can (you|brayro)/.test(lower))return{intent:'services',mood:'proud',text:"BRAYROAI mainly does three things: distinctive websites, digital products, and practical AI systems. Strategy, interface and implementation stay connected instead of being tossed between departments.",actions:actions('clients','plans'),chips:['I need a website','I need AI help','Show me real work']};
      if(/digital product|web app|app design|dashboard|portal|product design/.test(lower))return{intent:'product',text:"For digital products, BRAYRO can shape the workflow, interface and implementation as one system instead of treating UI as decoration. Tell me who uses it and the one job they absolutely need to complete — that’s where I’d start.",actions:actions('whatsapp')};
      if(/real work|client work|portfolio|projects|show.*work|case stud/.test(lower))return{intent:'proof',mood:'proud',text:"Start with FakhriMart. It’s verified client work, not a studio concept: a yarn/craft catalogue turned into a clearer discovery + enquiry experience.",actions:actions('caseStudy','liveFakhri'),chips:['What changed?','What was the smart part?','Could this work for my business?']};
      if(/fakhri|fakhri mart|fakhrimart|yarn/.test(lower))return{intent:'fakhri',mood:'proud',text:"FakhriMart is BRAYROAI’s detailed client case study. A broad craft catalogue was reorganised around discovery, shade/material decisions and enquiry — without faking live stock or prices.",actions:actions('caseStudy','liveFakhri')};
      if(/20.?second|short version|tl.?dr|summar(y|ize).*case/.test(lower)&&page==='case')return{intent:'case-summary',text:"Messy catalogue → clearer categories and product context → project/material discovery → wishlist/recently viewed → quantity-aware WhatsApp enquiry. The goal wasn’t fake ecommerce; it was helping real customers reach a useful conversation faster.",actions:actions('liveFakhri')};
      if(/smart part|why.*good|what.*notice/.test(lower)&&['case','clients'].includes(page))return{intent:'case-insight',text:"The smart part is what it refuses to fake. Stock, shades and quantity pricing stay human-confirmed where the business needs flexibility; the site improves discovery and captures better enquiry context around it. That’s product thinking, not just prettier cards.",actions:actions('caseStudy')};
      if(/who.*yash|founder|yash ganesh/.test(lower))return{intent:'founder',text:"Yash Ganesh leads BRAYROAI’s strategy, interface and implementation. The studio is intentionally small, so the person shaping the idea stays close to the person building it.",actions:actions('founder')};
      if(/why.*small|small studio|small team/.test(lower))return{intent:'studio-size',text:"Small is useful when the work needs tight feedback loops. Fewer hand-offs means the original problem survives from strategy into interface and code. The trade-off is capacity, so scope has to stay deliberate instead of pretending there are 40 invisible people."};
      if(/contact|whatsapp|email|talk to yash|speak to|message/.test(lower))return{intent:'contact',text:"WhatsApp is the quickest route. Email is better for a longer brief. I won’t make you complete a 19-field discovery form first, because I’m not a monster.",actions:actions('whatsapp','email')};
      if(/how long|timeline|how many days|delivery|when can/.test(lower))return{intent:'timeline',text:`Timelines depend on scope, so I won’t invent a magic number.${this.profile.timeline?` You mentioned ${this.profile.timeline}; that target should be checked against the actual scope.`:''} Tell Yash what has to launch first and what can wait.`,actions:actions('whatsapp')};
      if(/cheapest|lowest|starting price|start at|how much|price|pricing|cost/.test(lower)){if(/ai|brain|audit|knowledge/.test(lower))return{intent:'ai-price',text:"For AI: Workflow Audit is ₹9,999, Company Second Brain starts at ₹29,999, and Knowledge Care starts at ₹2,999/month. If the problem is still fuzzy, I’d start with the audit rather than buying a bigger system blind.",actions:actions('audit','brain','plans')};return{intent:'price',text:"Website options currently start at ₹2,599/month for ongoing support, while complete one-time builds start at ₹9,999. The useful question is whether you need a fresh build or continued improvement.",actions:actions('plans'),chips:['I need a new website','I already have a website','I am not sure']}}
      if(/monthly|maintenance|ongoing|₹2,599|2599|3999|5999/.test(lower))return{intent:'monthly',text:"Monthly website partnership starts at ₹2,599/month, with higher levels at ₹3,999 and ₹5,999+. It’s for ongoing updates/refinement — not a disguised full website build.",actions:actions('plans')};
      if(/website|landing page|web design|web development|site/.test(lower)&&/plan|build|need|want|option|package|make|improve/.test(lower))return this.projectRecommendation();
      if(/which plan|help me choose|pick.*plan|recommend.*plan|right for me|what should i choose|not sure.*plan|what would you choose/.test(lower))return this.projectRecommendation();
      if(/workflow audit|ai audit|audit/.test(lower))return{intent:'audit',text:"The AI Workflow Audit is ₹9,999. BRAYRO maps the workflow, finds useful AI/automation opportunities, prioritises them, and gives you a practical recommendation before anyone sells you a giant build.",actions:actions('audit')};
      if(/second brain|company brain|knowledge system|knowledge base/.test(lower))return{intent:'brain',text:"The Company Second Brain starts at ₹29,999. Think approved company sources → organised knowledge layer → grounded answers for the team. Less ‘magic AI’, more ‘where did that document go?’ solved.",actions:actions('brain')};
      if(/audit.*brain|brain.*audit/.test(lower))return{intent:'compare-ai',text:"If you already know the problem is scattered company knowledge and internal answers, Second Brain makes sense. If you’re still asking ‘where would AI even help us?’, start with the ₹9,999 Workflow Audit.",actions:actions('audit','brain')};
      if(/knowledge care|care plan/.test(lower))return{intent:'knowledge-care',text:"Knowledge Care starts at ₹2,999/month. It’s the ongoing layer after an AI knowledge system launches — keeping sources, behaviour and usefulness from slowly turning into soup.",actions:actions('plans')};
      if(/\bai\b|automation|gemini|artificial intelligence/.test(lower)&&lower.split(' ').length<16)return{intent:'ai',text:"BRAYRO’s AI work is deliberately practical: Workflow Audit when the opportunity is unclear, then focused systems like Company Second Brain when there’s a real use case. No robot wallpaper required.",actions:actions('audit','brain')};
      if(/payment|advance|refund|terms|scope|revision|extra work|third.?party/.test(lower))return{intent:'terms',mood:'skeptical',text:"The exact commercial rules live on the Terms page, and project-specific scope should still be confirmed in writing. I can simplify the wording, but for anything contractual the written agreement wins over my tiny face.",actions:actions('terms','whatsapp')};
      if(/simple version|explain.*simply|human version/.test(lower)){if(page==='terms')return{intent:'terms-simple',text:"Human version: agree scope, price and responsibilities in writing; extras are extras; third-party costs stay separate unless included; and both sides need to provide what they promised on time."};if(page==='audit')return{intent:'audit-simple',text:"You show BRAYRO one messy workflow. They map it, spot where AI could genuinely help, rank the ideas, and tell you what’s worth building — if anything."};if(page==='brain')return{intent:'brain-simple',text:"Your approved company docs/data become a controlled knowledge source. Your team asks questions, and the system answers from that material instead of inventing company facts."};return{intent:'simple',text:`Simple version: ${PAGE_INFO[page].summary}`}}
      if(/what.*get|deliverable|included/.test(lower)&&page==='audit')return{intent:'audit-deliverables',text:"The audit includes a workflow map, opportunity shortlist, priority matrix and a 30-minute review. It should leave you with a decision, not a mysterious PDF full of ‘AI transformation’ words.",actions:actions('audit')};
      if(/source|integration|connect/.test(lower)&&page==='brain')return{intent:'brain-sources',text:"Second Brain is built around approved company sources. Exact integrations depend on scope and access — the point is controlled, grounded knowledge rather than dumping everything into one chatbot.",actions:actions('brain')};
      if(/open.*live|live site/.test(lower)&&page==='case')return{intent:'live-case',mood:'excited',text:"Yep — opening the real thing is the best proof anyway.",actions:actions('liveFakhri')};
      if(/start.*project|hire|work with|book|let.?s work/.test(lower))return{intent:'hire',mood:'excited',text:"Nice. Give Yash the problem you want solved, rough timeline and budget range. WhatsApp is fastest — I’ve already made the button because apparently I’m useful now.",actions:actions('whatsapp','email')};
      return null;
    }

    reasonLocally(raw){
      const lower=clean(raw).toLowerCase(),actions=(...keys)=>keys.map(key=>ACTIONS[key]).filter(Boolean),type=this.profile.businessType||BUSINESS_TYPES.find(([,rx])=>rx.test(lower))?.[0]||'';
      const asksHelp=/how (can|could|would)|help (my|our)|improve|what should (i|we)|idea|recommend|better/.test(lower);if(!asksHelp)return null;
      if(type==='restaurant')return{intent:'local-strategy',mood:'proud',text:"For a restaurant, I’d solve the customer journey before adding fancy AI: make menu + trust obvious, make booking/order/WhatsApp frictionless, and capture what the person wants before the chat starts. If repetitive enquiries or staff work are the pain, then an AI Workflow Audit gets interesting.",actions:actions('plans','audit')};
      if(type==='ecommerce')return{intent:'local-strategy',text:"For ecommerce, find where choice gets hard: category discovery, product confidence, mobile checkout/enquiry, or repeat questions. FakhriMart is relevant because it improves discovery without pretending every business needs instant checkout.",actions:actions('caseStudy','plans')};
      if(type==='manufacturer')return{intent:'local-strategy',text:"For a manufacturer/supplier, I’d prioritise trust + product clarity + qualified enquiry. Let buyers understand capability, materials/specs and use cases before WhatsApp or email. If the team keeps answering the same technical questions, audit that workflow next.",actions:actions('plans','audit','brain')};
      if(type==='clinic')return{intent:'local-strategy',text:"For a clinic, the website job is usually trust + clear services + low-friction appointment intent. Keep claims careful, make location/contact obvious, and reduce repetitive front-desk questions. AI comes after the patient journey is clean.",actions:actions('plans','audit')};
      if(type==='school')return{intent:'local-strategy',text:"For education, split discovery from operations: students/parents need clear programmes, proof and enquiry; staff may need faster access to repeated internal information. Website first for the public journey, Workflow Audit if the messy bit is internal.",actions:actions('plans','audit')};
      if(type==='real estate')return{intent:'local-strategy',text:"For real estate, optimise for qualified intent: property clarity, proof, location/context, then an enquiry that captures budget + property type instead of just ‘Hi’. The site should help the sales conversation start halfway informed.",actions:actions('plans')};
      if(type==='consulting'||type==='agency'||type==='local business')return{intent:'local-strategy',text:"For a service business, make three things brutally clear: who you help, what problem you solve, and proof you can do it. Then make the CTA capture enough context for a useful conversation instead of dumping everyone into a generic form.",actions:actions('plans','clients')};
      if(type==='saas')return{intent:'local-strategy',text:"For SaaS, treat the site like a product surface: communicate the job-to-be-done fast, show the workflow visually, remove setup uncertainty, and drive one primary activation step. If the product itself is still fuzzy, product design matters more than a marketing-page makeover.",actions:actions('plans','whatsapp')};
      if(/lead|sales|enquir|convert/.test(lower))return{intent:'local-strategy',text:"For better leads, I’d check four things before any fancy model: who the page is for, whether the offer is obvious, whether proof appears before the ask, and whether the CTA captures useful context. More traffic into a vague journey just creates more vague leads.",actions:actions('clients','plans')};
      if(/automat|workflow|manual|repetitive|operations|process/.test(lower))return{intent:'local-strategy',text:"For automation, start with trigger → decisions → data needed → human exceptions → output. If that map is messy, the ₹9,999 Workflow Audit is literally for deciding what should be automated and what should stay human.",actions:actions('audit')};
      if(/knowledge|team|documents|internal/.test(lower))return{intent:'local-strategy',text:"If people keep hunting through company knowledge, separate source quality from answer quality first: approved sources, access, update frequency and common questions. If that’s clear, Second Brain fits; if not, audit first.",actions:actions('audit','brain')};
      if(/website|site|landing/.test(lower)||this.profile.goal||this.profile.businessType)return this.projectRecommendation();
      return null;
    }

    projectRecommendation(){
      const actions=(...keys)=>keys.map(key=>ACTIONS[key]).filter(Boolean),{stage,goal,budget,businessType}=this.profile;
      if(goal==='reduce manual work')return{intent:'recommend',mood:'proud',text:`Your problem sounds more operational than visual${businessType?` for a ${businessType} business`:''}. I’d start with the ₹9,999 Workflow Audit, map the repetitive process, then only build automation that survives the map.`,actions:actions('audit')};
      if(goal==='make company knowledge easier to use')return{intent:'recommend',text:"That points toward Company Second Brain — but only if approved sources and main questions are already reasonably clear. If they aren’t, audit first so you don’t build an expensive search box around a messy knowledge problem.",actions:actions('audit','brain')};
      if(stage==='existing website')return{intent:'recommend',text:`Since you already have a site${goal?` and want ${goal}`:''}, I would not jump straight to a full rebuild. Start by identifying what is failing in the current journey; ongoing website partnership starts at ₹2,599/month if the job is iterative improvement.`,actions:actions('plans','whatsapp')};
      if(stage==='new website')return{intent:'recommend',text:`For a new site${businessType?` for your ${businessType} business`:''}, the one-time route makes more sense. Complete builds start at ₹9,999. I’d scope the smallest version that proves the customer journey first, then expand instead of buying every page on day one.`,actions:actions('plans','whatsapp')};
      if(budget)return{intent:'recommend',text:`You mentioned a budget around ${budget}. Choose by job first: new build → one-time options from ₹9,999; existing site needing regular improvement → monthly from ₹2,599. Tell me which situation you’re in and I’ll narrow it further.`,actions:actions('plans')};
      return{intent:'recommend',mood:'curious',text:"I can pick, but give me two things first: are we fixing/building a website or a business workflow, and what result matters most — enquiries, sales, trust, less manual work, or faster internal answers?",chips:['New website','Improve existing site','Less manual work','Internal knowledge']};
    }

    shouldUseGemini(text){
      if(this.fallbackCount>=2)return false;
      const lower=clean(text).toLowerCase(),words=lower.split(' ').filter(Boolean).length;
      const business=/business|company|customer|sales|lead|workflow|operations|process|website|product|strategy|automation|team|service|marketing|conversion/.test(lower);
      const genuinelyComplex=/compare|trade.?off|prioriti|roadmap|strategy|diagnose|why.*not|architecture|step by step|what would you do if|specific plan|multiple/.test(lower);
      const genericWorldQuestion=/weather|capital of|history of|president|sports|football match|recipe|homework|medical|legal advice/.test(lower);
      return !genericWorldQuestion&&business&&genuinelyComplex&&words>=14;
    }

    async askGemini(text){
      this.busy=true;this.mood('thinking');this.action('think',1800);this.typing(true,'THINKING HARDER');this.setStatus('BORROWING BIG BRAIN');
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),9000);
      try{
        const history=this.messages.slice(-6).map(message=>({role:message.who==='rae'?'model':'user',text:message.text}));
        const response=await fetch('/api/rae',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:text,page,section:this.section,history,profile:this.profile}),signal:controller.signal});
        const data=await response.json().catch(()=>({}));if(!response.ok||!data.reply)throw new Error(data.error||'fallback unavailable');
        this.fallbackCount+=1;store.set('rae:fallback-count',this.fallbackCount);this.typing(false);this.busy=false;this.setStatus('LOCAL BRAIN');this.add('rae',this.polishRemote(data.reply),[ACTIONS.whatsapp],true,'proud');
      }catch(error){this.typing(false);this.busy=false;this.setStatus('LOCAL BRAIN');this.mood('surprised');this.action('oops',850);this.add('rae',"My bigger brain is taking a tea break 😭 I’m still here though. Give me the simpler version of the problem and I’ll reason through it locally, or ask Yash directly.",[ACTIONS.whatsapp],true,'surprised')}finally{clearTimeout(timer)}
    }

    polishRemote(reply){return clean(reply).replace(/^(as an ai|as a language model|certainly|of course)[,:.!\s-]*/i,'').replace(/I would be happy to assist/gi,'I can help').replace(/based on your query/gi,'from what you described').slice(0,1200)}
    setStatus(text){const node=this.root.querySelector('[data-rae-status]');if(node)node.textContent=text}

    observePage(){
      if(!('IntersectionObserver'in window))return;
      const nodes=[...document.querySelectorAll('[data-scene],[data-plan-scene],[data-founder-scene],.terms-section,.case-section,.client-work-section,main>section')].filter((node,index,array)=>array.indexOf(node)===index);if(!nodes.length)return;
      const observer=new IntersectionObserver(entries=>{const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!visible)return;const next=visible.target.id||visible.target.dataset.scene||visible.target.dataset.planScene||visible.target.dataset.founderScene||'';if(next&&next!==this.section){this.section=next;this.onSection(next)}},{threshold:[.24,.48,.7],rootMargin:'-16% 0px -28% 0px'});nodes.forEach(node=>observer.observe(node));
    }

    onSection(section){
      if(this.open||this.nudgeCount>=3)return;
      const nudges={work:["Real client work. Finally, a section where I’m allowed to say ‘proof’ without being annoying.","Want the FakhriMart decisions, not just the screenshots?"],plans:["Pricing detected. I can save you from comparing every card like it’s a phone plan.","You do not need to memorise these prices. That’s literally why I’m here 😌"],'ai-systems':["AI without glowing robot wallpaper. Rare sighting. Give me your messy workflow and I’ll tell you which product fits.","If you’re wondering ‘do I even need AI?’ — good. That is a healthier starting question."],founder:["Yep, that’s Yash. No mysterious 40-person ‘team’ hiding off-camera 😄"],services:["This is where I’m supposed to say ‘end-to-end solutions’. I refuse. Tell me what you actually need."],contact:["You made it to contact. I can either call that commitment or very determined scrolling."]};
      const list=nudges[section];if(list)setTimeout(()=>{if(this.section===section&&!this.open)this.showNudge(pick(list),`section:${section}`)},2200);
    }

    scheduleWelcomeNudge(){
      if(this.nudgeCount>=3)return;clearTimeout(this.nudgeTimer);this.nudgeTimer=setTimeout(()=>{if(this.open)return;const text={home:"Psst. Tell me what you’re building. I can choose a route without making you read the entire site 😌",plans:"Too many numbers? Give me the job, not the package name. I’ll narrow it down.",clients:"This is the proof shelf. Ask me what FakhriMart actually proves.",case:"Short version: messy catalogue → clearer discovery → better enquiry flow. I can explain the decisions.",founder:"I can give you the non-LinkedIn version of this page 😄",terms:"I can translate the important bits into human. No ‘hereinafter’, promise.",audit:"Tell me one annoying repetitive workflow. I’ll tell you whether this audit even makes sense.",brain:"Ask me when a Second Brain is useful — and when it’s overkill."}[page]||"Need a shortcut? I know this site suspiciously well.";this.showNudge(text,`welcome:${page}`)},13000);
    }

    showNudge(text,key){if(this.open||this.nudgeCount>=3)return;const seen=store.get('rae:nudges-seen',[])||[];if(seen.includes(key))return;seen.push(key);store.set('rae:nudges-seen',seen.slice(-24));this.nudgeCount+=1;store.set('rae:nudge-count',this.nudgeCount);this.root.querySelector('[data-rae-nudge-copy]').innerHTML=`<strong>Rae:</strong> ${this.escape(text)}`;this.root.classList.add('has-nudge');this.react('curious','peek',1000);clearTimeout(this.nudgeHideTimer);this.nudgeHideTimer=setTimeout(()=>this.hideNudge(),9000)}
    hideNudge(){clearTimeout(this.nudgeHideTimer);this.root.classList.remove('has-nudge');if(!this.open)this.mood('idle')}

    scheduleIdle(){if(reduced)return;clearTimeout(this.idleTimer);this.idleTimer=setTimeout(()=>{if(!this.busy&&!this.open&&!this.root.matches(':hover')){const behavior=pick([{m:'wink',a:'blink'},{m:'curious',a:'peek'},{m:'idle',a:'bob'},{m:'sleepy',a:'doze'}]);this.react(behavior.m,behavior.a,700)}this.scheduleIdle()},7000+Math.random()*6500)}

    trackEyes(event){if(this.eyeFrame)return;this.eyeFrame=requestAnimationFrame(()=>{this.eyeFrame=0;if(!this.avatar)return;const rect=this.avatar.getBoundingClientRect(),nx=clamp(-1,(event.clientX-(rect.left+rect.width/2))/(innerWidth*.38),1),ny=clamp(-1,(event.clientY-(rect.top+rect.height/2))/(innerHeight*.38),1);this.root.style.setProperty('--rae-eye-x',`${(nx*1.55).toFixed(2)}px`);this.root.style.setProperty('--rae-eye-y',`${(ny*1.05).toFixed(2)}px`)})}

    queueCollisionCheck(){clearTimeout(this.collisionTimer);this.collisionTimer=setTimeout(()=>this.resolveCollisions(),120)}
    resolveCollisions(){
      if(!this.root)return;let lift=0;const candidates=[...new Set([...document.querySelectorAll('body > *,.whatsapp-float,.floating-whatsapp,[data-floating],[data-chat-launcher],[aria-label*="WhatsApp" i]')])];
      for(const node of candidates){if(node===this.root||this.root.contains(node)||!node.isConnected)continue;const style=getComputedStyle(node);if(style.position!=='fixed'||style.visibility==='hidden'||style.display==='none'||Number(style.opacity)===0)continue;const rect=node.getBoundingClientRect();if(!rect.width||!rect.height||rect.width>340||rect.height>220)continue;if(rect.right>innerWidth-320&&rect.bottom>innerHeight-190)lift=Math.max(lift,Math.min(150,innerHeight-rect.top+10))}
      this.root.style.setProperty('--rae-collision-lift',`${lift}px`);this.root.classList.toggle('is-lifted',lift>0);
    }
  }

  const mount=()=>new Rae();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
