import React, { PropsWithChildren, createContext, useContext, useState } from 'react';
import { ISoonerwarnApplication } from './types';

/**
 * What the SoonerWARN panels still share after the framework took over tabs,
 * drawers, the heading bar and the status filters (now list filter values):
 * the inline "Add New" form toggle and the application an expanded row
 * selected (read by the Notifications drawer's email sender).
 */
interface ISoonerwarnContextProvider {
  isCreating: boolean;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
  selectedApplication: ISoonerwarnApplication | null;
  setSelectedApplication: React.Dispatch<React.SetStateAction<ISoonerwarnApplication | null>>;
}

export const SoonerwarnContext = createContext<ISoonerwarnContextProvider>({
  isCreating: false,
  setIsCreating: () => {},
  selectedApplication: null,
  setSelectedApplication: () => {},
});

export const useSoonerwarnContext = () => useContext(SoonerwarnContext);

const SoonerwarnContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<ISoonerwarnApplication | null>(null);

  return (
    <SoonerwarnContext.Provider
      value={{
        isCreating,
        setIsCreating,
        selectedApplication,
        setSelectedApplication,
      }}
    >
      {children}
    </SoonerwarnContext.Provider>
  );
};

export default SoonerwarnContextProvider;
