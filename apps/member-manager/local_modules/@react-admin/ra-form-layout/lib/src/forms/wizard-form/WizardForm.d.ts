import * as React from 'react';
import { HtmlHTMLAttributes, ReactNode } from 'react';
import { FormProps } from 'react-admin';
/**
 * Form component rendering a wizard form with stepper
 *
 * Alternative to <SimpleForm>, to be used as child of <Create>.
 * Expects <WizardFormStep> elements as children.
 *
 * @param {ComponentType} toolbar An alternative toolbar element (to customize form buttons)
 * @param {ComponentType} progress An alternative progress bar element (to customize stepper)
 *
 * @example
 *
 * import React from 'react';
 * import { Create, TextInput, required } from 'react-admin';
 * import { WizardForm, WizardFormStep } from '@react-admin/ra-form-layout';
 *
 * const PostCreate = props => (
 *   <Create>
 *       <WizardForm>
 *           <WizardFormStep label="First step">
 *               <TextInput source="title" validate={required()} />
 *           </WizardFormStep>
 *           <WizardFormStep label="Second step">
 *               <TextInput source="description" />
 *           </WizardFormStep>
 *           <WizardFormStep label="Third step">
 *               <TextInput source="fullDescription" validate={required()} />
 *           </WizardFormStep>
 *       </WizardForm>
 *   </Create>
 * );
 */
export declare const WizardForm: {
    (props: WizardFormProps): React.JSX.Element;
    Step: (props: import("./WizardFormStep").WizardFormStepProps) => React.JSX.Element;
};
interface WizardFormViewProps extends Omit<HtmlHTMLAttributes<HTMLFormElement>, 'defaultValue' | 'children'> {
    children: ReactNode;
    progress?: ReactNode;
    toolbar?: ReactNode;
}
export interface WizardFormProps extends FormProps, Omit<WizardFormViewProps, 'onSubmit'> {
}
export {};
//# sourceMappingURL=WizardForm.d.ts.map