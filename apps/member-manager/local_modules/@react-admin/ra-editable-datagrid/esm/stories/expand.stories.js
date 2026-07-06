import React from 'react';
import fakeRestProvider from 'ra-data-fakerest';
import { Admin, Resource, List, TextField, TextInput, DateField, DateInput, SelectField, SelectInput, Show, SimpleShowLayout, required, useRecordContext, } from 'react-admin';
import { createMemoryHistory } from 'history';
import { EditableDatagrid, RowForm } from '../src';
export default { title: 'ra-editable-datagrid/Expand' };
var dataProvider = fakeRestProvider({
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
var ArtistForm = function () { return (React.createElement(RowForm, { defaultValues: { firstname: 'John', name: 'Doe' } },
    React.createElement(TextField, { source: "id" }),
    React.createElement(TextInput, { source: "firstname", validate: required() }),
    React.createElement(TextInput, { source: "name", validate: required() }),
    React.createElement(DateInput, { source: "dob", label: "Born", validate: required() }),
    React.createElement(SelectInput, { source: "prof", label: "Profession", choices: professionChoices }))); };
var ArtistShow = function () {
    var record = useRecordContext();
    return (React.createElement(Show, { id: record.id },
        React.createElement(SimpleShowLayout, null,
            React.createElement(TextField, { source: "id" }),
            React.createElement(TextField, { source: "firstname" }),
            React.createElement(TextField, { source: "name" }),
            React.createElement(DateField, { source: "dob", label: "Born" }),
            React.createElement(SelectField, { source: "prof", label: "Profession", choices: professionChoices }))));
};
var ArtistList = function () { return (React.createElement(List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
    React.createElement(EditableDatagrid, { mutationMode: "undoable", createForm: React.createElement(ArtistForm, null), editForm: React.createElement(ArtistForm, null), expand: React.createElement(ArtistShow, null), rowClick: "edit" },
        React.createElement(TextField, { source: "id" }),
        React.createElement(TextField, { source: "firstname" }),
        React.createElement(TextField, { source: "name" }),
        React.createElement(DateField, { source: "dob", label: "Born" }),
        React.createElement(SelectField, { source: "prof", label: "Profession", choices: professionChoices })))); };
export var Expand = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider },
    React.createElement(Resource, { name: "artists", list: ArtistList }))); };
