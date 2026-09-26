import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

const toggle=read('src/react/ui/toggle-group.js');
const spotlight=read('src/react/ui/spotlight-card.js');
const magnetic=read('src/react/ui/magnetic-action.js');
const market=read('src/react/market-switcher-island.js');
const plan=read('src/react/plan-finder-island.js');
const brief=read('src/react/project-brief-island.js');
const ai=read('src/react/ai-signal-island.js');
const shell=read('public/global-shell.css');
const aiCss=read('public/ai-service-pages.css');
const manifest=read('docs/component-manifest-v42.md');

assert.match(toggle,/shadcn\/ui single-select Toggle Group/);
assert.match(toggle,/role:'radiogroup'/);
assert.match(toggle,/'aria-checked'/);
assert.match(toggle,/data-ui-source':'shadcn-toggle-group'/);
assert.match(market,/ToggleGroupItem/);
assert.match(plan,/ToggleGroupItem/);
assert.match(brief,/ToggleGroupItem/);

assert.match(spotlight,/React Bits Spotlight Card/);
assert.match(spotlight,/data-ui-source':'react-bits-spotlight-card'/);
assert.match(spotlight,/prefers-reduced-motion/);
assert.match(ai,/SpotlightCard/);
assert.match(aiCss,/--spotlight-x,50%/);

assert.match(magnetic,/21st\.dev magnetic interaction pattern/);
assert.match(magnetic,/data-ui-source':'21st-magnetic-action'/);
assert.match(magnetic,/maxOffset=8/);
assert.match(plan,/MagneticAction/);
assert.match(brief,/MagneticAction/);
assert.match(shell,/\.magnetic-action__surface/);
assert.match(shell,/pointer-events:none/);

assert.match(manifest,/shadcn\/ui Toggle Group/);
assert.match(manifest,/21st\.dev Magnetic/);
assert.match(manifest,/React Bits Spotlight Card/);
assert.match(manifest,/MIT \+ Commons Clause/);

console.log('V42 component-source integrity passed');
