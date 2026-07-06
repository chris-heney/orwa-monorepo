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
import * as React from 'react';
import { Datagrid, ReferenceManyField, Edit, SimpleForm, TextField, TextInput, Admin, Resource, WithRecord, ListGuesser, List, required, EditGuesser, useNotify, } from 'react-admin';
import { createHashHistory } from 'history';
import { MemoryRouter } from 'react-router-dom';
import i18nProvider from '../../../stories/i18nProvider';
import { dataProvider } from '../../../stories/common';
import { CreateInDialogButton } from './CreateInDialogButton';
export default {
    title: 'ra-form-layout/DialogForm/CreateInDialogButton',
};
var EmployeeList = function () { return (React.createElement(List, { actions: React.createElement(CreateInDialogButton, null,
        React.createElement(SimpleForm, null,
            React.createElement(TextInput, { source: "name" }),
            React.createElement(TextInput, { source: "address" }),
            React.createElement(TextInput, { source: "city" }))) },
    React.createElement(Datagrid, { rowClick: "edit" },
        React.createElement(TextField, { source: "name" }),
        React.createElement(TextField, { source: "address" }),
        React.createElement(TextField, { source: "city" })))); };
export var Basic = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dataProvider: dataProvider, i18nProvider: i18nProvider },
        React.createElement(Resource, { name: "employers", list: EmployeeList, edit: EditGuesser, recordRepresentation: "name" })))); };
export var Transform = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dataProvider: dataProvider, i18nProvider: i18nProvider },
        React.createElement(Resource, { name: "employers", list: function () { return (React.createElement(List, { actions: React.createElement(CreateInDialogButton, { transform: function (record) { return (__assign(__assign({}, record), { name: record.name + '_transformed' })); } },
                    React.createElement(SimpleForm, null,
                        React.createElement(TextInput, { source: "name" }),
                        React.createElement(TextInput, { source: "address" }),
                        React.createElement(TextInput, { source: "city" }))) },
                React.createElement(Datagrid, null,
                    React.createElement(TextField, { source: "name" }),
                    React.createElement(TextField, { source: "address" }),
                    React.createElement(TextField, { source: "city" })))); }, recordRepresentation: "name" })))); };
export var InReferenceField = function () {
    var history = createHashHistory();
    return (React.createElement(Admin, { dataProvider: dataProvider, i18nProvider: i18nProvider, history: history },
        React.createElement(Resource, { name: "employers", list: ListGuesser, edit: function () { return (React.createElement(Edit, null,
                React.createElement(SimpleForm, null,
                    React.createElement(TextInput, { source: "name" }),
                    React.createElement(TextInput, { source: "address" }),
                    React.createElement(TextInput, { source: "city" }),
                    React.createElement(ReferenceManyField, { target: "employer_id", reference: "customers" },
                        React.createElement(WithRecord, { render: function (record) { return (React.createElement(CreateInDialogButton, { record: { employer_id: record.id } },
                                React.createElement(SimpleForm, null,
                                    React.createElement(TextInput, { source: "first_name" }),
                                    React.createElement(TextInput, { source: "last_name" })))); } }),
                        React.createElement(Datagrid, null,
                            React.createElement(TextField, { source: "first_name" }),
                            React.createElement(TextField, { source: "last_name" })))))); }, recordRepresentation: "name" }),
        React.createElement(Resource, { name: "customers", list: ListGuesser })));
};
export var InputValidation = function () {
    var history = createHashHistory();
    return (React.createElement(Admin, { dataProvider: dataProvider, i18nProvider: i18nProvider, history: history },
        React.createElement(Resource, { name: "employers", list: ListGuesser, edit: function () { return (React.createElement(Edit, null,
                React.createElement(SimpleForm, null,
                    React.createElement(TextInput, { source: "name" }),
                    React.createElement(TextInput, { source: "address" }),
                    React.createElement(TextInput, { source: "city" }),
                    React.createElement(ReferenceManyField, { target: "employer_id", reference: "customers" },
                        React.createElement(WithRecord, { render: function (record) { return (React.createElement(CreateInDialogButton, { record: { employer_id: record.id } },
                                React.createElement(SimpleForm, null,
                                    React.createElement(TextInput, { source: "first_name", validate: [required()] }),
                                    React.createElement(TextInput, { source: "last_name", validate: [required()] })))); } }),
                        React.createElement(Datagrid, null,
                            React.createElement(TextField, { source: "first_name" }),
                            React.createElement(TextField, { source: "last_name" })))))); }, recordRepresentation: "name" }),
        React.createElement(Resource, { name: "customers", list: ListGuesser })));
};
export var GlobalValidation = function () {
    var history = createHashHistory();
    return (React.createElement(Admin, { dataProvider: dataProvider, i18nProvider: i18nProvider, history: history },
        React.createElement(Resource, { name: "employers", list: ListGuesser, edit: function () { return (React.createElement(Edit, null,
                React.createElement(SimpleForm, null,
                    React.createElement(TextInput, { source: "name" }),
                    React.createElement(TextInput, { source: "address" }),
                    React.createElement(TextInput, { source: "city" }),
                    React.createElement(ReferenceManyField, { target: "employer_id", reference: "customers" },
                        React.createElement(WithRecord, { render: function (record) { return (React.createElement(CreateInDialogButton, { record: { employer_id: record.id } },
                                React.createElement(SimpleForm, { validate: function () { return ({
                                        first_name: 'not good',
                                    }); } },
                                    React.createElement(TextInput, { source: "first_name" }),
                                    React.createElement(TextInput, { source: "last_name" })))); } }),
                        React.createElement(Datagrid, null,
                            React.createElement(TextField, { source: "first_name" }),
                            React.createElement(TextField, { source: "last_name" })))))); }, recordRepresentation: "name" }),
        React.createElement(Resource, { name: "customers", list: ListGuesser })));
};
export var CustomMutationOptions = function () {
    return (React.createElement(MemoryRouter, null,
        React.createElement(Admin, { dataProvider: dataProvider, i18nProvider: i18nProvider },
            React.createElement(Resource, { name: "employers", list: CustomMutationOptionsList, recordRepresentation: "name" }))));
};
var CustomMutationOptionsList = function () {
    var notify = useNotify();
    return (React.createElement(List, { actions: React.createElement(CreateInDialogButton, { mutationOptions: {
                onSuccess: function () {
                    notify('custom notification');
                },
            } },
            React.createElement(SimpleForm, null,
                React.createElement(TextInput, { source: "name" }),
                React.createElement(TextInput, { source: "address" }),
                React.createElement(TextInput, { source: "city" }))) },
        React.createElement(Datagrid, null,
            React.createElement(TextField, { source: "name" }),
            React.createElement(TextField, { source: "address" }),
            React.createElement(TextField, { source: "city" }))));
};
