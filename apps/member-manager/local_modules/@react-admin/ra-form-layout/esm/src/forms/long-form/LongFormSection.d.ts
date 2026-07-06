import * as React from 'react';
import { ReactNode } from 'react';
import { SxProps } from '@mui/material';
export interface LongFormSectionProps {
    label: string;
    cardinality?: number;
    sx?: SxProps;
    children: ReactNode;
}
/**
 * Section of a form to be used as child of a `<LongForm>`.
 *
 * Renders a section title, then its children inside a MUI `<Stack>`,
 * and finally an MUI `<Divider>`.
 *
 * Requires a `label` prop and `children`.
 *
 * @example
 * import { TextInput } from 'react-admin';
 * import { LongFormSection } from '@react-admin/ra-form-layout';
 *
 * const IdentitySection = () => (
 *     <LongFormSection label="Identity">
 *         <TextInput source="first_name" />
 *     </LongFormSection>
 * );
 */
export declare const LongFormSection: React.ForwardRefExoticComponent<LongFormSectionProps & React.RefAttributes<HTMLElement>>;
export declare const RaLongFormSection: {
    stack: string;
};
//# sourceMappingURL=LongFormSection.d.ts.map