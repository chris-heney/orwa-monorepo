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
exports.RTL = exports.WithInnerDynamicViews = exports.BasicRestricted = exports.BasicCustomHome = exports.BasicNoHome = exports.DarkMode = exports.Basename = exports.WithFilter = exports.RecordRepresentation = exports.Basic = void 0;
/* eslint-disable @typescript-eslint/explicit-function-return-type */
var react_1 = __importStar(require("react"));
var material_1 = require("@mui/material");
var merge_1 = __importDefault(require("lodash/merge"));
var stylis_plugin_rtl_1 = __importDefault(require("stylis-plugin-rtl"));
var react_2 = require("@emotion/react");
var cache_1 = __importDefault(require("@emotion/cache"));
var react_admin_1 = require("react-admin");
var ra_i18n_polyglot_1 = __importDefault(require("ra-i18n-polyglot"));
var ra_language_english_1 = __importDefault(require("ra-language-english"));
var history_1 = require("history");
var react_router_dom_1 = require("react-router-dom");
var Breadcrumb_1 = require("./Breadcrumb");
var dataProvider_1 = require("../../stories/dataProvider");
var app_location_1 = require("../app-location");
exports.default = { title: 'ra-navigation/Breadcrumb/Basic' };
var i18nProvider = (0, ra_i18n_polyglot_1.default)(function () { return ra_language_english_1.default; });
var MyLayout = function (_a) {
    var children = _a.children, rest = __rest(_a, ["children"]);
    return (react_1.default.createElement(app_location_1.AppLocationContext, null,
        react_1.default.createElement(react_admin_1.Layout, __assign({}, rest),
            react_1.default.createElement(Breadcrumb_1.Breadcrumb, null),
            children)));
};
var MyBreadcrumbWithFilter = function () { return (react_1.default.createElement(Breadcrumb_1.Breadcrumb, { hasDashboard: true },
    react_1.default.createElement(Breadcrumb_1.Breadcrumb.ResourceItems, { resources: ['songs', 'artists'] }),
    react_1.default.createElement(Breadcrumb_1.Breadcrumb.Item, { name: "songs_by_artist.filter", label: function (_a) {
            var artistId = _a.artistId;
            return "Filtered by artist #".concat(artistId);
        } }))); };
var MyLayoutWithFilter = function (_a) {
    var children = _a.children, rest = __rest(_a, ["children"]);
    return (react_1.default.createElement(app_location_1.AppLocationContext, null,
        react_1.default.createElement(react_admin_1.Layout, __assign({}, rest),
            react_1.default.createElement(MyBreadcrumbWithFilter, null),
            children)));
};
var songFilter = [
    react_1.default.createElement(react_admin_1.ReferenceInput, { alwaysOn: true, source: "artist_id", reference: "artists", key: 1 },
        react_1.default.createElement(react_admin_1.SelectInput, { optionText: "name" })),
];
var SongsGrid = function (props) {
    var _a = (0, app_location_1.useAppLocationState)(), setLocation = _a[1];
    var resourceLocation = (0, app_location_1.useResourceAppLocation)();
    var filterValues = (0, react_admin_1.useListContext)().filterValues;
    var effectDeps = JSON.stringify({
        resourceLocation: resourceLocation,
        filter: filterValues,
    });
    (0, react_1.useEffect)(function () {
        var artistId = filterValues.artist_id;
        if (typeof artistId !== 'undefined') {
            setLocation('songs_by_artist.filter', { artistId: artistId });
        }
        else {
            setLocation(null);
        }
        return function () {
            setLocation(null);
        };
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [effectDeps]);
    return (react_1.default.createElement(react_admin_1.Datagrid, __assign({}, props),
        react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "title" }),
        react_1.default.createElement(react_admin_1.ReferenceField, { source: "artist_id", reference: "artists" },
            react_1.default.createElement(react_admin_1.TextField, { source: "name" })),
        react_1.default.createElement(react_admin_1.ShowButton, null),
        react_1.default.createElement(react_admin_1.EditButton, null)));
};
var SongList = function () { return (react_1.default.createElement(react_admin_1.List, null,
    react_1.default.createElement(SongsGrid, null))); };
var SongListWithFilter = function () { return (react_1.default.createElement(react_admin_1.List, { filters: songFilter },
    react_1.default.createElement(SongsGrid, null))); };
var ArtistList = function () { return (react_1.default.createElement(react_admin_1.List, null,
    react_1.default.createElement(react_admin_1.Datagrid, null,
        react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "name" }),
        react_1.default.createElement(react_admin_1.EditButton, null)))); };
var ArtistEdit = function () { return (react_1.default.createElement(react_admin_1.Edit, null,
    react_1.default.createElement(react_admin_1.SimpleForm, null,
        react_1.default.createElement(react_admin_1.TextInput, { source: "name" })))); };
var ArtistCreate = function () { return (react_1.default.createElement(react_admin_1.Create, null,
    react_1.default.createElement(react_admin_1.SimpleForm, null,
        react_1.default.createElement(react_admin_1.TextInput, { source: "name" })))); };
var SongEdit = function () { return (react_1.default.createElement(react_admin_1.Edit, { resource: "songs" },
    react_1.default.createElement(react_admin_1.SimpleForm, null,
        react_1.default.createElement(react_admin_1.TextInput, { source: "title" })))); };
var SongCreate = function () { return (react_1.default.createElement(react_admin_1.Create, { resource: "songs" },
    react_1.default.createElement(react_admin_1.SimpleForm, null,
        react_1.default.createElement(react_admin_1.TextInput, { source: "title" })))); };
var SongShow = function () { return (react_1.default.createElement(react_admin_1.Show, { resource: "songs" },
    react_1.default.createElement(react_admin_1.SimpleShowLayout, null,
        react_1.default.createElement(react_admin_1.TextField, { source: "title" })))); };
var Dashboard = function () { return (react_1.default.createElement(material_1.Card, null,
    react_1.default.createElement(material_1.CardContent, null,
        react_1.default.createElement(material_1.Typography, { variant: "h4" }, "Here is Homepage"),
        react_1.default.createElement(material_1.Typography, null, "No breadcrumb is displayed in Home")))); };
var Basic = function () { return (react_1.default.createElement(react_router_dom_1.HashRouter, null,
    react_1.default.createElement(react_admin_1.Admin, { dataProvider: dataProvider_1.dataProvider, i18nProvider: i18nProvider, layout: MyLayout, dashboard: Dashboard },
        react_1.default.createElement(react_admin_1.Resource, { name: "songs", list: SongList, edit: SongEdit, create: SongCreate, show: SongShow }),
        react_1.default.createElement(react_admin_1.Resource, { name: "artists", options: { label: 'Artists' }, list: ArtistList, edit: ArtistEdit, create: ArtistCreate })))); };
exports.Basic = Basic;
var RecordRepresentation = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.dataProvider, i18nProvider: i18nProvider, layout: MyLayout, dashboard: Dashboard },
    react_1.default.createElement(react_admin_1.Resource, { name: "songs", list: SongList, edit: SongEdit, create: SongCreate, show: SongShow, recordRepresentation: function (record) { return "Song \"".concat(record.title, "\""); } }),
    react_1.default.createElement(react_admin_1.Resource, { name: "artists", options: { label: 'Artists' }, list: ArtistList, edit: ArtistEdit, recordRepresentation: "name" }))); };
exports.RecordRepresentation = RecordRepresentation;
var WithFilter = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.dataProvider, i18nProvider: i18nProvider, layout: MyLayoutWithFilter, dashboard: Dashboard },
    react_1.default.createElement(react_admin_1.Resource, { name: "songs", list: SongListWithFilter, edit: SongEdit, create: SongCreate, show: SongShow }),
    react_1.default.createElement(react_admin_1.Resource, { name: "artists", options: { label: 'Artists' }, list: ArtistList, edit: ArtistEdit }))); };
exports.WithFilter = WithFilter;
var Basename = function () { return (react_1.default.createElement(react_router_dom_1.MemoryRouter, null,
    react_1.default.createElement(react_router_dom_1.Routes, null,
        react_1.default.createElement(react_router_dom_1.Route, { path: "/", element: react_1.default.createElement("div", null,
                react_1.default.createElement(material_1.Typography, { variant: "h4" }, "Homepage"),
                react_1.default.createElement(react_router_dom_1.Link, { to: "/acme" }, "Admin")) }),
        react_1.default.createElement(react_router_dom_1.Route, { path: "/acme/*", element: react_1.default.createElement(react_admin_1.Admin, { dataProvider: dataProvider_1.dataProvider, i18nProvider: i18nProvider, layout: MyLayoutWithFilter, dashboard: Dashboard, basename: "/acme" },
                react_1.default.createElement(react_admin_1.Resource, { name: "songs", list: SongListWithFilter, edit: SongEdit, create: SongCreate, show: SongShow }),
                react_1.default.createElement(react_admin_1.Resource, { name: "artists", options: { label: 'Artists' }, list: ArtistList, edit: ArtistEdit })) })))); };
exports.Basename = Basename;
var DarkMode = function () {
    var darkTheme = (0, merge_1.default)({}, react_admin_1.defaultTheme, {
        palette: {
            mode: 'dark',
            background: {
                default: '#121212',
                paper: '#121212',
            },
        },
    });
    return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.dataProvider, i18nProvider: i18nProvider, layout: MyLayoutWithFilter, dashboard: Dashboard, theme: darkTheme },
        react_1.default.createElement(react_admin_1.Resource, { name: "songs", list: SongListWithFilter, edit: SongEdit, create: SongCreate, show: SongShow }),
        react_1.default.createElement(react_admin_1.Resource, { name: "artists", options: { label: 'Artists' }, list: ArtistList, edit: ArtistEdit })));
};
exports.DarkMode = DarkMode;
var MyBreadcrumbNoHome = function () { return (react_1.default.createElement(Breadcrumb_1.Breadcrumb, null,
    react_1.default.createElement(Breadcrumb_1.Breadcrumb.ResourceItems, { resources: ['songs', 'artists'] }),
    react_1.default.createElement(Breadcrumb_1.Breadcrumb.Item, { name: "songs_by_artist.filter", label: function (_a) {
            var artistId = _a.artistId;
            return "Filtered by artist #".concat(artistId);
        } }))); };
var MyLayoutNoHome = function (_a) {
    var children = _a.children, rest = __rest(_a, ["children"]);
    return (react_1.default.createElement(app_location_1.AppLocationContext, null,
        react_1.default.createElement(react_admin_1.Layout, __assign({}, rest),
            react_1.default.createElement(MyBreadcrumbNoHome, null),
            children)));
};
var BasicNoHome = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.dataProvider, layout: MyLayoutNoHome },
    react_1.default.createElement(react_admin_1.Resource, { name: "songs", list: SongListWithFilter, edit: SongEdit, create: SongCreate, show: SongShow }),
    react_1.default.createElement(react_admin_1.Resource, { name: "artists", list: ArtistList, edit: ArtistEdit }))); };
exports.BasicNoHome = BasicNoHome;
var MyBreadcrumbCustomHome = function () { return (react_1.default.createElement(Breadcrumb_1.Breadcrumb, { sx: {
        '& ul': {
            padding: 1,
            paddingLeft: 0,
        },
        '& ul:empty': {
            padding: 0,
        },
    } },
    react_1.default.createElement(Breadcrumb_1.Breadcrumb.Item, { name: "dashboard", label: "My Home" },
        react_1.default.createElement(Breadcrumb_1.Breadcrumb.ResourceItems, { resources: ['songs', 'artists'] }),
        react_1.default.createElement(Breadcrumb_1.Breadcrumb.Item, { name: "songs_by_artist.filter", label: function (_a) {
                var artistId = _a.artistId;
                return "Filtered by artist #".concat(artistId);
            } })))); };
var MyLayoutCustomHome = function (_a) {
    var children = _a.children, rest = __rest(_a, ["children"]);
    return (react_1.default.createElement(app_location_1.AppLocationContext, null,
        react_1.default.createElement(react_admin_1.Layout, __assign({}, rest),
            react_1.default.createElement(MyBreadcrumbCustomHome, null),
            children)));
};
var BasicCustomHome = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.dataProvider, layout: MyLayoutCustomHome },
    react_1.default.createElement(react_admin_1.Resource, { name: "songs", list: SongListWithFilter, edit: SongEdit, create: SongCreate, show: SongShow }),
    react_1.default.createElement(react_admin_1.Resource, { name: "artists", list: ArtistList, edit: ArtistEdit }))); };
exports.BasicCustomHome = BasicCustomHome;
var RestrictedBreadcrumb = function () {
    var location = (0, app_location_1.useAppLocationState)()[0];
    if (!location.path || location.path.startsWith('artists'))
        return null;
    return (react_1.default.createElement(Breadcrumb_1.Breadcrumb, null,
        react_1.default.createElement(Breadcrumb_1.Breadcrumb.ResourceItems, { resources: ['songs'] }),
        react_1.default.createElement(Breadcrumb_1.Breadcrumb.Item, { name: "songs_by_artist.filter", label: function (_a) {
                var artistId = _a.artistId;
                return "Filtered by artist #".concat(artistId);
            } })));
};
var MyLayoutRestrictedBreadcrumb = function (_a) {
    var children = _a.children, rest = __rest(_a, ["children"]);
    return (react_1.default.createElement(app_location_1.AppLocationContext, null,
        react_1.default.createElement(react_admin_1.Layout, __assign({}, rest),
            react_1.default.createElement(RestrictedBreadcrumb, null),
            children)));
};
var BasicRestricted = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.dataProvider, layout: MyLayoutRestrictedBreadcrumb, dashboard: Dashboard },
    react_1.default.createElement(react_admin_1.Resource, { name: "songs", list: SongListWithFilter, edit: SongEdit, create: SongCreate, show: SongShow }),
    react_1.default.createElement(react_admin_1.Resource, { name: "artists", options: { label: 'Artists (no breadcrumb)' }, list: ArtistList, edit: ArtistEdit }))); };
exports.BasicRestricted = BasicRestricted;
var SongListAside = function () { return (react_1.default.createElement(react_router_dom_1.Routes, null,
    react_1.default.createElement(react_router_dom_1.Route, { path: "create", element: react_1.default.createElement(SongCreate, null) }),
    react_1.default.createElement(react_router_dom_1.Route, { path: ":id/show", element: react_1.default.createElement(SongShow, null) }),
    react_1.default.createElement(react_router_dom_1.Route, { path: ":id", element: react_1.default.createElement(SongEdit, null) }))); };
var SongListWithAside = function () { return (react_1.default.createElement(react_admin_1.List, { filters: songFilter, aside: react_1.default.createElement(SongListAside, null), hasCreate: true },
    react_1.default.createElement(SongsGrid, null))); };
var WithInnerDynamicViews = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.dataProvider, layout: MyLayoutWithFilter, dashboard: Dashboard },
    react_1.default.createElement(react_admin_1.Resource, { name: "songs", list: SongListWithAside }),
    react_1.default.createElement(react_admin_1.Resource, { name: "artists", options: { label: 'Artists' }, list: ArtistList, edit: ArtistEdit }))); };
exports.WithInnerDynamicViews = WithInnerDynamicViews;
var rtlTheme = __assign(__assign({}, react_admin_1.defaultTheme), { direction: 'rtl' });
// Create rtl cache
var cacheRtl = (0, cache_1.default)({
    key: 'muirtl',
    stylisPlugins: [stylis_plugin_rtl_1.default],
});
var RTL = function () {
    (0, react_1.useEffect)(function () {
        document.body.dir = 'rtl';
        return function () {
            document.body.dir = 'ltr';
        };
    });
    return (react_1.default.createElement(react_2.CacheProvider, { value: cacheRtl },
        react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.dataProvider, i18nProvider: i18nProvider, layout: MyLayoutWithFilter, dashboard: Dashboard, theme: rtlTheme },
            react_1.default.createElement(react_admin_1.Resource, { name: "songs", list: SongListWithFilter, edit: SongEdit, create: SongCreate, show: SongShow }),
            react_1.default.createElement(react_admin_1.Resource, { name: "artists", options: { label: 'Artists' }, list: ArtistList, edit: ArtistEdit }))));
};
exports.RTL = RTL;
