import { BreadcrumbPath } from './BreadcrumbItem';
export type BreadcrumbPathMap = {
    [key: string]: BreadcrumbPath;
};
/**
 * This hook is used internally to build a resource breadcrumb path map
 * The result is usually used by <ResourceBreadcrumbItems /> to render a BreadcrumbItem tree from current resources
 *
 * @see ResourceBreadcrumbItems
 */
export declare const useResourcesBreadcrumbPaths: (selectedResources?: string[]) => BreadcrumbPathMap;
//# sourceMappingURL=useResourcesBreadcrumbPaths.d.ts.map