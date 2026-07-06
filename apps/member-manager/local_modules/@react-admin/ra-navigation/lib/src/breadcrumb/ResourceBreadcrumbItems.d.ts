import { ReactElement } from 'react';
export type ResourceBreadcrumbItemsProps = {
    resources?: string[];
    hasDashboard?: boolean;
};
/**
 * The <ResourceBreadcrumbItems /> component allows to render a bunch of <BreadcrumbItem /> from a list of resources
 * By default (without the "resources" props), it'll render all the react-admin registred resources
 *
 * Also exported as `Breadcrumb.ResourceItems` for convenience.
 *
 * @see BreadcrumbItem
 */
export declare const ResourceBreadcrumbItems: ({ resources: selectedResources, ...props }: ResourceBreadcrumbItemsProps) => ReactElement;
//# sourceMappingURL=ResourceBreadcrumbItems.d.ts.map