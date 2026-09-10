import type { ModuleManifest } from './manifest';
import { emailsModule } from '../modules/emails-magement/manifest';
import { termsModule } from '../modules/terms/manifest';
import { assetsModule } from '../modules/asset/manifest';
import { rbacModule } from '../modules/rbac-manager/manifest';
import { mediaLibraryModule } from '../modules/media-library/manifest';
import { dashboardModule } from '../modules/dashboard/manifest';
import { membershipsModule } from '../modules/memberships_v2/manifest';
import { finalizeRegistry } from './registry';

/**
 * The explicit module list (proposal §6.1 — no register-at-import side
 * effects). Order here is NOT menu order; the sidebar follows the
 * `APP_MODULES` order in `config/modules.ts`.
 *
 * Adding a module: create `modules/<name>/manifest.tsx`, import it here, add
 * it to the array. Its `<Resource>`s, routes and menu entry replace the
 * legacy hand-written blocks automatically (see `legacyWiring.tsx`).
 */
export const MODULES: ModuleManifest[] = [dashboardModule, mediaLibraryModule, emailsModule, termsModule, assetsModule, rbacModule, membershipsModule];

export const REGISTRY = finalizeRegistry(MODULES);
