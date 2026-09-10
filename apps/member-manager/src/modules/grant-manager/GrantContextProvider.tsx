import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IGrantContextProvider, TabValue } from "./types/IGrantContextProvider";
import { Identifier, Loading, useGetList, useStore } from "react-admin";
import { IGrant } from "./grants/components/GrantTypes";
import dayjs, { Dayjs } from "dayjs";
import {
  getRelationFilterId,
  sanitizeNumericFilterIds,
} from "./helpers/getRelationFilterId";
import {
  PayoutType,
  payoutTypeFromTab,
} from "./payouts/helpers/payoutCreateDefaults";

/* ---------- RaStore keys (preserved from the legacy dashboard) ---------- */

export const GRANT_STORE_KEYS = {
  /** Numeric PK of the selected grant (Strapi relation filter value). */
  grantFilterId: "grants-filter-id",
  fiscalYearStart: "grants-fiscal-year-start",
  fiscalYearEnd: "grants-fiscal-year-end",
  /** Payout-status filter for both payout tabs (1 = Paid). */
  payoutStatusId: "grants-payout-status-id",
  /** Application-status filter (numeric ids as strings). */
  applicationStatuses: "grants-application-status",
  /** Active dashboard tab — also the framework's `titleBar.tabStoreKey`. */
  tab: "grants-tab-value",
} as const;

export const defaultFiscalYearStart = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const isBeforeJulyFirst = currentDate.getMonth() < 6;
  return isBeforeJulyFirst
    ? `${currentYear - 1}-07-01`
    : `${currentYear}-07-01`;
};

export const defaultFiscalYearEnd = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const isBeforeJulyFirst = currentDate.getMonth() < 6;
  return isBeforeJulyFirst
    ? `${currentYear}-06-30`
    : `${currentYear + 1}-06-30`;
};

/** `grants-filter-id` may hold a number or a numeric string. */
export const toNumericGrantId = (value: unknown): number | null =>
  typeof value === "number" && value > 0
    ? value
    : typeof value === "string" && /^\d+$/.test(value)
    ? parseInt(value, 10)
    : null;

export const GrantContext = createContext<IGrantContextProvider>({
  grants: [],
  grantIndex: 0,
  grantId: 0,
  grantFilterId: 0,
  selectGrant: () => {},
  from: null,
  setFrom: () => {},
  to: null,
  setTo: () => {},
  fiscalYearStart: null,
  setFiscalYearStart: () => {},
  fiscalYearEnd: null,
  setFiscalYearEnd: () => {},
  payoutStatusId: 0,
  setPayoutStatusId: () => {},
  applicationStatuses: [],
  setApplicationStatuses: () => {},
  godMode: false,
  setGodMode: () => {},
  selectedTab: "applications",
  isCreatePayoutModalOpen: false,
  createPayoutType: "Reimbursement",
  openCreatePayoutModal: () => {},
  closeCreatePayoutModal: () => {},
});

export const useGrantContext = () => useContext(GrantContext);

/**
 * Grant selection + fiscal-year window + Filters-drawer values shared by the
 * dashboard panels. Tabs, drawers, search and heading state are owned by the
 * layout framework (`manifest.tsx`); this provider is mounted through
 * `PageManifest.provider`, so every value is derived from RaStore keys the
 * manifest's `list.filter(ctx)` reads as well.
 */
const GrantContextProvider = ({ children }: PropsWithChildren) => {
  // numeric PK — used by Strapi relation list filters (persisted)
  const [grantFilterId, setGrantFilterId] = useStore<Identifier>(
    GRANT_STORE_KEYS.grantFilterId,
    0
  );
  const [from, setFrom] = useState<Dayjs | null>(null);
  const [to, setTo] = useState<Dayjs | null>(null);

  const [fiscalYearStart, setFiscalYearStart] = useStore<string | null>(
    GRANT_STORE_KEYS.fiscalYearStart,
    defaultFiscalYearStart()
  );
  const [fiscalYearEnd, setFiscalYearEnd] = useStore<string | null>(
    GRANT_STORE_KEYS.fiscalYearEnd,
    defaultFiscalYearEnd()
  );

  // Read-only mirror of the framework's tab (PageShell writes this key).
  const [selectedTab] = useStore<TabValue>(GRANT_STORE_KEYS.tab, "applications");

  const [godMode, setGodMode] = useState(false);

  // Default 1 = Paid (matches prior mount-effect behavior on payout tabs)
  const [payoutStatusId, setPayoutStatusId] = useStore<Identifier>(
    GRANT_STORE_KEYS.payoutStatusId,
    1
  );
  const [applicationStatuses, setApplicationStatusesRaw] = useStore<string[]>(
    GRANT_STORE_KEYS.applicationStatuses,
    []
  );
  // Drop stale documentIds left in localStorage after the Strapi 5 id remap.
  const setApplicationStatuses = useCallback(
    (value: string[] | ((prev: string[]) => string[])) => {
      if (typeof value === "function") {
        setApplicationStatusesRaw((prev) =>
          sanitizeNumericFilterIds(value(prev))
        );
      } else {
        setApplicationStatusesRaw(sanitizeNumericFilterIds(value));
      }
    },
    [setApplicationStatusesRaw]
  );

  const [isCreatePayoutModalOpen, setIsCreatePayoutModalOpen] = useState(false);
  const [createPayoutType, setCreatePayoutType] =
    useState<PayoutType>("Reimbursement");

  const openCreatePayoutModal = useCallback(
    (type?: PayoutType) => {
      setCreatePayoutType(type ?? payoutTypeFromTab(selectedTab));
      setIsCreatePayoutModalOpen(true);
    },
    [selectedTab]
  );
  const closeCreatePayoutModal = useCallback(
    () => setIsCreatePayoutModalOpen(false),
    []
  );

  const { data: grants, isLoading: grantsLoading } = useGetList<IGrant>(
    "grants",
    {
      meta: {
        populate: true,
        raw: true,
      },
      sort: { field: "name", order: "ASC" },
      pagination: { page: 1, perPage: 1000 },
    }
  );

  useEffect(() => {
    setApplicationStatusesRaw((prev) => {
      const cleaned = sanitizeNumericFilterIds(prev);
      return cleaned.length === prev.length ? prev : cleaned;
    });
  }, [setApplicationStatusesRaw]);

  // Selected grant = the one matching the persisted numeric id.
  const persistedNumeric = toNumericGrantId(grantFilterId);
  const grantIndex = useMemo(
    () =>
      grants && persistedNumeric != null
        ? grants.findIndex(
            (grant) => getRelationFilterId(grant) === persistedNumeric
          )
        : -1,
    [grants, persistedNumeric]
  );

  // Fallback when nothing (valid) is persisted: first Open grant, else the first.
  const fallbackIndex = useMemo(() => {
    if (!grants?.length) return -1;
    const openIdx = grants.findIndex((grant) => grant.status === "Open");
    return openIdx !== -1 ? openIdx : 0;
  }, [grants]);

  // Hydrate `grants-filter-id` once when grants load and nothing matches.
  // Never overwrite a valid selection.
  useEffect(() => {
    if (!grants?.length || grantsLoading || grantIndex !== -1) return;
    const fallback = grants[fallbackIndex];
    const filterId = getRelationFilterId(fallback);
    if (filterId != null && filterId !== grantFilterId) setGrantFilterId(filterId);
  }, [grants, grantsLoading, grantIndex, fallbackIndex, grantFilterId, setGrantFilterId]);

  const effectiveIndex = grantIndex !== -1 ? grantIndex : fallbackIndex;
  const selectedGrant = grants?.[effectiveIndex];

  // Summary range defaults to the selected grant's open/close window (once).
  const rangeSeeded = useRef(false);
  useEffect(() => {
    if (rangeSeeded.current || !selectedGrant) return;
    rangeSeeded.current = true;
    setTo(dayjs(selectedGrant.closes));
    setFrom(dayjs(selectedGrant.opens));
  }, [selectedGrant]);

  const selectGrant = useCallback(
    (index: number) => {
      const grant = grants?.[index];
      const filterId = getRelationFilterId(grant);
      if (filterId != null) setGrantFilterId(filterId);
    },
    [grants, setGrantFilterId]
  );

  // Hold the panels back until the store carries a valid grant id: the
  // framework's ListScope reads `grants-filter-id` for its permanent filter,
  // and rendering it first would fire one wasted `grant=0` request.
  const hydrating =
    grantIndex === -1 &&
    selectedGrant != null &&
    getRelationFilterId(selectedGrant) != null;

  if (!grants || grantsLoading || grants.length === 0 || hydrating) {
    return <Loading />;
  }

  return (
    <GrantContext.Provider
      value={{
        grants,
        grantIndex: effectiveIndex,
        grantId: selectedGrant?.id ?? 0,
        grantFilterId: getRelationFilterId(selectedGrant) ?? grantFilterId,
        selectGrant,
        from,
        setFrom,
        to,
        setTo,
        fiscalYearStart,
        setFiscalYearStart,
        fiscalYearEnd,
        setFiscalYearEnd,
        payoutStatusId,
        setPayoutStatusId,
        applicationStatuses: sanitizeNumericFilterIds(applicationStatuses),
        setApplicationStatuses,
        godMode,
        setGodMode,
        selectedTab,
        isCreatePayoutModalOpen,
        createPayoutType,
        openCreatePayoutModal,
        closeCreatePayoutModal,
      }}
    >
      {children}
    </GrantContext.Provider>
  );
};

export default GrantContextProvider;
