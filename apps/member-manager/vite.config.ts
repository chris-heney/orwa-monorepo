/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/member-manager',
  server: {
    port: 4205,
    host: 'localhost',
  },
  preview: {
    port: 4205,
    host: 'localhost',
  },
  plugins: [
    react({
      // Add this to improve Fast Refresh reliability
      fastRefresh: true,
    }),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md'])
  ],
  define: {
    'process.env': process.env,
  },
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: '../../dist/apps/member-manager',
    emptyOutDir: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 100,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        globals: {
          exceljs: "ExcelJS",
          "file-saver": "FileSaver",
        },
      },
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return
        }
        warn(warning)
      }
    }
  },
  base: './',
}));
