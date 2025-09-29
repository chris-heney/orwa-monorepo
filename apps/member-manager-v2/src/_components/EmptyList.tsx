import React from 'react';
import { Box, Alert, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const EmptyList = ({
    onClick,
    title,
    buttonText,
}: {
    onClick: () => void;
    title: string;
    buttonText: string;
}) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                flexDirection: 'column',
                gap: 2,
                my: 2,
            }}
        >
            <Alert severity="info">
                {title}
            </Alert>
            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={onClick}
            >
                {buttonText}
                <AddIcon sx={{ ml: 1 }} />
            </Button>
        </Box>
    );
};

export default EmptyList;
