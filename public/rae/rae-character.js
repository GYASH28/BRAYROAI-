let raeCharacterInstance = 0;

export function ensureRaeCharacterSkin() {
  if (typeof document === 'undefined' || document.querySelector('link[data-rae-character-skin="v4"]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/rae/rae-character-v2.css';
  link.dataset.raeCharacterSkin = 'v4';
  document.head.append(link);
}

// One structured SVG actor powers every live Rae placement. No raster body,
// sprite sheet, canvas, or face image is used by the character.
export const characterMarkup = (variant = 'stage') => {
  ensureRaeCharacterSkin();
  const id = `raeVector${++raeCharacterInstance}`;
  const viewBox = variant === 'stage' ? '0 0 480 620' : '60 18 360 360';
  return `
<svg class="rae-character rae-character--${variant}" data-rae-character data-rae-rig="v3" data-rae-vector="full-body" data-state="idle" viewBox="${viewBox}" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="${id}Shell" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fffdf7"/><stop offset=".48" stop-color="#f1e9dc"/><stop offset="1" stop-color="#cfc3b2"/></linearGradient>
    <linearGradient id="${id}ShellDark" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ece4d8"/><stop offset="1" stop-color="#b8ab99"/></linearGradient>
    <linearGradient id="${id}Ink" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2b30"/><stop offset=".45" stop-color="#101116"/><stop offset="1" stop-color="#030407"/></linearGradient>
    <linearGradient id="${id}Visor" x1=".12" y1=".05" x2=".86" y2=".95"><stop offset="0" stop-color="#292b31"/><stop offset=".34" stop-color="#111318"/><stop offset="1" stop-color="#030407"/></linearGradient>
    <linearGradient id="${id}Orange" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd073"/><stop offset=".36" stop-color="#ff9b2f"/><stop offset="1" stop-color="#ff5a12"/></linearGradient>
    <radialGradient id="${id}Eye"><stop offset="0" stop-color="#fffbe7"/><stop offset=".27" stop-color="#ffd97d"/><stop offset=".7" stop-color="#ff9626"/><stop offset="1" stop-color="#ff5a12"/></radialGradient>
    <radialGradient id="${id}Glow"><stop offset="0" stop-color="#ff9827" stop-opacity=".56"/><stop offset="1" stop-color="#ff6a16" stop-opacity="0"/></radialGradient>
  </defs>

  <ellipse class="rae-character__shadow" cx="240" cy="588" rx="116" ry="17"/>

  <g class="rae-character__body">
    <g class="rae-character__legs">
      <g class="rae-character__leg rae-character__leg--l">
        <circle class="rae-character__hip" cx="191" cy="392" r="24" fill="url(#${id}Ink)"/>
        <path class="rae-character__calf" d="M158 401Q187 386 218 402L211 476Q188 494 162 478Z" fill="url(#${id}Shell)"/>
        <path class="rae-character__panel-line" d="M171 416Q188 406 205 415M169 462Q188 472 205 462" fill="none" stroke="#9f9587" stroke-width="1"/>
        <rect class="rae-character__leg-light" x="177" y="433" width="8" height="27" rx="4" fill="url(#${id}Orange)"/>
        <circle class="rae-character__joint" cx="187" cy="492" r="22" fill="url(#${id}Ink)"/>
        <path class="rae-character__foot" d="M140 509Q184 489 223 512L234 557Q229 576 206 579H145Q126 574 128 552Z" fill="url(#${id}Shell)"/>
        <path d="M132 548Q183 531 229 550L234 557Q229 576 206 579H145Q126 574 128 552Z" fill="url(#${id}Ink)" opacity=".95"/>
        <rect class="rae-character__foot-light" x="157" y="552" width="50" height="8" rx="4" fill="url(#${id}Orange)"/>
      </g>
      <g class="rae-character__leg rae-character__leg--r">
        <circle class="rae-character__hip" cx="289" cy="392" r="24" fill="url(#${id}Ink)"/>
        <path class="rae-character__calf" d="M262 402Q290 386 322 402L317 477Q292 494 267 478Z" fill="url(#${id}Shell)"/>
        <path class="rae-character__panel-line" d="M274 416Q291 406 308 415M272 462Q291 472 308 462" fill="none" stroke="#9f9587" stroke-width="1"/>
        <rect class="rae-character__leg-light" x="295" y="433" width="8" height="27" rx="4" fill="url(#${id}Orange)"/>
        <circle class="rae-character__joint" cx="294" cy="492" r="22" fill="url(#${id}Ink)"/>
        <path class="rae-character__foot" d="M256 512Q296 489 340 509L352 552Q354 574 333 579H270Q248 575 247 557Z" fill="url(#${id}Shell)"/>
        <path d="M251 550Q302 531 348 548L352 552Q354 574 333 579H270Q248 575 247 557Z" fill="url(#${id}Ink)" opacity=".95"/>
        <rect class="rae-character__foot-light" x="273" y="552" width="50" height="8" rx="4" fill="url(#${id}Orange)"/>
      </g>
    </g>

    <g class="rae-character__torso-wrap">
      <ellipse class="rae-character__joint" cx="240" cy="246" rx="31" ry="19" fill="url(#${id}Ink)"/>
      <path class="rae-character__torso" d="M153 260Q240 225 327 260L315 356Q291 390 240 391Q188 390 165 356Z" fill="url(#${id}Shell)"/>
      <path class="rae-character__shell-hi" d="M171 272Q236 245 309 270Q281 260 253 267Q211 259 177 289Z" fill="#fff" opacity=".46"/>
      <path class="rae-character__panel-line" d="M177 330Q240 347 303 330M183 352Q240 369 297 352" fill="none" stroke="#a59a8b" stroke-width="1.1" opacity=".7"/>
      <rect class="rae-character__chest-light" x="219" y="293" width="42" height="10" rx="5" fill="url(#${id}Orange)"/>
      <text class="rae-character__brand-mark" x="240" y="327" text-anchor="middle" fill="#242226" font-family="Arial,sans-serif" font-size="10" font-weight="700" letter-spacing="1.4">BRAYROAI</text>
      <path class="rae-character__pelvis-shell" d="M171 365Q240 391 309 365L298 420Q240 444 182 420Z" fill="url(#${id}ShellDark)"/>
      <path d="M186 379Q240 397 294 379L286 410Q240 426 194 410Z" fill="url(#${id}Ink)" opacity=".94"/>
    </g>

    <g class="rae-character__arms">
      <g class="rae-character__arm rae-character__arm--l">
        <circle class="rae-character__shoulder-joint" cx="151" cy="276" r="27" fill="url(#${id}Ink)"/>
        <path class="rae-character__shoulder-shell" d="M123 254Q147 232 172 251L176 282Q151 295 126 281Z" fill="url(#${id}Shell)"/>
        <path class="rae-character__upper-arm" d="M119 279Q145 267 164 288L148 342Q123 355 103 334Z" fill="url(#${id}Ink)"/>
        <circle class="rae-character__elbow" cx="119" cy="345" r="19" fill="url(#${id}Ink)"/>
        <path class="rae-character__forearm" d="M88 343Q114 328 138 345L129 401Q104 417 81 395Z" fill="url(#${id}Shell)"/>
        <rect class="rae-character__arm-light" x="90" y="365" width="7" height="23" rx="3.5" fill="url(#${id}Orange)"/>
        <g class="rae-character__hand rae-character__hand--l">
          <ellipse cx="100" cy="410" rx="20" ry="17" fill="url(#${id}Ink)"/>
          <path class="rae-character__finger" d="M89 407Q79 401 80 391Q81 384 87 387L96 398M99 398L100 382Q101 374 107 378L109 399M111 401L120 390Q125 384 129 390L121 408" fill="none" stroke="#24262a" stroke-width="9" stroke-linecap="round"/>
        </g>
      </g>
      <g class="rae-character__arm rae-character__arm--r">
        <circle class="rae-character__shoulder-joint" cx="329" cy="276" r="27" fill="url(#${id}Ink)"/>
        <path class="rae-character__shoulder-shell" d="M308 251Q334 232 357 254L354 281Q330 295 305 282Z" fill="url(#${id}Shell)"/>
        <path class="rae-character__upper-arm" d="M316 288Q337 267 361 280L377 333Q357 355 332 342Z" fill="url(#${id}Ink)"/>
        <circle class="rae-character__elbow" cx="361" cy="345" r="19" fill="url(#${id}Ink)"/>
        <path class="rae-character__forearm" d="M342 346Q367 329 392 344L399 394Q375 416 350 401Z" fill="url(#${id}Shell)"/>
        <rect class="rae-character__arm-light" x="383" y="365" width="7" height="23" rx="3.5" fill="url(#${id}Orange)"/>
        <g class="rae-character__hand rae-character__hand--r">
          <ellipse cx="381" cy="410" rx="20" ry="17" fill="url(#${id}Ink)"/>
          <path class="rae-character__finger" d="M369 408Q360 402 361 393Q362 386 368 389L377 400M381 399L382 383Q383 375 389 379L391 400M392 402L401 392Q406 386 410 392L402 410" fill="none" stroke="#24262a" stroke-width="9" stroke-linecap="round"/>
        </g>
      </g>
    </g>
  </g>

  <g class="rae-character__head-wrap">
    <g class="rae-character__ears">
      <path class="rae-character__ear rae-character__ear--l" d="M94 87L63 50Q58 44 62 86L73 127Z" fill="url(#${id}ShellDark)"/>
      <path d="M77 85L66 65L69 99Z" fill="url(#${id}Orange)"/>
      <path class="rae-character__ear rae-character__ear--r" d="M386 87L417 50Q422 44 418 86L407 127Z" fill="url(#${id}ShellDark)"/>
      <path d="M403 85L414 65L411 99Z" fill="url(#${id}Orange)"/>
      <ellipse cx="78" cy="139" rx="27" ry="40" fill="url(#${id}Ink)"/><ellipse class="rae-character__ear-ring-light" cx="78" cy="139" rx="18" ry="28" fill="none" stroke="url(#${id}Orange)" stroke-width="7"/>
      <ellipse cx="402" cy="139" rx="27" ry="40" fill="url(#${id}Ink)"/><ellipse class="rae-character__ear-ring-light" cx="402" cy="139" rx="18" ry="28" fill="none" stroke="url(#${id}Orange)" stroke-width="7"/>
    </g>
    <path class="rae-character__head" d="M91 78Q118 35 183 27H297Q362 35 389 78Q408 111 403 160Q398 209 366 235Q332 260 240 262Q148 260 114 235Q82 209 77 160Q72 111 91 78Z" fill="url(#${id}Shell)"/>
    <path class="rae-character__shell-hi" d="M113 76Q150 46 199 43H287Q334 47 365 74Q320 56 275 60H188Q145 61 113 76Z" fill="#fff" opacity=".54"/>
    <path class="rae-character__panel-line" d="M105 88Q119 61 159 50M376 89Q361 62 322 50" fill="none" stroke="#aaa092" stroke-width="1.2"/>
    <path class="rae-character__visor" d="M119 87Q144 60 188 58H292Q338 61 363 88Q380 110 376 156Q372 195 346 216Q317 238 240 239Q163 238 134 216Q108 195 104 156Q100 111 119 87Z" fill="url(#${id}Visor)"/>
    <path class="rae-character__visor-rim" d="M119 87Q144 60 188 58H292Q338 61 363 88Q380 110 376 156Q372 195 346 216Q317 238 240 239Q163 238 134 216Q108 195 104 156Q100 111 119 87Z" fill="none" stroke="#fff" stroke-width="3"/>
    <path d="M139 86Q177 66 220 67" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".12"/>
    <g class="rae-character__face">
      <g class="rae-character__brows">
        <path class="rae-character__brow rae-character__brow--l" d="M161 121c17-10 39-10 55-3"/>
        <path class="rae-character__brow rae-character__brow--r" d="M266 118c17-8 38-7 54 3"/>
      </g>
      <g class="rae-character__eyes">
        <g class="rae-character__eye rae-character__eye--l"><ellipse class="rae-character__eye-glow" cx="190" cy="151" rx="39" ry="47" fill="url(#${id}Glow)"/><ellipse class="rae-character__eye-white" cx="190" cy="151" rx="19" ry="27" fill="url(#${id}Eye)"/><ellipse class="rae-character__pupil" cx="185" cy="144" rx="4.5" ry="6.5"/></g>
        <g class="rae-character__eye rae-character__eye--r"><ellipse class="rae-character__eye-glow" cx="290" cy="151" rx="39" ry="47" fill="url(#${id}Glow)"/><ellipse class="rae-character__eye-white" cx="290" cy="151" rx="19" ry="27" fill="url(#${id}Eye)"/><ellipse class="rae-character__pupil" cx="285" cy="144" rx="4.5" ry="6.5"/></g>
        <path class="rae-character__lid rae-character__lid--l" d="M169 151c12-10 29-10 42 0"/>
        <path class="rae-character__lid rae-character__lid--r" d="M269 151c12-10 29-10 42 0"/>
      </g>
      <g class="rae-character__smile-eyes"><path d="M168 157c11-20 31-22 44-3"/><path d="M268 154c11-20 31-22 44-3"/></g>
      <ellipse class="rae-character__cheek rae-character__cheek--l" cx="145" cy="186" rx="18" ry="7"/>
      <ellipse class="rae-character__cheek rae-character__cheek--r" cx="335" cy="186" rx="18" ry="7"/>
      <path class="rae-character__mouth" d="M213 190c17 18 37 18 55-2" stroke="url(#${id}Orange)"/>
      <ellipse class="rae-character__speaking-mouth" cx="241" cy="194" rx="17" ry="12" fill="url(#${id}Eye)"/>
    </g>
    <text class="rae-character__thought" x="350" y="86" fill="#ff9a25" font-family="Arial,sans-serif" font-size="42" font-weight="700">?</text>
    <circle class="rae-character__listening-ring" cx="374" cy="158" r="27" fill="none" stroke="#ff8a1e" stroke-width="4"/>
    <g class="rae-character__spark" transform="translate(352 53)"><path d="M0 10h20M10 0v20"/></g>
  </g>
</svg>`;
};
