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
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Tooltip } from '@mui/material';
import ActionDelete from '@mui/icons-material/Delete';
import clsx from 'clsx';
import inflection from 'inflection';
import { Confirm, useDeleteWithConfirmController, useRecordContext, useResourceContext, useTranslate, } from 'react-admin';
export var DeleteWithConfirmIconButton = function (props) {
    var className = props.className, _a = props.confirmContent, confirmContent = _a === void 0 ? 'ra.message.delete_content' : _a, _b = props.confirmTitle, confirmTitle = _b === void 0 ? 'ra.message.delete_title' : _b, _c = props.label, label = _c === void 0 ? 'ra.action.delete' : _c, mutationMode = props.mutationMode, mutationOptions = props.mutationOptions, onClick = props.onClick, _d = props.redirect, redirectTo = _d === void 0 ? 'list' : _d, _e = props.translateOptions, translateOptions = _e === void 0 ? {} : _e;
    var record = useRecordContext(props);
    var resource = useResourceContext(props);
    var _f = useDeleteWithConfirmController({
        mutationMode: mutationMode,
        mutationOptions: mutationOptions,
        onClick: onClick,
        resource: resource,
        record: record,
        redirect: redirectTo,
    }), open = _f.open, isLoading = _f.isLoading, handleDialogOpen = _f.handleDialogOpen, handleDialogClose = _f.handleDialogClose, handleDelete = _f.handleDelete;
    var translate = useTranslate();
    var translatedLabel = translate(label, { _: label });
    return (React.createElement(Fragment, null,
        React.createElement(Tooltip, { title: translatedLabel },
            React.createElement(IconButton, { "aria-label": translatedLabel, onClick: handleDialogOpen, className: clsx('ra-delete-button', className), key: "button", size: "small" },
                React.createElement(ActionDelete, { color: "error" }))),
        React.createElement(Confirm, { isOpen: open, loading: isLoading, title: confirmTitle, content: confirmContent, translateOptions: __assign({ name: translate("resources.".concat(resource, ".forcedCaseName"), {
                    smart_count: 1,
                    _: inflection.humanize(translate("resources.".concat(resource, ".name"), {
                        smart_count: 1,
                        _: inflection.singularize(resource),
                    }), true),
                }), id: record === null || record === void 0 ? void 0 : record.id }, translateOptions), onConfirm: handleDelete, onClose: handleDialogClose })));
};
DeleteWithConfirmIconButton.propTypes = {
    className: PropTypes.string,
    confirmContent: PropTypes.string,
    confirmTitle: PropTypes.string,
    icon: PropTypes.element,
    label: PropTypes.string,
    mutationMode: PropTypes.oneOf(['pessimistic', 'optimistic', 'undoable']),
    mutationOptions: PropTypes.object,
    onClick: PropTypes.func,
    record: PropTypes.any,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    resource: PropTypes.string,
    submitOnEnter: PropTypes.bool,
    translateOptions: PropTypes.object,
};
