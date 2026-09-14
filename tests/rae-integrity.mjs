import fs from 'node:fs';

const read=file=>fs.readFileSync(file,'utf8');
const errors=[];
const expect=(condition,message)=>{if(!condition)errors.push(message)};
const files={
  bootstrap:read('public/rae.js'),css:read('public/rae.css'),characterCss:read('public/rae/rae-character-v2.css'),emotionCss:read('public/rae/rae-character-emotions.css'),app:read('public/rae/rae-app.js'),director:read('public/rae/rae-director.js'),ui:read('public/rae/rae-ui.js'),transport:read('public/rae/rae-chat-client.js'),actions:read('public/rae/rae-actions.js'),context:read('public/rae/rae-context.js'),character:read('public/rae/rae-character.js'),contactCss:read('public/contact-priority.css'),contactJs:read('public/contact-priority.js'),api:read('api/rae-chat.js'),knowledge:read('api/_rae-knowledge.js'),vite:read('vite.config.mjs'),pkg:read('package.json')
};

for(const token of ['class RaeBootstrap','import(\'/rae/rae-app.js\')','Chat with Rae, BRAYROAI AI assistant','showFallback()'])expect(files.bootstrap.includes(token),`Rae bootstrap missing ${token}`);
expect(files.bootstrap.includes('shellCharacter')&&files.bootstrap.includes('linearGradient id="rs"')&&files.bootstrap.includes('stroke="#ff6a20"'),'Rae bootstrap launcher must visually match the production ivory/visor/orange character');
for(const token of ['class RaeDirector','setState(next)','setAttention','setSpeakingLevel','scheduleBlink','scheduleIdle','pulseSpeech','sleep()','wake()','rae:first-token','rae:stream-chunk','mountEmotionSkin'])expect(files.director.includes(token),`Rae director missing ${token}`);
for(const state of ['boot','idle','attention','opening','listening','thinking','speaking','positive','curious','confused','surprised','playful','proud','shy','skeptical','laughing','wink','error','offline','celebrate','sleep'])expect(files.director.includes(`'${state}'`),`Rae state missing ${state}`);
for(const token of ["confused:'confused'","surprised:'surprised'","playful:'playful'","proud:'proud'","skeptical:'skeptical'","laughing:'laughing'","wink:'wink'"])expect(files.director.includes(token),`Rae emotion bridge missing ${token}`);
for(const token of ['data-rae-rig="v3"','rae-character__head','rae-character__visor','rae-character__eyes','rae-character__pupil','rae-character__brows','rae-character__mouth','rae-character__arm','rae-character__hand','rae-character__leg','rae-character__foot','rae-character__ear-ring-light','rae-character__chest-light','rae-character__spark'])expect(files.character.includes(token),`Detailed Rae V3 rig missing ${token}`);
for(const token of ['ensureRaeCharacterSkin','/rae/rae-character-v2.css','linearGradient','radialGradient','rae-character__shoulder-shell','rae-character__calf-panel'])expect(files.character.includes(token),`Rae production character construction missing ${token}`);
for(const token of ['data-rae-rig="v3"','raeV3Breathe','raeV3ThinkHead','raeV3Wave','raeV3ListenPulse','raeV3SpeakingArm','raeV3Celebrate','data-state="thinking"','data-state="speaking"','data-state="sleep"','prefers-reduced-motion'])expect(files.characterCss.includes(token),`Rae character skin missing ${token}`);
for(const token of ['data-state="surprised"','data-state="playful"','data-state="proud"','data-state="shy"','data-state="skeptical"','data-state="laughing"','data-state="wink"','raeV3SurpriseFlash','raeV3ProudGlow','raeV3LaughBody'])expect(files.emotionCss.includes(token),`Rae extended emotion skin missing ${token}`);
for(const token of ['Rae V4 completion pass','BRAYROAI / PROJECT COMPANION','body.rae-dialog-open::after','width:100vw','opacity:1;scale:1;translate:0 0'])expect(files.emotionCss.includes(token),`Rae V4 presentation contract missing ${token}`);
expect(files.director.includes('/rae/rae-character-emotions.css'),'Rae director must lazy-load the extended emotion skin');
expect(!/<canvas|THREE\.|WebGLRenderingContext|requestAnimationFrame\s*\([^)]*render/i.test(files.character),'Detailed Rae executable rig must remain SVG/CSS rather than a permanent canvas/WebGL render loop');
for(const token of ['role="dialog"','aria-modal="true"','data-rae-stop','data-rae-live','visualViewport','trapFocus','Continue on WhatsApp','rae-card'])expect(files.ui.includes(token),`Rae accessible UI missing ${token}`);
expect(files.ui.includes('settleFocus(target,expectOpen)')&&files.ui.includes('const delays=[0,72,180,360,620]')&&files.ui.includes('this.settleFocus(this.input,true)')&&files.ui.includes('this.settleFocus(target,false)'),'Rae dialog focus must settle across open/close visibility and native-button timing');
for(const token of ['text/event-stream','AbortController','parsePacket','event:'])expect(files.transport.includes(token),`Rae streaming client missing ${token}`);
for(const token of ['navigateToRoute','scrollToSection','openProject','showPlan','highlightElement','ROUTES','SECTIONS'])expect(files.actions.includes(token),`Rae safe action layer missing ${token}`);
for(const token of ['sessionStorage','rae:v2:session','PAGE_INFO','IntersectionObserver'])expect(files.context.includes(token),`Rae context/session layer missing ${token}`);
for(const token of ['RaeChatClient','RaeDirector','RaeActions','safeActionFromPrompt','resolveCollisions','startProject','installCollisionObservers','data-rae-avoid','rae-conversation-open'])expect(files.app.includes(token),`Rae app orchestration missing ${token}`);
for(const token of ['rae-stage','rae-card','rae-stop','100dvh','safe-area-inset-bottom','prefers-reduced-motion','rae-is-blinking','raeBreathe','raeBlink','raeThinkHead'])expect(files.css.includes(token),`Rae CSS missing ${token}`);
expect(files.contactJs.includes("dock.dataset.raeAvoid='contact-dock'")&&files.contactJs.includes('brayro:contact-dock-ready'),'Contact dock must announce itself to Rae collision management');
expect(files.contactCss.includes('body.rae-conversation-open .brayro-contact-dock')&&files.contactCss.includes('pointer-events:none'),'Contact dock must visually yield the bottom-right corner while Rae is open');
expect(!/transition\s*:\s*all/i.test(files.css+files.characterCss+files.emotionCss),'Rae CSS must not use transition: all');
expect(!/backdrop-filter/i.test(files.css+files.characterCss+files.emotionCss),'Rae must not add backdrop-filter cost');
expect(files.api.includes("streamGenerateContent?alt=sse")&&files.api.includes('/chat/completions'),'Rae API must support real streaming providers');
expect(files.api.includes('RAE_PROVIDER')&&files.api.includes('RAE_MODEL'),'Rae provider abstraction env contract missing');
expect(files.api.includes('Never invent prices')&&files.api.includes('smallest sensible scope'),'Rae server persona truth/sales guard missing');
expect(files.api.includes('socialEmotion')&&files.api.includes("PROMPT_VERSION='rae-real-v2'"),'Rae conversational emotion/persona contract missing');
expect(files.knowledge.includes('₹2,599/month')&&files.knowledge.includes('₹9,999')&&files.knowledge.includes('₹17,999')&&files.knowledge.includes('₹25K–₹35K+')&&files.knowledge.includes('from ₹29,999'),'Verified Rae pricing knowledge drifted');
expect(files.knowledge.includes('FakhriMart')&&files.knowledge.includes('fakhriyarns.vercel.app'),'Verified client knowledge missing');
expect(files.vite.includes("'rae.css'")&&files.vite.includes('/rae.js'),'Vite does not mount Rae');
expect(files.pkg.includes('public/rae/rae-app.js')&&files.pkg.includes('api/rae-chat.js'),'Syntax suite does not guard modular Rae');
const clientBytes=['bootstrap','app','director','ui','transport','actions','context','character'].reduce((sum,key)=>sum+Buffer.byteLength(files[key]),0);
expect(clientBytes<118000,`Rae modular JS exceeds 118KB guardrail (${clientBytes})`);
expect(Buffer.byteLength(files.css)<32000,'Rae base CSS exceeds 32KB guardrail');
expect(Buffer.byteLength(files.characterCss)<26000,'Rae character skin exceeds 26KB guardrail');
expect(Buffer.byteLength(files.emotionCss)<18000,'Rae emotion/presentation skin exceeds 18KB lazy-load guardrail');
expect(Buffer.byteLength(files.api)<26000,'Rae API exceeds 26KB guardrail');

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log(`Rae integrity OK: ${clientBytes}B modular client, detailed V3 ivory/visor character rig, V4 presentation polish, 21 emotional states, real streaming AI, safe actions, contact-dock clearance and verified knowledge.`);
