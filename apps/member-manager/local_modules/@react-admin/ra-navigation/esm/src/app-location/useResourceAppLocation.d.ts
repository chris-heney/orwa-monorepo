import { AppLocation } from './AppLocationContext';
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
export declare const useResourceAppLocation: () => AppLocation | null;
//# sourceMappingURL=useResourceAppLocation.d.ts.map