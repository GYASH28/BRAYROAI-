import assert from 'node:assert/strict';
import {createPointBudget,createRasterBudget} from '../src/site/raster-budget.js';

const play = (budget, interval, duration) => {
  const changes = [];
  for (let elapsed = 0; elapsed < duration; elapsed += interval) {
    const next = budget.sample(interval);
    if (next !== null) changes.push(next);
  }
  return changes;
};

const raster = createRasterBudget();
assert.deepEqual(play(raster, .025, 8), [.85, .7, .55]);
assert.deepEqual(play(raster, .025, 4), []);
assert.deepEqual(play(raster, 1 / 60, 22), [.7, .85, 1]);

const spikes = createRasterBudget();
play(spikes, 1 / 60, 2);
assert.equal(spikes.sample(.2), null);
assert.deepEqual(play(spikes, 1 / 60, 5), []);

const interrupted = createRasterBudget();
play(interrupted, .025, 6);
play(interrupted, 1 / 60, 5);
interrupted.reset();
assert.deepEqual(play(interrupted, 1 / 60, 5), []);

const points = createPointBudget(9600);
assert.deepEqual(play(points, .025, 7), [7200, 5400, 4200, 3240]);
assert.deepEqual(play(points, .025, 4), []);
assert.deepEqual(play(points, 1 / 60, 38), [4200, 5400, 7200, 9600]);

const pointSpikes = createPointBudget(9600);
play(pointSpikes, 1 / 60, 2);
assert.equal(pointSpikes.sample(.12), null);
assert.deepEqual(play(pointSpikes, 1 / 60, 5), []);

console.log('Adaptive raster and particle budgets: pressure, recovery and spikes passed.');
