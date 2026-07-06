import * as React from 'react';
import { Form, FormProps } from 'react-admin';
import { AccordionFormView, AccordionFormViewProps } from './AccordionFormView';
import { AccordionFormPanel } from './AccordionFormPanel';

/**
 * Form component rendering a list of <Accordion> components.
 *
 * Alternative to <SimpleForm>, to be used as child of <Create> or <Edit>.
 * Expects <AccordionFormPanel> elements as children.
 *
 * @param {boolean} autoClose If true, opening an accordion will close the others. Defaults to false.
 * @param {ReactElement} toolbar An alternative toolbar element (to customize form buttons)
 *
 * @example
 *
 * import { Edit, TextField, TextInput, DateInput, SelectInput, ArrayInput, SimpleFormIterator, BooleanInput } from 'react-admin';
 * import { AccordionForm } from '@react-admin/ra-form-layout';
 *
 * // don't forget the component="div" prop on the main component to disable the main Card
 * const CustomerEdit = () => (
 *     <Edit component="div">
 *         <AccordionForm>
 *             <AccordionForm.Panel label="Identity" defaultExpanded>
 *                 <TextField source="id" />
 *                 <TextInput source="first_name" validate={required()} />
 *                 <TextInput source="last_name" validate={required()} />
 *                 <DateInput source="dob" label="born" validate={required()} />
 *                 <SelectInput source="sex" choices={sexChoices} />
 *             </AccordionForm.Panel>
 *             <AccordionForm.Panel label="Occupations">
 *                 <ArrayInput source="occupations" label="">
 *                     <SimpleFormIterator>
 *                         <TextInput source="name" validate={required()} />
 *                         <DateInput source="from" validate={required()} />
 *                         <DateInput source="to" />
 *                     </SimpleFormIterator>
 *                 </ArrayInput>
 *             </AccordionForm.Panel>
 *             <AccordionForm.Panel label="Preferences">
 *                 <SelectInput
 *                     source="language"
 *                     choices={languageChoices}
 *                     defaultValue="en"
 *                 />
 *                 <BooleanInput source="dark_theme" />
 *                 <BooleanInput source="accepts_emails_from_partners" />
 *             </AccordionForm.Panel>
 *         </AccordionForm>
 *     </Edit>
 * );
 */
export const AccordionForm = (props: AccordionFormProps) => {
    const {
        context,
        criteriaMode,
        defaultValues,
        delayError,
        formRootPathname,
        id,
        mode,
        noValidate,
        onSubmit,
        record,
        resetOptions,
        resolver,
        reValidateMode,
        shouldFocusError,
        shouldUnregister,
        shouldUseNativeValidation,
        validate,
        warnWhenUnsavedChanges,
        ...rest
    } = props;

    return (
        <Form
            context={context}
            criteriaMode={criteriaMode}
            defaultValues={defaultValues}
            delayError={delayError}
            formRootPathname={formRootPathname}
            id={id}
            mode={mode}
            noValidate={noValidate}
            onSubmit={onSubmit}
            record={record}
            resetOptions={resetOptions}
            resolver={resolver}
            reValidateMode={reValidateMode}
            shouldFocusError={shouldFocusError}
            shouldUnregister={shouldUnregister}
            shouldUseNativeValidation={shouldUseNativeValidation}
            validate={validate}
            warnWhenUnsavedChanges={warnWhenUnsavedChanges}
        >
            <AccordionFormView {...rest} />
        </Form>
    );
};

AccordionForm.Panel = AccordionFormPanel;

export interface AccordionFormProps
    extends Omit<FormProps, 'children'>,
        AccordionFormViewProps {
    autoClose?: boolean;
}
