import React, {
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Loading, useGetList, useStore, useStoreContext } from "react-admin";
import { IConferenceContextProvider } from "./types/IConferenceContextProvider";
import { IConference } from "./types";
import IConferenceTicket from "./types/IConferenceTicket";
import {
  DEFAULT_CONFERENCE_ID,
  ensureConferenceInFilters,
} from "./helpers/mergeConferenceAcrossTabFilters";
import {
  CONFERENCE_SELECTION_STORE_KEY,
  ConferenceSelection,
  YEARLESS_TABS,
  coerceSelection,
  readConferenceSelection,
} from "./helpers/conferenceSelection";
import { usePageManifestOptional } from "../../framework/PageContext";

/** Re-export for existing imports. */
export { DEFAULT_CONFERENCE_ID };

/** Tab key used when the provider is mounted outside the dashboard (forms). */
const STANDALONE_TAB = "summary";

interface ConferenceBaseContext {
  conferences: IConference[];
  tickets: IConferenceTicket[];
  /** Tab whose inline "Add …" form is open, or null. */
  creatingTab: string | null;
  setCreatingTab: React.Dispatch<SetStateAction<string | null>>;
}

const ConferenceBaseContextValue = createContext<ConferenceBaseContext>({
  conferences: [],
  tickets: [],
  creatingTab: null,
  setCreatingTab: () => {},
});

/**
 * The selected conference / year (RaStore `conference.selection`, falling back
 * to the legacy per-tab bag). Written only by `ConferenceListSync`.
 */
export const useConferenceSelection = (): ConferenceSelection => {
  const store = useStoreContext();
  const [stored] = useStore<unknown>(CONFERENCE_SELECTION_STORE_KEY, undefined);
  return useMemo(
    () =>
      stored
        ? coerceSelection(stored)
        : readConferenceSelection((key, fallback) =>
            store.getItem(key, fallback)
          ),
    [stored, store]
  );
};

/**
 * Module context for panels, forms and the Schedule module. `selectedTab` /
 * `resource` are derived from the framework's active tab (proposal §6 #6);
 * `isCreating` is scoped to that tab so switching tabs always lands on the
 * list, as the old provider's reset-on-tab-change did.
 */
export const useConferenceContext = (): IConferenceContextProvider => {
  const base = useContext(ConferenceBaseContextValue);
  const manifest = usePageManifestOptional();
  const selection = useConferenceSelection();

  const selectedTab = manifest?.tab?.key ?? STANDALONE_TAB;
  const resource = manifest?.tab?.list?.resource ?? "";
  const { creatingTab, setCreatingTab } = base;

  const setIsCreating = useCallback<
    React.Dispatch<SetStateAction<boolean>>
  >(
    (value) =>
      setCreatingTab((prev) => {
        const current = prev === selectedTab;
        const next = typeof value === "function" ? value(current) : value;
        return next ? selectedTab : prev === selectedTab ? null : prev;
      }),
    [setCreatingTab, selectedTab]
  );

  return useMemo<IConferenceContextProvider>(() => {
    const shaped = ensureConferenceInFilters(
      { conference: selection.conference, year: selection.year },
      selectedTab
    );
    if (YEARLESS_TABS.has(selectedTab)) delete shaped.year;
    return {
      selectedTab,
      resource,
      year: selection.year,
      conferences: base.conferences,
      tickets: base.tickets,
      isCreating: creatingTab === selectedTab,
      setIsCreating,
      currentFilter: shaped,
    };
  }, [
    selectedTab,
    resource,
    selection,
    base.conferences,
    base.tickets,
    creatingTab,
    setIsCreating,
  ]);
};

/**
 * Loads the module's reference data (conferences, ticket types) once for
 * every panel. Mounted by the dashboard page via `PageManifest.provider` and
 * standalone by the sponsor / attendee / extra edit pages.
 */
const ConferenceContextProvider = ({ children }: PropsWithChildren) => {
  const [creatingTab, setCreatingTab] = useState<string | null>(null);

  const { data: conferences, isLoading: conferencesLoading } =
    useGetList<IConference>("conferences", {
      meta: {
        populate: true,
        raw: true,
      },
      sort: { field: "name", order: "ASC" },
      pagination: { page: 1, perPage: 1000 },
    });

  // Ticket Types
  const { data: tickets, isLoading: ticketsLoading } =
    useGetList<IConferenceTicket>("conference-tickets", {
      filter: {}, // @TODO: Filter by Conference ID
      meta: {
        populate: true,
        raw: true,
      },
      pagination: { page: 1, perPage: 1000 },
    });

  const value = useMemo<ConferenceBaseContext>(
    () => ({
      conferences: conferences ?? [],
      tickets: tickets ?? [],
      creatingTab,
      setCreatingTab,
    }),
    [conferences, tickets, creatingTab]
  );

  return !tickets || !conferences || conferencesLoading || ticketsLoading ? (
    <Loading />
  ) : (
    <ConferenceBaseContextValue.Provider value={value}>
      {children}
    </ConferenceBaseContextValue.Provider>
  );
};

export default ConferenceContextProvider;
