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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithThemeAndLocalesSupport = exports.WithThemeSupport = exports.WithLocalesSupport = exports.WithDefaultUserMenuAndThemeAndLocalesSupport = exports.WithDefaultUserMenuAndLocalesSupport = exports.WithDefaultUserMenuAndDefaultDarkThemeSupport = exports.WithDefaultUserMenuNoIdentity = exports.WithDefaultUserMenu = exports.WithPageTitleAndBreadcrumbDarkMode = exports.WithPageTitleAndBreadcrumb = exports.WithBreadcrumbDarkMode = exports.WithBreadcrumb = exports.WithPageTitleDarkMode = exports.WithPageTitle = exports.WithCustomAppbar = exports.WithAlwaysOnAppbar = exports.WithDashboardAndCustomLogo = exports.WithDashboardDarkMode = exports.WithDashboard = exports.DarkMode = exports.SlowDataProvider = exports.Sx = exports.Basic = void 0;
var React = __importStar(require("react"));
var react_admin_1 = require("react-admin");
var material_1 = require("@mui/material");
var icons_material_1 = require("@mui/icons-material");
var react_router_dom_1 = require("react-router-dom");
var src_1 = require("../../src");
var dataProvider_1 = require("../dataProvider");
var Logo_1 = require("./Logo");
var TitlePortal_1 = require("./TitlePortal");
var i18nProvider_1 = require("./i18nProvider");
var authProvider_1 = require("./authProvider");
var Dashboard_1 = require("./Dashboard");
exports.default = { title: 'ra-navigation/SolarLayout/Basic' };
var Basic = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dataProvider: dataProvider_1.dataProvider, layout: src_1.SolarLayout, store: (0, react_admin_1.memoryStore)(), title: "Solar Admin" },
        React.createElement(react_admin_1.Resource, { name: "songs", icon: icons_material_1.MusicNote, list: SongList, edit: react_admin_1.EditGuesser }),
        React.createElement(react_admin_1.Resource, { name: "artists", icon: icons_material_1.People, list: ArtistList, edit: react_admin_1.EditGuesser })))); };
exports.Basic = Basic;
var SxAppBar = function (props) { return (React.createElement(src_1.SolarAppBar, __assign({}, props, { sx: { backgroundColor: '#C724B1' } }))); };
var SxMenu = function (props) { return (React.createElement(src_1.SolarMenu, __assign({ sx: {
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
var SxLayout = function (props) { return (React.createElement(src_1.SolarLayout, __assign({}, props, { menu: SxMenu, appBar: SxAppBar }))); };
var Sx = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dataProvider: dataProvider_1.dataProvider, layout: SxLayout, store: (0, react_admin_1.memoryStore)(), title: "Solar Admin" },
        React.createElement(react_admin_1.Resource, { name: "songs", icon: icons_material_1.MusicNote, list: SongList, edit: react_admin_1.EditGuesser }),
        React.createElement(react_admin_1.Resource, { name: "artists", icon: icons_material_1.People, list: ArtistList, edit: react_admin_1.EditGuesser })))); };
exports.Sx = Sx;
var SlowDataProvider = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dataProvider: dataProvider_1.slowDataProvider, layout: src_1.SolarLayout, store: (0, react_admin_1.memoryStore)(), title: "Solar Admin" },
        React.createElement(react_admin_1.Resource, { name: "songs", icon: icons_material_1.MusicNote, list: SongList, edit: react_admin_1.EditGuesser }),
        React.createElement(react_admin_1.Resource, { name: "artists", icon: icons_material_1.People, list: ArtistList, edit: react_admin_1.EditGuesser })))); };
exports.SlowDataProvider = SlowDataProvider;
var DarkMode = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dataProvider: dataProvider_1.dataProvider, layout: src_1.SolarLayout, theme: react_admin_1.defaultDarkTheme, store: (0, react_admin_1.memoryStore)(), title: "Solar Admin" },
        React.createElement(react_admin_1.Resource, { name: "songs", icon: icons_material_1.MusicNote, list: SongList, edit: react_admin_1.EditGuesser }),
        React.createElement(react_admin_1.Resource, { name: "artists", icon: icons_material_1.People, list: ArtistList, edit: react_admin_1.EditGuesser })))); };
exports.DarkMode = DarkMode;
var WithDashboard = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dashboard: Dashboard_1.Dashboard, dataProvider: dataProvider_1.dataProvider, layout: src_1.SolarLayout, store: (0, react_admin_1.memoryStore)(), title: "Solar Admin" },
        React.createElement(react_admin_1.Resource, { name: "songs", icon: icons_material_1.MusicNote, list: SongList, edit: react_admin_1.EditGuesser }),
        React.createElement(react_admin_1.Resource, { name: "artists", icon: icons_material_1.People, list: ArtistList, edit: react_admin_1.EditGuesser })))); };
exports.WithDashboard = WithDashboard;
var WithDashboardDarkMode = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dashboard: Dashboard_1.Dashboard, dataProvider: dataProvider_1.dataProvider, layout: src_1.SolarLayout, theme: react_admin_1.defaultDarkTheme, store: (0, react_admin_1.memoryStore)(), title: "Solar Admin" },
        React.createElement(react_admin_1.Resource, { name: "songs", icon: icons_material_1.MusicNote, list: SongList, edit: react_admin_1.EditGuesser }),
        React.createElement(react_admin_1.Resource, { name: "artists", icon: icons_material_1.People, list: ArtistList, edit: react_admin_1.EditGuesser })))); };
exports.WithDashboardDarkMode = WithDashboardDarkMode;
var LayoutWithDashboardAndCustomLogo = function (props) { return (React.createElement(src_1.SolarLayout, __assign({}, props, { logo: React.createElement(Logo_1.Logo, null) }))); };
var WithDashboardAndCustomLogo = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dashboard: Dashboard_1.Dashboard, dataProvider: dataProvider_1.dataProvider, layout: LayoutWithDashboardAndCustomLogo, store: (0, react_admin_1.memoryStore)(), title: "Solar Admin" },
        React.createElement(react_admin_1.Resource, { name: "songs", icon: icons_material_1.MusicNote, list: SongList, edit: react_admin_1.EditGuesser }),
        React.createElement(react_admin_1.Resource, { name: "artists", icon: icons_material_1.People, list: ArtistList, edit: react_admin_1.EditGuesser })))); };
exports.WithDashboardAndCustomLogo = WithDashboardAndCustomLogo;
var AlwaysOnAppBar = function () { return React.createElement(src_1.SolarAppBar, { alwaysOn: true }); };
var LayoutWithAlwaysOnAppbar = function (props) { return (React.createElement(src_1.SolarLayout, __assign({}, props, { appBar: AlwaysOnAppBar }))); };
var WithAlwaysOnAppbar = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dashboard: Dashboard_1.Dashboard, dataProvider: dataProvider_1.dataProvider, layout: LayoutWithAlwaysOnAppbar, store: (0, react_admin_1.memoryStore)(), title: "Solar Admin" },
        React.createElement(react_admin_1.Resource, { name: "songs", icon: icons_material_1.MusicNote, list: SongList, edit: react_admin_1.EditGuesser }),
        React.createElement(react_admin_1.Resource, { name: "artists", icon: icons_material_1.People, list: ArtistList, edit: react_admin_1.EditGuesser })))); };
exports.WithAlwaysOnAppbar = WithAlwaysOnAppbar;
var CustomAppBar = function () { return (React.createElement(src_1.SolarAppBar, { sx: { color: 'text.secondary', bgcolor: 'background.default' } },
    React.createElement(material_1.Box, { display: "flex", justifyContent: "space-between", alignItems: "center" },
        React.createElement(material_1.Box, { mr: 1 }, "Custom toolbar"),
        React.createElement(material_1.Box, { mr: 1 }, "with"),
        React.createElement(material_1.Box, { mr: 1 }, "multiple"),
        React.createElement(material_1.Box, { mr: 1 }, "elements")))); };
var LayoutWithCustomAppbar = function (props) { return (React.createElement(src_1.SolarLayout, __assign({}, props, { appBar: CustomAppBar }))); };
var WithCustomAppbar = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dashboard: Dashboard_1.Dashboard, dataProvider: dataProvider_1.dataProvider, layout: LayoutWithCustomAppbar, store: (0, react_admin_1.memoryStore)(), title: "Solar Admin" },
        React.createElement(react_admin_1.Resource, { name: "songs", icon: icons_material_1.MusicNote, list: SongList, edit: react_admin_1.EditGuesser }),
        React.createElement(react_admin_1.Resource, { name: "artists", icon: icons_material_1.People, list: ArtistList, edit: react_admin_1.EditGuesser })))); };
exports.WithCustomAppbar = WithCustomAppbar;
var LayoutWithPageTitle = function (_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    return (React.createElement(src_1.SolarLayout, __assign({}, props),
        React.createElement(TitlePortal_1.TitlePortal, null),
        children));
};
var WithPageTitle = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dashboard: Dashboard_1.Dashboard, dataProvider: dataProvider_1.dataProvider, layout: LayoutWithPageTitle, store: (0, react_admin_1.memoryStore)(), title: "Solar Admin" },
        React.createElement(react_admin_1.Resource, { name: "songs", icon: icons_material_1.MusicNote, list: SongList, edit: react_admin_1.EditGuesser }),
        React.createElement(react_admin_1.Resource, { name: "artists", icon: icons_material_1.People, list: ArtistList, edit: react_admin_1.EditGuesser })))); };
exports.WithPageTitle = WithPageTitle;
var WithPageTitleDarkMode = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dashboard: Dashboard_1.Dashboard, dataProvider: dataProvider_1.dataProvider, layout: LayoutWithPageTitle, theme: react_admin_1.defaultDarkTheme, store: (0, react_admin_1.memoryStore)(), title: "Solar Admin" },
        React.createElement(react_admin_1.Resource, { name: "songs", icon: icons_material_1.MusicNote, list: SongList, edit: react_admin_1.EditGuesser }),
        React.createElement(react_admin_1.Resource, { name: "artists", icon: icons_material_1.People, list: ArtistList, edit: react_admin_1.EditGuesser })))); };
exports.WithPageTitleDarkMode = WithPageTitleDarkMode;
var LayoutWithBreadcrumb = function (_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    return (React.createElement(src_1.SolarLayout, __assign({}, props),
        React.createElement(src_1.Breadcrumb, { hasDashboard: true },
            React.createElement(src_1.Breadcrumb.ResourceItems, { resources: ['songs', 'artists'] })),
        children));
};
var WithBreadcrumb = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dashboard: Dashboard_1.Dashboard, dataProvider: dataProvider_1.dataProvider, layout: LayoutWithBreadcrumb, store: (0, react_admin_1.memoryStore)(), title: "Solar Admin" },
        React.createElement(react_admin_1.Resource, { name: "songs", icon: icons_material_1.MusicNote, list: SongList, edit: react_admin_1.EditGuesser }),
        React.createElement(react_admin_1.Resource, { name: "artists", icon: icons_material_1.People, list: ArtistList, edit: react_admin_1.EditGuesser })))); };
exports.WithBreadcrumb = WithBreadcrumb;
var WithBreadcrumbDarkMode = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dashboard: Dashboard_1.Dashboard, dataProvider: dataProvider_1.dataProvider, layout: LayoutWithBreadcrumb, theme: react_admin_1.defaultDarkTheme, store: (0, react_admin_1.memoryStore)(), title: "Solar Admin" },
        React.createElement(react_admin_1.Resource, { name: "songs", icon: icons_material_1.MusicNote, list: SongList, edit: react_admin_1.EditGuesser }),
        React.createElement(react_admin_1.Resource, { name: "artists", icon: icons_material_1.People, list: ArtistList, edit: react_admin_1.EditGuesser })))); };
exports.WithBreadcrumbDarkMode = WithBreadcrumbDarkMode;
var LayoutWithPageTitleAndBreadcrumb = function (_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    return (React.createElement(src_1.SolarLayout, __assign({}, props),
        React.createElement(src_1.Breadcrumb, { hasDashboard: true },
            React.createElement(src_1.Breadcrumb.ResourceItems, { resources: ['songs', 'artists'] })),
        React.createElement(TitlePortal_1.TitlePortal, null),
        children));
};
var WithPageTitleAndBreadcrumb = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dashboard: Dashboard_1.Dashboard, dataProvider: dataProvider_1.dataProvider, layout: LayoutWithPageTitleAndBreadcrumb, store: (0, react_admin_1.memoryStore)(), title: "Solar Admin" },
        React.createElement(react_admin_1.Resource, { name: "songs", icon: icons_material_1.MusicNote, list: SongList, edit: react_admin_1.EditGuesser }),
        React.createElement(react_admin_1.Resource, { name: "artists", icon: icons_material_1.People, list: ArtistList, edit: react_admin_1.EditGuesser })))); };
exports.WithPageTitleAndBreadcrumb = WithPageTitleAndBreadcrumb;
var WithPageTitleAndBreadcrumbDarkMode = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dashboard: Dashboard_1.Dashboard, dataProvider: dataProvider_1.dataProvider, layout: LayoutWithPageTitleAndBreadcrumb, theme: react_admin_1.defaultDarkTheme, store: (0, react_admin_1.memoryStore)(), title: "Solar Admin" },
        React.createElement(react_admin_1.Resource, { name: "songs", icon: icons_material_1.MusicNote, list: SongList, edit: react_admin_1.EditGuesser }),
        React.createElement(react_admin_1.Resource, { name: "artists", icon: icons_material_1.People, list: ArtistList, edit: react_admin_1.EditGuesser })))); };
exports.WithPageTitleAndBreadcrumbDarkMode = WithPageTitleAndBreadcrumbDarkMode;
var WithDefaultUserMenu = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dashboard: Dashboard_1.Dashboard, authProvider: authProvider_1.authProvider, dataProvider: dataProvider_1.dataProvider, layout: src_1.SolarLayout, store: (0, react_admin_1.memoryStore)(), title: "Solar Admin" },
        React.createElement(react_admin_1.Resource, { name: "songs", icon: icons_material_1.MusicNote, list: SongList, edit: react_admin_1.EditGuesser }),
        React.createElement(react_admin_1.Resource, { name: "artists", icon: icons_material_1.People, list: ArtistList, edit: react_admin_1.EditGuesser })))); };
exports.WithDefaultUserMenu = WithDefaultUserMenu;
var WithDefaultUserMenuNoIdentity = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dashboard: Dashboard_1.Dashboard, authProvider: authProvider_1.authProviderNoIdentity, dataProvider: dataProvider_1.dataProvider, layout: src_1.SolarLayout, store: (0, react_admin_1.memoryStore)(), title: "Solar Admin" },
        React.createElement(react_admin_1.Resource, { name: "songs", icon: icons_material_1.MusicNote, list: SongList, edit: react_admin_1.EditGuesser }),
        React.createElement(react_admin_1.Resource, { name: "artists", icon: icons_material_1.People, list: ArtistList, edit: react_admin_1.EditGuesser })))); };
exports.WithDefaultUserMenuNoIdentity = WithDefaultUserMenuNoIdentity;
var WithDefaultUserMenuAndDefaultDarkThemeSupport = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dashboard: Dashboard_1.Dashboard, authProvider: authProvider_1.authProvider, dataProvider: dataProvider_1.dataProvider, layout: src_1.SolarLayout, darkTheme: react_admin_1.defaultDarkTheme, store: (0, react_admin_1.memoryStore)(), title: "Solar Admin" },
        React.createElement(react_admin_1.Resource, { name: "songs", icon: icons_material_1.MusicNote, list: SongList, edit: react_admin_1.EditGuesser }),
        React.createElement(react_admin_1.Resource, { name: "artists", icon: icons_material_1.People, list: ArtistList, edit: react_admin_1.EditGuesser })))); };
exports.WithDefaultUserMenuAndDefaultDarkThemeSupport = WithDefaultUserMenuAndDefaultDarkThemeSupport;
var WithDefaultUserMenuAndLocalesSupport = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dashboard: Dashboard_1.Dashboard, authProvider: authProvider_1.authProvider, dataProvider: dataProvider_1.dataProvider, i18nProvider: i18nProvider_1.i18nProvider, layout: src_1.SolarLayout, store: (0, react_admin_1.memoryStore)(), title: "Solar Admin" },
        React.createElement(react_admin_1.Resource, { name: "songs", icon: icons_material_1.MusicNote, list: SongList, edit: react_admin_1.EditGuesser }),
        React.createElement(react_admin_1.Resource, { name: "artists", icon: icons_material_1.People, list: ArtistList, edit: react_admin_1.EditGuesser })))); };
exports.WithDefaultUserMenuAndLocalesSupport = WithDefaultUserMenuAndLocalesSupport;
var WithDefaultUserMenuAndThemeAndLocalesSupport = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dashboard: Dashboard_1.Dashboard, authProvider: authProvider_1.authProvider, dataProvider: dataProvider_1.dataProvider, i18nProvider: i18nProvider_1.i18nProvider, layout: src_1.SolarLayout, darkTheme: react_admin_1.defaultDarkTheme, store: (0, react_admin_1.memoryStore)(), title: "Solar Admin" },
        React.createElement(react_admin_1.Resource, { name: "songs", icon: icons_material_1.MusicNote, list: SongList, edit: react_admin_1.EditGuesser }),
        React.createElement(react_admin_1.Resource, { name: "artists", icon: icons_material_1.People, list: ArtistList, edit: react_admin_1.EditGuesser })))); };
exports.WithDefaultUserMenuAndThemeAndLocalesSupport = WithDefaultUserMenuAndThemeAndLocalesSupport;
var WithLocalesSupport = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dashboard: Dashboard_1.Dashboard, dataProvider: dataProvider_1.dataProvider, i18nProvider: i18nProvider_1.i18nProvider, layout: src_1.SolarLayout, store: (0, react_admin_1.memoryStore)(), title: "Solar Admin" },
        React.createElement(react_admin_1.Resource, { name: "songs", icon: icons_material_1.MusicNote, list: SongList, edit: react_admin_1.EditGuesser }),
        React.createElement(react_admin_1.Resource, { name: "artists", icon: icons_material_1.People, list: ArtistList, edit: react_admin_1.EditGuesser })))); };
exports.WithLocalesSupport = WithLocalesSupport;
var WithThemeSupport = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dashboard: Dashboard_1.Dashboard, dataProvider: dataProvider_1.dataProvider, layout: src_1.SolarLayout, store: (0, react_admin_1.memoryStore)(), darkTheme: react_admin_1.defaultDarkTheme, title: "Solar Admin" },
        React.createElement(react_admin_1.Resource, { name: "songs", icon: icons_material_1.MusicNote, list: SongList, edit: react_admin_1.EditGuesser }),
        React.createElement(react_admin_1.Resource, { name: "artists", icon: icons_material_1.People, list: ArtistList, edit: react_admin_1.EditGuesser })))); };
exports.WithThemeSupport = WithThemeSupport;
var WithThemeAndLocalesSupport = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dashboard: Dashboard_1.Dashboard, dataProvider: dataProvider_1.dataProvider, i18nProvider: i18nProvider_1.i18nProvider, layout: src_1.SolarLayout, darkTheme: react_admin_1.defaultDarkTheme, store: (0, react_admin_1.memoryStore)(), title: "Solar Admin" },
        React.createElement(react_admin_1.Resource, { name: "songs", icon: icons_material_1.MusicNote, list: SongList, edit: react_admin_1.EditGuesser }),
        React.createElement(react_admin_1.Resource, { name: "artists", icon: icons_material_1.People, list: ArtistList, edit: react_admin_1.EditGuesser })))); };
exports.WithThemeAndLocalesSupport = WithThemeAndLocalesSupport;
var SongList = function () {
    var isSmall = (0, material_1.useMediaQuery)(function (theme) { return theme.breakpoints.down('sm'); });
    return (React.createElement(react_admin_1.List, null, isSmall ? (React.createElement(react_admin_1.SimpleList, { primaryText: function (record) { return record === null || record === void 0 ? void 0 : record.title; }, secondaryText: function (record) {
            return record === null || record === void 0 ? void 0 : record.released.toLocaleDateString();
        } })) : (React.createElement(react_admin_1.Datagrid, null,
        React.createElement(react_admin_1.TextField, { source: "id" }),
        React.createElement(react_admin_1.TextField, { source: "title" }),
        React.createElement(react_admin_1.DateField, { source: "released" })))));
};
var ArtistList = function () {
    var isSmall = (0, material_1.useMediaQuery)(function (theme) { return theme.breakpoints.down('sm'); });
    return (React.createElement(react_admin_1.List, null, isSmall ? (React.createElement(react_admin_1.SimpleList, { primaryText: function (record) { return record === null || record === void 0 ? void 0 : record.name; } })) : (React.createElement(react_admin_1.Datagrid, null,
        React.createElement(react_admin_1.TextField, { source: "id" }),
        React.createElement(react_admin_1.TextField, { source: "name" })))));
};
