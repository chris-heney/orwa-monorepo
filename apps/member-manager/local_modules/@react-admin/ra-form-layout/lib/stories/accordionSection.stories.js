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
exports.CustomStyles = exports.FullWidth = exports.Basic = void 0;
/* eslint-disable @typescript-eslint/ban-types */
var react_1 = __importStar(require("react"));
var react_admin_1 = require("react-admin");
var history_1 = require("history");
var colors_1 = require("@mui/material/colors");
var material_1 = require("@mui/material");
var src_1 = require("../src");
var i18nProvider_1 = __importDefault(require("./i18nProvider"));
var common_1 = require("./common");
var CustomerEdit = function () { return (react_1.default.createElement(react_admin_1.Edit, { title: react_1.default.createElement(common_1.CustomerTitle, null) },
    react_1.default.createElement(react_admin_1.SimpleForm, null,
        react_1.default.createElement(react_admin_1.Labeled, { label: "id" },
            react_1.default.createElement(react_admin_1.TextField, { source: "id" })),
        react_1.default.createElement(react_admin_1.TextInput, { source: "first_name", validate: (0, react_admin_1.required)() }),
        react_1.default.createElement(react_admin_1.TextInput, { source: "last_name", validate: (0, react_admin_1.required)() }),
        react_1.default.createElement(react_admin_1.DateInput, { source: "dob", label: "born", validate: (0, react_admin_1.required)() }),
        react_1.default.createElement(react_admin_1.SelectInput, { source: "sex", choices: common_1.sexChoices }),
        react_1.default.createElement(src_1.AccordionSection, { label: "Occupations" },
            react_1.default.createElement(react_admin_1.ArrayInput, { source: "occupations", label: "" },
                react_1.default.createElement(react_admin_1.SimpleFormIterator, null,
                    react_1.default.createElement(react_admin_1.TextInput, { source: "name", validate: (0, react_admin_1.required)() }),
                    react_1.default.createElement(react_admin_1.DateInput, { source: "from", validate: (0, react_admin_1.required)() }),
                    react_1.default.createElement(react_admin_1.DateInput, { source: "to" })))),
        react_1.default.createElement(src_1.AccordionSection, { label: "Preferences" },
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
var CustomerEditFullWidth = function () { return (react_1.default.createElement(react_admin_1.Edit, { title: react_1.default.createElement(common_1.CustomerTitle, null) },
    react_1.default.createElement(react_admin_1.SimpleForm, null,
        react_1.default.createElement(react_admin_1.Labeled, { label: "id" },
            react_1.default.createElement(react_admin_1.TextField, { source: "id" })),
        react_1.default.createElement(react_admin_1.TextInput, { source: "first_name", validate: (0, react_admin_1.required)() }),
        react_1.default.createElement(react_admin_1.TextInput, { source: "last_name", validate: (0, react_admin_1.required)() }),
        react_1.default.createElement(react_admin_1.DateInput, { source: "dob", label: "born", validate: (0, react_admin_1.required)() }),
        react_1.default.createElement(react_admin_1.SelectInput, { source: "sex", choices: common_1.sexChoices }),
        react_1.default.createElement(material_1.Typography, { variant: "body2", sx: { padding: '8px 0' } },
            "A wrapper around ",
            react_1.default.createElement("code", null, "<AccordionSection>"),
            " elements garantees the right rounding."),
        react_1.default.createElement("div", null,
            react_1.default.createElement(src_1.AccordionSection, { label: "Occupations", fullWidth: true },
                react_1.default.createElement(react_admin_1.ArrayInput, { source: "occupations", label: "" },
                    react_1.default.createElement(react_admin_1.SimpleFormIterator, null,
                        react_1.default.createElement(react_admin_1.TextInput, { source: "name", validate: (0, react_admin_1.required)() }),
                        react_1.default.createElement(react_admin_1.DateInput, { source: "from", validate: (0, react_admin_1.required)() }),
                        react_1.default.createElement(react_admin_1.DateInput, { source: "to" })))),
            react_1.default.createElement(src_1.AccordionSection, { label: "Preferences", fullWidth: true },
                react_1.default.createElement(react_admin_1.SelectInput, { source: "language", choices: common_1.languageChoices, defaultValue: "en" }),
                react_1.default.createElement(react_admin_1.BooleanInput, { source: "dark_theme" }),
                react_1.default.createElement(react_admin_1.BooleanInput, { source: "accepts_emails_from_partners" })))))); };
var FullWidth = function () {
    var history = (0, history_1.createHashHistory)();
    (0, react_1.useEffect)(function () {
        history.replace('/customers/5/edit');
    }, [history]);
    return (react_1.default.createElement(react_admin_1.Admin, { dataProvider: common_1.dataProvider, i18nProvider: i18nProvider_1.default, history: history },
        react_1.default.createElement(react_admin_1.Resource, { name: "customers", list: common_1.CustomerList, edit: CustomerEditFullWidth, create: common_1.CustomerCreate })));
};
exports.FullWidth = FullWidth;
var CustomerEditCustomStyles = function () { return (react_1.default.createElement(react_admin_1.Edit, { title: react_1.default.createElement(common_1.CustomerTitle, null) },
    react_1.default.createElement(react_admin_1.SimpleForm, null,
        react_1.default.createElement(react_admin_1.Labeled, { label: "id" },
            react_1.default.createElement(react_admin_1.TextField, { source: "id" })),
        react_1.default.createElement(react_admin_1.TextInput, { source: "first_name", validate: (0, react_admin_1.required)() }),
        react_1.default.createElement(react_admin_1.TextInput, { source: "last_name", validate: (0, react_admin_1.required)() }),
        react_1.default.createElement(react_admin_1.DateInput, { source: "dob", label: "born", validate: (0, react_admin_1.required)() }),
        react_1.default.createElement(react_admin_1.SelectInput, { source: "sex", choices: common_1.sexChoices }),
        react_1.default.createElement(src_1.AccordionSection, { label: "Occupations", sx: {
                '& .RaAccordionSection-detail': {
                    backgroundColor: colors_1.blue[100],
                },
            } },
            react_1.default.createElement(react_admin_1.ArrayInput, { source: "occupations", label: "" },
                react_1.default.createElement(react_admin_1.SimpleFormIterator, null,
                    react_1.default.createElement(react_admin_1.TextInput, { source: "name", validate: (0, react_admin_1.required)() }),
                    react_1.default.createElement(react_admin_1.DateInput, { source: "from", validate: (0, react_admin_1.required)() }),
                    react_1.default.createElement(react_admin_1.DateInput, { source: "to" })))),
        react_1.default.createElement(src_1.AccordionSection, { label: "Preferences", sx: {
                '& .RaAccordionSection-detail': {
                    backgroundColor: colors_1.green[100],
                },
            } },
            react_1.default.createElement(react_admin_1.SelectInput, { source: "language", choices: common_1.languageChoices, defaultValue: "en" }),
            react_1.default.createElement(react_admin_1.BooleanInput, { source: "dark_theme" }),
            react_1.default.createElement(react_admin_1.BooleanInput, { source: "accepts_emails_from_partners" }))))); };
var CustomStyles = function () {
    var history = (0, history_1.createHashHistory)();
    (0, react_1.useEffect)(function () {
        history.replace('/customers/5/edit');
    }, [history]);
    return (react_1.default.createElement(react_admin_1.Admin, { dataProvider: common_1.dataProvider, i18nProvider: i18nProvider_1.default, history: history },
        react_1.default.createElement(react_admin_1.Resource, { name: "customers", list: common_1.CustomerList, edit: CustomerEditCustomStyles, create: common_1.CustomerCreate })));
};
exports.CustomStyles = CustomStyles;
exports.default = { title: 'ra-form-layout/AccordionSection' };
