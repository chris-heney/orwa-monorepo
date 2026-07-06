import * as React from 'react';
import { cloneElement } from 'react';
import { isElement } from 'react-is';
import { DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslate } from 'react-admin';
import { styled } from '@mui/material/styles';
export var FormDialogTitle = function (props) {
    var translate = useTranslate();
    var defaultTitle = props.defaultTitle, onClose = props.onClose, record = props.record, title = props.title;
    return (React.createElement(StyledDialogTitle, { id: "edit-dialog-title" },
        isElement(title)
            ? cloneElement(title, { record: record })
            : title
                ? translate(title, { _: title })
                : defaultTitle,
        React.createElement(IconButton, { "aria-label": translate('ra.action.close'), className: FormDialogTitleClasses.closeButton, onClick: onClose },
            React.createElement(CloseIcon, null))));
};
var PREFIX = 'RaFormDialogTitle';
export var FormDialogTitleClasses = {
    closeButton: "".concat(PREFIX, "-closeButton"),
};
var StyledDialogTitle = styled(DialogTitle, {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["& .".concat(FormDialogTitleClasses.closeButton)] = {
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
        },
        _b);
});
