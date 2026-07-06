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
import React from 'react';
import { AdminContext, ArrayInput, BooleanInput, DateInput, EditBase, HttpError, SaveButton, SelectInput, SimpleForm, SimpleFormIterator, TabbedForm, TextInput, Toolbar, required, } from 'react-admin';
import { Grid, Typography } from '@mui/material';
import { QueryClient } from 'react-query';
import { dataProvider, languageChoices, sexChoices } from './common';
import i18nProvider from './i18nProvider';
import { AccordionForm, AutoSave, LongForm, NextButton, PreviousButton, WizardForm, WizardToolbar, useWizardFormContext, } from '../src';
export default { title: 'ra-form-layout/AutoSave/optimistic' };
var slowerDataProvider = __assign(__assign({}, dataProvider), { update: function (resource, params) {
        return new Promise(function (resolve) {
            return setTimeout(function () { return resolve(dataProvider.update(resource, params)); }, 1000);
        });
    } });
export var InSimpleForm = function (_a) {
    var _b = _a.dataProvider, dataProvider = _b === void 0 ? slowerDataProvider : _b, debounce = _a.debounce, confirmationDuration = _a.confirmationDuration;
    return (React.createElement(AdminContext, { queryClient: new QueryClient({
            defaultOptions: { mutations: { retry: false } },
        }), dataProvider: dataProvider, i18nProvider: i18nProvider },
        React.createElement(EditBase, { id: 1, resource: "customers", mutationMode: "optimistic" },
            React.createElement(SimpleForm, { toolbar: React.createElement(Toolbar, null,
                    React.createElement(AutoSave, { debounce: debounce, confirmationDuration: confirmationDuration })), resetOptions: { keepDirtyValues: true } },
                React.createElement(TextInput, { source: "first_name", validate: required() }),
                React.createElement(TextInput, { source: "last_name", validate: required() }),
                React.createElement(DateInput, { source: "dob", validate: required() }),
                React.createElement(SelectInput, { source: "sex", choices: sexChoices, validate: required() })))));
};
InSimpleForm.args = {
    debounce: 3000,
    confirmationDuration: 3000,
};
export var InTabbedForm = function () { return (React.createElement(AdminContext, { dataProvider: slowerDataProvider, i18nProvider: i18nProvider },
    React.createElement(EditBase, { id: 1, resource: "customers", mutationMode: "optimistic" },
        React.createElement(TabbedForm, { toolbar: React.createElement(Toolbar, null,
                React.createElement(AutoSave, null)), resetOptions: { keepDirtyValues: true } },
            React.createElement(TabbedForm.Tab, { label: "Identity" },
                React.createElement(TextInput, { source: "first_name", validate: required() }),
                React.createElement(TextInput, { source: "last_name", validate: required() })),
            React.createElement(TabbedForm.Tab, { label: "Information" },
                React.createElement(DateInput, { source: "dob", validate: required() }),
                React.createElement(SelectInput, { source: "sex", choices: sexChoices, validate: required() })))))); };
export var InAccordionForm = function () { return (React.createElement(AdminContext, { dataProvider: slowerDataProvider, i18nProvider: i18nProvider },
    React.createElement(EditBase, { id: 1, resource: "customers", mutationMode: "optimistic" },
        React.createElement(AccordionForm, { toolbar: React.createElement(Toolbar, null,
                React.createElement(AutoSave, null)), resetOptions: { keepDirtyValues: true } },
            React.createElement(AccordionForm.Panel, { label: "Identity" },
                React.createElement(TextInput, { source: "first_name", validate: required() }),
                React.createElement(TextInput, { source: "last_name", validate: required() })),
            React.createElement(AccordionForm.Panel, { label: "Information" },
                React.createElement(DateInput, { source: "dob", validate: required() }),
                React.createElement(SelectInput, { source: "sex", choices: sexChoices, validate: required() })))))); };
export var InLongForm = function () { return (React.createElement(AdminContext, { dataProvider: slowerDataProvider, i18nProvider: i18nProvider },
    React.createElement(EditBase, { id: 1, resource: "customers", mutationMode: "optimistic" },
        React.createElement(LongForm, { toolbar: React.createElement(Toolbar, null,
                React.createElement(AutoSave, null)), resetOptions: { keepDirtyValues: true } },
            React.createElement(LongForm.Section, { label: "Identity" },
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
                React.createElement(BooleanInput, { source: "accepts_emails_from_partners" })))))); };
var InWizardFormToolbar = function () {
    var hasNextStep = useWizardFormContext().hasNextStep;
    return (React.createElement(WizardToolbar, null,
        React.createElement(Grid, { container: true, direction: "row", justifyContent: "space-between", alignItems: "center" },
            React.createElement(Grid, { item: true, display: "flex", alignItems: "center" },
                React.createElement(PreviousButton, null),
                React.createElement(AutoSave, null)),
            React.createElement(Grid, { item: true }, hasNextStep ? React.createElement(NextButton, null) : React.createElement(SaveButton, null)))));
};
export var InWizardForm = function () { return (React.createElement(AdminContext, { dataProvider: slowerDataProvider, i18nProvider: i18nProvider },
    React.createElement(EditBase, { id: 1, resource: "customers", mutationMode: "optimistic" },
        React.createElement(WizardForm, { toolbar: React.createElement(InWizardFormToolbar, null), resetOptions: { keepDirtyValues: true } },
            React.createElement(WizardForm.Step, { label: "Identity" },
                React.createElement(TextInput, { source: "first_name", validate: required(), fullWidth: true }),
                React.createElement(TextInput, { source: "last_name", validate: required(), fullWidth: true })),
            React.createElement(WizardForm.Step, { label: "Information" },
                React.createElement(DateInput, { source: "dob", validate: required(), fullWidth: true }),
                React.createElement(SelectInput, { source: "sex", choices: sexChoices, validate: required(), fullWidth: true })))))); };
export var WithServerSideValidation = function () {
    var localDataProvider = __assign(__assign({}, dataProvider), { update: function () {
            return Promise.reject(new HttpError('An error occurred', 400, {
                errors: {
                    name: 'An employer with this name already exists. The name must be unique.',
                },
            }));
        } });
    return (React.createElement(AdminContext, { dataProvider: localDataProvider, i18nProvider: i18nProvider },
        React.createElement(EditBase, { id: 1, resource: "employers", mutationMode: "optimistic" },
            React.createElement(SimpleForm, { toolbar: React.createElement(Toolbar, null,
                    React.createElement(AutoSave, null)), resetOptions: { keepDirtyValues: true } },
                React.createElement(TextInput, { source: "name", validate: required() }),
                React.createElement(TextInput, { source: "address", validate: required() }),
                React.createElement(TextInput, { source: "city", validate: required() })))));
};
export var SubmissionError = function () {
    var localDataProvider = __assign(__assign({}, dataProvider), { update: function (resource, _a) {
            var data = _a.data;
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    if (data.name === 'test') {
                        return reject(new HttpError('Forbidden name', 400));
                    }
                    return resolve({ data: data });
                }, 100);
            });
        } });
    return (React.createElement(AdminContext, { dataProvider: localDataProvider, i18nProvider: i18nProvider },
        React.createElement(EditBase, { id: 1, resource: "employers", mutationMode: "optimistic" },
            React.createElement(SimpleForm, { toolbar: React.createElement(Toolbar, null,
                    React.createElement(AutoSave, null)), resetOptions: { keepDirtyValues: true } },
                React.createElement(Typography, null,
                    "Enter",
                    ' ',
                    React.createElement(Typography, { component: "span", sx: { fontWeight: 'bold' } }, "test"),
                    ' ',
                    "to get an error."),
                React.createElement(TextInput, { source: "name", validate: required() }),
                React.createElement(TextInput, { source: "address", validate: required() }),
                React.createElement(TextInput, { source: "city", validate: required() })))));
};
export var WithSaveButton = function () { return (React.createElement(AdminContext, { dataProvider: slowerDataProvider, i18nProvider: i18nProvider },
    React.createElement(EditBase, { id: 1, resource: "customers", mutationMode: "optimistic" },
        React.createElement(SimpleForm, { toolbar: React.createElement(Toolbar, null,
                React.createElement(SaveButton, null),
                React.createElement(AutoSave, null)), resetOptions: { keepDirtyValues: true } },
            React.createElement(TextInput, { source: "first_name", validate: required() }),
            React.createElement(TextInput, { source: "last_name", validate: required() }),
            React.createElement(DateInput, { source: "dob", validate: required() }),
            React.createElement(SelectInput, { source: "sex", choices: sexChoices, validate: required() }))))); };
