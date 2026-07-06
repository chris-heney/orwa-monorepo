"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolarMenuContextProvider = exports.useSolarMenuContext = exports.SolarMenuContext = void 0;
var react_1 = require("react");
exports.SolarMenuContext = (0, react_1.createContext)(null);
var useSolarMenuContext = function () {
    return (0, react_1.useContext)(exports.SolarMenuContext);
};
exports.useSolarMenuContext = useSolarMenuContext;
exports.SolarMenuContextProvider = exports.SolarMenuContext.Provider;
