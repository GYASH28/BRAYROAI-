const clean=value=>String(value??'').trim().replace(/\s+/g,' ');

export const ROUTES=Object.freeze({
  home:'/',plans:'/plans',clients:'/clients',case:'/clients/fakhrimart',founder:'/founder',terms:'/terms',audit:'/ai-workflow-audit',brain:'/company-second-brain'
});

export const PAGE_INFO=Object.freeze({
  home:{label:'BRAYROAI homepage',summary:'Distinctive websites, digital products and practical AI systems.',chips:['What can BRAYROAI build?','Which plan fits my project?','Show me your work','I have a project idea']},
  plans:{label:'Plans',summary:'Monthly website support, one-time website builds and focused AI systems.',chips:['Compare these plans','Which one fits me?','What is included?','Start a project']},
  clients:{label:'Client work',summary:'Verified client work is kept separate from studio experiments.',chips:['Show me FakhriMart','What changed for the client?','Can you build something similar?','Start a project']},
  case:{label:'FakhriMart case study',summary:'A verified yarn and craft catalogue experience focused on discovery and useful enquiry.',chips:['What did BRAYROAI do here?','Can you build something similar?','Show me the process','Start a project']},
  founder:{label:'Founder',summary:'Yash Ganesh leads BRAYROAI strategy, interface and implementation.',chips:['Who is Yash?','Why a small studio?','How does BRAYRO work?','Start a project']},
  terms:{label:'Terms',summary:'Commercial terms, scope boundaries and working expectations.',chips:['Give me the human version','What about payments?','What counts as extra?','I have a project question']},
  audit:{label:'AI Workflow Audit',summary:'A ₹9,999 workflow audit that maps the current process and prioritises useful AI opportunities.',chips:['Explain this simply','Is this right for my business?','What do I get?','Audit or Second Brain?']},
  brain:{label:'Company Second Brain',summary:'A grounded internal knowledge system starting at ₹29,999.',chips:['Explain this simply','Would this help my team?','What sources can it use?','Audit or Second Brain?']},
  default:{label:'BRAYROAI',summary:'A BRAYROAI studio page.',chips:['What does BRAYRO do?','Show me work','Help me choose','Contact Yash']}
});

export function getPageKey(pathname=location.pathname){
  const path=pathname.replace(/\/$/,'')||'/';
  if(path==='/'||path.endsWith('/index.html'))return 'home';
  if(path==='/plans'||path.endsWith('/plans.html'))return 'plans';
  if(path==='/clients')return 'clients';
  if(path==='/clients/fakhrimart'||path.endsWith('/fakhrimart-case-study.html'))return 'case';
  if(path==='/founder'||path.endsWith('/founder.html'))return 'founder';
  if(path==='/terms'||path.endsWith('/terms.html'))return 'terms';
  if(path==='/ai-workflow-audit'||path.endsWith('/ai-workflow-audit.html'))return 'audit';
  if(path==='/company-second-brain'||path.endsWith('/company-second-brain.html'))return 'brain';
  return 'default';
}

export class RaeSession{
  constructor(){
    this.key='rae:v2:session';
    this.state=this.read()||{messages:[],summary:'',profile:{},recentAction:'',createdAt:Date.now()};
  }
  read(){try{return JSON.parse(sessionStorage.getItem(this.key)||'null')}catch{return null}}
  save(){try{sessionStorage.setItem(this.key,JSON.stringify(this.state))}catch{}}
  add(role,text){
    const item={role:role==='assistant'?'assistant':'user',text:clean(text).slice(0,1400)};
    if(!item.text)return;
    this.state.messages.push(item);
    if(this.state.messages.length>12){
      const older=this.state.messages.splice(0,this.state.messages.length-8);
      const compact=older.map(entry=>`${entry.role==='user'?'Visitor':'Rae'}: ${entry.text}`).join(' | ');
      this.state.summary=clean([this.state.summary,compact].filter(Boolean).join(' | ')).slice(-2400);
    }
    this.captureProfile(item);
    this.save();
  }
  captureProfile(item){
    if(item.role!=='user')return;
    const text=item.text;
    const profile=this.state.profile||{};
    const budget=text.match(/(?:₹|rs\.?|inr)?\s*(\d{1,3}(?:[,\s]\d{3})+|\d+(?:\.\d+)?\s*k)\b/i);
    const timeline=text.match(/\b(?:in|within|around)\s+(\d+\s*(?:day|week|month)s?)\b/i);
    const business=text.match(/\b(?:i run|i own|my|our)\s+(?:an?\s+)?([a-z][a-z\s-]{2,35}?)(?:\s+(?:business|company|brand|studio|agency|restaurant|clinic|school|store))?(?:[,.]|\s+and\b|\s+with\b|$)/i);
    if(budget)profile.budget=clean(budget[0]);
    if(timeline)profile.timeline=clean(timeline[1]);
    if(business&&!profile.business)profile.business=clean(business[1]).slice(0,48);
    if(/restaurant|cafe|bakery|food|cloud kitchen/i.test(text))profile.businessType='restaurant';
    else if(/e-?commerce|online store|retail|fashion|product brand/i.test(text))profile.businessType='ecommerce';
    else if(/manufactur|factory|supplier|wholesale|distributor/i.test(text))profile.businessType='manufacturer';
    else if(/clinic|doctor|dentist|healthcare|medical/i.test(text))profile.businessType='clinic';
    else if(/school|college|academy|education|coaching/i.test(text))profile.businessType='education';
    else if(/real estate|property|broker|builder/i.test(text))profile.businessType='real-estate';
    else if(/agency|studio|marketing|creative|freelance/i.test(text))profile.businessType='agency';
    else if(/saas|software|app|startup|platform/i.test(text))profile.businessType='software';
    if(/booking|lead|enquir|sales|conversion|customer|grow|launch|redesign|automate|workflow/i.test(text))profile.goal=clean(text).slice(0,180);
    this.state.profile=profile;
  }
  setRecentAction(value){this.state.recentAction=clean(value).slice(0,120);this.save()}
  history(){return this.state.messages.slice(-8)}
  snapshot(){return{summary:this.state.summary,profile:this.state.profile,recentAction:this.state.recentAction}}
}

export class RaePageContext{
  constructor(onSection){
    this.pageKey=getPageKey();
    this.section='';
    this.onSection=onSection;
    this.observer=null;
  }
  start(){
    document.body.dataset.raePage=['audit','brain'].includes(this.pageKey)?'ai':this.pageKey;
    if(!('IntersectionObserver'in window))return;
    const nodes=[...document.querySelectorAll('[data-scene],[data-plan-scene],[data-founder-scene],.terms-section,.case-section,.client-work-section,main>section')];
    if(!nodes.length)return;
    this.observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!visible)return;
      const node=visible.target;
      const next=node.id||node.dataset.scene||node.dataset.planScene||node.dataset.founderScene||'';
      if(next&&next!==this.section){this.section=next;this.onSection?.(next)}
    },{threshold:[.25,.5,.72],rootMargin:'-16% 0px -28% 0px'});
    [...new Set(nodes)].forEach(node=>this.observer.observe(node));
  }
  payload(recentAction=''){
    return{pathname:location.pathname,section:this.section,pageTitle:document.title.slice(0,120),pageKey:this.pageKey,recentRaeAction:recentAction||''};
  }
  dispose(){this.observer?.disconnect()}
}
