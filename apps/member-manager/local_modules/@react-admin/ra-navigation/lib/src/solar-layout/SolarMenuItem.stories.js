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
exports.MenuItemChild = exports.Basic = void 0;
var React = __importStar(require("react"));
var react_admin_1 = require("react-admin");
var material_1 = require("@mui/material");
var icons_material_1 = require("@mui/icons-material");
var react_router_dom_1 = require("react-router-dom");
var _1 = require(".");
var app_location_1 = require("../app-location");
exports.default = { title: 'ra-navigation/SolarLayout/SolarMenuItem' };
var Basic = function () {
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
exports.Basic = Basic;
var Page = function (_a) {
    var title = _a.title;
    (0, app_location_1.useDefineAppLocation)(title.toLowerCase() || 'dashboard');
    return (React.createElement(React.Fragment, null,
        React.createElement(material_1.Typography, { variant: "h5", mt: 2 }, title),
        React.createElement(material_1.Skeleton, { height: 300 })));
};
var MenuItemChild = function () {
    var CustomMenu = function () { return (React.createElement(_1.SolarMenu, null,
        React.createElement(_1.SolarMenu.Item, { name: "dashboard", to: "/", label: "Dashboard", icon: React.createElement(icons_material_1.Dashboard, null) }),
        React.createElement(material_1.Divider, null),
        React.createElement(_1.SolarMenu.Item, { name: "sales", to: "/sales", icon: React.createElement(icons_material_1.PieChartOutlined, null), label: "Sales" }),
        React.createElement(_1.SolarMenu.Item, { name: "customers", to: "/customers", icon: React.createElement(icons_material_1.PeopleOutlined, null), label: "Customers" }),
        React.createElement(_1.SolarMenu.Item, { name: "catalog", icon: React.createElement(icons_material_1.Inventory, null), label: "Catalog", subMenu: React.createElement(_1.SolarMenu.List, { disablePadding: true },
                React.createElement(_1.SolarMenu.Item, { name: "products", to: "/products" },
                    React.createElement(material_1.ListItemIcon, null,
                        React.createElement(icons_material_1.QrCode, null)),
                    React.createElement(material_1.ListItemText, null, "Products"),
                    React.createElement(material_1.Typography, { variant: "body2", color: "text.secondary" }, "\u2318P"))) }))); };
    var CustomLayout = function (props) { return React.createElement(_1.SolarLayout, __assign({}, props, { menu: CustomMenu })); };
    return (React.createElement(react_router_dom_1.MemoryRouter, { initialEntries: ['/'] },
        React.createElement(react_admin_1.Admin, { dataProvider: (0, react_admin_1.testDataProvider)(), layout: CustomLayout },
            React.createElement(react_admin_1.CustomRoutes, null,
                React.createElement(react_router_dom_1.Route, { path: "/", element: React.createElement(Page, { title: "Dashboard" }) }),
                React.createElement(react_router_dom_1.Route, { path: "/sales", element: React.createElement(Page, { title: "Sales" }) }),
                React.createElement(react_router_dom_1.Route, { path: "/customers", element: React.createElement(Page, { title: "Customers" }) }),
                React.createElement(react_router_dom_1.Route, { path: "/products", element: React.createElement(Page, { title: "Products" }) })))));
};
exports.MenuItemChild = MenuItemChild;
