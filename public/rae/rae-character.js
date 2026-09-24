let raeCharacterInstance = 0;

export function ensureRaeCharacterSkin() {
  if (typeof document === 'undefined' || document.querySelector('link[data-rae-character-skin="v3"]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/rae/rae-character-v2.css';
  link.dataset.raeCharacterSkin = 'v3';
  document.head.append(link);
}

// One lightweight 2.5D illustration for the launcher, header and chat stage.
// The visor graphics stay vector so Rae can respond without loading sprite sheets.
export const characterMarkup = (variant = 'stage') => {
  ensureRaeCharacterSkin();
  const id = `raePortrait${++raeCharacterInstance}`;
  const viewBox = variant === 'stage' ? '165 0 700 880' : '190 60 660 670';
  return `
<svg class="rae-character rae-character--${variant}" data-rae-character data-rae-rig="v3" data-state="idle" viewBox="${viewBox}" aria-hidden="true" focusable="false">
  <defs>
    <radialGradient id="${id}Eye"><stop offset="0" stop-color="#fff9db"/><stop offset=".28" stop-color="#ffde85"/><stop offset=".68" stop-color="#ff9c25"/><stop offset="1" stop-color="#ff6408"/></radialGradient>
    <radialGradient id="${id}Bloom"><stop offset="0" stop-color="#ffa32c" stop-opacity=".42"/><stop offset="1" stop-color="#ff7a13" stop-opacity="0"/></radialGradient>
    <linearGradient id="${id}Line" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe9a6"/><stop offset=".5" stop-color="#ff9a20"/><stop offset="1" stop-color="#ff5c09"/></linearGradient>
    <linearGradient id="${id}Fade" x1="0" y1="0" x2="0" y2="930" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/><stop offset=".75" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
    <mask id="${id}PortraitFade" maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536"><rect x="0" y="0" width="1024" height="1536" fill="url(#${id}Fade)"/></mask>
  </defs>
  <g class="rae-character__body" mask="url(#${id}PortraitFade)">
    <image class="rae-character__art" href="/rae/rae-illustration.webp" x="0" y="0" width="1024" height="1536"/>
  </g>
  <g class="rae-character__head-wrap">
    <g class="rae-character__face">
      <g class="rae-character__brows">
        <path class="rae-character__brow rae-character__brow--l" d="M391 286c19-11 44-12 64-4"/>
        <path class="rae-character__brow rae-character__brow--r" d="M567 282c19-8 43-6 62 4"/>
      </g>
      <g class="rae-character__eyes">
        <g class="rae-character__eye rae-character__eye--l"><ellipse class="rae-character__eye-glow" cx="428" cy="344" rx="55" ry="69" fill="url(#${id}Bloom)"/><ellipse class="rae-character__eye-white" cx="428" cy="344" rx="28" ry="41" fill="url(#${id}Eye)"/><ellipse class="rae-character__pupil" cx="418" cy="329" rx="5" ry="8"/></g>
        <g class="rae-character__eye rae-character__eye--r"><ellipse class="rae-character__eye-glow" cx="602" cy="335" rx="55" ry="69" fill="url(#${id}Bloom)"/><ellipse class="rae-character__eye-white" cx="602" cy="335" rx="28" ry="41" fill="url(#${id}Eye)"/><ellipse class="rae-character__pupil" cx="592" cy="320" rx="5" ry="8"/></g>
        <path class="rae-character__lid rae-character__lid--l" d="M397 344c17-12 39-12 62 0"/>
        <path class="rae-character__lid rae-character__lid--r" d="M571 335c17-12 39-12 62 0"/>
      </g>
      <g class="rae-character__smile-eyes">
        <path d="M398 352c14-25 43-29 61-5"/>
        <path d="M571 341c15-25 43-28 63-4"/>
      </g>
      <ellipse class="rae-character__cheek rae-character__cheek--l" cx="365" cy="414" rx="25" ry="10"/>
      <ellipse class="rae-character__cheek rae-character__cheek--r" cx="663" cy="403" rx="25" ry="10"/>
      <path class="rae-character__mouth" d="M479 419c24 27 54 27 79-3" stroke="url(#${id}Line)"/>
      <ellipse class="rae-character__speaking-mouth" cx="519" cy="429" rx="25" ry="18" fill="url(#${id}Eye)"/>
    </g>
  </g>
  <text class="rae-character__thought" x="714" y="246" fill="#ff9a25" font-family="Arial,sans-serif" font-size="64" font-weight="700">?</text>
  <circle class="rae-character__listening-ring" cx="799" cy="286" r="54" fill="none" stroke="#ff8a1e" stroke-width="7"/>
  <text class="rae-character__brand-mark" x="529" y="662" text-anchor="middle" fill="#1c1b1d" font-family="Arial,sans-serif" font-size="14" font-weight="700" letter-spacing="1.7">BRAYROAI</text>
  <g class="rae-character__spark" transform="translate(762 170)"><path d="M0 14h28M14 0v28"/></g>
</svg>`;
};
