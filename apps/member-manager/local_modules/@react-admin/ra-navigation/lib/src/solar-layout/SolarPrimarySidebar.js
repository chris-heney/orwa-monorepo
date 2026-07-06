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
exports.SolarPrimarySidebarClasses = exports.SolarPrimarySidebar = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var material_1 = require("@mui/material");
var get_1 = __importDefault(require("lodash/get"));
var clsx_1 = __importDefault(require("clsx"));
var usePrimarySidebarState_1 = require("./usePrimarySidebarState");
var useSolarSidebarActiveMenu_1 = require("./useSolarSidebarActiveMenu");
var useHasHorizontalScrollbar_1 = require("./useHasHorizontalScrollbar");
var SolarPrimarySidebar = function (_a) {
    var children = _a.children, className = _a.className, props = __rest(_a, ["children", "className"]);
    var _b = (0, usePrimarySidebarState_1.usePrimarySidebarState)(), isPrimarySidebarOpen = _b[0], setIsPrimarySidebarOpen = _b[1];
    var _c = (0, useSolarSidebarActiveMenu_1.useSolarSidebarActiveMenu)(), isSecondarySidebarOpen = _c[0], setIsSecondarySidebarOpen = _c[1];
    var isSmall = (0, material_1.useMediaQuery)(function (theme) { return theme.breakpoints.down('md'); });
    var theme = (0, material_1.useTheme)();
    var sideBarWidth = (0, get_1.default)(theme, "solarPrimarySidebar.width", theme.spacing(6.75));
    var paperRef = (0, react_1.useRef)(null);
    var hasHorizontalScrollbar = (0, useHasHorizontalScrollbar_1.useHasHorizontalScrollbar)(paperRef);
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
    return (React.createElement(Root, __assign({ className: (0, clsx_1.default)(exports.SolarPrimarySidebarClasses.root, className), open: isPrimarySidebarOpen || !isSmall, variant: isSmall && !isSecondarySidebarOpen ? 'temporary' : 'permanent', onClose: handleClose, PaperProps: {
            ref: paperRef,
        } }, drawerProps),
        React.createElement(material_1.GlobalStyles, { styles: {
                ':root': {
                    '--SolarPrimarySidebarWidth': hasHorizontalScrollbar
                        ? "calc(".concat(sideBarWidth, " + ").concat(theme.spacing(2), ")")
                        : sideBarWidth,
                },
            } }),
        children));
};
exports.SolarPrimarySidebar = SolarPrimarySidebar;
var PREFIX = 'RaSolarPrimarySidebar';
exports.SolarPrimarySidebarClasses = {
    root: "".concat(PREFIX, "-root"),
};
var Root = (0, material_1.styled)(material_1.Drawer, {
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
