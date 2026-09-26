import React,{useRef} from 'react';

const h=React.createElement;
const shouldTrack=()=>!matchMedia('(prefers-reduced-motion: reduce)').matches&&matchMedia('(hover:hover) and (pointer:fine)').matches;
const clamp=(value,max)=>Math.max(-max,Math.min(max,value));

/**
 * Adapted from the 21st.dev magnetic interaction pattern. The clickable hitbox
 * never moves; only the inner visual surface shifts, avoiding missed fast clicks.
 * Reference: https://news.21st.dev/blog/react-magnetic-cursor-effects
 */
export function MagneticAction({children,className='',strength=.12,maxOffset=8,onPointerMove,onPointerLeave,...props}){
  const ref=useRef(null);
  const move=event=>{
    onPointerMove?.(event);
    const node=ref.current;
    if(!node||!shouldTrack())return;
    const rect=node.getBoundingClientRect();
    const x=clamp((event.clientX-(rect.left+rect.width/2))*strength,maxOffset);
    const y=clamp((event.clientY-(rect.top+rect.height/2))*strength,maxOffset);
    node.style.setProperty('--magnet-x',`${x.toFixed(2)}px`);
    node.style.setProperty('--magnet-y',`${y.toFixed(2)}px`);
  };
  const leave=event=>{
    onPointerLeave?.(event);
    const node=ref.current;
    if(!node)return;
    node.style.setProperty('--magnet-x','0px');
    node.style.setProperty('--magnet-y','0px');
  };
  return h('a',{
    ...props,
    ref,
    className:`magnetic-action ${className}`.trim(),
    'data-ui-source':'21st-magnetic-action',
    onPointerMove:move,
    onPointerLeave:leave
  },h('span',{className:'magnetic-action__surface'},children));
}
