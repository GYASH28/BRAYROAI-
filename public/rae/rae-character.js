export const characterMarkup=(variant='stage')=>`
<svg class="rae-character rae-character--${variant}" data-rae-character data-state="idle" viewBox="0 0 180 180" aria-hidden="true" focusable="false">
  <g class="rae-character__shadow"><ellipse cx="91" cy="159" rx="47" ry="10"/></g>
  <g class="rae-character__body">
    <path class="rae-character__torso" d="M55 112c9-18 25-28 41-28 22 0 39 16 45 43l-13 29H56c-8-12-8-29-1-44Z"/>
    <path class="rae-character__accent" d="M89 93c22 2 38 18 42 42-12 8-27 12-43 12-9 0-18-1-27-4 1-26 10-44 28-50Z"/>
    <g class="rae-character__arm rae-character__arm--l"><path d="M61 119c-12 6-18 17-17 29 1 8 5 12 11 10 5-1 7-7 6-16 0-7 3-12 8-16Z"/></g>
    <g class="rae-character__arm rae-character__arm--r"><path d="M130 116c10 6 15 15 14 25-1 8-5 12-11 10-5-2-6-7-5-15 1-7-2-12-7-16Z"/></g>
    <g class="rae-character__hand"><path d="M140 135c7-1 12 3 11 9-1 5-6 8-12 6-5-2-6-6-4-10 1-3 2-4 5-5Z"/></g>
  </g>
  <g class="rae-character__head-wrap">
    <path class="rae-character__ear" d="M44 71c-11 1-17 9-14 20 2 8 8 11 15 7 5-3 8-11 6-19-1-5-3-8-7-8Z"/>
    <path class="rae-character__head" d="M48 40c13-18 37-25 62-18 24 7 38 26 35 50-3 25-17 43-42 49-25 6-50-2-61-23-10-19-8-41 6-58Z"/>
    <path class="rae-character__head-accent" d="M105 23c20 7 35 24 38 43-12-6-24-9-36-10-9-1-17-5-23-11 7-10 14-17 21-22Z"/>
    <g class="rae-character__face">
      <g class="rae-character__brows">
        <path class="rae-character__brow rae-character__brow--l" d="M61 61c7-5 14-5 21-1"/>
        <path class="rae-character__brow rae-character__brow--r" d="M105 60c7-4 14-3 20 2"/>
      </g>
      <g class="rae-character__eyes">
        <g class="rae-character__eye rae-character__eye--l"><ellipse class="rae-character__eye-white" cx="73" cy="75" rx="9" ry="11"/><circle class="rae-character__pupil" cx="74" cy="76" r="4"/></g>
        <g class="rae-character__eye rae-character__eye--r"><ellipse class="rae-character__eye-white" cx="114" cy="75" rx="9" ry="11"/><circle class="rae-character__pupil" cx="115" cy="76" r="4"/></g>
        <path class="rae-character__lid rae-character__lid--l" d="M63 74c7-7 14-7 21 0"/>
        <path class="rae-character__lid rae-character__lid--r" d="M104 74c7-7 14-7 21 0"/>
      </g>
      <ellipse class="rae-character__cheek rae-character__cheek--l" cx="61" cy="91" rx="7" ry="3"/>
      <ellipse class="rae-character__cheek rae-character__cheek--r" cx="126" cy="91" rx="7" ry="3"/>
      <path class="rae-character__mouth" d="M82 94c7 7 15 7 23 0"/>
    </g>
  </g>
  <g class="rae-character__spark" transform="translate(139 29)"><path d="M0 9h18M9 0v18"/></g>
</svg>`;
