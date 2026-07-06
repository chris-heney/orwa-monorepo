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
var _a;
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Toolbar, AppBar, Box, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import { UserMenu, LoadingIndicator, LocalesMenuButton, useLocales, } from 'react-admin';
import { useContainerLayout } from './ContainerLayoutContext';
import { HorizontalMenu } from './HorizontalMenu';
export var Header = function (props) {
    var _a = useContainerLayout(props), _b = _a.title, title = _b === void 0 ? 'React-admin' : _b, _c = _a.menu, menu = _c === void 0 ? defaultMenu : _c, _d = _a.toolbar, toolbar = _d === void 0 ? defaultToolbar : _d, _e = _a.userMenu, userMenu = _e === void 0 ? defaultUserMenu : _e;
    return (React.createElement(Root, __assign({ position: "static", color: "secondary", className: HeaderClasses.root }, sanitizeRestProps(props)),
        React.createElement(Toolbar, { variant: "dense", className: HeaderClasses.toolbar },
            React.createElement(Box, { display: "flex", alignItems: "center" },
                React.createElement(Link, { component: RouterLink, to: "/", variant: "h6", color: "primary.contrastText", underline: "none" }, title)),
            React.createElement(Box, null, menu),
            React.createElement(Box, { display: "flex" },
                toolbar,
                typeof userMenu === 'boolean' ? (userMenu === true ? (React.createElement(UserMenu, null)) : null) : (userMenu)))));
};
var PREFIX = 'RaHeader';
export var HeaderClasses = {
    root: "".concat(PREFIX, "-root"),
    toolbar: "".concat(PREFIX, "-toolbar"),
};
var Root = styled(AppBar, {
    name: PREFIX,
    overridesResolver: function (_props, styles) { return styles.root; },
})((_a = {},
    _a["& .".concat(HeaderClasses.toolbar)] = {
        flex: 1,
        justifyContent: 'space-between',
    },
    _a));
var defaultMenu = React.createElement(HorizontalMenu, null);
var defaultUserMenu = React.createElement(UserMenu, null);
var sanitizeRestProps = function (_a) {
    var title = _a.title, menu = _a.menu, userMenu = _a.userMenu, toolbar = _a.toolbar, props = __rest(_a, ["title", "menu", "userMenu", "toolbar"]);
    return props;
};
var DefaultToolbar = function () {
    var locales = useLocales();
    return (React.createElement(React.Fragment, null,
        locales && locales.length > 1 && React.createElement(LocalesMenuButton, null),
        React.createElement(LoadingIndicator, null)));
};
var defaultToolbar = React.createElement(DefaultToolbar, null);
