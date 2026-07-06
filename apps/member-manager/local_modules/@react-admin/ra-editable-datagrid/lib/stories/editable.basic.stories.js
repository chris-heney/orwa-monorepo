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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithListContextProvider = exports.CustomHeader = exports.Size = exports.Styled = exports.WithMeta = exports.NoSubmitOnEnterWithTransform = exports.WithTransform = exports.CustomSideEffectsOptimistic = exports.CustomSideEffectsPessimistic = exports.CustomSideEffectsUndoable = exports.RowClickEditShow = exports.RowClickEdit = exports.NoDelete = exports.ConfirmDelete = exports.SlowOptimistic = exports.SlowPessimistic = exports.SlowUndoable = exports.NoSubmitOnEnter = exports.Optimistic = exports.Pessimistic = exports.Undoable = void 0;
var react_1 = __importStar(require("react"));
var ra_data_fakerest_1 = __importDefault(require("ra-data-fakerest"));
var material_1 = require("@mui/material");
var react_admin_1 = require("react-admin");
var history_1 = require("history");
var src_1 = require("../src");
exports.default = { title: 'ra-editable-datagrid/EditableDatagrid' };
var storyDataProvider = function () {
    return (0, ra_data_fakerest_1.default)({
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
var ArtistForm = function (props) { return (react_1.default.createElement(src_1.RowForm, __assign({ defaultValues: { firstname: 'John', name: 'Doe' } }, props),
    react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
    react_1.default.createElement(react_admin_1.TextInput, { source: "firstname", validate: (0, react_admin_1.required)() }),
    react_1.default.createElement(react_admin_1.TextInput, { source: "name", validate: (0, react_admin_1.required)() }),
    react_1.default.createElement(react_admin_1.DateInput, { source: "dob", label: "Born", validate: (0, react_admin_1.required)() }),
    react_1.default.createElement(react_admin_1.SelectInput, { source: "prof", label: "Profession", choices: professionChoices }))); };
var ArtistList = function () { return (react_1.default.createElement(react_admin_1.List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
    react_1.default.createElement(src_1.EditableDatagrid, { createForm: react_1.default.createElement(ArtistForm, null), editForm: react_1.default.createElement(ArtistForm, null) },
        react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "firstname" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "name" }),
        react_1.default.createElement(react_admin_1.DateField, { source: "dob", label: "Born" }),
        react_1.default.createElement(react_admin_1.SelectField, { source: "prof", label: "Profession", choices: professionChoices })))); };
var ArtistListPessimistic = function () { return (react_1.default.createElement(react_admin_1.List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
    react_1.default.createElement(src_1.EditableDatagrid, { createForm: react_1.default.createElement(ArtistForm, null), editForm: react_1.default.createElement(ArtistForm, null), mutationMode: "pessimistic" },
        react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "firstname" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "name" }),
        react_1.default.createElement(react_admin_1.DateField, { source: "dob", label: "Born" }),
        react_1.default.createElement(react_admin_1.SelectField, { source: "prof", label: "Profession", choices: professionChoices })))); };
var ArtistListOptimistic = function () { return (react_1.default.createElement(react_admin_1.List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
    react_1.default.createElement(src_1.EditableDatagrid, { createForm: react_1.default.createElement(ArtistForm, null), editForm: react_1.default.createElement(ArtistForm, null), mutationMode: "optimistic" },
        react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "firstname" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "name" }),
        react_1.default.createElement(react_admin_1.DateField, { source: "dob", label: "Born" }),
        react_1.default.createElement(react_admin_1.SelectField, { source: "prof", label: "Profession", choices: professionChoices })))); };
var Undoable = function (_a) {
    var _b = _a.dataProvider, dataProvider = _b === void 0 ? storyDataProvider() : _b;
    return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider },
        react_1.default.createElement(react_admin_1.Resource, { name: "artists", list: ArtistList })));
};
exports.Undoable = Undoable;
var Pessimistic = function (_a) {
    var _b = _a.dataProvider, dataProvider = _b === void 0 ? storyDataProvider() : _b;
    return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider },
        react_1.default.createElement(react_admin_1.Resource, { name: "artists", list: ArtistListPessimistic })));
};
exports.Pessimistic = Pessimistic;
var Optimistic = function (_a) {
    var _b = _a.dataProvider, dataProvider = _b === void 0 ? storyDataProvider() : _b;
    return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider },
        react_1.default.createElement(react_admin_1.Resource, { name: "artists", list: ArtistListOptimistic })));
};
exports.Optimistic = Optimistic;
var ArtistListNoSubmitOnEnter = function () { return (react_1.default.createElement(react_admin_1.List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
    react_1.default.createElement(src_1.EditableDatagrid, { createForm: react_1.default.createElement(ArtistForm, { submitOnEnter: false }), editForm: react_1.default.createElement(ArtistForm, { submitOnEnter: false }) },
        react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "firstname" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "name" }),
        react_1.default.createElement(react_admin_1.DateField, { source: "dob", label: "Born" }),
        react_1.default.createElement(react_admin_1.SelectField, { source: "prof", label: "Profession", choices: professionChoices })))); };
var NoSubmitOnEnter = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: storyDataProvider() },
    react_1.default.createElement(react_admin_1.Resource, { name: "artists", list: ArtistListNoSubmitOnEnter }))); };
exports.NoSubmitOnEnter = NoSubmitOnEnter;
var delayedDataProvider = function (dataProvider) {
    return new Proxy(dataProvider, {
        get: function (target, name) { return function (resource, params) {
            return new Promise(function (resolve) {
                return setTimeout(function () { return resolve(dataProvider[name](resource, params)); }, 1500);
            });
        }; },
    });
};
var SlowUndoable = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: delayedDataProvider(storyDataProvider()) },
    react_1.default.createElement(react_admin_1.Resource, { name: "artists", list: ArtistList }))); };
exports.SlowUndoable = SlowUndoable;
var SlowPessimistic = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: delayedDataProvider(storyDataProvider()) },
    react_1.default.createElement(react_admin_1.Resource, { name: "artists", list: ArtistListPessimistic }))); };
exports.SlowPessimistic = SlowPessimistic;
var SlowOptimistic = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: delayedDataProvider(storyDataProvider()) },
    react_1.default.createElement(react_admin_1.Resource, { name: "artists", list: ArtistListOptimistic }))); };
exports.SlowOptimistic = SlowOptimistic;
var ArtistListConfirmDelete = function () { return (react_1.default.createElement(react_admin_1.List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
    react_1.default.createElement(src_1.EditableDatagrid, { mutationMode: "pessimistic", createForm: react_1.default.createElement(ArtistForm, null), editForm: react_1.default.createElement(ArtistForm, null) },
        react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "firstname" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "name" }),
        react_1.default.createElement(react_admin_1.DateField, { source: "dob", label: "Born" }),
        react_1.default.createElement(react_admin_1.SelectField, { source: "prof", label: "Profession", choices: professionChoices })))); };
var ConfirmDelete = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: storyDataProvider() },
    react_1.default.createElement(react_admin_1.Resource, { name: "artists", list: ArtistListConfirmDelete }))); };
exports.ConfirmDelete = ConfirmDelete;
var ArtistListNoDelete = function () { return (react_1.default.createElement(react_admin_1.List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
    react_1.default.createElement(src_1.EditableDatagrid, { noDelete: true, createForm: react_1.default.createElement(ArtistForm, null), editForm: react_1.default.createElement(ArtistForm, null) },
        react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "firstname" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "name" }),
        react_1.default.createElement(react_admin_1.DateField, { source: "dob", label: "Born" }),
        react_1.default.createElement(react_admin_1.SelectField, { source: "prof", label: "Profession", choices: professionChoices })))); };
var NoDelete = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: storyDataProvider() },
    react_1.default.createElement(react_admin_1.Resource, { name: "artists", list: ArtistListNoDelete }))); };
exports.NoDelete = NoDelete;
var ArtistListRowClick = function () { return (react_1.default.createElement(react_admin_1.List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
    react_1.default.createElement(src_1.EditableDatagrid, { createForm: react_1.default.createElement(ArtistForm, null), editForm: react_1.default.createElement(ArtistForm, null), rowClick: "edit" },
        react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "firstname" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "name" }),
        react_1.default.createElement(react_admin_1.DateField, { source: "dob", label: "Born" }),
        react_1.default.createElement(react_admin_1.SelectField, { source: "prof", label: "Profession", choices: professionChoices })))); };
var RowClickEdit = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: storyDataProvider() },
    react_1.default.createElement(react_admin_1.Resource, { name: "artists", list: ArtistListRowClick }))); };
exports.RowClickEdit = RowClickEdit;
var ArtistListRowClickShow = function () { return (react_1.default.createElement(react_admin_1.List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
    react_1.default.createElement(src_1.EditableDatagrid, { createForm: react_1.default.createElement(ArtistForm, null), editForm: react_1.default.createElement(ArtistForm, null), rowClick: "show" },
        react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "firstname" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "name" }),
        react_1.default.createElement(react_admin_1.DateField, { source: "dob", label: "Born" }),
        react_1.default.createElement(react_admin_1.SelectField, { source: "prof", label: "Profession", choices: professionChoices })))); };
var ArtistShow = function () { return (react_1.default.createElement(react_admin_1.Show, null,
    react_1.default.createElement(react_admin_1.SimpleShowLayout, null,
        react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "firstname" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "name" }),
        react_1.default.createElement(react_admin_1.DateField, { source: "dob", label: "Born" }),
        react_1.default.createElement(react_admin_1.SelectField, { source: "prof", label: "Profession", choices: professionChoices })))); };
var RowClickEditShow = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: storyDataProvider() },
    react_1.default.createElement(react_admin_1.Resource, { name: "artists", list: ArtistListRowClickShow, show: ArtistShow }))); };
exports.RowClickEditShow = RowClickEditShow;
var ArtistFormCreateSideEffect = function () {
    var notify = (0, react_admin_1.useNotify)();
    var refresh = (0, react_admin_1.useRefresh)();
    var close = (0, src_1.useRowContext)().close;
    return (react_1.default.createElement(ArtistForm, { mutationOptions: {
            onSuccess: function (record) {
                notify("Artist ".concat(record.name, " has been added"));
                refresh();
                close();
            },
        } }));
};
var ArtistFormEditSideEffect = function (_a) {
    var mutationMode = _a.mutationMode, _b = _a.mutationOptions, mutationOptions = _b === void 0 ? {} : _b;
    var notify = (0, react_admin_1.useNotify)();
    var close = (0, src_1.useRowContext)().close;
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
    return react_1.default.createElement(ArtistForm, { mutationOptions: mutationOptions });
};
var ArtistListCustomSideEffectsUndoable = function (_a) {
    var mutationOptions = _a.mutationOptions;
    var mutationMode = 'undoable';
    return (react_1.default.createElement(react_admin_1.List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
        react_1.default.createElement(src_1.EditableDatagrid, { createForm: react_1.default.createElement(ArtistFormCreateSideEffect, null), editForm: react_1.default.createElement(ArtistFormEditSideEffect, { mutationMode: mutationMode, mutationOptions: mutationOptions }), rowClick: "edit", mutationMode: mutationMode },
            react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
            react_1.default.createElement(react_admin_1.TextField, { source: "firstname" }),
            react_1.default.createElement(react_admin_1.TextField, { source: "name" }),
            react_1.default.createElement(react_admin_1.DateField, { source: "dob", label: "Born" }),
            react_1.default.createElement(react_admin_1.SelectField, { source: "prof", label: "Profession", choices: professionChoices }))));
};
var ArtistListCustomSideEffectsPessimistic = function (_a) {
    var mutationOptions = _a.mutationOptions;
    var mutationMode = 'pessimistic';
    return (react_1.default.createElement(react_admin_1.List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
        react_1.default.createElement(src_1.EditableDatagrid, { createForm: react_1.default.createElement(ArtistFormCreateSideEffect, null), editForm: react_1.default.createElement(ArtistFormEditSideEffect, { mutationMode: mutationMode, mutationOptions: mutationOptions }), rowClick: "edit", mutationMode: mutationMode },
            react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
            react_1.default.createElement(react_admin_1.TextField, { source: "firstname" }),
            react_1.default.createElement(react_admin_1.TextField, { source: "name" }),
            react_1.default.createElement(react_admin_1.DateField, { source: "dob", label: "Born" }),
            react_1.default.createElement(react_admin_1.SelectField, { source: "prof", label: "Profession", choices: professionChoices }))));
};
var ArtistListCustomSideEffectsOptimistic = function (_a) {
    var mutationOptions = _a.mutationOptions;
    var mutationMode = 'optimistic';
    return (react_1.default.createElement(react_admin_1.List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
        react_1.default.createElement(src_1.EditableDatagrid, { createForm: react_1.default.createElement(ArtistFormCreateSideEffect, null), editForm: react_1.default.createElement(ArtistFormEditSideEffect, { mutationMode: mutationMode, mutationOptions: mutationOptions }), rowClick: "edit", mutationMode: mutationMode },
            react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
            react_1.default.createElement(react_admin_1.TextField, { source: "firstname" }),
            react_1.default.createElement(react_admin_1.TextField, { source: "name" }),
            react_1.default.createElement(react_admin_1.DateField, { source: "dob", label: "Born" }),
            react_1.default.createElement(react_admin_1.SelectField, { source: "prof", label: "Profession", choices: professionChoices }))));
};
var CustomSideEffectsUndoable = function (_a) {
    var _b = _a.dataProvider, dataProvider = _b === void 0 ? storyDataProvider() : _b, mutationOptions = _a.mutationOptions;
    return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider },
        react_1.default.createElement(react_admin_1.Resource, { name: "artists", list: react_1.default.createElement(ArtistListCustomSideEffectsUndoable, { mutationOptions: mutationOptions }) })));
};
exports.CustomSideEffectsUndoable = CustomSideEffectsUndoable;
var CustomSideEffectsPessimistic = function (_a) {
    var _b = _a.dataProvider, dataProvider = _b === void 0 ? storyDataProvider() : _b, mutationOptions = _a.mutationOptions;
    return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider },
        react_1.default.createElement(react_admin_1.Resource, { name: "artists", list: react_1.default.createElement(ArtistListCustomSideEffectsPessimistic, { mutationOptions: mutationOptions }) })));
};
exports.CustomSideEffectsPessimistic = CustomSideEffectsPessimistic;
var CustomSideEffectsOptimistic = function (_a) {
    var _b = _a.dataProvider, dataProvider = _b === void 0 ? storyDataProvider() : _b, mutationOptions = _a.mutationOptions;
    return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider },
        react_1.default.createElement(react_admin_1.Resource, { name: "artists", list: react_1.default.createElement(ArtistListCustomSideEffectsOptimistic, { mutationOptions: mutationOptions }) })));
};
exports.CustomSideEffectsOptimistic = CustomSideEffectsOptimistic;
var ArtistListWithTransform = function () {
    var handleTransform = function (values) {
        // eslint-disable-next-line no-console
        console.log(values);
        return values;
    };
    return (react_1.default.createElement(react_admin_1.List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
        react_1.default.createElement(src_1.EditableDatagrid, { createForm: react_1.default.createElement(ArtistForm, { transform: handleTransform }), editForm: react_1.default.createElement(ArtistForm, { transform: handleTransform }) },
            react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
            react_1.default.createElement(react_admin_1.TextField, { source: "firstname" }),
            react_1.default.createElement(react_admin_1.TextField, { source: "name" }),
            react_1.default.createElement(react_admin_1.DateField, { source: "dob", label: "Born" }),
            react_1.default.createElement(react_admin_1.SelectField, { source: "prof", label: "Profession", choices: professionChoices }))));
};
var WithTransform = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: storyDataProvider() },
    react_1.default.createElement(react_admin_1.Resource, { name: "artists", list: ArtistListWithTransform }))); };
exports.WithTransform = WithTransform;
var ArtistListNoSubmitOnEnterWithTransform = function () {
    var handleTransform = function (values) {
        // eslint-disable-next-line no-console
        console.log(values);
        return values;
    };
    return (react_1.default.createElement(react_admin_1.List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
        react_1.default.createElement(src_1.EditableDatagrid, { createForm: react_1.default.createElement(ArtistForm, { submitOnEnter: false, transform: handleTransform }), editForm: react_1.default.createElement(ArtistForm, { submitOnEnter: false, transform: handleTransform }) },
            react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
            react_1.default.createElement(react_admin_1.TextField, { source: "firstname" }),
            react_1.default.createElement(react_admin_1.TextField, { source: "name" }),
            react_1.default.createElement(react_admin_1.DateField, { source: "dob", label: "Born" }),
            react_1.default.createElement(react_admin_1.SelectField, { source: "prof", label: "Profession", choices: professionChoices }))));
};
var NoSubmitOnEnterWithTransform = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: storyDataProvider() },
    react_1.default.createElement(react_admin_1.Resource, { name: "artists", list: ArtistListNoSubmitOnEnterWithTransform }))); };
exports.NoSubmitOnEnterWithTransform = NoSubmitOnEnterWithTransform;
var getArtistListWithMeta = function (mutationMode) {
    var ArtistListWithMeta = function () {
        var meta = { foo: 'bar' };
        return (react_1.default.createElement(react_admin_1.List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
            react_1.default.createElement(src_1.EditableDatagrid, { createForm: react_1.default.createElement(ArtistForm, { mutationOptions: { meta: meta } }), editForm: react_1.default.createElement(ArtistForm, { mutationOptions: { meta: meta } }), rowClick: "edit", mutationMode: mutationMode, actions: react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(src_1.EditRowButton, null),
                    react_1.default.createElement(src_1.DeleteRowButton, { mutationMode: mutationMode, mutationOptions: { meta: meta } })) },
                react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
                react_1.default.createElement(react_admin_1.TextField, { source: "firstname" }),
                react_1.default.createElement(react_admin_1.TextField, { source: "name" }),
                react_1.default.createElement(react_admin_1.DateField, { source: "dob", label: "Born" }),
                react_1.default.createElement(react_admin_1.SelectField, { source: "prof", label: "Profession", choices: professionChoices }))));
    };
    return ArtistListWithMeta;
};
var WithMeta = function (_a) {
    var _b = _a.mutationMode, mutationMode = _b === void 0 ? 'undoable' : _b, _c = _a.dataProvider, dataProviderProp = _c === void 0 ? storyDataProvider() : _c;
    return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProviderProp },
        react_1.default.createElement(react_admin_1.Resource, { name: "artists", list: getArtistListWithMeta(mutationMode) })));
};
exports.WithMeta = WithMeta;
exports.WithMeta.args = {
    mutationMode: 'undoable',
};
exports.WithMeta.argTypes = {
    mutationMode: {
        options: ['undoable', 'pessimistic', 'optimistic'],
        control: { type: 'inline-radio' },
    },
};
var StyledArtistList = function () { return (react_1.default.createElement(react_admin_1.List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
    react_1.default.createElement(src_1.EditableDatagrid, { createForm: react_1.default.createElement(ArtistForm, null), editForm: react_1.default.createElement(ArtistForm, null), sx: {
            backgroundColor: '#ffb',
            '& .RaEditableDatagrid-rowEven': { backgroundColor: '#ddd' },
        } },
        react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "firstname" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "name" }),
        react_1.default.createElement(react_admin_1.DateField, { source: "dob", label: "Born" }),
        react_1.default.createElement(react_admin_1.SelectField, { source: "prof", label: "Profession", choices: professionChoices })))); };
var Styled = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: storyDataProvider() },
    react_1.default.createElement(react_admin_1.Resource, { name: "artists", list: StyledArtistList }))); };
exports.Styled = Styled;
var getSizeArtistList = function (size) {
    var SizeArtistList = function () {
        var meta = { foo: 'bar' };
        return (react_1.default.createElement(react_admin_1.List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
            react_1.default.createElement(src_1.EditableDatagrid, { createForm: react_1.default.createElement(ArtistForm, { mutationOptions: { meta: meta } }), editForm: react_1.default.createElement(ArtistForm, { mutationOptions: { meta: meta } }), size: size },
                react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
                react_1.default.createElement(react_admin_1.TextField, { source: "firstname" }),
                react_1.default.createElement(react_admin_1.TextField, { source: "name" }),
                react_1.default.createElement(react_admin_1.DateField, { source: "dob", label: "Born" }),
                react_1.default.createElement(react_admin_1.SelectField, { source: "prof", label: "Profession", choices: professionChoices }))));
    };
    return SizeArtistList;
};
var Size = function (_a) {
    var _b = _a.size, size = _b === void 0 ? 'small' : _b;
    return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: storyDataProvider() },
        react_1.default.createElement(react_admin_1.Resource, { name: "artists", list: getSizeArtistList(size) })));
};
exports.Size = Size;
exports.Size.args = {
    size: 'small',
};
exports.Size.argTypes = {
    size: {
        options: ['small', 'medium', 'large'],
        control: { type: 'inline-radio' },
    },
};
var CustomDatagridHeaderCell = function (props) {
    var field = props.field;
    return (react_1.default.createElement(material_1.TableCell, { variant: "head" },
        react_1.default.createElement("span", null, field.props.source)));
};
var CustomDatagridHeader = function (props) {
    var children = props.children;
    return (react_1.default.createElement(material_1.TableHead, null,
        react_1.default.createElement(material_1.TableRow, null,
            react_1.default.createElement(material_1.TableCell, { variant: "head" },
                react_1.default.createElement("span", null, "\u00A0")),
            react_1.Children.map(children, function (field, index) {
                return (0, react_1.isValidElement)(field) ? (react_1.default.createElement(CustomDatagridHeaderCell, { field: field, key: field.props.source || index })) : null;
            }))));
};
var CustomHeaderArtistList = function () { return (react_1.default.createElement(react_admin_1.List, { hasCreate: true, sort: { field: 'id', order: 'DESC' }, empty: false },
    react_1.default.createElement(src_1.EditableDatagrid, { createForm: react_1.default.createElement(ArtistForm, null), editForm: react_1.default.createElement(ArtistForm, null), header: CustomDatagridHeader },
        react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "firstname" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "name" }),
        react_1.default.createElement(react_admin_1.DateField, { source: "dob", label: "Born" }),
        react_1.default.createElement(react_admin_1.SelectField, { source: "prof", label: "Profession", choices: professionChoices })))); };
var CustomHeader = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: storyDataProvider() },
    react_1.default.createElement(react_admin_1.Resource, { name: "artists", list: CustomHeaderArtistList }))); };
exports.CustomHeader = CustomHeader;
var BookForm = function (props) {
    var onSuccess = props.onSuccess, rest = __rest(props, ["onSuccess"]);
    var close = (0, src_1.useRowContext)().close;
    var mutationOptions = {
        onSuccess: onSuccess
            ? function (data) {
                onSuccess(data);
                close();
            }
            : undefined,
    };
    return (react_1.default.createElement(src_1.RowForm, __assign({ mutationOptions: mutationOptions }, rest),
        react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
        react_1.default.createElement(react_admin_1.TextInput, { source: "title", validate: (0, react_admin_1.required)() })));
};
var CustomContextArtistList = function () {
    var _a = (0, react_1.useState)([
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
    var notify = (0, react_admin_1.useNotify)();
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
    var listContext = (0, react_admin_1.useList)({ data: books });
    return (react_1.default.createElement(material_1.Card, { sx: { mt: 2 } },
        react_1.default.createElement(react_admin_1.ListContextProvider, { value: listContext },
            react_1.default.createElement(src_1.EditableDatagrid, { bulkActionButtons: false, noDelete: true, editForm: react_1.default.createElement(BookForm, { onSuccess: onSuccess }), mutationMode: "pessimistic", rowClick: "edit" },
                react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
                react_1.default.createElement(react_admin_1.TextField, { source: "title" })))));
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
var WithListContextProvider = function (_a) {
    var _b = _a.dataProvider, dataProvider = _b === void 0 ? emptyDataProvider : _b;
    return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider },
        react_1.default.createElement(react_admin_1.Resource, { name: "books", list: CustomContextArtistList })));
};
exports.WithListContextProvider = WithListContextProvider;
