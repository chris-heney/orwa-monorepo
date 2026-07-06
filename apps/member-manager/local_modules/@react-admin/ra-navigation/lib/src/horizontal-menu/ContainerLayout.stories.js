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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMenu = exports.Sx = exports.InvalidPage = exports.AppBar = exports.Fixed = exports.MaxWidth = exports.Toolbar = exports.Menu = exports.HasDashboard = exports.Basic = void 0;
var React = __importStar(require("react"));
var react_admin_1 = require("react-admin");
var LibraryMusic_1 = __importDefault(require("@mui/icons-material/LibraryMusic"));
var Alarm_1 = __importDefault(require("@mui/icons-material/Alarm"));
var Settings_1 = __importDefault(require("@mui/icons-material/Settings"));
var material_1 = require("@mui/material");
var history_1 = require("history");
var react_router_dom_1 = require("react-router-dom");
var app_location_1 = require("../app-location");
var ContainerLayout_1 = require("./ContainerLayout");
var HorizontalMenu_1 = require("./HorizontalMenu");
var Header_1 = require("./Header");
var dataProvider_1 = require("../../stories/dataProvider");
exports.default = { title: 'ra-navigation/ContainerLayout' };
var Basic = function () { return (React.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.dataProvider, layout: ContainerLayout_1.ContainerLayout },
    React.createElement(react_admin_1.Resource, { name: "songs", list: react_admin_1.ListGuesser, edit: react_admin_1.EditGuesser }),
    React.createElement(react_admin_1.Resource, { name: "artists", list: react_admin_1.ListGuesser, edit: react_admin_1.EditGuesser, recordRepresentation: "name" }))); };
exports.Basic = Basic;
var title = (React.createElement(material_1.Box, { display: "flex", alignItems: "center", gap: 1 },
    React.createElement(LibraryMusic_1.default, null),
    "Acme records"));
var Dashboard = function () {
    return React.createElement("h1", null, "Dashboard");
};
var HasDashboard = function () { return (React.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.dataProvider, dashboard: Dashboard, layout: ContainerLayout_1.ContainerLayout, title: title },
    React.createElement(react_admin_1.Resource, { name: "songs", list: react_admin_1.ListGuesser, edit: react_admin_1.EditGuesser }),
    React.createElement(react_admin_1.Resource, { name: "artists", list: react_admin_1.ListGuesser, edit: react_admin_1.EditGuesser, recordRepresentation: "name" }))); };
exports.HasDashboard = HasDashboard;
var CustomMenu = function () { return (React.createElement(HorizontalMenu_1.HorizontalMenu, null,
    React.createElement(HorizontalMenu_1.HorizontalMenu.Item, { label: "Dashboard", to: "/", value: "" }),
    React.createElement(HorizontalMenu_1.HorizontalMenu.Item, { label: "Songs", to: "/songs", value: "songs" }),
    React.createElement(HorizontalMenu_1.HorizontalMenu.Item, { label: "Artists", to: "/artists", value: "artists" }),
    React.createElement(HorizontalMenu_1.HorizontalMenu.Item, { label: "Custom", to: "/custom", value: "custom" }))); };
var CustomPage = function () {
    (0, app_location_1.useDefineAppLocation)('custom');
    return React.createElement("h1", null, "Custom page");
};
var Menu = function () { return (React.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.dataProvider, layout: function (props) { return (React.createElement(ContainerLayout_1.ContainerLayout, __assign({}, props, { menu: React.createElement(CustomMenu, null) }))); }, dashboard: Dashboard, title: title },
    React.createElement(react_admin_1.Resource, { name: "songs", list: react_admin_1.ListGuesser, edit: react_admin_1.EditGuesser }),
    React.createElement(react_admin_1.Resource, { name: "artists", list: react_admin_1.ListGuesser, edit: react_admin_1.EditGuesser, recordRepresentation: "name" }),
    React.createElement(react_admin_1.CustomRoutes, null,
        React.createElement(react_router_dom_1.Route, { path: "custom", element: React.createElement(CustomPage, null) })))); };
exports.Menu = Menu;
var CustomToolbar = function () { return (React.createElement(material_1.IconButton, { color: "inherit", "aria-label": "add an alarm" },
    React.createElement(Alarm_1.default, null))); };
var Toolbar = function () { return (React.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.dataProvider, layout: function (props) { return (React.createElement(ContainerLayout_1.ContainerLayout, __assign({}, props, { toolbar: React.createElement(CustomToolbar, null) }))); }, dashboard: Dashboard, title: title },
    React.createElement(react_admin_1.Resource, { name: "songs", list: react_admin_1.ListGuesser, edit: react_admin_1.EditGuesser }),
    React.createElement(react_admin_1.Resource, { name: "artists", list: react_admin_1.ListGuesser, edit: react_admin_1.EditGuesser, recordRepresentation: "name" }),
    React.createElement(react_admin_1.CustomRoutes, null,
        React.createElement(react_router_dom_1.Route, { path: "custom", element: React.createElement(CustomPage, null) })))); };
exports.Toolbar = Toolbar;
var MaxWidth = function (_a) {
    var _b = _a.maxWidth, maxWidth = _b === void 0 ? 'md' : _b;
    return (React.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.dataProvider, layout: function (props) { return (React.createElement(ContainerLayout_1.ContainerLayout, __assign({}, props, { maxWidth: maxWidth }))); }, title: title },
        React.createElement(react_admin_1.Resource, { name: "songs", list: react_admin_1.ListGuesser, edit: react_admin_1.EditGuesser }),
        React.createElement(react_admin_1.Resource, { name: "artists", list: react_admin_1.ListGuesser, edit: react_admin_1.EditGuesser, recordRepresentation: "name" })));
};
exports.MaxWidth = MaxWidth;
exports.MaxWidth.args = {
    maxWidth: 'md',
};
exports.MaxWidth.argTypes = {
    maxWidth: {
        value: 'md',
        options: ['sm', 'md', 'lg', 'xl', false],
        control: { type: 'radio' },
    },
};
var Fixed = function () { return (React.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.dataProvider, layout: function (props) { return React.createElement(ContainerLayout_1.ContainerLayout, __assign({}, props, { fixed: true })); }, title: title },
    React.createElement(react_admin_1.Resource, { name: "songs", list: react_admin_1.ListGuesser, edit: react_admin_1.EditGuesser }),
    React.createElement(react_admin_1.Resource, { name: "artists", list: react_admin_1.ListGuesser, edit: react_admin_1.EditGuesser, recordRepresentation: "name" }))); };
exports.Fixed = Fixed;
var AppBar = function () { return (React.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.dataProvider, layout: function (props) { return (React.createElement(ContainerLayout_1.ContainerLayout, __assign({}, props, { appBar: React.createElement(Header_1.Header, { color: "primary", position: "sticky" }) }))); }, title: title },
    React.createElement(react_admin_1.Resource, { name: "songs", list: react_admin_1.ListGuesser, edit: react_admin_1.EditGuesser }),
    React.createElement(react_admin_1.Resource, { name: "artists", list: react_admin_1.ListGuesser, edit: react_admin_1.EditGuesser, recordRepresentation: "name" }))); };
exports.AppBar = AppBar;
var InvalidPage = function () { return (React.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)({
        initialEntries: ['/invalid'],
    }), dataProvider: dataProvider_1.dataProvider, layout: ContainerLayout_1.ContainerLayout },
    React.createElement(react_admin_1.Resource, { name: "songs", list: react_admin_1.ListGuesser, edit: react_admin_1.EditGuesser }),
    React.createElement(react_admin_1.Resource, { name: "artists", list: react_admin_1.ListGuesser, edit: react_admin_1.EditGuesser, recordRepresentation: "name" }))); };
exports.InvalidPage = InvalidPage;
var Sx = function () { return (React.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.dataProvider, layout: function (props) { return (React.createElement(ContainerLayout_1.ContainerLayout, __assign({}, props, { sx: { '& .MuiToolbar-root': { px: 10 } } }))); } },
    React.createElement(react_admin_1.Resource, { name: "songs", list: react_admin_1.ListGuesser, edit: react_admin_1.EditGuesser }),
    React.createElement(react_admin_1.Resource, { name: "artists", list: react_admin_1.ListGuesser, edit: react_admin_1.EditGuesser, recordRepresentation: "name" }))); };
exports.Sx = Sx;
var authProvider = {
    checkAuth: function () { return Promise.resolve(); },
    login: function () { return Promise.resolve(); },
    logout: function () { return Promise.resolve(); },
    checkError: function () { return Promise.resolve(); },
    getPermissions: function () { return Promise.resolve([]); },
};
var ConfigurationMenu = React.forwardRef(function (props, ref) {
    var onClose = (0, react_admin_1.useUserMenu)().onClose;
    return (React.createElement(material_1.MenuItem, __assign({ ref: ref }, props, { to: "/configuration", onClick: onClose, sx: { color: 'text.secondary' } }),
        React.createElement(material_1.ListItemIcon, null,
            React.createElement(Settings_1.default, null)),
        React.createElement(material_1.ListItemText, null, "Configuration")));
});
ConfigurationMenu.displayName = 'ConfigurationMenu';
var CustomUserMenu = function () { return (React.createElement(react_admin_1.UserMenu, null,
    React.createElement(material_1.MenuList, null,
        React.createElement(ConfigurationMenu, null),
        React.createElement(react_admin_1.Logout, null)))); };
var UserMenu = function () { return (React.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.dataProvider, authProvider: authProvider, layout: function (props) { return (React.createElement(ContainerLayout_1.ContainerLayout, __assign({}, props, { userMenu: React.createElement(CustomUserMenu, null) }))); } },
    React.createElement(react_admin_1.Resource, { name: "songs", list: react_admin_1.ListGuesser, edit: react_admin_1.EditGuesser }),
    React.createElement(react_admin_1.Resource, { name: "artists", list: react_admin_1.ListGuesser, edit: react_admin_1.EditGuesser, recordRepresentation: "name" }))); };
exports.UserMenu = UserMenu;
