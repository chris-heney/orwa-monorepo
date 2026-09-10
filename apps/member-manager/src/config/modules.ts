/**
 * RBAC module keys + the `AppModule` table the route guard, login redirect and
 * RBAC Manager read. The table itself is registry output: each
 * `ModuleManifest` (`modules/<x>/manifest.tsx`, listed in
 * `framework/modules.ts`) declares its menu, routes, resources and
 * permissions, and `finalizeRegistry()` writes them here.
 *
 * NOTE: the backend seed list `MODULE_KEYS` in `apps/strapi/src/index.ts`
 * must stay in sync with `ALL_MODULE_KEYS` below.
 */

export type ModuleKey =
  | 'dashboard'
  | 'emails'
  | 'memberships'
  | 'contacts'
  | 'assets'
  | 'media-library'
  | 'training'
  | 'conference'
  | 'terms'
  | 'grants'
  | 'scholarships'
  | 'awards'
  | 'rbac'
  | 'settings'
  | 'corporate-sponsors';

export interface AppModule {
  key: ModuleKey;
  /** Menu label, e.g. "Asset Manager" */
  label: string;
  /** Primary route the menu item links to, e.g. "/assets" */
  to: string;
  /** Route prefixes owned by the module, matched by the route guard */
  pathPrefixes: string[];
  /** react-admin resource names owned by the module */
  resources: string[];
}

/**
 * Seed contract — every module key, in sidebar / RBAC-editor order. Mirrors
 * `MODULE_KEYS` in `apps/strapi/src/index.ts` (which lacks
 * `'corporate-sponsors'` until that seed is updated; grant it per role in RBAC
 * Manager meanwhile).
 */
export const ALL_MODULE_KEYS: readonly ModuleKey[] = [
  'dashboard',
  'emails',
  'memberships',
  'contacts',
  'assets',
  'media-library',
  'training',
  'conference',
  'terms',
  'grants',
  'scholarships',
  'awards',
  'rbac',
  'settings',
  'corporate-sponsors',
];

/**
 * Registry output. Filled (in `ALL_MODULE_KEYS` order) by
 * `finalizeRegistry()` from every `ModuleManifest.permissions` — see
 * `framework/modules.ts`. Never hand-edit: a module's label, primary route,
 * owned path prefixes and resources live in its manifest.
 */
export const APP_MODULES: AppModule[] = [];

/**
 * Primary route of the first `APP_MODULES` entry the user has access to —
 * used as the post-login landing page and as the route-guard redirect target.
 * Falls back to Settings, which every user can reach.
 */
export const firstAllowedPath = (
  modules: readonly ModuleKey[] | null | undefined
): string => {
  const first = APP_MODULES.find((module) => modules?.includes(module.key));
  return first?.to ?? '/admin/settings';
};

/** The module owning a react-admin resource, if any. */
export const moduleForResource = (resource: string): AppModule | undefined =>
  APP_MODULES.find((module) => module.resources.includes(resource));
