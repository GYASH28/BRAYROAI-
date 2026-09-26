import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const cutLoader=read('public/commercial-cut.js');
const cut=read('public/commercial-cut-runtime.js');
const islandsLoader=read('src/react-islands.js');
const islands=read('src/react-islands-runtime.js');
const v12=read('public/brayro-v12.js');
const direction=read('public/direction-pass.js');

assert.doesNotMatch(cut,/requestIdleCallback\(mount,\{timeout:1500\}\)/,'reveal setup must not re-enter the Lighthouse blocking window via the old idle timeout');
assert.match(cut,/passiveEvents=\['scroll','wheel','touchstart','pointerdown'\]/);
assert.match(cut,/addEventListener\('keydown',mount,\{once:true\}\)/);
assert.match(cut,/addEventListener\('hashchange',mount,\{once:true\}\)/);
assert.match(cut,/this\.groups=new Map\(\)/);
assert.match(cut,/item\.closest\('section,\[data-scene\],\[data-plan-scene\],\[data-founder-scene\]'\)/);
assert.match(cut,/requestAnimationFrame\(\(\)=>items\.forEach\(item=>item\.classList\.add\('is-visible'\)\)\)/);

assert.match(v12,/const startV12Reveal=\(\)=>/);
assert.match(v12,/passiveEvents=\['scroll','wheel','touchstart','pointerdown'\]/);
assert.match(v12,/this\.groups=new Map\(\)/);
assert.match(v12,/node\.closest\('section'\)\|\|node/);
assert.doesNotMatch(v12,/new V12Reveal\(\);\s*new FloatingHeader/,'V12 reveal must not mount synchronously on initial script evaluation');

assert.doesNotMatch(islands,/650px 0px/,'React islands should not prefetch hundreds of pixels below the first fold');
assert.match(islands,/rootMargin=\(saveData\?'80px 0px':'280px 0px'\)/);
assert.match(islands,/loadSignatureScenes,'0px 0px -12% 0px'/);
assert.match(islands,/mountViewportEnhancements\(\)/);
assert.match(islandsLoader,/mobile=matchMedia\('\(max-width:760px\)'\)\.matches/);
assert.match(islandsLoader,/events=\['scroll','wheel','touchstart','pointerdown'\]/);
assert.match(islandsLoader,/import\('\.\/react-islands-runtime\.js'\)/);
assert.match(cutLoader,/commercial-cut-runtime\.js/);
assert.match(cutLoader,/events=\['scroll','wheel','touchstart','pointerdown'\]/);

assert.match(direction,/introMobile&&!window\.__BRAYRO_DIRECTION_MOBILE_ACTIVE__/);
assert.match(direction,/direction-pass\.js\?mobile=1/);
assert.match(direction,/script\.dataset\.directionPassDeferred='true'/);
assert.match(direction,/if\(scrollY>0\|\|location\.hash\)queueMicrotask\(start\)/);

console.log('V44 startup budget integrity passed');
