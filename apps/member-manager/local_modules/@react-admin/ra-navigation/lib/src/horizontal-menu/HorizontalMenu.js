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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HorizontalMenu = void 0;
var React = __importStar(require("react"));
var material_1 = require("@mui/material");
var react_admin_1 = require("react-admin");
var app_location_1 = require("../app-location");
var ContainerLayoutContext_1 = require("./ContainerLayoutContext");
var HorizontalMenuItem_1 = require("./HorizontalMenuItem");
/**
 * A horizontal menu component, alternative to react-admin's `<Menu>`.
 * To be used in the AppBar of the `<ContainerLayout>`.
 *
 * @example
 * import { HorizontalMenu } from '@react-admin/ra-navigation';
 *
 * export const Menu = () => (
 *     <HorizontalMenu>
 *         <HorizontalMenu.Item label="Dashboard" to="/" value="" />
 *         <HorizontalMenu.Item label="Songs" to="/songs" value="songs" />
 *         <HorizontalMenu.Item label="Artists" to="/artists" value="artists" />
 *     </HorizontalMenu>
 * );
 */
var HorizontalMenu = function (props) {
    var resources = (0, react_admin_1.useResourceDefinitions)();
    var getResourceLabel = (0, react_admin_1.useGetResourceLabel)();
    var hasDashboard = (0, ContainerLayoutContext_1.useContainerLayout)(props).hasDashboard;
    var createPath = (0, react_admin_1.useCreatePath)();
    var translate = (0, react_admin_1.useTranslate)();
    var _a = props.children, children = _a === void 0 ? __spreadArray([
        hasDashboard ? (React.createElement(HorizontalMenuItem_1.HorizontalMenuItem, { key: "dashboard", label: translate('ra.page.dashboard'), to: "/", value: "" })) : null
    ], Object.keys(resources)
        .filter(function (name) { return resources[name].hasList; })
        .map(function (name) { return (React.createElement(HorizontalMenuItem_1.HorizontalMenuItem, { key: name, label: getResourceLabel(name, 2), to: createPath({
            resource: name,
            type: 'list',
        }), value: name, state: { _scrollToTop: true } })); }), true).filter(React.isValidElement) : _a, hasDashboardOverride = props.hasDashboard, rest = __rest(props, ["children", "hasDashboard"]);
    var match = (0, app_location_1.useAppLocationMatcher)();
    var paths = React.Children.map(children, function (child) { return child.props.value; });
    var currentPath = false, index = 0;
    while (!currentPath && index < paths.length) {
        var value = paths[index];
        if (match(value)) {
            currentPath = value;
        }
        index++;
    }
    return (React.createElement(material_1.Tabs, __assign({ value: currentPath, "aria-label": "Navigation Tabs", textColor: "inherit" }, rest), children));
};
exports.HorizontalMenu = HorizontalMenu;
exports.HorizontalMenu.Item = HorizontalMenuItem_1.HorizontalMenuItem;
