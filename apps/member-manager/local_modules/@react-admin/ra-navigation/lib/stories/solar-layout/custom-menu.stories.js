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
exports.WithCustomUserMenu = exports.WithDefaultUserMenuAndThemeAndLocalesSupport = exports.WithPageTitleAndBreadcrumbDarkMode = exports.WithPageTitleAndBreadcrumb = exports.WithBreadcrumbDarkMode = exports.WithBreadcrumb = exports.WithPageTitleDarkMode = exports.WithPageTitle = exports.SecondaryIconsDarkMode = exports.SecondaryIcons = exports.DarkMode = exports.Basic = void 0;
var React = __importStar(require("react"));
var react_admin_1 = require("react-admin");
var material_1 = require("@mui/material");
var icons_material_1 = require("@mui/icons-material");
var src_1 = require("../../src");
var dataProvider_1 = require("../dataProvider");
var react_router_dom_1 = require("react-router-dom");
var Logo_1 = require("./Logo");
var TitlePortal_1 = require("./TitlePortal");
var i18nProvider_1 = require("./i18nProvider");
var authProvider_1 = require("./authProvider");
var Dashboard_1 = require("./Dashboard");
exports.default = { title: 'ra-navigation/SolarLayout/CustomMenu' };
var LayoutBasic = function (props) { return (React.createElement(src_1.SolarLayout, __assign({}, props, { menu: CustomMenu }))); };
var Basic = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dashboard: Dashboard_1.Dashboard, dataProvider: dataProvider_1.dataProvider, layout: LayoutBasic, store: (0, react_admin_1.memoryStore)(), title: "Solar Admin" },
        React.createElement(react_admin_1.Resource, { name: "songs", icon: icons_material_1.MusicNote, list: SongList, edit: react_admin_1.EditGuesser }),
        React.createElement(react_admin_1.Resource, { name: "artists", icon: icons_material_1.People, list: ArtistList, edit: react_admin_1.EditGuesser })))); };
exports.Basic = Basic;
var DarkMode = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dashboard: Dashboard_1.Dashboard, dataProvider: dataProvider_1.dataProvider, layout: LayoutBasic, theme: react_admin_1.defaultDarkTheme, store: (0, react_admin_1.memoryStore)(), title: "Solar Admin" },
        React.createElement(react_admin_1.Resource, { name: "songs", icon: icons_material_1.MusicNote, list: SongList, edit: react_admin_1.EditGuesser }),
        React.createElement(react_admin_1.Resource, { name: "artists", icon: icons_material_1.People, list: ArtistList, edit: react_admin_1.EditGuesser })))); };
exports.DarkMode = DarkMode;
var LayoutSecondaryIcons = function (props) { return (React.createElement(src_1.SolarLayout, __assign({}, props, { menu: CustomMenuWithSecondaryIcons }))); };
var SecondaryIcons = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dashboard: Dashboard_1.Dashboard, dataProvider: dataProvider_1.dataProvider, layout: LayoutSecondaryIcons, store: (0, react_admin_1.memoryStore)(), title: "Solar Admin" },
        React.createElement(react_admin_1.Resource, { name: "songs", icon: icons_material_1.MusicNote, list: SongList, edit: react_admin_1.EditGuesser }),
        React.createElement(react_admin_1.Resource, { name: "artists", icon: icons_material_1.People, list: ArtistList, edit: react_admin_1.EditGuesser })))); };
exports.SecondaryIcons = SecondaryIcons;
var SecondaryIconsDarkMode = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dashboard: Dashboard_1.Dashboard, dataProvider: dataProvider_1.dataProvider, layout: LayoutSecondaryIcons, theme: react_admin_1.defaultDarkTheme, store: (0, react_admin_1.memoryStore)(), title: "Solar Admin" },
        React.createElement(react_admin_1.Resource, { name: "songs", icon: icons_material_1.MusicNote, list: SongList, edit: react_admin_1.EditGuesser }),
        React.createElement(react_admin_1.Resource, { name: "artists", icon: icons_material_1.People, list: ArtistList, edit: react_admin_1.EditGuesser })))); };
exports.SecondaryIconsDarkMode = SecondaryIconsDarkMode;
var LayoutWithPageTitle = function (_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    return (React.createElement(src_1.SolarLayout, __assign({}, props, { menu: CustomMenu }),
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
    return (React.createElement(src_1.SolarLayout, __assign({}, props, { menu: CustomMenu }),
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
    return (React.createElement(src_1.SolarLayout, __assign({}, props, { menu: CustomMenu }),
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
var WithDefaultUserMenuAndThemeAndLocalesSupportLayout = function (_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    return (React.createElement(src_1.SolarLayout, __assign({}, props, { menu: CustomMenu }),
        React.createElement(src_1.Breadcrumb, { hasDashboard: true },
            React.createElement(src_1.Breadcrumb.ResourceItems, { resources: ['songs', 'artists'] })),
        React.createElement(TitlePortal_1.TitlePortal, null),
        children));
};
var WithDefaultUserMenuAndThemeAndLocalesSupport = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dashboard: Dashboard_1.Dashboard, authProvider: authProvider_1.authProvider, dataProvider: dataProvider_1.dataProvider, i18nProvider: i18nProvider_1.i18nProvider, layout: WithDefaultUserMenuAndThemeAndLocalesSupportLayout, darkTheme: react_admin_1.defaultDarkTheme, store: (0, react_admin_1.memoryStore)(), title: "Solar Admin" },
        React.createElement(react_admin_1.Resource, { name: "songs", icon: icons_material_1.MusicNote, list: SongList, edit: react_admin_1.EditGuesser }),
        React.createElement(react_admin_1.Resource, { name: "artists", icon: icons_material_1.People, list: ArtistList, edit: react_admin_1.EditGuesser })))); };
exports.WithDefaultUserMenuAndThemeAndLocalesSupport = WithDefaultUserMenuAndThemeAndLocalesSupport;
var WithCustomUserMenuLayout = function (props) { return (React.createElement(src_1.SolarLayout, __assign({}, props, { menu: CustomMenuWithCustomUserMenu }))); };
var WithCustomUserMenu = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dashboard: Dashboard_1.Dashboard, authProvider: authProvider_1.authProvider, dataProvider: dataProvider_1.dataProvider, i18nProvider: i18nProvider_1.i18nProvider, layout: WithCustomUserMenuLayout, darkTheme: react_admin_1.defaultDarkTheme, store: (0, react_admin_1.memoryStore)(), title: "Solar Admin" },
        React.createElement(react_admin_1.Resource, { name: "songs", icon: icons_material_1.MusicNote, list: SongList, edit: react_admin_1.EditGuesser }),
        React.createElement(react_admin_1.Resource, { name: "artists", icon: icons_material_1.People, list: ArtistList, edit: react_admin_1.EditGuesser })))); };
exports.WithCustomUserMenu = WithCustomUserMenu;
var CustomMenu = function (_a) {
    var userMenu = _a.userMenu;
    return (React.createElement(src_1.SolarMenu, { userMenu: userMenu },
        React.createElement(src_1.SolarMenu.DashboardItem, { icon: React.createElement(Logo_1.Logo, null) }),
        React.createElement(src_1.SolarMenu.ResourceItem, { name: "songs", subMenu: React.createElement(SongsSubMenu, null) }),
        React.createElement(src_1.SolarMenu.ResourceItem, { name: "artists", subMenu: React.createElement(ArtistsSubMenu, null) })));
};
var SongsSubMenu = function () { return (React.createElement(src_1.SolarMenu.List, { dense: true, disablePadding: true, sx: { gap: 0 } },
    React.createElement(src_1.SolarMenu.Item, { name: "songs.all", label: "All Songs", to: "/songs?filter=".concat(encodeURIComponent(JSON.stringify({ filter: {} }))) }),
    React.createElement(material_1.ListSubheader, { sx: { marginTop: 1, lineHeight: 'unset', paddingX: 1 } }, "Rock"),
    React.createElement(src_1.SolarMenu.Item, { name: "songs.rock", label: "Rock Songs", to: "/songs?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'Rock' } }))) }),
    React.createElement(src_1.SolarMenu.Item, { name: "songs.folk", label: "Folk Rock Songs", to: "/songs?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'Folk Rock' } }))) }),
    React.createElement(src_1.SolarMenu.Item, { name: "songs.rock", label: "Pop Rock Songs", to: "/songs?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'Pop Rock' } }))) }),
    React.createElement(material_1.ListSubheader, { sx: { marginTop: 1, lineHeight: 'unset', paddingX: 1 } }, "Jazz"),
    React.createElement(src_1.SolarMenu.Item, { name: "songs.jazz", label: "Jazz songs", to: "/songs?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'Jazz' } }))) }),
    React.createElement(src_1.SolarMenu.Item, { name: "songs.rb", label: "RB Songs", to: "/songs?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'RB' } }))) }))); };
var ArtistsSubMenu = function () { return (React.createElement(src_1.SolarMenu.List, { dense: true, disablePadding: true, sx: { gap: 0 } },
    React.createElement(src_1.SolarMenu.Item, { name: "artists.all", label: "All Artists", to: "/artists?filter=".concat(encodeURIComponent(JSON.stringify({ filter: {} }))) }),
    React.createElement(material_1.ListSubheader, { sx: { marginTop: 1, lineHeight: 'unset', paddingX: 1 } }, "Rock"),
    React.createElement(src_1.SolarMenu.Item, { name: "artists.folk", label: "Folk Rock Artists", to: "/artists?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'Folk Rock' } }))) }),
    React.createElement(src_1.SolarMenu.Item, { name: "artists.rock", label: "Pop Rock Artists", to: "/artists?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'Pop Rock' } }))) }),
    React.createElement(material_1.ListSubheader, { sx: { marginTop: 1, lineHeight: 'unset', paddingX: 1 } }, "Jazz"),
    React.createElement(src_1.SolarMenu.Item, { name: "artists.jazz", label: "Jazz artists", to: "/artists?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'Jazz' } }))) }),
    React.createElement(src_1.SolarMenu.Item, { name: "artists.jazz", label: "RB Artists", to: "/artists?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'RB' } }))) }))); };
var CustomMenuWithCustomUserMenu = function () { return (React.createElement(CustomMenu, { userMenu: React.createElement(CustomUserMenu, null) })); };
var CustomUserMenu = function () { return (React.createElement(src_1.SolarMenu.UserItem, { subMenu: React.createElement(src_1.SolarMenu.List, { component: "div", sx: {
            marginTop: 'auto',
            display: 'flex',
            flexDirection: 'column',
        } },
        React.createElement(InspectorMenuItem, null),
        React.createElement(src_1.SolarMenu.LocalesItem, null),
        React.createElement(src_1.SolarMenu.ToggleThemeItem, null),
        React.createElement(src_1.SolarMenu.UserProfileItem, null)) })); };
var InspectorMenuItem = function () {
    var _a = (0, src_1.useSolarSidebarActiveMenu)(), setSecondarySidebarOpener = _a[1];
    var translate = (0, react_admin_1.useTranslate)();
    var _b = (0, react_admin_1.usePreferencesEditor)(), enable = _b.enable, disable = _b.disable, setPreferenceKey = _b.setPreferenceKey, isEnabled = _b.isEnabled;
    var handleClick = function () {
        if (isEnabled) {
            disable();
            setPreferenceKey(null);
        }
        else {
            enable();
        }
        setSecondarySidebarOpener(null);
    };
    return (React.createElement(material_1.ListItem, { disablePadding: true, secondaryAction: React.createElement(icons_material_1.Settings, { sx: { mr: -0.5, color: 'text.secondary' } }) },
        React.createElement(material_1.ListItemButton, { onClick: handleClick }, translate('ra.configurable.configureMode', {
            _: 'Configure mode',
        }))));
};
var CustomMenuWithSecondaryIcons = function () { return (React.createElement(src_1.SolarMenu, null,
    React.createElement(src_1.SolarMenu.DashboardItem, { icon: React.createElement(Logo_1.Logo, null) }),
    React.createElement(src_1.SolarMenu.ResourceItem, { name: "songs", subMenu: React.createElement(src_1.SolarMenu.List, { dense: true, disablePadding: true, sx: { gap: 0 } },
            React.createElement(src_1.SolarMenu.Item, { name: "songs.all", label: "All Songs", icon: React.createElement(icons_material_1.MusicNote, null), to: "/songs?filter=".concat(encodeURIComponent(JSON.stringify({ filter: {} }))) }),
            React.createElement(material_1.ListSubheader, { sx: { marginTop: 1, lineHeight: 'unset', paddingX: 1 } }, "Rock"),
            React.createElement(src_1.SolarMenu.Item, { name: "songs.rock", label: "Rock Songs", icon: React.createElement(icons_material_1.MusicNote, null), to: "/songs?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'Rock' } }))) }),
            React.createElement(src_1.SolarMenu.Item, { name: "songs.folk", label: "Folk Rock Songs", icon: React.createElement(icons_material_1.MusicNote, null), to: "/songs?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'Folk Rock' } }))) }),
            React.createElement(src_1.SolarMenu.Item, { name: "songs.rock", label: "Pop Rock Songs", icon: React.createElement(icons_material_1.MusicNote, null), to: "/songs?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'Pop Rock' } }))) }),
            React.createElement(material_1.ListSubheader, { sx: { marginTop: 1, lineHeight: 'unset', paddingX: 1 } }, "Jazz"),
            React.createElement(src_1.SolarMenu.Item, { name: "songs.jazz", label: "Jazz songs", icon: React.createElement(icons_material_1.MusicNote, null), to: "/songs?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'Jazz' } }))) }),
            React.createElement(src_1.SolarMenu.Item, { name: "songs.rb", label: "RB Songs", icon: React.createElement(icons_material_1.MusicNote, null), to: "/songs?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'RB' } }))) })) }),
    React.createElement(src_1.SolarMenu.ResourceItem, { name: "artists", subMenu: React.createElement(src_1.SolarMenu.List, { dense: true, disablePadding: true, sx: { gap: 0 } },
            React.createElement(src_1.SolarMenu.Item, { name: "artists.all", label: "All Artists", icon: React.createElement(icons_material_1.People, null), to: "/artists?filter=".concat(encodeURIComponent(JSON.stringify({ filter: {} }))) }),
            React.createElement(material_1.ListSubheader, { sx: { marginTop: 1, lineHeight: 'unset', paddingX: 1 } }, "Rock"),
            React.createElement(src_1.SolarMenu.Item, { name: "artists.folk", label: "Folk Rock Artists", icon: React.createElement(icons_material_1.People, null), to: "/artists?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'Folk Rock' } }))) }),
            React.createElement(src_1.SolarMenu.Item, { name: "artists.rock", label: "Pop Rock Artists", icon: React.createElement(icons_material_1.People, null), to: "/artists?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'Pop Rock' } }))) }),
            React.createElement(material_1.ListSubheader, { sx: { marginTop: 1, lineHeight: 'unset', paddingX: 1 } }, "Jazz"),
            React.createElement(src_1.SolarMenu.Item, { name: "artists.jazz", label: "Jazz artists", icon: React.createElement(icons_material_1.People, null), to: "/artists?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'Jazz' } }))) }),
            React.createElement(src_1.SolarMenu.Item, { name: "artists.jazz", label: "RB Artists", icon: React.createElement(icons_material_1.People, null), to: "/artists?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'RB' } }))) })) }))); };
var SongList = function () {
    var isSmall = (0, material_1.useMediaQuery)(function (theme) { return theme.breakpoints.down('sm'); });
    return (React.createElement(react_admin_1.List, null, isSmall ? (React.createElement(react_admin_1.SimpleListConfigurable, { primaryText: function (record) { return record === null || record === void 0 ? void 0 : record.title; }, secondaryText: function (record) {
            return record === null || record === void 0 ? void 0 : record.released.toLocaleDateString();
        } })) : (React.createElement(react_admin_1.DatagridConfigurable, null,
        React.createElement(react_admin_1.TextField, { source: "id" }),
        React.createElement(react_admin_1.TextField, { source: "title" }),
        React.createElement(react_admin_1.DateField, { source: "released" })))));
};
var ArtistList = function () {
    var isSmall = (0, material_1.useMediaQuery)(function (theme) { return theme.breakpoints.down('sm'); });
    return (React.createElement(react_admin_1.List, null, isSmall ? (React.createElement(react_admin_1.SimpleListConfigurable, { primaryText: function (record) { return record === null || record === void 0 ? void 0 : record.name; } })) : (React.createElement(react_admin_1.DatagridConfigurable, null,
        React.createElement(react_admin_1.TextField, { source: "id" }),
        React.createElement(react_admin_1.TextField, { source: "name" })))));
};
