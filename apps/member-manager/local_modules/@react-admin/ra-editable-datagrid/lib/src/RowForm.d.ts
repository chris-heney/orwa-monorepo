import * as React from 'react';
import { ReactNode } from 'react';
import { RaRecord, FormProps, UpdateParams, CreateParams, TransformData } from 'react-admin';
import { UseMutationOptions } from 'react-query';
/**
 * A form to be rendered as a table row in an <EditableDatagrid>.
 *
 * All the props it expects are injected by <EditableDatagrid>. You should only
 * provide children to be rendered in each table cell.
 *
 * The children should be Input components, just like in a <SimpleForm>. You
 * can also pass a <Field> component as child.
 *
 * <RowForm> should have as many children as the <EditableDatagrid> that calls
 * it, or there will be a colSpan issue.
 *
 * @example
 *
 *     const ArtistForm = () => (
 *         <RowForm>
 *             <TextField source="id" />
 *             <TextInput source="firstname" validate={required()} />
 *             <TextInput source="name" validate={required()} />
 *             <DateInput source="dob" label="born" validate={required()} />
 *             <SelectInput
 *                 source="prof"
 *                 label="Profession"
 *                 choices={professionChoices}
 *             />
 *         </RowForm>
 *     );
 *
 * @see EditableDatagrid
 */
declare const RowForm: <RecordType extends Omit<RaRecord<import("react-admin").Identifier>, "id"> = RaRecord<import("react-admin").Identifier>>(props: RowFormProps<RecordType>) => React.JSX.Element;
export interface RowFormProps<RecordType extends Omit<RaRecord, 'id'> = RaRecord> extends Omit<FormProps, 'render'> {
    children: ReactNode;
    className?: string;
    expand?: boolean;
    hasBulkActions?: boolean;
    id?: string;
    mutationOptions?: UseMutationOptions<RecordType, unknown, CreateParams<RecordType> | UpdateParams<RecordType & {
        id: RaRecord['id'];
    }>>;
    record?: RaRecord;
    resource?: string;
    save?: (data: Partial<RaRecord>) => void;
    saving?: boolean;
    selectable?: boolean;
    selected?: boolean;
    submitOnEnter?: boolean;
    transform?: TransformData;
}
export default RowForm;
//# sourceMappingURL=RowForm.d.ts.map