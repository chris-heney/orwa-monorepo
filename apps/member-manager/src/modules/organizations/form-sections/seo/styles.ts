import { alpha } from '@mui/material';

export const styles = {
    section: {
        mb: 4,
        p: 2,
        borderRadius: 2,
        border: '1px solid #e0e0e0',
    },
    sectionTitle: {
        display: 'flex',
        alignItems: 'center',
        mb: 2,
        pb: 1,
        borderBottom: '1px solid #f0f0f0',
    },
    icon: {
        color: 'primary.main',
        mr: 1,
    },
    highlight: {
        bgcolor: alpha('#2196f3', 0.08),
        p: 2,
        borderRadius: 1,
        borderLeft: '4px solid #2196f3',
        mb: 3,
    },
    inputWrapper: {
        mb: 3,
    },
    chipContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        mb: 2,
    },
    keywordChip: {
        m: 0.5,
        padding: '5px 10px',
        height: 'auto',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
            transform: 'scale(1.05)',
        },
    },
    cityChip: {
        m: 0.5,
        bgcolor: alpha('#4caf50', 0.1),
        borderColor: '#4caf50',
        color: '#2e7d32',
        '&:hover': {
            bgcolor: alpha('#4caf50', 0.2),
        },
    },
    analysisPaper: {
        p: 2,
        borderRadius: 1,
        bgcolor: alpha('#f5f5f5', 0.5),
        border: '1px solid #e0e0e0',
    },
    selectedChip: {
        backgroundColor: 'primary.main',
        color: 'white',
        '&:hover': {
            backgroundColor: 'primary.dark',
        },
    },
    selectedItems: {
        mt: 2,
        p: 2,
        borderRadius: 1,
        backgroundColor: alpha('#f5f5f5', 0.7),
        border: '1px solid #e0e0e0',
    },
    selectedItemRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 1,
        pb: 1,
        borderBottom: '1px dashed #e0e0e0',
        '&:last-child': {
            mb: 0,
            pb: 0,
            borderBottom: 'none',
        },
    },
    switch: {
        mt: 1,
        mb: 3,
    },
    toggleGroup: {
        display: 'flex',
        flexDirection: 'column',
        mb: 3,
    },
    ratingContainer: {
        display: 'flex',
        alignItems: 'center',
        mb: 2,
    },
};
