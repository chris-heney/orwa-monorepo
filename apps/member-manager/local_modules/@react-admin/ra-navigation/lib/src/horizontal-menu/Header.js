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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderClasses = exports.Header = void 0;
var react_1 = __importDefault(require("react"));
var react_router_dom_1 = require("react-router-dom");
var material_1 = require("@mui/material");
var styles_1 = require("@mui/material/styles");
var react_admin_1 = require("react-admin");
var ContainerLayoutContext_1 = require("./ContainerLayoutContext");
var HorizontalMenu_1 = require("./HorizontalMenu");
var Header = function (props) {
    var _a = (0, ContainerLayoutContext_1.useContainerLayout)(props), _b = _a.title, title = _b === void 0 ? 'React-admin' : _b, _c = _a.menu, menu = _c === void 0 ? defaultMenu : _c, _d = _a.toolbar, toolbar = _d === void 0 ? defaultToolbar : _d, _e = _a.userMenu, userMenu = _e === void 0 ? defaultUserMenu : _e;
    return (react_1.default.createElement(Root, __assign({ position: "static", color: "secondary", className: exports.HeaderClasses.root }, sanitizeRestProps(props)),
        react_1.default.createElement(material_1.Toolbar, { variant: "dense", className: exports.HeaderClasses.toolbar },
            react_1.default.createElement(material_1.Box, { display: "flex", alignItems: "center" },
                react_1.default.createElement(material_1.Link, { component: react_router_dom_1.Link, to: "/", variant: "h6", color: "primary.contrastText", underline: "none" }, title)),
            react_1.default.createElement(material_1.Box, null, menu),
            react_1.default.createElement(material_1.Box, { display: "flex" },
                toolbar,
                typeof userMenu === 'boolean' ? (userMenu === true ? (react_1.default.createElement(react_admin_1.UserMenu, null)) : null) : (userMenu)))));
};
exports.Header = Header;
var PREFIX = 'RaHeader';
exports.HeaderClasses = {
    root: "".concat(PREFIX, "-root"),
    toolbar: "".concat(PREFIX, "-toolbar"),
};
var Root = (0, styles_1.styled)(material_1.AppBar, {
    name: PREFIX,
    overridesResolver: function (_props, styles) { return styles.root; },
})((_a = {},
    _a["& .".concat(exports.HeaderClasses.toolbar)] = {
        flex: 1,
        justifyContent: 'space-between',
    },
    _a));
var defaultMenu = react_1.default.createElement(HorizontalMenu_1.HorizontalMenu, null);
var defaultUserMenu = react_1.default.createElement(react_admin_1.UserMenu, null);
var sanitizeRestProps = function (_a) {
    var title = _a.title, menu = _a.menu, userMenu = _a.userMenu, toolbar = _a.toolbar, props = __rest(_a, ["title", "menu", "userMenu", "toolbar"]);
    return props;
};
var DefaultToolbar = function () {
    var locales = (0, react_admin_1.useLocales)();
    return (react_1.default.createElement(react_1.default.Fragment, null,
        locales && locales.length > 1 && react_1.default.createElement(react_admin_1.LocalesMenuButton, null),
        react_1.default.createElement(react_admin_1.LoadingIndicator, null)));
};
var defaultToolbar = react_1.default.createElement(DefaultToolbar, null);
