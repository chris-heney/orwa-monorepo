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
import * as React from 'react';
import { Admin, CustomRoutes, Resource, ListGuesser, EditGuesser, UserMenu as RaUserMenu, Logout, useUserMenu, } from 'react-admin';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import AlarmIcon from '@mui/icons-material/Alarm';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, IconButton, MenuList, MenuItem, ListItemIcon, ListItemText, } from '@mui/material';
import { createMemoryHistory } from 'history';
import { Route } from 'react-router-dom';
import { useDefineAppLocation } from '../app-location';
import { ContainerLayout } from './ContainerLayout';
import { HorizontalMenu } from './HorizontalMenu';
import { Header } from './Header';
import { dataProvider } from '../../stories/dataProvider';
export default { title: 'ra-navigation/ContainerLayout' };
export var Basic = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider, layout: ContainerLayout },
    React.createElement(Resource, { name: "songs", list: ListGuesser, edit: EditGuesser }),
    React.createElement(Resource, { name: "artists", list: ListGuesser, edit: EditGuesser, recordRepresentation: "name" }))); };
var title = (React.createElement(Box, { display: "flex", alignItems: "center", gap: 1 },
    React.createElement(LibraryMusicIcon, null),
    "Acme records"));
var Dashboard = function () {
    return React.createElement("h1", null, "Dashboard");
};
export var HasDashboard = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider, dashboard: Dashboard, layout: ContainerLayout, title: title },
    React.createElement(Resource, { name: "songs", list: ListGuesser, edit: EditGuesser }),
    React.createElement(Resource, { name: "artists", list: ListGuesser, edit: EditGuesser, recordRepresentation: "name" }))); };
var CustomMenu = function () { return (React.createElement(HorizontalMenu, null,
    React.createElement(HorizontalMenu.Item, { label: "Dashboard", to: "/", value: "" }),
    React.createElement(HorizontalMenu.Item, { label: "Songs", to: "/songs", value: "songs" }),
    React.createElement(HorizontalMenu.Item, { label: "Artists", to: "/artists", value: "artists" }),
    React.createElement(HorizontalMenu.Item, { label: "Custom", to: "/custom", value: "custom" }))); };
var CustomPage = function () {
    useDefineAppLocation('custom');
    return React.createElement("h1", null, "Custom page");
};
export var Menu = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider, layout: function (props) { return (React.createElement(ContainerLayout, __assign({}, props, { menu: React.createElement(CustomMenu, null) }))); }, dashboard: Dashboard, title: title },
    React.createElement(Resource, { name: "songs", list: ListGuesser, edit: EditGuesser }),
    React.createElement(Resource, { name: "artists", list: ListGuesser, edit: EditGuesser, recordRepresentation: "name" }),
    React.createElement(CustomRoutes, null,
        React.createElement(Route, { path: "custom", element: React.createElement(CustomPage, null) })))); };
var CustomToolbar = function () { return (React.createElement(IconButton, { color: "inherit", "aria-label": "add an alarm" },
    React.createElement(AlarmIcon, null))); };
export var Toolbar = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider, layout: function (props) { return (React.createElement(ContainerLayout, __assign({}, props, { toolbar: React.createElement(CustomToolbar, null) }))); }, dashboard: Dashboard, title: title },
    React.createElement(Resource, { name: "songs", list: ListGuesser, edit: EditGuesser }),
    React.createElement(Resource, { name: "artists", list: ListGuesser, edit: EditGuesser, recordRepresentation: "name" }),
    React.createElement(CustomRoutes, null,
        React.createElement(Route, { path: "custom", element: React.createElement(CustomPage, null) })))); };
export var MaxWidth = function (_a) {
    var _b = _a.maxWidth, maxWidth = _b === void 0 ? 'md' : _b;
    return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider, layout: function (props) { return (React.createElement(ContainerLayout, __assign({}, props, { maxWidth: maxWidth }))); }, title: title },
        React.createElement(Resource, { name: "songs", list: ListGuesser, edit: EditGuesser }),
        React.createElement(Resource, { name: "artists", list: ListGuesser, edit: EditGuesser, recordRepresentation: "name" })));
};
MaxWidth.args = {
    maxWidth: 'md',
};
MaxWidth.argTypes = {
    maxWidth: {
        value: 'md',
        options: ['sm', 'md', 'lg', 'xl', false],
        control: { type: 'radio' },
    },
};
export var Fixed = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider, layout: function (props) { return React.createElement(ContainerLayout, __assign({}, props, { fixed: true })); }, title: title },
    React.createElement(Resource, { name: "songs", list: ListGuesser, edit: EditGuesser }),
    React.createElement(Resource, { name: "artists", list: ListGuesser, edit: EditGuesser, recordRepresentation: "name" }))); };
export var AppBar = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider, layout: function (props) { return (React.createElement(ContainerLayout, __assign({}, props, { appBar: React.createElement(Header, { color: "primary", position: "sticky" }) }))); }, title: title },
    React.createElement(Resource, { name: "songs", list: ListGuesser, edit: EditGuesser }),
    React.createElement(Resource, { name: "artists", list: ListGuesser, edit: EditGuesser, recordRepresentation: "name" }))); };
export var InvalidPage = function () { return (React.createElement(Admin, { history: createMemoryHistory({
        initialEntries: ['/invalid'],
    }), dataProvider: dataProvider, layout: ContainerLayout },
    React.createElement(Resource, { name: "songs", list: ListGuesser, edit: EditGuesser }),
    React.createElement(Resource, { name: "artists", list: ListGuesser, edit: EditGuesser, recordRepresentation: "name" }))); };
export var Sx = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider, layout: function (props) { return (React.createElement(ContainerLayout, __assign({}, props, { sx: { '& .MuiToolbar-root': { px: 10 } } }))); } },
    React.createElement(Resource, { name: "songs", list: ListGuesser, edit: EditGuesser }),
    React.createElement(Resource, { name: "artists", list: ListGuesser, edit: EditGuesser, recordRepresentation: "name" }))); };
var authProvider = {
    checkAuth: function () { return Promise.resolve(); },
    login: function () { return Promise.resolve(); },
    logout: function () { return Promise.resolve(); },
    checkError: function () { return Promise.resolve(); },
    getPermissions: function () { return Promise.resolve([]); },
};
var ConfigurationMenu = React.forwardRef(function (props, ref) {
    var onClose = useUserMenu().onClose;
    return (React.createElement(MenuItem, __assign({ ref: ref }, props, { to: "/configuration", onClick: onClose, sx: { color: 'text.secondary' } }),
        React.createElement(ListItemIcon, null,
            React.createElement(SettingsIcon, null)),
        React.createElement(ListItemText, null, "Configuration")));
});
ConfigurationMenu.displayName = 'ConfigurationMenu';
var CustomUserMenu = function () { return (React.createElement(RaUserMenu, null,
    React.createElement(MenuList, null,
        React.createElement(ConfigurationMenu, null),
        React.createElement(Logout, null)))); };
export var UserMenu = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider, authProvider: authProvider, layout: function (props) { return (React.createElement(ContainerLayout, __assign({}, props, { userMenu: React.createElement(CustomUserMenu, null) }))); } },
    React.createElement(Resource, { name: "songs", list: ListGuesser, edit: EditGuesser }),
    React.createElement(Resource, { name: "artists", list: ListGuesser, edit: EditGuesser, recordRepresentation: "name" }))); };
