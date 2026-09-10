import { pageView } from '../../framework/registry'

/**
 * @deprecated The Grant Manager dashboard is `grants.dashboard` in
 * `./manifest.tsx` (route `grant/dashboard` comes from the registry). This
 * shim only keeps the `modules/dashboards.ts` re-export compiling until that
 * export is removed — then delete this file.
 */
const GrantManagement = pageView('grants.dashboard')

export default GrantManagement
