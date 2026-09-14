const clean=value=>String(value??'').replace(/\u0000/g,'').trim();

export class RaeChatClient{
  constructor(endpoint='/api/rae-chat'){
    this.endpoint=endpoint;this.controller=null;this.lastRequest=null;
  }
  abort(reason='user'){if(this.controller&&!this.controller.signal.aborted)this.controller.abort(reason)}
  async stream({message,history=[],context={},session={},onEvent=()=>{},timeoutMs=32000}){
    this.abort('superseded');
    const controller=new AbortController();this.controller=controller;
    const timeout=setTimeout(()=>controller.abort('timeout'),timeoutMs);
    const payload={message:clean(message).slice(0,1200),history:history.slice(-8),context,session};
    this.lastRequest={message,history,context,session};
    let terminal=false,sawDelta=false;
    const dispatch=event=>{if(event.type==='delta')sawDelta=true;if(event.type==='done'||event.type==='error')terminal=true;onEvent(event)};
    try{
      const response=await fetch(this.endpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'text/event-stream'},body:JSON.stringify(payload),signal:controller.signal,cache:'no-store',credentials:'same-origin'});
      const contentType=response.headers.get('content-type')||'';
      if(!response.ok||!response.body||!contentType.includes('text/event-stream')){
        const data=await response.json().catch(()=>({}));
        const error=new Error(data.error||`Rae AI unavailable (${response.status})`);error.code=data.code||`http_${response.status}`;throw error;
      }
      const reader=response.body.getReader();const decoder=new TextDecoder();let buffer='';
      while(true){
        const {value,done}=await reader.read();if(done)break;
        buffer+=decoder.decode(value,{stream:true}).replace(/\r\n/g,'\n');
        let boundary;
        while((boundary=buffer.indexOf('\n\n'))>=0){const packet=buffer.slice(0,boundary);buffer=buffer.slice(boundary+2);this.parsePacket(packet,dispatch)}
      }
      if(buffer.trim())this.parsePacket(buffer,dispatch);
      if(!terminal){const error=new Error(sawDelta?'Rae’s response ended before it finished.':'Rae returned an empty response.');error.code=sawDelta?'stream_closed':'empty_response';throw error}
    }catch(error){
      if(controller.signal.aborted){const aborted=new Error(controller.signal.reason==='timeout'?'Rae request timed out.':'Generation stopped.');aborted.name='AbortError';aborted.code=controller.signal.reason==='timeout'?'timeout':'aborted';throw aborted}
      throw error;
    }finally{clearTimeout(timeout);if(this.controller===controller)this.controller=null}
  }
  parsePacket(packet,onEvent){
    let event='message';const data=[];
    for(const line of packet.split('\n')){if(line.startsWith('event:'))event=line.slice(6).trim();else if(line.startsWith('data:'))data.push(line.slice(5).trimStart())}
    if(!data.length)return;
    let payload;const raw=data.join('\n');try{payload=JSON.parse(raw)}catch{payload={text:raw}}
    onEvent({type:event,data:payload});
  }
  retry(onEvent){if(!this.lastRequest)throw new Error('Nothing to retry');return this.stream({...this.lastRequest,onEvent})}
}
