import * as THREE from './vendor/three-r186.js';

const STYLE_HREF='/rae/rae-3d.css';
const clamp=(min,value,max)=>Math.min(max,Math.max(min,value));
const lerp=(a,b,t)=>a+(b-a)*t;
const capable=()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop=matchMedia('(min-width:701px)').matches;
  const saveData=Boolean(navigator.connection?.saveData);
  const memory=Number(navigator.deviceMemory||8);
  const cores=Number(navigator.hardwareConcurrency||8);
  return desktop&&!reduced&&!saveData&&memory>=4&&cores>=4;
};
const ensureStyle=()=>{
  if(document.querySelector('link[data-rae-3d-style]'))return;
  const link=document.createElement('link');
  link.rel='stylesheet';link.href=STYLE_HREF;link.dataset.rae3dStyle='v43';
  document.head.append(link);
};
const applyTransform=(object,{position,scale,rotation}={})=>{
  if(position)object.position.set(...position);
  if(scale)object.scale.set(...scale);
  if(rotation)object.rotation.set(...rotation);
  return object;
};
const mesh=(geometry,material,options={})=>applyTransform(new THREE.Mesh(geometry,material),options);

function createRaeModel(){
  const geometries=new Set();
  const sphere=new THREE.SphereGeometry(1,28,18);geometries.add(sphere);
  const cylinder=new THREE.CylinderGeometry(1,1,2,18,1,false);geometries.add(cylinder);
  const box=new THREE.BoxGeometry(2,2,2);geometries.add(box);
  const cone=new THREE.ConeGeometry(1,2,4,1,false);geometries.add(cone);
  const disc=new THREE.CylinderGeometry(1,1,.5,24);geometries.add(disc);
  const torus=new THREE.TorusGeometry(.23,.03,8,24,Math.PI);geometries.add(torus);
  const circle=new THREE.CircleGeometry(1,32);geometries.add(circle);

  const materials={
    shell:new THREE.MeshStandardMaterial({color:0xf7f1e6,roughness:.46,metalness:.08}),
    shellShade:new THREE.MeshStandardMaterial({color:0xd7ccbd,roughness:.55,metalness:.06}),
    ink:new THREE.MeshStandardMaterial({color:0x0e0e12,roughness:.24,metalness:.48}),
    visor:new THREE.MeshStandardMaterial({color:0x05060a,roughness:.12,metalness:.72}),
    orange:new THREE.MeshStandardMaterial({color:0xff7818,emissive:0xff4f0d,emissiveIntensity:2.1,roughness:.3,metalness:.12}),
    eye:new THREE.MeshStandardMaterial({color:0xffb13b,emissive:0xff6a12,emissiveIntensity:4.2,roughness:.18,metalness:.04}),
    shadow:new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.24,depthWrite:false})
  };
  const root=new THREE.Group();root.name='RaeV43';
  const body=new THREE.Group();root.add(body);

  const shadow=mesh(circle,materials.shadow,{position:[0,-2.02,-.15],scale:[1.18,.34,1],rotation:[-Math.PI/2,0,0]});root.add(shadow);

  const torso=new THREE.Group();torso.position.set(0,-.05,0);body.add(torso);
  torso.add(mesh(sphere,materials.shell,{scale:[.78,.84,.48]}));
  torso.add(mesh(sphere,materials.ink,{position:[0,-.58,.04],scale:[.63,.28,.42]}));
  torso.add(mesh(box,materials.orange,{position:[0,.12,.49],scale:[.22,.045,.035]}));

  const head=new THREE.Group();head.position.set(0,1.38,0);body.add(head);
  head.add(mesh(sphere,materials.shell,{scale:[1.22,.98,.78]}));
  const visor=mesh(sphere,materials.visor,{position:[0,-.05,.69],scale:[.93,.63,.16]});head.add(visor);
  const visorRim=mesh(sphere,materials.shellShade,{position:[0,-.05,.65],scale:[.99,.69,.12]});head.add(visorRim);visorRim.renderOrder=-1;
  visor.renderOrder=1;

  const eyeL=mesh(sphere,materials.eye,{position:[-.34,.02,.87],scale:[.105,.16,.055]});
  const eyeR=mesh(sphere,materials.eye,{position:[.34,.02,.87],scale:[.105,.16,.055]});
  eyeL.renderOrder=2;eyeR.renderOrder=2;head.add(eyeL,eyeR);
  const mouth=mesh(torus,materials.orange,{position:[0,-.31,.89],rotation:[0,0,Math.PI],scale:[.78,.78,.78]});mouth.renderOrder=2;head.add(mouth);

  for(const side of [-1,1]){
    head.add(mesh(disc,materials.ink,{position:[side*1.18,.02,.08],scale:[.24,.24,.24],rotation:[Math.PI/2,0,0]}));
    head.add(mesh(disc,materials.orange,{position:[side*1.18,.02,.16],scale:[.14,.14,.08],rotation:[Math.PI/2,0,0]}));
    head.add(mesh(cone,materials.shellShade,{position:[side*1.25,.54,-.03],scale:[.18,.38,.16],rotation:[0,0,side*-.28]}));
    head.add(mesh(cone,materials.orange,{position:[side*1.27,.57,.05],scale:[.065,.24,.055],rotation:[0,0,side*-.28]}));
  }

  const makeArm=side=>{
    const arm=new THREE.Group();arm.position.set(side*.84,.22,0);body.add(arm);
    arm.add(mesh(sphere,materials.ink,{scale:[.22,.22,.22]}));
    arm.add(mesh(sphere,materials.shell,{scale:[.27,.25,.25]}));
    arm.add(mesh(cylinder,materials.ink,{position:[side*.03,-.38,0],scale:[.13,.34,.13],rotation:[0,0,side*-.08]}));
    arm.add(mesh(sphere,materials.ink,{position:[side*.055,-.76,0],scale:[.16,.16,.16]}));
    arm.add(mesh(cylinder,materials.shell,{position:[side*.08,-1.06,0],scale:[.14,.28,.14],rotation:[0,0,side*-.06]}));
    arm.add(mesh(box,materials.orange,{position:[side*.08,-1.04,.15],scale:[.035,.12,.025]}));
    arm.add(mesh(sphere,materials.ink,{position:[side*.1,-1.39,.03],scale:[.18,.16,.14]}));
    arm.rotation.z=side*.08;
    return arm;
  };
  const leftArm=makeArm(-1),rightArm=makeArm(1);

  const makeLeg=side=>{
    const leg=new THREE.Group();leg.position.set(side*.4,-.7,0);body.add(leg);
    leg.add(mesh(sphere,materials.ink,{scale:[.2,.2,.2]}));
    leg.add(mesh(cylinder,materials.shell,{position:[0,-.36,0],scale:[.16,.33,.16]}));
    leg.add(mesh(box,materials.orange,{position:[side*.11,-.37,.16],scale:[.035,.12,.025]}));
    leg.add(mesh(sphere,materials.ink,{position:[0,-.75,0],scale:[.17,.17,.17]}));
    leg.add(mesh(cylinder,materials.shellShade,{position:[0,-1.03,0],scale:[.15,.26,.15]}));
    leg.add(mesh(box,materials.shell,{position:[side*.03,-1.36,.12],scale:[.31,.16,.48]}));
    leg.add(mesh(box,materials.ink,{position:[side*.03,-1.46,.17],scale:[.33,.075,.5]}));
    leg.add(mesh(box,materials.orange,{position:[side*.03,-1.45,.69],scale:[.19,.035,.025]}));
    return leg;
  };
  const leftLeg=makeLeg(-1),rightLeg=makeLeg(1);

  root.rotation.x=-.035;
  root.position.y=.18;
  return{
    root,materials,geometries,
    refs:{body,torso,head,leftArm,rightArm,leftLeg,rightLeg,eyeL,eyeR,mouth,shadow},
    dispose(){for(const geometry of geometries)geometry.dispose();for(const material of Object.values(materials))material.dispose()}
  };
}

export function mountRaeDimensional(){
  const root=document.querySelector('[data-rae-root]');
  const host=root?.querySelector('[data-rae-3d-host]');
  if(!root||!host||host.dataset.rae3dMounted)return null;
  host.dataset.rae3dMounted='true';
  if(!capable()){root.dataset.raeDimensional='fallback';return null}
  ensureStyle();

  let renderer;
  try{
    renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
  }catch(error){
    root.dataset.raeDimensional='fallback';console.warn('Rae dimensional renderer unavailable',error);return null;
  }

  renderer.setClearColor(0x000000,0);
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,Number(navigator.deviceMemory||8)<=4?1.25:1.5));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.04;
  renderer.domElement.setAttribute('aria-hidden','true');
  renderer.domElement.tabIndex=-1;
  host.append(renderer.domElement);

  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(28,1,.1,30);
  camera.position.set(0,.6,8.4);
  camera.lookAt(0,.35,0);
  scene.add(new THREE.HemisphereLight(0xfff6e8,0x11131b,2.15));
  const key=new THREE.DirectionalLight(0xffffff,3.4);key.position.set(-3,5,5);scene.add(key);
  const rim=new THREE.DirectionalLight(0xff7a18,2.3);rim.position.set(4,1,3);scene.add(rim);
  const glow=new THREE.PointLight(0xff6a18,6,7,2);glow.position.set(0,.8,3.4);scene.add(glow);

  const model=createRaeModel();scene.add(model.root);
  const refs=model.refs;
  const pointer={x:0,y:0};
  let width=0,height=0,frame=0,last=performance.now(),running=false,inView=true,disposed=false;

  const syncSize=()=>{
    const nextW=Math.max(1,host.clientWidth),nextH=Math.max(1,host.clientHeight);
    if(nextW===width&&nextH===height)return;
    width=nextW;height=nextH;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();
  };
  const targetPose=state=>{
    const pose={headZ:0,headY:0,headX:0,armL:.08,armR:-.08,bodyZ:0,eyeY:1,mouth:1};
    if(state==='opening'){pose.headZ=.08;pose.armR=-.42}
    else if(state==='attention'||state==='curious'){pose.headZ=-.09;pose.headY=.08;pose.armR=-.2}
    else if(state==='listening'){pose.headZ=.06;pose.headY=-.08;pose.armL=.2}
    else if(state==='thinking'){pose.headZ=-.12;pose.headY=.16;pose.armL=.14;pose.armR=-.18}
    else if(state==='speaking'){pose.armR=-.38;pose.headZ=.03}
    else if(['positive','proud'].includes(state)){pose.headZ=-.06;pose.armR=-.28;pose.eyeY=.72;pose.mouth=1.15}
    else if(state==='playful'||state==='wink'){pose.headZ=.13;pose.headY=-.12;pose.armL=.3;pose.eyeY=.72}
    else if(state==='confused'||state==='skeptical'){pose.headZ=-.14;pose.headY=.18;pose.mouth=.82}
    else if(state==='surprised'){pose.eyeY=1.2;pose.mouth=.7}
    else if(state==='celebrate'){pose.armL=.86;pose.armR=-.86;pose.headZ=.08;pose.eyeY=.8}
    else if(state==='error'||state==='offline'){pose.headZ=-.1;pose.eyeY=.6;pose.mouth=.72}
    else if(state==='sleep'){pose.headZ=-.12;pose.headX=.12;pose.eyeY=.08;pose.armL=.02;pose.armR=-.02}
    return pose;
  };
  const update=(now,dt)=>{
    const state=root.dataset.raeState||'idle',pose=targetPose(state);
    const ease=1-Math.exp(-dt*8.5),slow=now*.001;
    const active=!['sleep','offline','error'].includes(state);
    const bob=active&&state!=='thinking'?Math.sin(slow*2.25)*.025:0;
    refs.body.position.y=lerp(refs.body.position.y,bob,ease);
    refs.body.rotation.z=lerp(refs.body.rotation.z,pose.bodyZ,ease);
    refs.head.rotation.z=lerp(refs.head.rotation.z,pose.headZ,ease);
    refs.head.rotation.y=lerp(refs.head.rotation.y,pose.headY+pointer.x*.11,ease);
    refs.head.rotation.x=lerp(refs.head.rotation.x,pose.headX-pointer.y*.055,ease);
    const speaking=state==='speaking'?Math.sin(slow*5.2)*.1:0;
    refs.leftArm.rotation.z=lerp(refs.leftArm.rotation.z,pose.armL+(state==='celebrate'?Math.sin(slow*7)*.06:0),ease);
    refs.rightArm.rotation.z=lerp(refs.rightArm.rotation.z,pose.armR+speaking,ease);
    const blink=root.classList.contains('rae-is-blinking')||root.classList.contains('rae-is-double-blinking');
    const eyeY=blink?.08:pose.eyeY;
    refs.eyeL.scale.y=lerp(refs.eyeL.scale.y,.16*eyeY,ease*1.7);
    refs.eyeR.scale.y=lerp(refs.eyeR.scale.y,.16*eyeY,ease*1.7);
    refs.mouth.scale.x=lerp(refs.mouth.scale.x,.78*pose.mouth,ease);
    model.materials.eye.emissiveIntensity=lerp(model.materials.eye.emissiveIntensity,state==='speaking'?5.3:state==='sleep'?.8:4.2,ease);
    model.root.rotation.y=lerp(model.root.rotation.y,pointer.x*.055,ease);
  };
  const renderOnce=()=>{syncSize();renderer.render(scene,camera)};
  const tick=now=>{
    if(!running||disposed)return;frame=requestAnimationFrame(tick);
    const dt=clamp(.001,(now-last)/1000,.05);last=now;update(now,dt);renderOnce();
  };
  const start=()=>{
    if(disposed||running||document.hidden||!inView||!root.classList.contains('is-open'))return;
    running=true;last=performance.now();frame=requestAnimationFrame(tick);
  };
  const stop=()=>{running=false;if(frame){cancelAnimationFrame(frame);frame=0}};
  const onOpen=()=>start(),onClose=()=>{stop();renderOnce()},onVisibility=()=>document.hidden?stop():start();
  const onPointer=event=>{if(!running)return;pointer.x=clamp(-1,(event.clientX/Math.max(innerWidth,1)-.5)*2,1);pointer.y=clamp(-1,(event.clientY/Math.max(innerHeight,1)-.5)*2,1)};
  const resizeObserver=new ResizeObserver(()=>{syncSize();if(!running)renderOnce()});resizeObserver.observe(host);
  const intersectionObserver='IntersectionObserver'in window?new IntersectionObserver(entries=>{inView=entries.some(entry=>entry.isIntersecting);inView?start():stop()},{threshold:.05}):null;
  intersectionObserver?.observe(host);
  document.addEventListener('rae:opened',onOpen);document.addEventListener('rae:closed',onClose);document.addEventListener('visibilitychange',onVisibility);
  addEventListener('pointermove',onPointer,{passive:true});

  try{
    renderOnce();root.dataset.raeDimensional='active';host.dataset.rae3dReady='true';start();
  }catch(error){
    root.dataset.raeDimensional='fallback';console.warn('Rae dimensional scene skipped',error);stop();
  }

  return()=>{
    disposed=true;stop();resizeObserver.disconnect();intersectionObserver?.disconnect();
    document.removeEventListener('rae:opened',onOpen);document.removeEventListener('rae:closed',onClose);document.removeEventListener('visibilitychange',onVisibility);removeEventListener('pointermove',onPointer);
    model.dispose();renderer.dispose();renderer.domElement.remove();delete root.dataset.raeDimensional;
  };
}
