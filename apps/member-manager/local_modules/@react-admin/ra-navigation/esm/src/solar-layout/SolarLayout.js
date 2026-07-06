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
import React, { useState, Suspense, } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import clsx from 'clsx';
import { styled } from '@mui/material';
import { Error, Inspector, Loading, SkipNavigationButton, } from 'react-admin';
import { AppLocationContext } from '../app-location';
import { SolarAppBar } from './SolarAppBar';
import { SolarMenu } from './SolarMenu';
import { SolarLogoContext } from './SolarLogoContext';
import { TitleContext } from './TitleContext';
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
export var SolarLayout = function (props) {
    var _a = props.appBar, AppBar = _a === void 0 ? SolarAppBar : _a, children = props.children, className = props.className, dashboard = props.dashboard, errorComponent = props.error, logo = props.logo, _b = props.menu, Menu = _b === void 0 ? SolarMenu : _b, title = props.title, rest = __rest(props, ["appBar", "children", "className", "dashboard", "error", "logo", "menu", "title"]);
    var _c = useState(null), errorInfo = _c[0], setErrorInfo = _c[1];
    var handleError = function (error, info) {
        setErrorInfo(info);
    };
    return (React.createElement(AppLocationContext, { hasDashboard: !!dashboard },
        React.createElement(SolarLogoContext.Provider, { value: logo },
            React.createElement(TitleContext.Provider, { value: title },
                React.createElement(StyledLayout, __assign({ className: clsx('layout', className) }, rest),
                    React.createElement(SkipNavigationButton, null),
                    React.createElement("div", { className: LayoutClasses.appFrame },
                        React.createElement(AppBar, null),
                        React.createElement("main", { className: LayoutClasses.contentWithSidebar },
                            React.createElement(Menu, null),
                            React.createElement("div", { id: "main-content", className: LayoutClasses.content },
                                React.createElement(ErrorBoundary
                                // @ts-ignore
                                , { 
                                    // @ts-ignore
                                    onError: handleError, fallbackRender: function (_a) {
                                        var error = _a.error, resetErrorBoundary = _a.resetErrorBoundary;
                                        return (React.createElement(Error, { error: error, errorComponent: errorComponent, errorInfo: errorInfo, resetErrorBoundary: resetErrorBoundary, title: title }));
                                    } },
                                    React.createElement(Suspense, { fallback: React.createElement(Loading, null) }, children)))),
                        React.createElement(Inspector, null)))))));
};
var PREFIX = 'RaSolarLayout';
export var LayoutClasses = {
    appFrame: "".concat(PREFIX, "-appFrame"),
    contentWithSidebar: "".concat(PREFIX, "-contentWithSidebar"),
    content: "".concat(PREFIX, "-content"),
};
var StyledLayout = styled('div', {
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
        _b["& .".concat(LayoutClasses.appFrame)] = {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            marginTop: 0,
        },
        _b["& .".concat(LayoutClasses.contentWithSidebar)] = {
            display: 'flex',
            flexGrow: 1,
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        _b["& .".concat(LayoutClasses.content)] = (_c = {
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
