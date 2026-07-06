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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grouped = exports.Basic = void 0;
/* eslint-disable @typescript-eslint/explicit-function-return-type */
var react_1 = __importDefault(require("react"));
var react_admin_1 = require("react-admin");
var react_router_dom_1 = require("react-router-dom");
var app_location_1 = require("../app-location");
var Breadcrumb_1 = require("./Breadcrumb");
var dataProvider_1 = require("../../stories/dataProvider");
exports.default = {
    title: 'ra-navigation/Breadcrumb.ResourceItem',
    decorators: [
        function (Story) { return (react_1.default.createElement(react_router_dom_1.MemoryRouter, null,
            react_1.default.createElement(Story, null))); },
    ],
};
var BreadcrumbForResources = function () { return (react_1.default.createElement(Breadcrumb_1.Breadcrumb, null,
    react_1.default.createElement(Breadcrumb_1.Breadcrumb.ResourceItem, { resource: "songs" }),
    react_1.default.createElement(Breadcrumb_1.Breadcrumb.ResourceItem, { resource: "artists" }))); };
var LayoutForResources = function (_a) {
    var children = _a.children, rest = __rest(_a, ["children"]);
    return (react_1.default.createElement(app_location_1.AppLocationContext, null,
        react_1.default.createElement(react_admin_1.Layout, __assign({}, rest),
            react_1.default.createElement(BreadcrumbForResources, null),
            children)));
};
var Basic = function () { return (react_1.default.createElement(react_admin_1.Admin, { dataProvider: dataProvider_1.dataProvider, layout: LayoutForResources },
    react_1.default.createElement(react_admin_1.Resource, { name: "songs", list: react_admin_1.ListGuesser, edit: react_admin_1.EditGuesser, recordRepresentation: "title" }),
    react_1.default.createElement(react_admin_1.Resource, { name: "artists", list: react_admin_1.ListGuesser, edit: react_admin_1.EditGuesser, recordRepresentation: "name" }))); };
exports.Basic = Basic;
var BreadcrumbForGroupedResources = function () { return (react_1.default.createElement(Breadcrumb_1.Breadcrumb, null,
    react_1.default.createElement(Breadcrumb_1.Breadcrumb.Item, { name: "music", label: "Music" },
        react_1.default.createElement(Breadcrumb_1.Breadcrumb.ResourceItem, { resource: "songs" }),
        react_1.default.createElement(Breadcrumb_1.Breadcrumb.ResourceItem, { resource: "artists" })))); };
var LayoutForGroupedResources = function (_a) {
    var children = _a.children, rest = __rest(_a, ["children"]);
    return (react_1.default.createElement(app_location_1.AppLocationContext, null,
        react_1.default.createElement(react_admin_1.Layout, __assign({}, rest),
            react_1.default.createElement(BreadcrumbForGroupedResources, null),
            children)));
};
var Grouped = function () { return (react_1.default.createElement(react_admin_1.Admin, { dataProvider: dataProvider_1.dataProvider, layout: LayoutForGroupedResources },
    react_1.default.createElement(react_admin_1.Resource, { name: "songs", list: SongList, edit: SongEdit, show: SongShow, create: SongCreate, recordRepresentation: "title" }),
    react_1.default.createElement(react_admin_1.Resource, { name: "artists", list: ArtistList, edit: ArtistEdit, show: ArtistShow, create: ArtistCreate, recordRepresentation: "name" }))); };
exports.Grouped = Grouped;
var SongList = function () {
    (0, app_location_1.useDefineAppLocation)('music.songs');
    return (react_1.default.createElement(react_admin_1.List, null,
        react_1.default.createElement(react_admin_1.Datagrid, { rowClick: "edit" },
            react_1.default.createElement(react_admin_1.TextField, { source: "title" }))));
};
var SongEditAppLocation = function () {
    var record = (0, react_admin_1.useRecordContext)();
    (0, app_location_1.useDefineAppLocation)('music.songs.edit', { record: record });
    return null;
};
var SongEdit = function () { return (react_1.default.createElement(react_admin_1.Edit, null,
    react_1.default.createElement(SongEditAppLocation, null),
    react_1.default.createElement(react_admin_1.SimpleForm, null,
        react_1.default.createElement(react_admin_1.TextInput, { source: "title" })))); };
var SongShowAppLocation = function () {
    var record = (0, react_admin_1.useRecordContext)();
    (0, app_location_1.useDefineAppLocation)('music.songs.show', { record: record });
    return null;
};
var SongShow = function () { return (react_1.default.createElement(react_admin_1.Show, null,
    react_1.default.createElement(SongShowAppLocation, null),
    react_1.default.createElement(react_admin_1.SimpleShowLayout, null,
        react_1.default.createElement(react_admin_1.TextField, { source: "title" })))); };
var SongCreate = function () {
    (0, app_location_1.useDefineAppLocation)('music.songs.create');
    return (react_1.default.createElement(react_admin_1.Create, null,
        react_1.default.createElement(react_admin_1.SimpleForm, null,
            react_1.default.createElement(react_admin_1.TextInput, { source: "title" }))));
};
var ArtistList = function () {
    (0, app_location_1.useDefineAppLocation)('music.artists');
    return (react_1.default.createElement(react_admin_1.List, null,
        react_1.default.createElement(react_admin_1.Datagrid, { rowClick: "edit" },
            react_1.default.createElement(react_admin_1.TextField, { source: "name" }))));
};
var ArtistEditAppLocation = function () {
    var record = (0, react_admin_1.useRecordContext)();
    (0, app_location_1.useDefineAppLocation)('music.artists.edit', { record: record });
    return null;
};
var ArtistEdit = function () { return (react_1.default.createElement(react_admin_1.Edit, null,
    react_1.default.createElement(ArtistEditAppLocation, null),
    react_1.default.createElement(react_admin_1.SimpleForm, null,
        react_1.default.createElement(react_admin_1.TextInput, { source: "name" })))); };
var ArtistShowAppLocation = function () {
    var record = (0, react_admin_1.useRecordContext)();
    (0, app_location_1.useDefineAppLocation)('music.artists.show', { record: record });
    return null;
};
var ArtistShow = function () { return (react_1.default.createElement(react_admin_1.Show, null,
    react_1.default.createElement(ArtistShowAppLocation, null),
    react_1.default.createElement(react_admin_1.SimpleShowLayout, null,
        react_1.default.createElement(react_admin_1.TextField, { source: "name" })))); };
var ArtistCreate = function () {
    (0, app_location_1.useDefineAppLocation)('music.artists.create');
    return (react_1.default.createElement(react_admin_1.Create, null,
        react_1.default.createElement(react_admin_1.SimpleForm, null,
            react_1.default.createElement(react_admin_1.TextInput, { source: "name" }))));
};
