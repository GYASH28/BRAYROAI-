import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const runtime=read('src/react-islands-runtime.js');
const ui=read('public/rae/rae-ui.js');
const actor=read('public/rae/rae-character.js');
const signature=read('src/signature-scenes.js');
const signatureCss=read('public/v43-signature-scenes.css');
const vite=read('vite.config.mjs');

for(const path of ['src/rae-3d-island.js','src/vendor/three-r186.js','src/vendor/three.core.js','public/rae/rae-3d.css']){
  assert.ok(!existsSync(new URL('../'+path,import.meta.url)),`${path} must not ship`);
}
assert.doesNotMatch(runtime,/rae-3d|loadRaeDimensional|WebGLRenderer/);
assert.doesNotMatch(ui,/data-rae-3d-host|rae-dimensional-host/);
assert.match(ui,/characterMarkup\('stage'\)/);
assert.match(actor,/data-rae-vector="full-body"/);
assert.doesNotMatch(actor,/<image\b|<canvas\b/);

assert.match(signature,/dataset\.v43Inview/);
assert.match(signature,/ResizeObserver/);
assert.match(signature,/IntersectionObserver/);
assert.doesNotMatch(signature,/requestAnimationFrame/);
assert.match(signatureCss,/animation-play-state:paused/);
assert.match(signatureCss,/data-state="ai"\]\[data-v43-inview="true"/);
assert.match(signatureCss,/editorial-sequence\[data-phase="build"\]/);
assert.match(vite,/v43-signature-scenes\.css/);

console.log('SVG-only Rae and signature scenes integrity passed');
