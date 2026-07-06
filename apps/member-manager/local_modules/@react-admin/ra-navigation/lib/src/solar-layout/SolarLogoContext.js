"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSolarLogoContext = exports.SolarLogoContext = void 0;
var react_1 = require("react");
exports.SolarLogoContext = (0, react_1.createContext)(undefined);
var useSolarLogoContext = function (_a) {
    var logo = _a.logo;
    var logoFromContext = (0, react_1.useContext)(exports.SolarLogoContext);
    return logo !== null && logo !== void 0 ? logo : logoFromContext;
};
exports.useSolarLogoContext = useSolarLogoContext;
