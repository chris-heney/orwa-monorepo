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
exports.DarkMode = exports.CustomToolbar = exports.AutoClose = exports.Basic = void 0;
/* eslint-disable @typescript-eslint/ban-types */
var react_1 = __importStar(require("react"));
var react_admin_1 = require("react-admin");
var history_1 = require("history");
var src_1 = require("../src");
var i18nProvider_1 = __importDefault(require("./i18nProvider"));
var common_1 = require("./common");
var CustomerEdit = function () { return (react_1.default.createElement(react_admin_1.Edit, { component: "div", title: react_1.default.createElement(common_1.CustomerTitle, null) },
    react_1.default.createElement(src_1.AccordionForm, null,
        react_1.default.createElement(src_1.AccordionFormPanel, { label: "Identity", defaultExpanded: true },
            react_1.default.createElement(react_admin_1.Labeled, { label: "id" },
                react_1.default.createElement(react_admin_1.TextField, { source: "id" })),
            react_1.default.createElement(react_admin_1.TextInput, { source: "first_name", validate: (0, react_admin_1.required)() }),
            react_1.default.createElement(react_admin_1.TextInput, { source: "last_name", validate: (0, react_admin_1.required)() }),
            react_1.default.createElement(react_admin_1.DateInput, { source: "dob", label: "born", validate: (0, react_admin_1.required)() }),
            react_1.default.createElement(react_admin_1.SelectInput, { source: "sex", choices: common_1.sexChoices })),
        react_1.default.createElement(src_1.AccordionFormPanel, { label: "Occupations" },
            react_1.default.createElement(react_admin_1.ArrayInput, { source: "occupations", label: "" },
                react_1.default.createElement(react_admin_1.SimpleFormIterator, null,
                    react_1.default.createElement(react_admin_1.TextInput, { source: "name", validate: (0, react_admin_1.required)() }),
                    react_1.default.createElement(react_admin_1.DateInput, { source: "from", validate: (0, react_admin_1.required)() }),
                    react_1.default.createElement(react_admin_1.DateInput, { source: "to" })))),
        react_1.default.createElement(src_1.AccordionFormPanel, { label: "Preferences" },
            react_1.default.createElement(react_admin_1.SelectInput, { source: "language", choices: common_1.languageChoices, defaultValue: "en" }),
            react_1.default.createElement(react_admin_1.BooleanInput, { source: "dark_theme" }),
            react_1.default.createElement(react_admin_1.BooleanInput, { source: "accepts_emails_from_partners" }))))); };
var Basic = function () {
    var history = (0, history_1.createHashHistory)();
    (0, react_1.useEffect)(function () {
        history.replace('/customers/5/edit');
    }, [history]);
    return (react_1.default.createElement(react_admin_1.Admin, { dataProvider: common_1.dataProvider, i18nProvider: i18nProvider_1.default, history: history },
        react_1.default.createElement(react_admin_1.Resource, { name: "customers", list: common_1.CustomerList, edit: CustomerEdit, create: common_1.CustomerCreate })));
};
exports.Basic = Basic;
var CustomerEditAutoClose = function () { return (react_1.default.createElement(react_admin_1.Edit, { component: "div", title: react_1.default.createElement(common_1.CustomerTitle, null) },
    react_1.default.createElement(src_1.AccordionForm, { autoClose: true },
        react_1.default.createElement(src_1.AccordionFormPanel, { label: "Identity", defaultExpanded: true },
            react_1.default.createElement(react_admin_1.Labeled, { label: "id" },
                react_1.default.createElement(react_admin_1.TextField, { source: "id" })),
            react_1.default.createElement(react_admin_1.TextInput, { source: "first_name", validate: (0, react_admin_1.required)() }),
            react_1.default.createElement(react_admin_1.TextInput, { source: "last_name", validate: (0, react_admin_1.required)() }),
            react_1.default.createElement(react_admin_1.DateInput, { source: "dob", label: "born", validate: (0, react_admin_1.required)() }),
            react_1.default.createElement(react_admin_1.SelectInput, { source: "sex", choices: common_1.sexChoices })),
        react_1.default.createElement(src_1.AccordionFormPanel, { label: "Occupations" },
            react_1.default.createElement(react_admin_1.ArrayInput, { source: "occupations", label: "" },
                react_1.default.createElement(react_admin_1.SimpleFormIterator, null,
                    react_1.default.createElement(react_admin_1.TextInput, { source: "name", validate: (0, react_admin_1.required)() }),
                    react_1.default.createElement(react_admin_1.DateInput, { source: "from", validate: (0, react_admin_1.required)() }),
                    react_1.default.createElement(react_admin_1.DateInput, { source: "to" })))),
        react_1.default.createElement(src_1.AccordionFormPanel, { label: "Preferences" },
            react_1.default.createElement(react_admin_1.SelectInput, { source: "language", choices: common_1.languageChoices, defaultValue: "en" }),
            react_1.default.createElement(react_admin_1.BooleanInput, { source: "dark_theme" }),
            react_1.default.createElement(react_admin_1.BooleanInput, { source: "accepts_emails_from_partners" }))))); };
var CustomerCustomToolbar = function (props) { return (react_1.default.createElement(react_admin_1.Toolbar, __assign({}, props),
    react_1.default.createElement(react_admin_1.SaveButton, { label: "Save and return", type: "button", variant: "outlined" }))); };
var CustomerEditWithToolbar = function () { return (react_1.default.createElement(react_admin_1.Edit, { component: "div", title: react_1.default.createElement(common_1.CustomerTitle, null) },
    react_1.default.createElement(src_1.AccordionForm, { toolbar: react_1.default.createElement(CustomerCustomToolbar, null) },
        react_1.default.createElement(src_1.AccordionFormPanel, { label: "Identity", defaultExpanded: true },
            react_1.default.createElement(react_admin_1.Labeled, { label: "id" },
                react_1.default.createElement(react_admin_1.TextField, { source: "id" })),
            react_1.default.createElement(react_admin_1.TextInput, { source: "first_name", validate: (0, react_admin_1.required)() }),
            react_1.default.createElement(react_admin_1.TextInput, { source: "last_name", validate: (0, react_admin_1.required)() }),
            react_1.default.createElement(react_admin_1.DateInput, { source: "dob", label: "born", validate: (0, react_admin_1.required)() }),
            react_1.default.createElement(react_admin_1.SelectInput, { source: "sex", choices: common_1.sexChoices })),
        react_1.default.createElement(src_1.AccordionFormPanel, { label: "Occupations" },
            react_1.default.createElement(react_admin_1.ArrayInput, { source: "occupations", label: "" },
                react_1.default.createElement(react_admin_1.SimpleFormIterator, null,
                    react_1.default.createElement(react_admin_1.TextInput, { source: "name", validate: (0, react_admin_1.required)() }),
                    react_1.default.createElement(react_admin_1.DateInput, { source: "from", validate: (0, react_admin_1.required)() }),
                    react_1.default.createElement(react_admin_1.DateInput, { source: "to" })))),
        react_1.default.createElement(src_1.AccordionFormPanel, { label: "Preferences" },
            react_1.default.createElement(react_admin_1.SelectInput, { source: "language", choices: common_1.languageChoices, defaultValue: "en" }),
            react_1.default.createElement(react_admin_1.BooleanInput, { source: "dark_theme" }),
            react_1.default.createElement(react_admin_1.BooleanInput, { source: "accepts_emails_from_partners" }))))); };
var AutoClose = function () {
    var history = (0, history_1.createHashHistory)();
    (0, react_1.useEffect)(function () {
        history.replace('/customers/5/edit');
    }, [history]);
    return (react_1.default.createElement(react_admin_1.Admin, { dataProvider: common_1.dataProvider, i18nProvider: i18nProvider_1.default, history: history },
        react_1.default.createElement(react_admin_1.Resource, { name: "customers", list: common_1.CustomerList, edit: CustomerEditAutoClose, create: common_1.CustomerCreate })));
};
exports.AutoClose = AutoClose;
var CustomToolbar = function () {
    var history = (0, history_1.createHashHistory)();
    (0, react_1.useEffect)(function () {
        history.replace('/customers/5/edit');
    }, [history]);
    return (react_1.default.createElement(react_admin_1.Admin, { dataProvider: common_1.dataProvider, i18nProvider: i18nProvider_1.default, history: history },
        react_1.default.createElement(react_admin_1.Resource, { name: "customers", list: common_1.CustomerList, edit: CustomerEditWithToolbar, create: common_1.CustomerCreate })));
};
exports.CustomToolbar = CustomToolbar;
var DarkMode = function () {
    var history = (0, history_1.createHashHistory)();
    (0, react_1.useEffect)(function () {
        history.replace('/customers/5/edit');
    }, [history]);
    return (react_1.default.createElement(react_admin_1.Admin, { history: history, dataProvider: common_1.dataProvider, theme: { palette: { mode: 'dark' } } },
        react_1.default.createElement(react_admin_1.Resource, { name: "customers", list: common_1.CustomerList, edit: CustomerEdit, create: common_1.CustomerCreate })));
};
exports.DarkMode = DarkMode;
exports.default = { title: 'ra-form-layout/AccordionForm' };
