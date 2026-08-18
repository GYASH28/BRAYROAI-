(() => {
  const button=document.querySelector('[data-menu-button]');
  const menu=document.querySelector('[data-mobile-menu]');
  if(!button||!menu) return;
  const focusables=()=>[...menu.querySelectorAll('a[href],button:not([disabled])')].filter(el=>el.offsetParent!==null);
  document.addEventListener('keydown',event=>{
    if(event.key!=='Tab'||button.getAttribute('aria-expanded')!=='true') return;
    const items=focusables();
    if(!items.length) return;
    const first=items[0],last=items[items.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  });
  addEventListener('resize',()=>{
    if(innerWidth>760&&button.getAttribute('aria-expanded')==='true') button.click();
  },{passive:true});
})();
