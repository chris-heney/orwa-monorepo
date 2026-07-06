import * as React from 'react';
import { ReactElement } from 'react';

import { useResourceBreadcrumbPaths } from '.';
import { BreadcrumbItem } from './BreadcrumbItem';

export type ResourceBreadcrumbItemProps = {
    resource: string;
    path?: string;
};

/**
 * The <ResourceBreadcrumbItem /> component allows to render a <BreadcrumbItem /> for a given resource.
 *
 * Also exported as `Breadcrumb.ResourceItem` for convenience.
 *
 * @see BreadcrumbItem
 */
export const ResourceBreadcrumbItem = ({
    resource,
    path,
}: ResourceBreadcrumbItemProps): ReactElement => {
    const resourcesPaths = useResourceBreadcrumbPaths(resource);
    const listPath = resourcesPaths[resource];
    const childPaths = Object.keys(resourcesPaths)
        .filter(name => name !== resource)
        .reduce(
            (acc, name) => ({
                ...acc,
                [name.substring(resource.length + 1)]: resourcesPaths[name],
            }),
            {}
        );

    return (
        <BreadcrumbItem name={resource} path={path} {...listPath}>
            {Object.keys(childPaths).map(name => (
                <BreadcrumbItem
                    key={name}
                    name={name}
                    path={path ? `${path}.${resource}` : resource}
                    {...childPaths[name]}
                />
            ))}
        </BreadcrumbItem>
    );
};
