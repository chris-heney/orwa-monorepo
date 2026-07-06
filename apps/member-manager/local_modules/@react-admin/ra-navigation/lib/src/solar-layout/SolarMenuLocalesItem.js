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
exports.SolarMenuLocalesItemClasses = exports.SolarMenuLocalesItem = void 0;
var React = __importStar(require("react"));
var material_1 = require("@mui/material");
var Check_1 = __importDefault(require("@mui/icons-material/Check"));
var react_admin_1 = require("react-admin");
var clsx_1 = __importDefault(require("clsx"));
var usePrimarySidebarState_1 = require("./usePrimarySidebarState");
var useSolarSidebarActiveMenu_1 = require("./useSolarSidebarActiveMenu");
var genericForwardRef_1 = require("./genericForwardRef");
/**
 * Language selector. Changes the locale in the app and persists it in
 * preferences so that the app opens with the right locale in the future.
 *
 * Uses i18nProvider.getLocales() to get the list of available locales.
 *
 * @example
 * import { SolarMenu } from '@react-admin/navigation';
 *
 * const MyMenu = () => (
 *     <SolarMenu>
 *          <SolarMenu.LocalesItem />
 *     </SolarMenu>
 * );
 */
var SolarMenuLocalesItemComponent = function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    var languages = (0, react_admin_1.useLocales)();
    var _b = (0, react_admin_1.useLocaleState)(), locale = _b[0], setLocale = _b[1];
    var _c = (0, usePrimarySidebarState_1.usePrimarySidebarState)(), setIsPrimarySidebarOpen = _c[1];
    var _d = (0, useSolarSidebarActiveMenu_1.useSolarSidebarActiveMenu)(), setSecondarySidebarOpener = _d[1];
    var changeLocale = function (locale) { return function () {
        setIsPrimarySidebarOpen(false);
        setSecondarySidebarOpener(null);
        setLocale(locale);
    }; };
    return (
    // FIXME: can't find a way to propagate the component prop type to a styled component
    // However it works and users that pass a custom component will have their ref correctly typed
    // @ts-ignore
    React.createElement(Root, __assign({ component: "div", disablePadding: true, 
        // @ts-ignore
        ref: ref, className: (0, clsx_1.default)(exports.SolarMenuLocalesItemClasses.root, className) }, props),
        React.createElement(material_1.List, { component: "div", disablePadding: true, className: exports.SolarMenuLocalesItemClasses.list }, languages.map(function (language) { return (React.createElement(material_1.ListItem, { disablePadding: true, key: language.locale, secondaryAction: language.locale === locale ? (React.createElement("div", { className: exports.SolarMenuLocalesItemClasses.iconContainer },
                React.createElement(Check_1.default, { className: exports.SolarMenuLocalesItemClasses.icon }))) : null },
            React.createElement(material_1.ListItemButton, { className: exports.SolarMenuLocalesItemClasses.button, onClick: changeLocale(language.locale) },
                React.createElement(material_1.ListItemText, { primary: language.name })))); }))));
};
exports.SolarMenuLocalesItem = (0, genericForwardRef_1.genericForwardRef)(SolarMenuLocalesItemComponent);
var PREFIX = 'RaSolarMenuLocalesItem';
exports.SolarMenuLocalesItemClasses = {
    root: "".concat(PREFIX, "-root"),
    list: "".concat(PREFIX, "-list"),
    button: "".concat(PREFIX, "-button"),
    iconContainer: "".concat(PREFIX, "-iconContainer"),
    icon: "".concat(PREFIX, "-icon"),
};
var Root = (0, material_1.styled)(material_1.ListItem)(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {
            paddingLeft: 0
        },
        _b["& .".concat(exports.SolarMenuLocalesItemClasses.list)] = {
            width: '100%',
        },
        _b["& .".concat(exports.SolarMenuLocalesItemClasses.button)] = {
            paddingTop: 0,
            paddingBottom: 0,
            paddingRight: theme.spacing(6),
        },
        _b["& .".concat(exports.SolarMenuLocalesItemClasses.iconContainer)] = {
            padding: theme.spacing(1),
            marginRight: "-12px",
        },
        _b["& .".concat(exports.SolarMenuLocalesItemClasses.icon)] = {
            color: theme.palette.text.secondary,
        },
        _b);
});
