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
import { Tooltip, IconButton } from '@mui/material';
import ContentCreate from '@mui/icons-material/Create';
import { useTranslate } from 'react-admin';
import { useRowContext } from '../useRowContext';
export var EditRowButton = function (props) {
    var open = useRowContext().open;
    var translate = useTranslate();
    var _a = props.label, label = _a === void 0 ? 'ra.action.edit' : _a;
    var translatedLabel = translate(label, { _: 'Edit' });
    var handleClick = function (e) {
        e.stopPropagation();
        open();
    };
    return (React.createElement(Tooltip, { title: translatedLabel },
        React.createElement(IconButton, __assign({ onClick: handleClick, size: "small", color: "primary", "aria-label": translatedLabel }, props),
            React.createElement(ContentCreate, null))));
};
