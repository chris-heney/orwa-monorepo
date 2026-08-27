import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    // Add this to improve Fast Refresh reliability
    fastRefresh: true,
  })],
  resolve: {
    alias: {
      '@orwa/terms-gate': path.resolve(__dirname, '../../libs/terms-gate/src/index.ts'),
      '@orwa/entity-id': path.resolve(__dirname, 'src/fields/index.ts'),
    },
  },
  define: {
    'process.env': process.env,
  },
  // ag-grid-community@36 uses BigInt literals; safari13/default vite3 targets reject them.
  esbuild: {
    target: 'es2022',
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2022',
    },
  },
  server: {
    host: '0.0.0.0',
    port: 4205,
    strictPort: true,
    hmr: {
      // No explicit host/clientPort: the client uses window.location so HMR
      // follows the actual listen port (4205, or whatever Vite was started on).
      overlay: true,
    },
    watch: {
      usePolling: true,
      interval: 500,
      binaryInterval: 1000,
    },
  },
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 100,
    rollupOptions: {
      // external: "highchart",
      // external: ["exceljs", "file-saver"],
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
})
