import * as React from 'react';
import {
    Configurable,
    useResourceContext,
    usePreference,
    useStore,
    useTranslate,
} from 'react-admin';
import EditableDatagrid, { EditableDatagridProps } from './EditableDatagrid';
import { EditableDatagridEditor } from './EditableDatagridEditor';

/**
 * An EditableDatagrid that users can customize in configuration mode
 *
 * @example
 * import { List, TextField } from 'react-admin';
 * import { EditableDatagridConfigurable } from '@react-admin/ra-editable-datagrid';
 *
 * export const PostList = () => (
 *     <List>
 *         <EditableDatagridConfigurable>
 *             <TextField source="id" />
 *             <TextField source="title" />
 *             <TextField source="author" />
 *             <TextField source="year" />
 *         </EditableDatagridConfigurable>
 *     </List>
 * );
 */
export const EditableDatagridConfigurable = ({
    preferenceKey,
    omit,
    ...props
}: Omit<EditableDatagridConfigurable, 'optimized'>) => {
    // For JS users
    if (props['optimized']) {
        throw new Error(
            'EditableDatagridConfigurable does not support the optimized prop'
        );
    }

    const translate = useTranslate();
    const resource = useResourceContext(props);
    const finalPreferenceKey = preferenceKey || `${resource}.datagrid`;

    const [availableColumns, setAvailableColumns] = useStore<
        ConfigurableDatagridColumn[]
    >(`preferences.${finalPreferenceKey}.availableColumns`, []);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setOmit] = useStore<string[]>(
        `preferences.${finalPreferenceKey}.omit`,
        omit
    );

    React.useEffect(() => {
        // first render, or the preference have been cleared
        const columns = React.Children.toArray(props.children)
            .filter(child => React.isValidElement(child))
            .map((child: React.ReactElement, index) => ({
                index: String(index),
                source: child.props.source,
                label:
                    child.props.label && typeof child.props.label === 'string' // this list is serializable, so we can't store ReactElement in it
                        ? child.props.label
                        : child.props.source
                        ? //  force the label to be the source
                          undefined
                        : // no source or label, generate a label
                          translate('ra.configurable.Datagrid.unlabeled', {
                              column: index,
                              _: `Unlabeled column #%{column}`,
                          }),
            }));
        if (columns.length !== availableColumns.length) {
            setAvailableColumns(columns);
            setOmit(omit);
        }
    }, [availableColumns]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Configurable
            editor={<EditableDatagridEditor />}
            preferenceKey={finalPreferenceKey}
            sx={{ display: 'block', minHeight: 2 }}
        >
            <EditableDatagridWithPreferences {...props} />
        </Configurable>
    );
};

export interface EditableDatagridConfigurable extends EditableDatagridProps {
    /**
     * Key to use to store the user's preferences for this datagrid.
     *
     * Set to '[resource].datagrid' by default. Pass a custom key if you need
     * to display more than one EditableDatagridConfigurable per resource.
     */
    preferenceKey?: string;
    /**
     * columns to hide by default
     *
     * @example
     * // by default, hide the id and author columns
     * // users can choose to show show them in configuration mode
     * const PostList = () => (
     *     <List>
     *         <EditableDatagridConfigurable omit={['id', 'author']}>
     *             <TextField source="id" />
     *             <TextField source="title" />
     *             <TextField source="author" />
     *             <TextField source="year" />
     *         </EditableDatagridConfigurable>
     *     </List>
     * );
     */
    omit?: string[];
}

export interface ConfigurableDatagridColumn {
    index: string;
    source?: string;
    label?: string;
}

EditableDatagridConfigurable.propTypes = EditableDatagrid.propTypes;

/**
 * This EditableDatagrid filters its children depending on preferences
 */
const EditableDatagridWithPreferences = ({
    children,
    ...props
}: EditableDatagridProps) => {
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
        <EditableDatagrid {...props}>
            {columns === undefined
                ? children
                : columns.map(index => childrenArray[index])}
        </EditableDatagrid>
    );
};
