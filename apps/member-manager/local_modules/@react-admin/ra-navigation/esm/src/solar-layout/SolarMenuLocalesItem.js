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
import { List, ListItem, ListItemButton, ListItemText, styled, } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useLocaleState, useLocales } from 'react-admin';
import clsx from 'clsx';
import { usePrimarySidebarState } from './usePrimarySidebarState';
import { useSolarSidebarActiveMenu } from './useSolarSidebarActiveMenu';
import { genericForwardRef } from './genericForwardRef';
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
    var languages = useLocales();
    var _b = useLocaleState(), locale = _b[0], setLocale = _b[1];
    var _c = usePrimarySidebarState(), setIsPrimarySidebarOpen = _c[1];
    var _d = useSolarSidebarActiveMenu(), setSecondarySidebarOpener = _d[1];
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
        ref: ref, className: clsx(SolarMenuLocalesItemClasses.root, className) }, props),
        React.createElement(List, { component: "div", disablePadding: true, className: SolarMenuLocalesItemClasses.list }, languages.map(function (language) { return (React.createElement(ListItem, { disablePadding: true, key: language.locale, secondaryAction: language.locale === locale ? (React.createElement("div", { className: SolarMenuLocalesItemClasses.iconContainer },
                React.createElement(CheckIcon, { className: SolarMenuLocalesItemClasses.icon }))) : null },
            React.createElement(ListItemButton, { className: SolarMenuLocalesItemClasses.button, onClick: changeLocale(language.locale) },
                React.createElement(ListItemText, { primary: language.name })))); }))));
};
export var SolarMenuLocalesItem = genericForwardRef(SolarMenuLocalesItemComponent);
var PREFIX = 'RaSolarMenuLocalesItem';
export var SolarMenuLocalesItemClasses = {
    root: "".concat(PREFIX, "-root"),
    list: "".concat(PREFIX, "-list"),
    button: "".concat(PREFIX, "-button"),
    iconContainer: "".concat(PREFIX, "-iconContainer"),
    icon: "".concat(PREFIX, "-icon"),
};
var Root = styled(ListItem)(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {
            paddingLeft: 0
        },
        _b["& .".concat(SolarMenuLocalesItemClasses.list)] = {
            width: '100%',
        },
        _b["& .".concat(SolarMenuLocalesItemClasses.button)] = {
            paddingTop: 0,
            paddingBottom: 0,
            paddingRight: theme.spacing(6),
        },
        _b["& .".concat(SolarMenuLocalesItemClasses.iconContainer)] = {
            padding: theme.spacing(1),
            marginRight: "-12px",
        },
        _b["& .".concat(SolarMenuLocalesItemClasses.icon)] = {
            color: theme.palette.text.secondary,
        },
        _b);
});
