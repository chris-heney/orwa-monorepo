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
/* eslint-disable @typescript-eslint/ban-types */
import React, { useEffect, useState } from 'react';
import { Admin, AppBar, ArrayInput, BooleanInput, DateInput, Edit, required, Layout, Resource, SaveButton, SelectInput, SimpleFormIterator, TextField, TextInput, Toolbar as RaToolbar, Labeled, LocalesMenuButton, } from 'react-admin';
import { Typography } from '@mui/material';
import { createHashHistory } from 'history';
import { LongForm } from '../src';
import i18nProvider from './i18nProvider';
import { CustomerCreate, CustomerList, CustomerTitle, dataProvider, languageChoices, sexChoices, } from './common';
var CustomerEdit = function () { return (React.createElement(Edit, { component: "div", title: React.createElement(CustomerTitle, null) },
    React.createElement(LongForm, null,
        React.createElement(LongForm.Section, { label: "Identity" },
            React.createElement(Labeled, { label: "id" },
                React.createElement(TextField, { source: "id" })),
            React.createElement(TextInput, { source: "first_name", validate: required() }),
            React.createElement(TextInput, { source: "last_name", validate: required() }),
            React.createElement(DateInput, { source: "dob", label: "born", validate: required() }),
            React.createElement(SelectInput, { source: "sex", choices: sexChoices })),
        React.createElement(LongForm.Section, { label: "Occupations" },
            React.createElement(ArrayInput, { source: "occupations", label: "" },
                React.createElement(SimpleFormIterator, null,
                    React.createElement(TextInput, { source: "name", validate: required() }),
                    React.createElement(DateInput, { source: "from", validate: required() }),
                    React.createElement(DateInput, { source: "to" })))),
        React.createElement(LongForm.Section, { label: "Preferences" },
            React.createElement(SelectInput, { source: "language", choices: languageChoices, defaultValue: "en" }),
            React.createElement(BooleanInput, { source: "dark_theme" }),
            React.createElement(BooleanInput, { source: "accepts_emails_from_partners" }))))); };
export var Basic = function () {
    var history = createHashHistory();
    useEffect(function () {
        history.replace('/customers/5/edit');
    }, [history]);
    return (React.createElement(Admin, { dataProvider: dataProvider, i18nProvider: i18nProvider, history: history },
        React.createElement(Resource, { name: "customers", list: CustomerList, edit: CustomerEdit, create: CustomerCreate })));
};
var CustomerEditWithCardinality = function () {
    var _a = useState([]), publications = _a[0], setPublications = _a[1];
    useEffect(function () {
        setTimeout(function () {
            setPublications([
                { id: 1, title: 'Publication 1' },
                { id: 2, title: 'Publication 2' },
                { id: 3, title: 'Publication 3' },
            ]);
        }, 500);
    }, []);
    return (React.createElement(Edit, { component: "div", title: React.createElement(CustomerTitle, null) },
        React.createElement(LongForm, null,
            React.createElement(LongForm.Section, { label: "Identity" },
                React.createElement(Labeled, { label: "id" },
                    React.createElement(TextField, { source: "id" })),
                React.createElement(TextInput, { source: "first_name", validate: required() }),
                React.createElement(TextInput, { source: "last_name", validate: required() }),
                React.createElement(DateInput, { source: "dob", label: "born", validate: required() }),
                React.createElement(SelectInput, { source: "sex", choices: sexChoices })),
            React.createElement(LongForm.Section, { label: "Occupations" },
                React.createElement(ArrayInput, { source: "occupations", label: "" },
                    React.createElement(SimpleFormIterator, null,
                        React.createElement(TextInput, { source: "name", validate: required() }),
                        React.createElement(DateInput, { source: "from", validate: required() }),
                        React.createElement(DateInput, { source: "to" })))),
            React.createElement(LongForm.Section, { label: "Preferences" },
                React.createElement(SelectInput, { source: "language", choices: languageChoices, defaultValue: "en" }),
                React.createElement(BooleanInput, { source: "dark_theme" }),
                React.createElement(BooleanInput, { source: "accepts_emails_from_partners" })),
            React.createElement(LongForm.Section, { label: "Publications", cardinality: publications.length },
                React.createElement("ul", null, publications.map(function (publication) { return (React.createElement("li", { key: publication.id },
                    React.createElement(TextField, { source: "title", record: publication }))); }))))));
};
export var Cardinality = function () {
    var history = createHashHistory();
    useEffect(function () {
        history.replace('/customers/5/edit');
    }, [history]);
    return (React.createElement(Admin, { dataProvider: dataProvider, i18nProvider: i18nProvider, history: history },
        React.createElement(Resource, { name: "customers", list: CustomerList, edit: CustomerEditWithCardinality, create: CustomerCreate })));
};
var CustomerCustomToolbar = function (props) { return (React.createElement(RaToolbar, __assign({}, props),
    React.createElement(SaveButton, { label: "Save and return", type: "button", variant: "outlined" }))); };
var CustomerEditWithToolbar = function () { return (React.createElement(Edit, { component: "div", title: React.createElement(CustomerTitle, null) },
    React.createElement(LongForm, { toolbar: React.createElement(CustomerCustomToolbar, null) },
        React.createElement(LongForm.Section, { label: "Identity" },
            React.createElement(Labeled, { label: "id" },
                React.createElement(TextField, { source: "id" })),
            React.createElement(TextInput, { source: "first_name", validate: required() }),
            React.createElement(TextInput, { source: "last_name", validate: required() }),
            React.createElement(DateInput, { source: "dob", label: "born", validate: required() }),
            React.createElement(SelectInput, { source: "sex", choices: sexChoices })),
        React.createElement(LongForm.Section, { label: "Occupations" },
            React.createElement(ArrayInput, { source: "occupations", label: "" },
                React.createElement(SimpleFormIterator, null,
                    React.createElement(TextInput, { source: "name", validate: required() }),
                    React.createElement(DateInput, { source: "from", validate: required() }),
                    React.createElement(DateInput, { source: "to" })))),
        React.createElement(LongForm.Section, { label: "Preferences" },
            React.createElement(SelectInput, { source: "language", choices: languageChoices, defaultValue: "en" }),
            React.createElement(BooleanInput, { source: "dark_theme" }),
            React.createElement(BooleanInput, { source: "accepts_emails_from_partners" }))))); };
export var Toolbar = function () {
    var history = createHashHistory();
    useEffect(function () {
        history.replace('/customers/5/edit');
    }, [history]);
    return (React.createElement(Admin, { dataProvider: dataProvider, i18nProvider: i18nProvider, history: history },
        React.createElement(Resource, { name: "customers", list: CustomerList, edit: CustomerEditWithToolbar, create: CustomerCreate })));
};
var CustomerEditWithI18n = function () { return (React.createElement(Edit, { component: "div", title: React.createElement(CustomerTitle, null) },
    React.createElement(LongForm, { toolbar: React.createElement(CustomerCustomToolbar, null) },
        React.createElement(LongForm.Section, { label: "resources.customers.sections.identity" },
            React.createElement(Labeled, { label: "id" },
                React.createElement(TextField, { source: "id" })),
            React.createElement(TextInput, { source: "first_name", validate: required() }),
            React.createElement(TextInput, { source: "last_name", validate: required() }),
            React.createElement(DateInput, { source: "dob", label: "born", validate: required() }),
            React.createElement(SelectInput, { source: "sex", choices: sexChoices })),
        React.createElement(LongForm.Section, { label: "resources.customers.sections.occupations" },
            React.createElement(ArrayInput, { source: "occupations", label: "" },
                React.createElement(SimpleFormIterator, null,
                    React.createElement(TextInput, { source: "name", validate: required() }),
                    React.createElement(DateInput, { source: "from", validate: required() }),
                    React.createElement(DateInput, { source: "to" })))),
        React.createElement(LongForm.Section, { label: "resources.customers.sections.preferences" },
            React.createElement(SelectInput, { source: "language", choices: languageChoices, defaultValue: "en" }),
            React.createElement(BooleanInput, { source: "dark_theme" }),
            React.createElement(BooleanInput, { source: "accepts_emails_from_partners" }))))); };
var MyAppBar = function (props) { return (React.createElement(AppBar, __assign({}, props),
    React.createElement(Typography, { flex: "1", variant: "h6", id: "react-admin-title" }),
    React.createElement(LocalesMenuButton, { languages: [
            { locale: 'en', name: 'English' },
            { locale: 'fr', name: 'Français' },
        ] }))); };
var MyLayout = function (props) { return React.createElement(Layout, __assign({}, props, { appBar: MyAppBar })); };
export var I18n = function () {
    var history = createHashHistory();
    useEffect(function () {
        history.replace('/customers/5/edit');
    }, [history]);
    return (React.createElement(Admin, { dataProvider: dataProvider, i18nProvider: i18nProvider, history: history, layout: MyLayout },
        React.createElement(Resource, { name: "customers", list: CustomerList, edit: CustomerEditWithI18n, create: CustomerCreate })));
};
export var DarkMode = function () {
    var history = createHashHistory();
    useEffect(function () {
        history.replace('/customers/5/edit');
    }, [history]);
    return (React.createElement(Admin, { history: history, dataProvider: dataProvider, theme: { palette: { mode: 'dark' } } },
        React.createElement(Resource, { name: "customers", list: CustomerList, edit: CustomerEdit, create: CustomerCreate })));
};
export default { title: 'ra-form-layout/LongForm' };
