import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Resource `list` views (`/watersystems`, `/associates`, …) have no
 * standalone page any more — the tabs of the Memberships dashboard own those
 * lists — so send react-admin's default `list` redirects there instead.
 */
export const redirectToMembershipsTab = (tab: string) => {
  const RedirectToTab = () => (
    <Navigate to={`/membership-management?tab=${tab}`} replace />
  );
  RedirectToTab.displayName = `RedirectToMembershipsTab(${tab})`;
  return RedirectToTab;
};

export default redirectToMembershipsTab;
