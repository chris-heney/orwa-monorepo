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
exports.NestedResources = void 0;
/* eslint-disable @typescript-eslint/explicit-function-return-type */
var react_1 = __importDefault(require("react"));
var material_1 = require("@mui/material");
var LibraryMusic_1 = __importDefault(require("@mui/icons-material/LibraryMusic"));
var Edit_1 = __importDefault(require("@mui/icons-material/Edit"));
var Groups_1 = __importDefault(require("@mui/icons-material/Groups"));
var Person_1 = __importDefault(require("@mui/icons-material/Person"));
var Label_1 = __importDefault(require("@mui/icons-material/Label"));
var react_admin_1 = require("react-admin");
var react_router_dom_1 = require("react-router-dom");
var Breadcrumb_1 = require("./Breadcrumb");
var dataProvider_1 = require("../../stories/dataProvider");
var app_location_1 = require("../app-location");
exports.default = { title: 'ra-navigation/Breadcrumb/NestedResources' };
var SongsButton = function () {
    var artist = (0, react_admin_1.useRecordContext)();
    return (react_1.default.createElement(material_1.Button, { component: react_router_dom_1.Link, to: "/artists/".concat(artist.id, "/songs"), startIcon: react_1.default.createElement(LibraryMusic_1.default, null) }, "Songs"));
};
var TypeField = function () {
    var artist = (0, react_admin_1.useRecordContext)();
    return (react_1.default.createElement(material_1.Stack, { direction: "row", spacing: 1 }, artist === null || artist === void 0 ? void 0 : artist.type.map(function (type) { return (react_1.default.createElement(material_1.Chip, { key: type, size: "small", label: type })); })));
};
TypeField.defaultProps = {
    label: 'Type',
};
var ArtistList = function () { return (react_1.default.createElement(react_admin_1.List, { filters: [react_1.default.createElement(react_admin_1.SearchInput, { key: "q", source: "q", alwaysOn: true })] },
    react_1.default.createElement(react_admin_1.Datagrid, null,
        react_1.default.createElement(react_admin_1.TextField, { source: "name" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "yearsActive" }),
        react_1.default.createElement(TypeField, null),
        react_1.default.createElement(react_admin_1.EditButton, null),
        react_1.default.createElement(SongsButton, null)))); };
var ArtistEdit = function () { return (react_1.default.createElement(react_admin_1.Edit, null,
    react_1.default.createElement(react_admin_1.SimpleForm, null,
        react_1.default.createElement(react_admin_1.TextInput, { source: "name" }),
        react_1.default.createElement(react_admin_1.TextInput, { source: "yearsActive" }),
        react_1.default.createElement(react_admin_1.TextInput, { source: "bio", multiline: true, fullWidth: true }),
        react_1.default.createElement(SongsButton, null)))); };
var EditSongButton = function () {
    var song = (0, react_admin_1.useRecordContext)();
    return (react_1.default.createElement(material_1.Button, { component: react_router_dom_1.Link, to: "/artists/".concat(song === null || song === void 0 ? void 0 : song.artist_id, "/songs/").concat(song === null || song === void 0 ? void 0 : song.id), startIcon: react_1.default.createElement(Edit_1.default, null) }, "Edit"));
};
var SongListForArtist = function () {
    var id = (0, react_router_dom_1.useParams)().id;
    var record = (0, react_admin_1.useGetOne)('artists', { id: id }).data;
    (0, app_location_1.useDefineAppLocation)('artists.edit.songs', { record: record });
    return (react_1.default.createElement(react_admin_1.List, { resource: "songs", filter: { artist_id: id }, filters: [react_1.default.createElement(react_admin_1.SearchInput, { key: "q", source: "q", alwaysOn: true })] },
        react_1.default.createElement(react_admin_1.Datagrid, null,
            react_1.default.createElement(react_admin_1.TextField, { source: "title" }),
            react_1.default.createElement(react_admin_1.DateField, { source: "released" }),
            react_1.default.createElement(react_admin_1.TextField, { source: "writer" }),
            react_1.default.createElement(react_admin_1.TextField, { source: "producer" }),
            react_1.default.createElement(react_admin_1.TextField, { source: "recordCompany", label: "Label" }),
            react_1.default.createElement(EditSongButton, null))));
};
var SongEditForArtist = function () {
    var _a = (0, react_router_dom_1.useParams)(), id = _a.id, songId = _a.songId;
    var record = (0, react_admin_1.useGetOne)('artists', { id: id }).data;
    var song = (0, react_admin_1.useGetOne)('songs', { id: songId }).data;
    (0, app_location_1.useDefineAppLocation)('artists.edit.songs.edit', { record: record, song: song });
    return (react_1.default.createElement(react_admin_1.Edit, { resource: "songs", id: songId, redirect: "/artists/".concat(id, "/songs") },
        react_1.default.createElement(react_admin_1.SimpleForm, null,
            react_1.default.createElement(react_admin_1.TextInput, { source: "title" }),
            react_1.default.createElement(react_admin_1.DateInput, { source: "released" }),
            react_1.default.createElement(react_admin_1.TextInput, { source: "writer" }),
            react_1.default.createElement(react_admin_1.TextInput, { source: "producer" }),
            react_1.default.createElement(react_admin_1.TextInput, { source: "recordCompany", label: "Label" }))));
};
var BreadcrumbForNestedResources = function () { return (react_1.default.createElement(Breadcrumb_1.Breadcrumb, { sx: { mt: 0.5, mb: -2 } },
    react_1.default.createElement(Breadcrumb_1.Breadcrumb.Item, { name: "artists", label: "Artists", to: "/artists" },
        react_1.default.createElement(Breadcrumb_1.Breadcrumb.Item, { name: "edit", label: function (_a) {
                var record = _a.record;
                return record === null || record === void 0 ? void 0 : record.name;
            }, to: function (_a) {
                var record = _a.record;
                return "/artists/".concat(record === null || record === void 0 ? void 0 : record.id);
            } },
            react_1.default.createElement(Breadcrumb_1.Breadcrumb.Item, { name: "songs", label: "Songs", to: function (_a) {
                    var record = _a.record;
                    return "/artists/".concat(record === null || record === void 0 ? void 0 : record.id, "/songs");
                } },
                react_1.default.createElement(Breadcrumb_1.Breadcrumb.Item, { name: "edit", label: function (_a) {
                        var song = _a.song;
                        return song === null || song === void 0 ? void 0 : song.title;
                    }, to: function (_a) {
                        var song = _a.song;
                        return "/artists/".concat(song === null || song === void 0 ? void 0 : song.artist_id, "/songs/").concat(song === null || song === void 0 ? void 0 : song.id);
                    } }))),
        react_1.default.createElement(Breadcrumb_1.Breadcrumb.Item, { name: "create", label: "Create", to: "/artists/create" })))); };
var LayoutForNestedResources = function (_a) {
    var children = _a.children, rest = __rest(_a, ["children"]);
    return (react_1.default.createElement(app_location_1.AppLocationContext, null,
        react_1.default.createElement(react_admin_1.Layout, __assign({}, rest),
            react_1.default.createElement(BreadcrumbForNestedResources, null),
            children)));
};
var NestedResources = function () { return (react_1.default.createElement(react_admin_1.Admin, { dataProvider: dataProvider_1.dataProvider, layout: LayoutForNestedResources },
    react_1.default.createElement(react_admin_1.Resource, { name: "artists", list: ArtistList, edit: ArtistEdit, recordRepresentation: "name", icon: Groups_1.default },
        react_1.default.createElement(react_router_dom_1.Route, { path: ":id/songs", element: react_1.default.createElement(SongListForArtist, null) }),
        react_1.default.createElement(react_router_dom_1.Route, { path: ":id/songs/:songId", element: react_1.default.createElement(SongEditForArtist, null) })),
    react_1.default.createElement(react_admin_1.Resource, { name: "songs", recordRepresentation: "title" }),
    react_1.default.createElement(react_admin_1.Resource, { name: "producers", list: react_admin_1.ListGuesser, icon: Person_1.default }),
    react_1.default.createElement(react_admin_1.Resource, { name: "labels", list: react_admin_1.ListGuesser, icon: Label_1.default }))); };
exports.NestedResources = NestedResources;
