const deferredStyleLinks=['post-fixes-styles','experience-styles'].map(id=>document.getElementById(id)).filter(Boolean);
const deferredStylesReady=Promise.all(deferredStyleLinks.map(link=>{
  link.media='all';
  if(link.sheet)return Promise.resolve();
  return new Promise(resolve=>{link.addEventListener('load',resolve,{once:true});link.addEventListener('error',resolve,{once:true})});
}));
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse=matchMedia('(pointer: coarse)').matches;
const finePointer=matchMedia('(pointer: fine)').matches;
const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const clamp=(min,value,max)=>Math.min(max,Math.max(min,value));
const lerp=(a,b,t)=>a+(b-a)*t;
const segment=(value,start,end)=>clamp(0,(value-start)/Math.max(.0001,end-start),1);
const easeOut=t=>1-Math.pow(1-t,3);

class LockedHeroController{
  constructor(){
    this.hero=$('#top');this.depthRoot=$('[data-depth-root]',this.hero||document);this.depthLayers=this.depthRoot?$$('[data-depth]',this.depthRoot):[];this.heroUI=this.hero?$('.hero-ui',this.hero):null;this.brandType=this.hero?$('.hero-brand-type',this.hero):null;this.px=0;this.py=0;this.visible=true;
    this.setupLoader();this.ensureSignalDeck();this.setupPointerDepth();
    if(this.hero&&'IntersectionObserver'in window){this.visibilityObserver=new IntersectionObserver(entries=>{this.visible=Boolean(entries[0]?.isIntersecting);window.__BRAYROAI__?.schedule()},{rootMargin:'25% 0px',threshold:0});this.visibilityObserver.observe(this.hero)}
  }
  setupLoader(){const loader=$('[data-loader]');if(!loader){document.body.classList.add('hero-ready');return}if(reduced){loader.remove();document.body.classList.add('hero-ready');return}setTimeout(()=>{loader.classList.add('is-done');document.body.classList.add('hero-ready')},920)}
  ensureSignalDeck(){if(!this.hero||$('.hero-signal-deck',this.hero))return;const deck=document.createElement('div');deck.className='hero-signal-deck';deck.setAttribute('aria-hidden','true');deck.innerHTML='<p>BRAYROAI / SIGNAL SYSTEM</p><div>CRAFT <span>AUTHORED</span></div><div>TECH <span>USEFUL</span></div><div>MOTION <span>PURPOSEFUL</span></div>';this.hero.appendChild(deck)}
  setupPointerDepth(){if(!this.hero||!this.depthRoot||reduced||coarse)return;this.depthRoot.addEventListener('pointermove',event=>{const rect=this.depthRoot.getBoundingClientRect();if(!rect.width||!rect.height)return;this.px=(event.clientX-rect.left)/rect.width-.5;this.py=(event.clientY-rect.top)/rect.height-.5;window.__BRAYROAI__?.schedule()},{passive:true});this.depthRoot.addEventListener('pointerleave',()=>{this.px=0;this.py=0;window.__BRAYROAI__?.schedule()})}
  update(){if(!this.hero||!this.depthRoot||reduced||!this.visible)return;const rect=this.hero.getBoundingClientRect();const scrollP=clamp(0,-rect.top/Math.max(1,rect.height),1);const chapterP=clamp(0,(innerHeight-rect.top)/Math.max(1,rect.height+innerHeight),1);this.hero.style.setProperty('--hero-scroll',scrollP.toFixed(4));this.hero.style.setProperty('--chapter-progress',chapterP.toFixed(4));if(this.heroUI){this.heroUI.style.opacity=String(1-clamp(0,scrollP*1.45,1));this.heroUI.style.translate=`0 ${scrollP*-30}px`}if(this.brandType)this.brandType.style.filter=`blur(${scrollP*1.7}px)`;this.depthLayers.forEach(layer=>{const depth=Number(layer.dataset.depth||.3);const x=this.px*34*depth;const y=this.py*24*depth-scrollP*86*depth;const scale=1+scrollP*.035*depth;layer.style.transform=`translate3d(${x}px,${y}px,0) scale(${scale})`})}
}

class NavigationManager{
  constructor(){this.nav=$('[data-nav]');this.progress=$('[data-progress]');this.menuButton=$('[data-menu-button]');this.mobileMenu=$('[data-mobile-menu]');this.navLinks=$$('.desktop-nav a[href^="#"]');this.targets=this.navLinks.map(link=>$(link.getAttribute('href'))).filter(Boolean);this.lastY=scrollY;this.bindAnchors();this.bindMenu()}
  bindAnchors(){$$('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{const id=link.getAttribute('href');if(!id||id==='#')return;const target=$(id);if(!target)return;event.preventDefault();target.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});history.replaceState(null,'',id);if(this.mobileMenu?.classList.contains('open'))this.setMenu(false)}))}
  setMenu(open){this.menuButton?.setAttribute('aria-expanded',String(open));this.mobileMenu?.classList.toggle('open',open);this.mobileMenu?.setAttribute('aria-hidden',String(!open));document.body.classList.toggle('menu-open',open);if(open){this.menuWasOpen=true;requestAnimationFrame(()=>this.mobileMenu?.querySelector('a')?.focus({preventScroll:true}))}else if(this.menuWasOpen){this.menuWasOpen=false;this.menuButton?.focus({preventScroll:true})}}
  bindMenu(){if(!this.menuButton||!this.mobileMenu)return;this.menuButton.addEventListener('click',()=>this.setMenu(this.menuButton.getAttribute('aria-expanded')!=='true'));$$('a',this.mobileMenu).forEach(link=>link.addEventListener('click',()=>this.setMenu(false)));document.addEventListener('keydown',event=>{if(event.key==='Escape'&&this.mobileMenu.classList.contains('open'))this.setMenu(false);if(event.key!=='Tab'||this.menuButton.getAttribute('aria-expanded')!=='true')return;const items=$$('a[href],button:not([disabled])',this.mobileMenu).filter(el=>el.offsetParent!==null);if(!items.length)return;const first=items[0],last=items.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}});addEventListener('resize',()=>{if(innerWidth>760&&this.menuButton.getAttribute('aria-expanded')==='true')this.setMenu(false)},{passive:true})}
  update(){const y=scrollY,max=Math.max(1,document.documentElement.scrollHeight-innerHeight);if(this.progress)this.progress.style.transform=`scaleX(${clamp(0,y/max,1)})`;this.nav?.classList.toggle('scrolled',y>70);this.nav?.classList.toggle('hidden',y>this.lastY&&y>360);this.lastY=y;const focal=innerHeight*.42;let active=null,best=Infinity;this.targets.forEach(target=>{const rect=target.getBoundingClientRect();const distance=Math.abs(rect.top+Math.min(rect.height,innerHeight)*.4-focal);if(rect.bottom>0&&rect.top<innerHeight&&distance<best){best=distance;active=target}});this.navLinks.forEach(link=>link.classList.toggle('is-active',Boolean(active)&&link.getAttribute('href')===`#${active.id}`));const light=active?.id==='work'||active?.id==='pricing';document.body.classList.toggle('theme-light',Boolean(light))}
}

class PointerSystem{
  constructor(){this.orb=$('[data-cursor-orb]');this.context=$('[data-context-cursor]');this.contextLabel=this.context?$('span',this.context):null;this.cx=-300;this.cy=-300;this.tx=-300;this.ty=-300;this.frame=0;if(finePointer&&!reduced)this.bind();else{if(this.orb)this.orb.style.display='none';if(this.context)this.context.style.display='none'}}
  bind(){addEventListener('pointermove',event=>{this.tx=event.clientX;this.ty=event.clientY;if(this.context){this.context.style.left=`${event.clientX}px`;this.context.style.top=`${event.clientY}px`}if(!this.frame)this.frame=requestAnimationFrame(()=>this.drawOrb())},{passive:true});$$('[data-cursor]').forEach(target=>{target.addEventListener('pointerenter',()=>{if(this.contextLabel)this.contextLabel.textContent=target.dataset.cursor||'OPEN';this.context?.classList.add('is-visible')});target.addEventListener('pointerleave',()=>this.context?.classList.remove('is-visible'))});$$('.magnetic').forEach(el=>{el.addEventListener('pointermove',event=>{const rect=el.getBoundingClientRect();const x=(event.clientX-rect.left-rect.width/2)*.1,y=(event.clientY-rect.top-rect.height/2)*.1;el.style.transform=`translate3d(${x}px,${y}px,0)`});el.addEventListener('pointerleave',()=>{el.style.transform=''})});$$('.interactive-surface').forEach(surface=>{surface.addEventListener('pointermove',event=>{const rect=surface.getBoundingClientRect();if(!rect.width||!rect.height)return;const x=clamp(-1,((event.clientX-rect.left)/rect.width-.5)*2,1),y=clamp(-1,((event.clientY-rect.top)/rect.height-.5)*2,1);surface.style.setProperty('--pointer-x',x.toFixed(3));surface.style.setProperty('--pointer-y',y.toFixed(3))},{passive:true});surface.addEventListener('pointerleave',()=>{surface.style.setProperty('--pointer-x','0');surface.style.setProperty('--pointer-y','0')})});const workFrame=$('[data-work-frame]'),inspector=$('[data-work-inspector]');if(workFrame&&inspector){workFrame.addEventListener('pointermove',event=>{const rect=workFrame.getBoundingClientRect();inspector.style.left=`${event.clientX-rect.left}px`;inspector.style.top=`${event.clientY-rect.top}px`},{passive:true})}}
  drawOrb(){this.cx+=(this.tx-this.cx)*.13;this.cy+=(this.ty-this.cy)*.13;if(this.orb)this.orb.style.transform=`translate3d(${this.cx-110}px,${this.cy-110}px,0)`;if(Math.abs(this.tx-this.cx)>.4||Math.abs(this.ty-this.cy)>.4)this.frame=requestAnimationFrame(()=>this.drawOrb());else this.frame=0}
}

class ScrollScene{
  constructor(element){this.el=element;this.visible=true;if(this.el&&'IntersectionObserver'in window){this.observer=new IntersectionObserver(entries=>{this.visible=Boolean(entries[0]?.isIntersecting);window.__BRAYROAI__?.schedule()},{rootMargin:'40% 0px',threshold:0});this.observer.observe(this.el)}}
  progress(){if(!this.el)return 0;const rect=this.el.getBoundingClientRect();const distance=Math.max(1,rect.height-innerHeight);return clamp(0,-rect.top/distance,1)}
  destroy(){this.observer?.disconnect()}
}

class ServiceRail extends ScrollScene{
  constructor(element){super(element);this.moments=$$('[data-service-moment]',element);this.count=$('[data-service-count]',element);this.current=-1}
  update(){if(!this.el||reduced||innerWidth<=760)return;const p=this.progress();const slice=1/this.moments.length;let best=0,bestDistance=Infinity;this.moments.forEach((moment,index)=>{const local=(p-index*slice)/slice;let x=120,opacity=0,scale=.86,tilt=3;if(local>=0&&local<.28){const t=easeOut(local/.28);x=lerp(120,0,t);opacity=segment(local,.03,.18);scale=lerp(.86,1,t);tilt=lerp(3,0,t)}else if(local>=.28&&local<=.70){x=0;opacity=1;scale=1;tilt=0}else if(local>.70&&local<=1){const t=easeOut((local-.70)/.30);x=lerp(0,-122,t);opacity=1-segment(local,.82,1);scale=lerp(1,.9,t);tilt=lerp(0,-3,t)}else if(local>1){x=-122;opacity=0;scale=.9;tilt=-3}moment.style.transform=`translate3d(${x}vw,0,0) scale(${scale}) rotate(${tilt}deg)`;moment.style.opacity=String(opacity);const distance=Math.abs(local-.49);if(distance<bestDistance){bestDistance=distance;best=index}});if(best!==this.current){this.current=best;this.moments.forEach((moment,index)=>moment.classList.toggle('is-current',index===best));if(this.count)this.count.textContent=`${String(best+1).padStart(2,'0')} / 04`}}
}

class WorkFilm extends ScrollScene{
  constructor(element){super(element);this.stage=$('.work-stage',element)}
  update(){if(!this.el||!this.stage||reduced||innerWidth<=760)return;const p=this.progress();const enter=easeOut(segment(p,.02,.20));const fill=easeOut(segment(p,.12,.39));const phone=easeOut(segment(p,.30,.50));const split=easeOut(segment(p,.64,.84));this.stage.style.setProperty('--work-enter',enter.toFixed(4));this.stage.style.setProperty('--work-fill',fill.toFixed(4));this.stage.style.setProperty('--work-phone',phone.toFixed(4));this.stage.style.setProperty('--work-split',split.toFixed(4));this.stage.dataset.workPhase=p<.24?'enter':p<.64?'hold':p<.84?'split':'build'}
}

class SystemFilm extends ScrollScene{
  constructor(element){super(element);this.stage=$('.system-stage',element);this.board=$('[data-craft-board]',element);this.buttons=$$('[data-system-mode]',element);this.label=$('[data-system-label]',element);this.copy=$('[data-system-copy]',element);this.meta=$('[data-system-meta]',element);this.manualUntil=0;this.mode='design';this.states={design:{label:'DESIGN',copy:'Composition, hierarchy and interaction establish the product character.',meta:'TYPE / SPACE / MOTION'},build:{label:'BUILD',copy:'The visual system becomes responsive components, states and reliable behavior.',meta:'COMPONENTS / STATES / PERFORMANCE'},ai:{label:'AI',copy:'Intelligence enters only where it improves the task, the workflow or the response.',meta:'CONTEXT / TOOLS / AUTOMATION'}};this.buttons.forEach(button=>button.addEventListener('click',()=>{this.manualUntil=Date.now()+4500;this.setMode(button.dataset.systemMode)}))}
  setMode(mode){if(!this.states[mode]||mode===this.mode)return;this.mode=mode;if(this.board)this.board.dataset.mode=mode;this.buttons.forEach(button=>{const active=button.dataset.systemMode===mode;button.classList.toggle('is-active',active);button.setAttribute('aria-selected',String(active))});const state=this.states[mode];if(this.label)this.label.textContent=state.label;if(this.copy)this.copy.textContent=state.copy;if(this.meta)this.meta.textContent=state.meta}
  update(){if(!this.el||!this.stage)return;if(reduced||innerWidth<=760){this.stage.style.setProperty('--system-enter','1');return}const p=this.progress();this.stage.style.setProperty('--system-enter',easeOut(segment(p,.02,.18)).toFixed(4));if(Date.now()<this.manualUntil)return;const auto=p<.34?'design':p<.67?'build':'ai';this.setMode(auto)}
}

class PricingController{
  constructor(){this.buttons=$$('[data-pricing-tab]');this.panels=$$('[data-pricing-panel]');this.buttons.forEach(button=>button.addEventListener('click',()=>this.set(button.dataset.pricingTab)))}
  set(mode){this.buttons.forEach(button=>{const active=button.dataset.pricingTab===mode;button.classList.toggle('is-active',active);button.setAttribute('aria-selected',String(active))});this.panels.forEach(panel=>{panel.hidden=panel.dataset.pricingPanel!==mode})}
}

class StudioFilm extends ScrollScene{
  constructor(element){super(element);this.stage=$('.studio-stage',element)}
  update(){if(!this.el||!this.stage||reduced||innerWidth<=760)return;this.stage.style.setProperty('--studio-enter',easeOut(segment(this.progress(),.04,.42)).toFixed(4))}
}

class CinematicExperience{
  constructor(){window.__BRAYROAI__=this;this.frame=0;this.hero=new LockedHeroController();this.navigation=new NavigationManager();this.pointer=new PointerSystem();this.services=new ServiceRail($('[data-scene="services"]'));this.work=new WorkFilm($('[data-scene="work"]'));this.system=new SystemFilm($('[data-scene="system"]'));this.studio=new StudioFilm($('[data-scene="studio"]'));this.pricing=new PricingController();this.update=this.update.bind(this);this.schedule=this.schedule.bind(this);addEventListener('scroll',this.schedule,{passive:true});addEventListener('resize',this.schedule,{passive:true});addEventListener('load',this.schedule,{once:true});this.schedule()}
  schedule(){if(!this.frame)this.frame=requestAnimationFrame(this.update)}
  update(){this.frame=0;this.hero.update();this.navigation.update();if(!reduced){this.services.update();this.work.update();this.system.update();this.studio.update()}else{this.system.update()} }
}

const experience=new CinematicExperience();
deferredStylesReady.finally(()=>{document.body.classList.add('experience-ready');experience.schedule()});
