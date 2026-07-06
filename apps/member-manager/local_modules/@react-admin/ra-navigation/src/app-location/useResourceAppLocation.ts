import { useResourceDefinitions, useBasename, useGetOne } from 'react-admin';
import { useLocation } from 'react-router-dom';

import { AppLocation } from './AppLocationContext';

import {
    ResourceLocationInfo,
    resolveResourceLocationInfo,
} from './resolveResourceLocationInfo';

const buildResourceLocationInfoPath = ({
    resource,
    type,
}: ResourceLocationInfo): string =>
    `${resource}${type === 'list' ? '' : `.${type}`}`;

/**
 * Deduces the app location based on the location path an resource names
 *
 * Returns an `AppLocation` only if the current routes matches a resource route
 * (eg: "/songs/1" for song edition, "/songs" for songs listing, etc.).
 * In other cases, it returns `null`.
 *
 * This hook can be useful to override some "native" routes.
 *
 * @example
 * import React, { useEffect } from 'react';
 *
 * import {
 *     AppLocationContext,
 *     useAppLocationState,
 *     useResourceAppLocation,
 * } from '@react-admin/ra-navigation';
 *
 * const SongsGrid = props => {
 *     const [, setLocation] = useAppLocationState();
 *     const resourceLocation = useResourceAppLocation();
 *
 *     useEffect(() => {
 *         const { artist_id: artistId } = props.filterValues;
 *         if (typeof artistId !== 'undefined') {
 *             // It'll change location and display "Filtered by artist X" in the breadcrumb
 *             setLocation('songs_by_artist.filter', { artistId });
 *         }
 *         return () => setLocation();
 *     }, [JSON.stringify({ resourceLocation, filters: props.filterValues })]);
 *
 *     return (
 *         <Datagrid {...props}>
 *             <TextField source="title" />
 *             <ReferenceField source="artist_id" reference="artists">
 *                 <TextField source="name" />
 *             </ReferenceField>
 *         </Datagrid>
 *     );
 * };
 *
 * const songFilter = [
 *     <ReferenceInput alwaysOn source="artist_id" reference="artists">
 *         <SelectInput optionText="name" />
 *     </ReferenceInput>,
 * ];
 *
 * const SongList = () => (
 *     <List filters={songFilter}>
 *         <SongsGrid />
 *     </List>
 * );
 */
export const useResourceAppLocation = (): AppLocation | null => {
    const { pathname } = useLocation();
    const basename = useBasename();
    const relativePath = pathname.replace(basename, '');
    const resources = useResourceDefinitions();

    // Since this can be null at mount, don't memoize it
    const resourceLocationInfo = resolveResourceLocationInfo(
        relativePath,
        Object.values(resources)
    );

    const { data: record } = useGetOne(
        resourceLocationInfo?.resource,
        {
            id:
                typeof resourceLocationInfo?.recordId === 'string'
                    ? decodeURIComponent(resourceLocationInfo?.recordId)
                    : resourceLocationInfo?.recordId,
        },
        { enabled: !!resourceLocationInfo?.recordId }
    );

    if (pathname === '/') {
        return {
            path: '',
            values: {},
        };
    }

    if (!resourceLocationInfo) {
        return null;
    }

    return {
        path: buildResourceLocationInfoPath(resourceLocationInfo),
        values: { record },
    };
};
