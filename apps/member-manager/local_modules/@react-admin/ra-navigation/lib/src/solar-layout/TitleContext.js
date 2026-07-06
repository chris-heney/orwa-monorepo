"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTitleContext = exports.TitleContext = void 0;
var react_1 = require("react");
exports.TitleContext = (0, react_1.createContext)(undefined);
var useTitleContext = function () { return (0, react_1.useContext)(exports.TitleContext); };
exports.useTitleContext = useTitleContext;
