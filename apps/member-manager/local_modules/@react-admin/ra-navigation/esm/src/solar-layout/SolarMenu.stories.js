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
import * as React from 'react';
import { CustomRoutes, testDataProvider, Admin, Resource } from 'react-admin';
import { Typography, Skeleton } from '@mui/material';
import { Dashboard, PieChartOutlined, PeopleOutlined, Inventory, Settings, Book, People, ChatBubble, } from '@mui/icons-material';
import { MemoryRouter, Route } from 'react-router-dom';
import { SolarLayout, SolarMenu } from '.';
import { useDefineAppLocation } from '../app-location';
export default { title: 'ra-navigation/SolarLayout/SolarMenu' };
var authProvider = {
    login: function () { return Promise.reject('bad method'); },
    logout: function () { return Promise.reject('bad method'); },
    checkAuth: function () { return Promise.resolve(); },
    checkError: function () { return Promise.reject('bad method'); },
    getPermissions: function () { return Promise.resolve(); },
};
export var Basic = function () {
    var CustomMenu = function () { return React.createElement(SolarMenu, null); };
    var CustomLayout = function (props) { return React.createElement(SolarLayout, __assign({}, props, { menu: CustomMenu })); };
    return (React.createElement(MemoryRouter, { initialEntries: ['/'] },
        React.createElement(Admin, { dataProvider: testDataProvider(), layout: CustomLayout },
            React.createElement(Resource, { name: "posts", list: PostList, icon: Book }),
            React.createElement(Resource, { name: "users", list: UserList, icon: People }))));
};
export var WithAuth = function () {
    var CustomMenu = function () { return React.createElement(SolarMenu, null); };
    var CustomLayout = function (props) { return React.createElement(SolarLayout, __assign({}, props, { menu: CustomMenu })); };
    return (React.createElement(MemoryRouter, { initialEntries: ['/'] },
        React.createElement(Admin, { dataProvider: testDataProvider(), authProvider: authProvider, layout: CustomLayout },
            React.createElement(Resource, { name: "posts", list: PostList, icon: Book }),
            React.createElement(Resource, { name: "comments", list: CommentList, icon: ChatBubble }),
            React.createElement(Resource, { name: "users", list: UserList, icon: People }))));
};
export var Dense = function () {
    var CustomMenu = function () { return React.createElement(SolarMenu, { dense: true }); };
    var CustomLayout = function (props) { return React.createElement(SolarLayout, __assign({}, props, { menu: CustomMenu })); };
    return (React.createElement(MemoryRouter, { initialEntries: ['/'] },
        React.createElement(Admin, { dataProvider: testDataProvider(), authProvider: authProvider, layout: CustomLayout },
            React.createElement(Resource, { name: "posts", list: PostList, icon: Book }),
            React.createElement(Resource, { name: "comments", list: CommentList, icon: ChatBubble }),
            React.createElement(Resource, { name: "users", list: UserList, icon: People }))));
};
export var Children = function () {
    var CustomMenu = function () { return (React.createElement(SolarMenu, null,
        React.createElement(SolarMenu.Item, { name: "dashboard", to: "/", icon: React.createElement(Dashboard, null), label: "Dashboard" }),
        React.createElement(SolarMenu.Item, { name: "sales", to: "/sales", icon: React.createElement(PieChartOutlined, null), label: "Sales" }),
        React.createElement(SolarMenu.Item, { name: "customers", to: "/customers", icon: React.createElement(PeopleOutlined, null), label: "Customers" }),
        React.createElement(SolarMenu.Item, { name: "products", to: "/products", icon: React.createElement(Inventory, null), label: "Catalog" }))); };
    var CustomLayout = function (props) { return React.createElement(SolarLayout, __assign({}, props, { menu: CustomMenu })); };
    return (React.createElement(MemoryRouter, { initialEntries: ['/'] },
        React.createElement(Admin, { dataProvider: testDataProvider(), layout: CustomLayout },
            React.createElement(CustomRoutes, null,
                React.createElement(Route, { path: "/", element: React.createElement(Page, { title: "Dashboard" }) }),
                React.createElement(Route, { path: "/sales", element: React.createElement(Page, { title: "Sales" }) }),
                React.createElement(Route, { path: "/customers", element: React.createElement(Page, { title: "Customers" }) }),
                React.createElement(Route, { path: "/products", element: React.createElement(Page, { title: "Catalog" }) })))));
};
export var BottomToolbar = function () {
    var CustomBottomToolbar = function () { return (React.createElement(SolarMenu.List, null,
        React.createElement(SolarMenu.Item, { name: "settings", label: "Settings", to: "/settings", icon: React.createElement(Settings, null) }),
        React.createElement(SolarMenu.LoadingIndicatorItem, null),
        React.createElement(SolarMenu.UserItem, null))); };
    var CustomMenu = function () { return (React.createElement(SolarMenu, { bottomToolbar: React.createElement(CustomBottomToolbar, null) })); };
    var CustomLayout = function (props) { return React.createElement(SolarLayout, __assign({}, props, { menu: CustomMenu })); };
    return (React.createElement(MemoryRouter, { initialEntries: ['/'] },
        React.createElement(Admin, { dataProvider: testDataProvider(), authProvider: authProvider, layout: CustomLayout },
            React.createElement(Resource, { name: "posts", list: PostList, icon: Book }),
            React.createElement(Resource, { name: "comments", list: CommentList, icon: ChatBubble }),
            React.createElement(Resource, { name: "users", list: UserList, icon: People }),
            React.createElement(CustomRoutes, null,
                React.createElement(Route, { path: "/settings", element: React.createElement(Page, { title: "Settings" }) })))));
};
var Page = function (_a) {
    var title = _a.title;
    useDefineAppLocation(title.toLowerCase() || 'dashboard');
    return (React.createElement(React.Fragment, null,
        React.createElement(Typography, { variant: "h5", mt: 2 }, title),
        React.createElement(Skeleton, { height: 300 })));
};
var PostList = function () { return React.createElement(Page, { title: "Posts" }); };
var CommentList = function () { return React.createElement(Page, { title: "Comments" }); };
var UserList = function () { return React.createElement(Page, { title: "Users" }); };
