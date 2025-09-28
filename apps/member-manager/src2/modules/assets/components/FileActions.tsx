import { Box } from '@mui/material';
import {ShowButton, useRecordContext } from 'react-admin';
import { ConfirmDeleteButton } from './ConfirmDeleteButton';

export const FileActions = () => {
    const record = useRecordContext();

    if (!record) return null;

    return (
        <Box display="flex" gap={1}>
           <ShowButton size="small" color="primary" label="View" />
            <ConfirmDeleteButton size="small" />
        </Box>
    );
};