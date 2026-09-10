import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import { Identifier } from "react-admin";
import { IMembershipContextProvider } from "./types/IMembershipContextProvider";
import ContactsCreateModal from "../grant-manager/grant-application/components/ContactsCreateModal";
import ContactsEditModal from "../grant-manager/grant-application/components/ContactsEditModal";

export const MembershipContext = createContext<IMembershipContextProvider>({
  isContactModalOpen: false,
  setIsContactModalOpen: () => {},
  contactCreateDefaultValues: {},
  setContactCreateDefaultValues: () => {},
  contactEditId: null,
  setContactEditId: () => {},
  linkNewContactToWatersystemId: null,
  setLinkNewContactToWatersystemId: () => {},
});

export const useMembershipContext = () => useContext(MembershipContext);

/**
 * Contact create / edit modals shared by the water-system and associate
 * forms and the water-system show page. Everything else the old provider
 * carried (tab, filters, sidebar, settings, saved-query flag, grid view) is
 * owned by the layout framework / react-admin list params / RaStore now.
 */
const MembershipsContextProvider = ({ children }: PropsWithChildren) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactCreateDefaultValues, setContactCreateDefaultValues] =
    useState<Record<string, unknown>>({});
  const [contactEditId, setContactEditId] =
    useState<IMembershipContextProvider["contactEditId"]>(null);
  const [
    linkNewContactToWatersystemId,
    setLinkNewContactToWatersystemId,
  ] = useState<Identifier | null>(null);

  return (
    <MembershipContext.Provider
      value={{
        isContactModalOpen,
        setIsContactModalOpen,
        contactCreateDefaultValues,
        setContactCreateDefaultValues,
        contactEditId,
        setContactEditId,
        linkNewContactToWatersystemId,
        setLinkNewContactToWatersystemId,
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
