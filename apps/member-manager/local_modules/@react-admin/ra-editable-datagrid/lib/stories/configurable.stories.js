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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullChildren = exports.LabelElement = exports.Omit = exports.PreferenceKey = exports.Basic = void 0;
var react_1 = __importDefault(require("react"));
var ra_data_fakerest_1 = __importDefault(require("ra-data-fakerest"));
var react_admin_1 = require("react-admin");
var history_1 = require("history");
var material_1 = require("@mui/material");
var src_1 = require("../src");
exports.default = { title: 'ra-editable-datagrid/EditableDatagridConfigurable' };
var dataProvider = function () {
    return (0, ra_data_fakerest_1.default)({
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
var ArtistForm = function (props) { return (react_1.default.createElement(src_1.RowFormConfigurable, __assign({ defaultValues: { firstname: 'John', name: 'Doe' } }, props),
    react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
    react_1.default.createElement(react_admin_1.TextInput, { source: "firstname", validate: (0, react_admin_1.required)() }),
    react_1.default.createElement(react_admin_1.TextInput, { source: "name", validate: (0, react_admin_1.required)() }),
    react_1.default.createElement(react_admin_1.DateInput, { source: "dob", label: "Born", validate: (0, react_admin_1.required)() }),
    react_1.default.createElement(react_admin_1.SelectInput, { source: "prof", label: "Profession", choices: professionChoices }))); };
var ArtistList = function () { return (react_1.default.createElement(react_admin_1.List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, actions: react_1.default.createElement(react_admin_1.TopToolbar, null,
        react_1.default.createElement(react_admin_1.SelectColumnsButton, null)), empty: false },
    react_1.default.createElement(src_1.EditableDatagridConfigurable, { rowClick: "edit", createForm: react_1.default.createElement(ArtistForm, null), editForm: react_1.default.createElement(ArtistForm, null) },
        react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "firstname", label: "Original title" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "name" }),
        react_1.default.createElement(react_admin_1.DateField, { source: "dob", label: "Born" }),
        react_1.default.createElement(react_admin_1.SelectField, { source: "prof", label: "Profession", choices: professionChoices })))); };
var MyAppBar = function (props) { return (react_1.default.createElement(react_admin_1.AppBar, __assign({}, props),
    react_1.default.createElement(react_admin_1.TitlePortal, null),
    react_1.default.createElement(react_admin_1.InspectorButton, null))); };
var MyLayout = function (props) { return (react_1.default.createElement(react_admin_1.Layout, __assign({}, props, { appBar: MyAppBar }))); };
var Basic = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider(), store: (0, react_admin_1.memoryStore)(), layout: MyLayout },
    react_1.default.createElement(react_admin_1.Resource, { name: "artists", list: ArtistList }))); };
exports.Basic = Basic;
var PreferenceKey = function () { return (react_1.default.createElement(react_admin_1.Admin, { dashboard: Dashboard, history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider(), store: (0, react_admin_1.memoryStore)(), layout: MyLayout },
    react_1.default.createElement(react_admin_1.Resource, { name: "artists", list: ArtistList }))); };
exports.PreferenceKey = PreferenceKey;
var Dashboard = function () { return (react_1.default.createElement(material_1.Box, { p: 2, display: "flex", justifyContent: "space-between", gap: 1 },
    react_1.default.createElement(react_admin_1.List, { resource: "artists", actions: react_1.default.createElement(react_admin_1.TopToolbar, null,
            react_1.default.createElement(react_admin_1.SelectColumnsButton, { preferenceKey: "artists1" })), disableSyncWithLocation: true },
        react_1.default.createElement(src_1.EditableDatagridConfigurable, { createForm: react_1.default.createElement(ArtistForm, null), editForm: react_1.default.createElement(ArtistForm, null), preferenceKey: "artists1" },
            react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
            react_1.default.createElement(react_admin_1.TextField, { source: "firstname" }),
            react_1.default.createElement(react_admin_1.TextField, { source: "name" }),
            react_1.default.createElement(react_admin_1.DateField, { source: "dob", label: "Born" }),
            react_1.default.createElement(react_admin_1.SelectField, { source: "prof", label: "Profession", choices: professionChoices }))),
    react_1.default.createElement(react_admin_1.List, { resource: "artists", actions: react_1.default.createElement(react_admin_1.TopToolbar, null,
            react_1.default.createElement(react_admin_1.SelectColumnsButton, { preferenceKey: "artists2" })), disableSyncWithLocation: true },
        react_1.default.createElement(src_1.EditableDatagridConfigurable, { createForm: react_1.default.createElement(ArtistForm, null), editForm: react_1.default.createElement(ArtistForm, null), preferenceKey: "artists2" },
            react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
            react_1.default.createElement(react_admin_1.TextField, { source: "firstname" }),
            react_1.default.createElement(react_admin_1.TextField, { source: "name" }),
            react_1.default.createElement(react_admin_1.DateField, { source: "dob", label: "Born" }),
            react_1.default.createElement(react_admin_1.SelectField, { source: "prof", label: "Profession", choices: professionChoices }))))); };
var Omit = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider(), store: (0, react_admin_1.memoryStore)(), layout: MyLayout },
    react_1.default.createElement(react_admin_1.Resource, { name: "artists", list: react_1.default.createElement(react_admin_1.List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, actions: react_1.default.createElement(react_admin_1.TopToolbar, null,
                react_1.default.createElement(react_admin_1.SelectColumnsButton, null)), empty: false },
            react_1.default.createElement(src_1.EditableDatagridConfigurable, { createForm: react_1.default.createElement(ArtistForm, null), editForm: react_1.default.createElement(ArtistForm, null), omit: ['firstname'] },
                react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
                react_1.default.createElement(react_admin_1.TextField, { source: "firstname" }),
                react_1.default.createElement(react_admin_1.TextField, { source: "name" }),
                react_1.default.createElement(react_admin_1.DateField, { source: "dob", label: "Born" }),
                react_1.default.createElement(react_admin_1.SelectField, { source: "prof", label: "Profession", choices: professionChoices }))) }))); };
exports.Omit = Omit;
var LabelElement = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider(), store: (0, react_admin_1.memoryStore)(), layout: MyLayout },
    react_1.default.createElement(react_admin_1.Resource, { name: "artists", list: react_1.default.createElement(react_admin_1.List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, actions: react_1.default.createElement(react_admin_1.TopToolbar, null,
                react_1.default.createElement(react_admin_1.SelectColumnsButton, null)), empty: false },
            react_1.default.createElement(src_1.EditableDatagridConfigurable, { createForm: react_1.default.createElement(ArtistForm, null), editForm: react_1.default.createElement(ArtistForm, null) },
                react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
                react_1.default.createElement(react_admin_1.TextField, { source: "firstname", label: react_1.default.createElement(react_1.default.Fragment, null, "Original title") }),
                react_1.default.createElement(react_admin_1.TextField, { source: "name" }),
                react_1.default.createElement(react_admin_1.DateField, { source: "dob", label: "Born" }),
                react_1.default.createElement(react_admin_1.SelectField, { source: "prof", label: "Profession", choices: professionChoices }))) }))); };
exports.LabelElement = LabelElement;
var NullChildren = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider(), store: (0, react_admin_1.memoryStore)(), layout: MyLayout },
    react_1.default.createElement(react_admin_1.Resource, { name: "artists", list: react_1.default.createElement(react_admin_1.List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, actions: react_1.default.createElement(react_admin_1.TopToolbar, null,
                react_1.default.createElement(react_admin_1.SelectColumnsButton, null)), empty: false },
            react_1.default.createElement(src_1.EditableDatagridConfigurable, { createForm: react_1.default.createElement(ArtistForm, null), editForm: react_1.default.createElement(ArtistForm, null) },
                false && react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
                react_1.default.createElement(react_admin_1.TextField, { source: "firstname" }),
                react_1.default.createElement(react_admin_1.TextField, { source: "name" }),
                react_1.default.createElement(react_admin_1.DateField, { source: "dob", label: "Born" }),
                react_1.default.createElement(react_admin_1.SelectField, { source: "prof", label: "Profession", choices: professionChoices }))) }))); };
exports.NullChildren = NullChildren;
