import * as React from 'react';
import { FieldsSelector, useSetInspectorTitle } from 'react-admin';

export const EditableDatagridEditor = () => {
    useSetInspectorTitle('ra.inspector.EditableDatagrid.title', {
        _: 'EditableDatagrid',
    });

    return <FieldsSelector name="columns" availableName="availableColumns" />;
};
