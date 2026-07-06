import {
    RaRecord,
    ResourceDefinition,
    useCreatePath,
    useGetResourceLabel,
    useTranslate,
    useBasename,
} from 'react-admin';
import get from 'lodash/get';

/**
 * Internal hook that builds a map of paths from a resource definition
 *
 * The output map has the following form:
 * {
 *  songs: { label: 'Songs', to: '/songs' },
 *  songs.create: { label: 'Create Song', to: '/songs/create' },
 *  songs.show: {
 *    label: ({ record }) => `Show #${record.id}`,
 *    to: ({ record }) => `/${record.id}/show`
 *  }
 *  songs.edit: {
 *    label: ({ record }) => `Edit #${record.id}`,
 *    to: ({ record }) => `/${record.id}/edit`
 *  }
 * }
 */
export const useBuildResourceBreadcrumbPaths = () => {
    const getResourceLabel = useGetResourceLabel();
    const translate = useTranslate();
    const createPath = useCreatePath();
    const basename = useBasename();

    return (resource: ResourceDefinition) => {
        const resourcePaths = {};
        const resourceLabelPlural = getResourceLabel(resource.name, 2);
        const resourceLabelSingular = getResourceLabel(resource.name, 1);
        const { recordRepresentation } = resource;

        // We don't use react-admin's useGetRecordRepresentation here because
        // - we already have the resource definition at hand
        // - we only want to support the case where the record representation is a string, not a React element
        const getRecordRepresentation = (record: RaRecord) => {
            if (!record) return '';
            if (typeof recordRepresentation === 'function') {
                return recordRepresentation(record);
            }
            if (typeof recordRepresentation === 'string') {
                return get(record, recordRepresentation);
            }
            return `#${record.id}`;
        };

        resourcePaths[resource.name] = {
            label: resourceLabelPlural,
            to: `${basename}/${resource.name}`,
        };

        resourcePaths[`${resource.name}.create`] = {
            label: !resource.hasList
                ? translate('ra.page.create', {
                      name: resourceLabelSingular,
                  })
                : translate('ra.action.create'),
            to: createPath({
                resource: resource.name,
                type: 'create',
            }),
        };

        resourcePaths[`${resource.name}.edit`] = {
            label: ({ record }: { record: RaRecord }): string =>
                !record
                    ? translate('ra.action.edit')
                    : !resource.hasList
                    ? translate('ra.page.edit', {
                          name: resourceLabelSingular,
                          id: record.id,
                          record,
                          recordRepresentation: getRecordRepresentation(record),
                      })
                    : getRecordRepresentation(record),
            to: ({ record }): string =>
                record &&
                createPath({
                    resource: resource.name,
                    id: record.id,
                    type: 'edit',
                }),
        };

        resourcePaths[`${resource.name}.show`] = {
            label: ({ record }): string =>
                !record
                    ? translate('ra.action.show')
                    : !resource.hasList
                    ? translate('ra.page.show', {
                          name: resourceLabelSingular,
                          id: record.id,
                          record,
                          recordRepresentation: getRecordRepresentation(record),
                      })
                    : getRecordRepresentation(record),
            to: ({ record }): string =>
                record &&
                createPath({
                    resource: resource.name,
                    id: record.id,
                    type: 'show',
                }),
        };

        return resourcePaths;
    };
};
