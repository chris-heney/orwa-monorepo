import React, { ReactNode, ReactElement } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { TableBody } from '@mui/material';
import {
    DatagridBodyProps,
    MutationMode,
    RecordContextProvider,
} from 'react-admin';

import EditableDatagridRow from './EditableDatagridRow';
import EditableDatagridCreateForm from './EditableDatagridCreateForm';
import { DatagridClasses } from './EditableDatagrid';

const EditableDatagridBody = ({
    children,
    className,
    data = [],
    expand,
    hasBulkActions = false,
    hover,
    onToggleItem,
    resource,
    rowClick,
    rowStyle,
    rowSx,
    selectedIds,
    isRowSelectable,
    editForm,
    createForm,
    hasStandaloneCreateForm = false,
    isStandaloneCreateFormVisible,
    closeStandaloneCreateForm,
    mutationMode,
    ...rest
}: EditableDatagridBodyProps) => {

    return (
        <TableBody
            className={clsx('datagrid-body', className, DatagridClasses.tbody)}
            {...rest}
        >
            {createForm && (
                <EditableDatagridCreateForm
                    closeStandaloneCreateForm={closeStandaloneCreateForm}
                    createForm={createForm}
                    expand={expand}
                    hasBulkActions={hasBulkActions}
                    hasStandaloneCreateForm={hasStandaloneCreateForm}
                    isStandaloneCreateFormVisible={
                        isStandaloneCreateFormVisible
                    }
                    resource={resource}
                />
            )}
            {data.map((record, rowIndex) => (
                <RecordContextProvider value={record} key={record.id}>
                    <EditableDatagridRow
                        className={clsx(DatagridClasses.row, {
                            [DatagridClasses.rowEven]: rowIndex % 2 === 0,
                            [DatagridClasses.rowOdd]: rowIndex % 2 !== 0,
                            [DatagridClasses.clickableRow]: rowClick,
                        })}
                        expand={expand}
                        form={editForm}
                        hasBulkActions={hasBulkActions}
                        hover={hover}
                        onToggleItem={onToggleItem}
                        resource={resource}
                        rowClick={rowClick}
                        selectable={!isRowSelectable || isRowSelectable(record)}
                        selected={selectedIds.includes(record.id)}
                        sx={rowSx?.(record, rowIndex)}
                        style={rowStyle ? rowStyle(record, rowIndex) : null}
                        key={record.id}
                        mutationMode={mutationMode}
                    >
                        {children}
                    </EditableDatagridRow>
                </RecordContextProvider>
            ))}
        </TableBody>
    );
};

export interface EditableDatagridBodyProps extends DatagridBodyProps {
    children?: ReactNode;
    editForm?: ReactElement;
    createForm?: ReactElement;
    mutationMode?: MutationMode;
    hasStandaloneCreateForm?: boolean;
    isStandaloneCreateFormVisible: boolean;
    closeStandaloneCreateForm: () => void;
}

EditableDatagridBody.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    data: PropTypes.arrayOf(PropTypes.any),
    expand: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
    hasBulkActions: PropTypes.bool,
    hover: PropTypes.bool,
    onToggleItem: PropTypes.func,
    resource: PropTypes.string,
    rowClick: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    rowStyle: PropTypes.func,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    isRowSelectable: PropTypes.func,
    version: PropTypes.number,
};

// trick material-ui Table into thinking this is one of the child type it supports
// @ts-ignore
EditableDatagridBody.muiName = 'TableBody';

export default EditableDatagridBody;
