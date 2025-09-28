import React, { ReactNode } from 'react';
import { FilterProvider, useFilterProvider } from '../../../_components';

interface DomainProviderProps {
  children: ReactNode;
}

export const DomainProvider: React.FC<DomainProviderProps> = ({ children }) => {
  return <FilterProvider resourceName="domain">{children}</FilterProvider>;
};

export const useDomainProvider = () => {
  return useFilterProvider();
};