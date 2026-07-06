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
import * as React from 'react';
import { useTranslate } from 'react-admin';
import { useFormState } from 'react-hook-form';
import { Button } from '@mui/material';
import { useWizardFormContext } from './useWizardFormContext';
export var PreviousButton = function (_a) {
    var alwaysEnable = _a.alwaysEnable, disabledProp = _a.disabled, rest = __rest(_a, ["alwaysEnable", "disabled"]);
    var translate = useTranslate();
    var isValidating = useFormState().isValidating;
    var _b = useWizardFormContext(), hasPreviousStep = _b.hasPreviousStep, goToPreviousStep = _b.goToPreviousStep;
    var disabled = valueOrDefault(alwaysEnable === false || alwaysEnable === undefined
        ? undefined
        : !alwaysEnable, disabledProp || isValidating);
    var label = translate('ra-form-layout.action.previous');
    var handleClick = function (event) {
        event.preventDefault();
        goToPreviousStep();
    };
    if (hasPreviousStep || alwaysEnable) {
        return (React.createElement(Button, __assign({ color: "primary", disabled: disabled, type: "button", "aria-label": label, onClick: handleClick }, rest), label));
    }
    return null;
};
var valueOrDefault = function (value, defaultValue) {
    return typeof value === 'undefined' ? defaultValue : value;
};
