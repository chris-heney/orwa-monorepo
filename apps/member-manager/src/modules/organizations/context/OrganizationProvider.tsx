import React, { ReactNode } from 'react';
import { FilterProvider, useFilterProvider } from '../../../_components';

interface OrganizationProviderProps {
  children: ReactNode;
}

export const OrganizationProvider: React.FC<OrganizationProviderProps> = ({ children }) => {
  return <FilterProvider resourceName="organization">{children}</FilterProvider>;
};

export const useOrganizationProvider = () => {
  return useFilterProvider();
};
