import React, { ComponentType } from 'react';
import { RequireCan } from './RequireCan';

/**
 * react-admin resource definition (the `{ list, edit, create, ... }` objects
 * each module default-exports). Only the routed views are typed here; the rest
 * (icon, recordRepresentation, options) passes through untouched.
 */
type ResourceDefinition = Record<string, any>;

/**
 * Wrapped components are cached per (action, view): `guardResource` runs on
 * every render of `<Admin>`'s children, and a fresh component identity each
 * time would remount the page — discarding in-progress form state.
 */
const guardCache = new WeakMap<
  ComponentType<any>,
  Partial<Record<'create' | 'update', ComponentType<any>>>
>();

const guardView = (
  action: 'create' | 'update',
  View: ComponentType<any>
): ComponentType<any> => {
  const cached = guardCache.get(View) ?? {};
  const existing = cached[action];
  if (existing) {
    return existing;
  }

  const Guarded = (props: any) => (
    <RequireCan action={action}>
      <View {...props} />
    </RequireCan>
  );
  Guarded.displayName = `Guarded(${View.displayName ?? View.name ?? 'View'})`;

  guardCache.set(View, { ...cached, [action]: Guarded });
  return Guarded;
};

/**
 * Wraps a resource's `create` / `edit` pages in a capability guard so a role
 * without the matching Strapi permission is redirected instead of shown a
 * form it cannot submit. Applied centrally in `App.tsx` — see the RBAC notes
 * in `config/modules.ts`.
 */
export const guardResource = (
  resource: ResourceDefinition
): ResourceDefinition => ({
  ...resource,
  ...(resource.create ? { create: guardView('create', resource.create) } : {}),
  ...(resource.edit ? { edit: guardView('update', resource.edit) } : {}),
});
