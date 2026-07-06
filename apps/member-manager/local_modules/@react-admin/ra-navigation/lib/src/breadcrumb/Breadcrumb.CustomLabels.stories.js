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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelsNoHome = exports.Labels = void 0;
var React = __importStar(require("react"));
var material_1 = require("@mui/material");
var react_admin_1 = require("react-admin");
var history_1 = require("history");
var _1 = require(".");
var dataProvider_1 = require("../../stories/dataProvider");
var app_location_1 = require("../app-location");
exports.default = { title: 'ra-navigation/Breadcrumb/CustomLabels' };
var MyBreadcrumb = function () {
    var createPath = (0, react_admin_1.useCreatePath)();
    return (React.createElement(_1.Breadcrumb, null,
        React.createElement(_1.Breadcrumb.Item, { name: app_location_1.DASHBOARD, label: "My Home", to: "/" },
            React.createElement(_1.Breadcrumb.Item, { name: "songs", label: "My Fabulous Songs", to: "/songs" },
                React.createElement(_1.Breadcrumb.Item, { name: "edit", label: function (_a) {
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
                React.createElement(_1.Breadcrumb.Item, { name: "show", label: function (_a) {
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
                React.createElement(_1.Breadcrumb.Item, { name: "create", label: "Yeah! Add Another One" })))));
};
var MyLayout = function (_a) {
    var children = _a.children, rest = __rest(_a, ["children"]);
    return (React.createElement(app_location_1.AppLocationContext, null,
        React.createElement(react_admin_1.Layout, __assign({}, rest),
            React.createElement(MyBreadcrumb, null),
            children)));
};
var SongList = function () { return (React.createElement(react_admin_1.List, null,
    React.createElement(react_admin_1.Datagrid, null,
        React.createElement(react_admin_1.TextField, { source: "id" }),
        React.createElement(react_admin_1.TextField, { source: "title" }),
        React.createElement(react_admin_1.ShowButton, null),
        React.createElement(react_admin_1.EditButton, null)))); };
var SongEdit = function () { return (React.createElement(react_admin_1.Edit, null,
    React.createElement(react_admin_1.SimpleForm, null,
        React.createElement(react_admin_1.TextInput, { source: "title" })))); };
var SongCreate = function () { return (React.createElement(react_admin_1.Create, null,
    React.createElement(react_admin_1.SimpleForm, null,
        React.createElement(react_admin_1.TextInput, { source: "title" })))); };
var SongShow = function () { return (React.createElement(react_admin_1.Show, null,
    React.createElement(react_admin_1.SimpleShowLayout, null,
        React.createElement(react_admin_1.TextField, { source: "title" })))); };
var Dashboard = function () { return (React.createElement(material_1.Card, null,
    React.createElement(material_1.CardContent, null,
        React.createElement(material_1.Typography, { variant: "h4" }, "Here is Homepage"),
        React.createElement(material_1.Typography, null, "No breacrumb is displayed in Home")))); };
var Labels = function () { return (React.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.dataProvider, layout: MyLayout, dashboard: Dashboard },
    React.createElement(react_admin_1.Resource, { name: "songs", list: SongList, edit: SongEdit, create: SongCreate, show: SongShow }))); };
exports.Labels = Labels;
var MyBreadcrumbNoHome = function () {
    var createPath = (0, react_admin_1.useCreatePath)();
    return (React.createElement(_1.Breadcrumb, null,
        React.createElement(_1.Breadcrumb.Item, { name: "songs", label: "My Fabulous Songs", to: "/songs" },
            React.createElement(_1.Breadcrumb.Item, { name: "edit", label: function (_a) {
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
            React.createElement(_1.Breadcrumb.Item, { name: "show", label: function (_a) {
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
            React.createElement(_1.Breadcrumb.Item, { name: "create", label: "Yeah! Add Another One" }))));
};
var MyLayoutNoHome = function (_a) {
    var children = _a.children, rest = __rest(_a, ["children"]);
    return (React.createElement(app_location_1.AppLocationContext, null,
        React.createElement(react_admin_1.Layout, __assign({}, rest),
            React.createElement(MyBreadcrumbNoHome, null),
            children)));
};
var LabelsNoHome = function () { return (React.createElement(react_admin_1.Admin, { history: (0, history_1.createMemoryHistory)(), dataProvider: dataProvider_1.dataProvider, layout: MyLayoutNoHome },
    React.createElement(react_admin_1.Resource, { name: "songs", list: SongList, edit: SongEdit, create: SongCreate, show: SongShow }))); };
exports.LabelsNoHome = LabelsNoHome;
