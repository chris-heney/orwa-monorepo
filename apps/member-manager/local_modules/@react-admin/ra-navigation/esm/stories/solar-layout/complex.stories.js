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
import { Admin, CardContentInner, CustomRoutes, Title, memoryStore, testDataProvider, defaultDarkTheme, } from 'react-admin';
import { MemoryRouter, Route } from 'react-router-dom';
import { Collapse, ListItemButton, Typography, } from '@mui/material';
import ComputerIcon from '@mui/icons-material/Computer';
import ComputersIcon from '@mui/icons-material/Devices';
import ConnectionsIcon from '@mui/icons-material/TapAndPlay';
import SSHKeyIcon from '@mui/icons-material/VpnKey';
import CertificatesIcon from '@mui/icons-material/CardMembership';
import UsersIcon from '@mui/icons-material/People';
import AdminIcon from '@mui/icons-material/Settings';
import AuditIcon from '@mui/icons-material/ContentPaste';
import ReportsIcon from '@mui/icons-material/BarChart';
import AnalyticsIcon from '@mui/icons-material/Insights';
import PersonalIcon from '@mui/icons-material/AutoStories';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { SolarAppBar, SolarLayout, SolarMenu, useDefineAppLocation, } from '../../src';
import { Logo } from './Logo';
import { i18nProvider } from './i18nProvider';
import { authProvider } from './authProvider';
import { Dashboard } from './Dashboard';
export default { title: 'ra-navigation/SolarLayout/Complex' };
export var Complex = function (props) { return (React.createElement(MemoryRouter, null,
    React.createElement(Admin, __assign({ dashboard: Dashboard, authProvider: authProvider, i18nProvider: i18nProvider, dataProvider: testDataProvider(), layout: Layout, darkTheme: defaultDarkTheme, store: memoryStore(), title: "Solar Admin" }, props),
        React.createElement(CustomRoutes, null,
            React.createElement(Route, { path: "/resources/all_passwords", element: React.createElement(CustomRoute, { name: "resources.all_passwords" }) }),
            React.createElement(Route, { path: "/resources/owned_managed", element: React.createElement(CustomRoute, { name: "resources.owned_managed" }) }),
            React.createElement(Route, { path: "/resources/favorites", element: React.createElement(CustomRoute, { name: "resources.favorites" }) }),
            React.createElement(Route, { path: "/resources/recent", element: React.createElement(CustomRoute, { name: "resources.recent" }) }),
            React.createElement(Route, { path: "/resources/expired", element: React.createElement(CustomRoute, { name: "resources.expired" }) }),
            React.createElement(Route, { path: "/resources/conflicting", element: React.createElement(CustomRoute, { name: "resources.conflicting" }) }),
            React.createElement(Route, { path: "/resources/policy_violations", element: React.createElement(CustomRoute, { name: "resources.policy_violations" }) }),
            React.createElement(Route, { path: "/resources/disabled", element: React.createElement(CustomRoute, { name: "resources.disabled" }) }),
            React.createElement(Route, { path: "/resources/trash", element: React.createElement(CustomRoute, { name: "resources.trash" }) }),
            React.createElement(Route, { path: "/resources/admin_groups", element: React.createElement(CustomRoute, { name: "resources.admin_groups" }) }),
            React.createElement(Route, { path: "/groups", element: React.createElement(CustomRoute, { name: "groups" }) }),
            React.createElement(Route, { path: "/connections/all_connections", element: React.createElement(CustomRoute, { name: "connections.all_connections" }) }),
            React.createElement(Route, { path: "/connections/owned_managed", element: React.createElement(CustomRoute, { name: "connections.owned_managed" }) }),
            React.createElement(Route, { path: "/connections/favorites", element: React.createElement(CustomRoute, { name: "connections.favorites" }) }),
            React.createElement(Route, { path: "/connections/recent", element: React.createElement(CustomRoute, { name: "connections.recent" }) }),
            React.createElement(Route, { path: "/connections/web_app_connections", element: React.createElement(CustomRoute, { name: "connections.web_app_connections" }) }),
            React.createElement(Route, { path: "/connections/https_gateway_connections", element: React.createElement(CustomRoute, { name: "connections.https_gateway_connections" }) }),
            React.createElement(Route, { path: "/connections/secure_file_transfer", element: React.createElement(CustomRoute, { name: "connections.secure_file_transfer" }) }),
            React.createElement(Route, { path: "/ssh_keys/ssh_keys", element: React.createElement(CustomRoute, { name: "ssh_keys.ssh_keys" }) }),
            React.createElement(Route, { path: "/ssh_keys/key_groups", element: React.createElement(CustomRoute, { name: "ssh_keys.key_groups" }) }),
            React.createElement(Route, { path: "/ssh_keys/discovered_keys", element: React.createElement(CustomRoute, { name: "ssh_keys.discovered_keys" }) }),
            React.createElement(Route, { path: "/ssh_keys/key_association_audit", element: React.createElement(CustomRoute, { name: "ssh_keys.key_association_audit" }) }),
            React.createElement(Route, { path: "/ssh_keys/key_rotation_audit", element: React.createElement(CustomRoute, { name: "ssh_keys.key_rotation_audit" }) }),
            React.createElement(Route, { path: "/certificates/certificates", element: React.createElement(CustomRoute, { name: "certificates.certificates" }) }),
            React.createElement(Route, { path: "/certificates/csr", element: React.createElement(CustomRoute, { name: "certificates.csr" }) }),
            React.createElement(Route, { path: "/certificates/discovery", element: React.createElement(CustomRoute, { name: "certificates.discovery" }) }),
            React.createElement(Route, { path: "/users", element: React.createElement(CustomRoute, { name: "users" }) }),
            React.createElement(Route, { path: "/admin", element: React.createElement(CustomRoute, { name: "admin" }) }),
            React.createElement(Route, { path: "/audits/resource_audit", element: React.createElement(CustomRoute, { name: "audits.resource_audit" }) }),
            React.createElement(Route, { path: "/audits/user_audit", element: React.createElement(CustomRoute, { name: "audits.user_audit" }) }),
            React.createElement(Route, { path: "/audits/task_audit", element: React.createElement(CustomRoute, { name: "audits.task_audit" }) }),
            React.createElement(Route, { path: "/audits/user_sessions", element: React.createElement(CustomRoute, { name: "audits.user_sessions" }) }),
            React.createElement(Route, { path: "/audits/recorded_connections", element: React.createElement(CustomRoute, { name: "audits.recorded_connections" }) }),
            React.createElement(Route, { path: "/audits/active_privileged_sessions", element: React.createElement(CustomRoute, { name: "audits.active_privileged_sessions" }) }),
            React.createElement(Route, { path: "/audits/keys_audit", element: React.createElement(CustomRoute, { name: "audits.keys_audit" }) }),
            React.createElement(Route, { path: "/audits/certificate_audit", element: React.createElement(CustomRoute, { name: "audits.certificate_audit" }) }),
            React.createElement(Route, { path: "/reports/password_reports", element: React.createElement(CustomRoute, { name: "reports.password_reports" }) }),
            React.createElement(Route, { path: "/reports/user_reports", element: React.createElement(CustomRoute, { name: "reports.user_reports" }) }),
            React.createElement(Route, { path: "/reports/general_reports", element: React.createElement(CustomRoute, { name: "reports.general_reports" }) }),
            React.createElement(Route, { path: "/reports/compliance_reports", element: React.createElement(CustomRoute, { name: "reports.compliance_reports" }) }),
            React.createElement(Route, { path: "/reports/custom_reports", element: React.createElement(CustomRoute, { name: "reports.custom_reports" }) }),
            React.createElement(Route, { path: "/reports/certificate_reports", element: React.createElement(CustomRoute, { name: "reports.certificate_reports" }) }),
            React.createElement(Route, { path: "/reports/ssh_key_reports", element: React.createElement(CustomRoute, { name: "reports.ssh_key_reports" }) }),
            React.createElement(Route, { path: "/reports/query_report/search_reports", element: React.createElement(CustomRoute, { name: "reports.query_report.search_reports" }) }),
            React.createElement(Route, { path: "/reports/query_report/favorite_reports", element: React.createElement(CustomRoute, { name: "reports.query_report.favorite_reports" }) }),
            React.createElement(Route, { path: "/reports/query_report/manage_categories", element: React.createElement(CustomRoute, { name: "reports.query_report.manage_categories" }) }),
            React.createElement(Route, { path: "/reports/query_report/resource_groups", element: React.createElement(CustomRoute, { name: "reports.query_report.resource_groups" }) }),
            React.createElement(Route, { path: "/reports/query_report/resources", element: React.createElement(CustomRoute, { name: "reports.query_report.resources" }) }),
            React.createElement(Route, { path: "/reports/query_report/self_service_privileged_elevations", element: React.createElement(CustomRoute, { name: "reports.query_report.self_service_privileged_elevations" }) }),
            React.createElement(Route, { path: "/reports/query_report/ssh_command_control", element: React.createElement(CustomRoute, { name: "reports.query_report.ssh_command_control" }) }),
            React.createElement(Route, { path: "/reports/query_report/user_groups", element: React.createElement(CustomRoute, { name: "reports.query_report.user_groups" }) }),
            React.createElement(Route, { path: "/reports/query_report/users", element: React.createElement(CustomRoute, { name: "reports.query_report.users" }) }),
            React.createElement(Route, { path: "/reports/query_report/zero_trust", element: React.createElement(CustomRoute, { name: "reports.query_report.zero_trust" }) }),
            React.createElement(Route, { path: "/advanced_analytics/manage_engine_analytics_plus", element: React.createElement(CustomRoute, { name: "advanced_analytics.manage_engine_analytics_plus" }) }),
            React.createElement(Route, { path: "/advanced_analytics/manage_engine_log_360_ueba", element: React.createElement(CustomRoute, { name: "advanced_analytics.manage_engine_log_360_ueba" }) }),
            React.createElement(Route, { path: "/personal", element: React.createElement(CustomRoute, { name: "personal" }) }))))); };
export var Sx = function () { return React.createElement(Complex, { layout: SxLayout }); };
var Layout = function (_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    return (React.createElement(SolarLayout, __assign({}, props, { menu: Menu }), children));
};
var SxAppBar = function (props) { return (React.createElement(SolarAppBar, __assign({}, props, { sx: { backgroundColor: '#C724B1' } }))); };
var SxMenu = function (props) { return (React.createElement(Menu, __assign({ sx: {
        '& .RaSolarPrimarySidebar-root .MuiDrawer-paper': {
            backgroundColor: '#C724B1',
            '& .MuiButtonBase-root': {
                color: '#ffffff',
            },
            '& .MuiButtonBase-root.Mui-selected': {
                backgroundColor: '#3A3A59',
                color: '#ffffff',
            },
        },
    } }, props))); };
var SxLayout = function (props) { return (React.createElement(SolarLayout, __assign({}, props, { menu: SxMenu, appBar: SxAppBar }))); };
var Menu = function (props) { return (React.createElement(SolarMenu, __assign({}, props),
    React.createElement(SolarMenu.DashboardItem, { icon: React.createElement(Logo, null) }),
    React.createElement(SolarMenu.Item, { name: "resources", label: "Resources", icon: React.createElement(ComputerIcon, null), subMenu: React.createElement(SolarMenu.List, { dense: true, disablePadding: true, sx: { gap: 0 } },
            React.createElement(Typography, { variant: "h6", sx: { px: 1, my: 1 } }, "Passwords"),
            React.createElement(SolarMenu.Item, { name: "resources.passwords", to: "/resources/all_passwords", label: "Passwords" }),
            React.createElement(SolarMenu.Item, { name: "resources.owned_managed", to: "/resources/owned_managed", label: "Owned and Managed" }),
            React.createElement(SolarMenu.Item, { name: "resources.favorites", to: "/resources/favorites", label: "Favorites" }),
            React.createElement(SolarMenu.Item, { name: "resources.recent", to: "/resources/recent", label: "Recently accessed" }),
            React.createElement(CollapsibleMenuItem, { label: "Admin actions" },
                React.createElement(SolarMenu.List, { dense: true, disablePadding: true, sx: { gap: 0, pl: 2 } },
                    React.createElement(SolarMenu.Item, { name: "resources.expired", to: "/resources/expired", label: "Expired Passwords" }),
                    React.createElement(SolarMenu.Item, { name: "resources.conflicting", to: "/resources/conflicting", label: "Conflicting Passwords" }),
                    React.createElement(SolarMenu.Item, { name: "resources.policy_violations", to: "/resources/policy_violations", label: "Policy Violations" }),
                    React.createElement(SolarMenu.Item, { name: "resources.disabled", to: "/resources/disabled", label: "Disabled Resources" }),
                    React.createElement(SolarMenu.Item, { name: "resources.trash", to: "/resources/trash", label: "Trash" })))) }),
    React.createElement(SolarMenu.Item, { name: "groups", to: "/groups", label: "Groups", icon: React.createElement(ComputersIcon, null) }),
    React.createElement(SolarMenu.Item, { name: "connections", label: "connections", icon: React.createElement(ConnectionsIcon, null), subMenu: React.createElement(SolarMenu.List, { dense: true, disablePadding: true, sx: { gap: 0 } },
            React.createElement(Typography, { variant: "h6", sx: { px: 1, my: 1 } }, "Connections"),
            React.createElement(SolarMenu.Item, { name: "connections.all_connections", to: "/connections/all_connections", label: "All My Connections" }),
            React.createElement(SolarMenu.Item, { name: "connections.owned_managed", to: "/connections/owned_managed", label: "Owned and Managed" }),
            React.createElement(SolarMenu.Item, { name: "connections.favorites", to: "/connections/favorites", label: "Favorites" }),
            React.createElement(SolarMenu.Item, { name: "connections.recent", to: "/connections/recent", label: "Recently accessed" }),
            React.createElement(SolarMenu.Item, { name: "connections.web_app_connections", to: "/connections/web_app_connections", label: "Web App Connections" }),
            React.createElement(SolarMenu.Item, { name: "connections.http_gateway_connections", to: "/connections/https_gateway_connections", label: "HTTP Gateway Connections" }),
            React.createElement(SolarMenu.Item, { name: "connections.secure_file_transfer", to: "/connections/secure_file_transfer", label: "Secure File Transfer" })) }),
    React.createElement(SolarMenu.Item, { name: "ssh_keys", label: "SSH Keys", icon: React.createElement(SSHKeyIcon, null), subMenu: React.createElement(SolarMenu.List, { dense: true, disablePadding: true, sx: { gap: 0 } },
            React.createElement(Typography, { variant: "h6", sx: { px: 1, my: 1 } }, "SSH Keys"),
            React.createElement(SolarMenu.Item, { name: "ssh_keys.ssh_keys", to: "/ssh_keys/ssh_keys", label: "SSH Keys" }),
            React.createElement(SolarMenu.Item, { name: "ssh_keys.key_groups", to: "/ssh_keys/key_groups", label: "Key Groups" }),
            React.createElement(SolarMenu.Item, { name: "ssh_keys.discovered_keys", to: "/ssh_keys/discovered_keys", label: "Discovered Keys" }),
            React.createElement(SolarMenu.Item, { name: "ssh_keys.key_association_audit", to: "/ssh_keys/key_association_audit", label: "Key Association Audit" }),
            React.createElement(SolarMenu.Item, { name: "ssh_keys.key_rotation_audit", to: "/ssh_keys/key_rotation_audit", label: "Key Rotation Audit" })) }),
    React.createElement(SolarMenu.Item, { name: "certificates", label: "Certificates", icon: React.createElement(CertificatesIcon, null), subMenu: React.createElement(SolarMenu.List, { dense: true, disablePadding: true, sx: { gap: 0 } },
            React.createElement(Typography, { variant: "h6", sx: { px: 1, my: 1 } }, "Certificates"),
            React.createElement(SolarMenu.Item, { name: "certificates.certificates", to: "/certificates/certificates", label: "Certificates" }),
            React.createElement(SolarMenu.Item, { name: "certificates.discovery", to: "/certificates/discovery", label: "Discovery" })) }),
    React.createElement(SolarMenu.Item, { name: "users", to: "/users", label: "Users", icon: React.createElement(UsersIcon, null) }),
    React.createElement(SolarMenu.Item, { name: "admin", to: "/admin", label: "Admin", icon: React.createElement(AdminIcon, null) }),
    React.createElement(SolarMenu.Item, { name: "audits", label: "Audits", icon: React.createElement(AuditIcon, null), subMenu: React.createElement(SolarMenu.List, { dense: true, disablePadding: true, sx: { gap: 0 } },
            React.createElement(Typography, { variant: "h6", sx: { px: 1, my: 1 } }, "Audits"),
            React.createElement(SolarMenu.Item, { name: "audits.resource_audit", to: "/audits/resource_audit", label: "Resource Audit" }),
            React.createElement(SolarMenu.Item, { name: "audits.user_audit", to: "/audits/user_audit", label: "User Audit" }),
            React.createElement(SolarMenu.Item, { name: "audits.task_audit", to: "/audits/task_audit", label: "Task Audit" }),
            React.createElement(SolarMenu.Item, { name: "audits.user_sessions", to: "/audits/user_sessions", label: "User Sessions" }),
            React.createElement(SolarMenu.Item, { name: "audits.recorded_connections", to: "/audits/recorded_connections", label: "Recorded Connections" }),
            React.createElement(SolarMenu.Item, { name: "audits.active_privileged_sessions", to: "/audits/active_privileged_sessions", label: "Active Privileged Sessions" }),
            React.createElement(SolarMenu.Item, { name: "audits.keys_audit", to: "/audits/keys_audit", label: "Keys Audit" }),
            React.createElement(SolarMenu.Item, { name: "audits.certificate_audit", to: "/audits/certificate_audit", label: "Certificate Audit" })) }),
    React.createElement(SolarMenu.Item, { name: "reports", label: "Reports", icon: React.createElement(ReportsIcon, null), subMenu: React.createElement(SolarMenu.List, { dense: true, disablePadding: true, sx: { gap: 0 } },
            React.createElement(Typography, { variant: "h6", sx: { px: 1, my: 1 } }, "Reports"),
            React.createElement(SolarMenu.Item, { name: "reports.password_reports", to: "/reports/password_reports", label: "Password Reports" }),
            React.createElement(SolarMenu.Item, { name: "reports.user_reports", to: "/reports/user_reports", label: "User Reports" }),
            React.createElement(SolarMenu.Item, { name: "reports.general_reports", to: "/reports/general_reports", label: "General Reports" }),
            React.createElement(SolarMenu.Item, { name: "reports.compliance_reports", to: "/reports/compliance_reports", label: "Compliance Reports" }),
            React.createElement(SolarMenu.Item, { name: "reports.custom_reports", to: "/reports/custom_reports", label: "Custom Reports" }),
            React.createElement(SolarMenu.Item, { name: "reports.certificate_reports", to: "/reports/certificate_reports", label: "Certificate Reports" }),
            React.createElement(SolarMenu.Item, { name: "reports.ssh_key_reports", to: "/reports/ssh_key_reports", label: "SSH Key Reports" }),
            React.createElement(CollapsibleMenuItem, { label: "Admin actions" },
                React.createElement(SolarMenu.List, { dense: true, disablePadding: true, sx: { gap: 0, pl: 2 } },
                    React.createElement(SolarMenu.Item, { name: "reports.query_report.search_reports", to: "/reports/query_report/search_reports", label: "Search Reports" }),
                    React.createElement(SolarMenu.Item, { name: "reports.query_report.favorite_reports", to: "/reports/query_report/favorite_reports", label: "Favorite Reports" }),
                    React.createElement(SolarMenu.Item, { name: "reports.query_report.manage_categories", to: "/reports/query_report/manage_categories", label: "Manage Categories" }),
                    React.createElement(SolarMenu.Item, { name: "reports.query_report.resource_groups", to: "/reports/query_report/resource_groups", label: "Resource Groups" }),
                    React.createElement(SolarMenu.Item, { name: "reports.query_report.resources", to: "/reports/query_report/resources", label: "Resources" }),
                    React.createElement(SolarMenu.Item, { name: "reports.query_report.self_service_privileged_elevations", to: "/reports/query_report/self_service_privileged_elevations", label: "Self Service Privileged Elevations" }),
                    React.createElement(SolarMenu.Item, { name: "reports.query_report.ssh_command_control", to: "/reports/query_report/ssh_command_control", label: "SSH Command Control" }),
                    React.createElement(SolarMenu.Item, { name: "reports.query_report.user_groups", to: "/reports/query_report/user_groups", label: "User Groups" }),
                    React.createElement(SolarMenu.Item, { name: "reports.query_report.users", to: "/reports/query_report/users", label: "Users" }),
                    React.createElement(SolarMenu.Item, { name: "reports.query_report.zero_trust", to: "/reports/query_report/zero_trust", label: "Zero Trust" })))) }),
    React.createElement(SolarMenu.Item, { name: "advanced_analytics", label: "Advanced Analytics", icon: React.createElement(AnalyticsIcon, null), subMenu: React.createElement(SolarMenu.List, { dense: true, disablePadding: true, sx: { gap: 0 } },
            React.createElement(Typography, { variant: "h6", sx: { px: 1, my: 1 } }, "Advanced Analytics"),
            React.createElement(SolarMenu.Item, { name: "advanced_analytics.manage_engine_analytics_plus", to: "/advanced_analytics/manage_engine_analytics_plus", label: "ManageEngine Analytics Plus" }),
            React.createElement(SolarMenu.Item, { name: "advanced_analytics.manage_engine_log_360_ueba", to: "/advanced_analytics/manage_engine_log_360_ueba", label: "ManageEngine Log 360 UEBA" })) }),
    React.createElement(SolarMenu.Item, { name: "personal", to: "/personal", label: "Personal", icon: React.createElement(PersonalIcon, null) }))); };
var CollapsibleMenuItem = function (_a) {
    var children = _a.children, label = _a.label, props = __rest(_a, ["children", "label"]);
    var _b = React.useState(true), open = _b[0], setOpen = _b[1];
    var handleClick = function () {
        setOpen(!open);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(ListItemButton, __assign({}, props, { sx: {
                paddingX: 1,
                color: function (theme) { return theme.palette.text.secondary; },
            }, onClick: handleClick }),
            label,
            open ? React.createElement(ExpandLess, null) : React.createElement(ExpandMore, null)),
        React.createElement(Collapse, { in: open, timeout: "auto", unmountOnExit: true }, children)));
};
var CustomRoute = function (_a) {
    var name = _a.name;
    useDefineAppLocation(name);
    return (React.createElement(React.Fragment, null,
        React.createElement(Title, { title: name }),
        React.createElement(CardContentInner, null,
            "Route: ",
            React.createElement("code", null, name))));
};
