(() => {
  const market=window.BRAYRO_MARKET;
  if(!market)return;
  const emit=(event,properties={})=>{
    const payload={event,market:market.id,language:market.locale,page:location.pathname,...properties};
    window.dispatchEvent(new CustomEvent('brayro:metric',{detail:payload}));
    if(Array.isArray(window.dataLayer))window.dataLayer.push(payload);
  };
  document.addEventListener('click',click=>{
    const choice=click.target.closest('[data-market-choice],[data-market-language-link]');
    if(choice){
      const next=choice.dataset.marketChoice||(market.id==='ae-ar'?'ae':'ae-ar');
      if(next!==market.id)emit(next.startsWith('ae')&&market.id.startsWith('ae')?'language_selected':'market_selected',{
        from_market:market.id,to_market:next,from_lang:market.locale,to_lang:next==='ae-ar'?'ar-AE':next==='ae'?'en-AE':'en-AU'
      });
    }
    const lead=click.target.closest('a[href^="https://wa.me/"],a[href^="mailto:"]');
    if(!lead)return;
    const channel=lead.href.startsWith('mailto:')?'email':'whatsapp';
    const planKey=lead.dataset.leadPlan||lead.closest('[data-offer-id]')?.dataset.offerId||'';
    const price=planKey?market.price(planKey)||'':'';
    emit('lead_started',{channel,plan_key:planKey,displayed_price:price,source_page:location.pathname});
    if(planKey)emit('plan_cta_clicked',{plan_key:planKey,channel,displayed_price:price});
  },{capture:true});
  document.addEventListener('rae:opened',()=>emit('rae_opened',{source_page:location.pathname}));
  const cards=[...document.querySelectorAll('[data-offer-id]')];
  if('IntersectionObserver'in window&&cards.length){
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries){if(!entry.isIntersecting)continue;const id=entry.target.dataset.offerId;emit('plan_viewed',{plan_key:id,displayed_price:market.price(id)||''});observer.unobserve(entry.target)}
    },{threshold:.45});
    cards.forEach(card=>observer.observe(card));
  }
})();
