import React, { ReactElement } from 'react';
import type { ModuleKey } from './config/modules';
import {
  EmailsTemplates,
  EmailTasks,
  ScholarshipApplications,
  AwardNominations,
  AwardWinners,
  AwardTypes,
} from './modules';
import {
  OrwefManagement,
  AwardManagement,
} from './modules/dashboards';
import {
  isRegisteredModule,
  isRegisteredResource,
  isRegisteredRoute,
} from './framework/registry';

/**
 * Hand-written wiring for modules that have NOT yet moved to a
 * `ModuleManifest`. Every entry is shadowed automatically the moment the
 * registry owns the same resource / route / module key, so a module
 * migration never has to touch App.tsx or Admin.tsx. This file is deleted
 * in the last migration step.
 */

export interface LegacyResource {
  name: string;
  /** `{ list, edit, create, show, … }` or plain props (recordRepresentation …). */
  def?: Record<string, unknown>;
  /** Plain `<Resource>` props that must NOT go through guardResource. */
  props?: Record<string, unknown>;
}

const LEGACY_RESOURCES: LegacyResource[] = [
  // SHARED
  // MANAGEMENT
  // SHARED
  // EMAILS
  { name: 'email-templates', def: EmailsTemplates },
  { name: 'scheduled-email-tasks', def: EmailTasks },
  { name: 'scholarship-applications', def: ScholarshipApplications },
  { name: 'award-nominations', def: AwardNominations },
  { name: 'award-winners', def: AwardWinners },
  { name: 'award-types', def: AwardTypes },
];

export interface LegacyRoute {
  path: string;
  element: ReactElement;
  /** Owning module (documentation only — shadowing is by exact path). */
  module?: ModuleKey;
}

const LEGACY_ROUTES: LegacyRoute[] = [
  {
    path: 'orwef-scholarships/dashboard',
    element: <OrwefManagement />,
    module: 'scholarships',
  },
  { path: 'orwa-awards/dashboard', element: <AwardManagement />, module: 'awards' },
];

/** Legacy resources the registry does not own yet. */
export const legacyResources = (): LegacyResource[] =>
  LEGACY_RESOURCES.filter((r) => !isRegisteredResource(r.name));

/** Legacy routes the registry does not own yet (exact path match). */
export const legacyRoutes = (): LegacyRoute[] =>
  LEGACY_ROUTES.filter((r) => !isRegisteredRoute(r.path));

/** Menu blocks in Admin.tsx render only for modules the registry lacks. */
export const isLegacyMenuModule = (key: ModuleKey) => !isRegisteredModule(key);
