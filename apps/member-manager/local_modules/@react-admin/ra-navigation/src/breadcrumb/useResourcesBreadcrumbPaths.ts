import { useResourceDefinitions } from 'react-admin';
import { useBuildResourceBreadcrumbPaths } from '.';
import { BreadcrumbPath } from './BreadcrumbItem';

export type BreadcrumbPathMap = { [key: string]: BreadcrumbPath };

/**
 * This hook is used internally to build a resource breadcrumb path map
 * The result is usually used by <ResourceBreadcrumbItems /> to render a BreadcrumbItem tree from current resources
 *
 * @see ResourceBreadcrumbItems
 */
export const useResourcesBreadcrumbPaths = (
    selectedResources?: string[]
): BreadcrumbPathMap => {
    const resources = useResourceDefinitions();
    const buildResourceBreadcrumbPaths = useBuildResourceBreadcrumbPaths();

    return Object.values(resources)
        .filter(
            resource =>
                !selectedResources || selectedResources.includes(resource.name)
        )
        .map(resource => ({
            ...resource,
            hasCreate: !!resource.hasCreate,
            hasEdit: !!resource.hasEdit,
            hasList: !!resource.hasList,
            hasShow: !!resource.hasShow,
        }))
        .reduce(
            (resourcesPaths, resource) => ({
                ...resourcesPaths,
                ...buildResourceBreadcrumbPaths(resource),
            }),
            {}
        );
};
