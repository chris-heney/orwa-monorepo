"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolarMenuListClasses = exports.SolarMenuList = void 0;
var React = __importStar(require("react"));
var material_1 = require("@mui/material");
var clsx_1 = __importDefault(require("clsx"));
var genericForwardRef_1 = require("./genericForwardRef");
var SolarMenuListComponent = function (_a, ref) {
    var className = _a.className, _b = _a.component, component = _b === void 0 ? 'div' : _b, props = __rest(_a, ["className", "component"]);
    return (
    // FIXME: can't find a way to propagate the component prop type to a styled component
    // However it works and users that pass a custom component will have their ref correctly typed
    // @ts-ignore
    React.createElement(Root, __assign({ disablePadding: true, className: (0, clsx_1.default)(exports.SolarMenuListClasses.root, className) }, props, { component: component, ref: ref })));
};
exports.SolarMenuList = (0, genericForwardRef_1.genericForwardRef)(SolarMenuListComponent);
var PREFIX = 'RaSolarMenuList';
exports.SolarMenuListClasses = {
    root: "".concat(PREFIX, "-root"),
};
var Root = (0, material_1.styled)(material_1.List, {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var theme = _a.theme;
    return ({
        gap: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 0,
        flexShrink: 0,
    });
});
