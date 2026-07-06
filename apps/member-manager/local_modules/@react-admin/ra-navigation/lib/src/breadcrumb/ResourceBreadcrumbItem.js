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
exports.ResourceBreadcrumbItem = void 0;
var React = __importStar(require("react"));
var _1 = require(".");
var BreadcrumbItem_1 = require("./BreadcrumbItem");
/**
 * The <ResourceBreadcrumbItem /> component allows to render a <BreadcrumbItem /> for a given resource.
 *
 * Also exported as `Breadcrumb.ResourceItem` for convenience.
 *
 * @see BreadcrumbItem
 */
var ResourceBreadcrumbItem = function (_a) {
    var resource = _a.resource, path = _a.path;
    var resourcesPaths = (0, _1.useResourceBreadcrumbPaths)(resource);
    var listPath = resourcesPaths[resource];
    var childPaths = Object.keys(resourcesPaths)
        .filter(function (name) { return name !== resource; })
        .reduce(function (acc, name) {
        var _a;
        return (__assign(__assign({}, acc), (_a = {}, _a[name.substring(resource.length + 1)] = resourcesPaths[name], _a)));
    }, {});
    return (React.createElement(BreadcrumbItem_1.BreadcrumbItem, __assign({ name: resource, path: path }, listPath), Object.keys(childPaths).map(function (name) { return (React.createElement(BreadcrumbItem_1.BreadcrumbItem, __assign({ key: name, name: name, path: path ? "".concat(path, ".").concat(resource) : resource }, childPaths[name]))); })));
};
exports.ResourceBreadcrumbItem = ResourceBreadcrumbItem;
