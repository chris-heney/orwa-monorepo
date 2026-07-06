var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import * as React from 'react';
import { Tabs } from '@mui/material';
import { useResourceDefinitions, useGetResourceLabel, useCreatePath, useTranslate, } from 'react-admin';
import { useAppLocationMatcher } from '../app-location';
import { useContainerLayout } from './ContainerLayoutContext';
import { HorizontalMenuItem } from './HorizontalMenuItem';
/**
 * A horizontal menu component, alternative to react-admin's `<Menu>`.
 * To be used in the AppBar of the `<ContainerLayout>`.
 *
 * @example
 * import { HorizontalMenu } from '@react-admin/ra-navigation';
 *
 * export const Menu = () => (
 *     <HorizontalMenu>
 *         <HorizontalMenu.Item label="Dashboard" to="/" value="" />
 *         <HorizontalMenu.Item label="Songs" to="/songs" value="songs" />
 *         <HorizontalMenu.Item label="Artists" to="/artists" value="artists" />
 *     </HorizontalMenu>
 * );
 */
export var HorizontalMenu = function (props) {
    var resources = useResourceDefinitions();
    var getResourceLabel = useGetResourceLabel();
    var hasDashboard = useContainerLayout(props).hasDashboard;
    var createPath = useCreatePath();
    var translate = useTranslate();
    var _a = props.children, children = _a === void 0 ? __spreadArray([
        hasDashboard ? (React.createElement(HorizontalMenuItem, { key: "dashboard", label: translate('ra.page.dashboard'), to: "/", value: "" })) : null
    ], Object.keys(resources)
        .filter(function (name) { return resources[name].hasList; })
        .map(function (name) { return (React.createElement(HorizontalMenuItem, { key: name, label: getResourceLabel(name, 2), to: createPath({
            resource: name,
            type: 'list',
        }), value: name, state: { _scrollToTop: true } })); }), true).filter(React.isValidElement) : _a, hasDashboardOverride = props.hasDashboard, rest = __rest(props, ["children", "hasDashboard"]);
    var match = useAppLocationMatcher();
    var paths = React.Children.map(children, function (child) { return child.props.value; });
    var currentPath = false, index = 0;
    while (!currentPath && index < paths.length) {
        var value = paths[index];
        if (match(value)) {
            currentPath = value;
        }
        index++;
    }
    return (React.createElement(Tabs, __assign({ value: currentPath, "aria-label": "Navigation Tabs", textColor: "inherit" }, rest), children));
};
HorizontalMenu.Item = HorizontalMenuItem;
