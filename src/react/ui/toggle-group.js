import React,{createContext,useContext,useRef} from 'react';

const h=React.createElement;
const ToggleGroupContext=createContext(null);

/**
 * BRAYROAI adaptation of the shadcn/ui single-select Toggle Group interaction model.
 * Source reference: https://ui.shadcn.com/docs/components/base/toggle-group
 * shadcn/ui is MIT licensed. We keep the copy-paste component model, but use native
 * buttons/ARIA here so this Vite island does not pull in a second primitive runtime.
 */
export function ToggleGroup({value,onValueChange,className='',ariaLabel,dir='ltr',children}){
  const refs=useRef([]);
  const context={value,onValueChange,dir,refs};
  return h('div',{
    className,
    role:'radiogroup',
    'aria-label':ariaLabel,
    'aria-orientation':'horizontal',
    'data-ui-source':'shadcn-toggle-group'
  },h(ToggleGroupContext.Provider,{value:context},children));
}

export function ToggleGroupItem({value,index,className='',children,onKeyDown,onClick,...props}){
  const context=useContext(ToggleGroupContext);
  if(!context)throw new Error('ToggleGroupItem must be used inside ToggleGroup');
  const selected=context.value===value;
  const register=node=>{context.refs.current[index]={node,value}};
  const move=event=>{
    const key=event.key;
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(key))return;
    event.preventDefault();
    const entries=context.refs.current.filter(entry=>entry?.node);
    const current=entries.findIndex(entry=>entry.node===event.currentTarget);
    if(current<0||!entries.length)return;
    let next=current;
    if(key==='Home')next=0;
    else if(key==='End')next=entries.length-1;
    else{
      const rtl=context.dir==='rtl';
      const forward=key==='ArrowDown'||(key==='ArrowRight'&&!rtl)||(key==='ArrowLeft'&&rtl);
      next=(current+(forward?1:-1)+entries.length)%entries.length;
    }
    const target=entries[next];
    target?.node?.focus();
    if(target?.value!==undefined)context.onValueChange?.(target.value);
    onKeyDown?.(event);
  };
  return h('button',{
    ...props,
    ref:register,
    type:'button',
    role:'radio',
    'aria-checked':String(selected),
    tabIndex:selected?0:-1,
    'data-state':selected?'on':'off',
    'data-slot':'toggle-group-item',
    className,
    onKeyDown:move,
    onClick:event=>{context.onValueChange?.(value);onClick?.(event)}
  },children);
}
