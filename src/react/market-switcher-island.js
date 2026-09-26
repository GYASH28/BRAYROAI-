import React from 'react';
import {ToggleGroup,ToggleGroupItem} from './ui/toggle-group.js';
import {createRoot} from 'react-dom/client';

const h=React.createElement;

const COPY={
  en:{
    label:'Choose your market',
    hint:'Prices and project context update with your choice.',
    current:'Current',
    detected:'Detected',
    markets:[
      {id:'in',code:'IN',name:'India',meta:'INR · English'},
      {id:'ae',code:'AE',name:'United Arab Emirates',meta:'AED · English / العربية'},
      {id:'au',code:'AU',name:'Australia',meta:'AUD · English'}
    ]
  },
  ar:{
    label:'اختر السوق',
    hint:'تتغير الأسعار وسياق المشروع حسب اختيارك.',
    current:'الحالي',
    detected:'تم التعرف',
    markets:[
      {id:'in',code:'IN',name:'الهند',meta:'INR · English'},
      {id:'ae',code:'AE',name:'الإمارات العربية المتحدة',meta:'AED · English / العربية'},
      {id:'au',code:'AU',name:'أستراليا',meta:'AUD · English'}
    ]
  }
};

function MarketSwitcherIsland({state}){
  const language=state.currentMarket==='ae-ar'?'ar':'en';
  const copy=COPY[language];
  const current=state.currentMarket.startsWith('ae')?'ae':state.currentMarket;
  const detected=state.detectedMarket?.startsWith('ae')?'ae':state.detectedMarket;

  return h('div',{className:'market-react'},
    h('div',{className:'market-react__intro'},
      h('strong',null,copy.label),
      h('span',null,copy.hint)
    ),
    h(ToggleGroup,{
      className:'market-react__grid',
      value:current,
      onValueChange:id=>window.BRAYRO_MARKET_SWITCHER?.select(id,'manual'),
      ariaLabel:copy.label,
      dir:language==='ar'?'rtl':'ltr'
    },
      copy.markets.map((item,index)=>{
        const isCurrent=current===item.id;
        const isDetected=detected===item.id&&!isCurrent;
        return h(ToggleGroupItem,{
          key:item.id,index,value:item.id,
          className:'market-react__choice'+(isCurrent?' is-current':'')+(isDetected?' is-detected':''),
          'data-market-choice':item.id
        },
          h('span',{className:'market-react__code','aria-hidden':'true'},item.code),
          h('span',{className:'market-react__copy'},
            h('strong',null,item.name),
            h('small',null,item.meta)
          ),
          (isCurrent||isDetected)?h('span',{className:'market-react__badge'},isCurrent?copy.current:copy.detected):null
        );
      })
    )
  );
}

export function mountMarketSwitcherIsland(){
  const host=document.querySelector('[data-react-market-island]');
  if(!host||host.dataset.reactMounted==='true')return;
  const controller=window.BRAYRO_MARKET_SWITCHER;
  if(!controller)return;
  host.dataset.reactMounted='true';
  host.hidden=false;
  const fallback=document.querySelector('[data-market-fallback]');
  createRoot(host).render(h(MarketSwitcherIsland,{state:controller.getState()}));
  fallback?.remove();
}
