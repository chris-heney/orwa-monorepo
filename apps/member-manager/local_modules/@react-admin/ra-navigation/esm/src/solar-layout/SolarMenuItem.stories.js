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
import { CustomRoutes, testDataProvider, Admin } from 'react-admin';
import { Typography, Skeleton, ListItemText, ListItemIcon, Divider, } from '@mui/material';
import { Dashboard, PieChartOutlined, PeopleOutlined, Inventory, QrCode, } from '@mui/icons-material';
import { MemoryRouter, Route } from 'react-router-dom';
import { SolarLayout, SolarMenu } from '.';
import { useDefineAppLocation } from '../app-location';
export default { title: 'ra-navigation/SolarLayout/SolarMenuItem' };
export var Basic = function () {
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
var Page = function (_a) {
    var title = _a.title;
    useDefineAppLocation(title.toLowerCase() || 'dashboard');
    return (React.createElement(React.Fragment, null,
        React.createElement(Typography, { variant: "h5", mt: 2 }, title),
        React.createElement(Skeleton, { height: 300 })));
};
export var MenuItemChild = function () {
    var CustomMenu = function () { return (React.createElement(SolarMenu, null,
        React.createElement(SolarMenu.Item, { name: "dashboard", to: "/", label: "Dashboard", icon: React.createElement(Dashboard, null) }),
        React.createElement(Divider, null),
        React.createElement(SolarMenu.Item, { name: "sales", to: "/sales", icon: React.createElement(PieChartOutlined, null), label: "Sales" }),
        React.createElement(SolarMenu.Item, { name: "customers", to: "/customers", icon: React.createElement(PeopleOutlined, null), label: "Customers" }),
        React.createElement(SolarMenu.Item, { name: "catalog", icon: React.createElement(Inventory, null), label: "Catalog", subMenu: React.createElement(SolarMenu.List, { disablePadding: true },
                React.createElement(SolarMenu.Item, { name: "products", to: "/products" },
                    React.createElement(ListItemIcon, null,
                        React.createElement(QrCode, null)),
                    React.createElement(ListItemText, null, "Products"),
                    React.createElement(Typography, { variant: "body2", color: "text.secondary" }, "\u2318P"))) }))); };
    var CustomLayout = function (props) { return React.createElement(SolarLayout, __assign({}, props, { menu: CustomMenu })); };
    return (React.createElement(MemoryRouter, { initialEntries: ['/'] },
        React.createElement(Admin, { dataProvider: testDataProvider(), layout: CustomLayout },
            React.createElement(CustomRoutes, null,
                React.createElement(Route, { path: "/", element: React.createElement(Page, { title: "Dashboard" }) }),
                React.createElement(Route, { path: "/sales", element: React.createElement(Page, { title: "Sales" }) }),
                React.createElement(Route, { path: "/customers", element: React.createElement(Page, { title: "Customers" }) }),
                React.createElement(Route, { path: "/products", element: React.createElement(Page, { title: "Products" }) })))));
};
