import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const three=read('src/vendor/three-r186.js');
const license=read('src/vendor/THREE-LICENSE.txt');
const rae3d=read('src/rae-3d-island.js');
const islands=read('src/react-islands.js');
const ui=read('public/rae/rae-ui.js');
const raeCss=read('public/rae/rae-3d.css');
const signature=read('src/signature-scenes.js');
const signatureCss=read('public/v43-signature-scenes.css');
const vite=read('vite.config.mjs');

assert.ok(three.length>600000,'vendored Three.js r186 source should remain the official full ESM build');
assert.match(three,/REVISION\s*=\s*'186'/);
assert.match(license,/MIT License/);

assert.match(rae3d,/import \* as THREE from '.\/vendor\/three-r186\.js'/);
assert.match(rae3d,/WebGLRenderer/);
assert.match(rae3d,/Math\.min\(devicePixelRatio\|\|1/);
assert.match(rae3d,/document\.hidden/);
assert.match(rae3d,/IntersectionObserver/);
assert.match(rae3d,/navigator\.connection\?\.saveData/);
assert.match(rae3d,/prefers-reduced-motion: reduce/);
assert.match(rae3d,/matchMedia\('\(min-width:701px\)'\)/);
assert.match(rae3d,/root\.dataset\.raeDimensional='active'/);
assert.match(rae3d,/renderer\.dispose\(\)/);

assert.match(islands,/document\.addEventListener\('rae:opened'/);
assert.match(islands,/import\('\.\/rae-3d-island\.js'\)/);
assert.match(ui,/data-rae-3d-host/);
assert.match(raeCss,/data-rae-dimensional="active"/);
assert.match(raeCss,/@media\(max-width:700px\),\(prefers-reduced-motion:reduce\)/);

assert.match(signature,/data\.v43Inview/);
assert.match(signature,/ResizeObserver/);
assert.match(signature,/IntersectionObserver/);
assert.doesNotMatch(signature,/requestAnimationFrame/);
assert.match(signatureCss,/animation-play-state:paused/);
assert.match(signatureCss,/data-state="ai"\]\[data-v43-inview="true"/);
assert.match(signatureCss,/editorial-sequence\[data-phase="build"\]/);
assert.match(vite,/v43-signature-scenes\.css/);

console.log('V43 dimensional + signature integrity passed');
