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
import { Tooltip, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTranslate } from 'react-admin';
export var InlineCreateButton = function (props) {
    var translate = useTranslate();
    var label = translate('ra.action.create', { _: 'ra.action.create' });
    return (React.createElement(Tooltip, { title: label },
        React.createElement(IconButton, __assign({ "aria-label": label, size: "small", color: "primary" }, props),
            React.createElement(AddIcon, null),
            props.children)));
};
