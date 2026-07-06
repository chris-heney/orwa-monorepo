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
import { styled } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import { CheckboxGroupInput } from 'react-admin';
export var InputSelector = function (props) {
    var className = props.className, inputs = props.inputs, _a = props.fullWidth, fullWidth = _a === void 0 ? true : _a, _b = props.helperText, helperText = _b === void 0 ? React.createElement(React.Fragment, null, "\u00A0") : _b, // to avoid visual jumps
    rest = __rest(props, ["className", "inputs", "fullWidth", "helperText"]);
    return (React.createElement(StyledCheckboxGroupInput, __assign({ choices: inputs.map(function (input) { return ({
            id: input,
            name: input,
        }); }), row: false, fullWidth: fullWidth, helperText: helperText, className: clsx(className, InputSelectorClasses.root) }, rest)));
};
var PREFIX = 'RaInputSelector';
export var InputSelectorClasses = {
    root: "".concat(PREFIX, "-root"),
};
var StyledCheckboxGroupInput = styled(CheckboxGroupInput, {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function (_a) {
    var theme = _a.theme;
    return ({
        '& .MuiFormGroup-root': {
            maxHeight: 'max(calc(100vh - 300px), 100px)',
            overflowY: 'auto',
            borderRadius: theme.shape.borderRadius,
            border: "1px solid ".concat(theme.palette.divider),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            flexWrap: 'nowrap',
        },
        '& .MuiFormControlLabel-root': {
            marginRight: theme.spacing(-1),
            '&:hover': {
                backgroundColor: theme.palette.action.hover,
                // Reset on touch devices, it doesn't add specificity
                '@media (hover: none)': {
                    backgroundColor: 'transparent',
                },
            },
        },
    });
});
