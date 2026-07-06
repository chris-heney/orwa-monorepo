import * as React from 'react';
import { EditableDatagridProps } from './EditableDatagrid';
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
export declare const EditableDatagridConfigurable: {
    ({ preferenceKey, omit, ...props }: Omit<EditableDatagridConfigurable, 'optimized'>): React.JSX.Element;
    propTypes: React.WeakValidationMap<EditableDatagridProps>;
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
//# sourceMappingURL=EditableDatagridConfigurable.d.ts.map