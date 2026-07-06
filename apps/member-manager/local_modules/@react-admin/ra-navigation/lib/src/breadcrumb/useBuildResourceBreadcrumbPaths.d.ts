import { ResourceDefinition } from 'react-admin';
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
export declare const useBuildResourceBreadcrumbPaths: () => (resource: ResourceDefinition) => {};
//# sourceMappingURL=useBuildResourceBreadcrumbPaths.d.ts.map