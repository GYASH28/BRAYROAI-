const TAU = Math.PI * 2;
export const PARTICLE_COUNT = 9600;
export const PARTICLE_SEED = 0x4b524159;

function seededRandom(seed = PARTICLE_SEED) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

const smoothstep = (edge0, edge1, value) => {
  const amount = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  return amount * amount * (3 - 2 * amount);
};

function normal(random) {
  const u = Math.max(1e-7, random());
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * random());
}

function mixColor(from, to, amount) {
  return [
    from[0] + (to[0] - from[0]) * amount,
    from[1] + (to[1] - from[1]) * amount,
    from[2] + (to[2] - from[2]) * amount,
  ];
}

const BONE = [0.86, 0.84, 0.78];
const WHITE = [1, 0.985, 0.94];
const ORANGE = [1, 0.245, 0.055];
const COBALT = [0.2, 0.43, 1];

// Exact white mosaic tiles from static/brand/brayro-monogram.svg. The dark
// rounded plate and the two corner accents are deliberately not part of the
// particle mark.
const MONOGRAM_TILES = [
  [27, 111.5, 61.5, 61.5], [92, 111.5, 61.5, 29], [157, 111.5, 29, 29],
  [189.5, 144, 61.5, 29], [27, 176.5, 61.5, 61.5],
  [222, 176.5, 13.24, 13.24], [237.76, 176.5, 13.24, 13.24],
  [222, 192.26, 13.24, 13.24], [237.76, 192.26, 13.24, 13.24],
  [222, 209, 29, 29], [27, 241.5, 61.5, 61.5], [92, 241.5, 61.5, 29],
  [157, 241.5, 29, 29], [222, 274, 29, 61.5], [27, 306.5, 61.5, 61.5],
  [189.5, 339, 61.5, 29], [27, 371.5, 61.5, 29], [92, 371.5, 61.5, 29],
  [157, 371.5, 29, 29], [261, 111.5, 61.5, 61.5], [326, 111.5, 61.5, 29],
  [391, 111.5, 29, 29], [423.5, 144, 61.5, 29], [261, 176.5, 61.5, 61.5],
  [456, 176.5, 29, 61.5], [423.5, 209, 29, 29], [261, 241.5, 61.5, 61.5],
  [326, 241.5, 61.5, 29], [391, 241.5, 29, 61.5], [358.5, 274, 29, 29],
  [261, 306.5, 61.5, 61.5], [391, 306.5, 61.5, 29], [423.5, 339, 61.5, 29],
  [261, 371.5, 61.5, 29], [456, 371.5, 13.24, 13.24],
  [471.76, 371.5, 13.24, 13.24], [456, 387.26, 13.24, 13.24],
  [471.76, 387.26, 13.24, 13.24],
];

const MONOGRAM_SCALE = 0.0072;

function createMonogramPositions(count, seed) {
  const random = seededRandom(seed ^ 0x42524d4b);
  const positions = new Float32Array(count * 3);
  const areas = MONOGRAM_TILES.map(([, , width, height]) => width * height);
  const cumulativeAreas = [];
  let totalArea = 0;
  for (const area of areas) {
    totalArea += area;
    cumulativeAreas.push(totalArea);
  }

  let tileIndex = 0;
  for (let index = 0; index < count; index++) {
    // Stratifying the complete tile area keeps even the 13.24px mosaic chips
    // populated while remaining deterministic at every requested point count.
    const areaPosition = ((index + random()) / count) * totalArea;
    while (areaPosition > cumulativeAreas[tileIndex]) tileIndex++;
    const [tileX, tileY, width, height] = MONOGRAM_TILES[tileIndex];
    const areaBefore = tileIndex ? cumulativeAreas[tileIndex - 1] : 0;
    const localArea = areaPosition - areaBefore;
    const x = tileX + Math.min(width, localArea / height);
    const y = tileY + random() * height;
    const offset = index * 3;
    positions[offset] = (x - 256) * MONOGRAM_SCALE;
    positions[offset + 1] = (256 - y) * MONOGRAM_SCALE;
    positions[offset + 2] = Math.max(-0.065, Math.min(0.065, normal(random) * 0.022));
  }
  return positions;
}

const RIBBON_COUNT = 6;
const MARK_SHARE = 0.8;

function createLooseRibbons(count, seed) {
  const random = seededRandom(seed ^ 0x4c4f4f53);
  const positions = new Float32Array(count * 3);
  const ribbonIds = new Float32Array(count);
  const ribbonProgress = new Float32Array(count);
  const sparks = new Float32Array(count);
  const pointsPerRibbon = Math.ceil(count / RIBBON_COUNT);
  const depthLayers = [-0.82, 0.32, 0.96, -0.42, 0.68, -1.02];

  for (let index = 0; index < count; index++) {
    const ribbon = index % RIBBON_COUNT;
    const slot = Math.floor(index / RIBBON_COUNT);
    const rawProgress = Math.min(0.9999, (slot + random()) / pointsPerRibbon);
    const segmentCount = 6 + (ribbon % 2);
    const segment = Math.floor(rawProgress * segmentCount);
    const segmentProgress = (rawProgress * segmentCount) % 1;
    // Compress each ribbon segment to 72% of its interval. The untouched 28%
    // becomes an authored gap instead of relying on opacity or random deletion.
    const progress = (segment + segmentProgress * 0.72) / segmentCount;
    const wing = ribbon < 3 ? -1 : 1;
    const lane = ribbon % 3;
    const phase = ribbon * 0.83 + progress * TAU * (1.12 + lane * 0.18);
    const helixRadius = 0.14 + lane * 0.045;
    const silhouette = 0.92 + lane * 0.4 + Math.sin(progress * Math.PI) * (0.34 + lane * 0.1);
    const spark = ((slot * 11 + ribbon * 7) % 53) < 4 ? 1 : 0;
    const offset = index * 3;

    positions[offset] = wing * silhouette
      + Math.cos(phase) * helixRadius
      + Math.sin(progress * Math.PI * 3 + ribbon) * 0.055
      + normal(random) * 0.018;
    positions[offset + 1] = (progress - 0.5) * (3.22 + lane * 0.17)
      + Math.sin(phase) * (0.19 + lane * 0.035)
      + wing * Math.sin(progress * Math.PI * 1.35) * 0.11
      + normal(random) * 0.016;
    positions[offset + 2] = depthLayers[ribbon]
      + Math.sin(phase + ribbon * 0.3) * (0.29 + lane * 0.055)
      + (spark ? 0.48 + random() * 0.46 : 0)
      + normal(random) * 0.024;
    ribbonIds[index] = ribbon / (RIBBON_COUNT - 1);
    ribbonProgress[index] = progress;
    sparks[index] = spark;
  }

  return { positions, ribbonIds, ribbonProgress, sparks };
}

function createFormationTargets(count, seed) {
  const markCount = Math.floor(count * MARK_SHARE);
  const tilePositions = createMonogramPositions(markCount, seed);
  const positions = new Float32Array(count * 3);
  positions.set(tilePositions);
  const roles = new Float32Array(count);
  const random = seededRandom(seed ^ 0x4f524249);
  const frameCount = count - markCount;
  const pointsPerOrbit = Math.ceil(frameCount / RIBBON_COUNT);
  const orbitStarts = [-2.72, 0.1, 2.85, -0.32, 1.98, -3.04];
  const orbitSpans = [1.7, 1.42, 1.3, -1.48, -1.52, -1.18];

  for (let index = markCount; index < count; index++) {
    const frameIndex = index - markCount;
    const orbit = frameIndex % RIBBON_COUNT;
    const slot = Math.floor(frameIndex / RIBBON_COUNT);
    const progress = Math.min(1, (slot + random()) / pointsPerOrbit);
    const angle = orbitStarts[orbit] + progress * orbitSpans[orbit];
    const radiusX = 1.94 + (orbit % 3) * 0.24;
    const radiusY = 1.16 + (orbit % 2) * 0.2;
    const offset = index * 3;
    positions[offset] = Math.cos(angle) * radiusX
      + (orbit < 3 ? -0.12 : 0.14)
      + normal(random) * 0.018;
    positions[offset + 1] = Math.sin(angle) * radiusY
      + (orbit % 3 - 1) * 0.08
      + normal(random) * 0.014;
    positions[offset + 2] = (orbit - 2.5) * 0.13
      + Math.sin(angle * 1.7 + orbit) * 0.11
      + normal(random) * 0.018;
    roles[index] = 1;
  }

  return { positions, roles, markCount };
}

function createChoreography(loose, targets, count, seed) {
  const random = seededRandom(seed ^ 0x4355524c);
  const assemblyWindows = new Float32Array(count * 2);
  const choreography = new Float32Array(count * 4);
  const arcOffsets = new Float32Array(count * 3);
  const curlOffsets = new Float32Array(count * 3);
  const targetColors = new Float32Array(count * 3);

  for (let index = 0; index < count; index++) {
    const offset = index * 3;
    const ribbon = Math.round(loose.ribbonIds[index] * (RIBBON_COUNT - 1));
    const wing = ribbon < 3 ? -1 : 1;
    const role = targets.roles[index];
    const sequence = loose.ribbonProgress[index];
    const start = 0.035 + ribbon * 0.026 + sequence * 0.31 + role * 0.055
      + random() * 0.018;
    const end = Math.min(0.985, start + 0.34 + (ribbon % 3) * 0.045 + random() * 0.055);
    const arcPhase = ribbon * 1.07 + sequence * Math.PI * 1.6;
    const arcStrength = 0.42 + (ribbon % 3) * 0.13 + role * 0.16;

    assemblyWindows[index * 2] = start;
    assemblyWindows[index * 2 + 1] = end;
    choreography[index * 4] = start;
    choreography[index * 4 + 1] = end;
    choreography[index * 4 + 2] = role;
    choreography[index * 4 + 3] = loose.sparks[index];
    arcOffsets[offset] = wing * arcStrength;
    arcOffsets[offset + 1] = Math.sin(arcPhase) * (0.34 + role * 0.14);
    arcOffsets[offset + 2] = Math.cos(arcPhase) * (0.52 + role * 0.12);
    curlOffsets[offset] = Math.cos(arcPhase + Math.PI * 0.5) * (0.15 + role * 0.04);
    curlOffsets[offset + 1] = Math.sin(arcPhase * 0.72) * 0.18;
    curlOffsets[offset + 2] = Math.sin(arcPhase + Math.PI * 0.5) * (0.21 + role * 0.04);

    let targetColor;
    if (role > 0.5) {
      targetColor = ribbon % 3 === 0 ? ORANGE : ribbon % 3 === 1 ? COBALT : WHITE;
    } else if ((index + ribbon * 5) % 31 < 3) {
      targetColor = COBALT;
    } else if ((index * 7 + ribbon) % 47 < 2) {
      targetColor = ORANGE;
    } else {
      targetColor = mixColor(BONE, WHITE, 0.28 + random() * 0.62);
    }
    targetColors.set(targetColor, offset);
  }

  return { assemblyWindows, choreography, arcOffsets, curlOffsets, targetColors };
}

export function createParticleField(count = PARTICLE_COUNT, seed = PARTICLE_SEED) {
  const random = seededRandom(seed ^ 0x5041494e);
  const loose = createLooseRibbons(count, seed);
  const targets = createFormationTargets(count, seed);
  const choreography = createChoreography(loose, targets, count, seed);
  const colors = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const sizes = new Float32Array(count);
  const alphas = new Float32Array(count);

  for (let index = 0; index < count; index++) {
    const offset = index * 3;
    const ribbon = Math.round(loose.ribbonIds[index] * (RIBBON_COUNT - 1));
    const spark = loose.sparks[index];
    const ribbonColor = ribbon === 0 || ribbon === 4
      ? mixColor(COBALT, WHITE, 0.08 + random() * 0.2)
      : ribbon === 2 || ribbon === 5
        ? mixColor(ORANGE, WHITE, 0.04 + random() * 0.16)
        : mixColor(BONE, WHITE, 0.18 + random() * 0.62);
    colors.set(spark ? mixColor(ribbonColor, WHITE, 0.52) : ribbonColor, offset);
    phases[index] = ribbon * 1.13 + loose.ribbonProgress[index] * TAU * 2.1;
    sizes[index] = (0.9 + random() * 0.9) * (spark ? 1.78 : 1);
    alphas[index] = Math.min(0.98, 0.48 + random() * 0.34 + spark * 0.15);
  }

  return {
    count,
    positions: loose.positions,
    loosePositions: loose.positions,
    markPositions: targets.positions,
    targetPositions: targets.positions,
    colors,
    targetColors: choreography.targetColors,
    phases,
    sizes,
    kinds: targets.roles,
    flows: loose.ribbonProgress,
    alphas,
    ribbonIds: loose.ribbonIds,
    ribbonProgress: loose.ribbonProgress,
    sparks: loose.sparks,
    roles: targets.roles,
    assemblyWindows: choreography.assemblyWindows,
    choreography: choreography.choreography,
    arcOffsets: choreography.arcOffsets,
    curlOffsets: choreography.curlOffsets,
    markCount: targets.markCount,
  };
}

export function createParticleFieldSvg(options = {}) {
  const config = typeof options === 'number' ? { sampleCount: options } : (options || {});
  const sampleCount = Math.max(1, Number(config.sampleCount) || 1100);
  const assembly = Math.max(0, Math.min(1, Number(config.assembly) || 0));
  const easedAssembly = assembly * assembly * (3 - 2 * assembly);
  const field = createParticleField();
  const groups = Array.from({ length: RIBBON_COUNT }, () => []);
  const stride = Math.max(1, Math.floor(field.count / sampleCount));
  for (let index = 0; index < field.count; index += stride) {
    const offset = index * 3;
    const windowOffset = index * 2;
    const localAssembly = smoothstep(
      field.assemblyWindows[windowOffset],
      field.assemblyWindows[windowOffset + 1],
      easedAssembly,
    );
    const arcEnvelope = 4 * localAssembly * (1 - localAssembly);
    const curlEnvelope = arcEnvelope * 0.62
      * Math.sin(localAssembly * TAU + field.phases[index]);
    const x = field.loosePositions[offset]
      + (field.markPositions[offset] - field.loosePositions[offset]) * localAssembly
      + field.arcOffsets[offset] * arcEnvelope
      + field.curlOffsets[offset] * curlEnvelope;
    const y = field.loosePositions[offset + 1]
      + (field.markPositions[offset + 1] - field.loosePositions[offset + 1]) * localAssembly
      + field.arcOffsets[offset + 1] * arcEnvelope
      + field.curlOffsets[offset + 1] * curlEnvelope;
    const z = field.loosePositions[offset + 2]
      + (field.markPositions[offset + 2] - field.loosePositions[offset + 2]) * localAssembly
      + field.arcOffsets[offset + 2] * arcEnvelope
      + field.curlOffsets[offset + 2] * curlEnvelope;
    const perspective = 1 + z * 0.09;
    const projectionScale = 178;
    const cx = 500 + x * projectionScale * perspective;
    const cy = 400 - y * projectionScale * perspective;
    if (cx < 25 || cx > 975 || cy < 20 || cy > 780) continue;
    const red = Math.round((field.colors[offset]
      + (field.targetColors[offset] - field.colors[offset]) * localAssembly) * 255);
    const green = Math.round((field.colors[offset + 1]
      + (field.targetColors[offset + 1] - field.colors[offset + 1]) * localAssembly) * 255);
    const blue = Math.round((field.colors[offset + 2]
      + (field.targetColors[offset + 2] - field.colors[offset + 2]) * localAssembly) * 255);
    const group = Math.round(field.ribbonIds[index] * (RIBBON_COUNT - 1));
    const role = field.roles[index];
    const spark = field.sparks[index];
    groups[group].push({
      z,
      circle: `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(0.52 + field.sizes[index] * (spark ? 0.74 : 0.56)).toFixed(1)}" fill="rgb(${red} ${green} ${blue})" opacity="${Math.min(0.94, field.alphas[index] + 0.1 + localAssembly * (role ? 0.08 : 0.2)).toFixed(2)}"/>`,
    });
  }
  groups.forEach((group) => group.sort((a, b) => a.z - b.z));
  const groupMarkup = groups.map((group, index) => `<g class="particles p${index}">${group.map((dot) => dot.circle).join('')}</g>`).join('');
  // Rasterize the fallback once; native outer-image motion is composited.
  const label = assembly >= 0.94
    ? 'BR monogram framed by luminous particle paths'
    : 'Six broken luminous particle ribbons';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 800" role="img" aria-label="${label}"><defs><radialGradient id="core"><stop stop-color="#ff4d16" stop-opacity=".075"/><stop offset=".5" stop-color="#182d66" stop-opacity=".05"/><stop offset="1" stop-opacity="0"/></radialGradient></defs><ellipse cx="500" cy="410" rx="380" ry="275" fill="url(#core)"/>${groupMarkup}</svg>`;
}
