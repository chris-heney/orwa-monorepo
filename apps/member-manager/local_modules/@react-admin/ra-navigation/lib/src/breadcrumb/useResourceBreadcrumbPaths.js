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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useResourceBreadcrumbPaths = void 0;
var react_admin_1 = require("react-admin");
var _1 = require(".");
/**
 * This hook is used internally to build a resource breadcrumb path map
 * The result is usually used by <ResourceBreadcrumbItem /> to render a BreadcrumbItem tree for a given resource
 *
 * @see ResourceBreadcrumbItem
 */
var useResourceBreadcrumbPaths = function (resource) {
    var resourceDefinition = (0, react_admin_1.useResourceDefinition)({ resource: resource });
    var buildResourceBreadcrumbPaths = (0, _1.useBuildResourceBreadcrumbPaths)();
    return buildResourceBreadcrumbPaths(__assign(__assign({}, resourceDefinition), { hasCreate: !!resourceDefinition.hasCreate, hasEdit: !!resourceDefinition.hasEdit, hasList: !!resourceDefinition.hasList, hasShow: !!resourceDefinition.hasShow }));
};
exports.useResourceBreadcrumbPaths = useResourceBreadcrumbPaths;
