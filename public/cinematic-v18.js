(() => {
  'use strict';
  if(document.documentElement.dataset.v19CinematicMounted)return;
  const path=location.pathname.replace(/\/$/,'')||'/';if(path!=='/'&&!path.endsWith('/index.html'))return;
  const root=document.documentElement,body=document.body;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const compact=matchMedia('(max-width:760px)').matches;
  const clamp=(min,value,max)=>Math.min(max,Math.max(min,value));const clamp01=value=>clamp(0,value,1);const lerp=(a,b,t)=>a+(b-a)*t;const px=value=>`${value.toFixed(2)}px`;const deg=value=>`${value.toFixed(3)}deg`;
  root.dataset.v19CinematicMounted='true';body.classList.add('home-v18','home-v19');

  class CinematicScrollDirector{
    constructor(){this.vh=innerHeight;this.vw=innerWidth;this.lastScroll=scrollY;this.velocity=0;this.speed=0;this.frame=0;this.pageCurrent=0;this.pageTarget=0;this.scenes=[];this.collectScenes();this.measure();this.bind();this.schedule(true)}
    collectScenes(){this.scenes=[...document.querySelectorAll('main [data-scene]')].map((scene,index)=>({scene,index,key:scene.dataset.scene||`scene-${index}`,top:0,height:1,current:.5,target:.5,focus:0,targetFocus:0}))}
    measure(){this.scenes.forEach(record=>{const rect=record.scene.getBoundingClientRect();record.top=rect.top+scrollY;record.height=record.scene.offsetHeight||rect.height||1})}
    bind(){
      addEventListener('scroll',()=>this.schedule(),{passive:true});
      addEventListener('resize',()=>{this.vh=innerHeight;this.vw=innerWidth;this.measure();this.schedule(true)},{passive:true});
      addEventListener('pageshow',()=>{this.measure();this.schedule(true)},{passive:true});
      document.fonts?.ready?.then(()=>{this.measure();this.schedule(true)});
      if('ResizeObserver'in window){this.ro=new ResizeObserver(()=>{this.measure();this.schedule(true)});this.scenes.forEach(record=>this.ro.observe(record.scene))}
    }
    schedule(force=false){if(force)this.force=true;if(!this.frame)this.frame=requestAnimationFrame(()=>this.tick())}
    sceneProgress(top,height){return clamp01((this.vh-top)/Math.max(height+this.vh,1))}
    sceneFocus(top,height){const center=top+height*.5,distance=Math.abs(center-this.vh*.5);return clamp01(1-distance/Math.max(this.vh*.88,1))}
    set(scene,name,value){scene.style.setProperty(name,value)}
    paintHero(scene,phase,focus){const amp=compact?.62:1;this.set(scene,'--v19-hero-bg-y',px(phase*-34*amp));this.set(scene,'--v19-hero-bg-x',px(phase*7*amp));this.set(scene,'--v19-hero-bg-scale',(1.035+(1-focus)*.025).toFixed(5));this.set(scene,'--v19-hero-subject-y',px(phase*-18*amp));this.set(scene,'--v19-hero-subject-x',px(phase*-5*amp));this.set(scene,'--v19-hero-subject-scale',(1.006+(1-focus)*.012).toFixed(5));this.set(scene,'--v19-hero-word-y',px(phase*15*amp));this.set(scene,'--v19-hero-word-scale',(1+focus*.008).toFixed(5));this.set(scene,'--v19-hero-copy-y',px(phase*-13*amp));this.set(scene,'--v19-hero-grid-y',px(phase*10*amp));this.set(scene,'--v19-hero-shade',(0.74-focus*.11).toFixed(4))}
    paintServices(scene,phase,focus){const amp=compact?.55:1;this.set(scene,'--v19-services-y',px(phase*-18*amp));this.set(scene,'--v19-services-scale',(1.008+(1-focus)*.012).toFixed(5));this.set(scene,'--v19-services-ghost-y',px(phase*22*amp));this.set(scene,'--v19-services-rings-rot',deg(phase*3.2*amp));this.set(scene,'--v19-services-copy-y',px(phase*-8*amp));this.set(scene,'--v19-services-controls-y',px(phase*7*amp));this.set(scene,'--v19-ticker-a-x',px(phase*22*amp));this.set(scene,'--v19-ticker-b-x',px(phase*-29*amp));this.set(scene,'--v19-ticker-c-x',px(phase*16*amp))}
    paintFilm(scene,phase,focus){const amp=compact?.6:1;this.set(scene,'--v19-film-frame-y',px(phase*-14*amp));this.set(scene,'--v19-film-frame-scale',(1.003+(1-focus)*.01).toFixed(5));this.set(scene,'--v19-film-ghost-x',px(phase*-36*amp));this.set(scene,'--v19-film-ghost-y',px(phase*12*amp));this.set(scene,'--v19-film-word-y',px(phase*-10*amp));this.set(scene,'--v19-film-rule-x',px(phase*24*amp));this.set(scene,'--v19-film-accent-y',px(phase*17*amp))}
    paintWork(scene,phase,focus){const amp=compact?.6:1;this.set(scene,'--v19-work-head-y',px(phase*-12*amp));this.set(scene,'--v19-work-index-y',px(phase*-8*amp));this.set(scene,'--v19-work-desktop-y',px(phase*-25*amp));this.set(scene,'--v19-work-mobile-y',px(phase*18*amp));this.set(scene,'--v19-work-media-scale',(1.01+(1-focus)*.018).toFixed(5));this.set(scene,'--v19-work-tilt',deg(phase*-.45*amp));this.set(scene,'--v19-work-mobile-tilt',deg(phase*.36*amp))}
    paintAI(scene,phase,focus){const amp=compact?.5:1;this.set(scene,'--v19-ai-head-y',px(phase*-10*amp));this.set(scene,'--v19-ai-card-a-y',px(phase*-15*amp));this.set(scene,'--v19-ai-card-b-y',px(phase*15*amp));this.set(scene,'--v19-ai-card-a-rot',deg(phase*-.55*amp));this.set(scene,'--v19-ai-card-b-rot',deg(phase*.55*amp));this.set(scene,'--v19-ai-scale',(1+focus*.004).toFixed(5))}
    paintPlans(scene,phase,focus){const amp=compact?.5:1;this.set(scene,'--v19-plans-head-y',px(phase*-10*amp));this.set(scene,'--v19-rate-a-y',px(phase*-12*amp));this.set(scene,'--v19-rate-b-y',px(phase*6*amp));this.set(scene,'--v19-rate-c-y',px(phase*14*amp));this.set(scene,'--v19-rates-scale',(1+focus*.003).toFixed(5))}
    paintFounder(scene,phase,focus){const amp=compact?.55:1;this.set(scene,'--v19-founder-image-y',px(phase*-22*amp));this.set(scene,'--v19-founder-image-x',px(phase*-7*amp));this.set(scene,'--v19-founder-image-scale',(1.02+(1-focus)*.015).toFixed(5));this.set(scene,'--v19-founder-copy-y',px(phase*12*amp));this.set(scene,'--v19-founder-rot',deg(phase*-.35*amp))}
    paintContact(scene,phase,focus){const amp=compact?.5:1;this.set(scene,'--v19-contact-copy-y',px(phase*-11*amp));this.set(scene,'--v19-contact-orb-y',px(phase*26*amp));this.set(scene,'--v19-contact-orb-x',px(phase*-18*amp));this.set(scene,'--v19-contact-orb-scale',(1.02+focus*.06).toFixed(5));this.set(scene,'--v19-contact-orb-a-rot',deg(phase*9*amp));this.set(scene,'--v19-contact-orb-b-rot',deg(phase*-6*amp))}
    paintScene(record,top,force){
      record.target=this.sceneProgress(top,record.height);record.targetFocus=this.sceneFocus(top,record.height);const rate=reduced||force?1:(compact?.2:.15);record.current=lerp(record.current,record.target,rate);record.focus=lerp(record.focus,record.targetFocus,reduced||force?1:(compact?.22:.17));const phase=(record.current-.5)*2;this.set(record.scene,'--v19-p',record.current.toFixed(5));this.set(record.scene,'--v19-phase',phase.toFixed(5));this.set(record.scene,'--v19-focus',record.focus.toFixed(5));
      switch(record.key){case'hero':this.paintHero(record.scene,phase,record.focus);break;case'services':this.paintServices(record.scene,phase,record.focus);break;case'film':this.paintFilm(record.scene,phase,record.focus);break;case'work':this.paintWork(record.scene,phase,record.focus);break;case'ai':case'ai-systems':this.paintAI(record.scene,phase,record.focus);break;case'plans':this.paintPlans(record.scene,phase,record.focus);break;case'founder':this.paintFounder(record.scene,phase,record.focus);break;case'contact':this.paintContact(record.scene,phase,record.focus);break}
      return Math.abs(record.current-record.target)+Math.abs(record.focus-record.targetFocus);
    }
    tick(){
      this.frame=0;const y=scrollY,delta=y-this.lastScroll;this.lastScroll=y;this.velocity=lerp(this.velocity,delta,.22);this.speed=lerp(this.speed,clamp01(Math.abs(delta)/72),.2);root._v19Speed=this.speed;
      const maxScroll=Math.max(document.documentElement.scrollHeight-this.vh,1);this.pageTarget=clamp01(y/maxScroll);const force=!!this.force;this.force=false;this.pageCurrent=lerp(this.pageCurrent,this.pageTarget,reduced||force?1:.15);root.style.setProperty('--v19-page',this.pageCurrent.toFixed(5));root.style.setProperty('--v19-speed',this.speed.toFixed(4));root.style.setProperty('--v19-velocity',this.velocity.toFixed(3));
      let unsettled=Math.abs(this.pageCurrent-this.pageTarget),nearest=null,nearestDistance=Infinity;
      this.scenes.forEach(record=>{const top=record.top-y,bottom=top+record.height,center=top+record.height*.5,distance=Math.abs(center-this.vh*.5);if(distance<nearestDistance){nearest=record;nearestDistance=distance}if(bottom<-this.vh*.55||top>this.vh*1.55)return;unsettled+=this.paintScene(record,top,force)});
      if(nearest)body.dataset.v19Scene=nearest.key;
      this.velocity=lerp(this.velocity,0,.16);this.speed=lerp(this.speed,0,.12);const stillMoving=Math.abs(delta)>.01||Math.abs(this.velocity)>.08||this.speed>.012||unsettled>.0025;if(!reduced&&stillMoving)this.schedule();
    }
  }
  new CinematicScrollDirector();
})();
