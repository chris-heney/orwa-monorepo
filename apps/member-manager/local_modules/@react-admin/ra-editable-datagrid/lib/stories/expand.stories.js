"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expand = void 0;
var react_1 = __importDefault(require("react"));
var ra_data_fakerest_1 = __importDefault(require("ra-data-fakerest"));
var react_admin_1 = require("react-admin");
var history_1 = require("history");
var src_1 = require("../src");
exports.default = { title: 'ra-editable-datagrid/Expand' };
var dataProvider = (0, ra_data_fakerest_1.default)({
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
var professionChoices = [
    { id: 'actor', name: 'Actor' },
    { id: 'singer', name: 'Singer' },
    { id: 'other', name: 'Other' },
];
var ArtistForm = function () { return (react_1.default.createElement(src_1.RowForm, { defaultValues: { firstname: 'John', name: 'Doe' } },
    react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
    react_1.default.createElement(react_admin_1.TextInput, { source: "firstname", validate: (0, react_admin_1.required)() }),
    react_1.default.createElement(react_admin_1.TextInput, { source: "name", validate: (0, react_admin_1.required)() }),
    react_1.default.createElement(react_admin_1.DateInput, { source: "dob", label: "Born", validate: (0, react_admin_1.required)() }),
    react_1.default.createElement(react_admin_1.SelectInput, { source: "prof", label: "Profession", choices: professionChoices }))); };
var ArtistShow = function () {
    var record = (0, react_admin_1.useRecordContext)();
    return (react_1.default.createElement(react_admin_1.Show, { id: record.id },
        react_1.default.createElement(react_admin_1.SimpleShowLayout, null,
            react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
            react_1.default.createElement(react_admin_1.TextField, { source: "firstname" }),
            react_1.default.createElement(react_admin_1.TextField, { source: "name" }),
            react_1.default.createElement(react_admin_1.DateField, { source: "dob", label: "Born" }),
            react_1.default.createElement(react_admin_1.SelectField, { source: "prof", label: "Profession", choices: professionChoices }))));
};
var ArtistList = function () { return (react_1.default.createElement(react_admin_1.List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
    react_1.default.createElement(src_1.EditableDatagrid, { mutationMode: "undoable", createForm: react_1.default.createElement(ArtistForm, null), editForm: react_1.default.createElement(ArtistForm, null), expand: react_1.default.createElement(ArtistShow, null), rowClick: "edit" },
        react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "firstname" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "name" }),
        react_1.default.createElement(react_admin_1.DateField, { source: "dob", label: "Born" }),
        react_1.default.createElement(react_admin_1.SelectField, { source: "prof", label: "Profession", choices: professionChoices })))); };
var Expand = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider },
    react_1.default.createElement(react_admin_1.Resource, { name: "artists", list: ArtistList }))); };
exports.Expand = Expand;
