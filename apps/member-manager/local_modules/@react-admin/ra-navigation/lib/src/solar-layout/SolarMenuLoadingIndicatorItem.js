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
exports.SolarMenuLoadingIndicatorItemClasses = exports.SolarMenuLoadingIndicatorItem = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var react_admin_1 = require("react-admin");
var material_1 = require("@mui/material");
var clsx_1 = __importDefault(require("clsx"));
var Refresh_1 = __importDefault(require("@mui/icons-material/Refresh"));
var genericForwardRef_1 = require("./genericForwardRef");
var SolarMenuItem_1 = require("./SolarMenuItem");
var SolarMenuLoadingIndicatorItemComponent = function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    var loading = (0, react_admin_1.useLoading)();
    var refresh = (0, react_admin_1.useRefresh)();
    var handleClick = (0, react_1.useCallback)(function (event) {
        event.preventDefault();
        refresh();
    }, [refresh]);
    return (
    // FIXME: can't find a way to propagate the component prop type
    // However it works and users that pass a custom component will have their ref correctly typed
    // @ts-ignore
    React.createElement(Root, __assign({ name: "loading", className: (0, clsx_1.default)(exports.SolarMenuLoadingIndicatorItemClasses.root, className), icon: loading ? (React.createElement(material_1.CircularProgress, { className: exports.SolarMenuLoadingIndicatorItemClasses.progress, size: 16, thickness: 6 })) : (React.createElement(Refresh_1.default, { className: exports.SolarMenuLoadingIndicatorItemClasses.icon })), label: loading ? 'ra.page.loading' : 'ra.action.refresh', onClick: handleClick, 
        // @ts-ignore
        ref: ref }, props)));
};
exports.SolarMenuLoadingIndicatorItem = (0, genericForwardRef_1.genericForwardRef)(SolarMenuLoadingIndicatorItemComponent);
var PREFIX = 'RaSolarMenuLoadingIndicatorItem';
exports.SolarMenuLoadingIndicatorItemClasses = {
    root: "".concat(PREFIX, "-root"),
    icon: "".concat(PREFIX, "-icon"),
    progress: "".concat(PREFIX, "-progress"),
};
// @ts-ignore
var Root = (0, material_1.styled)(SolarMenuItem_1.SolarMenuItem)(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["& .".concat(exports.SolarMenuLoadingIndicatorItemClasses.progress)] = {
            margin: theme.spacing(0.5),
        },
        _b);
});
