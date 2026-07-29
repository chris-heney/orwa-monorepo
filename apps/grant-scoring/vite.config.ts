/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: __dirname,
  base: './',
  cacheDir: '../../node_modules/.vite/apps/grant-scoring',
  server: {
    port: 4206,
    host: 'localhost',
    strictPort: true,
    fs: {
      // Nx dev-server executor computes an incorrect allow list; permit the workspace root
      allow: ['../..'],
    },
  },
  preview: {
    port: 4206,
    host: 'localhost',
  },
  plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  build: {
    outDir: '../../dist/apps/grant-scoring',
    emptyOutDir: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 100,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return;
        }
        warn(warning);
      },
    },
  },
}));
