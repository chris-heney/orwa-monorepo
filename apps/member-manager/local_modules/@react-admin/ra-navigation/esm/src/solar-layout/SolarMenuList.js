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
import { List, styled } from '@mui/material';
import clsx from 'clsx';
import { genericForwardRef } from './genericForwardRef';
var SolarMenuListComponent = function (_a, ref) {
    var className = _a.className, _b = _a.component, component = _b === void 0 ? 'div' : _b, props = __rest(_a, ["className", "component"]);
    return (
    // FIXME: can't find a way to propagate the component prop type to a styled component
    // However it works and users that pass a custom component will have their ref correctly typed
    // @ts-ignore
    React.createElement(Root, __assign({ disablePadding: true, className: clsx(SolarMenuListClasses.root, className) }, props, { component: component, ref: ref })));
};
export var SolarMenuList = genericForwardRef(SolarMenuListComponent);
var PREFIX = 'RaSolarMenuList';
export var SolarMenuListClasses = {
    root: "".concat(PREFIX, "-root"),
};
var Root = styled(List, {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var theme = _a.theme;
    return ({
        gap: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 0,
        flexShrink: 0,
    });
});
