let raeCharacterInstance = 0;

export function ensureRaeCharacterSkin() {
  if (typeof document === 'undefined' || document.querySelector('link[data-rae-character-skin="v6"]')) return;
  document.querySelectorAll('link[data-rae-character-skin]').forEach((node) => node.remove());
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/rae/rae-character-v2.css';
  link.dataset.raeCharacterSkin = 'v6';
  document.head.append(link);
}

// Rae v6: a sculptural humanoid studio intelligence. The silhouette, faceplate,
// cognition core and light states are all vector so the character remains crisp,
// fast and brand-owned at every size.
export const characterMarkup = (variant = 'stage') => {
  ensureRaeCharacterSkin();
  const id = 'raeAtelier' + (++raeCharacterInstance);
  const viewBox = variant === 'launcher' ? '142 72 196 278' : '140 55 200 430';
  return '<svg class="rae-character rae-character--' + variant + '" data-rae-character data-rae-rig="v6" data-rae-vector="atelier-android" data-state="idle" viewBox="' + viewBox + '" aria-hidden="true" focusable="false">' +
    '<defs>' +
      '<linearGradient id="' + id + 'Porcelain" x1=".18" y1=".04" x2=".88" y2=".96"><stop offset="0" stop-color="#fffdf8"/><stop offset=".34" stop-color="#e7e1d7"/><stop offset=".72" stop-color="#b7afa4"/><stop offset="1" stop-color="#716b66"/></linearGradient>' +
      '<linearGradient id="' + id + 'Graphite" x1=".12" y1="0" x2=".88" y2="1"><stop offset="0" stop-color="#30343a"/><stop offset=".38" stop-color="#111419"/><stop offset="1" stop-color="#050608"/></linearGradient>' +
      '<linearGradient id="' + id + 'Metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9d0c4"/><stop offset=".45" stop-color="#80766f"/><stop offset=".72" stop-color="#332f2d"/><stop offset="1" stop-color="#aaa197"/></linearGradient>' +
      '<linearGradient id="' + id + 'Amber" x1="0" x2="1"><stop stop-color="#d74312"/><stop offset=".46" stop-color="#ff7a32"/><stop offset=".7" stop-color="#ffd0a0"/><stop offset="1" stop-color="#d74312"/></linearGradient>' +
      '<radialGradient id="' + id + 'Core"><stop offset="0" stop-color="#fffaf1"/><stop offset=".18" stop-color="#ffd5ad"/><stop offset=".55" stop-color="#ff6a24"/><stop offset="1" stop-color="#7e1c00"/></radialGradient>' +
      '<radialGradient id="' + id + 'Aura"><stop offset="0" stop-color="#ff6a24" stop-opacity=".22"/><stop offset=".52" stop-color="#ff6a24" stop-opacity=".06"/><stop offset="1" stop-color="#ff6a24" stop-opacity="0"/></radialGradient>' +
      '<filter id="' + id + 'Glow" x="-120%" y="-120%" width="340%" height="340%"><feGaussianBlur stdDeviation="12"/></filter>' +
      '<filter id="' + id + 'Soft" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="5"/></filter>' +
    '</defs>' +
    '<ellipse class="rae-character__shadow" cx="240" cy="512" rx="126" ry="18"/>' +
    '<circle class="rae-character__aura" cx="240" cy="250" r="206" fill="url(#' + id + 'Aura)"/>' +
    '<g class="rae-character__halo">' +
      '<circle cx="240" cy="245" r="176"/>' +
      '<path class="rae-character__halo-arc rae-character__halo-arc--a" d="M82 245A158 158 0 0 1 240 87"/>' +
      '<path class="rae-character__halo-arc rae-character__halo-arc--b" d="M240 403A158 158 0 0 0 398 245"/>' +
      '<path class="rae-character__halo-tick" d="M240 52v18M240 420v18M47 245h18M415 245h18"/>' +
    '</g>' +
    '<g class="rae-character__bust">' +
      '<path class="rae-character__shoulder rae-character__shoulder--back" d="M91 510c17-76 67-119 149-119s132 43 149 119H91Z" fill="url(#' + id + 'Graphite)"/>' +
      '<path class="rae-character__shoulder rae-character__shoulder--left" d="M91 510c15-59 50-97 104-113l24 26-42 87H91Z" fill="url(#' + id + 'Metal)"/>' +
      '<path class="rae-character__shoulder rae-character__shoulder--right" d="M389 510c-15-59-50-97-104-113l-24 26 42 87h86Z" fill="url(#' + id + 'Metal)"/>' +
      '<path class="rae-character__sternum" d="M218 404h44l27 106h-98Z" fill="url(#' + id + 'Graphite)"/>' +
      '<path class="rae-character__collar" d="M171 405l35-39h68l35 39-37 38h-64Z" fill="#0a0c10"/>' +
      '<path class="rae-character__collar-edge" d="M178 408l31-34h62l31 34-33 29h-58Z"/>' +
      '<path class="rae-character__neck" d="M205 304h70l12 75-27 29h-40l-27-29Z" fill="url(#' + id + 'Metal)"/>' +
      '<path class="rae-character__neck-core" d="M224 323h32l8 56-14 14h-20l-14-14Z" fill="#090b0e"/>' +
      '<path class="rae-character__neck-light" d="M232 343h16v33h-16Z" fill="url(#' + id + 'Amber)"/>' +
    '</g>' +
    '<g class="rae-character__head">' +
      '<path class="rae-character__cowl" d="M145 160c7-61 43-99 95-99s88 38 95 99l13 51-21 82-55 49h-64l-55-49-21-82Z" fill="url(#' + id + 'Porcelain)"/>' +
      '<path class="rae-character__cowl-shadow" d="M145 160c19-39 52-58 95-58s76 19 95 58l-12 34-83-43-83 43Z" fill="#0a0c10"/>' +
      '<path class="rae-character__temple rae-character__temple--l" d="M145 163l28 13-10 112-24-20-8-61Z" fill="url(#' + id + 'Metal)"/>' +
      '<path class="rae-character__temple rae-character__temple--r" d="M335 163l-28 13 10 112 24-20 8-61Z" fill="url(#' + id + 'Metal)"/>' +
      '<path class="rae-character__face" d="M175 157q65-54 130 0l17 52-15 82-48 38h-38l-48-38-15-82Z" fill="url(#' + id + 'Graphite)"/>' +
      '<path class="rae-character__face-sheen" d="M183 161q57-42 114 0l11 30q-60-16-128 4Z"/>' +
      '<path class="rae-character__brow" d="M188 207q24-17 47-6M245 201q23-11 47 6"/>' +
      '<path class="rae-character__eye rae-character__eye--l" d="M191 222q21-13 42 0-21 8-42 0Z" fill="url(#' + id + 'Amber)"/>' +
      '<path class="rae-character__eye rae-character__eye--r" d="M247 222q21-13 42 0-21 8-42 0Z" fill="url(#' + id + 'Amber)"/>' +
      '<path class="rae-character__bridge" d="M239 218v42l-12 15h26l-12-15"/>' +
      '<path class="rae-character__jawline" d="M190 282q50 42 100 0"/>' +
      '<path class="rae-character__cheek-cut rae-character__cheek-cut--l" d="M178 247l34 28-17 22"/>' +
      '<path class="rae-character__cheek-cut rae-character__cheek-cut--r" d="M302 247l-34 28 17 22"/>' +
      '<path class="rae-character__crown-line" d="M171 143q69-68 138 0M198 113l17-35M282 113l-17-35"/>' +
    '</g>' +
    '<g class="rae-character__cognition">' +
      '<circle class="rae-character__core-haze" cx="240" cy="190" r="38" fill="#ff6a24" filter="url(#' + id + 'Glow)"/>' +
      '<circle class="rae-character__core-ring" cx="240" cy="190" r="23"/>' +
      '<circle class="rae-character__core" cx="240" cy="190" r="7" fill="url(#' + id + 'Core)"/>' +
      '<path class="rae-character__signal-wave" d="M199 190h22l7-12 9 25 10-31 9 18h25"/>' +
    '</g>' +
    '<g class="rae-character__microdetail">' +
      '<path d="M122 338h38M320 338h38M119 352h20M341 352h20"/>' +
      '<circle cx="160" cy="368" r="2"/><circle cx="320" cy="368" r="2"/>' +
      '<path d="M191 486h98M211 469h58"/>' +
    '</g>' +
  '</svg>';
};
