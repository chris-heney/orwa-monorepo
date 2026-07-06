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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { Children, isValidElement, useState } from 'react';
import fakeRestProvider from 'ra-data-fakerest';
import { TableCell, TableHead, TableRow, Card } from '@mui/material';
import { Admin, Resource, List, TextField, TextInput, DateField, DateInput, SelectField, SelectInput, Show, SimpleShowLayout, required, useNotify, useRefresh, ListContextProvider, useList, } from 'react-admin';
import { createMemoryHistory } from 'history';
import { DeleteRowButton, EditRowButton, EditableDatagrid, RowForm, useRowContext, } from '../src';
export default { title: 'ra-editable-datagrid/EditableDatagrid' };
var storyDataProvider = function () {
    return fakeRestProvider({
        artists: [
            {
                id: 1,
                name: 'Mercury',
                firstname: 'Freddy',
                dob: new Date('1946-09-05'),
                prof: 'singer',
            },
            {
                id: 2,
                name: 'John',
                firstname: 'Elton',
                dob: new Date('1947-03-25'),
                prof: 'singer',
            },
            {
                id: 3,
                name: 'Collins',
                firstname: 'Phil',
                dob: new Date('1951-01-30'),
                prof: 'singer',
            },
            {
                id: 4,
                name: 'Ford',
                firstname: 'Harrison',
                dob: new Date('1942-07-13'),
                prof: 'actor',
            },
            {
                id: 5,
                name: 'Streep',
                firstname: 'Meryl',
                dob: new Date('1949-06-22'),
                prof: 'actor',
            },
        ],
        events: [],
        performances: [],
    }, process.env.NODE_ENV !== 'test');
};
var professionChoices = [
    { id: 'actor', name: 'Actor' },
    { id: 'singer', name: 'Singer' },
    { id: 'other', name: 'Other' },
];
var ArtistForm = function (props) { return (React.createElement(RowForm, __assign({ defaultValues: { firstname: 'John', name: 'Doe' } }, props),
    React.createElement(TextField, { source: "id" }),
    React.createElement(TextInput, { source: "firstname", validate: required() }),
    React.createElement(TextInput, { source: "name", validate: required() }),
    React.createElement(DateInput, { source: "dob", label: "Born", validate: required() }),
    React.createElement(SelectInput, { source: "prof", label: "Profession", choices: professionChoices }))); };
var ArtistList = function () { return (React.createElement(List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
    React.createElement(EditableDatagrid, { createForm: React.createElement(ArtistForm, null), editForm: React.createElement(ArtistForm, null) },
        React.createElement(TextField, { source: "id" }),
        React.createElement(TextField, { source: "firstname" }),
        React.createElement(TextField, { source: "name" }),
        React.createElement(DateField, { source: "dob", label: "Born" }),
        React.createElement(SelectField, { source: "prof", label: "Profession", choices: professionChoices })))); };
var ArtistListPessimistic = function () { return (React.createElement(List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
    React.createElement(EditableDatagrid, { createForm: React.createElement(ArtistForm, null), editForm: React.createElement(ArtistForm, null), mutationMode: "pessimistic" },
        React.createElement(TextField, { source: "id" }),
        React.createElement(TextField, { source: "firstname" }),
        React.createElement(TextField, { source: "name" }),
        React.createElement(DateField, { source: "dob", label: "Born" }),
        React.createElement(SelectField, { source: "prof", label: "Profession", choices: professionChoices })))); };
var ArtistListOptimistic = function () { return (React.createElement(List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
    React.createElement(EditableDatagrid, { createForm: React.createElement(ArtistForm, null), editForm: React.createElement(ArtistForm, null), mutationMode: "optimistic" },
        React.createElement(TextField, { source: "id" }),
        React.createElement(TextField, { source: "firstname" }),
        React.createElement(TextField, { source: "name" }),
        React.createElement(DateField, { source: "dob", label: "Born" }),
        React.createElement(SelectField, { source: "prof", label: "Profession", choices: professionChoices })))); };
export var Undoable = function (_a) {
    var _b = _a.dataProvider, dataProvider = _b === void 0 ? storyDataProvider() : _b;
    return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider },
        React.createElement(Resource, { name: "artists", list: ArtistList })));
};
export var Pessimistic = function (_a) {
    var _b = _a.dataProvider, dataProvider = _b === void 0 ? storyDataProvider() : _b;
    return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider },
        React.createElement(Resource, { name: "artists", list: ArtistListPessimistic })));
};
export var Optimistic = function (_a) {
    var _b = _a.dataProvider, dataProvider = _b === void 0 ? storyDataProvider() : _b;
    return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider },
        React.createElement(Resource, { name: "artists", list: ArtistListOptimistic })));
};
var ArtistListNoSubmitOnEnter = function () { return (React.createElement(List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
    React.createElement(EditableDatagrid, { createForm: React.createElement(ArtistForm, { submitOnEnter: false }), editForm: React.createElement(ArtistForm, { submitOnEnter: false }) },
        React.createElement(TextField, { source: "id" }),
        React.createElement(TextField, { source: "firstname" }),
        React.createElement(TextField, { source: "name" }),
        React.createElement(DateField, { source: "dob", label: "Born" }),
        React.createElement(SelectField, { source: "prof", label: "Profession", choices: professionChoices })))); };
export var NoSubmitOnEnter = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: storyDataProvider() },
    React.createElement(Resource, { name: "artists", list: ArtistListNoSubmitOnEnter }))); };
var delayedDataProvider = function (dataProvider) {
    return new Proxy(dataProvider, {
        get: function (target, name) { return function (resource, params) {
            return new Promise(function (resolve) {
                return setTimeout(function () { return resolve(dataProvider[name](resource, params)); }, 1500);
            });
        }; },
    });
};
export var SlowUndoable = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: delayedDataProvider(storyDataProvider()) },
    React.createElement(Resource, { name: "artists", list: ArtistList }))); };
export var SlowPessimistic = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: delayedDataProvider(storyDataProvider()) },
    React.createElement(Resource, { name: "artists", list: ArtistListPessimistic }))); };
export var SlowOptimistic = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: delayedDataProvider(storyDataProvider()) },
    React.createElement(Resource, { name: "artists", list: ArtistListOptimistic }))); };
var ArtistListConfirmDelete = function () { return (React.createElement(List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
    React.createElement(EditableDatagrid, { mutationMode: "pessimistic", createForm: React.createElement(ArtistForm, null), editForm: React.createElement(ArtistForm, null) },
        React.createElement(TextField, { source: "id" }),
        React.createElement(TextField, { source: "firstname" }),
        React.createElement(TextField, { source: "name" }),
        React.createElement(DateField, { source: "dob", label: "Born" }),
        React.createElement(SelectField, { source: "prof", label: "Profession", choices: professionChoices })))); };
export var ConfirmDelete = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: storyDataProvider() },
    React.createElement(Resource, { name: "artists", list: ArtistListConfirmDelete }))); };
var ArtistListNoDelete = function () { return (React.createElement(List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
    React.createElement(EditableDatagrid, { noDelete: true, createForm: React.createElement(ArtistForm, null), editForm: React.createElement(ArtistForm, null) },
        React.createElement(TextField, { source: "id" }),
        React.createElement(TextField, { source: "firstname" }),
        React.createElement(TextField, { source: "name" }),
        React.createElement(DateField, { source: "dob", label: "Born" }),
        React.createElement(SelectField, { source: "prof", label: "Profession", choices: professionChoices })))); };
export var NoDelete = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: storyDataProvider() },
    React.createElement(Resource, { name: "artists", list: ArtistListNoDelete }))); };
var ArtistListRowClick = function () { return (React.createElement(List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
    React.createElement(EditableDatagrid, { createForm: React.createElement(ArtistForm, null), editForm: React.createElement(ArtistForm, null), rowClick: "edit" },
        React.createElement(TextField, { source: "id" }),
        React.createElement(TextField, { source: "firstname" }),
        React.createElement(TextField, { source: "name" }),
        React.createElement(DateField, { source: "dob", label: "Born" }),
        React.createElement(SelectField, { source: "prof", label: "Profession", choices: professionChoices })))); };
export var RowClickEdit = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: storyDataProvider() },
    React.createElement(Resource, { name: "artists", list: ArtistListRowClick }))); };
var ArtistListRowClickShow = function () { return (React.createElement(List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
    React.createElement(EditableDatagrid, { createForm: React.createElement(ArtistForm, null), editForm: React.createElement(ArtistForm, null), rowClick: "show" },
        React.createElement(TextField, { source: "id" }),
        React.createElement(TextField, { source: "firstname" }),
        React.createElement(TextField, { source: "name" }),
        React.createElement(DateField, { source: "dob", label: "Born" }),
        React.createElement(SelectField, { source: "prof", label: "Profession", choices: professionChoices })))); };
var ArtistShow = function () { return (React.createElement(Show, null,
    React.createElement(SimpleShowLayout, null,
        React.createElement(TextField, { source: "id" }),
        React.createElement(TextField, { source: "firstname" }),
        React.createElement(TextField, { source: "name" }),
        React.createElement(DateField, { source: "dob", label: "Born" }),
        React.createElement(SelectField, { source: "prof", label: "Profession", choices: professionChoices })))); };
export var RowClickEditShow = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: storyDataProvider() },
    React.createElement(Resource, { name: "artists", list: ArtistListRowClickShow, show: ArtistShow }))); };
var ArtistFormCreateSideEffect = function () {
    var notify = useNotify();
    var refresh = useRefresh();
    var close = useRowContext().close;
    return (React.createElement(ArtistForm, { mutationOptions: {
            onSuccess: function (record) {
                notify("Artist ".concat(record.name, " has been added"));
                refresh();
                close();
            },
        } }));
};
var ArtistFormEditSideEffect = function (_a) {
    var mutationMode = _a.mutationMode, _b = _a.mutationOptions, mutationOptions = _b === void 0 ? {} : _b;
    var notify = useNotify();
    var close = useRowContext().close;
    var onSuccess = mutationOptions.onSuccess, onError = mutationOptions.onError, otherMutationOptions = __rest(mutationOptions, ["onSuccess", "onError"]);
    mutationOptions = __assign({ onSuccess: function (data, variables, context) {
            onSuccess && onSuccess(data, variables, context);
            notify("Artist ".concat(data === null || data === void 0 ? void 0 : data.name, " has been updated"), {
                type: 'info',
                undoable: mutationMode === 'undoable',
            });
            close();
        }, onError: function (error, variables, context) {
            onError && onError(error, variables, context);
            notify(typeof error === 'string'
                ? error
                : error.message || 'ra.notification.http_error', { type: 'warning' });
            close();
        } }, otherMutationOptions);
    return React.createElement(ArtistForm, { mutationOptions: mutationOptions });
};
var ArtistListCustomSideEffectsUndoable = function (_a) {
    var mutationOptions = _a.mutationOptions;
    var mutationMode = 'undoable';
    return (React.createElement(List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
        React.createElement(EditableDatagrid, { createForm: React.createElement(ArtistFormCreateSideEffect, null), editForm: React.createElement(ArtistFormEditSideEffect, { mutationMode: mutationMode, mutationOptions: mutationOptions }), rowClick: "edit", mutationMode: mutationMode },
            React.createElement(TextField, { source: "id" }),
            React.createElement(TextField, { source: "firstname" }),
            React.createElement(TextField, { source: "name" }),
            React.createElement(DateField, { source: "dob", label: "Born" }),
            React.createElement(SelectField, { source: "prof", label: "Profession", choices: professionChoices }))));
};
var ArtistListCustomSideEffectsPessimistic = function (_a) {
    var mutationOptions = _a.mutationOptions;
    var mutationMode = 'pessimistic';
    return (React.createElement(List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
        React.createElement(EditableDatagrid, { createForm: React.createElement(ArtistFormCreateSideEffect, null), editForm: React.createElement(ArtistFormEditSideEffect, { mutationMode: mutationMode, mutationOptions: mutationOptions }), rowClick: "edit", mutationMode: mutationMode },
            React.createElement(TextField, { source: "id" }),
            React.createElement(TextField, { source: "firstname" }),
            React.createElement(TextField, { source: "name" }),
            React.createElement(DateField, { source: "dob", label: "Born" }),
            React.createElement(SelectField, { source: "prof", label: "Profession", choices: professionChoices }))));
};
var ArtistListCustomSideEffectsOptimistic = function (_a) {
    var mutationOptions = _a.mutationOptions;
    var mutationMode = 'optimistic';
    return (React.createElement(List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
        React.createElement(EditableDatagrid, { createForm: React.createElement(ArtistFormCreateSideEffect, null), editForm: React.createElement(ArtistFormEditSideEffect, { mutationMode: mutationMode, mutationOptions: mutationOptions }), rowClick: "edit", mutationMode: mutationMode },
            React.createElement(TextField, { source: "id" }),
            React.createElement(TextField, { source: "firstname" }),
            React.createElement(TextField, { source: "name" }),
            React.createElement(DateField, { source: "dob", label: "Born" }),
            React.createElement(SelectField, { source: "prof", label: "Profession", choices: professionChoices }))));
};
export var CustomSideEffectsUndoable = function (_a) {
    var _b = _a.dataProvider, dataProvider = _b === void 0 ? storyDataProvider() : _b, mutationOptions = _a.mutationOptions;
    return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider },
        React.createElement(Resource, { name: "artists", list: React.createElement(ArtistListCustomSideEffectsUndoable, { mutationOptions: mutationOptions }) })));
};
export var CustomSideEffectsPessimistic = function (_a) {
    var _b = _a.dataProvider, dataProvider = _b === void 0 ? storyDataProvider() : _b, mutationOptions = _a.mutationOptions;
    return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider },
        React.createElement(Resource, { name: "artists", list: React.createElement(ArtistListCustomSideEffectsPessimistic, { mutationOptions: mutationOptions }) })));
};
export var CustomSideEffectsOptimistic = function (_a) {
    var _b = _a.dataProvider, dataProvider = _b === void 0 ? storyDataProvider() : _b, mutationOptions = _a.mutationOptions;
    return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider },
        React.createElement(Resource, { name: "artists", list: React.createElement(ArtistListCustomSideEffectsOptimistic, { mutationOptions: mutationOptions }) })));
};
var ArtistListWithTransform = function () {
    var handleTransform = function (values) {
        // eslint-disable-next-line no-console
        console.log(values);
        return values;
    };
    return (React.createElement(List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
        React.createElement(EditableDatagrid, { createForm: React.createElement(ArtistForm, { transform: handleTransform }), editForm: React.createElement(ArtistForm, { transform: handleTransform }) },
            React.createElement(TextField, { source: "id" }),
            React.createElement(TextField, { source: "firstname" }),
            React.createElement(TextField, { source: "name" }),
            React.createElement(DateField, { source: "dob", label: "Born" }),
            React.createElement(SelectField, { source: "prof", label: "Profession", choices: professionChoices }))));
};
export var WithTransform = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: storyDataProvider() },
    React.createElement(Resource, { name: "artists", list: ArtistListWithTransform }))); };
var ArtistListNoSubmitOnEnterWithTransform = function () {
    var handleTransform = function (values) {
        // eslint-disable-next-line no-console
        console.log(values);
        return values;
    };
    return (React.createElement(List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
        React.createElement(EditableDatagrid, { createForm: React.createElement(ArtistForm, { submitOnEnter: false, transform: handleTransform }), editForm: React.createElement(ArtistForm, { submitOnEnter: false, transform: handleTransform }) },
            React.createElement(TextField, { source: "id" }),
            React.createElement(TextField, { source: "firstname" }),
            React.createElement(TextField, { source: "name" }),
            React.createElement(DateField, { source: "dob", label: "Born" }),
            React.createElement(SelectField, { source: "prof", label: "Profession", choices: professionChoices }))));
};
export var NoSubmitOnEnterWithTransform = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: storyDataProvider() },
    React.createElement(Resource, { name: "artists", list: ArtistListNoSubmitOnEnterWithTransform }))); };
var getArtistListWithMeta = function (mutationMode) {
    var ArtistListWithMeta = function () {
        var meta = { foo: 'bar' };
        return (React.createElement(List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
            React.createElement(EditableDatagrid, { createForm: React.createElement(ArtistForm, { mutationOptions: { meta: meta } }), editForm: React.createElement(ArtistForm, { mutationOptions: { meta: meta } }), rowClick: "edit", mutationMode: mutationMode, actions: React.createElement(React.Fragment, null,
                    React.createElement(EditRowButton, null),
                    React.createElement(DeleteRowButton, { mutationMode: mutationMode, mutationOptions: { meta: meta } })) },
                React.createElement(TextField, { source: "id" }),
                React.createElement(TextField, { source: "firstname" }),
                React.createElement(TextField, { source: "name" }),
                React.createElement(DateField, { source: "dob", label: "Born" }),
                React.createElement(SelectField, { source: "prof", label: "Profession", choices: professionChoices }))));
    };
    return ArtistListWithMeta;
};
export var WithMeta = function (_a) {
    var _b = _a.mutationMode, mutationMode = _b === void 0 ? 'undoable' : _b, _c = _a.dataProvider, dataProviderProp = _c === void 0 ? storyDataProvider() : _c;
    return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProviderProp },
        React.createElement(Resource, { name: "artists", list: getArtistListWithMeta(mutationMode) })));
};
WithMeta.args = {
    mutationMode: 'undoable',
};
WithMeta.argTypes = {
    mutationMode: {
        options: ['undoable', 'pessimistic', 'optimistic'],
        control: { type: 'inline-radio' },
    },
};
var StyledArtistList = function () { return (React.createElement(List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
    React.createElement(EditableDatagrid, { createForm: React.createElement(ArtistForm, null), editForm: React.createElement(ArtistForm, null), sx: {
            backgroundColor: '#ffb',
            '& .RaEditableDatagrid-rowEven': { backgroundColor: '#ddd' },
        } },
        React.createElement(TextField, { source: "id" }),
        React.createElement(TextField, { source: "firstname" }),
        React.createElement(TextField, { source: "name" }),
        React.createElement(DateField, { source: "dob", label: "Born" }),
        React.createElement(SelectField, { source: "prof", label: "Profession", choices: professionChoices })))); };
export var Styled = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: storyDataProvider() },
    React.createElement(Resource, { name: "artists", list: StyledArtistList }))); };
var getSizeArtistList = function (size) {
    var SizeArtistList = function () {
        var meta = { foo: 'bar' };
        return (React.createElement(List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
            React.createElement(EditableDatagrid, { createForm: React.createElement(ArtistForm, { mutationOptions: { meta: meta } }), editForm: React.createElement(ArtistForm, { mutationOptions: { meta: meta } }), size: size },
                React.createElement(TextField, { source: "id" }),
                React.createElement(TextField, { source: "firstname" }),
                React.createElement(TextField, { source: "name" }),
                React.createElement(DateField, { source: "dob", label: "Born" }),
                React.createElement(SelectField, { source: "prof", label: "Profession", choices: professionChoices }))));
    };
    return SizeArtistList;
};
export var Size = function (_a) {
    var _b = _a.size, size = _b === void 0 ? 'small' : _b;
    return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: storyDataProvider() },
        React.createElement(Resource, { name: "artists", list: getSizeArtistList(size) })));
};
Size.args = {
    size: 'small',
};
Size.argTypes = {
    size: {
        options: ['small', 'medium', 'large'],
        control: { type: 'inline-radio' },
    },
};
var CustomDatagridHeaderCell = function (props) {
    var field = props.field;
    return (React.createElement(TableCell, { variant: "head" },
        React.createElement("span", null, field.props.source)));
};
var CustomDatagridHeader = function (props) {
    var children = props.children;
    return (React.createElement(TableHead, null,
        React.createElement(TableRow, null,
            React.createElement(TableCell, { variant: "head" },
                React.createElement("span", null, "\u00A0")),
            Children.map(children, function (field, index) {
                return isValidElement(field) ? (React.createElement(CustomDatagridHeaderCell, { field: field, key: field.props.source || index })) : null;
            }))));
};
var CustomHeaderArtistList = function () { return (React.createElement(List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
    React.createElement(EditableDatagrid, { createForm: React.createElement(ArtistForm, null), editForm: React.createElement(ArtistForm, null), header: CustomDatagridHeader },
        React.createElement(TextField, { source: "id" }),
        React.createElement(TextField, { source: "firstname" }),
        React.createElement(TextField, { source: "name" }),
        React.createElement(DateField, { source: "dob", label: "Born" }),
        React.createElement(SelectField, { source: "prof", label: "Profession", choices: professionChoices })))); };
export var CustomHeader = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: storyDataProvider() },
    React.createElement(Resource, { name: "artists", list: CustomHeaderArtistList }))); };
var BookForm = function (props) {
    var onSuccess = props.onSuccess, rest = __rest(props, ["onSuccess"]);
    var close = useRowContext().close;
    var mutationOptions = {
        onSuccess: onSuccess
            ? function (data) {
                onSuccess(data);
                close();
            }
            : undefined,
    };
    return (React.createElement(RowForm, __assign({ mutationOptions: mutationOptions }, rest),
        React.createElement(TextField, { source: "id" }),
        React.createElement(TextInput, { source: "title", validate: required() })));
};
var CustomContextArtistList = function () {
    var _a = useState([
        {
            id: 1,
            title: 'Le Dernier Jour d’un condamné',
        },
        {
            id: 2,
            title: 'Germinal',
        },
        {
            id: 3,
            title: 'La Promenade au phare',
        },
    ]), books = _a[0], setBooks = _a[1];
    var notify = useNotify();
    var onSuccess = function (data) {
        notify('ra.notification.updated', {
            type: 'info',
            messageArgs: {
                smart_count: 1,
            },
        });
        setBooks(function (currentBooks) {
            return currentBooks.map(function (book) { return (book.id === data.id ? data : book); });
        });
    };
    var listContext = useList({ data: books });
    return (React.createElement(Card, { sx: { mt: 2 } },
        React.createElement(ListContextProvider, { value: listContext },
            React.createElement(EditableDatagrid, { bulkActionButtons: false, noDelete: true, editForm: React.createElement(BookForm, { onSuccess: onSuccess }), mutationMode: "pessimistic", rowClick: "edit" },
                React.createElement(TextField, { source: "id" }),
                React.createElement(TextField, { source: "title" })))));
};
var emptyDataProvider = {
    create: function () { return Promise.resolve({ data: undefined }); },
    delete: function () { return Promise.resolve({ data: undefined }); },
    deleteMany: function () { return Promise.resolve({ data: undefined }); },
    update: function (_, params) {
        return Promise.resolve({ data: params.data });
    },
    updateMany: function () { return Promise.resolve({ data: undefined }); },
    getList: function () { return Promise.resolve({ data: [], total: 0 }); },
    getMany: function () { return Promise.resolve({ data: undefined }); },
    getOne: function () { return Promise.resolve({ data: undefined }); },
    getManyReference: function () { return Promise.resolve({ data: [], total: 0 }); },
};
export var WithListContextProvider = function (_a) {
    var _b = _a.dataProvider, dataProvider = _b === void 0 ? emptyDataProvider : _b;
    return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider },
        React.createElement(Resource, { name: "books", list: CustomContextArtistList })));
};
