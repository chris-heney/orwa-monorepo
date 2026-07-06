import * as React from 'react';
import { RaRecord, usePreference } from 'react-admin';
import RowForm, { RowFormProps } from './RowForm';

/**
 * A version of `<RowForm>` that reflects the user preferences for the columns to display. It accepts the same props as the `<RowForm>` component.
 * Use it instead of `<RowForm>` in your `<EditableDatagrid>` if you want the inputs in the form to match the columns displayed in the datagrid.
 * @param props The component's props
 * @param props.preferenceKey The key to use to retrieve the user's preferences for this datagrid.
 */
export const RowFormConfigurable = <
    RecordType extends Omit<RaRecord, 'id'> = RaRecord
>(
    props: RowFormConfigurableProps<RecordType>
) => {
    const { children, ...rest } = props;
    const [availableColumns] = usePreference('availableColumns', []);
    const [omit] = usePreference('omit', []);
    const [columns] = usePreference(
        'columns',
        availableColumns
            .filter(column => !omit?.includes(column.source))
            .map(column => column.index)
    );
    const childrenArray = React.Children.toArray(children);
    return (
        <RowForm {...rest}>
            {columns === undefined
                ? children
                : columns.map(index => childrenArray[index])}
        </RowForm>
    );
};

export interface RowFormConfigurableProps<
    RecordType extends Omit<RaRecord, 'id'> = RaRecord
> extends RowFormProps<RecordType> {
    /**
     * Key to use to store the user's preferences for this datagrid.
     *
     * Set to '[resource].datagrid' by default. Pass a custom key if you need
     * to display more than one EditableDatagridConfigurable per resource.
     */
    preferenceKey?: string;
}
