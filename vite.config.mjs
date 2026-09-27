import {resolve} from 'node:path';
import {defineConfig} from 'vite';

const root=resolve(process.cwd(),'site');
const routes={'/plans':'/plans.html','/clients':'/clients.html','/clients/fakhrimart':'/fakhrimart-case-study.html','/founder':'/founder.html','/terms':'/terms.html'};
function localRoutes(server){
  server.middlewares.use((request,response,next)=>{
    const url=new URL(request.url||'/','http://local.test');
    if(url.pathname==='/api/market'){
      response.setHeader('Content-Type','application/json; charset=utf-8');
      response.setHeader('Cache-Control','no-store');
      response.end(JSON.stringify({country:null,market:'in',language:'en',source:'local-preview'}));
      return;
    }
    const legacy={'/ai-workflow-audit':'/plans#ai-workflow-audit','/company-second-brain':'/plans#company-second-brain'}[url.pathname];
    if(legacy){response.statusCode=302;response.setHeader('Location',legacy);response.end();return}
    const clean=url.pathname.replace(/\/$/,'')||'/';
    if(routes[clean])request.url=routes[clean]+url.search;
    else if(/^\/(ae|au)(?:\/.*)?$/.test(clean)&&!clean.includes('.'))request.url=`${clean}/index.html${url.search}`;
    next();
  });
}
export default defineConfig({
  root,
  publicDir:resolve(process.cwd(),'site-public'),
  plugins:[{name:'award-local-routes',configureServer:localRoutes,configurePreviewServer:localRoutes}],
  build:{outDir:resolve(process.cwd(),'dist'),emptyOutDir:true,rollupOptions:{input:Object.fromEntries(['index','plans','clients','fakhrimart-case-study','founder','terms'].map(name=>[name,resolve(root,`${name}.html`)]))}}
});
