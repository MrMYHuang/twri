import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';

export default defineConfig({
  base: '/twri/',
  resolve: {
    alias: {
      'twri-data': path.resolve(__dirname, 'twri-data/src/index.ts'),
    },
  },
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
