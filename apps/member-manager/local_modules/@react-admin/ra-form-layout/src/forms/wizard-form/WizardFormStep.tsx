import * as React from 'react';
import { ReactNode } from 'react';
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
export const WizardFormStep = (props: WizardFormStepProps) => {
    const { children, intent, label } = props;
    const translate = useTranslate();
    const context = useWizardFormStepContext(props);

    if (intent === 'label') {
        return <span>{translate(label, { _: label })}</span>;
    }

    return (
        <Root
            className={clsx(WizardFormStepClasses.root, {
                [WizardFormStepClasses.active]: context.active,
            })}
        >
            <legend>{translate(label, { _: label })}</legend>
            {children}
        </Root>
    );
};

export interface WizardFormStepProps {
    active?: boolean;
    children: ReactNode;
    intent?: 'step' | 'label';
    label: string;
}

const PREFIX = 'RaWizardFormStep';

export const WizardFormStepClasses = {
    root: `${PREFIX}-root`,
    active: `${PREFIX}-active`,
};

const Root = styled('fieldset', {
    name: PREFIX,
    overridesResolver: (props: any, styles) => styles.root,
})(() => ({
    display: 'none',
    margin: 0,
    padding: 0,
    border: 'none',
    '& legend': {
        display: 'none',
    },
    [`&.${WizardFormStepClasses.active}`]: {
        display: 'block',
    },
}));
