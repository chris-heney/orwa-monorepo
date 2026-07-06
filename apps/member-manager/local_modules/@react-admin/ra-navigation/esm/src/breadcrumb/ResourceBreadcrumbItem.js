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
import { useResourceBreadcrumbPaths } from '.';
import { BreadcrumbItem } from './BreadcrumbItem';
/**
 * The <ResourceBreadcrumbItem /> component allows to render a <BreadcrumbItem /> for a given resource.
 *
 * Also exported as `Breadcrumb.ResourceItem` for convenience.
 *
 * @see BreadcrumbItem
 */
export var ResourceBreadcrumbItem = function (_a) {
    var resource = _a.resource, path = _a.path;
    var resourcesPaths = useResourceBreadcrumbPaths(resource);
    var listPath = resourcesPaths[resource];
    var childPaths = Object.keys(resourcesPaths)
        .filter(function (name) { return name !== resource; })
        .reduce(function (acc, name) {
        var _a;
        return (__assign(__assign({}, acc), (_a = {}, _a[name.substring(resource.length + 1)] = resourcesPaths[name], _a)));
    }, {});
    return (React.createElement(BreadcrumbItem, __assign({ name: resource, path: path }, listPath), Object.keys(childPaths).map(function (name) { return (React.createElement(BreadcrumbItem, __assign({ key: name, name: name, path: path ? "".concat(path, ".").concat(resource) : resource }, childPaths[name]))); })));
};
