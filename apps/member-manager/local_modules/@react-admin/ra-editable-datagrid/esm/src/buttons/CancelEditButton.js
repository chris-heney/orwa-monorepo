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
import React from 'react';
import { useTranslate } from 'react-admin';
import { Tooltip, IconButton } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { useRowContext } from '../useRowContext';
export var CancelEditButton = function (props) {
    var translate = useTranslate();
    var close = useRowContext().close;
    return (React.createElement(Tooltip, { title: translate('ra.action.cancel', {
            _: 'ra.action.cancel',
        }) },
        React.createElement(IconButton, __assign({ onClick: close, size: "small" }, props),
            React.createElement(CancelIcon, null))));
};
export default CancelEditButton;
