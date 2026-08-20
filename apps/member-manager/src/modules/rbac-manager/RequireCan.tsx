import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useResourceContext } from 'react-admin';
import { moduleForResource } from '../../config/modules';
import { CrudAction, useCan } from './useCan';

interface RequireCanProps {
  action: CrudAction;
  /** Defaults to the owning module's dashboard. */
  redirectTo?: string;
  children: ReactNode;
}

/**
 * Route-level capability guard for full-page views (a resource's create/edit
 * page). Renders nothing while the role is loading, redirects when the
 * capability is missing. Cosmetic UX gating only — `up_permissions` on the
 * server is the real enforcement layer.
 */
export const RequireCan = ({
  action,
  redirectTo,
  children,
}: RequireCanProps) => {
  const resource = useResourceContext();
  const { canOnResource, isLoading } = useCan();

  if (isLoading) {
    return null;
  }

  if (!canOnResource(action, resource ?? '')) {
    const fallback =
      redirectTo ?? moduleForResource(resource ?? '')?.to ?? '/admin/settings';
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
};
