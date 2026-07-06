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
import React, { useCallback, useMemo, useState } from 'react';
import { Button, useTranslate } from 'react-admin';
import { Tooltip, IconButton } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { FormDialogContext } from './FormDialogContext';
/**
 * Internal component which creates a dialog, along with a `<Button>` to open it.
 * This component is also responsible for managing the open/close state of the Dialog
 * (using an internal state, not the router).
 *
 * @param props.dialog A React Element containing the dialog
 * @param props.inline Optional - Set to true for an inline button, having only an icon and a tooltip
 * @param props.icon Optional - The icon associated to the button label
 * @param props.label Optional - The button label
 * @param props.ButtonProps Optional - An object containing props to pass to the MUI Button
 */
export var FormDialogButton = function (props) {
    var translate = useTranslate();
    var _a = useState(false), isOpen = _a[0], setIsOpen = _a[1];
    var open = useCallback(function () {
        setIsOpen(true);
    }, []);
    var close = useCallback(function () {
        setIsOpen(false);
    }, []);
    var contextValue = useMemo(function () { return ({
        isOpen: isOpen,
        open: open,
        close: close,
    }); }, [close, isOpen, open]);
    var _b = props.icon, icon = _b === void 0 ? defaultIcon : _b, _c = props.label, label = _c === void 0 ? '' : _c, inline = props.inline, dialog = props.dialog, ButtonProps = props.ButtonProps;
    var onClick = useCallback(function (e) {
        open();
        e.stopPropagation();
    }, [open]);
    var translatedLabel = translate(label, { _: label });
    var button = inline ? (React.createElement(Tooltip, { title: translatedLabel },
        React.createElement(IconButton, __assign({ "aria-label": translatedLabel, size: "small", color: "primary" }, ButtonProps, { onClick: onClick }), icon))) : (React.createElement(Button, __assign({ label: translatedLabel }, ButtonProps, { onClick: onClick }), icon));
    return (React.createElement(FormDialogContext.Provider, { value: contextValue },
        button,
        dialog));
};
var defaultIcon = React.createElement(OpenInNewIcon, null);
