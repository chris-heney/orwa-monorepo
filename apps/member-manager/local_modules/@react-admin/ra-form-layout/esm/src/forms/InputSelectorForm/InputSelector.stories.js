import { Alert, Box, Typography } from '@mui/material';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';
import * as React from 'react';
import { AdminContext, Create, SaveButton, SimpleForm, Toolbar, mergeTranslations, required, } from 'react-admin';
import { useWatch } from 'react-hook-form';
import { InputSelector } from '..';
export default {
    title: 'ra-form-layout/InputSelector',
};
var getI18nProvider = function () {
    return polyglotI18nProvider(function (locale) {
        return locale === 'en'
            ? mergeTranslations(englishMessages)
            : mergeTranslations(frenchMessages);
    }, 'en', [
        { locale: 'en', name: 'English' },
        { locale: 'fr', name: 'Français' },
    ]);
};
var FormContextWatcher = function () {
    var values = useWatch();
    return (React.createElement(Box, { sx: { width: '100%' } },
        React.createElement(Alert, { severity: "info", sx: { mx: 1 } },
            React.createElement(Typography, null, "Record values"),
            React.createElement("pre", null, JSON.stringify(values, null, 2)))));
};
export var Basic = function () { return (React.createElement(AdminContext, { i18nProvider: getI18nProvider() },
    React.createElement(Create, { resource: "posts" },
        React.createElement(SimpleForm, { onSubmit: function (values) {
                // eslint-disable-next-line no-console
                console.log(values);
            } },
            React.createElement(InputSelector, { source: "@@ra-form-layout-inputs", inputs: [
                    'title',
                    'body',
                    'teaser',
                    'average_note',
                    'published_at',
                ] }),
            React.createElement(FormContextWatcher, null))))); };
export var NotFullWidth = function () { return (React.createElement(AdminContext, { i18nProvider: getI18nProvider() },
    React.createElement(Create, { resource: "posts" },
        React.createElement(SimpleForm, { onSubmit: function (values) {
                // eslint-disable-next-line no-console
                console.log(values);
            } },
            React.createElement(InputSelector, { source: "@@ra-form-layout-inputs", inputs: [
                    'title',
                    'body',
                    'teaser',
                    'average_note',
                    'published_at',
                ], fullWidth: false }),
            React.createElement(FormContextWatcher, null))))); };
export var Required = function () { return (React.createElement(AdminContext, { i18nProvider: getI18nProvider() },
    React.createElement(Create, { resource: "posts" },
        React.createElement(SimpleForm, { onSubmit: function (values) {
                // eslint-disable-next-line no-console
                console.log(values);
            }, toolbar: React.createElement(Toolbar, null,
                React.createElement(SaveButton, { alwaysEnable: true })) },
            React.createElement(InputSelector, { source: "@@ra-form-layout-inputs", inputs: [
                    'title',
                    'body',
                    'teaser',
                    'average_note',
                    'published_at',
                ], validate: required() }),
            React.createElement(FormContextWatcher, null))))); };
export var DefaultValue = function () { return (React.createElement(AdminContext, { i18nProvider: getI18nProvider() },
    React.createElement(Create, { resource: "posts" },
        React.createElement(SimpleForm, { onSubmit: function (values) {
                // eslint-disable-next-line no-console
                console.log(values);
            }, toolbar: React.createElement(Toolbar, null,
                React.createElement(SaveButton, { alwaysEnable: true })) },
            React.createElement(InputSelector, { source: "@@ra-form-layout-inputs", inputs: [
                    'title',
                    'body',
                    'teaser',
                    'average_note',
                    'published_at',
                ], defaultValue: ['title', 'teaser'] }),
            React.createElement(FormContextWatcher, null))))); };
export var HelperText = function () { return (React.createElement(AdminContext, { i18nProvider: getI18nProvider() },
    React.createElement(Create, { resource: "posts" },
        React.createElement(SimpleForm, { onSubmit: function (values) {
                // eslint-disable-next-line no-console
                console.log(values);
            }, toolbar: React.createElement(Toolbar, null,
                React.createElement(SaveButton, { alwaysEnable: true })) },
            React.createElement(InputSelector, { source: "@@ra-form-layout-inputs", inputs: [
                    'title',
                    'body',
                    'teaser',
                    'average_note',
                    'published_at',
                ], validate: required(), helperText: "Please select at least one input" }),
            React.createElement(FormContextWatcher, null))))); };
