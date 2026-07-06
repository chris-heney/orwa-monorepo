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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LazyLoading = exports.RenderingError = exports.Basic = void 0;
var React = __importStar(require("react"));
var react_admin_1 = require("react-admin");
var material_1 = require("@mui/material");
var icons_material_1 = require("@mui/icons-material");
var react_router_dom_1 = require("react-router-dom");
var _1 = require(".");
var app_location_1 = require("../app-location");
exports.default = { title: 'ra-navigation/SolarLayout/SolarLayout' };
var Basic = function () { return (React.createElement(react_router_dom_1.MemoryRouter, { initialEntries: ['/'] },
    React.createElement(react_admin_1.Admin, { dataProvider: (0, react_admin_1.testDataProvider)(), layout: _1.SolarLayout },
        React.createElement(react_admin_1.Resource, { name: "posts", list: PostList, icon: icons_material_1.Book }),
        React.createElement(react_admin_1.Resource, { name: "comments", list: CommentList, icon: icons_material_1.ChatBubble }),
        React.createElement(react_admin_1.Resource, { name: "users", list: UserList, icon: icons_material_1.People })))); };
exports.Basic = Basic;
var RenderingError = function () { return (React.createElement(react_router_dom_1.MemoryRouter, { initialEntries: ['/'] },
    React.createElement(react_admin_1.Admin, { dataProvider: (0, react_admin_1.testDataProvider)(), layout: _1.SolarLayout },
        React.createElement(react_admin_1.Resource, { name: "posts", list: function () {
                throw new Error('A problem has occurred');
            }, icon: icons_material_1.Book }),
        React.createElement(react_admin_1.Resource, { name: "comments", list: CommentList, icon: icons_material_1.ChatBubble }),
        React.createElement(react_admin_1.Resource, { name: "users", list: UserList, icon: icons_material_1.People })))); };
exports.RenderingError = RenderingError;
var Dashboard = React.lazy(
// @ts-ignore to ignore compilation error "Dynamic imports are only supported when the '--module' flag is set to 'es2020', 'es2022', 'esnext', 'commonjs', 'amd', 'system', 'umd', 'node16', or 'nodenext'."
function () { return Promise.resolve().then(function () { return __importStar(require('../../stories/solar-layout/Dashboard')); }); });
var LazyLoading = function () { return (React.createElement(react_router_dom_1.MemoryRouter, { initialEntries: ['/'] },
    React.createElement(react_admin_1.Admin, { dataProvider: (0, react_admin_1.testDataProvider)(), layout: _1.SolarLayout, dashboard: Dashboard },
        React.createElement(react_admin_1.Resource, { name: "posts", list: PostList, icon: icons_material_1.Book }),
        React.createElement(react_admin_1.Resource, { name: "comments", list: CommentList, icon: icons_material_1.ChatBubble }),
        React.createElement(react_admin_1.Resource, { name: "users", list: UserList, icon: icons_material_1.People })))); };
exports.LazyLoading = LazyLoading;
var Page = function (_a) {
    var title = _a.title;
    (0, app_location_1.useDefineAppLocation)(title.toLowerCase() || 'dashboard');
    return (React.createElement(React.Fragment, null,
        React.createElement(material_1.Typography, { variant: "h5", mt: 2 }, title),
        React.createElement(material_1.Skeleton, { height: 300 })));
};
var PostList = function () { return React.createElement(Page, { title: "Posts" }); };
var CommentList = function () { return React.createElement(Page, { title: "Comments" }); };
var UserList = function () { return React.createElement(Page, { title: "Users" }); };
