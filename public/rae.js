(() => {
  'use strict';
  if(document.documentElement.dataset.raeMounted)return;
  document.documentElement.dataset.raeMounted='true';

  const shellCharacter=()=>`<span class="rae-presence__actor" aria-hidden="true"><svg viewBox="190 60 660 670" width="46" height="46" focusable="false"><image href="/rae/rae-illustration-thumb.webp" x="0" y="0" width="1024" height="1536"/><ellipse cx="428" cy="344" rx="30" ry="42" fill="#ff9822"/><ellipse cx="602" cy="335" rx="30" ry="42" fill="#ff9822"/><ellipse cx="421" cy="332" rx="8" ry="11" fill="#fff4d1"/><ellipse cx="595" cy="323" rx="8" ry="11" fill="#fff4d1"/><path d="M479 419c24 27 54 27 79-3" fill="none" stroke="#ff8a1c" stroke-width="18" stroke-linecap="round"/></svg></span>`;
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
      // Keep the launch sequence responsive; interaction still loads Rae immediately.
      const schedule=()=>{if(this.app||this.loading)return;this.preloadTimer=setTimeout(warm,10000)};
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
