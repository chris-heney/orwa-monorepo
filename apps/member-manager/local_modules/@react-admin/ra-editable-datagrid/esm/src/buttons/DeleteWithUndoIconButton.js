import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, Tooltip } from '@mui/material';
import ActionDelete from '@mui/icons-material/Delete';
import clsx from 'clsx';
import { useTranslate, useDeleteWithUndoController, useRecordContext, useResourceContext, } from 'react-admin';
export var DeleteWithUndoIconButton = function (props) {
    var className = props.className, _a = props.label, label = _a === void 0 ? 'ra.action.delete' : _a, _b = props.redirect, redirectTo = _b === void 0 ? 'list' : _b, mutationOptions = props.mutationOptions;
    var record = useRecordContext(props);
    var resource = useResourceContext(props);
    var _c = useDeleteWithUndoController({
        mutationOptions: mutationOptions,
        resource: resource,
        record: record,
        redirect: redirectTo,
    }), isLoading = _c.isLoading, handleDelete = _c.handleDelete;
    var translate = useTranslate();
    var translatedLabel = translate(label, { _: label });
    return (React.createElement(Tooltip, { title: translatedLabel },
        React.createElement(IconButton, { "aria-label": translatedLabel, disabled: isLoading, onClick: handleDelete, className: clsx('ra-delete-button', className), key: "button", size: "small" },
            React.createElement(ActionDelete, { color: "error" }))));
};
DeleteWithUndoIconButton.propTypes = {
    className: PropTypes.string,
    confirmTitle: PropTypes.string,
    confirmContent: PropTypes.string,
    label: PropTypes.string,
    mutationOptions: PropTypes.object,
    onClick: PropTypes.func,
    record: PropTypes.any,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    resource: PropTypes.string,
    icon: PropTypes.element,
};
