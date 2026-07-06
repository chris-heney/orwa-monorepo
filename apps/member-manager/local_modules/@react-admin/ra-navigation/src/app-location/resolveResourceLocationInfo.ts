import { Identifier, ResourceDefinition } from 'react-admin';

/**
 * Returns a ResourceLocationInfo object from a pathname and an array of resources metadatas
 *
 * @param {string} pathname Router's slash separated location
 * @param {Object[]} resources
 * @param {string} resources[].name Name of the resource (eg: songs)
 * @param {boolean} resources[].hasList Does the resource implement a list view?
 * @param {boolean} resources[].hasEdit Does the resource implement an edit view?
 * @param {boolean} resources[].hasCreate Does the resource implement a create view?
 * @param {boolean} resources[].hasShow Does the resource implement a show view?
 *
 * @returns {?ResourceLocationInfo} The resource location metadata or null
 */
export const resolveResourceLocationInfo = (
    pathname: string,
    resources: ResourceDefinition[]
): ResourceLocationInfo | null => {
    for (const resource of resources) {
        const { name } = resource;

        const createMatch = pathname.match(`^/${name}/create(/([^/]*))?$`);
        if (createMatch) {
            return { resource: name, type: 'create' };
        }

        const showMatch = pathname.match(`^/${name}/([^/]+)/show(/([^/]*))?$`);
        if (showMatch) {
            return { resource: name, type: 'show', recordId: showMatch[1] };
        }

        const editMatch = pathname.match(`^/${name}/([^/]+)(/([^/]*))?$`);
        if (editMatch) {
            return { resource: name, type: 'edit', recordId: editMatch[1] };
        }

        const listMatch = pathname.match(`^/${name}/?$`);
        if (listMatch) {
            return { resource: name, type: 'list' };
        }
    }

    return null;
};

export type ResourceLocationInfo = {
    type: 'show' | 'create' | 'edit' | 'list';
    resource: string;
    recordId?: Identifier;
};
