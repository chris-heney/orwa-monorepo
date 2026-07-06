import { useCreatePath, useGetResourceLabel, useTranslate, useBasename, } from 'react-admin';
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
export var useBuildResourceBreadcrumbPaths = function () {
    var getResourceLabel = useGetResourceLabel();
    var translate = useTranslate();
    var createPath = useCreatePath();
    var basename = useBasename();
    return function (resource) {
        var resourcePaths = {};
        var resourceLabelPlural = getResourceLabel(resource.name, 2);
        var resourceLabelSingular = getResourceLabel(resource.name, 1);
        var recordRepresentation = resource.recordRepresentation;
        // We don't use react-admin's useGetRecordRepresentation here because
        // - we already have the resource definition at hand
        // - we only want to support the case where the record representation is a string, not a React element
        var getRecordRepresentation = function (record) {
            if (!record)
                return '';
            if (typeof recordRepresentation === 'function') {
                return recordRepresentation(record);
            }
            if (typeof recordRepresentation === 'string') {
                return get(record, recordRepresentation);
            }
            return "#".concat(record.id);
        };
        resourcePaths[resource.name] = {
            label: resourceLabelPlural,
            to: "".concat(basename, "/").concat(resource.name),
        };
        resourcePaths["".concat(resource.name, ".create")] = {
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
        resourcePaths["".concat(resource.name, ".edit")] = {
            label: function (_a) {
                var record = _a.record;
                return !record
                    ? translate('ra.action.edit')
                    : !resource.hasList
                        ? translate('ra.page.edit', {
                            name: resourceLabelSingular,
                            id: record.id,
                            record: record,
                            recordRepresentation: getRecordRepresentation(record),
                        })
                        : getRecordRepresentation(record);
            },
            to: function (_a) {
                var record = _a.record;
                return record &&
                    createPath({
                        resource: resource.name,
                        id: record.id,
                        type: 'edit',
                    });
            },
        };
        resourcePaths["".concat(resource.name, ".show")] = {
            label: function (_a) {
                var record = _a.record;
                return !record
                    ? translate('ra.action.show')
                    : !resource.hasList
                        ? translate('ra.page.show', {
                            name: resourceLabelSingular,
                            id: record.id,
                            record: record,
                            recordRepresentation: getRecordRepresentation(record),
                        })
                        : getRecordRepresentation(record);
            },
            to: function (_a) {
                var record = _a.record;
                return record &&
                    createPath({
                        resource: resource.name,
                        id: record.id,
                        type: 'show',
                    });
            },
        };
        return resourcePaths;
    };
};
