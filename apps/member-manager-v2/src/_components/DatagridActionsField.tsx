import { Tooltip } from '@mui/material';
import React from 'react';
import { DeleteButton } from 'react-admin';
import { EditButton } from 'react-admin';

const DatagridActionsField = ({
    hasEdit = false,
    hasDelete = true,
    children,
}: {
    hasEdit?: boolean;
    hasDelete?: boolean;
    children?: React.ReactNode;
}) => {
    return (
        <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
            {hasEdit && (
                <Tooltip title="Edit">
                    <EditButton
                        sx={{
                            px: 0,
                            minWidth: 0,
                        }}
                        size="small"
                        color="info"
                        label={''}
                    />
                </Tooltip>
            )}
            {children}
            {hasDelete && (
                <Tooltip title="Delete">
                    <DeleteButton
                        redirect={false}
                        sx={{
                            px: 0,
                            minWidth: 0,
                        }}
                        size="small"
                        label={''}
                    />
                </Tooltip>
            )}
        </div>
    );
};

export default DatagridActionsField;
