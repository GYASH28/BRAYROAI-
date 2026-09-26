import React,{useRef} from 'react';

const h=React.createElement;
const canTrack=()=>!matchMedia('(prefers-reduced-motion: reduce)').matches&&matchMedia('(hover:hover) and (pointer:fine)').matches;

/**
 * Adapted from React Bits Spotlight Card by David Haz.
 * Source: https://reactbits.dev/components/spotlight-card
 * License: MIT + Commons Clause. Used as an in-product component, not redistributed
 * as a component library.
 */
export function SpotlightCard({children,className='',spotlightColor='rgba(255,255,255,.12)',onPointerMove,onPointerLeave,...props}){
  const ref=useRef(null);
  const move=event=>{
    onPointerMove?.(event);
    const node=ref.current;
    if(!node||!canTrack())return;
    const rect=node.getBoundingClientRect();
    node.style.setProperty('--spotlight-x',`${event.clientX-rect.left}px`);
    node.style.setProperty('--spotlight-y',`${event.clientY-rect.top}px`);
    node.style.setProperty('--spotlight-color',spotlightColor);
  };
  const leave=event=>{
    onPointerLeave?.(event);
    const node=ref.current;
    if(!node)return;
    node.style.removeProperty('--spotlight-x');
    node.style.removeProperty('--spotlight-y');
  };
  return h('div',{
    ...props,
    ref,
    className:`rb-spotlight-card ${className}`.trim(),
    'data-ui-source':'react-bits-spotlight-card',
    onPointerMove:move,
    onPointerLeave:leave
  },children);
}
