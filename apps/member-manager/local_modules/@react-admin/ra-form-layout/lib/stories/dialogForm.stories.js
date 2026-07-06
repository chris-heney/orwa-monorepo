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
exports.OnClose = exports.OnSuccess = exports.Meta = exports.StandaloneWithFullyControlledCreateDialog = exports.EmployerEditWithFullyControlledDialogs = exports.StandaloneInTabbedForm = exports.StandaloneInSimpleForm = exports.WithRecordTitle = exports.MutationOptionsRedirect = exports.CustomRedirect = exports.WithTabbedForms = exports.WithCustomTitles = exports.SubPath = exports.Basic = void 0;
var react_1 = __importStar(require("react"));
var react_admin_1 = require("react-admin");
var history_1 = require("history");
var react_router_dom_1 = require("react-router-dom");
var src_1 = require("../src");
var i18nProvider_1 = __importDefault(require("./i18nProvider"));
var common_1 = require("./common");
var EditInDialogButton_1 = require("../src/forms/dialog-form/EditInDialogButton");
var CreateInDialogButton_1 = require("../src/forms/dialog-form/CreateInDialogButton");
var ShowInDialogButton_1 = require("../src/forms/dialog-form/ShowInDialogButton");
var CustomerListDialogs = function () { return (react_1.default.createElement(react_1.default.Fragment, null,
    react_1.default.createElement(common_1.CustomerList, null),
    react_1.default.createElement(src_1.CreateDialog, { fullWidth: true, maxWidth: "md" },
        react_1.default.createElement(common_1.CustomerForm, null)),
    react_1.default.createElement(src_1.EditDialog, { fullWidth: true, maxWidth: "md" },
        react_1.default.createElement(common_1.CustomerForm, null)),
    react_1.default.createElement(src_1.ShowDialog, { fullWidth: true, maxWidth: "md" },
        react_1.default.createElement(common_1.CustomerLayoutForm, null)))); };
var Basic = function () {
    var history = (0, history_1.createHashHistory)();
    return (react_1.default.createElement(react_admin_1.Admin, { dataProvider: common_1.dataProvider, i18nProvider: i18nProvider_1.default, history: history },
        react_1.default.createElement(react_admin_1.Resource, { name: "customers", list: CustomerListDialogs })));
};
exports.Basic = Basic;
var SubPath = function () { return (react_1.default.createElement(react_router_dom_1.HashRouter, null,
    react_1.default.createElement(react_router_dom_1.Routes, null,
        react_1.default.createElement(react_router_dom_1.Route, { path: "/", element: react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("h1", null, "Main"),
                react_1.default.createElement("div", null,
                    react_1.default.createElement(react_router_dom_1.Link, { to: "/admin" }, "Go to admin"))) }),
        react_1.default.createElement(react_router_dom_1.Route, { path: "/admin/*", element: react_1.default.createElement(react_admin_1.Admin, { basename: "/admin", dataProvider: common_1.dataProvider, i18nProvider: i18nProvider_1.default },
                react_1.default.createElement(react_admin_1.Resource, { name: "customers", list: CustomerListDialogs })) })))); };
exports.SubPath = SubPath;
var EditDialogTitle = function () {
    var record = (0, react_admin_1.useRecordContext)();
    return (react_1.default.createElement("span", null, record ? "".concat(record.last_name, " ").concat(record.first_name) : ''));
};
var ShowDialogTitle = function () {
    var record = (0, react_admin_1.useRecordContext)();
    return (react_1.default.createElement("span", null, record ? "".concat(record.last_name, " ").concat(record.first_name) : ''));
};
var CustomerListDialogsWithTitles = function () { return (react_1.default.createElement(react_1.default.Fragment, null,
    react_1.default.createElement(common_1.CustomerList, null),
    react_1.default.createElement(src_1.CreateDialog, { fullWidth: true, maxWidth: "md", title: "Create a new customer" },
        react_1.default.createElement(common_1.CustomerForm, null)),
    react_1.default.createElement(src_1.EditDialog, { fullWidth: true, maxWidth: "md", title: react_1.default.createElement(EditDialogTitle, null) },
        react_1.default.createElement(common_1.CustomerForm, null)),
    react_1.default.createElement(src_1.ShowDialog, { fullWidth: true, maxWidth: "md", title: react_1.default.createElement(ShowDialogTitle, null) },
        react_1.default.createElement(common_1.CustomerLayoutForm, null)))); };
var WithCustomTitles = function () {
    var history = (0, history_1.createHashHistory)();
    return (react_1.default.createElement(react_admin_1.Admin, { dataProvider: common_1.dataProvider, i18nProvider: i18nProvider_1.default, history: history },
        react_1.default.createElement(react_admin_1.Resource, { name: "customers", list: CustomerListDialogsWithTitles })));
};
exports.WithCustomTitles = WithCustomTitles;
var CustomerTabbedForm = function (_a) {
    var _b = _a.syncWithLocation, syncWithLocation = _b === void 0 ? true : _b;
    return (react_1.default.createElement(react_admin_1.TabbedForm, { syncWithLocation: syncWithLocation },
        react_1.default.createElement(react_admin_1.FormTab, { label: "Identity" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "first_name", validate: (0, react_admin_1.required)(), fullWidth: true }),
            react_1.default.createElement(react_admin_1.TextInput, { source: "last_name", validate: (0, react_admin_1.required)(), fullWidth: true })),
        react_1.default.createElement(react_admin_1.FormTab, { label: "Informations" },
            react_1.default.createElement(react_admin_1.DateInput, { source: "dob", label: "born", validate: (0, react_admin_1.required)(), fullWidth: true }),
            react_1.default.createElement(react_admin_1.SelectInput, { source: "sex", choices: common_1.sexChoices, fullWidth: true }))));
};
var CustomerTabShowLayoutForm = function (_a) {
    var _b = _a.syncWithLocation, syncWithLocation = _b === void 0 ? true : _b;
    return (react_1.default.createElement(react_admin_1.TabbedShowLayout, { syncWithLocation: syncWithLocation },
        react_1.default.createElement(react_admin_1.Tab, { label: "Identity" },
            react_1.default.createElement(react_admin_1.TextField, { source: "first_name", fullWidth: true }),
            react_1.default.createElement(react_admin_1.TextField, { source: "last_name", fullWidth: true })),
        react_1.default.createElement(react_admin_1.Tab, { label: "Informations" },
            react_1.default.createElement(react_admin_1.DateField, { source: "dob", label: "born", fullWidth: true }),
            react_1.default.createElement(react_admin_1.SelectField, { source: "sex", choices: common_1.sexChoices, fullWidth: true }))));
};
var CustomerListDialogsWithTabbedForm = function () { return (react_1.default.createElement(react_1.default.Fragment, null,
    react_1.default.createElement(common_1.CustomerList, null),
    react_1.default.createElement(src_1.CreateDialog, { fullWidth: true, maxWidth: "md" },
        react_1.default.createElement(CustomerTabbedForm, null)),
    react_1.default.createElement(src_1.EditDialog, { fullWidth: true, maxWidth: "md", title: react_1.default.createElement(EditDialogTitle, null) },
        react_1.default.createElement(CustomerTabbedForm, null)),
    react_1.default.createElement(src_1.ShowDialog, { fullWidth: true, maxWidth: "md" },
        react_1.default.createElement(CustomerTabShowLayoutForm, null)))); };
var WithTabbedForms = function () {
    var history = (0, history_1.createHashHistory)();
    return (react_1.default.createElement(react_admin_1.Admin, { dataProvider: common_1.dataProvider, i18nProvider: i18nProvider_1.default, history: history },
        react_1.default.createElement(react_admin_1.Resource, { name: "customers", list: CustomerListDialogsWithTabbedForm })));
};
exports.WithTabbedForms = WithTabbedForms;
var CustomerListDialogsWithRedirect = function () { return (react_1.default.createElement(react_1.default.Fragment, null,
    react_1.default.createElement(common_1.CustomerList, null),
    react_1.default.createElement(src_1.CreateDialog, { fullWidth: true, maxWidth: "md", redirect: "edit" },
        react_1.default.createElement(common_1.CustomerForm, null)),
    react_1.default.createElement(src_1.EditDialog, { fullWidth: true, maxWidth: "md", redirect: "show" },
        react_1.default.createElement(common_1.CustomerForm, null)),
    react_1.default.createElement(src_1.ShowDialog, { fullWidth: true, maxWidth: "md" },
        react_1.default.createElement(common_1.CustomerLayoutForm, null)))); };
var CustomRedirect = function () {
    var history = (0, history_1.createHashHistory)();
    return (react_1.default.createElement(react_admin_1.Admin, { dataProvider: common_1.dataProvider, i18nProvider: i18nProvider_1.default, history: history },
        react_1.default.createElement(react_admin_1.Resource, { name: "customers", list: CustomerListDialogsWithRedirect })));
};
exports.CustomRedirect = CustomRedirect;
var CustomerListDialogsWithMutationOptionsRedirect = function () {
    var redirect = (0, react_admin_1.useRedirect)();
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(common_1.CustomerList, null),
        react_1.default.createElement(src_1.CreateDialog, { fullWidth: true, maxWidth: "md", mutationOptions: {
                onSuccess: function (data) {
                    redirect('create', 'customers_profiles', undefined, undefined, { record: { customer_id: data.id } });
                },
            } },
            react_1.default.createElement(common_1.CustomerForm, null)),
        react_1.default.createElement(src_1.EditDialog, { fullWidth: true, maxWidth: "md", redirect: "show" },
            react_1.default.createElement(common_1.CustomerForm, null)),
        react_1.default.createElement(src_1.ShowDialog, { fullWidth: true, maxWidth: "md" },
            react_1.default.createElement(common_1.CustomerLayoutForm, null))));
};
var CustomerProfileCreate = function () { return (react_1.default.createElement(react_admin_1.Create, null,
    react_1.default.createElement(react_admin_1.SimpleForm, null,
        react_1.default.createElement(react_admin_1.ReferenceInput, { source: "customer_id", reference: "customers" },
            react_1.default.createElement(react_admin_1.AutocompleteInput, { validate: (0, react_admin_1.required)(), fullWidth: true })),
        react_1.default.createElement(react_admin_1.TextInput, { source: "preference1", validate: (0, react_admin_1.required)(), fullWidth: true }),
        react_1.default.createElement(react_admin_1.TextInput, { source: "preference2", validate: (0, react_admin_1.required)(), fullWidth: true })))); };
var MutationOptionsRedirect = function (_a) {
    var _b = _a.dataProvider, dataProviderProp = _b === void 0 ? common_1.dataProvider : _b;
    var history = (0, history_1.createHashHistory)();
    return (react_1.default.createElement(react_admin_1.Admin, { dataProvider: dataProviderProp, i18nProvider: i18nProvider_1.default, history: history },
        react_1.default.createElement(react_admin_1.Resource, { name: "customers", list: CustomerListDialogsWithMutationOptionsRedirect, recordRepresentation: function (customer) {
                return "".concat(customer.first_name, " ").concat(customer.last_name);
            } }),
        react_1.default.createElement(react_admin_1.Resource, { name: "customers_profiles", create: CustomerProfileCreate, list: react_admin_1.ListGuesser })));
};
exports.MutationOptionsRedirect = MutationOptionsRedirect;
var RecordTitle = function () {
    var record = (0, react_admin_1.useRecordContext)();
    return react_1.default.createElement("p", null,
        "Record Customer #", record === null || record === void 0 ? void 0 :
        record.id);
};
var CustomerListDialogsWithRecordTitle = function () { return (react_1.default.createElement(react_1.default.Fragment, null,
    react_1.default.createElement(common_1.CustomerList, null),
    react_1.default.createElement(src_1.CreateDialog, { fullWidth: true, maxWidth: "md" },
        react_1.default.createElement(common_1.CustomerForm, null)),
    react_1.default.createElement(src_1.EditDialog, { fullWidth: true, maxWidth: "md", title: react_1.default.createElement(RecordTitle, null) },
        react_1.default.createElement(common_1.CustomerForm, null)),
    react_1.default.createElement(src_1.ShowDialog, { fullWidth: true, maxWidth: "md", title: react_1.default.createElement(RecordTitle, null) },
        react_1.default.createElement(common_1.CustomerLayoutForm, null)))); };
var WithRecordTitle = function () {
    var history = (0, history_1.createHashHistory)();
    return (react_1.default.createElement(react_admin_1.Admin, { dataProvider: common_1.dataProvider, i18nProvider: i18nProvider_1.default, history: history },
        react_1.default.createElement(react_admin_1.Resource, { name: "customers", list: CustomerListDialogsWithRecordTitle })));
};
exports.WithRecordTitle = WithRecordTitle;
// helper component to add actions buttons in a column (children), and also in the header (label)
var DatagridActionsColumn = function (_a) {
    var 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    label = _a.label, children = _a.children;
    return react_1.default.createElement(react_1.default.Fragment, null, children);
};
var NestedCustomersDatagrid = function (_a) {
    var _b = _a.syncWithLocation, syncWithLocation = _b === void 0 ? true : _b;
    var record = (0, react_admin_1.useRecordContext)();
    var createButton = (react_1.default.createElement(CreateInDialogButton_1.CreateInDialogButton, { inline: true, fullWidth: true, maxWidth: "md", record: { employer_id: record === null || record === void 0 ? void 0 : record.id } },
        react_1.default.createElement(CustomerTabbedForm, { syncWithLocation: syncWithLocation })));
    var editButton = (react_1.default.createElement(EditInDialogButton_1.EditInDialogButton, { fullWidth: true, maxWidth: "md" },
        react_1.default.createElement(CustomerTabbedForm, { syncWithLocation: syncWithLocation })));
    var showButton = (react_1.default.createElement(ShowInDialogButton_1.ShowInDialogButton, { fullWidth: true, maxWidth: "md" },
        react_1.default.createElement(CustomerTabShowLayoutForm, { syncWithLocation: syncWithLocation })));
    return (react_1.default.createElement(react_admin_1.ReferenceManyField, { label: "Customers", reference: "customers", target: "employer_id" },
        react_1.default.createElement(react_admin_1.Datagrid, null,
            react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
            react_1.default.createElement(react_admin_1.TextField, { source: "first_name" }),
            react_1.default.createElement(react_admin_1.TextField, { source: "last_name" }),
            react_1.default.createElement(react_admin_1.DateField, { source: "dob", label: "born" }),
            react_1.default.createElement(react_admin_1.SelectField, { source: "sex", choices: common_1.sexChoices }),
            react_1.default.createElement(DatagridActionsColumn, { label: createButton },
                editButton,
                showButton))));
};
var EmployerSimpleFormWithNestedDatagrid = function () { return (react_1.default.createElement(react_admin_1.Edit, null,
    react_1.default.createElement(react_admin_1.SimpleForm, null,
        react_1.default.createElement(react_admin_1.TextInput, { source: "name", validate: (0, react_admin_1.required)() }),
        react_1.default.createElement(react_admin_1.TextInput, { source: "address", validate: (0, react_admin_1.required)() }),
        react_1.default.createElement(react_admin_1.TextInput, { source: "city", validate: (0, react_admin_1.required)() }),
        react_1.default.createElement(NestedCustomersDatagrid, null)))); };
var EmployerList = function () { return (react_1.default.createElement(react_admin_1.List, { empty: false },
    react_1.default.createElement(react_admin_1.Datagrid, { rowClick: "edit" },
        react_1.default.createElement(react_admin_1.NumberField, { source: "id" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "name" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "address" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "city" })))); };
var StandaloneInSimpleForm = function () {
    var history = (0, history_1.createHashHistory)();
    return (react_1.default.createElement(react_admin_1.Admin, { dataProvider: common_1.dataProvider, i18nProvider: i18nProvider_1.default, history: history },
        react_1.default.createElement(react_admin_1.Resource, { name: "employers", list: EmployerList, edit: EmployerSimpleFormWithNestedDatagrid }),
        react_1.default.createElement(react_admin_1.Resource, { name: "customers", list: CustomerListDialogs })));
};
exports.StandaloneInSimpleForm = StandaloneInSimpleForm;
var EmployerTabbedFormWithNestedDatagrid = function () { return (react_1.default.createElement(react_admin_1.Edit, null,
    react_1.default.createElement(react_admin_1.TabbedForm, null,
        react_1.default.createElement(react_admin_1.FormTab, { label: "Identity" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "name", validate: (0, react_admin_1.required)() }),
            react_1.default.createElement(NestedCustomersDatagrid, { syncWithLocation: false })),
        react_1.default.createElement(react_admin_1.FormTab, { label: "Address" },
            react_1.default.createElement(react_admin_1.TextInput, { source: "address", validate: (0, react_admin_1.required)() }),
            react_1.default.createElement(react_admin_1.TextInput, { source: "city", validate: (0, react_admin_1.required)() }))))); };
var StandaloneInTabbedForm = function () {
    var history = (0, history_1.createHashHistory)();
    return (react_1.default.createElement(react_admin_1.Admin, { dataProvider: common_1.dataProvider, i18nProvider: i18nProvider_1.default, history: history },
        react_1.default.createElement(react_admin_1.Resource, { name: "employers", list: EmployerList, edit: EmployerTabbedFormWithNestedDatagrid }),
        react_1.default.createElement(react_admin_1.Resource, { name: "customers", list: CustomerListDialogs })));
};
exports.StandaloneInTabbedForm = StandaloneInTabbedForm;
var EmployerSimpleFormWithFullyControlledDialogs = function () {
    var record = (0, react_admin_1.useRecordContext)();
    var _a = (0, react_1.useState)(false), isCreateDialogOpen = _a[0], setIsCreateDialogOpen = _a[1];
    var openCreateDialog = (0, react_1.useCallback)(function () {
        setIsCreateDialogOpen(true);
    }, []);
    var closeCreateDialog = (0, react_1.useCallback)(function () {
        setIsCreateDialogOpen(false);
    }, []);
    return (react_1.default.createElement(react_admin_1.SimpleForm, null,
        react_1.default.createElement(react_admin_1.TextInput, { source: "name", validate: (0, react_admin_1.required)() }),
        react_1.default.createElement(react_admin_1.TextInput, { source: "address", validate: (0, react_admin_1.required)() }),
        react_1.default.createElement(react_admin_1.TextInput, { source: "city", validate: (0, react_admin_1.required)() }),
        react_1.default.createElement(react_admin_1.Button, { label: "Create a new customer", onClick: function () { return openCreateDialog(); }, size: "medium", variant: "contained", sx: { mb: 4 } }),
        react_1.default.createElement(src_1.CreateDialog, { fullWidth: true, maxWidth: "md", record: { employer_id: record === null || record === void 0 ? void 0 : record.id }, isOpen: isCreateDialogOpen, open: openCreateDialog, close: closeCreateDialog, resource: "customers" },
            react_1.default.createElement(common_1.CustomerForm, null)),
        react_1.default.createElement(react_admin_1.ReferenceManyField, { label: "Customers", reference: "customers", target: "employer_id" },
            react_1.default.createElement(react_admin_1.Datagrid, null,
                react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
                react_1.default.createElement(react_admin_1.TextField, { source: "first_name" }),
                react_1.default.createElement(react_admin_1.TextField, { source: "last_name" }),
                react_1.default.createElement(react_admin_1.DateField, { source: "dob", label: "born" }),
                react_1.default.createElement(react_admin_1.SelectField, { source: "sex", choices: common_1.sexChoices })))));
};
var EmployerEditWithFullyControlledDialogs = function () { return (react_1.default.createElement(react_admin_1.Edit, { mutationMode: "pessimistic" },
    react_1.default.createElement(EmployerSimpleFormWithFullyControlledDialogs, null))); };
exports.EmployerEditWithFullyControlledDialogs = EmployerEditWithFullyControlledDialogs;
var StandaloneWithFullyControlledCreateDialog = function () {
    var history = (0, history_1.createHashHistory)();
    return (react_1.default.createElement(react_admin_1.Admin, { dataProvider: common_1.dataProvider, i18nProvider: i18nProvider_1.default, history: history },
        react_1.default.createElement(react_admin_1.Resource, { name: "employers", list: EmployerList, edit: exports.EmployerEditWithFullyControlledDialogs })));
};
exports.StandaloneWithFullyControlledCreateDialog = StandaloneWithFullyControlledCreateDialog;
var CustomerListDialogsWithMeta = function () { return (react_1.default.createElement(react_1.default.Fragment, null,
    react_1.default.createElement(common_1.CustomerList, null),
    react_1.default.createElement(src_1.CreateDialog, { fullWidth: true, maxWidth: "md", mutationOptions: { meta: { foo: 'bar' } }, redirect: "edit", title: "In Create View" },
        react_1.default.createElement(common_1.CustomerForm, null)),
    react_1.default.createElement(src_1.EditDialog, { fullWidth: true, maxWidth: "md", mutationMode: "pessimistic", mutationOptions: { meta: { foo: 'bar' } }, redirect: "show", title: "In Edit View" },
        react_1.default.createElement(common_1.CustomerForm, null)),
    react_1.default.createElement(src_1.ShowDialog, { fullWidth: true, maxWidth: "md", title: "In Show View" },
        react_1.default.createElement(common_1.CustomerLayoutForm, null)))); };
var Meta = function (_a) {
    var _b = _a.dataProvider, dataProviderProp = _b === void 0 ? common_1.dataProvider : _b;
    var history = (0, history_1.createHashHistory)();
    return (react_1.default.createElement(react_admin_1.Admin, { dataProvider: dataProviderProp, i18nProvider: i18nProvider_1.default, history: history },
        react_1.default.createElement(react_admin_1.Resource, { name: "customers", list: CustomerListDialogsWithMeta })));
};
exports.Meta = Meta;
var CustomerListDialogsWithOnSuccess = function () {
    var notify = (0, react_admin_1.useNotify)();
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(common_1.CustomerList, null),
        react_1.default.createElement(src_1.CreateDialog, { fullWidth: true, maxWidth: "md", mutationOptions: { onSuccess: function () { return notify('Created'); } }, redirect: "edit", title: "In Create View" },
            react_1.default.createElement(common_1.CustomerForm, null)),
        react_1.default.createElement(src_1.EditDialog, { fullWidth: true, maxWidth: "md", mutationMode: "pessimistic", mutationOptions: { onSuccess: function () { return notify('Updated'); } }, redirect: "show", title: "In Edit View" },
            react_1.default.createElement(common_1.CustomerForm, null)),
        react_1.default.createElement(src_1.ShowDialog, { fullWidth: true, maxWidth: "md", title: "In Show View" },
            react_1.default.createElement(common_1.CustomerLayoutForm, null))));
};
var OnSuccess = function (_a) {
    var _b = _a.dataProvider, dataProviderProp = _b === void 0 ? common_1.dataProvider : _b;
    var history = (0, history_1.createHashHistory)();
    return (react_1.default.createElement(react_admin_1.Admin, { dataProvider: dataProviderProp, i18nProvider: i18nProvider_1.default, history: history },
        react_1.default.createElement(react_admin_1.Resource, { name: "customers", list: CustomerListDialogsWithOnSuccess })));
};
exports.OnSuccess = OnSuccess;
var OnCloseDialogs = function () {
    var redirect = (0, react_admin_1.useRedirect)();
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(common_1.CustomerList, null),
        react_1.default.createElement(src_1.CreateDialog, { fullWidth: true, maxWidth: "md", close: function (event, reason) {
                // eslint-disable-next-line no-console
                console.log('CreateDialog close: ' + reason);
                redirect('list', 'customers');
            } },
            react_1.default.createElement(common_1.CustomerForm, null)),
        react_1.default.createElement(src_1.EditDialog, { fullWidth: true, maxWidth: "md", close: function (event, reason) {
                // eslint-disable-next-line no-console
                console.log('EditDialog close: ' + reason);
                redirect('list', 'customers');
            } },
            react_1.default.createElement(common_1.CustomerForm, null)),
        react_1.default.createElement(src_1.ShowDialog, { fullWidth: true, maxWidth: "md", close: function (event, reason) {
                // eslint-disable-next-line no-console
                console.log('ShowDialog close: ' + reason);
                redirect('list', 'customers');
            } },
            react_1.default.createElement(common_1.CustomerLayoutForm, null))));
};
var OnClose = function (_a) {
    var _b = _a.dataProvider, dataProviderProp = _b === void 0 ? common_1.dataProvider : _b;
    var history = (0, history_1.createHashHistory)();
    return (react_1.default.createElement(react_admin_1.Admin, { dataProvider: dataProviderProp, i18nProvider: i18nProvider_1.default, history: history },
        react_1.default.createElement(react_admin_1.Resource, { name: "customers", list: OnCloseDialogs })));
};
exports.OnClose = OnClose;
exports.default = {
    title: 'ra-form-layout/DialogForm',
    excludeStories: ['EmployerEditWithFullyControlledDialogs'],
};
