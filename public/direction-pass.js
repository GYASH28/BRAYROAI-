(() => {
  'use strict';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const introMobile=matchMedia('(max-width:760px)').matches;
  const clamp=(min,value,max)=>Math.min(max,Math.max(min,value));
  const body=document.body;

  const installIntroStyles=()=>{
    if(document.querySelector('style[data-hf-intro-critical]'))return;
    const style=document.createElement('style');
    style.dataset.hfIntroCritical='';
    style.textContent=`
      body.hf-intro-active{overflow:hidden!important;overscroll-behavior:none}
      .opening-sequence.hf-intro{position:fixed!important;inset:0!important;z-index:2147480000!important;display:grid!important;place-items:center!important;width:100%!important;height:100dvh!important;background:#070809!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important;animation:none!important;transition:opacity .4s cubic-bezier(.16,1,.3,1),visibility .4s!important}
      .opening-sequence.hf-intro::before,.opening-sequence.hf-intro::after{display:none!important}
      .opening-sequence.hf-intro.is-exiting{opacity:0!important;pointer-events:none!important}.opening-sequence.hf-intro.is-complete{opacity:0!important;visibility:hidden!important;pointer-events:none!important}
      .hf-intro__video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#070809;opacity:0;transform:scale(1.006);transition:opacity .3s ease,transform 5s cubic-bezier(.22,.72,.22,1)}.hf-intro.is-playing .hf-intro__video{opacity:1;transform:scale(1)}
      .hf-intro__loading{position:absolute;inset:0;display:grid;place-items:center;color:rgba(242,239,232,.72);font:500 10px/1 'DM Mono',monospace;letter-spacing:.18em;text-transform:uppercase;transition:opacity .25s ease}.hf-intro.is-playing .hf-intro__loading{opacity:0;pointer-events:none}.hf-intro__loading span{display:flex;align-items:center;gap:12px}.hf-intro__loading i{display:block;width:38px;height:1px;background:#ff5a1f;transform-origin:left;animation:hfLoad .9s cubic-bezier(.16,1,.3,1) infinite alternate}
      .hf-intro__controls{position:absolute;z-index:5;top:max(20px,env(safe-area-inset-top));right:max(22px,env(safe-area-inset-right));display:flex;align-items:center;gap:7px;opacity:0;transform:translate3d(0,-6px,0);transition:opacity .34s .2s ease,transform .42s .2s cubic-bezier(.16,1,.3,1)}.hf-intro.is-playing .hf-intro__controls,.hf-intro--lite .hf-intro__controls{opacity:1;transform:none}
      .hf-intro__button{appearance:none;border:1px solid rgba(242,239,232,.18);background:rgba(7,8,9,.72);color:rgba(242,239,232,.72);padding:9px 11px;border-radius:999px;font:500 9px/1 'DM Mono',monospace;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;transition:color .18s ease,border-color .18s ease,background .18s ease,transform .2s cubic-bezier(.16,1,.3,1)}.hf-intro__button:hover,.hf-intro__button:focus-visible{color:#f2efe8;border-color:rgba(242,239,232,.42);background:rgba(7,8,9,.88);outline:none}.hf-intro__button:active{transform:scale(.96)}
      .hf-intro__progress{position:absolute;z-index:5;left:0;right:0;bottom:0;height:2px;background:rgba(242,239,232,.08);overflow:hidden}.hf-intro__progress i{display:block;width:100%;height:100%;background:#ff5a1f;transform:scaleX(var(--hf-progress,0));transform-origin:left}
      .hf-intro__lite{position:absolute;inset:0;display:grid;align-content:end;padding:1.25rem 1.2rem max(2rem,env(safe-area-inset-bottom));overflow:hidden;background:#070809;color:#f3f0ea}.hf-intro__lite::before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent 0 8%,rgba(255,255,255,.05) 8% calc(8% + 1px),transparent calc(8% + 1px) 92%,rgba(255,255,255,.05) 92% calc(92% + 1px),transparent calc(92% + 1px)),linear-gradient(180deg,transparent 0 14%,rgba(255,255,255,.04) 14% calc(14% + 1px),transparent calc(14% + 1px));pointer-events:none}
      .hf-intro__lite-meta{position:absolute;top:max(1.2rem,env(safe-area-inset-top));left:1.2rem;right:1.2rem;display:flex;justify-content:space-between;color:rgba(243,240,234,.5);font:500 .56rem/1 'DM Mono',monospace;letter-spacing:.13em;text-transform:uppercase}.hf-intro__lite-copy{position:relative;z-index:2;padding-bottom:1.7rem}.hf-intro__lite-copy small{display:block;margin-bottom:.9rem;color:rgba(243,240,234,.52);font:500 .58rem/1 'DM Mono',monospace;letter-spacing:.14em;text-transform:uppercase;animation:hfLiteMeta .35s .02s both cubic-bezier(.16,1,.3,1)}.hf-intro__lite-copy strong{display:block;max-width:8ch;font:600 clamp(3.8rem,18vw,6.6rem)/.77 'Space Grotesk',Manrope,sans-serif;letter-spacing:-.075em;text-transform:uppercase;animation:hfLiteWord .42s .03s both cubic-bezier(.16,1,.3,1)}.hf-intro__lite-copy i{display:block;width:5rem;height:2px;margin-top:1.4rem;background:#ff6b2c;transform-origin:left;animation:hfLiteRule .48s .08s both cubic-bezier(.16,1,.3,1)}.hf-intro--lite .hf-intro__progress i{animation:hfLiteProgress .65s linear both}.hf-intro--lite{transition:opacity .25s ease,visibility .25s!important}
      @keyframes hfLoad{from{transform:scaleX(.18);opacity:.38}to{transform:scaleX(1);opacity:1}}@keyframes hfLiteMeta{from{opacity:0;transform:translate3d(0,.7rem,0)}}@keyframes hfLiteWord{from{opacity:0;transform:translate3d(0,1.4rem,0)}}@keyframes hfLiteRule{from{transform:scaleX(0)}}@keyframes hfLiteProgress{from{transform:scaleX(0)}to{transform:scaleX(1)}}
      @media(max-width:700px){.hf-intro__video{object-fit:contain}.hf-intro__controls{top:max(14px,env(safe-area-inset-top));right:max(14px,env(safe-area-inset-right))}.hf-intro__button{padding:8px 10px;font-size:8px}}
      @media(prefers-reduced-motion:reduce){.hf-intro{display:none!important}.scope-open,.founder-open{display:none!important}}
    `;
    document.head.append(style);
  };
  if(!introMobile)installIntroStyles();

  class HyperFramesIntro{
    constructor(){
      this.opening=document.querySelector('.opening-sequence');
      this.timer=0;this.finishTimer=0;this.finishing=false;this.startedAt=0;this.progressHandle=0;this.progressMode='';this.audioLoading=false;
      this.minimumWatchMs=2450;this.seenKey='brayro_intro_seen';
      document.querySelectorAll('.scope-open,.founder-open').forEach(overlay=>overlay.remove());
      body.classList.remove('polish-opening');
      if(!this.opening)return;
      if(introMobile){
        // The mobile opening is already drawn and dismissed by critical CSS.
        // Keep it out of JavaScript's layout path and let the hero appear at once.
        document.querySelectorAll('footer a[href="#top"]').forEach(link=>{if(link.textContent.trim().toLowerCase()==='replay')link.textContent='Back to top'});
        return;
      }
      body.classList.add('hf-intro-mode');
      if(reduced||navigator.connection?.saveData){this.opening.remove();return}
      this.opening.className='opening-sequence hf-intro';
      this.opening.removeAttribute('aria-hidden');this.opening.setAttribute('role','presentation');
      this.mountFilm();
    }
    mountFilm(){
      this.opening.innerHTML=`<video class="hf-intro__video" data-hf-intro-video preload="metadata" muted playsinline src="/assets/brayroai-cinematic-opening-silent.mp4" data-full-src="/assets/brayroai-cinematic-opening.mp4"></video><div class="hf-intro__loading" aria-hidden="true"><span><i></i>BRAYROAI / OPENING FILM</span></div><div class="hf-intro__controls" aria-label="Opening film controls"><button class="hf-intro__button" type="button" data-hf-sound aria-pressed="false">Sound off</button><button class="hf-intro__button" type="button" data-hf-skip>Skip</button></div><div class="hf-intro__progress" aria-hidden="true"><i></i></div>`;
      this.video=this.opening.querySelector('[data-hf-intro-video]');this.sound=this.opening.querySelector('[data-hf-sound]');this.skip=this.opening.querySelector('[data-hf-skip]');
      if(!this.video)return this.finish(true);
      this.video.volume=.9;this.video.muted=true;
      this.video.addEventListener('canplay',()=>this.start(),{once:true});
      this.video.addEventListener('playing',()=>{this.opening.classList.add('is-playing');this.paintProgress()});
      this.video.addEventListener('ended',()=>this.finish());this.video.addEventListener('error',()=>this.finish(true));
      this.sound?.addEventListener('click',()=>this.toggleSound());this.skip?.addEventListener('click',()=>this.finish(false,true));
      this.bindEscape();body.classList.add('hf-intro-active');
      this.video.play().then(()=>this.start()).catch(()=>{this.video.muted=true;this.video.play().then(()=>this.start()).catch(()=>this.finish(true))});
      this.timer=setTimeout(()=>this.finish(true),8500);this.bindReplay();
    }
    bindEscape(){addEventListener('keydown',event=>{if(event.key==='Escape'&&body.classList.contains('hf-intro-active'))this.finish(false,true)})}
    start(){if(!this.video||this.finishing)return;this.opening.classList.add('is-playing');if(!this.startedAt)this.startedAt=performance.now();if(this.video.paused)this.video.play().catch(()=>{});this.paintProgress()}
    async toggleSound(){
      if(!this.video||this.audioLoading)return;
      const full=this.video.dataset.fullSrc;
      const hasFull=this.video.currentSrc.includes('brayroai-cinematic-opening.mp4')&&!this.video.currentSrc.includes('-silent');
      if(hasFull){this.video.muted=!this.video.muted;this.syncSoundLabel();return}
      if(!full)return;
      this.audioLoading=true;if(this.sound)this.sound.textContent='Loading sound…';
      const at=this.video.currentTime,wasPaused=this.video.paused;
      try{
        await new Promise((resolve,reject)=>{
          const ready=()=>{cleanup();resolve()};const fail=()=>{cleanup();reject(new Error('audio source failed'))};const cleanup=()=>{this.video.removeEventListener('loadedmetadata',ready);this.video.removeEventListener('error',fail)};
          this.video.addEventListener('loadedmetadata',ready,{once:true});this.video.addEventListener('error',fail,{once:true});this.video.src=full;this.video.load();
        });
        if(Number.isFinite(this.video.duration))this.video.currentTime=Math.min(at,Math.max(0,this.video.duration-.08));
        this.video.muted=false;if(!wasPaused)await this.video.play().catch(()=>{});
      }catch{this.video.muted=true}finally{this.audioLoading=false;this.syncSoundLabel()}
    }
    syncSoundLabel(){const on=!this.video?.muted;if(this.sound){this.sound.textContent=on?'Sound on':'Sound off';this.sound.setAttribute('aria-pressed',String(on))}}
    paintProgress(){
      this.cancelProgress();
      const tick=()=>{
        if(!this.video||this.finishing)return;
        const duration=Number.isFinite(this.video.duration)&&this.video.duration>0?this.video.duration:5.6;
        this.opening.style.setProperty('--hf-progress',clamp(0,this.video.currentTime/duration,1).toFixed(4));
        if('requestVideoFrameCallback'in this.video){this.progressMode='video';this.progressHandle=this.video.requestVideoFrameCallback(tick)}
        else{this.progressMode='raf';this.progressHandle=requestAnimationFrame(tick)}
      };
      tick();
    }
    cancelProgress(){if(!this.progressHandle)return;if(this.progressMode==='video'&&this.video?.cancelVideoFrameCallback)this.video.cancelVideoFrameCallback(this.progressHandle);else cancelAnimationFrame(this.progressHandle);this.progressHandle=0}
    finish(immediate=false,force=false){
      if(this.finishing)return;
      const elapsed=this.startedAt?performance.now()-this.startedAt:0;const remaining=!force&&!immediate?Math.max(0,this.minimumWatchMs-elapsed):0;
      if(remaining){if(!this.finishTimer)this.finishTimer=setTimeout(()=>{this.finishTimer=0;this.finish(false,true)},remaining);return}
      this.finishing=true;try{sessionStorage.setItem(this.seenKey,'1')}catch{}clearTimeout(this.timer);clearTimeout(this.finishTimer);this.cancelProgress();body.classList.remove('hf-intro-active');this.opening?.classList.add('is-exiting');
      const done=()=>{if(!this.opening)return;this.opening.classList.add('is-complete');this.opening.classList.remove('is-exiting','is-playing');this.opening.setAttribute('aria-hidden','true');this.video?.pause()};
      if(immediate)done();else setTimeout(done,400);
    }
    replay(){
      if(!this.opening||reduced)return;
      this.finishing=false;clearTimeout(this.timer);clearTimeout(this.finishTimer);this.cancelProgress();window.scrollTo({top:0,behavior:'auto'});this.opening.classList.remove('is-complete','is-exiting');this.opening.setAttribute('aria-hidden','false');this.opening.style.setProperty('--hf-progress','0');this.startedAt=performance.now();body.classList.add('hf-intro-active');
      if(!this.video)return;this.video.currentTime=0;this.video.muted=true;this.syncSoundLabel();this.video.play().then(()=>this.start()).catch(()=>this.finish(true));this.timer=setTimeout(()=>this.finish(true),8500);
    }
    bindReplay(){document.querySelectorAll('footer a[href="#top"]').forEach(link=>{if(link.textContent.trim().toLowerCase()!=='replay')return;link.addEventListener('click',event=>{event.preventDefault();this.replay()})})}
  }

  class EditorialSequence{
    constructor(){
      this.section=document.querySelector('[data-editorial-sequence]');if(!this.section)return;
      this.index=this.section.querySelector('[data-editorial-index]');this.status=this.section.querySelector('[data-editorial-status]');this.frame=0;this.top=0;this.height=1;
      this.measure();this.observer='ResizeObserver'in window?new ResizeObserver(()=>this.measure()):null;this.observer?.observe(this.section);
      addEventListener('scroll',()=>this.schedule(),{passive:true});addEventListener('resize',()=>{this.measure();this.schedule()},{passive:true});this.schedule();
    }
    measure(){const rect=this.section.getBoundingClientRect();this.top=rect.top+scrollY;this.height=this.section.offsetHeight||rect.height||1}
    schedule(){if(!this.frame)this.frame=requestAnimationFrame(()=>this.update())}
    update(){
      this.frame=0;const range=Math.max(1,this.height-innerHeight);const p=clamp(0,(scrollY-this.top)/range,1);
      let phase='design',start=0,end=.25,index='01 / 04',status='DIRECTION / FIND THE POINT OF VIEW';
      if(p>=.25&&p<.5){phase='build';start=.25;end=.5;index='02 / 04';status='ENGINEERING / MAKE IT REAL'}else if(p>=.5&&p<.75){phase='ship';start=.5;end=.75;index='03 / 04';status='DELIVERY / MAKE IT HOLD UP'}else if(p>=.75){phase='join';start=.75;end=1;index='04 / 04';status='ONE STUDIO / NO HANDOFF'}
      const local=clamp(0,(p-start)/Math.max(.001,end-start),1);
      this.section.dataset.phase=phase;this.section.setAttribute('data-sc-verify-state',`editorial:${phase}`);
      this.section.style.setProperty('--ed-word-x',`${((.5-local)*30).toFixed(2)}px`);this.section.style.setProperty('--ed-ghost-x',`${((p-.5)*-88).toFixed(2)}px`);this.section.style.setProperty('--ed-rule',(.2+p*.8).toFixed(3));this.section.style.setProperty('--ed-accent',(.08+p*.34).toFixed(3));
      if(this.index)this.index.textContent=index;if(this.status)this.status.textContent=status;
    }
  }

  class SectionTextMotion{
    constructor(){
      if(reduced||!('IntersectionObserver'in window))return;
      const headings=[...document.querySelectorAll('.section-heading h2,.plan-heading h2,.founder-heading h2,.care__heading h2,.close__copy h2,.plan-close__copy h2,.founder-close__copy h2')];
      const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('v4-title-live');observer.unobserve(entry.target)}}),{threshold:.3});
      headings.forEach(heading=>observer.observe(heading));
    }
  }

  new HyperFramesIntro();
  const editorial=document.querySelector('[data-editorial-sequence]');
  if(editorial&&'IntersectionObserver'in window){
    const observer=new IntersectionObserver(entries=>{
      if(!entries.some(entry=>entry.isIntersecting))return;
      observer.disconnect();new EditorialSequence();
    },{rootMargin:'500px 0px'});
    observer.observe(editorial);
  }else new EditorialSequence();
  new SectionTextMotion();
})();
