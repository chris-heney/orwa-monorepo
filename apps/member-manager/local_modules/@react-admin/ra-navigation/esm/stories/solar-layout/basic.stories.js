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
import { Admin, Datagrid, DateField, EditGuesser, List, Resource, SimpleList, TextField, memoryStore, defaultDarkTheme, } from 'react-admin';
import { Box, useMediaQuery } from '@mui/material';
import { MusicNote, People } from '@mui/icons-material';
import { MemoryRouter } from 'react-router-dom';
import { SolarLayout, Breadcrumb, SolarAppBar, SolarMenu, } from '../../src';
import { dataProvider, slowDataProvider } from '../dataProvider';
import { Logo } from './Logo';
import { TitlePortal } from './TitlePortal';
import { i18nProvider } from './i18nProvider';
import { authProvider, authProviderNoIdentity } from './authProvider';
import { Dashboard } from './Dashboard';
export default { title: 'ra-navigation/SolarLayout/Basic' };
export var Basic = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dataProvider: dataProvider, layout: SolarLayout, store: memoryStore(), title: "Solar Admin" },
        React.createElement(Resource, { name: "songs", icon: MusicNote, list: SongList, edit: EditGuesser }),
        React.createElement(Resource, { name: "artists", icon: People, list: ArtistList, edit: EditGuesser })))); };
var SxAppBar = function (props) { return (React.createElement(SolarAppBar, __assign({}, props, { sx: { backgroundColor: '#C724B1' } }))); };
var SxMenu = function (props) { return (React.createElement(SolarMenu, __assign({ sx: {
        '& .RaSolarPrimarySidebar-root .MuiDrawer-paper': {
            backgroundColor: '#C724B1',
            '& .MuiButtonBase-root': {
                color: '#ffffff',
            },
            '& .MuiButtonBase-root.Mui-selected': {
                backgroundColor: '#3A3A59',
                color: '#ffffff',
            },
        },
    } }, props))); };
var SxLayout = function (props) { return (React.createElement(SolarLayout, __assign({}, props, { menu: SxMenu, appBar: SxAppBar }))); };
export var Sx = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dataProvider: dataProvider, layout: SxLayout, store: memoryStore(), title: "Solar Admin" },
        React.createElement(Resource, { name: "songs", icon: MusicNote, list: SongList, edit: EditGuesser }),
        React.createElement(Resource, { name: "artists", icon: People, list: ArtistList, edit: EditGuesser })))); };
export var SlowDataProvider = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dataProvider: slowDataProvider, layout: SolarLayout, store: memoryStore(), title: "Solar Admin" },
        React.createElement(Resource, { name: "songs", icon: MusicNote, list: SongList, edit: EditGuesser }),
        React.createElement(Resource, { name: "artists", icon: People, list: ArtistList, edit: EditGuesser })))); };
export var DarkMode = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dataProvider: dataProvider, layout: SolarLayout, theme: defaultDarkTheme, store: memoryStore(), title: "Solar Admin" },
        React.createElement(Resource, { name: "songs", icon: MusicNote, list: SongList, edit: EditGuesser }),
        React.createElement(Resource, { name: "artists", icon: People, list: ArtistList, edit: EditGuesser })))); };
export var WithDashboard = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dashboard: Dashboard, dataProvider: dataProvider, layout: SolarLayout, store: memoryStore(), title: "Solar Admin" },
        React.createElement(Resource, { name: "songs", icon: MusicNote, list: SongList, edit: EditGuesser }),
        React.createElement(Resource, { name: "artists", icon: People, list: ArtistList, edit: EditGuesser })))); };
export var WithDashboardDarkMode = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dashboard: Dashboard, dataProvider: dataProvider, layout: SolarLayout, theme: defaultDarkTheme, store: memoryStore(), title: "Solar Admin" },
        React.createElement(Resource, { name: "songs", icon: MusicNote, list: SongList, edit: EditGuesser }),
        React.createElement(Resource, { name: "artists", icon: People, list: ArtistList, edit: EditGuesser })))); };
var LayoutWithDashboardAndCustomLogo = function (props) { return (React.createElement(SolarLayout, __assign({}, props, { logo: React.createElement(Logo, null) }))); };
export var WithDashboardAndCustomLogo = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dashboard: Dashboard, dataProvider: dataProvider, layout: LayoutWithDashboardAndCustomLogo, store: memoryStore(), title: "Solar Admin" },
        React.createElement(Resource, { name: "songs", icon: MusicNote, list: SongList, edit: EditGuesser }),
        React.createElement(Resource, { name: "artists", icon: People, list: ArtistList, edit: EditGuesser })))); };
var AlwaysOnAppBar = function () { return React.createElement(SolarAppBar, { alwaysOn: true }); };
var LayoutWithAlwaysOnAppbar = function (props) { return (React.createElement(SolarLayout, __assign({}, props, { appBar: AlwaysOnAppBar }))); };
export var WithAlwaysOnAppbar = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dashboard: Dashboard, dataProvider: dataProvider, layout: LayoutWithAlwaysOnAppbar, store: memoryStore(), title: "Solar Admin" },
        React.createElement(Resource, { name: "songs", icon: MusicNote, list: SongList, edit: EditGuesser }),
        React.createElement(Resource, { name: "artists", icon: People, list: ArtistList, edit: EditGuesser })))); };
var CustomAppBar = function () { return (React.createElement(SolarAppBar, { sx: { color: 'text.secondary', bgcolor: 'background.default' } },
    React.createElement(Box, { display: "flex", justifyContent: "space-between", alignItems: "center" },
        React.createElement(Box, { mr: 1 }, "Custom toolbar"),
        React.createElement(Box, { mr: 1 }, "with"),
        React.createElement(Box, { mr: 1 }, "multiple"),
        React.createElement(Box, { mr: 1 }, "elements")))); };
var LayoutWithCustomAppbar = function (props) { return (React.createElement(SolarLayout, __assign({}, props, { appBar: CustomAppBar }))); };
export var WithCustomAppbar = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dashboard: Dashboard, dataProvider: dataProvider, layout: LayoutWithCustomAppbar, store: memoryStore(), title: "Solar Admin" },
        React.createElement(Resource, { name: "songs", icon: MusicNote, list: SongList, edit: EditGuesser }),
        React.createElement(Resource, { name: "artists", icon: People, list: ArtistList, edit: EditGuesser })))); };
var LayoutWithPageTitle = function (_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    return (React.createElement(SolarLayout, __assign({}, props),
        React.createElement(TitlePortal, null),
        children));
};
export var WithPageTitle = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dashboard: Dashboard, dataProvider: dataProvider, layout: LayoutWithPageTitle, store: memoryStore(), title: "Solar Admin" },
        React.createElement(Resource, { name: "songs", icon: MusicNote, list: SongList, edit: EditGuesser }),
        React.createElement(Resource, { name: "artists", icon: People, list: ArtistList, edit: EditGuesser })))); };
export var WithPageTitleDarkMode = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dashboard: Dashboard, dataProvider: dataProvider, layout: LayoutWithPageTitle, theme: defaultDarkTheme, store: memoryStore(), title: "Solar Admin" },
        React.createElement(Resource, { name: "songs", icon: MusicNote, list: SongList, edit: EditGuesser }),
        React.createElement(Resource, { name: "artists", icon: People, list: ArtistList, edit: EditGuesser })))); };
var LayoutWithBreadcrumb = function (_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    return (React.createElement(SolarLayout, __assign({}, props),
        React.createElement(Breadcrumb, { hasDashboard: true },
            React.createElement(Breadcrumb.ResourceItems, { resources: ['songs', 'artists'] })),
        children));
};
export var WithBreadcrumb = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dashboard: Dashboard, dataProvider: dataProvider, layout: LayoutWithBreadcrumb, store: memoryStore(), title: "Solar Admin" },
        React.createElement(Resource, { name: "songs", icon: MusicNote, list: SongList, edit: EditGuesser }),
        React.createElement(Resource, { name: "artists", icon: People, list: ArtistList, edit: EditGuesser })))); };
export var WithBreadcrumbDarkMode = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dashboard: Dashboard, dataProvider: dataProvider, layout: LayoutWithBreadcrumb, theme: defaultDarkTheme, store: memoryStore(), title: "Solar Admin" },
        React.createElement(Resource, { name: "songs", icon: MusicNote, list: SongList, edit: EditGuesser }),
        React.createElement(Resource, { name: "artists", icon: People, list: ArtistList, edit: EditGuesser })))); };
var LayoutWithPageTitleAndBreadcrumb = function (_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    return (React.createElement(SolarLayout, __assign({}, props),
        React.createElement(Breadcrumb, { hasDashboard: true },
            React.createElement(Breadcrumb.ResourceItems, { resources: ['songs', 'artists'] })),
        React.createElement(TitlePortal, null),
        children));
};
export var WithPageTitleAndBreadcrumb = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dashboard: Dashboard, dataProvider: dataProvider, layout: LayoutWithPageTitleAndBreadcrumb, store: memoryStore(), title: "Solar Admin" },
        React.createElement(Resource, { name: "songs", icon: MusicNote, list: SongList, edit: EditGuesser }),
        React.createElement(Resource, { name: "artists", icon: People, list: ArtistList, edit: EditGuesser })))); };
export var WithPageTitleAndBreadcrumbDarkMode = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dashboard: Dashboard, dataProvider: dataProvider, layout: LayoutWithPageTitleAndBreadcrumb, theme: defaultDarkTheme, store: memoryStore(), title: "Solar Admin" },
        React.createElement(Resource, { name: "songs", icon: MusicNote, list: SongList, edit: EditGuesser }),
        React.createElement(Resource, { name: "artists", icon: People, list: ArtistList, edit: EditGuesser })))); };
export var WithDefaultUserMenu = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dashboard: Dashboard, authProvider: authProvider, dataProvider: dataProvider, layout: SolarLayout, store: memoryStore(), title: "Solar Admin" },
        React.createElement(Resource, { name: "songs", icon: MusicNote, list: SongList, edit: EditGuesser }),
        React.createElement(Resource, { name: "artists", icon: People, list: ArtistList, edit: EditGuesser })))); };
export var WithDefaultUserMenuNoIdentity = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dashboard: Dashboard, authProvider: authProviderNoIdentity, dataProvider: dataProvider, layout: SolarLayout, store: memoryStore(), title: "Solar Admin" },
        React.createElement(Resource, { name: "songs", icon: MusicNote, list: SongList, edit: EditGuesser }),
        React.createElement(Resource, { name: "artists", icon: People, list: ArtistList, edit: EditGuesser })))); };
export var WithDefaultUserMenuAndDefaultDarkThemeSupport = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dashboard: Dashboard, authProvider: authProvider, dataProvider: dataProvider, layout: SolarLayout, darkTheme: defaultDarkTheme, store: memoryStore(), title: "Solar Admin" },
        React.createElement(Resource, { name: "songs", icon: MusicNote, list: SongList, edit: EditGuesser }),
        React.createElement(Resource, { name: "artists", icon: People, list: ArtistList, edit: EditGuesser })))); };
export var WithDefaultUserMenuAndLocalesSupport = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dashboard: Dashboard, authProvider: authProvider, dataProvider: dataProvider, i18nProvider: i18nProvider, layout: SolarLayout, store: memoryStore(), title: "Solar Admin" },
        React.createElement(Resource, { name: "songs", icon: MusicNote, list: SongList, edit: EditGuesser }),
        React.createElement(Resource, { name: "artists", icon: People, list: ArtistList, edit: EditGuesser })))); };
export var WithDefaultUserMenuAndThemeAndLocalesSupport = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dashboard: Dashboard, authProvider: authProvider, dataProvider: dataProvider, i18nProvider: i18nProvider, layout: SolarLayout, darkTheme: defaultDarkTheme, store: memoryStore(), title: "Solar Admin" },
        React.createElement(Resource, { name: "songs", icon: MusicNote, list: SongList, edit: EditGuesser }),
        React.createElement(Resource, { name: "artists", icon: People, list: ArtistList, edit: EditGuesser })))); };
export var WithLocalesSupport = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dashboard: Dashboard, dataProvider: dataProvider, i18nProvider: i18nProvider, layout: SolarLayout, store: memoryStore(), title: "Solar Admin" },
        React.createElement(Resource, { name: "songs", icon: MusicNote, list: SongList, edit: EditGuesser }),
        React.createElement(Resource, { name: "artists", icon: People, list: ArtistList, edit: EditGuesser })))); };
export var WithThemeSupport = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dashboard: Dashboard, dataProvider: dataProvider, layout: SolarLayout, store: memoryStore(), darkTheme: defaultDarkTheme, title: "Solar Admin" },
        React.createElement(Resource, { name: "songs", icon: MusicNote, list: SongList, edit: EditGuesser }),
        React.createElement(Resource, { name: "artists", icon: People, list: ArtistList, edit: EditGuesser })))); };
export var WithThemeAndLocalesSupport = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dashboard: Dashboard, dataProvider: dataProvider, i18nProvider: i18nProvider, layout: SolarLayout, darkTheme: defaultDarkTheme, store: memoryStore(), title: "Solar Admin" },
        React.createElement(Resource, { name: "songs", icon: MusicNote, list: SongList, edit: EditGuesser }),
        React.createElement(Resource, { name: "artists", icon: People, list: ArtistList, edit: EditGuesser })))); };
var SongList = function () {
    var isSmall = useMediaQuery(function (theme) { return theme.breakpoints.down('sm'); });
    return (React.createElement(List, null, isSmall ? (React.createElement(SimpleList, { primaryText: function (record) { return record === null || record === void 0 ? void 0 : record.title; }, secondaryText: function (record) {
            return record === null || record === void 0 ? void 0 : record.released.toLocaleDateString();
        } })) : (React.createElement(Datagrid, null,
        React.createElement(TextField, { source: "id" }),
        React.createElement(TextField, { source: "title" }),
        React.createElement(DateField, { source: "released" })))));
};
var ArtistList = function () {
    var isSmall = useMediaQuery(function (theme) { return theme.breakpoints.down('sm'); });
    return (React.createElement(List, null, isSmall ? (React.createElement(SimpleList, { primaryText: function (record) { return record === null || record === void 0 ? void 0 : record.name; } })) : (React.createElement(Datagrid, null,
        React.createElement(TextField, { source: "id" }),
        React.createElement(TextField, { source: "name" })))));
};
