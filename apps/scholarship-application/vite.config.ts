/// <reference types='vitest' />
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: __dirname,
  base: './',
  cacheDir: '../../node_modules/.vite/apps/scholarship-application',
  resolve: {
    alias: {
      '@orwa/terms-gate': path.resolve(__dirname, '../../libs/terms-gate/src/index.ts'),
      '@orwa/public-form': path.resolve(__dirname, '../../libs/public-form/src/index.ts'),
    },
  },
  server: {
    port: 4206,
    host: 'localhost',
    // Windows Cursor.exe holds 4206 (same Hyper-V/port-steal as grant-map 4203).
    strictPort: false,
    fs: {
      allow: ['../..'],
    },
  },
  preview: {
    port: 4206,
    host: 'localhost',
  },
  plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  build: {
    outDir: '../../dist/apps/scholarship-application',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
