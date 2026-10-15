import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import content from './build/content.js';
import serviceWorker from './build/service-worker.js';

// Le site est servi par GitHub Pages depuis docs/ (https://allanvitu.github.io/DevToolsBox/).
// base './' + routage par hash : le build fonctionne à n'importe quelle adresse,
// y compris ouvert en local avec `npm run preview`.
export default defineConfig({
  base: './',
  plugins: [content(), vue(), serviceWorker()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    target: 'es2022',
    chunkSizeWarningLimit: 700,
  },
  test: {
    include: ['tests/**/*.test.js'],
  },
});
