import type { ModuleManifest } from './manifest';
import { emailsModule } from '../modules/emails-magement/manifest';
import { grantsModule } from '../modules/grant-manager/manifest';
import { conferenceModule } from '../modules/conference/manifest';
import { termsModule } from '../modules/terms/manifest';
import { membershipsModule } from '../modules/memberships_v2/manifest';
import { assetsModule } from '../modules/asset/manifest';
import { rbacModule } from '../modules/rbac-manager/manifest';
import { trainingModule } from '../modules/training/manifest';
import { mediaLibraryModule } from '../modules/media-library/manifest';
import { dashboardModule } from '../modules/dashboard/manifest';
import { contactsModule } from '../modules/human-resources/manifest';
import { settingsModule } from '../modules/setting/manifest';
import { awardsModule } from '../modules/award-nominations/manifest';
import { scholarshipsModule } from '../modules/orwef-scholarships/manifest';
import { corporateSponsorsModule } from '../modules/sponsors/manifest';
import { finalizeRegistry } from './registry';

/**
 * The explicit module list (proposal §6.1 — no register-at-import side
 * effects). Order here is NOT menu order; the sidebar and RBAC editor follow
 * `ALL_MODULE_KEYS` in `config/modules.ts`.
 *
 * Adding a module: add its key to `ModuleKey` + `ALL_MODULE_KEYS` (and the
 * Strapi `MODULE_KEYS` seed), create `modules/<name>/manifest.tsx`, import it
 * here, add it to the array. Its `<Resource>`s, routes and menu entry come
 * from the manifest — App.tsx / Admin.tsx need no edit.
 */
export const MODULES: ModuleManifest[] = [dashboardModule, mediaLibraryModule, emailsModule, grantsModule, conferenceModule, termsModule, assetsModule, rbacModule, membershipsModule, trainingModule, awardsModule, scholarshipsModule, corporateSponsorsModule, contactsModule, settingsModule];

export const REGISTRY = finalizeRegistry(MODULES);
