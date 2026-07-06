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
import { useResourceDefinitions } from 'react-admin';
import { useHasDashboard } from '../app-location/useHasDashboard';
import { DashboardBreadcrumbItem } from './DashboardBreadcrumbItem';
import { ResourceBreadcrumbItem } from './ResourceBreadcrumbItem';
/**
 * The <ResourceBreadcrumbItems /> component allows to render a bunch of <BreadcrumbItem /> from a list of resources
 * By default (without the "resources" props), it'll render all the react-admin registred resources
 *
 * Also exported as `Breadcrumb.ResourceItems` for convenience.
 *
 * @see BreadcrumbItem
 */
export var ResourceBreadcrumbItems = function (_a) {
    var selectedResources = _a.resources, props = __rest(_a, ["resources"]);
    var resourceDefinitions = useResourceDefinitions();
    var hasDashboard = useHasDashboard(props);
    var resources = Object.values(resourceDefinitions)
        .filter(function (resource) {
        return !selectedResources || selectedResources.includes(resource.name);
    })
        .map(function (resource) { return resource.name; });
    if (hasDashboard) {
        return (React.createElement(DashboardBreadcrumbItem, null, resources.map(function (name) { return (React.createElement(ResourceBreadcrumbItem, { key: name, resource: name })); })));
    }
    return (React.createElement(React.Fragment, null, resources.map(function (name) { return (React.createElement(ResourceBreadcrumbItem, { key: name, resource: name })); })));
};
