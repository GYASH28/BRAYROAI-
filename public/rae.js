(() => {
  'use strict';
  if (document.documentElement.dataset.raeMounted) return;
  document.documentElement.dataset.raeMounted = 'true';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const path = location.pathname.replace(/\/$/,'') || '/';
  const body = document.body;
  const clamp = (min,value,max) => Math.min(max,Math.max(min,value));
  const safeStore = {
    get(key,fallback=null){try{const value=sessionStorage.getItem(key);return value===null?fallback:JSON.parse(value)}catch{return fallback}},
    set(key,value){try{sessionStorage.setItem(key,JSON.stringify(value))}catch{}}
  };

  const page = (() => {
    if (path === '/' || path.endsWith('/index.html')) return 'home';
    if (path === '/plans' || path.endsWith('/plans.html')) return 'plans';
    if (path === '/clients') return 'clients';
    if (path === '/clients/fakhrimart' || path.endsWith('/fakhrimart-case-study.html')) return 'case';
    if (path === '/founder' || path.endsWith('/founder.html')) return 'founder';
    if (path === '/terms' || path.endsWith('/terms.html')) return 'terms';
    if (path === '/ai-workflow-audit' || path.endsWith('/ai-workflow-audit.html')) return 'audit';
    if (path === '/company-second-brain' || path.endsWith('/company-second-brain.html')) return 'brain';
    return 'default';
  })();
  const visualPage = ['audit','brain'].includes(page) ? 'ai' : page;
  body.dataset.raePage = visualPage;

  const PAGE_INFO = {
    home:{name:'the BRAYROAI homepage',summary:'BRAYROAI makes distinctive websites, digital products and practical AI systems. The homepage shows capabilities, process, client work, AI offers, pricing, founder and contact.',chips:['What does BRAYRO do?','Show me real work','Help me choose a plan']},
    plans:{name:'the Plans page',summary:'This page compares monthly website partnerships, one-time website builds and focused AI systems.',chips:['Which plan fits me?','Cheapest website option','Explain the AI plans']},
    clients:{name:'the Client Archive',summary:'This is BRAYROAI’s client-work archive. FakhriMart is the current detailed verified client case study.',chips:['Show me FakhriMart','What changed for the client?','Start a project']},
    case:{name:'the FakhriMart case study',summary:'This case study explains how a broad yarn and craft catalogue became a clearer product-discovery and enquiry experience without pretending stock or prices were known.',chips:['Give me the 20-second version','What did BRAYRO build?','Open the live site']},
    founder:{name:'the Founder page',summary:'This page introduces Yash Ganesh and the way BRAYROAI keeps strategy, design and implementation close together.',chips:['Who is Yash?','How does BRAYRO work?','Start a project']},
    terms:{name:'the Terms page',summary:'This page explains BRAYROAI’s commercial terms, scope boundaries and working expectations.',chips:['Give me the simple version','What about payments?','I have a project question']},
    audit:{name:'the AI Workflow Audit page',summary:'The ₹9,999 AI Workflow Audit maps a workflow, identifies useful opportunities and ends with a prioritised recommendation instead of jumping straight into a build.',chips:['Explain this simply','What do I get?','Is this right for me?']},
    brain:{name:'the Company Second Brain page',summary:'The Company Second Brain starts from ₹29,999 and connects approved company knowledge into a searchable, grounded internal answer system.',chips:['Explain this simply','What sources can it use?','Audit or Second Brain?']},
    default:{name:'this BRAYROAI page',summary:'This is part of the BRAYROAI studio website.',chips:['What does BRAYRO do?','Show me work','Contact Yash']}
  };

  const ACTIONS = {
    clients:{label:'See client work ↗',href:'/clients'},
    caseStudy:{label:'Read FakhriMart case ↗',href:'/clients/fakhrimart'},
    liveFakhri:{label:'Open live FakhriMart ↗',href:'https://fakhriyarns.vercel.app/',external:true},
    plans:{label:'Open plans ↗',href:'/plans'},
    audit:{label:'See the AI audit ↗',href:'/ai-workflow-audit'},
    brain:{label:'See Second Brain ↗',href:'/company-second-brain'},
    founder:{label:'Meet Yash ↗',href:'/founder'},
    whatsapp:{label:'WhatsApp Yash ↗',href:'https://wa.me/919175524637?text='+encodeURIComponent('Hi Yash, I came from the BRAYROAI website and would like to discuss a project.'),external:true},
    email:{label:'Email BRAYROAI ↗',href:'mailto:yashganesh.work@gmail.com?subject='+encodeURIComponent('BRAYROAI project enquiry')}
  };

  const pick = list => list[Math.floor(Math.random()*list.length)];
  const clean = text => String(text||'').trim().replace(/\s+/g,' ');
  const has = (text,pattern) => pattern.test(text.toLowerCase());

  class Rae {
    constructor(){
      this.root = null;
      this.panel = null;
      this.feed = null;
      this.input = null;
      this.avatar = null;
      this.open = false;
      this.busy = false;
      this.section = '';
      this.nudgeTimer = 0;
      this.nudgeHideTimer = 0;
      this.eyeFrame = 0;
      this.fallbackCount = Number(safeStore.get('rae:fallback-count',0)) || 0;
      this.nudgeCount = Number(safeStore.get('rae:nudge-count',0)) || 0;
      this.messages = safeStore.get('rae:history',[]) || [];
      this.build();
      this.bind();
      this.restore();
      this.observePage();
      this.scheduleWelcomeNudge();
    }

    build(){
      const root=document.createElement('section');
      root.className='rae-root';
      root.dataset.raeRoot='';
      root.setAttribute('aria-label','Rae, BRAYROAI website guide');
      root.innerHTML=`
        <button class="rae-presence" type="button" data-rae-toggle aria-expanded="false" aria-controls="rae-panel">
          ${this.avatarMarkup('curious')}
          <span class="rae-presence__copy"><strong>Rae</strong><small>your BRAYRO guide</small></span>
          <i class="rae-presence__ping" aria-hidden="true"></i>
        </button>
        <div class="rae-nudge" data-rae-nudge role="status" aria-live="polite"><span data-rae-nudge-copy></span><button class="rae-nudge__close" type="button" data-rae-nudge-close aria-label="Dismiss Rae suggestion">×</button></div>
        <aside class="rae-panel" id="rae-panel" data-rae-panel aria-hidden="true">
          <header class="rae-panel__head">
            ${this.avatarMarkup('grin')}
            <div class="rae-panel__identity"><strong>Rae</strong><span>site friend / mostly local brain</span></div>
            <button class="rae-panel__close" type="button" data-rae-close aria-label="Close Rae">×</button>
          </header>
          <div class="rae-feed" data-rae-feed aria-live="polite" aria-relevant="additions"></div>
          <div class="rae-suggestions" data-rae-suggestions aria-label="Things to ask Rae"></div>
          <form class="rae-composer" data-rae-form>
            <input data-rae-input maxlength="600" autocomplete="off" placeholder="Ask Rae something…" aria-label="Message Rae">
            <button type="submit" aria-label="Send message to Rae">↗</button>
          </form>
          <span class="rae-panel__foot">deep answers may use Gemini</span>
        </aside>`;
      body.append(root);
      this.root=root;
      this.panel=root.querySelector('[data-rae-panel]');
      this.feed=root.querySelector('[data-rae-feed]');
      this.input=root.querySelector('[data-rae-input]');
      this.avatar=root.querySelector('.rae-presence .rae-avatar');
      this.paintChips();
    }

    avatarMarkup(mood='idle'){
      return `<span class="rae-avatar" data-rae-avatar data-mood="${mood}" aria-hidden="true"><i class="rae-avatar__ear"></i><span class="rae-avatar__head"><span class="rae-avatar__face"><i class="rae-avatar__eye rae-avatar__eye--l"></i><i class="rae-avatar__eye rae-avatar__eye--r"></i><i class="rae-avatar__mouth"></i></span></span><i class="rae-avatar__spark"></i></span>`;
    }

    bind(){
      this.root.addEventListener('click',event=>{
        const toggle=event.target.closest('[data-rae-toggle]');
        if(toggle){this.setOpen(!this.open);return}
        if(event.target.closest('[data-rae-close]')){this.setOpen(false);return}
        if(event.target.closest('[data-rae-nudge-close]')){this.hideNudge();return}
        const chip=event.target.closest('[data-rae-prompt]');
        if(chip){this.setOpen(true);this.submit(chip.dataset.raePrompt);return}
      });
      this.root.querySelector('[data-rae-form]').addEventListener('submit',event=>{
        event.preventDefault();
        const value=clean(this.input.value);
        if(!value||this.busy)return;
        this.input.value='';
        this.submit(value);
      });
      this.input.addEventListener('focus',()=>this.mood('curious'));
      this.input.addEventListener('blur',()=>{if(!this.busy)this.mood('idle')});
      addEventListener('keydown',event=>{if(event.key==='Escape'&&this.open)this.setOpen(false)});
      if(fine&&!reduced){
        this.root.addEventListener('pointermove',event=>this.trackEyes(event),{passive:true});
        this.root.addEventListener('pointerleave',()=>this.resetEyes(),{passive:true});
      }
    }

    setOpen(open){
      this.open=open;
      this.root.classList.toggle('is-open',open);
      this.panel.setAttribute('aria-hidden',String(!open));
      this.root.querySelector('[data-rae-toggle]').setAttribute('aria-expanded',String(open));
      this.hideNudge();
      this.mood(open?'grin':'idle');
      if(open){
        if(!this.feed.children.length)this.firstHello();
        setTimeout(()=>this.input.focus({preventScroll:true}),80);
      }
    }

    mood(mood){
      this.root.querySelectorAll('[data-rae-avatar]').forEach(node=>node.dataset.mood=mood);
    }

    firstHello(){
      const hello={
        home:pick(["Hey. I’m Rae 👋 I know this site so you don’t have to scroll like it’s a final exam.","Hi, I’m Rae. Tiny face, suspiciously good knowledge of this website.","Yo. Rae here. I can explain BRAYRO without making you read agency poetry for six minutes."]),
        plans:"Oh good, the pricing page. Where numbers breed tabs. Tell me what you actually need and I’ll narrow it down.",
        clients:"Welcome to the proof shelf. I can show you the real client work without the dramatic case-study voiceover.",
        case:"You found FakhriMart. I can give you the useful version of this case study in about 20 seconds.",
        founder:"Yep, that’s Yash. I can give you the non-LinkedIn version of who he is 😄",
        terms:"I volunteer as tribute. Ask me to translate the useful parts of this page into normal human language.",
        audit:"This is the ‘where can AI actually help?’ product. Much less dramatic than building Skynet.",
        brain:"Think searchable company memory, not a glowing brain in a jar. I can explain it simply.",
        default:"Hey, I’m Rae — your slightly over-informed BRAYRO guide. Ask away."
      }[page]||"Hey, I’m Rae. Ask me anything about BRAYROAI.";
      this.add('rae',hello,[],false);
    }

    paintChips(){
      const host=this.root.querySelector('[data-rae-suggestions]');
      const chips=PAGE_INFO[page]?.chips||PAGE_INFO.default.chips;
      host.innerHTML=chips.map(text=>`<button class="rae-chip" type="button" data-rae-prompt="${this.escape(text)}">${this.escape(text)}</button>`).join('');
    }

    escape(value){
      return String(value).replace(/[&<>"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));
    }

    add(who,text,actions=[],persist=true){
      const item=document.createElement('article');
      item.className='rae-message';
      item.dataset.who=who;
      const meta=document.createElement('span');
      meta.className='rae-message__meta';
      meta.textContent=who==='rae'?'RAE':'YOU';
      const bubble=document.createElement('div');
      bubble.className='rae-message__bubble';
      bubble.textContent=text;
      item.append(meta,bubble);
      if(actions?.length){
        const actionRow=document.createElement('div');
        actionRow.className='rae-message__actions';
        actions.forEach(action=>{
          const a=document.createElement('a');
          a.className='rae-action';a.textContent=action.label;a.href=action.href;
          if(action.external){a.target='_blank';a.rel='noreferrer'}
          actionRow.append(a);
        });
        item.append(actionRow);
      }
      this.feed.append(item);
      this.feed.scrollTop=this.feed.scrollHeight;
      if(persist){
        this.messages.push({who,text});
        this.messages=this.messages.slice(-10);
        safeStore.set('rae:history',this.messages);
      }
      if(who==='rae'){
        this.mood('talking');
        setTimeout(()=>{if(!this.busy)this.mood('grin')},Math.min(1200,360+text.length*8));
      }
    }

    restore(){
      if(!this.messages.length)return;
      this.messages.slice(-8).forEach(message=>this.add(message.who,message.text,[],false));
    }

    typing(on){
      this.feed.querySelector('[data-rae-typing]')?.remove();
      if(!on)return;
      const item=document.createElement('article');
      item.className='rae-message';item.dataset.who='rae';item.dataset.raeTyping='';
      item.innerHTML='<span class="rae-message__meta">RAE / THINKING</span><div class="rae-message__bubble rae-typing"><i></i><i></i><i></i></div>';
      this.feed.append(item);this.feed.scrollTop=this.feed.scrollHeight;
    }

    async submit(text){
      if(this.busy)return;
      this.add('user',text);
      const local=this.localReply(text);
      if(local){
        setTimeout(()=>this.add('rae',local.text,local.actions||[]),local.delay??180);
        return;
      }
      if(!this.shouldUseGemini(text)){
        setTimeout(()=>this.add('rae',pick([
          "That one’s outside my tiny website brain 😅 Ask me about BRAYRO’s work, prices, AI stuff, Yash, or where to go next.",
          "I could pretend I know that and become a proper chatbot… but no. 😌 Try me on BRAYRO, pricing, projects, AI systems or contact stuff.",
          "My local brain just made the Windows error sound. I’m best at this website, projects, pricing and BRAYROAI stuff."
        ]),[ACTIONS.whatsapp]),220);
        return;
      }
      await this.askGemini(text);
    }

    localReply(raw){
      const text=clean(raw);
      const lower=text.toLowerCase();
      const action=(...keys)=>keys.map(key=>ACTIONS[key]).filter(Boolean);

      if(/^(hi|hey|hello|yo|sup|hola|namaste|hii+|heyy+)[!. ]*$/.test(lower))return{text:pick(["Hey 👋 What are we looking for — work, prices, AI, or the secret fourth option: ‘I’m just snooping’ 😌","Yo 😄 I’m Rae. Ask me the website stuff so you don’t have to hunt for it.","Hey! I’m awake. Barely. What do you want to know?"])};
      if(/thank|thanks|thx/.test(lower))return{text:pick(["Anytime 😌 I literally live here.","Got you 🤝 That’s approximately 73% of my job.","No problem. My rent is zero, so I can afford to be helpful."])};
      if(/bye|see you|later/.test(lower))return{text:"Later 👋 If you get lost, I’ll still be awkwardly floating in the corner."};
      if(/joke|funny|make me laugh/.test(lower))return{text:pick(["Agency joke: ‘final_final_v7_REAL.fig’. Terrifying.","I asked Yash for a raise. He reminded me I’m 14 KB of JavaScript.","My biggest fear? Someone saying ‘make the logo bigger’ and meaning it.","I don’t use synergy unless legally required."])};
      if(/who are you|what are you|your name|are you (a )?(bot|ai)/.test(lower))return{text:"I’m Rae — BRAYROAI’s site friend. Most of me runs locally, so I answer website stuff without waking an AI model. I only borrow Gemini when your question genuinely needs deeper thinking."};
      if(/what.*(page|here)|where am i|explain this page/.test(lower))return{text:`You’re on ${PAGE_INFO[page].name}. ${PAGE_INFO[page].summary}`};
      if(/what.*brayro|what do you do|services|what can (you|brayro)/.test(lower))return{text:"BRAYROAI mainly does three things: distinctive websites, digital products, and practical AI systems. Strategy, interface and implementation stay connected instead of being tossed between departments.",actions:action('clients','plans')};
      if(/real work|client work|portfolio|projects|show.*work|case stud/.test(lower))return{text:"Start with FakhriMart. It’s verified client work, not a studio concept: a yarn/craft catalogue turned into a clearer discovery + enquiry experience.",actions:action('caseStudy','liveFakhri')};
      if(/fakhri|fakhri mart|fakhrimart|yarn/.test(lower))return{text:"FakhriMart is BRAYROAI’s detailed client case study. The useful bit: a broad craft catalogue was reorganised around discovery, shade/material decisions and enquiry — without faking live stock or prices.",actions:action('caseStudy','liveFakhri')};
      if(/20.?second|short version|tl.?dr|summar(y|ize).*case/.test(lower)&&page==='case')return{text:"Messy catalogue → clearer categories and product context → project/material discovery → wishlist/recently viewed → quantity-aware WhatsApp enquiry. The goal wasn’t fake ecommerce; it was helping real customers reach a useful conversation faster.",actions:action('liveFakhri')};
      if(/who.*yash|founder|yash ganesh/.test(lower))return{text:"Yash Ganesh leads BRAYROAI’s strategy, interface and implementation. The studio is intentionally small, so the person shaping the idea stays close to the person building it.",actions:action('founder')};
      if(/contact|whatsapp|email|talk to yash|speak to|message/.test(lower))return{text:"WhatsApp is the quickest route. You can also email if you’ve got a longer brief. I won’t make you fill a 19-field ‘discovery form’, promise.",actions:action('whatsapp','email')};
      if(/how long|timeline|how many days|delivery/.test(lower))return{text:"Timelines depend on scope, so I won’t invent a magic number. The best move is to tell Yash what you need and your target launch date; he can scope the smallest sensible build.",actions:action('whatsapp')};
      if(/cheapest|lowest|budget|starting price|start at|how much|price|pricing|cost/.test(lower)){
        if(/ai|brain|audit/.test(lower))return{text:"For AI: the Workflow Audit is ₹9,999, Company Second Brain starts at ₹29,999, and Knowledge Care starts at ₹2,999/month. The audit is usually the sensible first step if the problem isn’t fully defined yet.",actions:action('audit','brain','plans')};
        return{text:"Website options currently start at ₹2,599/month for ongoing support, while complete one-time builds start at ₹9,999. The bigger question is whether you need ongoing care or a fresh build.",actions:action('plans')};
      }
      if(/monthly|maintenance|ongoing|₹2,599|2599|3999|5999/.test(lower))return{text:"Monthly website partnership starts at ₹2,599/month, with higher levels at ₹3,999 and ₹5,999+. It’s for ongoing updates/refinement — not a disguised full website build.",actions:action('plans')};
      if(/website|landing page|web design|web development|site/.test(lower)&&/plan|build|need|want|option|package/.test(lower))return{text:"For a complete new website, one-time builds currently start at ₹9,999. If the site already exists and mainly needs ongoing attention, monthly support starts at ₹2,599. I’d choose based on the job, not the fanciest package.",actions:action('plans','whatsapp')};
      if(/which plan|help me choose|recommend.*plan|right for me|what should i choose|not sure.*plan/.test(lower))return{text:"Easy. If you need a new site → look at one-time builds. If you already have one and want regular improvement → monthly. If the problem is inside your workflow/knowledge → AI. Tell me which of those sounds closest.",actions:action('plans')};
      if(/workflow audit|ai audit|audit/.test(lower))return{text:"The AI Workflow Audit is ₹9,999. BRAYRO maps the workflow, finds useful AI/automation opportunities, prioritises them, and gives you a practical recommendation before anyone sells you a giant build.",actions:action('audit')};
      if(/second brain|company brain|knowledge system|knowledge base/.test(lower))return{text:"The Company Second Brain starts at ₹29,999. Think approved company sources → organised knowledge layer → grounded answers for the team. Less ‘magic AI’, more ‘where did that document go?’ solved.",actions:action('brain')};
      if(/audit.*brain|brain.*audit/.test(lower))return{text:"If you already know you need a connected company-knowledge system, Second Brain makes sense. If you’re still asking ‘where would AI even help us?’, start with the ₹9,999 Workflow Audit.",actions:action('audit','brain')};
      if(/knowledge care|care plan/.test(lower))return{text:"Knowledge Care starts at ₹2,999/month. It’s the ongoing layer after an AI knowledge system launches — keeping sources, behaviour and usefulness from slowly turning into soup.",actions:action('plans')};
      if(/\bai\b|automation|gemini|artificial intelligence/.test(lower)&&lower.split(' ').length<14)return{text:"BRAYRO’s AI work is deliberately practical: Workflow Audit first when the opportunity is unclear, then focused systems like a Company Second Brain when there’s a real use case. No robot wallpaper required.",actions:action('audit','brain')};
      if(/payment|advance|refund|terms|scope|revision/.test(lower))return{text:"The exact commercial rules live on the Terms page, and project-specific scope should still be confirmed in writing. I can simplify the page, but for anything contractual I’d use the written agreement as the source of truth.",actions:[{label:'Read Terms ↗',href:'/terms'},ACTIONS.whatsapp]};
      if(/simple version|explain.*simply|human version/.test(lower)){
        if(page==='terms')return{text:"Human version: agree the scope, price and responsibilities in writing; extras are extras; third-party costs stay separate unless included; and the project works best when both sides provide what they promised on time."};
        if(page==='audit')return{text:"You show BRAYRO how a repetitive or messy workflow currently works. They map it, spot where AI could genuinely help, rank the ideas, and tell you what’s worth building — if anything."};
        if(page==='brain')return{text:"Your approved company docs/data become a controlled knowledge source. Your team asks questions, and the system answers from that material instead of making up company facts."};
      }
      if(/what.*get|deliverable|included/.test(lower)&&page==='audit')return{text:"The audit includes a workflow map, opportunity shortlist, priority matrix and a 30-minute review. It’s meant to leave you with a decision, not a mysterious PDF full of ‘AI transformation’ words.",actions:action('audit')};
      if(/source|integration|connect/.test(lower)&&page==='brain')return{text:"The Second Brain is built around approved company sources. Exact integrations depend on scope and access — the point is controlled, grounded knowledge rather than dumping everything into one chatbot.",actions:action('brain')};
      if(/open.*live|live site/.test(lower)&&page==='case')return{text:"Yep — opening the real thing is the best proof anyway.",actions:action('liveFakhri')};
      if(/start.*project|hire|work with|book|let.?s work/.test(lower))return{text:"Nice. Tell Yash what you want to improve, your rough timeline and budget range. WhatsApp is fastest — I’ve already made the button because apparently I’m useful now.",actions:action('whatsapp','email')};
      return null;
    }

    shouldUseGemini(text){
      if(this.fallbackCount>=3)return false;
      const words=clean(text).split(' ').filter(Boolean).length;
      const deep=/my business|my company|we (run|sell|make|need)|strategy|how (can|could|would)|recommend for|automate|automation idea|workflow problem|what should (we|i) do|improve my|convert more|lead|sales|customer|operations|process/.test(text.toLowerCase());
      return (words>=8&&deep)||words>=22;
    }

    async askGemini(text){
      this.busy=true;this.mood('thinking');this.typing(true);
      const controller=new AbortController();
      const timer=setTimeout(()=>controller.abort(),9000);
      try{
        const history=this.messages.slice(-6).map(message=>({role:message.who==='rae'?'model':'user',text:message.text}));
        const response=await fetch('/api/rae',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:text,page,section:this.section,history}),signal:controller.signal});
        const data=await response.json().catch(()=>({}));
        if(!response.ok||!data.reply)throw new Error(data.error||'Rae fallback unavailable');
        this.fallbackCount+=1;safeStore.set('rae:fallback-count',this.fallbackCount);
        this.typing(false);this.busy=false;this.add('rae',clean(data.reply),[ACTIONS.whatsapp]);
      }catch(error){
        this.typing(false);this.busy=false;this.mood('surprised');
        this.add('rae',"My bigger brain is taking a tea break 😭 I can still handle everything on this site, or you can ask Yash directly.",[ACTIONS.whatsapp]);
      }finally{clearTimeout(timer)}
    }

    observePage(){
      if(!('IntersectionObserver' in window))return;
      const candidates=[...document.querySelectorAll('[data-scene],[data-plan-scene],[data-founder-scene],.terms-section,.case-section,.client-work-section,main>section')]
        .filter((node,index,array)=>array.indexOf(node)===index);
      if(!candidates.length)return;
      const observer=new IntersectionObserver(entries=>{
        const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
        if(!visible)return;
        const next=visible.target.id||visible.target.dataset.scene||visible.target.dataset.planScene||visible.target.dataset.founderScene||'';
        if(next&&next!==this.section){this.section=next;this.onSection(next)}
      },{threshold:[.24,.48,.7],rootMargin:'-16% 0px -28% 0px'});
      candidates.forEach(node=>observer.observe(node));
    }

    onSection(section){
      if(this.open||this.nudgeCount>=2)return;
      const nudges={
        work:["Real client work starts here. Want the FakhriMart story without the case-study cinema voice? 😄","This is the useful proof bit. I can show you what actually changed for FakhriMart."],
        plans:["Pricing pages are where browser tabs go to die. Tell me what you need and I’ll narrow it down.","You do not need to memorise these prices. That’s literally why I’m here 😌"],
        'ai-systems':["AI without glowing robot wallpaper. Rare sighting. Want the simple version?","If you’re wondering ‘which AI thing would I even need?’ — excellent question. Ask me."],
        founder:["Yep, that’s Yash. No mysterious 40-person ‘team’ hiding off-camera 😄"]
      };
      const list=nudges[section];
      if(list)setTimeout(()=>{if(this.section===section&&!this.open)this.showNudge(pick(list),`section:${section}`)},2400);
    }

    scheduleWelcomeNudge(){
      if(this.nudgeCount>=2)return;
      clearTimeout(this.nudgeTimer);
      this.nudgeTimer=setTimeout(()=>{
        if(this.open)return;
        const copy={
          home:"Psst. I know where the prices, real work and AI stuff are. You can make me do the scrolling 😌",
          plans:"Too many numbers? Tell me what you’re trying to make. I’ll narrow this page down.",
          clients:"This is the proof shelf. FakhriMart is the proper case study right now.",
          case:"Short version: messy catalogue → clearer discovery → better enquiry flow. I can give you the tour.",
          founder:"I can give you the non-LinkedIn version of this page 😄",
          terms:"I can translate the important bits into human. No ‘hereinafter’, promise.",
          audit:"Not sure if you need an audit? Tell me the messy workflow in one sentence.",
          brain:"This is much simpler than the name sounds. Ask me for the 20-second version."
        }[page]||"Need a shortcut? I know this site suspiciously well.";
        this.showNudge(copy,`welcome:${page}`);
      },16000);
    }

    showNudge(text,key){
      if(this.open||this.nudgeCount>=2)return;
      const seen=safeStore.get('rae:nudges-seen',[])||[];
      if(seen.includes(key))return;
      seen.push(key);safeStore.set('rae:nudges-seen',seen.slice(-20));
      this.nudgeCount+=1;safeStore.set('rae:nudge-count',this.nudgeCount);
      this.root.querySelector('[data-rae-nudge-copy]').innerHTML=`<strong>Rae:</strong> ${this.escape(text)}`;
      this.root.classList.add('has-nudge');this.mood('curious');
      clearTimeout(this.nudgeHideTimer);this.nudgeHideTimer=setTimeout(()=>this.hideNudge(),8500);
    }

    hideNudge(){
      clearTimeout(this.nudgeHideTimer);this.root.classList.remove('has-nudge');if(!this.open)this.mood('idle');
    }

    trackEyes(event){
      if(this.eyeFrame)return;
      this.eyeFrame=requestAnimationFrame(()=>{
        this.eyeFrame=0;
        const avatar=this.avatar; if(!avatar)return;
        const rect=avatar.getBoundingClientRect();
        const nx=clamp(-1,(event.clientX-(rect.left+rect.width/2))/(rect.width*.7),1);
        const ny=clamp(-1,(event.clientY-(rect.top+rect.height/2))/(rect.height*.7),1);
        this.root.style.setProperty('--rae-eye-x',`${(nx*1.25).toFixed(2)}px`);
        this.root.style.setProperty('--rae-eye-y',`${(ny*.85).toFixed(2)}px`);
      });
    }

    resetEyes(){
      this.root.style.setProperty('--rae-eye-x','0px');this.root.style.setProperty('--rae-eye-y','0px');
    }
  }

  const mount=()=>new Rae();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});
  else mount();
})();
