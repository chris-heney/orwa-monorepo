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
import { useTheme, useThemesContext, useTranslate } from 'react-admin';
import { ListItem, ListItemButton, styled, useMediaQuery, } from '@mui/material';
import clsx from 'clsx';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { genericForwardRef } from './genericForwardRef';
/**
 * Button toggling the theme (light or dark).
 *
 * Enabled by default in the <AppBar> when the <Admin> component has a darkMode.
 *
 * @example
 * import { SolarMenu } from '@react-admin/navigation';
 *
 * const MyMenu = () => (
 *     <SolarMenu>
 *          <SolarMenu.ToggleThemeItem />
 *     </SolarMenu>
 * );
 */
var SolarMenuToggleThemeItemComponent = function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    var translate = useTranslate();
    var _b = useThemesContext(), darkTheme = _b.darkTheme, defaultTheme = _b.defaultTheme;
    var prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)', {
        noSsr: true,
    });
    var _c = useTheme(defaultTheme || (prefersDarkMode && darkTheme ? 'dark' : 'light')), theme = _c[0], setTheme = _c[1];
    var handleClick = function () {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };
    var toggleThemeTitle = translate('ra.action.toggle_theme', {
        _: 'Toggle Theme',
    });
    return (React.createElement(Root, __assign({ component: "div", disablePadding: true, className: clsx(SolarMenuToggleThemeItemClasses.root, className), secondaryAction: React.createElement("div", { className: SolarMenuToggleThemeItemClasses.iconContainer }, theme === 'dark' ? (React.createElement(Brightness7Icon, { className: SolarMenuToggleThemeItemClasses.icon, sx: { ml: 'auto' } })) : (React.createElement(Brightness4Icon, { className: SolarMenuToggleThemeItemClasses.icon, sx: { ml: 'auto' } }))), 
        // @ts-ignore
        ref: ref }, props),
        React.createElement(ListItemButton, { className: SolarMenuToggleThemeItemClasses.button, onClick: handleClick }, toggleThemeTitle)));
};
export var SolarMenuToggleThemeItem = genericForwardRef(SolarMenuToggleThemeItemComponent);
var PREFIX = 'RaSolarMenuToggleThemeItem';
export var SolarMenuToggleThemeItemClasses = {
    root: "".concat(PREFIX, "-root"),
    icon: "".concat(PREFIX, "-icon"),
    iconContainer: "".concat(PREFIX, "-iconContainer"),
    button: "".concat(PREFIX, "-button"),
};
var Root = styled(ListItem)(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["& .".concat(SolarMenuToggleThemeItemClasses.iconContainer)] = {
            padding: theme.spacing(1),
            marginRight: "-12px",
        },
        _b["& .".concat(SolarMenuToggleThemeItemClasses.icon)] = {
            color: theme.palette.text.secondary,
        },
        _b["& .".concat(SolarMenuToggleThemeItemClasses.button)] = {},
        _b);
});
