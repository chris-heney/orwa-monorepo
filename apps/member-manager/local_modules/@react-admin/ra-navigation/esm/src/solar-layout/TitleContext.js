import { createContext, useContext } from 'react';
export var TitleContext = createContext(undefined);
export var useTitleContext = function () { return useContext(TitleContext); };
