let raeCharacterInstance = 0;

export function ensureRaeCharacterSkin() {
  if (typeof document === 'undefined' || document.querySelector('link[data-rae-character-skin="v5"]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/rae/rae-character-v2.css';
  link.dataset.raeCharacterSkin = 'v5';
  document.head.append(link);
}

// Rae is a compact studio signal, not a cartoon mascot. The same vector
// identity powers the launcher and dialog so the assistant reads as a
// premium product capability rather than a character for children.
export const characterMarkup = (variant = 'stage') => {
  ensureRaeCharacterSkin();
  const id = 'raeSignal' + (++raeCharacterInstance);
  return '<svg class="rae-character rae-character--' + variant + '" data-rae-character data-rae-rig="v4" data-rae-vector="signal-core" data-state="idle" viewBox="0 0 320 320" aria-hidden="true" focusable="false">' +
    '<defs>' +
      '<linearGradient id="' + id + 'Shell" x1=".12" y1=".08" x2=".9" y2=".92"><stop offset="0" stop-color="#f8f4ec"/><stop offset=".48" stop-color="#cfc6b8"/><stop offset="1" stop-color="#8f8579"/></linearGradient>' +
      '<linearGradient id="' + id + 'Glass" x1=".12" y1="0" x2=".88" y2="1"><stop offset="0" stop-color="#252a31"/><stop offset=".45" stop-color="#0d1015"/><stop offset="1" stop-color="#050609"/></linearGradient>' +
      '<linearGradient id="' + id + 'Signal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff5a1f" stop-opacity=".14"/><stop offset=".36" stop-color="#ff7a2d"/><stop offset=".64" stop-color="#ffc078"/><stop offset="1" stop-color="#ff5a1f" stop-opacity=".14"/></linearGradient>' +
      '<radialGradient id="' + id + 'Core"><stop offset="0" stop-color="#fff7e9"/><stop offset=".26" stop-color="#ffc07a"/><stop offset=".68" stop-color="#ff6a21"/><stop offset="1" stop-color="#b72f00"/></radialGradient>' +
      '<radialGradient id="' + id + 'Halo"><stop offset="0" stop-color="#ff6a21" stop-opacity=".2"/><stop offset=".68" stop-color="#ff6a21" stop-opacity=".05"/><stop offset="1" stop-color="#ff6a21" stop-opacity="0"/></radialGradient>' +
      '<filter id="' + id + 'Soft" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="10"/></filter>' +
    '</defs>' +
    '<ellipse class="rae-character__shadow" cx="160" cy="279" rx="74" ry="12"/>' +
    '<circle class="rae-character__ambient" cx="160" cy="154" r="126" fill="url(#' + id + 'Halo)"/>' +
    '<g class="rae-character__orbit"><circle cx="160" cy="154" r="112"/><path d="M160 34A120 120 0 0 1 279 154"/><path d="M41 154A120 120 0 0 1 160 34"/></g>' +
    '<g class="rae-character__housing">' +
      '<path class="rae-character__shell" d="M91 86 126 56h68l35 30 20 48-8 70-35 39-46 17-46-17-35-39-8-70Z" fill="url(#' + id + 'Shell)"/>' +
      '<path class="rae-character__shell-edge" d="M95 91 129 62h62l34 29 18 45-7 64-33 37-43 16-43-16-33-37-7-64Z"/>' +
      '<path class="rae-character__visor" d="M106 111q18-28 54-28t54 28l13 31-5 42q-8 35-62 44-54-9-62-44l-5-42Z" fill="url(#' + id + 'Glass)"/>' +
      '<path class="rae-character__visor-glint" d="M118 110q19-18 46-18 24 0 39 10"/>' +
      '<g class="rae-character__side-module rae-character__side-module--l"><rect x="71" y="128" width="22" height="56" rx="9"/><path d="M80 140v32"/></g>' +
      '<g class="rae-character__side-module rae-character__side-module--r"><rect x="227" y="128" width="22" height="56" rx="9"/><path d="M240 140v32"/></g>' +
    '</g>' +
    '<g class="rae-character__display">' +
      '<rect class="rae-character__signal-bed" x="116" y="137" width="88" height="34" rx="17"/>' +
      '<rect class="rae-character__signal" x="124" y="150" width="72" height="8" rx="4" fill="url(#' + id + 'Signal)"/>' +
      '<rect class="rae-character__scan" x="125" y="145" width="10" height="18" rx="5"/>' +
      '<circle class="rae-character__core-glow" cx="160" cy="194" r="27" fill="#ff6a21" filter="url(#' + id + 'Soft)"/>' +
      '<circle class="rae-character__core" cx="160" cy="194" r="11" fill="url(#' + id + 'Core)"/>' +
      '<path class="rae-character__mark" d="M151 194h18M160 185v18"/>' +
    '</g>' +
    '<g class="rae-character__ticks"><path d="M160 42v10M160 256v10M48 154h10M262 154h10"/><path d="m80 75 7 7m146 146 7 7m0-160-7 7M87 228l-7 7"/></g>' +
  '</svg>';
};
