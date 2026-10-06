const allowed=new Set([
  'Page view',
  'Project brief started',
  'WhatsApp enquiry',
  'Email enquiry',
  'Intro call request',
  'Plan detail opened',
  'Offer enquiry',
  'Market changed',
  'Studio system opened',
  'Client case opened'
]);

const clean=value=>String(value??'').replace(/[\r\n\u0000]/g,' ').trim();
const safePath=value=>{
 const path=clean(value).slice(0,180);
 return path.startsWith('/')?path:'/';
};
const safeData=input=>{
 if(!input||typeof input!=='object'||Array.isArray(input))return{};
 return Object.fromEntries(
  Object.entries(input)
   .filter(([key,value])=>/^[a-zA-Z0-9_-]{1,32}$/.test(key)&&['string','number','boolean'].includes(typeof value))
   .slice(0,2)
   .map(([key,value])=>[key,typeof value==='string'?clean(value).slice(0,80):value])
 );
};

export default function handler(req,res){
 res.setHeader('Cache-Control','no-store, max-age=0');
 if(req.method!=='POST')return res.status(405).json({error:'POST only'});
 let body=req.body;
 if(typeof body==='string'){try{body=JSON.parse(body)}catch{return res.status(400).json({error:'Invalid JSON'})}}
 if(!body||typeof body!=='object'||Array.isArray(body))return res.status(400).json({error:'Invalid request'});
 const event=clean(body.event).slice(0,60);
 if(!allowed.has(event))return res.status(400).json({error:'Unknown event'});
 const record={
  type:'brayro_site_event',
  event,
  path:safePath(body.path),
  data:safeData(body.data),
  at:new Date().toISOString()
 };
 console.info(JSON.stringify(record));
 return res.status(204).end();
}
