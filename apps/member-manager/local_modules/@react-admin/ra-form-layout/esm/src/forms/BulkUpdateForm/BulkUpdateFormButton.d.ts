import { DialogProps } from '@mui/material';
import * as React from 'react';
import { BulkUpdateButtonProps, RaRecord, UpdateManyParams } from 'react-admin';
import { UseMutationOptions } from 'react-query';
/**
 * This component renders a button allowing to edit multiple records at once.
 *
 * The `<BulkUpdateFormButton>` can be used inside `<Datagrid>`'s `bulkActionButtons`.
 * It will render a button that opens a dialog containing the form passed as children.
 * When the form is submitted, it will call the dataProvider's `updateMany` method with the ids of the selected records.
 *
 * @example
 * ```tsx
 * import * as React from 'react';
 * import {
 *     Admin,
 *     BooleanField,
 *     BooleanInput,
 *     Datagrid,
 *     DateField,
 *     DateInput,
 *     List,
 *     Resource,
 *     SimpleForm,
 *     TextField,
 * } from 'react-admin';
 * import { BulkUpdateFormButton } from '@react-admin/ra-form-layout';
 *
 * import { dataProvider } from './dataProvider';
 * import { i18nProvider } from './i18nProvider';
 *
 * export const App = () => (
 *     <Admin dataProvider={dataProvider} i18nProvider={i18nProvider}>
 *         <Resource name="posts" list={PostList} />
 *     </Admin>
 * );
 *
 * const PostBulkUpdateButton = () => (
 *     <BulkUpdateFormButton>
 *         <SimpleForm>
 *             <DateInput source="published_at" />
 *             <BooleanInput source="is_public" />
 *         </SimpleForm>
 *     </BulkUpdateFormButton>
 * );
 *
 * const PostList = () => (
 *     <List>
 *         <Datagrid bulkActionButtons={<PostBulkUpdateButton />}>
 *             <TextField source="id" />
 *             <TextField source="title" />
 *             <DateField source="published_at" />
 *             <BooleanField source="is_public" />
 *         </Datagrid>
 *     </List>
 * );
 * ```
 */
export declare const BulkUpdateFormButton: (props: BulkUpdateFormButtonProps) => React.JSX.Element;
export interface BulkUpdateFormButtonProps<RecordType extends RaRecord = any, MutationOptionsError = unknown> extends Omit<BulkUpdateButtonProps, 'data' | 'children'> {
    children: React.ReactNode;
    DialogProps?: Partial<DialogProps>;
    mutationOptions?: UseMutationOptions<RecordType, MutationOptionsError, UpdateManyParams<RecordType>> & {
        meta?: any;
    };
}
export declare const BulkUpdateFormButtonClasses: {
    root: string;
};
//# sourceMappingURL=BulkUpdateFormButton.d.ts.map