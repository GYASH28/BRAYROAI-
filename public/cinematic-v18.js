(() => {
  'use strict';

  if (document.documentElement.dataset.v18CinematicMounted) return;
  const path = location.pathname.replace(/\/$/,'') || '/';
  if (path !== '/' && !path.endsWith('/index.html')) return;

  document.documentElement.dataset.v18CinematicMounted = 'true';

  const root = document.documentElement;
  const body = document.body;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (min,value,max) => Math.min(max,Math.max(min,value));
  const clamp01 = value => clamp(0,value,1);
  const lerp = (a,b,t) => a + (b-a)*t;
  const px = value => `${value.toFixed(2)}px`;

  body.classList.add('home-v18');

  class CinematicScrollDirector {
    constructor(){
      this.vh = innerHeight;
      this.vw = innerWidth;
      this.lastScroll = scrollY;
      this.velocity = 0;
      this.speed = 0;
      this.frame = 0;
      this.scenes = [];
      this.reel = document.querySelector('[data-v18-reel]');
      this.reelCurrent = 0;
      this.reelTarget = 0;
      this.reelIndex = -1;
      this.video = this.reel?.querySelector('[data-v18-video]') || null;
      this.copy = this.reel?.querySelector('.v18-reel__copy') || null;
      this.reelProgress = this.reel?.querySelector('.v18-reel__progress') || null;
      this.reelIndexNode = this.reel?.querySelector('[data-v18-reel-index]') || null;
      this.reelStatusNode = this.reel?.querySelector('[data-v18-reel-status]') || null;
      this.shots = this.reel ? [...this.reel.querySelectorAll('[data-v18-shot]')] : [];
      this.labels = [
        ['01 / 04','DIRECTION / FIND THE FRAME BEFORE ADDING THE EFFECT'],
        ['02 / 04','SYSTEM / TURN THE DIRECTION INTO A WORKING INTERFACE'],
        ['03 / 04','PROOF / LET REAL CLIENT WORK CARRY THE CLAIM'],
        ['04 / 04','AUTHORSHIP / KEEP ONE POINT OF VIEW THROUGH THE FINISH']
      ];

      this.collectScenes();
      this.bind();
      this.schedule(true);
    }

    collectScenes(){
      const unique = new Set();
      this.scenes = [...document.querySelectorAll('main > section,[data-scene]')]
        .filter(scene => {
          if (unique.has(scene)) return false;
          unique.add(scene);
          return true;
        })
        .map((scene,index) => ({
          scene,index,current:.5,target:.5,focus:0,targetFocus:0
        }));
    }

    bind(){
      addEventListener('scroll',() => this.schedule(),{passive:true});
      addEventListener('resize',() => {
        this.vh = innerHeight;
        this.vw = innerWidth;
        this.collectScenes();
        this.schedule(true);
      },{passive:true});
      addEventListener('pageshow',() => this.schedule(true),{passive:true});
      document.fonts?.ready?.then(() => this.schedule(true));
      if (this.video) {
        this.video.pause();
        this.video.addEventListener('loadedmetadata',() => this.schedule(true),{once:true});
        this.video.addEventListener('canplay',() => this.schedule(),{once:true});
      }
    }

    schedule(force=false){
      if (force) this.force = true;
      if (!this.frame) this.frame = requestAnimationFrame(() => this.tick());
    }

    rawSceneProgress(rect){
      return clamp01((this.vh - rect.top) / Math.max(rect.height + this.vh,1));
    }

    rawSceneFocus(rect){
      const center = rect.top + rect.height * .5;
      const distance = Math.abs(center - this.vh * .5);
      return clamp01(1 - distance / Math.max(this.vh * .92,1));
    }

    updateScene(record,force){
      const rect = record.scene.getBoundingClientRect();
      record.target = this.rawSceneProgress(rect);
      record.targetFocus = this.rawSceneFocus(rect);
      const rate = reduced || force ? 1 : .115;
      record.current = lerp(record.current,record.target,rate);
      record.focus = lerp(record.focus,record.targetFocus,reduced || force ? 1 : .14);

      const centred = record.current - .5;
      const direction = record.index % 2 ? 1 : -1;
      const cameraY = centred * -38;
      const cameraX = centred * direction * 10;
      const scale = 1.028 + (1-record.focus) * .018;

      record.scene.style.setProperty('--v18-p',record.current.toFixed(5));
      record.scene.style.setProperty('--v18-scene-focus',record.focus.toFixed(5));
      record.scene.style.setProperty('--v18-camera-y',px(cameraY));
      record.scene.style.setProperty('--v18-camera-x',px(cameraX));
      record.scene.style.setProperty('--v18-camera-scale',scale.toFixed(5));

      return Math.abs(record.current-record.target) + Math.abs(record.focus-record.targetFocus);
    }

    reelRawProgress(){
      if (!this.reel) return 0;
      const rect = this.reel.getBoundingClientRect();
      const travel = Math.max(rect.height - this.vh,1);
      return clamp01(-rect.top / travel);
    }

    shotAlpha(distance){
      if (distance >= 1) return 0;
      const c = Math.cos(distance * Math.PI * .5);
      return c*c;
    }

    updateReel(force){
      if (!this.reel || !this.shots.length) return 0;
      this.reelTarget = this.reelRawProgress();
      this.reelCurrent = lerp(this.reelCurrent,this.reelTarget,reduced || force ? 1 : .105);
      const p = this.reelCurrent;
      const maxIndex = this.shots.length - 1;
      const position = p * maxIndex;
      const activeIndex = clamp(0,Math.round(position),maxIndex);

      this.reel.style.setProperty('--v18-reel-progress',p.toFixed(5));

      const edge = Math.min(p,1-p);
      const matte = edge < .085 ? (1-edge/.085) * 7.4 : 0;
      this.reel.style.setProperty('--v18-matte',`${Math.max(0,matte).toFixed(3)}vh`);

      this.shots.forEach((shot,index) => {
        const distance = Math.abs(position-index);
        const alpha = this.shotAlpha(distance);
        const signed = index-position;
        const x = signed * Math.min(this.vw*.052,76);
        const y = signed * Math.min(this.vh*.026,28);
        const scale = 1.012 + Math.min(distance,1) * .055;
        const clip = Math.min(11.5,distance*10.5);

        shot.style.setProperty('--v18-shot-o',alpha.toFixed(5));
        shot.style.setProperty('--v18-shot-x',px(x));
        shot.style.setProperty('--v18-shot-y',px(y));
        shot.style.setProperty('--v18-shot-scale',scale.toFixed(5));
        shot.style.setProperty('--v18-shot-clip',`${clip.toFixed(3)}%`);
        shot.style.setProperty('--v18-shot-z',String(2 + Math.round(alpha*10)));
        shot.style.visibility = alpha < .001 ? 'hidden' : 'visible';
      });

      if (this.copy) {
        const copyY = Math.sin(p*Math.PI) * -10;
        this.copy.style.transform = `translate3d(0,${copyY.toFixed(2)}px,0)`;
      }

      if (activeIndex !== this.reelIndex) {
        this.reelIndex = activeIndex;
        this.reel.dataset.v18Active = String(activeIndex);
        const label = this.labels[activeIndex] || this.labels[0];
        if (this.reelIndexNode) this.reelIndexNode.textContent = label[0];
        if (this.reelStatusNode) this.reelStatusNode.textContent = label[1];
      }

      this.scrubVideo(p,maxIndex,force);
      return Math.abs(this.reelCurrent-this.reelTarget);
    }

    scrubVideo(p,maxIndex,force){
      if (!this.video || reduced || this.video.readyState < 1 || !Number.isFinite(this.video.duration) || this.video.duration <= 0) return;
      // The film owns the first reel leg. Once the second still has taken over,
      // hold the last frame instead of needlessly seeking an invisible video.
      const local = clamp01(p * Math.max(maxIndex,1));
      const target = local * Math.max(this.video.duration-.04,.01);
      if (force || (!this.video.seeking && Math.abs(this.video.currentTime-target) > .035)) {
        try { this.video.currentTime = target; } catch {}
      }
    }

    tick(){
      this.frame = 0;
      const y = scrollY;
      const delta = y-this.lastScroll;
      this.lastScroll = y;
      this.velocity = lerp(this.velocity,delta,.18);
      this.speed = lerp(this.speed,clamp01(Math.abs(delta)/70),.16);
      root.style.setProperty('--v18-scroll-speed',this.speed.toFixed(4));
      root.style.setProperty('--v18-scroll-velocity',this.velocity.toFixed(3));

      const force = !!this.force;
      this.force = false;
      let unsettled = 0;
      this.scenes.forEach(record => { unsettled += this.updateScene(record,force); });
      unsettled += this.updateReel(force);

      const stillMoving = Math.abs(delta) > .01 || Math.abs(this.velocity) > .08 || this.speed > .015 || unsettled > .003;
      if (!reduced && stillMoving) this.schedule();
    }
  }

  new CinematicScrollDirector();
})();
