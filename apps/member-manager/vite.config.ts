import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * member-manager's VITE_API_ENDPOINT is the Strapi HOST ROOT; the code appends
 * `/api` itself (~60 call sites). Other apps (conference-registration,
 * terms-gate) expect the value to already end in `/api`, and a shell that has
 * exported theirs silently overrides this app's `.env.production` — Vite gives
 * OS env precedence over .env files. That shipped a bundle full of
 * `admin.orwa.org/api/api/...` (405 on login) on 2026-09-09, and localhost
 * bundles on 2026-07-16. Refuse to build anything that would repeat either.
 */
function assertApiEndpoint(mode: string) {
  const fileEnv = loadEnv(mode, __dirname, 'VITE_')
  const endpoint = process.env.VITE_API_ENDPOINT ?? fileEnv.VITE_API_ENDPOINT ?? ''
  const source = process.env.VITE_API_ENDPOINT !== undefined ? 'shell environment' : `.env / .env.${mode}`
  const hint = `Resolved VITE_API_ENDPOINT="${endpoint}" from the ${source}. ` +
    'Build with a clean shell: `env -u VITE_API_ENDPOINT -u VITE_API_KEY npx vite build --mode production`.'

  if (!endpoint) {
    throw new Error(`[member-manager] VITE_API_ENDPOINT is not set. ${hint}`)
  }
  if (/\/api\/?$/i.test(endpoint)) {
    throw new Error(
      `[member-manager] VITE_API_ENDPOINT must be the host root WITHOUT a trailing /api ` +
      `(the app appends /api itself; this value would produce /api/api URLs). ${hint}`
    )
  }
  if (mode === 'production' && /localhost|127\.0\.0\.1/i.test(endpoint)) {
    throw new Error(`[member-manager] production build must not point at localhost. ${hint}`)
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === 'build') assertApiEndpoint(mode)

  return {
  plugins: [react({
    // Add this to improve Fast Refresh reliability. Off under Vitest: the
    // refresh runtime expects a browser preamble that jsdom never injects, so
    // leaving it on makes every component test fail to collect.
    fastRefresh: !process.env.VITEST,
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
  }
})
