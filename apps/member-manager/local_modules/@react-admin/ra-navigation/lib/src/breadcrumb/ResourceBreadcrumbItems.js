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
exports.ResourceBreadcrumbItems = void 0;
var React = __importStar(require("react"));
var react_admin_1 = require("react-admin");
var useHasDashboard_1 = require("../app-location/useHasDashboard");
var DashboardBreadcrumbItem_1 = require("./DashboardBreadcrumbItem");
var ResourceBreadcrumbItem_1 = require("./ResourceBreadcrumbItem");
/**
 * The <ResourceBreadcrumbItems /> component allows to render a bunch of <BreadcrumbItem /> from a list of resources
 * By default (without the "resources" props), it'll render all the react-admin registred resources
 *
 * Also exported as `Breadcrumb.ResourceItems` for convenience.
 *
 * @see BreadcrumbItem
 */
var ResourceBreadcrumbItems = function (_a) {
    var selectedResources = _a.resources, props = __rest(_a, ["resources"]);
    var resourceDefinitions = (0, react_admin_1.useResourceDefinitions)();
    var hasDashboard = (0, useHasDashboard_1.useHasDashboard)(props);
    var resources = Object.values(resourceDefinitions)
        .filter(function (resource) {
        return !selectedResources || selectedResources.includes(resource.name);
    })
        .map(function (resource) { return resource.name; });
    if (hasDashboard) {
        return (React.createElement(DashboardBreadcrumbItem_1.DashboardBreadcrumbItem, null, resources.map(function (name) { return (React.createElement(ResourceBreadcrumbItem_1.ResourceBreadcrumbItem, { key: name, resource: name })); })));
    }
    return (React.createElement(React.Fragment, null, resources.map(function (name) { return (React.createElement(ResourceBreadcrumbItem_1.ResourceBreadcrumbItem, { key: name, resource: name })); })));
};
exports.ResourceBreadcrumbItems = ResourceBreadcrumbItems;
