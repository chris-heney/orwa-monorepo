import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    // Add this to improve Fast Refresh reliability
    fastRefresh: true,
  })],
  define: {
    'process.env': process.env,
  },
  server: {
    host: '0.0.0.0',
    port: 4205,
    strictPort: true,
    hmr: {
      // No explicit host: the client falls back to window.location.hostname,
      // so HMR works whether the app is opened via localhost or a LAN/WSL IP.
      clientPort: 4205,
      overlay: true,
    },
    watch: {
      usePolling: true,
      interval: 500,
      binaryInterval: 1000,
    },
  },
  build: {
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
