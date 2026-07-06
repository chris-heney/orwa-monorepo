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
import { Admin, Create, Datagrid, Edit, EditGuesser, Layout, List, ListGuesser, Resource, Show, SimpleForm, SimpleShowLayout, TextField, TextInput, useRecordContext, } from 'react-admin';
import { MemoryRouter } from 'react-router-dom';
import { AppLocationContext, useDefineAppLocation } from '../app-location';
import { Breadcrumb } from './Breadcrumb';
import { dataProvider } from '../../stories/dataProvider';
export default {
    title: 'ra-navigation/Breadcrumb.ResourceItem',
    decorators: [
        function (Story) { return (React.createElement(MemoryRouter, null,
            React.createElement(Story, null))); },
    ],
};
var BreadcrumbForResources = function () { return (React.createElement(Breadcrumb, null,
    React.createElement(Breadcrumb.ResourceItem, { resource: "songs" }),
    React.createElement(Breadcrumb.ResourceItem, { resource: "artists" }))); };
var LayoutForResources = function (_a) {
    var children = _a.children, rest = __rest(_a, ["children"]);
    return (React.createElement(AppLocationContext, null,
        React.createElement(Layout, __assign({}, rest),
            React.createElement(BreadcrumbForResources, null),
            children)));
};
export var Basic = function () { return (React.createElement(Admin, { dataProvider: dataProvider, layout: LayoutForResources },
    React.createElement(Resource, { name: "songs", list: ListGuesser, edit: EditGuesser, recordRepresentation: "title" }),
    React.createElement(Resource, { name: "artists", list: ListGuesser, edit: EditGuesser, recordRepresentation: "name" }))); };
var BreadcrumbForGroupedResources = function () { return (React.createElement(Breadcrumb, null,
    React.createElement(Breadcrumb.Item, { name: "music", label: "Music" },
        React.createElement(Breadcrumb.ResourceItem, { resource: "songs" }),
        React.createElement(Breadcrumb.ResourceItem, { resource: "artists" })))); };
var LayoutForGroupedResources = function (_a) {
    var children = _a.children, rest = __rest(_a, ["children"]);
    return (React.createElement(AppLocationContext, null,
        React.createElement(Layout, __assign({}, rest),
            React.createElement(BreadcrumbForGroupedResources, null),
            children)));
};
export var Grouped = function () { return (React.createElement(Admin, { dataProvider: dataProvider, layout: LayoutForGroupedResources },
    React.createElement(Resource, { name: "songs", list: SongList, edit: SongEdit, show: SongShow, create: SongCreate, recordRepresentation: "title" }),
    React.createElement(Resource, { name: "artists", list: ArtistList, edit: ArtistEdit, show: ArtistShow, create: ArtistCreate, recordRepresentation: "name" }))); };
var SongList = function () {
    useDefineAppLocation('music.songs');
    return (React.createElement(List, null,
        React.createElement(Datagrid, { rowClick: "edit" },
            React.createElement(TextField, { source: "title" }))));
};
var SongEditAppLocation = function () {
    var record = useRecordContext();
    useDefineAppLocation('music.songs.edit', { record: record });
    return null;
};
var SongEdit = function () { return (React.createElement(Edit, null,
    React.createElement(SongEditAppLocation, null),
    React.createElement(SimpleForm, null,
        React.createElement(TextInput, { source: "title" })))); };
var SongShowAppLocation = function () {
    var record = useRecordContext();
    useDefineAppLocation('music.songs.show', { record: record });
    return null;
};
var SongShow = function () { return (React.createElement(Show, null,
    React.createElement(SongShowAppLocation, null),
    React.createElement(SimpleShowLayout, null,
        React.createElement(TextField, { source: "title" })))); };
var SongCreate = function () {
    useDefineAppLocation('music.songs.create');
    return (React.createElement(Create, null,
        React.createElement(SimpleForm, null,
            React.createElement(TextInput, { source: "title" }))));
};
var ArtistList = function () {
    useDefineAppLocation('music.artists');
    return (React.createElement(List, null,
        React.createElement(Datagrid, { rowClick: "edit" },
            React.createElement(TextField, { source: "name" }))));
};
var ArtistEditAppLocation = function () {
    var record = useRecordContext();
    useDefineAppLocation('music.artists.edit', { record: record });
    return null;
};
var ArtistEdit = function () { return (React.createElement(Edit, null,
    React.createElement(ArtistEditAppLocation, null),
    React.createElement(SimpleForm, null,
        React.createElement(TextInput, { source: "name" })))); };
var ArtistShowAppLocation = function () {
    var record = useRecordContext();
    useDefineAppLocation('music.artists.show', { record: record });
    return null;
};
var ArtistShow = function () { return (React.createElement(Show, null,
    React.createElement(ArtistShowAppLocation, null),
    React.createElement(SimpleShowLayout, null,
        React.createElement(TextField, { source: "name" })))); };
var ArtistCreate = function () {
    useDefineAppLocation('music.artists.create');
    return (React.createElement(Create, null,
        React.createElement(SimpleForm, null,
            React.createElement(TextInput, { source: "name" }))));
};
