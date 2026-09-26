import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const cut=read('public/commercial-cut.js');
const islands=read('src/react-islands.js');
const v12=read('public/brayro-v12.js');

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

console.log('V44 startup budget integrity passed');
