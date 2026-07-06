"use strict";
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
exports.FullApp = void 0;
var React = __importStar(require("react"));
var react_admin_1 = require("react-admin");
var ra_data_fakerest_1 = __importDefault(require("ra-data-fakerest"));
var react_router_dom_1 = require("react-router-dom");
var PredictiveTextInput_1 = require("./PredictiveTextInput");
var addGetCompletionBasedOnOpenAIAPI_1 = require("../../dataProvider/addGetCompletionBasedOnOpenAIAPI");
var OpenAIWrapper_1 = require("../test/OpenAIWrapper");
exports.default = {
    title: 'ra-ai/input/PredictiveTextInput',
};
var users = [
    {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        company: 'Acme',
        email: 'john.doe@acme.com',
    },
    {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        company: 'XYZ Corp',
        email: 'jane.smith@xyzcorp.com',
    },
    {
        id: 3,
        firstName: 'Michael',
        lastName: 'Johnson',
        company: 'Tech Solutions',
        email: 'michael.johnson@techsolutions.com',
    },
    {
        id: 4,
        firstName: 'Emily',
        lastName: 'Brown',
        company: 'Global Industries',
    },
    {
        id: 5,
        firstName: 'David',
        lastName: 'Davis',
        company: 'Innovate Co',
        email: 'david.davis@innovateco.com',
    },
    {
        id: 6,
        firstName: 'Sarah',
        lastName: 'Wilson',
        company: 'Eagle Enterprises',
        email: 'sarah.wilson@eagleenterprises.com',
    },
    {
        id: 7,
        firstName: 'Matthew',
        lastName: 'Anderson',
        company: 'Tech Solutions',
        email: 'matthew.anderson@techsolutions.com',
    },
    {
        id: 8,
        firstName: 'Olivia',
        lastName: 'Johnson',
        company: 'Acme',
        email: 'olivia.johnson@acme.com',
    },
    {
        id: 9,
        firstName: 'Daniel',
        lastName: 'Taylor',
        company: 'Global Industries',
        email: 'daniel.taylor@globalindustries.com',
    },
    {
        id: 10,
        firstName: 'Sophia',
        lastName: 'Lee',
        company: 'XYZ Corp',
        email: 'sophia.lee@xyzcorp.com',
    },
];
var UserEdit = function () { return (React.createElement(react_admin_1.Edit, null,
    React.createElement(react_admin_1.SimpleForm, null,
        React.createElement(react_admin_1.TextInput, { source: "firstName", sx: { width: '50ch' }, helperText: false }),
        React.createElement(react_admin_1.TextInput, { source: "lastName", sx: { width: '50ch' }, helperText: false }),
        React.createElement(react_admin_1.TextInput, { source: "company", sx: { width: '50ch' }, helperText: false }),
        React.createElement(PredictiveTextInput_1.PredictiveTextInput, { source: "email", sx: { width: '50ch' }, helperText: false }),
        React.createElement(PredictiveTextInput_1.PredictiveTextInput, { source: "website", sx: { width: '50ch' }, helperText: false })))); };
var FullApp = function () { return (React.createElement(OpenAIWrapper_1.OpenAIWrapper, null,
    React.createElement(react_router_dom_1.MemoryRouter, { initialEntries: ['/users/4'] },
        React.createElement(react_admin_1.Admin, { dataProvider: (0, addGetCompletionBasedOnOpenAIAPI_1.addGetCompletionBasedOnOpenAIAPI)({
                dataProvider: (0, ra_data_fakerest_1.default)({ users: users }, process.env.NODE_ENV !== 'test'),
            }) },
            React.createElement(react_admin_1.Resource, { name: "users", list: react_admin_1.ListGuesser, edit: UserEdit }))))); };
exports.FullApp = FullApp;
