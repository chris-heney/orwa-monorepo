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
import React from 'react';
import { Button, Stack, Chip } from '@mui/material';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import EditIcon from '@mui/icons-material/Edit';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import LabelIcon from '@mui/icons-material/Label';
import { Admin, Resource, List, Edit, SimpleForm, TextField, TextInput, Layout, Datagrid, EditButton, useRecordContext, useGetOne, DateField, SearchInput, DateInput, ListGuesser, } from 'react-admin';
import { Route, Link, useParams } from 'react-router-dom';
import { Breadcrumb } from './Breadcrumb';
import { dataProvider } from '../../stories/dataProvider';
import { AppLocationContext, useDefineAppLocation } from '../app-location';
export default { title: 'ra-navigation/Breadcrumb/NestedResources' };
var SongsButton = function () {
    var artist = useRecordContext();
    return (React.createElement(Button, { component: Link, to: "/artists/".concat(artist.id, "/songs"), startIcon: React.createElement(LibraryMusicIcon, null) }, "Songs"));
};
var TypeField = function () {
    var artist = useRecordContext();
    return (React.createElement(Stack, { direction: "row", spacing: 1 }, artist === null || artist === void 0 ? void 0 : artist.type.map(function (type) { return (React.createElement(Chip, { key: type, size: "small", label: type })); })));
};
TypeField.defaultProps = {
    label: 'Type',
};
var ArtistList = function () { return (React.createElement(List, { filters: [React.createElement(SearchInput, { key: "q", source: "q", alwaysOn: true })] },
    React.createElement(Datagrid, null,
        React.createElement(TextField, { source: "name" }),
        React.createElement(TextField, { source: "yearsActive" }),
        React.createElement(TypeField, null),
        React.createElement(EditButton, null),
        React.createElement(SongsButton, null)))); };
var ArtistEdit = function () { return (React.createElement(Edit, null,
    React.createElement(SimpleForm, null,
        React.createElement(TextInput, { source: "name" }),
        React.createElement(TextInput, { source: "yearsActive" }),
        React.createElement(TextInput, { source: "bio", multiline: true, fullWidth: true }),
        React.createElement(SongsButton, null)))); };
var EditSongButton = function () {
    var song = useRecordContext();
    return (React.createElement(Button, { component: Link, to: "/artists/".concat(song === null || song === void 0 ? void 0 : song.artist_id, "/songs/").concat(song === null || song === void 0 ? void 0 : song.id), startIcon: React.createElement(EditIcon, null) }, "Edit"));
};
var SongListForArtist = function () {
    var id = useParams().id;
    var record = useGetOne('artists', { id: id }).data;
    useDefineAppLocation('artists.edit.songs', { record: record });
    return (React.createElement(List, { resource: "songs", filter: { artist_id: id }, filters: [React.createElement(SearchInput, { key: "q", source: "q", alwaysOn: true })] },
        React.createElement(Datagrid, null,
            React.createElement(TextField, { source: "title" }),
            React.createElement(DateField, { source: "released" }),
            React.createElement(TextField, { source: "writer" }),
            React.createElement(TextField, { source: "producer" }),
            React.createElement(TextField, { source: "recordCompany", label: "Label" }),
            React.createElement(EditSongButton, null))));
};
var SongEditForArtist = function () {
    var _a = useParams(), id = _a.id, songId = _a.songId;
    var record = useGetOne('artists', { id: id }).data;
    var song = useGetOne('songs', { id: songId }).data;
    useDefineAppLocation('artists.edit.songs.edit', { record: record, song: song });
    return (React.createElement(Edit, { resource: "songs", id: songId, redirect: "/artists/".concat(id, "/songs") },
        React.createElement(SimpleForm, null,
            React.createElement(TextInput, { source: "title" }),
            React.createElement(DateInput, { source: "released" }),
            React.createElement(TextInput, { source: "writer" }),
            React.createElement(TextInput, { source: "producer" }),
            React.createElement(TextInput, { source: "recordCompany", label: "Label" }))));
};
var BreadcrumbForNestedResources = function () { return (React.createElement(Breadcrumb, { sx: { mt: 0.5, mb: -2 } },
    React.createElement(Breadcrumb.Item, { name: "artists", label: "Artists", to: "/artists" },
        React.createElement(Breadcrumb.Item, { name: "edit", label: function (_a) {
                var record = _a.record;
                return record === null || record === void 0 ? void 0 : record.name;
            }, to: function (_a) {
                var record = _a.record;
                return "/artists/".concat(record === null || record === void 0 ? void 0 : record.id);
            } },
            React.createElement(Breadcrumb.Item, { name: "songs", label: "Songs", to: function (_a) {
                    var record = _a.record;
                    return "/artists/".concat(record === null || record === void 0 ? void 0 : record.id, "/songs");
                } },
                React.createElement(Breadcrumb.Item, { name: "edit", label: function (_a) {
                        var song = _a.song;
                        return song === null || song === void 0 ? void 0 : song.title;
                    }, to: function (_a) {
                        var song = _a.song;
                        return "/artists/".concat(song === null || song === void 0 ? void 0 : song.artist_id, "/songs/").concat(song === null || song === void 0 ? void 0 : song.id);
                    } }))),
        React.createElement(Breadcrumb.Item, { name: "create", label: "Create", to: "/artists/create" })))); };
var LayoutForNestedResources = function (_a) {
    var children = _a.children, rest = __rest(_a, ["children"]);
    return (React.createElement(AppLocationContext, null,
        React.createElement(Layout, __assign({}, rest),
            React.createElement(BreadcrumbForNestedResources, null),
            children)));
};
export var NestedResources = function () { return (React.createElement(Admin, { dataProvider: dataProvider, layout: LayoutForNestedResources },
    React.createElement(Resource, { name: "artists", list: ArtistList, edit: ArtistEdit, recordRepresentation: "name", icon: GroupsIcon },
        React.createElement(Route, { path: ":id/songs", element: React.createElement(SongListForArtist, null) }),
        React.createElement(Route, { path: ":id/songs/:songId", element: React.createElement(SongEditForArtist, null) })),
    React.createElement(Resource, { name: "songs", recordRepresentation: "title" }),
    React.createElement(Resource, { name: "producers", list: ListGuesser, icon: PersonIcon }),
    React.createElement(Resource, { name: "labels", list: ListGuesser, icon: LabelIcon }))); };
