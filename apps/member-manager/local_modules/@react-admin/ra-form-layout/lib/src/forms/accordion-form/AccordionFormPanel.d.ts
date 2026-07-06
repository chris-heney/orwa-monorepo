import * as React from 'react';
import { ReactNode } from 'react';
import { RaRecord } from 'react-admin';
/**
 * Renders children (Inputs) inside a MUI <Accordion> element.
 *
 * To be used as child of an <AccordionForm> element.
 *
 * @param {string} label The main label used as the accordion summary. Appears in red when the accordion has errors
 * @param {string} secondary Optional. The secondary label used as the accordion summary
 * @param {boolean} defaultExpanded Optional. Set to true to have the accordion expanded by default (except if autoClose = true on the parent)
 * @param {boolean} disabled Optional. If true, the accordion will be displayed in a disabled state.
 * @param {boolean} square Optional. If true, rounded corners are disabled.
 *
 * @example
 *
 * import { Edit, TextField, TextInput, DateInput, SelectInput, ArrayInput, SimpleFormIterator, BooleanInput } from 'react-admin';
 * import { AccordionForm, AccordionFormPanel } from '@react-admin/ra-form-layout';
 *
 * // don't forget the component="div" prop on the main component to disable the main Card
 * const CustomerEdit = () => (
 *     <Edit component="div">
 *         <AccordionForm>
 *             <AccordionFormPanel label="Identity" defaultExpanded>
 *                 <TextField source="id" />
 *                 <TextInput source="first_name" validate={required()} />
 *                 <TextInput source="last_name" validate={required()} />
 *                 <DateInput source="dob" label="born" validate={required()} />
 *                 <SelectInput source="sex" choices={sexChoices} />
 *             </AccordionFormPanel>
 *             <AccordionFormPanel label="Occupations">
 *                 <ArrayInput source="occupations" label="">
 *                     <SimpleFormIterator>
 *                         <TextInput source="name" validate={required()} />
 *                         <DateInput source="from" validate={required()} />
 *                         <DateInput source="to" />
 *                     </SimpleFormIterator>
 *                 </ArrayInput>
 *             </AccordionFormPanel>
 *             <AccordionFormPanel label="Preferences">
 *                 <SelectInput
 *                     source="language"
 *                     choices={languageChoices}
 *                     defaultValue="en"
 *                 />
 *                 <BooleanInput source="dark_theme" />
 *                 <BooleanInput source="accepts_emails_from_partners" />
 *             </AccordionFormPanel>
 *         </AccordionForm>
 *     </Edit>
 * );
 */
export declare const AccordionFormPanel: (props: AccordionFormPanelProps) => React.JSX.Element;
export interface AccordionFormPanelProps {
    children: ReactNode;
    defaultExpanded?: boolean;
    disabled?: boolean;
    label: string;
    secondary?: string;
    square?: boolean;
    autoClose?: boolean;
    onChange?: (event: React.ChangeEvent<unknown>, isExpanded: boolean) => void;
    record?: RaRecord;
    resource?: string;
    expanded?: boolean;
}
export declare const AccordionFormPanelClasses: {
    heading: string;
    secondaryHeading: string;
    detail: string;
};
//# sourceMappingURL=AccordionFormPanel.d.ts.map