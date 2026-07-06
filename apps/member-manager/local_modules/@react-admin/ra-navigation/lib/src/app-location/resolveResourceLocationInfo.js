"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveResourceLocationInfo = void 0;
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
var resolveResourceLocationInfo = function (pathname, resources) {
    for (var _i = 0, resources_1 = resources; _i < resources_1.length; _i++) {
        var resource = resources_1[_i];
        var name_1 = resource.name;
        var createMatch = pathname.match("^/".concat(name_1, "/create(/([^/]*))?$"));
        if (createMatch) {
            return { resource: name_1, type: 'create' };
        }
        var showMatch = pathname.match("^/".concat(name_1, "/([^/]+)/show(/([^/]*))?$"));
        if (showMatch) {
            return { resource: name_1, type: 'show', recordId: showMatch[1] };
        }
        var editMatch = pathname.match("^/".concat(name_1, "/([^/]+)(/([^/]*))?$"));
        if (editMatch) {
            return { resource: name_1, type: 'edit', recordId: editMatch[1] };
        }
        var listMatch = pathname.match("^/".concat(name_1, "/?$"));
        if (listMatch) {
            return { resource: name_1, type: 'list' };
        }
    }
    return null;
};
exports.resolveResourceLocationInfo = resolveResourceLocationInfo;
