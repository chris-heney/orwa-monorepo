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
exports.CustomMutationOptions = exports.Transform = exports.Basic = void 0;
var React = __importStar(require("react"));
var react_admin_1 = require("react-admin");
var react_router_dom_1 = require("react-router-dom");
var i18nProvider_1 = __importDefault(require("../../../stories/i18nProvider"));
var common_1 = require("../../../stories/common");
var EditInDialogButton_1 = require("./EditInDialogButton");
exports.default = {
    title: 'ra-form-layout/DialogForm/EditInDialogButton',
};
var Basic = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dataProvider: common_1.dataProvider, i18nProvider: i18nProvider_1.default },
        React.createElement(react_admin_1.Resource, { name: "employers", list: function () { return (React.createElement(react_admin_1.List, null,
                React.createElement(react_admin_1.Datagrid, null,
                    React.createElement(react_admin_1.TextField, { source: "name" }),
                    React.createElement(react_admin_1.TextField, { source: "address" }),
                    React.createElement(react_admin_1.TextField, { source: "city" }),
                    React.createElement(EditInDialogButton_1.EditInDialogButton, null,
                        React.createElement(react_admin_1.SimpleForm, null,
                            React.createElement(react_admin_1.TextInput, { source: "name" }),
                            React.createElement(react_admin_1.TextInput, { source: "address" }),
                            React.createElement(react_admin_1.TextInput, { source: "city" })))))); }, recordRepresentation: "name" })))); };
exports.Basic = Basic;
var Transform = function () { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, { dataProvider: common_1.dataProvider, i18nProvider: i18nProvider_1.default },
        React.createElement(react_admin_1.Resource, { name: "employers", list: function () { return (React.createElement(react_admin_1.List, null,
                React.createElement(react_admin_1.Datagrid, null,
                    React.createElement(react_admin_1.TextField, { source: "name" }),
                    React.createElement(react_admin_1.TextField, { source: "address" }),
                    React.createElement(react_admin_1.TextField, { source: "city" }),
                    React.createElement(EditInDialogButton_1.EditInDialogButton, { transform: function (record) { return (__assign(__assign({}, record), { name: record.name + '_transformed' })); } },
                        React.createElement(react_admin_1.SimpleForm, null,
                            React.createElement(react_admin_1.TextInput, { source: "name" }),
                            React.createElement(react_admin_1.TextInput, { source: "address" }),
                            React.createElement(react_admin_1.TextInput, { source: "city" })))))); }, recordRepresentation: "name" })))); };
exports.Transform = Transform;
var CustomMutationOptions = function () {
    return (React.createElement(react_router_dom_1.MemoryRouter, null,
        React.createElement(react_admin_1.Admin, { dataProvider: common_1.dataProvider, i18nProvider: i18nProvider_1.default },
            React.createElement(react_admin_1.Resource, { name: "employers", list: CustomMutationOptionsList, recordRepresentation: "name" }))));
};
exports.CustomMutationOptions = CustomMutationOptions;
var CustomMutationOptionsList = function () {
    var notify = (0, react_admin_1.useNotify)();
    return (React.createElement(react_admin_1.List, null,
        React.createElement(react_admin_1.Datagrid, null,
            React.createElement(react_admin_1.TextField, { source: "name" }),
            React.createElement(react_admin_1.TextField, { source: "address" }),
            React.createElement(react_admin_1.TextField, { source: "city" }),
            React.createElement(EditInDialogButton_1.EditInDialogButton, { mutationOptions: {
                    onSuccess: function () {
                        notify('custom notification');
                    },
                } },
                React.createElement(react_admin_1.SimpleForm, null,
                    React.createElement(react_admin_1.TextInput, { source: "name" }),
                    React.createElement(react_admin_1.TextInput, { source: "address" }),
                    React.createElement(react_admin_1.TextInput, { source: "city" }))))));
};
