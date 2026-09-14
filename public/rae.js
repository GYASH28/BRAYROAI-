(() => {
  'use strict';
  if(document.documentElement.dataset.raeMounted)return;
  document.documentElement.dataset.raeMounted='true';

  const shellCharacter=()=>`<span class="rae-presence__actor" aria-hidden="true"><svg viewBox="0 0 76 76" width="46" height="46" focusable="false"><defs><linearGradient id="rs" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fffdf7"/><stop offset="1" stop-color="#d9d0c3"/></linearGradient><linearGradient id="rv" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#262a31"/><stop offset="1" stop-color="#030405"/></linearGradient></defs><path d="M17 19 10 5c-2-4 3-6 6-3l9 12M59 19 66 5c2-4-3-6-6-3l-9 12" fill="#15171b" stroke="#ff6a20" stroke-width="1.5"/><circle cx="15" cy="35" r="9" fill="#111318"/><circle cx="61" cy="35" r="9" fill="#111318"/><circle cx="15" cy="35" r="5.5" fill="none" stroke="#ff6a20" stroke-width="2.5"/><circle cx="61" cy="35" r="5.5" fill="none" stroke="#ff6a20" stroke-width="2.5"/><path d="M16 18c6-10 18-14 22-14s16 4 22 14c6 10 6 27 0 37-6 9-15 13-22 13s-16-4-22-13c-6-10-6-27 0-37Z" fill="url(#rs)" stroke="#aaa095"/><rect x="17" y="21" width="42" height="31" rx="14" fill="url(#rv)"/><ellipse cx="29" cy="35" rx="4" ry="6" fill="#ff8b2d"/><ellipse cx="47" cy="35" rx="4" ry="6" fill="#ff8b2d"/><path d="M33 43c3 3 7 3 10 0" fill="none" stroke="#ff7a25" stroke-width="2.5" stroke-linecap="round"/><path d="M22 25c9-5 21-6 31-2" fill="none" stroke="#fff" stroke-width="1.3" opacity=".18"/></svg></span>`;
  const mountPolishSkin=()=>{if(document.querySelector('link[data-rae-polish-skin]'))return;const link=document.createElement('link');link.rel='stylesheet';link.href='/rae/rae-polish-v5.css';link.dataset.raePolishSkin='v5';document.head.append(link)};

  class RaeBootstrap{
    constructor(){
      this.loading=null;this.app=null;this.idle=0;this.preloadTimer=0;this.root=document.createElement('section');
      this.root.className='rae-root rae-root--shell';this.root.dataset.raeRoot='';this.root.setAttribute('aria-label','Rae, BRAYROAI AI assistant');
      this.root.innerHTML=`<button class="rae-presence rae-presence--shell" type="button" data-rae-shell aria-label="Chat with Rae, BRAYROAI AI assistant" aria-expanded="false">${shellCharacter()}<span class="rae-presence__copy"><strong>Rae</strong><small>BRAYROAI companion</small></span></button>`;
      document.body.append(this.root);this.button=this.root.querySelector('[data-rae-shell]');this.bind();this.deferLoad();
    }
    bind(){
      this.button.addEventListener('click',()=>this.ensure(true));
      this.button.addEventListener('focus',()=>this.ensure(false),{once:true});
      this.button.addEventListener('pointerenter',()=>this.ensure(false),{once:true,passive:true});
      this.button.addEventListener('touchstart',()=>this.ensure(false),{once:true,passive:true});
    }
    deferLoad(){
      if(navigator.connection?.saveData)return;
      const load=()=>{if(document.hidden){document.addEventListener('visibilitychange',()=>{if(!document.hidden)this.ensure(false)},{once:true});return}this.ensure(false)};
      const warm=()=>{this.preloadTimer=0;if(this.app||this.loading)return;if('requestIdleCallback'in window)this.idle=requestIdleCallback(load,{timeout:1800});else this.idle=setTimeout(load,1000)};
      const schedule=()=>{if(this.app||this.loading)return;this.preloadTimer=setTimeout(warm,1800)};
      if(document.readyState==='complete')schedule();else addEventListener('load',schedule,{once:true});
    }
    cancelPreload(){
      if(this.preloadTimer){clearTimeout(this.preloadTimer);this.preloadTimer=0}
      if(this.idle){if('cancelIdleCallback'in window)cancelIdleCallback(this.idle);else clearTimeout(this.idle);this.idle=0}
    }
    async ensure(openAfter=false){
      this.cancelPreload();
      if(this.app){if(openAfter)this.app.ui.setOpen(true);return this.app}
      if(!this.loading){
        this.root.dataset.loading='true';mountPolishSkin();
        this.loading=import('/rae/rae-app.js').then(async module=>{
          this.app=module.mountRae(this.root);
          try{const polish=await import('/rae/rae-polish-v5.js');polish.mountRaePolish?.(this.root,this.app)}catch(error){console.warn('Rae polish layer skipped',error)}
          this.root.classList.remove('rae-root--shell');delete this.root.dataset.loading;if(openAfter)this.app?.ui.setOpen(true);return this.app;
        }).catch(error=>{console.error('Rae failed to load',error);this.showFallback();return null});
      }else if(openAfter){this.loading.then(app=>app?.ui.setOpen(true))}
      return this.loading;
    }
    showFallback(){
      delete this.root.dataset.loading;this.root.dataset.raeFallback='true';
      this.root.innerHTML=`<div class="rae-fallback" role="status"><strong>Rae is taking a tiny break.</strong><span>The site still works normally. You can view plans, client work, or contact Yash.</span><div><a href="/plans">Plans</a><a href="/clients">Client work</a><a href="https://wa.me/919175524637" target="_blank" rel="noreferrer">WhatsApp ↗</a></div></div>`;
    }
  }

  const mount=()=>new RaeBootstrap();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
