import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  base: '/twri/',
  plugins: [
    react(),
    nodePolyfills(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.ts',
      injectRegister: null,
      registerType: 'autoUpdate',
    }),
  ],
  build: {
    outDir: 'build',
  },
  test: {
    environment: 'jsdom',
    setupFiles: 'src/setupTests.ts',
  },
});
