import * as React from 'react';
import { ToolbarProps } from '@mui/material';
import { WizardFormContextValue } from './WizardFormContext';
/**
 * The Toolbar displayed at the bottom of WizardForm.
 *
 * @prop {boolean} hasPreviousStep Optional. Does the wizard have a previous step?
 * @prop {boolean} hasNextStep Optional. Does the wizard have a next step?
 * @prop {Function} onPreviousClick Optional. Previous button click action
 * @prop {Function} onNextClick Optional. Next button click action
 * @prop {...BaseToolbarSubmitProps}
 */
export declare const WizardToolbar: (props: WizardToolbarProps) => React.JSX.Element;
export interface WizardToolbarProps extends Omit<ToolbarProps, 'classes'>, Partial<WizardFormContextValue> {
}
//# sourceMappingURL=WizardToolbar.d.ts.map