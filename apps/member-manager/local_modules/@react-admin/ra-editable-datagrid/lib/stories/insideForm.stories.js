"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithListContextProvider = exports.WithReferenceManyFieldCustomActions = exports.WithReferenceManyField = void 0;
var material_1 = require("@mui/material");
var history_1 = require("history");
var react_1 = __importDefault(require("react"));
var react_admin_1 = require("react-admin");
var react_hook_form_1 = require("react-hook-form");
var src_1 = require("../src");
var dataProvider_1 = __importDefault(require("./dataProvider"));
exports.default = { title: 'ra-editable-datagrid/Inside a Form' };
var Aside = function () { return (react_1.default.createElement(material_1.Box, { sx: {
        marginLeft: '1em',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        width: 150,
    } }, "Click on a post to see an Editable datagrid of comments")); };
var PostList = function () { return (react_1.default.createElement(react_admin_1.List, { aside: react_1.default.createElement(Aside, null), actions: false, sx: { marginTop: '1em' } },
    react_1.default.createElement(react_admin_1.Datagrid, { rowClick: "edit" },
        react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "title" }),
        react_1.default.createElement(react_admin_1.DateField, { source: "published_at" })))); };
var CommentForm = function () {
    var getValues = (0, react_hook_form_1.useFormContext)().getValues;
    return (react_1.default.createElement(src_1.RowForm, { defaultValues: { post_id: getValues('id') } },
        react_1.default.createElement(react_admin_1.TextInput, { source: "author.name", label: "Author", validate: (0, react_admin_1.required)() }),
        react_1.default.createElement(react_admin_1.TextInput, { source: "body", validate: (0, react_admin_1.required)() }),
        react_1.default.createElement(react_admin_1.DateInput, { source: "created_at", validate: (0, react_admin_1.required)() })));
};
var StyledEditableDatagrid = (0, material_1.styled)(src_1.EditableDatagrid)(function () { return ({
    '& .body': {
        maxWidth: '15em',
    },
}); });
var PostEdit = function () {
    return (react_1.default.createElement(react_admin_1.Edit, null,
        react_1.default.createElement(react_admin_1.SimpleForm, null,
            react_1.default.createElement(react_admin_1.TextInput, { source: "title", fullWidth: true }),
            react_1.default.createElement(react_admin_1.DateInput, { source: "published_at" }),
            react_1.default.createElement(react_admin_1.Labeled, { label: "Comments", fullWidth: true },
                react_1.default.createElement(react_admin_1.ReferenceManyField, { reference: "comments", target: "post_id" },
                    react_1.default.createElement(StyledEditableDatagrid, { mutationMode: "undoable", createForm: react_1.default.createElement(CommentForm, null), editForm: react_1.default.createElement(CommentForm, null), rowClick: "edit" },
                        react_1.default.createElement(react_admin_1.TextField, { source: "author.name", label: "Author" }),
                        react_1.default.createElement(react_admin_1.TextField, { source: "body", cellClassName: "body" }),
                        react_1.default.createElement(react_admin_1.DateField, { source: "created_at" })))))));
};
var WithReferenceManyField = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.default },
    react_1.default.createElement(react_admin_1.Resource, { name: "posts", list: PostList, edit: PostEdit }),
    react_1.default.createElement(react_admin_1.Resource, { name: "comments" }))); };
exports.WithReferenceManyField = WithReferenceManyField;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var ArtistCustomActions = function (props) { return react_1.default.createElement(src_1.EditRowButton, null); };
var PostEditCustomActions = function () {
    return (react_1.default.createElement(react_admin_1.Edit, null,
        react_1.default.createElement(react_admin_1.SimpleForm, null,
            react_1.default.createElement(react_admin_1.TextInput, { source: "title", fullWidth: true }),
            react_1.default.createElement(react_admin_1.DateInput, { source: "published_at" }),
            react_1.default.createElement(react_admin_1.Labeled, { label: "Comments", fullWidth: true },
                react_1.default.createElement(react_admin_1.ReferenceManyField, { reference: "comments", target: "post_id" },
                    react_1.default.createElement(StyledEditableDatagrid, { actions: react_1.default.createElement(ArtistCustomActions, null), mutationMode: "undoable", createForm: react_1.default.createElement(CommentForm, null), editForm: react_1.default.createElement(CommentForm, null), rowClick: "edit" },
                        react_1.default.createElement(react_admin_1.TextField, { source: "author.name", label: "Author" }),
                        react_1.default.createElement(react_admin_1.TextField, { source: "body", cellClassName: "body" }),
                        react_1.default.createElement(react_admin_1.DateField, { source: "created_at" })))))));
};
var WithReferenceManyFieldCustomActions = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.default },
    react_1.default.createElement(react_admin_1.Resource, { name: "posts", list: PostList, edit: PostEditCustomActions }),
    react_1.default.createElement(react_admin_1.Resource, { name: "comments" }))); };
exports.WithReferenceManyFieldCustomActions = WithReferenceManyFieldCustomActions;
var CommentsListContextProvider = function () {
    var post = (0, react_admin_1.useRecordContext)();
    var post_id = post === null || post === void 0 ? void 0 : post.id;
    var _a = (0, react_admin_1.useGetList)('comments', {
        pagination: { page: 1, perPage: 10 },
        filter: { post_id: post_id },
    }), data = _a.data, isLoading = _a.isLoading;
    var listContext = (0, react_admin_1.useList)({ data: data, isLoading: isLoading });
    return (react_1.default.createElement(react_admin_1.Labeled, { label: "Comments", fullWidth: true },
        react_1.default.createElement(react_admin_1.ResourceContextProvider, { value: "clients" },
            react_1.default.createElement(react_admin_1.ListContextProvider, { value: listContext },
                react_1.default.createElement(StyledEditableDatagrid, { mutationMode: "undoable", createForm: react_1.default.createElement(CommentForm, null), editForm: react_1.default.createElement(CommentForm, null), rowClick: "edit" },
                    react_1.default.createElement(react_admin_1.TextField, { source: "author.name", label: "Author" }),
                    react_1.default.createElement(react_admin_1.TextField, { source: "body", cellClassName: "body" }),
                    react_1.default.createElement(react_admin_1.DateField, { source: "created_at" }))))));
};
var PostEditListContextProvider = function () {
    return (react_1.default.createElement(react_admin_1.Edit, null,
        react_1.default.createElement(react_admin_1.SimpleForm, null,
            react_1.default.createElement(react_admin_1.TextInput, { source: "title", fullWidth: true }),
            react_1.default.createElement(react_admin_1.DateInput, { source: "published_at" }),
            react_1.default.createElement(CommentsListContextProvider, null))));
};
var WithListContextProvider = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.default },
    react_1.default.createElement(react_admin_1.Resource, { name: "posts", list: PostList, edit: PostEditListContextProvider }),
    react_1.default.createElement(react_admin_1.Resource, { name: "comments" }))); };
exports.WithListContextProvider = WithListContextProvider;
