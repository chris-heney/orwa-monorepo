import { alpha } from '@mui/material';

export const styles = {
    section: {
        mb: 2,
        p: 2,
        height: '100%',
        borderRadius: 2,
        bgcolor: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }
    },
    sectionTitle: {
        display: 'flex',
        alignItems: 'center',
        mb: 1.5,
        pb: 1,
        borderBottom: '1px solid #f0f0f0'
    },
    icon: {
        color: 'primary.main',
        mr: 1
    },
    inputWrapper: {
        mb: 2
    },
    highlight: {
        bgcolor: alpha('#2196f3', 0.08),
        p: 2,
        borderRadius: 1,
        borderLeft: '4px solid #2196f3',
        mb: 3
    },
    platformCard: {
        mb: 2,
        p: 2,
        borderRadius: 2,
        border: '1px solid #f0f0f0'
    },
    platformIcon: {
        mr: 1,
        fontSize: '1.5rem'
    },
    platformInput: {
        display: 'flex',
        alignItems: 'center',
        mb: 2
    },
    socialChip: {
        m: 0.5,
        pl: 0.5,
        '& .MuiChip-icon': {
            ml: 0.5
        }
    },
    selectedChip: {
        backgroundColor: 'primary.main',
        color: 'white',
        '&:hover': {
            backgroundColor: 'primary.dark',
        }
    },
    chipContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        mb: 2
    },
    selectedItems: {
        mt: 2,
        p: 1.5,
        borderRadius: 1,
        backgroundColor: alpha('#f5f5f5', 0.7),
        border: '1px solid #e0e0e0'
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
            borderBottom: 'none'
        }
    },
    switch: {
        mt: 1,
        mb: 2
    },
    toggleGroup: {
        display: 'flex',
        flexDirection: 'column',
        mb: 2
    }
}; 