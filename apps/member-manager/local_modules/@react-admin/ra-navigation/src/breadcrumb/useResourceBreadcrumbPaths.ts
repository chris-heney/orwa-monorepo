import { useResourceDefinition } from 'react-admin';
import { BreadcrumbPathMap, useBuildResourceBreadcrumbPaths } from '.';

/**
 * This hook is used internally to build a resource breadcrumb path map
 * The result is usually used by <ResourceBreadcrumbItem /> to render a BreadcrumbItem tree for a given resource
 *
 * @see ResourceBreadcrumbItem
 */
export const useResourceBreadcrumbPaths = (
    resource: string
): BreadcrumbPathMap => {
    const resourceDefinition = useResourceDefinition({ resource });
    const buildResourceBreadcrumbPaths = useBuildResourceBreadcrumbPaths();

    return buildResourceBreadcrumbPaths({
        ...resourceDefinition,
        hasCreate: !!resourceDefinition.hasCreate,
        hasEdit: !!resourceDefinition.hasEdit,
        hasList: !!resourceDefinition.hasList,
        hasShow: !!resourceDefinition.hasShow,
    });
};
