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
import * as React from 'react';
import { useCallback } from 'react';
import { useGetIdentity, useLogout, useTranslate } from 'react-admin';
import { IconButton, ListItem, ListItemButton, ListItemText, Tooltip, styled, } from '@mui/material';
import clsx from 'clsx';
import ExitIcon from '@mui/icons-material/PowerSettingsNew';
import { genericForwardRef } from './genericForwardRef';
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
    var _c = useGetIdentity(), isLoading = _c.isLoading, identity = _c.identity;
    var translate = useTranslate();
    var logout = useLogout();
    var handleClick = useCallback(function () { return logout(null, redirectTo, false); }, [redirectTo, logout]);
    if (isLoading)
        return null;
    return (React.createElement(Root, __assign({ component: "div", className: clsx(SolarMenuUserProfileItemClasses.root, className), 
        // @ts-ignore
        ref: ref, secondaryAction: (identity === null || identity === void 0 ? void 0 : identity.fullName) ? (React.createElement(Tooltip, { title: translate('ra.auth.logout') },
            React.createElement(IconButton, { edge: "end", "aria-label": translate('ra.auth.logout'), onClick: handleClick, className: SolarMenuUserProfileItemClasses.logoutIconButton },
                React.createElement(ExitIcon, null)))) : null, disablePadding: (identity === null || identity === void 0 ? void 0 : identity.fullName) == null }, props), (identity === null || identity === void 0 ? void 0 : identity.fullName) != null ? (React.createElement(ListItemText, { className: SolarMenuUserProfileItemClasses.userFullName, primary: (_b = identity === null || identity === void 0 ? void 0 : identity.fullName) !== null && _b !== void 0 ? _b : null })) : (React.createElement(ListItemButton, { onClick: handleClick },
        React.createElement(ListItemText, null, translate('ra.auth.logout')),
        React.createElement(ExitIcon, null)))));
};
export var SolarMenuUserProfileItem = genericForwardRef(SolarMenuUserProfileItemComponent);
var PREFIX = 'RaSolarMenuUserItem';
export var SolarMenuUserProfileItemClasses = {
    root: "".concat(PREFIX, "-root"),
    logoutIconButton: "".concat(PREFIX, "-logoutIconButton"),
    userFullName: "".concat(PREFIX, "-userFullName"),
};
// FIXME: can't find a way to propagate the component type
var Root = styled(ListItem)(function () {
    var _a;
    return (_a = {},
        _a["& .".concat(SolarMenuUserProfileItemClasses.logoutIconButton)] = {
            marginRight: function (theme) { return "-".concat(theme.spacing(1)); },
        },
        _a["& .".concat(SolarMenuUserProfileItemClasses.userFullName)] = {
            margin: 0,
        },
        _a);
});
