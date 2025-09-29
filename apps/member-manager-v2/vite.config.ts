import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import rollupPreserveDirectives from 'rollup-preserve-directives';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// Simple function to check if we're in CI
const isCI = () => {
    return process.env.CI === 'true' || process.env.NODE_ENV === 'CI';
};

// Check if we're running in Docker
const isDocker = () => {
    try {
        return (
            fs.existsSync('/.dockerenv') ||
            process.env.DOCKER_CONTAINER === 'true'
        );
    } catch {
        return false;
    }
};

// Log environment for debugging (only if not in CI to reduce noise)
if (!isCI()) {
    console.log(`Running in ${isDocker() ? 'Docker' : 'local'} environment`);
    console.log(`Current directory: ${process.cwd()}`);
    console.log(`Node version: ${process.version}`);
}

// https://vitejs.dev/config/
export default defineConfig(async () => {
    // Base plugins that work in all environments
    const basePlugins = [
        react(),
        nxViteTsPaths(),
        tsconfigPaths({
            // Use loose mode to be more forgiving with path resolution
            loose: true,
            // Ignore tsconfig errors in CI
            ignoreConfigErrors: isCI(),
        }),
    ];

    // Add visualizer only in non-CI environments using dynamic import
    if (!isCI()) {
        try {
            const { visualizer } = await import('rollup-plugin-visualizer');
            basePlugins.push(
                visualizer({
                    open: false,
                    filename: './build/stats.html',
                })
            );
        } catch (error) {
            console.warn(
                'Visualizer plugin failed to load (this is normal in CI):',
                error
            );
        }
    }

    return {
        plugins: basePlugins,
        server: {
            port: 8000,
            host: '0.0.0.0',
            open: false,
            watch: {
                usePolling: !isCI(), // Disable polling in CI
                interval: 1000,
                ignored: [
                    '**/node_modules/**',
                    '**/dist/**',
                    '**/build/**',
                    '**/.git/**',
                    '**/coverage/**',
                ],
            },
            hmr: isCI()
                ? false
                : {
                      // HMR settings for development only
                      host: 'localhost',
                      port: 8000,
                      clientPort: isDocker() ? undefined : 8000,
                      protocol: 'ws',
                      timeout: 5000,
                  },
        },
        base: './',
        esbuild: {
            keepNames: true,
        },
        build: {
            outDir: 'build',
            sourcemap: !isCI(), // Disable sourcemaps in CI for faster builds
            rollupOptions: {
                plugins: [rollupPreserveDirectives],
                // Ignore missing dependencies in CI
                external: isCI() ? [] : undefined,
            },
        },
        resolve: {
            preserveSymlinks: !isCI(), // Simplify in CI
            alias: [
                // allow profiling in production
                { find: /^react-dom$/, replacement: 'react-dom/profiling' },
                {
                    find: 'scheduler/tracing',
                    replacement: 'scheduler/tracing-profiling',
                },
                // Add aliases for assets
                {
                    find: '/assets',
                    replacement: path.resolve(__dirname, './assets'),
                },
                // Add alias for local src directory (fixes @/_components imports)
                {
                    find: '@',
                    replacement: path.resolve(__dirname, './src'),
                },
            ],
        },
        // Optimize for CI environment
        optimizeDeps: {
            // Note: optimizeDeps.disabled was removed in Vite 5.1
            // Use include/exclude instead for dependency optimization
            include: isCI() ? [] : undefined,
        },
    };
});
