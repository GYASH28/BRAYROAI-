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

function unitDirection(random) {
  const z = random() * 2 - 1;
  const angle = random() * TAU;
  const ring = Math.sqrt(1 - z * z);
  return [Math.cos(angle) * ring, Math.sin(angle) * ring, z];
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
const COBALT = [0.08, 0.2, 0.58];

export function createParticleField(count = PARTICLE_COUNT, seed = PARTICLE_SEED) {
  const random = seededRandom(seed);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const sizes = new Float32Array(count);
  const kinds = new Float32Array(count);
  const flows = new Float32Array(count);
  const alphas = new Float32Array(count);
  const nucleusEnd = Math.floor(count * 0.54);
  const filamentEnd = nucleusEnd + Math.floor(count * 0.27);
  const coreEnd = filamentEnd + Math.floor(count * 0.075);
  const aperture = [0.45, -0.14, 0.882];

  const write = (index, position, color, phase, size, kind, flow, alpha) => {
    positions.set(position, index * 3);
    colors.set(color, index * 3);
    phases[index] = phase;
    sizes[index] = size;
    kinds[index] = kind;
    flows[index] = flow;
    alphas[index] = alpha;
  };

  for (let index = 0; index < nucleusEnd; index++) {
    let direction;
    let radius;
    let attempts = 0;
    do {
      direction = unitDirection(random);
      radius = random() < 0.7
        ? 0.76 + Math.pow(random(), 0.7) * 0.46
        : 0.42 + Math.pow(random(), 0.72) * 0.88;
      attempts++;
    } while (
      attempts < 14
      && radius > 0.28
      && Math.abs(direction[0] * aperture[0] + direction[1] * aperture[1] + direction[2] * aperture[2]) > 0.8
    );
    const position = [
      direction[0] * radius * 1.06 - 0.08 + direction[1] * direction[1] * 0.08,
      direction[1] * radius * 0.9 + Math.sin(direction[0] * 2.4) * 0.055,
      direction[2] * radius * 0.76,
    ];
    const color = mixColor(BONE, WHITE, 0.2 + random() * 0.75);
    const angle = Math.atan2(position[2], position[0]);
    write(index, position, color, angle + random() * 0.7, 0.7 + random() * 1.15, 0.08, random(), 0.22 + random() * 0.38);
  }

  const filamentCount = filamentEnd - nucleusEnd;
  for (let offset = 0; offset < filamentCount; offset++) {
    const index = nucleusEnd + offset;
    const stream = offset % 6;
    const t = random();
    const turns = 1.05 + stream * 0.105;
    const angle = t * TAU * turns + stream * 1.07 + Math.sin(t * Math.PI) * 0.24;
    const radius = 0.9 + stream * 0.075 + Math.sin(t * TAU * 1.8 + stream) * 0.08;
    const peel = smoothstep(0.62 + stream * 0.025, 1, t);
    const jitter = 0.018 + stream * 0.0025;
    let x = Math.cos(angle) * radius * 1.08;
    let y = (t - 0.5) * (0.48 + stream * 0.06) + Math.sin(angle * 0.58 + stream) * 0.42;
    let z = Math.sin(angle) * radius * 0.69;
    x += peel * peel * (0.56 + stream * 0.075) * (stream % 2 ? -0.42 : 1);
    y += peel * (0.15 + stream * 0.055);
    z += peel * (stream % 3 - 1) * 0.16;
    const tilt = -0.28 + stream * 0.09;
    const tiltedY = y * Math.cos(tilt) - z * Math.sin(tilt);
    const tiltedZ = y * Math.sin(tilt) + z * Math.cos(tilt);
    x += normal(random) * jitter;
    y = tiltedY + normal(random) * jitter;
    z = tiltedZ + normal(random) * jitter;
    const cobaltAmount = stream === 1 || stream === 4 ? 0.72 + random() * 0.25 : random() * 0.24;
    const color = mixColor(mixColor(BONE, WHITE, random() * 0.65), COBALT, cobaltAmount);
    write(index, [x, y, z], color, angle + stream * 0.3, 0.9 + random() * 1.35, 1, t, 0.32 + random() * 0.5);
  }

  for (let index = filamentEnd; index < coreEnd; index++) {
    const angle = random() * TAU;
    const radius = 0.18 + Math.pow(random(), 0.62) * 0.38;
    const crescent = 0.62 + Math.sin(angle - 0.4) * 0.38;
    const position = [
      Math.cos(angle) * radius * 1.08 - 0.08,
      Math.sin(angle) * radius * 0.67 - 0.035,
      normal(random) * 0.095 + crescent * 0.055,
    ];
    const color = mixColor(ORANGE, WHITE, random() * 0.12);
    write(index, position, color, angle, 1.15 + random() * 1.55, 0.48, random(), 0.42 + random() * 0.42);
  }

  for (let index = coreEnd; index < count; index++) {
    const direction = unitDirection(random);
    const radius = 1.3 + Math.pow(random(), 0.78) * 0.85;
    const position = [
      direction[0] * radius * 1.18 - 0.02,
      direction[1] * radius * 0.76,
      direction[2] * radius * 0.62,
    ];
    const color = mixColor(BONE, random() < 0.3 ? COBALT : WHITE, 0.2 + random() * 0.5);
    write(index, position, color, random() * TAU, 0.68 + random() * 1.05, 0.2, random(), 0.12 + random() * 0.28);
  }

  return { count, positions, colors, phases, sizes, kinds, flows, alphas };
}

export function createParticleFieldSvg(sampleCount = 1100) {
  const field = createParticleField();
  const groups = Array.from({ length: 5 }, () => []);
  const stride = Math.max(1, Math.floor(field.count / sampleCount));
  for (let index = 0; index < field.count; index += stride) {
    const offset = index * 3;
    const x = field.positions[offset];
    const y = field.positions[offset + 1];
    const z = field.positions[offset + 2];
    const perspective = 1 + z * 0.09;
    const cx = 505 + x * 242 * perspective;
    const cy = 397 - y * 242 * perspective;
    if (cx < 25 || cx > 975 || cy < 20 || cy > 780) continue;
    const red = Math.round(field.colors[offset] * 255);
    const green = Math.round(field.colors[offset + 1] * 255);
    const blue = Math.round(field.colors[offset + 2] * 255);
    const kind = field.kinds[index];
    const group = kind > 0.8
      ? 1 + (Math.floor(field.flows[index] * 997) % 2)
      : kind > 0.4 ? 3 : kind < 0.15 ? 0 : 4;
    groups[group].push({
      z,
      circle: `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(0.55 + field.sizes[index] * 0.62).toFixed(1)}" fill="rgb(${red} ${green} ${blue})" opacity="${Math.min(0.88, field.alphas[index] + 0.12).toFixed(2)}"/>`,
    });
  }
  groups.forEach((group) => group.sort((a, b) => a.z - b.z));
  const groupMarkup = groups.map((group, index) => `<g class="particles p${index}">${group.map((dot) => dot.circle).join('')}</g>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 800" role="img" aria-label="Asymmetric luminous particle field"><defs><radialGradient id="core"><stop stop-color="#ff4d16" stop-opacity=".14"/><stop offset=".42" stop-color="#182d66" stop-opacity=".07"/><stop offset="1" stop-opacity="0"/></radialGradient><filter id="soft"><feGaussianBlur stdDeviation="18"/></filter></defs><style>.particles{transform-origin:500px 400px;transform-box:view-box;mix-blend-mode:screen;will-change:transform,opacity}.p0{animation:turn-a 34s ease-in-out infinite alternate,breathe-a 8s ease-in-out infinite}.p1{animation:turn-b 28s linear infinite,breathe-b 10s ease-in-out infinite}.p2{animation:turn-c 37s linear infinite,breathe-a 12s ease-in-out infinite reverse}.p3{animation:core-pulse 6.5s ease-in-out infinite}.p4{animation:turn-d 46s ease-in-out infinite alternate,breathe-b 14s ease-in-out infinite}@keyframes turn-a{to{transform:rotate(3.4deg) scale(1.012)}}@keyframes turn-b{to{transform:rotate(7deg)}}@keyframes turn-c{to{transform:rotate(-5.5deg)}}@keyframes turn-d{to{transform:rotate(-2.6deg) scale(.99)}}@keyframes breathe-a{50%{opacity:.78}}@keyframes breathe-b{50%{opacity:.68}}@keyframes core-pulse{50%{opacity:.72;transform:scale(1.025)}}@media(prefers-reduced-motion:reduce){.particles{animation:none!important}}</style><ellipse cx="500" cy="410" rx="315" ry="270" fill="url(#core)" filter="url(#soft)"/>${groupMarkup}</svg>`;
}
