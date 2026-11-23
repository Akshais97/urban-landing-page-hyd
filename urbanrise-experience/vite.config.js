import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const workspace = fileURLToPath(new URL('../', import.meta.url));

export default defineConfig({
  base: './',
  publicDir: '.preview-assets',
  resolve: {
    dedupe: ['react', 'react-dom', 'gsap', '@gsap/react', 'framer-motion'],
  },
  server: { fs: { allow: [workspace] } },
});
