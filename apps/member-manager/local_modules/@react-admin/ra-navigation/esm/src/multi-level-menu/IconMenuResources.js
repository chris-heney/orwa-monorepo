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
import PropTypes from 'prop-types';
import inflection from 'inflection';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DefaultIcon from '@mui/icons-material/ViewList';
import { useResourceDefinitions, useTranslate } from 'react-admin';
import { IconMenu } from './IconMenu';
export var IconMenuResources = function (_a) {
    var hasDashboard = _a.hasDashboard, props = __rest(_a, ["hasDashboard"]);
    var translate = useTranslate();
    var resources = useResourceDefinitions();
    return (React.createElement(IconMenu, __assign({}, props),
        hasDashboard && (React.createElement(IconMenu.Item, { name: "dashboard", to: "/", end: true, label: "Dashboard", icon: React.createElement(DashboardIcon, null) })),
        Object.values(resources)
            .filter(function (r) { return r.hasList; })
            .map(function (resource) { return (React.createElement(IconMenu.Item, { key: resource.name, name: resource.name, to: "/".concat(resource.name), label: translatedResourceName(resource, translate), icon: resource.icon ? React.createElement(resource.icon, null) : React.createElement(DefaultIcon, null) })); })));
};
IconMenuResources.propTypes = {
    hasDashboard: PropTypes.bool,
};
var translatedResourceName = function (resource, translate) {
    return translate("resources.".concat(resource.name, ".name"), {
        smart_count: 2,
        _: resource.options && resource.options.label
            ? translate(resource.options.label, {
                smart_count: 2,
                _: resource.options.label,
            })
            : inflection.humanize(inflection.pluralize(resource.name)),
    });
};
