import { createContext, useContext, ReactNode } from 'react';

export const SolarLogoContext = createContext<SolarLogoContextType>(undefined);

export type SolarLogoContextType = ReactNode | null;

export const useSolarLogoContext = ({ logo }: { logo?: ReactNode }) => {
    const logoFromContext = useContext(SolarLogoContext);
    return logo ?? logoFromContext;
};
