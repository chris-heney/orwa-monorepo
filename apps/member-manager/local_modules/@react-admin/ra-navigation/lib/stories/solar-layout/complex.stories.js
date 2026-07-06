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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sx = exports.Complex = void 0;
var React = __importStar(require("react"));
var react_admin_1 = require("react-admin");
var react_router_dom_1 = require("react-router-dom");
var material_1 = require("@mui/material");
var Computer_1 = __importDefault(require("@mui/icons-material/Computer"));
var Devices_1 = __importDefault(require("@mui/icons-material/Devices"));
var TapAndPlay_1 = __importDefault(require("@mui/icons-material/TapAndPlay"));
var VpnKey_1 = __importDefault(require("@mui/icons-material/VpnKey"));
var CardMembership_1 = __importDefault(require("@mui/icons-material/CardMembership"));
var People_1 = __importDefault(require("@mui/icons-material/People"));
var Settings_1 = __importDefault(require("@mui/icons-material/Settings"));
var ContentPaste_1 = __importDefault(require("@mui/icons-material/ContentPaste"));
var BarChart_1 = __importDefault(require("@mui/icons-material/BarChart"));
var Insights_1 = __importDefault(require("@mui/icons-material/Insights"));
var AutoStories_1 = __importDefault(require("@mui/icons-material/AutoStories"));
var ExpandLess_1 = __importDefault(require("@mui/icons-material/ExpandLess"));
var ExpandMore_1 = __importDefault(require("@mui/icons-material/ExpandMore"));
var src_1 = require("../../src");
var Logo_1 = require("./Logo");
var i18nProvider_1 = require("./i18nProvider");
var authProvider_1 = require("./authProvider");
var Dashboard_1 = require("./Dashboard");
exports.default = { title: 'ra-navigation/SolarLayout/Complex' };
var Complex = function (props) { return (React.createElement(react_router_dom_1.MemoryRouter, null,
    React.createElement(react_admin_1.Admin, __assign({ dashboard: Dashboard_1.Dashboard, authProvider: authProvider_1.authProvider, i18nProvider: i18nProvider_1.i18nProvider, dataProvider: (0, react_admin_1.testDataProvider)(), layout: Layout, darkTheme: react_admin_1.defaultDarkTheme, store: (0, react_admin_1.memoryStore)(), title: "Solar Admin" }, props),
        React.createElement(react_admin_1.CustomRoutes, null,
            React.createElement(react_router_dom_1.Route, { path: "/resources/all_passwords", element: React.createElement(CustomRoute, { name: "resources.all_passwords" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/resources/owned_managed", element: React.createElement(CustomRoute, { name: "resources.owned_managed" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/resources/favorites", element: React.createElement(CustomRoute, { name: "resources.favorites" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/resources/recent", element: React.createElement(CustomRoute, { name: "resources.recent" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/resources/expired", element: React.createElement(CustomRoute, { name: "resources.expired" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/resources/conflicting", element: React.createElement(CustomRoute, { name: "resources.conflicting" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/resources/policy_violations", element: React.createElement(CustomRoute, { name: "resources.policy_violations" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/resources/disabled", element: React.createElement(CustomRoute, { name: "resources.disabled" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/resources/trash", element: React.createElement(CustomRoute, { name: "resources.trash" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/resources/admin_groups", element: React.createElement(CustomRoute, { name: "resources.admin_groups" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/groups", element: React.createElement(CustomRoute, { name: "groups" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/connections/all_connections", element: React.createElement(CustomRoute, { name: "connections.all_connections" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/connections/owned_managed", element: React.createElement(CustomRoute, { name: "connections.owned_managed" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/connections/favorites", element: React.createElement(CustomRoute, { name: "connections.favorites" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/connections/recent", element: React.createElement(CustomRoute, { name: "connections.recent" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/connections/web_app_connections", element: React.createElement(CustomRoute, { name: "connections.web_app_connections" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/connections/https_gateway_connections", element: React.createElement(CustomRoute, { name: "connections.https_gateway_connections" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/connections/secure_file_transfer", element: React.createElement(CustomRoute, { name: "connections.secure_file_transfer" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/ssh_keys/ssh_keys", element: React.createElement(CustomRoute, { name: "ssh_keys.ssh_keys" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/ssh_keys/key_groups", element: React.createElement(CustomRoute, { name: "ssh_keys.key_groups" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/ssh_keys/discovered_keys", element: React.createElement(CustomRoute, { name: "ssh_keys.discovered_keys" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/ssh_keys/key_association_audit", element: React.createElement(CustomRoute, { name: "ssh_keys.key_association_audit" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/ssh_keys/key_rotation_audit", element: React.createElement(CustomRoute, { name: "ssh_keys.key_rotation_audit" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/certificates/certificates", element: React.createElement(CustomRoute, { name: "certificates.certificates" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/certificates/csr", element: React.createElement(CustomRoute, { name: "certificates.csr" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/certificates/discovery", element: React.createElement(CustomRoute, { name: "certificates.discovery" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/users", element: React.createElement(CustomRoute, { name: "users" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/admin", element: React.createElement(CustomRoute, { name: "admin" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/audits/resource_audit", element: React.createElement(CustomRoute, { name: "audits.resource_audit" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/audits/user_audit", element: React.createElement(CustomRoute, { name: "audits.user_audit" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/audits/task_audit", element: React.createElement(CustomRoute, { name: "audits.task_audit" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/audits/user_sessions", element: React.createElement(CustomRoute, { name: "audits.user_sessions" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/audits/recorded_connections", element: React.createElement(CustomRoute, { name: "audits.recorded_connections" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/audits/active_privileged_sessions", element: React.createElement(CustomRoute, { name: "audits.active_privileged_sessions" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/audits/keys_audit", element: React.createElement(CustomRoute, { name: "audits.keys_audit" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/audits/certificate_audit", element: React.createElement(CustomRoute, { name: "audits.certificate_audit" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/reports/password_reports", element: React.createElement(CustomRoute, { name: "reports.password_reports" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/reports/user_reports", element: React.createElement(CustomRoute, { name: "reports.user_reports" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/reports/general_reports", element: React.createElement(CustomRoute, { name: "reports.general_reports" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/reports/compliance_reports", element: React.createElement(CustomRoute, { name: "reports.compliance_reports" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/reports/custom_reports", element: React.createElement(CustomRoute, { name: "reports.custom_reports" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/reports/certificate_reports", element: React.createElement(CustomRoute, { name: "reports.certificate_reports" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/reports/ssh_key_reports", element: React.createElement(CustomRoute, { name: "reports.ssh_key_reports" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/reports/query_report/search_reports", element: React.createElement(CustomRoute, { name: "reports.query_report.search_reports" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/reports/query_report/favorite_reports", element: React.createElement(CustomRoute, { name: "reports.query_report.favorite_reports" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/reports/query_report/manage_categories", element: React.createElement(CustomRoute, { name: "reports.query_report.manage_categories" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/reports/query_report/resource_groups", element: React.createElement(CustomRoute, { name: "reports.query_report.resource_groups" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/reports/query_report/resources", element: React.createElement(CustomRoute, { name: "reports.query_report.resources" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/reports/query_report/self_service_privileged_elevations", element: React.createElement(CustomRoute, { name: "reports.query_report.self_service_privileged_elevations" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/reports/query_report/ssh_command_control", element: React.createElement(CustomRoute, { name: "reports.query_report.ssh_command_control" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/reports/query_report/user_groups", element: React.createElement(CustomRoute, { name: "reports.query_report.user_groups" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/reports/query_report/users", element: React.createElement(CustomRoute, { name: "reports.query_report.users" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/reports/query_report/zero_trust", element: React.createElement(CustomRoute, { name: "reports.query_report.zero_trust" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/advanced_analytics/manage_engine_analytics_plus", element: React.createElement(CustomRoute, { name: "advanced_analytics.manage_engine_analytics_plus" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/advanced_analytics/manage_engine_log_360_ueba", element: React.createElement(CustomRoute, { name: "advanced_analytics.manage_engine_log_360_ueba" }) }),
            React.createElement(react_router_dom_1.Route, { path: "/personal", element: React.createElement(CustomRoute, { name: "personal" }) }))))); };
exports.Complex = Complex;
var Sx = function () { return React.createElement(exports.Complex, { layout: SxLayout }); };
exports.Sx = Sx;
var Layout = function (_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    return (React.createElement(src_1.SolarLayout, __assign({}, props, { menu: Menu }), children));
};
var SxAppBar = function (props) { return (React.createElement(src_1.SolarAppBar, __assign({}, props, { sx: { backgroundColor: '#C724B1' } }))); };
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
var SxLayout = function (props) { return (React.createElement(src_1.SolarLayout, __assign({}, props, { menu: SxMenu, appBar: SxAppBar }))); };
var Menu = function (props) { return (React.createElement(src_1.SolarMenu, __assign({}, props),
    React.createElement(src_1.SolarMenu.DashboardItem, { icon: React.createElement(Logo_1.Logo, null) }),
    React.createElement(src_1.SolarMenu.Item, { name: "resources", label: "Resources", icon: React.createElement(Computer_1.default, null), subMenu: React.createElement(src_1.SolarMenu.List, { dense: true, disablePadding: true, sx: { gap: 0 } },
            React.createElement(material_1.Typography, { variant: "h6", sx: { px: 1, my: 1 } }, "Passwords"),
            React.createElement(src_1.SolarMenu.Item, { name: "resources.passwords", to: "/resources/all_passwords", label: "Passwords" }),
            React.createElement(src_1.SolarMenu.Item, { name: "resources.owned_managed", to: "/resources/owned_managed", label: "Owned and Managed" }),
            React.createElement(src_1.SolarMenu.Item, { name: "resources.favorites", to: "/resources/favorites", label: "Favorites" }),
            React.createElement(src_1.SolarMenu.Item, { name: "resources.recent", to: "/resources/recent", label: "Recently accessed" }),
            React.createElement(CollapsibleMenuItem, { label: "Admin actions" },
                React.createElement(src_1.SolarMenu.List, { dense: true, disablePadding: true, sx: { gap: 0, pl: 2 } },
                    React.createElement(src_1.SolarMenu.Item, { name: "resources.expired", to: "/resources/expired", label: "Expired Passwords" }),
                    React.createElement(src_1.SolarMenu.Item, { name: "resources.conflicting", to: "/resources/conflicting", label: "Conflicting Passwords" }),
                    React.createElement(src_1.SolarMenu.Item, { name: "resources.policy_violations", to: "/resources/policy_violations", label: "Policy Violations" }),
                    React.createElement(src_1.SolarMenu.Item, { name: "resources.disabled", to: "/resources/disabled", label: "Disabled Resources" }),
                    React.createElement(src_1.SolarMenu.Item, { name: "resources.trash", to: "/resources/trash", label: "Trash" })))) }),
    React.createElement(src_1.SolarMenu.Item, { name: "groups", to: "/groups", label: "Groups", icon: React.createElement(Devices_1.default, null) }),
    React.createElement(src_1.SolarMenu.Item, { name: "connections", label: "connections", icon: React.createElement(TapAndPlay_1.default, null), subMenu: React.createElement(src_1.SolarMenu.List, { dense: true, disablePadding: true, sx: { gap: 0 } },
            React.createElement(material_1.Typography, { variant: "h6", sx: { px: 1, my: 1 } }, "Connections"),
            React.createElement(src_1.SolarMenu.Item, { name: "connections.all_connections", to: "/connections/all_connections", label: "All My Connections" }),
            React.createElement(src_1.SolarMenu.Item, { name: "connections.owned_managed", to: "/connections/owned_managed", label: "Owned and Managed" }),
            React.createElement(src_1.SolarMenu.Item, { name: "connections.favorites", to: "/connections/favorites", label: "Favorites" }),
            React.createElement(src_1.SolarMenu.Item, { name: "connections.recent", to: "/connections/recent", label: "Recently accessed" }),
            React.createElement(src_1.SolarMenu.Item, { name: "connections.web_app_connections", to: "/connections/web_app_connections", label: "Web App Connections" }),
            React.createElement(src_1.SolarMenu.Item, { name: "connections.http_gateway_connections", to: "/connections/https_gateway_connections", label: "HTTP Gateway Connections" }),
            React.createElement(src_1.SolarMenu.Item, { name: "connections.secure_file_transfer", to: "/connections/secure_file_transfer", label: "Secure File Transfer" })) }),
    React.createElement(src_1.SolarMenu.Item, { name: "ssh_keys", label: "SSH Keys", icon: React.createElement(VpnKey_1.default, null), subMenu: React.createElement(src_1.SolarMenu.List, { dense: true, disablePadding: true, sx: { gap: 0 } },
            React.createElement(material_1.Typography, { variant: "h6", sx: { px: 1, my: 1 } }, "SSH Keys"),
            React.createElement(src_1.SolarMenu.Item, { name: "ssh_keys.ssh_keys", to: "/ssh_keys/ssh_keys", label: "SSH Keys" }),
            React.createElement(src_1.SolarMenu.Item, { name: "ssh_keys.key_groups", to: "/ssh_keys/key_groups", label: "Key Groups" }),
            React.createElement(src_1.SolarMenu.Item, { name: "ssh_keys.discovered_keys", to: "/ssh_keys/discovered_keys", label: "Discovered Keys" }),
            React.createElement(src_1.SolarMenu.Item, { name: "ssh_keys.key_association_audit", to: "/ssh_keys/key_association_audit", label: "Key Association Audit" }),
            React.createElement(src_1.SolarMenu.Item, { name: "ssh_keys.key_rotation_audit", to: "/ssh_keys/key_rotation_audit", label: "Key Rotation Audit" })) }),
    React.createElement(src_1.SolarMenu.Item, { name: "certificates", label: "Certificates", icon: React.createElement(CardMembership_1.default, null), subMenu: React.createElement(src_1.SolarMenu.List, { dense: true, disablePadding: true, sx: { gap: 0 } },
            React.createElement(material_1.Typography, { variant: "h6", sx: { px: 1, my: 1 } }, "Certificates"),
            React.createElement(src_1.SolarMenu.Item, { name: "certificates.certificates", to: "/certificates/certificates", label: "Certificates" }),
            React.createElement(src_1.SolarMenu.Item, { name: "certificates.discovery", to: "/certificates/discovery", label: "Discovery" })) }),
    React.createElement(src_1.SolarMenu.Item, { name: "users", to: "/users", label: "Users", icon: React.createElement(People_1.default, null) }),
    React.createElement(src_1.SolarMenu.Item, { name: "admin", to: "/admin", label: "Admin", icon: React.createElement(Settings_1.default, null) }),
    React.createElement(src_1.SolarMenu.Item, { name: "audits", label: "Audits", icon: React.createElement(ContentPaste_1.default, null), subMenu: React.createElement(src_1.SolarMenu.List, { dense: true, disablePadding: true, sx: { gap: 0 } },
            React.createElement(material_1.Typography, { variant: "h6", sx: { px: 1, my: 1 } }, "Audits"),
            React.createElement(src_1.SolarMenu.Item, { name: "audits.resource_audit", to: "/audits/resource_audit", label: "Resource Audit" }),
            React.createElement(src_1.SolarMenu.Item, { name: "audits.user_audit", to: "/audits/user_audit", label: "User Audit" }),
            React.createElement(src_1.SolarMenu.Item, { name: "audits.task_audit", to: "/audits/task_audit", label: "Task Audit" }),
            React.createElement(src_1.SolarMenu.Item, { name: "audits.user_sessions", to: "/audits/user_sessions", label: "User Sessions" }),
            React.createElement(src_1.SolarMenu.Item, { name: "audits.recorded_connections", to: "/audits/recorded_connections", label: "Recorded Connections" }),
            React.createElement(src_1.SolarMenu.Item, { name: "audits.active_privileged_sessions", to: "/audits/active_privileged_sessions", label: "Active Privileged Sessions" }),
            React.createElement(src_1.SolarMenu.Item, { name: "audits.keys_audit", to: "/audits/keys_audit", label: "Keys Audit" }),
            React.createElement(src_1.SolarMenu.Item, { name: "audits.certificate_audit", to: "/audits/certificate_audit", label: "Certificate Audit" })) }),
    React.createElement(src_1.SolarMenu.Item, { name: "reports", label: "Reports", icon: React.createElement(BarChart_1.default, null), subMenu: React.createElement(src_1.SolarMenu.List, { dense: true, disablePadding: true, sx: { gap: 0 } },
            React.createElement(material_1.Typography, { variant: "h6", sx: { px: 1, my: 1 } }, "Reports"),
            React.createElement(src_1.SolarMenu.Item, { name: "reports.password_reports", to: "/reports/password_reports", label: "Password Reports" }),
            React.createElement(src_1.SolarMenu.Item, { name: "reports.user_reports", to: "/reports/user_reports", label: "User Reports" }),
            React.createElement(src_1.SolarMenu.Item, { name: "reports.general_reports", to: "/reports/general_reports", label: "General Reports" }),
            React.createElement(src_1.SolarMenu.Item, { name: "reports.compliance_reports", to: "/reports/compliance_reports", label: "Compliance Reports" }),
            React.createElement(src_1.SolarMenu.Item, { name: "reports.custom_reports", to: "/reports/custom_reports", label: "Custom Reports" }),
            React.createElement(src_1.SolarMenu.Item, { name: "reports.certificate_reports", to: "/reports/certificate_reports", label: "Certificate Reports" }),
            React.createElement(src_1.SolarMenu.Item, { name: "reports.ssh_key_reports", to: "/reports/ssh_key_reports", label: "SSH Key Reports" }),
            React.createElement(CollapsibleMenuItem, { label: "Admin actions" },
                React.createElement(src_1.SolarMenu.List, { dense: true, disablePadding: true, sx: { gap: 0, pl: 2 } },
                    React.createElement(src_1.SolarMenu.Item, { name: "reports.query_report.search_reports", to: "/reports/query_report/search_reports", label: "Search Reports" }),
                    React.createElement(src_1.SolarMenu.Item, { name: "reports.query_report.favorite_reports", to: "/reports/query_report/favorite_reports", label: "Favorite Reports" }),
                    React.createElement(src_1.SolarMenu.Item, { name: "reports.query_report.manage_categories", to: "/reports/query_report/manage_categories", label: "Manage Categories" }),
                    React.createElement(src_1.SolarMenu.Item, { name: "reports.query_report.resource_groups", to: "/reports/query_report/resource_groups", label: "Resource Groups" }),
                    React.createElement(src_1.SolarMenu.Item, { name: "reports.query_report.resources", to: "/reports/query_report/resources", label: "Resources" }),
                    React.createElement(src_1.SolarMenu.Item, { name: "reports.query_report.self_service_privileged_elevations", to: "/reports/query_report/self_service_privileged_elevations", label: "Self Service Privileged Elevations" }),
                    React.createElement(src_1.SolarMenu.Item, { name: "reports.query_report.ssh_command_control", to: "/reports/query_report/ssh_command_control", label: "SSH Command Control" }),
                    React.createElement(src_1.SolarMenu.Item, { name: "reports.query_report.user_groups", to: "/reports/query_report/user_groups", label: "User Groups" }),
                    React.createElement(src_1.SolarMenu.Item, { name: "reports.query_report.users", to: "/reports/query_report/users", label: "Users" }),
                    React.createElement(src_1.SolarMenu.Item, { name: "reports.query_report.zero_trust", to: "/reports/query_report/zero_trust", label: "Zero Trust" })))) }),
    React.createElement(src_1.SolarMenu.Item, { name: "advanced_analytics", label: "Advanced Analytics", icon: React.createElement(Insights_1.default, null), subMenu: React.createElement(src_1.SolarMenu.List, { dense: true, disablePadding: true, sx: { gap: 0 } },
            React.createElement(material_1.Typography, { variant: "h6", sx: { px: 1, my: 1 } }, "Advanced Analytics"),
            React.createElement(src_1.SolarMenu.Item, { name: "advanced_analytics.manage_engine_analytics_plus", to: "/advanced_analytics/manage_engine_analytics_plus", label: "ManageEngine Analytics Plus" }),
            React.createElement(src_1.SolarMenu.Item, { name: "advanced_analytics.manage_engine_log_360_ueba", to: "/advanced_analytics/manage_engine_log_360_ueba", label: "ManageEngine Log 360 UEBA" })) }),
    React.createElement(src_1.SolarMenu.Item, { name: "personal", to: "/personal", label: "Personal", icon: React.createElement(AutoStories_1.default, null) }))); };
var CollapsibleMenuItem = function (_a) {
    var children = _a.children, label = _a.label, props = __rest(_a, ["children", "label"]);
    var _b = React.useState(true), open = _b[0], setOpen = _b[1];
    var handleClick = function () {
        setOpen(!open);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(material_1.ListItemButton, __assign({}, props, { sx: {
                paddingX: 1,
                color: function (theme) { return theme.palette.text.secondary; },
            }, onClick: handleClick }),
            label,
            open ? React.createElement(ExpandLess_1.default, null) : React.createElement(ExpandMore_1.default, null)),
        React.createElement(material_1.Collapse, { in: open, timeout: "auto", unmountOnExit: true }, children)));
};
var CustomRoute = function (_a) {
    var name = _a.name;
    (0, src_1.useDefineAppLocation)(name);
    return (React.createElement(React.Fragment, null,
        React.createElement(react_admin_1.Title, { title: name }),
        React.createElement(react_admin_1.CardContentInner, null,
            "Route: ",
            React.createElement("code", null, name))));
};
