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
import * as React from 'react';
import { Typography, Card, CardContent } from '@mui/material';
import { Admin, Resource, List, Edit, Create, SimpleForm, Show, SimpleShowLayout, TextField, TextInput, Layout, Datagrid, ShowButton, EditButton, useCreatePath, } from 'react-admin';
import { createMemoryHistory } from 'history';
import { Breadcrumb } from '.';
import { dataProvider } from '../../stories/dataProvider';
import { AppLocationContext, DASHBOARD } from '../app-location';
export default { title: 'ra-navigation/Breadcrumb/CustomLabels' };
var MyBreadcrumb = function () {
    var createPath = useCreatePath();
    return (React.createElement(Breadcrumb, null,
        React.createElement(Breadcrumb.Item, { name: DASHBOARD, label: "My Home", to: "/" },
            React.createElement(Breadcrumb.Item, { name: "songs", label: "My Fabulous Songs", to: "/songs" },
                React.createElement(Breadcrumb.Item, { name: "edit", label: function (_a) {
                        var record = _a.record;
                        return "Edit \"".concat(record.title, "\"");
                    }, to: function (_a) {
                        var record = _a.record;
                        return record
                            ? createPath({
                                resource: 'songs',
                                id: record.id,
                                type: 'edit',
                            })
                            : undefined;
                    } }),
                React.createElement(Breadcrumb.Item, { name: "show", label: function (_a) {
                        var record = _a.record;
                        return "Show \"".concat(record.title, "\"");
                    }, to: function (_a) {
                        var record = _a.record;
                        return record
                            ? createPath({
                                resource: 'songs',
                                id: record.id,
                                type: 'show',
                            })
                            : undefined;
                    } }),
                React.createElement(Breadcrumb.Item, { name: "create", label: "Yeah! Add Another One" })))));
};
var MyLayout = function (_a) {
    var children = _a.children, rest = __rest(_a, ["children"]);
    return (React.createElement(AppLocationContext, null,
        React.createElement(Layout, __assign({}, rest),
            React.createElement(MyBreadcrumb, null),
            children)));
};
var SongList = function () { return (React.createElement(List, null,
    React.createElement(Datagrid, null,
        React.createElement(TextField, { source: "id" }),
        React.createElement(TextField, { source: "title" }),
        React.createElement(ShowButton, null),
        React.createElement(EditButton, null)))); };
var SongEdit = function () { return (React.createElement(Edit, null,
    React.createElement(SimpleForm, null,
        React.createElement(TextInput, { source: "title" })))); };
var SongCreate = function () { return (React.createElement(Create, null,
    React.createElement(SimpleForm, null,
        React.createElement(TextInput, { source: "title" })))); };
var SongShow = function () { return (React.createElement(Show, null,
    React.createElement(SimpleShowLayout, null,
        React.createElement(TextField, { source: "title" })))); };
var Dashboard = function () { return (React.createElement(Card, null,
    React.createElement(CardContent, null,
        React.createElement(Typography, { variant: "h4" }, "Here is Homepage"),
        React.createElement(Typography, null, "No breacrumb is displayed in Home")))); };
export var Labels = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider, layout: MyLayout, dashboard: Dashboard },
    React.createElement(Resource, { name: "songs", list: SongList, edit: SongEdit, create: SongCreate, show: SongShow }))); };
var MyBreadcrumbNoHome = function () {
    var createPath = useCreatePath();
    return (React.createElement(Breadcrumb, null,
        React.createElement(Breadcrumb.Item, { name: "songs", label: "My Fabulous Songs", to: "/songs" },
            React.createElement(Breadcrumb.Item, { name: "edit", label: function (_a) {
                    var record = _a.record;
                    return "Edit \"".concat(record.title, "\"");
                }, to: function (_a) {
                    var record = _a.record;
                    return record &&
                        createPath({
                            resource: 'songs',
                            id: record.id,
                            type: 'edit',
                        });
                } }),
            React.createElement(Breadcrumb.Item, { name: "show", label: function (_a) {
                    var record = _a.record;
                    return "Show \"".concat(record.title, "\"");
                }, to: function (_a) {
                    var record = _a.record;
                    return record &&
                        createPath({
                            resource: 'songs',
                            id: record.id,
                            type: 'show',
                        });
                } }),
            React.createElement(Breadcrumb.Item, { name: "create", label: "Yeah! Add Another One" }))));
};
var MyLayoutNoHome = function (_a) {
    var children = _a.children, rest = __rest(_a, ["children"]);
    return (React.createElement(AppLocationContext, null,
        React.createElement(Layout, __assign({}, rest),
            React.createElement(MyBreadcrumbNoHome, null),
            children)));
};
export var LabelsNoHome = function () { return (React.createElement(Admin, { history: createMemoryHistory(), dataProvider: dataProvider, layout: MyLayoutNoHome },
    React.createElement(Resource, { name: "songs", list: SongList, edit: SongEdit, create: SongCreate, show: SongShow }))); };
