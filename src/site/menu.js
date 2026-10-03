import './menu.css';

// Native dialog owns focus, dismissal and navigation. The preview only adds
// context to real links; it never substitutes another destination.
export function initMenu() {
 const menu=document.querySelector('#menu-dialog'),opener=document.querySelector('[data-menu-open]');
 if(!menu||!opener)return;
 const nav=menu.querySelector('nav'),links=[...nav.querySelectorAll('a')];
 const title=menu.querySelector('[data-menu-preview-title]'),summary=menu.querySelector('[data-menu-preview-summary]');
 const select=link=>{
  menu.dataset.menuScene=link.dataset.menuScene;
  title.textContent=link.querySelector('.menu-link-title').textContent;
  summary.textContent=link.querySelector('small').textContent;
 };
 const current=()=>nav.querySelector('a[aria-current="page"]')||links[0];
 const resting=()=>select(links.includes(document.activeElement)?document.activeElement:current());
 opener.setAttribute('aria-expanded','false');
 opener.addEventListener('click',()=>{select(current());menu.showModal();opener.setAttribute('aria-expanded','true')});
 menu.querySelector('[data-menu-close]').addEventListener('click',()=>menu.close());
 menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>menu.close()));
 links.forEach(link=>{link.addEventListener('pointerenter',()=>select(link));link.addEventListener('focus',()=>select(link))});
 nav.addEventListener('pointerleave',resting);
 menu.addEventListener('close',()=>opener.setAttribute('aria-expanded',String(menu.open)));
 // A drag beginning inside the sheet never becomes a backdrop dismissal.
 let backdropStart=false;
 const outside=event=>{const box=menu.getBoundingClientRect();return event.target===menu&&(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)};
 menu.addEventListener('pointerdown',event=>{backdropStart=outside(event)});
 menu.addEventListener('click',event=>{if(backdropStart&&outside(event))menu.close();backdropStart=false});
}
