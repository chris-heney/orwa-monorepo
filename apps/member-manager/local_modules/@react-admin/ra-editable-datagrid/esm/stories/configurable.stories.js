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
import React from 'react';
import fakeRestProvider from 'ra-data-fakerest';
import { Admin, Resource, List, TextField, TextInput, DateField, DateInput, SelectField, SelectInput, required, TopToolbar, SelectColumnsButton, memoryStore, AppBar, TitlePortal, InspectorButton, Layout, } from 'react-admin';
import { createMemoryHistory } from 'history';
import { Box } from '@mui/material';
import { EditableDatagridConfigurable, RowFormConfigurable, } from '../src';
export default { title: 'ra-editable-datagrid/EditableDatagridConfigurable' };
var dataProvider = function () {
    return fakeRestProvider({
        artists: [
            {
                id: 1,
                name: 'Mercury',
                firstname: 'Freddy',
                dob: new Date('1946-09-05'),
                prof: 'singer',
            },
            {
                id: 2,
                name: 'John',
                firstname: 'Elton',
                dob: new Date('1947-03-25'),
                prof: 'singer',
            },
            {
                id: 3,
                name: 'Collins',
                firstname: 'Phil',
                dob: new Date('1951-01-30'),
                prof: 'singer',
            },
            {
                id: 4,
                name: 'Ford',
                firstname: 'Harrison',
                dob: new Date('1942-07-13'),
                prof: 'actor',
            },
            {
                id: 5,
                name: 'Streep',
                firstname: 'Meryl',
                dob: new Date('1949-06-22'),
                prof: 'actor',
            },
        ],
        events: [],
        performances: [],
    }, process.env.NODE_ENV !== 'test');
};
var professionChoices = [
    { id: 'actor', name: 'Actor' },
    { id: 'singer', name: 'Singer' },
    { id: 'other', name: 'Other' },
];
var ArtistForm = function (props) { return (React.createElement(RowFormConfigurable, __assign({ defaultValues: { firstname: 'John', name: 'Doe' } }, props),
    React.createElement(TextField, { source: "id" }),
    React.createElement(TextInput, { source: "firstname", validate: required() }),
    React.createElement(TextInput, { source: "name", validate: required() }),
    React.createElement(DateInput, { source: "dob", label: "Born", validate: required() }),
    React.createElement(SelectInput, { source: "prof", label: "Profession", choices: professionChoices }))); };
var ArtistList = function () { return (React.createElement(List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, actions: React.createElement(TopToolbar, null,
        React.createElement(SelectColumnsButton, null)), empty: false },
    React.createElement(EditableDatagridConfigurable, { rowClick: "edit", createForm: React.createElement(ArtistForm, null), editForm: React.createElement(ArtistForm, null) },
        React.createElement(TextField, { source: "id" }),
        React.createElement(TextField, { source: "firstname", label: "Original title" }),
        React.createElement(TextField, { source: "name" }),
        React.createElement(DateField, { source: "dob", label: "Born" }),
        React.createElement(SelectField, { source: "prof", label: "Profession", choices: professionChoices })))); };
var MyAppBar = function (props) { return (React.createElement(AppBar, __assign({}, props),
    React.createElement(TitlePortal, null),
    React.createElement(InspectorButton, null))); };
var MyLayout = function (props) { return (React.createElement(Layout, __assign({}, props, { appBar: MyAppBar }))); };
export var Basic = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider(), store: memoryStore(), layout: MyLayout },
    React.createElement(Resource, { name: "artists", list: ArtistList }))); };
export var PreferenceKey = function () { return (React.createElement(Admin, { dashboard: Dashboard, history: createMemoryHistory(), dataProvider: dataProvider(), store: memoryStore(), layout: MyLayout },
    React.createElement(Resource, { name: "artists", list: ArtistList }))); };
var Dashboard = function () { return (React.createElement(Box, { p: 2, display: "flex", justifyContent: "space-between", gap: 1 },
    React.createElement(List, { resource: "artists", actions: React.createElement(TopToolbar, null,
            React.createElement(SelectColumnsButton, { preferenceKey: "artists1" })), disableSyncWithLocation: true },
        React.createElement(EditableDatagridConfigurable, { createForm: React.createElement(ArtistForm, null), editForm: React.createElement(ArtistForm, null), preferenceKey: "artists1" },
            React.createElement(TextField, { source: "id" }),
            React.createElement(TextField, { source: "firstname" }),
            React.createElement(TextField, { source: "name" }),
            React.createElement(DateField, { source: "dob", label: "Born" }),
            React.createElement(SelectField, { source: "prof", label: "Profession", choices: professionChoices }))),
    React.createElement(List, { resource: "artists", actions: React.createElement(TopToolbar, null,
            React.createElement(SelectColumnsButton, { preferenceKey: "artists2" })), disableSyncWithLocation: true },
        React.createElement(EditableDatagridConfigurable, { createForm: React.createElement(ArtistForm, null), editForm: React.createElement(ArtistForm, null), preferenceKey: "artists2" },
            React.createElement(TextField, { source: "id" }),
            React.createElement(TextField, { source: "firstname" }),
            React.createElement(TextField, { source: "name" }),
            React.createElement(DateField, { source: "dob", label: "Born" }),
            React.createElement(SelectField, { source: "prof", label: "Profession", choices: professionChoices }))))); };
export var Omit = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider(), store: memoryStore(), layout: MyLayout },
    React.createElement(Resource, { name: "artists", list: React.createElement(List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, actions: React.createElement(TopToolbar, null,
                React.createElement(SelectColumnsButton, null)), empty: false },
            React.createElement(EditableDatagridConfigurable, { createForm: React.createElement(ArtistForm, null), editForm: React.createElement(ArtistForm, null), omit: ['firstname'] },
                React.createElement(TextField, { source: "id" }),
                React.createElement(TextField, { source: "firstname" }),
                React.createElement(TextField, { source: "name" }),
                React.createElement(DateField, { source: "dob", label: "Born" }),
                React.createElement(SelectField, { source: "prof", label: "Profession", choices: professionChoices }))) }))); };
export var LabelElement = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider(), store: memoryStore(), layout: MyLayout },
    React.createElement(Resource, { name: "artists", list: React.createElement(List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, actions: React.createElement(TopToolbar, null,
                React.createElement(SelectColumnsButton, null)), empty: false },
            React.createElement(EditableDatagridConfigurable, { createForm: React.createElement(ArtistForm, null), editForm: React.createElement(ArtistForm, null) },
                React.createElement(TextField, { source: "id" }),
                React.createElement(TextField, { source: "firstname", label: React.createElement(React.Fragment, null, "Original title") }),
                React.createElement(TextField, { source: "name" }),
                React.createElement(DateField, { source: "dob", label: "Born" }),
                React.createElement(SelectField, { source: "prof", label: "Profession", choices: professionChoices }))) }))); };
export var NullChildren = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider(), store: memoryStore(), layout: MyLayout },
    React.createElement(Resource, { name: "artists", list: React.createElement(List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, actions: React.createElement(TopToolbar, null,
                React.createElement(SelectColumnsButton, null)), empty: false },
            React.createElement(EditableDatagridConfigurable, { createForm: React.createElement(ArtistForm, null), editForm: React.createElement(ArtistForm, null) },
                false && React.createElement(TextField, { source: "id" }),
                React.createElement(TextField, { source: "firstname" }),
                React.createElement(TextField, { source: "name" }),
                React.createElement(DateField, { source: "dob", label: "Born" }),
                React.createElement(SelectField, { source: "prof", label: "Profession", choices: professionChoices }))) }))); };
