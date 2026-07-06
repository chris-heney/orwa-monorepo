import { createContext, useContext } from 'react';
import { TitleComponent } from 'react-admin';

export type TitleContextType = TitleComponent | undefined;

export const TitleContext = createContext<TitleContextType>(undefined);

export const useTitleContext = () => useContext(TitleContext);
