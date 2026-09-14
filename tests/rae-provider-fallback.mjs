import {EventEmitter} from 'node:events';
import handler from '../api/rae-chat.js';
import {RaeChatClient} from '../public/rae/rae-chat-client.js';

const encoder=new TextEncoder();
const streamOf=text=>new ReadableStream({start(controller){controller.enqueue(encoder.encode(text));controller.close()}});
const assert=(value,message)=>{if(!value)throw new Error(message)};

class MockResponse extends EventEmitter{
  constructor(){super();this.statusCode=200;this.headers={};this.chunks=[];this.writableEnded=false}
  setHeader(name,value){this.headers[String(name).toLowerCase()]=value}
  write(chunk){this.chunks.push(String(chunk));return true}
  end(chunk=''){if(chunk)this.chunks.push(String(chunk));this.writableEnded=true}
  flushHeaders(){}
  text(){return this.chunks.join('')}
}

const originalFetch=globalThis.fetch;
const originalEnv={RAE_PROVIDER:process.env.RAE_PROVIDER,RAE_MODEL:process.env.RAE_MODEL,GEMINI_API_KEY:process.env.GEMINI_API_KEY,GEMINI_MODEL:process.env.GEMINI_MODEL,GROQ_API_KEY:process.env.GROQ_API_KEY,GROQ_MODEL:process.env.GROQ_MODEL,OPENAI_API_KEY:process.env.OPENAI_API_KEY,OPENAI_MODEL:process.env.OPENAI_MODEL};

try{
  process.env.RAE_PROVIDER='gemini';delete process.env.RAE_MODEL;process.env.GEMINI_API_KEY='test-gemini';process.env.GEMINI_MODEL='retired-test-model';process.env.GROQ_API_KEY='test-groq';delete process.env.GROQ_MODEL;delete process.env.OPENAI_API_KEY;delete process.env.OPENAI_MODEL;
  const urls=[];
  globalThis.fetch=async url=>{
    urls.push(String(url));
    if(String(url).includes('generativelanguage.googleapis.com'))return{ok:false,status:429,body:null,text:async()=>'{"error":"quota"}'};
    return{ok:true,status:200,body:streamOf('data: {"choices":[{"delta":{"content":"Backup works."}}]}\n\ndata: [DONE]\n\n'),text:async()=>''};
  };
  const req={method:'POST',headers:{'x-forwarded-for':'203.0.113.9'},socket:{remoteAddress:'203.0.113.9'},body:{message:'Can you help me?',history:[],context:{pageKey:'home',pathname:'/'},session:{}}};
  const res=new MockResponse();await handler(req,res);const output=res.text();
  assert(res.writableEnded,'Rae fallback request did not finish');
  assert(urls.length===3,`Expected three provider attempts, got ${urls.length}`);
  assert(urls[2].includes('api.groq.com'),'Rae did not reach the Groq backup provider');
  assert(output.includes('Backup works.'),'Backup provider text was not streamed');
  assert(output.includes('"attempt":3'),'Recovery attempt state was not streamed');
  assert(output.includes('"recovered":true'),'Recovered completion metadata missing');
  assert(output.includes('event: done'),'Successful fallback did not emit done');

  globalThis.fetch=async()=>({ok:true,status:200,headers:{get:()=> 'text/event-stream; charset=utf-8'},body:streamOf('event: delta\ndata: {"text":"Partial answer"}\n\n'),json:async()=>({})});
  const client=new RaeChatClient('/api/rae-chat');let closedError=null;
  try{await client.stream({message:'test',onEvent:()=>{},timeoutMs:1000})}catch(error){closedError=error}
  assert(closedError?.code==='stream_closed',`Expected stream_closed, got ${closedError?.code||'none'}`);
  console.log('Rae provider fallback OK: provider recovery and truncated-stream detection are working.');
}finally{
  globalThis.fetch=originalFetch;
  for(const [key,value] of Object.entries(originalEnv)){if(value===undefined)delete process.env[key];else process.env[key]=value}
}
