import * as React from 'react';
import { useTranslate } from 'react-admin';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { useWizardFormStepContext } from './useWizardFormStepContext';
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
export var WizardFormStep = function (props) {
    var _a;
    var children = props.children, intent = props.intent, label = props.label;
    var translate = useTranslate();
    var context = useWizardFormStepContext(props);
    if (intent === 'label') {
        return React.createElement("span", null, translate(label, { _: label }));
    }
    return (React.createElement(Root, { className: clsx(WizardFormStepClasses.root, (_a = {},
            _a[WizardFormStepClasses.active] = context.active,
            _a)) },
        React.createElement("legend", null, translate(label, { _: label })),
        children));
};
var PREFIX = 'RaWizardFormStep';
export var WizardFormStepClasses = {
    root: "".concat(PREFIX, "-root"),
    active: "".concat(PREFIX, "-active"),
};
var Root = styled('fieldset', {
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
        _a["&.".concat(WizardFormStepClasses.active)] = {
            display: 'block',
        },
        _a);
});
