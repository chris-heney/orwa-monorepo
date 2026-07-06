import React from 'react';
import { Admin, Resource, List, Button, TextField, TextInput, DateField, DateInput, Pagination, Datagrid, Edit, SimpleForm, Labeled, ReferenceManyField, CreateButton, } from 'react-admin';
import { Typography, Box } from '@mui/material';
import { createMemoryHistory } from 'history';
import { EditableDatagrid } from '../src';
import dataProvider from './dataProvider';
import RowForm from '../src/RowForm';
import { useEditableDatagridContext } from '../src/useEditableDatagridContext';
import { useParams } from 'react-router-dom';
export default { title: 'ra-editable-datagrid/Empty' };
var BooksListDefaultEmpty = function () { return (React.createElement(List, { hasCreate: true, aside: React.createElement(Aside, null), empty: false, pagination: React.createElement(Pagination, { limit: null }), sx: { marginTop: '.5em' } },
    React.createElement(BooksEditableDatagrid, null))); };
export var DefaultEmptyInList = function () { return (React.createElement(Admin, { dataProvider: dataProvider, history: createMemoryHistory() },
    React.createElement(Resource, { name: "books", list: BooksListDefaultEmpty }))); };
var BooksListCustomEmpty = function () { return (React.createElement(List, { hasCreate: true, aside: React.createElement(Aside, null), empty: false, pagination: React.createElement(Pagination, { limit: null }), sx: { marginTop: '.5em' } },
    React.createElement(BooksEditableDatagrid, { empty: React.createElement(CustomEmptyComponentInList, null) }))); };
var BooksEditableDatagrid = function (_a) {
    var empty = _a.empty;
    return (React.createElement(EditableDatagrid, { rowClick: "edit", mutationMode: "undoable", empty: empty, editForm: React.createElement(BooksRowForm, null), createForm: React.createElement(BooksRowForm, null) },
        React.createElement(TextField, { source: "id" }),
        React.createElement(TextField, { source: "title" }),
        React.createElement(DateField, { source: "published_at" })));
};
var Aside = function () { return (React.createElement(Box, { sx: {
        marginLeft: '1em',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        width: 150,
    } },
    React.createElement("p", null, "Check out how the datagrid behaves when it's empty."))); };
var CustomEmptyComponentInList = function () {
    return (React.createElement(Box, { sx: { padding: 2 } },
        React.createElement(Typography, { variant: "h6", marginBottom: 1 }, "No books yet"),
        React.createElement(Typography, { marginBottom: 1 }, "Do you want to add one?"),
        React.createElement(CreateButton, { label: "Create the first book" })));
};
var BooksRowForm = function () {
    return (React.createElement(RowForm, null,
        React.createElement(TextInput, { disabled: true, source: "id" }),
        React.createElement(TextInput, { source: "title", fullWidth: true }),
        React.createElement(DateInput, { source: "published_at" })));
};
export var CustomEmptyInList = function () { return (React.createElement(Admin, { dataProvider: dataProvider, history: createMemoryHistory() },
    React.createElement(Resource, { name: "books", list: BooksListCustomEmpty }))); };
var AsideStandalone = function () { return (React.createElement(Box, { sx: {
        marginLeft: '1em',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        width: 150,
    } },
    React.createElement("p", null, "Click on a post to see an Editable datagrid of comments."),
    React.createElement("p", null, "Post #4 does not have comments."))); };
var PostList = function () { return (React.createElement(List, { aside: React.createElement(AsideStandalone, null), actions: false, sx: { marginTop: '1em' } },
    React.createElement(Datagrid, { rowClick: "edit" },
        React.createElement(TextField, { source: "id" }),
        React.createElement(TextField, { source: "title" }),
        React.createElement(DateField, { source: "published_at" })))); };
var CommentRowForm = function () {
    var id = useParams().id;
    return (React.createElement(RowForm, { defaultValues: { post_id: id } },
        React.createElement(TextInput, { source: "author.name", label: "Author" }),
        React.createElement(TextInput, { source: "body" }),
        React.createElement(DateInput, { source: "created_at" })));
};
export var DefaultEmptyStandAlone = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider },
    React.createElement(Resource, { name: "posts", list: PostList, edit: PostEdit }),
    React.createElement(Resource, { name: "comments" }))); };
var CustomEmptyComponentStandalone = function () {
    var openStandaloneCreateForm = useEditableDatagridContext().openStandaloneCreateForm;
    var handleClick = function () {
        openStandaloneCreateForm();
    };
    return (React.createElement(Box, { sx: { padding: 2 } },
        React.createElement(Typography, { variant: "h6", marginBottom: 1 }, "No comments yet"),
        React.createElement(Typography, { marginBottom: 1 }, "Do you want to add one?"),
        React.createElement(Button, { size: "small", color: "primary", variant: "outlined", onClick: handleClick, label: "Custom Create Button" })));
};
var PostEdit = function (_a) {
    var empty = _a.empty;
    return (React.createElement(Edit, null,
        React.createElement(SimpleForm, null,
            React.createElement(TextInput, { source: "title", fullWidth: true }),
            React.createElement(DateInput, { source: "published_at" }),
            React.createElement(Labeled, { label: "Comments", fullWidth: true },
                React.createElement(ReferenceManyField, { reference: "comments", target: "post_id" },
                    React.createElement(EditableDatagrid, { mutationMode: "undoable", createForm: React.createElement(CommentRowForm, null), editForm: React.createElement(CommentRowForm, null), rowClick: "edit", empty: empty, sx: {
                            '& .body': {
                                maxWidth: '15em',
                            },
                        } },
                        React.createElement(TextField, { source: "author.name", label: "Author" }),
                        React.createElement(TextField, { source: "body", cellClassName: "body" }),
                        React.createElement(DateField, { source: "created_at" })))))));
};
export var CustomEmptyStandalone = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider },
    React.createElement(Resource, { name: "posts", list: PostList, edit: React.createElement(PostEdit, { empty: React.createElement(CustomEmptyComponentStandalone, null) }) }),
    React.createElement(Resource, { name: "comments" }))); };
