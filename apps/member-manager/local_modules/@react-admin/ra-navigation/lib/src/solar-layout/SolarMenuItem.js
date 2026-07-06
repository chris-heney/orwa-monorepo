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
exports.SolarMenuItemClasses = exports.SolarMenuItem = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
var material_1 = require("@mui/material");
var react_admin_1 = require("react-admin");
var react_router_dom_1 = require("react-router-dom");
var clsx_1 = __importDefault(require("clsx"));
var app_location_1 = require("../app-location");
var SolarMenuContext_1 = require("./SolarMenuContext");
var useSolarSidebarActiveMenu_1 = require("./useSolarSidebarActiveMenu");
var usePrimarySidebarState_1 = require("./usePrimarySidebarState");
var genericForwardRef_1 = require("./genericForwardRef");
var SolarMenuItemComponent = function (_a, ref) {
    var _b, _c, _d, _e;
    var children = _a.children, subMenu = _a.subMenu, className = _a.className, icon = _a.icon, name = _a.name, label = _a.label, to = _a.to, tooltipProps = _a.tooltipProps, rest = __rest(_a, ["children", "subMenu", "className", "icon", "name", "label", "to", "tooltipProps"]);
    var translate = (0, react_admin_1.useTranslate)();
    var matchLocation = (0, app_location_1.useAppLocationMatcher)();
    var _f = (0, SolarMenuContext_1.useSolarMenuContext)(), setSecondaryContent = _f.setSecondaryContent, renderSlot = _f.renderSlot;
    var _g = (0, usePrimarySidebarState_1.usePrimarySidebarState)(), setIsPrimarySidebarOpen = _g[1];
    var _h = (0, useSolarSidebarActiveMenu_1.useSolarSidebarActiveMenu)(), secondarySidebarOpener = _h[0], setSecondarySidebarOpener = _h[1];
    var handleClick = (0, react_1.useCallback)(function () {
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
            : label, placement: "right" }, tooltipProps), to && !subMenu ? (React.createElement(Root, __assign({ className: (0, clsx_1.default)(exports.SolarMenuItemClasses.root, className, (_b = {},
            _b[exports.SolarMenuItemClasses.active] = secondarySidebarOpener === name,
            _b)), component: react_router_dom_1.Link, to: to, onClick: handleClick, selected: !!matchLocation(name), "aria-current": !!matchLocation(name) ? 'page' : undefined, 
        // @ts-ignore
        ref: ref }, rest),
        renderSlot === 'primary' || icon != null ? (React.createElement(material_1.ListItemIcon, { className: (0, clsx_1.default)(exports.SolarMenuItemClasses.icon, (_c = {},
                _c[exports.SolarMenuItemClasses.iconSecondary] = renderSlot === 'secondary',
                _c)) }, icon)) : null,
        renderSlot === 'secondary'
            ? label
                ? translate(label, { _: label })
                : children
            : null)) : (
    // FIXME: can't find a way to propagate the component prop type to a styled component
    // However it works and users that pass a custom component will have their ref correctly typed
    // @ts-ignore
    React.createElement(Root, __assign({ className: (0, clsx_1.default)(exports.SolarMenuItemClasses.root, className, (_d = {},
            _d[exports.SolarMenuItemClasses.active] = secondarySidebarOpener === name,
            _d)), selected: !!matchLocation(name), "aria-current": !!matchLocation(name) ? 'page' : undefined, onClick: handleClick, 
        // @ts-ignore
        ref: ref }, rest),
        renderSlot === 'primary' || icon != null ? (React.createElement(material_1.ListItemIcon, { className: (0, clsx_1.default)(exports.SolarMenuItemClasses.icon, (_e = {},
                _e[exports.SolarMenuItemClasses.iconSecondary] = renderSlot === 'secondary',
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
        return React.createElement(material_1.Tooltip, __assign({}, props), children);
    }
    return React.createElement(React.Fragment, null, children);
};
exports.SolarMenuItem = (0, genericForwardRef_1.genericForwardRef)(SolarMenuItemComponent);
var PREFIX = 'RaSolarMenuItem';
exports.SolarMenuItemClasses = {
    root: "".concat(PREFIX, "-root"),
    active: "".concat(PREFIX, "-active"),
    icon: "".concat(PREFIX, "-icon"),
    iconSecondary: "".concat(PREFIX, "-iconSecondary"),
};
var Root = (0, material_1.styled)(material_1.ListItemButton, {
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
        _b["&.".concat(exports.SolarMenuItemClasses.active)] = {
            backgroundColor: theme.palette.action.selected,
        },
        _b['&.Mui-selected'] = {
            color: theme.palette.secondary.contrastText,
            backgroundColor: theme.palette.secondary.main,
        },
        _b["& .".concat(exports.SolarMenuItemClasses.icon)] = {
            color: 'inherit',
            minWidth: 'unset',
        },
        _b["& .".concat(exports.SolarMenuItemClasses.iconSecondary)] = {
            marginRight: theme.spacing(1),
        },
        _b;
});
