export const MARKETS=Object.freeze({
  in:Object.freeze({id:'in',name:'India',label:'India · INR',locale:'en-IN',currency:'INR',prefix:'',contactName:'India'}),
  ae:Object.freeze({id:'ae',name:'United Arab Emirates',label:'UAE · AED',locale:'en-AE',currency:'AED',prefix:'/ae',contactName:'UAE'}),
  au:Object.freeze({id:'au',name:'Australia',label:'Australia · AUD',locale:'en-AU',currency:'AUD',prefix:'/au',contactName:'Australia'})
});
export const MARKET_ROUTES=Object.freeze(['/','/plans','/clients','/clients/fakhrimart','/founder','/terms']);
export const MARKET_PREFIXES=Object.freeze(['/ae','/au']);
export function splitMarketPath(pathname='/'){
  const prefix=MARKET_PREFIXES.find(value=>pathname===value||pathname.startsWith(value+'/'));
  const market=prefix==='/ae'?'ae':prefix==='/au'?'au':'in';
  const route=prefix?(pathname.slice(prefix.length)||'/'):pathname;
  return{market,route:MARKET_ROUTES.includes(route.replace(/\/$/,'')||'/')?(route.replace(/\/$/,'')||'/'):'/'};
}
export function marketRoute(market,route='/',hash=''){
  const prefix=MARKETS[market]?.prefix||'';
  return`${prefix}${route==='/'?'/':route}${hash||''}`;
}
