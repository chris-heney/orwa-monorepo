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
import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link, styled, Typography } from '@mui/material';
import { useAppLocationMatcher, DASHBOARD } from '../app-location';
import { useHasDashboard } from '../app-location/useHasDashboard';
import { useTranslate } from 'ra-core';
var resolveOrReturn = function (valueOrFunction, context) {
    return typeof valueOrFunction === 'function'
        ? valueOrFunction(context)
        : valueOrFunction;
};
/**
 * The <BreadcrumbItem /> is the component used to display the breadcrumb path inside <Breadcrumb />
 *
 * Also exported as `Breadcrumb.Item` for convenience.
 *
 * @param {string} name Required. The name of this item which will be used to infer its full path.
 * @param {string} path Internal prop used to build the item full path.
 * @param {function|string} label Required. The label to display for this item.
 * @param {function|string} to Optional. The react-router path to redirect to.
 * @param {boolean} hasDashboard Optional. A boolean indicating whether a dashboard is present. If it is, the dashboard item will be added in the breadcrumb on every pages. You shouldn't have to pass this prop unless you're wrapping the `<BreadcrumbItem>`
 *
 * @see Breadcrumb
 */
export var BreadcrumbItem = function (props) {
    var locationMatcher = useAppLocationMatcher();
    var hasDashboard = useHasDashboard(props);
    var translate = useTranslate();
    var to = props.to, name = props.name, path = props.path, label = props.label, children = props.children, hasDashboardOverride = props.hasDashboard, rest = __rest(props, ["to", "name", "path", "label", "children", "hasDashboard"]);
    var currentPath = name === DASHBOARD ? '' : "".concat(path ? "".concat(path, ".") : '').concat(name);
    var location = locationMatcher(currentPath);
    if (!location) {
        return null;
    }
    if (name === DASHBOARD && location.path === DASHBOARD) {
        return null;
    }
    var exactMatch = location.path === currentPath;
    var resolvedLabel = resolveOrReturn(label, location.values);
    var translatedLabel = translate(resolvedLabel, { _: resolvedLabel });
    var resolvedTo = resolveOrReturn(to, location.values);
    return (React.createElement(React.Fragment, null,
        React.createElement(Root, __assign({ key: name }, rest), resolvedTo && !exactMatch ? (React.createElement(Link, { variant: "body2", color: "inherit", component: RouterLink, to: resolvedTo }, translatedLabel)) : (React.createElement(Typography, { variant: "body2", color: "inherit", component: "span" }, translatedLabel))),
        React.Children.map(children, function (child) {
            return React.isValidElement(child)
                ? React.cloneElement(child, {
                    path: currentPath,
                    hasDashboard: hasDashboard,
                })
                : null;
        })));
};
var Root = styled('li', {
    name: 'RaBreadcrumbItem',
    overridesResolver: function (props, styles) { return styles.root; },
})({});
