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
import * as React from 'react';
import { List, styled } from '@mui/material';
export var MenuItemList = function (props) { return (React.createElement(Root, __assign({ disablePadding: true }, props))); };
var Root = styled(List, {
    name: 'RaMenu',
    overridesResolver: function (props, styles) { return styles.root; },
})(function () { return ({
    display: 'flex',
    flexDirection: 'column',
}); });
