(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body=document.body;

  const mountCss=()=>{
    if(document.querySelector('link[data-stability-v12]'))return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='/stability-v12.css';
    link.dataset.stabilityV12='';
    link.addEventListener('load',()=>body.classList.add('v12-ready'),{once:true});
    document.head.append(link);
  };

  if(body.classList.contains('v11-ready'))mountCss();
  else{
    const observer=new MutationObserver(()=>{
      if(!body.classList.contains('v11-ready'))return;
      observer.disconnect();
      mountCss();
    });
    observer.observe(body,{attributes:true,attributeFilter:['class']});
    setTimeout(()=>{observer.disconnect();mountCss()},900);
  }

  class StaticOutcomesV12{
    constructor(){
      this.section=document.querySelector('#outcomes');
      if(!this.section)return;
      this.tabs=[...this.section.querySelectorAll('[data-v12-outcome]')];
      this.panel=this.section.querySelector('#v12-outcome-panel');
      if(!this.tabs.length||!this.panel)return;
      this.data={
        clarity:{index:'01 / CLARITY',word:'CLARITY',title:'Make the business obvious in seconds.',copy:'When visitors have to decode what you do, the design is already losing. We tighten the message, hierarchy and calls to action so the right person understands the offer quickly.',items:['Positioning and page hierarchy','Responsive interface built around the main action','Clear calls to action without clutter'],proofTitle:'Best when the site feels confusing',proofCopy:'Useful for businesses with a good offer but a weak first impression or unclear website structure.',plan:'/plans#builds'},
        enquiries:{index:'02 / ENQUIRIES',word:'ENQUIRY',title:'Turn browsing into better enquiries.',copy:'A website can do more than look polished. We can turn product or service choices into guided selectors, calculators, RFQ flows and direct enquiry paths that give you better context before the conversation starts.',items:['Guided selectors, calculators or RFQ flows','WhatsApp, email or CRM enquiry routing','Decision helpers built around real customer questions'],proofTitle:'Best when leads arrive with no context',proofCopy:'Useful for product, engineering, service and catalogue businesses where customers need help choosing before they enquire.',plan:'/plans#business'},
        system:{index:'03 / SYSTEM',word:'SYSTEM',title:'Build something you can keep improving.',copy:'Launch is not the finish line. The website should stay fast, understandable and easy to refine as the business changes instead of becoming another abandoned redesign.',items:['Fast responsive production build','SEO, analytics and maintainable foundations','Optional monthly refinement after launch'],proofTitle:'Best when the current site feels temporary',proofCopy:'Useful when you want a production website that can grow without rebuilding everything every few months.',plan:'/plans#monthly'}
      };
      this.tabs.forEach(tab=>{
        tab.addEventListener('click',()=>this.set(tab.dataset.v12Outcome,true));
        tab.addEventListener('keydown',event=>this.onKey(event,tab));
      });
      this.set('clarity',false);
    }

    onKey(event,tab){
      if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
      event.preventDefault();
      let index=this.tabs.indexOf(tab);
      if(event.key==='Home')index=0;
      else if(event.key==='End')index=this.tabs.length-1;
      else index=(index+((event.key==='ArrowRight'||event.key==='ArrowDown')?1:-1)+this.tabs.length)%this.tabs.length;
      const next=this.tabs[index];
      next.focus();
      this.set(next.dataset.v12Outcome,true);
    }

    set(key,user){
      const state=this.data[key]||this.data.clarity;
      const active=this.tabs.find(tab=>tab.dataset.v12Outcome===key)||this.tabs[0];
      this.section.dataset.scVerifyState=`outcome:${key}`;
      this.tabs.forEach(tab=>{
        const current=tab===active;
        tab.setAttribute('aria-selected',String(current));
        tab.tabIndex=current?0:-1;
      });
      this.panel.setAttribute('aria-labelledby',active.id);
      this.panel.dataset.word=state.word;
      this.panel.querySelector('[data-v12-index]').textContent=state.index;
      this.panel.querySelector('[data-v12-title]').textContent=state.title;
      this.panel.querySelector('[data-v12-copy]').textContent=state.copy;
      this.panel.querySelector('[data-v12-list]').innerHTML=state.items.map((item,index)=>`<li><span>${String(index+1).padStart(2,'0')}</span>${item}</li>`).join('');
      this.panel.querySelector('[data-v12-proof-title]').textContent=state.proofTitle;
      this.panel.querySelector('[data-v12-proof-copy]').textContent=state.proofCopy;
      this.panel.querySelector('[data-v12-plan]').href=state.plan;
      if(user&&!reduced)this.panel.animate([{opacity:.62,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:320,easing:'cubic-bezier(.16,1,.3,1)'});
    }
  }

  new StaticOutcomesV12();
})();
