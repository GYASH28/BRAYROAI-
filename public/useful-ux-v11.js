(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile=matchMedia('(max-width: 760px)');
  const body=document.body;
  body.classList.add('v11-ready');

  class UsefulSecondSceneV11{
    constructor(){
      this.section=document.querySelector('#services');
      if(!this.section)return;
      this.data={
        clarity:{index:'01 / CLARITY',word:'CLARITY',problem:'People do not get it fast enough',title:'Make the business obvious in seconds.',copy:'When visitors have to decode what you do, the design is already losing. We tighten the message, hierarchy and calls to action so the right person understands the offer quickly.',items:['Positioning and page hierarchy','Responsive interface built around the main action','Clear calls to action without clutter'],proofTitle:'Best when the site feels confusing',proofCopy:'Useful for businesses with a good offer but a weak first impression or unclear website structure.',plan:'/plans#builds'},
        enquiries:{index:'02 / ENQUIRIES',word:'ENQUIRY',problem:'Enquiries arrive with no context',title:'Turn browsing into better enquiries.',copy:'A website can do more than look polished. We can turn product or service choices into guided selectors, calculators, RFQ flows and direct enquiry paths that give you better context before the conversation starts.',items:['Guided selectors, calculators or RFQ flows','WhatsApp, email or CRM enquiry routing','Decision helpers built around real customer questions'],proofTitle:'Best when leads arrive with no context',proofCopy:'Useful for product, engineering, service and catalogue businesses where customers need help choosing before they enquire.',plan:'/plans#business'},
        system:{index:'03 / SYSTEM',word:'SYSTEM',problem:'The website keeps becoming outdated',title:'Build something you can keep improving.',copy:'Launch is not the finish line. The website should stay fast, understandable and easy to refine as the business changes instead of becoming another abandoned redesign.',items:['Fast responsive production build','SEO, analytics and maintainable foundations','Optional monthly refinement after launch'],proofTitle:'Best when the current site feels temporary',proofCopy:'Useful when you want a production website that can grow without rebuilding everything every few months.',plan:'/plans#monthly'}
      };
      this.render();
      this.bindReveal();
      this.bind();
      this.renameNavigation();
      this.set('clarity',false);
    }

    render(){
      this.section.classList.remove('services');
      this.section.classList.add('useful-outcomes');
      this.section.dataset.scene='outcomes';
      this.section.innerHTML=`
        <div class="scene-shell">
          <header class="v11-outcomes-head reveal v7-entered" data-reveal>
            <div>
              <p class="eyebrow"><i></i> START WITH THE PROBLEM</p>
              <h2>A better website should <em>do a job.</em></h2>
            </div>
            <p>Choose what is actually holding the business back. This is closer to how BRAYROAI scopes a project than a generic list of agency services.</p>
          </header>
          <div class="v11-outcomes-shell reveal v7-entered" data-v11-outcomes data-reveal>
            <div class="v11-outcomes-tabs" role="tablist" aria-label="Choose the website problem to solve">
              <button class="v11-outcome-tab" type="button" role="tab" id="v11-tab-clarity" data-v11-outcome="clarity" aria-controls="v11-outcome-panel"><small>01</small><span><b>People do not get it fast enough</b><small>Clarify the offer and the first impression.</small></span><i>↗</i></button>
              <button class="v11-outcome-tab" type="button" role="tab" id="v11-tab-enquiries" data-v11-outcome="enquiries" aria-controls="v11-outcome-panel"><small>02</small><span><b>Enquiries arrive with no context</b><small>Guide selection before the conversation starts.</small></span><i>↗</i></button>
              <button class="v11-outcome-tab" type="button" role="tab" id="v11-tab-system" data-v11-outcome="system" aria-controls="v11-outcome-panel"><small>03</small><span><b>The website keeps becoming outdated</b><small>Build a system that can keep improving.</small></span><i>↗</i></button>
            </div>
            <article class="v11-outcome-panel" id="v11-outcome-panel" role="tabpanel" tabindex="0" aria-live="polite" data-word="CLARITY">
              <div class="v11-outcome-copy">
                <small data-v11-index></small>
                <h3 data-v11-title></h3>
                <p data-v11-copy></p>
                <ul class="v11-outcome-list" data-v11-list></ul>
                <div class="v11-outcome-actions"><a data-v11-plan href="/plans#builds">See the right plans <span>↗</span></a><a data-v11-scope href="mailto:yashganesh.work@gmail.com?subject=Help%20me%20scope%20my%20website">Tell me what is not working <span>↗</span></a></div>
              </div>
              <aside class="v11-outcome-proof"><small>WHEN THIS HELPS</small><strong data-v11-proof-title></strong><p data-v11-proof-copy></p><i aria-hidden="true"></i></aside>
            </article>
          </div>
        </div>`;
      this.tabs=[...this.section.querySelectorAll('[data-v11-outcome]')];
      this.panel=this.section.querySelector('#v11-outcome-panel');
    }

    bindReveal(){
      const items=[...this.section.querySelectorAll('[data-reveal]')];
      const show=item=>item.classList.add('is-visible');
      if(reduced||!('IntersectionObserver' in window)){
        items.forEach(show);
        return;
      }
      this.revealObserver=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
          if(!entry.isIntersecting)return;
          show(entry.target);
          this.revealObserver.unobserve(entry.target);
        });
      },{threshold:.08,rootMargin:'4% 0px -8% 0px'});
      items.forEach(item=>this.revealObserver.observe(item));
      requestAnimationFrame(()=>{
        const rect=this.section.getBoundingClientRect();
        if(rect.top<innerHeight*.94&&rect.bottom>0)items.forEach(item=>{
          show(item);
          this.revealObserver?.unobserve(item);
        });
      });
    }

    bind(){
      this.tabs.forEach(tab=>{
        tab.addEventListener('click',()=>this.set(tab.dataset.v11Outcome,true));
        tab.addEventListener('keydown',event=>{
          if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
          event.preventDefault();
          let index=this.tabs.indexOf(tab);
          if(event.key==='Home')index=0;
          else if(event.key==='End')index=this.tabs.length-1;
          else index=(index+((event.key==='ArrowRight'||event.key==='ArrowDown')?1:-1)+this.tabs.length)%this.tabs.length;
          this.tabs[index].focus();
          this.set(this.tabs[index].dataset.v11Outcome,true);
        });
      });
    }

    set(key,user){
      const state=this.data[key]||this.data.clarity;
      const activeTab=this.tabs.find(tab=>tab.dataset.v11Outcome===key)||this.tabs[0];
      this.section.dataset.scVerifyState=`outcome:${key}`;
      this.tabs.forEach(tab=>{
        const active=tab===activeTab;
        tab.setAttribute('aria-selected',String(active));
        tab.tabIndex=active?0:-1;
      });
      this.panel.setAttribute('aria-labelledby',activeTab.id);
      this.panel.dataset.word=state.word;
      this.panel.querySelector('[data-v11-index]').textContent=state.index;
      this.panel.querySelector('[data-v11-title]').textContent=state.title;
      this.panel.querySelector('[data-v11-copy]').textContent=state.copy;
      this.panel.querySelector('[data-v11-list]').innerHTML=state.items.map((item,index)=>`<li><span>${String(index+1).padStart(2,'0')}</span>${item}</li>`).join('');
      this.panel.querySelector('[data-v11-proof-title]').textContent=state.proofTitle;
      this.panel.querySelector('[data-v11-proof-copy]').textContent=state.proofCopy;
      this.panel.querySelector('[data-v11-plan]').href=state.plan;
      const brief=[
        'Hi Yash,',
        '',
        `The main thing I want to improve is: ${state.problem}.`,
        '',
        'My business / brand:',
        'What visitors currently find difficult:',
        'The action I want people to take:',
        'Approximate budget and target date:',
        '',
        'Best way to reach me:'
      ].join('\n');
      this.panel.querySelector('[data-v11-scope]').href=`mailto:yashganesh.work@gmail.com?subject=${encodeURIComponent('Help me scope my BRAYROAI website')}&body=${encodeURIComponent(brief)}`;
      if(user&&!reduced){this.panel.animate([{opacity:.55,transform:'translateY(7px)'},{opacity:1,transform:'none'}],{duration:360,easing:'cubic-bezier(.16,1,.3,1)'})}
    }

    renameNavigation(){
      const rename=()=>{
        document.querySelectorAll('a[href="#services"]').forEach(link=>{
          const number=link.querySelector('span');
          if(number)link.childNodes[0].nodeValue='What we fix ';
          else link.textContent='What we fix';
        });
        const bridge=this.section.querySelector(':scope > .v9-bridge');
        if(bridge){const first=bridge.querySelector('span');if(first)first.textContent='WHAT WE FIX'}
      };
      rename();
      const observer=new MutationObserver(rename);
      observer.observe(this.section,{childList:true});
      setTimeout(()=>observer.disconnect(),5000);
    }
  }

  class WorkReliabilityV11{
    constructor(){
      this.section=document.querySelector('#work');
      this.stage=this.section?.querySelector('[data-work-stage]');
      if(!this.section||!this.stage)return;
      this.decorate();
      this.observer=new MutationObserver(()=>this.decorate());
      this.observer.observe(this.section,{childList:true,subtree:true});
      this.stage.addEventListener('brayro:workmode',event=>this.announce(event.detail?.mode));
      const attrObserver=new MutationObserver(()=>this.announce(this.stage.dataset.v8Mode||'desktop'));
      attrObserver.observe(this.stage,{attributes:true,attributeFilter:['data-v8-mode','data-sc-verify-state']});
      this.announce(this.stage.dataset.v8Mode||'desktop');
    }

    decorate(){
      this.section.querySelector('[data-work-toggle]')?.remove();
      this.section.querySelector('.v8-work-chapters')?.remove();
      this.section.querySelector('.v8-work-progress')?.remove();
      const mobileProof=this.section.querySelector('[data-v9-proof="mobile"]');
      const mobileImage=mobileProof?.querySelector('img');
      if(mobileImage&&mobileImage.getAttribute('src')!=='/assets/fakhrimart-case-mobile.png'){
        mobileImage.src='/assets/fakhrimart-case-mobile.png';
        mobileImage.width=390;mobileImage.height=844;
        mobileImage.alt='FakhriMart mobile interface detail';
      }
      const reel=this.section.querySelector('.v9-proof-reel');
      if(reel){reel.setAttribute('role','group');reel.setAttribute('aria-label','Choose a FakhriMart case-study view')}
      const modebar=this.section.querySelector('.v8-work-modebar');
      if(modebar)modebar.setAttribute('aria-label','Choose a FakhriMart preview view');
      if(!this.stage.querySelector('.v11-work-feedback')){
        const live=document.createElement('p');
        live.className='v11-work-feedback';
        live.setAttribute('aria-live','polite');
        this.stage.append(live);
      }
      this.stage.dataset.v11Stable='true';
    }

    announce(mode='desktop'){
      const live=this.stage.querySelector('.v11-work-feedback');
      if(!live)return;
      const label=mode==='mobile'?'mobile website view':mode==='detail'?'project decision details':'desktop website view';
      live.textContent=`Showing FakhriMart ${label}.`;
    }
  }

  class ContactHelpersV11{
    constructor(){
      const copy=document.querySelector('.close__copy');
      if(!copy||copy.querySelector('.v11-contact-tools'))return;
      const tools=document.createElement('div');
      tools.className='v11-contact-tools';
      tools.innerHTML='<button type="button" data-v11-copy-email>Copy email</button><a href="/plans">See pricing first <span>↗</span></a>';
      const note=document.createElement('p');
      note.className='v11-contact-note';
      note.setAttribute('aria-live','polite');
      note.textContent='No form. Start a conversation directly.';
      copy.append(tools,note);
      tools.querySelector('[data-v11-copy-email]').addEventListener('click',()=>this.copy(note,tools.querySelector('button')));
    }

    async copy(note,button){
      const email='yashganesh.work@gmail.com';
      let ok=false;
      try{await navigator.clipboard.writeText(email);ok=true}catch{
        try{const area=document.createElement('textarea');area.value=email;area.style.position='fixed';area.style.opacity='0';body.append(area);area.select();ok=document.execCommand('copy');area.remove()}catch{}
      }
      note.textContent=ok?'Email copied — paste it wherever you want.':`Email: ${email}`;
      if(ok){button.textContent='Copied';setTimeout(()=>button.textContent='Copy email',1800)}
    }
  }

  class MobileQuickActionsV11{
    constructor(){
      const nav=document.createElement('nav');
      nav.className='v11-mobile-actions';
      nav.setAttribute('aria-label','Quick actions');
      nav.setAttribute('aria-hidden','true');
      nav.inert=true;
      const work=location.pathname==='/'?'#work':'/#work';
      nav.innerHTML=`<a href="${work}">Work</a><a href="/plans">Plans</a><a href="https://wa.me/919175524637?text=${encodeURIComponent('Hi Yash, I would like to start a project with BRAYROAI.')}" target="_blank" rel="noreferrer">WhatsApp</a>`;
      body.append(nav);
      body.classList.add('v11-has-mobile-actions');
      this.nav=nav;
      this.contact=document.querySelector('#contact,.plan-close,.founder-close,.terms-close');
      this.raf=0;
      addEventListener('scroll',()=>this.schedule(),{passive:true});
      addEventListener('resize',()=>this.schedule(),{passive:true});
      this.schedule();
    }
    schedule(){if(!this.raf)this.raf=requestAnimationFrame(()=>this.paint())}
    paint(){
      this.raf=0;
      const contactVisible=this.contact?(()=>{const r=this.contact.getBoundingClientRect();return r.top<innerHeight*.82&&r.bottom>0})():false;
      const menuOpen=document.querySelector('[data-mobile-menu]')?.getAttribute('aria-hidden')==='false';
      const show=mobile.matches&&scrollY>innerHeight*.55&&!contactVisible&&!menuOpen;
      this.nav.classList.toggle('is-visible',show);
      this.nav.setAttribute('aria-hidden',String(!show));
      this.nav.inert=!show;
    }
  }

  new UsefulSecondSceneV11();
  new WorkReliabilityV11();
  new ContactHelpersV11();
  new MobileQuickActionsV11();
})();
