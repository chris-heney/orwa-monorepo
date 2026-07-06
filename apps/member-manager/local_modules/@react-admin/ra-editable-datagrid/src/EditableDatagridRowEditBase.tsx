import * as React from 'react';
import { SaveContextProvider } from 'react-admin';
import {
    EditableDatagridEditControllerProps,
    useEditableDatagridEditController,
} from './useEditableDatagridEditController';

/**
 * `EditableDatagridRowEditBase` is a base component for editable rows in a EditableDatagrid.
 * It provides basic functionality for editing a row
 *
 * @param {Object} props The properties passed to the component
 *
 * @returns {React.Component} Returns a React component.
 */
export const EditableDatagridRowEditBase = (
    props: EditableDatagridRowEditBaseProps
) => {
    const { children } = props;

    const controllerProps = useEditableDatagridEditController(props);

    return (
        <SaveContextProvider value={controllerProps}>
            {children}
        </SaveContextProvider>
    );
};

export interface EditableDatagridRowEditBaseProps
    extends EditableDatagridEditControllerProps {
    children: React.ReactNode;
}
