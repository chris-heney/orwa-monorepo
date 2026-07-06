import * as React from 'react';
import { SaveContextProvider } from 'react-admin';
import { useEditableDatagridEditController, } from './useEditableDatagridEditController';
/**
 * `EditableDatagridRowEditBase` is a base component for editable rows in a EditableDatagrid.
 * It provides basic functionality for editing a row
 *
 * @param {Object} props The properties passed to the component
 *
 * @returns {React.Component} Returns a React component.
 */
export var EditableDatagridRowEditBase = function (props) {
    var children = props.children;
    var controllerProps = useEditableDatagridEditController(props);
    return (React.createElement(SaveContextProvider, { value: controllerProps }, children));
};
