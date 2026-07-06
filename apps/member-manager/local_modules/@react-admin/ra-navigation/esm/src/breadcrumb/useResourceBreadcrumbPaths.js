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
import { useResourceDefinition } from 'react-admin';
import { useBuildResourceBreadcrumbPaths } from '.';
/**
 * This hook is used internally to build a resource breadcrumb path map
 * The result is usually used by <ResourceBreadcrumbItem /> to render a BreadcrumbItem tree for a given resource
 *
 * @see ResourceBreadcrumbItem
 */
export var useResourceBreadcrumbPaths = function (resource) {
    var resourceDefinition = useResourceDefinition({ resource: resource });
    var buildResourceBreadcrumbPaths = useBuildResourceBreadcrumbPaths();
    return buildResourceBreadcrumbPaths(__assign(__assign({}, resourceDefinition), { hasCreate: !!resourceDefinition.hasCreate, hasEdit: !!resourceDefinition.hasEdit, hasList: !!resourceDefinition.hasList, hasShow: !!resourceDefinition.hasShow }));
};
