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
import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { CreateBase, ExpandRowButton, useNotify, useRefresh, useResourceContext, } from 'react-admin';
import { useMatch } from 'react-router-dom';
import { Checkbox, TableCell, TableRow } from '@mui/material';
import { RowContext } from './RowContext';
var EditableDatagridCreateForm = function (props) {
    var expand = props.expand, hasBulkActions = props.hasBulkActions, createForm = props.createForm, hasStandaloneCreateForm = props.hasStandaloneCreateForm, isStandaloneCreateFormVisible = props.isStandaloneCreateFormVisible, closeStandaloneCreateForm = props.closeStandaloneCreateForm, _a = props.mutationOptions, mutationOptions = _a === void 0 ? {} : _a, transform = props.transform;
    var notify = useNotify();
    var refresh = useRefresh();
    var resource = useResourceContext(props);
    var match = useMatch("/".concat(resource, "/create/*"));
    var defaultOnSuccess = useCallback(function () {
        notify('ra.notification.created', {
            type: 'info',
            messageArgs: { smart_count: 1 },
        });
        refresh();
        closeStandaloneCreateForm();
    }, [closeStandaloneCreateForm, notify, refresh]);
    var defaultOnError = useCallback(function (error) {
        notify(typeof error === 'string'
            ? error
            : error.message || 'ra.notification.http_error', { type: 'warning' });
    }, [notify]);
    var createContext = useMemo(function () { return ({
        open: function () {
            /* */
        },
        close: closeStandaloneCreateForm,
    }); }, [closeStandaloneCreateForm]);
    var createFormElement = (React.createElement(RowContext.Provider, { value: createContext },
        React.createElement(CreateBase, { mutationOptions: __assign({ onSuccess: defaultOnSuccess, onError: defaultOnError }, mutationOptions), transform: transform, resource: resource },
            React.createElement(TableRow, { key: "create-record" },
                expand && (React.createElement(TableCell, { padding: "none" },
                    React.createElement(ExpandRowButton, { expanded: false, disabled: true }))),
                hasBulkActions && (React.createElement(TableCell, { padding: "checkbox" },
                    React.createElement(Checkbox, { color: "primary", disabled: true }))),
                createForm))));
    if (hasStandaloneCreateForm) {
        // create form triggered by state
        return isStandaloneCreateFormVisible && createFormElement;
    }
    else {
        // create form in a route
        return !!match ? createFormElement : null;
    }
};
EditableDatagridCreateForm.propTypes = {
    expand: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
    hasBulkActions: PropTypes.bool.isRequired,
    resource: PropTypes.string,
    createForm: PropTypes.element,
    hasStandaloneCreateForm: PropTypes.bool,
    isStandaloneCreateFormVisible: PropTypes.bool.isRequired,
    closeStandaloneCreateForm: PropTypes.func.isRequired,
};
export default EditableDatagridCreateForm;
