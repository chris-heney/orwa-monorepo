import * as React from 'react';
import { ReactNode } from 'react';
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
export declare const WizardFormStep: (props: WizardFormStepProps) => React.JSX.Element;
export interface WizardFormStepProps {
    active?: boolean;
    children: ReactNode;
    intent?: 'step' | 'label';
    label: string;
}
export declare const WizardFormStepClasses: {
    root: string;
    active: string;
};
//# sourceMappingURL=WizardFormStep.d.ts.map