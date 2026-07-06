import { useContext, useMemo } from 'react';
import {
    EditableDatagridContext,
    EditableDatagridContextValue,
} from './EditableDatagridContext';

/**
 * A hook that returns the EditableDatagridContext.
 * This context provides access to some usefull functions for EditableDatagrid.
 * @param {Partial<EditableDatagridContextValue>} props Optional. Props to use instead of the values from the context.
 * @returns {EditableDatagridContextValue} The EditableDatagridContext.
 */
export const useEditableDatagridContext = (
    props?: Partial<EditableDatagridContextValue>
): EditableDatagridContextValue => {
    const context = useContext(EditableDatagridContext);

    if (context == null && props == null) {
        throw new Error(
            'useEditableDatagridContext must be used within a EditableDatagridContext.'
        );
    }

    const result = useMemo<EditableDatagridContextValue>(
        () => ({
            openStandaloneCreateForm:
                props?.openStandaloneCreateForm ??
                context?.openStandaloneCreateForm,
            closeStandaloneCreateForm:
                props?.closeStandaloneCreateForm ??
                context?.closeStandaloneCreateForm,
        }),
        [props, context]
    );

    return result;
};
