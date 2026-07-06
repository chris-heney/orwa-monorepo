import * as React from 'react';
import { Form, FormProps } from 'react-admin';
import { LongFormSection } from './LongFormSection';
import { LongFormView, LongFormViewProps } from './LongFormView';

/**
 * Form layout for long forms.
 *
 * Renders a fixed table of contents and toolbar, as well as section headers.
 * Expects `<LongForm.Section>` as children, each having a label.
 *
 * @example
 * import { LongForm } from '@react-admin/ra-form-layout';
 *
 * const CustomerEdit = () => (
 *     <Edit component="div">
 *         <LongForm>
 *             <LongForm.Section label="Identity">
 *                 <Labeled label="id">
 *                     <TextField source="id" />
 *                 </Labeled>
 *                 <TextInput source="first_name" validate={required()} />
 *                 <TextInput source="last_name" validate={required()} />
 *                 <DateInput source="dob" label="born" validate={required()} />
 *                 <SelectInput source="sex" choices={sexChoices} />
 *             </LongForm.Section>
 *             <LongForm.Section label="Occupations">
 *                 <ArrayInput source="occupations" label="">
 *                     <SimpleFormIterator>
 *                         <TextInput source="name" validate={required()} />
 *                         <DateInput source="from" validate={required()} />
 *                         <DateInput source="to" />
 *                     </SimpleFormIterator>
 *                 </ArrayInput>
 *             </LongForm.Section>
 *             <LongForm.Section label="Preferences">
 *                 <SelectInput
 *                     source="language"
 *                     choices={languageChoices}
 *                     defaultValue="en"
 *                 />
 *                 <BooleanInput source="dark_theme" />
 *                 <BooleanInput source="accepts_emails_from_partners" />
 *             </LongForm.Section>
 *         </LongForm>
 *     </Edit>
 * );
 */
export const LongForm = (props: LongFormProps) => {
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
            <LongFormView {...rest} />
        </Form>
    );
};

export interface LongFormProps
    extends Omit<FormProps, 'children'>,
        LongFormViewProps {}

LongForm.Section = LongFormSection;
