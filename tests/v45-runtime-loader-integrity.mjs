import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const commercialLoader=read('public/commercial-cut.js');
const commercialRuntime=read('public/commercial-cut-runtime.js');
const reactLoader=read('src/react-islands.js');
const reactRuntime=read('src/react-islands-runtime.js');

assert.ok(commercialLoader.length<2200,'commercial mobile loader should stay tiny');
assert.ok(reactLoader.length<2600,'React islands mobile loader should stay tiny');
assert.ok(commercialRuntime.length>5000,'commercial runtime should remain outside the tiny loader');
assert.ok(reactRuntime.length>2500,'React orchestration should remain outside the tiny loader');

assert.match(commercialLoader,/matchMedia\('\(max-width:760px\)'\)\.matches/);
assert.match(commercialLoader,/commercial-cut-runtime\.js/);
assert.match(commercialLoader,/brayro:market-opened/);
assert.match(commercialLoader,/rae:opened/);
assert.match(commercialLoader,/scrollY>0\|\|location\.hash/);
assert.match(commercialRuntime,/class RevealDirector/);
assert.match(commercialRuntime,/class ColourDirector/);
assert.match(commercialRuntime,/class PageProgress/);

assert.match(reactLoader,/matchMedia\('\(max-width:760px\)'\)\.matches/);
assert.match(reactLoader,/import\('\.\/react-islands-runtime\.js'\)/);
assert.match(reactLoader,/brayro:market-opened/);
assert.match(reactLoader,/rae:opened/);
assert.match(reactRuntime,/export function startReactIslands/);
assert.match(reactRuntime,/loadRaeDimensional/);
assert.match(reactRuntime,/loadSignatureScenes/);
assert.match(reactRuntime,/mountViewportEnhancements/);

console.log('V45 mobile runtime loader integrity passed');
