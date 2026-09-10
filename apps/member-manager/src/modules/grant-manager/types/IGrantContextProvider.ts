import { Identifier } from 'react-admin'
import { IGrant } from '../grants/components/GrantTypes'
import { Dayjs } from 'dayjs'
import type { PayoutType } from '../payouts/helpers/payoutCreateDefaults'

/**
 * Dashboard tab keys — also the persisted `grants-tab-value` values (kept
 * verbatim from the legacy dashboard so user prefs survive the framework
 * migration). `settings` is new: Settings used to be a boolean overlay.
 */
export type TabValue =
  | 'summary'
  | 'map'
  | 'applications'
  | 'payouts'
  | 'Admin Payouts'
  | 'application scores'
  | 'edit'
  | 'tokens'
  | 'settings'

/**
 * What the grant panels still share after the layout framework took over
 * tabs / drawers / search / heading state: the selected grant, the fiscal-year
 * window, the Filters-drawer values and the New-Payout modal.
 */
export interface IGrantContextProvider {
    grants: IGrant[]
    /** Index of the selected grant in `grants` (derived from `grantFilterId`). */
    grantIndex: number
    /** documentId — used by Show/Edit getOne. */
    grantId: Identifier
    /** Numeric PK for Strapi relation filters (RaStore `grants-filter-id`). */
    grantFilterId: Identifier
    /** Select a grant by index (writes `grants-filter-id`). */
    selectGrant: (index: number) => void
    /** Summary date range (SummaryRangeSelect). */
    from: Dayjs | null
    setFrom: React.Dispatch<React.SetStateAction<Dayjs | null>>
    to: Dayjs | null
    setTo: React.Dispatch<React.SetStateAction<Dayjs | null>>
    fiscalYearStart: string | null
    setFiscalYearStart: React.Dispatch<React.SetStateAction<string | null>>
    fiscalYearEnd: string | null
    setFiscalYearEnd: React.Dispatch<React.SetStateAction<string | null>>
    payoutStatusId: Identifier
    setPayoutStatusId: React.Dispatch<React.SetStateAction<Identifier>>
    applicationStatuses: string[]
    setApplicationStatuses: React.Dispatch<React.SetStateAction<string[]>>
    godMode: boolean
    setGodMode: React.Dispatch<React.SetStateAction<boolean>>
    /** Read-only mirror of the framework's active tab (RaStore `grants-tab-value`). */
    selectedTab: TabValue
    isCreatePayoutModalOpen: boolean
    createPayoutType: PayoutType
    openCreatePayoutModal: (type?: PayoutType) => void
    closeCreatePayoutModal: () => void
}
