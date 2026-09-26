import {readFileSync} from 'node:fs';

const read=path=>readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const assert=(condition,message)=>{if(!condition)throw new Error(message)};

const marketSwitcher=read('src/market-switcher.js');
const reactLoader=read('src/react-islands.js');
const reactIsland=read('src/react/market-switcher-island.js');
const planIsland=read('src/react/plan-finder-island.js');
const briefIsland=read('src/react/project-brief-island.js');
const signalIsland=read('src/react/ai-signal-island.js');
const marketApi=read('api/market.js');
const vite=read('vite.config.mjs');
const direction=read('public/direction-pass.js');
const motion=read('public/experience-motion-v16.js');
const cinematic=read('public/cinematic-v18.js');
const polish=read('public/cinematic-v20.js');
const home=read('index.html');
const plans=read('plans.html');
const config=JSON.parse(read('vercel.json'));
const pkg=JSON.parse(read('package.json'));

assert(marketSwitcher.includes("option('in'"),'India must remain a visible market choice');
assert(marketSwitcher.includes("India · INR")||marketSwitcher.includes("MARKETS[market]?.label"),'India trigger must use the market label');
assert(marketSwitcher.includes("brayro_market_manual"),'Manual market selection must persist to an edge-readable cookie');
assert(marketSwitcher.includes("fetch('/api/market'"),'Browser market detection fallback is missing');
assert(reactLoader.includes("import('./react/market-switcher-island.js')"),'React market island must stay lazy');
assert(reactIsland.includes("from 'react-dom/client'"),'React market island is not using React DOM');
assert(reactLoader.includes("import('./react/plan-finder-island.js')")&&reactLoader.includes("import('./react/project-brief-island.js')")&&reactLoader.includes("import('./react/ai-signal-island.js')"),'Interactive React islands must stay lazy');
assert(planIsland.includes("from 'react-dom/client'")&&briefIsland.includes("from 'react-dom/client'")&&signalIsland.includes("from 'react-dom/client'"),'Interactive islands are not using React DOM');
assert(plans.includes('data-react-plan-island')&&home.includes('data-react-brief-island'),'Decision React island hosts are missing from source pages');
assert(reactLoader.includes("host.closest('section')")&&!reactLoader.includes("if(canPreload){"),'Lazy island activation must observe a visible section and must not disable functionality for save-data visitors');
assert(polish.includes('class SceneVisibilityDirector')&&!polish.includes("addEventListener('scroll'"),'V20 duplicate homepage scroll director returned');
assert(cinematic.includes("'--v20-page'")&&cinematic.includes("'--v20-film-scan'")&&cinematic.includes("'--v20-founder-scan'"),'V18 must own the shared scroll-derived polish variables');
assert(vite.includes('data-react-islands'),'React island entry is not injected into built pages');
assert(marketApi.includes("x-vercel-ip-country"),'Market API must use Vercel country data');
assert(pkg.dependencies?.react==='19.3.0'&&pkg.dependencies?.['react-dom']==='19.3.0','React dependencies drifted from the audited version');
assert(direction.includes("brayro_intro_seen"),'Opening film session guard is missing');
assert(direction.includes('preload="metadata"'),'Opening film should not eagerly preload the full media body');
assert(!motion.includes("setTimeout(()=>{location.href=url.href},270)"),'Artificial 270ms navigation delay returned');

for(const [country,prefix] of [['AE','/ae'],['AU','/au']]){
  for(const route of ['/','/plans','/clients','/clients/fakhrimart','/ai-workflow-audit','/company-second-brain','/founder','/terms']){
    const destination=route==='/'?prefix:`${prefix}${route}`;
    const rule=config.redirects?.find(item=>item.source===route&&item.destination===destination&&item.has?.some(has=>has.type==='header'&&has.key==='x-vercel-ip-country'&&has.value===country));
    assert(rule,`Missing ${country} edge redirect for ${route}`);
    assert(rule.missing?.some(missing=>missing.type==='cookie'&&missing.key==='brayro_market_manual'),`Manual override guard missing for ${country} ${route}`);
  }
}

console.log('V29 market/performance integrity passed: India, edge detection, lazy React islands and one homepage scroll director are intact.');
