import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  publicDir:'public',
  build:{
    outDir:'dist',
    emptyOutDir:true,
    assetsInlineLimit:4096,
    rollupOptions:{
      input:{
        home:resolve(process.cwd(),'index.html'),
        plans:resolve(process.cwd(),'plans.html')
      }
    }
  }
});
