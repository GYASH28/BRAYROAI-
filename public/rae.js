(() => {
  'use strict';
  if(document.documentElement.dataset.raeMounted)return;
  document.documentElement.dataset.raeMounted='true';

  const shellCharacter=()=>`<span class="rae-presence__actor" aria-hidden="true"><svg viewBox="60 18 360 360" width="46" height="46" focusable="false" data-rae-vector-launcher><defs><linearGradient id="raeMiniShell" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fffdf6"/><stop offset="1" stop-color="#cfc4b3"/></linearGradient><linearGradient id="raeMiniVisor" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#24262b"/><stop offset="1" stop-color="#030407"/></linearGradient><radialGradient id="raeMiniEye"><stop offset="0" stop-color="#fff9dc"/><stop offset=".5" stop-color="#ffb13b"/><stop offset="1" stop-color="#ff6515"/></radialGradient></defs><path d="M94 87L63 50Q58 44 62 86L73 127Z" fill="url(#raeMiniShell)"/><path d="M386 87L417 50Q422 44 418 86L407 127Z" fill="url(#raeMiniShell)"/><path d="M91 78Q118 35 183 27H297Q362 35 389 78Q408 111 403 160Q398 209 366 235Q332 260 240 262Q148 260 114 235Q82 209 77 160Q72 111 91 78Z" fill="url(#raeMiniShell)"/><path d="M119 87Q144 60 188 58H292Q338 61 363 88Q380 110 376 156Q372 195 346 216Q317 238 240 239Q163 238 134 216Q108 195 104 156Q100 111 119 87Z" fill="url(#raeMiniVisor)"/><ellipse cx="190" cy="151" rx="19" ry="27" fill="url(#raeMiniEye)"/><ellipse cx="290" cy="151" rx="19" ry="27" fill="url(#raeMiniEye)"/><path d="M213 190c17 18 37 18 55-2" fill="none" stroke="#ff8a1c" stroke-width="8" stroke-linecap="round"/><path d="M173 259Q240 233 307 259L298 335Q240 365 182 335Z" fill="url(#raeMiniShell)"/><rect x="219" y="286" width="42" height="10" rx="5" fill="#ff7a18"/></svg></span>`;
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
