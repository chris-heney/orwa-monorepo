import React, { useCallback, useState } from 'react';
import { Admin, Resource, TabbedForm, FormTab, TextInput, DateInput, SelectInput, required, TabbedShowLayout, Tab, TextField, DateField, SelectField, useRecordContext, Edit, SimpleForm, ReferenceManyField, Datagrid, List, NumberField, Button, useRedirect, useNotify, ListGuesser, Create, ReferenceInput, AutocompleteInput, } from 'react-admin';
import { createHashHistory } from 'history';
import { Route, Routes, HashRouter, Link } from 'react-router-dom';
import { CreateDialog, EditDialog, ShowDialog } from '../src';
import i18nProvider from './i18nProvider';
import { CustomerList, CustomerForm, CustomerLayoutForm, sexChoices, dataProvider, } from './common';
import { EditInDialogButton } from '../src/forms/dialog-form/EditInDialogButton';
import { CreateInDialogButton } from '../src/forms/dialog-form/CreateInDialogButton';
import { ShowInDialogButton } from '../src/forms/dialog-form/ShowInDialogButton';
var CustomerListDialogs = function () { return (React.createElement(React.Fragment, null,
    React.createElement(CustomerList, null),
    React.createElement(CreateDialog, { fullWidth: true, maxWidth: "md" },
        React.createElement(CustomerForm, null)),
    React.createElement(EditDialog, { fullWidth: true, maxWidth: "md" },
        React.createElement(CustomerForm, null)),
    React.createElement(ShowDialog, { fullWidth: true, maxWidth: "md" },
        React.createElement(CustomerLayoutForm, null)))); };
export var Basic = function () {
    var history = createHashHistory();
    return (React.createElement(Admin, { dataProvider: dataProvider, i18nProvider: i18nProvider, history: history },
        React.createElement(Resource, { name: "customers", list: CustomerListDialogs })));
};
export var SubPath = function () { return (React.createElement(HashRouter, null,
    React.createElement(Routes, null,
        React.createElement(Route, { path: "/", element: React.createElement(React.Fragment, null,
                React.createElement("h1", null, "Main"),
                React.createElement("div", null,
                    React.createElement(Link, { to: "/admin" }, "Go to admin"))) }),
        React.createElement(Route, { path: "/admin/*", element: React.createElement(Admin, { basename: "/admin", dataProvider: dataProvider, i18nProvider: i18nProvider },
                React.createElement(Resource, { name: "customers", list: CustomerListDialogs })) })))); };
var EditDialogTitle = function () {
    var record = useRecordContext();
    return (React.createElement("span", null, record ? "".concat(record.last_name, " ").concat(record.first_name) : ''));
};
var ShowDialogTitle = function () {
    var record = useRecordContext();
    return (React.createElement("span", null, record ? "".concat(record.last_name, " ").concat(record.first_name) : ''));
};
var CustomerListDialogsWithTitles = function () { return (React.createElement(React.Fragment, null,
    React.createElement(CustomerList, null),
    React.createElement(CreateDialog, { fullWidth: true, maxWidth: "md", title: "Create a new customer" },
        React.createElement(CustomerForm, null)),
    React.createElement(EditDialog, { fullWidth: true, maxWidth: "md", title: React.createElement(EditDialogTitle, null) },
        React.createElement(CustomerForm, null)),
    React.createElement(ShowDialog, { fullWidth: true, maxWidth: "md", title: React.createElement(ShowDialogTitle, null) },
        React.createElement(CustomerLayoutForm, null)))); };
export var WithCustomTitles = function () {
    var history = createHashHistory();
    return (React.createElement(Admin, { dataProvider: dataProvider, i18nProvider: i18nProvider, history: history },
        React.createElement(Resource, { name: "customers", list: CustomerListDialogsWithTitles })));
};
var CustomerTabbedForm = function (_a) {
    var _b = _a.syncWithLocation, syncWithLocation = _b === void 0 ? true : _b;
    return (React.createElement(TabbedForm, { syncWithLocation: syncWithLocation },
        React.createElement(FormTab, { label: "Identity" },
            React.createElement(TextInput, { source: "first_name", validate: required(), fullWidth: true }),
            React.createElement(TextInput, { source: "last_name", validate: required(), fullWidth: true })),
        React.createElement(FormTab, { label: "Informations" },
            React.createElement(DateInput, { source: "dob", label: "born", validate: required(), fullWidth: true }),
            React.createElement(SelectInput, { source: "sex", choices: sexChoices, fullWidth: true }))));
};
var CustomerTabShowLayoutForm = function (_a) {
    var _b = _a.syncWithLocation, syncWithLocation = _b === void 0 ? true : _b;
    return (React.createElement(TabbedShowLayout, { syncWithLocation: syncWithLocation },
        React.createElement(Tab, { label: "Identity" },
            React.createElement(TextField, { source: "first_name", fullWidth: true }),
            React.createElement(TextField, { source: "last_name", fullWidth: true })),
        React.createElement(Tab, { label: "Informations" },
            React.createElement(DateField, { source: "dob", label: "born", fullWidth: true }),
            React.createElement(SelectField, { source: "sex", choices: sexChoices, fullWidth: true }))));
};
var CustomerListDialogsWithTabbedForm = function () { return (React.createElement(React.Fragment, null,
    React.createElement(CustomerList, null),
    React.createElement(CreateDialog, { fullWidth: true, maxWidth: "md" },
        React.createElement(CustomerTabbedForm, null)),
    React.createElement(EditDialog, { fullWidth: true, maxWidth: "md", title: React.createElement(EditDialogTitle, null) },
        React.createElement(CustomerTabbedForm, null)),
    React.createElement(ShowDialog, { fullWidth: true, maxWidth: "md" },
        React.createElement(CustomerTabShowLayoutForm, null)))); };
export var WithTabbedForms = function () {
    var history = createHashHistory();
    return (React.createElement(Admin, { dataProvider: dataProvider, i18nProvider: i18nProvider, history: history },
        React.createElement(Resource, { name: "customers", list: CustomerListDialogsWithTabbedForm })));
};
var CustomerListDialogsWithRedirect = function () { return (React.createElement(React.Fragment, null,
    React.createElement(CustomerList, null),
    React.createElement(CreateDialog, { fullWidth: true, maxWidth: "md", redirect: "edit" },
        React.createElement(CustomerForm, null)),
    React.createElement(EditDialog, { fullWidth: true, maxWidth: "md", redirect: "show" },
        React.createElement(CustomerForm, null)),
    React.createElement(ShowDialog, { fullWidth: true, maxWidth: "md" },
        React.createElement(CustomerLayoutForm, null)))); };
export var CustomRedirect = function () {
    var history = createHashHistory();
    return (React.createElement(Admin, { dataProvider: dataProvider, i18nProvider: i18nProvider, history: history },
        React.createElement(Resource, { name: "customers", list: CustomerListDialogsWithRedirect })));
};
var CustomerListDialogsWithMutationOptionsRedirect = function () {
    var redirect = useRedirect();
    return (React.createElement(React.Fragment, null,
        React.createElement(CustomerList, null),
        React.createElement(CreateDialog, { fullWidth: true, maxWidth: "md", mutationOptions: {
                onSuccess: function (data) {
                    redirect('create', 'customers_profiles', undefined, undefined, { record: { customer_id: data.id } });
                },
            } },
            React.createElement(CustomerForm, null)),
        React.createElement(EditDialog, { fullWidth: true, maxWidth: "md", redirect: "show" },
            React.createElement(CustomerForm, null)),
        React.createElement(ShowDialog, { fullWidth: true, maxWidth: "md" },
            React.createElement(CustomerLayoutForm, null))));
};
var CustomerProfileCreate = function () { return (React.createElement(Create, null,
    React.createElement(SimpleForm, null,
        React.createElement(ReferenceInput, { source: "customer_id", reference: "customers" },
            React.createElement(AutocompleteInput, { validate: required(), fullWidth: true })),
        React.createElement(TextInput, { source: "preference1", validate: required(), fullWidth: true }),
        React.createElement(TextInput, { source: "preference2", validate: required(), fullWidth: true })))); };
export var MutationOptionsRedirect = function (_a) {
    var _b = _a.dataProvider, dataProviderProp = _b === void 0 ? dataProvider : _b;
    var history = createHashHistory();
    return (React.createElement(Admin, { dataProvider: dataProviderProp, i18nProvider: i18nProvider, history: history },
        React.createElement(Resource, { name: "customers", list: CustomerListDialogsWithMutationOptionsRedirect, recordRepresentation: function (customer) {
                return "".concat(customer.first_name, " ").concat(customer.last_name);
            } }),
        React.createElement(Resource, { name: "customers_profiles", create: CustomerProfileCreate, list: ListGuesser })));
};
var RecordTitle = function () {
    var record = useRecordContext();
    return React.createElement("p", null,
        "Record Customer #", record === null || record === void 0 ? void 0 :
        record.id);
};
var CustomerListDialogsWithRecordTitle = function () { return (React.createElement(React.Fragment, null,
    React.createElement(CustomerList, null),
    React.createElement(CreateDialog, { fullWidth: true, maxWidth: "md" },
        React.createElement(CustomerForm, null)),
    React.createElement(EditDialog, { fullWidth: true, maxWidth: "md", title: React.createElement(RecordTitle, null) },
        React.createElement(CustomerForm, null)),
    React.createElement(ShowDialog, { fullWidth: true, maxWidth: "md", title: React.createElement(RecordTitle, null) },
        React.createElement(CustomerLayoutForm, null)))); };
export var WithRecordTitle = function () {
    var history = createHashHistory();
    return (React.createElement(Admin, { dataProvider: dataProvider, i18nProvider: i18nProvider, history: history },
        React.createElement(Resource, { name: "customers", list: CustomerListDialogsWithRecordTitle })));
};
// helper component to add actions buttons in a column (children), and also in the header (label)
var DatagridActionsColumn = function (_a) {
    var 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    label = _a.label, children = _a.children;
    return React.createElement(React.Fragment, null, children);
};
var NestedCustomersDatagrid = function (_a) {
    var _b = _a.syncWithLocation, syncWithLocation = _b === void 0 ? true : _b;
    var record = useRecordContext();
    var createButton = (React.createElement(CreateInDialogButton, { inline: true, fullWidth: true, maxWidth: "md", record: { employer_id: record === null || record === void 0 ? void 0 : record.id } },
        React.createElement(CustomerTabbedForm, { syncWithLocation: syncWithLocation })));
    var editButton = (React.createElement(EditInDialogButton, { fullWidth: true, maxWidth: "md" },
        React.createElement(CustomerTabbedForm, { syncWithLocation: syncWithLocation })));
    var showButton = (React.createElement(ShowInDialogButton, { fullWidth: true, maxWidth: "md" },
        React.createElement(CustomerTabShowLayoutForm, { syncWithLocation: syncWithLocation })));
    return (React.createElement(ReferenceManyField, { label: "Customers", reference: "customers", target: "employer_id" },
        React.createElement(Datagrid, null,
            React.createElement(TextField, { source: "id" }),
            React.createElement(TextField, { source: "first_name" }),
            React.createElement(TextField, { source: "last_name" }),
            React.createElement(DateField, { source: "dob", label: "born" }),
            React.createElement(SelectField, { source: "sex", choices: sexChoices }),
            React.createElement(DatagridActionsColumn, { label: createButton },
                editButton,
                showButton))));
};
var EmployerSimpleFormWithNestedDatagrid = function () { return (React.createElement(Edit, null,
    React.createElement(SimpleForm, null,
        React.createElement(TextInput, { source: "name", validate: required() }),
        React.createElement(TextInput, { source: "address", validate: required() }),
        React.createElement(TextInput, { source: "city", validate: required() }),
        React.createElement(NestedCustomersDatagrid, null)))); };
var EmployerList = function () { return (React.createElement(List, { empty: false },
    React.createElement(Datagrid, { rowClick: "edit" },
        React.createElement(NumberField, { source: "id" }),
        React.createElement(TextField, { source: "name" }),
        React.createElement(TextField, { source: "address" }),
        React.createElement(TextField, { source: "city" })))); };
export var StandaloneInSimpleForm = function () {
    var history = createHashHistory();
    return (React.createElement(Admin, { dataProvider: dataProvider, i18nProvider: i18nProvider, history: history },
        React.createElement(Resource, { name: "employers", list: EmployerList, edit: EmployerSimpleFormWithNestedDatagrid }),
        React.createElement(Resource, { name: "customers", list: CustomerListDialogs })));
};
var EmployerTabbedFormWithNestedDatagrid = function () { return (React.createElement(Edit, null,
    React.createElement(TabbedForm, null,
        React.createElement(FormTab, { label: "Identity" },
            React.createElement(TextInput, { source: "name", validate: required() }),
            React.createElement(NestedCustomersDatagrid, { syncWithLocation: false })),
        React.createElement(FormTab, { label: "Address" },
            React.createElement(TextInput, { source: "address", validate: required() }),
            React.createElement(TextInput, { source: "city", validate: required() }))))); };
export var StandaloneInTabbedForm = function () {
    var history = createHashHistory();
    return (React.createElement(Admin, { dataProvider: dataProvider, i18nProvider: i18nProvider, history: history },
        React.createElement(Resource, { name: "employers", list: EmployerList, edit: EmployerTabbedFormWithNestedDatagrid }),
        React.createElement(Resource, { name: "customers", list: CustomerListDialogs })));
};
var EmployerSimpleFormWithFullyControlledDialogs = function () {
    var record = useRecordContext();
    var _a = useState(false), isCreateDialogOpen = _a[0], setIsCreateDialogOpen = _a[1];
    var openCreateDialog = useCallback(function () {
        setIsCreateDialogOpen(true);
    }, []);
    var closeCreateDialog = useCallback(function () {
        setIsCreateDialogOpen(false);
    }, []);
    return (React.createElement(SimpleForm, null,
        React.createElement(TextInput, { source: "name", validate: required() }),
        React.createElement(TextInput, { source: "address", validate: required() }),
        React.createElement(TextInput, { source: "city", validate: required() }),
        React.createElement(Button, { label: "Create a new customer", onClick: function () { return openCreateDialog(); }, size: "medium", variant: "contained", sx: { mb: 4 } }),
        React.createElement(CreateDialog, { fullWidth: true, maxWidth: "md", record: { employer_id: record === null || record === void 0 ? void 0 : record.id }, isOpen: isCreateDialogOpen, open: openCreateDialog, close: closeCreateDialog, resource: "customers" },
            React.createElement(CustomerForm, null)),
        React.createElement(ReferenceManyField, { label: "Customers", reference: "customers", target: "employer_id" },
            React.createElement(Datagrid, null,
                React.createElement(TextField, { source: "id" }),
                React.createElement(TextField, { source: "first_name" }),
                React.createElement(TextField, { source: "last_name" }),
                React.createElement(DateField, { source: "dob", label: "born" }),
                React.createElement(SelectField, { source: "sex", choices: sexChoices })))));
};
export var EmployerEditWithFullyControlledDialogs = function () { return (React.createElement(Edit, { mutationMode: "pessimistic" },
    React.createElement(EmployerSimpleFormWithFullyControlledDialogs, null))); };
export var StandaloneWithFullyControlledCreateDialog = function () {
    var history = createHashHistory();
    return (React.createElement(Admin, { dataProvider: dataProvider, i18nProvider: i18nProvider, history: history },
        React.createElement(Resource, { name: "employers", list: EmployerList, edit: EmployerEditWithFullyControlledDialogs })));
};
var CustomerListDialogsWithMeta = function () { return (React.createElement(React.Fragment, null,
    React.createElement(CustomerList, null),
    React.createElement(CreateDialog, { fullWidth: true, maxWidth: "md", mutationOptions: { meta: { foo: 'bar' } }, redirect: "edit", title: "In Create View" },
        React.createElement(CustomerForm, null)),
    React.createElement(EditDialog, { fullWidth: true, maxWidth: "md", mutationMode: "pessimistic", mutationOptions: { meta: { foo: 'bar' } }, redirect: "show", title: "In Edit View" },
        React.createElement(CustomerForm, null)),
    React.createElement(ShowDialog, { fullWidth: true, maxWidth: "md", title: "In Show View" },
        React.createElement(CustomerLayoutForm, null)))); };
export var Meta = function (_a) {
    var _b = _a.dataProvider, dataProviderProp = _b === void 0 ? dataProvider : _b;
    var history = createHashHistory();
    return (React.createElement(Admin, { dataProvider: dataProviderProp, i18nProvider: i18nProvider, history: history },
        React.createElement(Resource, { name: "customers", list: CustomerListDialogsWithMeta })));
};
var CustomerListDialogsWithOnSuccess = function () {
    var notify = useNotify();
    return (React.createElement(React.Fragment, null,
        React.createElement(CustomerList, null),
        React.createElement(CreateDialog, { fullWidth: true, maxWidth: "md", mutationOptions: { onSuccess: function () { return notify('Created'); } }, redirect: "edit", title: "In Create View" },
            React.createElement(CustomerForm, null)),
        React.createElement(EditDialog, { fullWidth: true, maxWidth: "md", mutationMode: "pessimistic", mutationOptions: { onSuccess: function () { return notify('Updated'); } }, redirect: "show", title: "In Edit View" },
            React.createElement(CustomerForm, null)),
        React.createElement(ShowDialog, { fullWidth: true, maxWidth: "md", title: "In Show View" },
            React.createElement(CustomerLayoutForm, null))));
};
export var OnSuccess = function (_a) {
    var _b = _a.dataProvider, dataProviderProp = _b === void 0 ? dataProvider : _b;
    var history = createHashHistory();
    return (React.createElement(Admin, { dataProvider: dataProviderProp, i18nProvider: i18nProvider, history: history },
        React.createElement(Resource, { name: "customers", list: CustomerListDialogsWithOnSuccess })));
};
var OnCloseDialogs = function () {
    var redirect = useRedirect();
    return (React.createElement(React.Fragment, null,
        React.createElement(CustomerList, null),
        React.createElement(CreateDialog, { fullWidth: true, maxWidth: "md", close: function (event, reason) {
                // eslint-disable-next-line no-console
                console.log('CreateDialog close: ' + reason);
                redirect('list', 'customers');
            } },
            React.createElement(CustomerForm, null)),
        React.createElement(EditDialog, { fullWidth: true, maxWidth: "md", close: function (event, reason) {
                // eslint-disable-next-line no-console
                console.log('EditDialog close: ' + reason);
                redirect('list', 'customers');
            } },
            React.createElement(CustomerForm, null)),
        React.createElement(ShowDialog, { fullWidth: true, maxWidth: "md", close: function (event, reason) {
                // eslint-disable-next-line no-console
                console.log('ShowDialog close: ' + reason);
                redirect('list', 'customers');
            } },
            React.createElement(CustomerLayoutForm, null))));
};
export var OnClose = function (_a) {
    var _b = _a.dataProvider, dataProviderProp = _b === void 0 ? dataProvider : _b;
    var history = createHashHistory();
    return (React.createElement(Admin, { dataProvider: dataProviderProp, i18nProvider: i18nProvider, history: history },
        React.createElement(Resource, { name: "customers", list: OnCloseDialogs })));
};
export default {
    title: 'ra-form-layout/DialogForm',
    excludeStories: ['EmployerEditWithFullyControlledDialogs'],
};
