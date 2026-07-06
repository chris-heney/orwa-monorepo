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
exports.HelperText = exports.DefaultValue = exports.Required = exports.NotFullWidth = exports.Basic = void 0;
var material_1 = require("@mui/material");
var ra_i18n_polyglot_1 = __importDefault(require("ra-i18n-polyglot"));
var ra_language_english_1 = __importDefault(require("ra-language-english"));
var ra_language_french_1 = __importDefault(require("ra-language-french"));
var React = __importStar(require("react"));
var react_admin_1 = require("react-admin");
var react_hook_form_1 = require("react-hook-form");
var __1 = require("..");
exports.default = {
    title: 'ra-form-layout/InputSelector',
};
var getI18nProvider = function () {
    return (0, ra_i18n_polyglot_1.default)(function (locale) {
        return locale === 'en'
            ? (0, react_admin_1.mergeTranslations)(ra_language_english_1.default)
            : (0, react_admin_1.mergeTranslations)(ra_language_french_1.default);
    }, 'en', [
        { locale: 'en', name: 'English' },
        { locale: 'fr', name: 'Français' },
    ]);
};
var FormContextWatcher = function () {
    var values = (0, react_hook_form_1.useWatch)();
    return (React.createElement(material_1.Box, { sx: { width: '100%' } },
        React.createElement(material_1.Alert, { severity: "info", sx: { mx: 1 } },
            React.createElement(material_1.Typography, null, "Record values"),
            React.createElement("pre", null, JSON.stringify(values, null, 2)))));
};
var Basic = function () { return (React.createElement(react_admin_1.AdminContext, { i18nProvider: getI18nProvider() },
    React.createElement(react_admin_1.Create, { resource: "posts" },
        React.createElement(react_admin_1.SimpleForm, { onSubmit: function (values) {
                // eslint-disable-next-line no-console
                console.log(values);
            } },
            React.createElement(__1.InputSelector, { source: "@@ra-form-layout-inputs", inputs: [
                    'title',
                    'body',
                    'teaser',
                    'average_note',
                    'published_at',
                ] }),
            React.createElement(FormContextWatcher, null))))); };
exports.Basic = Basic;
var NotFullWidth = function () { return (React.createElement(react_admin_1.AdminContext, { i18nProvider: getI18nProvider() },
    React.createElement(react_admin_1.Create, { resource: "posts" },
        React.createElement(react_admin_1.SimpleForm, { onSubmit: function (values) {
                // eslint-disable-next-line no-console
                console.log(values);
            } },
            React.createElement(__1.InputSelector, { source: "@@ra-form-layout-inputs", inputs: [
                    'title',
                    'body',
                    'teaser',
                    'average_note',
                    'published_at',
                ], fullWidth: false }),
            React.createElement(FormContextWatcher, null))))); };
exports.NotFullWidth = NotFullWidth;
var Required = function () { return (React.createElement(react_admin_1.AdminContext, { i18nProvider: getI18nProvider() },
    React.createElement(react_admin_1.Create, { resource: "posts" },
        React.createElement(react_admin_1.SimpleForm, { onSubmit: function (values) {
                // eslint-disable-next-line no-console
                console.log(values);
            }, toolbar: React.createElement(react_admin_1.Toolbar, null,
                React.createElement(react_admin_1.SaveButton, { alwaysEnable: true })) },
            React.createElement(__1.InputSelector, { source: "@@ra-form-layout-inputs", inputs: [
                    'title',
                    'body',
                    'teaser',
                    'average_note',
                    'published_at',
                ], validate: (0, react_admin_1.required)() }),
            React.createElement(FormContextWatcher, null))))); };
exports.Required = Required;
var DefaultValue = function () { return (React.createElement(react_admin_1.AdminContext, { i18nProvider: getI18nProvider() },
    React.createElement(react_admin_1.Create, { resource: "posts" },
        React.createElement(react_admin_1.SimpleForm, { onSubmit: function (values) {
                // eslint-disable-next-line no-console
                console.log(values);
            }, toolbar: React.createElement(react_admin_1.Toolbar, null,
                React.createElement(react_admin_1.SaveButton, { alwaysEnable: true })) },
            React.createElement(__1.InputSelector, { source: "@@ra-form-layout-inputs", inputs: [
                    'title',
                    'body',
                    'teaser',
                    'average_note',
                    'published_at',
                ], defaultValue: ['title', 'teaser'] }),
            React.createElement(FormContextWatcher, null))))); };
exports.DefaultValue = DefaultValue;
var HelperText = function () { return (React.createElement(react_admin_1.AdminContext, { i18nProvider: getI18nProvider() },
    React.createElement(react_admin_1.Create, { resource: "posts" },
        React.createElement(react_admin_1.SimpleForm, { onSubmit: function (values) {
                // eslint-disable-next-line no-console
                console.log(values);
            }, toolbar: React.createElement(react_admin_1.Toolbar, null,
                React.createElement(react_admin_1.SaveButton, { alwaysEnable: true })) },
            React.createElement(__1.InputSelector, { source: "@@ra-form-layout-inputs", inputs: [
                    'title',
                    'body',
                    'teaser',
                    'average_note',
                    'published_at',
                ], validate: (0, react_admin_1.required)(), helperText: "Please select at least one input" }),
            React.createElement(FormContextWatcher, null))))); };
exports.HelperText = HelperText;
