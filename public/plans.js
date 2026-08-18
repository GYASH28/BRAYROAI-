(() => {
  const tabs=[...document.querySelectorAll('[data-price-tab]')];
  const panels=[...document.querySelectorAll('[data-price-panel]')];
  if(!tabs.length||!panels.length) return;

  const show=name=>{
    tabs.forEach(tab=>{
      const active=tab.dataset.priceTab===name;
      tab.classList.toggle('is-active',active);
      tab.setAttribute('aria-selected',String(active));
    });
    panels.forEach(panel=>panel.hidden=panel.dataset.pricePanel!==name);
    history.replaceState(null,'',`#${name}`);
  };

  tabs.forEach(tab=>tab.addEventListener('click',()=>show(tab.dataset.priceTab)));
  const initial=location.hash==='#ongoing'?'ongoing':'build';
  show(initial);
})();
