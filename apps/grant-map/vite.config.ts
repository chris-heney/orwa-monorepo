/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: __dirname,
  base: './',
  cacheDir: '../../node_modules/.vite/apps/grant-map',
  server: {
    port: 4203,
    host: 'localhost',
    // Windows-side processes (e.g. Cursor.exe) can hold 4203; let vite hop to the next free port
    strictPort: false,
    fs: {
      // Nx dev-server executor computes an incorrect allow list; permit the workspace root
      allow: ['../..'],
    },
  },
  preview: {
    port: 4203,
    host: 'localhost',
  },
  plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: '../../dist/apps/grant-map',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
