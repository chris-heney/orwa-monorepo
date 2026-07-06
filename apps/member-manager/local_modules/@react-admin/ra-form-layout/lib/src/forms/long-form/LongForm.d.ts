import * as React from 'react';
import { FormProps } from 'react-admin';
import { LongFormViewProps } from './LongFormView';
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
export declare const LongForm: {
    (props: LongFormProps): React.JSX.Element;
    Section: React.ForwardRefExoticComponent<import("./LongFormSection").LongFormSectionProps & React.RefAttributes<HTMLElement>>;
};
export interface LongFormProps extends Omit<FormProps, 'children'>, LongFormViewProps {
}
//# sourceMappingURL=LongForm.d.ts.map