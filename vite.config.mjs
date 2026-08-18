import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
        work: resolve(process.cwd(), 'work.html'),
        fakhrimart: resolve(process.cwd(), 'work/fakhrimart.html')
      }
    }
  }
});
