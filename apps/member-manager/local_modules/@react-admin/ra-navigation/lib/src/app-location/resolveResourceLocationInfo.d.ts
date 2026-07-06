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
export declare const resolveResourceLocationInfo: (pathname: string, resources: ResourceDefinition[]) => ResourceLocationInfo | null;
export type ResourceLocationInfo = {
    type: 'show' | 'create' | 'edit' | 'list';
    resource: string;
    recordId?: Identifier;
};
//# sourceMappingURL=resolveResourceLocationInfo.d.ts.map