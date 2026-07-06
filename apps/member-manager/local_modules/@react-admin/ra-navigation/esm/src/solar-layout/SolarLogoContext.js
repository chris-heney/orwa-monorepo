import { createContext, useContext } from 'react';
export var SolarLogoContext = createContext(undefined);
export var useSolarLogoContext = function (_a) {
    var logo = _a.logo;
    var logoFromContext = useContext(SolarLogoContext);
    return logo !== null && logo !== void 0 ? logo : logoFromContext;
};
