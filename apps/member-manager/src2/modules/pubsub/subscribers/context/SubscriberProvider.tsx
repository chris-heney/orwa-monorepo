import React, { ReactNode } from 'react';
import { FilterProvider, useFilterProvider } from '../../../../_components';

interface SubscriberProviderProps {
  children: ReactNode;
}

export const SubscriberProvider: React.FC<SubscriberProviderProps> = ({ children }) => {
  return <FilterProvider resourceName="pub-sub-subscriber">{children}</FilterProvider>;
};

export const useSubscriberProvider = () => {
  return useFilterProvider();
};
