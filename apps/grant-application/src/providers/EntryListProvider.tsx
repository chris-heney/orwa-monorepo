// providers/EntryListProvider.js
import React, {
    PropsWithChildren,
    createContext,
    useContext,
    useState,
  } from "react";
import { entryPayload } from "../types/types";
  
  export interface IEntryListContextProvider {
    adminOptions: {
      registrantNotification: boolean;
      adminNotification: boolean;
      customEmail: string;
      resubmit: boolean;
    };
    updateAdminOptions: (options: {
      registrantNotification?: boolean;
      adminNotification?: boolean;
      customEmail?: string;
      resubmit?: boolean;
    }) => void;
    selectedSubmission: entryPayload | null;
    setSelectedSubmission: React.Dispatch<
      React.SetStateAction<entryPayload | null>
    >;
  }
  
  export const EntryListContext = createContext<IEntryListContextProvider>({
    adminOptions: {
      registrantNotification: true,
      adminNotification: true,
      customEmail: "",
      resubmit: true,
    },
    updateAdminOptions: () => {},
    selectedSubmission: null,
    setSelectedSubmission: () => {},
  });
  
  export const useEntryList = () => useContext(EntryListContext);
  

  
  const EntryListProvider = ({ children }: PropsWithChildren) => {
    const [selectedSubmission, setSelectedSubmission] =
      useState<entryPayload | null>(null);
    const [adminOptions, setAdminOptions] = useState({
      registrantNotification: false,
      adminNotification: false,
      customEmail: "",
      resubmit: false,
    });
  
    const updateAdminOptions = (options: {
      registrantNotification?: boolean;
      adminNotification?: boolean;
      customEmail?: string;
      resubmit?: boolean;
    }) => {
      setAdminOptions({ ...adminOptions, ...options });
    };
  
    return (
      <EntryListContext.Provider
        value={{
          adminOptions,
          updateAdminOptions,
          selectedSubmission,
          setSelectedSubmission,
        }}
      >
        {children}
      </EntryListContext.Provider>
    );
  };
  
  export default EntryListProvider;