export function initProjectPath(host){
 const surface=host.querySelector('[data-path-surface]'),panels=[...host.querySelectorAll('[data-path-panel]')];
 const choose=event=>{
  const value=event.target.value;
  if(!['website','monthly','ai'].includes(value))return;
  surface.dataset.pathSurface=value;
  for(const panel of panels)panel.hidden=panel.dataset.pathPanel!==value;
 };
 host.addEventListener('change',choose);
 return()=>host.removeEventListener('change',choose);
}
