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
import DashboardIcon from '@mui/icons-material/Dashboard';
import { DASHBOARD, DASHBOARD_LABEL } from '../app-location';
import { SolarMenuItem } from './SolarMenuItem';
import { genericForwardRef } from './genericForwardRef';
var SolarMenuDashboardItemComponent = function (_a, ref) {
    var icon = _a.icon, props = __rest(_a, ["icon"]);
    return (
    // FIXME: can't find a way to propagate the component prop type
    // However it works and users that pass a custom component will have their ref correctly typed
    // @ts-ignore
    React.createElement(SolarMenuItem, __assign({ key: DASHBOARD, name: DASHBOARD, label: DASHBOARD_LABEL, icon: icon == null ? DefaultIcon : icon, to: "/", ref: ref }, props)));
};
var DefaultIcon = React.createElement(DashboardIcon, null);
export var SolarMenuDashboardItem = genericForwardRef(SolarMenuDashboardItemComponent);
