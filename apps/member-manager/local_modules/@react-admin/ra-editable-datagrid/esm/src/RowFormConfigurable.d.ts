import * as React from 'react';
import { RaRecord } from 'react-admin';
import { RowFormProps } from './RowForm';
/**
 * A version of `<RowForm>` that reflects the user preferences for the columns to display. It accepts the same props as the `<RowForm>` component.
 * Use it instead of `<RowForm>` in your `<EditableDatagrid>` if you want the inputs in the form to match the columns displayed in the datagrid.
 * @param props The component's props
 * @param props.preferenceKey The key to use to retrieve the user's preferences for this datagrid.
 */
export declare const RowFormConfigurable: <RecordType extends Omit<RaRecord<import("react-admin").Identifier>, "id"> = RaRecord<import("react-admin").Identifier>>(props: RowFormConfigurableProps<RecordType>) => React.JSX.Element;
export interface RowFormConfigurableProps<RecordType extends Omit<RaRecord, 'id'> = RaRecord> extends RowFormProps<RecordType> {
    /**
     * Key to use to store the user's preferences for this datagrid.
     *
     * Set to '[resource].datagrid' by default. Pass a custom key if you need
     * to display more than one EditableDatagridConfigurable per resource.
     */
    preferenceKey?: string;
}
//# sourceMappingURL=RowFormConfigurable.d.ts.map