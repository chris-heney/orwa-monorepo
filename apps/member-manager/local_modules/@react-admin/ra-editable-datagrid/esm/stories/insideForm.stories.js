import { Box, styled } from '@mui/material';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Admin, Datagrid, DateField, DateInput, Edit, Labeled, List, ListContextProvider, ReferenceManyField, required, Resource, ResourceContextProvider, SimpleForm, TextField, TextInput, useGetList, useList, useRecordContext, } from 'react-admin';
import { useFormContext } from 'react-hook-form';
import { EditableDatagrid, EditRowButton, RowForm } from '../src';
import dataProvider from './dataProvider';
export default { title: 'ra-editable-datagrid/Inside a Form' };
var Aside = function () { return (React.createElement(Box, { sx: {
        marginLeft: '1em',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        width: 150,
    } }, "Click on a post to see an Editable datagrid of comments")); };
var PostList = function () { return (React.createElement(List, { aside: React.createElement(Aside, null), actions: false, sx: { marginTop: '1em' } },
    React.createElement(Datagrid, { rowClick: "edit" },
        React.createElement(TextField, { source: "id" }),
        React.createElement(TextField, { source: "title" }),
        React.createElement(DateField, { source: "published_at" })))); };
var CommentForm = function () {
    var getValues = useFormContext().getValues;
    return (React.createElement(RowForm, { defaultValues: { post_id: getValues('id') } },
        React.createElement(TextInput, { source: "author.name", label: "Author", validate: required() }),
        React.createElement(TextInput, { source: "body", validate: required() }),
        React.createElement(DateInput, { source: "created_at", validate: required() })));
};
var StyledEditableDatagrid = styled(EditableDatagrid)(function () { return ({
    '& .body': {
        maxWidth: '15em',
    },
}); });
var PostEdit = function () {
    return (React.createElement(Edit, null,
        React.createElement(SimpleForm, null,
            React.createElement(TextInput, { source: "title", fullWidth: true }),
            React.createElement(DateInput, { source: "published_at" }),
            React.createElement(Labeled, { label: "Comments", fullWidth: true },
                React.createElement(ReferenceManyField, { reference: "comments", target: "post_id" },
                    React.createElement(StyledEditableDatagrid, { mutationMode: "undoable", createForm: React.createElement(CommentForm, null), editForm: React.createElement(CommentForm, null), rowClick: "edit" },
                        React.createElement(TextField, { source: "author.name", label: "Author" }),
                        React.createElement(TextField, { source: "body", cellClassName: "body" }),
                        React.createElement(DateField, { source: "created_at" })))))));
};
export var WithReferenceManyField = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider },
    React.createElement(Resource, { name: "posts", list: PostList, edit: PostEdit }),
    React.createElement(Resource, { name: "comments" }))); };
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var ArtistCustomActions = function (props) { return React.createElement(EditRowButton, null); };
var PostEditCustomActions = function () {
    return (React.createElement(Edit, null,
        React.createElement(SimpleForm, null,
            React.createElement(TextInput, { source: "title", fullWidth: true }),
            React.createElement(DateInput, { source: "published_at" }),
            React.createElement(Labeled, { label: "Comments", fullWidth: true },
                React.createElement(ReferenceManyField, { reference: "comments", target: "post_id" },
                    React.createElement(StyledEditableDatagrid, { actions: React.createElement(ArtistCustomActions, null), mutationMode: "undoable", createForm: React.createElement(CommentForm, null), editForm: React.createElement(CommentForm, null), rowClick: "edit" },
                        React.createElement(TextField, { source: "author.name", label: "Author" }),
                        React.createElement(TextField, { source: "body", cellClassName: "body" }),
                        React.createElement(DateField, { source: "created_at" })))))));
};
export var WithReferenceManyFieldCustomActions = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider },
    React.createElement(Resource, { name: "posts", list: PostList, edit: PostEditCustomActions }),
    React.createElement(Resource, { name: "comments" }))); };
var CommentsListContextProvider = function () {
    var post = useRecordContext();
    var post_id = post === null || post === void 0 ? void 0 : post.id;
    var _a = useGetList('comments', {
        pagination: { page: 1, perPage: 10 },
        filter: { post_id: post_id },
    }), data = _a.data, isLoading = _a.isLoading;
    var listContext = useList({ data: data, isLoading: isLoading });
    return (React.createElement(Labeled, { label: "Comments", fullWidth: true },
        React.createElement(ResourceContextProvider, { value: "clients" },
            React.createElement(ListContextProvider, { value: listContext },
                React.createElement(StyledEditableDatagrid, { mutationMode: "undoable", createForm: React.createElement(CommentForm, null), editForm: React.createElement(CommentForm, null), rowClick: "edit" },
                    React.createElement(TextField, { source: "author.name", label: "Author" }),
                    React.createElement(TextField, { source: "body", cellClassName: "body" }),
                    React.createElement(DateField, { source: "created_at" }))))));
};
var PostEditListContextProvider = function () {
    return (React.createElement(Edit, null,
        React.createElement(SimpleForm, null,
            React.createElement(TextInput, { source: "title", fullWidth: true }),
            React.createElement(DateInput, { source: "published_at" }),
            React.createElement(CommentsListContextProvider, null))));
};
export var WithListContextProvider = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider },
    React.createElement(Resource, { name: "posts", list: PostList, edit: PostEditListContextProvider }),
    React.createElement(Resource, { name: "comments" }))); };
