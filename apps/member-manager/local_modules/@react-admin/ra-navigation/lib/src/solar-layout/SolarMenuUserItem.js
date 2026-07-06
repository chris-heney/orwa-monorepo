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
exports.SolarMenuUserItemClasses = exports.SolarMenuUserItem = void 0;
var React = __importStar(require("react"));
var react_admin_1 = require("react-admin");
var material_1 = require("@mui/material");
var Settings_1 = __importDefault(require("@mui/icons-material/Settings"));
var clsx_1 = __importDefault(require("clsx"));
var SolarMenuItem_1 = require("./SolarMenuItem");
var SolarMenuList_1 = require("./SolarMenuList");
var SolarMenuUserProfileItem_1 = require("./SolarMenuUserProfileItem");
var SolarMenuToggleThemeItem_1 = require("./SolarMenuToggleThemeItem");
var SolarMenuLocalesItem_1 = require("./SolarMenuLocalesItem");
var genericForwardRef_1 = require("./genericForwardRef");
/**
 * A <SolarMenu> item that displays a user menu item when an authProvider is
 * available or a settings menu item when no authProvider is available but the
 * <Admin> has a darkTheme set or the i18nProvider supports multiple locales.
 *
 * It accepts the same props as the <SolarMenuItem> component.
 */
var SolarMenuUserItemComponent = function (_a, ref) {
    var subMenu = _a.subMenu, className = _a.className, props = __rest(_a, ["subMenu", "className"]);
    var _b = (0, react_admin_1.useGetIdentity)(), isLoading = _b.isLoading, identity = _b.identity;
    var authProvider = (0, react_admin_1.useAuthProvider)();
    var darkTheme = (0, react_admin_1.useThemesContext)().darkTheme;
    var locales = (0, react_admin_1.useLocales)();
    var hasManyLocales = locales && locales.length > 1;
    if (isLoading)
        return null;
    return (React.createElement(Root, __assign({ name: "user_menu", className: (0, clsx_1.default)(exports.SolarMenuUserItemClasses.root, className), label: authProvider != null
            ? 'ra.auth.user_menu'
            : 'ra.configurable.customize', icon: authProvider ? ((identity === null || identity === void 0 ? void 0 : identity.avatar) ? (React.createElement(material_1.Avatar, { src: identity.avatar, className: exports.SolarMenuUserItemClasses.avatar, alt: identity.fullName })) : (React.createElement(material_1.Avatar, { className: exports.SolarMenuUserItemClasses.avatar }))) : (React.createElement(Settings_1.default, null)), ref: ref, subMenu: subMenu || (React.createElement(SolarMenuList_1.SolarMenuList
        // We can't use the classes from this component here because the
        // list is displayed in the secondary sidebar, hence it is not a
        // child of the <SolarMenuUserItem> component
        , { 
            // We can't use the classes from this component here because the
            // list is displayed in the secondary sidebar, hence it is not a
            // child of the <SolarMenuUserItem> component
            sx: {
                marginTop: 'auto',
                display: 'flex',
                flexDirection: 'column',
            } },
            hasManyLocales ? React.createElement(SolarMenuLocalesItem_1.SolarMenuLocalesItem, null) : null,
            darkTheme ? React.createElement(SolarMenuToggleThemeItem_1.SolarMenuToggleThemeItem, null) : null,
            authProvider != null ? (React.createElement(SolarMenuUserProfileItem_1.SolarMenuUserProfileItem, null)) : null)) }, props)));
};
exports.SolarMenuUserItem = (0, genericForwardRef_1.genericForwardRef)(SolarMenuUserItemComponent);
var PREFIX = 'RaSolarMenuUserItem';
exports.SolarMenuUserItemClasses = {
    root: "".concat(PREFIX, "-root"),
    avatar: "".concat(PREFIX, "-avatar"),
};
// FIXME: can't find a way to propagate the component type
// @ts-ignore
var Root = (0, material_1.styled)(SolarMenuItem_1.SolarMenuItem)(function () {
    var _a;
    return (_a = {
            paddingLeft: 6,
            paddingRight: 6
        },
        _a["& .".concat(exports.SolarMenuUserItemClasses.avatar)] = {
            maxWidth: '1.4em',
            maxHeight: '1.4em',
        },
        _a);
});
