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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomMutationOptions = exports.GlobalValidation = exports.InputValidation = exports.InReferenceField = exports.Transform = exports.Basic = void 0;
var React = __importStar(require("react"));
var react_admin_1 = require("react-admin");
var history_1 = require("history");
var react_router_dom_1 = require("react-router-dom");
var i18nProvider_1 = __importDefault(require("../../../stories/i18nProvider"));
var common_1 = require("../../../stories/common");
var CreateInDialogButton_1 = require("./CreateInDialogButton");
exports.default = {
    title: 'ra-form-layout/DialogForm/CreateInDialogButton',
};
var EmployeeList = function () { return (React.createElement(react_admin_1.List, { actions: React.createElement(CreateInDialogButton_1.CreateInDialogButton, null,
        React.createElement(react_admin_1.SimpleForm, null,
            React.createElement(react_admin_1.TextInput, { source: "name" }),
            React.createElement(react_admin_1.TextInput, { source: "address" }),
            React.createElement(react_admin_1.TextInput, { source: "city" }))) },
    React.createElement(react_admin_1.Datagrid, { rowClick: "edit" },
        React.createElement(react_admin_1.TextField, { source: "name" }),
        React.createElement(react_admin_1.TextField, { source: "address" }),
        React.createElement(react_admin_1.TextField, { source: "city" })))); };
var Basic = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dataProvider: common_1.dataProvider, i18nProvider: i18nProvider_1.default },
        React.createElement(react_admin_1.Resource, { name: "employers", list: EmployeeList, edit: react_admin_1.EditGuesser, recordRepresentation: "name" })))); };
exports.Basic = Basic;
var Transform = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dataProvider: common_1.dataProvider, i18nProvider: i18nProvider_1.default },
        React.createElement(react_admin_1.Resource, { name: "employers", list: function () { return (React.createElement(react_admin_1.List, { actions: React.createElement(CreateInDialogButton_1.CreateInDialogButton, { transform: function (record) { return (__assign(__assign({}, record), { name: record.name + '_transformed' })); } },
                    React.createElement(react_admin_1.SimpleForm, null,
                        React.createElement(react_admin_1.TextInput, { source: "name" }),
                        React.createElement(react_admin_1.TextInput, { source: "address" }),
                        React.createElement(react_admin_1.TextInput, { source: "city" }))) },
                React.createElement(react_admin_1.Datagrid, null,
                    React.createElement(react_admin_1.TextField, { source: "name" }),
                    React.createElement(react_admin_1.TextField, { source: "address" }),
                    React.createElement(react_admin_1.TextField, { source: "city" })))); }, recordRepresentation: "name" })))); };
exports.Transform = Transform;
var InReferenceField = function () {
    var history = (0, history_1.createHashHistory)();
    return (React.createElement(react_admin_1.Admin, { dataProvider: common_1.dataProvider, i18nProvider: i18nProvider_1.default, history: history },
        React.createElement(react_admin_1.Resource, { name: "employers", list: react_admin_1.ListGuesser, edit: function () { return (React.createElement(react_admin_1.Edit, null,
                React.createElement(react_admin_1.SimpleForm, null,
                    React.createElement(react_admin_1.TextInput, { source: "name" }),
                    React.createElement(react_admin_1.TextInput, { source: "address" }),
                    React.createElement(react_admin_1.TextInput, { source: "city" }),
                    React.createElement(react_admin_1.ReferenceManyField, { target: "employer_id", reference: "customers" },
                        React.createElement(react_admin_1.WithRecord, { render: function (record) { return (React.createElement(CreateInDialogButton_1.CreateInDialogButton, { record: { employer_id: record.id } },
                                React.createElement(react_admin_1.SimpleForm, null,
                                    React.createElement(react_admin_1.TextInput, { source: "first_name" }),
                                    React.createElement(react_admin_1.TextInput, { source: "last_name" })))); } }),
                        React.createElement(react_admin_1.Datagrid, null,
                            React.createElement(react_admin_1.TextField, { source: "first_name" }),
                            React.createElement(react_admin_1.TextField, { source: "last_name" })))))); }, recordRepresentation: "name" }),
        React.createElement(react_admin_1.Resource, { name: "customers", list: react_admin_1.ListGuesser })));
};
exports.InReferenceField = InReferenceField;
var InputValidation = function () {
    var history = (0, history_1.createHashHistory)();
    return (React.createElement(react_admin_1.Admin, { dataProvider: common_1.dataProvider, i18nProvider: i18nProvider_1.default, history: history },
        React.createElement(react_admin_1.Resource, { name: "employers", list: react_admin_1.ListGuesser, edit: function () { return (React.createElement(react_admin_1.Edit, null,
                React.createElement(react_admin_1.SimpleForm, null,
                    React.createElement(react_admin_1.TextInput, { source: "name" }),
                    React.createElement(react_admin_1.TextInput, { source: "address" }),
                    React.createElement(react_admin_1.TextInput, { source: "city" }),
                    React.createElement(react_admin_1.ReferenceManyField, { target: "employer_id", reference: "customers" },
                        React.createElement(react_admin_1.WithRecord, { render: function (record) { return (React.createElement(CreateInDialogButton_1.CreateInDialogButton, { record: { employer_id: record.id } },
                                React.createElement(react_admin_1.SimpleForm, null,
                                    React.createElement(react_admin_1.TextInput, { source: "first_name", validate: [(0, react_admin_1.required)()] }),
                                    React.createElement(react_admin_1.TextInput, { source: "last_name", validate: [(0, react_admin_1.required)()] })))); } }),
                        React.createElement(react_admin_1.Datagrid, null,
                            React.createElement(react_admin_1.TextField, { source: "first_name" }),
                            React.createElement(react_admin_1.TextField, { source: "last_name" })))))); }, recordRepresentation: "name" }),
        React.createElement(react_admin_1.Resource, { name: "customers", list: react_admin_1.ListGuesser })));
};
exports.InputValidation = InputValidation;
var GlobalValidation = function () {
    var history = (0, history_1.createHashHistory)();
    return (React.createElement(react_admin_1.Admin, { dataProvider: common_1.dataProvider, i18nProvider: i18nProvider_1.default, history: history },
        React.createElement(react_admin_1.Resource, { name: "employers", list: react_admin_1.ListGuesser, edit: function () { return (React.createElement(react_admin_1.Edit, null,
                React.createElement(react_admin_1.SimpleForm, null,
                    React.createElement(react_admin_1.TextInput, { source: "name" }),
                    React.createElement(react_admin_1.TextInput, { source: "address" }),
                    React.createElement(react_admin_1.TextInput, { source: "city" }),
                    React.createElement(react_admin_1.ReferenceManyField, { target: "employer_id", reference: "customers" },
                        React.createElement(react_admin_1.WithRecord, { render: function (record) { return (React.createElement(CreateInDialogButton_1.CreateInDialogButton, { record: { employer_id: record.id } },
                                React.createElement(react_admin_1.SimpleForm, { validate: function () { return ({
                                        first_name: 'not good',
                                    }); } },
                                    React.createElement(react_admin_1.TextInput, { source: "first_name" }),
                                    React.createElement(react_admin_1.TextInput, { source: "last_name" })))); } }),
                        React.createElement(react_admin_1.Datagrid, null,
                            React.createElement(react_admin_1.TextField, { source: "first_name" }),
                            React.createElement(react_admin_1.TextField, { source: "last_name" })))))); }, recordRepresentation: "name" }),
        React.createElement(react_admin_1.Resource, { name: "customers", list: react_admin_1.ListGuesser })));
};
exports.GlobalValidation = GlobalValidation;
var CustomMutationOptions = function () {
    return (React.createElement(react_router_dom_1.MemoryRouter, null,
        React.createElement(react_admin_1.Admin, { dataProvider: common_1.dataProvider, i18nProvider: i18nProvider_1.default },
            React.createElement(react_admin_1.Resource, { name: "employers", list: CustomMutationOptionsList, recordRepresentation: "name" }))));
};
exports.CustomMutationOptions = CustomMutationOptions;
var CustomMutationOptionsList = function () {
    var notify = (0, react_admin_1.useNotify)();
    return (React.createElement(react_admin_1.List, { actions: React.createElement(CreateInDialogButton_1.CreateInDialogButton, { mutationOptions: {
                onSuccess: function () {
                    notify('custom notification');
                },
            } },
            React.createElement(react_admin_1.SimpleForm, null,
                React.createElement(react_admin_1.TextInput, { source: "name" }),
                React.createElement(react_admin_1.TextInput, { source: "address" }),
                React.createElement(react_admin_1.TextInput, { source: "city" }))) },
        React.createElement(react_admin_1.Datagrid, null,
            React.createElement(react_admin_1.TextField, { source: "name" }),
            React.createElement(react_admin_1.TextField, { source: "address" }),
            React.createElement(react_admin_1.TextField, { source: "city" }))));
};
