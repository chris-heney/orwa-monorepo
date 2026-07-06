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
exports.SolarMenuUserProfileItemClasses = exports.SolarMenuUserProfileItem = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var react_admin_1 = require("react-admin");
var material_1 = require("@mui/material");
var clsx_1 = __importDefault(require("clsx"));
var PowerSettingsNew_1 = __importDefault(require("@mui/icons-material/PowerSettingsNew"));
var genericForwardRef_1 = require("./genericForwardRef");
/**
 * This <SolarMenu> item displays the user name from the `authProvider.getIdentity` if available and a logout button.
 * Meant to be used in the secondary sidebar of the <SolarMenu> component.
 * Used by default in the <SolarMenu.UserItem> component.
 * It accepts the same props as MUI's <ListItem> component.
 * @see SolarMenu
 * @see SolarMenu.UserItem
 * @param props {SolarMenuUserProfileItemProps}
 * @param props.redirectTo {string} Optional. The location to redirect the user to when clicking on the logout button. Defaults to '/'. Set to false to disable redirection.
 */
var SolarMenuUserProfileItemComponent = function (_a, ref) {
    var _b;
    var redirectTo = _a.redirectTo, className = _a.className, props = __rest(_a, ["redirectTo", "className"]);
    var _c = (0, react_admin_1.useGetIdentity)(), isLoading = _c.isLoading, identity = _c.identity;
    var translate = (0, react_admin_1.useTranslate)();
    var logout = (0, react_admin_1.useLogout)();
    var handleClick = (0, react_1.useCallback)(function () { return logout(null, redirectTo, false); }, [redirectTo, logout]);
    if (isLoading)
        return null;
    return (React.createElement(Root, __assign({ component: "div", className: (0, clsx_1.default)(exports.SolarMenuUserProfileItemClasses.root, className), 
        // @ts-ignore
        ref: ref, secondaryAction: (identity === null || identity === void 0 ? void 0 : identity.fullName) ? (React.createElement(material_1.Tooltip, { title: translate('ra.auth.logout') },
            React.createElement(material_1.IconButton, { edge: "end", "aria-label": translate('ra.auth.logout'), onClick: handleClick, className: exports.SolarMenuUserProfileItemClasses.logoutIconButton },
                React.createElement(PowerSettingsNew_1.default, null)))) : null, disablePadding: (identity === null || identity === void 0 ? void 0 : identity.fullName) == null }, props), (identity === null || identity === void 0 ? void 0 : identity.fullName) != null ? (React.createElement(material_1.ListItemText, { className: exports.SolarMenuUserProfileItemClasses.userFullName, primary: (_b = identity === null || identity === void 0 ? void 0 : identity.fullName) !== null && _b !== void 0 ? _b : null })) : (React.createElement(material_1.ListItemButton, { onClick: handleClick },
        React.createElement(material_1.ListItemText, null, translate('ra.auth.logout')),
        React.createElement(PowerSettingsNew_1.default, null)))));
};
exports.SolarMenuUserProfileItem = (0, genericForwardRef_1.genericForwardRef)(SolarMenuUserProfileItemComponent);
var PREFIX = 'RaSolarMenuUserItem';
exports.SolarMenuUserProfileItemClasses = {
    root: "".concat(PREFIX, "-root"),
    logoutIconButton: "".concat(PREFIX, "-logoutIconButton"),
    userFullName: "".concat(PREFIX, "-userFullName"),
};
// FIXME: can't find a way to propagate the component type
var Root = (0, material_1.styled)(material_1.ListItem)(function () {
    var _a;
    return (_a = {},
        _a["& .".concat(exports.SolarMenuUserProfileItemClasses.logoutIconButton)] = {
            marginRight: function (theme) { return "-".concat(theme.spacing(1)); },
        },
        _a["& .".concat(exports.SolarMenuUserProfileItemClasses.userFullName)] = {
            margin: 0,
        },
        _a);
});
