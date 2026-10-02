import {EventEmitter} from 'node:events';
import handler from '../api/rae-chat.js';

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
    return{ok:true,status:200,body:streamOf('data: {"choices":[{"delta":{"content":"Backup works."}}]}\n\ndata: {"choices":[{"delta":{},"finish_reason":"stop"}]}\n\ndata: [DONE]\n\n'),text:async()=>''};
  };
  const req={method:'POST',headers:{'x-forwarded-for':'203.0.113.9'},socket:{remoteAddress:'203.0.113.9'},body:{message:'Can you help me?',history:[],context:{pageKey:'home',pathname:'/'},session:{}}};
  const res=new MockResponse();await handler(req,res);const output=res.text();
  assert(res.writableEnded,'Rae fallback request did not finish');
  assert(urls.length===4,`Expected four provider attempts, got ${urls.length}`);
  assert(urls[2].includes('gemini-3.7-flash'),'Rae did not try the older Gemini backup model');
  assert(urls[3].includes('api.groq.com'),'Rae did not reach the Groq backup provider');
  assert(output.includes('Backup works.'),'Backup provider text was not streamed');
  assert(output.includes('"attempt":4'),'Recovery attempt state was not streamed');
  assert(output.includes('"recovered":true'),'Recovered completion metadata missing');
  assert(output.includes('event: done'),'Successful fallback did not emit done');

  process.env.GEMINI_MODEL='gemini-3.8-flash';delete process.env.GROQ_API_KEY;
  let generationConfig;
  globalThis.fetch=async(_url,options)=>{
    generationConfig=JSON.parse(options.body).generationConfig;
    const event={candidates:[{content:{parts:[{text:'private reasoning',thought:true},{text:'Gemini answer.'}]},finishReason:'STOP'}]};
    return{ok:true,status:200,body:streamOf(`data: ${JSON.stringify(event)}\n\n`),text:async()=>''};
  };
  const geminiReq={...req,headers:{'x-forwarded-for':'203.0.113.10'}};
  const geminiRes=new MockResponse();await handler(geminiReq,geminiRes);
  assert(generationConfig?.thinkingConfig?.thinkingLevel==='low','Gemini 3 chat should use low thinking effort');
  assert(generationConfig.maxOutputTokens===8192,'Gemini 3 needs output headroom after internal thinking');
  assert(!('temperature' in generationConfig)&&!('topP' in generationConfig),'Gemini 3 must use its supported generation defaults');
  assert(geminiRes.text().includes('Gemini answer.')&&geminiRes.text().includes('event: done'),'Gemini response was not streamed');
  assert(!geminiRes.text().includes('private reasoning'),'Thought parts must not be sent to visitors');

  for(const [reason,code] of [['MAX_TOKENS','output_truncated'],[null,'provider_incomplete']]){
    let calls=0;
    globalThis.fetch=async()=>{calls++;const event={candidates:[{content:{parts:[{text:'private reasoning',thought:true},{text:'Launch Website starts at ₹9,999 for'}]},...(reason?{finishReason:reason}:{})}],usageMetadata:{thoughtsTokenCount:1500}};return{ok:true,status:200,body:streamOf(`data: ${JSON.stringify(event)}\n\n`)}};
    const partialRes=new MockResponse();await handler({...req,headers:{'x-forwarded-for':`203.0.113.${reason?13:14}`}},partialRes);
    assert(calls===1,'Never append a second provider after partial visible text');
    assert(partialRes.text().includes(`"code":"${code}"`),'Incomplete provider response must be reported accurately');
    assert(!partialRes.text().includes('event: done')&&!partialRes.text().includes('event: meta'),'Incomplete text must not be declared successful');
    assert(!partialRes.text().includes('private reasoning'),'Incomplete responses must still hide thoughts');
  }

  process.env.RAE_PROVIDER='groq';process.env.GROQ_API_KEY='test-groq';
  globalThis.fetch=async()=>({ok:true,status:200,body:streamOf('data: {"choices":[{"delta":{"content":"A cut off answer"},"finish_reason":"length"}]}\n\ndata: [DONE]\n\n')});
  const lengthRes=new MockResponse();await handler({...req,headers:{'x-forwarded-for':'203.0.113.15'}},lengthRes);
  assert(lengthRes.text().includes('"code":"output_truncated"')&&!lengthRes.text().includes('event: done'),'OpenAI compatible length termination must remain an error');
  process.env.RAE_PROVIDER='gemini';delete process.env.GROQ_API_KEY;

  const recoveryModels=[];
  globalThis.fetch=async(url,options)=>{
    const model=String(url).match(/models\/([^:]+)/)?.[1];
    recoveryModels.push(model);
    if(model==='gemini-3.8-flash'||model==='gemini-3.7-flash')return{ok:false,status:503,body:null,text:async()=>'{"error":"overloaded"}'};
    const body=JSON.parse(options.body);
    assert(body.generationConfig.thinkingConfig.thinkingLevel==='minimal','Flash-Lite recovery must use supported minimal thinking');
    assert(body.systemInstruction.parts[0].text.includes('₹9,999'),'Recovery model lost the verified India price context');
    return{ok:true,status:200,body:streamOf('data: {"candidates":[{"content":{"parts":[{"text":"Launch Website starts at ₹9,999."}]},"finishReason":"STOP"}]}\n\n'),text:async()=>''};
  };
  const recoveryRes=new MockResponse();await handler({...req,headers:{'x-forwarded-for':'203.0.113.11'}},recoveryRes);
  assert(recoveryModels.join(',')==='gemini-3.8-flash,gemini-3.7-flash,gemini-3.5-flash-lite','Google-only recovery did not reach a separate model family');
  assert(recoveryRes.text().includes('Launch Website starts at ₹9,999.')&&recoveryRes.text().includes('event: done'),'Recovery answer did not complete');
  assert(recoveryRes.text().includes('"recovered":true'),'Recovery must be recorded in completion metadata');

  let exhaustedAttempts=0;
  globalThis.fetch=async()=>{exhaustedAttempts++;return{ok:false,status:503,body:null,text:async()=>'{"error":"overloaded"}'}};
  const exhaustedRes=new MockResponse();await handler({...req,headers:{'x-forwarded-for':'203.0.113.12'}},exhaustedRes);
  assert(exhaustedAttempts===4,'Recovery must stay within four provider attempts');
  assert(exhaustedRes.text().includes('event: error')&&!exhaustedRes.text().includes('event: done'),'An exhausted outage must remain an honest error');

  console.log('Rae provider fallback OK: provider recovery is working.');
}finally{
  globalThis.fetch=originalFetch;
  for(const [key,value] of Object.entries(originalEnv)){if(value===undefined)delete process.env[key];else process.env[key]=value}
}
