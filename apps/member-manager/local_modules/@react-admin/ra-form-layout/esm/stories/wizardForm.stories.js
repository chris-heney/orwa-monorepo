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
import fakeRestProvider from 'ra-data-fakerest';
import { createMemoryHistory } from 'history';
import { useFormState, useWatch } from 'react-hook-form';
import { Admin, Create, Edit, List, required, Resource, Show, SimpleForm, SimpleList, SimpleShowLayout, TextField, TextInput, useRegisterMutationMiddleware, useSaveContext, } from 'react-admin';
import { Button, Stack, Typography } from '@mui/material';
import { useWizardFormContext, useWizardFormStepContext, WizardForm, WizardFormStep, WizardProgress, } from '../src';
import i18nProvider, { frenchI18nProvider } from './i18nProvider';
var dataProvider = fakeRestProvider({
    posts: [
        { id: 1, title: 'Lorem Ipsum', description: '' },
        { id: 2, title: 'Sic dolor amet', description: 'Almost empty' },
    ],
}, true);
export default {
    title: 'ra-form-layout/Wizard Form',
};
var PostList = function () { return (React.createElement(List, null,
    React.createElement(SimpleList, { primaryText: function (record) { return record.title; } }))); };
var PostEdit = function () { return (React.createElement(Edit, null,
    React.createElement(SimpleForm, null,
        React.createElement(TextInput, { source: "title", fullWidth: true }),
        React.createElement(TextInput, { source: "description", fullWidth: true }),
        React.createElement(TextInput, { source: "fullDescription", fullWidth: true })))); };
var FinalStepContent = function () {
    var values = useWatch({
        name: ['title', 'description', 'fullDescription'],
    });
    return (values === null || values === void 0 ? void 0 : values.length) > 0 ? (React.createElement(React.Fragment, null,
        React.createElement(Typography, null,
            "title: ",
            values[0]),
        React.createElement(Typography, null,
            "description: ",
            values[1]),
        React.createElement(Typography, null,
            "fullDescription: ",
            values[2]))) : null;
};
var PostCreate = function () { return (React.createElement(Create, { sx: { maxWidth: '50%' } },
    React.createElement(WizardForm, null,
        React.createElement(WizardFormStep, { label: "First step" },
            React.createElement(TextInput, { source: "title", validate: required() })),
        React.createElement(WizardFormStep, { label: "Second step" },
            React.createElement(TextInput, { source: "description", validate: required() })),
        React.createElement(WizardFormStep, { label: "Third step" },
            React.createElement(TextInput, { source: "fullDescription", validate: required() }))))); };
var PostShow = function () { return (React.createElement(Show, null,
    React.createElement(SimpleShowLayout, null,
        React.createElement(TextField, { source: "title" }),
        React.createElement(TextField, { source: "description" }),
        React.createElement(TextField, { source: "fullDescription" })))); };
export var Basic = function () { return (React.createElement(Admin, { history: createMemoryHistory({
        initialEntries: ['/posts/create'],
    }), i18nProvider: i18nProvider, dataProvider: dataProvider },
    React.createElement(Resource, { name: "posts", list: PostList, edit: PostEdit, show: PostShow, create: PostCreate }))); };
var PostCreateWithSummary = function () { return (React.createElement(Create, null,
    React.createElement(WizardForm, null,
        React.createElement(WizardFormStep, { label: "First step" },
            React.createElement(TextInput, { source: "title", validate: required() })),
        React.createElement(WizardFormStep, { label: "Second step" },
            React.createElement(TextInput, { source: "description", validate: required() })),
        React.createElement(WizardFormStep, { label: "Third step" },
            React.createElement(TextInput, { source: "fullDescription", validate: required() })),
        React.createElement(WizardFormStep, { label: "" },
            React.createElement(FinalStepContent, null))))); };
export var WithSummaryStep = function () { return (React.createElement(Admin, { history: createMemoryHistory({
        initialEntries: ['/posts/create'],
    }), i18nProvider: i18nProvider, dataProvider: dataProvider },
    React.createElement(Resource, { name: "posts", list: PostList, edit: PostEdit, show: PostShow, create: PostCreateWithSummary }))); };
var PostCreateI18N = function () { return (React.createElement(Create, null,
    React.createElement(WizardForm, null,
        React.createElement(WizardFormStep, { label: "resources.customers.steps.first" },
            React.createElement(TextInput, { source: "title", validate: required() })),
        React.createElement(WizardFormStep, { label: "resources.customers.steps.second" },
            React.createElement(TextInput, { source: "description" })),
        React.createElement(WizardFormStep, { label: "resources.customers.steps.third" },
            React.createElement(TextInput, { source: "fullDescription", validate: required() }))))); };
export var I18n = function () { return (React.createElement(Admin, { history: createMemoryHistory({
        initialEntries: ['/posts/create'],
    }), i18nProvider: frenchI18nProvider, dataProvider: dataProvider },
    React.createElement(Resource, { name: "posts", list: PostList, edit: PostEdit, show: PostShow, create: PostCreateI18N }))); };
I18n.storyName = 'I18n';
var PostCreateWithVerticalProgress = function () { return (React.createElement(Create, null,
    React.createElement(WizardForm, { progress: React.createElement(WizardProgress, { orientation: "vertical" }) },
        React.createElement(WizardFormStep, { label: "First step" },
            React.createElement(TextInput, { source: "title", validate: required() })),
        React.createElement(WizardFormStep, { label: "Second step" },
            React.createElement(TextInput, { source: "description" })),
        React.createElement(WizardFormStep, { label: "Third step" },
            React.createElement(TextInput, { source: "fullDescription", validate: required() }))))); };
export var VerticalProgress = function () { return (React.createElement(Admin, { history: createMemoryHistory({
        initialEntries: ['/posts/create'],
    }), dataProvider: dataProvider, i18nProvider: i18nProvider },
    React.createElement(Resource, { name: "posts", list: PostList, edit: PostEdit, show: PostShow, create: PostCreateWithVerticalProgress }))); };
var PostCustomToolbar = function () {
    var _a = useWizardFormContext(), hasNextStep = _a.hasNextStep, hasPreviousStep = _a.hasPreviousStep, goToNextStep = _a.goToNextStep, goToPreviousStep = _a.goToPreviousStep;
    var save = useSaveContext().save;
    var isValidating = useFormState().isValidating;
    return (React.createElement("ul", null,
        hasPreviousStep ? (React.createElement("li", null,
            React.createElement(Button, { onClick: function () { return goToPreviousStep(); } }, "PREVIOUS"))) : null,
        hasNextStep ? (React.createElement("li", null,
            React.createElement(Button, { disabled: isValidating, onClick: function () { return goToNextStep(); } }, "NEXT"))) : (React.createElement("li", null,
            React.createElement(Button, { disabled: isValidating, onClick: save }, "SAVE")))));
};
var PostCreateWithToolbar = function () { return (React.createElement(Create, null,
    React.createElement(WizardForm, { toolbar: React.createElement(PostCustomToolbar, null) },
        React.createElement(WizardFormStep, { label: "First step" },
            React.createElement(TextInput, { source: "title", validate: required() })),
        React.createElement(WizardFormStep, { label: "Second step" },
            React.createElement(TextInput, { source: "description" })),
        React.createElement(WizardFormStep, { label: "Third step" },
            React.createElement(TextInput, { source: "fullDescription", validate: required() })),
        React.createElement(WizardFormStep, { label: "" },
            React.createElement(FinalStepContent, null))))); };
export var CustomToolbar = function () { return (React.createElement(Admin, { history: createMemoryHistory({
        initialEntries: ['/posts/create'],
    }), i18nProvider: i18nProvider, dataProvider: dataProvider },
    React.createElement(Resource, { name: "posts", list: PostList, edit: PostEdit, show: PostShow, create: PostCreateWithToolbar }))); };
export var DarkMode = function () { return (React.createElement(Admin, { history: createMemoryHistory({
        initialEntries: ['/posts/create'],
    }), i18nProvider: i18nProvider, dataProvider: dataProvider, theme: { palette: { mode: 'dark' } } },
    React.createElement(Resource, { name: "posts", list: PostList, edit: PostEdit, show: PostShow, create: PostCreate }))); };
var PostCreateWithMultilineTextInput = function () { return (React.createElement(Create, null,
    React.createElement(WizardForm, null,
        React.createElement(WizardFormStep, { label: "First step" },
            React.createElement(TextInput, { source: "title", validate: required() })),
        React.createElement(WizardFormStep, { label: "Second step" },
            React.createElement(TextInput, { source: "description", multiline: true, rows: 4, fullWidth: true, validate: required() })),
        React.createElement(WizardFormStep, { label: "Third step" },
            React.createElement(TextInput, { source: "fullDescription", validate: required() })),
        React.createElement(WizardFormStep, { label: "" },
            React.createElement(FinalStepContent, null))))); };
export var WithMultilineTextInputStep = function () { return (React.createElement(Admin, { history: createMemoryHistory({
        initialEntries: ['/posts/create'],
    }), i18nProvider: i18nProvider, dataProvider: dataProvider },
    React.createElement(Resource, { name: "posts", list: PostList, edit: PostEdit, show: PostShow, create: PostCreateWithMultilineTextInput }))); };
var AdditiveWizardFormStep = function (props) {
    var context = useWizardFormStepContext();
    return (React.createElement(Stack, null,
        React.createElement(WizardFormStep, __assign({}, props, { active: context.currentStep >= context.step }))));
};
var PostCreateWithAdditiveSteps = function () { return (React.createElement(Create, { sx: { maxWidth: '50%' } },
    React.createElement(WizardForm, null,
        React.createElement(AdditiveWizardFormStep, { label: "First step" },
            React.createElement(TextInput, { source: "title", validate: required() })),
        React.createElement(AdditiveWizardFormStep, { label: "Second step" },
            React.createElement(TextInput, { source: "description" })),
        React.createElement(AdditiveWizardFormStep, { label: "Third step" },
            React.createElement(TextInput, { source: "fullDescription", validate: required() })),
        React.createElement(AdditiveWizardFormStep, { label: "" },
            React.createElement(FinalStepContent, null))))); };
export var AdditiveSteps = function () { return (React.createElement(Admin, { history: createMemoryHistory({
        initialEntries: ['/posts/create'],
    }), i18nProvider: i18nProvider, dataProvider: dataProvider },
    React.createElement(Resource, { name: "posts", list: PostList, edit: PostEdit, show: PostShow, create: PostCreateWithAdditiveSteps }))); };
var MiddlewareInput = function (props) {
    var middleware = React.useCallback(function (resource, params, options, next) {
        var newData = __assign({}, params.data);
        newData[props.source] = "".concat(params.data[props.source], " (modified by middleware)");
        next(resource, __assign(__assign({}, params), { data: newData }), options);
    }, [props.source]);
    useRegisterMutationMiddleware(middleware);
    return React.createElement(TextInput, __assign({}, props));
};
var PostCreateWithMiddleware = function () { return (React.createElement(Create, { resource: "posts", record: {
        title: 'test-title',
        description: 'test-description',
        fullDescription: 'test-fullDescriptio',
    } },
    React.createElement(WizardForm, null,
        React.createElement(WizardFormStep, { label: "First step" },
            React.createElement(MiddlewareInput, { source: "title" })),
        React.createElement(WizardFormStep, { label: "Second step" },
            React.createElement(MiddlewareInput, { source: "description" })),
        React.createElement(WizardFormStep, { label: "Third step" },
            React.createElement(MiddlewareInput, { source: "fullDescription" }))))); };
export var WithMiddleware = function () {
    return (React.createElement(Admin, { history: createMemoryHistory({
            initialEntries: ['/posts/create'],
        }), i18nProvider: i18nProvider, dataProvider: dataProvider },
        React.createElement(Resource, { name: "posts", list: PostList, edit: PostEdit, show: PostShow, create: PostCreateWithMiddleware })));
};
var CustomProgressBar = function (props) {
    var _a = useWizardFormContext(props), currentStep = _a.currentStep, steps = _a.steps;
    return (React.createElement("ul", null, steps.map(function (step, index) {
        var label = React.cloneElement(step, { intent: 'label' });
        return (React.createElement("li", { key: "step_".concat(index) },
            React.createElement("span", { style: {
                    textDecoration: currentStep === index
                        ? 'underline'
                        : undefined,
                } }, label)));
    })));
};
var PostCreateWithCustomProgress = function () { return (React.createElement(Create, null,
    React.createElement(WizardForm, { progress: React.createElement(CustomProgressBar, null) },
        React.createElement(WizardFormStep, { label: "First step" },
            React.createElement(TextInput, { source: "title", validate: required() })),
        React.createElement(WizardFormStep, { label: "Second step" },
            React.createElement(TextInput, { source: "description" })),
        React.createElement(WizardFormStep, { label: "Third step" },
            React.createElement(TextInput, { source: "fullDescription", validate: required() }))))); };
export var CustomProgress = function () { return (React.createElement(Admin, { history: createMemoryHistory({
        initialEntries: ['/posts/create'],
    }), dataProvider: dataProvider, i18nProvider: i18nProvider },
    React.createElement(Resource, { name: "posts", list: PostList, edit: PostEdit, show: PostShow, create: PostCreateWithCustomProgress }))); };
var CustomSxProgressBar = function () { return React.createElement(WizardProgress, { sx: { margin: 5 } }); };
var PostCreateWithCustomSxProgress = function () { return (React.createElement(Create, null,
    React.createElement(WizardForm, { progress: React.createElement(CustomSxProgressBar, null) },
        React.createElement(WizardFormStep, { label: "First step" },
            React.createElement(TextInput, { source: "title", validate: required() })),
        React.createElement(WizardFormStep, { label: "Second step" },
            React.createElement(TextInput, { source: "description" })),
        React.createElement(WizardFormStep, { label: "Third step" },
            React.createElement(TextInput, { source: "fullDescription", validate: required() }))))); };
export var CustomSxProgress = function () { return (React.createElement(Admin, { history: createMemoryHistory({
        initialEntries: ['/posts/create'],
    }), dataProvider: dataProvider, i18nProvider: i18nProvider },
    React.createElement(Resource, { name: "posts", list: PostList, edit: PostEdit, show: PostShow, create: PostCreateWithCustomSxProgress }))); };
var PostCreateNoProgress = function () { return (React.createElement(Create, null,
    React.createElement(WizardForm, { progress: false },
        React.createElement(WizardFormStep, { label: "First step" },
            React.createElement(TextInput, { source: "title", validate: required() })),
        React.createElement(WizardFormStep, { label: "Second step" },
            React.createElement(TextInput, { source: "description", validate: required() })),
        React.createElement(WizardFormStep, { label: "Third step" },
            React.createElement(TextInput, { source: "fullDescription", validate: required() })),
        React.createElement(WizardFormStep, { label: "" },
            React.createElement(FinalStepContent, null))))); };
export var NoProgress = function () { return (React.createElement(Admin, { history: createMemoryHistory({
        initialEntries: ['/posts/create'],
    }), i18nProvider: i18nProvider, dataProvider: dataProvider },
    React.createElement(Resource, { name: "posts", list: PostList, edit: PostEdit, show: PostShow, create: PostCreateNoProgress }))); };
