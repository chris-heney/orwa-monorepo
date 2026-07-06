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
import { Admin, DateField, EditGuesser, List, Resource, TextField, memoryStore, defaultDarkTheme, usePreferencesEditor, useTranslate, DatagridConfigurable, SimpleListConfigurable, } from 'react-admin';
import { ListItem, ListItemButton, ListSubheader, useMediaQuery, } from '@mui/material';
import { MusicNote, People, Settings } from '@mui/icons-material';
import { SolarLayout, SolarMenu, Breadcrumb, useSolarSidebarActiveMenu, } from '../../src';
import { dataProvider } from '../dataProvider';
import { MemoryRouter } from 'react-router-dom';
import { Logo } from './Logo';
import { TitlePortal } from './TitlePortal';
import { i18nProvider } from './i18nProvider';
import { authProvider } from './authProvider';
import { Dashboard } from './Dashboard';
export default { title: 'ra-navigation/SolarLayout/CustomMenu' };
var LayoutBasic = function (props) { return (React.createElement(SolarLayout, __assign({}, props, { menu: CustomMenu }))); };
export var Basic = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dashboard: Dashboard, dataProvider: dataProvider, layout: LayoutBasic, store: memoryStore(), title: "Solar Admin" },
        React.createElement(Resource, { name: "songs", icon: MusicNote, list: SongList, edit: EditGuesser }),
        React.createElement(Resource, { name: "artists", icon: People, list: ArtistList, edit: EditGuesser })))); };
export var DarkMode = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dashboard: Dashboard, dataProvider: dataProvider, layout: LayoutBasic, theme: defaultDarkTheme, store: memoryStore(), title: "Solar Admin" },
        React.createElement(Resource, { name: "songs", icon: MusicNote, list: SongList, edit: EditGuesser }),
        React.createElement(Resource, { name: "artists", icon: People, list: ArtistList, edit: EditGuesser })))); };
var LayoutSecondaryIcons = function (props) { return (React.createElement(SolarLayout, __assign({}, props, { menu: CustomMenuWithSecondaryIcons }))); };
export var SecondaryIcons = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dashboard: Dashboard, dataProvider: dataProvider, layout: LayoutSecondaryIcons, store: memoryStore(), title: "Solar Admin" },
        React.createElement(Resource, { name: "songs", icon: MusicNote, list: SongList, edit: EditGuesser }),
        React.createElement(Resource, { name: "artists", icon: People, list: ArtistList, edit: EditGuesser })))); };
export var SecondaryIconsDarkMode = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dashboard: Dashboard, dataProvider: dataProvider, layout: LayoutSecondaryIcons, theme: defaultDarkTheme, store: memoryStore(), title: "Solar Admin" },
        React.createElement(Resource, { name: "songs", icon: MusicNote, list: SongList, edit: EditGuesser }),
        React.createElement(Resource, { name: "artists", icon: People, list: ArtistList, edit: EditGuesser })))); };
var LayoutWithPageTitle = function (_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    return (React.createElement(SolarLayout, __assign({}, props, { menu: CustomMenu }),
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
    return (React.createElement(SolarLayout, __assign({}, props, { menu: CustomMenu }),
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
    return (React.createElement(SolarLayout, __assign({}, props, { menu: CustomMenu }),
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
var WithDefaultUserMenuAndThemeAndLocalesSupportLayout = function (_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    return (React.createElement(SolarLayout, __assign({}, props, { menu: CustomMenu }),
        React.createElement(Breadcrumb, { hasDashboard: true },
            React.createElement(Breadcrumb.ResourceItems, { resources: ['songs', 'artists'] })),
        React.createElement(TitlePortal, null),
        children));
};
export var WithDefaultUserMenuAndThemeAndLocalesSupport = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dashboard: Dashboard, authProvider: authProvider, dataProvider: dataProvider, i18nProvider: i18nProvider, layout: WithDefaultUserMenuAndThemeAndLocalesSupportLayout, darkTheme: defaultDarkTheme, store: memoryStore(), title: "Solar Admin" },
        React.createElement(Resource, { name: "songs", icon: MusicNote, list: SongList, edit: EditGuesser }),
        React.createElement(Resource, { name: "artists", icon: People, list: ArtistList, edit: EditGuesser })))); };
var WithCustomUserMenuLayout = function (props) { return (React.createElement(SolarLayout, __assign({}, props, { menu: CustomMenuWithCustomUserMenu }))); };
export var WithCustomUserMenu = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dashboard: Dashboard, authProvider: authProvider, dataProvider: dataProvider, i18nProvider: i18nProvider, layout: WithCustomUserMenuLayout, darkTheme: defaultDarkTheme, store: memoryStore(), title: "Solar Admin" },
        React.createElement(Resource, { name: "songs", icon: MusicNote, list: SongList, edit: EditGuesser }),
        React.createElement(Resource, { name: "artists", icon: People, list: ArtistList, edit: EditGuesser })))); };
var CustomMenu = function (_a) {
    var userMenu = _a.userMenu;
    return (React.createElement(SolarMenu, { userMenu: userMenu },
        React.createElement(SolarMenu.DashboardItem, { icon: React.createElement(Logo, null) }),
        React.createElement(SolarMenu.ResourceItem, { name: "songs", subMenu: React.createElement(SongsSubMenu, null) }),
        React.createElement(SolarMenu.ResourceItem, { name: "artists", subMenu: React.createElement(ArtistsSubMenu, null) })));
};
var SongsSubMenu = function () { return (React.createElement(SolarMenu.List, { dense: true, disablePadding: true, sx: { gap: 0 } },
    React.createElement(SolarMenu.Item, { name: "songs.all", label: "All Songs", to: "/songs?filter=".concat(encodeURIComponent(JSON.stringify({ filter: {} }))) }),
    React.createElement(ListSubheader, { sx: { marginTop: 1, lineHeight: 'unset', paddingX: 1 } }, "Rock"),
    React.createElement(SolarMenu.Item, { name: "songs.rock", label: "Rock Songs", to: "/songs?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'Rock' } }))) }),
    React.createElement(SolarMenu.Item, { name: "songs.folk", label: "Folk Rock Songs", to: "/songs?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'Folk Rock' } }))) }),
    React.createElement(SolarMenu.Item, { name: "songs.rock", label: "Pop Rock Songs", to: "/songs?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'Pop Rock' } }))) }),
    React.createElement(ListSubheader, { sx: { marginTop: 1, lineHeight: 'unset', paddingX: 1 } }, "Jazz"),
    React.createElement(SolarMenu.Item, { name: "songs.jazz", label: "Jazz songs", to: "/songs?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'Jazz' } }))) }),
    React.createElement(SolarMenu.Item, { name: "songs.rb", label: "RB Songs", to: "/songs?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'RB' } }))) }))); };
var ArtistsSubMenu = function () { return (React.createElement(SolarMenu.List, { dense: true, disablePadding: true, sx: { gap: 0 } },
    React.createElement(SolarMenu.Item, { name: "artists.all", label: "All Artists", to: "/artists?filter=".concat(encodeURIComponent(JSON.stringify({ filter: {} }))) }),
    React.createElement(ListSubheader, { sx: { marginTop: 1, lineHeight: 'unset', paddingX: 1 } }, "Rock"),
    React.createElement(SolarMenu.Item, { name: "artists.folk", label: "Folk Rock Artists", to: "/artists?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'Folk Rock' } }))) }),
    React.createElement(SolarMenu.Item, { name: "artists.rock", label: "Pop Rock Artists", to: "/artists?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'Pop Rock' } }))) }),
    React.createElement(ListSubheader, { sx: { marginTop: 1, lineHeight: 'unset', paddingX: 1 } }, "Jazz"),
    React.createElement(SolarMenu.Item, { name: "artists.jazz", label: "Jazz artists", to: "/artists?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'Jazz' } }))) }),
    React.createElement(SolarMenu.Item, { name: "artists.jazz", label: "RB Artists", to: "/artists?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'RB' } }))) }))); };
var CustomMenuWithCustomUserMenu = function () { return (React.createElement(CustomMenu, { userMenu: React.createElement(CustomUserMenu, null) })); };
var CustomUserMenu = function () { return (React.createElement(SolarMenu.UserItem, { subMenu: React.createElement(SolarMenu.List, { component: "div", sx: {
            marginTop: 'auto',
            display: 'flex',
            flexDirection: 'column',
        } },
        React.createElement(InspectorMenuItem, null),
        React.createElement(SolarMenu.LocalesItem, null),
        React.createElement(SolarMenu.ToggleThemeItem, null),
        React.createElement(SolarMenu.UserProfileItem, null)) })); };
var InspectorMenuItem = function () {
    var _a = useSolarSidebarActiveMenu(), setSecondarySidebarOpener = _a[1];
    var translate = useTranslate();
    var _b = usePreferencesEditor(), enable = _b.enable, disable = _b.disable, setPreferenceKey = _b.setPreferenceKey, isEnabled = _b.isEnabled;
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
    return (React.createElement(ListItem, { disablePadding: true, secondaryAction: React.createElement(Settings, { sx: { mr: -0.5, color: 'text.secondary' } }) },
        React.createElement(ListItemButton, { onClick: handleClick }, translate('ra.configurable.configureMode', {
            _: 'Configure mode',
        }))));
};
var CustomMenuWithSecondaryIcons = function () { return (React.createElement(SolarMenu, null,
    React.createElement(SolarMenu.DashboardItem, { icon: React.createElement(Logo, null) }),
    React.createElement(SolarMenu.ResourceItem, { name: "songs", subMenu: React.createElement(SolarMenu.List, { dense: true, disablePadding: true, sx: { gap: 0 } },
            React.createElement(SolarMenu.Item, { name: "songs.all", label: "All Songs", icon: React.createElement(MusicNote, null), to: "/songs?filter=".concat(encodeURIComponent(JSON.stringify({ filter: {} }))) }),
            React.createElement(ListSubheader, { sx: { marginTop: 1, lineHeight: 'unset', paddingX: 1 } }, "Rock"),
            React.createElement(SolarMenu.Item, { name: "songs.rock", label: "Rock Songs", icon: React.createElement(MusicNote, null), to: "/songs?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'Rock' } }))) }),
            React.createElement(SolarMenu.Item, { name: "songs.folk", label: "Folk Rock Songs", icon: React.createElement(MusicNote, null), to: "/songs?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'Folk Rock' } }))) }),
            React.createElement(SolarMenu.Item, { name: "songs.rock", label: "Pop Rock Songs", icon: React.createElement(MusicNote, null), to: "/songs?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'Pop Rock' } }))) }),
            React.createElement(ListSubheader, { sx: { marginTop: 1, lineHeight: 'unset', paddingX: 1 } }, "Jazz"),
            React.createElement(SolarMenu.Item, { name: "songs.jazz", label: "Jazz songs", icon: React.createElement(MusicNote, null), to: "/songs?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'Jazz' } }))) }),
            React.createElement(SolarMenu.Item, { name: "songs.rb", label: "RB Songs", icon: React.createElement(MusicNote, null), to: "/songs?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'RB' } }))) })) }),
    React.createElement(SolarMenu.ResourceItem, { name: "artists", subMenu: React.createElement(SolarMenu.List, { dense: true, disablePadding: true, sx: { gap: 0 } },
            React.createElement(SolarMenu.Item, { name: "artists.all", label: "All Artists", icon: React.createElement(People, null), to: "/artists?filter=".concat(encodeURIComponent(JSON.stringify({ filter: {} }))) }),
            React.createElement(ListSubheader, { sx: { marginTop: 1, lineHeight: 'unset', paddingX: 1 } }, "Rock"),
            React.createElement(SolarMenu.Item, { name: "artists.folk", label: "Folk Rock Artists", icon: React.createElement(People, null), to: "/artists?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'Folk Rock' } }))) }),
            React.createElement(SolarMenu.Item, { name: "artists.rock", label: "Pop Rock Artists", icon: React.createElement(People, null), to: "/artists?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'Pop Rock' } }))) }),
            React.createElement(ListSubheader, { sx: { marginTop: 1, lineHeight: 'unset', paddingX: 1 } }, "Jazz"),
            React.createElement(SolarMenu.Item, { name: "artists.jazz", label: "Jazz artists", icon: React.createElement(People, null), to: "/artists?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'Jazz' } }))) }),
            React.createElement(SolarMenu.Item, { name: "artists.jazz", label: "RB Artists", icon: React.createElement(People, null), to: "/artists?filter=".concat(encodeURIComponent(JSON.stringify({ filter: { type: 'RB' } }))) })) }))); };
var SongList = function () {
    var isSmall = useMediaQuery(function (theme) { return theme.breakpoints.down('sm'); });
    return (React.createElement(List, null, isSmall ? (React.createElement(SimpleListConfigurable, { primaryText: function (record) { return record === null || record === void 0 ? void 0 : record.title; }, secondaryText: function (record) {
            return record === null || record === void 0 ? void 0 : record.released.toLocaleDateString();
        } })) : (React.createElement(DatagridConfigurable, null,
        React.createElement(TextField, { source: "id" }),
        React.createElement(TextField, { source: "title" }),
        React.createElement(DateField, { source: "released" })))));
};
var ArtistList = function () {
    var isSmall = useMediaQuery(function (theme) { return theme.breakpoints.down('sm'); });
    return (React.createElement(List, null, isSmall ? (React.createElement(SimpleListConfigurable, { primaryText: function (record) { return record === null || record === void 0 ? void 0 : record.name; } })) : (React.createElement(DatagridConfigurable, null,
        React.createElement(TextField, { source: "id" }),
        React.createElement(TextField, { source: "name" })))));
};
