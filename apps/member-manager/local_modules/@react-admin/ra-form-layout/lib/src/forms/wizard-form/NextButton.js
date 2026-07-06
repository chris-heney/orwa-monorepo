"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NextButton = void 0;
var React = __importStar(require("react"));
var react_admin_1 = require("react-admin");
var react_hook_form_1 = require("react-hook-form");
var material_1 = require("@mui/material");
var useWizardFormContext_1 = require("./useWizardFormContext");
var NextButton = function (_a) {
    var alwaysEnable = _a.alwaysEnable, disabledProp = _a.disabled, rest = __rest(_a, ["alwaysEnable", "disabled"]);
    var translate = (0, react_admin_1.useTranslate)();
    var isValidating = (0, react_hook_form_1.useFormState)().isValidating;
    var _b = (0, useWizardFormContext_1.useWizardFormContext)(), currentStep = _b.currentStep, hasNextStep = _b.hasNextStep, goToNextStep = _b.goToNextStep;
    var isValid = (0, react_admin_1.useFormGroup)("step-".concat(currentStep)).isValid;
    var disabled = valueOrDefault(alwaysEnable === false || alwaysEnable === undefined
        ? undefined
        : !alwaysEnable, disabledProp || isValidating || !isValid);
    var label = translate('ra-form-layout.action.next');
    var handleClick = function (event) {
        event.preventDefault();
        goToNextStep();
    };
    if (hasNextStep || alwaysEnable) {
        return (React.createElement(material_1.Button, __assign({ variant: "contained", color: "primary", disabled: disabled, type: "submit", "aria-label": label, onClick: handleClick }, rest), label));
    }
    return null;
};
exports.NextButton = NextButton;
var valueOrDefault = function (value, defaultValue) {
    return typeof value === 'undefined' ? defaultValue : value;
};
