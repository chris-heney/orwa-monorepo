/* eslint-disable @typescript-eslint/ban-types */
import React, { useEffect } from 'react';
import { Admin, ArrayInput, BooleanInput, Resource, TextField, TextInput, DateInput, SelectInput, SimpleForm, SimpleFormIterator, Edit, required, Labeled, } from 'react-admin';
import { createHashHistory } from 'history';
import { blue, green } from '@mui/material/colors';
import { Typography } from '@mui/material';
import { AccordionSection } from '../src';
import i18nProvider from './i18nProvider';
import { dataProvider, sexChoices, languageChoices, CustomerList, CustomerCreate, CustomerTitle, } from './common';
var CustomerEdit = function () { return (React.createElement(Edit, { title: React.createElement(CustomerTitle, null) },
    React.createElement(SimpleForm, null,
        React.createElement(Labeled, { label: "id" },
            React.createElement(TextField, { source: "id" })),
        React.createElement(TextInput, { source: "first_name", validate: required() }),
        React.createElement(TextInput, { source: "last_name", validate: required() }),
        React.createElement(DateInput, { source: "dob", label: "born", validate: required() }),
        React.createElement(SelectInput, { source: "sex", choices: sexChoices }),
        React.createElement(AccordionSection, { label: "Occupations" },
            React.createElement(ArrayInput, { source: "occupations", label: "" },
                React.createElement(SimpleFormIterator, null,
                    React.createElement(TextInput, { source: "name", validate: required() }),
                    React.createElement(DateInput, { source: "from", validate: required() }),
                    React.createElement(DateInput, { source: "to" })))),
        React.createElement(AccordionSection, { label: "Preferences" },
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
var CustomerEditFullWidth = function () { return (React.createElement(Edit, { title: React.createElement(CustomerTitle, null) },
    React.createElement(SimpleForm, null,
        React.createElement(Labeled, { label: "id" },
            React.createElement(TextField, { source: "id" })),
        React.createElement(TextInput, { source: "first_name", validate: required() }),
        React.createElement(TextInput, { source: "last_name", validate: required() }),
        React.createElement(DateInput, { source: "dob", label: "born", validate: required() }),
        React.createElement(SelectInput, { source: "sex", choices: sexChoices }),
        React.createElement(Typography, { variant: "body2", sx: { padding: '8px 0' } },
            "A wrapper around ",
            React.createElement("code", null, "<AccordionSection>"),
            " elements garantees the right rounding."),
        React.createElement("div", null,
            React.createElement(AccordionSection, { label: "Occupations", fullWidth: true },
                React.createElement(ArrayInput, { source: "occupations", label: "" },
                    React.createElement(SimpleFormIterator, null,
                        React.createElement(TextInput, { source: "name", validate: required() }),
                        React.createElement(DateInput, { source: "from", validate: required() }),
                        React.createElement(DateInput, { source: "to" })))),
            React.createElement(AccordionSection, { label: "Preferences", fullWidth: true },
                React.createElement(SelectInput, { source: "language", choices: languageChoices, defaultValue: "en" }),
                React.createElement(BooleanInput, { source: "dark_theme" }),
                React.createElement(BooleanInput, { source: "accepts_emails_from_partners" })))))); };
export var FullWidth = function () {
    var history = createHashHistory();
    useEffect(function () {
        history.replace('/customers/5/edit');
    }, [history]);
    return (React.createElement(Admin, { dataProvider: dataProvider, i18nProvider: i18nProvider, history: history },
        React.createElement(Resource, { name: "customers", list: CustomerList, edit: CustomerEditFullWidth, create: CustomerCreate })));
};
var CustomerEditCustomStyles = function () { return (React.createElement(Edit, { title: React.createElement(CustomerTitle, null) },
    React.createElement(SimpleForm, null,
        React.createElement(Labeled, { label: "id" },
            React.createElement(TextField, { source: "id" })),
        React.createElement(TextInput, { source: "first_name", validate: required() }),
        React.createElement(TextInput, { source: "last_name", validate: required() }),
        React.createElement(DateInput, { source: "dob", label: "born", validate: required() }),
        React.createElement(SelectInput, { source: "sex", choices: sexChoices }),
        React.createElement(AccordionSection, { label: "Occupations", sx: {
                '& .RaAccordionSection-detail': {
                    backgroundColor: blue[100],
                },
            } },
            React.createElement(ArrayInput, { source: "occupations", label: "" },
                React.createElement(SimpleFormIterator, null,
                    React.createElement(TextInput, { source: "name", validate: required() }),
                    React.createElement(DateInput, { source: "from", validate: required() }),
                    React.createElement(DateInput, { source: "to" })))),
        React.createElement(AccordionSection, { label: "Preferences", sx: {
                '& .RaAccordionSection-detail': {
                    backgroundColor: green[100],
                },
            } },
            React.createElement(SelectInput, { source: "language", choices: languageChoices, defaultValue: "en" }),
            React.createElement(BooleanInput, { source: "dark_theme" }),
            React.createElement(BooleanInput, { source: "accepts_emails_from_partners" }))))); };
export var CustomStyles = function () {
    var history = createHashHistory();
    useEffect(function () {
        history.replace('/customers/5/edit');
    }, [history]);
    return (React.createElement(Admin, { dataProvider: dataProvider, i18nProvider: i18nProvider, history: history },
        React.createElement(Resource, { name: "customers", list: CustomerList, edit: CustomerEditCustomStyles, create: CustomerCreate })));
};
export default { title: 'ra-form-layout/AccordionSection' };
