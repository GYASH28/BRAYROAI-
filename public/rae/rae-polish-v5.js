const clean=value=>String(value??'').trim();

export function mountRaePolish(root,app){
  if(!root||root.dataset.raePolish==='v5')return()=>{};
  root.dataset.raePolish='v5';
  const feed=root.querySelector('[data-rae-feed]'),input=root.querySelector('[data-rae-input]'),status=root.querySelector('[data-rae-status]');
  if(input)input.placeholder=matchMedia('(max-width:700px)').matches?'Ask Rae about your project…':'Ask Rae about your project, plans or AI workflow…';
  if(status&&status.textContent==='READY')status.textContent='ONLINE';

  const enhanceStarter=()=>{
    if(!feed)return;const welcome=feed.querySelector('.rae-welcome');if(!welcome)return;
    feed.dataset.raeEmpty='true';welcome.classList.add('rae-welcome--v5');
    if(!welcome.querySelector('.rae-welcome__eyebrow')){const eyebrow=document.createElement('span');eyebrow.className='rae-welcome__eyebrow';eyebrow.textContent='USE RAE FOR';welcome.prepend(eyebrow)}
    if(!welcome.querySelector('.rae-welcome__actions')){
      const actions=document.createElement('div');actions.className='rae-welcome__actions';
      const prompts=(app?.ui?.pageInfo?.chips||['Compare plans','Show relevant work','Think through my project']).slice(0,3);
      for(const label of prompts){const button=document.createElement('button');button.type='button';button.className='rae-welcome__prompt';button.dataset.raePrompt=clean(label);button.textContent=clean(label);actions.append(button)}
      welcome.append(actions);
    }
  };
  const syncConversation=()=>{
    if(!feed)return;const hasMessage=Boolean(feed.querySelector('.rae-message'));feed.dataset.raeEmpty=String(!hasMessage);
    if(hasMessage)feed.querySelector('.rae-welcome')?.remove();else enhanceStarter();
  };
  const onRecovery=event=>{
    const attempt=Math.max(2,Number(event.detail?.attempt)||2);root.dataset.raeRecovering='true';
    if(status)status.textContent='RECONNECTING';
    app?.ui?.setStage?.('Switching connection…',attempt>2?'The first backups were busy too. I’m trying one last AI route instead of dropping your question.':'That AI route is busy. I’m trying a backup connection and keeping your question intact.');
    clearTimeout(root.__raeRecoveryTimer);root.__raeRecoveryTimer=setTimeout(()=>root.removeAttribute('data-rae-recovering'),5000);
  };
  enhanceStarter();
  const observer=feed?new MutationObserver(syncConversation):null;observer?.observe(feed,{childList:true,subtree:false});
  const statusObserver=status?new MutationObserver(()=>{if(status.textContent==='READY')status.textContent='ONLINE'}):null;statusObserver?.observe(status,{childList:true,characterData:true,subtree:true});
  document.addEventListener('rae:provider-recovery',onRecovery);
  return()=>{observer?.disconnect();statusObserver?.disconnect();document.removeEventListener('rae:provider-recovery',onRecovery);clearTimeout(root.__raeRecoveryTimer);root.removeAttribute('data-rae-polish');root.removeAttribute('data-rae-recovering')};
}
