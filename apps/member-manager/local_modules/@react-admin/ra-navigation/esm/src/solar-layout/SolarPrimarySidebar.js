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
import { useRef } from 'react';
import { Drawer, GlobalStyles, styled, useMediaQuery, useTheme, } from '@mui/material';
import get from 'lodash/get';
import clsx from 'clsx';
import { usePrimarySidebarState } from './usePrimarySidebarState';
import { useSolarSidebarActiveMenu } from './useSolarSidebarActiveMenu';
import { useHasHorizontalScrollbar } from './useHasHorizontalScrollbar';
export var SolarPrimarySidebar = function (_a) {
    var children = _a.children, className = _a.className, props = __rest(_a, ["children", "className"]);
    var _b = usePrimarySidebarState(), isPrimarySidebarOpen = _b[0], setIsPrimarySidebarOpen = _b[1];
    var _c = useSolarSidebarActiveMenu(), isSecondarySidebarOpen = _c[0], setIsSecondarySidebarOpen = _c[1];
    var isSmall = useMediaQuery(function (theme) { return theme.breakpoints.down('md'); });
    var theme = useTheme();
    var sideBarWidth = get(theme, "solarPrimarySidebar.width", theme.spacing(6.75));
    var paperRef = useRef(null);
    var hasHorizontalScrollbar = useHasHorizontalScrollbar(paperRef);
    var handleClose = function () {
        setIsPrimarySidebarOpen(false);
        setIsSecondarySidebarOpen(null);
    };
    // Had to do this to avoid Drawer passing the disableProp to the underlying div when
    // its variant is "permanent". Setting it to undefined wasn't enough.
    var drawerProps = props;
    if (isSmall && !isSecondarySidebarOpen) {
        drawerProps.disablePortal = true;
    }
    return (React.createElement(Root, __assign({ className: clsx(SolarPrimarySidebarClasses.root, className), open: isPrimarySidebarOpen || !isSmall, variant: isSmall && !isSecondarySidebarOpen ? 'temporary' : 'permanent', onClose: handleClose, PaperProps: {
            ref: paperRef,
        } }, drawerProps),
        React.createElement(GlobalStyles, { styles: {
                ':root': {
                    '--SolarPrimarySidebarWidth': hasHorizontalScrollbar
                        ? "calc(".concat(sideBarWidth, " + ").concat(theme.spacing(2), ")")
                        : sideBarWidth,
                },
            } }),
        children));
};
var PREFIX = 'RaSolarPrimarySidebar';
export var SolarPrimarySidebarClasses = {
    root: "".concat(PREFIX, "-root"),
};
var Root = styled(Drawer, {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return {
        '& .MuiDrawer-paper': (_b = {
                width: 'var(--SolarPrimarySidebarWidth)',
                paddingBottom: theme.spacing(1),
                paddingTop: theme.spacing(1),
                paddingLeft: 0,
                paddingRight: 0,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: theme.spacing(1),
                borderRightStyle: 'solid',
                borderRightWidth: 1,
                borderColor: theme.palette.divider
            },
            _b[theme.breakpoints.down('md')] = {
                borderColor: theme.palette.mode === 'dark'
                    ? theme.palette.grey[800]
                    : theme.palette.grey[300],
            },
            _b.overflowX = 'hidden',
            _b.zIndex = theme.zIndex.drawer + 1,
            _b),
        zIndex: theme.zIndex.drawer + 1,
    };
});
