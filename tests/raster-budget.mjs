import assert from 'node:assert/strict';
import {createRasterBudget} from '../src/site/raster-budget.js';

const play = (budget, interval, duration) => {
  const changes = [];
  for (let elapsed = 0; elapsed < duration; elapsed += interval) {
    const next = budget.sample(interval);
    if (next !== null) changes.push(next);
  }
  return changes;
};

// A steady 40fps workload must not be mistaken for spare raster capacity.
const pressured = createRasterBudget();
assert.deepEqual(play(pressured, .025, 12), [.85, .7]);
assert.deepEqual(play(pressured, .025, 12), []);
// Recovery is possible after sustained smooth frames, at both display cadences.
assert.deepEqual(play(pressured, 1 / 60, 15), [.85, 1]);
const highRefresh = createRasterBudget();
play(highRefresh, .025, 12);
assert.deepEqual(play(highRefresh, 1 / 120, 15), [.85, 1]);
// Short stalls and healthy frames must not produce resolution flicker.
const spikes = createRasterBudget();
play(spikes, 1 / 60, 2);
assert.equal(spikes.sample(.2), null);
assert.deepEqual(play(spikes, 1 / 60, 5), []);
// A resize, pause or context restoration discards old recovery credit.
const interrupted = createRasterBudget();
play(interrupted, .025, 12);
play(interrupted, 1 / 60, 4);
interrupted.reset();
assert.deepEqual(play(interrupted, 1 / 60, 5), []);
assert.deepEqual(play(interrupted, 1 / 60, 3), [.85]);
console.log('Raster budget: sustained pressure, recovery, spikes and interruption passed.');
