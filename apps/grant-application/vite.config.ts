/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: __dirname,
  // Relative base: app is hosted under a subdirectory on WP Engine (orwa.org/gapp-form/)
  base: './',
  cacheDir: '../../node_modules/.vite/apps/grant-application',
  server: {
    port: 4200,
    host: 'localhost',
    // Hopping steals member-manager :4205 (and other strict ports) when 4200 is busy.
    strictPort: true,
    fs: {
      allow: ['..', '../../node_modules']
    }
  },
  preview: {
    port: 4200,
    host: 'localhost',
  },
  plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: '../../dist/apps/grant-application',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
