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
exports.LayoutClasses = exports.SolarLayout = void 0;
var react_1 = __importStar(require("react"));
var react_error_boundary_1 = require("react-error-boundary");
var clsx_1 = __importDefault(require("clsx"));
var material_1 = require("@mui/material");
var react_admin_1 = require("react-admin");
var app_location_1 = require("../app-location");
var SolarAppBar_1 = require("./SolarAppBar");
var SolarMenu_1 = require("./SolarMenu");
var SolarLogoContext_1 = require("./SolarLogoContext");
var TitleContext_1 = require("./TitleContext");
/**
 * Layout component without AppBar, using a narrow a sidebar that can expand to show more content.
 * On mobile, it shows the AppBar to allow opening the navigation menu.
 *
 * @example <caption>Basic usage</caption>
 * import { Admin, Resource, ListGuesser } from 'react-admin';
 * import { SolarLayout } from '@react-admin/ra-navigation';
 *
 * export const App = () => (
 *     <Admin dataProvider={dataProvider} layout={SolarLayout}>
 *         <Resource name="songs" list={ListGuesser} />
 *         <Resource name="artists" list={ListGuesser} />
 *     </Admin>
 * );
 */
var SolarLayout = function (props) {
    var _a = props.appBar, AppBar = _a === void 0 ? SolarAppBar_1.SolarAppBar : _a, children = props.children, className = props.className, dashboard = props.dashboard, errorComponent = props.error, logo = props.logo, _b = props.menu, Menu = _b === void 0 ? SolarMenu_1.SolarMenu : _b, title = props.title, rest = __rest(props, ["appBar", "children", "className", "dashboard", "error", "logo", "menu", "title"]);
    var _c = (0, react_1.useState)(null), errorInfo = _c[0], setErrorInfo = _c[1];
    var handleError = function (error, info) {
        setErrorInfo(info);
    };
    return (react_1.default.createElement(app_location_1.AppLocationContext, { hasDashboard: !!dashboard },
        react_1.default.createElement(SolarLogoContext_1.SolarLogoContext.Provider, { value: logo },
            react_1.default.createElement(TitleContext_1.TitleContext.Provider, { value: title },
                react_1.default.createElement(StyledLayout, __assign({ className: (0, clsx_1.default)('layout', className) }, rest),
                    react_1.default.createElement(react_admin_1.SkipNavigationButton, null),
                    react_1.default.createElement("div", { className: exports.LayoutClasses.appFrame },
                        react_1.default.createElement(AppBar, null),
                        react_1.default.createElement("main", { className: exports.LayoutClasses.contentWithSidebar },
                            react_1.default.createElement(Menu, null),
                            react_1.default.createElement("div", { id: "main-content", className: exports.LayoutClasses.content },
                                react_1.default.createElement(react_error_boundary_1.ErrorBoundary
                                // @ts-ignore
                                , { 
                                    // @ts-ignore
                                    onError: handleError, fallbackRender: function (_a) {
                                        var error = _a.error, resetErrorBoundary = _a.resetErrorBoundary;
                                        return (react_1.default.createElement(react_admin_1.Error, { error: error, errorComponent: errorComponent, errorInfo: errorInfo, resetErrorBoundary: resetErrorBoundary, title: title }));
                                    } },
                                    react_1.default.createElement(react_1.Suspense, { fallback: react_1.default.createElement(react_admin_1.Loading, null) }, children)))),
                        react_1.default.createElement(react_admin_1.Inspector, null)))))));
};
exports.SolarLayout = SolarLayout;
var PREFIX = 'RaSolarLayout';
exports.LayoutClasses = {
    appFrame: "".concat(PREFIX, "-appFrame"),
    contentWithSidebar: "".concat(PREFIX, "-contentWithSidebar"),
    content: "".concat(PREFIX, "-content"),
};
var StyledLayout = (0, material_1.styled)('div', {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var _b, _c;
    var theme = _a.theme;
    return (_b = {
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1,
            minHeight: '100vh',
            backgroundColor: theme.palette.background.default,
            position: 'relative',
            minWidth: 'fit-content',
            width: '100%',
            color: theme.palette.getContrastText(theme.palette.background.default)
        },
        _b["& .".concat(exports.LayoutClasses.appFrame)] = {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            marginTop: 0,
        },
        _b["& .".concat(exports.LayoutClasses.contentWithSidebar)] = {
            display: 'flex',
            flexGrow: 1,
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        _b["& .".concat(exports.LayoutClasses.content)] = (_c = {
                backgroundColor: theme.palette.background.default,
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                flexBasis: 0,
                padding: 0,
                marginTop: theme.spacing(8)
            },
            _c[theme.breakpoints.up('md')] = {
                marginTop: theme.spacing(1),
                marginLeft: 'var(--SolarPrimarySidebarWidth)',
            },
            _c[theme.breakpoints.up('xs')] = {
                paddingRight: theme.spacing(1),
                paddingLeft: theme.spacing(1),
            },
            _c),
        _b);
});
