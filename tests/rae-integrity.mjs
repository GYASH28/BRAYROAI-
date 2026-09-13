import fs from 'node:fs';

const read=file=>fs.readFileSync(file,'utf8');
const errors=[];
const expect=(condition,message)=>{if(!condition)errors.push(message)};
const files={
  bootstrap:read('public/rae.js'),css:read('public/rae.css'),app:read('public/rae/rae-app.js'),director:read('public/rae/rae-director.js'),ui:read('public/rae/rae-ui.js'),transport:read('public/rae/rae-chat-client.js'),actions:read('public/rae/rae-actions.js'),context:read('public/rae/rae-context.js'),character:read('public/rae/rae-character.js'),api:read('api/rae-chat.js'),knowledge:read('api/_rae-knowledge.js'),vite:read('vite.config.mjs'),pkg:read('package.json')
};

for(const token of ['class RaeBootstrap','import(\'/rae/rae-app.js\')','Chat with Rae, BRAYROAI AI assistant','showFallback()'])expect(files.bootstrap.includes(token),`Rae bootstrap missing ${token}`);
for(const token of ['class RaeDirector','setState(next)','setAttention','setSpeakingLevel','scheduleBlink','scheduleIdle','pulseSpeech','sleep()','wake()','rae:first-token','rae:stream-chunk'])expect(files.director.includes(token),`Rae director missing ${token}`);
for(const state of ['boot','idle','attention','opening','listening','thinking','speaking','positive','curious','confused','error','offline','celebrate','sleep'])expect(files.director.includes(`'${state}'`),`Rae state missing ${state}`);
for(const token of ['rae-character__head','rae-character__eyes','rae-character__pupil','rae-character__brows','rae-character__mouth','rae-character__arm','rae-character__spark'])expect(files.character.includes(token),`Layered Rae rig missing ${token}`);
for(const token of ['role="dialog"','aria-modal="true"','data-rae-stop','data-rae-live','visualViewport','trapFocus','Continue on WhatsApp','rae-card'])expect(files.ui.includes(token),`Rae accessible UI missing ${token}`);
for(const token of ['text/event-stream','AbortController','parsePacket','event:'])expect(files.transport.includes(token),`Rae streaming client missing ${token}`);
for(const token of ['navigateToRoute','scrollToSection','openProject','showPlan','highlightElement','ROUTES','SECTIONS'])expect(files.actions.includes(token),`Rae safe action layer missing ${token}`);
for(const token of ['sessionStorage','rae:v2:session','PAGE_INFO','IntersectionObserver'])expect(files.context.includes(token),`Rae context/session layer missing ${token}`);
for(const token of ['RaeChatClient','RaeDirector','RaeActions','safeActionFromPrompt','resolveCollisions','startProject'])expect(files.app.includes(token),`Rae app orchestration missing ${token}`);
for(const token of ['rae-stage','rae-card','rae-stop','100dvh','safe-area-inset-bottom','prefers-reduced-motion','rae-is-blinking','raeBreathe','raeBlink','raeThinkHead'])expect(files.css.includes(token),`Rae CSS missing ${token}`);
expect(!/transition\s*:\s*all/i.test(files.css),'Rae CSS must not use transition: all');
expect(!/backdrop-filter/i.test(files.css),'Rae must not add backdrop-filter cost');
expect(files.api.includes("streamGenerateContent?alt=sse")&&files.api.includes('/chat/completions'),'Rae API must support real streaming providers');
expect(files.api.includes('RAE_PROVIDER')&&files.api.includes('RAE_MODEL'),'Rae provider abstraction env contract missing');
expect(files.api.includes('Never invent prices')&&files.api.includes('smallest sensible scope'),'Rae server persona truth/sales guard missing');
expect(files.knowledge.includes('₹2,599/month')&&files.knowledge.includes('₹9,999')&&files.knowledge.includes('₹17,999')&&files.knowledge.includes('₹25K–₹35K+')&&files.knowledge.includes('from ₹29,999'),'Verified Rae pricing knowledge drifted');
expect(files.knowledge.includes('FakhriMart')&&files.knowledge.includes('fakhriyarns.vercel.app'),'Verified client knowledge missing');
expect(files.vite.includes("'rae.css'")&&files.vite.includes('/rae.js'),'Vite does not mount Rae');
expect(files.pkg.includes('public/rae/rae-app.js')&&files.pkg.includes('api/rae-chat.js'),'Syntax suite does not guard modular Rae');
const clientBytes=['bootstrap','app','director','ui','transport','actions','context','character'].reduce((sum,key)=>sum+Buffer.byteLength(files[key]),0);
expect(clientBytes<100000,`Rae modular JS exceeds 100KB guardrail (${clientBytes})`);
expect(Buffer.byteLength(files.css)<32000,'Rae CSS exceeds 32KB guardrail');
expect(Buffer.byteLength(files.api)<26000,'Rae API exceeds 26KB guardrail');

if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log(`Rae integrity OK: ${clientBytes}B modular client, layered actor, real streaming AI, safe actions and verified knowledge.`);
