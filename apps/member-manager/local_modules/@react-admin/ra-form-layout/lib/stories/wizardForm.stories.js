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
exports.NoProgress = exports.CustomSxProgress = exports.CustomProgress = exports.WithMiddleware = exports.AdditiveSteps = exports.WithMultilineTextInputStep = exports.DarkMode = exports.CustomToolbar = exports.VerticalProgress = exports.I18n = exports.WithSummaryStep = exports.Basic = void 0;
var react_1 = __importDefault(require("react"));
var ra_data_fakerest_1 = __importDefault(require("ra-data-fakerest"));
var history_1 = require("history");
var react_hook_form_1 = require("react-hook-form");
var react_admin_1 = require("react-admin");
var material_1 = require("@mui/material");
var src_1 = require("../src");
var i18nProvider_1 = __importStar(require("./i18nProvider"));
var dataProvider = (0, ra_data_fakerest_1.default)({
    posts: [
        { id: 1, title: 'Lorem Ipsum', description: '' },
        { id: 2, title: 'Sic dolor amet', description: 'Almost empty' },
    ],
}, true);
exports.default = {
    title: 'ra-form-layout/Wizard Form',
};
var PostList = function () { return (react_1.default.createElement(react_admin_1.List, null,
    react_1.default.createElement(react_admin_1.SimpleList, { primaryText: function (record) { return record.title; } }))); };
var PostEdit = function () { return (react_1.default.createElement(react_admin_1.Edit, null,
    react_1.default.createElement(react_admin_1.SimpleForm, null,
        react_1.default.createElement(react_admin_1.TextInput, { source: "title", fullWidth: true }),
        react_1.default.createElement(react_admin_1.TextInput, { source: "description", fullWidth: true }),
        react_1.default.createElement(react_admin_1.TextInput, { source: "fullDescription", fullWidth: true })))); };
var FinalStepContent = function () {
    var values = (0, react_hook_form_1.useWatch)({
        name: ['title', 'description', 'fullDescription'],
    });
    return (values === null || values === void 0 ? void 0 : values.length) > 0 ? (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(material_1.Typography, null,
            "title: ",
            values[0]),
        react_1.default.createElement(material_1.Typography, null,
            "description: ",
            values[1]),
        react_1.default.createElement(material_1.Typography, null,
            "fullDescription: ",
            values[2]))) : null;
};
var PostCreate = function () { return (react_1.default.createElement(react_admin_1.Create, { sx: { maxWidth: '50%' } },
    react_1.default.createElement(src_1.WizardForm, null,
        react_1.default.createElement(src_1.WizardFormStep, { label: "First step" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "title", validate: (0, react_admin_1.required)() })),
        react_1.default.createElement(src_1.WizardFormStep, { label: "Second step" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "description", validate: (0, react_admin_1.required)() })),
        react_1.default.createElement(src_1.WizardFormStep, { label: "Third step" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "fullDescription", validate: (0, react_admin_1.required)() }))))); };
var PostShow = function () { return (react_1.default.createElement(react_admin_1.Show, null,
    react_1.default.createElement(react_admin_1.SimpleShowLayout, null,
        react_1.default.createElement(react_admin_1.TextField, { source: "title" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "description" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "fullDescription" })))); };
var Basic = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)({
        initialEntries: ['/posts/create'],
    }), i18nProvider: i18nProvider_1.default, dataProvider: dataProvider },
    react_1.default.createElement(react_admin_1.Resource, { name: "posts", list: PostList, edit: PostEdit, show: PostShow, create: PostCreate }))); };
exports.Basic = Basic;
var PostCreateWithSummary = function () { return (react_1.default.createElement(react_admin_1.Create, null,
    react_1.default.createElement(src_1.WizardForm, null,
        react_1.default.createElement(src_1.WizardFormStep, { label: "First step" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "title", validate: (0, react_admin_1.required)() })),
        react_1.default.createElement(src_1.WizardFormStep, { label: "Second step" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "description", validate: (0, react_admin_1.required)() })),
        react_1.default.createElement(src_1.WizardFormStep, { label: "Third step" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "fullDescription", validate: (0, react_admin_1.required)() })),
        react_1.default.createElement(src_1.WizardFormStep, { label: "" },
            react_1.default.createElement(FinalStepContent, null))))); };
var WithSummaryStep = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)({
        initialEntries: ['/posts/create'],
    }), i18nProvider: i18nProvider_1.default, dataProvider: dataProvider },
    react_1.default.createElement(react_admin_1.Resource, { name: "posts", list: PostList, edit: PostEdit, show: PostShow, create: PostCreateWithSummary }))); };
exports.WithSummaryStep = WithSummaryStep;
var PostCreateI18N = function () { return (react_1.default.createElement(react_admin_1.Create, null,
    react_1.default.createElement(src_1.WizardForm, null,
        react_1.default.createElement(src_1.WizardFormStep, { label: "resources.customers.steps.first" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "title", validate: (0, react_admin_1.required)() })),
        react_1.default.createElement(src_1.WizardFormStep, { label: "resources.customers.steps.second" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "description" })),
        react_1.default.createElement(src_1.WizardFormStep, { label: "resources.customers.steps.third" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "fullDescription", validate: (0, react_admin_1.required)() }))))); };
var I18n = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)({
        initialEntries: ['/posts/create'],
    }), i18nProvider: i18nProvider_1.frenchI18nProvider, dataProvider: dataProvider },
    react_1.default.createElement(react_admin_1.Resource, { name: "posts", list: PostList, edit: PostEdit, show: PostShow, create: PostCreateI18N }))); };
exports.I18n = I18n;
exports.I18n.storyName = 'I18n';
var PostCreateWithVerticalProgress = function () { return (react_1.default.createElement(react_admin_1.Create, null,
    react_1.default.createElement(src_1.WizardForm, { progress: react_1.default.createElement(src_1.WizardProgress, { orientation: "vertical" }) },
        react_1.default.createElement(src_1.WizardFormStep, { label: "First step" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "title", validate: (0, react_admin_1.required)() })),
        react_1.default.createElement(src_1.WizardFormStep, { label: "Second step" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "description" })),
        react_1.default.createElement(src_1.WizardFormStep, { label: "Third step" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "fullDescription", validate: (0, react_admin_1.required)() }))))); };
var VerticalProgress = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)({
        initialEntries: ['/posts/create'],
    }), dataProvider: dataProvider, i18nProvider: i18nProvider_1.default },
    react_1.default.createElement(react_admin_1.Resource, { name: "posts", list: PostList, edit: PostEdit, show: PostShow, create: PostCreateWithVerticalProgress }))); };
exports.VerticalProgress = VerticalProgress;
var PostCustomToolbar = function () {
    var _a = (0, src_1.useWizardFormContext)(), hasNextStep = _a.hasNextStep, hasPreviousStep = _a.hasPreviousStep, goToNextStep = _a.goToNextStep, goToPreviousStep = _a.goToPreviousStep;
    var save = (0, react_admin_1.useSaveContext)().save;
    var isValidating = (0, react_hook_form_1.useFormState)().isValidating;
    return (react_1.default.createElement("ul", null,
        hasPreviousStep ? (react_1.default.createElement("li", null,
            react_1.default.createElement(material_1.Button, { onClick: function () { return goToPreviousStep(); } }, "PREVIOUS"))) : null,
        hasNextStep ? (react_1.default.createElement("li", null,
            react_1.default.createElement(material_1.Button, { disabled: isValidating, onClick: function () { return goToNextStep(); } }, "NEXT"))) : (react_1.default.createElement("li", null,
            react_1.default.createElement(material_1.Button, { disabled: isValidating, onClick: save }, "SAVE")))));
};
var PostCreateWithToolbar = function () { return (react_1.default.createElement(react_admin_1.Create, null,
    react_1.default.createElement(src_1.WizardForm, { toolbar: react_1.default.createElement(PostCustomToolbar, null) },
        react_1.default.createElement(src_1.WizardFormStep, { label: "First step" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "title", validate: (0, react_admin_1.required)() })),
        react_1.default.createElement(src_1.WizardFormStep, { label: "Second step" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "description" })),
        react_1.default.createElement(src_1.WizardFormStep, { label: "Third step" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "fullDescription", validate: (0, react_admin_1.required)() })),
        react_1.default.createElement(src_1.WizardFormStep, { label: "" },
            react_1.default.createElement(FinalStepContent, null))))); };
var CustomToolbar = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)({
        initialEntries: ['/posts/create'],
    }), i18nProvider: i18nProvider_1.default, dataProvider: dataProvider },
    react_1.default.createElement(react_admin_1.Resource, { name: "posts", list: PostList, edit: PostEdit, show: PostShow, create: PostCreateWithToolbar }))); };
exports.CustomToolbar = CustomToolbar;
var DarkMode = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)({
        initialEntries: ['/posts/create'],
    }), i18nProvider: i18nProvider_1.default, dataProvider: dataProvider, theme: { palette: { mode: 'dark' } } },
    react_1.default.createElement(react_admin_1.Resource, { name: "posts", list: PostList, edit: PostEdit, show: PostShow, create: PostCreate }))); };
exports.DarkMode = DarkMode;
var PostCreateWithMultilineTextInput = function () { return (react_1.default.createElement(react_admin_1.Create, null,
    react_1.default.createElement(src_1.WizardForm, null,
        react_1.default.createElement(src_1.WizardFormStep, { label: "First step" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "title", validate: (0, react_admin_1.required)() })),
        react_1.default.createElement(src_1.WizardFormStep, { label: "Second step" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "description", multiline: true, rows: 4, fullWidth: true, validate: (0, react_admin_1.required)() })),
        react_1.default.createElement(src_1.WizardFormStep, { label: "Third step" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "fullDescription", validate: (0, react_admin_1.required)() })),
        react_1.default.createElement(src_1.WizardFormStep, { label: "" },
            react_1.default.createElement(FinalStepContent, null))))); };
var WithMultilineTextInputStep = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)({
        initialEntries: ['/posts/create'],
    }), i18nProvider: i18nProvider_1.default, dataProvider: dataProvider },
    react_1.default.createElement(react_admin_1.Resource, { name: "posts", list: PostList, edit: PostEdit, show: PostShow, create: PostCreateWithMultilineTextInput }))); };
exports.WithMultilineTextInputStep = WithMultilineTextInputStep;
var AdditiveWizardFormStep = function (props) {
    var context = (0, src_1.useWizardFormStepContext)();
    return (react_1.default.createElement(material_1.Stack, null,
        react_1.default.createElement(src_1.WizardFormStep, __assign({}, props, { active: context.currentStep >= context.step }))));
};
var PostCreateWithAdditiveSteps = function () { return (react_1.default.createElement(react_admin_1.Create, { sx: { maxWidth: '50%' } },
    react_1.default.createElement(src_1.WizardForm, null,
        react_1.default.createElement(AdditiveWizardFormStep, { label: "First step" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "title", validate: (0, react_admin_1.required)() })),
        react_1.default.createElement(AdditiveWizardFormStep, { label: "Second step" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "description" })),
        react_1.default.createElement(AdditiveWizardFormStep, { label: "Third step" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "fullDescription", validate: (0, react_admin_1.required)() })),
        react_1.default.createElement(AdditiveWizardFormStep, { label: "" },
            react_1.default.createElement(FinalStepContent, null))))); };
var AdditiveSteps = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)({
        initialEntries: ['/posts/create'],
    }), i18nProvider: i18nProvider_1.default, dataProvider: dataProvider },
    react_1.default.createElement(react_admin_1.Resource, { name: "posts", list: PostList, edit: PostEdit, show: PostShow, create: PostCreateWithAdditiveSteps }))); };
exports.AdditiveSteps = AdditiveSteps;
var MiddlewareInput = function (props) {
    var middleware = react_1.default.useCallback(function (resource, params, options, next) {
        var newData = __assign({}, params.data);
        newData[props.source] = "".concat(params.data[props.source], " (modified by middleware)");
        next(resource, __assign(__assign({}, params), { data: newData }), options);
    }, [props.source]);
    (0, react_admin_1.useRegisterMutationMiddleware)(middleware);
    return react_1.default.createElement(react_admin_1.TextInput, __assign({}, props));
};
var PostCreateWithMiddleware = function () { return (react_1.default.createElement(react_admin_1.Create, { resource: "posts", record: {
        title: 'test-title',
        description: 'test-description',
        fullDescription: 'test-fullDescriptio',
    } },
    react_1.default.createElement(src_1.WizardForm, null,
        react_1.default.createElement(src_1.WizardFormStep, { label: "First step" },
            react_1.default.createElement(MiddlewareInput, { source: "title" })),
        react_1.default.createElement(src_1.WizardFormStep, { label: "Second step" },
            react_1.default.createElement(MiddlewareInput, { source: "description" })),
        react_1.default.createElement(src_1.WizardFormStep, { label: "Third step" },
            react_1.default.createElement(MiddlewareInput, { source: "fullDescription" }))))); };
var WithMiddleware = function () {
    return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)({
            initialEntries: ['/posts/create'],
        }), i18nProvider: i18nProvider_1.default, dataProvider: dataProvider },
        react_1.default.createElement(react_admin_1.Resource, { name: "posts", list: PostList, edit: PostEdit, show: PostShow, create: PostCreateWithMiddleware })));
};
exports.WithMiddleware = WithMiddleware;
var CustomProgressBar = function (props) {
    var _a = (0, src_1.useWizardFormContext)(props), currentStep = _a.currentStep, steps = _a.steps;
    return (react_1.default.createElement("ul", null, steps.map(function (step, index) {
        var label = react_1.default.cloneElement(step, { intent: 'label' });
        return (react_1.default.createElement("li", { key: "step_".concat(index) },
            react_1.default.createElement("span", { style: {
                    textDecoration: currentStep === index
                        ? 'underline'
                        : undefined,
                } }, label)));
    })));
};
var PostCreateWithCustomProgress = function () { return (react_1.default.createElement(react_admin_1.Create, null,
    react_1.default.createElement(src_1.WizardForm, { progress: react_1.default.createElement(CustomProgressBar, null) },
        react_1.default.createElement(src_1.WizardFormStep, { label: "First step" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "title", validate: (0, react_admin_1.required)() })),
        react_1.default.createElement(src_1.WizardFormStep, { label: "Second step" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "description" })),
        react_1.default.createElement(src_1.WizardFormStep, { label: "Third step" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "fullDescription", validate: (0, react_admin_1.required)() }))))); };
var CustomProgress = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)({
        initialEntries: ['/posts/create'],
    }), dataProvider: dataProvider, i18nProvider: i18nProvider_1.default },
    react_1.default.createElement(react_admin_1.Resource, { name: "posts", list: PostList, edit: PostEdit, show: PostShow, create: PostCreateWithCustomProgress }))); };
exports.CustomProgress = CustomProgress;
var CustomSxProgressBar = function () { return react_1.default.createElement(src_1.WizardProgress, { sx: { margin: 5 } }); };
var PostCreateWithCustomSxProgress = function () { return (react_1.default.createElement(react_admin_1.Create, null,
    react_1.default.createElement(src_1.WizardForm, { progress: react_1.default.createElement(CustomSxProgressBar, null) },
        react_1.default.createElement(src_1.WizardFormStep, { label: "First step" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "title", validate: (0, react_admin_1.required)() })),
        react_1.default.createElement(src_1.WizardFormStep, { label: "Second step" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "description" })),
        react_1.default.createElement(src_1.WizardFormStep, { label: "Third step" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "fullDescription", validate: (0, react_admin_1.required)() }))))); };
var CustomSxProgress = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)({
        initialEntries: ['/posts/create'],
    }), dataProvider: dataProvider, i18nProvider: i18nProvider_1.default },
    react_1.default.createElement(react_admin_1.Resource, { name: "posts", list: PostList, edit: PostEdit, show: PostShow, create: PostCreateWithCustomSxProgress }))); };
exports.CustomSxProgress = CustomSxProgress;
var PostCreateNoProgress = function () { return (react_1.default.createElement(react_admin_1.Create, null,
    react_1.default.createElement(src_1.WizardForm, { progress: false },
        react_1.default.createElement(src_1.WizardFormStep, { label: "First step" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "title", validate: (0, react_admin_1.required)() })),
        react_1.default.createElement(src_1.WizardFormStep, { label: "Second step" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "description", validate: (0, react_admin_1.required)() })),
        react_1.default.createElement(src_1.WizardFormStep, { label: "Third step" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "fullDescription", validate: (0, react_admin_1.required)() })),
        react_1.default.createElement(src_1.WizardFormStep, { label: "" },
            react_1.default.createElement(FinalStepContent, null))))); };
var NoProgress = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)({
        initialEntries: ['/posts/create'],
    }), i18nProvider: i18nProvider_1.default, dataProvider: dataProvider },
    react_1.default.createElement(react_admin_1.Resource, { name: "posts", list: PostList, edit: PostEdit, show: PostShow, create: PostCreateNoProgress }))); };
exports.NoProgress = NoProgress;
