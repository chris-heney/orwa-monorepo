import React from 'react';
import { pageView } from '../../framework/registry';

/**
 * @deprecated Compatibility shim — the Memberships dashboard is the
 * framework page `memberships.dashboard` (see `./manifest.tsx`), routed by the
 * registry. Only `modules/dashboards.ts` still re-exports this name; drop
 * both once that export is removed.
 */
const MembershipsDashboard = pageView('memberships.dashboard');

export default MembershipsDashboard;
