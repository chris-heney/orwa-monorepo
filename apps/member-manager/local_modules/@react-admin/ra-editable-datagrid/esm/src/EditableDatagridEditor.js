import * as React from 'react';
import { FieldsSelector, useSetInspectorTitle } from 'react-admin';
export var EditableDatagridEditor = function () {
    useSetInspectorTitle('ra.inspector.EditableDatagrid.title', {
        _: 'EditableDatagrid',
    });
    return React.createElement(FieldsSelector, { name: "columns", availableName: "availableColumns" });
};
