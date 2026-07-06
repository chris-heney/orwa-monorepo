import { createContext, useContext } from 'react';
export var SolarMenuContext = createContext(null);
export var useSolarMenuContext = function () {
    return useContext(SolarMenuContext);
};
export var SolarMenuContextProvider = SolarMenuContext.Provider;
