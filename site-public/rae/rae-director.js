const clamp=(min,value,max)=>Math.min(max,Math.max(min,value));
const weightedPick=items=>{const total=items.reduce((sum,item)=>sum+item.weight,0);let cursor=Math.random()*total;for(const item of items){cursor-=item.weight;if(cursor<=0)return item.value}return items[0].value};
const mountEmotionSkin=()=>{if(typeof document==='undefined'||document.querySelector('link[data-rae-emotion-skin]'))return;const link=document.createElement('link');link.rel='stylesheet';link.href='/rae/rae-character-emotions.css';link.dataset.raeEmotionSkin='v3';document.head.append(link)};

export const RAE_STATES=Object.freeze(['boot','idle','attention','opening','listening','thinking','speaking','positive','curious','confused','surprised','playful','proud','shy','skeptical','laughing','wink','error','offline','celebrate','sleep']);

export class RaeDirector{
  constructor(root,{reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches}={}){
    mountEmotionSkin();this.root=root;this.reduced=reducedMotion;this.characters=[...root.querySelectorAll('[data-rae-character]')];this.state='boot';this.visible=true;this.sleeping=false;this.pointerFrame=0;this.idleTimer=0;this.blinkTimer=0;this.speechTimer=0;this.emotionTimer=0;this.bootTimer=0;this.lastIdle='';this.lastInteraction=Date.now();this.listeners=[];
    this.onVisibility=()=>document.hidden?this.sleep():this.wake();document.addEventListener('visibilitychange',this.onVisibility);this.bindEvents();this.setState('boot');this.bootTimer=setTimeout(()=>{this.bootTimer=0;if(this.state==='boot')this.setState('idle')},this.reduced?0:520);this.scheduleBlink();this.scheduleIdle();
  }
  bindEvents(){
    const preserveFocusState=()=>{if(!['offline','error','listening','thinking','speaking'].includes(this.state))this.setState('attention')};
    const map={'rae:opened':()=>this.setState('opening'),'rae:closed':()=>this.setState('idle'),'rae:user-focus':preserveFocusState,'rae:user-submit':()=>this.setState('listening'),'rae:request-start':()=>this.setState('thinking'),'rae:first-token':()=>this.setState('speaking'),'rae:stream-chunk':event=>this.pulseSpeech(event.detail?.text||''),'rae:stream-complete':event=>this.setEmotion(event.detail?.emotion||'positive'),'rae:stream-abort':()=>this.setState('idle'),'rae:tool-start':()=>this.setState('curious'),'rae:tool-success':()=>this.setState('proud'),'rae:tool-error':()=>this.setState('confused'),'rae:network-error':()=>this.setState('error'),'rae:offline':()=>this.setState('offline'),'rae:character-react':event=>this.setEmotion(event.detail?.emotion||'playful'),'rae:sleep':()=>this.sleep(),'rae:wake':()=>this.wake()};
    for(const [name,handler] of Object.entries(map)){document.addEventListener(name,handler);this.listeners.push([name,handler])}
  }
  setState(next){
    if(!RAE_STATES.includes(next))next='idle';if(next!=='boot'&&this.bootTimer){clearTimeout(this.bootTimer);this.bootTimer=0}clearTimeout(this.emotionTimer);this.state=next;this.lastInteraction=Date.now();this.sleeping=next==='sleep';this.root.dataset.raeState=next;
    if(next==='idle'&&!this.reduced)this.root.style.setProperty('--rae-breath-duration',`${(3.7+Math.random()*1.7).toFixed(2)}s`);
    for(const node of this.characters)node.dataset.state=next;if(next!=='speaking')this.setSpeakingLevel(0);
    if(this.reduced)return;
    if(next==='celebrate'){this.emotionTimer=setTimeout(()=>{if(this.state===next)this.setState('proud')},850);return}
    const durations={wink:900,surprised:1250,laughing:1500,playful:1700,shy:1750,proud:1850,skeptical:1900,positive:1600,curious:1600,confused:1600,error:1800};
    if(durations[next])this.emotionTimer=setTimeout(()=>{if(this.state===next)this.setState('idle')},durations[next]);
  }
  setEmotion(emotion){const allowed={neutral:'idle',happy:'positive',positive:'positive',curious:'curious',thoughtful:'thinking',concerned:'confused',confused:'confused',surprised:'surprised',playful:'playful',proud:'proud',shy:'shy',skeptical:'skeptical',laughing:'laughing',wink:'wink'};this.setState(allowed[String(emotion||'').toLowerCase()]||'positive')}
  setAttention({x=0,y=0}={}){if(this.reduced||this.sleeping)return;const gx=clamp(-1,x,1),gy=clamp(-1,y,1);this.root.style.setProperty('--rae-gaze-x',`${(gx*5).toFixed(2)}px`);this.root.style.setProperty('--rae-gaze-y',`${(gy*3.6).toFixed(2)}px`);this.root.style.setProperty('--rae-head-x',`${(gx*1.7).toFixed(2)}px`);this.root.style.setProperty('--rae-head-r',`${(gx*1.8).toFixed(2)}deg`)}
  resetAttention(){this.root.style.setProperty('--rae-gaze-x','0px');this.root.style.setProperty('--rae-gaze-y','0px');this.root.style.setProperty('--rae-head-x','0px');this.root.style.setProperty('--rae-head-r','0deg')}
  setSpeakingLevel(level=0){this.root.style.setProperty('--rae-speech',String(clamp(0,level,1)))}
  pulseSpeech(text=''){if(this.reduced)return;const punctuation=/[.!?]\s*$/.test(text),energy=punctuation?.2:clamp(.2,.25+String(text).length/42,.9);this.setSpeakingLevel(energy);clearTimeout(this.speechTimer);this.speechTimer=setTimeout(()=>this.setSpeakingLevel(punctuation?0:.12),punctuation?180:95)}
  trigger(name){if(RAE_STATES.includes(name))this.setState(name);else if(name==='blink')this.blink();else if(name==='wake')this.wake();else if(name==='sleep')this.sleep()}
  blink(double=false){if(this.reduced||this.sleeping)return;this.root.classList.remove('rae-is-blinking','rae-is-double-blinking');void this.root.offsetWidth;this.root.classList.add(double?'rae-is-double-blinking':'rae-is-blinking');setTimeout(()=>this.root.classList.remove('rae-is-blinking','rae-is-double-blinking'),double?430:230)}
  scheduleBlink(){clearTimeout(this.blinkTimer);if(this.reduced)return;const delay=2500+Math.random()*3000+(Math.random()<.12?2200:0);this.blinkTimer=setTimeout(()=>{if(!document.hidden&&!['thinking','error','sleep','wink'].includes(this.state))this.blink(Math.random()<.12);this.scheduleBlink()},delay)}
  scheduleIdle(){
    clearTimeout(this.idleTimer);if(this.reduced)return;const delay=3600+Math.random()*5200;
    this.idleTimer=setTimeout(()=>{if(document.hidden||this.state!=='idle'){this.scheduleIdle();return}if(Date.now()-this.lastInteraction>65000){this.sleep();return}const pool=[{value:'glance-left',weight:3},{value:'glance-right',weight:3},{value:'tiny-lean',weight:2},{value:'soft-blink',weight:2.2},{value:'curiosity',weight:1.5},{value:'look-up',weight:1.1},{value:'micro-wink',weight:.65},{value:'settle',weight:2}].filter(item=>item.value!==this.lastIdle);const variant=weightedPick(pool);this.lastIdle=variant;this.root.dataset.raeIdle=variant;this.root.style.setProperty('--rae-breath-duration',`${(3.6+Math.random()*1.9).toFixed(2)}s`);if(variant==='soft-blink')this.blink();if(variant==='micro-wink'){this.setState('wink');this.scheduleIdle();return}setTimeout(()=>{if(this.root.dataset.raeIdle===variant)this.root.dataset.raeIdle='neutral'},900+Math.random()*650);this.scheduleIdle()},delay);
  }
  pointer(event){
    if(this.reduced||matchMedia('(pointer:coarse)').matches||this.sleeping||document.hidden)return;if(this.pointerFrame)return;
    this.pointerFrame=requestAnimationFrame(()=>{this.pointerFrame=0;const target=this.characters[0];if(!target)return;const rect=target.getBoundingClientRect(),cx=rect.left+rect.width/2,cy=rect.top+rect.height/2,distance=Math.hypot(event.clientX-cx,event.clientY-cy);if(distance>460){if(this.state==='attention')this.setState('idle');this.resetAttention();return}const x=clamp(-1,(event.clientX-cx)/Math.max(80,rect.width*2.2),1),y=clamp(-1,(event.clientY-cy)/Math.max(80,rect.height*2.2),1);this.setAttention({x,y});if(distance<170&&this.state==='idle')this.setState('attention')});
  }
  touchReact(){if(!this.reduced&&!['offline','error','listening','thinking','speaking'].includes(this.state)){this.setState('attention');setTimeout(()=>{if(this.state==='attention')this.setState('idle')},650)}}
  sleep(){if(this.state==='speaking'||this.state==='thinking')return;this.setState('sleep');this.resetAttention()}
  wake(){if(!this.sleeping)return;this.sleeping=false;this.setState('idle');this.scheduleBlink();this.scheduleIdle()}
  setVisible(value){this.visible=Boolean(value);this.root.toggleAttribute('data-rae-hidden',!this.visible)}
  dispose(){clearTimeout(this.bootTimer);clearTimeout(this.idleTimer);clearTimeout(this.blinkTimer);clearTimeout(this.speechTimer);clearTimeout(this.emotionTimer);if(this.pointerFrame)cancelAnimationFrame(this.pointerFrame);document.removeEventListener('visibilitychange',this.onVisibility);for(const [name,handler] of this.listeners)document.removeEventListener(name,handler);this.listeners=[]}
}

export const emitRae=(name,detail={})=>document.dispatchEvent(new CustomEvent(name,{detail}));
