(() => {
  'use strict';
  if(document.documentElement.dataset.raeMounted)return;
  document.documentElement.dataset.raeMounted='true';

  class RaeBootstrap{
    constructor(){
      this.loading=null;this.app=null;this.root=document.createElement('section');
      this.root.className='rae-root rae-root--shell';this.root.dataset.raeRoot='';this.root.setAttribute('aria-label','Rae, BRAYROAI AI assistant');
      this.root.innerHTML=`<button class="rae-presence rae-presence--shell" type="button" data-rae-shell aria-label="Chat with Rae, BRAYROAI AI assistant" aria-expanded="false"><span class="rae-shell-face" aria-hidden="true"><i></i><b></b><b></b><em></em></span><span class="rae-presence__copy"><strong>Rae</strong><small>BRAYROAI AI guide</small></span></button>`;
      document.body.append(this.root);this.button=this.root.querySelector('[data-rae-shell]');this.bind();this.deferLoad();
    }
    bind(){
      this.button.addEventListener('click',()=>this.ensure(true));
      this.button.addEventListener('focus',()=>this.ensure(false),{once:true});
      this.button.addEventListener('pointerenter',()=>this.ensure(false),{once:true,passive:true});
      this.button.addEventListener('touchstart',()=>this.ensure(false),{once:true,passive:true});
    }
    deferLoad(){
      const load=()=>this.ensure(false);
      if('requestIdleCallback'in window)this.idle=requestIdleCallback(load,{timeout:5500});else this.idle=setTimeout(load,4200);
    }
    async ensure(openAfter=false){
      if(this.app){if(openAfter)this.app.ui.setOpen(true);return this.app}
      if(!this.loading){
        this.root.dataset.loading='true';
        this.loading=import('/rae/rae-app.js').then(module=>{
          this.app=module.mountRae(this.root);this.root.classList.remove('rae-root--shell');delete this.root.dataset.loading;if(openAfter)this.app?.ui.setOpen(true);return this.app;
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
