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
import React from 'react';
import ContentCreate from '@mui/icons-material/Create';
import { FormDialogButton } from './FormDialogButton';
import { EditDialog } from './EditDialog';
/**
 * A component which creates a `<EditDialog>`, along with a `<Button>` to open it.
 * This component is also responsible for managing the open/close state of the Dialog
 * (using an internal state, not the router).
 *
 * @example
 * const editButton = (
 *  <EditInDialogButton fullWidth maxWidth="md">
 *      <SimpleForm>
 *          <TextInput source="first_name" validate={required()} fullWidth />
 *      </SimpleForm>
 *  </EditInDialogButton>
 * );
 */
export var EditInDialogButton = function (props) {
    var inline = props.inline, _a = props.icon, icon = _a === void 0 ? defaultIcon : _a, _b = props.label, label = _b === void 0 ? 'ra.action.edit' : _b, ButtonProps = props.ButtonProps, editDialogProps = __rest(props, ["inline", "icon", "label", "ButtonProps"]);
    var editDialog = React.createElement(EditDialog, __assign({}, editDialogProps));
    return (React.createElement(FormDialogButton, { icon: icon, label: label, dialog: editDialog, inline: inline, ButtonProps: ButtonProps }));
};
var defaultIcon = React.createElement(ContentCreate, null);
