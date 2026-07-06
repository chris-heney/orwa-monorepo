import React from 'react';
import { WizardFormProps } from '../wizard-form';
/**
 * This component renders a form allowing to select the fields to update in a record.
 *
 * `<InputSelectorForm>` expects a list of inputs passed in the `inputs` prop. Each input must have a `label` and an `element`.
 *
 * `<InputSelectorForm>` also expects to be used inside a [`<SaveContext>`](https://marmelab.com/react-admin/useSaveContext.html#usage).
 * When the form is submitted, it will call the `save` method from the `<SaveContext>`, with the value of the selected inputs.
 *
 * @example
 * ```tsx
 * import { InputSelectorForm } from '@react-admin/ra-form-layout';
 * import * as React from 'react';
 * import {
 *     BooleanInput,
 *     DateInput,
 *     SelectArrayInput,
 *     TextInput,
 * } from 'react-admin';
 *
 * const PostEdit = () => (
 *     <InputSelectorForm
 *         inputs={[
 *             {
 *                 label: 'Title',
 *                 element: <TextInput source="title" />,
 *             },
 *             {
 *                 label: 'Body',
 *                 element: <TextInput source="body" multiline />,
 *             },
 *             {
 *                 label: 'Published at',
 *                 element: <DateInput source="published_at" />,
 *             },
 *             {
 *                 label: 'Is public',
 *                 element: <BooleanInput source="is_public" />,
 *             },
 *             {
 *                 label: 'Tags',
 *                 element: (
 *                     <SelectArrayInput
 *                         source="tags"
 *                         choices={[
 *                             { id: 'react', name: 'React' },
 *                             { id: 'vue', name: 'Vue' },
 *                             { id: 'solid', name: 'Solid' },
 *                             { id: 'programming', name: 'Programming' },
 *                         ]}
 *                     />
 *                 ),
 *             },
 *         ]}
 *     />
 * );
 * ```
 */
export declare const InputSelectorForm: (props: InputSelectorFormProps) => React.JSX.Element;
export interface InputSelectorFormProps extends Omit<WizardFormProps, 'onSubmit' | 'children'> {
    inputs: InputOption[];
}
export interface InputOption {
    label: string;
    element: React.ReactNode;
}
export declare const inputSelectorFormInputs = "@@ra-form-layout-input-selector-form-inputs";
//# sourceMappingURL=InputSelectorForm.d.ts.map