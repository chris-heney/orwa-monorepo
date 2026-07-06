import * as React from 'react';
import { ReactElement } from 'react';

import { useResourceDefinitions } from 'react-admin';
import { useHasDashboard } from '../app-location/useHasDashboard';
import { DashboardBreadcrumbItem } from './DashboardBreadcrumbItem';
import { ResourceBreadcrumbItem } from './ResourceBreadcrumbItem';

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
export const ResourceBreadcrumbItems = ({
    resources: selectedResources,
    ...props
}: ResourceBreadcrumbItemsProps): ReactElement => {
    const resourceDefinitions = useResourceDefinitions();
    const hasDashboard = useHasDashboard(props);

    const resources = Object.values(resourceDefinitions)
        .filter(
            resource =>
                !selectedResources || selectedResources.includes(resource.name)
        )
        .map(resource => resource.name);

    if (hasDashboard) {
        return (
            <DashboardBreadcrumbItem>
                {resources.map(name => (
                    <ResourceBreadcrumbItem key={name} resource={name} />
                ))}
            </DashboardBreadcrumbItem>
        );
    }

    return (
        <>
            {resources.map(name => (
                <ResourceBreadcrumbItem key={name} resource={name} />
            ))}
        </>
    );
};
