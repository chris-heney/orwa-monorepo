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
import { useResourceDefinitions } from 'react-admin';
import { useBuildResourceBreadcrumbPaths } from '.';
/**
 * This hook is used internally to build a resource breadcrumb path map
 * The result is usually used by <ResourceBreadcrumbItems /> to render a BreadcrumbItem tree from current resources
 *
 * @see ResourceBreadcrumbItems
 */
export var useResourcesBreadcrumbPaths = function (selectedResources) {
    var resources = useResourceDefinitions();
    var buildResourceBreadcrumbPaths = useBuildResourceBreadcrumbPaths();
    return Object.values(resources)
        .filter(function (resource) {
        return !selectedResources || selectedResources.includes(resource.name);
    })
        .map(function (resource) { return (__assign(__assign({}, resource), { hasCreate: !!resource.hasCreate, hasEdit: !!resource.hasEdit, hasList: !!resource.hasList, hasShow: !!resource.hasShow })); })
        .reduce(function (resourcesPaths, resource) { return (__assign(__assign({}, resourcesPaths), buildResourceBreadcrumbPaths(resource))); }, {});
};
