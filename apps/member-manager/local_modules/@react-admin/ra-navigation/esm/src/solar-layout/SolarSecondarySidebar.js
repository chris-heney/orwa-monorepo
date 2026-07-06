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
import { Drawer, styled } from '@mui/material';
import clsx from 'clsx';
import { useSolarSidebarActiveMenu } from './useSolarSidebarActiveMenu';
export var SolarSecondarySidebar = function (_a) {
    var children = _a.children, className = _a.className, props = __rest(_a, ["children", "className"]);
    var _b = useSolarSidebarActiveMenu(), activeMenu = _b[0], setActiveMenu = _b[1];
    return (React.createElement(Root, __assign({ open: !!activeMenu, className: clsx(SolarSecondarySidebarClasses.root, className), onClose: function () { return setActiveMenu(null); }, elevation: 0, disableEnforceFocus: true, disablePortal: true }, props), children));
};
var PREFIX = 'RaSolarSecondarySidebar';
export var SolarSecondarySidebarClasses = {
    root: "".concat(PREFIX, "-root"),
};
var Root = styled(Drawer, {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return {
        '& .MuiBackdrop-root': {
            left: 'var(--SolarPrimarySidebarWidth)',
        },
        '& .MuiDrawer-paper': (_b = {
                minWidth: 'calc(80% - var(--SolarPrimarySidebarWidth))'
            },
            _b[theme.breakpoints.up('md')] = {
                minWidth: "18em",
            },
            _b.left = 'var(--SolarPrimarySidebarWidth)',
            _b.borderLeftStyle = 'none',
            _b.borderColor = theme.palette.divider,
            _b.paddingBottom = theme.spacing(1),
            _b.paddingTop = theme.spacing(1),
            _b.paddingLeft = theme.spacing(1),
            _b.paddingRight = theme.spacing(1),
            _b),
    };
});
