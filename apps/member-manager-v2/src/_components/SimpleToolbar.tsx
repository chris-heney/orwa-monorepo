import React from 'react';
import { SelectColumnsButton, CreateButton } from 'react-admin';
import { TopToolbar } from 'react-admin';
import Chip from '@mui/material/Chip';
import { Box, Typography } from '@mui/material';

const SimpleToolbar = ({
    title,
    hasCreateButton = true,
    children,
    hasRemoveSelectedIds = true,
    selectedIds,
    setSelectedIds,
}: {
    title?: string;
    hasCreateButton?: boolean;
    children?: React.ReactNode;
    hasRemoveSelectedIds?: boolean;
    selectedIds?: number[];
    setSelectedIds?: (ids: number[]) => void;
}) => {
    return (
        <TopToolbar
            sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
            }}
        >
            <Box>
                {title && (
                    <Typography
                        variant="h6"
                        sx={{ fontSize: '16px', fontWeight: 'bold' }}
                    >
                        {title}
                    </Typography>
                )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {hasRemoveSelectedIds &&
                    selectedIds &&
                    selectedIds.length > 0 && (
                        <Chip
                            label={`${selectedIds.length} ${
                                selectedIds.length === 1 ? 'Filter' : 'Filters'
                            }`}
                            variant="outlined"
                            color="primary"
                            onClick={() => setSelectedIds?.([])}
                            onDelete={() => setSelectedIds?.([])}
                        />
                    )}
                <SelectColumnsButton />
                {children}
                {hasCreateButton && <CreateButton/>}
            </Box>
        </TopToolbar>
    );
};

export default SimpleToolbar;
