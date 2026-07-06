import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import { Identifier, useStore } from "react-admin";
import {
  IMembershipContextProvider,
  TabValue,
} from "./types/IMembershipContextProvider";
import ContactsCreateModal from "../grant-manager/grant-application/components/ContactsCreateModal";
import ContactsEditModal from "../grant-manager/grant-application/components/ContactsEditModal";

export const MembershipContext = createContext<IMembershipContextProvider>({
  selectedTab: "summary",
  setSelectedTab: () => {},
  isFilterSidebarOpen: false,
  setIsFilterSidebarOpen: () => {},
  watersystemFilters: [],
  setWatersystemFilters: () => {},
  associateFilters: [],
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
  invoicesFilters: [],
  setInvoicesFilters: () => {},
  membershipExtraFilters: [],
  setMembershipExtraFilters: () => {},
  membershipFilters: [],
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
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(true);

  const [watersystemFilters, setWatersystemFilters] = useStore<
    React.ReactElement | React.ReactElement[]
  >("watersystems-filter", []);
  const [associateFilters, setAssociateFilters] = useStore<
    React.ReactElement | React.ReactElement[]
  >("associates-filter", []);
  const [invoicesFilters, setInvoicesFilters] = useStore<
    React.ReactElement | React.ReactElement[]
  >("invoices-filter", []);
  const [membershipExtraFilters, setMembershipExtraFilters] = useStore<
    React.ReactElement | React.ReactElement[]
  >("membership-extra-filter", []);
  const [membershipFilters, setMembershipFilters] = useStore<
    React.ReactElement | React.ReactElement[]
  >("membership-filter", []);

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
