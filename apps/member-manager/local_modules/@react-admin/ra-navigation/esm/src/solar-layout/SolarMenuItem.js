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
import { ListItemButton, ListItemIcon, styled, Tooltip, } from '@mui/material';
import { useTranslate } from 'react-admin';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { useAppLocationMatcher } from '../app-location';
import { useSolarMenuContext } from './SolarMenuContext';
import { useSolarSidebarActiveMenu } from './useSolarSidebarActiveMenu';
import { usePrimarySidebarState } from './usePrimarySidebarState';
import { genericForwardRef } from './genericForwardRef';
var SolarMenuItemComponent = function (_a, ref) {
    var _b, _c, _d, _e;
    var children = _a.children, subMenu = _a.subMenu, className = _a.className, icon = _a.icon, name = _a.name, label = _a.label, to = _a.to, tooltipProps = _a.tooltipProps, rest = __rest(_a, ["children", "subMenu", "className", "icon", "name", "label", "to", "tooltipProps"]);
    var translate = useTranslate();
    var matchLocation = useAppLocationMatcher();
    var _f = useSolarMenuContext(), setSecondaryContent = _f.setSecondaryContent, renderSlot = _f.renderSlot;
    var _g = usePrimarySidebarState(), setIsPrimarySidebarOpen = _g[1];
    var _h = useSolarSidebarActiveMenu(), secondarySidebarOpener = _h[0], setSecondarySidebarOpener = _h[1];
    var handleClick = useCallback(function () {
        if (!subMenu) {
            setSecondarySidebarOpener(null);
            setIsPrimarySidebarOpen(false);
            return;
        }
        if (secondarySidebarOpener === name) {
            setSecondarySidebarOpener(null);
            return;
        }
        setSecondarySidebarOpener(name);
        setSecondaryContent(subMenu);
    }, [
        subMenu,
        name,
        secondarySidebarOpener,
        setSecondarySidebarOpener,
        setIsPrimarySidebarOpen,
        setSecondaryContent,
    ]);
    return (React.createElement(TooltipWrapper, __assign({ enabled: renderSlot === 'primary', title: typeof label === 'string'
            ? translate(label, { _: label })
            : label, placement: "right" }, tooltipProps), to && !subMenu ? (React.createElement(Root, __assign({ className: clsx(SolarMenuItemClasses.root, className, (_b = {},
            _b[SolarMenuItemClasses.active] = secondarySidebarOpener === name,
            _b)), component: Link, to: to, onClick: handleClick, selected: !!matchLocation(name), "aria-current": !!matchLocation(name) ? 'page' : undefined, 
        // @ts-ignore
        ref: ref }, rest),
        renderSlot === 'primary' || icon != null ? (React.createElement(ListItemIcon, { className: clsx(SolarMenuItemClasses.icon, (_c = {},
                _c[SolarMenuItemClasses.iconSecondary] = renderSlot === 'secondary',
                _c)) }, icon)) : null,
        renderSlot === 'secondary'
            ? label
                ? translate(label, { _: label })
                : children
            : null)) : (
    // FIXME: can't find a way to propagate the component prop type to a styled component
    // However it works and users that pass a custom component will have their ref correctly typed
    // @ts-ignore
    React.createElement(Root, __assign({ className: clsx(SolarMenuItemClasses.root, className, (_d = {},
            _d[SolarMenuItemClasses.active] = secondarySidebarOpener === name,
            _d)), selected: !!matchLocation(name), "aria-current": !!matchLocation(name) ? 'page' : undefined, onClick: handleClick, 
        // @ts-ignore
        ref: ref }, rest),
        renderSlot === 'primary' || icon != null ? (React.createElement(ListItemIcon, { className: clsx(SolarMenuItemClasses.icon, (_e = {},
                _e[SolarMenuItemClasses.iconSecondary] = renderSlot === 'secondary',
                _e)) }, icon)) : null,
        renderSlot === 'secondary'
            ? label
                ? translate(label, { _: label })
                : children
            : null))));
};
var TooltipWrapper = function (_a) {
    var children = _a.children, enabled = _a.enabled, props = __rest(_a, ["children", "enabled"]);
    if (enabled) {
        return React.createElement(Tooltip, __assign({}, props), children);
    }
    return React.createElement(React.Fragment, null, children);
};
export var SolarMenuItem = genericForwardRef(SolarMenuItemComponent);
var PREFIX = 'RaSolarMenuItem';
export var SolarMenuItemClasses = {
    root: "".concat(PREFIX, "-root"),
    active: "".concat(PREFIX, "-active"),
    icon: "".concat(PREFIX, "-icon"),
    iconSecondary: "".concat(PREFIX, "-iconSecondary"),
};
var Root = styled(ListItemButton, {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return _b = {
            display: 'flex',
            color: theme.palette.text.secondary,
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
            borderRadius: theme.shape.borderRadius,
            minWidth: '1em'
        },
        _b["&.".concat(SolarMenuItemClasses.active)] = {
            backgroundColor: theme.palette.action.selected,
        },
        _b['&.Mui-selected'] = {
            color: theme.palette.secondary.contrastText,
            backgroundColor: theme.palette.secondary.main,
        },
        _b["& .".concat(SolarMenuItemClasses.icon)] = {
            color: 'inherit',
            minWidth: 'unset',
        },
        _b["& .".concat(SolarMenuItemClasses.iconSecondary)] = {
            marginRight: theme.spacing(1),
        },
        _b;
});
