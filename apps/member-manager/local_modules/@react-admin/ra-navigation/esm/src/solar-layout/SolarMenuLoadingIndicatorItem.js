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
import { useCallback } from 'react';
import { useLoading, useRefresh } from 'react-admin';
import { CircularProgress, styled } from '@mui/material';
import clsx from 'clsx';
import NavigationRefresh from '@mui/icons-material/Refresh';
import { genericForwardRef } from './genericForwardRef';
import { SolarMenuItem } from './SolarMenuItem';
var SolarMenuLoadingIndicatorItemComponent = function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    var loading = useLoading();
    var refresh = useRefresh();
    var handleClick = useCallback(function (event) {
        event.preventDefault();
        refresh();
    }, [refresh]);
    return (
    // FIXME: can't find a way to propagate the component prop type
    // However it works and users that pass a custom component will have their ref correctly typed
    // @ts-ignore
    React.createElement(Root, __assign({ name: "loading", className: clsx(SolarMenuLoadingIndicatorItemClasses.root, className), icon: loading ? (React.createElement(CircularProgress, { className: SolarMenuLoadingIndicatorItemClasses.progress, size: 16, thickness: 6 })) : (React.createElement(NavigationRefresh, { className: SolarMenuLoadingIndicatorItemClasses.icon })), label: loading ? 'ra.page.loading' : 'ra.action.refresh', onClick: handleClick, 
        // @ts-ignore
        ref: ref }, props)));
};
export var SolarMenuLoadingIndicatorItem = genericForwardRef(SolarMenuLoadingIndicatorItemComponent);
var PREFIX = 'RaSolarMenuLoadingIndicatorItem';
export var SolarMenuLoadingIndicatorItemClasses = {
    root: "".concat(PREFIX, "-root"),
    icon: "".concat(PREFIX, "-icon"),
    progress: "".concat(PREFIX, "-progress"),
};
// @ts-ignore
var Root = styled(SolarMenuItem)(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["& .".concat(SolarMenuLoadingIndicatorItemClasses.progress)] = {
            margin: theme.spacing(0.5),
        },
        _b);
});
