import fs from 'node:fs';

const read = file => fs.readFileSync(file, 'utf8');
const errors = [];
const expect = (value, message) => { if (!value) errors.push(message); };

for (const file of ['public/refinement.css', 'public/refinement.js']) {
  expect(fs.existsSync(file), `missing ${file}`);
}

const css = read('public/refinement.css');
const js = read('public/refinement.js');
const loader = read('public/site-fixes.js');
const a11y = read('public/commercial-accessibility.css');

expect(a11y.startsWith("@import url('/refinement.css')"), 'shared refinement stylesheet is not loaded on commercial pages');
expect(loader.includes("refinementScript.src='/refinement.js'"), 'homepage refinement script is not wired');
expect(css.includes('.process{color:var(--bone)!important}'), 'Process contrast/alignment fix missing');
expect(css.includes('.about-portrait{width:100%;min-height:0!important;aspect-ratio:4/5'), 'mobile Studio continuity guard missing');
expect(css.includes('.capability-steps{grid-template-columns:repeat(4,minmax(0,calc(100% - 18px)))!important'), 'mobile capability alignment fix missing');
expect(css.includes('@supports (animation-timeline:view())'), 'progressive CSS scroll choreography missing');
expect(css.includes('@media(prefers-reduced-motion:reduce)'), 'refinement reduced-motion fallback missing');
expect(js.includes("document.body.classList.add('refinement-ready')"), 'refinement readiness contract missing');
expect(js.includes("section.style.setProperty('--ref-enter'"), 'section progress variables missing');
expect(js.includes("row.style.setProperty('--row-focus'"), 'Process focus choreography missing');
expect(js.includes('requestAnimationFrame(paint)'), 'refinement is not RAF-scheduled');
expect(!js.includes('setInterval('), 'refinement must not add permanent timer loops');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Refinement integrity OK: alignment, scroll choreography, accessibility and reduced motion are wired.');
