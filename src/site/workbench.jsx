import React, { useId, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

const stages = [
  {
    code: '01',
    name: 'Direction',
    eyebrow: 'Find the useful centre',
    text: 'We connect the audience, the business and the decision the experience needs to make easier.',
    caption: 'A clear brief with a point of view.',
    paths: [
      'M82 72 C174 72 190 145 292 145',
      'M82 218 C174 218 190 145 292 145',
      'M292 145 C390 145 420 145 526 145',
    ],
    nodes: [
      { label: 'Audience', x: 12, y: 24 },
      { label: 'Business', x: 12, y: 73 },
      { label: 'Decision', x: 49, y: 49, focus: true },
      { label: 'Brief', x: 88, y: 49, terminal: true },
    ],
  },
  {
    code: '02',
    name: 'Design',
    eyebrow: 'Give the idea one language',
    text: 'Type, imagery, interface and motion are composed together, so every detail feels part of the same idea.',
    caption: 'A system with character, not a surface treatment.',
    paths: [
      'M82 66 C190 66 186 145 292 145',
      'M82 222 C190 222 186 145 292 145',
      'M292 46 C292 92 292 108 292 145',
      'M292 244 C292 202 292 184 292 145',
      'M292 145 C394 145 422 145 526 145',
    ],
    nodes: [
      { label: 'Language', x: 12, y: 22 },
      { label: 'Imagery', x: 12, y: 74 },
      { label: 'Type', x: 49, y: 15 },
      { label: 'Motion', x: 49, y: 82 },
      { label: 'System', x: 49, y: 49, focus: true },
      { label: 'Experience', x: 88, y: 49, terminal: true },
    ],
  },
  {
    code: '03',
    name: 'Build',
    eyebrow: 'Make the promise real',
    text: 'Responsive layouts, routes and interactions are refined in the browser, then carried through to a considered launch.',
    caption: 'The finish lives in what people can actually use.',
    paths: [
      'M72 208 C132 208 148 170 206 170',
      'M206 170 C266 170 270 112 330 112',
      'M330 112 C396 112 402 166 460 166',
      'M460 166 C498 166 512 145 544 145',
    ],
    nodes: [
      { label: 'Routes', x: 10, y: 70 },
      { label: 'Responsive', x: 33, y: 57 },
      { label: 'Interaction', x: 55, y: 38 },
      { label: 'Refine', x: 77, y: 56, focus: true },
      { label: 'Launch', x: 91, y: 49, terminal: true },
    ],
  },
];

function Workbench() {
  const [index, setIndex] = useState(0);
  const tabRefs = useRef([]);
  const instanceId = useId().replaceAll(':', '');
  const stage = stages[index];
  const panelId = `${instanceId}-practice-panel`;

  const select = (nextIndex, focus = false) => {
    setIndex(nextIndex);
    if (focus) requestAnimationFrame(() => tabRefs.current[nextIndex]?.focus());
  };

  const onKeyDown = (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? stages.length - 1
        : (index + (['ArrowLeft', 'ArrowUp'].includes(event.key) ? stages.length - 1 : 1)) % stages.length;
    select(nextIndex, true);
  };

  return (
    <div className="workbench" style={{ '--active-stage': index }}>
      <div className="workbench-nav" role="tablist" aria-label="Studio practice">
        {stages.map((item, itemIndex) => (
          <button
            key={item.name}
            ref={(node) => { tabRefs.current[itemIndex] = node; }}
            id={`${instanceId}-practice-tab-${itemIndex}`}
            type="button"
            role="tab"
            aria-selected={itemIndex === index}
            aria-controls={panelId}
            tabIndex={itemIndex === index ? 0 : -1}
            onClick={() => select(itemIndex)}
            onKeyDown={onKeyDown}
          >
            <span className="workbench-nav-index">{item.code}</span>
            <span className="workbench-nav-name">{item.name}</span>
            <span className="workbench-nav-state" aria-hidden="true">
              {itemIndex === index ? 'In focus' : 'Open'}
            </span>
          </button>
        ))}
      </div>

      <section
        className="workbench-panel"
        id={panelId}
        role="tabpanel"
        aria-labelledby={`${instanceId}-practice-tab-${index}`}
        tabIndex="0"
      >
        <div className="workbench-panel-copy" key={`copy-${stage.code}`}>
          <p className="label">{stage.code} / {stage.eyebrow}</p>
          <p className="workbench-statement">{stage.text}</p>
        </div>

        <div className="workbench-diagram" data-stage={stage.name.toLowerCase()} key={stage.name} aria-hidden="true">
          <span className="workbench-orbit" />
          <svg className="workbench-trace" viewBox="0 0 600 290" preserveAspectRatio="none">
            {stage.paths.map((path, pathIndex) => <path key={path} d={path} style={{ '--path-index': pathIndex }} />)}
          </svg>
          {stage.nodes.map((node, nodeIndex) => (
            <span
              className={`workbench-node${node.focus ? ' is-focus' : ''}${node.terminal ? ' is-terminal' : ''}`}
              key={node.label}
              style={{ '--node-x': `${node.x}%`, '--node-y': `${node.y}%`, '--node-index': nodeIndex }}
            >
              <i>{String(nodeIndex + 1).padStart(2, '0')}</i>
              <b>{node.label}</b>
            </span>
          ))}
        </div>

        <p className="workbench-caption"><span>{stage.code}</span>{stage.caption}</p>
      </section>
    </div>
  );
}

export function mountWorkbench(host) {
  const root = createRoot(host);
  root.render(<Workbench />);
  return () => root.unmount();
}
