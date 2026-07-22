/// <reference types='vitest' />
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: __dirname,
  base: './',
  cacheDir: '../../node_modules/.vite/apps/conference-registration',
  resolve: {
    alias: {
      '@orwa/terms-gate': path.resolve(__dirname, '../../libs/terms-gate/src/index.ts'),
    },
  },
  server: {
    port: 4202,
    host: 'localhost',
    fs: {
      // Nx dev-server executor computes an incorrect allow list; permit the workspace root
      allow: ['../..'],
    },
  },
  preview: {
    port: 4202,
    host: 'localhost',
  },
  plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: '../../dist/apps/conference-registration',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
