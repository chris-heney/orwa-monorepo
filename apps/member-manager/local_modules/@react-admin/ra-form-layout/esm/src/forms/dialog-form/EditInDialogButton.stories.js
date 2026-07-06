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
import { SimpleForm, TextInput, Admin, Resource, List, Datagrid, TextField, useNotify, } from 'react-admin';
import { MemoryRouter } from 'react-router-dom';
import i18nProvider from '../../../stories/i18nProvider';
import { dataProvider } from '../../../stories/common';
import { EditInDialogButton } from './EditInDialogButton';
export default {
    title: 'ra-form-layout/DialogForm/EditInDialogButton',
};
export var Basic = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dataProvider: dataProvider, i18nProvider: i18nProvider },
        React.createElement(Resource, { name: "employers", list: function () { return (React.createElement(List, null,
                React.createElement(Datagrid, null,
                    React.createElement(TextField, { source: "name" }),
                    React.createElement(TextField, { source: "address" }),
                    React.createElement(TextField, { source: "city" }),
                    React.createElement(EditInDialogButton, null,
                        React.createElement(SimpleForm, null,
                            React.createElement(TextInput, { source: "name" }),
                            React.createElement(TextInput, { source: "address" }),
                            React.createElement(TextInput, { source: "city" })))))); }, recordRepresentation: "name" })))); };
export var Transform = function () { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, { dataProvider: dataProvider, i18nProvider: i18nProvider },
        React.createElement(Resource, { name: "employers", list: function () { return (React.createElement(List, null,
                React.createElement(Datagrid, null,
                    React.createElement(TextField, { source: "name" }),
                    React.createElement(TextField, { source: "address" }),
                    React.createElement(TextField, { source: "city" }),
                    React.createElement(EditInDialogButton, { transform: function (record) { return (__assign(__assign({}, record), { name: record.name + '_transformed' })); } },
                        React.createElement(SimpleForm, null,
                            React.createElement(TextInput, { source: "name" }),
                            React.createElement(TextInput, { source: "address" }),
                            React.createElement(TextInput, { source: "city" })))))); }, recordRepresentation: "name" })))); };
export var CustomMutationOptions = function () {
    return (React.createElement(MemoryRouter, null,
        React.createElement(Admin, { dataProvider: dataProvider, i18nProvider: i18nProvider },
            React.createElement(Resource, { name: "employers", list: CustomMutationOptionsList, recordRepresentation: "name" }))));
};
var CustomMutationOptionsList = function () {
    var notify = useNotify();
    return (React.createElement(List, null,
        React.createElement(Datagrid, null,
            React.createElement(TextField, { source: "name" }),
            React.createElement(TextField, { source: "address" }),
            React.createElement(TextField, { source: "city" }),
            React.createElement(EditInDialogButton, { mutationOptions: {
                    onSuccess: function () {
                        notify('custom notification');
                    },
                } },
                React.createElement(SimpleForm, null,
                    React.createElement(TextInput, { source: "name" }),
                    React.createElement(TextInput, { source: "address" }),
                    React.createElement(TextInput, { source: "city" }))))));
};
