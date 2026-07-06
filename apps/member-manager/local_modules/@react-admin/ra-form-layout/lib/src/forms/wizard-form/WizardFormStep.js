"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WizardFormStepClasses = exports.WizardFormStep = void 0;
var React = __importStar(require("react"));
var react_admin_1 = require("react-admin");
var clsx_1 = __importDefault(require("clsx"));
var styles_1 = require("@mui/material/styles");
var useWizardFormStepContext_1 = require("./useWizardFormStepContext");
/**
 * Renders children (Inputs) or a step label according to the passed `intent` prop thanks to the React Multipass pattern
 * @see https://marmelab.com/blog/2018/10/18/react-render-context-pattern.html
 *
 * To be used as child of an <WizardForm> element.
 *
 * @param {Record} record Optional.
 * @param {string} resource Optional.
 * @param {string} variant Optional.
 * @param {margin} margin Optional.
 * @param {intent} intent Optional. "step" for step inputs display or "label" for step label display
 * @param {string} label Optional. Label of the step (used inside the stepper)
 */
var WizardFormStep = function (props) {
    var _a;
    var children = props.children, intent = props.intent, label = props.label;
    var translate = (0, react_admin_1.useTranslate)();
    var context = (0, useWizardFormStepContext_1.useWizardFormStepContext)(props);
    if (intent === 'label') {
        return React.createElement("span", null, translate(label, { _: label }));
    }
    return (React.createElement(Root, { className: (0, clsx_1.default)(exports.WizardFormStepClasses.root, (_a = {},
            _a[exports.WizardFormStepClasses.active] = context.active,
            _a)) },
        React.createElement("legend", null, translate(label, { _: label })),
        children));
};
exports.WizardFormStep = WizardFormStep;
var PREFIX = 'RaWizardFormStep';
exports.WizardFormStepClasses = {
    root: "".concat(PREFIX, "-root"),
    active: "".concat(PREFIX, "-active"),
};
var Root = (0, styles_1.styled)('fieldset', {
    name: PREFIX,
    overridesResolver: function (props, styles) { return styles.root; },
})(function () {
    var _a;
    return (_a = {
            display: 'none',
            margin: 0,
            padding: 0,
            border: 'none',
            '& legend': {
                display: 'none',
            }
        },
        _a["&.".concat(exports.WizardFormStepClasses.active)] = {
            display: 'block',
        },
        _a);
});
