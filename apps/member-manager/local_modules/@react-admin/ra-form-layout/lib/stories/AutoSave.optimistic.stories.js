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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithSaveButton = exports.SubmissionError = exports.WithServerSideValidation = exports.InWizardForm = exports.InLongForm = exports.InAccordionForm = exports.InTabbedForm = exports.InSimpleForm = void 0;
var react_1 = __importDefault(require("react"));
var react_admin_1 = require("react-admin");
var material_1 = require("@mui/material");
var react_query_1 = require("react-query");
var common_1 = require("./common");
var i18nProvider_1 = __importDefault(require("./i18nProvider"));
var src_1 = require("../src");
exports.default = { title: 'ra-form-layout/AutoSave/optimistic' };
var slowerDataProvider = __assign(__assign({}, common_1.dataProvider), { update: function (resource, params) {
        return new Promise(function (resolve) {
            return setTimeout(function () { return resolve(common_1.dataProvider.update(resource, params)); }, 1000);
        });
    } });
var InSimpleForm = function (_a) {
    var _b = _a.dataProvider, dataProvider = _b === void 0 ? slowerDataProvider : _b, debounce = _a.debounce, confirmationDuration = _a.confirmationDuration;
    return (react_1.default.createElement(react_admin_1.AdminContext, { queryClient: new react_query_1.QueryClient({
            defaultOptions: { mutations: { retry: false } },
        }), dataProvider: dataProvider, i18nProvider: i18nProvider_1.default },
        react_1.default.createElement(react_admin_1.EditBase, { id: 1, resource: "customers", mutationMode: "optimistic" },
            react_1.default.createElement(react_admin_1.SimpleForm, { toolbar: react_1.default.createElement(react_admin_1.Toolbar, null,
                    react_1.default.createElement(src_1.AutoSave, { debounce: debounce, confirmationDuration: confirmationDuration })), resetOptions: { keepDirtyValues: true } },
                react_1.default.createElement(react_admin_1.TextInput, { source: "first_name", validate: (0, react_admin_1.required)() }),
                react_1.default.createElement(react_admin_1.TextInput, { source: "last_name", validate: (0, react_admin_1.required)() }),
                react_1.default.createElement(react_admin_1.DateInput, { source: "dob", validate: (0, react_admin_1.required)() }),
                react_1.default.createElement(react_admin_1.SelectInput, { source: "sex", choices: common_1.sexChoices, validate: (0, react_admin_1.required)() })))));
};
exports.InSimpleForm = InSimpleForm;
exports.InSimpleForm.args = {
    debounce: 3000,
    confirmationDuration: 3000,
};
var InTabbedForm = function () { return (react_1.default.createElement(react_admin_1.AdminContext, { dataProvider: slowerDataProvider, i18nProvider: i18nProvider_1.default },
    react_1.default.createElement(react_admin_1.EditBase, { id: 1, resource: "customers", mutationMode: "optimistic" },
        react_1.default.createElement(react_admin_1.TabbedForm, { toolbar: react_1.default.createElement(react_admin_1.Toolbar, null,
                react_1.default.createElement(src_1.AutoSave, null)), resetOptions: { keepDirtyValues: true } },
            react_1.default.createElement(react_admin_1.TabbedForm.Tab, { label: "Identity" },
                react_1.default.createElement(react_admin_1.TextInput, { source: "first_name", validate: (0, react_admin_1.required)() }),
                react_1.default.createElement(react_admin_1.TextInput, { source: "last_name", validate: (0, react_admin_1.required)() })),
            react_1.default.createElement(react_admin_1.TabbedForm.Tab, { label: "Information" },
                react_1.default.createElement(react_admin_1.DateInput, { source: "dob", validate: (0, react_admin_1.required)() }),
                react_1.default.createElement(react_admin_1.SelectInput, { source: "sex", choices: common_1.sexChoices, validate: (0, react_admin_1.required)() })))))); };
exports.InTabbedForm = InTabbedForm;
var InAccordionForm = function () { return (react_1.default.createElement(react_admin_1.AdminContext, { dataProvider: slowerDataProvider, i18nProvider: i18nProvider_1.default },
    react_1.default.createElement(react_admin_1.EditBase, { id: 1, resource: "customers", mutationMode: "optimistic" },
        react_1.default.createElement(src_1.AccordionForm, { toolbar: react_1.default.createElement(react_admin_1.Toolbar, null,
                react_1.default.createElement(src_1.AutoSave, null)), resetOptions: { keepDirtyValues: true } },
            react_1.default.createElement(src_1.AccordionForm.Panel, { label: "Identity" },
                react_1.default.createElement(react_admin_1.TextInput, { source: "first_name", validate: (0, react_admin_1.required)() }),
                react_1.default.createElement(react_admin_1.TextInput, { source: "last_name", validate: (0, react_admin_1.required)() })),
            react_1.default.createElement(src_1.AccordionForm.Panel, { label: "Information" },
                react_1.default.createElement(react_admin_1.DateInput, { source: "dob", validate: (0, react_admin_1.required)() }),
                react_1.default.createElement(react_admin_1.SelectInput, { source: "sex", choices: common_1.sexChoices, validate: (0, react_admin_1.required)() })))))); };
exports.InAccordionForm = InAccordionForm;
var InLongForm = function () { return (react_1.default.createElement(react_admin_1.AdminContext, { dataProvider: slowerDataProvider, i18nProvider: i18nProvider_1.default },
    react_1.default.createElement(react_admin_1.EditBase, { id: 1, resource: "customers", mutationMode: "optimistic" },
        react_1.default.createElement(src_1.LongForm, { toolbar: react_1.default.createElement(react_admin_1.Toolbar, null,
                react_1.default.createElement(src_1.AutoSave, null)), resetOptions: { keepDirtyValues: true } },
            react_1.default.createElement(src_1.LongForm.Section, { label: "Identity" },
                react_1.default.createElement(react_admin_1.TextInput, { source: "first_name", validate: (0, react_admin_1.required)() }),
                react_1.default.createElement(react_admin_1.TextInput, { source: "last_name", validate: (0, react_admin_1.required)() }),
                react_1.default.createElement(react_admin_1.DateInput, { source: "dob", label: "born", validate: (0, react_admin_1.required)() }),
                react_1.default.createElement(react_admin_1.SelectInput, { source: "sex", choices: common_1.sexChoices })),
            react_1.default.createElement(src_1.LongForm.Section, { label: "Occupations" },
                react_1.default.createElement(react_admin_1.ArrayInput, { source: "occupations", label: "" },
                    react_1.default.createElement(react_admin_1.SimpleFormIterator, null,
                        react_1.default.createElement(react_admin_1.TextInput, { source: "name", validate: (0, react_admin_1.required)() }),
                        react_1.default.createElement(react_admin_1.DateInput, { source: "from", validate: (0, react_admin_1.required)() }),
                        react_1.default.createElement(react_admin_1.DateInput, { source: "to" })))),
            react_1.default.createElement(src_1.LongForm.Section, { label: "Preferences" },
                react_1.default.createElement(react_admin_1.SelectInput, { source: "language", choices: common_1.languageChoices, defaultValue: "en" }),
                react_1.default.createElement(react_admin_1.BooleanInput, { source: "dark_theme" }),
                react_1.default.createElement(react_admin_1.BooleanInput, { source: "accepts_emails_from_partners" })))))); };
exports.InLongForm = InLongForm;
var InWizardFormToolbar = function () {
    var hasNextStep = (0, src_1.useWizardFormContext)().hasNextStep;
    return (react_1.default.createElement(src_1.WizardToolbar, null,
        react_1.default.createElement(material_1.Grid, { container: true, direction: "row", justifyContent: "space-between", alignItems: "center" },
            react_1.default.createElement(material_1.Grid, { item: true, display: "flex", alignItems: "center" },
                react_1.default.createElement(src_1.PreviousButton, null),
                react_1.default.createElement(src_1.AutoSave, null)),
            react_1.default.createElement(material_1.Grid, { item: true }, hasNextStep ? react_1.default.createElement(src_1.NextButton, null) : react_1.default.createElement(react_admin_1.SaveButton, null)))));
};
var InWizardForm = function () { return (react_1.default.createElement(react_admin_1.AdminContext, { dataProvider: slowerDataProvider, i18nProvider: i18nProvider_1.default },
    react_1.default.createElement(react_admin_1.EditBase, { id: 1, resource: "customers", mutationMode: "optimistic" },
        react_1.default.createElement(src_1.WizardForm, { toolbar: react_1.default.createElement(InWizardFormToolbar, null), resetOptions: { keepDirtyValues: true } },
            react_1.default.createElement(src_1.WizardForm.Step, { label: "Identity" },
                react_1.default.createElement(react_admin_1.TextInput, { source: "first_name", validate: (0, react_admin_1.required)(), fullWidth: true }),
                react_1.default.createElement(react_admin_1.TextInput, { source: "last_name", validate: (0, react_admin_1.required)(), fullWidth: true })),
            react_1.default.createElement(src_1.WizardForm.Step, { label: "Information" },
                react_1.default.createElement(react_admin_1.DateInput, { source: "dob", validate: (0, react_admin_1.required)(), fullWidth: true }),
                react_1.default.createElement(react_admin_1.SelectInput, { source: "sex", choices: common_1.sexChoices, validate: (0, react_admin_1.required)(), fullWidth: true })))))); };
exports.InWizardForm = InWizardForm;
var WithServerSideValidation = function () {
    var localDataProvider = __assign(__assign({}, common_1.dataProvider), { update: function () {
            return Promise.reject(new react_admin_1.HttpError('An error occurred', 400, {
                errors: {
                    name: 'An employer with this name already exists. The name must be unique.',
                },
            }));
        } });
    return (react_1.default.createElement(react_admin_1.AdminContext, { dataProvider: localDataProvider, i18nProvider: i18nProvider_1.default },
        react_1.default.createElement(react_admin_1.EditBase, { id: 1, resource: "employers", mutationMode: "optimistic" },
            react_1.default.createElement(react_admin_1.SimpleForm, { toolbar: react_1.default.createElement(react_admin_1.Toolbar, null,
                    react_1.default.createElement(src_1.AutoSave, null)), resetOptions: { keepDirtyValues: true } },
                react_1.default.createElement(react_admin_1.TextInput, { source: "name", validate: (0, react_admin_1.required)() }),
                react_1.default.createElement(react_admin_1.TextInput, { source: "address", validate: (0, react_admin_1.required)() }),
                react_1.default.createElement(react_admin_1.TextInput, { source: "city", validate: (0, react_admin_1.required)() })))));
};
exports.WithServerSideValidation = WithServerSideValidation;
var SubmissionError = function () {
    var localDataProvider = __assign(__assign({}, common_1.dataProvider), { update: function (resource, _a) {
            var data = _a.data;
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    if (data.name === 'test') {
                        return reject(new react_admin_1.HttpError('Forbidden name', 400));
                    }
                    return resolve({ data: data });
                }, 100);
            });
        } });
    return (react_1.default.createElement(react_admin_1.AdminContext, { dataProvider: localDataProvider, i18nProvider: i18nProvider_1.default },
        react_1.default.createElement(react_admin_1.EditBase, { id: 1, resource: "employers", mutationMode: "optimistic" },
            react_1.default.createElement(react_admin_1.SimpleForm, { toolbar: react_1.default.createElement(react_admin_1.Toolbar, null,
                    react_1.default.createElement(src_1.AutoSave, null)), resetOptions: { keepDirtyValues: true } },
                react_1.default.createElement(material_1.Typography, null,
                    "Enter",
                    ' ',
                    react_1.default.createElement(material_1.Typography, { component: "span", sx: { fontWeight: 'bold' } }, "test"),
                    ' ',
                    "to get an error."),
                react_1.default.createElement(react_admin_1.TextInput, { source: "name", validate: (0, react_admin_1.required)() }),
                react_1.default.createElement(react_admin_1.TextInput, { source: "address", validate: (0, react_admin_1.required)() }),
                react_1.default.createElement(react_admin_1.TextInput, { source: "city", validate: (0, react_admin_1.required)() })))));
};
exports.SubmissionError = SubmissionError;
var WithSaveButton = function () { return (react_1.default.createElement(react_admin_1.AdminContext, { dataProvider: slowerDataProvider, i18nProvider: i18nProvider_1.default },
    react_1.default.createElement(react_admin_1.EditBase, { id: 1, resource: "customers", mutationMode: "optimistic" },
        react_1.default.createElement(react_admin_1.SimpleForm, { toolbar: react_1.default.createElement(react_admin_1.Toolbar, null,
                react_1.default.createElement(react_admin_1.SaveButton, null),
                react_1.default.createElement(src_1.AutoSave, null)), resetOptions: { keepDirtyValues: true } },
            react_1.default.createElement(react_admin_1.TextInput, { source: "first_name", validate: (0, react_admin_1.required)() }),
            react_1.default.createElement(react_admin_1.TextInput, { source: "last_name", validate: (0, react_admin_1.required)() }),
            react_1.default.createElement(react_admin_1.DateInput, { source: "dob", validate: (0, react_admin_1.required)() }),
            react_1.default.createElement(react_admin_1.SelectInput, { source: "sex", choices: common_1.sexChoices, validate: (0, react_admin_1.required)() }))))); };
exports.WithSaveButton = WithSaveButton;
