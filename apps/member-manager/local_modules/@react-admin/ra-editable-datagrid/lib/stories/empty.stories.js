"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomEmptyStandalone = exports.DefaultEmptyStandAlone = exports.CustomEmptyInList = exports.DefaultEmptyInList = void 0;
var react_1 = __importDefault(require("react"));
var react_admin_1 = require("react-admin");
var material_1 = require("@mui/material");
var history_1 = require("history");
var src_1 = require("../src");
var dataProvider_1 = __importDefault(require("./dataProvider"));
var RowForm_1 = __importDefault(require("../src/RowForm"));
var useEditableDatagridContext_1 = require("../src/useEditableDatagridContext");
var react_router_dom_1 = require("react-router-dom");
exports.default = { title: 'ra-editable-datagrid/Empty' };
var BooksListDefaultEmpty = function () { return (react_1.default.createElement(react_admin_1.List, { hasCreate: true, aside: react_1.default.createElement(Aside, null), empty: false, pagination: react_1.default.createElement(react_admin_1.Pagination, { limit: null }), sx: { marginTop: '.5em' } },
    react_1.default.createElement(BooksEditableDatagrid, null))); };
var DefaultEmptyInList = function () { return (react_1.default.createElement(react_admin_1.Admin, { dataProvider: dataProvider_1.default, history: (0, history_1.createMemoryHistory)() },
    react_1.default.createElement(react_admin_1.Resource, { name: "books", list: BooksListDefaultEmpty }))); };
exports.DefaultEmptyInList = DefaultEmptyInList;
var BooksListCustomEmpty = function () { return (react_1.default.createElement(react_admin_1.List, { hasCreate: true, aside: react_1.default.createElement(Aside, null), empty: false, pagination: react_1.default.createElement(react_admin_1.Pagination, { limit: null }), sx: { marginTop: '.5em' } },
    react_1.default.createElement(BooksEditableDatagrid, { empty: react_1.default.createElement(CustomEmptyComponentInList, null) }))); };
var BooksEditableDatagrid = function (_a) {
    var empty = _a.empty;
    return (react_1.default.createElement(src_1.EditableDatagrid, { rowClick: "edit", mutationMode: "undoable", empty: empty, editForm: react_1.default.createElement(BooksRowForm, null), createForm: react_1.default.createElement(BooksRowForm, null) },
        react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "title" }),
        react_1.default.createElement(react_admin_1.DateField, { source: "published_at" })));
};
var Aside = function () { return (react_1.default.createElement(material_1.Box, { sx: {
        marginLeft: '1em',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        width: 150,
    } },
    react_1.default.createElement("p", null, "Check out how the datagrid behaves when it's empty."))); };
var CustomEmptyComponentInList = function () {
    return (react_1.default.createElement(material_1.Box, { sx: { padding: 2 } },
        react_1.default.createElement(material_1.Typography, { variant: "h6", marginBottom: 1 }, "No books yet"),
        react_1.default.createElement(material_1.Typography, { marginBottom: 1 }, "Do you want to add one?"),
        react_1.default.createElement(react_admin_1.CreateButton, { label: "Create the first book" })));
};
var BooksRowForm = function () {
    return (react_1.default.createElement(RowForm_1.default, null,
        react_1.default.createElement(react_admin_1.TextInput, { disabled: true, source: "id" }),
        react_1.default.createElement(react_admin_1.TextInput, { source: "title", fullWidth: true }),
        react_1.default.createElement(react_admin_1.DateInput, { source: "published_at" })));
};
var CustomEmptyInList = function () { return (react_1.default.createElement(react_admin_1.Admin, { dataProvider: dataProvider_1.default, history: (0, history_1.createMemoryHistory)() },
    react_1.default.createElement(react_admin_1.Resource, { name: "books", list: BooksListCustomEmpty }))); };
exports.CustomEmptyInList = CustomEmptyInList;
var AsideStandalone = function () { return (react_1.default.createElement(material_1.Box, { sx: {
        marginLeft: '1em',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        width: 150,
    } },
    react_1.default.createElement("p", null, "Click on a post to see an Editable datagrid of comments."),
    react_1.default.createElement("p", null, "Post #4 does not have comments."))); };
var PostList = function () { return (react_1.default.createElement(react_admin_1.List, { aside: react_1.default.createElement(AsideStandalone, null), actions: false, sx: { marginTop: '1em' } },
    react_1.default.createElement(react_admin_1.Datagrid, { rowClick: "edit" },
        react_1.default.createElement(react_admin_1.TextField, { source: "id" }),
        react_1.default.createElement(react_admin_1.TextField, { source: "title" }),
        react_1.default.createElement(react_admin_1.DateField, { source: "published_at" })))); };
var CommentRowForm = function () {
    var id = (0, react_router_dom_1.useParams)().id;
    return (react_1.default.createElement(RowForm_1.default, { defaultValues: { post_id: id } },
        react_1.default.createElement(react_admin_1.TextInput, { source: "author.name", label: "Author" }),
        react_1.default.createElement(react_admin_1.TextInput, { source: "body" }),
        react_1.default.createElement(react_admin_1.DateInput, { source: "created_at" })));
};
var DefaultEmptyStandAlone = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.default },
    react_1.default.createElement(react_admin_1.Resource, { name: "posts", list: PostList, edit: PostEdit }),
    react_1.default.createElement(react_admin_1.Resource, { name: "comments" }))); };
exports.DefaultEmptyStandAlone = DefaultEmptyStandAlone;
var CustomEmptyComponentStandalone = function () {
    var openStandaloneCreateForm = (0, useEditableDatagridContext_1.useEditableDatagridContext)().openStandaloneCreateForm;
    var handleClick = function () {
        openStandaloneCreateForm();
    };
    return (react_1.default.createElement(material_1.Box, { sx: { padding: 2 } },
        react_1.default.createElement(material_1.Typography, { variant: "h6", marginBottom: 1 }, "No comments yet"),
        react_1.default.createElement(material_1.Typography, { marginBottom: 1 }, "Do you want to add one?"),
        react_1.default.createElement(react_admin_1.Button, { size: "small", color: "primary", variant: "outlined", onClick: handleClick, label: "Custom Create Button" })));
};
var PostEdit = function (_a) {
    var empty = _a.empty;
    return (react_1.default.createElement(react_admin_1.Edit, null,
        react_1.default.createElement(react_admin_1.SimpleForm, null,
            react_1.default.createElement(react_admin_1.TextInput, { source: "title", fullWidth: true }),
            react_1.default.createElement(react_admin_1.DateInput, { source: "published_at" }),
            react_1.default.createElement(react_admin_1.Labeled, { label: "Comments", fullWidth: true },
                react_1.default.createElement(react_admin_1.ReferenceManyField, { reference: "comments", target: "post_id" },
                    react_1.default.createElement(src_1.EditableDatagrid, { mutationMode: "undoable", createForm: react_1.default.createElement(CommentRowForm, null), editForm: react_1.default.createElement(CommentRowForm, null), rowClick: "edit", empty: empty, sx: {
                            '& .body': {
                                maxWidth: '15em',
                            },
                        } },
                        react_1.default.createElement(react_admin_1.TextField, { source: "author.name", label: "Author" }),
                        react_1.default.createElement(react_admin_1.TextField, { source: "body", cellClassName: "body" }),
                        react_1.default.createElement(react_admin_1.DateField, { source: "created_at" })))))));
};
var CustomEmptyStandalone = function () { return (react_1.default.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.default },
    react_1.default.createElement(react_admin_1.Resource, { name: "posts", list: PostList, edit: react_1.default.createElement(PostEdit, { empty: react_1.default.createElement(CustomEmptyComponentStandalone, null) }) }),
    react_1.default.createElement(react_admin_1.Resource, { name: "comments" }))); };
exports.CustomEmptyStandalone = CustomEmptyStandalone;
