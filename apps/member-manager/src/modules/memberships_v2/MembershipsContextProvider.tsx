import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Identifier, useStore } from "react-admin";
import {
  IMembershipContextProvider,
  MembershipFilterValues,
  TabValue,
} from "./types/IMembershipContextProvider";
import ContactsCreateModal from "../grant-manager/grant-application/components/ContactsCreateModal";
import ContactsEditModal from "../grant-manager/grant-application/components/ContactsEditModal";

/** Coerce legacy array defaults (and other non-objects) to `{}` for List `filter`. */
const asFilterObject = (value: unknown): MembershipFilterValues =>
  value != null && typeof value === "object" && !Array.isArray(value)
    ? (value as MembershipFilterValues)
    : {};

export const MembershipContext = createContext<IMembershipContextProvider>({
  selectedTab: "summary",
  setSelectedTab: () => {},
  isFilterSidebarOpen: false,
  setIsFilterSidebarOpen: () => {},
  watersystemFilters: {},
  setWatersystemFilters: () => {},
  associateFilters: {},
  setAssociateFilters: () => {},
  isLoading: false,
  setIsLoading: () => {},
  isContactModalOpen: false,
  setIsContactModalOpen: () => {},
  contactCreateDefaultValues: {},
  setContactCreateDefaultValues: () => {},
  contactEditId: null,
  setContactEditId: () => {},
  linkNewContactToWatersystemId: null,
  setLinkNewContactToWatersystemId: () => {},
  invoicesFilters: {},
  setInvoicesFilters: () => {},
  hideMarkedPayments: true,
  setHideMarkedPayments: () => {},
  membershipExtraFilters: {},
  setMembershipExtraFilters: () => {},
  membershipFilters: {},
  setMembershipFilters: () => {},
  isSettingsOpen: false,
  setIsSettingsOpen: () => {},
  savingQuery: false,
  setSavingQuery: () => {},
  isGridView: false,
  setIsGridView: () => {},
});

export const useMembershipContext = () => useContext(MembershipContext);

const MembershipsContextProvider = ({ children }: PropsWithChildren) => {
  const [selectedTab, setSelectedTab] = useStore<TabValue>(
    "membership-tab-value",
    "summary"
  );
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useStore(
    "memberships-filter-sidebar-open",
    false
  );

  const [watersystemFiltersRaw, setWatersystemFilters] =
    useStore<MembershipFilterValues>("watersystems-filter", {});
  const [associateFiltersRaw, setAssociateFilters] =
    useStore<MembershipFilterValues>("associates-filter", {});
  const [invoicesFiltersRaw, setInvoicesFilters] =
    useStore<MembershipFilterValues>("invoices-filter", {});
  const [hideMarkedPayments, setHideMarkedPayments] = useStore<boolean>(
    "invoices-hide-marked-payments",
    true
  );
  // Persist the default so user-preferences sync remembers the checked state
  // even before the user toggles the checkbox.
  useEffect(() => {
    setHideMarkedPayments((prev) => (typeof prev === "boolean" ? prev : true));
  }, [setHideMarkedPayments]);
  const [membershipExtraFiltersRaw, setMembershipExtraFilters] =
    useStore<MembershipFilterValues>("membership-extra-filter", {});
  const [membershipFiltersRaw, setMembershipFilters] =
    useStore<MembershipFilterValues>("membership-filter", {});

  const watersystemFilters = asFilterObject(watersystemFiltersRaw);
  const associateFilters = asFilterObject(associateFiltersRaw);
  const invoicesFilters = asFilterObject(invoicesFiltersRaw);
  const membershipExtraFilters = asFilterObject(membershipExtraFiltersRaw);
  const membershipFilters = asFilterObject(membershipFiltersRaw);

  // One-time cleanup if RaStore still has legacy `[]` defaults from before.
  useEffect(() => {
    if (Array.isArray(watersystemFiltersRaw)) setWatersystemFilters({});
  }, [watersystemFiltersRaw, setWatersystemFilters]);
  useEffect(() => {
    if (Array.isArray(associateFiltersRaw)) setAssociateFilters({});
  }, [associateFiltersRaw, setAssociateFilters]);
  useEffect(() => {
    if (Array.isArray(invoicesFiltersRaw)) setInvoicesFilters({});
  }, [invoicesFiltersRaw, setInvoicesFilters]);
  useEffect(() => {
    if (Array.isArray(membershipExtraFiltersRaw))
      setMembershipExtraFilters({});
  }, [membershipExtraFiltersRaw, setMembershipExtraFilters]);
  useEffect(() => {
    if (Array.isArray(membershipFiltersRaw)) setMembershipFilters({});
  }, [membershipFiltersRaw, setMembershipFilters]);

  const [isLoading, setIsLoading] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactCreateDefaultValues, setContactCreateDefaultValues] =
    useState<Record<string, unknown>>({});
  const [contactEditId, setContactEditId] =
    useState<IMembershipContextProvider["contactEditId"]>(null);
  const [
    linkNewContactToWatersystemId,
    setLinkNewContactToWatersystemId,
  ] = useState<Identifier | null>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [savingQuery, setSavingQuery] = useState(false);
  
  const [isGridView, setIsGridView] = useStore<boolean>("associate-grid-view", false);

  return (
    <MembershipContext.Provider
      value={{
        selectedTab,
        setSelectedTab,
        isFilterSidebarOpen,
        setIsFilterSidebarOpen,
        watersystemFilters,
        setWatersystemFilters,
        associateFilters,
        setAssociateFilters,
        isLoading,
        setIsLoading,
        isContactModalOpen,
        setIsContactModalOpen,
        contactCreateDefaultValues,
        setContactCreateDefaultValues,
        contactEditId,
        setContactEditId,
        linkNewContactToWatersystemId,
        setLinkNewContactToWatersystemId,
        invoicesFilters,
        setInvoicesFilters,
        hideMarkedPayments,
        setHideMarkedPayments,
        membershipExtraFilters,
        setMembershipExtraFilters,
        membershipFilters,
        setMembershipFilters,
        isSettingsOpen,
        setIsSettingsOpen,
        savingQuery,
        setSavingQuery,
        isGridView,
        setIsGridView,
      }}
    >
      {children}
      <ContactsCreateModal
        createContact={isContactModalOpen}
        setCreateContact={setIsContactModalOpen}
        defaultValues={contactCreateDefaultValues}
        linkToWatersystemId={linkNewContactToWatersystemId}
        onCloseComplete={() => {
          setContactCreateDefaultValues({});
          setLinkNewContactToWatersystemId(null);
        }}
      />
      <ContactsEditModal
        contactId={contactEditId}
        onClose={() => setContactEditId(null)}
      />
    </MembershipContext.Provider>
  );
};

export default MembershipsContextProvider;
