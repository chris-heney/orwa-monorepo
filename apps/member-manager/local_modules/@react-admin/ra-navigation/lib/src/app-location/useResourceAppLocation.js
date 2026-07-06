"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useResourceAppLocation = void 0;
var react_admin_1 = require("react-admin");
var react_router_dom_1 = require("react-router-dom");
var resolveResourceLocationInfo_1 = require("./resolveResourceLocationInfo");
var buildResourceLocationInfoPath = function (_a) {
    var resource = _a.resource, type = _a.type;
    return "".concat(resource).concat(type === 'list' ? '' : ".".concat(type));
};
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
var useResourceAppLocation = function () {
    var pathname = (0, react_router_dom_1.useLocation)().pathname;
    var basename = (0, react_admin_1.useBasename)();
    var relativePath = pathname.replace(basename, '');
    var resources = (0, react_admin_1.useResourceDefinitions)();
    // Since this can be null at mount, don't memoize it
    var resourceLocationInfo = (0, resolveResourceLocationInfo_1.resolveResourceLocationInfo)(relativePath, Object.values(resources));
    var record = (0, react_admin_1.useGetOne)(resourceLocationInfo === null || resourceLocationInfo === void 0 ? void 0 : resourceLocationInfo.resource, {
        id: typeof (resourceLocationInfo === null || resourceLocationInfo === void 0 ? void 0 : resourceLocationInfo.recordId) === 'string'
            ? decodeURIComponent(resourceLocationInfo === null || resourceLocationInfo === void 0 ? void 0 : resourceLocationInfo.recordId)
            : resourceLocationInfo === null || resourceLocationInfo === void 0 ? void 0 : resourceLocationInfo.recordId,
    }, { enabled: !!(resourceLocationInfo === null || resourceLocationInfo === void 0 ? void 0 : resourceLocationInfo.recordId) }).data;
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
        values: { record: record },
    };
};
exports.useResourceAppLocation = useResourceAppLocation;
