import { createContext, ReactNode, useContext } from 'react';

export type SolarMenuContextValue = {
    renderSlot: 'primary' | 'secondary';
    setSecondaryContent(content: ReactNode): void;
};

export const SolarMenuContext = createContext<SolarMenuContextValue>(null);

export const useSolarMenuContext = () =>
    useContext<SolarMenuContextValue>(SolarMenuContext);

export const SolarMenuContextProvider = SolarMenuContext.Provider;
