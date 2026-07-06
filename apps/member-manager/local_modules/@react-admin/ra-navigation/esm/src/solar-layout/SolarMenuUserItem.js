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
import { useAuthProvider, useGetIdentity, useLocales, useThemesContext, } from 'react-admin';
import { Avatar, styled } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import clsx from 'clsx';
import { SolarMenuItem } from './SolarMenuItem';
import { SolarMenuList } from './SolarMenuList';
import { SolarMenuUserProfileItem } from './SolarMenuUserProfileItem';
import { SolarMenuToggleThemeItem } from './SolarMenuToggleThemeItem';
import { SolarMenuLocalesItem } from './SolarMenuLocalesItem';
import { genericForwardRef } from './genericForwardRef';
/**
 * A <SolarMenu> item that displays a user menu item when an authProvider is
 * available or a settings menu item when no authProvider is available but the
 * <Admin> has a darkTheme set or the i18nProvider supports multiple locales.
 *
 * It accepts the same props as the <SolarMenuItem> component.
 */
var SolarMenuUserItemComponent = function (_a, ref) {
    var subMenu = _a.subMenu, className = _a.className, props = __rest(_a, ["subMenu", "className"]);
    var _b = useGetIdentity(), isLoading = _b.isLoading, identity = _b.identity;
    var authProvider = useAuthProvider();
    var darkTheme = useThemesContext().darkTheme;
    var locales = useLocales();
    var hasManyLocales = locales && locales.length > 1;
    if (isLoading)
        return null;
    return (React.createElement(Root, __assign({ name: "user_menu", className: clsx(SolarMenuUserItemClasses.root, className), label: authProvider != null
            ? 'ra.auth.user_menu'
            : 'ra.configurable.customize', icon: authProvider ? ((identity === null || identity === void 0 ? void 0 : identity.avatar) ? (React.createElement(Avatar, { src: identity.avatar, className: SolarMenuUserItemClasses.avatar, alt: identity.fullName })) : (React.createElement(Avatar, { className: SolarMenuUserItemClasses.avatar }))) : (React.createElement(SettingsIcon, null)), ref: ref, subMenu: subMenu || (React.createElement(SolarMenuList
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
            hasManyLocales ? React.createElement(SolarMenuLocalesItem, null) : null,
            darkTheme ? React.createElement(SolarMenuToggleThemeItem, null) : null,
            authProvider != null ? (React.createElement(SolarMenuUserProfileItem, null)) : null)) }, props)));
};
export var SolarMenuUserItem = genericForwardRef(SolarMenuUserItemComponent);
var PREFIX = 'RaSolarMenuUserItem';
export var SolarMenuUserItemClasses = {
    root: "".concat(PREFIX, "-root"),
    avatar: "".concat(PREFIX, "-avatar"),
};
// FIXME: can't find a way to propagate the component type
// @ts-ignore
var Root = styled(SolarMenuItem)(function () {
    var _a;
    return (_a = {
            paddingLeft: 6,
            paddingRight: 6
        },
        _a["& .".concat(SolarMenuUserItemClasses.avatar)] = {
            maxWidth: '1.4em',
            maxHeight: '1.4em',
        },
        _a);
});
