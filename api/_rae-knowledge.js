export const RAE_KNOWLEDGE=Object.freeze({
  studio:{
    name:'BRAYROAI',
    description:'A small creative technology studio led by Yash Ganesh. BRAYROAI builds distinctive websites, digital products and practical AI systems, keeping strategy, interface and implementation connected.',
    founder:'Yash Ganesh',
    principle:'Recommend the smallest sensible scope. Help first; do not force a bigger package.'
  },
  websitePlans:[
    {id:'monthly-starter',name:'Starter partnership',price:'₹2,599/month',kind:'ongoing website support'},
    {id:'monthly-growth',name:'Growth partnership',price:'₹3,999/month',kind:'ongoing website support'},
    {id:'monthly-studio',name:'Studio partnership',price:'₹5,999+/month',kind:'ongoing website support'},
    {id:'launch-website',name:'Launch Website',price:'₹9,999',kind:'complete one-time website build'},
    {id:'business-experience',name:'Business Experience',price:'₹17,999',kind:'larger one-time website build'},
    {id:'premium-experience',name:'Premium Experience',price:'₹25K–₹35K+',kind:'premium one-time website experience'}
  ],
  aiOffers:[
    {id:'ai-workflow-audit',name:'AI Workflow Audit',price:'₹9,999',summary:'Maps a workflow, identifies useful AI or automation opportunities, prioritises them and includes a workflow map, opportunity shortlist, priority matrix and 30-minute review.'},
    {id:'company-second-brain',name:'Company Second Brain',price:'from ₹29,999',summary:'Connects approved company sources into a controlled knowledge layer for grounded internal answers. Exact integrations depend on scope and access.'},
    {id:'knowledge-care',name:'Knowledge Care',price:'from ₹2,999/month',summary:'Ongoing care for an AI knowledge system after launch.'}
  ],
  verifiedWork:[
    {id:'fakhrimart',name:'FakhriMart',route:'/clients/fakhrimart',live:'https://fakhriyarns.vercel.app/',summary:'Verified client work for a Pune yarn and craft supplier: a catalogue-led experience focused on clearer product discovery, project/material decisions and useful enquiry flows. BRAYROAI does not claim fabricated conversion uplift, live stock or fake prices.'}
  ],
  routes:{home:'/',plans:'/plans',clients:'/clients',fakhrimart:'/clients/fakhrimart',founder:'/founder',terms:'/terms',audit:'/ai-workflow-audit',secondBrain:'/company-second-brain'},
  contact:{whatsapp:'Preferred fastest contact route on the site.',email:'Available for longer briefs.'},
  truthRules:['Never invent clients, testimonials, ROI, conversion metrics, discounts, live availability, delivery dates or guarantees.','Project-specific scope and contractual details must be confirmed in writing.','Do not claim a human is online unless explicitly known.']
});

export const RAE_ALLOWED_ACTIONS=Object.freeze({
  navigateToRoute:['/','/plans','/clients','/clients/fakhrimart','/founder','/terms','/ai-workflow-audit','/company-second-brain'],
  scrollToSection:['services','work','plans','ai-systems','founder','contact','process'],
  openProject:['fakhrimart'],
  showPlan:['monthly-starter','monthly-growth','monthly-studio','launch-website','business-experience','premium-experience','ai-workflow-audit','company-second-brain']
});
