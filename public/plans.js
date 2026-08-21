const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const whatsappNumber='919175524637';
const planData={
  starter:{name:'Website Starter',price:'₹2,599',copy:'A focused first website is the closest match.',message:"Hi Yash, I'm interested in the BRAYROAI Website Starter plan at ₹2,599. My business is: "},
  business:{name:'Business Website',price:'₹3,999',copy:'A richer business presentation is the closest match.',message:"Hi Yash, I'm interested in the BRAYROAI Business Website plan at ₹3,999. My business is: "},
  custom:{name:'Custom Experience',price:'₹5,999+',copy:'Your requirement is best mapped as a custom experience.',message:"Hi Yash, I'm interested in a BRAYROAI Custom Experience starting at ₹5,999. My requirement is: "},
  launch:{name:'Launch support',price:'₹2,499/mo',copy:'Dependable updates and essential upkeep.',message:"Hi Yash, I'd like to ask about BRAYROAI Launch support at ₹2,499/month."},
  grow:{name:'Grow support',price:'₹3,999/mo',copy:'Regular UX and conversion-focused improvements.',message:"Hi Yash, I'd like to ask about BRAYROAI Grow support at ₹3,999/month."},
  pro:{name:'Pro support',price:'₹5,999+/mo',copy:'Closer design and development support.',message:"Hi Yash, I'd like to ask about BRAYROAI Pro support starting at ₹5,999/month."},
  help:{name:'Plan guidance',price:'Direct WhatsApp',copy:'Tell Yash what your business needs.',message:'Hi Yash, please help me choose the right BRAYROAI website plan. My business is: '}
};
const whatsappHref=key=>`https://wa.me/${whatsappNumber}?text=${encodeURIComponent((planData[key]||planData.help).message)}`;

class PlansTheme{
  constructor(){this.button=$('[data-theme-toggle]');let saved='';try{saved=localStorage.getItem('brayroai-theme')||''}catch{}this.theme=saved==='light'?'light':'dark';this.apply();this.button?.addEventListener('click',()=>{this.theme=this.theme==='dark'?'light':'dark';this.apply();try{localStorage.setItem('brayroai-theme',this.theme)}catch{}})}
  apply(){const dark=this.theme==='dark';document.documentElement.dataset.theme=this.theme;this.button?.setAttribute('aria-pressed',String(dark));this.button?.setAttribute('aria-label',`Switch to ${dark?'light':'dark'} mode`);const label=$('b',this.button||document);if(label)label.textContent=dark?'DARK':'LIGHT';const meta=$('meta[name="theme-color"]');if(meta)meta.content=dark?'#08090B':'#F3EFE7'}
}

class PlanSelection{
  constructor(){this.buttons=$$('[data-plan-select]');this.cards=$$('[data-plan-card]');this.mobileLabel=$('[data-mobile-plan]');this.mobileLink=$('.plans-mobile-dock [data-whatsapp]');this.buttons.forEach(button=>button.addEventListener('click',()=>this.select(button.dataset.planSelect,{focus:true,history:true})));this.cards.forEach(card=>{card.addEventListener('pointerenter',()=>this.select(card.dataset.planCard));card.addEventListener('focusin',()=>this.select(card.dataset.planCard))});const requested=new URLSearchParams(location.search).get('plan');this.select(planData[requested]?requested:'starter')}
  select(key,{focus=false,history=false}={}){const card=this.cards.find(item=>item.dataset.planCard===key);if(!card)return;this.buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.planSelect===key)));this.cards.forEach(item=>item.dataset.active=String(item===card));if(this.mobileLabel)this.mobileLabel.textContent=`${planData[key].name} · ${planData[key].price}`;if(this.mobileLink){this.mobileLink.dataset.whatsapp=key;this.mobileLink.href=whatsappHref(key)}if(history){const url=new URL(location.href);url.searchParams.set('plan',key);url.hash='';window.history.replaceState(null,'',url)}if(focus)card.scrollIntoView({behavior:reduceMotion?'auto':'smooth',block:'center'})}
}

class PlanFinder{
  constructor(){this.root=$('[data-plan-finder]');if(!this.root)return;this.selected={};this.buttons=$$('[data-finder-group]',this.root);this.name=$('[data-finder-name]',this.root);this.copy=$('[data-finder-copy]',this.root);this.link=$('[data-finder-whatsapp]',this.root);this.mobileLabel=$('[data-mobile-plan]');this.mobileLink=$('.plans-mobile-dock [data-whatsapp]');this.buttons.forEach(button=>button.addEventListener('click',()=>this.choose(button)))}
  choose(button){const group=button.dataset.finderGroup;this.selected[group]=button.dataset.finderValue;this.buttons.filter(item=>item.dataset.finderGroup===group).forEach(item=>item.setAttribute('aria-pressed',String(item===button)));this.update()}
  update(){if(!this.selected.stage||!this.selected.scope)return;const values=[this.selected.stage,this.selected.scope];const key=values.includes('custom')?'custom':values.includes('business')?'business':'starter';const plan=planData[key];this.name.textContent=`${plan.name} · ${plan.price}`;this.copy.textContent=plan.copy;this.link.href=whatsappHref(key);this.link.dataset.whatsapp=key;this.link.classList.remove('is-disabled');this.link.removeAttribute('aria-disabled');if(this.mobileLabel)this.mobileLabel.textContent=`Your match · ${plan.name}`;if(this.mobileLink){this.mobileLink.href=whatsappHref(key);this.mobileLink.dataset.whatsapp=key}}
}

class PlansMotion{
  constructor(){document.documentElement.classList.add('plans-enhanced');this.items=$$('.reveal-plan');if(reduceMotion||!('IntersectionObserver'in window)){this.items.forEach(item=>item.classList.add('is-visible'))}else{this.observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');this.observer.unobserve(entry.target)}}),{rootMargin:'0px 0px -8% 0px',threshold:.08});this.items.forEach(item=>this.observer.observe(item))}if(!reduceMotion&&matchMedia('(pointer: fine)').matches)addEventListener('pointermove',event=>{document.documentElement.style.setProperty('--pointer-x',`${event.clientX}px`);document.documentElement.style.setProperty('--pointer-y',`${event.clientY}px`)},{passive:true})}
}

$$('[data-whatsapp]').forEach(link=>{const key=link.dataset.whatsapp;if(planData[key])link.href=whatsappHref(key)});
new PlansTheme();
new PlanSelection();
new PlanFinder();
new PlansMotion();
