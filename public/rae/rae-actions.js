import {emitRae} from './rae-director.js';

const ROUTES=new Set(['/','/plans','/clients','/clients/fakhrimart','/founder','/terms','/ai-workflow-audit','/company-second-brain']);
const SECTIONS=new Set(['services','work','plans','ai-systems','founder','contact','process']);
const HIGHLIGHTS=Object.freeze({
  services:'#services',work:'#work',plans:'#plans','ai-systems':'#ai-systems',founder:'#founder',contact:'#contact',process:'#process'
});
const PROJECTS=Object.freeze({fakhrimart:'/clients/fakhrimart'});
const PLAN_IDS=new Set(['monthly-starter','monthly-growth','monthly-studio','launch-website','business-experience','premium-experience','ai-workflow-audit','company-second-brain']);

const clean=value=>String(value??'').trim().replace(/\s+/g,' ');
const validInternal=value=>ROUTES.has(value)?value:null;

export function buildProjectBrief({goal='',business='',timeline='',budget='',suggestion=''}={}){
  return[
    'Hi Yash, I spoke with Rae on the BRAYROAI website.',
    '',
    business?`Business: ${clean(business).slice(0,120)}`:'',
    goal?`Project: ${clean(goal).slice(0,260)}`:'',
    timeline?`Timeline: ${clean(timeline).slice(0,80)}`:'',
    budget?`Budget: ${clean(budget).slice(0,80)}`:'',
    suggestion?`Relevant option Rae suggested: ${clean(suggestion).slice(0,120)}`:'',
    '',
    'I would like to discuss the smallest sensible next step.'
  ].filter((line,index,array)=>line!==''||array[index-1]!=='').join('\n').trim();
}

export class RaeActions{
  constructor(session){this.session=session}
  async execute(name,args={}){
    emitRae('rae:tool-start',{name});
    try{
      let result;
      if(name==='navigateToRoute')result=this.navigateToRoute(args.route);
      else if(name==='scrollToSection')result=this.scrollToSection(args.id);
      else if(name==='openProject')result=this.openProject(args.name);
      else if(name==='showPlan')result=this.showPlan(args.planId);
      else if(name==='highlightElement')result=this.highlightElement(args.id);
      else throw new Error('Unsupported Rae action');
      this.session?.setRecentAction(`${name}:${JSON.stringify(args).slice(0,100)}`);
      emitRae('rae:tool-success',{name,args});return result;
    }catch(error){emitRae('rae:tool-error',{name,error:String(error?.message||error)});throw error}
  }
  navigateToRoute(route){const safe=validInternal(clean(route));if(!safe)throw new Error('Route is not allowlisted');location.assign(safe);return{ok:true,route:safe}}
  scrollToSection(id){
    const safe=clean(id);if(!SECTIONS.has(safe))throw new Error('Section is not allowlisted');const selector=HIGHLIGHTS[safe];const node=document.querySelector(selector);if(!node)throw new Error('Section is not on this page');node.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});this.flash(node);return{ok:true,id:safe};
  }
  openProject(name){const route=PROJECTS[clean(name).toLowerCase()];if(!route)throw new Error('Project is not allowlisted');return this.navigateToRoute(route)}
  showPlan(planId){const safe=clean(planId).toLowerCase();if(!PLAN_IDS.has(safe))throw new Error('Plan is not allowlisted');try{sessionStorage.setItem('rae:plan-highlight',safe)}catch{}if(location.pathname!=='/plans')return this.navigateToRoute('/plans');const node=document.querySelector(`[data-plan-id="${CSS.escape(safe)}"],#${CSS.escape(safe)}`);if(node){node.scrollIntoView({behavior:'smooth',block:'center'});this.flash(node)}return{ok:true,planId:safe}}
  highlightElement(id){const safe=clean(id);if(!SECTIONS.has(safe))throw new Error('Highlight target is not allowlisted');const node=document.querySelector(HIGHLIGHTS[safe]);if(!node)throw new Error('Highlight target unavailable');this.flash(node);return{ok:true,id:safe}}
  flash(node){node.classList.remove('rae-guided-target');void node.offsetWidth;node.classList.add('rae-guided-target');setTimeout(()=>node.classList.remove('rae-guided-target'),1500)}
}

export const safeActionFromPrompt=text=>{
  const value=clean(text).toLowerCase();
  if(/^(show|open|take me to) (client|work|portfolio)/.test(value))return{name:'navigateToRoute',args:{route:'/clients'}};
  if(/^(show|open|take me to) (plans|pricing)/.test(value))return{name:'navigateToRoute',args:{route:'/plans'}};
  if(/^(open|show) fakhri/.test(value))return{name:'openProject',args:{name:'fakhrimart'}};
  if(/^(contact|open contact|show contact)/.test(value)&&location.pathname==='/')return{name:'scrollToSection',args:{id:'contact'}};
  return null;
};
