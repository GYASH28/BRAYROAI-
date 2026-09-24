export const OFFERS=Object.freeze({
  'monthly-starter':{name:'Monthly Starter',kind:'monthly',prices:{in:'₹2,599/mo',ae:'AED 690/month',au:'A$390/month'}},
  'monthly-growth':{name:'Monthly Growth',kind:'monthly',prices:{in:'₹3,999/mo',ae:'AED 1,190/month',au:'A$690/month'}},
  'monthly-studio':{name:'Monthly Studio',kind:'monthly',prices:{in:'₹5,999+/mo',ae:'AED 1,990+/month',au:'A$1,190+/month'}},
  'launch-website':{name:'Launch Website',kind:'one-time',prices:{in:'₹9,999',ae:'AED 2,990',au:'A$1,490'}},
  'business-experience':{name:'Business Experience',kind:'one-time',prices:{in:'₹17,999',ae:'AED 5,990',au:'A$2,990'}},
  'premium-experience':{name:'Premium Experience',kind:'one-time',prices:{in:'₹25K–₹35K+',ae:'AED 9,990–14,990+',au:'A$5,900–8,900+'}},
  'ai-workflow-audit':{name:'AI Workflow Audit',kind:'one-time',prices:{in:'₹9,999',ae:'AED 2,490',au:'A$990'}},
  'company-second-brain':{name:'Company Second Brain',kind:'scoped',prices:{in:'₹29,999',ae:'AED 7,900',au:'A$4,900'}},
  'knowledge-care':{name:'Knowledge Care',kind:'monthly',prices:{in:'₹2,999/mo',ae:'AED 990/month',au:'A$590/month'}}
});
export const baseMarket=market=>market==='ae-ar'?'ae':market;
export function priceFor(id,market='in'){const offer=OFFERS[id];if(!offer)throw new Error(`Unknown offer ${id}`);return offer.prices[baseMarket(market)]||offer.prices.in}
export function leadText({market='in',offerId='',source='website',language='en'}={}){
  const place=market==='au'?'Australia':market.startsWith('ae')?'the UAE':'India';
  const offer=OFFERS[offerId];const item=offer?`${offer.name} shown at ${priceFor(offerId,market)}`:'a BRAYROAI project';
  if(language==='ar'){
    const arabicNames={'monthly-starter':'الخطة الشهرية الأساسية','monthly-growth':'الخطة الشهرية للنمو','monthly-studio':'الخطة الشهرية المتقدمة','launch-website':'موقع الإطلاق','business-experience':'تجربة الأعمال','premium-experience':'التجربة المميزة','ai-workflow-audit':'تدقيق سير العمل بالذكاء الاصطناعي','company-second-brain':'ذاكرة الشركة الذكية','knowledge-care':'رعاية المعرفة'};
    const arabicItem=offer?`${arabicNames[offerId]} بسعر منشور ${priceFor(offerId,market)}`:'مشروع مع BRAYROAI';
    return`مرحباً ياش، أتواصل من الإمارات بخصوص ${arabicItem}. الصفحة: ${source}. أود مناقشة النطاق والجدول الزمني.\n\nاسم الشركة:\nما أحتاج إلى بنائه أو تحسينه:\nالوقت المناسب:\nطريقة التواصل:`;
  }
  return`Hi Yash, I am contacting from ${place} about ${item}. Page: ${source}.\n\nBusiness / brand:\nWhat I need to improve or build:\nTarget timing:\nBest way to reach me:`;
}
