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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BottomToolbar = exports.Children = exports.Dense = exports.WithAuth = exports.Basic = void 0;
var React = __importStar(require("react"));
var react_admin_1 = require("react-admin");
var material_1 = require("@mui/material");
var icons_material_1 = require("@mui/icons-material");
var react_router_dom_1 = require("react-router-dom");
var _1 = require(".");
var app_location_1 = require("../app-location");
exports.default = { title: 'ra-navigation/SolarLayout/SolarMenu' };
var authProvider = {
    login: function () { return Promise.reject('bad method'); },
    logout: function () { return Promise.reject('bad method'); },
    checkAuth: function () { return Promise.resolve(); },
    checkError: function () { return Promise.reject('bad method'); },
    getPermissions: function () { return Promise.resolve(); },
};
var Basic = function () {
    var CustomMenu = function () { return React.createElement(_1.SolarMenu, null); };
    var CustomLayout = function (props) { return React.createElement(_1.SolarLayout, __assign({}, props, { menu: CustomMenu })); };
    return (React.createElement(react_router_dom_1.MemoryRouter, { initialEntries: ['/'] },
        React.createElement(react_admin_1.Admin, { dataProvider: (0, react_admin_1.testDataProvider)(), layout: CustomLayout },
            React.createElement(react_admin_1.Resource, { name: "posts", list: PostList, icon: icons_material_1.Book }),
            React.createElement(react_admin_1.Resource, { name: "users", list: UserList, icon: icons_material_1.People }))));
};
exports.Basic = Basic;
var WithAuth = function () {
    var CustomMenu = function () { return React.createElement(_1.SolarMenu, null); };
    var CustomLayout = function (props) { return React.createElement(_1.SolarLayout, __assign({}, props, { menu: CustomMenu })); };
    return (React.createElement(react_router_dom_1.MemoryRouter, { initialEntries: ['/'] },
        React.createElement(react_admin_1.Admin, { dataProvider: (0, react_admin_1.testDataProvider)(), authProvider: authProvider, layout: CustomLayout },
            React.createElement(react_admin_1.Resource, { name: "posts", list: PostList, icon: icons_material_1.Book }),
            React.createElement(react_admin_1.Resource, { name: "comments", list: CommentList, icon: icons_material_1.ChatBubble }),
            React.createElement(react_admin_1.Resource, { name: "users", list: UserList, icon: icons_material_1.People }))));
};
exports.WithAuth = WithAuth;
var Dense = function () {
    var CustomMenu = function () { return React.createElement(_1.SolarMenu, { dense: true }); };
    var CustomLayout = function (props) { return React.createElement(_1.SolarLayout, __assign({}, props, { menu: CustomMenu })); };
    return (React.createElement(react_router_dom_1.MemoryRouter, { initialEntries: ['/'] },
        React.createElement(react_admin_1.Admin, { dataProvider: (0, react_admin_1.testDataProvider)(), authProvider: authProvider, layout: CustomLayout },
            React.createElement(react_admin_1.Resource, { name: "posts", list: PostList, icon: icons_material_1.Book }),
            React.createElement(react_admin_1.Resource, { name: "comments", list: CommentList, icon: icons_material_1.ChatBubble }),
            React.createElement(react_admin_1.Resource, { name: "users", list: UserList, icon: icons_material_1.People }))));
};
exports.Dense = Dense;
var Children = function () {
    var CustomMenu = function () { return (React.createElement(_1.SolarMenu, null,
        React.createElement(_1.SolarMenu.Item, { name: "dashboard", to: "/", icon: React.createElement(icons_material_1.Dashboard, null), label: "Dashboard" }),
        React.createElement(_1.SolarMenu.Item, { name: "sales", to: "/sales", icon: React.createElement(icons_material_1.PieChartOutlined, null), label: "Sales" }),
        React.createElement(_1.SolarMenu.Item, { name: "customers", to: "/customers", icon: React.createElement(icons_material_1.PeopleOutlined, null), label: "Customers" }),
        React.createElement(_1.SolarMenu.Item, { name: "products", to: "/products", icon: React.createElement(icons_material_1.Inventory, null), label: "Catalog" }))); };
    var CustomLayout = function (props) { return React.createElement(_1.SolarLayout, __assign({}, props, { menu: CustomMenu })); };
    return (React.createElement(react_router_dom_1.MemoryRouter, { initialEntries: ['/'] },
        React.createElement(react_admin_1.Admin, { dataProvider: (0, react_admin_1.testDataProvider)(), layout: CustomLayout },
            React.createElement(react_admin_1.CustomRoutes, null,
                React.createElement(react_router_dom_1.Route, { path: "/", element: React.createElement(Page, { title: "Dashboard" }) }),
                React.createElement(react_router_dom_1.Route, { path: "/sales", element: React.createElement(Page, { title: "Sales" }) }),
                React.createElement(react_router_dom_1.Route, { path: "/customers", element: React.createElement(Page, { title: "Customers" }) }),
                React.createElement(react_router_dom_1.Route, { path: "/products", element: React.createElement(Page, { title: "Catalog" }) })))));
};
exports.Children = Children;
var BottomToolbar = function () {
    var CustomBottomToolbar = function () { return (React.createElement(_1.SolarMenu.List, null,
        React.createElement(_1.SolarMenu.Item, { name: "settings", label: "Settings", to: "/settings", icon: React.createElement(icons_material_1.Settings, null) }),
        React.createElement(_1.SolarMenu.LoadingIndicatorItem, null),
        React.createElement(_1.SolarMenu.UserItem, null))); };
    var CustomMenu = function () { return (React.createElement(_1.SolarMenu, { bottomToolbar: React.createElement(CustomBottomToolbar, null) })); };
    var CustomLayout = function (props) { return React.createElement(_1.SolarLayout, __assign({}, props, { menu: CustomMenu })); };
    return (React.createElement(react_router_dom_1.MemoryRouter, { initialEntries: ['/'] },
        React.createElement(react_admin_1.Admin, { dataProvider: (0, react_admin_1.testDataProvider)(), authProvider: authProvider, layout: CustomLayout },
            React.createElement(react_admin_1.Resource, { name: "posts", list: PostList, icon: icons_material_1.Book }),
            React.createElement(react_admin_1.Resource, { name: "comments", list: CommentList, icon: icons_material_1.ChatBubble }),
            React.createElement(react_admin_1.Resource, { name: "users", list: UserList, icon: icons_material_1.People }),
            React.createElement(react_admin_1.CustomRoutes, null,
                React.createElement(react_router_dom_1.Route, { path: "/settings", element: React.createElement(Page, { title: "Settings" }) })))));
};
exports.BottomToolbar = BottomToolbar;
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
