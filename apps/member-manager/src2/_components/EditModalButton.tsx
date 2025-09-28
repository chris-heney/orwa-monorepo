import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DatagridActionsField from './DatagridActionsField';
import { IconButton } from '@mui/material';

export const EditModalButton = ({
    setIsModalOpen,
    hasDelete = true,
}: {
    setIsModalOpen : () => void,
    hasDelete?: boolean,
}) => {
    return (
        <DatagridActionsField hasDelete={hasDelete}>
            <IconButton
                size="small"
                color="info"
                onClick={() => setIsModalOpen()}
            >
                <EditIcon fontSize="small" />
            </IconButton>
        </DatagridActionsField>
    );
};
