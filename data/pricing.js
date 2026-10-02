export const OFFERS=Object.freeze({
  'monthly-starter':{name:'Monthly Starter',kind:'monthly',prices:{in:'₹2,599/mo',ae:'AED 690/month',au:'A$390/month'}},
  'monthly-growth':{name:'Monthly Growth',kind:'monthly',prices:{in:'₹3,999/mo',ae:'AED 1,190/month',au:'A$690/month'}},
  'monthly-studio':{name:'Monthly Studio',kind:'monthly',prices:{in:'₹5,999+/mo',ae:'AED 1,990+/month',au:'A$1,190+/month'}},
  'launch-website':{name:'Website Starter',kind:'one-time',prices:{in:'₹2,599',ae:'AED 690',au:'A$390'}},
  'business-experience':{name:'Business Website',kind:'one-time',prices:{in:'₹3,999',ae:'AED 1,190',au:'A$690'}},
  'premium-experience':{name:'Premium Website',kind:'one-time',prices:{in:'₹5,999+',ae:'AED 1,990+',au:'A$1,190+'}},
  'ai-workflow-audit':{name:'AI Workflow Audit',kind:'one-time',prices:{in:'₹9,999',ae:'AED 2,490',au:'A$990'}},
  'company-second-brain':{name:'Company Second Brain',kind:'scoped',prices:{in:'₹29,999',ae:'AED 7,900',au:'A$4,900'}},
  'knowledge-care':{name:'Knowledge Care',kind:'monthly',prices:{in:'₹2,999/mo',ae:'AED 990/month',au:'A$590/month'}}
});
export function priceFor(id,market='in'){const offer=OFFERS[id];if(!offer)throw new Error(`Unknown offer ${id}`);return offer.prices[market]||offer.prices.in}
export function leadText({market='in',offerId='',source='website',brief=''}={}){
 const place=market==='au'?'Australia':market.startsWith('ae')?'the UAE':'India';
 const offer=OFFERS[offerId];const item=offer?`${offer.name} shown at ${priceFor(offerId,market)}`:'a BRAYROAI project';
 return`Hi Yash, I am contacting from ${place} about ${item}. Page: ${source}.${brief?`\n\nMy brief: ${String(brief).slice(0,700)}`:''}\n\nBusiness / brand:\nTarget timing:\nBest way to reach me:`;
}
