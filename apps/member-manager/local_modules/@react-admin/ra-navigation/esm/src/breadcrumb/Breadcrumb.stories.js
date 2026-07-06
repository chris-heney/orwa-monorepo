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
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect } from 'react';
import { Typography, Card, CardContent } from '@mui/material';
import merge from 'lodash/merge';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { Admin, Resource, List, Edit, Create, SimpleForm, Show, SimpleShowLayout, TextField, TextInput, Layout, Datagrid, ShowButton, EditButton, ReferenceField, ReferenceInput, SelectInput, defaultTheme, useListContext, } from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { createMemoryHistory } from 'history';
import { Route, Routes, MemoryRouter, Link, HashRouter, } from 'react-router-dom';
import { Breadcrumb } from './Breadcrumb';
import { dataProvider } from '../../stories/dataProvider';
import { AppLocationContext, useAppLocationState, useResourceAppLocation, } from '../app-location';
export default { title: 'ra-navigation/Breadcrumb/Basic' };
var i18nProvider = polyglotI18nProvider(function () { return englishMessages; });
var MyLayout = function (_a) {
    var children = _a.children, rest = __rest(_a, ["children"]);
    return (React.createElement(AppLocationContext, null,
        React.createElement(Layout, __assign({}, rest),
            React.createElement(Breadcrumb, null),
            children)));
};
var MyBreadcrumbWithFilter = function () { return (React.createElement(Breadcrumb, { hasDashboard: true },
    React.createElement(Breadcrumb.ResourceItems, { resources: ['songs', 'artists'] }),
    React.createElement(Breadcrumb.Item, { name: "songs_by_artist.filter", label: function (_a) {
            var artistId = _a.artistId;
            return "Filtered by artist #".concat(artistId);
        } }))); };
var MyLayoutWithFilter = function (_a) {
    var children = _a.children, rest = __rest(_a, ["children"]);
    return (React.createElement(AppLocationContext, null,
        React.createElement(Layout, __assign({}, rest),
            React.createElement(MyBreadcrumbWithFilter, null),
            children)));
};
var songFilter = [
    React.createElement(ReferenceInput, { alwaysOn: true, source: "artist_id", reference: "artists", key: 1 },
        React.createElement(SelectInput, { optionText: "name" })),
];
var SongsGrid = function (props) {
    var _a = useAppLocationState(), setLocation = _a[1];
    var resourceLocation = useResourceAppLocation();
    var filterValues = useListContext().filterValues;
    var effectDeps = JSON.stringify({
        resourceLocation: resourceLocation,
        filter: filterValues,
    });
    useEffect(function () {
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
    return (React.createElement(Datagrid, __assign({}, props),
        React.createElement(TextField, { source: "id" }),
        React.createElement(TextField, { source: "title" }),
        React.createElement(ReferenceField, { source: "artist_id", reference: "artists" },
            React.createElement(TextField, { source: "name" })),
        React.createElement(ShowButton, null),
        React.createElement(EditButton, null)));
};
var SongList = function () { return (React.createElement(List, null,
    React.createElement(SongsGrid, null))); };
var SongListWithFilter = function () { return (React.createElement(List, { filters: songFilter },
    React.createElement(SongsGrid, null))); };
var ArtistList = function () { return (React.createElement(List, null,
    React.createElement(Datagrid, null,
        React.createElement(TextField, { source: "id" }),
        React.createElement(TextField, { source: "name" }),
        React.createElement(EditButton, null)))); };
var ArtistEdit = function () { return (React.createElement(Edit, null,
    React.createElement(SimpleForm, null,
        React.createElement(TextInput, { source: "name" })))); };
var ArtistCreate = function () { return (React.createElement(Create, null,
    React.createElement(SimpleForm, null,
        React.createElement(TextInput, { source: "name" })))); };
var SongEdit = function () { return (React.createElement(Edit, { resource: "songs" },
    React.createElement(SimpleForm, null,
        React.createElement(TextInput, { source: "title" })))); };
var SongCreate = function () { return (React.createElement(Create, { resource: "songs" },
    React.createElement(SimpleForm, null,
        React.createElement(TextInput, { source: "title" })))); };
var SongShow = function () { return (React.createElement(Show, { resource: "songs" },
    React.createElement(SimpleShowLayout, null,
        React.createElement(TextField, { source: "title" })))); };
var Dashboard = function () { return (React.createElement(Card, null,
    React.createElement(CardContent, null,
        React.createElement(Typography, { variant: "h4" }, "Here is Homepage"),
        React.createElement(Typography, null, "No breadcrumb is displayed in Home")))); };
export var Basic = function () { return (React.createElement(HashRouter, null,
    React.createElement(Admin, { dataProvider: dataProvider, i18nProvider: i18nProvider, layout: MyLayout, dashboard: Dashboard },
        React.createElement(Resource, { name: "songs", list: SongList, edit: SongEdit, create: SongCreate, show: SongShow }),
        React.createElement(Resource, { name: "artists", options: { label: 'Artists' }, list: ArtistList, edit: ArtistEdit, create: ArtistCreate })))); };
export var RecordRepresentation = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider, i18nProvider: i18nProvider, layout: MyLayout, dashboard: Dashboard },
    React.createElement(Resource, { name: "songs", list: SongList, edit: SongEdit, create: SongCreate, show: SongShow, recordRepresentation: function (record) { return "Song \"".concat(record.title, "\""); } }),
    React.createElement(Resource, { name: "artists", options: { label: 'Artists' }, list: ArtistList, edit: ArtistEdit, recordRepresentation: "name" }))); };
export var WithFilter = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider, i18nProvider: i18nProvider, layout: MyLayoutWithFilter, dashboard: Dashboard },
    React.createElement(Resource, { name: "songs", list: SongListWithFilter, edit: SongEdit, create: SongCreate, show: SongShow }),
    React.createElement(Resource, { name: "artists", options: { label: 'Artists' }, list: ArtistList, edit: ArtistEdit }))); };
export var Basename = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Routes, null,
        React.createElement(Route, { path: "/", element: React.createElement("div", null,
                React.createElement(Typography, { variant: "h4" }, "Homepage"),
                React.createElement(Link, { to: "/acme" }, "Admin")) }),
        React.createElement(Route, { path: "/acme/*", element: React.createElement(Admin, { dataProvider: dataProvider, i18nProvider: i18nProvider, layout: MyLayoutWithFilter, dashboard: Dashboard, basename: "/acme" },
                React.createElement(Resource, { name: "songs", list: SongListWithFilter, edit: SongEdit, create: SongCreate, show: SongShow }),
                React.createElement(Resource, { name: "artists", options: { label: 'Artists' }, list: ArtistList, edit: ArtistEdit })) })))); };
export var DarkMode = function () {
    var darkTheme = merge({}, defaultTheme, {
        palette: {
            mode: 'dark',
            background: {
                default: '#121212',
                paper: '#121212',
            },
        },
    });
    return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider, i18nProvider: i18nProvider, layout: MyLayoutWithFilter, dashboard: Dashboard, theme: darkTheme },
        React.createElement(Resource, { name: "songs", list: SongListWithFilter, edit: SongEdit, create: SongCreate, show: SongShow }),
        React.createElement(Resource, { name: "artists", options: { label: 'Artists' }, list: ArtistList, edit: ArtistEdit })));
};
var MyBreadcrumbNoHome = function () { return (React.createElement(Breadcrumb, null,
    React.createElement(Breadcrumb.ResourceItems, { resources: ['songs', 'artists'] }),
    React.createElement(Breadcrumb.Item, { name: "songs_by_artist.filter", label: function (_a) {
            var artistId = _a.artistId;
            return "Filtered by artist #".concat(artistId);
        } }))); };
var MyLayoutNoHome = function (_a) {
    var children = _a.children, rest = __rest(_a, ["children"]);
    return (React.createElement(AppLocationContext, null,
        React.createElement(Layout, __assign({}, rest),
            React.createElement(MyBreadcrumbNoHome, null),
            children)));
};
export var BasicNoHome = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider, layout: MyLayoutNoHome },
    React.createElement(Resource, { name: "songs", list: SongListWithFilter, edit: SongEdit, create: SongCreate, show: SongShow }),
    React.createElement(Resource, { name: "artists", list: ArtistList, edit: ArtistEdit }))); };
var MyBreadcrumbCustomHome = function () { return (React.createElement(Breadcrumb, { sx: {
        '& ul': {
            padding: 1,
            paddingLeft: 0,
        },
        '& ul:empty': {
            padding: 0,
        },
    } },
    React.createElement(Breadcrumb.Item, { name: "dashboard", label: "My Home" },
        React.createElement(Breadcrumb.ResourceItems, { resources: ['songs', 'artists'] }),
        React.createElement(Breadcrumb.Item, { name: "songs_by_artist.filter", label: function (_a) {
                var artistId = _a.artistId;
                return "Filtered by artist #".concat(artistId);
            } })))); };
var MyLayoutCustomHome = function (_a) {
    var children = _a.children, rest = __rest(_a, ["children"]);
    return (React.createElement(AppLocationContext, null,
        React.createElement(Layout, __assign({}, rest),
            React.createElement(MyBreadcrumbCustomHome, null),
            children)));
};
export var BasicCustomHome = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider, layout: MyLayoutCustomHome },
    React.createElement(Resource, { name: "songs", list: SongListWithFilter, edit: SongEdit, create: SongCreate, show: SongShow }),
    React.createElement(Resource, { name: "artists", list: ArtistList, edit: ArtistEdit }))); };
var RestrictedBreadcrumb = function () {
    var location = useAppLocationState()[0];
    if (!location.path || location.path.startsWith('artists'))
        return null;
    return (React.createElement(Breadcrumb, null,
        React.createElement(Breadcrumb.ResourceItems, { resources: ['songs'] }),
        React.createElement(Breadcrumb.Item, { name: "songs_by_artist.filter", label: function (_a) {
                var artistId = _a.artistId;
                return "Filtered by artist #".concat(artistId);
            } })));
};
var MyLayoutRestrictedBreadcrumb = function (_a) {
    var children = _a.children, rest = __rest(_a, ["children"]);
    return (React.createElement(AppLocationContext, null,
        React.createElement(Layout, __assign({}, rest),
            React.createElement(RestrictedBreadcrumb, null),
            children)));
};
export var BasicRestricted = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider, layout: MyLayoutRestrictedBreadcrumb, dashboard: Dashboard },
    React.createElement(Resource, { name: "songs", list: SongListWithFilter, edit: SongEdit, create: SongCreate, show: SongShow }),
    React.createElement(Resource, { name: "artists", options: { label: 'Artists (no breadcrumb)' }, list: ArtistList, edit: ArtistEdit }))); };
var SongListAside = function () { return (React.createElement(Routes, null,
    React.createElement(Route, { path: "create", element: React.createElement(SongCreate, null) }),
    React.createElement(Route, { path: ":id/show", element: React.createElement(SongShow, null) }),
    React.createElement(Route, { path: ":id", element: React.createElement(SongEdit, null) }))); };
var SongListWithAside = function () { return (React.createElement(List, { filters: songFilter, aside: React.createElement(SongListAside, null), hasCreate: true },
    React.createElement(SongsGrid, null))); };
export var WithInnerDynamicViews = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider, layout: MyLayoutWithFilter, dashboard: Dashboard },
    React.createElement(Resource, { name: "songs", list: SongListWithAside }),
    React.createElement(Resource, { name: "artists", options: { label: 'Artists' }, list: ArtistList, edit: ArtistEdit }))); };
var rtlTheme = __assign(__assign({}, defaultTheme), { direction: 'rtl' });
// Create rtl cache
var cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [rtlPlugin],
});
export var RTL = function () {
    useEffect(function () {
        document.body.dir = 'rtl';
        return function () {
            document.body.dir = 'ltr';
        };
    });
    return (React.createElement(CacheProvider, { value: cacheRtl },
        React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider, i18nProvider: i18nProvider, layout: MyLayoutWithFilter, dashboard: Dashboard, theme: rtlTheme },
            React.createElement(Resource, { name: "songs", list: SongListWithFilter, edit: SongEdit, create: SongCreate, show: SongShow }),
            React.createElement(Resource, { name: "artists", options: { label: 'Artists' }, list: ArtistList, edit: ArtistEdit }))));
};
