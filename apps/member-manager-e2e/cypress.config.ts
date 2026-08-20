import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      bundler: 'vite',
      webServerCommands: {
        default: 'npx nx run member-manager:serve',
      },
      ciBaseUrl: 'http://localhost:4205',
    }),
    baseUrl: 'http://localhost:4205',
    // Role gating is decided by the API, so the specs need to reach it too.
    env: {
      apiUrl: 'http://localhost:13370',
    },
    retries: { runMode: 1, openMode: 0 },
  },
});
