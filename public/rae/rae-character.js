let raeCharacterInstance=0;

export function ensureRaeCharacterSkin(){
  if(typeof document==='undefined'||document.querySelector('link[data-rae-character-skin="v3"]'))return;
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href='/rae/rae-character-v2.css';
  link.dataset.raeCharacterSkin='v3';
  document.head.append(link);
}

export const characterMarkup=(variant='stage')=>{
  ensureRaeCharacterSkin();
  const id=`raeRig${++raeCharacterInstance}`;
  const viewBox=variant==='stage'?'0 0 240 280':'18 8 204 168';
  return `
<svg class="rae-character rae-character--${variant}" data-rae-character data-rae-rig="v3" data-state="idle" viewBox="${viewBox}" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="${id}Shell" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fffdf7"/><stop offset=".48" stop-color="#f4eee4"/><stop offset="1" stop-color="#d9d0c3"/></linearGradient>
    <linearGradient id="${id}ShellShade" x1=".18" y1="0" x2=".82" y2="1"><stop offset="0" stop-color="#eee7dc"/><stop offset="1" stop-color="#b9afa3"/></linearGradient>
    <linearGradient id="${id}Visor" x1=".1" y1="0" x2=".9" y2="1"><stop offset="0" stop-color="#252a31"/><stop offset=".38" stop-color="#0b0d11"/><stop offset="1" stop-color="#020304"/></linearGradient>
    <linearGradient id="${id}Joint" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#34383f"/><stop offset=".5" stop-color="#101216"/><stop offset="1" stop-color="#050608"/></linearGradient>
    <linearGradient id="${id}Orange" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff9b35"/><stop offset=".46" stop-color="#ff641f"/><stop offset="1" stop-color="#e94910"/></linearGradient>
    <radialGradient id="${id}Eye"><stop offset="0" stop-color="#ffd79a"/><stop offset=".44" stop-color="#ff9b38"/><stop offset="1" stop-color="#ff5a1f"/></radialGradient>
  </defs>

  <g class="rae-character__shadow"><ellipse cx="120" cy="269" rx="62" ry="8"/></g>

  <g class="rae-character__legs">
    <g class="rae-character__leg rae-character__leg--l">
      <ellipse class="rae-character__joint rae-character__knee" cx="92" cy="219" rx="13" ry="12" fill="url(#${id}Joint)"/>
      <path class="rae-character__calf" d="M73 221c3-12 10-18 20-18 11 0 18 8 20 21l-2 28c-2 10-8 15-18 15H78c-8-5-11-12-9-21Z" fill="url(#${id}Shell)"/>
      <path class="rae-character__calf-panel" d="M78 229c7-8 17-10 29-6l-2 23c-5 5-14 8-28 5Z" fill="url(#${id}ShellShade)" opacity=".5"/>
      <rect class="rae-character__leg-light" x="79" y="235" width="6" height="18" rx="3" fill="url(#${id}Orange)"/>
      <path class="rae-character__foot" d="M65 254c9-7 20-9 33-5 9 2 15 8 17 16-3 8-11 12-22 12H68c-9-5-10-15-3-23Z" fill="url(#${id}Shell)"/>
      <path class="rae-character__sole" d="M68 267h44c-3 7-10 10-20 10H72c-4-2-6-6-4-10Z" fill="url(#${id}Joint)"/>
      <rect class="rae-character__foot-light" x="78" y="258" width="21" height="5" rx="2.5" fill="url(#${id}Orange)"/>
    </g>
    <g class="rae-character__leg rae-character__leg--r">
      <ellipse class="rae-character__joint rae-character__knee" cx="149" cy="219" rx="13" ry="12" fill="url(#${id}Joint)"/>
      <path class="rae-character__calf" d="M130 221c3-12 10-18 20-18 11 0 18 8 20 21l4 26c1 10-5 16-15 17h-16c-9-4-13-11-12-21Z" fill="url(#${id}Shell)"/>
      <path class="rae-character__calf-panel" d="M136 226c8-6 17-7 28-3l3 24c-7 5-16 7-28 4Z" fill="url(#${id}ShellShade)" opacity=".5"/>
      <rect class="rae-character__leg-light" x="158" y="235" width="6" height="18" rx="3" fill="url(#${id}Orange)"/>
      <path class="rae-character__foot" d="M128 253c9-6 22-8 35-4 10 3 17 9 18 17-4 7-12 11-24 11h-24c-9-5-11-15-5-24Z" fill="url(#${id}Shell)"/>
      <path class="rae-character__sole" d="M131 267h47c-4 7-11 10-22 10h-20c-4-2-6-6-5-10Z" fill="url(#${id}Joint)"/>
      <rect class="rae-character__foot-light" x="144" y="258" width="22" height="5" rx="2.5" fill="url(#${id}Orange)"/>
    </g>
  </g>

  <g class="rae-character__body">
    <ellipse class="rae-character__hip" cx="120" cy="205" rx="39" ry="20" fill="url(#${id}Joint)"/>
    <path class="rae-character__pelvis-shell" d="M82 195c8-9 20-14 38-14 18 0 31 5 39 14l-7 24c-9 7-20 10-32 10-13 0-24-3-33-10Z" fill="url(#${id}Shell)"/>
    <path class="rae-character__torso" d="M76 151c5-25 20-39 44-39s40 14 45 39l-5 41c-8 12-21 18-40 18-19 0-32-6-40-18Z" fill="url(#${id}Shell)"/>
    <path class="rae-character__torso-shadow" d="M85 163c8 8 20 13 35 13 16 0 28-5 36-14l-2 27c-8 10-19 15-34 15s-27-5-34-15Z" fill="url(#${id}ShellShade)" opacity=".42"/>
    <path class="rae-character__accent" d="M103 124h34c9 8 14 20 15 36-8 6-19 9-32 9-13 0-24-3-32-9 1-16 6-28 15-36Z" fill="url(#${id}Orange)" opacity=".12"/>
    <rect class="rae-character__chest-light" x="111" y="178" width="18" height="6" rx="3" fill="url(#${id}Orange)"/>
    <path class="rae-character__brand-mark" d="M110 149h20M113 154h14" stroke="#16181d" stroke-width="2" stroke-linecap="round" opacity=".68"/>

    <g class="rae-character__arm rae-character__arm--l">
      <circle class="rae-character__shoulder-joint" cx="77" cy="151" r="13" fill="url(#${id}Joint)"/>
      <path class="rae-character__shoulder-shell" d="M57 140c7-8 15-10 24-5l8 16c-4 11-12 16-25 14l-12-10Z" fill="url(#${id}Shell)"/>
      <path class="rae-character__upper-arm" d="M61 160c8-4 15-3 20 3l-4 29c-6 7-14 8-23 3l-5-10Z" fill="url(#${id}Shell)"/>
      <ellipse class="rae-character__elbow" cx="58" cy="194" rx="10" ry="9" fill="url(#${id}Joint)"/>
      <path class="rae-character__forearm" d="M43 190c8-5 16-4 22 3l-1 22c-5 7-13 9-23 4l-8-10Z" fill="url(#${id}Shell)"/>
      <g class="rae-character__hand rae-character__hand--l" fill="url(#${id}Joint)">
        <ellipse cx="36" cy="216" rx="10" ry="9"/>
        <rect x="22" y="206" width="6" height="14" rx="3" transform="rotate(-24 25 213)"/><rect x="28" y="202" width="6" height="15" rx="3" transform="rotate(-10 31 210)"/><rect x="35" y="202" width="6" height="14" rx="3" transform="rotate(5 38 209)"/>
      </g>
    </g>

    <g class="rae-character__arm rae-character__arm--r">
      <circle class="rae-character__shoulder-joint" cx="164" cy="151" r="13" fill="url(#${id}Joint)"/>
      <path class="rae-character__shoulder-shell" d="M151 137c10-5 18-3 25 5l12 13-12 10c-13 2-21-3-25-14Z" fill="url(#${id}Shell)"/>
      <path class="rae-character__upper-arm" d="M162 163c6-6 13-7 21-3l12 25-5 11c-9 5-17 4-23-3Z" fill="url(#${id}Shell)"/>
      <ellipse class="rae-character__elbow" cx="189" cy="194" rx="10" ry="9" fill="url(#${id}Joint)"/>
      <path class="rae-character__forearm" d="M182 193c6-7 14-8 22-3l10 19-8 11c-10 5-18 3-23-4Z" fill="url(#${id}Shell)"/>
      <g class="rae-character__hand rae-character__hand--r" fill="url(#${id}Joint)">
        <ellipse cx="210" cy="216" rx="10" ry="9"/>
        <rect x="214" y="205" width="6" height="14" rx="3" transform="rotate(24 217 212)"/><rect x="207" y="202" width="6" height="15" rx="3" transform="rotate(10 210 210)"/><rect x="200" y="202" width="6" height="14" rx="3" transform="rotate(-5 203 209)"/>
      </g>
    </g>
  </g>

  <g class="rae-character__neck">
    <ellipse cx="120" cy="132" rx="22" ry="12" fill="url(#${id}Joint)"/>
    <ellipse cx="120" cy="129" rx="13" ry="6" fill="url(#${id}Orange)" opacity=".82"/>
  </g>

  <g class="rae-character__head-wrap">
    <g class="rae-character__ear rae-character__ear--l">
      <path class="rae-character__ear-fin" d="M43 34 30 8c-3-7 4-12 10-7l18 24Z" fill="url(#${id}Joint)"/>
      <path class="rae-character__ear-fin-light" d="M39 24 34 9c-1-3 2-5 4-2l9 14Z" fill="url(#${id}Orange)"/>
      <circle class="rae-character__ear-ring" cx="43" cy="73" r="17" fill="url(#${id}Joint)"/>
      <circle class="rae-character__ear-ring-light" cx="43" cy="73" r="11" fill="none" stroke="url(#${id}Orange)" stroke-width="4"/>
    </g>
    <g class="rae-character__ear rae-character__ear--r">
      <path class="rae-character__ear-fin" d="m197 34 13-26c3-7-4-12-10-7l-18 24Z" fill="url(#${id}Joint)"/>
      <path class="rae-character__ear-fin-light" d="m201 24 5-15c1-3-2-5-4-2l-9 14Z" fill="url(#${id}Orange)"/>
      <circle class="rae-character__ear-ring" cx="197" cy="73" r="17" fill="url(#${id}Joint)"/>
      <circle class="rae-character__ear-ring-light" cx="197" cy="73" r="11" fill="none" stroke="url(#${id}Orange)" stroke-width="4"/>
    </g>

    <path class="rae-character__head" d="M47 44c12-23 38-34 73-34 36 0 61 11 73 34 9 17 11 39 5 61-7 27-32 43-78 43-45 0-71-16-78-43-6-22-4-44 5-61Z" fill="url(#${id}Shell)"/>
    <path class="rae-character__head-accent" d="M61 35c16-14 36-20 59-20 24 0 44 6 59 20-15-7-35-10-59-10-23 0-43 3-59 10Z" fill="#fff" opacity=".58"/>
    <path class="rae-character__shell-line" d="M62 124c15 10 34 15 58 15 25 0 44-5 58-15" fill="none" stroke="#b8afa4" stroke-width="1.2" opacity=".55"/>

    <g class="rae-character__visor-wrap">
      <rect class="rae-character__visor" x="52" y="43" width="136" height="84" rx="38" fill="url(#${id}Visor)"/>
      <path class="rae-character__visor-highlight" d="M70 58c19-13 49-18 83-12 10 2 19 5 27 9-17-5-35-7-54-6-21 1-39 5-56 12Z" fill="#fff" opacity=".12"/>
      <path class="rae-character__visor-rim" d="M57 70c4-18 18-28 42-31 39-5 68 1 83 19" fill="none" stroke="#fff" stroke-width="1.4" opacity=".18"/>

      <g class="rae-character__face">
        <g class="rae-character__brows">
          <path class="rae-character__brow rae-character__brow--l" d="M75 70c8-5 17-5 25-1"/>
          <path class="rae-character__brow rae-character__brow--r" d="M141 69c8-4 17-3 24 2"/>
        </g>
        <g class="rae-character__eyes">
          <g class="rae-character__eye rae-character__eye--l"><ellipse class="rae-character__eye-white" cx="88" cy="88" rx="12" ry="16" fill="url(#${id}Eye)"/><ellipse class="rae-character__pupil" cx="89" cy="89" rx="4" ry="7"/></g>
          <g class="rae-character__eye rae-character__eye--r"><ellipse class="rae-character__eye-white" cx="153" cy="88" rx="12" ry="16" fill="url(#${id}Eye)"/><ellipse class="rae-character__pupil" cx="154" cy="89" rx="4" ry="7"/></g>
          <path class="rae-character__lid rae-character__lid--l" d="M75 88c8-8 17-8 26 0"/>
          <path class="rae-character__lid rae-character__lid--r" d="M140 88c8-8 17-8 26 0"/>
        </g>
        <ellipse class="rae-character__cheek rae-character__cheek--l" cx="70" cy="105" rx="9" ry="4"/>
        <ellipse class="rae-character__cheek rae-character__cheek--r" cx="171" cy="105" rx="9" ry="4"/>
        <path class="rae-character__mouth" d="M105 105c9 9 20 9 30 0"/>
      </g>
    </g>

    <g class="rae-character__spark" transform="translate(193 25)"><path d="M0 8h17M8.5 0v17"/></g>
  </g>
</svg>`;
};
