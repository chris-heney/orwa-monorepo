import * as React from 'react';
import { TypographyProps } from '@mui/material';
/**
 * A component that enables autosaving of the form and displays the last save date.
 *
 * @param interval The interval in milliseconds between two autosaves. Defaults to 5000 (5s).
 * @param confirmationDuration The delay in milliseconds before save confirmation message disappears. Defaults to 3000 (3s).
 * @param typographyProps Additional props to pass to the `<Typography>` component that displays the last save time.
 *
 * @example
 * import { AutoSave } from '@react-admin/ra-form-layout';
 * import { Edit, SaveButton, SimpleForm, TextInput, Toolbar } from 'react-admin';
 *
 * const AutoSaveToolbar = () => (
 *    <Toolbar>
 *       <SaveButton />
 *       <AutoSave />
 *   </Toolbar>
 * );
 *
 * const PostEdit = () => (
 *     <Edit mutationMode="optimistic">
 *         <SimpleForm toolbar={AutoSaveToolbar} resetOptions={{ keepDirtyValues: true }}>
 *             <TextInput source="title" />
 *             <TextInput source="teaser" />
 *         </SimpleForm>
 *     </Edit>
 * );
 */
export declare const AutoSave: ({ debounce, confirmationDuration, typographyProps, }: AutoSaveProps) => React.JSX.Element;
export interface AutoSaveProps {
    debounce?: number;
    confirmationDuration?: number | false;
    typographyProps?: TypographyProps;
}
export declare const AutoSaveClasses: {
    error: string;
};
//# sourceMappingURL=AutoSave.d.ts.map